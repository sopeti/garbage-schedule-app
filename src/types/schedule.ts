// Core domain types — generic across all Japan municipalities

export type GarbageCategory =
  | 'burnable'
  | 'non_burnable'
  | 'plastic'
  | 'cans'
  | 'bottles_glass'
  | 'cardboard'
  | 'paper'
  | 'bulky'
  | 'small_electronics'
  | 'spray_cans'

export type WeekDay =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday'

// Weekly = every week on those days
// nth_weekday = e.g. 1st Monday, 3rd Wednesday
// nth_weekdays = e.g. 1st & 3rd Friday (common for non-burnable in Tokyo wards)
// biweekly = every other week (common for cans/bottles in Japan)
export type ScheduleRule =
  | { type: 'weekly'; days: WeekDay[] }
  | { type: 'nth_weekday'; n: number; day: WeekDay }
  | { type: 'nth_weekdays'; ns: number[]; day: WeekDay }
  | { type: 'biweekly'; day: WeekDay; startWeek: 'odd' | 'even' }
  | { type: 'by_appointment' }
  | { type: 'none' }

export type CategorySchedule = {
  rule: ScheduleRule
  pickupStart?: string  // e.g. "08:00" — put out before this time
  notes?: string
}

export type Area = {
  id: string
  name: string         // Japanese
  nameRoman?: string   // Romaji for search
  schedule: Partial<Record<GarbageCategory, CategorySchedule>>
}

export type Municipality = {
  code: string         // JIS 5-digit municipality code
  prefecture: string   // e.g. "東京都"
  prefectureEn: string // e.g. "Tokyo"
  name: string         // e.g. "江戸川区"
  nameEn: string       // e.g. "Edogawa Ward"
  dataVersion: string  // "YYYY-MM" — schedule valid from
  sourceUrl?: string
  areas: Area[]
}

// Resolved: what category fires on a given date
export type CollectionEvent = {
  category: GarbageCategory
  municipalityCode: string
  areaId: string
}

// User's saved location preference
export type UserLocation = {
  municipalityCode: string
  areaId: string
}
