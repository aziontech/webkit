import { curve, duration } from '@aziontech/theme/animations'

/**
 * Menu motion presets, values only from animate.js. Per DESIGN.md § Motion, state-driven
 * push-vs-pop motion needs a presets module — the catalogued keyframes are fixed-direction.
 */

export type MenuMotionTarget = 'collapse' | 'level'

export type MenuMotionPhase = 'enter' | 'leave'

export type MenuMotionToken = {
  duration: string
  curve: string
}

/** Menu targets and phases mapped to `duration` / `curve` primitives from animate.js. */
export const menuMotion: Record<MenuMotionTarget, Record<MenuMotionPhase, MenuMotionToken>> = {
  collapse: {
    enter: { duration: duration['moderate-02'], curve: curve['productive-entrance'] },
    leave: { duration: duration['moderate-02'], curve: curve['productive-exit'] }
  },
  level: {
    enter: { duration: duration['moderate-02'], curve: curve['productive-entrance'] },
    leave: { duration: duration['moderate-02'], curve: curve['productive-exit'] }
  }
}

/** Collapse duration in ms — the transitionend fallback for the height hooks. */
export const MENU_COLLAPSE_EXIT_MS = Number.parseInt(menuMotion.collapse.leave.duration, 10)

/** Level slide-out duration in ms — how long a popped level stays mounted. */
export const MENU_LEVEL_EXIT_MS = Number.parseInt(menuMotion.level.leave.duration, 10)

/** Level slide-in ms — a fresh element has nothing to tween from, so enter alone needs Vue's from-class. */
export const MENU_LEVEL_ENTER_MS = Number.parseInt(menuMotion.level.enter.duration, 10)

/** True when the user asked for reduced motion, so every hook short-circuits. */
export const prefersReducedMotion = (): boolean =>
  typeof globalThis.matchMedia === 'function' &&
  globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Inline transition for a collapse phase (Tailwind cannot emit a dynamic duration). */
export const getMenuCollapseTransitionStyle = (phase: MenuMotionPhase): { transition: string } => ({
  transition: `height ${menuMotion.collapse[phase].duration} ${menuMotion.collapse[phase].curve}`
})

/**
 * The transition must name `translate` (Tailwind v4 compiles translate utilities to it, not
 * `transform`) or the slide snaps. Opacity rides along: a slide moves a level by its own
 * width only, which cannot clear a host-inset clipping edge — so the sliver is faded.
 */
export const getMenuLevelTransitionStyle = (
  phase: MenuMotionPhase,
  options: { fade?: boolean } = {}
): { transition: string } => {
  const { duration: d, curve: c } = menuMotion.level[phase]
  // A returning surface must stay opaque to cover what leaves (fading both sides reads the
  // outgoing level through the incoming one); the leave still fades to clear the sliver.
  if (options.fade === false) return { transition: `translate ${d} ${c}` }
  // The leaving side must reach full transparency. The ghosting this once seemed to cause
  // was really a positioned level host; unpositioned, the two phases cross-fade in place.
  return { transition: `translate ${d} ${c}, opacity ${d} ${c}` }
}

/** Drives `height` between two pixel values with the phase's tokens, then cleans up. */
const runHeightTransition = (
  node: globalThis.HTMLElement,
  from: number,
  to: number,
  phase: MenuMotionPhase,
  done: () => void
) => {
  node.style.height = `${from}px`
  // Clipping is set here rather than in the class string: a permanent
  // `overflow-hidden` on the list would cut off the rows' focus ring.
  node.style.overflow = 'hidden'
  node.style.transition = getMenuCollapseTransitionStyle(phase).transition
  void node.offsetHeight
  node.style.height = `${to}px`

  // `finish` closes over `fallback` (declared after it) — safe because it only runs from the
  // listener or the timer, both asynchronous; and it lets `fallback` stay const.
  const finish = () => {
    globalThis.clearTimeout(fallback)
    node.removeEventListener('transitionend', finish)
    node.style.height = ''
    node.style.overflow = ''
    node.style.transition = ''
    done()
  }

  node.addEventListener('transitionend', finish, { once: true })
  // A height that ends where it started fires no transitionend, which would leave the
  // list stuck mid-transition — resolve on the token duration either way.
  const fallback = globalThis.setTimeout(finish, MENU_COLLAPSE_EXIT_MS + 50)
}

/** Enter hook growing a list from 0 to content height; taking `done` tells Vue to wait for it. */
export const collapseHeightOnEnter = (el: globalThis.Element, done: () => void): void => {
  const node = el as globalThis.HTMLElement

  if (prefersReducedMotion()) {
    done()
    return
  }

  runHeightTransition(node, 0, node.scrollHeight, 'enter', done)
}

/** `Transition` leave hook that collapses a list from its measured height to 0. */
export const collapseHeightOnLeave = (el: globalThis.Element, done: () => void): void => {
  const node = el as globalThis.HTMLElement

  if (prefersReducedMotion()) {
    done()
    return
  }

  runHeightTransition(node, node.scrollHeight, 0, 'leave', done)
}
