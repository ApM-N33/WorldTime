import { trueModulo } from "../helpers/trueModulo"
import { TInputEl } from "../../types/common/Base.types"
import { addClass, removeClass } from "./addRemoveClasses"
import { TuseKeydown } from "../../types/useKeydown/useKeydown.types"

export function useKeydown(): TuseKeydown {
  let selectedIndex: number = -1

  const updateKeydown = (
    timezonesItems: NodeListOf<HTMLElement>,
    searchInput: TInputEl,
  ) => {
    timezonesItems.forEach((tz) => removeClass(tz, "is-active"))
    const selectedTimezone = timezonesItems[selectedIndex]
    searchInput.value = selectedTimezone.textContent.trim()
    addClass(selectedTimezone, "is-active")
    selectedTimezone.scrollIntoView({ block: "nearest" })
  }

  const toUp = (
    timezonesItems: NodeListOf<HTMLElement>,
    searchInput: TInputEl,
  ) => {
    if (selectedIndex === -1) {
      selectedIndex = timezonesItems.length - 1
    } else {
      selectedIndex = trueModulo(selectedIndex - 1, timezonesItems.length)
    }
    updateKeydown(timezonesItems, searchInput)
  }

  const toDown = (
    timezonesItems: NodeListOf<HTMLElement>,
    searchInput: TInputEl,
  ) => {
    if (selectedIndex === -1) {
      selectedIndex = 0
    } else {
      selectedIndex = trueModulo(selectedIndex + 1, timezonesItems.length)
    }
    updateKeydown(timezonesItems, searchInput)
  }

  const on = (
    e: KeyboardEvent,
    timezonesItems: NodeListOf<HTMLElement>,
    searchInput: TInputEl,
  ) => {
    if (timezonesItems.length === 0) return
    if (e.code !== "ArrowUp" && e.code !== "ArrowDown") return
    if (e.code === "ArrowUp") toUp(timezonesItems, searchInput)
    if (e.code === "ArrowDown") toDown(timezonesItems, searchInput)
  }

  const reset = () => {
    selectedIndex = -1
  }

  return { on, reset }
}
