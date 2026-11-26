import { computed, shallowReactive, watch } from 'vue'

import { settings } from './settings'

export const en = {
  components: 'Components',
  blocks: 'Blocks',
  foundations: 'Foundations',
  patterns: 'Patterns',
  patternsLead:
    'How to build each kind of screen: forms, tables, states, errors, navigation and words. Each page is the same file an AI agent reads.',
  patternGroups: {
    screens: 'Whole screens',
    forms: 'Forms and create flows',
    data: 'Data',
    feedback: 'Feedback and states',
    navigation: 'Navigation and layout',
    content: 'Content',
    ai: 'AI',
    azion: 'Azion APIs'
  },
  search: 'Search',
  searchPlaceholder: 'Search components, patterns, blocks and foundations…',
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
  newTab: '(opens in a new tab)',
  footer: 'Footer',
  footerWebkit: 'WebKit',
  guides: 'Guides',
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
  stabilityPreview: 'Preview',
  previewNote: 'Preview: the API may still change in a minor release until it is marked GA.',
  previewLink: 'How preview and GA work',
  guidelines: 'Guidelines',
  viewport: 'Viewport',
  viewportMobile: 'Mobile',
  viewportTablet: 'Tablet',
  viewportDesktop: 'Desktop',
  viewportFull: 'Full',
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
  assetsLead: 'The brand lockups, product illustrations and icons WebKit ships.',
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
  iconsLead:
    'Every icon of @aziontech/icons, grouped as Azion products and platform, interface glyphs and third-party logos. Select one to copy it.',
  brandOnDark: 'On dark',
  brandOnLight: 'On white',
  brandTreatments: 'One-colour versions',
  brandTreatmentsLead:
    'For a one-colour print, a document or a partner page that asks for a black or white logo. Set treatment on Brand; never recolour a copy.',
  brandMonochrome: 'Monochrome: black on white, white on dark.',
  brandKnockout: 'Knockout: on an orange fill.',
  openIcons: 'Open the icon gallery',
  homeEyebrow: 'WebKit',
  homeTitle: 'The Azion design system, built for AI.',
  homeLead:
    'Components, blocks, patterns and foundations for the Azion Console, docs and site. Your AI agent reads the same catalog you browse here, and AI agents build WebKit itself.',
  startWithAgents: 'Start with agents',
  agentPrompt:
    "Build my UI with the Azion design system. Install @aziontech/webkit, @aziontech/theme and @aziontech/icons, run npx @aziontech/webkit init, import the theme once, and compose the app from WebKit's Vue components and design tokens instead of hand-rolled UI, following each component's documented props and compound API.",
  pathsTitle: 'Two ways in',
  pathsLead: 'Build an app on WebKit, or make WebKit better.',
  pathBuildTitle: 'Start building',
  pathBuildBody:
    'Install the packages, run npx @aziontech/webkit init and compose your screens from blocks and components. Your AI agent gets the MCP server, the guidance and the lint in the same step.',
  pathBuildLink: 'Get started',
  pathContributeTitle: 'Start contributing',
  pathContributeBody:
    'WebKit is built by AI agents. You open a GitHub issue; agents research it, write the spec, have a second agent review it, build, run every gate and the UI review, and open the pull request. No design file, no hand-built component.',
  pathContributeLink: 'How WebKit is built',
  forAi: 'WebKit for AI',
  aiNav: 'AI',
  aiPageSummary:
    'The MCP server, the setup command, the guidance agents load, the checks they pass, and how agents build WebKit itself.',
  aiTitle: 'Your AI agent reads the same WebKit you do',
  aiLead:
    'This site is half of it. The other half is for AI agents: a server they query, guidance they load and checks that hold their code to the standard.',
  aiMcpTitle: 'MCP server',
  aiMcpBody:
    '@aziontech/webkit-mcp answers search_blocks, get_component, list_tokens and validate_usage from the catalog of the version you installed.',
  aiInitTitle: 'One setup command',
  aiInitBody:
    'npx @aziontech/webkit init wires the MCP server, the lint, the theme and the agent instructions in AGENTS.md.',
  aiGuidanceTitle: 'Skills, rules and patterns',
  aiGuidanceBody:
    'The guidance on this site ships as Markdown in the package, so an agent reads the pattern for the job before it writes a line.',
  aiChecksTitle: 'Checks that hold the line',
  aiChecksBody:
    'The lint presets, webkit doctor and webkit check fail the build on a wrong import, a raw colour or a missing label.',
  aiAgentTitle: 'Set up your agent in one prompt',
  aiAgentBody:
    'Paste it into Claude Code, Cursor, Codex or ChatGPT. It installs WebKit and runs init, so the agent knows the components from the first screen.',
  aiAgentAside: 'Want the details first?',
  aiAgentAction: 'Read WebKit for AI',
  exploreTitle: 'Explore WebKit',
  exploreLead: 'Everything the system holds, for people and for agents.',
  exploreFoundations: 'Tokens, color, type, languages, right-to-left, accessibility and keyboard.',
  exploreComponents: 'Every component by category, rendered live from its first example.',
  explorePatterns: 'How to build forms, tables, errors, states and navigation.',
  exploreBlocks: 'Whole screens built from the components, in a resizable frame.',
  exploreAssets: 'The brand lockups, product illustrations and icons.',
  exploreAi: 'The MCP server, the setup command and how agents build WebKit.',
  whyTitle: 'One kit powers every Azion interface',
  whyLead:
    '{components} components, {examples} live examples and {blocks} blocks: the same pieces behind the Azion Console, shaped by the teams who use them every day.',
  whyQualityTitle: 'Design for quality and speed',
  whyQualityBody:
    'Foundations you can trust and speed you can feel. Teams stop rebuilding the basics and ship the ideas that matter.',
  whyPeopleTitle: 'Built by the people who use it',
  whyPeopleBody:
    'The teams who build at Azion ask for what they need, and agents build it through one reviewed flow. It gets sharper every time it goes to work in the real product.',
  whyNextTitle: 'Ready for what comes next',
  whyNextBody:
    'Opinionated foundations with composable patterns, so the system keeps pace as the craft changes.',
  openComponent: 'Open',
  categoryLead: '{count} components',
  componentsLead: '{count} components, each with its examples, API and guidelines.',
  blocksLead:
    '{count} screens and fragments, each with its states, code and guidelines. Copy one with npx @aziontech/webkit add <id>.',
  copyPageTip: 'Copy this page as Markdown, ready to paste into an assistant.',
  copyBlockTip: 'Copy this block as Markdown, ready to paste into an assistant.'
}

export type Messages = typeof en

const LOADERS: Record<string, () => Promise<Messages>> = {
  'pt-BR': () => import('./i18n-pt-br').then((module) => module.ptBR),
  es: () => import('./i18n-es').then((module) => module.es)
}

const catalogs = shallowReactive<Record<string, Messages>>({ en })

export async function loadMessages(locale: string): Promise<void> {
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
