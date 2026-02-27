import { REG } from "../constants/REGEX"

export function normalizeString(str: string) {
  return str.toLowerCase().trim().replace(REG.invalidChars, "")
}
