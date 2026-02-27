export function parseLapTime(timeStr: string) {
  timeStr = timeStr.trim()

  const splitedTime = timeStr.split(":")
  const hours = splitedTime.length === 3 ? splitedTime[0] : 0
  const min = hours ? splitedTime[1] : splitedTime[0]
  const [sec, ms] = hours
    ? splitedTime[2].split(",")
    : splitedTime[1].split(",")

  return {
    hr: Number(hours),
    min: Number(min),
    sec: Number(sec),
    ms: Number(ms),
  }
}
