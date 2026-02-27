import {
  TBaseTimeZone,
  Maybe,
  type IControllerMethods,
} from "../common/Base.types"
import type { IConverterDom } from "./ConverterDom.types"
import type { Tconverters } from "./ConverterDeps.types"
import type { IConverterTimers } from "./ConverterTimers.types"
import { TuseModal } from '../useModal/useModal.types';

interface IConverterProperties {
  id: string
  savedTime:string
  findedTimezone: Maybe<TBaseTimeZone>
  timezones: TBaseTimeZone[]
  copiedTimezones: TBaseTimeZone[]
  converterDom: IConverterDom
  converterTimers: IConverterTimers
  converterInstances: Tconverters[]
  m: TuseModal
}

interface IConverterMethods extends Omit<IControllerMethods, "bindEvents"> {
  initTimezones(): void
  reset(): void
  handleConvertTime(e: Event): void
  handleSearchTimezone(e: Event): void
  handleAddTimezone(e: SubmitEvent): void
  handleSelectTimezone(e: MouseEvent): void
}

export interface IConverter extends IConverterProperties, IConverterMethods {}
