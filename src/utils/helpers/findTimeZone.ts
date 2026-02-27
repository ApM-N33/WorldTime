import { TBaseTimeZone, Maybe } from "../../types/common/Base.types"
import { getCityWithoutSlashOrComma } from "./getSplited"
import { normalizeString } from "./normalizeString"

export function findTimeZone(
  timezones: TBaseTimeZone[],
  value: TBaseTimeZone,
): Maybe<TBaseTimeZone> {
  return timezones.find((tz) => {
    return (
      normalizeString(tz) === normalizeString(value) ||
      getCityWithoutSlashOrComma(tz.toLowerCase()) === normalizeString(value)
    )
  })
}
