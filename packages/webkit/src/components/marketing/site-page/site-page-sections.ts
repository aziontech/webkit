import { type Component, defineAsyncComponent, markRaw } from 'vue'

export type SitePageSectionLoader = () => Promise<{ default: Component }>

export const sitePageSections = {
  'architecture-tabs-section': () =>
    import('../../section/architecture-tabs-section/architecture-tabs-section.vue'),
  'article-body-section': () =>
    import('../../section/article-body-section/article-body-section.vue'),
  'article-cards-section': () =>
    import('../../section/article-cards-section/article-cards-section.vue'),
  'article-highlight-section': () =>
    import('../../section/article-highlight-section/article-highlight-section.vue'),
  'article-index-section': () =>
    import('../../section/article-index-section/article-index-section.vue'),
  'capability-grid-section': () =>
    import('../../section/capability-grid-section/capability-grid-section.vue'),
  'card-carousel-section': () =>
    import('../../section/card-carousel-section/card-carousel-section.vue'),
  'client-mosaic-section': () =>
    import('../../section/client-mosaic-section/client-mosaic-section.vue'),
  'client-story-columns-section': () =>
    import('../../section/client-story-columns-section/client-story-columns-section.vue'),
  'client-quotes-section': () =>
    import('../../section/client-quotes-section/client-quotes-section.vue'),
  'cli-terminal-section': () =>
    import('../../section/cli-terminal-section/cli-terminal-section.vue'),
  'closing-call-to-action-section': () =>
    import('../../section/closing-call-to-action-section/closing-call-to-action-section.vue'),
  'newsletter-section': () => import('../../section/newsletter-section/newsletter-section.vue'),
  'plan-comparison-section': () =>
    import('../../section/plan-comparison-section/plan-comparison-section.vue'),
  'competitor-comparison-section': () =>
    import('../../section/competitor-comparison-section/competitor-comparison-section.vue'),
  'compliance-logos-section': () =>
    import('../../section/compliance-logos-section/compliance-logos-section.vue'),
  'console-showcase-section': () =>
    import('../../section/console-showcase-section/console-showcase-section.vue'),
  'contact-hub-section': () => import('../../section/contact-hub-section/contact-hub-section.vue'),
  'faq-section': () => import('../../section/faq-section/faq-section.vue'),
  'feature-scroll-section': () =>
    import('../../section/feature-scroll-section/feature-scroll-section.vue'),
  'feature-tabs-section': () =>
    import('../../section/feature-tabs-section/feature-tabs-section.vue'),
  'feature-tiles-section': () =>
    import('../../section/feature-tiles-section/feature-tiles-section.vue'),
  'feature-widgets-section': () =>
    import('../../section/feature-widgets-section/feature-widgets-section.vue'),
  'hero-section': () => import('../../section/hero-section/hero-section.vue'),
  'hero-form-section': () => import('../../section/hero-form-section/hero-form-section.vue'),
  'investor-marks-section': () =>
    import('../../section/investor-marks-section/investor-marks-section.vue'),
  'job-posting-section': () => import('../../section/job-posting-section/job-posting-section.vue'),
  'listing-index-section': () =>
    import('../../section/listing-index-section/listing-index-section.vue'),
  'listing-table-section': () =>
    import('../../section/listing-table-section/listing-table-section.vue'),
  'logo-wall-section': () => import('../../section/logo-wall-section/logo-wall-section.vue'),
  'media-split-section': () => import('../../section/media-split-section/media-split-section.vue'),
  'media-split-stack-section': () =>
    import('../../section/media-split-stack-section/media-split-stack-section.vue'),
  'network-section': () => import('../../section/network-section/network-section.vue'),
  'photo-marquee-section': () =>
    import('../../section/photo-marquee-section/photo-marquee-section.vue'),
  'platform-directory-section': () =>
    import('../../section/platform-directory-section/platform-directory-section.vue'),
  'pricing-plans-section': () =>
    import('../../section/pricing-plans-section/pricing-plans-section.vue'),
  'process-scroll-section': () =>
    import('../../section/process-scroll-section/process-scroll-section.vue'),
  'recognition-marquee-section': () =>
    import('../../section/recognition-marquee-section/recognition-marquee-section.vue'),
  'copy-command-section': () =>
    import('../../section/copy-command-section/copy-command-section.vue'),
  'stats-section': () => import('../../section/stats-section/stats-section.vue'),
  'story-index-section': () => import('../../section/story-index-section/story-index-section.vue'),
  'subject-grid-section': () =>
    import('../../section/subject-grid-section/subject-grid-section.vue'),
  'template-gallery-section': () =>
    import('../../section/template-gallery-section/template-gallery-section.vue'),
  'customer-use-cases-section': () =>
    import('../../section/customer-use-cases-section/customer-use-cases-section.vue')
} satisfies Record<string, SitePageSectionLoader>

export type SitePageSectionId = keyof typeof sitePageSections

export type SitePageSectionProps = Record<string, unknown>

/** A retired page-JSON section id and how its entry renders now. */
export type SitePageSectionAlias = {
  /** The section that renders the entry. */
  target: SitePageSectionId
  /** Maps the old section's props onto the target's props. */
  props?: (props: SitePageSectionProps) => SitePageSectionProps
}

const records = (value: unknown): SitePageSectionProps[] =>
  Array.isArray(value) ? (value as SitePageSectionProps[]) : []

const without = (props: SitePageSectionProps, ...keys: string[]): SitePageSectionProps =>
  Object.fromEntries(Object.entries(props).filter(([key]) => !keys.includes(key)))

export const sitePageSectionAliases: Record<string, SitePageSectionAlias> = {
  'article-index-blog': {
    target: 'article-index-section',
    props: (p) => ({ ...p, filters: 'category-search' })
  },
  'article-index-resource-hub': {
    target: 'article-index-section',
    props: (p) => ({ ...p, filters: 'facets' })
  },
  'closing-call-to-action-agents': {
    target: 'closing-call-to-action-section',
    props: (p) => ({ ...p, variant: 'primary' })
  },
  'closing-call-to-action-templates': {
    target: 'template-gallery-section',
    props: (p) => ({ ...p, closing: true })
  },
  'code-split': {
    target: 'media-split-section',
    props: (p) => {
      const action = p['primaryAction']
      return action && typeof action === 'object'
        ? { ...p, primaryAction: { variant: 'secondary', ...action } }
        : p
    }
  },
  'compare-support-tiers': {
    target: 'plan-comparison-section',
    props: (p) => (p['tiers'] === undefined ? p : { ...without(p, 'tiers'), plans: p['tiers'] })
  },
  'customer-spotlight': {
    target: 'client-story-columns-section',
    props: (p) => ({
      ...without(p, 'items'),
      reveal: 'hover',
      cells: records(p['items']).map((cell) => ({
        ...without(cell, 'description'),
        story: cell['description']
      }))
    })
  },
  'hero-copy-on-top-art': {
    target: 'hero-section',
    props: (p) => ({ ...p, variant: 'copy-on-top-art' })
  },
  'hero-with-opening': {
    target: 'hero-section',
    props: (p) => ({
      variant: 'title-band',
      size: 'large',
      ...p,
      titleLength:
        p['titleLength'] ??
        ([p['titleHighlight'], p['title']].filter(Boolean).join(' ').length > 45 ? 'long' : 'short')
    })
  },
  'resource-grid': {
    target: 'capability-grid-section',
    props: (p) => ({
      ...p,
      titleAlign: 'split',
      items: records(p['items']).filter((item) => Boolean(item['title']))
    })
  },
  'sticky-carousel': {
    target: 'process-scroll-section',
    props: (p) => ({
      ...without(p, 'items', 'headerOffset'),
      steps: records(p['items']),
      pinned: true,
      titleAlign: 'center',
      ...(p['headerOffset'] ? { headerOffset: p['headerOffset'] } : {})
    })
  },
  'sticky-scroll-code': { target: 'feature-scroll-section' },
  'use-case-links': {
    target: 'capability-grid-section',
    props: (p) => ({ ...p, titleAlign: 'start' })
  },
  'client-mosaic-columns': { target: 'client-story-columns-section' },
  'closing-call-to-action-newsletter': { target: 'newsletter-section' },
  'compare-plans': { target: 'plan-comparison-section' },
  'comparison-table': { target: 'competitor-comparison-section' },
  'compliance-badges': { target: 'compliance-logos-section' },
  'console-panel': { target: 'console-showcase-section' },
  'hero-band': { target: 'hero-section' },
  'hero-form': { target: 'hero-form-section' },
  'listing-browser': { target: 'listing-index-section' },
  'logo-wall-quote': { target: 'logo-wall-section' },
  'media-split-band': { target: 'media-split-section' },
  'media-split-stack': { target: 'media-split-stack-section' },
  'section-command': { target: 'copy-command-section' },
  'stats-band': { target: 'stats-section' },
  'story-library': { target: 'story-index-section' },
  'subject-library': { target: 'subject-grid-section' },
  'use-cases': { target: 'customer-use-cases-section' },
  'architecture-tabs': { target: 'architecture-tabs-section' },
  'article-body': { target: 'article-body-section' },
  'article-cards': { target: 'article-cards-section' },
  'article-highlight': { target: 'article-highlight-section' },
  'article-index': { target: 'article-index-section' },
  'capability-grid': { target: 'capability-grid-section' },
  'card-carousel': { target: 'card-carousel-section' },
  'cli-terminal': { target: 'cli-terminal-section' },
  'client-mosaic': { target: 'client-mosaic-section' },
  'client-quotes': { target: 'client-quotes-section' },
  'client-story-columns': { target: 'client-story-columns-section' },
  'closing-call-to-action': { target: 'closing-call-to-action-section' },
  'competitor-comparison': { target: 'competitor-comparison-section' },
  'compliance-logos': { target: 'compliance-logos-section' },
  'console-showcase': { target: 'console-showcase-section' },
  'contact-hub': { target: 'contact-hub-section' },
  'copy-command': { target: 'copy-command-section' },
  'customer-use-cases': { target: 'customer-use-cases-section' },
  'feature-scroll': { target: 'feature-scroll-section' },
  'feature-tabs': { target: 'feature-tabs-section' },
  'feature-tiles': { target: 'feature-tiles-section' },
  'feature-widgets': { target: 'feature-widgets-section' },
  'investor-marks': { target: 'investor-marks-section' },
  'job-posting': { target: 'job-posting-section' },
  'listing-index': { target: 'listing-index-section' },
  'listing-table': { target: 'listing-table-section' },
  'photo-marquee': { target: 'photo-marquee-section' },
  'plan-comparison': { target: 'plan-comparison-section' },
  'platform-directory': { target: 'platform-directory-section' },
  'pricing-plans': { target: 'pricing-plans-section' },
  'process-scroll': { target: 'process-scroll-section' },
  'recognition-marquee': { target: 'recognition-marquee-section' },
  'story-index': { target: 'story-index-section' },
  'subject-grid': { target: 'subject-grid-section' },
  'template-gallery': { target: 'template-gallery-section' }
}

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

const translateLegacyProps = (id: string, props: SitePageSectionProps): SitePageSectionProps => {
  const shape = Object.prototype.hasOwnProperty.call(legacyShapes, id)
    ? legacyShapes[id]
    : undefined
  const renamed = renameLegacyProps(id, props)
  return shape ? shape(renamed) : renamed
}

/** A page-JSON entry after its retired id, props and media are translated. */
export type SitePageResolvedEntry = {
  /** The section that renders the entry. */
  id: string
  /** The props bound onto that section. */
  props: SitePageSectionProps
  /** Scenes the translation moved into a slot of the section, by slot name; the entry's own scenes win. */
  scenes?: Record<string, { component: string; props?: Record<string, unknown> }>
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

const route = (id: string, props: SitePageSectionProps): SitePageResolvedEntry => {
  const handler = Object.prototype.hasOwnProperty.call(legacyRoutes, id)
    ? legacyRoutes[id]
    : undefined
  return handler ? handler(props) : { id, props }
}

export function resolveSectionEntry(
  id: string,
  props: SitePageSectionProps = {}
): SitePageResolvedEntry {
  const alias = Object.prototype.hasOwnProperty.call(sitePageSectionAliases, id)
    ? sitePageSectionAliases[id]
    : undefined
  if (!alias) return route(id, translateLegacyProps(id, props))
  const translated = translateLegacyProps(alias.target, props)
  return route(alias.target, alias.props ? alias.props(translated) : translated)
}

export function isSitePageSectionId(id: string): id is SitePageSectionId {
  return Object.prototype.hasOwnProperty.call(sitePageSections, id)
}

const dev = (import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV === true

const sectionCache = new Map<string, Component>()

const warned = new Set<string>()

const Nothing: Component = { name: 'SitePageSectionUnavailable', render: () => null }

export function warnOnce(key: string, message: string) {
  if (!dev || warned.has(key)) return
  warned.add(key)
  console.warn(`[webkit] <SitePage>: ${message}`)
}

export function resolveSection(id: string): Component | null {
  if (!isSitePageSectionId(id)) {
    warnOnce(`section:${id}`, `no section is registered as "${id}".`)
    return null
  }
  const cached = sectionCache.get(id)
  if (cached) return cached
  const component = markRaw(
    defineAsyncComponent({
      loader: sitePageSections[id] as SitePageSectionLoader,
      timeout: 10000,
      errorComponent: Nothing,
      onError: (error, _retry, fail) => {
        if (dev) console.warn(`[webkit] <SitePage>: section "${id}" could not load.`, error)
        fail()
      }
    })
  )
  sectionCache.set(id, component)
  return component
}
