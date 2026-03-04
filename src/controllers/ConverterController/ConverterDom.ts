import { ConverterBlock } from "../../models/ConverterBlock"
import { TimezoneItem } from "../../models/TimezoneItem"
import { IConverterDom } from "../../types/converter/ConverterDom.types"
import { ITimezoneItem } from "../../types/timezoneItem/TimezoneItem.types"
import { TuseKeydown } from "../../types/useKeydown/useKeydown.types"
import { useKeydown } from "../../utils/domUtils/useKeydown"
import { Maybe, TInputEl } from "../../types/common/Base.types"
import { $ } from "../../utils/domUtils/query"
import { addClass, removeClass } from "../../utils/domUtils/addRemoveClasses"
import { debounce } from "../../utils/helpers/debounce"
import type {
  Tconverters,
  TConverterDeps,
} from "../../types/converter/ConverterDeps.types"
import type { IConverter } from "../../types/converter/Converter.types"
import type { IConverterTimers } from "../../types/converter/ConverterTimers.types"
import {
  useNoResultsFound,
  type TuseNoResultsFound,
} from "../../utils/domUtils/useNoResultsFound"

export class ConverterDom implements IConverterDom {
  public id!: string
  public isReversed: boolean
  public converterInstances: Tconverters[]
  public timezoneItem: ITimezoneItem
  public converterBlock: HTMLElement
  public converterContainer: Maybe<HTMLElement>
  public dropdownBtn: Maybe<HTMLElement>
  public swapBtn: Maybe<HTMLElement>
  public dropdownBlock: Maybe<HTMLElement>
  public cityText: Maybe<HTMLElement>
  public flagLogo: Maybe<HTMLImageElement>
  public offsetText: Maybe<HTMLElement>
  public timezonesList: Maybe<HTMLElement>
  public searchForm: Maybe<HTMLElement>
  public timeDisplayInput: Maybe<TInputEl>
  public searchInput: Maybe<TInputEl>
  public converter!: IConverter
  public converterTimers!: IConverterTimers
  public keydown: TuseKeydown
  public r: TuseNoResultsFound
  public handleSearchTimezoneDebounce: (e: Event) => void
  public handleConvertTimeDebounce: (e: Event) => void

  constructor() {
    this.isReversed = false
    this.converterInstances = []
    this.timezoneItem = new TimezoneItem()
    this.converterBlock = new ConverterBlock().create()
    const { converterBlock: root } = this
    this.converterContainer = $(".converter-block", "one")
    this.swapBtn = $(".btn--swap", "one")
    this.dropdownBtn = $(".btn--dropdown-converter", "one", root)
    this.dropdownBlock = $(".converter-dropdown", "one", root)
    this.cityText = $(".btn--dropdown-converter__city-text", "one", root)
    this.flagLogo = $<HTMLImageElement>(".logo--flag__img", "one", root)
    this.offsetText = $(".btn--dropdown-converter__offset-text", "one", root)
    this.timezonesList = $(".timezones-list", "one", root)
    this.timeDisplayInput = $<TInputEl>(".input--time-converter", "one", root)
    this.searchInput = $<TInputEl>(".input--timezones-dropdown-converter", "one", root)
    this.searchForm = $(".converter-dropdown__form", "one", root)
    this.handleSearchTimezoneDebounce = debounce((e) => {
      this.converter.handleSearchTimezone(e)
    }, 300)
    this.handleConvertTimeDebounce = debounce((e) => {
      this.converter.handleConvertTime(e)
    }, 300)
    this.keydown = useKeydown()
    this.r = useNoResultsFound(root)
  }

  public setDeps(deps?: TConverterDeps): void {
    if (!deps) return
    const { converters, converterInstances } = deps
    this.id = converters.id
    this.converter = converters.app
    this.converterTimers = converters.timers
    this.converterInstances = converterInstances
  }

  public bindEvents(): void {
    if (
      !this.dropdownBtn ||
      !this.searchInput ||
      !this.searchForm ||
      !this.timezonesList ||
      !this.timeDisplayInput ||
      !this.swapBtn
    ) {
      return
    }
    this.dropdownBtn.addEventListener("click", (e) => {
      this.handleActiveDropdown(e)
    })
    this.searchInput.addEventListener("input", (e) => {
      this.handleSearchTimezoneDebounce(e)
    })
    this.timeDisplayInput.addEventListener("focus", () => {
      this.handleFocus()
    })
    this.searchInput.addEventListener("keydown", (e) => {
      this.keydown.on(e, this.timezonesItems, this.searchInput!)
    })
    this.searchForm.addEventListener("submit", (e) => {
      this.converter.handleAddTimezone(e)
    })
    this.timezonesList.addEventListener("click", (e) => {
      this.converter.handleSelectTimezone(e)
    })
    this.timeDisplayInput.addEventListener("blur", () => {
      this.handleBlur()
    })
    this.timeDisplayInput.addEventListener("input", (e) => {
      this.handleConvertTimeDebounce(e)
    })
    document.addEventListener("click", (e) => {
      this.handleDocumentClick(e)
    })
    this.swapBtn.addEventListener("click", () => {
      this.handleReverseOrInitialConverters()
    })
  }

  get timezonesItems(): NodeListOf<HTMLElement> {
    return $(".timezones-list__timezone-item", "all", this.converterBlock)
  }

  public renderConverterBlock(): void {
    if (!this.converterContainer || !this.converterBlock) return
    this.converterContainer.appendChild(this.converterBlock)
  }

  public renderTimezonesItems(): void {
    if (!this.timezonesList) return
    this.keydown.reset()
    this.timezonesList.scrollTop = 0
    const timezones = this.converter.timezones.map((tz) => {
      const cn =
        "timezones-list__timezone-item timezones-list__timezone-item--dropdown-converter"
      return this.timezoneItem.create(tz, cn)
    })
    this.timezonesList.replaceChildren(...timezones)
  }

  public handleActiveDropdown(e: MouseEvent): void {
    if (!this.dropdownBlock || !this.searchInput) return
    e.stopPropagation()

    const isActive = this.dropdownBlock.classList.contains("is-active")
    this.hideAllDropdownBlocks()
    this.hideTimezonesList()

    if (this.searchInput.value || this.converter.timezones.length > 0) {
      this.converter.reset()
      this.renderTimezonesItems()
    }

    if (!isActive) {
      this.showDropdownBlock()
      this.searchInput.focus()
    }
  }

  public handleFocus(): void {
    this.converterInstances.forEach(({ timers }) => {
      timers.cancelUpdate("timeId")
    })
  }

  public handleBlur(): void {
    this.converterInstances.forEach(({ timers }) => {
      timers.update("timeId")
    })
  }

  public handleDocumentClick(e: MouseEvent): void {
    if (e.target !== this.dropdownBtn && e.target !== this.searchInput) {
      this.hideDropdownBlock()
      this.hideTimezonesList()
    }
  }

  public handleReverseOrInitialConverters() {
    if (!this.converterContainer) return
    this.isReversed = !this.isReversed
    if (this.isReversed) this.reverseConverters()
    else this.initialConverters()
  }

  public reverseConverters() {
    if (!this.converterContainer) return
    removeClass(this.converterContainer, "is-initial")
    addClass(this.converterContainer, "is-reversed")
  }

  public initialConverters() {
    if (!this.converterContainer) return
    removeClass(this.converterContainer, "is-reversed")
    addClass(this.converterContainer, "is-initial")
  }

  public showDropdownBlock(): void {
    if (!this.dropdownBlock) return
    addClass(this.dropdownBlock, "is-active")
  }

  public showTimezonesList(): void {
    if (!this.timezonesList) return
    addClass(this.timezonesList, "is-active")
  }

  public hideDropdownBlock(): void {
    if (!this.dropdownBlock) return
    removeClass(this.dropdownBlock, "is-active")
  }

  public hideAllDropdownBlocks(): void {
    this.converterInstances.forEach(({ dom }) => {
      dom.hideDropdownBlock()
    })
  }

  public hideTimezonesList(): void {
    if (!this.timezonesList) return
    removeClass(this.timezonesList, "is-active")
  }
}
