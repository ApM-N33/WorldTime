import type { IConverterController } from "../converter/ConverterController.types"
import type { IMobileMenuDom } from "../mobileMenu/MobileMenuDom.types"
import type { INavigationDom } from "../navigation/NavigationDom.types"
import type { IStopwatch } from "../stopwatch/Stopwatch.types"
import type { IStopwatchDom } from "../stopwatch/StopwatchDom.types"
import type { IStopwatchTimers } from "../stopwatch/StopwatchTimers.types"
import type { ITimezoneMap } from "../timezone-map/TimezoneMap.types"
import type { ITimezoneMapDom } from "../timezone-map/TimezoneMapDom.types"
import type { ITimezoneMapTimers } from "../timezone-map/TimezoneMapTimers.types"
import { IWorldTime } from "../wolrdTime/WorldTime.types"
import { IWorldTimeDom } from "../wolrdTime/WorldTimeDom.types"
import { IWorldTimeTimers } from "../wolrdTime/WorldTimeTimers.types"

export type TworldTime = {
  app: IWorldTime
  dom: IWorldTimeDom
  timers: IWorldTimeTimers
}

export type Tstopwatch = {
  app: IStopwatch
  dom: IStopwatchDom
  timers: IStopwatchTimers
}

export type TtimezoneMap = {
  app: ITimezoneMap
  dom: ITimezoneMapDom
  timers: ITimezoneMapTimers
}

export type TmobileMenu = {
  dom: IMobileMenuDom
}

export type Tnavigation = {
  dom: INavigationDom
}

export type Tcontrollers = {
  worldTime: TworldTime
  stopwatch: Tstopwatch
  converterController: IConverterController
  timezoneMap: TtimezoneMap
  mobileMenu: TmobileMenu
  navigation: Tnavigation
}
