import { nextTick, ref } from 'vue'

const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

const RELEASE_FALLBACK_MS = 600

export function useAnimatedHeight() {
  const region = ref(null)
  const height = ref('')

  let release = null

  const animateHeight = async (mutate) => {
    const node = region.value

    if (!node || prefersReducedMotion()) {
      mutate()
      return
    }

    release?.()

    const from = node.offsetHeight

    mutate()
    await nextTick()
    const to = node.offsetHeight

    if (to === from) return

    height.value = `${from}px`

    let timer = null
    const finish = () => {
      node.removeEventListener('transitionend', onEnd)
      clearTimeout(timer)
      height.value = ''
      release = null
    }
    const onEnd = (event) => {
      if (event.propertyName === 'height' && event.target === node) finish()
    }

    node.addEventListener('transitionend', onEnd)
    timer = setTimeout(finish, RELEASE_FALLBACK_MS)
    release = finish

    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (release === finish) height.value = `${to}px`
      })
    )
  }

  return { region, height, animateHeight }
}
