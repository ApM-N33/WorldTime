import type {
  IControllerMethods,
  TBaseTimerID,
  Timers,
} from "../common/Base.types"
import type { ITimezoneMap } from "./TimezoneMap.types"
import type { ITimezoneMapDom } from "./TimezoneMapDom.types"

interface ITimezoneMapTimersProperties {
  timers: Timers
  timezoneMap: ITimezoneMap
  timezoneMapDom: ITimezoneMapDom
}

interface ITimezoneMapTimersMethods extends Omit<
  IControllerMethods,
  "bindEvents"
> {
  update(id: TBaseTimerID): void
  cancelUpdate(id: TBaseTimerID): void
}

export interface ITimezoneMapTimers
  extends ITimezoneMapTimersProperties, ITimezoneMapTimersMethods {}
