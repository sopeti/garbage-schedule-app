import React, { useCallback, useEffect, useRef, useState } from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet, Alert, Platform, Modal, Dimensions, Switch } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Notifications from 'expo-notifications'
import { useLocation } from '@/hooks/useLocation'
import { getAllMunicipalities } from '@/data/municipalities'
import { requestPermissions, cancelAllNotifications } from '@/services/notificationService'
import { UserLocation } from '@/types/schedule'
import { useLanguage } from '@/contexts/LanguageContext'
import { Language } from '@/i18n/translations'

type NotifStatus = 'on' | 'off'

// ── Design tokens ────────────────────────────────────────────────
const C = {
  green:   '#3aa55c',
  greenT:  '#e8f6ec',
  greenD:  '#bfe0c8',
  red:     '#e25d4f',
  redT:    '#fdecea',
  redD:    '#f0bdb6',
  ink:     '#14171c',
  text:    '#3a3f47',
  muted:   '#8a8f99',
  hint:    '#b1b5bd',
  border:  '#eceef0',
  card:    '#ffffff',
  bg:      '#f4f6f4',
}

const RADIUS = { card: 16, btn: 14, pill: 12 }

const SHADOW = {
  shadowColor: '#000',
  shadowOpacity: 0.05,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 3 },
  elevation: 2,
}

export default function SettingsScreen() {
  const { location, setLocation, saveAddressOnly, notificationTimes, setNotificationTimes } = useLocation()
  const { lang, t, setLang } = useLanguage()
  const municipalities = getAllMunicipalities()
  const [selectedMuni, setSelectedMuni] = useState(location?.municipalityCode ?? '')
  const [selectedArea, setSelectedArea] = useState(location?.areaId ?? '')
  const [selectedPrefecture, setSelectedPrefecture] = useState(location ? (municipalities.find(m => m.code === location.municipalityCode)?.prefecture ?? '') : '')
  const [notifStatus, setNotifStatus] = useState<NotifStatus>('off')
  const [showPicker, setShowPicker] = useState<'evening' | 'morning' | null>(null)
  const [draftDate, setDraftDate] = useState<Date>(new Date())
  const initialized = useRef(false)

  function timeToDate(hour: number, minute: number): Date {
    const d = new Date()
    d.setHours(hour, minute, 0, 0)
    return d
  }

  function openPicker(which: 'evening' | 'morning') {
    const rawH = which === 'evening' ? notificationTimes.eveningHour : notificationTimes.morningHour
    const rawM = which === 'evening' ? notificationTimes.eveningMinute : notificationTimes.morningMinute
    const { minH, minM, maxH, maxM } = which === 'evening'
      ? { minH: 17, minM: 0, maxH: 23, maxM: 0 }
      : { minH: 4,  minM: 0, maxH: 8,  maxM: 0 }
    const total  = rawH * 60 + rawM
    const minTot = minH * 60 + minM
    const maxTot = maxH * 60 + maxM
    const clamped = Math.max(minTot, Math.min(maxTot, total))
    setDraftDate(timeToDate(Math.floor(clamped / 60), clamped % 60))
    setShowPicker(which)
  }

  function commitPicker() {
    const h = draftDate.getHours()
    const m = draftDate.getMinutes()
    if (showPicker === 'evening') {
      setNotificationTimes({ ...notificationTimes, eveningHour: h, eveningMinute: m })
    } else {
      setNotificationTimes({ ...notificationTimes, morningHour: h, morningMinute: m })
    }
    setShowPicker(null)
  }

  useEffect(() => {
    if (location && !initialized.current) {
      initialized.current = true
      const muni = municipalities.find(m => m.code === location.municipalityCode)
      setSelectedPrefecture(muni?.prefecture ?? '')
      setSelectedMuni(location.municipalityCode)
      setSelectedArea(location.areaId)
    }
  }, [location])

  const refreshNotifStatus = useCallback(async () => {
    const { status } = await Notifications.getPermissionsAsync()
    if (status !== 'granted') { setNotifStatus('off'); return }
    const scheduled = await Notifications.getAllScheduledNotificationsAsync()
    setNotifStatus(scheduled.length > 0 ? 'on' : 'off')
  }, [])

  useEffect(() => { refreshNotifStatus() }, [refreshNotifStatus])

  const prefectures = municipalities.reduce<{ name: string; nameEn: string }[]>((acc, m) => {
    if (!acc.find(p => p.name === m.prefecture)) acc.push({ name: m.prefecture, nameEn: m.prefectureEn })
    return acc
  }, [])
  const muniForPrefecture = municipalities.filter(m => m.prefecture === selectedPrefecture)
  const currentMuni = municipalities.find(m => m.code === selectedMuni)
  const selectionChanged =
    selectedMuni !== (location?.municipalityCode ?? '') ||
    selectedArea !== (location?.areaId ?? '')
  const hasValidSelection = !!selectedPrefecture && !!selectedMuni && !!selectedArea
  const canSave = hasValidSelection && selectionChanged
  const canNotify = hasValidSelection || notifStatus === 'on'

  async function handleSaveAddress() {
    const loc: UserLocation = { municipalityCode: selectedMuni, areaId: selectedArea }
    await saveAddressOnly(loc)
    Alert.alert(t.addressSaved)
  }

  async function handleNotificationToggle() {
    if (notifStatus === 'on') {
      await cancelAllNotifications()
      await refreshNotifStatus()
    } else {
      if (!hasValidSelection) { Alert.alert(t.pleaseSelectArea); return }
      const granted = await requestPermissions()
      if (!granted) { Alert.alert(t.notificationsBlocked, t.enableInSettings); return }
      const loc: UserLocation = { municipalityCode: selectedMuni, areaId: selectedArea }
      await setLocation(loc)
      await refreshNotifStatus()
      Alert.alert(t.saved, t.notificationsScheduled)
    }
  }

  const isOn      = notifStatus === 'on'
  const statusBg    = isOn ? C.greenT : C.redT
  const statusInk   = isOn ? C.green  : C.red
  const statusIcon  = isOn ? '🔔' : '🔕'
  const statusLabel = isOn ? t.notifStatusOn : t.notifStatusOff

  const pickerBounds = (() => {
    const min = new Date(draftDate)
    const max = new Date(draftDate)
    if (showPicker === 'evening') {
      min.setHours(17, 0, 0, 0)
      max.setHours(23, 0, 0, 0)
    } else {
      min.setHours(4, 0, 0, 0)
      max.setHours(8, 0, 0, 0)
    }
    return { min, max }
  })()

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Hero ── */}
        <View style={styles.hero}>
          <View style={styles.heroAccent} />
          <Text style={styles.heroTitle}>{t.locationSettings}</Text>
        </View>

        {/* ── Language ── */}
        <Text style={styles.sectionLabel}>{t.language}</Text>
        <View style={styles.segment}>
          {(['ja', 'en'] as Language[]).map(l => (
            <Pressable
              key={l}
              style={[styles.segBtn, lang === l && styles.segBtnActive]}
              onPress={() => setLang(l)}
            >
              <Text style={[styles.segText, lang === l && styles.segTextActive]}>
                {l === 'ja' ? '日本語' : 'English'}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* ── Prefecture ── */}
        <Text style={styles.sectionLabel}>{t.prefecture}</Text>
        <View style={styles.card}>
          {prefectures.map((pref, i) => {
            const active = selectedPrefecture === pref.name
            return (
              <Pressable
                key={pref.name}
                style={[styles.row, i > 0 && styles.rowDivider, active && styles.rowActive]}
                onPress={() => { setSelectedPrefecture(pref.name); setSelectedMuni(''); setSelectedArea('') }}
              >
                <Text style={[styles.rowText, active && styles.rowTextActive]}>
                  {lang === 'en' ? pref.nameEn : pref.name}
                </Text>
                {active && <Text style={styles.check}>✓</Text>}
              </Pressable>
            )
          })}
        </View>

        {/* ── Municipality ── */}
        {selectedPrefecture !== '' && (
          <>
            <Text style={styles.sectionLabel}>{t.municipality}</Text>
            <View style={styles.card}>
              {muniForPrefecture.map((m, i) => {
                const active = selectedMuni === m.code
                return (
                  <Pressable
                    key={m.code}
                    style={[styles.row, i > 0 && styles.rowDivider, active && styles.rowActive]}
                    onPress={() => { setSelectedMuni(m.code); setSelectedArea('') }}
                  >
                    <Text style={[styles.rowText, active && styles.rowTextActive]}>
                      {lang === 'en' ? m.nameEn : m.name}
                    </Text>
                    {active && <Text style={styles.check}>✓</Text>}
                  </Pressable>
                )
              })}
            </View>
          </>
        )}

        {/* ── Area ── */}
        {currentMuni && (
          <>
            <Text style={styles.sectionLabel}>{t.area}</Text>
            <View style={styles.card}>
              {currentMuni.areas.map((area, i) => {
                const active = selectedArea === area.id
                return (
                  <Pressable
                    key={area.id}
                    style={[styles.row, i > 0 && styles.rowDivider, active && styles.rowActive]}
                    onPress={() => setSelectedArea(area.id)}
                  >
                    <Text style={[styles.rowText, active && styles.rowTextActive]}>
                      {lang === 'en' ? (area.nameRoman ?? area.name) : area.name}
                    </Text>
                    {active && <Text style={styles.check}>✓</Text>}
                  </Pressable>
                )
              })}
            </View>
          </>
        )}

        {/* ── Save ── */}
        <Pressable
          style={[styles.btn, styles.btnGreen, !canSave && styles.btnDisabled]}
          onPress={handleSaveAddress}
          disabled={!canSave}
        >
          <Text style={styles.btnText}>{t.saveAddress}</Text>
        </Pressable>

        {/* ── Notifications ── */}
        <Text style={[styles.sectionLabel, styles.sectionLabelLarge]}>{t.notifications}</Text>

        <View style={[styles.statusCard, { backgroundColor: statusBg }]}>
          <Text style={styles.statusIcon}>{statusIcon}</Text>
          <Text style={[styles.statusLabel, { color: statusInk }]}>{statusLabel}</Text>
        </View>

        <Text style={[styles.sectionLabel, { marginTop: 18 }]}>{t.reminderTimes}</Text>
        <View style={[styles.card, SHADOW]}>
          {/* Evening */}
          <View style={styles.slotRow}>
            <View style={styles.slotHeader}>
              <Text style={styles.timeRowIcon}>🌙</Text>
              <Text style={styles.timeRowLabel}>{t.eveningBefore}</Text>
              <Switch
                value={notificationTimes.eveningEnabled}
                onValueChange={(v) => setNotificationTimes({ ...notificationTimes, eveningEnabled: v })}
                trackColor={{ false: C.border, true: C.greenT }}
                thumbColor={notificationTimes.eveningEnabled ? C.green : C.hint}
              />
            </View>
            {notificationTimes.eveningEnabled && (
              <Pressable style={styles.slotTime} onPress={() => openPicker('evening')}>
                <Text style={styles.timeRowValue}>
                  {String(notificationTimes.eveningHour).padStart(2, '0')}:{String(notificationTimes.eveningMinute).padStart(2, '0')}
                </Text>
              </Pressable>
            )}
          </View>

          <View style={styles.rowDivider} />

          {/* Morning */}
          <View style={styles.slotRow}>
            <View style={styles.slotHeader}>
              <Text style={styles.timeRowIcon}>☀️</Text>
              <Text style={styles.timeRowLabel}>{t.morningOf}</Text>
              <Switch
                value={notificationTimes.morningEnabled}
                onValueChange={(v) => setNotificationTimes({ ...notificationTimes, morningEnabled: v })}
                trackColor={{ false: C.border, true: C.greenT }}
                thumbColor={notificationTimes.morningEnabled ? C.green : C.hint}
              />
            </View>
            {notificationTimes.morningEnabled && (
              <Pressable style={styles.slotTime} onPress={() => openPicker('morning')}>
                <Text style={styles.timeRowValue}>
                  {String(notificationTimes.morningHour).padStart(2, '0')}:{String(notificationTimes.morningMinute).padStart(2, '0')}
                </Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* ── Time picker modal ── */}
        <Modal
          visible={showPicker !== null}
          transparent
          animationType="slide"
          onRequestClose={() => setShowPicker(null)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setShowPicker(null)} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Pressable onPress={() => setShowPicker(null)}>
                <Text style={styles.modalCancel}>Cancel</Text>
              </Pressable>
              <Text style={styles.modalTitle}>
                {showPicker === 'evening' ? t.eveningBefore : t.morningOf}
              </Text>
              <Pressable onPress={commitPicker}>
                <Text style={styles.modalDone}>Done</Text>
              </Pressable>
            </View>
            <DateTimePicker
              mode="time"
              display="spinner"
              value={draftDate}
              themeVariant="light"
              textColor="#000000"
              minimumDate={pickerBounds.min}
              maximumDate={pickerBounds.max}
              onChange={(_, d) => { if (d) setDraftDate(d) }}
              style={{ width: Dimensions.get('window').width, height: 216, alignSelf: 'center' }}
            />
          </View>
        </Modal>

        <Pressable
          style={[
            styles.btn,
            isOn ? styles.btnRed : styles.btnGreen,
            !canNotify && (isOn ? styles.btnRedDisabled : styles.btnDisabled),
          ]}
          onPress={handleNotificationToggle}
          disabled={!canNotify}
        >
          <Text style={styles.btnText}>
            {isOn ? t.disableNotifications : t.enableNotifications}
          </Text>
        </Pressable>


      </ScrollView>
    </SafeAreaView>
  )
}

// ── Styles ───────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 56 },

  // Hero
  hero: { flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 28 },
  heroAccent: { width: 4, height: 28, backgroundColor: C.green, borderRadius: 2, marginRight: 12 },
  heroTitle: { fontSize: 28, fontWeight: '800', color: C.ink, letterSpacing: -0.5 },

  // Section label
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: C.muted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 24,
  },
  sectionLabelLarge: { marginTop: 36 },

  // Segmented control
  segment: {
    flexDirection: 'row',
    backgroundColor: C.card,
    borderRadius: RADIUS.btn,
    padding: 4,
    ...SHADOW,
  },
  segBtn: { flex: 1, paddingVertical: 11, alignItems: 'center', borderRadius: RADIUS.pill },
  segBtnActive: { backgroundColor: C.greenT },
  segText: { fontSize: 14, fontWeight: '600', color: C.muted },
  segTextActive: { color: C.green, fontWeight: '700' },

  // Card list
  card: { backgroundColor: C.card, borderRadius: RADIUS.card, overflow: 'hidden', ...SHADOW },
  row: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 15, paddingHorizontal: 18 },
  rowDivider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.border },
  rowActive: { backgroundColor: C.greenT },
  rowText: { flex: 1, fontSize: 15, color: C.text, fontWeight: '500' },
  rowTextActive: { color: C.green, fontWeight: '700' },
  check: { fontSize: 15, color: C.green, fontWeight: '800', marginLeft: 8, marginTop: 2 },

  // Buttons
  btn: {
    marginTop: 18,
    height: 54,
    borderRadius: RADIUS.btn,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW,
  },
  btnGreen: { backgroundColor: C.green },
  btnRed:   { backgroundColor: C.red },
  btnDisabled:    { backgroundColor: C.greenD, shadowOpacity: 0, elevation: 0 },
  btnRedDisabled: { backgroundColor: C.redD,   shadowOpacity: 0, elevation: 0 },
  btnText: { fontSize: 15, fontWeight: '700', color: '#fff', letterSpacing: 0.2 },

  // Time picker rows
  slotRow: { paddingVertical: 14, paddingHorizontal: 18 },
  slotHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  slotTime: {
    alignSelf: 'flex-start',
    marginTop: 10,
    marginLeft: 28,
    backgroundColor: C.greenT,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: RADIUS.pill,
  },
  timeRowIcon: { fontSize: 18 },
  timeRowLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: C.text },
  timeRowValue: { fontSize: 16, fontWeight: '700', color: C.green, fontVariant: ['tabular-nums'] },

  // Notification status card
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: RADIUS.card,
    gap: 12,
  },
  statusIcon: { fontSize: 22 },
  statusLabel: { flex: 1, fontSize: 15, fontWeight: '700', letterSpacing: 0.1 },

  // Time picker modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  modalSheet: {
    backgroundColor: C.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 36,
  },
  modalHandle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: C.border,
    alignSelf: 'center',
    marginTop: 10, marginBottom: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
  },
  modalTitle: { fontSize: 16, fontWeight: '700', color: C.ink },
  modalCancel: { fontSize: 16, color: C.muted, fontWeight: '500' },
  modalDone: { fontSize: 16, color: C.green, fontWeight: '700' },
})
