export const countryAnimationFrames: Record<"in" | "out", Keyframe[]> = {
  in: [
    { offset: 0, opacity: "0", transform: "rotateX(90deg)" },
    { offset: 1, opacity: "1", transform: "rotateX(0deg)" },
  ],
  out: [
    { offset: 0, opacity: "1", transform: "rotateX(0deg)" },
    { offset: 1, opacity: "0", transform: "rotateX(90deg)" },
  ],
}

export const countryAnimationOptions: KeyframeAnimationOptions = {
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  duration: 700,
}

const defaultFrames: Record<"in" | "out", Keyframe[]> = {
  in: [
    { offset: 0, transform: "translate(-100%,0)" },
    { offset: 1, transform: "translate(0,0)" },
  ],
  out: [
    { offset: 0, transform: "translate(0,0)" },
    { offset: 1, transform: "translate(-100%,0)" },
  ],
}

const defaultOptions: KeyframeAnimationOptions = {
  duration: 350,
  easing: "ease-in-out",
  iterations: 1,
  fill: "forwards",
}

export type TAnimate = (
  element: Element,
  animationName?: "in" | "out",
) => Animation

export function animate(
  animationFrames: Record<"in" | "out", Keyframe[]> = defaultFrames,
  animationOptions: KeyframeAnimationOptions = {},
): TAnimate {
  return (element, animationName: "in" | "out" = "in") => {
    const frames = animationFrames[animationName]
    const mergedAnimationOptions = { ...defaultOptions, ...animationOptions }
    const anim = element.animate(frames, mergedAnimationOptions)
    return anim
  }
}
