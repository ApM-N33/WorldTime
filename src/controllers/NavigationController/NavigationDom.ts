import type { INavigationDom } from "../../types/navigation/NavigationDom.types"
import { Maybe } from "../../types/common/Base.types"
import { $ } from "../../utils/domUtils/query"
import { addClass, removeClass } from "../../utils/domUtils/addRemoveClasses"

export class NavigationDom implements INavigationDom {
  public sectionsMap: Map<string, HTMLElement>
  public sections: NodeListOf<HTMLElement>
  public navButtons: NodeListOf<HTMLButtonElement>
  public burgerBtn: Maybe<HTMLElement>
  public mobileMenu: Maybe<HTMLElement>
  public mobileMenuBackdrop: Maybe<HTMLElement>
  public converterBlock: Maybe<HTMLElement>

  constructor() {
    this.sectionsMap = new Map()
    this.sections = $("section", "all")
    this.navButtons = $(".btn--nav-item", "all")
    this.burgerBtn = $(".btn--burger", "one")
    this.mobileMenu = $(".mobile-menu", "one")
    this.mobileMenuBackdrop = $(".modal--backdrop-mobile-menu", "one")
    this.converterBlock = $(".converter-block", "one")
  }

  public bindEvents(): void {
    for (const navButton of this.navButtons) {
      navButton.addEventListener("click", (e) => {
        this.handleShowActiveSection(e)
      })
    }
  }

  public registerSections(): void {
    for (const section of this.sections) {
      const sectionName = section.dataset.section
      if (sectionName && !this.sectionsMap.has(sectionName)) {
        this.sectionsMap.set(sectionName, section)
      }
    }
  }

  public showActiveSection(section: HTMLElement) {
    addClass(section, "is-active")
  }

  public setActiveNavButton(navButton: HTMLButtonElement) {
    addClass(navButton, "is-active")
  }

  public hideAllSections() {
    for (const section of this.sections) removeClass(section, "is-active")
  }

  public resetAllActiveNavButtons() {
    for (const navButton of this.navButtons) removeClass(navButton, "is-active")
  }

  public hideMobileMenu() {
    if (!this.mobileMenu || !this.burgerBtn || !this.mobileMenuBackdrop) {
      return
    }
    const mobileMenuIsActive = this.mobileMenu.classList.contains("is-active")
    if (mobileMenuIsActive) {
      removeClass(this.mobileMenu, "is-active")
      removeClass(this.burgerBtn, "is-active")
      removeClass(this.mobileMenuBackdrop, "is-active")
      removeClass(document.documentElement, "is-overflowed")
    }
  }

  public resetConvertersTransform() {
    if (!this.converterBlock) return
    const converterIsReversedOrInitial =
      this.converterBlock.classList.contains("is-reversed") ||
      this.converterBlock.classList.contains("is-initial")
    if (converterIsReversedOrInitial) {
      removeClass(this.converterBlock, "is-reversed", "is-initial")
    }
  }

  public handleShowActiveSection({
    currentTarget: navButton,
  }: MouseEvent): void {
    if (!(navButton instanceof HTMLButtonElement)) return
    const actionName = navButton.dataset.action
    if (!actionName) return
    const activeSection = this.sectionsMap.get(actionName)
    if (activeSection) {
      this.resetAllActiveNavButtons()
      this.resetConvertersTransform()
      this.hideAllSections()
      this.hideMobileMenu()
      this.showActiveSection(activeSection)
      this.setActiveNavButton(navButton)
    }
  }
}
