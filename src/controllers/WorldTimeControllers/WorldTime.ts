import { MESSAGES } from "../../utils/constants/MESSAGES"
import { normalizeString } from "../../utils/helpers/normalizeString"
import { City } from "../../models/City"
import { API_ENDPOINTS } from "../../utils/constants/API_ENDPOINTS"
import type { IWorldTime } from "../../types/wolrdTime/WorldTime.types"
import type { ICity } from "../../types/city/City.types"
import type { IWorldTimeDom } from "../../types/wolrdTime/WorldTimeDom.types"
import type { IWorldTimeTimers } from "../../types/wolrdTime/WorldTimeTimers.types"
import type { TworldTime } from "../../types/baseController/controllers.types"
import type { Maybe, TBaseTimeZone } from "../../types/common/Base.types"
import { getDisplayTimezones } from "../../utils/helpers/getDisplayTimezones"
import { findTimeZone } from "../../utils/helpers/findTimeZone"
import { isInvalidTimezoneInput } from "../../utils/helpers/isInvalidTimezoneInput"
import { useModal } from "../../utils/domUtils/useModal"
import { TuseModal } from "../../types/useModal/useModal.types"
import { TInputEl } from "../../types/common/Base.types"
import { getFetch } from "../../api/getFetch"
import {
  animate as animation,
  type TAnimate,
} from "../../utils/domUtils/animate"

export class WorldTime implements IWorldTime {
  public cities: ICity[]
  public selectedTimezones: Set<string>
  public checkedCities: Set<string>
  public dublicated: string[]
  public timezones: string[]
  public copiedTimezones: string[]
  public m: TuseModal
  public isError: Maybe<boolean>
  public worldTimeDom!: IWorldTimeDom
  public worldTimeTimers!: IWorldTimeTimers
  public animatedCities: Set<string>
  public animate: TAnimate

  constructor() {
    this.selectedTimezones = new Set()
    this.checkedCities = new Set()
    this.animatedCities = new Set()
    this.cities = []
    this.dublicated = []
    this.timezones = []
    this.copiedTimezones = []
    this.isError = null
    this.m = useModal()
    this.animate = animation()
  }

  public setDeps(deps?: TworldTime): void {
    if (!deps) return
    this.worldTimeDom = deps.dom
    this.worldTimeTimers = deps.timers
  }

  public async getFetchTimezones(): Promise<void> {
    this.worldTimeDom.showModal()
    if (this.timezones.length > 0) return
    this.m.showMessage(MESSAGES.loading)
    const res = await getFetch<TBaseTimeZone[]>(API_ENDPOINTS.timezones)
    this.isError = res.isError
    if (res.isError || !res.data) {
      this.m.showMessage(MESSAGES.error(res.errMessage))
      return
    }
    this.timezones = getDisplayTimezones(res.data)
    this.copiedTimezones = [...this.timezones]
    this.worldTimeDom.renderTimezonesItems()
    this.m.showMessage(MESSAGES.succes)
  }

  public isSameCity(cities: ICity[], value: Maybe<TBaseTimeZone>): boolean {
    return cities.some((city) => city.timeZone === value)
  }

  public addCity(value: TBaseTimeZone): void {
    const findedTimezone = findTimeZone(this.copiedTimezones, value)
    const sameCity = this.isSameCity(this.cities, findedTimezone)
    if (!findedTimezone || sameCity) return
    const city = new City(findedTimezone)
    this.cities.push(city)
    if (this.cities.length === 1) {
      this.worldTimeTimers.updateRightTimers("rightBlockId")
      this.worldTimeDom.showCitiesActionsList()
      this.m.showMessage(MESSAGES.cityAddedSuccess)
    }
  }

  public resetCities(): void {
    this.cities.length = 0
  }

  public resetTimezones(): void {
    this.timezones = [...this.copiedTimezones]
  }

  public resetSearchInput(): void {
    if (!this.worldTimeDom.searchInput) return
    this.worldTimeDom.searchInput.value = ""
  }

  public resetDublicatesTimezones(): void {
    this.dublicated.length = 0
  }

  public resetSelectedTimezones(): void {
    this.selectedTimezones.clear()
  }

  public resetCheckedCities(): void {
    this.checkedCities.clear()
  }

  public resetAnimatedCities(): void {
    this.animatedCities.clear()
  }

  public reset(): void {
    this.resetTimezones()
    this.resetSearchInput()
    this.resetDublicatesTimezones()
    this.resetSelectedTimezones()
  }

  public notifyAndReset(message: TBaseTimeZone): void {
    this.m.showMessage(message)
    this.reset()
    this.worldTimeDom.renderTimezonesItems()
  }

  public hasDublicate(selectedTimezones: Set<TBaseTimeZone>): boolean {
    const timezones = new Set<string>(this.cities.map((city) => city.timeZone))
    this.dublicated = [...selectedTimezones].filter((tz) => timezones.has(tz))
    return this.dublicated.length > 0
  }

  public addInSelected(value: TBaseTimeZone): void {
    this.selectedTimezones.add(value)
  }

  public deleteFromSelected(value: TBaseTimeZone): void {
    this.selectedTimezones.delete(value)
  }

  public toggleSelected(value: TBaseTimeZone, target: HTMLElement): void {
    if (!this.selectedTimezones.has(value)) this.addInSelected(value)
    else this.deleteFromSelected(value)
    target.classList.toggle("is-active")
  }

  public addAllSelectedTimezones(): void {
    this.selectedTimezones.forEach((tz) => this.addCity(tz))
  }

  public handleSelectCity(e: MouseEvent): void {
    const target = e.target as HTMLElement
    if (!target.matches("li") || !this.worldTimeDom.searchInput) return
    this.toggleSelected(target.textContent.trim(), target)
    this.resetSearchInput()
  }

  public handleSearchTimezone(e: Event): void {
    const input = e.target as TInputEl
    this.timezones = this.copiedTimezones.filter((tz) => {
      return normalizeString(tz).includes(normalizeString(input.value))
    })
    if (isInvalidTimezoneInput(input.value)) {
      this.resetTimezones()
      this.resetSearchInput()
    }
    this.worldTimeDom.r.showOrHideNoResultsFoundText(this.timezones)
    this.worldTimeDom.renderTimezonesItems()
  }

  public animateCities(): void {
    for (const city of this.cities) {
      const savedCity = city.savedCity
      if (!savedCity) continue
      const id = savedCity!.dataset.id
      if (!id || this.animatedCities.has(id)) continue
      this.animatedCities.add(id)
      this.animate(savedCity, "in")
    }
  }

  public handleAddCities(e: SubmitEvent): void {
    e.preventDefault()
    const input = this.worldTimeDom.searchInput as TInputEl
    const findedTimezone = findTimeZone(this.copiedTimezones, input.value)

    if (!findedTimezone && input.value) {
      this.notifyAndReset(MESSAGES.inValidCity)
      return
    }

    if (findedTimezone) this.addInSelected(findedTimezone)

    if (this.selectedTimezones.size > 0) {
      if (this.hasDublicate(this.selectedTimezones)) {
        this.notifyAndReset(MESSAGES.dublicates(this.dublicated))
        return
      }
      this.addAllSelectedTimezones()
      this.reset()
      this.worldTimeDom.updateCities()
    }
  }

  public getFinishedAnimation(...rest: HTMLElement[]): Promise<Animation[]> {
    return Promise.all(rest.map((el) => this.animate(el, "out").finished))
  }

  public async handleDeleteCity(e: MouseEvent): Promise<void> {
    const target = e.target as HTMLElement
    const btn = target.closest<HTMLElement>(".btn--delete-city")
    const card = target.closest<HTMLElement>(".timer-card--small")

    if (!btn || !card) return
    await this.getFinishedAnimation(card)
    this.cities = this.cities.filter((city) => city.id !== btn.dataset.id)
    if (this.cities.length === 0) {
      this.worldTimeDom.hideCitiesActionsList()
      this.worldTimeDom.hideTimerRightBlock()
      this.resetCheckedCities()
      this.resetAnimatedCities()
    }
    this.worldTimeDom.renderCities()
  }

  public handleCheckCity({ target }: Event): void {
    if (target instanceof Element) target = target.closest(".input--checkbox")
    if (!(target instanceof HTMLInputElement)) return
    const city = target.value
    if (!this.checkedCities.has(city)) this.checkedCities.add(city)
    else this.checkedCities.delete(city)
  }

  private wasDeletedCheckedCity = false
  public async handleDeleteCheckedCities(): Promise<void> {
    if (this.wasDeletedCheckedCity) return

    const deletedCities = new Set<HTMLElement>()
    let checkedCityDeleted = false
    this.cities = this.cities.filter((city) => {
      if (!this.checkedCities.has(city.id)) return true
      if (!deletedCities.has(city.savedCity!)) {
        deletedCities.add(city.savedCity!)
      }
      checkedCityDeleted = true
      return false
    })

    this.wasDeletedCheckedCity = checkedCityDeleted

    if (checkedCityDeleted) {
      await this.getFinishedAnimation(...deletedCities)
      if (this.cities.length === 0) {
        this.worldTimeDom.hideCitiesActionsList()
        this.worldTimeDom.hideTimerRightBlock()
        this.resetAnimatedCities()
      }
      this.worldTimeDom.renderCities()
      this.resetCheckedCities()
      this.wasDeletedCheckedCity = false
      checkedCityDeleted = false
    }
  }

  private wasOneClick = false
  public async handleClearAllCities(): Promise<void> {
    if (this.cities.length === 0) return
    if (!this.wasOneClick) {
      this.wasOneClick = true
      await this.getFinishedAnimation(...this.worldTimeDom.citiesCards)
      if (this.checkedCities.size > 0) this.resetCheckedCities()
      if (this.animatedCities.size > 0) this.resetAnimatedCities()
      this.resetCities()
      this.worldTimeDom.renderCities()
      this.worldTimeDom.hideTimerRightBlock()
      this.wasOneClick = false
    }
  }
}
