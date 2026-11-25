import { useResizeObserver } from '@vueuse/core'
import {
  type MaybeRefOrGetter,
  nextTick,
  onMounted,
  onScopeDispose,
  readonly,
  type Ref,
  ref,
  toValue,
  watch
} from 'vue'

/** How far an items-driven trail folds to fit the width of its own box. */
export type BreadcrumbCollapseLevel = 'full' | 'collapsed' | 'parent' | 'compact'

export interface UseBreadcrumbCollapseReturn {
  /** The fold that fits: every segment, the first and the parent beside the menu, the parent alone beside it, or the current page alone. */
  level: Readonly<Ref<BreadcrumbCollapseLevel>>
}

const levelsFor = (count: number): BreadcrumbCollapseLevel[] => {
  if (count < 2) return ['full']
  if (count === 2) return ['full', 'compact']
  if (count === 3) return ['full', 'parent', 'compact']
  return ['full', 'collapsed', 'parent', 'compact']
}

const truncated = (el: globalThis.Element) => el.scrollWidth > el.clientWidth + 0.5

export function useBreadcrumbCollapse(
  target: MaybeRefOrGetter<globalThis.HTMLElement | null>,
  count: MaybeRefOrGetter<number>
): UseBreadcrumbCollapseReturn {
  const level = ref<BreadcrumbCollapseLevel>('full')
  let settledWidth = -1
  let frame = 0
  let run = 0

  const overflows = (el: globalThis.HTMLElement, current: BreadcrumbCollapseLevel) => {
    const list = el.querySelector('ol')
    if (list && truncated(list)) return true
    const onlyParentLeft = current === 'parent' || (current === 'full' && toValue(count) === 2)
    return Array.from(el.querySelectorAll('[data-slot="label"]')).some(
      (label) =>
        label.clientWidth > 0 &&
        truncated(label) &&
        !(onlyParentLeft && label.closest('[aria-current="page"]'))
    )
  }

  const fit = async () => {
    const el = toValue(target)
    if (!el) return
    const id = ++run
    const levels = levelsFor(toValue(count))
    let index = 0
    level.value = levels[0]!
    await nextTick()
    while (id === run && index < levels.length - 1 && overflows(el, levels[index]!)) {
      index += 1
      level.value = levels[index]!
      await nextTick()
    }
    if (id === run) settledWidth = el.getBoundingClientRect().width
  }

  onMounted(fit)

  watch(
    () => toValue(count),
    () => fit()
  )

  useResizeObserver(
    () => toValue(target),
    () => {
      const el = toValue(target)
      if (!el || typeof globalThis.requestAnimationFrame !== 'function') return
      if (Math.abs(el.getBoundingClientRect().width - settledWidth) < 0.5) return
      globalThis.cancelAnimationFrame(frame)
      frame = globalThis.requestAnimationFrame(() => fit())
    }
  )

  onScopeDispose(() => {
    run += 1
    if (typeof globalThis.cancelAnimationFrame === 'function') {
      globalThis.cancelAnimationFrame(frame)
    }
  })

  return { level: readonly(level) as Readonly<Ref<BreadcrumbCollapseLevel>> }
}
