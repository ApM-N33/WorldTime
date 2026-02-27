import { getTimeData } from "../../utils/helpers/getTimeData"
import { FrozenLap } from "../../models/FrozenLap"
import type { IStopwatch } from "../../types/stopwatch/Stopwatch.types"
import type { IFrozenLap } from "../../types/frozenLap/FrozenLap.types"
import type { IStopwatchDom } from "../../types/stopwatch/StopwatchDom.types"
import type { IStopwatchTimers } from "../../types/stopwatch/StopwatchTimers.types"
import type { Tstopwatch } from "../../types/baseController/controllers.types"
import {
  animate as animation,
  type TAnimate,
} from "../../utils/domUtils/animate"

export class Stopwatch implements IStopwatch {
  public isStarted: boolean
  public stopwatchStartMs: number
  public stopwatchCurrentMs: number
  public stopwatchStopMs: number
  
  public lapStartMs: number
  public lapCurrentMs: number
  public lapStopMs: number
  public frozenLaps: IFrozenLap[]

  public stopwatchDom!: IStopwatchDom
  public stopwatchTimers!: IStopwatchTimers
  public animate: TAnimate

  constructor() {
    this.isStarted = true
    this.stopwatchStartMs = 0
    this.stopwatchCurrentMs = 0
    this.stopwatchStopMs = 0
    this.lapStartMs = 0
    this.lapCurrentMs = 0
    this.lapStopMs = 0
    this.frozenLaps = []
    this.animate = animation()
  }

  public setDeps(deps?: Tstopwatch): void {
    if (!deps) return
    this.stopwatchDom = deps.dom
    this.stopwatchTimers = deps.timers
  }

  public start(): void {
    this.stopwatchStartMs = performance.now()
    this.lapStartMs = performance.now()
    this.loop()
    this.stopwatchDom.showRightBlock()
    this.stopwatchDom.showStopBtn()
    this.stopwatchDom.showLapBtnActive()
  }

  public stop(): void {
    this.stopwatchStopMs = this.stopwatchCurrentMs
    this.lapStopMs = this.lapCurrentMs
    this.stopwatchTimers.cancelUpdate("stopwatchId")
    this.stopwatchDom.showStartBtn()
    this.stopwatchDom.showResetBtn()
  }

  public animateFrozenLap(): void {
    const { frozenLapsEl } = this.stopwatchDom
    const frozenLap = [...frozenLapsEl].toReversed().at(-1)
    if (frozenLap) this.animate(frozenLap, "in")
  }

  public addLap(): void {
    this.lapStopMs = this.lapCurrentMs
    const frozenTime = getTimeData(this.lapStopMs).time
    this.frozenLaps.push(new FrozenLap(frozenTime))
    this.stopwatchDom.renderFrozenLaps()
    this.animateFrozenLap()
    this.stopwatchDom.updateMinMaxLapColors()
    this.stopwatchDom.showMsArrowLap()
    this.lapStartMs = performance.now()
    this.lapCurrentMs = 0
    this.lapStopMs = 0
  }

  public reset(): void {
    this.clearState()
    this.stopwatchDom.showLapBtnDisable()
    this.stopwatchDom.renderFrozenLaps()
    this.stopwatchDom.hideRightBlock()
    this.stopwatchDom.hideMsArrowLap()
    this.stopwatchTimers.cancelUpdate("stopwatchId")
    this.updateAll()
  }

  public getFinishedAnimation(...rest: HTMLElement[]): Promise<Animation[]> {
    return Promise.all(rest.map((el) => this.animate(el, "out").finished))
  }

  private wasOneClick = false
  public async finallyReset(): Promise<void> {
    if (this.frozenLaps.length > 0 && !this.wasOneClick) {
      this.wasOneClick = true
      await this.getFinishedAnimation(...this.stopwatchDom.frozenLapsEl)
      this.reset()
      this.wasOneClick = false
    } else {
      this.reset()
    }
  }

  public clearState(): void {
    this.isStarted = true
    this.stopwatchStartMs = performance.now()
    this.stopwatchCurrentMs = 0
    this.stopwatchStopMs = 0
    this.lapStartMs = performance.now()
    this.lapCurrentMs = 0
    this.lapStopMs = 0
    this.frozenLaps.length = 0
  }

  public calculateMs(): void {
    this.stopwatchCurrentMs =
      this.stopwatchStopMs + (performance.now() - this.stopwatchStartMs)
    this.lapCurrentMs = this.lapStopMs + (performance.now() - this.lapStartMs)
  }

  public updateAll(): void {
    this.calculateMs()
    const stopwatch = getTimeData(this.stopwatchCurrentMs)
    const lap = getTimeData(this.lapCurrentMs)
    this.stopwatchDom.updateSmoothArrows(stopwatch.angle, lap.angle)
    this.stopwatchDom.updateDegreesArrows(
      stopwatch.msAngle,
      stopwatch.minAngle,
      lap.msAngle,
    )
    this.stopwatchDom.updateTimeText(stopwatch.time, lap.time)
  }

  public loop(): void {
    this.updateAll()
    this.stopwatchTimers.update(() => this.loop(), "stopwatchId")
  }

  public handleStartStop(): void {
    if (this.isStarted) this.start()
    else this.stop()
    this.isStarted = !this.isStarted
  }

  public handleAddReset(e: MouseEvent): void {
    if (!(e.target instanceof HTMLElement)) return
    if (e.target.textContent === "Lap") this.addLap()
    if (e.target.textContent === "Reset") this.finallyReset()
  }
}
