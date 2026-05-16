import { chromium } from '@playwright/test'
import { mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, 'screenshots')
await mkdir(OUT, { recursive: true })

const browser = await chromium.launch({ headless: true })

const BASE_STORAGE = {
  origins: [{
    origin: 'http://localhost:19006',
    localStorage: [
      { name: 'user_location',      value: JSON.stringify({ municipalityCode: '13123', areaId: '13123-E' }) },
      { name: 'notification_times', value: JSON.stringify({ eveningHour: 20, eveningMinute: 0, morningHour: 7, morningMinute: 0 }) },
    ],
  }],
}

async function newPage(lang = 'en') {
  const storage = {
    origins: [{
      ...BASE_STORAGE.origins[0],
      localStorage: [
        ...BASE_STORAGE.origins[0].localStorage,
        { name: 'user_language', value: lang },
      ],
    }],
  }
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, storageState: storage })
  const page = await ctx.newPage()
  page.on('console', msg => { if (msg.type() === 'error') console.error('[browser]', msg.text().slice(0, 100)) })
  return page
}

async function load(page) {
  await page.goto('http://localhost:19006', { waitUntil: 'networkidle', timeout: 20000 })
  await page.waitForTimeout(1200)
}

async function shot(page, name) {
  await page.screenshot({ path: join(OUT, `${name}.png`) })
  console.log(`📸 ${name}.png`)
}

async function clickTab(page, label) {
  await page.locator(`text="${label}"`).click()
  await page.waitForTimeout(800)
}

// ── Onboarding (no location) ────────────────────────────────────────
console.log('── Onboarding ──')
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })
  const pg = await ctx.newPage()
  await pg.goto('http://localhost:19006', { waitUntil: 'networkidle', timeout: 20000 })
  await pg.waitForTimeout(1200)
  await shot(pg, '01-onboarding-ja')
  await pg.locator('text=English').click()
  await pg.waitForTimeout(600)
  await shot(pg, '02-onboarding-en')
  await ctx.close()
}

// ── English — Today ─────────────────────────────────────────────────
console.log('\n── English screens ──')
const pgEn = await newPage('en')
await load(pgEn)
await shot(pgEn, '03-today-en')

// ── Schedule tab ────────────────────────────────────────────────────
await clickTab(pgEn, '今後')
await shot(pgEn, '04-schedule-en')

// ── Settings tab ────────────────────────────────────────────────────
await clickTab(pgEn, '設定')
await pgEn.waitForTimeout(400)
await shot(pgEn, '05-settings-top-en')

await pgEn.evaluate(() => window.scrollTo(0, 500))
await pgEn.waitForTimeout(300)
await shot(pgEn, '06-settings-area-en')

await pgEn.evaluate(() => window.scrollTo(0, 99999))
await pgEn.waitForTimeout(300)
await shot(pgEn, '07-settings-bottom-en')

// ── Japanese ────────────────────────────────────────────────────────
console.log('\n── Japanese screens ──')
const pgJa = await newPage('ja')
await load(pgJa)
await shot(pgJa, '08-today-ja')

await clickTab(pgJa, '今後')
await shot(pgJa, '09-schedule-ja')

await clickTab(pgJa, '設定')
await pgJa.waitForTimeout(400)
await shot(pgJa, '10-settings-top-ja')

await pgJa.evaluate(() => window.scrollTo(0, 99999))
await pgJa.waitForTimeout(300)
await shot(pgJa, '11-settings-bottom-ja')

await browser.close()
console.log('\nDone — screenshots in ./screenshots/')
