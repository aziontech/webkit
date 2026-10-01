const ART_BOUNDS_ON_CANVAS = {
  'retail-application-modernization': { canvas: 592, start: 51, end: 542 },
  'protect-financial-applications': { canvas: 592, start: 58, end: 506 },
  'implement-api-gateway-security': { canvas: 592, start: 0, end: 592 },
  'combine-data-and-vector-search': { canvas: 370, start: 0, end: 370 },
  'improve-application-performance-and-reliability': { canvas: 592, start: 131, end: 461 },
  'fastest-path-to-live-website': { canvas: 592, start: 84, end: 510 },
  'ddos-protection': { canvas: 186, start: -93, end: 279 },
  'quick-start-with-templates': { canvas: 360, start: 4, end: 341 },
  'low-latency': { canvas: 592, start: 39, end: 553 }
}

const ART_SHARE_OF_MEDIA_COLUMN = 0.9

export const HERO_ART_CLASS =
  'md:w-(--hero-art-width) md:max-w-none md:shrink-0 md:-me-(--hero-art-bleed)'

export function heroArt(name) {
  const { canvas, start, end } = ART_BOUNDS_ON_CANVAS[name]
  const width = (ART_SHARE_OF_MEDIA_COLUMN * canvas) / (end - start)
  const bleed = (width * (canvas - end)) / canvas
  return {
    '--hero-art-width': `${(width * 100).toFixed(2)}%`,
    '--hero-art-bleed': `${(bleed * 100).toFixed(2)}%`
  }
}
