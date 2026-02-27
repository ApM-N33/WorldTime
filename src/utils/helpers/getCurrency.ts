import type { CurrencyData } from "../../types/currencyData/currencyData.types"

export function getCurrency(data: CurrencyData[]): string {
  return `${data.map(({ currencies }) => {
    if (currencies) return Object.keys(currencies)[0]
  })}`
}
