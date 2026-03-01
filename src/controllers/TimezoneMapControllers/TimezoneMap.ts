import type { TtimezoneMap } from "../../types/baseController/controllers.types"
import type { TiSOCodesFromMap } from "../../types/timezone-map/iso-countries.types"
import type { ITimezoneMap } from "../../types/timezone-map/TimezoneMap.types"
import type { TuseModal } from "../../types/useModal/useModal.types"
import { API_ENDPOINTS as AE } from "../../utils/constants/API_ENDPOINTS"
import { MESSAGES } from "../../utils/constants/MESSAGES"
import { useModal } from "../../utils/domUtils/useModal"
import type { TCountriesTimezones } from "../../types/timezone-map/countriesTimezones.types"
import type { ITimezoneMapDom } from "../../types/timezone-map/TimezoneMapDom.types"
import { getCountry, getTimezonesForCountry } from "countries-and-timezones"
import { CurrencyData } from "../../types/currencyData/currencyData.types"
import { getCurrency } from "../../utils/helpers/getCurrency"
import type { ITimezoneMapTimers } from "../../types/timezone-map/TimezoneMapTimers.types"
import { getDisplayTimezones } from "../../utils/helpers/getDisplayTimezones"
import { getFetch } from "../../api/getFetch"
import type { ITimezoneDetail } from "../../types/timezoneDetails/TimezoneDetails.types"
import { throttle } from "../../utils/helpers/throttle"
import { getDistance } from "../../utils/helpers/getDistance"
import {
  animate as animation,
  countryAnimationFrames,
  countryAnimationOptions,
  type TAnimate,
} from "../../utils/domUtils/animate"

export class TimezoneMap implements ITimezoneMap {
  public timezoneDetails: ITimezoneDetail[]
  public iSOCodesFromMap: TiSOCodesFromMap
  public timezonesByCountry: Map<string, TCountriesTimezones>
  public currency: string
  public minScale: number
  public maxScale: number
  public scale: number
  public clickCount: number
  public m: TuseModal
  public timezoneMapDom!: ITimezoneMapDom
  public timezoneMapTimers!: ITimezoneMapTimers
  public mode: "idle" | "pinch" | "drag"
  public prevDistance: number
  public pointers: Map<number, PointerEvent>
  public startDragX: number
  public startDragY: number
  public translateX: number
  public translateY: number
  public savedPathX: number
  public savedPathY: number
  public checkedCountries: Map<string, HTMLElement>
  public throttleForWheel: (e: WheelEvent) => void
  public animate: TAnimate

  constructor() {
    this.currency = ""
    this.m = useModal()
    this.iSOCodesFromMap = {}
    this.timezonesByCountry = new Map()
    this.pointers = new Map()
    this.checkedCountries = new Map()
    this.timezoneDetails = []
    this.minScale = 1
    this.maxScale = 5
    this.scale = 1
    this.clickCount = 0
    this.mode = "idle"
    this.prevDistance = 0
    this.startDragX = 0
    this.startDragY = 0
    this.translateX = 0
    this.translateY = 0
    this.savedPathX = 0
    this.savedPathY = 0
    this.throttleForWheel = throttle((e) => {
      this.handleWheelForScaleInOrScaleOut(e)
    })
    this.animate = animation(countryAnimationFrames, countryAnimationOptions)
  }

  public setDeps(deps?: TtimezoneMap): void {
    if (!deps) return
    this.timezoneMapDom = deps.dom
    this.timezoneMapTimers = deps.timers
  }

  public async initISOCountries(): Promise<void> {
    this.m.needToNotify(MESSAGES.loading)
    const res = await getFetch<TiSOCodesFromMap>(AE.isocountries)
    if (!res.data || res.isError) {
      this.m.needToNotify(MESSAGES.error(res.errMessage), res.isError)
      return
    }
    this.iSOCodesFromMap = res.data
    this.m.needToNotify(MESSAGES.succes)
  }

  public handleWheelForScaleInOrScaleOut({ target, deltaY }: WheelEvent): void {
    if (target instanceof SVGElement) {
      target = target.closest(".timezone-map__wrapper-for-scale")
    }
    if (!(target instanceof HTMLDivElement)) return

    if (deltaY < 0) this.scaleIn()
    if (deltaY > 0) this.scaleOut()

    this.translateLimit()
    this.timezoneMapDom.applyMapTransform(
      this.scale,
      this.translateX,
      this.translateY,
    )
  }

  public isScaleLimitOnWheel(deltaY: number): boolean {
    const { scale, minScale, maxScale } = this
    return (
      (scale >= maxScale && deltaY < 0) || (scale <= minScale && deltaY > 0)
    )
  }

  public isScaleLimitOnClick(): boolean {
    const { scale, maxScale, minScale, clickCount } = this
    return (
      (scale >= maxScale && clickCount === 3) ||
      (scale <= minScale && clickCount === 0)
    )
  }

  public handleClickForScaleIn(): void {
    this.clickCount = Math.min(this.clickCount + 1, 3)
    if (this.isScaleLimitOnClick()) return
    this.scaleIn(1.71)
    this.translateLimit()
    this.timezoneMapDom.applyMapTransform(
      this.scale,
      this.translateX,
      this.translateY,
    )
  }

  public handleClickForScaleOut(): void {
    this.clickCount = Math.max(this.clickCount - 1, 0)
    if (this.isScaleLimitOnClick()) return
    this.scaleOut(1.71)
    this.translateLimit()
    this.timezoneMapDom.applyMapTransform(
      this.scale,
      this.translateX,
      this.translateY,
    )
  }

  public translateLimit(): void {
    const { clientWidth: containerWidth, clientHeight: containerHeight } =
      this.timezoneMapDom.worldMapParentWrapper!

    const scaledMapWidth = containerWidth * this.scale
    const scaledMapHeight = containerHeight * this.scale

    const maxX = (scaledMapWidth - containerWidth) / 2
    const maxY = (scaledMapHeight - containerHeight) / 2

    this.translateX = Math.floor(
      Math.max(-maxX, Math.min(maxX, this.translateX)),
    )
    this.translateY = Math.floor(
      Math.max(-maxY, Math.min(maxY, this.translateY)),
    )
  }

  public scaleIn(step: number = 1.1): void {
    this.scale = Math.min(this.scale * step, this.maxScale)
  }

  public scaleOut(step: number = 1.1): void {
    this.scale = Math.max(this.scale / step, this.minScale)
  }

  public reset(): void {
    this.mode = "idle"
    this.prevDistance = 0
  }

  public resetTimezoneDetails(): void {
    this.timezoneDetails.length = 0
  }

  public resetCheckedCountries(): void {
    this.checkedCountries.clear()
  }

  public resetTimezonesByCountry(): void {
    this.timezonesByCountry.clear()
  }

  public pinchStart(e: PointerEvent): void {
    this.pointers.set(e.pointerId, e)
    if (this.mode !== "pinch" && this.pointers.size === 2) {
      this.mode = "pinch"
      if (this.mode === "pinch" && e.target instanceof SVGPathElement) {
        this.timezoneMapDom.hideCountryAndTooltip(e.target)
      }
      this.prevDistance = getDistance(...this.pointers.values())
    }
  }

  public pinchMove(e: PointerEvent): void {
    this.pointers.set(e.pointerId, e)

    if (this.mode === "pinch" && this.pointers.size === 2) {
      if (e.target instanceof SVGPathElement) {
        this.timezoneMapDom.hideCountryAndTooltip(e.target)
      }
      const newDistance = getDistance(...this.pointers.values())
      const diff = newDistance / this.prevDistance

      if (diff > 1.002) this.scaleIn(1.02)
      if (diff < 0.998) this.scaleOut(1.02)

      this.translateLimit()

      this.timezoneMapDom.applyMapTransform(
        this.scale,
        this.translateX,
        this.translateY,
      )
      this.prevDistance = newDistance
    }
  }

  public saveCountryCoordinates(e: PointerEvent): void {
    if (!(e.target instanceof SVGPathElement)) return
    const { left, top } = e.target.getBoundingClientRect()
    this.savedPathX = e.clientX - left
    this.savedPathY = e.clientY - top
  }

  public setSavedCountryCoordinates(e: PointerEvent): void {
    if (!(e.target instanceof SVGPathElement)) return
    const { left, top } = e.target.getBoundingClientRect()
    const newClientX = this.savedPathX + left
    const newClientY = this.savedPathY + top
    this.timezoneMapDom.applyTooltipTransform(newClientX, newClientY)
  }

  public dragStart(e: PointerEvent): void {
    if (
      this.pointers.size === 1 &&
      e.buttons === 1 &&
      this.scale > this.minScale
    ) {
      this.startDragX = e.clientX
      this.startDragY = e.clientY
      this.saveCountryCoordinates(e)
    }
  }

  public dragMove(e: PointerEvent): void {
    if (
      this.pointers.size === 1 &&
      e.buttons === 1 &&
      this.scale > this.minScale
    ) {
      const dx = e.clientX - this.startDragX
      const dy = e.clientY - this.startDragY
      if (this.mode !== "drag" && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
        this.mode = "drag"
      }
      if (this.mode === "drag") {
        this.translateX += dx
        this.translateY += dy
        this.startDragX = e.clientX
        this.startDragY = e.clientY
        this.translateLimit()
        this.timezoneMapDom.applyMapTransform(
          this.scale,
          this.translateX,
          this.translateY,
        )
        this.setSavedCountryCoordinates(e)
        if (e.target instanceof SVGPathElement) {
          this.timezoneMapDom.setGrabbingCursor(e.target)
        }
        this.timezoneMapDom.setGrabbingCursor()
      }
    }
  }

  public async addCountry(e: PointerEvent): Promise<void> {
    if (
      this.mode !== "idle" ||
      !(e.target instanceof SVGPathElement) ||
      !e.target.hasAttribute("id")
    ) {
      return
    }

    const iSOCode = e.target.getAttribute("id")
    if (!iSOCode) return
    const country = getCountry(iSOCode)?.name

    if (country && !this.timezonesByCountry.has(country)) {
      this.timezonesByCountry.set(
        country,
        getDisplayTimezones(getTimezonesForCountry(iSOCode)!),
      )

      const res = await getFetch<CurrencyData[]>(AE.currency(iSOCode), 4)
      if (!res.data || res.isError) return
      this.currency = getCurrency(res.data)

      this.resetTimezoneDetails()
      this.timezoneMapDom.renderCountryCards()
      const countryMapCard = this.timezoneMapDom.countryMapCards[0]
      if (countryMapCard) this.animate(countryMapCard, "in")

      if (this.timezonesByCountry.size === 1) {
        this.timezoneMapTimers.update("timezoneMapTimerId")
        this.timezoneMapDom.showCountriesActionsList()
      }
    }
  }

  public async deleteCountry({ target }: MouseEvent): Promise<void> {
    if (target instanceof Element) {
      target = target.closest(".btn--delete-country")
    }
    if (!(target instanceof HTMLButtonElement)) return
    const countryMapCard = target.closest<HTMLElement>(".country-map-card")
    if (!countryMapCard) return
    await this.getFinishedAnimation(countryMapCard)
    const country = target.dataset.countryKey
    if (country && this.timezonesByCountry.has(country)) {
      this.timezonesByCountry.delete(country)
      this.timezoneMapDom.renderCountryCards()
    }
    if (this.timezonesByCountry.size === 0) {
      this.timezoneMapDom.hideCountriesActionsList()
      this.resetCheckedCountries()
    }
  }

  public checkCountry({ target }: InputEvent): void {
    if (target instanceof Element) target = target.closest(".input--checkbox")
    if (!(target instanceof HTMLInputElement)) return

    const country = target.value
    const countryMapCard = target.closest<HTMLElement>(".country-map-card")
    if (countryMapCard && !this.checkedCountries.has(country)) {
      this.checkedCountries.set(country, countryMapCard)
    } else {
      this.checkedCountries.delete(country)
    }
  }

  public getFinishedAnimation(...rest: HTMLElement[]): Promise<Animation[]> {
    return Promise.all(rest.map((el) => this.animate(el, "out").finished))
  }

  private wasDeletedCheckedCountry = false
  public async deleteCheckedCountries(): Promise<void> {
    if (this.wasDeletedCheckedCountry) return

    let checkedCountryDeleted = false
    for (const checkedCountry of this.checkedCountries.keys()) {
      if (this.timezonesByCountry.has(checkedCountry)) {
        checkedCountryDeleted = this.timezonesByCountry.delete(checkedCountry)
      }
    }

    this.wasDeletedCheckedCountry = checkedCountryDeleted

    if (checkedCountryDeleted) {
      await this.getFinishedAnimation(...this.checkedCountries.values())
      if (this.timezonesByCountry.size === 0) {
        this.timezoneMapDom.hideCountriesActionsList()
      }
      this.resetCheckedCountries()
      this.timezoneMapDom.renderCountryCards()
      checkedCountryDeleted = false
      this.wasDeletedCheckedCountry = false
    }
  }

  private wasOneClick = false
  public async clearAllCountries(): Promise<void> {
    if (this.timezonesByCountry.size === 0) return

    if (!this.wasOneClick) {
      this.wasOneClick = true
      await this.getFinishedAnimation(...this.timezoneMapDom.countryMapCards)
      if (this.checkedCountries.size > 0) this.resetCheckedCountries()
      this.resetTimezonesByCountry()
      this.timezoneMapDom.hideCountriesActionsList()
      this.timezoneMapDom.renderCountryCards()
      this.wasOneClick = false
    }
  }

  public handlePointerDown(e: PointerEvent): void {
    if (e.target instanceof Element) e.target.setPointerCapture(e.pointerId)
    this.pinchStart(e)

    if (this.mode === "pinch") return

    this.dragStart(e)

    if (
      this.mode === "idle" &&
      e.pointerType !== "mouse" &&
      e.target instanceof SVGPathElement &&
      e.target.hasAttribute("id")
    ) {
      this.timezoneMapDom.showCountryAndTooltip(e.target, e)
    }
  }

  public handlePointerMove(e: PointerEvent): void {
    this.pinchMove(e)

    if (this.mode === "pinch") return

    this.dragMove(e)
    if (this.mode === "drag") return

    if (
      this.mode === "idle" &&
      e.target instanceof SVGPathElement &&
      e.target.hasAttribute("id") &&
      e.pointerType === "mouse"
    ) {
      this.timezoneMapDom.showCountryAndTooltip(e.target, e)
    }
  }

  public handlePointerUp(e: PointerEvent): void {
    if (e.target instanceof Element) e.target.releasePointerCapture(e.pointerId)
    const wasDragOrPinch = this.mode === "drag" || this.mode === "pinch"

    this.pointers.delete(e.pointerId)
    if (this.pointers.size === 0) {
      if (e.target instanceof SVGPathElement) {
        this.timezoneMapDom.resetGrabbingCursor(e.target)
      }
      this.reset()
      this.timezoneMapDom.resetGrabbingCursor()
    }

    if (e.target instanceof SVGPathElement && e.pointerType !== "mouse") {
      this.timezoneMapDom.hideCountryAndTooltip(e.target)
    }
    
    if (wasDragOrPinch) return

    this.addCountry(e)
  }

  public handlePointerCancel(e: PointerEvent): void {
    if (e.target instanceof Element) e.target.releasePointerCapture(e.pointerId)
    this.pointers.delete(e.pointerId)
    if (this.pointers.size === 0) {
      if (e.target instanceof SVGPathElement) {
        this.timezoneMapDom.resetGrabbingCursor(e.target)
      }
      this.reset()
      this.timezoneMapDom.resetGrabbingCursor()
    }
  }

  public handlePointerOut(e: PointerEvent): void {
    if (
      e.target instanceof SVGPathElement &&
      e.target.hasAttribute("id") &&
      e.pointerType === "mouse"
    ) {
      this.timezoneMapDom.hideCountryAndTooltip(e.target)
    }
  }
}
