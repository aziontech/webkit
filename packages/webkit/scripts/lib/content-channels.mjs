export const CHANNELS = {
  app: 'Vue: the component imported from @aziontech/webkit/<name> in an app, a block or a page.',
  docs: 'Markdown: a tag DocMarkdown renders, such as <FlowDiagram nodes={[…]} />.',
  site: 'Page JSON: an entry SitePage renders, either a page section by _id or a scene a band draws by name.'
}

export const CONTENT_FOLDERS = ['chart', 'code', 'docs', 'marketing']

export const NOT_CONTENT = {
  'docs/doc-heading': 'Page chrome: Markdown writes a heading with #.',
  'docs/doc-hero': 'Page chrome: the docs landing header.',
  'docs/doc-layout': 'Page chrome: the docs shell.',
  'docs/doc-markdown': 'The Markdown renderer itself.',
  'docs/doc-page-header': 'Page chrome: built from the frontmatter.',
  'docs/doc-previous-next': 'Page chrome: built from the navigation.',
  'docs/doc-prose': 'Page chrome: the prose frame DocMarkdown renders into.',
  'docs/doc-table-of-contents': 'Page chrome: built from the headings.',
  'marketing/backdrop': 'A decorative layer behind a band, not content.',
  'marketing/site-page': 'The page JSON renderer itself.',
  'chart/chart-card': 'A frame for an app dashboard tile.'
}

const DOCS_PIECE = 'A docs piece; the site uses the marketing pieces and sections.'
const MARKETING_PIECE = 'A marketing piece; a docs page uses the doc- pieces.'

export const CONTENT_CHANNELS = {
  'data/flow-diagram': { docs: 'FlowDiagram', site: 'scene:FlowDiagram' },
  'content/illustration': { site: 'scene:Illustration', pending: ['docs'] },
  'content/console-mockup': { site: 'scene:ConsoleMockup', pending: ['docs'] },
  'marketing/diagram': { site: 'scene:Diagram', pending: ['docs'] },
  'data/table': { site: 'listing-table-section', pending: ['docs'] },
  'content/carousel': { site: 'card-carousel-section', pending: ['docs'] },
  'content/network-map': { site: 'network-section', pending: ['docs'] },
  'content/pricing-card': { site: 'pricing-plans-section', pending: ['docs'] },
  'content/third-party-logo': { site: 'logo-wall-section', pending: ['docs'] },
  'content/accordion': {
    pending: ['site'],
    outOfScope: { docs: 'Markdown writes <AccordionGroup>, which renders DocAccordionGroup.' }
  },
  'content/browser-frame': { pending: ['docs', 'site'] },
  'content/card': {
    pending: ['site'],
    outOfScope: { docs: 'Markdown writes <Card>, which renders DocCard.' }
  },
  'content/embed': { pending: ['docs', 'site'] },
  'content/integration-card': { pending: ['docs', 'site'] },
  'content/key-value-list': { pending: ['docs', 'site'] },
  'content/plan-feature-list': { pending: ['docs', 'site'] },
  'data/data-table': { pending: ['docs', 'site'] },
  'chart/bar-list': { pending: ['docs', 'site'] },
  'chart/chart': { pending: ['docs', 'site'] },
  'chart/donut-chart': { pending: ['docs', 'site'] },
  'chart/gauge-chart': { pending: ['docs', 'site'] },
  'chart/map-chart': { pending: ['docs', 'site'] },
  'chart/spark-chart': { pending: ['docs', 'site'] },
  'chart/stat-tile': { pending: ['docs', 'site'] },
  'chart/stat-tile-group': { pending: ['docs', 'site'] },
  'chart/tracker': { pending: ['docs', 'site'] },
  'code/code-block': {
    pending: ['site'],
    outOfScope: { docs: 'Markdown writes a code fence, which renders DocCodeGroup.' }
  },
  'code/code-editor': { pending: ['docs', 'site'] },
  'code/log-viewer': { pending: ['docs', 'site'] },
  'code/trace': { pending: ['docs', 'site'] },
  'docs/doc-accordion': { docs: 'Accordion', outOfScope: { site: DOCS_PIECE } },
  'docs/doc-accordion-group': { docs: 'AccordionGroup', outOfScope: { site: DOCS_PIECE } },
  'docs/doc-agent-card': { pending: ['docs'], outOfScope: { site: DOCS_PIECE } },
  'docs/doc-call-to-action': { pending: ['docs'], outOfScope: { site: DOCS_PIECE } },
  'docs/doc-callout': { docs: 'Note', outOfScope: { site: DOCS_PIECE } },
  'docs/doc-card': { docs: 'Card', outOfScope: { site: DOCS_PIECE } },
  'docs/doc-card-group': { docs: 'CardGroup', outOfScope: { site: DOCS_PIECE } },
  'docs/doc-changelog-entry': { docs: 'Update', outOfScope: { site: DOCS_PIECE } },
  'docs/doc-code-group': { docs: 'CodeGroup', outOfScope: { site: DOCS_PIECE } },
  'docs/doc-frame': { docs: 'Frame', outOfScope: { site: DOCS_PIECE } },
  'docs/doc-item': { docs: 'Item', outOfScope: { site: DOCS_PIECE } },
  'docs/doc-prompt': { docs: 'Prompt', outOfScope: { site: DOCS_PIECE } },
  'docs/doc-steps': { docs: 'Steps', outOfScope: { site: DOCS_PIECE } },
  'marketing/call-to-action': {
    site: 'closing-call-to-action-section',
    outOfScope: { docs: MARKETING_PIECE }
  },
  'marketing/faq': { site: 'faq-section', pending: ['docs'] },
  'marketing/feature-item': { site: 'capability-grid-section', outOfScope: { docs: MARKETING_PIECE } },
  'marketing/hero': { site: 'hero-section', outOfScope: { docs: MARKETING_PIECE } },
  'marketing/link-directory': { site: 'platform-directory-section', outOfScope: { docs: MARKETING_PIECE } },
  'marketing/logo-wall': { site: 'logo-wall-section', outOfScope: { docs: MARKETING_PIECE } },
  'marketing/marquee': { site: 'template-gallery-section', outOfScope: { docs: MARKETING_PIECE } },
  'marketing/media-scroll': { site: 'feature-scroll-section', outOfScope: { docs: MARKETING_PIECE } },
  'marketing/media-split': { site: 'media-split-section', outOfScope: { docs: MARKETING_PIECE } },
  'marketing/media-tabs': { site: 'feature-tabs-section', outOfScope: { docs: MARKETING_PIECE } },
  'marketing/media-tile': { site: 'feature-tiles-section', outOfScope: { docs: MARKETING_PIECE } },
  'marketing/quote': { site: 'recognition-marquee-section', pending: ['docs'] },
  'marketing/quote-tabs': { site: 'client-quotes-section', outOfScope: { docs: MARKETING_PIECE } },
  'marketing/stats': { site: 'stats-section', pending: ['docs'] }
}

export function channelsOf(target) {
  const match = String(target).match(/^\.\/src\/components\/([^/]+\/[^/]+)\/([^/]+)\.(vue|ts)$/)
  if (!match) return null
  const [, folder, file] = match
  if (file !== folder.split('/')[1] && file !== 'index') return null
  const entry = CONTENT_CHANNELS[folder]
  if (!entry) return null
  return ['app', ...(entry.docs ? ['docs'] : []), ...(entry.site ? ['site'] : [])]
}
