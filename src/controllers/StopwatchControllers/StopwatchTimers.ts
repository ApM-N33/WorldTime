import type { Tstopwatch } from "../../types/baseController/controllers.types"
import type { TBaseTimerID, Timers } from "../../types/common/Base.types"
import type { IStopwatch } from "../../types/stopwatch/Stopwatch.types"
import type { IStopwatchDom } from "../../types/stopwatch/StopwatchDom.types"
import type { IStopwatchTimers } from "../../types/stopwatch/StopwatchTimers.types"

export class StopwatchTimers implements IStopwatchTimers {
  public timers: Timers
  public stopwatch!: IStopwatch
  public stopwatchDom!: IStopwatchDom

  constructor() {
    this.timers = {}
  }

  public setDeps(deps?: Tstopwatch): void {
    if (!deps) return
    this.stopwatch = deps.app
    this.stopwatchDom = deps.dom
  }

  public update(callback: () => void, id: TBaseTimerID): void {
    if (this.timers[id]) {
      cancelAnimationFrame(this.timers[id])
    }
    this.timers[id] = requestAnimationFrame(callback)
  }

  public cancelUpdate(id: TBaseTimerID): void {
    if (this.timers[id]) cancelAnimationFrame(this.timers[id])
  }
}
