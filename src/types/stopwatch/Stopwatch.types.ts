import type { TAnimate } from "../../utils/domUtils/animate"
import type { IControllerMethods } from "../common/Base.types"
import type { IFrozenLap } from "../frozenLap/FrozenLap.types"
import { IStopwatchDom } from "./StopwatchDom.types"
import { IStopwatchTimers } from "./StopwatchTimers.types"

interface IStopwatchProperties {
  isStarted: boolean
  stopwatchStartMs: number
  stopwatchCurrentMs: number
  stopwatchStopMs: number
  lapStartMs: number
  lapCurrentMs: number
  lapStopMs: number
  frozenLaps: IFrozenLap[]
  stopwatchDom: IStopwatchDom
  stopwatchTimers: IStopwatchTimers
  animate: TAnimate
}

interface IStopwatchMethods extends Omit<IControllerMethods, "bindEvents"> {
  start(): void
  stop(): void
  addLap(): void
  animateFrozenLap(): void
  reset(): void
  finallyReset(): Promise<void>
  clearState(): void
  calculateMs(): void
  updateAll(): void
  loop(): void
  handleStartStop(): void
  handleAddReset(e: MouseEvent): void
  getFinishedAnimation(...rest: HTMLElement[]): Promise<Animation[]>
}

export interface IStopwatch extends IStopwatchProperties, IStopwatchMethods {}
