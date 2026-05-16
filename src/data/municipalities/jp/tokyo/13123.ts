// 江戸川区 (Edogawa Ward) — JIS code 13123
// Schedule version: 2025-04 (fiscal year 2025)
// Source: https://www.city.edogawa.tokyo.jp/e013/bousai_life/gomi/

import { Municipality } from '@/types/schedule'

const edogawa: Municipality = {
  code: '13123',
  prefecture: '東京都',
  prefectureEn: 'Tokyo',
  name: '江戸川区',
  nameEn: 'Edogawa Ward',
  dataVersion: '2025-04',
  sourceUrl: 'https://www.city.edogawa.tokyo.jp/e013/bousai_life/gomi/',
  areas: [
    {
      id: '13123-A',
      name: '小松川1・2丁目、平井1〜3丁目',
      nameRoman: 'Komatsugawa, Hirai',
      schedule: {
        burnable:         { rule: { type: 'weekly', days: ['monday', 'thursday'] }, pickupStart: '08:00' },
        plastic:          { rule: { type: 'weekly', days: ['tuesday'] },            pickupStart: '08:00' },
        non_burnable:     { rule: { type: 'nth_weekday', n: 1, day: 'wednesday' }, pickupStart: '08:00' },
        cans:             { rule: { type: 'nth_weekday', n: 2, day: 'friday' },     pickupStart: '08:00' },
        bottles_glass:    { rule: { type: 'nth_weekday', n: 4, day: 'friday' },     pickupStart: '08:00' },
        cardboard:        { rule: { type: 'nth_weekday', n: 3, day: 'monday' },     pickupStart: '08:00' },
        paper:            { rule: { type: 'nth_weekday', n: 3, day: 'monday' },     pickupStart: '08:00' },
        small_electronics: { rule: { type: 'nth_weekday', n: 3, day: 'monday' },   pickupStart: '08:00' },
        bulky:            { rule: { type: 'by_appointment' } },
        spray_cans:       { rule: { type: 'nth_weekday', n: 1, day: 'wednesday' }, pickupStart: '08:00', notes: '穴を開けずに出す' },
      },
    },
    {
      id: '13123-B',
      name: '葛西1〜3丁目、南葛西1・2丁目',
      nameRoman: 'Kasai, Minami-Kasai',
      schedule: {
        burnable:         { rule: { type: 'weekly', days: ['tuesday', 'friday'] },  pickupStart: '08:00' },
        plastic:          { rule: { type: 'weekly', days: ['wednesday'] },           pickupStart: '08:00' },
        non_burnable:     { rule: { type: 'nth_weekday', n: 2, day: 'thursday' },   pickupStart: '08:00' },
        cans:             { rule: { type: 'nth_weekday', n: 1, day: 'saturday' },   pickupStart: '08:00' },
        bottles_glass:    { rule: { type: 'nth_weekday', n: 3, day: 'saturday' },   pickupStart: '08:00' },
        cardboard:        { rule: { type: 'nth_weekday', n: 2, day: 'tuesday' },    pickupStart: '08:00' },
        paper:            { rule: { type: 'nth_weekday', n: 2, day: 'tuesday' },    pickupStart: '08:00' },
        small_electronics: { rule: { type: 'nth_weekday', n: 2, day: 'tuesday' },  pickupStart: '08:00' },
        bulky:            { rule: { type: 'by_appointment' } },
        spray_cans:       { rule: { type: 'nth_weekday', n: 2, day: 'thursday' },  pickupStart: '08:00', notes: '穴を開けずに出す' },
      },
    },
    {
      id: '13123-C',
      name: '西葛西1〜9丁目、中葛西1〜8丁目',
      nameRoman: 'Nishi-Kasai, Naka-Kasai',
      schedule: {
        burnable:         { rule: { type: 'weekly', days: ['wednesday', 'saturday'] }, pickupStart: '08:00' },
        plastic:          { rule: { type: 'weekly', days: ['thursday'] },              pickupStart: '08:00' },
        non_burnable:     { rule: { type: 'nth_weekday', n: 3, day: 'tuesday' },      pickupStart: '08:00' },
        cans:             { rule: { type: 'nth_weekday', n: 1, day: 'wednesday' },    pickupStart: '08:00' },
        bottles_glass:    { rule: { type: 'nth_weekday', n: 3, day: 'wednesday' },   pickupStart: '08:00' },
        cardboard:        { rule: { type: 'nth_weekday', n: 4, day: 'thursday' },    pickupStart: '08:00' },
        paper:            { rule: { type: 'nth_weekday', n: 4, day: 'thursday' },    pickupStart: '08:00' },
        small_electronics: { rule: { type: 'nth_weekday', n: 4, day: 'thursday' },  pickupStart: '08:00' },
        bulky:            { rule: { type: 'by_appointment' } },
        spray_cans:       { rule: { type: 'nth_weekday', n: 3, day: 'tuesday' },    pickupStart: '08:00', notes: '穴を開けずに出す' },
      },
    },
    {
      // Source: https://www.city.edogawa.tokyo.jp/e025/kurashi/gomi_recycle/kategomi/yobihyo.html
      // Verified zone: 一之江1〜5丁目 — user residence at 一之江2-8-16 confirmed in this zone
      // Plastic day needs field verification (listed as Monday with other resources)
      id: '13123-E',
      name: '一之江1〜5丁目',
      nameRoman: 'Ichinoe 1-5-chome',
      schedule: {
        burnable:         { rule: { type: 'weekly', days: ['wednesday', 'saturday'] }, pickupStart: '08:00' },
        non_burnable:     { rule: { type: 'nth_weekdays', ns: [1, 3], day: 'friday' }, pickupStart: '08:00' },
        plastic:          { rule: { type: 'weekly', days: ['monday'] },                pickupStart: '08:00' },
        cans:             { rule: { type: 'weekly', days: ['monday'] },                pickupStart: '08:00' },
        bottles_glass:    { rule: { type: 'weekly', days: ['monday'] },                pickupStart: '08:00' },
        cardboard:        { rule: { type: 'weekly', days: ['monday'] },                pickupStart: '08:00' },
        paper:            { rule: { type: 'weekly', days: ['monday'] },                pickupStart: '08:00' },
        bulky:            { rule: { type: 'by_appointment' } },
        spray_cans:       { rule: { type: 'nth_weekdays', ns: [1, 3], day: 'friday' }, pickupStart: '08:00', notes: '燃やさないごみと同日。穴を開けずに出す' },
        small_electronics: { rule: { type: 'nth_weekdays', ns: [1, 3], day: 'friday' }, pickupStart: '08:00' },
      },
    },
    {
      id: '13123-D',
      name: '篠崎町1〜8丁目、江戸川1〜6丁目',
      nameRoman: 'Shinozakimachi, Edogawa',
      schedule: {
        burnable:         { rule: { type: 'weekly', days: ['monday', 'friday'] },    pickupStart: '08:00' },
        plastic:          { rule: { type: 'weekly', days: ['tuesday'] },             pickupStart: '08:00' },
        non_burnable:     { rule: { type: 'nth_weekday', n: 1, day: 'friday' },     pickupStart: '08:00' },
        cans:             { rule: { type: 'nth_weekday', n: 2, day: 'wednesday' },  pickupStart: '08:00' },
        bottles_glass:    { rule: { type: 'nth_weekday', n: 4, day: 'wednesday' }, pickupStart: '08:00' },
        cardboard:        { rule: { type: 'nth_weekday', n: 3, day: 'tuesday' },   pickupStart: '08:00' },
        paper:            { rule: { type: 'nth_weekday', n: 3, day: 'tuesday' },   pickupStart: '08:00' },
        small_electronics: { rule: { type: 'nth_weekday', n: 3, day: 'tuesday' }, pickupStart: '08:00' },
        bulky:            { rule: { type: 'by_appointment' } },
        spray_cans:       { rule: { type: 'nth_weekday', n: 1, day: 'friday' },   pickupStart: '08:00', notes: '穴を開けずに出す' },
      },
    },
  ],
}

export default edogawa
