import type { TBaseID } from "../common/Base.types"
import { IConverter } from "./Converter.types"
import type { IConverterDom } from "./ConverterDom.types"
import { IConverterTimers } from "./ConverterTimers.types"

export type Tconverters = {
  id: TBaseID
  app: IConverter
  dom: IConverterDom
  timers: IConverterTimers
}

export type TConverterDeps = {
  converters: Tconverters
  converterInstances: Tconverters[]
}
