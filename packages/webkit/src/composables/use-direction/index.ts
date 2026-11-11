import {
  type ComponentPublicInstance,
  getCurrentInstance,
  getCurrentScope,
  type MaybeRefOrGetter,
  onMounted,
  onScopeDispose,
  readonly,
  type Ref,
  ref,
  toValue,
  watch
} from 'vue'

export type Direction = 'ltr' | 'rtl'

type Target = Element | ComponentPublicInstance | null | undefined

const DIR_HOST = '[dir="ltr" i], [dir="rtl" i]'

const subscribers = new Set<() => void>()
let observer: MutationObserver | null = null

function subscribe(listener: () => void): () => void {
  subscribers.add(listener)
  if (!observer && typeof MutationObserver !== 'undefined' && typeof document !== 'undefined') {
    observer = new MutationObserver(() => {
      for (const fn of [...subscribers]) fn()
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['dir'],
      subtree: true
    })
  }
  return () => {
    subscribers.delete(listener)
    if (!subscribers.size && observer) {
      observer.disconnect()
      observer = null
    }
  }
}

function toElement(target: Target): Element | null {
  if (!target) return null
  if (typeof Element !== 'undefined' && target instanceof Element) return target
  const el = (target as ComponentPublicInstance).$el
  return typeof Element !== 'undefined' && el instanceof Element ? el : null
}

export function resolveDirection(el?: Element | null): Direction {
  if (typeof document === 'undefined') return 'ltr'
  const host = el?.closest(DIR_HOST) ?? document.documentElement
  return host.getAttribute('dir')?.toLowerCase() === 'rtl' ? 'rtl' : 'ltr'
}

export function eventDirection(event: Event): Direction {
  const target = event.currentTarget
  return resolveDirection(
    typeof Element !== 'undefined' && target instanceof Element ? target : null
  )
}

export function useDirection(target?: MaybeRefOrGetter<Target>): Readonly<Ref<Direction>> {
  const instance = getCurrentInstance()
  const direction = ref<Direction>('ltr')

  const element = (): Element | null => {
    const explicit = target === undefined ? null : toElement(toValue(target))
    if (explicit) return explicit
    if (target === undefined && instance?.proxy) return toElement(instance.proxy)
    return null
  }

  const update = () => {
    direction.value = resolveDirection(element())
  }

  update()
  const stop = subscribe(update)
  if (target !== undefined) watch(() => toValue(target), update, { flush: 'post' })
  if (instance) onMounted(update)
  if (getCurrentScope()) onScopeDispose(stop)

  return readonly(direction)
}

export function logicalArrowKey(key: string, dir: Direction): string {
  if (dir !== 'rtl') return key
  if (key === 'ArrowLeft') return 'ArrowRight'
  if (key === 'ArrowRight') return 'ArrowLeft'
  return key
}
