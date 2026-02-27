export function getRandomID() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID()
  }
  return `${performance.now().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`
}
