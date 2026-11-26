import type { MockupCursorTarget } from '../composables/use-mockup-cursor'
import type { MockupFrameTiming } from '../composables/use-mockup-frames'

export interface PickingFrame {
  cursor: MockupCursorTarget
  press: boolean
  highlight: number
}

export type PickVisit = [index: number, forward: number, back: number]

export const option = (index: number): MockupCursorTarget => ({
  key: `option-${index}`,
  x: 0.3,
  y: 0.6
})

export function pickOption<T extends PickingFrame>(
  picking: T,
  visits: PickVisit[],
  picked: Partial<T>
): (T & MockupFrameTiming)[] {
  const last = visits[visits.length - 1][0]
  const over = { ...picking, cursor: option(last), highlight: last, press: true }

  return [
    ...visits.map(([index, forward, back]) => ({
      ...picking,
      cursor: option(index),
      highlight: index,
      forward,
      back
    })),
    { ...over, forward: 420, back: 120 },
    { ...over, ...picked, forward: 120, back: 220 }
  ]
}

export interface OpeningFrame extends PickingFrame {
  focused: boolean
  open: boolean
}

export type OpenTiming = [
  reach: [forward: number, back: number],
  press: [forward: number, back: number]
]

const OPEN_TIMING: OpenTiming = [
  [120, 420],
  [480, 160]
]

export function openAndPick<T extends OpeningFrame>(
  rest: T,
  trigger: MockupCursorTarget,
  visits: PickVisit[],
  picked: Partial<T>,
  [reach, press]: OpenTiming = OPEN_TIMING
): (T & MockupFrameTiming)[] {
  return [
    { ...rest, cursor: trigger, forward: reach[0], back: reach[1] },
    { ...rest, cursor: trigger, press: true, focused: true, forward: press[0], back: press[1] },
    ...pickOption({ ...rest, focused: true, open: true }, visits, picked)
  ]
}
