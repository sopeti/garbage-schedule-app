import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import {
  View, Text, FlatList, StyleSheet, ListRenderItemInfo,
  RefreshControl, Animated,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useLocation } from '@/hooks/useLocation'
import { getCollectionsForDate } from '@/services/scheduleService'
import { getMunicipality } from '@/data/municipalities'
import { CategoryBadge, CATEGORY_COLORS } from '@/components/CategoryBadge'
import { GarbageCategory } from '@/types/schedule'
import { useLanguage } from '@/contexts/LanguageContext'

const BATCH = 14

function addDays(d: Date, n: number): Date {
  const r = new Date(d)
  r.setDate(d.getDate() + n)
  return r
}

function formatDateLabel(date: Date, lang: string, weekdays: string[], months: string[]): string {
  const wd = weekdays[date.getDay()]
  if (lang === 'en') return `${months[date.getMonth()]} ${date.getDate()} · ${wd}`
  return `${months[date.getMonth()]}${date.getDate()}日（${wd}）`
}

type CalendarItem =
  | { kind: 'month'; key: string; label: string }
  | { kind: 'day'; key: string; date: Date }

function buildCalendarItems(days: Date[], lang: string, weekdays: string[], months: string[]): CalendarItem[] {
  const items: CalendarItem[] = []
  let lastMonth = -1
  for (const d of days) {
    if (d.getMonth() !== lastMonth) {
      lastMonth = d.getMonth()
      const label = lang === 'en'
        ? `${months[d.getMonth()]} ${d.getFullYear()}`
        : `${d.getFullYear()}年 ${months[d.getMonth()]}`
      items.push({ kind: 'month', key: `m-${d.getFullYear()}-${d.getMonth()}`, label })
    }
    items.push({ kind: 'day', key: d.toISOString(), date: d })
  }
  return items
}

function SkeletonBlock({ width, height, style }: { width: number | string; height: number; style?: object }) {
  const pulse = useRef(new Animated.Value(0.4)).current
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ])
    ).start()
  }, [pulse])
  return (
    <Animated.View
      style={[{ width, height, borderRadius: 8, backgroundColor: '#e2e8e2', opacity: pulse }, style]}
    />
  )
}

function SkeletonScreen() {
  return (
    <View style={styles.skeletonContainer}>
      <SkeletonBlock width={120} height={12} style={{ marginBottom: 6 }} />
      <SkeletonBlock width={200} height={22} style={{ marginBottom: 32 }} />
      <SkeletonBlock width={60} height={10} style={{ marginBottom: 14 }} />
      <View style={styles.skeletonCard}>
        <SkeletonBlock width="60%" height={18} style={{ marginBottom: 12 }} />
        <SkeletonBlock width="100%" height={64} style={{ borderRadius: 14 }} />
      </View>
      <SkeletonBlock width={60} height={10} style={{ marginBottom: 14, marginTop: 28 }} />
      <View style={styles.skeletonCard}>
        <SkeletonBlock width="60%" height={18} style={{ marginBottom: 12 }} />
        <SkeletonBlock width="100%" height={64} style={{ borderRadius: 14 }} />
      </View>
    </View>
  )
}

function FadeInView({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const opacity = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(12)).current
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 350, delay, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 350, delay, useNativeDriver: true }),
    ]).start()
  }, [opacity, translateY, delay])
  return <Animated.View style={{ opacity, transform: [{ translateY }] }}>{children}</Animated.View>
}

function CollectionCard({ category, putOutBy8, accent }: {
  category: GarbageCategory
  putOutBy8: string
  accent: boolean
}) {
  const { bg, accent: accentColor } = CATEGORY_COLORS[category]
  return (
    <View style={[styles.collectionCard, { backgroundColor: accent ? bg : '#fafafa', borderLeftColor: accentColor }]}>
      <CategoryBadge category={category} size="lg" />
      <Text style={styles.pickupTime}>{putOutBy8}</Text>
    </View>
  )
}

function DaySection({ label, date, municipalityCode, areaId, accent, putOutBy8, isPast, delay }: {
  label: string
  date: Date
  municipalityCode: string
  areaId: string
  accent: boolean
  putOutBy8: string
  isPast?: boolean
  delay?: number
}) {
  const { lang, t } = useLanguage()
  const events = getCollectionsForDate(municipalityCode, areaId, date)
  const dateStr = formatDateLabel(date, lang, t.weekdays, t.months)

  return (
    <FadeInView delay={delay}>
      <View style={[styles.section, isPast && styles.sectionPast]}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            {accent && <View style={styles.sectionAccentDot} />}
            <Text style={[styles.sectionLabel, accent ? styles.sectionLabelAccent : styles.sectionLabelMuted]}>
              {label}
            </Text>
          </View>
          <Text style={styles.sectionDate}>{dateStr}</Text>
        </View>
        {events.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>✨</Text>
            <Text style={styles.emptyText}>{t.noCollection}</Text>
          </View>
        ) : (
          <View style={styles.cardGrid}>
            {events.map(e => (
              <CollectionCard
                key={e.category}
                category={e.category as GarbageCategory}
                putOutBy8={putOutBy8}
                accent={accent}
              />
            ))}
          </View>
        )}
      </View>
    </FadeInView>
  )
}

export default function HomeScreen() {
  const { location, loading } = useLocation()
  const { lang, t } = useLanguage()
  const [daysShown, setDaysShown] = useState(BATCH)
  const [refreshing, setRefreshing] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [refreshKey])

  useEffect(() => {
    if (!loading && !location) router.replace('/onboarding')
  }, [loading, location])

  const calendarDays = useMemo(
    () => Array.from({ length: daysShown }, (_, i) => addDays(today, i + 2)),
    [daysShown, today],
  )

  const calendarItems = useMemo(
    () => buildCalendarItems(calendarDays, lang, t.weekdays, t.months),
    [calendarDays, lang, t.weekdays, t.months],
  )

  const loadMore = useCallback(() => setDaysShown(prev => prev + BATCH), [])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    setRefreshKey(k => k + 1)
    setTimeout(() => setRefreshing(false), 600)
  }, [])

  if (loading) return (
    <SafeAreaView style={styles.container}>
      <SkeletonScreen />
    </SafeAreaView>
  )

  if (!location) return null

  const municipality = getMunicipality(location.municipalityCode)
  const area = municipality?.areas.find(a => a.id === location.areaId)
  const todayPast = new Date().getHours() >= 8

  const locationLine = lang === 'en'
    ? `${municipality?.prefectureEn} · ${municipality?.nameEn}`
    : `${municipality?.prefecture} ${municipality?.name}`
  const areaLine = lang === 'en' ? (area?.nameRoman ?? area?.name) : area?.name

  const renderItem = ({ item }: ListRenderItemInfo<CalendarItem>) => {
    if (item.kind === 'month') {
      return <Text style={styles.monthHeader}>{item.label}</Text>
    }
    const events = getCollectionsForDate(location.municipalityCode, location.areaId, item.date)
    const isSun = item.date.getDay() === 0
    const isSat = item.date.getDay() === 6
    return (
      <View style={styles.row}>
        <View style={styles.dayCol}>
          <Text style={[styles.weekday, isSun && styles.weekdaySun, isSat && styles.weekdaySat]}>
            {t.weekdays[item.date.getDay()]}
          </Text>
          <Text style={styles.dayNum}>{item.date.getDate()}</Text>
        </View>
        <View style={styles.badgeCol}>
          {events.length === 0 ? (
            <Text style={styles.noneText}>—</Text>
          ) : (
            events.map(e => (
              <CategoryBadge key={e.category} category={e.category as GarbageCategory} size="sm" />
            ))
          )}
        </View>
      </View>
    )
  }

  const header = (
    <View>
      <FadeInView delay={0}>
        <View style={styles.locationHeader}>
          <Text style={styles.locationMuni}>{locationLine}</Text>
          <Text style={styles.locationArea}>{areaLine}</Text>
        </View>
      </FadeInView>

      <DaySection
        label={t.today}
        date={today}
        municipalityCode={location.municipalityCode}
        areaId={location.areaId}
        accent={true}
        putOutBy8={t.putOutBy8}
        isPast={todayPast}
        delay={80}
      />

      <DaySection
        label={t.tomorrow}
        date={addDays(today, 1)}
        municipalityCode={location.municipalityCode}
        areaId={location.areaId}
        accent={false}
        putOutBy8={t.putOutBy8}
        delay={160}
      />

      <FadeInView delay={220}>
        <Text style={styles.comingUpLabel}>{lang === 'ja' ? '今後' : 'COMING UP'}</Text>
      </FadeInView>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={calendarItems}
        keyExtractor={item => item.key}
        renderItem={renderItem}
        ListHeaderComponent={header}
        ListFooterComponent={<View style={{ height: 40 }} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4a9e5c"
            colors={['#4a9e5c']}
          />
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f8f7' },
  list: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 48 },

  skeletonContainer: { padding: 20, paddingTop: 12 },
  skeletonCard: { backgroundColor: '#fff', borderRadius: 18, padding: 18 },

  locationHeader: { marginBottom: 28, marginTop: 8 },
  locationMuni: { fontSize: 12, color: '#3aa55c', fontWeight: '700', letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 3 },
  locationArea: { fontSize: 18, fontWeight: '800', color: '#111827', letterSpacing: -0.3 },

  section: { marginBottom: 32 },
  sectionPast: { opacity: 0.4 },
  sectionHeader: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionAccentDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#3aa55c' },
  sectionLabel: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  sectionLabelAccent: { color: '#111827' },
  sectionLabelMuted: { color: '#cbd5e1' },
  sectionDate: { fontSize: 13, color: '#94a3b8', fontWeight: '500' },

  emptyCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 32,
    alignItems: 'center', gap: 10,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 1,
  },
  emptyEmoji: { fontSize: 32 },
  emptyText: { color: '#cbd5e1', fontSize: 14, fontWeight: '500' },

  cardGrid: { gap: 12 },
  collectionCard: {
    borderRadius: 18, padding: 18, paddingLeft: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderLeftWidth: 4,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 }, elevation: 2,
  },
  pickupTime: { fontSize: 11, color: '#94a3b8', fontWeight: '600', letterSpacing: 0.3 },

  comingUpLabel: {
    fontSize: 11, fontWeight: '800', color: '#3aa55c',
    textTransform: 'uppercase', letterSpacing: 1.5,
    marginBottom: 10, marginTop: 4,
  },

  monthHeader: {
    fontSize: 11, fontWeight: '800', color: '#3aa55c',
    marginTop: 20, marginBottom: 10,
    textTransform: 'uppercase', letterSpacing: 1.5,
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 14,
    marginBottom: 8, padding: 14,
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  dayCol: { width: 44, alignItems: 'center', marginRight: 14 },
  weekday: { fontSize: 11, color: '#aaa', fontWeight: '600' },
  weekdaySun: { color: '#e74c3c' },
  weekdaySat: { color: '#2980b9' },
  dayNum: { fontSize: 24, fontWeight: '800', color: '#111827', letterSpacing: -0.5 },
  badgeCol: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  noneText: { color: '#ccc', fontSize: 16 },
})
