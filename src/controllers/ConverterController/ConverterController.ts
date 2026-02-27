import { Converter } from "./Converter"
import { IConverterController } from "../../types/converter/ConverterController.types"
import { ConverterDom } from "./ConverterDom"
import { ConverterTimer } from "./ConverterTimer"
import type { Tconverters } from "../../types/converter/ConverterDeps.types"
import { getRandomID } from "../../utils/helpers/getRandomID"

export class ConverterController implements IConverterController {
  public converterInstances: Tconverters[]
  public converters: Tconverters[]

  constructor() {
    this.converterInstances = []
    this.converters = Array.from({ length: 2 }, (_) => ({
      id: getRandomID(),
      app: new Converter(),
      dom: new ConverterDom(),
      timers: new ConverterTimer(),
    }))
  }

  public setDeps(): void {
    for (const converter of this.converters) {
      this.converterInstances.push(converter)
      const converters = converter
      const converterInstances = this.converterInstances
      converter.app.setDeps({ converters, converterInstances })
      converter.dom.setDeps({ converters, converterInstances })
      converter.timers.setDeps({ converters, converterInstances })
    }
  }

  public activateConverters(): void {
    for (const converter of this.converters) {
      converter.dom.renderConverterBlock()
      converter.app.initTimezones()
      converter.timers.update("timeId")
      converter.dom.bindEvents()
    }
  }
}
