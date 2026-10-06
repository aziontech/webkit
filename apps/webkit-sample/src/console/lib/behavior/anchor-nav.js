export function routeActivation(event) {
  if (!event) return true
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false
  if (typeof event.button === 'number' && event.button !== 0) return false
  event.preventDefault()
  return true
}

const FRAME_BUDGET = 60

export function focusSection(id) {
  return new Promise((resolve) => {
    let frames = 0
    const look = () => {
      const target = globalThis.document?.getElementById(id)
      if (target) {
        const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches
        target.scrollIntoView({ block: 'start', behavior: reduced ? 'auto' : 'smooth' })
        return resolve(true)
      }
      if (++frames > FRAME_BUDGET) return resolve(false)
      globalThis.requestAnimationFrame(look)
    }
    globalThis.requestAnimationFrame(look)
  })
}
