import { z } from 'zod'
import { MunicipalityData } from './types.js'

const weekDay = z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])

const scheduleRule = z.discriminatedUnion('type', [
  z.object({ type: z.literal('weekly'), days: z.array(weekDay).min(1) }),
  z.object({ type: z.literal('nth_weekday'), n: z.number().int().min(1).max(5), day: weekDay }),
  z.object({ type: z.literal('biweekly'), day: weekDay, startWeek: z.enum(['odd', 'even']) }),
  z.object({ type: z.literal('by_appointment') }),
  z.object({ type: z.literal('none') }),
])

const categorySchedule = z.object({
  rule: scheduleRule,
  pickupStart: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  notes: z.string().optional(),
})

const area = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  nameRoman: z.string().optional(),
  schedule: z.record(categorySchedule),
})

const municipality = z.object({
  code: z.string().regex(/^\d{5}$/),
  prefecture: z.string().min(1),
  prefectureEn: z.string().min(1),
  name: z.string().min(1),
  nameEn: z.string().min(1),
  dataVersion: z.string().regex(/^\d{4}-\d{2}$/),
  sourceUrl: z.string().url().optional(),
  areas: z.array(area).min(1),
})

export type ValidationResult = { valid: true } | { valid: false; errors: string[] }

export function validate(data: unknown): ValidationResult {
  const result = municipality.safeParse(data)
  if (result.success) return { valid: true }
  return {
    valid: false,
    errors: result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`),
  }
}

export function assertValid(data: MunicipalityData): void {
  const result = validate(data)
  if (!result.valid) throw new Error(`Validation failed:\n${result.errors.join('\n')}`)
}
