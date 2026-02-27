import type { TtimezoneMap } from "../../types/baseController/controllers.types"
import type { TBaseTimerID, Timers } from "../../types/common/Base.types"
import type { ITimezoneMap } from "../../types/timezone-map/TimezoneMap.types"
import type { ITimezoneMapDom } from "../../types/timezone-map/TimezoneMapDom.types"
import type { ITimezoneMapTimers } from "../../types/timezone-map/TimezoneMapTimers.types"
import { setDateParts } from "../../utils/helpers/setDateParts"

export class TimezoneMapTimers implements ITimezoneMapTimers {
  public timers: Timers
  public timezoneMap!: ITimezoneMap
  public timezoneMapDom!: ITimezoneMapDom

  constructor() {
    this.timers = {}
  }

  public setDeps(deps?: TtimezoneMap): void {
    if (!deps) return
    this.timezoneMap = deps.app
    this.timezoneMapDom = deps.dom
  }

  public update(id: TBaseTimerID) {
    if (this.timers[id]) clearTimeout(this.timers[id])
    if (this.timezoneMap.timezonesByCountry.size === 0) return
    for (const timezoneDetail of this.timezoneMap.timezoneDetails) {
      setDateParts(timezoneDetail, timezoneDetail.timeZone)
    }
    this.timers[id] = setTimeout(() => {
      this.update(id)
    }, 1000)
  }

  public cancelUpdate(id: TBaseTimerID): void {
    if (this.timers[id]) clearTimeout(this.timers[id])
  }
}
