import { IControllerMethods, type Maybe } from "../common/Base.types"

interface IMobileMenuProperties {
  burgerBtn: Maybe<HTMLElement>
  mobileMenu: Maybe<HTMLElement>
  backdrop: Maybe<HTMLElement>
  header: Maybe<HTMLElement>
  observer: ResizeObserver
}

interface IMobileMenuMethods extends Omit<IControllerMethods, "setDeps"> {
  handleResize(entries: ResizeObserverEntry[]): void
  handleClickOnBurgerBtn(): void
  handleClickOnBackdrop(): void
  hideMobileMenu(): void
  showMobileMenu(): void
}

export interface IMobileMenuDom
  extends IMobileMenuProperties, IMobileMenuMethods {}
