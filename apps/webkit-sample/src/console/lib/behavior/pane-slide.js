const motionToken = (name) =>
  globalThis
    .getComputedStyle?.(globalThis.document.documentElement)
    .getPropertyValue(name)
    .trim() ?? ''

const prefersReducedMotion = () =>
  globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

export const slidePane = (element, from, to, phase = 'entrance') => {
  if (!element?.animate || prefersReducedMotion()) return Promise.resolve(null)
  const animation = element.animate(
    [
      { flexBasis: `${from}px`, width: `${from}px` },
      { flexBasis: `${to}px`, width: `${to}px` }
    ],
    {
      duration: Number.parseFloat(motionToken('--transition-duration-moderate-02')) || 0,
      easing: motionToken(`--ease-productive-${phase}`) || 'ease',
      fill: 'forwards'
    }
  )
  return animation.finished.then(
    () => animation,
    () => null
  )
}
