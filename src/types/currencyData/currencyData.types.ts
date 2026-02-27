export interface CountryName {
  common: string
  official: string
  nativeName?: Record<string, { official: string; common: string }>
}

export interface Currency {
  name: string
  symbol: string
}

export interface Idd {
  root?: string
  suffixes?: string[]
}

export interface Maps {
  googleMaps: string
  openStreetMaps: string
}

export interface Car {
  signs?: string[]
  side: "right" | "left"
}

export interface Flags {
  png: string
  svg: string
  alt?: string
}

export interface CapitalInfo {
  latlng?: [number, number]
}

export interface PostalCode {
  format: string
  regex?: string
}

export interface CurrencyData {
  name: CountryName
  tld?: string[]
  cca2: string
  ccn3?: string
  cca3: string
  cioc?: string
  independent?: boolean
  status: string
  unMember: boolean
  currencies?: Record<string, Currency>
  idd: Idd
  capital?: string[]
  altSpellings: string[]
  region: string
  subregion?: string
  languages?: Record<string, string>
  translations: Record<string, { official: string; common: string }>
  latlng: [number, number]
  landlocked: boolean
  borders?: string[]
  area: number
  demonyms?: Record<string, { f: string; m: string }>
  flag: string
  maps: Maps
  population: number
  gini?: Record<string, number>
  fifa?: string
  car: Car
  timezones: string[]
  continents: string[]
  flags: Flags
  coatOfArms: Flags
  startOfWeek: string
  capitalInfo: CapitalInfo
  postalCode?: PostalCode
}
