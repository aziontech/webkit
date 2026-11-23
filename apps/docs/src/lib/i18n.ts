import { computed, shallowReactive, watch } from 'vue'

import { settings } from './settings'

export const en = {
  components: 'Components',
  blocks: 'Blocks',
  foundations: 'Foundations',
  search: 'Search',
  searchPlaceholder: 'Search components, blocks and foundations…',
  noResults: 'Nothing matches that search.',
  openNavigation: 'Open navigation',
  navigation: 'Documentation',
  siteHeader: 'Site',
  sections: 'Sections',
  onThisPage: 'On this page',
  theme: 'Theme',
  language: 'Language',
  direction: 'Text direction',
  demoLanguage: 'Demo language',
  demoDirection: 'Demo direction',
  demoLocaleNote:
    'The sign-in block under ConfigProvider: its copy and every WebKit string follow the language.',
  demoDirectionNote:
    'The sign-in block under ConfigProvider: every side, gap and arrow mirrors with the direction.',
  keyTableTitle: 'Keys by platform',
  keyTableNote:
    'The same shortcut on every console screen. Apple keyboards use Command where Windows, Linux and ChromeOS use Ctrl.',
  keyAction: 'Action',
  keyApple: 'macOS',
  keyOther: 'Windows, Linux and ChromeOS',
  keyClose: 'Close the top layer (menu, dialog, drawer)',
  keySubmit: 'Submit a short single-line form',
  keySubmitMultiline: 'Submit from a textarea or the code editor',
  keySave: 'Save a page that has a save bar',
  keyPalette: 'Open the command palette',
  keySearch: "Focus the page's search field",
  keyHelp: 'List the shortcuts of this screen',
  keyMove: 'Move between rows of a list or table',
  keyOpen: 'Open the focused row',
  keySelect: 'Select the focused row',
  keyDelete: 'Delete the focused row, after asking',
  rightToLeft: 'Right-to-left',
  leftToRight: 'Left-to-right',
  github: 'WebKit on GitHub',
  footer: 'Footer',
  footerWebkit: 'WebKit',
  footerAzion: 'Azion',
  footerGithub: 'GitHub',
  footerNpm: 'npm',
  footerAzionDocs: 'Azion docs',
  footerConsole: 'Azion Console',
  home: 'WebKit home',
  examples: 'Examples',
  preview: 'Preview',
  code: 'Code',
  api: 'API',
  props: 'Props',
  events: 'Events',
  slots: 'Slots',
  subcomponents: 'Subcomponents',
  name: 'Name',
  type: 'Type',
  default: 'Default',
  description: 'Description',
  payload: 'Payload',
  scope: 'Scope',
  whenToUse: 'When to use',
  whenNotToUse: 'When not to use',
  do: 'Do',
  dont: "Don't",
  related: 'Related',
  accessibility: 'Accessibility',
  rightToLeftSection: 'Right-to-left',
  howItIsBuilt: 'How it is built',
  moreExamples: 'More examples',
  jumpToCategory: 'Jump to a category',
  copyForAi: 'Copy for AI',
  viewMarkdown: 'View as Markdown',
  copied: 'Copied',
  install: 'Add to your project',
  states: 'States',
  guidelines: 'Guidelines',
  viewport: 'Viewport',
  openInNewTab: 'Open in a new tab',
  usedComponents: 'Built from',
  anatomy: 'Building blocks',
  writing: 'Copy',
  tokens: 'Tokens',
  light: 'Light',
  dark: 'Dark',
  value: 'Value',
  notFound: 'Page not found',
  notFoundLead: 'There is no page at this address.',
  backHome: 'Back to the start',
  filter: 'Filter',
  count: 'items',
  assets: 'Assets',
  icons: 'Icons',
  start: 'Start',
  homeNav: 'Home',
  gettingStarted: 'Getting started',
  copiedValue: 'Copied to the clipboard',
  copyFailed: 'Could not copy',
  token: 'Token',
  usage: 'Usage',
  usedBy: 'Used by',
  playMotion: 'Play {name}',
  stopMotion: 'Stop {name}',
  reducedMotion: 'Motion is reduced on this device.',
  tailwind: 'Tailwind',
  cssVariable: 'CSS variable',
  base: 'Base',
  live: 'Live',
  referenceOnly: 'Reference only',
  architectureTitle: 'Three layers of tokens',
  architectureLead:
    'Components read only the semantic layer, so one theme switch repaints every screen.',
  layerPrimitivesTitle: 'Primitives',
  layerPrimitivesText: 'Raw palettes, radii, type and effects. The same in every theme.',
  layerThemeTitle: 'Theme',
  layerThemeText:
    'Light and dark roles built from the primitives: surfaces, text, borders, status.',
  layerSemanticTitle: 'Semantic',
  layerSemanticText: 'Responsive bundles components use: type styles and the spacing rhythm.',
  semanticColors: 'Semantic colors',
  primitivePalette: 'Primitive palette',
  primitivePaletteLead:
    'The raw scales behind the theme. Read them for reference; style with the semantic tokens.',
  playgroundTitle: 'Color explorer',
  playgroundLead: 'Pick a token to see it at size, drawn with the token it pairs with.',
  category: 'Category',
  categoryTheme: 'Theme',
  categoryBackground: 'Background',
  categoryText: 'Text',
  categoryBorder: 'Border',
  sample: 'Sample',
  sampleHeading: 'Deploy closer to your users',
  sampleParagraph:
    'Applications run on the nearest edge node, so every request is answered close to the people who make it.',
  sampleLabel: 'Workload name',
  sampleButton: 'Deploy now',
  sampleLink: 'Read the documentation',
  sampleTag: 'Production',
  sampleOverline: 'Release notes',
  fontFamilies: 'Font families',
  fontWeights: 'Font weights',
  typeStyles: 'Type styles',
  typeStylesLead: 'Each style is one class. Grouped by role, largest to smallest.',
  radiusScale: 'Radius scale',
  radiusScaleLead: 'The primitive corner radii. Components read the shape tokens below instead.',
  shapeTokens: 'Shape tokens',
  shapeTokensLead: 'The semantic radius each kind of surface uses.',
  boxShadows: 'Elevation',
  dropShadows: 'Drop shadows',
  insetShadows: 'Inset shadows',
  easing: 'Easing',
  duration: 'Duration',
  animations: 'Animations',
  animationsLead: 'The catalogued animate-* utilities and when to use each.',
  sampleText: 'The edge is where your users are',
  spacingRhythm: 'Semantic rhythm',
  spacingRhythmLead:
    'Each step grows with the screen. The value in effect at this width is marked.',
  spacingScale: 'Numeric scale',
  iconsSearch: 'Search icons',
  iconsSize: 'Preview size',
  iconsAzion: 'Azion',
  iconsAzionLead:
    "Azion's own products, the parts inside them, the platform, solutions and services.",
  iconsInterface: 'Interface',
  iconsInterfaceLead: 'Generic glyphs that name an action, an object or a state, never a product.',
  iconsExternal: 'External',
  iconsExternalLead:
    'Logos of other companies and projects, used only to name that third party. Colored logos keep their own colors.',
  iconsColor: 'color',
  iconCategories: {
    product: 'Products',
    feature: 'Product features',
    platform: 'Platform',
    solution: 'Solutions',
    service: 'Services',
    arrow: 'Arrows',
    action: 'Actions',
    status: 'Status',
    file: 'Files',
    media: 'Media',
    communication: 'Communication',
    commerce: 'Commerce',
    person: 'People',
    device: 'Devices',
    data: 'Data',
    layout: 'Layout',
    object: 'Objects',
    git: 'Git',
    framework: 'Frameworks',
    'ai-model': 'AI models',
    'ai-tool': 'AI tools',
    'developer-tool': 'Developer tools',
    database: 'Databases',
    cms: 'Content management',
    observability: 'Observability and data',
    identity: 'Identity and sign-in',
    security: 'Security services',
    language: 'Languages',
    'online-service': 'Online services'
  } as Record<string, string>,
  iconsEmpty: 'No icons match that search',
  iconsEmptyLead: 'Try another name or keyword.',
  iconsCopy: 'Copy the class',
  assetsLead: 'The brand lockups and product illustrations WebKit ships.',
  brand: 'Brand',
  brandLead:
    'The Azion lockups of Brand. Keep the mark clear and unmodified, and pick the lockup that fits the space.',
  brandDefault: 'The AZION wordmark, for most surfaces.',
  brandReduced: 'The A glyph, for tight spaces such as avatars and favicons.',
  brandExtended: 'The wordmark with the technologies tagline.',
  illustrations: 'Illustrations',
  illustrationsLead:
    'Product scenes drawn as inline SVG and repainted from the theme. Pass the name to Illustration.',
  iconsAssetLead: 'Every class of @aziontech/icons, searchable, with click to copy.',
  openIcons: 'Open the icon gallery',
  homeEyebrow: 'WebKit',
  homeTitle: 'One design system. Every component, ready to compose.',
  homeLead:
    'Explore @aziontech/webkit: every component live, the blocks built from them, the foundations underneath and the brand assets. Tokens, accessibility and dark mode built in.',
  startWithAgents: 'Start with agents',
  agentPrompt:
    "Build my UI with the Azion design system. Install @aziontech/webkit, @aziontech/theme and @aziontech/icons, run npx @aziontech/webkit init, import the theme once, and compose the app from WebKit's Vue components and design tokens instead of hand-rolled UI, following each component's documented props and compound API.",
  exploreTitle: 'Explore the docs',
  exploreLead: 'Four ways in: the foundations, every component, the blocks and the brand assets.',
  exploreFoundations:
    'Tokens, color, type, icons, languages, right-to-left, accessibility and keyboard.',
  exploreComponents: 'Every component by category, rendered live from its first example.',
  exploreBlocks: 'Whole screens built from the components, in a resizable frame.',
  exploreAssets: 'The brand lockups and product illustrations.',
  whyTitle: 'One kit powers every Azion interface',
  whyLead:
    '{components} components, {examples} live examples and {blocks} blocks: the same pieces behind the Azion Console, shaped by the teams who use them every day.',
  whyQualityTitle: 'Design for quality and speed',
  whyQualityBody:
    'Foundations you can trust and speed you can feel. Teams stop rebuilding the basics and ship the ideas that matter.',
  whyPeopleTitle: 'Built by the people who use it',
  whyPeopleBody:
    'Designers and engineers who build at Azion shape it. It gets sharper every time it goes to work in the real product.',
  whyNextTitle: 'Ready for what comes next',
  whyNextBody:
    'Opinionated foundations with composable patterns, so the system keeps pace as the craft changes.',
  openComponent: 'Open',
  categoryLead: '{count} components'
}

export type Messages = typeof en

const LOADERS: Record<string, () => Promise<Messages>> = {
  'pt-BR': () => import('./i18n-pt-br').then((module) => module.ptBR),
  es: () => import('./i18n-es').then((module) => module.es)
}

const catalogs = shallowReactive<Record<string, Messages>>({ en })

async function loadMessages(locale: string): Promise<void> {
  const load = LOADERS[locale]
  if (!load || catalogs[locale]) return
  catalogs[locale] = await load()
}

watch(
  () => settings.locale,
  (locale) => void loadMessages(locale),
  { immediate: true }
)

export const LOCALES = [
  { value: 'en', label: 'English' },
  { value: 'pt-BR', label: 'Português (Brasil)' },
  { value: 'es', label: 'Español' }
]

export const messages = computed(() => catalogs[settings.locale] ?? en)

export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match
  )
}
