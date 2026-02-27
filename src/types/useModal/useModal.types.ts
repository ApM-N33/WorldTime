import { Maybe } from "../common/Base.types"
export type TuseModal = {
  showLoader(autoHide?: boolean): void
  showMessage(message: string, autoHide?: boolean): void
  hideMessage(): void
  hideLoader(): void
  setError(maybeError: Maybe<boolean>): void
  needToNotify(message: string, maybeError?: Maybe<boolean>): void
}
