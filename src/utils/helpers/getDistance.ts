export function getDistance(...rest: PointerEvent[]): number {
  const [p1, p2] = rest
  return Math.sqrt(
    Math.pow(p1.clientX - p2.clientX, 2) + Math.pow(p1.clientY - p2.clientY, 2),
  )
}
