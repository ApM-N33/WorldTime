import type { TBaseTimeZone } from "../../types/common/Base.types"
import { addClass, removeClass } from "./addRemoveClasses"
import { $ } from "./query"

export type TuseNoResultsFound = {
  showOrHideNoResultsFoundText(
    timezones: TBaseTimeZone[],
    value?: TBaseTimeZone,
  ): void
  showNoResultsFound(): void
  hideNoResultsFound(): void
}

export function useNoResultsFound(root: HTMLElement): TuseNoResultsFound {
  const noResultsFoundEl = $(".no-results-found", "one", root)

  const showNoResultsFound = () => {
    if (!noResultsFoundEl) return
    addClass(noResultsFoundEl, "is-active")
  }

  const hideNoResultsFound = () => {
    if (!noResultsFoundEl) return
    removeClass(noResultsFoundEl, "is-active")
  }

  const showOrHideNoResultsFoundText = (
    timezones: TBaseTimeZone[],
    value?: TBaseTimeZone,
  ) => {
    if (!timezones.length && value === undefined) showNoResultsFound()
    if (timezones.length > 0 && value === undefined) hideNoResultsFound()
    if (!timezones.length && value !== "") showNoResultsFound()
    if (!timezones.length && value === "") hideNoResultsFound()
  }

  return {
    showOrHideNoResultsFoundText,
    showNoResultsFound,
    hideNoResultsFound,
  }
}
