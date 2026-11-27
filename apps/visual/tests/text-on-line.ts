export type TextOnLine = {
  text: string
  line: string
  side: 'above' | 'below'
  at: number
  gap: number
  min: number
}

export function findTextOnLines(): TextOnLine[] {
  const CONTROLS =
    'button, a, input, textarea, select, label, summary, code, kbd, mark, [role="button"], [role="combobox"], [role="switch"], [role="checkbox"], [role="radio"], [role="tab"], [role="option"], [role="menuitem"], [role="slider"], [role="textbox"], [role="progressbar"], [role="meter"]'
  const SKIP =
    'svg, canvas, pre, [role="log"], [data-testid^="log-viewer"], [aria-hidden="true"], [data-plain-ground], [role="img"]'
  const COMPACT = 44
  const OVERLAP = 8
  const BUCKET = 32

  const probe = document.createElement('div')
  probe.style.cssText = 'position:absolute;visibility:hidden;height:var(--spacing-2xs, 4px)'
  document.body.append(probe)
  const min = probe.getBoundingClientRect().height || 4
  probe.remove()

  const transparent = (color: string) =>
    color === 'transparent' ||
    /rgba\([^)]*,\s*0(\.0+)?\)$/.test(color) ||
    /\/\s*0(\.0+)?%?\)$/.test(color)

  type Line = { top: number; bottom: number; left: number; right: number; element: Element }
  const buckets = new Map<number, Line[]>()
  const addLine = (line: Line) => {
    for (
      let key = Math.floor((line.top - min) / BUCKET);
      key <= Math.floor((line.bottom + min) / BUCKET);
      key++
    ) {
      const list = buckets.get(key)
      if (list) list.push(line)
      else buckets.set(key, [line])
    }
  }

  const clips = new Map<Element, DOMRect | null>()
  const clipOf = (element: Element | null): DOMRect | null => {
    if (!element || element === document.documentElement) return null
    if (clips.has(element)) return clips.get(element)!
    const style = getComputedStyle(element)
    const own =
      style.overflowX !== 'visible' || style.overflowY !== 'visible'
        ? element.getBoundingClientRect()
        : null
    const outer = clipOf(element.parentElement)
    let result = own ?? outer
    if (own && outer) {
      const left = Math.max(own.left, outer.left)
      const top = Math.max(own.top, outer.top)
      result = new DOMRect(
        left,
        top,
        Math.max(0, Math.min(own.right, outer.right) - left),
        Math.max(0, Math.min(own.bottom, outer.bottom) - top)
      )
    }
    clips.set(element, result)
    return result
  }
  const shown = (
    rect: { top: number; bottom: number; left: number; right: number },
    clip: DOMRect | null
  ) =>
    !clip ||
    (rect.top >= clip.top - 0.5 &&
      rect.bottom <= clip.bottom + 0.5 &&
      rect.right > clip.left &&
      rect.left < clip.right)

  const layers = new Map<Element, Element | null>()
  const layerOf = (element: Element | null): Element | null => {
    if (!element || element === document.body) return null
    if (layers.has(element)) return layers.get(element)!
    const position = getComputedStyle(element).position
    const result =
      position === 'fixed' || position === 'sticky' || position === 'absolute'
        ? element
        : layerOf(element.parentElement)
    layers.set(element, result)
    return result
  }

  const scrollers = new Map<Element, Element | null>()
  const scrollerOf = (element: Element | null): Element | null => {
    if (!element || element === document.body) return null
    if (scrollers.has(element)) return scrollers.get(element)!
    const overflow = getComputedStyle(element).overflowY
    const result =
      overflow !== 'visible' && element.scrollHeight > element.clientHeight + 1
        ? element
        : scrollerOf(element.parentElement)
    scrollers.set(element, result)
    return result
  }

  for (const element of Array.from(document.body.querySelectorAll('*'))) {
    if (element.closest(SKIP)) continue
    const style = getComputedStyle(element)
    if (style.display === 'none' || style.display === 'contents') continue
    if (!element.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue
    const rect = element.getBoundingClientRect()
    if (rect.width < OVERLAP || rect.height < 1) continue
    const clip = clipOf(element.parentElement)
    for (const side of ['top', 'bottom'] as const) {
      const width = parseFloat(style.getPropertyValue(`border-${side}-width`))
      const stroke = style.getPropertyValue(`border-${side}-style`)
      const color = style.getPropertyValue(`border-${side}-color`)
      if (!(width > 0) || stroke === 'none' || stroke === 'hidden' || transparent(color)) continue
      const top = side === 'top' ? rect.top : rect.bottom - width
      const line = { top, bottom: top + width, left: rect.left, right: rect.right, element }
      if (shown(line, clip)) addLine(line)
    }
    if (
      (element.tagName === 'HR' || element.getAttribute('role') === 'separator') &&
      rect.height <= 2 &&
      !transparent(style.backgroundColor)
    ) {
      const line = {
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
        element
      }
      if (shown(line, clip)) addLine(line)
    }
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

  const found: TextOnLine[] = []
  const seen = new Set<string>()
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  const range = document.createRange()
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const content = node.textContent?.trim() ?? ''
    const parent = node.parentElement
    if (!content || !parent || parent.closest(SKIP)) continue
    if (parent.closest('.sr-only, [hidden], script, style, noscript, template')) continue
    if (!parent.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue
    const style = getComputedStyle(parent)
    if (transparent(style.color) || parseFloat(style.fontSize) < 1) continue
    const control = parent.closest(CONTROLS)
    const clip = clipOf(parent)
    const layer = layerOf(parent)
    const scroller = scrollerOf(parent)
    range.selectNodeContents(node)
    for (const rect of Array.from(range.getClientRects())) {
      if (rect.width < 2 || rect.height < 2 || !shown(rect, clip)) continue
      const lines = new Set<Line>()
      for (const key of [Math.floor(rect.top / BUCKET), Math.floor(rect.bottom / BUCKET)]) {
        for (const line of buckets.get(key) ?? []) lines.add(line)
      }
      for (const line of lines) {
        const overlap = Math.min(rect.right, line.right) - Math.max(rect.left, line.left)
        if (overlap < OVERLAP) continue
        const below = line.top - rect.bottom
        const above = rect.top - line.bottom
        const side =
          below > -1 && below < min - 0.25
            ? 'below'
            : above > -1 && above < min - 0.25
              ? 'above'
              : null
        if (!side) continue
        const owner = line.element
        if (control && (control === owner || control.contains(owner) || owner.contains(control))) {
          if (owner.getBoundingClientRect().height <= COMPACT || control.contains(owner)) continue
        }
        const box = owner.getBoundingClientRect()
        if (owner.contains(parent) && box.height <= COMPACT) continue
        const middle = (rect.top + rect.bottom) / 2
        if (!owner.contains(parent) && box.top < middle && box.bottom > middle) continue
        if (scroller && (owner === scroller || !scroller.contains(owner))) continue
        if (parent.contains(owner)) continue
        if (layerOf(owner) !== layer && !owner.contains(parent)) continue
        const gap = Math.round((side === 'below' ? below : above) * 100) / 100
        const key = `${describe(parent)} | ${describe(owner)} | ${side}`
        if (seen.has(key)) continue
        seen.add(key)
        found.push({
          text: `${describe(parent)} "${content.slice(0, 32)}"`,
          line: describe(owner),
          side,
          at: Math.round(rect.bottom + window.scrollY),
          gap,
          min
        })
      }
    }
  }
  return found
}
