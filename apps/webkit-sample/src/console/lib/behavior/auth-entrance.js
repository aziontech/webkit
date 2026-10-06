import { curve, duration } from '@aziontech/theme/animations'
import { onMounted, ref } from 'vue'

const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

const ENTER_TIMING = `${duration['slow-01']} ${curve['expressive-entrance']}`

export function useAuthEntrance() {
  const reduced = prefersReducedMotion()

  const leadStyle = reduced
    ? { transition: 'none' }
    : {
        transition: `opacity ${ENTER_TIMING}, translate ${ENTER_TIMING}, transform ${ENTER_TIMING}`
      }
  const followStyle = reduced
    ? { transition: 'none' }
    : { ...leadStyle, transitionDelay: duration['fast-01'] }

  const entered = ref(false)
  onMounted(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        entered.value = true
      })
    })
  })

  return { entered, leadStyle, followStyle }
}
