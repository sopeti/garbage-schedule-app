import { GarbageCategory } from '@/types/schedule'

export type Language = 'ja' | 'en'

export type Translations = {
  weekdays: string[]
  months: string[]
  loading: string
  today: string
  tomorrow: string
  noCollection: string
  putOutBy8: string
  selectAreaHint: string
  upcomingSchedule: string
  locationSettings: string
  municipality: string
  prefecture: string
  area: string
  saveAddress: string
  addressSaved: string
  notifications: string
  enableNotifications: string
  disableNotifications: string
  notifStatusOn: string
  notifStatusOff: string
  pleaseSelectArea: string
  notificationsBlocked: string
  enableInSettings: string
  saved: string
  notificationsScheduled: string
  reminderTimes: string
  eveningBefore: string
  morningOf: string
  language: string
  headline: string
  subtitle: string
  selectMunicipality: string
  selectArea: string
  getStarted: string
  categories: Record<GarbageCategory, string>
  notifEveningTitle: (label: string) => string
  notifEveningBody: (emoji: string) => string
  notifMorningTitle: (label: string) => string
  notifMorningBody: (emoji: string) => string
}

const ja: Translations = {
  weekdays: ['日', '月', '火', '水', '木', '金', '土'],
  months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  loading: '読み込み中…',
  today: '今日',
  tomorrow: '明日',
  noCollection: 'ごみの日ではありません',
  putOutBy8: '8時までに出す',
  selectAreaHint: '設定で地域を選択してください',
  upcomingSchedule: '今後のスケジュール',
  locationSettings: '設定',
  municipality: '自治体',
  prefecture: '都道府県',
  area: '地区・町名',
  saveAddress: '住所を保存',
  addressSaved: '住所を保存しました',
  notifications: '通知',
  enableNotifications: '通知を有効にする',
  disableNotifications: '通知をオフにする',
  notifStatusOn: '通知はオンです',
  notifStatusOff: '通知がオフです',
  pleaseSelectArea: '地域を選択してください',
  notificationsBlocked: '通知が許可されていません',
  enableInSettings: '設定から通知を許可してください',
  saved: '保存しました',
  notificationsScheduled: '通知がスケジュールされました',
  reminderTimes: 'リマインダー時刻',
  eveningBefore: '前の晩',
  morningOf: '当日朝',
  language: '言語',
  headline: 'ゴミ出し\nカレンダー',
  subtitle: 'あなたの地区を選ぶと、毎日ごみの日をお知らせします。',
  selectMunicipality: '自治体を選ぶ',
  selectArea: '地区・町名を選ぶ',
  getStarted: 'はじめる',
  categories: {
    burnable:          '燃やすごみ',
    non_burnable:      '燃やさないごみ',
    plastic:           'プラスチック',
    cans:              '缶類',
    bottles_glass:     'びん・ガラス',
    cardboard:         '段ボール・古紙',
    paper:             '新聞・雑誌',
    bulky:             '粗大ごみ',
    small_electronics: '小型家電',
    spray_cans:        'スプレー缶',
  },
  notifEveningTitle: (label) => `明日は${label}の日`,
  notifEveningBody:  (emoji) => `${emoji} 明日の朝8時までに出してください`,
  notifMorningTitle: (label) => `今日は${label}の日`,
  notifMorningBody:  (emoji) => `${emoji} 8時までに出してください`,
}

const en: Translations = {
  weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  loading: 'Loading…',
  today: 'Today',
  tomorrow: 'Tomorrow',
  noCollection: 'No collection today',
  putOutBy8: 'Put out by 8:00 AM',
  selectAreaHint: 'Select your area in Settings',
  upcomingSchedule: 'Upcoming Schedule',
  locationSettings: 'Settings',
  municipality: 'Municipality',
  prefecture: 'Prefecture',
  area: 'Area',
  saveAddress: 'Save Address',
  addressSaved: 'Address saved',
  notifications: 'Notifications',
  enableNotifications: 'Enable Notifications',
  disableNotifications: 'Disable Notifications',
  notifStatusOn: 'Notifications are on',
  notifStatusOff: 'Notifications are off',
  pleaseSelectArea: 'Please select an area',
  notificationsBlocked: 'Notifications not allowed',
  enableInSettings: 'Please enable notifications in Settings',
  saved: 'Saved',
  notificationsScheduled: 'Notifications scheduled',
  reminderTimes: 'Reminder Times',
  eveningBefore: 'Previous Evening',
  morningOf: 'Morning of collection',
  language: 'Language',
  headline: 'Garbage\nCalendar',
  subtitle: 'Select your area to get daily garbage collection reminders.',
  selectMunicipality: 'Select municipality',
  selectArea: 'Select area',
  getStarted: 'Get Started',
  categories: {
    burnable:          'Burnable',
    non_burnable:      'Non-burnable',
    plastic:           'Plastic',
    cans:              'Cans',
    bottles_glass:     'Bottles & Glass',
    cardboard:         'Cardboard',
    paper:             'Paper',
    bulky:             'Bulky Items',
    small_electronics: 'Small Electronics',
    spray_cans:        'Spray Cans',
  },
  notifEveningTitle: (label) => `Tomorrow: ${label}`,
  notifEveningBody:  (emoji) => `${emoji} Put out by 8:00 AM tomorrow`,
  notifMorningTitle: (label) => `Today: ${label}`,
  notifMorningBody:  (emoji) => `${emoji} Put out by 8:00 AM`,
}

export const translations: Record<Language, Translations> = { ja, en }
