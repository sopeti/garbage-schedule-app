import { RawSource, MunicipalityData } from '../types.js'

export interface Parser {
  parse(source: RawSource): Promise<MunicipalityData>
}
