import type { Timers } from "../../types/common/Base.types"
import type { IConverterTimers } from "../../types/converter/ConverterTimers.types"
import { TBaseTimerID } from "../../types/common/Base.types"
import type {
  TConverterDeps,
  Tconverters,
} from "../../types/converter/ConverterDeps.types"
import type { IConverterDom } from "../../types/converter/ConverterDom.types"
import { setDateParts } from "../../utils/helpers/setDateParts"
import type { IConverter } from "../../types/converter/Converter.types"

export class ConverterTimer implements IConverterTimers {
  public id!: string
  public timers: Timers
  public converterInstances: Tconverters[]
  public converterDom!: IConverterDom
  public converter!: IConverter

  constructor() {
    this.timers = {}
    this.converterInstances = []
  }

  public setDeps(deps?: TConverterDeps) {
    if (!deps) return
    const { converters, converterInstances } = deps
    this.id = converters.id
    this.converterDom = converters.dom
    this.converter = converters.app
    this.converterInstances = converterInstances
  }

  public update(id: TBaseTimerID): void {
    if (this.timers[id]) clearTimeout(this.timers[id])
    setDateParts(this.converterDom, this.converter.findedTimezone)
    const { timeDisplayInput } = this.converterDom
    if (timeDisplayInput) this.converter.savedTime = timeDisplayInput.value
    this.timers[id] = setTimeout(() => {
      this.update(id)
    }, 1000)
  }

  public cancelUpdate(id: TBaseTimerID): void {
    if (this.timers[id]) clearTimeout(this.timers[id])
  }
}
