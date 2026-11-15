import { type Component, defineAsyncComponent, markRaw } from 'vue'

export type SitePageSectionLoader = () => Promise<{ default: Component }>

export const sitePageSections = {
  'architecture-tabs': () => import('../../sections/architecture-tabs/architecture-tabs.vue'),
  'article-body': () => import('../../sections/article-body/article-body.vue'),
  'article-cards': () => import('../../sections/article-cards/article-cards.vue'),
  'article-highlight': () => import('../../sections/article-highlight/article-highlight.vue'),
  'article-index': () => import('../../sections/article-index/article-index.vue'),
  'capability-grid': () => import('../../sections/capability-grid/capability-grid.vue'),
  'card-carousel': () => import('../../sections/card-carousel/card-carousel.vue'),
  'client-mosaic': () => import('../../sections/client-mosaic/client-mosaic.vue'),
  'client-mosaic-columns': () =>
    import('../../sections/client-mosaic-columns/client-mosaic-columns.vue'),
  'client-quotes': () => import('../../sections/client-quotes/client-quotes.vue'),
  'cli-terminal': () => import('../../sections/cli-terminal/cli-terminal.vue'),
  'closing-call-to-action': () =>
    import('../../sections/closing-call-to-action/closing-call-to-action.vue'),
  'closing-call-to-action-newsletter': () =>
    import('../../sections/closing-call-to-action-newsletter/closing-call-to-action-newsletter.vue'),
  'compare-plans': () => import('../../sections/compare-plans/compare-plans.vue'),
  'comparison-table': () => import('../../sections/comparison-table/comparison-table.vue'),
  'compliance-badges': () => import('../../sections/compliance-badges/compliance-badges.vue'),
  'console-panel': () => import('../../sections/console-panel/console-panel.vue'),
  'contact-hub': () => import('../../sections/contact-hub/contact-hub.vue'),
  'faq-section': () => import('../../sections/faq-section/faq-section.vue'),
  'feature-scroll': () => import('../../sections/feature-scroll/feature-scroll.vue'),
  'feature-tabs': () => import('../../sections/feature-tabs/feature-tabs.vue'),
  'feature-tiles': () => import('../../sections/feature-tiles/feature-tiles.vue'),
  'feature-widgets': () => import('../../sections/feature-widgets/feature-widgets.vue'),
  'hero-band': () => import('../../sections/hero-band/hero-band.vue'),
  'hero-form': () => import('../../sections/hero-form/hero-form.vue'),
  'investor-marks': () => import('../../sections/investor-marks/investor-marks.vue'),
  'job-posting': () => import('../../sections/job-posting/job-posting.vue'),
  'listing-browser': () => import('../../sections/listing-browser/listing-browser.vue'),
  'listing-table': () => import('../../sections/listing-table/listing-table.vue'),
  'logo-wall-quote': () => import('../../sections/logo-wall-quote/logo-wall-quote.vue'),
  'media-split-band': () => import('../../sections/media-split-band/media-split-band.vue'),
  'media-split-stack': () => import('../../sections/media-split-stack/media-split-stack.vue'),
  'network-section': () => import('../../sections/network-section/network-section.vue'),
  'photo-marquee': () => import('../../sections/photo-marquee/photo-marquee.vue'),
  'platform-directory': () => import('../../sections/platform-directory/platform-directory.vue'),
  'pricing-plans': () => import('../../sections/pricing-plans/pricing-plans.vue'),
  'process-scroll': () => import('../../sections/process-scroll/process-scroll.vue'),
  'recognition-marquee': () => import('../../sections/recognition-marquee/recognition-marquee.vue'),
  'section-command': () => import('../../sections/section-command/section-command.vue'),
  'stats-band': () => import('../../sections/stats-band/stats-band.vue'),
  'story-library': () => import('../../sections/story-library/story-library.vue'),
  'subject-library': () => import('../../sections/subject-library/subject-library.vue'),
  'template-gallery': () => import('../../sections/template-gallery/template-gallery.vue'),
  'use-cases': () => import('../../sections/use-cases/use-cases.vue')
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
    props: (p) => ({ ...p, kind: 'primary' })
  },
  'closing-call-to-action-templates': {
    target: 'template-gallery',
    props: (p) => ({ ...p, closing: true })
  },
  'code-split': {
    target: 'media-split-band',
    props: (p) => {
      const action = p['primaryAction']
      return action && typeof action === 'object'
        ? { ...p, primaryAction: { kind: 'secondary', ...action } }
        : p
    }
  },
  'compare-support-tiers': {
    target: 'compare-plans',
    props: (p) => (p['tiers'] === undefined ? p : { ...without(p, 'tiers'), plans: p['tiers'] })
  },
  'customer-spotlight': {
    target: 'client-mosaic-columns',
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
    target: 'hero-band',
    props: (p) => ({ ...p, kind: 'copy-on-top-art' })
  },
  'hero-with-opening': {
    target: 'hero-band',
    props: (p) => ({
      kind: 'title-band',
      size: 'large',
      ...p,
      titleLength:
        p['titleLength'] ??
        ([p['highlight'], p['title']].filter(Boolean).join(' ').length > 45 ? 'long' : 'short')
    })
  },
  'resource-grid': {
    target: 'capability-grid',
    props: (p) => ({
      ...p,
      titleKind: 'horizontal',
      items: records(p['items']).filter((item) => Boolean(item['title']))
    })
  },
  'sticky-carousel': {
    target: 'process-scroll',
    props: (p) => ({
      ...without(p, 'items', 'headerOffset'),
      steps: records(p['items']),
      pinned: true,
      titleKind: 'centered',
      ...(p['headerOffset'] ? { headerOffset: p['headerOffset'] } : {})
    })
  },
  'sticky-scroll-code': { target: 'feature-scroll' },
  'use-case-links': {
    target: 'capability-grid',
    props: (p) => ({ ...p, titleKind: 'left' })
  }
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
