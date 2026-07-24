import { ref, onMounted, onUnmounted } from 'vue'
import { getActiveBreakpoint } from '../utils/from-tokens.js'

/** @typedef {'_' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'} BreakpointKey */

export function useViewport() {
  /** @type {import('vue').Ref<BreakpointKey>} */
  const breakpoint = ref('_')

  function update() {
    breakpoint.value = getActiveBreakpoint(window.innerWidth)
  }

  onMounted(() => {
    update()
    window.addEventListener('resize', update)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', update)
  })

  return { breakpoint }
}
