export type ThrottleCallback = (...args: any[]) => any

export function throttle<T extends ThrottleCallback>(
  callback: T,
): (...args: Parameters<T>) => void {
  let inThrottle = false
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      inThrottle = true
      callback(...args)
      requestAnimationFrame(() => {
        inThrottle = false
      })
    }
  }
}
