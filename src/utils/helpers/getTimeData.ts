export function getTimeData(currentMs: number) {
  const miliseconds = currentMs
  const milisecondsAngle = Math.floor(((360 / 60000) * miliseconds) % 360)
  const seconds = Math.floor(miliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const minutesAngle = Math.floor((0.2 * seconds) % 360)
  const milisecondsModulo = `${Math.floor((miliseconds % 1000) / 10)}`.padStart(
    2,
    "0"
  )
  const secondsModulo = `${seconds % 60}`.padStart(2, "0")
  const minutesModulo = `${minutes % 60}`.padStart(2, "0")
  const hours = minutes > 59 ? `${Math.floor(minutes / 60)}:` : ""

  return {
    time: `${hours}${minutesModulo}:${secondsModulo},${milisecondsModulo}`,
    msAngle: `rotate(${milisecondsAngle}deg)`,
    minAngle: `rotate(${minutesAngle}deg)`,
    angle: milisecondsAngle,
  }
}
