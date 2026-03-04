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
    addClass(timezoneDetails, "timezones-list__timezone-details")
    timezoneDetails.innerHTML = /* html */ `
      <li class="timezones-list__timezone-details-item timezones-list__timezone-details--first-item"></li>
      <li class="timezones-list__timezone-details-item timezones-list__timezone-details--second-item"></li>
      <li class="timezones-list__timezone-details-item timezones-list__timezone-details--third-item"></li>`

    this.detailDateItem = $(
      ".timezones-list__timezone-details--first-item",
      "one",
      timezoneDetails,
    )
    this.detailTimeItem = $(
      ".timezones-list__timezone-details--second-item",
      "one",
      timezoneDetails,
    )
    this.detailUTCItem = $(
      ".timezones-list__timezone-details--third-item",
      "one",
      timezoneDetails,
    )
    return timezoneDetails
  }
}
