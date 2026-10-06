export const MORPH_TRANSITION = {
  moveClass:
    'transition-[transform,translate,opacity]! duration-moderate-02! ease-expressive-entrance! motion-reduce:transition-none!',
  enterActiveClass:
    'transition-all duration-moderate-01 ease-productive-entrance motion-reduce:transition-none',
  enterFromClass: '-translate-y-(--spacing-xxs) opacity-0',
  leaveActiveClass:
    'absolute! w-full transition-[opacity,translate]! duration-moderate-01! ease-productive-exit! motion-reduce:transition-none!',
  leaveToClass: '-translate-y-(--spacing-xxs) opacity-0'
}

export const BLOCK_SWAP = {
  mode: 'out-in',
  enterActiveClass:
    'transition-[opacity,translate] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none',
  enterFromClass: 'translate-y-(--spacing-xxs) opacity-0',
  leaveActiveClass:
    'transition-[opacity,translate] duration-fast-02 ease-productive-exit motion-reduce:transition-none',
  leaveToClass: '-translate-y-(--spacing-xxs) opacity-0'
}

const rowGapOf = (el) => {
  const parent = el.parentElement
  if (!parent) return 0
  const gap = parseFloat(globalThis.getComputedStyle(parent).rowGap)
  return Number.isFinite(gap) ? gap : 0
}

const setBox = (el, height, margin) => {
  el.style.height = height
  el.style.marginBlockEnd = margin
}

const release = (el) => {
  setBox(el, '', '')
  el.style.overflow = ''
}

const commit = (el) => void el.offsetHeight

export const MORPH_COLLAPSE = {
  moveClass:
    'transition-[transform,translate,opacity]! duration-moderate-01! ease-productive-entrance! motion-reduce:transition-none!',
  enterActiveClass:
    'transition-[height,margin,opacity]! duration-fast-02! ease-productive-entrance! motion-reduce:transition-none!',
  enterFromClass: 'opacity-0',
  leaveActiveClass:
    'transition-[height,margin,opacity]! duration-fast-02! ease-productive-exit! motion-reduce:transition-none!',
  leaveToClass: 'opacity-0',

  onEnter(el) {
    const gap = rowGapOf(el)
    el.style.overflow = 'hidden'
    el.style.height = 'auto'
    const to = el.offsetHeight
    setBox(el, '0px', `-${gap}px`)
    commit(el)
    setBox(el, `${to}px`, '0px')
  },
  onAfterEnter: release,
  onEnterCancelled: release,

  onLeave(el) {
    const gap = rowGapOf(el)
    el.style.overflow = 'hidden'
    setBox(el, `${el.offsetHeight}px`, '0px')
    commit(el)
    setBox(el, '0px', `-${gap}px`)
  }
}
