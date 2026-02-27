import type { Maybe, TBaseTimeZone } from "../../types/common/Base.types"
import { REG } from "../constants/REGEX"

export function isInvalidTimezoneInput(value: Maybe<TBaseTimeZone>): boolean {
  return !(value && REG.search.test(value))
}
