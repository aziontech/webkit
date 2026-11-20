export type MixedOutline = {
  toolbar: string
  first: string
  second: string
  firstColor: string
  secondColor: string
  height: number
}

export function findMixedToolbarOutlines(): MixedOutline[] {
  type Outlined = { element: Element; box: DOMRect; color: string }

  const TOOLBARS =
    'header, [role="toolbar"], [role="banner"], [data-slot="toolbar"], [data-testid$="toolbar"], [data-testid$="__actions"], [data-testid$="__end"]'
  const CONTROLS =
    'button, a[href], [role="button"], [role="combobox"], [role="radiogroup"], [role="tablist"], input, textarea, select, [contenteditable=""], [contenteditable="true"]'
  const TEXT_ENTRY =
    'input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="range"]):not([type="color"]):not([type="file"]), textarea, [contenteditable=""], [contenteditable="true"], [role="textbox"], [role="searchbox"]'
  const MIN_HEIGHT = 20
  const MAX_HEIGHT = 56
  const ROW_TOLERANCE = 2

  const MIN_ALPHA = 0.1

  const transparent = (color: string) => {
    if (color === 'transparent') return true
    const alpha = /rgba\([^)]*,\s*([\d.]+)\)$/.exec(color) ?? /\/\s*([\d.]+)(%?)\)$/.exec(color)
    if (!alpha?.[1]) return false
    const value = parseFloat(alpha[1]) / (alpha[2] === '%' ? 100 : 1)
    return value < MIN_ALPHA
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

  const outlineOf = (element: Element): string | null => {
    const style = getComputedStyle(element)
    const sides = [
      [style.borderTopWidth, style.borderTopStyle, style.borderTopColor],
      [style.borderRightWidth, style.borderRightStyle, style.borderRightColor],
      [style.borderBottomWidth, style.borderBottomStyle, style.borderBottomColor],
      [style.borderLeftWidth, style.borderLeftStyle, style.borderLeftColor]
    ]
    if (
      sides.some(
        ([width, lineStyle, color]) =>
          parseFloat(width) < 1 || lineStyle === 'none' || lineStyle === 'hidden' || transparent(color)
      )
    )
      return null
    const colors = new Set(sides.map(([, , color]) => color))
    return colors.size === 1 ? (sides[0]?.[2] ?? null) : null
  }

  const disabled = (element: Element) =>
    element.matches(':disabled, [aria-disabled="true"], [data-disabled]') ||
    Boolean(element.querySelector(':disabled, [aria-disabled="true"], [data-disabled]'))

  const outlinedControl = (control: Element, toolbar: Element): Element | null => {
    let node: Element | null = control
    for (let depth = 0; node && depth < 3 && node !== toolbar; depth++) {
      if (outlineOf(node)) return node
      node = node.parentElement
    }
    return null
  }

  const findings: MixedOutline[] = []
  const seen = new Set<string>()

  for (const toolbar of Array.from(document.body.querySelectorAll(TOOLBARS))) {
    if (!toolbar.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue
    if (toolbar.closest('[aria-hidden="true"], [inert]')) continue

    const outlined: Outlined[] = []
    for (const control of Array.from(toolbar.querySelectorAll(CONTROLS))) {
      if (!control.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue
      if (control.closest('[role="listbox"], [role="menu"], [role="dialog"], [popover]')) continue
      const box = outlinedControl(control, toolbar)
      if (!box || outlined.some((entry) => entry.element === box)) continue
      if (outlined.some((entry) => entry.element.contains(box) || box.contains(entry.element)))
        continue
      if (box.matches(TEXT_ENTRY) || box.querySelector(TEXT_ENTRY)) continue
      if (disabled(box)) continue
      const rect = box.getBoundingClientRect()
      if (rect.height < MIN_HEIGHT || rect.height > MAX_HEIGHT) continue
      if (rect.width > toolbar.getBoundingClientRect().width * 0.6) continue
      outlined.push({ element: box, box: rect, color: outlineOf(box) ?? '' })
    }

    for (let i = 0; i < outlined.length; i++) {
      for (let j = i + 1; j < outlined.length; j++) {
        const a = outlined[i]
        const b = outlined[j]
        if (!a || !b || a.color === b.color) continue
        if (Math.abs(a.box.height - b.box.height) > 1) continue
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
          firstColor: a.color,
          secondColor: b.color,
          height: Math.round(a.box.height)
        })
      }
    }
  }
  return findings
}
