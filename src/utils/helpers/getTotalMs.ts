type Keys = ["hr", "min", "sec", "ms"]
type Time = {
  [K in Keys[number]]: number
}

export function getTotalMs(time: Time) {
  const { hr, min, sec, ms } = time
  return hr * 3600000 + min * 60000 + sec * 1000 + ms * 10
}
