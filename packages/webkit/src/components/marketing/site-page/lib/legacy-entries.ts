import type { SitePageResolvedEntry, SitePageSectionProps } from '../site-page-sections'

export const records = (value: unknown): SitePageSectionProps[] =>
  Array.isArray(value) ? (value as SitePageSectionProps[]) : []

export const without = (props: SitePageSectionProps, ...keys: string[]): SitePageSectionProps =>
  Object.fromEntries(Object.entries(props).filter(([key]) => !keys.includes(key)))

type LegacyProp = string | { to: string; values: Record<string, string> }

const legacyProps: Record<string, Record<string, LegacyProp>> = {
  'architecture-tabs-section': {
    interval: 'autoplayInterval',
    position: { to: 'tabsSide', values: { left: 'start', right: 'end' } }
  },
  'article-cards-section': {
    kind: { to: 'align', values: { left: 'start', centered: 'center' } },
    variant: 'align'
  },
  'article-index-section': {
    categoryLabel: 'categoryAriaLabel',
    rowKind: { to: 'rowVariant', values: { centered: 'center' } },
    kind: 'variant'
  },
  'capability-grid-section': {
    kind: 'variant',
    titleKind: 'titleAlign',
    titleVariant: 'titleAlign'
  },
  'closing-call-to-action-section': {
    kind: { to: 'variant', values: { split: 'panel' } },
    variant: { to: 'variant', values: { split: 'panel' } }
  },
  'console-showcase-section': {
    kind: 'variant',
    titleKind: 'titleAlign',
    titleVariant: 'titleAlign'
  },
  'feature-tabs-section': {
    interval: 'autoplayInterval'
  },
  'feature-tiles-section': {
    kind: 'variant'
  },
  'feature-widgets-section': {
    titleKind: {
      to: 'titleAlign',
      values: { centered: 'center', left: 'start', horizontal: 'split' }
    },
    kind: 'variant',
    titleVariant: 'titleAlign'
  },
  'hero-form-section': {
    carouselMarks: 'marqueeMarks',
    carouselLabel: 'marqueeLabel',
    highlight: 'titleHighlight',
    error: 'failed',
    tickerLabel: 'marqueeLabel',
    tickerMarks: 'marqueeMarks'
  },
  'hero-section': {
    carouselMarks: 'marqueeMarks',
    carouselLabel: 'marqueeLabel',
    highlight: 'titleHighlight',
    kind: {
      to: 'variant',
      values: { centered: 'center', 'centered-band': 'center-band', 'pixel-floor': 'title-band' }
    },
    variant: { to: 'variant', values: { 'pixel-floor': 'title-band' } },
    tickerLabel: 'marqueeLabel',
    tickerMarks: 'marqueeMarks',
    illustration: {
      to: 'illustration',
      values: {
        'build-databases-from-code': 'sql-sdk-code-cards',
        'distributed-sql-for-resilient-global-reads': 'globe-with-sql-nodes',
        'enable-owasp-protection-with-customizable-rules': 'waf-threat-families-panel',
        'reputation-intelligence-for-enhanced-protection': 'reputation-rings-hub',
        'saas-platforms': 'azion-to-commerce-tiles',
        'stay-in-control': 'traffic-and-cost-bar-chart',
        'stream-security-events-for-investigation-and-response': 'data-stream-destinations-map',
        'white-gloves-when-it-matters': 'chat-and-headset-tiles'
      }
    }
  },
  'job-posting-section': {
    error: 'failed'
  },
  'listing-index-section': {
    rows: 'data'
  },
  'listing-table-section': {
    rows: 'data'
  },
  'logo-wall-section': {
    kind: 'variant',
    quoteKind: 'quoteVariant'
  },
  'media-split-section': {
    illustration: {
      to: 'illustration',
      values: {
        'build-databases-from-code': 'sql-sdk-code-cards',
        'distributed-sql-for-resilient-global-reads': 'globe-with-sql-nodes',
        'enable-owasp-protection-with-customizable-rules': 'waf-threat-families-panel',
        'reputation-intelligence-for-enhanced-protection': 'reputation-rings-hub',
        'saas-platforms': 'azion-to-commerce-tiles',
        'stay-in-control': 'traffic-and-cost-bar-chart',
        'stream-security-events-for-investigation-and-response': 'data-stream-destinations-map',
        'white-gloves-when-it-matters': 'chat-and-headset-tiles'
      }
    }
  },
  'network-section': {
    lead: 'claimsEyebrow',
    kind: 'variant'
  },
  'newsletter-section': {
    error: 'failed'
  },
  'process-scroll-section': {
    kind: 'variant',
    titleKind: 'titleAlign',
    titleVariant: 'titleAlign'
  },
  'template-gallery-section': {
    tickerLabel: 'marqueeLabel',
    tickerMarks: 'marqueeMarks'
  }
}

const joined = (...parts: unknown[]): string =>
  parts.filter((part) => typeof part === 'string' && part.length > 0).join(' ')

const legacyShapes: Record<string, (props: SitePageSectionProps) => SitePageSectionProps> = {
  'closing-call-to-action-section': (p) =>
    p['titleMuted'] === undefined
      ? p
      : { ...without(p, 'titleMuted'), title: joined(p['title'], p['titleMuted']) },
  'media-split-stack-section': (p) => ({
    ...without(p, 'kind', 'variant'),
    ...(Array.isArray(p['bands'])
      ? {
          bands: records(p['bands']).map((band) =>
            without(band, 'diagram', 'image', 'imageAlt', 'imageFramed')
          )
        }
      : {})
  })
}

const renameLegacyProps = (id: string, props: SitePageSectionProps): SitePageSectionProps => {
  const renames = Object.prototype.hasOwnProperty.call(legacyProps, id)
    ? legacyProps[id]
    : undefined
  if (!renames) return props
  let next = props
  for (const [from, rename] of Object.entries(renames)) {
    if (!Object.prototype.hasOwnProperty.call(next, from)) continue
    const to = typeof rename === 'string' ? rename : rename.to
    const value = next[from]
    const mapped =
      typeof rename === 'string' || typeof value !== 'string'
        ? value
        : Object.prototype.hasOwnProperty.call(rename.values, value)
          ? rename.values[value]
          : value
    if (to === from) next = { ...next, [to]: mapped }
    else if (!Object.prototype.hasOwnProperty.call(next, to))
      next = { ...without(next, from), [to]: mapped }
  }
  return next
}

export const translateLegacyProps = (
  id: string,
  props: SitePageSectionProps
): SitePageSectionProps => {
  const shape = Object.prototype.hasOwnProperty.call(legacyShapes, id)
    ? legacyShapes[id]
    : undefined
  const renamed = renameLegacyProps(id, props)
  return shape ? shape(renamed) : renamed
}

const pick = (props: SitePageSectionProps, ...keys: string[]): SitePageSectionProps =>
  Object.fromEntries(Object.entries(props).filter(([key]) => keys.includes(key)))

const RETIRED_MEDIA = ['codeTabs', 'defaultFile', 'copyAriaLabel', 'diagram', 'image']

const hasPicture = (p: SitePageSectionProps): boolean =>
  Boolean(p['scene'] || p['widget'] || p['illustration'])

const codeSteps = (p: SitePageSectionProps): SitePageSectionProps[] => {
  const action = p['primaryAction'] ?? p['secondaryAction']
  return records(p['codeTabs'])
    .filter((tab) => typeof tab['code'] === 'string' && tab['code'].length > 0)
    .map((tab, index) => ({
      title: tab['label'] ?? '',
      description: '',
      code: {
        fileName: tab['fileName'] ?? tab['label'] ?? '',
        code: tab['code'],
        ...pick(tab, 'language', 'fileIcon'),
        ...pick(p, 'copyAriaLabel')
      },
      ...(index === 0 && action ? { action } : {})
    }))
}

const routeMediaBand = (p: SitePageSectionProps): SitePageResolvedEntry => {
  const band = { id: 'media-split-section', props: without(p, ...RETIRED_MEDIA) }
  if (hasPicture(p)) return band
  const steps = codeSteps(p)
  if (steps.length)
    return {
      id: 'feature-scroll-section',
      props: { ...pick(p, 'anchor', 'eyebrow', 'title', 'description'), items: steps }
    }
  const diagram = p['diagram']
  if (typeof diagram === 'string' && diagram.length > 0)
    return {
      id: 'console-showcase-section',
      props: {
        ...pick(p, 'anchor', 'eyebrow', 'title', 'description', 'primaryAction', 'secondaryAction'),
        variant: 'diagram'
      },
      scenes: { scene: { component: 'Diagram', props: { name: diagram } } }
    }
  return band
}

const legacyRoutes: Record<string, (props: SitePageSectionProps) => SitePageResolvedEntry> = {
  'media-split-section': routeMediaBand
}

export const routeEntry = (id: string, props: SitePageSectionProps): SitePageResolvedEntry => {
  const handler = Object.prototype.hasOwnProperty.call(legacyRoutes, id)
    ? legacyRoutes[id]
    : undefined
  return handler ? handler(props) : { id, props }
}
