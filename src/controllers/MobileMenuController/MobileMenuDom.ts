import type { IMobileMenuDom } from "../../types/mobileMenu/MobileMenuDom.types"
import { $ } from "../../utils/domUtils/query"
import { Maybe } from "../../types/common/Base.types"
import { addClass, removeClass } from "../../utils/domUtils/addRemoveClasses"

export class MobileMenuDom implements IMobileMenuDom {
  public burgerBtn: Maybe<HTMLElement>
  public mobileMenu: Maybe<HTMLElement>
  public backdrop: Maybe<HTMLElement>
  public header: Maybe<HTMLElement>
  public observer: ResizeObserver

  constructor() {
    this.header = $(".header", "one")
    this.burgerBtn = $(".btn--burger", "one")
    this.mobileMenu = $(".mobile-menu", "one")
    this.backdrop = $(".modal--backdrop-mobile-menu", "one")
    this.observer = new ResizeObserver((e) => this.handleResize(e))
  }

  public bindEvents(): void {
    if (!this.backdrop || !this.burgerBtn || !this.header) return
    this.observer.observe(this.header)
    this.backdrop.addEventListener("click", () => {
      this.handleClickOnBackdrop()
    })
    this.burgerBtn.addEventListener("click", () => {
      this.handleClickOnBurgerBtn()
    })
  }

  public hideMobileMenu(): void {
    if (!this.burgerBtn || !this.mobileMenu || !this.backdrop) return
    removeClass(this.mobileMenu, "is-active")
    removeClass(this.burgerBtn, "is-active")
    removeClass(this.backdrop, "is-active")
    removeClass(document.documentElement, "is-overflowed")
  }

  public showMobileMenu(): void {
    if (!this.burgerBtn || !this.mobileMenu || !this.backdrop) return
    addClass(this.mobileMenu, "is-active")
    addClass(this.burgerBtn, "is-active")
    addClass(this.backdrop, "is-active")
    addClass(document.documentElement, "is-overflowed")
  }

  public handleResize(entries: ResizeObserverEntry[]): void {
    if (!this.burgerBtn || !this.mobileMenu || !this.backdrop) return
    for (const entry of entries) {
      const [{ blockSize }] = entry.borderBoxSize
      this.mobileMenu.style.top = `${blockSize + 2}px`
      this.backdrop.style.top = `${blockSize}px`
      const isActive = this.mobileMenu.classList.contains("is-active")
      if (window.innerWidth > 768 && isActive) this.hideMobileMenu()
    }
  }

  public handleClickOnBurgerBtn(): void {
    if (!this.burgerBtn || !this.mobileMenu || !this.backdrop) return
    const isActive = this.mobileMenu.classList.contains("is-active")
    if (isActive) this.hideMobileMenu()
    else this.showMobileMenu()
  }

  public handleClickOnBackdrop(): void {
    if (!this.mobileMenu || !this.burgerBtn || !this.backdrop) return
    const isActive = this.mobileMenu.classList.contains("is-active")
    if (isActive) this.hideMobileMenu()
  }
}
