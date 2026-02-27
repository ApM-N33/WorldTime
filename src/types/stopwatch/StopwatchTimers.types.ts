import {
  Timers,
  type IControllerMethods,
  type TBaseTimerID,
} from "../common/Base.types"
import type { IStopwatch } from "./Stopwatch.types"
import type { IStopwatchDom } from "./StopwatchDom.types"

interface IStopwatchTimersProperties {
  timers: Timers
  stopwatch: IStopwatch
  stopwatchDom: IStopwatchDom
}

interface IStopwatchTimersMethods
  extends Omit<IControllerMethods, "bindEvents"> {
  update(callback: () => void, id: TBaseTimerID): void
  cancelUpdate(id: TBaseTimerID): void
}

export interface IStopwatchTimers
  extends IStopwatchTimersProperties,
    IStopwatchTimersMethods {}
