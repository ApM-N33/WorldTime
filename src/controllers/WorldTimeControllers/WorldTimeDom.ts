import type { TworldTime } from "../../types/baseController/controllers.types"
import type { Maybe } from "../../types/common/Base.types"
import type { IWorldTime } from "../../types/wolrdTime/WorldTime.types"
import type { IWorldTimeDom } from "../../types/wolrdTime/WorldTimeDom.types"
import type { IWorldTimeTimers } from "../../types/wolrdTime/WorldTimeTimers.types"
import { addClass, removeClass } from "../../utils/domUtils/addRemoveClasses"
import { $ } from "../../utils/domUtils/query"
import { debounce } from "../../utils/helpers/debounce"
import { TimezoneItem } from "../../models/TimezoneItem"
import type { ITimezoneItem } from "../../types/timezoneItem/TimezoneItem.types"
import { useKeydown } from "../../utils/domUtils/useKeydown"
import type { TuseKeydown } from "../../types/useKeydown/useKeydown.types"
import { TInputEl } from "../../types/common/Base.types"
import { useCardsAutoHeight } from '../../utils/domUtils/useCardsAutoHeight';
import {
  useNoResultsFound,
  type TuseNoResultsFound,
} from "../../utils/domUtils/useNoResultsFound"

export class WorldTimeDom implements IWorldTimeDom {
  public timezoneItem: ITimezoneItem
  public timeText: Maybe<HTMLElement>
  public dateText: Maybe<HTMLElement>
  public offsetText: Maybe<HTMLElement>
  public cityText: Maybe<HTMLElement>
  public timerBlock: Maybe<HTMLElement>
  public timerRightBlock: Maybe<HTMLElement>
  public timezonesList: Maybe<HTMLElement>
  public searchForm: Maybe<HTMLElement>
  public searchInput: Maybe<TInputEl>
  public addCityBtn: Maybe<HTMLElement>
  public modal: Maybe<HTMLElement>
  public flagLogo: Maybe<HTMLImageElement>
  public citiesList: Maybe<HTMLElement>
  public citiesActionsList: Maybe<HTMLElement>
  public deleteCheckedCitiesBtn: Maybe<HTMLElement>
  public clearAllCitiesBtn: Maybe<HTMLElement>
  public worldTime!: IWorldTime
  public worldTimeTimers!: IWorldTimeTimers
  public handleModalActiveDebounce: () => void
  public handleSearchTimezoneDebounce: (e: Event) => void
  public keydown: TuseKeydown
  public r: TuseNoResultsFound

  constructor() {
    this.timezoneItem = new TimezoneItem()
    this.timeText = $(".timer-card__time-text", "one")
    this.dateText = $(".timer-card__date-text", "one")
    this.offsetText = $(".timer-card__offset-text", "one")
    this.cityText = $(".timer-card__city-text", "one")
    this.citiesList = $(".cities-list", "one")
    this.flagLogo = $<HTMLImageElement>(".logo--flag__img", "one")
    this.timerBlock = $(".timer-block", "one")
    this.timerRightBlock = $(".timer-block__right", "one")
    this.timezonesList = $(".timezones-list--modal", "one")
    this.searchForm = $(".modal__form", "one")
    this.searchInput = $<TInputEl>(".input--timezones", "one")
    this.addCityBtn = $(".btn--add-city", "one")
    this.deleteCheckedCitiesBtn = $(".btn--delete-checked-cities", "one")
    this.clearAllCitiesBtn = $(".btn--clear-all-cities", "one")
    this.citiesActionsList = $(".list-actions--cities", "one")
    this.modal = $(".modal--timezones", "one")
    this.keydown = useKeydown()
    this.r = useNoResultsFound(this.modal!)
    this.handleModalActiveDebounce = debounce(() => {
      this.handleModalActive()
    }, 300)
    this.handleSearchTimezoneDebounce = debounce((e) => {
      this.worldTime.handleSearchTimezone(e)
    }, 200)
  }

  public setDeps(deps?: TworldTime): void {
    if (!deps) return
    this.worldTime = deps.app
    this.worldTimeTimers = deps.timers
  }

  public bindEvents(): void {
    if (
      !this.timezonesList ||
      !this.searchForm ||
      !this.searchInput ||
      !this.citiesList ||
      !this.modal ||
      !this.addCityBtn ||
      !this.deleteCheckedCitiesBtn ||
      !this.clearAllCitiesBtn
    ) {
      return
    }
    this.timezonesList.addEventListener("click", (e) => {
      this.worldTime.handleSelectCity(e)
    })
    this.searchForm.addEventListener("submit", (e) => {
      this.worldTime.handleAddCities(e)
    })
    this.searchInput.addEventListener("input", (e) => {
      this.handleSearchTimezoneDebounce(e)
    })
    this.searchInput.addEventListener("keydown", (e) => {
      this.keydown.on(e, this.timezonesItems, this.searchInput!)
    })
    this.citiesList.addEventListener("click", (e) => {
      this.worldTime.handleDeleteCity(e)
    })
    this.citiesList.addEventListener("change", (e) => {
      this.worldTime.handleCheckCity(e)
    })
    this.deleteCheckedCitiesBtn.addEventListener("click", () => {
      this.worldTime.handleDeleteCheckedCities()
    })
    this.clearAllCitiesBtn.addEventListener("click", () => {
      this.worldTime.handleClearAllCities()
    })
    this.modal.addEventListener("click", (e) => {
      this.handleModalHide(e)
    })
    this.addCityBtn.addEventListener("click", () => {
      this.handleModalActiveDebounce()
    })
  }

  public renderTimezonesItems(): void {
    if (!this.timezonesList) return
    this.keydown.reset()
    this.timezonesList.scrollTop = 0
    const timezones = this.worldTime.timezones.map((tz) => {
      const cn =
        "timezones-list__timezone-item timezones-list__timezone-item--modal"
      return this.timezoneItem.create(tz, cn)
    })
    this.timezonesList.replaceChildren(...timezones)
  }

  get timezonesItems(): NodeListOf<HTMLElement> {
    return $(".timezones-list__timezone-item--modal", "all")
  }

  get citiesCards(): HTMLElement[] {
    return [...$(".timer-card--small", "all")]
  }

  private cardsAutoHeight = useCardsAutoHeight()
  public renderCities(): void {
    if (!this.citiesList) return
    const { checkedCities } = this.worldTime
    const cities = this.worldTime.cities
      .map((city) => {
        const cityCard = city.create()
        cityCard.dataset.id = city.id
        city.checkboxInput!.value = city.id
        city.checkboxInput!.checked = checkedCities.has(city.id)
        city.deleteBtn!.dataset.id = city.id
        return cityCard
      })
      .toReversed()
    this.citiesList.replaceChildren(...cities)
    this.cardsAutoHeight.setCardsContainerHeight(
      cities.slice(0, 2),
      this.citiesList,
    )
  }

  public updateCities(): void {
    this.renderCities()
    this.worldTime.animateCities()
    this.showTimerRightBlock()
    this.hideModal()
    this.renderTimezonesItems()
  }

  public handleModalActive(): void {
    if (!this.searchInput) return
    this.worldTime.getFetchTimezones()
  }

  public handleModalHide(e: MouseEvent): void {
    if (
      e.target instanceof HTMLElement &&
      (e.target.matches(".modal") || e.target.matches(".btn--close-modal")) &&
      (this.worldTime.timezones.length > 0 || this.worldTime.isError)
    ) {
      this.worldTime.reset()
      this.renderTimezonesItems()
      this.hideModal()
    }
  }

  public showCitiesActionsList(): void {
    if (!this.citiesActionsList) return
    addClass(this.citiesActionsList, "is-active")
  }

  public hideCitiesActionsList(): void {
    if (!this.citiesActionsList) return
    removeClass(this.citiesActionsList, "is-active")
  }

  public showModal(): void {
    if (!this.modal) return
    addClass(document.documentElement, "is-overflowed")
    addClass(this.modal, "is-active")
  }

  public hideModal() {
    if (!this.modal) return
    removeClass(document.documentElement, "is-overflowed")
    removeClass(this.modal, "is-active")
  }

  public showTimerRightBlock() {
    if (!this.timerBlock) return
    addClass(this.timerBlock, "short")
  }

  public hideTimerRightBlock() {
    if (!this.timerBlock) return
    removeClass(this.timerBlock, "short")
  }
}
