import { nextTick, readonly, type Ref, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

function focusTarget(hash: string): HTMLElement | null {
  const main = document.getElementById('main')
  if (!main) return null
  const anchored = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
  return anchored ?? main.querySelector<HTMLElement>('h1') ?? main
}

export function useRouteFocus(): Readonly<Ref<string>> {
  const route = useRoute()
  const router = useRouter()
  const announcement = ref('')
  let ready = false
  if (!import.meta.env.SSR) void router.isReady().then(() => (ready = true))

  watch(
    () => route.path,
    async () => {
      if (import.meta.env.SSR || !ready) return
      announcement.value = ''
      await nextTick()
      requestAnimationFrame(() => {
        const target = focusTarget(route.hash)
        if (target) {
          if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
          target.setAttribute('data-route-focus', '')
          target.focus({ preventScroll: true })
        }
        const heading = document.querySelector('#main h1')?.textContent?.trim()
        announcement.value = heading || document.title
      })
    }
  )

  return readonly(announcement)
}
