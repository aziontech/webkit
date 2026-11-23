import { nextTick, readonly, type Ref, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

function focusTarget(hash: string): HTMLElement | null {
  const main = document.getElementById('main')
  if (!main) return null
  const anchored = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
  return anchored ?? main.querySelector<HTMLElement>('h1') ?? main
}

export function useRouteFocus(): Readonly<Ref<string>> {
  const route = useRoute()
  const announcement = ref('')

  watch(
    () => route.path,
    async () => {
      if (import.meta.env.SSR) return
      announcement.value = ''
      await nextTick()
      requestAnimationFrame(() => {
        const target = focusTarget(route.hash)
        if (target) {
          if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
          target.focus({ preventScroll: true })
        }
        announcement.value = document.title
      })
    }
  )

  return readonly(announcement)
}
