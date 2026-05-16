import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { GarbageCategory } from '@/types/schedule'
import { useLanguage } from '@/contexts/LanguageContext'

const EMOJI: Record<GarbageCategory, string> = {
  burnable:          '🔥',
  non_burnable:      '🗑️',
  plastic:           '♻️',
  cans:              '🥫',
  bottles_glass:     '🍶',
  cardboard:         '📦',
  paper:             '📰',
  bulky:             '🛋️',
  small_electronics: '📱',
  spray_cans:        '💨',
}

export const CATEGORY_COLORS: Record<GarbageCategory, { bg: string; text: string; accent: string }> = {
  burnable:          { bg: '#fff7ed', text: '#c2410c', accent: '#fb923c' },
  non_burnable:      { bg: '#f8fafc', text: '#475569', accent: '#94a3b8' },
  plastic:           { bg: '#f0f9ff', text: '#0369a1', accent: '#38bdf8' },
  cans:              { bg: '#fefce8', text: '#a16207', accent: '#eab308' },
  bottles_glass:     { bg: '#ecfeff', text: '#0e7490', accent: '#22d3ee' },
  cardboard:         { bg: '#fef9ee', text: '#92400e', accent: '#d97706' },
  paper:             { bg: '#f5f5f4', text: '#57534e', accent: '#a8a29e' },
  bulky:             { bg: '#f5f3ff', text: '#7c3aed', accent: '#a78bfa' },
  small_electronics: { bg: '#eef2ff', text: '#4338ca', accent: '#818cf8' },
  spray_cans:        { bg: '#fff1f2', text: '#be123c', accent: '#fb7185' },
}

export function CategoryBadge({ category, size }: { category: GarbageCategory; size: 'sm' | 'lg' }) {
  const { t } = useLanguage()
  const { bg, text, accent } = CATEGORY_COLORS[category]
  const emoji = EMOJI[category]
  const label = t.categories[category]

  if (size === 'lg') {
    return (
      <View style={[styles.lg, { backgroundColor: bg, borderColor: accent }]}>
        <Text style={styles.lgEmoji}>{emoji}</Text>
        <Text style={[styles.lgLabel, { color: text }]}>{label}</Text>
      </View>
    )
  }

  return (
    <View style={[styles.sm, { backgroundColor: bg, borderColor: accent + '99' }]}>
      <Text style={styles.smEmoji}>{emoji}</Text>
      <Text style={[styles.smLabel, { color: text }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  sm: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  smEmoji: { fontSize: 13 },
  smLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 0.1 },

  lg: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 28,
    borderWidth: 1.5,
  },
  lgEmoji: { fontSize: 24 },
  lgLabel: { fontSize: 16, fontWeight: '800', letterSpacing: -0.3 },
})
