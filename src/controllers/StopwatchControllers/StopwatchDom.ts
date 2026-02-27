import type { Tstopwatch } from "../../types/baseController/controllers.types"
import type { Maybe } from "../../types/common/Base.types"
import type { IStopwatch } from "../../types/stopwatch/Stopwatch.types"
import type { IStopwatchDom } from "../../types/stopwatch/StopwatchDom.types"
import type { IStopwatchTimers } from "../../types/stopwatch/StopwatchTimers.types"
import { addClass, removeClass } from "../../utils/domUtils/addRemoveClasses"
import { $ } from "../../utils/domUtils/query"
import { getTotalMs } from "../../utils/helpers/getTotalMs"
import { parseLapTime } from "../../utils/helpers/parseLapTime"

export class StopwatchDom implements IStopwatchDom {
  public msArrow: Maybe<HTMLElement>
  public msArrowLap: Maybe<HTMLElement>
  public minArrow: Maybe<HTMLElement>
  public lapRunningLabel: Maybe<HTMLElement>
  public lapRunningTime: Maybe<HTMLElement>
  public stopwatchBlock: Maybe<HTMLElement>
  public stopwatchBlockRight: Maybe<HTMLElement>
  public frozenLapsList: Maybe<HTMLElement>
  public startBtn: Maybe<HTMLElement>
  public lapBtn: Maybe<HTMLButtonElement>
  public stopwatchTimes: NodeListOf<HTMLElement>
  public stopwatch!: IStopwatch
  public stopwatchTimers!: IStopwatchTimers

  constructor() {
    this.msArrow = $(".stopwatch-analog--miliseconds-arrow", "one")
    this.msArrowLap = $(".stopwatch-analog--miliseconds-arrow-lap", "one")
    this.minArrow = $(".stopwatch-analog--minutes-arrow", "one")
    this.lapRunningLabel = $(".lap__label--running", "one")
    this.lapRunningTime = $(".time-text--lap-running", "one")
    this.stopwatchBlock = $(".stopwatch-block", "one")
    this.stopwatchBlockRight = $(".stopwatch-block__right", "one")
    this.frozenLapsList = $(".frozen-laps-list", "one")
    this.stopwatchTimes = $(".time-text--stopwatch", "all")
    this.startBtn = $(".btn--stopwatch-start", "one")
    this.lapBtn = $<HTMLButtonElement>(".btn--stopwatch-lap", "one")
  }

  public setDeps(deps?: Tstopwatch): void {
    if (!deps) return
    this.stopwatch = deps.app
    this.stopwatchTimers = deps.timers
  }

  public bindEvents(): void {
    if (!this.startBtn || !this.lapBtn) return
    this.startBtn.addEventListener("click", () => {
      this.stopwatch.handleStartStop()
    })
    this.lapBtn.addEventListener("click", (e) => {
      this.stopwatch.handleAddReset(e)
    })
  }

  public renderFrozenLaps() {
    if (!this.frozenLapsList) return
    const frozenLaps = this.stopwatch.frozenLaps
      .map((frozenLap, i) => frozenLap.create(i))
      .toReversed()
    this.frozenLapsList.replaceChildren(...frozenLaps)
  }

  get frozenLapsEl(): NodeListOf<HTMLElement> {
    return document.querySelectorAll(".lap--frozen")
  }

  public getTotalFrozenMsArray(
    frozenLapsEl: NodeListOf<HTMLElement>,
  ): number[] {
    return [...frozenLapsEl].map((frLapEl) => {
      const frozenTime = frLapEl.querySelector(".time-text--lap-frozen")
      if (!frozenTime) return 0
      return getTotalMs(parseLapTime(frozenTime.textContent))
    })
  }

  public updateMinMaxLapColors(): void {
    const totalsMsArray = this.getTotalFrozenMsArray(this.frozenLapsEl)
    let maxTotalMs = Math.max(...totalsMsArray)
    let minTotalMs = Math.min(...totalsMsArray)
    let isRed = false
    let isGreen = false
    this.frozenLapsEl.forEach((frLapEl, _, { length }) => {
      const frozenTime = frLapEl.querySelector(".time-text--lap-frozen")
      if (!frozenTime) return
      const totalMs = getTotalMs(parseLapTime(frozenTime.textContent))
      if (totalMs === maxTotalMs && !isRed && length > 1) {
        addClass(frLapEl, "is-red")
        isRed = true
      }
      if (totalMs === minTotalMs && !isGreen && length > 1) {
        addClass(frLapEl, "is-green")
        isGreen = true
      }
    })
  }

  public updateSmoothArrows(
    stopwatchMsAngle: number,
    lapMsAngle: number,
  ): void {
    if (!this.msArrow || !this.msArrowLap) return
    this.disableSmoothArrow(this.msArrow)
    this.disableSmoothArrow(this.msArrowLap)
    if (stopwatchMsAngle !== 0) {
      this.enableSmoothArrow(this.msArrow)
    }
    if (lapMsAngle !== 0) {
      this.enableSmoothArrow(this.msArrowLap)
    }
  }

  public updateDegreesArrows(
    stopwatchMsAngle: string,
    stopwatchMinAngle: string,
    lapMsAngle: string,
  ): void {
    if (!(this.msArrow && this.minArrow && this.msArrowLap)) return
    this.msArrow.style.transform = stopwatchMsAngle
    this.minArrow.style.transform = stopwatchMinAngle
    this.msArrowLap.style.transform = lapMsAngle
  }

  public updateTimeText(stopwatchTimeText: string, lapTimeText: string): void {
    if (!(this.lapRunningLabel && this.lapRunningTime)) return
    this.stopwatchTimes.forEach((stopwatchTime) => {
      stopwatchTime.textContent = stopwatchTimeText
    })
    this.lapRunningLabel.textContent = `Lap ${
      this.stopwatch.frozenLaps.length + 1
    }`
    this.lapRunningTime.textContent = lapTimeText
  }

  public enableSmoothArrow(arrow: HTMLElement): void {
    addClass(arrow, "is-smooth")
  }

  public disableSmoothArrow(arrow: HTMLElement): void {
    removeClass(arrow, "is-smooth")
  }

  public showMsArrowLap(): void {
    if (!this.msArrowLap) return
    addClass(this.msArrowLap, "is-active")
  }

  public hideMsArrowLap(): void {
    if (!this.msArrowLap) return
    removeClass(this.msArrowLap, "is-active")
  }

  public showRightBlock(): void {
    if (!this.stopwatchBlock) return
    addClass(this.stopwatchBlock, "is-active")
  }

  public hideRightBlock(): void {
    if (!this.stopwatchBlock) return
    removeClass(this.stopwatchBlock, "is-active")
  }

  public showStopBtn(): void {
    if (!this.startBtn) return
    addClass(this.startBtn, "is-stoped")
    this.startBtn.textContent = "Stop"
  }

  public showStartBtn(): void {
    if (!this.startBtn) return
    removeClass(this.startBtn, "is-stoped")
    this.startBtn.textContent = "Start"
  }

  public showLapBtnActive(): void {
    if (!this.lapBtn) return
    addClass(this.lapBtn, "is-active")
    this.lapBtn.disabled = false
    this.lapBtn.textContent = "Lap"
  }

  public showLapBtnDisable(): void {
    if (!this.lapBtn) return
    removeClass(this.lapBtn, "is-active")
    this.lapBtn.disabled = true
    this.lapBtn.textContent = "Lap"
  }

  public showResetBtn(): void {
    if (!this.lapBtn) return
    this.lapBtn.disabled = false
    this.lapBtn.textContent = "Reset"
  }
}
