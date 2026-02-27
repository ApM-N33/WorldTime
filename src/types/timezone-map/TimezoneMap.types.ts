import type { IControllerMethods } from "../common/Base.types"
import type { TuseModal } from "../useModal/useModal.types"
import type { TiSOCodesFromMap } from "./iso-countries.types"
import type { TCountriesTimezones } from "./countriesTimezones.types"
import type { ITimezoneMapDom } from "./TimezoneMapDom.types"
import type { ITimezoneMapTimers } from "./TimezoneMapTimers.types"
import { ITimezoneDetail } from "../timezoneDetails/TimezoneDetails.types"
import type { TAnimate } from "../../utils/domUtils/animate"

interface ITimezoneMapPropertiers {
  timezoneDetails: ITimezoneDetail[]
  iSOCodesFromMap: TiSOCodesFromMap
  timezonesByCountry: Map<string, TCountriesTimezones>
  currency: string
  maxScale: number
  minScale: number
  scale: number
  clickCount: number
  m: TuseModal
  timezoneMapDom: ITimezoneMapDom
  timezoneMapTimers: ITimezoneMapTimers
  pointers: Map<number, PointerEvent>
  prevDistance: number
  mode: "idle" | "pinch" | "drag"
  startDragX: number
  startDragY: number
  translateX: number
  translateY: number
  savedPathX: number
  savedPathY: number
  checkedCountries: Map<string, HTMLElement>
  throttleForWheel: (e: WheelEvent) => void
  animate: TAnimate
}

interface ITimezoneMapMethods extends Omit<IControllerMethods, "bindEvents"> {
  initISOCountries(): Promise<void>
  handlePointerDown(e: PointerEvent): void
  handlePointerUp(e: PointerEvent): void
  handleClickForScaleIn(): void
  handleClickForScaleOut(): void
  scaleIn(step?: number): void
  scaleOut(step?: number): void
  isScaleLimitOnWheel(deltaY: number): boolean
  isScaleLimitOnClick(): boolean
  translateLimit(): void
  reset(): void
  resetTimezoneDetails(): void
  resetCheckedCountries(): void
  resetTimezonesByCountry(): void
  saveCountryCoordinates(e: PointerEvent): void
  setSavedCountryCoordinates(e: PointerEvent): void
  handlePointerCancel(e: PointerEvent): void
  handlePointerMove(e: PointerEvent): void
  handlePointerOut(e: PointerEvent): void
  handleWheelForScaleInOrScaleOut(e: WheelEvent): void
  addCountry(e: PointerEvent): Promise<void>
  pinchStart(e: PointerEvent): void
  pinchMove(e: PointerEvent): void
  dragStart(e: PointerEvent): void
  dragMove(e: PointerEvent): void
  deleteCountry(e: MouseEvent): Promise<void>
  checkCountry(e: Event): void
  deleteCheckedCountries(): Promise<void>
  clearAllCountries(): Promise<void>
  getFinishedAnimation(...rest: HTMLElement[]): Promise<Animation[]>
}

export interface ITimezoneMap
  extends ITimezoneMapPropertiers, ITimezoneMapMethods {}
