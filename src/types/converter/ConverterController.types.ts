import { IControllerMethods } from "../common/Base.types"
import type { Tconverters } from "./ConverterDeps.types"

interface IConverterControllerProperties {
  converters: Tconverters[]
  converterInstances: Tconverters[]
}

interface IConverterControllerMethods extends Omit<
  IControllerMethods,
  "bindEvents"
> {
  activateConverters(): void
}

export interface IConverterController
  extends IConverterControllerProperties, IConverterControllerMethods {}
