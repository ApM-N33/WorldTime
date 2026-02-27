import type { TBaseTimeZone } from "../types/common/Base.types"
import { ITimezoneItem } from "../types/timezoneItem/TimezoneItem.types"

export class TimezoneItem implements ITimezoneItem {
  public create(timeZone: TBaseTimeZone, className: string): HTMLElement {
    const timezoneItem = document.createElement("li")
    timezoneItem.textContent = timeZone
    timezoneItem.className = className
    return timezoneItem
  }
}
