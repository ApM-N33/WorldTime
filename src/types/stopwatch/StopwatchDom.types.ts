import type { IControllerMethods, Maybe } from "../common/Base.types"
import type { IStopwatch } from "./Stopwatch.types"
import type { IStopwatchTimers } from "./StopwatchTimers.types"

interface IStopwatchDomProperties {
  msArrow: Maybe<HTMLElement>
  msArrowLap: Maybe<HTMLElement>
  minArrow: Maybe<HTMLElement>
  stopwatchTimes: NodeListOf<HTMLElement>
  lapRunningLabel: Maybe<HTMLElement>
  lapRunningTime: Maybe<HTMLElement>
  stopwatchBlock: Maybe<HTMLElement>
  stopwatchBlockRight: Maybe<HTMLElement>
  frozenLapsList: Maybe<HTMLElement>
  startBtn: Maybe<HTMLElement>
  lapBtn: Maybe<HTMLButtonElement>
  frozenLapsEl: NodeListOf<HTMLElement>
  stopwatch: IStopwatch
  stopwatchTimers: IStopwatchTimers
}

interface IStopwatchDomMethods extends IControllerMethods {
  renderFrozenLaps(): void
  getTotalFrozenMsArray(frozenLapsEl: NodeListOf<HTMLElement>): number[]
  updateMinMaxLapColors(): void
  updateSmoothArrows(stopwatchMsAngle: number, lapMsAngle: number): void
  updateDegreesArrows(
    stopwatchMsAngle: string,
    stopwatchMinAngle: string,
    lapMsAngle: string
  ): void
  updateTimeText(stopwatchTimeText: string, lapTimeText: string): void
  enableSmoothArrow(arrow: HTMLElement): void
  disableSmoothArrow(arrow: HTMLElement): void
  showMsArrowLap(): void
  hideMsArrowLap(): void
  showRightBlock(): void
  hideRightBlock(): void
  showStopBtn(): void
  showStartBtn(): void
  showLapBtnActive(): void
  showLapBtnDisable(): void
  showResetBtn(): void
}

export interface IStopwatchDom
  extends IStopwatchDomProperties,
    IStopwatchDomMethods {}
