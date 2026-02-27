import type { TBaseTimeZone } from "../../types/common/Base.types"
import { getWithCommaTimezone } from "./getSplited"
import { type TCountryTimezone } from "../../types/timezone-map/countriesTimezones.types"
import { isValidTimezone } from "./isValidTimezone"

function isTBaseTimeZones(
  timezones: TBaseTimeZone[] | TCountryTimezone[],
): timezones is TBaseTimeZone[] {
  return (
    Array.isArray(timezones) &&
    (typeof timezones[0] === "string" || typeof timezones[0] === undefined)
  )
}

export function getDisplayTimezones(timezones: TBaseTimeZone[]): TBaseTimeZone[]
export function getDisplayTimezones(
  timezones: TCountryTimezone[],
): TCountryTimezone[]

export function getDisplayTimezones(
  timezones: TBaseTimeZone[] | TCountryTimezone[],
) {
  if (isTBaseTimeZones(timezones)) {
    return timezones
      .filter((tz) => tz.includes("/") && !tz.startsWith("Etc/"))
      .map((tz) => getWithCommaTimezone(tz))
      .filter((tz) => isValidTimezone(tz))
      .sort((tz1, tz2) => tz1.localeCompare(tz2, "en", { sensitivity: "base" }))
  }
  return timezones
    .filter(({ name: tz }) => tz.includes("/") && !tz.startsWith("Etc/"))
    .map(({ name: tz, ...rest }) => ({
      ...rest,
      name: getWithCommaTimezone(tz),
    }))
    .filter(({ name: tz }) => isValidTimezone(tz))
    .sort(({ name: tz1 }, { name: tz2 }) =>
      tz1.localeCompare(tz2, "en", { sensitivity: "base" }),
    )
}
