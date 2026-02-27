import { $ } from "./query"

export function useVisualViewport() {
  const messageModal = $<HTMLElement>(".modal--notification", "one")
  const timezonesModal = $<HTMLElement>(".modal--timezones", "one")
  const timezonesModalForm = $<HTMLElement>(".modal__form", "one")
  const vv = window.visualViewport

  function setPositionRelativeToVisualViewport() {
    if (!vv || !messageModal || !timezonesModal || !timezonesModalForm) return
    messageModal.style.top = `${vv.offsetTop}px`
    timezonesModal.style.top = `${vv.offsetTop}px`
    timezonesModal.style.height = `${(vv.height / 100) * 100}px`
    timezonesModalForm.style.maxHeight = `${(vv.height / 100) * 85}px`
  }

  function updateNewModalPositions() {
    if (!vv) return
    setPositionRelativeToVisualViewport()
    destroy()
    vv.addEventListener("resize", setPositionRelativeToVisualViewport)
    vv.addEventListener("scroll", setPositionRelativeToVisualViewport)
  }

  function destroy() {
    if (!vv) return
    vv.removeEventListener("resize", setPositionRelativeToVisualViewport)
    vv.removeEventListener("scroll", setPositionRelativeToVisualViewport)
  }

  return {
    updateNewModalPositions,
    destroy,
  }
}
