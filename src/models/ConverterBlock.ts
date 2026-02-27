import { addClass } from "../utils/domUtils/addRemoveClasses"
import { IConverterBlock } from "../types/converterBlock/ConverterBlock.types"

export class ConverterBlock implements IConverterBlock {
  public create(): HTMLElement {
    const converterBlock = document.createElement("div")
    addClass(converterBlock, "converter-block__col")
    converterBlock.innerHTML = /* html */ `
        <div class="converter-block__time-input-wrap">
          <input class="input input--time-converter" type="text" />
          <span class="logo logo--flag logo--converter-flag">
            <img class="logo--flag__img" src="" alt="" />
          </span>
        </div>
        <div class="converter-dropdown">
          <button class="btn btn--dropdown-converter btn--left-dropdown-converter">
            <span class="btn--dropdown-converter__city-text"></span>
            <span class="btn--dropdown-converter__offset-wrap">
              <span
                class="btn--dropdown-converter__offset-text"
              ></span>
              <svg
                width="12"
                height="8"
                class="logo logo--arrow-down"
                viewBox="0 0 12 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L6 6L11 1"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
          </button>
          <div class="converter-dropdown__list">
            <form class="converter-dropdown__form">
              <input
                placeholder="Search zone..."
                class="input input--dropdown-converter"
                type="search"
              />
            </form>
            <span class="no-results-found no-results-found--converter">No results found</span>
            <ul
              class="countries-list countries-list--dropdown-converter"
            ></ul>
          </div>
        </div>`

    return converterBlock
  }
}
