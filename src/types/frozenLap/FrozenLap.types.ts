import type { IBaseModel, Maybe, TBaseFrozenTime } from "../common/Base.types"

interface IFrozenLapProperties extends IBaseModel {
  frozenTime: TBaseFrozenTime
  savedFrozenLap: Maybe<HTMLElement>
}

interface IFrozenLapMethods {
  create(i: number): HTMLElement
}

export interface IFrozenLap extends IFrozenLapProperties, IFrozenLapMethods {}
