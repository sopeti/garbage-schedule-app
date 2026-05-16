// Claude API parser — sends raw municipal schedule HTML to Claude,
// returns structured MunicipalityData JSON.
// Used at Stage 2+ when expanding beyond manually-entered Edogawa data.

import Anthropic from '@anthropic-ai/sdk'
import { Parser } from './base.js'
import { RawSource, MunicipalityData } from '../types.js'

const SYSTEM_PROMPT = `You are a data extraction assistant for a Japanese garbage collection schedule app.

Given raw HTML or text from a Japanese municipal website, extract the garbage collection schedule
and return ONLY a valid JSON object matching this TypeScript type:

type GarbageCategory = 'burnable' | 'non_burnable' | 'plastic' | 'cans' | 'bottles_glass' | 'cardboard' | 'paper' | 'bulky' | 'small_electronics' | 'spray_cans'
type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
type ScheduleRule =
  | { type: 'weekly'; days: WeekDay[] }
  | { type: 'nth_weekday'; n: number; day: WeekDay }
  | { type: 'biweekly'; day: WeekDay; startWeek: 'odd' | 'even' }
  | { type: 'by_appointment' }
  | { type: 'none' }

The output must be:
{
  "code": "string (JIS 5-digit)",
  "prefecture": "string (Japanese)",
  "prefectureEn": "string (English)",
  "name": "string (Japanese ward/city name)",
  "nameEn": "string (English)",
  "dataVersion": "YYYY-MM",
  "sourceUrl": "string",
  "areas": [
    {
      "id": "code-LETTER",
      "name": "string (Japanese area name)",
      "nameRoman": "string (romaji, optional)",
      "schedule": {
        "<category>": { "rule": <ScheduleRule>, "pickupStart": "HH:MM", "notes": "string" }
      }
    }
  ]
}

Return ONLY the JSON. No markdown, no explanation.`

export class ClaudeParser implements Parser {
  private client: Anthropic

  constructor(private municipalityMeta: { code: string; prefecture: string; prefectureEn: string; name: string; nameEn: string }) {
    this.client = new Anthropic()  // reads ANTHROPIC_API_KEY from env
  }

  async parse(source: RawSource): Promise<MunicipalityData> {
    const userContent = `Municipality: ${this.municipalityMeta.name} (${this.municipalityMeta.code})
Source URL: ${source.sourceUrl}

Raw content:
${source.content.slice(0, 80000)}`  // Claude context limit safety

    const message = await this.client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userContent }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    return JSON.parse(text) as MunicipalityData
  }
}
