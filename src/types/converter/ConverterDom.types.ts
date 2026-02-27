import { ITimezoneItem } from "../timezoneItem/TimezoneItem.types"
import { TuseKeydown } from "../useKeydown/useKeydown.types"
import { Maybe, type IControllerMethods, TInputEl } from "../common/Base.types"
import type { IConverterTimers } from "./ConverterTimers.types"
import type { IConverter } from "./Converter.types"
import type { Tconverters } from "./ConverterDeps.types"
import type { TuseNoResultsFound } from "../../utils/domUtils/useNoResultsFound"

interface IConverterDomProperties {
  id: string
  isReversed: boolean
  converterInstances: Tconverters[]
  timezoneItem: ITimezoneItem
  converterBlock: HTMLElement
  converterContainer: Maybe<HTMLElement>
  dropdownBtn: Maybe<HTMLElement>
  swapBtn: Maybe<HTMLElement>
  dropdownBlock: Maybe<HTMLElement>
  cityText: Maybe<HTMLElement>
  flagLogo: Maybe<HTMLImageElement>
  offsetText: Maybe<HTMLElement>
  timezonesList: Maybe<HTMLElement>
  timeDisplayInput: Maybe<TInputEl>
  searchInput: Maybe<TInputEl>
  searchForm: Maybe<HTMLElement>
  converter: IConverter
  converterTimers: IConverterTimers
  keydown: TuseKeydown
  r: TuseNoResultsFound
  handleSearchTimezoneDebounce: (e: Event) => void
  handleConvertTimeDebounce: (e: Event) => void
}

interface IConverterDomMethods extends IControllerMethods {
  renderConverterBlock(): void
  renderTimezonesItems(): void
  handleActiveDropdown(e: MouseEvent): void
  handleFocus(): void
  handleBlur(): void
  handleDocumentClick(e: MouseEvent): void
  handleReverseOrInitialConverters(): void
  showDropdownBlock(): void
  hideDropdownBlock(): void
  hideAllDropdownBlocks(): void
  showTimezonesList(): void
  hideTimezonesList(): void
  reverseConverters(): void
  initialConverters(): void
}

export interface IConverterDom
  extends IConverterDomProperties, IConverterDomMethods {}
