import { getISOCode } from "./getISOCode"
import { Maybe } from "../../types/common/Base.types"

export function getFlag(country: Maybe<string>) {
  if (!country) return
  const iSOCode = getISOCode(country)
  if (!iSOCode) return
  return `https://flagcdn.com/${iSOCode.toLowerCase()}.svg`
}
