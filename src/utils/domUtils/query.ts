import type { Maybe } from "../../types/common/Base.types"

export function $<E extends Element = HTMLElement>(
  selector: string,
  all: "one",
  root?: ParentNode,
): Maybe<E>

export function $<E extends Element = HTMLElement>(
  selector: string,
  all: "all",
  root?: ParentNode,
): NodeListOf<E>

export function $<E extends Element = HTMLElement>(
  selector: string,
  all: "all" | "one",
  root: ParentNode = document,
) {
  if (all === "all") return root.querySelectorAll<E>(selector)
  const el = root.querySelector<E>(selector)
  if (!el) throw new Error("Element not found")
  return el
}
