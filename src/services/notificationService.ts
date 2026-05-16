import * as Notifications from 'expo-notifications'
import { GarbageCategory, UserLocation } from '@/types/schedule'
import { Language, translations } from '@/i18n/translations'
import { getArea } from '@/data/municipalities'
import { getUpcomingDatesForCategory } from './scheduleService'
import { loadNotificationTimes, NotificationTimes } from './storageService'

const DAYS_AHEAD = 14

const CATEGORY_EMOJI: Record<GarbageCategory, string> = {
  burnable:         '🔥',
  non_burnable:     '🚫',
  plastic:          '♻️',
  cans:             '🥫',
  bottles_glass:    '🍶',
  cardboard:        '📦',
  paper:            '📰',
  bulky:            '🛋️',
  small_electronics:'📱',
  spray_cans:       '💨',
}

export async function requestPermissions(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync()
  return status === 'granted'
}

export async function scheduleNotificationsForLocation(
  location: UserLocation,
  language: Language = 'ja',
  times?: NotificationTimes,
): Promise<void> {
  const resolvedTimes = times ?? (await loadNotificationTimes()) ?? { eveningEnabled: true, eveningHour: 20, eveningMinute: 0, morningEnabled: true, morningHour: 7, morningMinute: 0 }

  await Notifications.cancelAllScheduledNotificationsAsync()

  const area = getArea(location.municipalityCode, location.areaId)
  if (!area) return

  const t = translations[language]
  const now = new Date()
  const categories = Object.keys(area.schedule) as GarbageCategory[]

  for (const category of categories) {
    const upcoming = getUpcomingDatesForCategory(
      location.municipalityCode,
      location.areaId,
      category,
      now,
      DAYS_AHEAD,
    )
    const label = t.categories[category]
    const emoji = CATEGORY_EMOJI[category]

    for (const collectionDate of upcoming) {
      await schedulePair(t, label, emoji, collectionDate, resolvedTimes)
    }
  }
}

async function schedulePair(
  t: typeof translations['ja'],
  label: string,
  emoji: string,
  collectionDate: Date,
  times: NotificationTimes,
): Promise<void> {
  if (times.eveningEnabled !== false) {
    const evening = new Date(collectionDate)
    evening.setDate(evening.getDate() - 1)
    evening.setHours(times.eveningHour, times.eveningMinute, 0, 0)
    if (evening > new Date()) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: t.notifEveningTitle(label),
          body: t.notifEveningBody(emoji),
          sound: true,
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: evening },
      })
    }
  }

  if (times.morningEnabled !== false) {
    const morning = new Date(collectionDate)
    morning.setHours(times.morningHour, times.morningMinute, 0, 0)
    if (morning > new Date()) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: t.notifMorningTitle(label),
          body: t.notifMorningBody(emoji),
          sound: true,
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: morning },
      })
    }
  }
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync()
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})
