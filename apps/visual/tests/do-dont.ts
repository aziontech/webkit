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
