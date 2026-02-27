import { Maybe, type TBaseTimeZone } from "../common/Base.types"
import { TCountryTimezone } from '../timezone-map/countriesTimezones.types';

export type TimezoneDetailProps = {
  countryTimezone: TCountryTimezone
}

interface ITimezoneDetailProperties {
  timeZone: TBaseTimeZone
  utcOffset: string
  detailDateItem: Maybe<HTMLElement>
  detailTimeItem: Maybe<HTMLElement>
  detailUTCItem: Maybe<HTMLElement>
}

interface ITimezonesDetailMethods {
  create(): HTMLElement
}

export interface ITimezoneDetail
  extends ITimezoneDetailProperties, ITimezonesDetailMethods {}
