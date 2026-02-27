import type { TBaseTimeZone } from "../common/Base.types"

export interface ITimezoneItem {
  create(timeZone: TBaseTimeZone, className: string): HTMLElement
}
