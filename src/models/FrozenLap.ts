import type { Maybe } from "../types/common/Base.types"
import type { IFrozenLap } from "../types/frozenLap/FrozenLap.types"
import { getRandomID } from "../utils/helpers/getRandomID"

export class FrozenLap implements IFrozenLap {
  public id: string = getRandomID()
  public frozenTime: string
  public savedFrozenLap: Maybe<HTMLElement>

  constructor(frozenTime: string) {
    this.frozenTime = frozenTime
    this.savedFrozenLap = null
  }

  public create(i: number): HTMLElement {
    const frozenLapItem = document.createElement("li")
    frozenLapItem.classList.add("lap", "lap--frozen")
    frozenLapItem.innerHTML = `
      <p class="lap__label lap__label--frozen">Lap ${i + 1}</p>
      <p class="time-text time-text--lap time-text--lap-frozen">${
        this.frozenTime
      }</p>`
    this.savedFrozenLap = frozenLapItem
    return frozenLapItem
  }
}
