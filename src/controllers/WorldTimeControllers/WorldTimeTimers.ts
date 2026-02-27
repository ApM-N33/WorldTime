import type { TworldTime } from "../../types/baseController/controllers.types"
import type { TBaseTimerID, Timers } from "../../types/common/Base.types"
import type { IWorldTime } from "../../types/wolrdTime/WorldTime.types"
import type { IWorldTimeDom } from "../../types/wolrdTime/WorldTimeDom.types"
import type { IWorldTimeTimers } from "../../types/wolrdTime/WorldTimeTimers.types"
import { setDateParts } from "../../utils/helpers/setDateParts"

export class WorldTimeTimers implements IWorldTimeTimers {
  public timers: Timers
  public worldTime!: IWorldTime
  public worldTimeDom!: IWorldTimeDom

  constructor() {
    this.timers = {}
  }

  public setDeps(deps?: TworldTime): void {
    if (!deps) return
    this.worldTime = deps.app
    this.worldTimeDom = deps.dom
  }

  public updateLeftTimer(id: TBaseTimerID): void {
    if (this.timers[id]) clearTimeout(this.timers[id])
    setDateParts(this.worldTimeDom)
    this.timers[id] = setTimeout(() => this.updateLeftTimer(id), 1000)
  }

  public updateRightTimers(id: TBaseTimerID): void {
    if (this.timers[id]) clearTimeout(this.timers[id])
    if (this.worldTime.cities.length === 0) return
    for (const city of this.worldTime.cities) {
      setDateParts(city, city.timeZone)
    }
    this.timers[id] = setTimeout(() => this.updateRightTimers(id), 1000)
  }
}
