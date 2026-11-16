import { type Component, defineAsyncComponent, markRaw } from 'vue'

export type SitePageSectionLoader = () => Promise<{ default: Component }>

export const sitePageSections = {
  'architecture-tabs': () => import('../../section/architecture-tabs/architecture-tabs.vue'),
  'article-body': () => import('../../section/article-body/article-body.vue'),
  'article-cards': () => import('../../section/article-cards/article-cards.vue'),
  'article-highlight': () => import('../../section/article-highlight/article-highlight.vue'),
  'article-index': () => import('../../section/article-index/article-index.vue'),
  'capability-grid': () => import('../../section/capability-grid/capability-grid.vue'),
  'card-carousel': () => import('../../section/card-carousel/card-carousel.vue'),
  'client-mosaic': () => import('../../section/client-mosaic/client-mosaic.vue'),
  'client-story-columns': () =>
    import('../../section/client-story-columns/client-story-columns.vue'),
  'client-quotes': () => import('../../section/client-quotes/client-quotes.vue'),
  'cli-terminal': () => import('../../section/cli-terminal/cli-terminal.vue'),
  'closing-call-to-action': () =>
    import('../../section/closing-call-to-action/closing-call-to-action.vue'),
  'newsletter-section': () => import('../../section/newsletter-section/newsletter-section.vue'),
  'plan-comparison': () => import('../../section/plan-comparison/plan-comparison.vue'),
  'competitor-comparison': () =>
    import('../../section/competitor-comparison/competitor-comparison.vue'),
  'compliance-logos': () => import('../../section/compliance-logos/compliance-logos.vue'),
  'console-showcase': () => import('../../section/console-showcase/console-showcase.vue'),
  'contact-hub': () => import('../../section/contact-hub/contact-hub.vue'),
  'faq-section': () => import('../../section/faq-section/faq-section.vue'),
  'feature-scroll': () => import('../../section/feature-scroll/feature-scroll.vue'),
  'feature-tabs': () => import('../../section/feature-tabs/feature-tabs.vue'),
  'feature-tiles': () => import('../../section/feature-tiles/feature-tiles.vue'),
  'feature-widgets': () => import('../../section/feature-widgets/feature-widgets.vue'),
  'hero-section': () => import('../../section/hero-section/hero-section.vue'),
  'hero-form-section': () => import('../../section/hero-form-section/hero-form-section.vue'),
  'investor-marks': () => import('../../section/investor-marks/investor-marks.vue'),
  'job-posting': () => import('../../section/job-posting/job-posting.vue'),
  'listing-index': () => import('../../section/listing-index/listing-index.vue'),
  'listing-table': () => import('../../section/listing-table/listing-table.vue'),
  'logo-wall-section': () => import('../../section/logo-wall-section/logo-wall-section.vue'),
  'media-split-section': () => import('../../section/media-split-section/media-split-section.vue'),
  'media-split-stack-section': () =>
    import('../../section/media-split-stack-section/media-split-stack-section.vue'),
  'network-section': () => import('../../section/network-section/network-section.vue'),
  'photo-marquee': () => import('../../section/photo-marquee/photo-marquee.vue'),
  'platform-directory': () => import('../../section/platform-directory/platform-directory.vue'),
  'pricing-plans': () => import('../../section/pricing-plans/pricing-plans.vue'),
  'process-scroll': () => import('../../section/process-scroll/process-scroll.vue'),
  'recognition-marquee': () => import('../../section/recognition-marquee/recognition-marquee.vue'),
  'copy-command': () => import('../../section/copy-command/copy-command.vue'),
  'stats-section': () => import('../../section/stats-section/stats-section.vue'),
  'story-index': () => import('../../section/story-index/story-index.vue'),
  'subject-grid': () => import('../../section/subject-grid/subject-grid.vue'),
  'template-gallery': () => import('../../section/template-gallery/template-gallery.vue'),
  'customer-use-cases': () => import('../../section/customer-use-cases/customer-use-cases.vue')
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
    target: 'article-index',
    props: (p) => ({ ...p, filters: 'category-search' })
  },
  'article-index-resource-hub': {
    target: 'article-index',
    props: (p) => ({ ...p, filters: 'facets' })
  },
  'closing-call-to-action-agents': {
    target: 'closing-call-to-action',
    props: (p) => ({ ...p, variant: 'primary' })
  },
  'closing-call-to-action-templates': {
    target: 'template-gallery',
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
    target: 'plan-comparison',
    props: (p) => (p['tiers'] === undefined ? p : { ...without(p, 'tiers'), plans: p['tiers'] })
  },
  'customer-spotlight': {
    target: 'client-story-columns',
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
    target: 'capability-grid',
    props: (p) => ({
      ...p,
      titleAlign: 'split',
      items: records(p['items']).filter((item) => Boolean(item['title']))
    })
  },
  'sticky-carousel': {
    target: 'process-scroll',
    props: (p) => ({
      ...without(p, 'items', 'headerOffset'),
      steps: records(p['items']),
      pinned: true,
      titleAlign: 'center',
      ...(p['headerOffset'] ? { headerOffset: p['headerOffset'] } : {})
    })
  },
  'sticky-scroll-code': { target: 'feature-scroll' },
  'use-case-links': {
    target: 'capability-grid',
    props: (p) => ({ ...p, titleAlign: 'start' })
  },
  'client-mosaic-columns': { target: 'client-story-columns' },
  'closing-call-to-action-newsletter': { target: 'newsletter-section' },
  'compare-plans': { target: 'plan-comparison' },
  'comparison-table': { target: 'competitor-comparison' },
  'compliance-badges': { target: 'compliance-logos' },
  'console-panel': { target: 'console-showcase' },
  'hero-band': { target: 'hero-section' },
  'hero-form': { target: 'hero-form-section' },
  'listing-browser': { target: 'listing-index' },
  'logo-wall-quote': { target: 'logo-wall-section' },
  'media-split-band': { target: 'media-split-section' },
  'media-split-stack': { target: 'media-split-stack-section' },
  'section-command': { target: 'copy-command' },
  'stats-band': { target: 'stats-section' },
  'story-library': { target: 'story-index' },
  'subject-library': { target: 'subject-grid' },
  'use-cases': { target: 'customer-use-cases' }
}

export function resolveSectionEntry(
  id: string,
  props: SitePageSectionProps = {}
): { id: string; props: SitePageSectionProps } {
  const alias = Object.prototype.hasOwnProperty.call(sitePageSectionAliases, id)
    ? sitePageSectionAliases[id]
    : undefined
  if (!alias) return { id, props }
  return { id: alias.target, props: alias.props ? alias.props(props) : props }
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
