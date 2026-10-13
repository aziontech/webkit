import { onBeforeUnmount, onMounted, type Ref, ref } from 'vue'

import { tokenPx } from './breakpoints.js'

export const useContainerAtLeast = (
  target: () => globalThis.Element | null | undefined,
  token: string
): Readonly<Ref<boolean>> => {
  const matches = ref(false)
  let observer: globalThis.ResizeObserver | null = null

  onMounted(() => {
    const element = target()
    const minimum = tokenPx(token)
    if (!element || !minimum) return
    observer = new globalThis.ResizeObserver(([entry]) => {
      matches.value = entry.contentRect.width >= minimum
    })
    observer.observe(element)
  })

  onBeforeUnmount(() => observer?.disconnect())

  return matches
}
