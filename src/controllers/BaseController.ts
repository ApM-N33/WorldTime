import { WorldTime } from "./WorldTimeControllers/WorldTime"
import { WorldTimeDom } from "./WorldTimeControllers/WorldTimeDom"
import { WorldTimeTimers } from "./WorldTimeControllers/WorldTimeTimers"
import { Stopwatch } from "./StopwatchControllers/Stopwatch"
import { StopwatchDom } from "./StopwatchControllers/StopwatchDom"
import { StopwatchTimers } from "./StopwatchControllers/StopwatchTimers"
import type { IBaseController } from "../types/baseController/BaseController.types"
import type { Tcontrollers } from "../types/baseController/controllers.types"
import { ConverterController } from "./ConverterController/ConverterController"
import { TimezoneMap } from "./TimezoneMapControllers/TimezoneMap"
import { TimezoneMapDom } from "./TimezoneMapControllers/TimezoneMapDom"
import { TimezoneMapTimers } from "./TimezoneMapControllers/TimezoneMapTimers"
import { MobileMenuDom } from "./MobileMenuController/MobileMenuDom"
import { NavigationDom } from "./NavigationController/NavigationDom"

export class BaseController implements IBaseController {
  public controllers: Tcontrollers
  constructor() {
    this.controllers = {
      worldTime: {
        app: new WorldTime(),
        dom: new WorldTimeDom(),
        timers: new WorldTimeTimers(),
      },
      stopwatch: {
        app: new Stopwatch(),
        dom: new StopwatchDom(),
        timers: new StopwatchTimers(),
      },
      converterController: new ConverterController(),
      timezoneMap: {
        app: new TimezoneMap(),
        dom: new TimezoneMapDom(),
        timers: new TimezoneMapTimers(),
      },
      mobileMenu: {
        dom: new MobileMenuDom(),
      },
      navigation: {
        dom: new NavigationDom(),
      },
    }
  }

  public transferOfDependencies(): void {
    const { worldTime, stopwatch, converterController, timezoneMap } =
      this.controllers

    worldTime.app.setDeps(worldTime)
    worldTime.dom.setDeps(worldTime)
    worldTime.timers.setDeps(worldTime)

    stopwatch.app.setDeps(stopwatch)
    stopwatch.dom.setDeps(stopwatch)
    stopwatch.timers.setDeps(stopwatch)

    converterController.setDeps()

    timezoneMap.app.setDeps(timezoneMap)
    timezoneMap.dom.setDeps(timezoneMap)
    timezoneMap.timers.setDeps(timezoneMap)
  }

  public async setup(): Promise<void> {
    const {
      worldTime,
      stopwatch,
      converterController,
      timezoneMap,
      mobileMenu,
      navigation,
    } = this.controllers

    mobileMenu.dom.bindEvents()
    navigation.dom.registerSections()
    navigation.dom.bindEvents()
    worldTime.timers.updateLeftTimer("leftBlockId")
    worldTime.dom.bindEvents()
    stopwatch.dom.bindEvents()
    converterController.activateConverters()
    await timezoneMap.app.initISOCountries()
    timezoneMap.dom.assignCountryIdsFromClass()
    timezoneMap.dom.bindEvents()
  }
}
