import { RawSource } from '../types.js'

export interface Scraper {
  municipalityCode: string
  fetch(): Promise<RawSource>
}

// Generic plain HTTP fetcher — works for most municipal sites with static HTML
export class HttpScraper implements Scraper {
  constructor(
    public municipalityCode: string,
    private url: string,
  ) {}

  async fetch(): Promise<RawSource> {
    const res = await globalThis.fetch(this.url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; GarbageScheduleBot/1.0)' },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status} from ${this.url}`)
    const content = await res.text()
    return {
      municipalityCode: this.municipalityCode,
      sourceUrl: this.url,
      fetchedAt: new Date().toISOString(),
      content,
      contentType: 'html',
    }
  }
}
