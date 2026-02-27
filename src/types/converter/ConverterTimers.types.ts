import type { IControllerMethods, TBaseID, Timers } from "../common/Base.types"
import { TBaseTimerID } from "../common/Base.types"
import type { IConverterDom } from "./ConverterDom.types"
import type { Tconverters } from "./ConverterDeps.types"
import type { IConverter } from "./Converter.types"

interface IConverterTimersProperties {
  id: TBaseID
  timers: Timers
  converterInstances: Tconverters[]
  converterDom: IConverterDom
  converter: IConverter
}

interface IConverterTimersMethods extends Omit<
  IControllerMethods,
  "bindEvents"
> {
  update(id: TBaseTimerID): void
  cancelUpdate(id: TBaseTimerID): void
}

export interface IConverterTimers
  extends IConverterTimersProperties, IConverterTimersMethods {}
