export function trueModulo(a: number, b: number) {
  if (b === 0) throw new Error("You can't divide by zero")
  return ((a % b) + b) % b
}
