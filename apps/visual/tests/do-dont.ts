export type PairFinding = { kind: string; where: string }

export function findBrokenPairs(): PairFinding[] {
  const WORDS =
    /^(do|don['’]t|do not|never|avoid|recommended|when to use|when not to use|correct|incorrect|wrong|good|bad)$/i
  const LABELS = 'h1, h2, h3, h4, h5, h6, dt, th, strong, b, summary, legend'
  const EDGE = 1.5
  const wide = window.innerWidth >= 768
  const main = document.querySelector('main') ?? document.body
  const out: PairFinding[] = []
  const where = (element: Element) => {
    const section = element.closest('section[id], [id]')
    const text = (element.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 60)
    return `${section ? `#${section.id} ` : ''}"${text}"`
  }

  for (const pair of main.querySelectorAll('[data-slot="do-dont"]')) {
    const first = pair.querySelector(':scope > [data-slot="do"]')
    const second = pair.querySelector(':scope > [data-slot="dont"]')
    if (!first || !second) continue
    const a = first.getBoundingClientRect()
    const b = second.getBoundingClientRect()
    if (wide) {
      if (Math.abs(a.top - b.top) > EDGE || (b.left < a.right - EDGE && a.left < b.right - EDGE))
        out.push({ kind: 'stacked at desktop width', where: where(first) })
      else if (Math.abs(a.height - b.height) > EDGE)
        out.push({ kind: `unequal heights (${a.height} vs ${b.height})`, where: where(first) })
    } else if (a.bottom > b.top + EDGE) {
      out.push({ kind: 'Do does not come first on a narrow screen', where: where(first) })
    }
  }

  for (const label of main.querySelectorAll(LABELS)) {
    if (!label.getClientRects().length) continue
    if (label.closest('[data-slot="do-dont"], [data-example], [data-source], pre, code')) continue
    const own = (label.textContent ?? '').trim()
    const lead = (label.parentElement?.textContent ?? '').trim()
    if (label.matches('strong, b') && !lead.startsWith(own)) continue
    const text = own.replace(/[:.]$/, '')
    if (WORDS.test(text))
      out.push({ kind: 'pair label outside the Do/Don’t structure', where: where(label) })
  }
  return out
}

export function findPairContrastFailures(): PairFinding[] {
  const TEXT = 4.5
  const LARGE = 3
  const ICON = 3
  const main = document.querySelector('main') ?? document.body
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  const context = canvas.getContext('2d', { willReadFrequently: true })
  const out: PairFinding[] = []
  if (!context) return out

  const rgba = (color: string): [number, number, number, number] => {
    context.clearRect(0, 0, 1, 1)
    context.fillStyle = '#000'
    context.fillStyle = color
    context.fillRect(0, 0, 1, 1)
    const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data
    return [r, g, b, a / 255]
  }
  const over = (top: number[], bottom: number[]) =>
    [0, 1, 2].map((i) => top[i] * top[3] + bottom[i] * (1 - top[3]))
  const background = (element: Element): number[] => {
    const layers: number[][] = []
    for (let node: Element | null = element; node; node = node.parentElement) {
      const color = rgba(getComputedStyle(node).backgroundColor)
      if (color[3] > 0) layers.push(color)
      if (color[3] >= 1) break
    }
    return layers.reduceRight(
      (below, layer) => [...over(layer, [...below, 1]), 1],
      [255, 255, 255, 1]
    )
  }
  const luminance = (rgb: number[]) => {
    const [r, g, b] = rgb.map((channel) => {
      const c = channel / 255
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  const ratio = (a: number[], b: number[]) => {
    const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x)
    return (high + 0.05) / (low + 0.05)
  }
  const ownText = (element: Element) =>
    [...element.childNodes].some(
      (node) => node.nodeType === Node.TEXT_NODE && (node.textContent ?? '').trim()
    )
  const theme = document.documentElement.dataset.theme ?? 'light'
  const MARKS: Record<string, string> = { do: '--success-mark', dont: '--danger-mark' }
  const token = (name: string) => {
    const probe = document.createElement('span')
    probe.style.color = `var(${name})`
    main.append(probe)
    const color = getComputedStyle(probe).color
    probe.remove()
    return color
  }

  for (const pair of main.querySelectorAll('[data-slot="do-dont"]')) {
    for (const card of pair.querySelectorAll(':scope > [data-slot]')) {
      const side = card.getAttribute('data-slot')
      for (const element of card.querySelectorAll('*')) {
        if (!element.getClientRects().length) continue
        const icon = element.matches('i.az')
        if (!icon && !ownText(element)) continue
        const style = getComputedStyle(element)
        if (style.visibility === 'hidden' || Number(style.opacity) === 0) continue
        const back = background(element)
        const fore = over(rgba(style.color), back)
        const size = parseFloat(style.fontSize)
        const large = size >= 24 || (size >= 18.66 && Number(style.fontWeight) >= 700)
        const need = icon ? ICON : large ? LARGE : TEXT
        const measured = ratio(fore, back)
        const mark = MARKS[side ?? '']
        if (
          icon &&
          pair.getAttribute('data-type') !== 'usage' &&
          mark &&
          style.color !== token(mark)
        )
          out.push({
            kind: `${theme} icon is not ${mark}`,
            where: `${side} <i> (${style.color}, ${mark} is ${token(mark)})`
          })
        if (measured < need) {
          const text = (element.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 40)
          out.push({
            kind: `${theme} ${icon ? 'icon' : 'text'} contrast ${measured.toFixed(2)}:1 < ${need}:1`,
            where: `${side} <${element.tagName.toLowerCase()}> "${text}" (${style.color})`
          })
        }
      }
    }
  }
  return out
}
