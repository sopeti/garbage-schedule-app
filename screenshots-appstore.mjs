/**
 * Generates App Store preview screenshots via Playwright + Expo web.
 * Run with: node screenshots-appstore.mjs
 * Requires Expo web dev server running on port 19006.
 *
 * Output images are 1290×2796 px (3× 430×932) — accepted by App Store for 6.7" iPhone.
 * NOTE: Apple's official screenshots must come from the iOS Simulator or real device;
 *       these are high-quality drafts suitable for App Store Connect upload.
 */

import { chromium } from '@playwright/test'
import { mkdir } from 'fs/promises'

await mkdir('screenshots/appstore', { recursive: true })

const BASE = 'http://localhost:19006'
const VIEWPORT = { width: 430, height: 932 }
const SCALE = 3

const storage = (lang) => ({
  origins: [{
    origin: BASE,
    localStorage: [
      { name: 'user_location', value: JSON.stringify({ municipalityCode: '13123', areaId: '13123-E' }) },
      { name: 'notification_times', value: JSON.stringify({ eveningEnabled: true, eveningHour: 20, eveningMinute: 0, morningEnabled: true, morningHour: 7, morningMinute: 0 }) },
      { name: 'user_language', value: lang },
    ],
  }],
})

async function shoot(lang) {
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: SCALE, storageState: storage(lang) })
  const page = await ctx.newPage()
  page.on('console', m => { if (m.type() === 'error') console.error('[err]', m.text().slice(0, 120)) })

  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 })
  await page.waitForTimeout(2000)
  await page.screenshot({ path: `screenshots/appstore/${lang}-1-home.png` })
  console.log(`📸 ${lang} home`)

  await page.locator('text=設定').click()
  await page.waitForTimeout(800)
  await page.screenshot({ path: `screenshots/appstore/${lang}-2-settings.png` })
  console.log(`📸 ${lang} settings`)

  await browser.close()
}

await shoot('ja')
await shoot('en')

console.log('\nDone. Screenshots saved to screenshots/appstore/')
console.log('Size: ' + VIEWPORT.width * SCALE + '×' + VIEWPORT.height * SCALE + ' px per image')
