import type { TBaseTimeZone } from "../../types/common/Base.types"
import { getCityWithCommaAndSpace } from "../helpers/getSplited"

export class MESSAGES {
  static dublicates(dublicated: TBaseTimeZone[]) {
    return `City(ies) ${getCityWithCommaAndSpace(dublicated)} already in the list`
  }
  static inValidTime = "Please enter the correct value for time"
  static inValidCity = "City not found. Please try again."
  static cityAddedSuccess = "City(ies) has been successfully added"
  static loading = "Please wait while the data is loading..."
  static succes = "Data loaded successfully"
  static error(err: Error | undefined) {
    return `${err}`
  }
}
