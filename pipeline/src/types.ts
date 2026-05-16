// Shared types for the pipeline — mirrors src/types/schedule.ts
// (kept separate so the pipeline has zero dependency on the app bundle)

export type GarbageCategory =
  | 'burnable' | 'non_burnable' | 'plastic' | 'cans'
  | 'bottles_glass' | 'cardboard' | 'paper' | 'bulky'
  | 'small_electronics' | 'spray_cans'

export type WeekDay =
  | 'monday' | 'tuesday' | 'wednesday' | 'thursday'
  | 'friday' | 'saturday' | 'sunday'

export type ScheduleRule =
  | { type: 'weekly'; days: WeekDay[] }
  | { type: 'nth_weekday'; n: number; day: WeekDay }
  | { type: 'biweekly'; day: WeekDay; startWeek: 'odd' | 'even' }
  | { type: 'by_appointment' }
  | { type: 'none' }

export type CategorySchedule = {
  rule: ScheduleRule
  pickupStart?: string
  notes?: string
}

export type AreaData = {
  id: string
  name: string
  nameRoman?: string
  schedule: Partial<Record<GarbageCategory, CategorySchedule>>
}

export type MunicipalityData = {
  code: string
  prefecture: string
  prefectureEn: string
  name: string
  nameEn: string
  dataVersion: string
  sourceUrl?: string
  areas: AreaData[]
}

// What a scraper returns — raw HTML/text before parsing
export type RawSource = {
  municipalityCode: string
  sourceUrl: string
  fetchedAt: string  // ISO timestamp
  content: string    // raw HTML or text
  contentType: 'html' | 'text' | 'pdf_text'
}

// Pipeline result
export type PipelineResult = {
  success: boolean
  municipalityCode: string
  data?: MunicipalityData
  errors?: string[]
}
