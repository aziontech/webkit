export type Highlighted = { code: string; html: string }
export type MarkdownDoc = { html: string; title: string }
export type Row = Record<string, string>

export type ComponentDoc = {
  name: string
  import: string
  kind: string
  surface: string
  structure: string | null
  purpose: string
  useWhen: string[]
  avoidWhen: string[]
  related: string[]
  bestPractices: string[]
  props: Row[]
  events: Row[]
  slots: Row[]
  subcomponents: { name: string; import: string; props: Row[] }[]
  examples: { name: string; summary: string; file: string }[]
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
  llms: string | null
}

export type DocsIndex = {
  components: ComponentIndexItem[]
  blocks: BlockIndexItem[]
  llmsTxt: boolean
  foundationLlms: Record<string, string>
  version: string
}

export type Token = { name: string; value: string; dark?: string }

export type DocsTokens = {
  semantic: { id: string; vars: Token[] }[]
  palette: { id: string; vars: Token[] }[]
  spacing: Token[]
  radius: Token[]
  shadows: Token[]
  typography: string[]
  fonts: Token[]
  motion: {
    ease: Token[]
    duration: Token[]
    animations: { name: string; value: string; useWhen: string }[]
  }
  zIndex: Token[]
  breakpoints: Token[]
  containers: Token[]
}
