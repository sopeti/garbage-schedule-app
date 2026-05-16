// CLI entry point: tsx src/run.ts <command> [municipalityCode]
// Commands: fetch | parse | validate | all
//
// Usage examples:
//   tsx src/run.ts all 13123          — fetch + parse + validate + write Edogawa
//   tsx src/run.ts fetch 13123        — fetch raw HTML only
//   tsx src/run.ts validate 13123     — validate existing JSON file

import { readFileSync } from 'fs'
import { edogawaScraper } from './scrapers/edogawa.js'
import { ClaudeParser } from './parsers/claude.js'
import { validate } from './validate.js'
import { write } from './output.js'
import { MunicipalityData } from './types.js'

const SCRAPERS: Record<string, typeof edogawaScraper> = {
  '13123': edogawaScraper,
  // '13108': kotowaScraper,  // add as you add municipalities
}

const PARSER_META: Record<string, { code: string; prefecture: string; prefectureEn: string; name: string; nameEn: string }> = {
  '13123': { code: '13123', prefecture: '東京都', prefectureEn: 'Tokyo', name: '江戸川区', nameEn: 'Edogawa Ward' },
}

const [, , command, code] = process.argv

async function main() {
  if (!command) {
    console.error('Usage: tsx src/run.ts <fetch|parse|validate|all> [municipalityCode]')
    process.exit(1)
  }

  if (command === 'all' && code) {
    const scraper = SCRAPERS[code]
    if (!scraper) { console.error(`No scraper for ${code}`); process.exit(1) }
    console.log(`Fetching ${code}…`)
    const raw = await scraper.fetch()

    console.log(`Parsing with Claude…`)
    const parser = new ClaudeParser(PARSER_META[code])
    const data = await parser.parse(raw)

    console.log(`Validating…`)
    const result = validate(data)
    if (!result.valid) { console.error('Validation errors:', result.errors); process.exit(1) }

    write(data)
    return
  }

  if (command === 'fetch' && code) {
    const scraper = SCRAPERS[code]
    if (!scraper) { console.error(`No scraper for ${code}`); process.exit(1) }
    const raw = await scraper.fetch()
    console.log(raw.content.slice(0, 2000))
    return
  }

  console.error('Unknown command:', command)
  process.exit(1)
}

main().catch(err => { console.error(err); process.exit(1) })
