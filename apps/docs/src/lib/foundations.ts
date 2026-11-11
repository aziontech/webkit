export type FoundationPage = {
  slug: string
  title: string
  summary: string
  tokens?: 'color' | 'spacing' | 'typography' | 'radius' | 'shadows' | 'motion' | 'z-index'
  markdown?: string
  demo?: 'locale' | 'direction' | 'devices'
}

export const FOUNDATIONS: FoundationPage[] = [
  {
    slug: 'getting-started',
    title: 'Getting started',
    summary: 'Install WebKit, add the theme and render the first component.',
    markdown: 'packages/webkit/README.md'
  },
  {
    slug: 'color',
    title: 'Color',
    summary: 'Semantic color tokens for light and dark, and the primitive palette behind them.',
    tokens: 'color',
    markdown: 'rules/webkit-tokens.md'
  },
  {
    slug: 'typography',
    title: 'Typography',
    summary: 'Named type styles set in Rubik and Roboto Mono.',
    tokens: 'typography'
  },
  {
    slug: 'spacing',
    title: 'Spacing',
    summary: 'The semantic rhythm (xxs to xxl) and the numeric scale.',
    tokens: 'spacing'
  },
  {
    slug: 'radius',
    title: 'Radius',
    summary: 'Corner radii and the shape tokens components read.',
    tokens: 'radius'
  },
  {
    slug: 'shadows',
    title: 'Shadows',
    summary: 'Elevation, drop and inset shadows.',
    tokens: 'shadows'
  },
  {
    slug: 'motion',
    title: 'Motion',
    summary: 'Easing curves, durations and the catalogued animations.',
    tokens: 'motion',
    markdown: 'rules/webkit-motion.md'
  },
  {
    slug: 'z-index',
    title: 'Z-index',
    summary: 'Stacking layers for fields, popups and overlays.',
    tokens: 'z-index'
  },
  {
    slug: 'i18n',
    title: 'Languages',
    summary: 'Built-in strings in English, Portuguese and Spanish through WebkitProvider.',
    markdown: 'rules/webkit-strings.md',
    demo: 'locale'
  },
  {
    slug: 'rtl',
    title: 'Right-to-left',
    summary: 'Logical sides only, so every screen mirrors under dir="rtl".',
    markdown: 'rules/webkit-direction.md',
    demo: 'direction'
  },
  {
    slug: 'devices',
    title: 'Layout and devices',
    summary: 'Container types, rhythm, breakpoints and how screens adapt.',
    markdown: 'rules/webkit-page-layout.md',
    demo: 'devices'
  },
  {
    slug: 'accessibility',
    title: 'Accessibility',
    summary: 'Role, keyboard, focus and motion are built in.',
    markdown: 'rules/webkit-accessibility.md'
  }
]

export const FOUNDATION_SLUGS = FOUNDATIONS.map((page) => page.slug)
