export type TCallback = (...args: any[]) => any

export function debounce<F extends TCallback>(
  callback: F,
  delay = 1000
): (...args: Parameters<F>) => void {
  
  let timerId: number | null = null

  return (...args: Parameters<F>) => {
    if (timerId) clearTimeout(timerId)
    timerId = setTimeout(() => callback(...args), delay)
  }
}
