import { getWithSlashTimezone } from "./getSplited"
import { TBaseTimeZone } from "../../types/common/Base.types"

export function isValidTimezone(timeZone: TBaseTimeZone): boolean {
  try {
    new Intl.DateTimeFormat("en-US", {
      timeZone: getWithSlashTimezone(timeZone),
    })
    return true
  } catch {
    return false
  }
}
