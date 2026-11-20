export type TightRegion = {
  above: string
  below: string
  at: number
  gap: number
  min: number
}

export function findTightRegions(): TightRegion[] {
  const CONTROLS =
    'button, a, input, textarea, select, label, summary, [role="button"], [role="combobox"], [role="switch"], [role="checkbox"], [role="radio"], [role="tab"], [role="option"], [role="menuitem"], [role="slider"], [role="textbox"]'
  const HEADINGS = 'h1, h2, h3, h4, h5, h6, [role="heading"]'
  const UNITS =
    'article, li, [role="listitem"], [role="log"], dialog, [role="dialog"], [role="alertdialog"]'
  const ITEMS = 'li, [role="listitem"], [role="row"]'
  const MIN_WIDTH = 120
  const MIN_HEIGHT = 32
  const FIELD_HEIGHT = 64
  const FIELDS = 'input, textarea, select, [contenteditable="true"]'
  const EDGE = 1.5

  const probe = document.createElement('div')
  probe.style.cssText = 'position:absolute;visibility:hidden;height:var(--layout-group-gap, 16px)'
  document.body.append(probe)
  const min = probe.getBoundingClientRect().height || 16
  probe.remove()

  const transparent = (color: string) =>
    color === 'transparent' ||
    /rgba\([^)]*,\s*0(\.0+)?\)$/.test(color) ||
    /\/\s*0(\.0+)?%?\)$/.test(color)

  const visible = (element: Element) => {
    const style = getComputedStyle(element)
    if (style.display === 'none' || style.display === 'contents') return false
    if (style.position === 'absolute' || style.position === 'fixed') return false
    if (!element.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return false
    const rect = element.getBoundingClientRect()
    return rect.width >= 1 && rect.height >= 1
  }

  const surfaces = new Map<Element, boolean>()
  const isSurface = (element: Element) => {
    if (surfaces.has(element)) return surfaces.get(element)!
    let result = false
    if (!element.matches(CONTROLS) && !element.closest('svg, [role="listbox"], [role="menu"]')) {
      const rect = element.getBoundingClientRect()
      const style = getComputedStyle(element)
      const field = rect.height <= FIELD_HEIGHT && element.querySelector(FIELDS) !== null
      if (rect.width >= MIN_WIDTH && rect.height >= MIN_HEIGHT && !field) {
        const framed = (['top', 'right', 'bottom', 'left'] as const).every((side) => {
          const width = parseFloat(style.getPropertyValue(`border-${side}-width`))
          const line = style.getPropertyValue(`border-${side}-style`)
          const color = style.getPropertyValue(`border-${side}-color`)
          return width > 0 && line !== 'none' && line !== 'hidden' && !transparent(color)
        })
        const filled =
          !transparent(style.backgroundColor) && parseFloat(style.borderTopLeftRadius) > 0
        result = framed || filled
      }
    }
    surfaces.set(element, result)
    return result
  }

  const anchorAt = (
    root: Element,
    edge: 'top' | 'bottom',
    accept: (element: Element) => boolean
  ): Element | null => {
    const box = root.getBoundingClientRect()
    const line = edge === 'top' ? box.top : box.bottom
    const queue: Element[] = [root]
    while (queue.length) {
      const element = queue.shift()!
      if (!visible(element)) continue
      const rect = element.getBoundingClientRect()
      if (Math.abs((edge === 'top' ? rect.top : rect.bottom) - line) > EDGE) continue
      if (accept(element)) return element
      queue.push(...Array.from(element.children))
    }
    return null
  }

  const units = new Map<Element, boolean>()
  const insideUnit = (element: Element | null): boolean => {
    if (!element || element === document.body) return false
    if (units.has(element)) return units.get(element)!
    const style = getComputedStyle(element)
    const result =
      element.matches(UNITS) ||
      style.position === 'fixed' ||
      style.position === 'sticky' ||
      isSurface(element) ||
      insideUnit(element.parentElement)
    units.set(element, result)
    return result
  }

  const contentTop = (element: Element) => {
    const style = getComputedStyle(element)
    return (
      element.getBoundingClientRect().top +
      parseFloat(style.paddingTop) +
      parseFloat(style.borderTopWidth)
    )
  }

  const describe = (element: Element) => {
    const testId = element.getAttribute('data-testid')
    const tag = element.tagName.toLowerCase()
    if (testId) return `${tag}[data-testid="${testId}"]`
    const owner = element.closest('[data-testid]')
    const classes = (element.getAttribute('class') ?? '').trim().split(/\s+/).slice(0, 4).join('.')
    const self = classes ? `${tag}.${classes}` : tag
    return owner ? `${self} in [data-testid="${owner.getAttribute('data-testid')}"]` : self
  }

  const owner = (element: Element) => element.getAttribute('data-testid')?.split('__')[0] ?? null
  const sameOwner = (a: Element, b: Element) => {
    const first = owner(a)
    return (
      first !== null &&
      first === owner(b) &&
      (a.matches('[data-testid*="__"]') || b.matches('[data-testid*="__"]'))
    )
  }

  const kind = (element: Element) =>
    `${element.tagName}|${element.getAttribute('data-testid') ?? ''}|${element.getAttribute('class') ?? ''}`

  const found: TightRegion[] = []
  const seen = new Set<string>()
  for (const parent of Array.from(document.body.querySelectorAll('*'))) {
    if (parent.children.length < 2 || parent.closest('svg') || insideUnit(parent)) continue
    const flow = getComputedStyle(parent)
    if (flow.display.endsWith('flex') && !flow.flexDirection.startsWith('column')) continue
    if (!visible(parent) && getComputedStyle(parent).display !== 'contents') continue
    const children = Array.from(parent.children)
      .filter(visible)
      .map((element) => ({ element, rect: element.getBoundingClientRect() }))
      .sort((a, b) => a.rect.top - b.rect.top)
    for (let i = 0; i < children.length - 1; i++) {
      const a = children[i]!
      const b = children[i + 1]!
      if (b.rect.top - a.rect.bottom >= min - 0.5) continue
      const overlap = Math.min(a.rect.right, b.rect.right) - Math.max(a.rect.left, b.rect.left)
      if (overlap < 0.5 * Math.min(a.rect.width, b.rect.width)) continue
      const above = anchorAt(
        a.element,
        'bottom',
        (element) =>
          isSurface(element) && element.getBoundingClientRect().width >= 0.5 * a.rect.width
      )
      if (!above) continue
      const below = anchorAt(
        b.element,
        'top',
        (element) =>
          element.matches(HEADINGS) ||
          (isSurface(element) && element.getBoundingClientRect().width >= 0.5 * b.rect.width)
      )
      if (!below) continue
      if (kind(above) === kind(below) || sameOwner(above, below)) continue
      if (above.closest(ITEMS) || below.closest(ITEMS)) continue
      if (above.contains(below) || below.contains(above)) continue
      const bottom = above.getBoundingClientRect().bottom
      const top = below.matches(HEADINGS) ? contentTop(below) : below.getBoundingClientRect().top
      const gap = top - bottom
      if (gap < -0.5 || gap >= min - 0.5) continue
      const key = `${describe(above)} | ${describe(below)}`
      if (seen.has(key)) continue
      seen.add(key)
      found.push({
        above: describe(above),
        below: describe(below),
        at: Math.round(bottom + window.scrollY),
        gap: Math.round(gap * 100) / 100,
        min
      })
    }
  }
  return found
}
