import type { Maybe } from "../types/common/Base.types"
import type { ITimezoneDetail } from "../types/timezoneDetails/TimezoneDetails.types"
import { addClass } from "../utils/domUtils/addRemoveClasses"
import { $ } from "../utils/domUtils/query"
import { TimezoneDetailProps } from "../types/timezoneDetails/TimezoneDetails.types"

export class TimezoneDetail implements ITimezoneDetail {
  public timeZone: string
  public utcOffset: string
  public detailDateItem: Maybe<HTMLElement>
  public detailTimeItem: Maybe<HTMLElement>
  public detailUTCItem: Maybe<HTMLElement>

  constructor(props: TimezoneDetailProps) {
    const {
      countryTimezone: { name, utcOffsetStr },
    } = props
    this.timeZone = name
    this.utcOffset = utcOffsetStr
    this.detailDateItem = null
    this.detailTimeItem = null
    this.detailUTCItem = null
  }

  public create() {
    const timezoneDetails = document.createElement("ul")
    addClass(timezoneDetails, "countries-list__country-details")
    timezoneDetails.innerHTML = /* html */ `
      <li class="countries-list__country-details-item countries-list__country-details--first-item"></li>
      <li class="countries-list__country-details-item countries-list__country-details--second-item"></li>
      <li class="countries-list__country-details-item countries-list__country-details--third-item"></li>`

    this.detailDateItem = $(
      ".countries-list__country-details--first-item",
      "one",
      timezoneDetails,
    )
    this.detailTimeItem = $(
      ".countries-list__country-details--second-item",
      "one",
      timezoneDetails,
    )
    this.detailUTCItem = $(
      ".countries-list__country-details--third-item",
      "one",
      timezoneDetails,
    )
    return timezoneDetails
  }
}
