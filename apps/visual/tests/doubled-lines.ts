export type DoubledLine = {
  orientation: 'horizontal' | 'vertical'
  first: string
  second: string
  at: number
  from: number
  gap: number
  overlap: number
}

export function findDoubledLines(): DoubledLine[] {
  type Edge = {
    element: Element
    layer: Element | null
    box: DOMRect
    side: 'top' | 'right' | 'bottom' | 'left'
    horizontal: boolean
    near: number
    far: number
    start: number
    end: number
  }

  const SKIP = new Set(['INPUT', 'TEXTAREA', 'SELECT', 'OPTION', 'PROGRESS', 'METER', 'IFRAME'])
  const MIN_OVERLAP = 4
  const MARK_SIZE = 12
  const OVERLAY_DEPTH = 2
  const MAX_GAP = 1
  const scrollX = window.scrollX
  const scrollY = window.scrollY

  const transparent = (color: string) =>
    color === 'transparent' ||
    /rgba\([^)]*,\s*0(\.0+)?\)$/.test(color) ||
    /\/\s*0(\.0+)?%?\)$/.test(color)

  const clips = new Map<Element, DOMRect | null>()
  const clipOf = (element: Element): DOMRect | null => {
    const parent = element.parentElement
    if (!parent) return null
    if (clips.has(parent)) return clips.get(parent) ?? null
    const outer = clipOf(parent)
    const style = getComputedStyle(parent)
    let clip = outer
    if (style.overflowX !== 'visible' || style.overflowY !== 'visible') {
      const own = parent.getBoundingClientRect()
      if (!outer) clip = own
      else {
        const left = Math.max(own.left, outer.left)
        const top = Math.max(own.top, outer.top)
        const right = Math.min(own.right, outer.right)
        const bottom = Math.min(own.bottom, outer.bottom)
        clip = new DOMRect(left, top, Math.max(right - left, 0), Math.max(bottom - top, 0))
      }
    }
    clips.set(parent, clip)
    return clip
  }

  const scrollers = new Map<Element, { rect: DOMRect; x: boolean; y: boolean } | null>()
  const scrollerOf = (element: Element): { rect: DOMRect; x: boolean; y: boolean } | null => {
    const parent = element.parentElement
    if (!parent) return null
    if (scrollers.has(parent)) return scrollers.get(parent) ?? null
    const style = getComputedStyle(parent)
    const x = /auto|scroll/.test(style.overflowX) && parent.scrollWidth > parent.clientWidth + 1
    const y = /auto|scroll/.test(style.overflowY) && parent.scrollHeight > parent.clientHeight + 1
    const scroller = x || y ? { rect: parent.getBoundingClientRect(), x, y } : scrollerOf(parent)
    scrollers.set(parent, scroller)
    return scroller
  }

  const layers = new Map<Element, Element | null>()
  const layerOf = (element: Element | null): Element | null => {
    if (!element || element === document.body) return null
    if (layers.has(element)) return layers.get(element) ?? null
    const style = getComputedStyle(element)
    const floating =
      style.position === 'fixed' ||
      (style.position === 'sticky' && style.bottom !== 'auto') ||
      element.matches(':popover-open, dialog[open]')
    const layer = floating ? element : layerOf(element.parentElement)
    layers.set(element, layer)
    return layer
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

  const edges: Edge[] = []
  for (const element of Array.from(document.body.querySelectorAll('*'))) {
    if (SKIP.has(element.tagName) || element.closest('svg, input, textarea, select')) continue
    const style = getComputedStyle(element)
    if (style.display === 'contents' || style.display === 'none' || style.display === 'inline')
      continue
    if (!element.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue
    const rect = element.getBoundingClientRect()
    if (rect.width < 1 || rect.height < 1) continue
    if (rect.width <= MARK_SIZE && rect.height <= MARK_SIZE) continue
    const sides = [
      ['top', style.borderTopWidth, style.borderTopStyle, style.borderTopColor],
      ['right', style.borderRightWidth, style.borderRightStyle, style.borderRightColor],
      ['bottom', style.borderBottomWidth, style.borderBottomStyle, style.borderBottomColor],
      ['left', style.borderLeftWidth, style.borderLeftStyle, style.borderLeftColor]
    ] as const
    const radius = (value: string, horizontal: boolean) => {
      const [first, second = first] = value.split(' ')
      const part = horizontal ? first! : second!
      const size = horizontal ? rect.width : rect.height
      const amount = part.endsWith('%') ? (parseFloat(part) / 100) * size : parseFloat(part)
      return Math.min(Number.isFinite(amount) ? amount : 0, size / 2)
    }
    const corners = {
      top: [style.borderTopLeftRadius, style.borderTopRightRadius],
      bottom: [style.borderBottomLeftRadius, style.borderBottomRightRadius],
      left: [style.borderTopLeftRadius, style.borderBottomLeftRadius],
      right: [style.borderTopRightRadius, style.borderBottomRightRadius]
    }
    const clip = clipOf(element)
    if (
      clip &&
      (rect.left < clip.left - 0.5 ||
        rect.top < clip.top - 0.5 ||
        rect.right > clip.right + 0.5 ||
        rect.bottom > clip.bottom + 0.5)
    )
      continue
    for (const [side, rawWidth, lineStyle, color] of sides) {
      const width = parseFloat(rawWidth)
      if (!(width > 0) || lineStyle === 'none' || lineStyle === 'hidden' || transparent(color))
        continue
      const horizontal = side === 'top' || side === 'bottom'
      let near =
        side === 'top'
          ? rect.top
          : side === 'bottom'
            ? rect.bottom - width
            : side === 'left'
              ? rect.left
              : rect.right - width
      let far = near + width
      const [startCorner, endCorner] = corners[side]
      let start = (horizontal ? rect.left : rect.top) + radius(startCorner, horizontal)
      let end = (horizontal ? rect.right : rect.bottom) - radius(endCorner, horizontal)
      if (end - start < MIN_OVERLAP) continue
      const scroller = scrollerOf(element)
      if (scroller && (horizontal ? scroller.y : scroller.x)) {
        const [low, high] = horizontal
          ? [scroller.rect.top, scroller.rect.bottom]
          : [scroller.rect.left, scroller.rect.right]
        if (Math.abs(near - low) <= 1 || Math.abs(far - high) <= 1) continue
      }
      if (clip) {
        const [clipNear, clipFar] = horizontal ? [clip.top, clip.bottom] : [clip.left, clip.right]
        const [clipStart, clipEnd] = horizontal ? [clip.left, clip.right] : [clip.top, clip.bottom]
        near = Math.max(near, clipNear)
        far = Math.min(far, clipFar)
        start = Math.max(start, clipStart)
        end = Math.min(end, clipEnd)
        if (far - near <= 0 || end - start <= 0) continue
      }
      const offset = horizontal ? scrollY : scrollX
      const along = horizontal ? scrollX : scrollY
      edges.push({
        element,
        layer: layerOf(element),
        box: rect,
        side,
        horizontal,
        near: near + offset,
        far: far + offset,
        start: start + along,
        end: end + along
      })
    }
  }

  const overlay = (a: Edge, b: Edge) => {
    if (a.element.contains(b.element) || b.element.contains(a.element)) return false
    const width = Math.min(a.box.right, b.box.right) - Math.max(a.box.left, b.box.left)
    const height = Math.min(a.box.bottom, b.box.bottom) - Math.max(a.box.top, b.box.top)
    return width > OVERLAY_DEPTH && height > OVERLAY_DEPTH
  }

  const found: DoubledLine[] = []
  const seen = new Set<string>()
  for (const horizontal of [true, false]) {
    const group = edges.filter((edge) => edge.horizontal === horizontal)
    group.sort((a, b) => a.near - b.near)
    for (let i = 0; i < group.length; i++) {
      const a = group[i]!
      for (let j = i + 1; j < group.length; j++) {
        const b = group[j]!
        if (b.near - a.far > MAX_GAP + 0.5) break
        if (a.element === b.element || a.layer !== b.layer) continue
        if (overlay(a, b)) continue
        const gap = Math.max(b.near - a.far, a.near - b.far)
        const coincide = Math.min(a.far, b.far) - Math.max(a.near, b.near) > 0.5
        if (coincide || gap > MAX_GAP + 0.01) continue
        const overlap = Math.min(a.end, b.end) - Math.max(a.start, b.start)
        if (overlap < MIN_OVERLAP) continue
        const first = `${describe(a.element)} ${a.side}`
        const second = `${describe(b.element)} ${b.side}`
        const key = [first, second].sort().join(' | ')
        if (seen.has(key)) continue
        seen.add(key)
        found.push({
          orientation: horizontal ? 'horizontal' : 'vertical',
          first,
          second,
          at: Math.round(a.near),
          from: Math.round(Math.max(a.start, b.start)),
          gap: Math.round(gap * 100) / 100,
          overlap: Math.round(overlap)
        })
      }
    }
  }
  return found
}
