import { existsSync, readFileSync } from 'node:fs'
import { basename, dirname, join, relative, resolve } from 'node:path'

import MarkdownIt from 'markdown-it'
import { createHighlighter, type Highlighter } from 'shiki'

import { previewPair } from '../../../packages/theme/src/tokens/contrast-pairs.js'
import { tokenPurpose } from '../../../packages/theme/src/tokens/token-purpose.js'
import { FOUNDATIONS } from '../src/lib/foundations.ts'
import { spacedTitle } from '../src/lib/words.ts'
import {
  type Catalog,
  type CatalogEntry,
  componentNames,
  LLMS,
  readBlocks,
  readCatalog,
  REPO,
  SPECS,
  THEME,
  walk,
  WEBKIT
} from './paths.ts'

const LANGS = ['vue', 'ts', 'js', 'json', 'bash', 'shell', 'css', 'html', 'md', 'yaml', 'diff']

let highlighterPromise: Promise<Highlighter> | null = null

export function highlighter(): Promise<Highlighter> {
  highlighterPromise ??= createHighlighter({
    themes: ['github-light-high-contrast', 'github-dark-high-contrast'],
    langs: LANGS
  })
  return highlighterPromise
}

export function highlight(hl: Highlighter, code: string, lang: string): string {
  const language = LANGS.includes(lang) ? lang : 'txt'
  return hl.codeToHtml(code, {
    lang: language,
    themes: { light: 'github-light-high-contrast', dark: 'github-dark-high-contrast' },
    defaultColor: false
  })
}

const REPOSITORY = 'https://github.com/aziontech/webkit/'
const SOURCE_REF = process.env.DOCS_SOURCE_REF || 'main'
const SOURCE_URL = `${REPOSITORY}blob/${SOURCE_REF}/`
const REPOSITORY_LINK =
  /^https:\/\/github\.com\/aziontech\/webkit\/(blob|tree)\/main\/([^#?]+)(#.*)?$/
const ABSOLUTE_HREF = /^(?:[a-z][a-z0-9+.-]*:|\/|#)/i

const PAGE_OF_FILE = new Map(
  FOUNDATIONS.filter((page) => page.markdown).map((page) => [
    page.markdown,
    `/foundations/${page.slug}`
  ])
)

function repositoryHref(href: string): string {
  const link = REPOSITORY_LINK.exec(href)
  if (!link) return href
  const [, kind, target = '', hash = ''] = link
  const page = PAGE_OF_FILE.get(target)
  return page ? `${page}${hash}` : `${REPOSITORY}${kind}/${SOURCE_REF}/${target}${hash}`
}

function sourceHref(href: string, file: string): string {
  if (!href) return href
  if (ABSOLUTE_HREF.test(href)) return repositoryHref(href)
  const [path = '', hash = ''] = href.split('#')
  const target = relative(REPO, resolve(dirname(file), path))
    .split('\\')
    .join('/')
  if (!target || target.startsWith('..')) return href
  const anchor = hash ? `#${hash}` : ''
  const spec = /^\.specs\/([a-z0-9-]+)\.md$/.exec(target)
  if (spec && !spec[1]?.startsWith('_')) return `/components/${spec[1]}${anchor}`
  const page = PAGE_OF_FILE.get(target)
  if (page) return `${page}${anchor}`
  return `${SOURCE_URL}${target}${anchor}`
}

const HTML_COMMENT = /<!--[\s\S]*?-->/g
const ONLY_COMMENTS = /^(?:\s*<!--[\s\S]*?-->)+\s*$/
const TASK_MARKER = /^\[[ xX]\]\s+/

type CoreState = { tokens: ReturnType<InstanceType<typeof MarkdownIt>['parse']> }
type InlineChildren = NonNullable<CoreState['tokens'][number]['children']>

function dropInlineComments(children: InlineChildren): InlineChildren {
  const kept: InlineChildren = []
  let open = false
  for (const child of children) {
    if (child.type !== 'text') {
      if (!open) kept.push(child)
      continue
    }
    let text = child.content
    if (open) {
      const close = text.indexOf('-->')
      if (close === -1) continue
      text = text.slice(close + 3)
      open = false
    }
    text = text.replace(HTML_COMMENT, '')
    const start = text.indexOf('<!--')
    if (start !== -1) {
      text = text.slice(0, start)
      open = true
    }
    child.content = text
    if (text) kept.push(child)
  }
  return kept
}

function dropHtmlComments(state: CoreState): void {
  const comment = (at: number) =>
    state.tokens[at]?.type === 'paragraph_open' &&
    ONLY_COMMENTS.test(state.tokens[at + 1]?.content ?? '')
  const kept: CoreState['tokens'] = []
  for (let at = 0; at < state.tokens.length; at++) {
    if (comment(at)) {
      at += 2
      continue
    }
    const token = state.tokens[at]
    if (token.type === 'inline' && token.children)
      token.children = dropInlineComments(token.children)
    kept.push(token)
  }
  state.tokens = kept
}

function dropTaskMarkers(state: CoreState): void {
  state.tokens.forEach((token, at) => {
    if (token.type !== 'list_item_open') return
    const inline = state.tokens.slice(at + 1, at + 4).find((next) => next.type === 'inline')
    const first = inline?.children?.[0]
    if (!inline || first?.type !== 'text' || !TASK_MARKER.test(first.content)) return
    first.content = first.content.replace(TASK_MARKER, '')
    inline.content = inline.content.replace(TASK_MARKER, '')
  })
}

const headingSlug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[`*_]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

function addHeadingIds(state: CoreState): void {
  const seen = new Map<string, number>()
  state.tokens.forEach((token, at) => {
    if (token.type !== 'heading_open' || !['h2', 'h3'].includes(token.tag)) return
    const base = headingSlug(state.tokens[at + 1]?.content ?? '') || 'section'
    const count = seen.get(base) ?? 0
    seen.set(base, count + 1)
    token.attrSet('id', count ? `${base}-${count + 1}` : base)
  })
}

export async function markdown(
  file = '',
  { headingIds = false } = {}
): Promise<InstanceType<typeof MarkdownIt>> {
  const hl = await highlighter()
  const md = new MarkdownIt({
    html: false,
    linkify: true,
    highlight: (code, lang) => highlight(hl, code, lang || 'txt')
  })
  md.core.ruler.after('inline', 'drop-html-comments', dropHtmlComments)
  md.core.ruler.after('drop-html-comments', 'drop-task-markers', dropTaskMarkers)
  if (headingIds) md.core.ruler.after('drop-task-markers', 'heading-ids', addHeadingIds)
  if (file) {
    const render = md.renderer.rules.link_open
    md.renderer.rules.link_open = (tokens, index, options, env, self) => {
      const token = tokens[index]
      const href = String(token?.attrGet('href') ?? '')
      const next = sourceHref(href, file)
      if (token && next !== href) {
        token.attrSet('href', next)
        if (next.startsWith(REPOSITORY)) {
          token.attrSet('target', '_blank')
          token.attrSet('rel', 'noopener noreferrer')
        }
      }
      return render
        ? render(tokens, index, options, env, self)
        : self.renderToken(tokens, index, options)
    }
  }
  return md
}

function stripFrontMatter(source: string): string {
  return source.replace(/^---\n[\s\S]*?\n---\n/, '')
}

export type PairType = 'usage' | 'guidance'
export type DocPair = { type: PairType; level: number; do: string; dont: string }
export type DocCode = { code: string; html: string; lang: string }
export type DocPart = { html: string } | { pair: DocPair } | { code: DocCode }
export type DocHeading = { id: string; text: string; depth: number }

const PAIR_WORDS: { type: PairType; side: 'do' | 'dont'; pattern: RegExp }[] = [
  { type: 'usage', side: 'do', pattern: /^when to use$/i },
  { type: 'usage', side: 'dont', pattern: /^when not to use$/i },
  { type: 'guidance', side: 'do', pattern: /^do$/i },
  { type: 'guidance', side: 'dont', pattern: /^don['’]t$/i }
]

export function pairWord(text: string): { type: PairType; side: 'do' | 'dont' } | null {
  const clean = text.replace(/[:.]$/, '').trim()
  const hit = PAIR_WORDS.find((word) => word.pattern.test(clean))
  return hit ? { type: hit.type, side: hit.side } : null
}

type MdToken = ReturnType<InstanceType<typeof MarkdownIt>['parse']>[number]

function closeOf(tokens: MdToken[], start: number): number {
  let depth = 0
  for (let at = start; at < tokens.length; at++) {
    depth += tokens[at].nesting
    if (depth === 0) return at
  }
  return tokens.length - 1
}

function headingLevel(token: MdToken): number {
  return Number(token.tag.slice(1))
}

function sectionEnd(tokens: MdToken[], start: number, level: number): number {
  for (let at = start + 3; at < tokens.length; at++)
    if (tokens[at].type === 'heading_open' && headingLevel(tokens[at]) <= level) return at
  return tokens.length
}

function labelStart(inline: MdToken | undefined): number {
  const children = inline?.children ?? []
  const at = children.findIndex((child) => !(child.type === 'text' && !child.content.trim()))
  return Math.max(at, 0)
}

function itemLabel(tokens: MdToken[], open: number): ReturnType<typeof pairWord> {
  const inline = tokens.slice(open, closeOf(tokens, open)).find((token) => token.type === 'inline')
  const [first, label, last] = (inline?.children ?? []).slice(labelStart(inline))
  if (first?.type !== 'strong_open' || last?.type !== 'strong_close') return null
  return pairWord(label?.content ?? '')
}

function stripItemLabel(tokens: MdToken[]): MdToken[] {
  const inline = tokens.find((token) => token.type === 'inline')
  if (inline?.children) {
    inline.children.splice(0, labelStart(inline) + 3)
    const [next] = inline.children
    if (next?.type === 'text') next.content = next.content.replace(/^\s+/, '')
  }
  return tokens.map((token) => {
    if (token.type === 'paragraph_open' || token.type === 'paragraph_close') token.hidden = false
    return token
  })
}

export function markdownParts(md: InstanceType<typeof MarkdownIt>, source: string): DocPart[] {
  const tokens = md.parse(source, {})
  const render = (slice: MdToken[]) => md.renderer.render(slice, md.options, {})
  const parts: DocPart[] = []
  let pending: MdToken[] = []
  let level = 1
  const flush = () => {
    if (pending.length) parts.push({ html: render(pending) })
    pending = []
  }
  const push = (pair: DocPair) => {
    flush()
    parts.push({ pair })
  }
  let at = 0
  while (at < tokens.length) {
    const token = tokens[at]
    if (token.type === 'fence' && token.level === 0) {
      flush()
      const lang = token.info.trim().split(/\s+/)[0] || 'txt'
      parts.push({ code: { code: token.content, html: render([token]), lang } })
      at++
      continue
    }
    if (token.type === 'heading_open') {
      const word = pairWord(tokens[at + 1]?.content ?? '')
      const own = headingLevel(token)
      const end = sectionEnd(tokens, at, own)
      const next = tokens[end]
      const nextWord =
        next?.type === 'heading_open' && headingLevel(next) === own
          ? pairWord(tokens[end + 1]?.content ?? '')
          : null
      if (word && nextWord && word.type === nextWord.type && word.side !== nextWord.side) {
        const nextEnd = sectionEnd(tokens, end, own)
        const first = render(tokens.slice(at + 3, end))
        const second = render(tokens.slice(end + 3, nextEnd))
        push({
          type: word.type,
          level: own,
          do: word.side === 'do' ? first : second,
          dont: word.side === 'do' ? second : first
        })
        at = nextEnd
        continue
      }
      level = own
    }
    if (token.type === 'bullet_list_open' && token.level === 0) {
      const close = closeOf(tokens, at)
      const items: { start: number; end: number; word: ReturnType<typeof pairWord> }[] = []
      for (let item = at + 1; item < close; item = closeOf(tokens, item) + 1)
        items.push({ start: item, end: closeOf(tokens, item), word: itemLabel(tokens, item) })
      const doItem = items.find((item) => item.word?.side === 'do')
      const dontItem = items.find(
        (item) => item.word?.side === 'dont' && item.word.type === doItem?.word?.type
      )
      if (doItem?.word && dontItem) {
        const rest = items.filter((item) => item !== doItem && item !== dontItem)
        if (rest.length)
          pending.push(
            token,
            ...rest.flatMap((item) => tokens.slice(item.start, item.end + 1)),
            tokens[close]
          )
        const body = (item: (typeof items)[number]) =>
          render(stripItemLabel(tokens.slice(item.start + 1, item.end)))
        push({
          type: doItem.word.type,
          level: Math.min(level + 1, 6),
          do: body(doItem),
          dont: body(dontItem)
        })
        at = close + 1
        continue
      }
    }
    pending.push(token)
    at++
  }
  flush()
  return parts
}

const HEADING_HTML = /<h([23]) id="([^"]+)">([\s\S]*?)<\/h\1>/g

function headingsOf(parts: DocPart[]): DocHeading[] {
  const html = parts.map((part) => ('html' in part ? part.html : '')).join('')
  return [...html.matchAll(HEADING_HTML)].map(([, depth, id, inner]) => ({
    id: id ?? '',
    depth: Number(depth),
    text: (inner ?? '')
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&#39;/g, "'")
  }))
}

export async function renderMarkdownFile(
  file: string
): Promise<{ parts: DocPart[]; title: string; toc: DocHeading[] }> {
  const md = await markdown(file, { headingIds: true })
  const source = stripFrontMatter(readFileSync(file, 'utf8'))
  const title = /^#\s+(.+)$/m.exec(source)?.[1]?.trim() ?? basename(file, '.md')
  const body = source.replace(/^#\s+.+\n/m, '')
  const parts = markdownParts(md, body)
  return { parts, title, toc: headingsOf(parts) }
}

const DONT_PRACTICE = /^\*\*(don['’]t|do not|never|avoid)\*\*\s*/i

type ExampleMeta = { name: string; summary?: string; file: string; json?: string }
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

const FOUNDATION_LLMS: Record<string, string> = {
  'getting-started': 'usage',
  icon: 'icons',
  radius: 'tokens',
  shadow: 'tokens',
  'z-index': 'tokens'
}

function foundationLlms(files: string[], slugs: string[]): Record<string, string> {
  const out: Record<string, string> = {}
  for (const slug of slugs) {
    const file = `foundations/${FOUNDATION_LLMS[slug] ?? slug}.md`
    if (files.includes(file)) out[slug] = `/llms/${file}`
  }
  return out
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
  aliases: string[]
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

const REFERENCE_NAME =
  /\b(?:Cloudscape|AI Elements|shadcn|Supabase|Vercel|Geist|Radix|Primer|Polaris|Mantine|Chakra|ChatGPT|Claude\.ai|Gemini|TanStack|AG-UI|benchmarks?)\b/
const REFERENCE_NOTE = new RegExp(`\\s*\\((?=[^()]*${REFERENCE_NAME.source})[^()]*\\)`, 'g')
const REFERENCE_CLAUSE = new RegExp(
  `,\\s*(?:after\\s+)?(?:the\\s+)?(?=${REFERENCE_NAME.source})[^,:;.]*`,
  'g'
)

export function stripReviewerNotes(text: string): string {
  return text
    .replace(REFERENCE_NOTE, '')
    .replace(REFERENCE_CLAUSE, '')
    .replace(/\s+([,:;.])/g, '$1')
    .trim()
}

function plainInline(text: string): string {
  return text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[`*]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function splitLead(text: string): { lead: string; rest: string } {
  const source = text.replace(/<!--[\s\S]*?-->/g, '').trim()
  const match = /^([\s\S]+?[.!?])(\s|$)/.exec(source)
  if (!match?.[1]) return { lead: plainInline(source), rest: '' }
  return { lead: plainInline(match[1]), rest: source.slice(match[0].length).trim() }
}

export function buildIndex(catalog: Catalog = readCatalog(), foundationSlugs: string[] = []) {
  const exampleDirs = readExampleDirs()
  const llms = llmsFiles()
  const byComponent = new Map(exampleDirs.map((entry) => [entry.data.component, entry]))
  const names = new Set([...componentNames(catalog), ...byComponent.keys()])
  const aliasesOf = new Map<string, string[]>()
  for (const [alias, target] of Object.entries((catalog.aliases ?? {}) as Record<string, string>))
    aliasesOf.set(target, [...(aliasesOf.get(target) ?? []), alias])
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
      surface: entry.surface ?? 'app',
      purpose: plainInline(
        firstSentence(
          stripReviewerNotes(entry.purpose ?? (parent?.purpose as string | undefined) ?? '')
        )
      ),
      import: entry.import ?? `@aziontech/webkit/${name}`,
      exampleDir: examples?.dir ?? null,
      exampleCount: examples?.data.examples.length ?? 0,
      firstExample: examples?.data.examples[0]?.file ?? null,
      llms: llmsFile(llms, 'components', name),
      aliases: aliasesOf.get(name) ?? []
    }
  })
  const blocks: BlockIndexItem[] = readBlocks().map((block) => ({
    id: block.id,
    name: block.name,
    title: spacedTitle(block.name),
    group: block.dir.split('/').slice(0, -1).join('/') || block.dir,
    surface: block.surface ?? 'app',
    summary: plainInline(firstSentence(stripReviewerNotes(block.summary ?? ''))),
    states: block.states,
    dir: block.dir,
    uses: (
      ((catalog.blocks as Record<string, { imports?: string[] }>)?.[block.id]?.imports ??
        []) as string[]
    ).map((path) => path.replace('@aziontech/webkit/', '')),
    layout: block.preview?.layout ?? 'padded',
    shell: block.preview?.frame === 'primary' ? block.primary.file : null,
    llms: llmsFile(llms, 'blocks', block.id)
  }))
  return {
    components,
    blocks,
    llmsTxt: existsSync(join(LLMS, 'llms.txt')),
    foundationLlms: foundationLlms(llms, foundationSlugs),
    version: (catalog.webkitVersion as string) ?? ''
  }
}

export const SPEC_SECTIONS = [
  'Accessibility (WCAG 2.1 AA)',
  'Right-to-left',
  'Internationalization',
  'Responsive',
  'v-model',
  'States'
]

function specSections(name: string): Record<string, string> {
  const file = join(SPECS, `${name.replace(/\//g, '-')}.md`)
  if (!existsSync(file)) return {}
  const source = stripFrontMatter(readFileSync(file, 'utf8')).replace(/<!--[\s\S]*?-->\n?/g, '')
  const out: Record<string, string> = {}
  const parts = source.split(/^## /m).slice(1)
  for (const part of parts) {
    const heading = part.slice(0, part.indexOf('\n')).trim()
    if (SPEC_SECTIONS.includes(heading)) out[heading] = part.slice(part.indexOf('\n') + 1).trim()
  }
  return out
}

export async function buildComponent(name: string, catalog: Catalog = readCatalog()) {
  const md = await markdown(join(SPECS, `${name.replace(/\//g, '-')}.md`))
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
  const practices = (entry.bestPractices as string[]) ?? []
  const found = readExampleDirs().find(({ data }) => data.component === name)
  const examplesDir = found
    ? { file: join(WEBKIT, 'examples', found.dir, 'examples.json'), data: found.data }
    : undefined
  return {
    name,
    import: entry.import,
    kind: entry.kind,
    surface: entry.surface ?? 'app',
    structure: entry.structure ?? null,
    purpose: inline(entry.purpose),
    purposeRest: inline(splitLead(String(entry.purpose ?? '')).rest),
    useWhen: ((entry.useWhen as string[]) ?? []).map(inline),
    avoidWhen: ((entry.avoidWhen as string[]) ?? []).map(inline),
    related: ((entry.related as string[]) ?? []).map((item) =>
      inline(item.startsWith('`') ? item : `\`${item}`)
    ),
    bestPractices: practices.filter((line) => !DONT_PRACTICE.test(line)).map(inline),
    avoidPractices: practices.filter((line) => DONT_PRACTICE.test(line)).map(inline),
    props: rows(entry.props),
    events: rows(entry.events),
    slots: rows(entry.slots),
    subcomponents,
    examples: (examplesDir?.data.examples ?? []).map((example) => ({
      name: example.name,
      summary: inline(example.summary ?? ''),
      file: example.file,
      ...(example.json ? { json: example.json } : {})
    })),
    exampleDir: examplesDir ? relative(join(WEBKIT, 'examples'), dirname(examplesDir.file)) : null,
    spec: Object.fromEntries(
      Object.entries(sections).map(([heading, body]) => [heading, md.render(body)])
    )
  }
}

export async function renderGuidelinesFile(file: string): Promise<{
  title: string
  lead: string
  intro: string
  sections: { heading: string; html: string; parts: DocPart[] }[]
}> {
  const md = await markdown(file)
  const source = stripFrontMatter(readFileSync(file, 'utf8'))
  const title = /^#\s+(.+)$/m.exec(source)?.[1]?.trim() ?? basename(dirname(file))
  const [head, ...parts] = source.replace(/^#\s+.+\n/m, '').split(/^## /m)
  const { lead, rest } = splitLead(head)
  return {
    title,
    lead,
    intro: rest ? md.render(rest) : '',
    sections: parts.map((part) => {
      const body = part.slice(part.indexOf('\n') + 1).trim()
      return {
        heading: part.slice(0, part.indexOf('\n')).trim(),
        html: md.render(body),
        parts: markdownParts(md, body)
      }
    })
  }
}

type TokenUsage = { job: string; usedBy: string }
type TokenPreview = ReturnType<typeof previewPair>
type TokenGroup = {
  id: string
  vars: {
    name: string
    value: string
    dark?: string
    usage?: TokenUsage
    preview: TokenPreview
  }[]
}

function tokenUsage(): { match: (name: string) => boolean; usage: TokenUsage }[] {
  const file = join(REPO, 'rules/webkit-tokens.md')
  if (!existsSync(file)) return []
  const source = readFileSync(file, 'utf8')
  const start = source.indexOf('## Which color token does which job')
  if (start === -1) return []
  const section = source.slice(start)
  const end = section.indexOf('\n## ', 1)
  const rows = (end === -1 ? section : section.slice(0, end))
    .split('\n')
    .filter((line) => line.startsWith('|') && !/^\|\s*-/.test(line))
    .slice(1)
    .map((line) =>
      line
        .split('|')
        .slice(1, -1)
        .map((cell) => cell.trim())
    )
    .filter((cells) => cells.length >= 3)
  return rows.map(([job, tokens, usedBy]) => {
    const names = [...tokens.matchAll(/`([^`]+)`/g)].map((match) => match[1])
    const bases = names.filter((name) => name.startsWith('--'))
    const suffixes = names.filter((name) => !name.startsWith('--'))
    const exact = new Set(bases.filter((name) => !name.endsWith('*')))
    const prefixes = bases.filter((name) => name.endsWith('*')).map((name) => name.slice(0, -1))
    for (const suffix of suffixes) {
      if (/\bwith\b/.test(tokens)) for (const base of bases) exact.add(base + suffix)
      else if (bases[0]) exact.add(bases[0].replace(/-[\w]+$/, suffix))
    }
    return {
      match: (name: string) =>
        exact.has(name) || prefixes.some((prefix) => name.startsWith(prefix)),
      usage: { job, usedBy }
    }
  })
}

function responsiveSpacing(): Record<string, Record<string, string>> {
  const file = join(THEME, 'src/tokens/semantic/spacing.js')
  if (!existsSync(file)) return {}
  const out: Record<string, Record<string, string>> = {}
  for (const match of readFileSync(file, 'utf8').matchAll(/'(spacing-[\w-]+)':\s*\{([^}]*)\}/g)) {
    out[`--${match[1]}`] = Object.fromEntries(
      [...match[2].matchAll(/(\w+):\s*'([^']+)'/g)].map((pair) => [pair[1], pair[2]])
    )
  }
  return out
}

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

function topLevel(block: string): string {
  let depth = 0
  let out = ''
  for (const char of block) {
    if (char === '{') depth++
    if (depth === 0) out += char
    if (char === '}') {
      depth--
      if (depth === 0) out = out.replace(/[^;{}]*$/, '')
    }
  }
  return out
}

function declarations(block: string): Map<string, string> {
  const out = new Map<string, string>()
  for (const match of topLevel(block).matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g))
    out.set(match[1], match[2].trim())
  return out
}

function mediaSteps(
  css: string,
  breakpoints: Map<string, string>
): Map<string, Record<string, string>> {
  const names = new Map(
    [...breakpoints].map(([name, px]) => [px, name.replace('--breakpoint-', '')])
  )
  const out = new Map<string, Record<string, string>>()
  for (const match of css.matchAll(/@media \(min-width: (\d+px)\) \{([^}]*)\}/g)) {
    const step = names.get(match[1])
    if (!step) continue
    for (const [name, value] of declarations(match[2]))
      out.set(name, { ...(out.get(name) ?? {}), [step]: value })
  }
  return out
}

function typeStyles(
  classes: string[],
  theme: Map<string, string>,
  steps: Map<string, Record<string, string>>
) {
  return classes.map((name) => {
    const read = (part: string) => theme.get(`--${name}-${part}`)
    const size = read('font-size')
    const tracking = read('letter-spacing')
    const value = size
      ? [
          `${size} / ${read('line-height') ?? 'normal'}`,
          read('font-weight'),
          tracking && tracking !== '0' ? tracking : ''
        ]
          .filter(Boolean)
          .join(' · ')
      : '—'
    const responsive = steps.get(`--${name}-font-size`)
    return responsive && size
      ? { name, value, responsive: { _: size, ...responsive } }
      : { name, value }
  })
}

export function buildTokens(catalog: Catalog = readCatalog()) {
  const css = readFileSync(join(THEME, 'dist/globals.css'), 'utf8')
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
  const usage = tokenUsage()
  const semantic: TokenGroup[] = semanticPrefixes
    .map((prefix) => ({
      id: prefix,
      vars: pick(light, (name) => name.startsWith(`--${prefix}`), true)
        .filter((token) => /^(#|rgb|hsl|oklch|color-mix|transparent|var\()/i.test(token.value))
        .filter((token) => !(token.dark === undefined && /^(var|color-mix)\(/.test(token.value)))
        .map((token) => {
          const found = usage.find((entry) => entry.match(token.name))
          const preview = previewPair(token.name)
          return found ? { ...token, usage: found.usage, preview } : { ...token, preview }
        })
    }))
    .filter((group) => group.vars.length)
  const responsive = responsiveSpacing()
  const primitiveColors = pick(theme, (name) => name.startsWith('--color-'))
  const paletteGroups = new Map<string, { name: string; value: string }[]>()
  for (const token of primitiveColors) {
    const family = token.name.replace(/^--color-/, '').replace(/-\d+$/, '')
    paletteGroups.set(family, [...(paletteGroups.get(family) ?? []), token])
  }
  const global = new Map([...theme, ...light])
  const prefixed = (prefix: string, source = global) =>
    pick(source, (name) => name.startsWith(prefix))
  const purposes = tokenPurpose as Record<string, string | undefined>
  const uniq = <T extends { name: string; usage?: TokenUsage }>(list: T[]) =>
    [...new Map(list.map((token) => [token.name, token])).values()].map((token) => {
      const job = purposes[token.name]
      return token.usage || !job ? token : { ...token, usage: { job, usedBy: '' } }
    })
  return {
    semantic,
    palette: [...paletteGroups.entries()].map(([id, vars]) => ({ id, vars })),
    spacing: uniq([
      ...prefixed('--spacing'),
      ...pick(light, (name) => name.startsWith('--spacing'))
    ]).map((token) =>
      responsive[token.name] ? { ...token, responsive: responsive[token.name] } : token
    ),
    radius: uniq([...prefixed('--radius'), ...pick(light, (name) => name.startsWith('--shape'))]),
    shadows: uniq([
      ...prefixed('--shadow'),
      ...prefixed('--drop-shadow'),
      ...prefixed('--inset-shadow')
    ]),
    typography: typeStyles(
      catalog.tokens.typography,
      global,
      mediaSteps(css, new Map(prefixed('--breakpoint').map((token) => [token.name, token.value])))
    ),
    fonts: uniq([...prefixed('--font'), ...prefixed('--tracking'), ...prefixed('--leading')]),
    motion: {
      ease: uniq(prefixed('--ease')),
      duration: uniq([
        ...prefixed('--transition'),
        ...pick(theme, (name) => name.startsWith('--duration'))
      ]),
      animations: Object.entries(catalog.tokens.animationGuide).map(([name, info]) => ({
        name: `animate-${name}`,
        value: info.value,
        usage: { job: info.useWhen, usedBy: '' }
      }))
    },
    zIndex: uniq([...prefixed('--z'), ...pick(light, (name) => name.startsWith('--z'))]),
    breakpoints: uniq(prefixed('--breakpoint')),
    containers: uniq([
      ...prefixed('--container'),
      ...pick(light, (name) => name.startsWith('--layout'))
    ])
  }
}

function assetItems<T>(name: string): T[] {
  const file = join(WEBKIT, 'catalog/assets', `${name}.json`)
  if (!existsSync(file)) return []
  return (JSON.parse(readFileSync(file, 'utf8')) as { items: T[] }).items
}

export function buildAssets() {
  return {
    icons: assetItems<{
      name: string
      class: string
      set: string
      group: string
      category: string
      label: string
      product?: string
      keywords: string[]
    }>('icons').map((icon) => ({
      ...icon,
      keywords: [icon.label, icon.product ?? '', ...icon.keywords].join(' ')
    })),
    illustrations: assetItems<{ name: string; canvas?: string }>('illustrations').map(
      (item) => item.name
    )
  }
}
