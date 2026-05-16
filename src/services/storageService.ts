import AsyncStorage from '@react-native-async-storage/async-storage'
import { UserLocation } from '@/types/schedule'
import { Language } from '@/i18n/translations'

const KEY = 'user_location'
const LANG_KEY = 'user_language'
const TIMES_KEY = 'notification_times'

export type NotificationTimes = {
  eveningEnabled: boolean
  eveningHour: number
  eveningMinute: number
  morningEnabled: boolean
  morningHour: number
  morningMinute: number
}

export async function saveLocation(location: UserLocation): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(location))
}

export async function loadLocation(): Promise<UserLocation | null> {
  const raw = await AsyncStorage.getItem(KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as UserLocation
  } catch {
    return null
  }
}

export async function clearLocation(): Promise<void> {
  await AsyncStorage.removeItem(KEY)
}

export async function saveNotificationTimes(times: NotificationTimes): Promise<void> {
  await AsyncStorage.setItem(TIMES_KEY, JSON.stringify(times))
}

export async function loadNotificationTimes(): Promise<NotificationTimes | null> {
  const raw = await AsyncStorage.getItem(TIMES_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (typeof parsed.eveningHour === 'number' && typeof parsed.morningHour === 'number') {
      return {
        eveningEnabled: parsed.eveningEnabled ?? true,
        eveningHour:    parsed.eveningHour,
        eveningMinute:  parsed.eveningMinute ?? 0,
        morningEnabled: parsed.morningEnabled ?? true,
        morningHour:    parsed.morningHour,
        morningMinute:  parsed.morningMinute ?? 0,
      }
    }
    return null
  } catch {
    return null
  }
}

export async function saveLanguage(lang: Language): Promise<void> {
  await AsyncStorage.setItem(LANG_KEY, lang)
}

export async function loadLanguage(): Promise<Language | null> {
  const raw = await AsyncStorage.getItem(LANG_KEY)
  if (raw === 'ja' || raw === 'en') return raw
  return null
}
