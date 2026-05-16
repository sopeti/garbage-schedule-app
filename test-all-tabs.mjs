import { chromium } from '@playwright/test'
import { mkdir } from 'fs/promises'

await mkdir('screenshots', { recursive: true })

const browser = await chromium.launch({ headless: true })
const storage = {
  origins: [{ origin: 'http://localhost:19006', localStorage: [
    { name: 'user_location', value: JSON.stringify({ municipalityCode: '13123', areaId: '13123-E' }) },
    { name: 'notification_times', value: JSON.stringify({ eveningEnabled: true, eveningHour: 20, eveningMinute: 0, morningEnabled: true, morningHour: 7, morningMinute: 0 }) },
    { name: 'user_language', value: 'en' },
  ]}]
}
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, storageState: storage })
const page = await ctx.newPage()
page.on('console', m => { if (m.type() === 'error') console.error('[err]', m.text().slice(0,100)) })

await page.goto('http://localhost:19006', { waitUntil: 'networkidle', timeout: 20000 })
await page.waitForTimeout(1500)
await page.screenshot({ path: 'screenshots/home.png' })
console.log('📸 home (today + calendar)')

await page.locator('text=設定').click()
await page.waitForTimeout(800)
await page.screenshot({ path: 'screenshots/settings.png' })
console.log('📸 settings')

await browser.close()
