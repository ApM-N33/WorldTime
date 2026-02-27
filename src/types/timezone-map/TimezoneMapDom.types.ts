import { Maybe, type IControllerMethods } from "../common/Base.types"
import type { ITimezoneItem } from "../timezoneItem/TimezoneItem.types"
import type { ITimezoneMap } from "./TimezoneMap.types"
import type { ITimezoneMapTimers } from "./TimezoneMapTimers.types"
import { ICountryMap } from "../countryMap/CountryMap.types"
import { TCountryTimezone } from "./countriesTimezones.types"

interface ITimezoneMapDomProperties {
  worldMapParentWrapper: Maybe<HTMLElement>
  worldMapSVGWrapperForScale: Maybe<HTMLElement>
  worldMapSVG: Maybe<SVGSVGElement>
  worldMapPaths: NodeListOf<SVGPathElement>
  tooltip: Maybe<HTMLElement>
  countriesMapList: Maybe<HTMLElement>
  scaleInBtn: Maybe<HTMLElement>
  scaleOutBtn: Maybe<HTMLElement>
  countriesActionsList: Maybe<HTMLElement>
  deleteCheckedCountriesBtn: Maybe<HTMLElement>
  clearAllCountriesBtn: Maybe<HTMLElement>
  countryMapCards: HTMLElement[]
  timezoneMap: ITimezoneMap
  timezoneMapTimers: ITimezoneMapTimers
  countryMap: ICountryMap
  timezoneItem: ITimezoneItem
}

interface ITimezoneMapDomMathods extends IControllerMethods {
  assignCountryIdsFromClass(): void
  showCountryAndTooltip(path: SVGPathElement, e: PointerEvent): void
  hideCountryAndTooltip(path: SVGPathElement): void
  applyMapTransform(scale?: number, x?: number, y?: number): void
  renderCountryCards(): void
  renderTimezonesDetails(tz: TCountryTimezone, timezoneItem: HTMLElement): void
  showCountry(path: SVGPathElement): void
  hideCountry(path: SVGPathElement): void
  showTooltip(): void
  hideTooltip(): void
  applyTooltipTransform(x?: number, y?: number): void
  showCountriesActionsList(): void
  hideCountriesActionsList(): void
  setGrabbingCursor(path?: SVGPathElement): void
  resetGrabbingCursor(path?: SVGPathElement): void
}

export interface ITimezoneMapDom
  extends ITimezoneMapDomProperties, ITimezoneMapDomMathods {}
