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

export const PIPE_TABLE = 'Markdown pipe table'

const BROWSER_FRAME =
  'A resizable viewport around a live Vue page (drag handles, copyable address); Markdown writes <Frame> around a screenshot and a site band frames a scene or a ConsoleMockup itself, so neither has a page to put inside it.'

const DATA_TABLE =
  'App-only: it drives app state (sorting, selection, paging, filters) through its engine; a docs page writes a Markdown pipe table and the site uses listing-table-section.'
const CODE_EDITOR =
  'App-only: the person edits code in it; docs and site show code a reader copies, which is a code fence (docs) or CodeBlock.'
const LOG_VIEWER =
  'App-only: it views a live run log (search, level filter, follow); docs and site show sample output as a code fence or CodeBlock.'
const TRACE =
  'App-only: it explores one run (expand, search, select a span for its details); docs and site explain where the time went with a FlowDiagram or a Chart.'

export const CONTENT_CHANNELS = {
  'data/flow-diagram': { docs: 'FlowDiagram', site: 'scene:FlowDiagram' },
  'content/illustration': { docs: 'Illustration', site: 'scene:Illustration' },
  'content/console-mockup': { docs: 'ConsoleMockup', site: 'scene:ConsoleMockup' },
  'marketing/diagram': { docs: 'Diagram', site: 'scene:Diagram' },
  'data/table': { docs: PIPE_TABLE, site: 'listing-table-section' },
  'content/carousel': { docs: 'Carousel', site: 'card-carousel-section' },
  'content/network-map': { docs: 'NetworkMap', site: 'network-section' },
  'content/pricing-card': { docs: 'PricingCard', site: 'pricing-plans-section' },
  'content/third-party-logo': { docs: 'ThirdPartyLogo', site: 'logo-wall-section' },
  'content/accordion': {
    site: 'scene:Accordion',
    outOfScope: { docs: 'Markdown writes <AccordionGroup>, which renders DocAccordionGroup.' }
  },
  'content/browser-frame': { outOfScope: { docs: BROWSER_FRAME, site: BROWSER_FRAME } },
  'content/card': {
    site: 'scene:Card',
    outOfScope: { docs: 'Markdown writes <Card>, which renders DocCard.' }
  },
  'content/embed': { docs: 'Embed', site: 'scene:Embed' },
  'content/integration-card': { docs: 'IntegrationCard', site: 'scene:IntegrationCard' },
  'content/key-value-list': { docs: 'KeyValueList', site: 'scene:KeyValueList' },
  'content/plan-feature-list': { docs: 'PlanFeatureList', site: 'scene:PlanFeatureList' },
  'data/data-table': {
    outOfScope: { docs: DATA_TABLE, site: DATA_TABLE }
  },
  'chart/bar-list': { docs: 'BarList', site: 'scene:BarList' },
  'chart/chart': { docs: 'Chart', site: 'scene:Chart' },
  'chart/donut-chart': { docs: 'DonutChart', site: 'scene:DonutChart' },
  'chart/gauge-chart': { docs: 'GaugeChart', site: 'scene:GaugeChart' },
  'chart/map-chart': { docs: 'MapChart', site: 'scene:MapChart' },
  'chart/spark-chart': { docs: 'SparkChart', site: 'scene:SparkChart' },
  'chart/stat-tile': { docs: 'StatTile', site: 'scene:StatTile' },
  'chart/stat-tile-group': { docs: 'StatTileGroup', site: 'scene:StatTileGroup' },
  'chart/tracker': { docs: 'Tracker', site: 'scene:Tracker' },
  'code/code-block': {
    site: 'scene:CodeBlock',
    outOfScope: { docs: 'Markdown writes a code fence, which renders DocCodeGroup.' }
  },
  'code/code-editor': { outOfScope: { docs: CODE_EDITOR, site: CODE_EDITOR } },
  'code/log-viewer': { outOfScope: { docs: LOG_VIEWER, site: LOG_VIEWER } },
  'code/trace': { outOfScope: { docs: TRACE, site: TRACE } },
  'docs/doc-accordion': { docs: 'Accordion', outOfScope: { site: DOCS_PIECE } },
  'docs/doc-accordion-group': { docs: 'AccordionGroup', outOfScope: { site: DOCS_PIECE } },
  'docs/doc-agent-card': { docs: 'AgentCard', outOfScope: { site: DOCS_PIECE } },
  'docs/doc-call-to-action': { docs: 'CallToAction', outOfScope: { site: DOCS_PIECE } },
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
  'marketing/faq': { docs: 'Faq', site: 'faq-section' },
  'marketing/feature-item': {
    site: 'capability-grid-section',
    outOfScope: { docs: MARKETING_PIECE }
  },
  'marketing/hero': { site: 'hero-section', outOfScope: { docs: MARKETING_PIECE } },
  'marketing/link-directory': {
    site: 'platform-directory-section',
    outOfScope: { docs: MARKETING_PIECE }
  },
  'marketing/logo-wall': { site: 'logo-wall-section', outOfScope: { docs: MARKETING_PIECE } },
  'marketing/marquee': { site: 'template-gallery-section', outOfScope: { docs: MARKETING_PIECE } },
  'marketing/media-scroll': {
    site: 'feature-scroll-section',
    outOfScope: { docs: MARKETING_PIECE }
  },
  'marketing/media-split': { site: 'media-split-section', outOfScope: { docs: MARKETING_PIECE } },
  'marketing/media-tabs': { site: 'feature-tabs-section', outOfScope: { docs: MARKETING_PIECE } },
  'marketing/media-tile': { site: 'feature-tiles-section', outOfScope: { docs: MARKETING_PIECE } },
  'marketing/quote': { docs: 'Quote', site: 'recognition-marquee-section' },
  'marketing/quote-tabs': { site: 'client-quotes-section', outOfScope: { docs: MARKETING_PIECE } },
  'marketing/stats': { docs: 'Stats', site: 'stats-section' }
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
