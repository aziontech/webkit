import { curve, duration } from '@aziontech/theme/animations'

export type MenuMotionTarget = 'collapse' | 'level'

export type MenuMotionPhase = 'enter' | 'leave'

export type MenuMotionToken = {
  duration: string
  curve: string
}

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

export const MENU_COLLAPSE_EXIT_MS = Number.parseInt(menuMotion.collapse.leave.duration, 10)

export const MENU_LEVEL_EXIT_MS = Number.parseInt(menuMotion.level.leave.duration, 10)

export const MENU_LEVEL_ENTER_MS = Number.parseInt(menuMotion.level.enter.duration, 10)

export const prefersReducedMotion = (): boolean =>
  typeof globalThis.matchMedia === 'function' &&
  globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches

export const getMenuCollapseTransitionStyle = (phase: MenuMotionPhase): { transition: string } => ({
  transition: `height ${menuMotion.collapse[phase].duration} ${menuMotion.collapse[phase].curve}`
})

export const getMenuLevelTransitionStyle = (
  phase: MenuMotionPhase,
  options: { fade?: boolean } = {}
): { transition: string } => {
  const { duration: d, curve: c } = menuMotion.level[phase]
  if (options.fade === false) return { transition: `translate ${d} ${c}` }
  return { transition: `translate ${d} ${c}, opacity ${d} ${c}` }
}

const runHeightTransition = (
  node: globalThis.HTMLElement,
  from: number,
  to: number,
  phase: MenuMotionPhase,
  done: () => void
) => {
  node.style.height = `${from}px`
  node.style.overflow = 'hidden'
  node.style.transition = getMenuCollapseTransitionStyle(phase).transition
  void node.offsetHeight
  node.style.height = `${to}px`

  const finish = () => {
    globalThis.clearTimeout(fallback)
    node.removeEventListener('transitionend', finish)
    node.style.height = ''
    node.style.overflow = ''
    node.style.transition = ''
    done()
  }

  node.addEventListener('transitionend', finish, { once: true })
  const fallback = globalThis.setTimeout(finish, MENU_COLLAPSE_EXIT_MS + 50)
}

export const collapseHeightOnEnter = (el: globalThis.Element, done: () => void): void => {
  const node = el as globalThis.HTMLElement

  if (prefersReducedMotion()) {
    done()
    return
  }

  runHeightTransition(node, 0, node.scrollHeight, 'enter', done)
}

export const collapseHeightOnLeave = (el: globalThis.Element, done: () => void): void => {
  const node = el as globalThis.HTMLElement

  if (prefersReducedMotion()) {
    done()
    return
  }

  runHeightTransition(node, node.scrollHeight, 0, 'leave', done)
}
