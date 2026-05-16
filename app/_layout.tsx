import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { LocationProvider } from '@/contexts/LocationContext'
import '../src/services/notificationService'  // register notification handler at startup

export default function RootLayout() {
  return (
    <LanguageProvider>
      <LocationProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="onboarding" options={{ presentation: 'modal' }} />
        </Stack>
      </LocationProvider>
    </LanguageProvider>
  )
}
