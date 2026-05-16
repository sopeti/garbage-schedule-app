import { chromium } from '@playwright/test'

const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 }, deviceScaleFactor: 2,
  storageState: { origins: [{ origin: 'http://localhost:19006', localStorage: [
    { name: 'user_location', value: JSON.stringify({ municipalityCode: '13123', areaId: '13123-E' }) },
    { name: 'notification_times', value: JSON.stringify({ eveningHour: 20, eveningMinute: 0, morningHour: 7, morningMinute: 0 }) },
    { name: 'user_language', value: 'en' },
  ]}] }
})
const page = await ctx.newPage()
await page.goto('http://localhost:19006', { waitUntil: 'networkidle', timeout: 20000 })
await page.waitForTimeout(1500)
await page.locator('text=設定').click()
await page.waitForTimeout(800)
await page.screenshot({ path: 'screenshots/settings-top-new.png' })
await page.evaluate(() => window.scrollTo(0, 99999))
await page.waitForTimeout(400)
await page.screenshot({ path: 'screenshots/settings-bottom-new.png' })
await browser.close()
console.log('done')
