import { type Component, defineAsyncComponent, markRaw } from 'vue'

export type SitePageSectionLoader = () => Promise<{ default: Component }>

export const sitePageSections = {
  'architecture-tabs': () => import('../../sections/architecture-tabs/architecture-tabs.vue'),
  'article-body': () => import('../../sections/article-body/article-body.vue'),
  'article-cards': () => import('../../sections/article-cards/article-cards.vue'),
  'article-highlight': () => import('../../sections/article-highlight/article-highlight.vue'),
  'article-index-blog': () => import('../../sections/article-index-blog/article-index-blog.vue'),
  'article-index-resource-hub': () =>
    import('../../sections/article-index-resource-hub/article-index-resource-hub.vue'),
  'capability-grid': () => import('../../sections/capability-grid/capability-grid.vue'),
  'card-carousel': () => import('../../sections/card-carousel/card-carousel.vue'),
  'client-mosaic': () => import('../../sections/client-mosaic/client-mosaic.vue'),
  'client-mosaic-columns': () =>
    import('../../sections/client-mosaic-columns/client-mosaic-columns.vue'),
  'client-quotes': () => import('../../sections/client-quotes/client-quotes.vue'),
  'cli-terminal': () => import('../../sections/cli-terminal/cli-terminal.vue'),
  'closing-call-to-action': () =>
    import('../../sections/closing-call-to-action/closing-call-to-action.vue'),
  'closing-call-to-action-agents': () =>
    import('../../sections/closing-call-to-action-agents/closing-call-to-action-agents.vue'),
  'closing-call-to-action-newsletter': () =>
    import('../../sections/closing-call-to-action-newsletter/closing-call-to-action-newsletter.vue'),
  'closing-call-to-action-templates': () =>
    import('../../sections/closing-call-to-action-templates/closing-call-to-action-templates.vue'),
  'code-split': () => import('../../sections/code-split/code-split.vue'),
  'compare-plans': () => import('../../sections/compare-plans/compare-plans.vue'),
  'compare-support-tiers': () =>
    import('../../sections/compare-support-tiers/compare-support-tiers.vue'),
  'comparison-table': () => import('../../sections/comparison-table/comparison-table.vue'),
  'compliance-badges': () => import('../../sections/compliance-badges/compliance-badges.vue'),
  'console-panel': () => import('../../sections/console-panel/console-panel.vue'),
  'contact-hub': () => import('../../sections/contact-hub/contact-hub.vue'),
  'customer-spotlight': () => import('../../sections/customer-spotlight/customer-spotlight.vue'),
  'faq-section': () => import('../../sections/faq-section/faq-section.vue'),
  'feature-scroll': () => import('../../sections/feature-scroll/feature-scroll.vue'),
  'feature-tabs': () => import('../../sections/feature-tabs/feature-tabs.vue'),
  'feature-tiles': () => import('../../sections/feature-tiles/feature-tiles.vue'),
  'feature-widgets': () => import('../../sections/feature-widgets/feature-widgets.vue'),
  'hero-band': () => import('../../sections/hero-band/hero-band.vue'),
  'hero-copy-on-top-art': () =>
    import('../../sections/hero-copy-on-top-art/hero-copy-on-top-art.vue'),
  'hero-form': () => import('../../sections/hero-form/hero-form.vue'),
  'hero-with-opening': () => import('../../sections/hero-with-opening/hero-with-opening.vue'),
  'investor-marks': () => import('../../sections/investor-marks/investor-marks.vue'),
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
  'resource-grid': () => import('../../sections/resource-grid/resource-grid.vue'),
  'section-command': () => import('../../sections/section-command/section-command.vue'),
  'stats-band': () => import('../../sections/stats-band/stats-band.vue'),
  'sticky-carousel': () => import('../../sections/sticky-carousel/sticky-carousel.vue'),
  'sticky-scroll-code': () => import('../../sections/sticky-scroll-code/sticky-scroll-code.vue'),
  'story-library': () => import('../../sections/story-library/story-library.vue'),
  'subject-library': () => import('../../sections/subject-library/subject-library.vue'),
  'template-gallery': () => import('../../sections/template-gallery/template-gallery.vue'),
  'use-case-links': () => import('../../sections/use-case-links/use-case-links.vue'),
  'use-cases': () => import('../../sections/use-cases/use-cases.vue')
} satisfies Record<string, SitePageSectionLoader>

export type SitePageSectionId = keyof typeof sitePageSections

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
