import { getCountry } from "countries-and-timezones"
import type { TtimezoneMap } from "../../types/baseController/controllers.types"
import type { TiSOCodesFromMap } from "../../types/timezone-map/iso-countries.types"
import type { ITimezoneMap } from "../../types/timezone-map/TimezoneMap.types"
import type { ITimezoneMapDom } from "../../types/timezone-map/TimezoneMapDom.types"
import { $ } from "../../utils/domUtils/query"
import { CountryMap } from "../../models/CountryMap"
import type { ICountryMap } from "../../types/countryMap/CountryMap.types"
import { Maybe } from "../../types/common/Base.types"
import type { TCountryTimezone } from "../../types/timezone-map/countriesTimezones.types"
import type { ITimezoneItem } from "../../types/timezoneItem/TimezoneItem.types"
import { TimezoneItem } from "../../models/TimezoneItem"
import { TimezoneDetail } from "../../models/TimezoneDetails"
import type { ITimezoneMapTimers } from "../../types/timezone-map/TimezoneMapTimers.types"
import { getFlag } from "../../utils/helpers/getFlag"
import { addClass, removeClass } from "../../utils/domUtils/addRemoveClasses"
import { useCardsAutoHeight } from '../../utils/domUtils/useCardsAutoHeight';

export class TimezoneMapDom implements ITimezoneMapDom {
  public worldMapParentWrapper: Maybe<HTMLElement>
  public worldMapSVGWrapperForScale: Maybe<HTMLElement>
  public worldMapSVG: Maybe<SVGSVGElement>
  public tooltip: Maybe<HTMLElement>
  public countriesMapList: Maybe<HTMLElement>
  public scaleInBtn: Maybe<HTMLElement>
  public scaleOutBtn: Maybe<HTMLElement>
  public countriesActionsList: Maybe<HTMLElement>
  public deleteCheckedCountriesBtn: Maybe<HTMLElement>
  public clearAllCountriesBtn: Maybe<HTMLElement>
  public countryMap: ICountryMap
  public timezoneItem: ITimezoneItem
  public timezoneMap!: ITimezoneMap
  public timezoneMapTimers!: ITimezoneMapTimers

  constructor() {
    this.worldMapParentWrapper = $(".timezone-map__wrapper", "one")
    this.worldMapSVGWrapperForScale = $(
      ".timezone-map__wrapper-for-scale",
      "one",
    )
    this.worldMapSVG = $(".logo--world-map", "one")
    this.tooltip = $(".modal--tooltip", "one")
    this.countriesMapList = $(".countries-map-list", "one")
    this.scaleInBtn = $(".btn--scale-in", "one")
    this.scaleOutBtn = $(".btn--scale-out", "one")
    this.countriesActionsList = $(".list-actions--countries", "one")
    this.deleteCheckedCountriesBtn = $(".btn--delete-checked-countries", "one")
    this.clearAllCountriesBtn = $(".btn--clear-all-countries", "one")
    this.countryMap = new CountryMap()
    this.timezoneItem = new TimezoneItem()
  }

  public setDeps(deps?: TtimezoneMap): void {
    if (!deps) return
    this.timezoneMap = deps.app
    this.timezoneMapTimers = deps.timers
  }

  public bindEvents(): void {
    if (
      !this.worldMapParentWrapper ||
      !this.scaleInBtn ||
      !this.scaleOutBtn ||
      !this.countriesMapList ||
      !this.deleteCheckedCountriesBtn ||
      !this.clearAllCountriesBtn
    ) {
      return
    }
    this.worldMapParentWrapper.addEventListener("pointerdown", (e) => {
      this.timezoneMap.handlePointerDown(e)
    })
    this.worldMapParentWrapper.addEventListener("pointermove", (e) => {
      this.timezoneMap.handlePointerMove(e)
    })
    this.worldMapParentWrapper.addEventListener("pointerout", (e) => {
      this.timezoneMap.handlePointerOut(e)
    })
    this.worldMapParentWrapper.addEventListener("pointerup", (e) => {
      this.timezoneMap.handlePointerUp(e)
    })
    this.worldMapParentWrapper.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault()
        if (this.timezoneMap.isScaleLimitOnWheel(e.deltaY)) return
        this.timezoneMap.throttleForWheel(e)
      },
      { passive: false },
    )
    this.worldMapParentWrapper.addEventListener("pointercancel", (e) => {
      this.timezoneMap.handlePointerCancel(e)
    })
    this.scaleInBtn.addEventListener("click", () => {
      this.timezoneMap.handleClickForScaleIn()
    })
    this.scaleOutBtn.addEventListener("click", () => {
      this.timezoneMap.handleClickForScaleOut()
    })
    this.countriesMapList.addEventListener("click", (e) => {
      this.timezoneMap.deleteCountry(e)
    })
    this.countriesMapList.addEventListener("change", (e) => {
      this.timezoneMap.checkCountry(e)
    })
    this.deleteCheckedCountriesBtn.addEventListener("click", () => {
      this.timezoneMap.deleteCheckedCountries()
    })
    this.clearAllCountriesBtn.addEventListener("click", () => {
      this.timezoneMap.clearAllCountries()
    })
  }

  get worldMapPaths(): NodeListOf<SVGPathElement> {
    return $("path", "all", this.worldMapSVG!)
  }

  get countryMapCards(): HTMLElement[] {
    return [...$(".country-map-card", "all")]
  }

  public assignCountryIdsFromClass(): void {
    const { iSOCodesFromMap } = this.timezoneMap
    for (const path of this.worldMapPaths) {
      if (!path.hasAttribute("class")) continue
      const key = path.getAttribute("class") as keyof TiSOCodesFromMap
      const iSOCodeFromMap = iSOCodesFromMap[key]
      if (!iSOCodeFromMap) continue
      path.setAttribute("id", iSOCodeFromMap)
    }
  }

  private cardsAutoHeight = useCardsAutoHeight()
  public renderCountryCards(): void {
    if (!this.countriesMapList) return
    const { timezonesByCountry, currency, checkedCountries } = this.timezoneMap
    const countriesMap = [...timezonesByCountry]
      .reverse()
      .map(([country, countryTimezones]) => {
        const countryMapCard = this.countryMap.create()
        this.countryMap.countryLabel!.textContent = "Country:"
        this.countryMap.countryName!.textContent = country
        this.countryMap.deleteCountryBtn!.dataset.countryKey = country
        this.countryMap.checkboxInput!.value = country
        this.countryMap.checkboxInput!.checked = checkedCountries.has(country)
        const flagSrc = getFlag(country)
        if (!flagSrc) return
        this.countryMap.flagLogo!.src = flagSrc
        this.countryMap.totalTimezones!.textContent = `Timezones: ${countryTimezones.length}`
        this.countryMap.countryCurrency!.textContent = `Currency: ${currency}`
        this.renderTimezonesItems(countryTimezones)
        return countryMapCard
      })
      .filter((c) => c !== undefined)
    this.countriesMapList.replaceChildren(...countriesMap)
    this.cardsAutoHeight.setCardsContainerHeight(
      countriesMap.slice(0, 2),
      this.countriesMapList,
    )
  }

  public renderTimezonesItems(countryTimezones: TCountryTimezone[]): void {
    if (!this.countryMap.timezonesList) return
    const timezones = countryTimezones.map((tz) => {
      const cn =
        "timezones-list__timezone-item timezones-list__timezone-item--country-map"
      const timezoneItem = this.timezoneItem.create(tz.name, cn)
      this.renderTimezonesDetails(tz, timezoneItem)
      return timezoneItem
    })
    this.countryMap.timezonesList.replaceChildren(...timezones)
  }

  public renderTimezonesDetails(
    tz: TCountryTimezone,
    timezoneItem: HTMLElement,
  ): void {
    const timezoneDetail = new TimezoneDetail({
      countryTimezone: tz,
    })
    this.timezoneMap.timezoneDetails.push(timezoneDetail)
    timezoneItem.appendChild(timezoneDetail.create())
  }

  public showCountryAndTooltip(path: SVGPathElement, e: PointerEvent): void {
    if (!this.tooltip) return
    const iSOCodeFromMap = path.getAttribute("id")
    if (!iSOCodeFromMap) return
    const countryFromMap = getCountry(iSOCodeFromMap)?.name
    if (!countryFromMap) return
    this.showCountry(path)
    this.tooltip.textContent = countryFromMap
    this.showTooltip()
    const x = Math.floor(e.clientX - this.tooltip.offsetWidth / 2)
    const y = Math.floor(
      e.pointerType === "mouse"
        ? e.clientY - this.tooltip.offsetHeight / 0.8
        : e.clientY - this.tooltip.offsetHeight / 0.6,
    )
    this.applyTooltipTransform(x, y)
  }

  public hideCountryAndTooltip(path: SVGPathElement): void {
    if (!this.tooltip) return
    this.hideCountry(path)
    this.hideTooltip()
  }

  public showCountry(path: SVGPathElement): void {
    if (!path) return
    addClass(path, "is-active")
  }

  public hideCountry(path: SVGPathElement): void {
    if (!path) return
    removeClass(path, "is-active")
  }

  public showTooltip(): void {
    if (!this.tooltip) return
    addClass(this.tooltip, "is-active")
  }

  public hideTooltip(): void {
    if (!this.tooltip) return
    removeClass(this.tooltip, "is-active")
  }

  public showCountriesActionsList(): void {
    if (!this.countriesActionsList) return
    addClass(this.countriesActionsList, "is-active")
  }

  public hideCountriesActionsList(): void {
    if (!this.countriesActionsList) return
    removeClass(this.countriesActionsList, "is-active")
  }

  public setGrabbingCursor(path?: SVGPathElement): void {
    if (this.worldMapSVGWrapperForScale) {
      addClass(this.worldMapSVGWrapperForScale, "is-grabbing")
    }
    if (path) addClass(path, "is-grabbing")
  }

  public resetGrabbingCursor(path?: SVGPathElement): void {
    if (this.worldMapSVGWrapperForScale) {
      removeClass(this.worldMapSVGWrapperForScale, "is-grabbing")
    }
    if (path) removeClass(path, "is-grabbing")
  }

  public applyMapTransform(
    scale: number = 1,
    x: number = 0,
    y: number = 0,
  ): void {
    if (!this.worldMapSVGWrapperForScale) return
    this.worldMapSVGWrapperForScale.style.transform = `translate(${x}px, ${y}px) scale(${scale})`
  }

  public applyTooltipTransform(x: number = 0, y: number = 0): void {
    if (!this.tooltip) return
    this.tooltip.style.transform = `translate(${x}px, ${y}px)`
  }
}
