import { curve, duration } from '@aziontech/theme/animations'

/**
 * Menu motion presets — values read only from `animate.js` (`duration`, `curve`).
 *
 * Every phase of this component's motion is per-phase, open-vs-close motion driven by
 * `data-state`, which DESIGN.md § Motion routes through a presets module rather than the
 * catalogued `animate-*` keyframes: those are fixed-direction entrances with baked-in
 * timing and cannot express a push-vs-pop pair off one state. The timing therefore lives
 * here as an inline `transition`; the height / translate themselves stay Tailwind classes.
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

/**
 * Level slide-in duration in ms — the explicit `Transition` enter duration for a level
 * that is mounting. A freshly inserted element has no previous computed style to tween
 * from, so the entering slide is the one phase that needs Vue's from-class + frame.
 */
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
 * Inline transition for a drill level. Tailwind v4 compiles `translate-x-*` to the CSS
 * `translate` property, not the `transform` shorthand — so the level must transition
 * `translate`, or the slide would snap into place untweened.
 *
 * `opacity` rides along because `-translate-x-full` moves a level by its own width, which
 * is not enough to clear the clipping edge when the host insets the menu (a `Sidebar`
 * pads by `--spacing-md`, leaving that many pixels of the outgoing level on screen). The
 * component cannot know the host's padding, so the residual sliver is faded out instead
 * of chased with a larger translate.
 */
export const getMenuLevelTransitionStyle = (
  phase: MenuMotionPhase,
  options: { fade?: boolean } = {}
): { transition: string } => {
  const { duration: d, curve: c } = menuMotion.level[phase]
  // A surface SLIDING BACK IN does not fade: it has to be opaque to cover whatever is leaving
  // behind it. Fading both sides puts two surfaces in the same space at partial opacity, and
  // you read the outgoing one straight through the incoming one — which is the "conflict" a
  // pop shows. Leaving still fades, because the translate alone cannot clear the sliver a
  // host's padding leaves behind.
  if (options.fade === false) return { transition: `translate ${d} ${c}` }
  // Both phases move and fade. The leaving side MUST reach 0%, because the translate alone
  // cannot clear the sliver a host's padding leaves behind. The earlier ghosting this seemed
  // to cause was really the level host being positioned: an out-of-flow level resolved its
  // `top` against the host, which sits after the groups, so it trailed *below* the menu that
  // replaced it. With the host unpositioned and the current level on `z-10`, the two phases
  // cross-fade in place as intended.
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

  // `finish` closes over `fallback`, which is declared after it. That is safe because
  // `finish` only ever runs from the listener or the timer below, both asynchronous —
  // and it lets `fallback` stay `const` (a `let` assigned once trips `prefer-const`).
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

/**
 * `Transition` enter hook that grows a list from 0 to its content height.
 * Taking `done` is what tells Vue to wait for this hook.
 */
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
