import {
  GarbageCategory,
  ScheduleRule,
  CategorySchedule,
  CollectionEvent,
} from '@/types/schedule'
import { getArea } from '@/data/municipalities'

const WEEKDAY_JS: Record<string, number> = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
  thursday: 4, friday: 5, saturday: 6,
}

function nthWeekdayOfMonth(year: number, month: number, n: number, weekday: string): Date {
  const jsDay = WEEKDAY_JS[weekday]
  const d = new Date(year, month, 1)
  // advance to first occurrence of weekday
  while (d.getDay() !== jsDay) d.setDate(d.getDate() + 1)
  d.setDate(d.getDate() + (n - 1) * 7)
  return d
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function firesOnDate(rule: ScheduleRule, date: Date): boolean {
  const jsDay = date.getDay()

  switch (rule.type) {
    case 'none':
      return false

    case 'by_appointment':
      return false

    case 'weekly': {
      const targetDays = new Set(rule.days.map(d => WEEKDAY_JS[d]))
      return targetDays.has(jsDay)
    }

    case 'nth_weekday': {
      const nth = nthWeekdayOfMonth(date.getFullYear(), date.getMonth(), rule.n, rule.day)
      return isSameDay(nth, date)
    }

    case 'nth_weekdays': {
      return rule.ns.some(n => {
        const nth = nthWeekdayOfMonth(date.getFullYear(), date.getMonth(), n, rule.day)
        return isSameDay(nth, date)
      })
    }

    case 'biweekly': {
      if (WEEKDAY_JS[rule.day] !== jsDay) return false
      // week number within year (0-indexed)
      const startOfYear = new Date(date.getFullYear(), 0, 1)
      const weekNum = Math.floor((date.getTime() - startOfYear.getTime()) / (7 * 86400000))
      return rule.startWeek === 'even' ? weekNum % 2 === 0 : weekNum % 2 === 1
    }
  }
}

export function getCollectionsForDate(
  municipalityCode: string,
  areaId: string,
  date: Date,
): CollectionEvent[] {
  const area = getArea(municipalityCode, areaId)
  if (!area) return []

  const events: CollectionEvent[] = []
  const entries = Object.entries(area.schedule) as [GarbageCategory, CategorySchedule][]

  for (const [category, catSchedule] of entries) {
    if (firesOnDate(catSchedule.rule, date)) {
      events.push({ category, municipalityCode, areaId })
    }
  }

  return events
}

export function getWeekSchedule(
  municipalityCode: string,
  areaId: string,
  startDate: Date,
): { date: Date; events: CollectionEvent[] }[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startDate)
    d.setDate(d.getDate() + i)
    return { date: d, events: getCollectionsForDate(municipalityCode, areaId, d) }
  })
}

// Returns next N upcoming collection dates for a category (used for scheduling notifications)
export function getUpcomingDatesForCategory(
  municipalityCode: string,
  areaId: string,
  category: GarbageCategory,
  fromDate: Date,
  count: number,
): Date[] {
  const area = getArea(municipalityCode, areaId)
  if (!area) return []
  const catSchedule = area.schedule[category]
  if (!catSchedule) return []

  const results: Date[] = []
  const cursor = new Date(fromDate)

  while (results.length < count) {
    if (firesOnDate(catSchedule.rule, cursor)) {
      results.push(new Date(cursor))
    }
    cursor.setDate(cursor.getDate() + 1)
    // safety cap: search up to 6 months out
    if (cursor.getTime() - fromDate.getTime() > 180 * 86400000) break
  }

  return results
}
