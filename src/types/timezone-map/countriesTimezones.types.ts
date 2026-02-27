import type { getTimezonesForCountry } from "countries-and-timezones"
export type TCountriesTimezones = NonNullable<
  ReturnType<typeof getTimezonesForCountry>
>
export type TCountryTimezone = TCountriesTimezones[number]
