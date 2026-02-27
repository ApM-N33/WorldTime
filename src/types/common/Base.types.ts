import { TConverterDeps } from "../converter/ConverterDeps.types"
import type {
  Tstopwatch,
  TtimezoneMap,
  TworldTime,
} from "../baseController/controllers.types"

export type TBaseID = string
export type TBaseTimeZone = string
export type TBaseFrozenTime = string
export type TBaseTimerID = string
export type TInputEl = HTMLInputElement

export type Maybe<T> = T extends Element ? T | null : T | undefined | null

export type ValidValResults = {
  findedTimezone: Maybe<TBaseFrozenTime>
  inputVal: TBaseTimeZone
}

export type Timers = Record<string, number>

export interface IBaseModel {
  id: TBaseID
}

export interface IControllerMethods {
  setDeps(deps?: TworldTime | Tstopwatch | TConverterDeps | TtimezoneMap): void
  bindEvents(): void
}
