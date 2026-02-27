import {
  IBaseModel,
  TBaseTimeZone,
  Maybe,
  type TInputEl,
} from "../common/Base.types"

interface ICityProperties extends IBaseModel {
  timeZone: TBaseTimeZone
  timeText: Maybe<HTMLElement>
  dateText: Maybe<HTMLElement>
  offsetText: Maybe<HTMLElement>
  cityText: Maybe<HTMLElement>
  flagLogo: Maybe<HTMLImageElement>
  deleteBtn: Maybe<HTMLButtonElement>
  checkboxInput: Maybe<TInputEl>
  savedCity: Maybe<HTMLElement>
}

interface ICityMethods {
  create(): HTMLElement
}

export interface ICity extends ICityProperties, ICityMethods {}
