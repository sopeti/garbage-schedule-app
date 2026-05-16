import React, { useState } from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { getAllMunicipalities } from '@/data/municipalities'
import { useLocation } from '@/hooks/useLocation'
import { requestPermissions } from '@/services/notificationService'
import { UserLocation } from '@/types/schedule'
import { useLanguage } from '@/contexts/LanguageContext'
import { Language } from '@/i18n/translations'
import * as Haptics from 'expo-haptics'

function hapticLight() {
  if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
}

export default function OnboardingScreen() {
  const { setLocation } = useLocation()
  const { lang, t, setLang } = useLanguage()
  const municipalities = getAllMunicipalities()
  const [selectedMuni, setSelectedMuni] = useState('')
  const [selectedArea, setSelectedArea] = useState('')

  const currentMuni = municipalities.find(m => m.code === selectedMuni)

  async function handleStart() {
    if (!selectedMuni || !selectedArea) return
    await requestPermissions()
    const loc: UserLocation = { municipalityCode: selectedMuni, areaId: selectedArea }
    await setLocation(loc)
    router.replace('/')
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.langRow}>
          {(['ja', 'en'] as Language[]).map(l => (
            <Pressable
              key={l}
              style={[styles.langBtn, lang === l && styles.langBtnActive]}
              onPress={() => setLang(l)}
            >
              <Text style={[styles.langBtnText, lang === l && styles.langBtnTextActive]}>
                {l === 'ja' ? '日本語' : 'English'}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.headline}>{t.headline}</Text>
        <Text style={styles.sub}>{t.subtitle}</Text>

        <Text style={styles.sectionLabel}>{t.selectMunicipality}</Text>
        <View style={styles.optionGroup}>
          {municipalities.map(m => (
            <Pressable
              key={m.code}
              style={[styles.option, selectedMuni === m.code && styles.optionSelected]}
              onPress={() => { hapticLight(); setSelectedMuni(m.code); setSelectedArea('') }}
            >
              <Text style={[styles.optionText, selectedMuni === m.code && styles.optionTextSelected]}>
                {lang === 'en' ? `${m.prefectureEn} · ${m.nameEn}` : `${m.prefecture}　${m.name}`}
              </Text>
              {selectedMuni === m.code && <Text style={styles.check}>✓</Text>}
            </Pressable>
          ))}
        </View>

        {currentMuni && (
          <>
            <Text style={styles.sectionLabel}>{t.selectArea}</Text>
            <View style={styles.optionGroup}>
              {currentMuni.areas.map(area => (
                <Pressable
                  key={area.id}
                  style={[styles.option, selectedArea === area.id && styles.optionSelected]}
                  onPress={() => { hapticLight(); setSelectedArea(area.id) }}
                >
                  <Text style={[styles.optionText, selectedArea === area.id && styles.optionTextSelected]}>
                    {lang === 'en' ? (area.nameRoman ?? area.name) : area.name}
                  </Text>
                  {selectedArea === area.id && <Text style={styles.check}>✓</Text>}
                </Pressable>
              ))}
            </View>
          </>
        )}

        <Pressable
          style={[styles.startBtn, (!selectedMuni || !selectedArea) && styles.startBtnDisabled]}
          onPress={handleStart}
          disabled={!selectedMuni || !selectedArea}
        >
          <Text style={styles.startBtnText}>{t.saveAddress}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f9f7' },
  scroll: { padding: 24, paddingBottom: 60 },

  langRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  langBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  langBtnActive: { borderColor: '#4a9e5c', backgroundColor: '#f0faf2' },
  langBtnText: { fontSize: 14, fontWeight: '600', color: '#aaa' },
  langBtnTextActive: { color: '#4a9e5c' },

  headline: { fontSize: 38, fontWeight: '900', color: '#1a1a1a', lineHeight: 46, marginTop: 16, marginBottom: 12 },
  sub: { fontSize: 15, color: '#666', lineHeight: 22, marginBottom: 32 },
  sectionLabel: { fontSize: 12, fontWeight: '600', color: '#888', marginBottom: 8, marginTop: 20, textTransform: 'uppercase', letterSpacing: 0.5 },
  optionGroup: { borderRadius: 14, overflow: 'hidden', backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  option: { flexDirection: 'row', alignItems: 'flex-start', padding: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#eee' },
  optionSelected: { backgroundColor: '#f0faf2' },
  optionText: { flex: 1, fontSize: 15, color: '#1a1a1a' },
  optionTextSelected: { color: '#4a9e5c', fontWeight: '600' },
  check: { color: '#4a9e5c', fontWeight: '700', fontSize: 16, marginTop: 1 },
  startBtn: { marginTop: 36, backgroundColor: '#4a9e5c', borderRadius: 14, padding: 20, alignItems: 'center' },
  startBtnDisabled: { backgroundColor: '#b2d8b9' },
  startBtnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
})
