import { TBaseTimeZone, Maybe } from "../../types/common/Base.types"
import { getWithSlashTimezone } from "./getSplited"

type Options = Partial<Intl.DateTimeFormatOptions>
type DefaultOptions = Intl.DateTimeFormatOptions

export const defaultFormaterOptions: DefaultOptions = {
  second: "2-digit",
  minute: "2-digit",
  hour: "2-digit",
  hour12: false,
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZoneName: "short",
}

export const caches = new Map<string, Intl.DateTimeFormat>()

export function getDateTimeFormater(
  timeZone: Maybe<TBaseTimeZone>,
  options: Options = {},
) {
  const mergedOptions = { ...defaultFormaterOptions, ...options }
  const savedKey = JSON.stringify({ timeZone, ...mergedOptions })

  if (caches.has(savedKey)) return caches.get(savedKey)!

  const formater = new Intl.DateTimeFormat("en-US", {
    timeZone: getWithSlashTimezone(timeZone),
    ...mergedOptions,
  })

  caches.set(savedKey, formater)

  return formater
}
