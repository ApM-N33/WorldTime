import type { TuseNoResultsFound } from "../../utils/domUtils/useNoResultsFound"
import {
  type IControllerMethods,
  type Maybe,
  TInputEl,
} from "../common/Base.types"
import type { ITimezoneItem } from "../timezoneItem/TimezoneItem.types"
import type { TuseKeydown } from "../useKeydown/useKeydown.types"
import type { IWorldTime } from "./WorldTime.types"
import type { IWorldTimeTimers } from "./WorldTimeTimers.types"

interface IWorldTimeDomProperties {
  timeText: Maybe<HTMLElement>
  dateText: Maybe<HTMLElement>
  offsetText: Maybe<HTMLElement>
  cityText: Maybe<HTMLElement>
  flagLogo: Maybe<HTMLImageElement>
  timerBlock: Maybe<HTMLElement>
  timerRightBlock: Maybe<HTMLElement>
  timezonesList: Maybe<HTMLElement>
  searchForm: Maybe<HTMLElement>
  searchInput: Maybe<TInputEl>
  addCityBtn: Maybe<HTMLElement>
  modal: Maybe<HTMLElement>
  timezonesItems: NodeListOf<HTMLElement>
  citiesCards: HTMLElement[]
  citiesList: Maybe<HTMLElement>
  citiesActionsList: Maybe<HTMLElement>
  deleteCheckedCitiesBtn: Maybe<HTMLElement>
  clearAllCitiesBtn: Maybe<HTMLElement>
  worldTime: IWorldTime
  worldTimeTimers: IWorldTimeTimers
  timezoneItem: ITimezoneItem
  keydown: TuseKeydown
  r: TuseNoResultsFound
  handleModalActiveDebounce: () => void
  handleSearchTimezoneDebounce: (e: Event) => void
}

interface IWorldTimeDomMethods extends IControllerMethods {
  renderTimezonesItems(): void
  renderCities(): void
  updateCities(): void
  handleModalActive(): void
  handleModalHide(e: MouseEvent): void
  showModal(): void
  hideModal(): void
  showTimerRightBlock(): void
  hideTimerRightBlock(): void
  showCitiesActionsList(): void
  hideCitiesActionsList(): void
}

export interface IWorldTimeDom
  extends IWorldTimeDomProperties, IWorldTimeDomMethods {}
