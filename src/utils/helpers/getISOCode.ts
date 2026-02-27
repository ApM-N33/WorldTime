import { getAllCountries } from "countries-and-timezones"
import { Maybe } from "../../types/common/Base.types"

export type TAllCountries = ReturnType<typeof getAllCountries>
export type TiSOCode = keyof TAllCountries

const countries = Object.values(getAllCountries()).map(({ id, name }) => ({
  iSOCode: id,
  name,
}))

export function getISOCode(country: Maybe<string>) {
  if (!country) return
  return countries.find((c) => c.name.toLowerCase() === country?.toLowerCase())
    ?.iSOCode
}
