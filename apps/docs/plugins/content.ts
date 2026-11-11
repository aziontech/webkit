import { existsSync, readFileSync } from 'node:fs'
import { basename, dirname, join, relative } from 'node:path'

import MarkdownIt from 'markdown-it'
import { createHighlighter, type Highlighter } from 'shiki'

import {
  type Catalog,
  type CatalogEntry,
  componentNames,
  LLMS,
  readBlocks,
  readCatalog,
  SPECS,
  THEME,
  walk,
  WEBKIT
} from './paths.ts'

const LANGS = ['vue', 'ts', 'js', 'json', 'bash', 'shell', 'css', 'html', 'md', 'yaml', 'diff']

let highlighterPromise: Promise<Highlighter> | null = null

export function highlighter(): Promise<Highlighter> {
  highlighterPromise ??= createHighlighter({
    themes: ['github-light', 'github-dark'],
    langs: LANGS
  })
  return highlighterPromise
}

export function highlight(hl: Highlighter, code: string, lang: string): string {
  const language = LANGS.includes(lang) ? lang : 'txt'
  return hl.codeToHtml(code, {
    lang: language,
    themes: { light: 'github-light', dark: 'github-dark' },
    defaultColor: false
  })
}

export async function markdown(): Promise<MarkdownIt> {
  const hl = await highlighter()
  const md = new MarkdownIt({
    html: false,
    linkify: true,
    highlight: (code, lang) => highlight(hl, code, lang || 'txt')
  })
  return md
}

function stripFrontMatter(source: string): string {
  return source.replace(/^---\n[\s\S]*?\n---\n/, '')
}

export async function renderMarkdownFile(file: string): Promise<{ html: string; title: string }> {
  const md = await markdown()
  const source = stripFrontMatter(readFileSync(file, 'utf8'))
  const title = /^#\s+(.+)$/m.exec(source)?.[1]?.trim() ?? basename(file, '.md')
  const body = source.replace(/^#\s+.+\n/m, '')
  return { html: md.render(body), title }
}

type ExampleMeta = { name: string; summary?: string; file: string }
type ExamplesFile = { component: string; title?: string; examples: ExampleMeta[] }

function readExampleDirs(): { dir: string; data: ExamplesFile }[] {
  return walk(join(WEBKIT, 'examples'), (name) => name === 'examples.json').map((file) => ({
    dir: relative(join(WEBKIT, 'examples'), dirname(file)),
    data: JSON.parse(readFileSync(file, 'utf8')) as ExamplesFile
  }))
}

function pascal(name: string): string {
  return name
    .split(/[-/]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

function titleOf(name: string, examplesTitle?: string): string {
  if (examplesTitle) return examplesTitle.split('/').pop() as string
  return pascal(name)
}

function llmsFiles(): string[] {
  return walk(LLMS, (name) => name.endsWith('.md')).map((file) => relative(LLMS, file))
}

function llmsFile(files: string[], kind: 'components' | 'blocks', id: string): string | null {
  const wanted = `${id}.md`
  const hit =
    files.find((file) => file === `${kind}/${wanted}`) ??
    files.find((file) => file.endsWith(`/${wanted}`) && file.includes(kind.slice(0, -1))) ??
    files.find((file) => file === wanted)
  return hit ? `/llms/${hit}` : null
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

export function firstSentence(text: string): string {
  const plain = text.replace(/`/g, '')
  const match = /^(.+?[.!?])(\s|$)/.exec(plain)
  return (match ? match[1] : plain).trim()
}

export function buildIndex(catalog: Catalog = readCatalog()) {
  const exampleDirs = readExampleDirs()
  const llms = llmsFiles()
  const byComponent = new Map(exampleDirs.map((entry) => [entry.data.component, entry]))
  const names = new Set([...componentNames(catalog), ...byComponent.keys()])
  const components: ComponentIndexItem[] = [...names].sort().map((name) => {
    const entry = (catalog.imports[name] ?? {}) as CatalogEntry
    const examples = byComponent.get(name)
    const parent = entry.parent ? catalog.imports[entry.parent] : undefined
    const titlePath = examples?.data.title?.split('/') ?? []
    return {
      name,
      title: titleOf(name, examples?.data.title),
      category:
        entry.category ??
        parent?.category ??
        titlePath[titlePath.length - 2]?.toLowerCase() ??
        'other',
      surface: entry.surface ?? 'product',
      purpose: firstSentence(entry.purpose ?? (parent?.purpose as string | undefined) ?? ''),
      import: entry.import ?? `@aziontech/webkit/${name}`,
      exampleDir: examples?.dir ?? null,
      exampleCount: examples?.data.examples.length ?? 0,
      llms: llmsFile(llms, 'components', name)
    }
  })
  const blocks: BlockIndexItem[] = readBlocks().map((block) => ({
    id: block.id,
    name: block.name,
    title: block.name.replace(/([a-z0-9])([A-Z])/g, '$1 $2'),
    group: block.dir.split('/').slice(0, -1).join('/') || block.dir,
    surface: block.surface ?? 'product',
    summary: firstSentence(block.summary ?? ''),
    states: block.states,
    dir: block.dir,
    uses: (
      ((catalog.patterns as Record<string, { imports?: string[] }>)?.[block.id]?.imports ??
        []) as string[]
    ).map((path) => path.replace('@aziontech/webkit/', '')),
    layout: block.preview?.layout ?? 'padded',
    llms: llmsFile(llms, 'blocks', block.id)
  }))
  return {
    components,
    blocks,
    llmsTxt: existsSync(join(LLMS, 'llms.txt')),
    version: (catalog.webkitVersion as string) ?? ''
  }
}

const SPEC_SECTIONS = [
  'Accessibility (WCAG 2.1 AA)',
  'Right-to-left',
  'Internationalization',
  'Responsive',
  'v-model',
  'States',
  'Constraints — DO NOT'
]

function specSections(name: string): Record<string, string> {
  const file = join(SPECS, `${name.replace(/\//g, '-')}.md`)
  if (!existsSync(file)) return {}
  const source = stripFrontMatter(readFileSync(file, 'utf8'))
  const out: Record<string, string> = {}
  const parts = source.split(/^## /m).slice(1)
  for (const part of parts) {
    const heading = part.slice(0, part.indexOf('\n')).trim()
    if (SPEC_SECTIONS.includes(heading)) out[heading] = part.slice(part.indexOf('\n') + 1).trim()
  }
  return out
}

export async function buildComponent(name: string, catalog: Catalog = readCatalog()) {
  const md = await markdown()
  const inline = (text: unknown) => (typeof text === 'string' ? md.renderInline(text) : '')
  const entry = (catalog.imports[name] ?? { import: `@aziontech/webkit/${name}` }) as CatalogEntry
  const rows = (list: unknown) =>
    Array.isArray(list)
      ? list.map((row: Record<string, string>) =>
          Object.fromEntries(
            Object.entries(row).map(([key, value]) => [
              key,
              ['doc', 'notes'].includes(key) ? inline(value) : value
            ])
          )
        )
      : []
  const subcomponents = Object.entries(catalog.imports)
    .filter(([, sub]) => sub.parent === name)
    .map(([subName, sub]) => ({ name: subName, import: sub.import, props: rows(sub.props) }))
  const sections = specSections(name)
  const found = readExampleDirs().find(({ data }) => data.component === name)
  const examplesDir = found
    ? { file: join(WEBKIT, 'examples', found.dir, 'examples.json'), data: found.data }
    : undefined
  return {
    name,
    import: entry.import,
    kind: entry.kind,
    surface: entry.surface ?? 'product',
    structure: entry.structure ?? null,
    purpose: inline(entry.purpose),
    useWhen: ((entry.useWhen as string[]) ?? []).map(inline),
    avoidWhen: ((entry.avoidWhen as string[]) ?? []).map(inline),
    related: ((entry.related as string[]) ?? []).map((item) => inline(`\`${item}`)),
    bestPractices: ((entry.bestPractices as string[]) ?? []).map(inline),
    props: rows(entry.props),
    events: rows(entry.events),
    slots: rows(entry.slots),
    subcomponents,
    examples: (examplesDir?.data.examples ?? []).map((example) => ({
      name: example.name,
      summary: inline(example.summary ?? ''),
      file: example.file
    })),
    exampleDir: examplesDir ? relative(join(WEBKIT, 'examples'), dirname(examplesDir.file)) : null,
    spec: Object.fromEntries(
      Object.entries(sections).map(([heading, body]) => [heading, md.render(body)])
    )
  }
}

export async function buildBlockGuidelines(dir: string): Promise<string> {
  const file = join(WEBKIT, 'blocks', dir, 'guidelines.md')
  if (!existsSync(file)) return ''
  return (await renderMarkdownFile(file)).html
}

type TokenGroup = { id: string; vars: { name: string; value: string; dark?: string }[] }

function cssBlocks(css: string, selectorPrefix: string): string[] {
  const out: string[] = []
  let index = css.indexOf(selectorPrefix)
  while (index !== -1) {
    const open = css.indexOf('{', index)
    let depth = 1
    let cursor = open + 1
    while (depth > 0 && cursor < css.length) {
      if (css[cursor] === '{') depth++
      else if (css[cursor] === '}') depth--
      cursor++
    }
    out.push(css.slice(open + 1, cursor - 1))
    index = css.indexOf(selectorPrefix, cursor)
  }
  return out
}

function declarations(block: string): Map<string, string> {
  const out = new Map<string, string>()
  for (const match of block.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g))
    out.set(match[1], match[2].trim())
  return out
}

export function buildTokens(catalog: Catalog = readCatalog()) {
  const css = readFileSync(join(THEME, 'dist/v4/globals.css'), 'utf8')
  const theme = new Map<string, string>()
  for (const block of cssBlocks(css, '@theme'))
    for (const [k, v] of declarations(block)) theme.set(k, v)
  const light = new Map<string, string>()
  for (const block of cssBlocks(css, ':root, [data-theme=light]'))
    for (const [k, v] of declarations(block)) light.set(k, v)
  const dark = new Map<string, string>()
  for (const block of cssBlocks(css, '[data-theme=dark]'))
    for (const [k, v] of declarations(block)) dark.set(k, v)

  const pick = (source: Map<string, string>, test: (name: string) => boolean, withDark = false) =>
    [...source.entries()]
      .filter(([name]) => test(name))
      .map(([name, value]) => ({ name, value, ...(withDark ? { dark: dark.get(name) } : {}) }))

  const semanticPrefixes = [
    'bg',
    'surface',
    'text',
    'border',
    'primary',
    'secondary',
    'accent',
    'success',
    'warning',
    'danger',
    'info',
    'severity',
    'ring',
    'chart',
    'code',
    'illustration'
  ]
  const semantic: TokenGroup[] = semanticPrefixes
    .map((prefix) => ({
      id: prefix,
      vars: pick(light, (name) => name.startsWith(`--${prefix}`), true).filter(
        (token) => !/^--text-[\w-]+--/.test(token.name)
      )
    }))
    .filter((group) => group.vars.length)
  const primitiveColors = pick(theme, (name) => name.startsWith('--color-'))
  const paletteGroups = new Map<string, { name: string; value: string }[]>()
  for (const token of primitiveColors) {
    const family = token.name.replace(/^--color-/, '').replace(/-\d+$/, '')
    paletteGroups.set(family, [...(paletteGroups.get(family) ?? []), token])
  }
  const prefixed = (prefix: string, source = theme) =>
    pick(source, (name) => name.startsWith(prefix))
  const uniq = <T extends { name: string }>(list: T[]) => [
    ...new Map(list.map((token) => [token.name, token])).values()
  ]
  return {
    semantic,
    palette: [...paletteGroups.entries()].map(([id, vars]) => ({ id, vars })),
    spacing: uniq([
      ...prefixed('--spacing'),
      ...pick(light, (name) => name.startsWith('--spacing'))
    ]),
    radius: uniq([...prefixed('--radius'), ...pick(light, (name) => name.startsWith('--shape'))]),
    shadows: uniq([
      ...prefixed('--shadow'),
      ...prefixed('--drop-shadow'),
      ...prefixed('--inset-shadow')
    ]),
    typography: catalog.tokens.typography,
    fonts: uniq([...prefixed('--font'), ...prefixed('--tracking'), ...prefixed('--leading')]),
    motion: {
      ease: prefixed('--ease'),
      duration: [
        ...prefixed('--transition'),
        ...pick(theme, (name) => name.startsWith('--duration'))
      ],
      animations: Object.entries(catalog.tokens.animationGuide).map(([name, info]) => ({
        name,
        value: info.value,
        useWhen: info.useWhen
      }))
    },
    zIndex: uniq([...prefixed('--z'), ...pick(light, (name) => name.startsWith('--z'))]),
    breakpoints: prefixed('--breakpoint'),
    containers: uniq([
      ...prefixed('--container'),
      ...pick(light, (name) => name.startsWith('--layout'))
    ])
  }
}
