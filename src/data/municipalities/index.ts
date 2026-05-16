// Municipality registry — add new municipalities here as data is collected
// Key = JIS 5-digit municipality code

import { Municipality } from '@/types/schedule'
import edogawa from './jp/tokyo/13123'
import koto from './jp/tokyo/13108'

const registry: Record<string, Municipality> = {
  '13123': edogawa,
  '13108': koto,
  // '13101': chiyoda, // Chiyoda Ward — Stage 2
  // '13101': chiyoda, // Chiyoda Ward — Stage 3
  // '27100': osaka,   // Osaka City — Stage 3
}

export function getMunicipality(code: string): Municipality | undefined {
  return registry[code]
}

export function getAllMunicipalities(): Municipality[] {
  return Object.values(registry)
}

export function getArea(municipalityCode: string, areaId: string) {
  const m = registry[municipalityCode]
  return m?.areas.find(a => a.id === areaId)
}

export default registry
