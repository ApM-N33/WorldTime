import type { Maybe, TBaseTimeZone } from "../../types/common/Base.types"
import { REG } from "../constants/REGEX"

export function getCityWithCommaAndSpace(timeZones: TBaseTimeZone[]) {
  return timeZones
    .map((tz) => tz.split(", ")[1])
    .join(", ")
    .trim()
}

export function getCityWithoutSlashOrComma(value: string[] | string) {
  const values = Array.isArray(value) ? value : [value]
  return values
    .map((val) => {
      const [_, city] = val.includes("/") ? val.split("/") : val.split(", ")
      return city
    })
    .join("")
    .trim()
}

export function getWithSlashTimezone(str: Maybe<TBaseTimeZone>) {
  const { commaToSlash } = REG
  const res = str ? str.replace(commaToSlash, "/") : undefined
  return res
}

export function getWithCommaTimezone(str: TBaseTimeZone) {
  const { slashToCommaAndSpace } = REG
  return str.replace(slashToCommaAndSpace, ", ")
}
