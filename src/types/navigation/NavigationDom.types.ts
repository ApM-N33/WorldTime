import { Maybe, IControllerMethods } from "../common/Base.types"

interface INavigationDomProperties {
  sectionsMap: Map<string, HTMLElement>
  sections: NodeListOf<HTMLElement>
  navButtons: NodeListOf<HTMLButtonElement>
  burgerBtn: Maybe<HTMLElement>
  mobileMenu: Maybe<HTMLElement>
  mobileMenuBackdrop: Maybe<HTMLElement>
  converterBlock: Maybe<HTMLElement>
}

interface INavigationDomMethods extends Omit<IControllerMethods, "setDeps"> {
  registerSections(): void
  handleShowActiveSection(e: MouseEvent): void
  showActiveSection(section: HTMLElement): void
  setActiveNavButton(navButton: HTMLButtonElement): void
  hideAllSections(): void
  resetAllActiveNavButtons(): void
  hideMobileMenu(): void
  resetConvertersTransform(): void
}

export interface INavigationDom
  extends INavigationDomProperties, INavigationDomMethods {}
