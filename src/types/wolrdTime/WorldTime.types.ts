import type { ICity } from "../city/City.types"
import type {
  IControllerMethods,
  Maybe,
  TBaseTimeZone,
} from "../common/Base.types"
import type { IWorldTimeDom } from "./WorldTimeDom.types"
import type { IWorldTimeTimers } from "./WorldTimeTimers.types"
import { TuseModal } from "../useModal/useModal.types"
import type { TAnimate } from "../../utils/domUtils/animate"

interface IWorldTimeProperties {
  cities: ICity[]
  selectedTimezones: Set<TBaseTimeZone>
  dublicated: TBaseTimeZone[]
  timezones: TBaseTimeZone[]
  copiedTimezones: TBaseTimeZone[]
  isError: Maybe<boolean>
  m: TuseModal
  worldTimeTimers: IWorldTimeTimers
  worldTimeDom: IWorldTimeDom
  checkedCities: Set<string>
  animatedCities: Set<string>
  animate: TAnimate
}

interface IWorldTimeMethods extends Omit<IControllerMethods, "bindEvents"> {
  getFetchTimezones(): Promise<void>
  isSameCity(cities: ICity[], value: Maybe<TBaseTimeZone>): boolean
  addCity(value: TBaseTimeZone): void
  resetCities(): void
  resetTimezones(): void
  resetSearchInput(): void
  resetDublicatesTimezones(): void
  resetSelectedTimezones(): void
  resetCheckedCities(): void
  resetAnimatedCities(): void
  reset(): void
  hasDublicate(selectedTimezones: Set<TBaseTimeZone>): boolean
  addInSelected(value: TBaseTimeZone): void
  deleteFromSelected(value: TBaseTimeZone): void
  toggleSelected(value: TBaseTimeZone, target: HTMLElement): void
  addAllSelectedTimezones(): void
  notifyAndReset(message: TBaseTimeZone): void
  handleSearchTimezone(e: Event): void
  handleSelectCity(e: MouseEvent): void
  handleAddCities(e: SubmitEvent): void
  handleDeleteCity(e: MouseEvent): Promise<void>
  handleCheckCity(e: Event): void
  handleDeleteCheckedCities(): Promise<void>
  handleClearAllCities(): Promise<void>
  animateCities(): void
  getFinishedAnimation(...rest: HTMLElement[]): Promise<Animation[]>
}

export interface IWorldTime extends IWorldTimeProperties, IWorldTimeMethods {}
