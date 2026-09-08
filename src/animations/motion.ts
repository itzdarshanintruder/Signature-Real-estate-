type Bezier = [number, number, number, number]

/** Shared easing curves — the brand curve matches the CSS token `--ease-brand`. */
export const EASE = {
  brand: [0.22, 1, 0.36, 1] as Bezier,
  out: [0.16, 1, 0.3, 1] as Bezier,
  inOut: [0.65, 0, 0.35, 1] as Bezier,
}

/** Shared durations (seconds) — map to the `--duration-*` CSS tokens. */
export const DURATION = {
  fast: 0.2,
  base: 0.35,
  slow: 0.7,
}
