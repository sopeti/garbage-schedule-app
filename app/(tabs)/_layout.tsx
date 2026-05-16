import { Tabs } from 'expo-router'
import { Text } from 'react-native'
import { useLanguage } from '@/contexts/LanguageContext'

export default function TabsLayout() {
  const { lang, t } = useLanguage()
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4a9e5c',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: { borderTopColor: '#eee' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: lang === 'ja' ? 'ごみカレンダー' : 'Schedule',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🗓</Text>,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t.locationSettings,
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>⚙️</Text>,
        }}
      />
    </Tabs>
  )
}
