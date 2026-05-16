// Edogawa Ward (13123) scraper
// The ward publishes an annual PDF and HTML schedule pages.
// For the MVP, this scraper is bypassed — data was manually entered in src/data/.
// For subsequent years, run this to get fresh raw HTML, then pass to the parser.

import { HttpScraper } from './base.js'

const EDOGAWA_SCHEDULE_URL =
  'https://www.city.edogawa.tokyo.jp/e013/bousai_life/gomi/gomi_bunbetsu/index.html'

export const edogawaScraper = new HttpScraper('13123', EDOGAWA_SCHEDULE_URL)
