import type {
  IControllerMethods,
  TBaseTimerID,
  Timers,
} from "../common/Base.types"
import type { IWorldTime } from "./WorldTime.types"
import type { IWorldTimeDom } from "./WorldTimeDom.types"

interface IWorldTimeTimersProperties {
  timers: Timers
  worldTime: IWorldTime
  worldTimeDom: IWorldTimeDom
}

interface IWorldTimeTimersMethods extends Omit<
  IControllerMethods,
  "bindEvents"
> {
  updateLeftTimer(id: TBaseTimerID): void
  updateRightTimers(id: TBaseTimerID): void
}

export interface IWorldTimeTimers
  extends IWorldTimeTimersProperties, IWorldTimeTimersMethods {}
