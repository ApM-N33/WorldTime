import type { TBaseTimeZone } from "../../types/common/Base.types"
import type { ICity } from "../../types/city/City.types"
import type { IConverterDom } from "../../types/converter/ConverterDom.types"
import type { IWorldTimeDom } from "../../types/wolrdTime/WorldTimeDom.types"
import { getDateParts } from "./getDateParts"
import { getFlag } from "./getFlag"
import { getDateTimeFormater } from "./getFormatersData"
import { getCityWithoutSlashOrComma } from "./getSplited"
import { City } from "../../models/City"
import { WorldTimeDom } from "../../controllers/WorldTimeControllers/WorldTimeDom"
import { ConverterDom } from "../../controllers/ConverterController/ConverterDom"
import { Maybe } from "../../types/common/Base.types"
import { getCountryForTimezone } from "countries-and-timezones"
import { TimezoneDetail } from "../../models/TimezoneDetails"
import type { ITimezoneDetail } from "../../types/timezoneDetails/TimezoneDetails.types"

const options: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
}

export function setDateParts(
  obj: IWorldTimeDom | ICity,
  timeZone?: Maybe<TBaseTimeZone>,
): void

export function setDateParts(
  obj: IConverterDom,
  timeZone: Maybe<TBaseTimeZone>,
): void

export function setDateParts(
  obj: ITimezoneDetail,
  timeZone: Maybe<TBaseTimeZone>,
): void

export function setDateParts(
  obj: IWorldTimeDom | ICity | IConverterDom | ITimezoneDetail,
  timeZone?: Maybe<TBaseTimeZone>,
) {
  const maybeOptions = obj instanceof TimezoneDetail ? options : {}
  const formater = getDateTimeFormater(timeZone, maybeOptions)
  const { week, month, day, year, hour, min, sec, offset } =
    getDateParts(formater)
  const resolvedTimeZone = formater.resolvedOptions().timeZone
  const city = getCityWithoutSlashOrComma(resolvedTimeZone)
  const flagSrc = getFlag(getCountryForTimezone(resolvedTimeZone)?.name)

  if (!flagSrc) return

  if (obj instanceof WorldTimeDom || obj instanceof City) {
    const { timeText, dateText, offsetText, cityText, flagLogo } = obj
    if (!timeText || !dateText || !offsetText || !cityText || !flagLogo) return
    timeText.textContent = `${hour}:${min}:${sec}`
    dateText.textContent = `${week}, ${day} ${month}, ${year}`
    cityText.textContent = `${city}`
    offsetText.textContent = `${offset}`
    flagLogo.src = flagSrc
    flagLogo.alt = "Flag"
  } else if (obj instanceof ConverterDom) {
    const { timeDisplayInput, offsetText, cityText, flagLogo } = obj
    if (!timeDisplayInput || !offsetText || !cityText || !flagLogo) return
    timeDisplayInput.value = `${hour}:${min}`
    cityText.textContent = !timeZone ? "Locale Time" : `${city}`
    offsetText.textContent = `${offset}`
    flagLogo.src = flagSrc
    flagLogo.alt = "Flag"
  } else if (obj instanceof TimezoneDetail) {
    const { detailDateItem, detailTimeItem, detailUTCItem, utcOffset } = obj
    if (!detailDateItem || !detailTimeItem || !detailUTCItem) return
    detailDateItem.textContent = `Date: ${week}, ${day}.${month}.${year}`
    detailTimeItem.textContent = `Time: ${hour}:${min}`
    detailUTCItem.textContent = `UTC: ${utcOffset}`
  }
}
