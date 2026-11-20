export type BandEdge = {
  band: string
  edge: number
}

export function findBandEdges(): BandEdge[] {
  const BANDS =
    '[data-testid="hero"], [data-testid="module-header"], [data-testid="module"] > [data-padded], [data-testid="module"] > [data-frame-edges]'

  const textEdge = (band: Element) => {
    let edge = Infinity
    const walker = document.createTreeWalker(band, NodeFilter.SHOW_TEXT)
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const parent = node.parentElement
      if (!parent || !node.textContent?.trim()) continue
      if (parent.closest('[aria-hidden="true"], svg')) continue
      if (getComputedStyle(parent).textAlign === 'center') continue
      const box = parent.getBoundingClientRect()
      if (box.width <= 1 || box.height <= 1) continue
      if (!parent.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue
      const range = document.createRange()
      range.selectNodeContents(node)
      for (const rect of Array.from(range.getClientRects())) {
        if (rect.width > 1 && rect.height > 1) edge = Math.min(edge, rect.left)
      }
    }
    return edge
  }

  const name = (element: Element) => {
    const owner = element.closest('[data-testid]')
    const heading = element.querySelector('h1, h2, h3')?.textContent?.trim().slice(0, 40) ?? ''
    return `${owner?.getAttribute('data-testid') ?? element.tagName.toLowerCase()} "${heading}"`
  }

  return Array.from(document.querySelectorAll(BANDS))
    .filter((band) => !band.parentElement?.closest(BANDS))
    .map((band) => ({ band: name(band), edge: Math.round(textEdge(band) * 10) / 10 }))
    .filter((band) => Number.isFinite(band.edge))
}
