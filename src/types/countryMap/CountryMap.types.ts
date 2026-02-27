import { Maybe, type TInputEl } from "../common/Base.types"
interface ICountryMapProperties {
  countryLabel: Maybe<HTMLElement>
  countryName: Maybe<HTMLElement>
  totalTimezones: Maybe<HTMLElement>
  countryCurrency: Maybe<HTMLElement>
  timezonesList: Maybe<HTMLElement>
  flagLogo: Maybe<HTMLImageElement>
  deleteCountryBtn: Maybe<HTMLElement>
  checkboxInput:Maybe<TInputEl>
}

interface ICountryMapMethods {
  create(): HTMLElement
}

export interface ICountryMap
  extends ICountryMapProperties, ICountryMapMethods {}
