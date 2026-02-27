export function addClass(element: Element | SVGElement, ...args: string[]) {
  if (!element) return
  element.classList.add(...args)
}

export function removeClass(element: Element | SVGElement, ...args: string[]) {
  if (!element) return
  element.classList.remove(...args)
}
