import { debounce } from "../helpers/debounce"
import { addClass, removeClass } from "./addRemoveClasses"
import { $ } from "./query"
import { TuseModal } from "../../types/useModal/useModal.types"
import { Maybe } from "../../types/common/Base.types"

export function useModal(): TuseModal {
  let someError: Maybe<boolean> = null
  const documentHTML = document.documentElement
  const messageModal = $(".modal--notification", "one")
  const messageText = $(".modal__notification-text", "one")
  const preloaderModal = $(".modal--preloader", "one")
  const loaders = $(".loader-wrap__loader", "all")

  const hideMessageDebounce = debounce(hideMessage, 2000)
  const hideLoaderDebounce = debounce(hideLoader, 2000)

  function runLoaders() {
    loaders.forEach((loader) => addClass(loader, "is-running"))
  }

  function pauseLoaders() {
    loaders.forEach((loader) => removeClass(loader, "is-running"))
  }

  function setError(maybeError: Maybe<boolean>) {
    someError = maybeError
  }

  function showMessage(message: string, autoHide: boolean = true) {
    if (!messageModal || !messageText) return
    addClass(messageModal, "is-active")
    messageText.textContent = message
    if (autoHide) hideMessageDebounce()
  }

  function showLoader(autoHide: boolean = true) {
    if (!preloaderModal) return
    if (someError) {
      pauseLoaders()
      return
    }
    addClass(preloaderModal, "is-active")
    runLoaders()
    addClass(documentHTML, "is-overflowed")

    if (autoHide) hideLoaderDebounce()
  }

  function hideMessage() {
    if (!messageModal) return
    removeClass(messageModal, "is-active")
  }

  function needToNotify(message: string, maybeError?: Maybe<boolean>) {
    setError(maybeError)
    showLoader()
    showMessage(message)
  }

  function hideLoader() {
    if (!preloaderModal) return
    removeClass(preloaderModal, "is-active")
    pauseLoaders()
    removeClass(documentHTML, "is-overflowed")
  }

  return {
    showLoader,
    showMessage,
    hideMessage,
    hideLoader,
    setError,
    needToNotify,
  }
}
