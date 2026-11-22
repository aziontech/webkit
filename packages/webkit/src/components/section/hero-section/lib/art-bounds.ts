type HeroSectionArtBounds = {
  canvas: number
  start: number
  end: number
  share?: number
  top?: number
  bottom?: number
  rows?: number
  centered?: boolean
}

const COMPARISON: HeroSectionArtBounds = {
  canvas: 592,
  start: 161,
  end: 370,
  share: 0.6,
  top: 48,
  bottom: 252,
  rows: 300,
  centered: true
}

export const ART_BOUNDS: Record<string, HeroSectionArtBounds> = {
  'azion-to-akamai': COMPARISON,
  'azion-to-aws': COMPARISON,
  'azion-to-cloudflare': COMPARISON,
  'azion-to-fastly': COMPARISON,
  'azion-to-vercel': { ...COMPARISON, start: 209, end: 418 },
  'retail-application-modernization': { canvas: 592, start: 51, end: 542 },
  'protect-financial-applications': { canvas: 592, start: 58, end: 506 },
  'implement-api-gateway-security': { canvas: 592, start: 0, end: 592 },
  'combine-data-and-vector-search': {
    canvas: 592,
    start: 111,
    end: 481,
    top: 57,
    bottom: 243,
    rows: 300
  },
  'improve-application-performance-and-reliability': {
    canvas: 592,
    start: 131,
    end: 461,
    top: 18,
    bottom: 282,
    rows: 300
  },
  'fastest-path-to-live-website': { canvas: 592, start: 84, end: 510 },
  'ddos-protection': { canvas: 186, start: -93, end: 279 },
  'quick-start-with-templates': {
    canvas: 592,
    start: 127,
    end: 465,
    top: 67,
    bottom: 233,
    rows: 300
  },
  'low-latency': { canvas: 592, start: 39, end: 553 }
}

export const DEFAULT_BOUNDS: HeroSectionArtBounds = { canvas: 592, start: 131, end: 461 }
