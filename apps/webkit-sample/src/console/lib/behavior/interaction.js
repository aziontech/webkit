const EVENTS = ['pointerdown', 'click', 'keydown', 'change', 'input']

const WINDOW_MS = 400

let lastInteraction = 0
let suppressedUntil = 0

const stamp = () => {
  lastInteraction = performance.now()
}

if (typeof document !== 'undefined') {
  for (const type of EVENTS) document.addEventListener(type, stamp, true)
}

export const suppressEntranceMotion = () => {
  suppressedUntil = performance.now() + WINDOW_MS
}

export const userDriven = () =>
  performance.now() > suppressedUntil && performance.now() - lastInteraction < WINDOW_MS
