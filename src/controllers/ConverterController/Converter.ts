import { IConverter } from "../../types/converter/Converter.types"
import { Maybe, TBaseTimeZone, TInputEl } from "../../types/common/Base.types"
import { getFetch } from "../../api/getFetch"
import { API_ENDPOINTS } from "../../utils/constants/API_ENDPOINTS"
import { getDisplayTimezones } from "../../utils/helpers/getDisplayTimezones"
import { getWithSlashTimezone } from "../../utils/helpers/getSplited"
import { normalizeString } from "../../utils/helpers/normalizeString"
import {
  TConverterDeps,
  type Tconverters,
} from "../../types/converter/ConverterDeps.types"
import { DateTime } from "../../libs/luxon"
import { REG } from "../../utils/constants/REGEX"
import { findTimeZone } from "../../utils/helpers/findTimeZone"
import type { IConverterDom } from "../../types/converter/ConverterDom.types"
import type { IConverterTimers } from "../../types/converter/ConverterTimers.types"
import { isInvalidTimezoneInput } from "../../utils/helpers/isInvalidTimezoneInput"
import { MESSAGES } from "../../utils/constants/MESSAGES"
import { useModal } from "../../utils/domUtils/useModal"
import { TuseModal } from "../../types/useModal/useModal.types"

export class Converter implements IConverter {
  public id!: string
  public savedTime: string
  public findedTimezone: Maybe<TBaseTimeZone>
  public timezones: TBaseTimeZone[]
  public copiedTimezones: TBaseTimeZone[]
  public converterInstances: Tconverters[]
  public converterDom!: IConverterDom
  public converterTimers!: IConverterTimers
  public m: TuseModal

  constructor() {
    this.findedTimezone = null
    this.timezones = []
    this.copiedTimezones = []
    this.converterInstances = []
    this.m = useModal()
    this.savedTime = ""
  }

  public setDeps(deps?: TConverterDeps): void {
    if (!deps) return
    const { converters, converterInstances } = deps
    this.id = converters.id
    this.converterDom = converters.dom
    this.converterTimers = converters.timers
    this.converterInstances = converterInstances
  }

  public initTimezones(): void {
    this.m.needToNotify(MESSAGES.loading)
    getFetch<TBaseTimeZone[]>(API_ENDPOINTS.timezones).then((res) => {
      if (!res.data || res.isError) {
        this.m.needToNotify(MESSAGES.error(res.errMessage), res.isError)
        return
      }
      this.copiedTimezones = getDisplayTimezones(res.data)
      this.m.needToNotify(MESSAGES.succes)
    })
  }

  public reset(): void {
    if (!this.converterDom.searchInput) return
    this.converterDom.searchInput.value = ""
    this.timezones.length = 0
  }

  public handleSelectTimezone(e: MouseEvent): void {
    const target = e.target as HTMLElement
    if (!target.matches("li")) return
    e.stopPropagation()
    this.findedTimezone = findTimeZone(this.copiedTimezones, target.textContent)
    this.reset()
    this.converterDom.hideTimezonesList()
    this.converterDom.hideDropdownBlock()
    this.converterDom.renderTimezonesItems()
  }

  public handleSearchTimezone(e: Event): void {
    const input = e.target as TInputEl
    this.timezones = this.copiedTimezones.filter((tz) => {
      return normalizeString(tz).includes(normalizeString(input.value))
    })
    if (this.timezones.length > 0) this.converterDom.showTimezonesList()
    if (isInvalidTimezoneInput(input.value)) {
      this.reset()
      this.converterDom.hideTimezonesList()
    }
    this.converterDom.r.showOrHideNoResultsFoundText(
      this.timezones,
      input.value,
    )
    this.converterDom.renderTimezonesItems()
  }

  public handleAddTimezone(e: SubmitEvent): void {
    e.preventDefault()
    const input = this.converterDom.searchInput
    if (!input) return
    this.findedTimezone = findTimeZone(this.copiedTimezones, input.value)
    if (!input.value) return
    this.converterDom.hideTimezonesList()
    this.converterDom.hideDropdownBlock()
    this.reset()
    this.converterDom.renderTimezonesItems()
  }

  public handleConvertTime(e: Event): void {
    const input = e.target as TInputEl
    if (!REG.convert.test(input.value)) {
      input.value = this.savedTime
      this.m.showMessage(MESSAGES.inValidTime)
      return
    }

    const [hour, minute] = input.value.split(":").map(Number)
    const activeBlockTime = DateTime.now()
      .setZone(getWithSlashTimezone(this.findedTimezone))
      .set({ hour, minute })

    for (const { dom, app, id } of this.converterInstances) {
      if (!dom.timeDisplayInput || this.id === id) continue
      const disableBlockTime = activeBlockTime.setZone(
        getWithSlashTimezone(app.findedTimezone),
      )
      const disableBlockInput = dom.timeDisplayInput
      disableBlockInput.value = disableBlockTime.toFormat("HH:mm")
    }
  }
}
