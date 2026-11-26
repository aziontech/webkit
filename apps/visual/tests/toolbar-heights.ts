export type MixedHeight = {
  toolbar: string
  first: string
  second: string
  firstHeight: number
  secondHeight: number
}

export function findMixedToolbarHeights(): MixedHeight[] {
  type Painted = { element: Element; box: DOMRect }

  const TOOLBARS =
    'header, [role="toolbar"], [role="banner"], [data-slot="toolbar"], [data-testid$="toolbar"], [data-testid$="__actions"], [data-testid$="__end"]'
  const CONTROLS =
    'button, a[href], [role="button"], [role="combobox"], [role="radiogroup"], [role="tablist"], input, textarea, select, [contenteditable=""], [contenteditable="true"]'
  const SMALL_MARKS =
    'input[type="checkbox"], input[type="radio"], input[type="range"], input[type="color"], [role="switch"], [role="checkbox"], [role="radio"], [role="slider"]'
  const MIN_HEIGHT = 20
  const MAX_HEIGHT = 56
  const ROW_TOLERANCE = 2
  const HEIGHT_TOLERANCE = 0.5

  const transparent = (color: string) => {
    if (color === 'transparent') return true
    const alpha = /rgba\([^)]*,\s*([\d.]+)\)$/.exec(color) ?? /\/\s*([\d.]+)(%?)\)$/.exec(color)
    if (!alpha?.[1]) return false
    return parseFloat(alpha[1]) / (alpha[2] === '%' ? 100 : 1) === 0
  }

  const describe = (element: Element) => {
    const testId = element.getAttribute('data-testid')
    const tag = element.tagName.toLowerCase()
    if (testId) return `${tag}[data-testid="${testId}"]`
    const owner = element.closest('[data-testid]')
    const label = element.getAttribute('aria-label')
    const self = label ? `${tag}[aria-label="${label}"]` : tag
    return owner ? `${self} in [data-testid="${owner.getAttribute('data-testid')}"]` : self
  }

  const painted = (element: Element) => {
    const style = getComputedStyle(element)
    const sides = [
      [style.borderTopWidth, style.borderTopStyle, style.borderTopColor],
      [style.borderBottomWidth, style.borderBottomStyle, style.borderBottomColor]
    ]
    const bordered = sides.every(
      ([width, lineStyle, color]) =>
        parseFloat(width) >= 1 &&
        lineStyle !== 'none' &&
        lineStyle !== 'hidden' &&
        !transparent(color)
    )
    return bordered || !transparent(style.backgroundColor)
  }

  const paintedBox = (control: Element, toolbar: Element): Element | null => {
    let found: Element | null = null
    let node: Element | null = control
    for (let depth = 0; node && depth < 3 && node !== toolbar; depth++) {
      if (painted(node)) found = node
      node = node.parentElement
    }
    return found
  }

  const findings: MixedHeight[] = []
  const seen = new Set<string>()

  for (const toolbar of Array.from(document.body.querySelectorAll(TOOLBARS))) {
    if (!toolbar.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue
    if (toolbar.closest('[aria-hidden="true"], [inert]')) continue
    const toolbarWidth = toolbar.getBoundingClientRect().width

    const boxes: Painted[] = []
    for (const control of Array.from(toolbar.querySelectorAll(CONTROLS))) {
      if (!control.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue
      if (control.matches(SMALL_MARKS)) continue
      if (control.closest('[role="listbox"], [role="menu"], [role="dialog"], [popover]')) continue
      const box = paintedBox(control, toolbar)
      if (!box || boxes.some((entry) => entry.element === box)) continue
      if (boxes.some((entry) => entry.element.contains(box) || box.contains(entry.element)))
        continue
      const rect = box.getBoundingClientRect()
      if (rect.height < MIN_HEIGHT || rect.height > MAX_HEIGHT) continue
      if (rect.width > toolbarWidth * 0.95 && toolbarWidth > 0) continue
      boxes.push({ element: box, box: rect })
    }

    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i]
        const b = boxes[j]
        if (!a || !b) continue
        if (Math.abs(a.box.height - b.box.height) <= HEIGHT_TOLERANCE) continue
        const centerA = a.box.top + a.box.height / 2
        const centerB = b.box.top + b.box.height / 2
        if (Math.abs(centerA - centerB) > ROW_TOLERANCE) continue
        const key = `${describe(a.element)}|${describe(b.element)}`
        if (seen.has(key)) continue
        seen.add(key)
        findings.push({
          toolbar: describe(toolbar),
          first: describe(a.element),
          second: describe(b.element),
          firstHeight: Math.round(a.box.height * 10) / 10,
          secondHeight: Math.round(b.box.height * 10) / 10
        })
      }
    }
  }
  return findings
}
