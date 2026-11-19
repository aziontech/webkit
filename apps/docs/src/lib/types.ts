export type Highlighted = { code: string; html: string }
export type PairType = 'usage' | 'guidance'
export type DocPair = { type: PairType; level: number; do: string; dont: string }
export type DocPart = { html: string } | { pair: DocPair }
export type MarkdownDoc = { parts: DocPart[]; title: string }
export type GuidelinesDoc = {
  title: string
  lead: string
  intro: string
  sections: { heading: string; html: string; parts: DocPart[] }[]
}
export type Row = Record<string, string>

export type ComponentDoc = {
  name: string
  import: string
  kind: string
  surface: string
  structure: string | null
  purpose: string
  purposeRest: string
  useWhen: string[]
  avoidWhen: string[]
  related: string[]
  bestPractices: string[]
  avoidPractices: string[]
  props: Row[]
  events: Row[]
  slots: Row[]
  subcomponents: { name: string; import: string; props: Row[] }[]
  examples: { name: string; summary: string; file: string; json?: string }[]
  exampleDir: string | null
  spec: Record<string, string>
}

export type ComponentIndexItem = {
  name: string
  title: string
  category: string
  surface: string
  purpose: string
  import: string
  exampleDir: string | null
  exampleCount: number
  firstExample: string | null
  llms: string | null
}

export type BlockIndexItem = {
  id: string
  name: string
  title: string
  group: string
  surface: string
  summary: string
  states: { name: string; slug: string; file: string }[]
  dir: string
  uses: string[]
  layout: string
  shell: string | null
  llms: string | null
}

export type DocsIndex = {
  components: ComponentIndexItem[]
  blocks: BlockIndexItem[]
  llmsTxt: boolean
  foundationLlms: Record<string, string>
  version: string
}

export type TokenUsage = { job: string; usedBy: string }

export type TokenPreview = {
  foreground: string
  background: string
  fill: 'background' | 'foreground' | 'swatch'
}

export type Token = {
  name: string
  value: string
  dark?: string
  usage?: TokenUsage
  preview?: TokenPreview
  responsive?: Record<string, string>
}

export type IconAsset = {
  name: string
  class: string
  set: string
  group: string
  category: string
  label: string
  product?: string
  keywords: string
}

export type DocsAssets = {
  icons: IconAsset[]
  illustrations: string[]
}

export type DocsTokens = {
  semantic: { id: string; vars: Token[] }[]
  palette: { id: string; vars: Token[] }[]
  spacing: Token[]
  radius: Token[]
  shadows: Token[]
  typography: Token[]
  fonts: Token[]
  motion: {
    ease: Token[]
    duration: Token[]
    animations: Token[]
  }
  zIndex: Token[]
  breakpoints: Token[]
  containers: Token[]
}
