import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import * as Notifications from 'expo-notifications'
import { UserLocation } from '@/types/schedule'
import { loadLocation, saveLocation, clearLocation, loadNotificationTimes, saveNotificationTimes, loadLanguage, NotificationTimes } from '@/services/storageService'
import { scheduleNotificationsForLocation } from '@/services/notificationService'
import { useLanguage } from '@/contexts/LanguageContext'

const DEFAULT_TIMES: NotificationTimes = { eveningEnabled: true, eveningHour: 20, eveningMinute: 0, morningEnabled: true, morningHour: 7, morningMinute: 0 }

type LocationContextType = {
  location: UserLocation | null
  loading: boolean
  notificationTimes: NotificationTimes
  setLocation: (loc: UserLocation) => Promise<void>
  saveAddressOnly: (loc: UserLocation) => Promise<void>
  clearLocation: () => Promise<void>
  setNotificationTimes: (times: NotificationTimes) => Promise<void>
}

const LocationContext = createContext<LocationContextType>({
  location: null,
  loading: true,
  notificationTimes: DEFAULT_TIMES,
  setLocation: async () => {},
  saveAddressOnly: async () => {},
  clearLocation: async () => {},
  setNotificationTimes: async () => {},
})

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocationState] = useState<UserLocation | null>(null)
  const [loading, setLoading] = useState(true)
  const [notificationTimes, setNotificationTimesState] = useState<NotificationTimes>(DEFAULT_TIMES)
  const { lang } = useLanguage()

  useEffect(() => {
    Promise.all([loadLocation(), loadNotificationTimes(), loadLanguage()]).then(async ([loc, times, savedLang]) => {
      setLocationState(loc)
      if (times) setNotificationTimesState(times)
      setLoading(false)
      if (loc) {
        const { status } = await Notifications.getPermissionsAsync()
        if (status === 'granted') {
          scheduleNotificationsForLocation(
            loc,
            savedLang ?? 'ja',
            times ?? DEFAULT_TIMES,
          ).catch(() => {})
        }
      }
    })
  }, [])

  const setLocation = useCallback(async (loc: UserLocation) => {
    await saveLocation(loc)
    await scheduleNotificationsForLocation(loc, lang, notificationTimes)
    setLocationState(loc)
  }, [lang, notificationTimes])

  const saveAddressOnly = useCallback(async (loc: UserLocation) => {
    await saveLocation(loc)
    setLocationState(loc)
  }, [])

  const clear = useCallback(async () => {
    await clearLocation()
    setLocationState(null)
  }, [])

  const setNotificationTimes = useCallback(async (times: NotificationTimes) => {
    await saveNotificationTimes(times)
    setNotificationTimesState(times)
    if (location) {
      const { status } = await Notifications.getPermissionsAsync()
      if (status === 'granted') {
        await scheduleNotificationsForLocation(location, lang, times)
      }
    }
  }, [location, lang])

  return (
    <LocationContext.Provider value={{ location, loading, notificationTimes, setLocation, saveAddressOnly, clearLocation: clear, setNotificationTimes }}>
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  return useContext(LocationContext)
}
