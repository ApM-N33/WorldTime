export type Keys = [
  "week",
  "month",
  "day",
  "year",
  "hour",
  "min",
  "sec",
  "offset",
]

export type Parts = {
  [K in Keys[number]]?: string
}

export function getDateParts(formater: Intl.DateTimeFormat): Parts {
  const keys: Keys = [
    "week",
    "month",
    "day",
    "year",
    "hour",
    "min",
    "sec",
    "offset",
  ]
  const parts: Parts = {}

  formater
    .formatToParts(new Date())
    .filter((format) => format.type !== "literal")
    .forEach((format, i) => {
      const key = keys[i]
      if (!parts[key]) parts[key] = format.value
    })

  return parts
}
