// 江東区 (Koto Ward) — JIS code 13108
// Schedule version: 2026-04 (fiscal year 2026, April 2026 – March 2027)
// Source: https://www.city.koto.lg.jp/388010/kurashi/gomi/kate/43735.html
// Resource collection (資源) = cans, bottles/glass, cardboard, paper — all same weekly day per area
// Non-burnable (燃やさないごみ) = biweekly, alternating with adjacent area on same day
// Areas sorted alphabetically by neighbourhood (あいうえお order); same-name areas sorted by chome

import { Municipality } from '@/types/schedule'

const koto: Municipality = {
  code: '13108',
  prefecture: '東京都',
  prefectureEn: 'Tokyo',
  name: '江東区',
  nameEn: 'Koto Ward',
  dataVersion: '2026-04',
  sourceUrl: 'https://www.city.koto.lg.jp/388010/kurashi/gomi/kate/43735.html',
  areas: [
    {
      // 青海 (あ)
      id: '13108-6',
      name: '青海・有明・東雲・豊洲2・4〜6丁目・海の森',
      nameRoman: 'Aomi, Ariake, Shinonome, Toyosu 2 4-6, Uminomori',
      schedule: {
        burnable:      { rule: { type: 'weekly', days: ['monday', 'thursday'] },          pickupStart: '08:00' },
        non_burnable:  { rule: { type: 'biweekly', day: 'saturday', startWeek: 'even' }, pickupStart: '08:00' },
        plastic:       { rule: { type: 'weekly', days: ['wednesday'] },                   pickupStart: '08:00' },
        cans:          { rule: { type: 'weekly', days: ['friday'] },                      pickupStart: '08:00' },
        bottles_glass: { rule: { type: 'weekly', days: ['friday'] },                      pickupStart: '08:00' },
        cardboard:     { rule: { type: 'weekly', days: ['friday'] },                      pickupStart: '08:00' },
        paper:         { rule: { type: 'weekly', days: ['friday'] },                      pickupStart: '08:00' },
        bulky:         { rule: { type: 'by_appointment' } },
      },
    },
    {
      // 石島 (い)
      id: '13108-11',
      name: '石島・海辺・扇橋・白河4丁目・猿江・千石・千田・平野4丁目・三好4丁目・森下5丁目',
      nameRoman: 'Ishijima, Umibe, Ogibashi, Shirakawa 4, Sarue, Sengoku, Senda, Hirano 4, Miyoshi 4, Morishita 5',
      schedule: {
        burnable:      { rule: { type: 'weekly', days: ['wednesday', 'saturday'] },       pickupStart: '08:00' },
        non_burnable:  { rule: { type: 'biweekly', day: 'friday', startWeek: 'odd' },    pickupStart: '08:00' },
        plastic:       { rule: { type: 'weekly', days: ['tuesday'] },                     pickupStart: '08:00' },
        cans:          { rule: { type: 'weekly', days: ['thursday'] },                    pickupStart: '08:00' },
        bottles_glass: { rule: { type: 'weekly', days: ['thursday'] },                    pickupStart: '08:00' },
        cardboard:     { rule: { type: 'weekly', days: ['thursday'] },                    pickupStart: '08:00' },
        paper:         { rule: { type: 'weekly', days: ['thursday'] },                    pickupStart: '08:00' },
        bulky:         { rule: { type: 'by_appointment' } },
      },
    },
    {
      // 永代 (えい)
      id: '13108-3',
      name: '永代・越中島・清澄・佐賀・富岡・深川1丁目・福住・古石場・牡丹・門前仲町',
      nameRoman: 'Eitai, Ecchujima, Kiyosumi, Saga, Tomioka, Fukagawa 1, Fukuzumi, Furuishiba, Botan, Monzennakacho',
      schedule: {
        burnable:      { rule: { type: 'weekly', days: ['monday', 'thursday'] },          pickupStart: '08:00' },
        non_burnable:  { rule: { type: 'biweekly', day: 'wednesday', startWeek: 'odd' }, pickupStart: '08:00' },
        plastic:       { rule: { type: 'weekly', days: ['saturday'] },                    pickupStart: '08:00' },
        cans:          { rule: { type: 'weekly', days: ['tuesday'] },                     pickupStart: '08:00' },
        bottles_glass: { rule: { type: 'weekly', days: ['tuesday'] },                     pickupStart: '08:00' },
        cardboard:     { rule: { type: 'weekly', days: ['tuesday'] },                     pickupStart: '08:00' },
        paper:         { rule: { type: 'weekly', days: ['tuesday'] },                     pickupStart: '08:00' },
        bulky:         { rule: { type: 'by_appointment' } },
      },
    },
    {
      // 枝川 (えだ)
      id: '13108-12',
      name: '枝川・塩浜・潮見・新木場・辰巳・豊洲1・3丁目・夢の島・若洲',
      nameRoman: 'Edagawa, Shiohama, Shiomi, Shinkiba, Tatsumi, Toyosu 1 3, Yumenoshima, Wakasu',
      schedule: {
        burnable:      { rule: { type: 'weekly', days: ['monday', 'thursday'] },          pickupStart: '08:00' },
        non_burnable:  { rule: { type: 'biweekly', day: 'saturday', startWeek: 'odd' },  pickupStart: '08:00' },
        plastic:       { rule: { type: 'weekly', days: ['wednesday'] },                   pickupStart: '08:00' },
        cans:          { rule: { type: 'weekly', days: ['friday'] },                      pickupStart: '08:00' },
        bottles_glass: { rule: { type: 'weekly', days: ['friday'] },                      pickupStart: '08:00' },
        cardboard:     { rule: { type: 'weekly', days: ['friday'] },                      pickupStart: '08:00' },
        paper:         { rule: { type: 'weekly', days: ['friday'] },                      pickupStart: '08:00' },
        bulky:         { rule: { type: 'by_appointment' } },
      },
    },
    {
      // 大島1〜2丁目 (おおじま — chome 1)
      id: '13108-8',
      name: '大島1・2丁目・亀戸1〜3丁目・住吉・毛利',
      nameRoman: 'Ojima 1-2, Kameido 1-3, Sumiyoshi, Mori',
      schedule: {
        burnable:      { rule: { type: 'weekly', days: ['wednesday', 'saturday'] },       pickupStart: '08:00' },
        non_burnable:  { rule: { type: 'biweekly', day: 'tuesday', startWeek: 'even' },  pickupStart: '08:00' },
        plastic:       { rule: { type: 'weekly', days: ['friday'] },                      pickupStart: '08:00' },
        cans:          { rule: { type: 'weekly', days: ['monday'] },                      pickupStart: '08:00' },
        bottles_glass: { rule: { type: 'weekly', days: ['monday'] },                      pickupStart: '08:00' },
        cardboard:     { rule: { type: 'weekly', days: ['monday'] },                      pickupStart: '08:00' },
        paper:         { rule: { type: 'weekly', days: ['monday'] },                      pickupStart: '08:00' },
        bulky:         { rule: { type: 'by_appointment' } },
      },
    },
    {
      // 大島3〜7丁目 (おおじま — chome 3)
      id: '13108-10',
      name: '大島3〜7丁目',
      nameRoman: 'Ojima 3-7',
      schedule: {
        burnable:      { rule: { type: 'weekly', days: ['tuesday', 'friday'] },           pickupStart: '08:00' },
        non_burnable:  { rule: { type: 'biweekly', day: 'thursday', startWeek: 'odd' },  pickupStart: '08:00' },
        plastic:       { rule: { type: 'weekly', days: ['monday'] },                      pickupStart: '08:00' },
        cans:          { rule: { type: 'weekly', days: ['wednesday'] },                   pickupStart: '08:00' },
        bottles_glass: { rule: { type: 'weekly', days: ['wednesday'] },                   pickupStart: '08:00' },
        cardboard:     { rule: { type: 'weekly', days: ['wednesday'] },                   pickupStart: '08:00' },
        paper:         { rule: { type: 'weekly', days: ['wednesday'] },                   pickupStart: '08:00' },
        bulky:         { rule: { type: 'by_appointment' } },
      },
    },
    {
      // 大島8〜9丁目 (おおじま — chome 8)
      id: '13108-4',
      name: '大島8・9丁目・北砂6・7丁目・東砂1〜5丁目',
      nameRoman: 'Ojima 8-9, Kitasuna 6-7, Higashisuna 1-5',
      schedule: {
        burnable:      { rule: { type: 'weekly', days: ['tuesday', 'friday'] },           pickupStart: '08:00' },
        non_burnable:  { rule: { type: 'biweekly', day: 'thursday', startWeek: 'even' }, pickupStart: '08:00' },
        plastic:       { rule: { type: 'weekly', days: ['monday'] },                      pickupStart: '08:00' },
        cans:          { rule: { type: 'weekly', days: ['wednesday'] },                   pickupStart: '08:00' },
        bottles_glass: { rule: { type: 'weekly', days: ['wednesday'] },                   pickupStart: '08:00' },
        cardboard:     { rule: { type: 'weekly', days: ['wednesday'] },                   pickupStart: '08:00' },
        paper:         { rule: { type: 'weekly', days: ['wednesday'] },                   pickupStart: '08:00' },
        bulky:         { rule: { type: 'by_appointment' } },
      },
    },
    {
      // 亀戸4〜9丁目 (か)
      id: '13108-2',
      name: '亀戸4〜9丁目',
      nameRoman: 'Kameido 4-9',
      schedule: {
        burnable:      { rule: { type: 'weekly', days: ['wednesday', 'saturday'] },       pickupStart: '08:00' },
        non_burnable:  { rule: { type: 'biweekly', day: 'tuesday', startWeek: 'odd' },   pickupStart: '08:00' },
        plastic:       { rule: { type: 'weekly', days: ['friday'] },                      pickupStart: '08:00' },
        cans:          { rule: { type: 'weekly', days: ['monday'] },                      pickupStart: '08:00' },
        bottles_glass: { rule: { type: 'weekly', days: ['monday'] },                      pickupStart: '08:00' },
        cardboard:     { rule: { type: 'weekly', days: ['monday'] },                      pickupStart: '08:00' },
        paper:         { rule: { type: 'weekly', days: ['monday'] },                      pickupStart: '08:00' },
        bulky:         { rule: { type: 'by_appointment' } },
      },
    },
    {
      // 北砂 (きた)
      id: '13108-7',
      name: '北砂1〜5丁目・南砂1・5丁目',
      nameRoman: 'Kitasuna 1-5, Minamisuna 1 5',
      schedule: {
        burnable:      { rule: { type: 'weekly', days: ['tuesday', 'friday'] },           pickupStart: '08:00' },
        non_burnable:  { rule: { type: 'biweekly', day: 'monday', startWeek: 'even' },   pickupStart: '08:00' },
        plastic:       { rule: { type: 'weekly', days: ['thursday'] },                    pickupStart: '08:00' },
        cans:          { rule: { type: 'weekly', days: ['saturday'] },                    pickupStart: '08:00' },
        bottles_glass: { rule: { type: 'weekly', days: ['saturday'] },                    pickupStart: '08:00' },
        cardboard:     { rule: { type: 'weekly', days: ['saturday'] },                    pickupStart: '08:00' },
        paper:         { rule: { type: 'weekly', days: ['saturday'] },                    pickupStart: '08:00' },
        bulky:         { rule: { type: 'by_appointment' } },
      },
    },
    {
      // 木場 (きば)
      id: '13108-9',
      name: '木場・東陽・深川2丁目・冬木',
      nameRoman: 'Kiba, Toyo, Fukagawa 2, Fuyuki',
      schedule: {
        burnable:      { rule: { type: 'weekly', days: ['monday', 'thursday'] },           pickupStart: '08:00' },
        non_burnable:  { rule: { type: 'biweekly', day: 'wednesday', startWeek: 'even' }, pickupStart: '08:00' },
        plastic:       { rule: { type: 'weekly', days: ['saturday'] },                     pickupStart: '08:00' },
        cans:          { rule: { type: 'weekly', days: ['tuesday'] },                      pickupStart: '08:00' },
        bottles_glass: { rule: { type: 'weekly', days: ['tuesday'] },                      pickupStart: '08:00' },
        cardboard:     { rule: { type: 'weekly', days: ['tuesday'] },                      pickupStart: '08:00' },
        paper:         { rule: { type: 'weekly', days: ['tuesday'] },                      pickupStart: '08:00' },
        bulky:         { rule: { type: 'by_appointment' } },
      },
    },
    {
      // 白河 (しら)
      id: '13108-5',
      name: '白河1〜3丁目・新大橋・高橋・常盤・平野1〜3丁目・三好1〜3丁目・森下1〜4丁目',
      nameRoman: 'Shirakawa 1-3, Shin-ohashi, Takabashi, Tokiwa, Hirano 1-3, Miyoshi 1-3, Morishita 1-4',
      schedule: {
        burnable:      { rule: { type: 'weekly', days: ['wednesday', 'saturday'] },       pickupStart: '08:00' },
        non_burnable:  { rule: { type: 'biweekly', day: 'friday', startWeek: 'even' },   pickupStart: '08:00' },
        plastic:       { rule: { type: 'weekly', days: ['tuesday'] },                     pickupStart: '08:00' },
        cans:          { rule: { type: 'weekly', days: ['thursday'] },                    pickupStart: '08:00' },
        bottles_glass: { rule: { type: 'weekly', days: ['thursday'] },                    pickupStart: '08:00' },
        cardboard:     { rule: { type: 'weekly', days: ['thursday'] },                    pickupStart: '08:00' },
        paper:         { rule: { type: 'weekly', days: ['thursday'] },                    pickupStart: '08:00' },
        bulky:         { rule: { type: 'by_appointment' } },
      },
    },
    {
      // 新砂 (しん)
      id: '13108-1',
      name: '新砂・東砂6〜8丁目・南砂2〜4・6・7丁目',
      nameRoman: 'Shinsuna, Higashisuna 6-8, Minamisuna 2-4 6-7',
      schedule: {
        burnable:      { rule: { type: 'weekly', days: ['tuesday', 'friday'] },           pickupStart: '08:00' },
        non_burnable:  { rule: { type: 'biweekly', day: 'monday', startWeek: 'odd' },    pickupStart: '08:00' },
        plastic:       { rule: { type: 'weekly', days: ['thursday'] },                    pickupStart: '08:00' },
        cans:          { rule: { type: 'weekly', days: ['saturday'] },                    pickupStart: '08:00' },
        bottles_glass: { rule: { type: 'weekly', days: ['saturday'] },                    pickupStart: '08:00' },
        cardboard:     { rule: { type: 'weekly', days: ['saturday'] },                    pickupStart: '08:00' },
        paper:         { rule: { type: 'weekly', days: ['saturday'] },                    pickupStart: '08:00' },
        bulky:         { rule: { type: 'by_appointment' } },
      },
    },
  ],
}

export default koto
