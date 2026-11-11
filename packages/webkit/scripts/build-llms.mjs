#!/usr/bin/env node

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, posix, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { getSection, parseSpecFile } from '../../../.claude/hooks/_lib/spec.mjs'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const PKG_ROOT = resolve(SCRIPT_DIR, '..')
const REPO_ROOT = resolve(PKG_ROOT, '../..')
const OUT_DIR = resolve(PKG_ROOT, 'llms')
const CATALOG_PATH = resolve(PKG_ROOT, 'catalog.json')
const SPECS_DIR = resolve(REPO_ROOT, '.specs')

export const FULL_BUDGET_BYTES = 3 * 1024 * 1024

const SPEC_SECTIONS = [
  'Sub-components',
  'v-model',
  'States',
  'Accessibility (WCAG 2.1 AA)',
  'Right-to-left',
  'Internationalization',
  'Responsive'
]

const CATEGORY_TITLES = {
  actions: 'Actions',
  chart: 'Charts',
  code: 'Code',
  content: 'Content',
  data: 'Data',
  documentation: 'Documentation',
  feedback: 'Feedback',
  inputs: 'Inputs',
  layout: 'Layout',
  marketing: 'Marketing',
  navigation: 'Navigation',
  overlay: 'Overlay',
  sections: 'Marketing sections',
  utils: 'Utilities'
}

function stripComments(text) {
  let out = String(text ?? '')
  let prev
  do {
    prev = out
    out = out.replace(/<!--[\s\S]*?-->/g, '')
  } while (out !== prev)
  return out
}

function stripFrontmatter(text) {
  return String(text).replace(/^---\n[\s\S]*?\n---\n/, '')
}

function readRepo(rel) {
  const abs = resolve(REPO_ROOT, rel)
  return existsSync(abs) ? stripFrontmatter(readFileSync(abs, 'utf-8')) : null
}

function headingSection(md, pattern) {
  if (!md) return null
  const lines = md.split('\n')
  const start = lines.findIndex((l) => /^#{1,6}\s/.test(l) && pattern.test(l))
  if (start === -1) return null
  const level = lines[start].match(/^#+/)[0].length
  let end = lines.length
  let fence = false
  for (let i = start + 1; i < lines.length; i++) {
    if (/^\s*```/.test(lines[i])) fence = !fence
    if (fence) continue
    const m = lines[i].match(/^(#+)\s/)
    if (m && m[1].length <= level) {
      end = i
      break
    }
  }
  return lines.slice(start, end).join('\n').trim()
}

function withoutTitle(md) {
  return String(md)
    .replace(/^\s*#\s[^\n]*\n/, '')
    .trim()
}

function demote(md, by = 1) {
  let fence = false
  return String(md)
    .split('\n')
    .map((line) => {
      if (/^\s*```/.test(line)) fence = !fence
      if (fence || !/^#{1,5}\s/.test(line)) return line
      return '#'.repeat(by) + line
    })
    .join('\n')
}

function cell(text) {
  return String(text ?? '')
    .replace(/\|/g, '\\|')
    .replace(/\n+/g, ' ')
    .trim()
}

function table(headers, rows) {
  return [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map((r) => `| ${r.map(cell).join(' | ')} |`)
  ].join('\n')
}

function code(text, lang = 'vue') {
  const body = String(text ?? '').replace(/\s+$/, '')
  const fence = body.includes('```') ? '````' : '```'
  return `${fence}${lang}\n${body}\n${fence}`
}

function bullets(list) {
  return list.map((b) => `- ${b}`).join('\n')
}

function firstSentence(text) {
  const t = String(text ?? '')
    .replace(/\s+/g, ' ')
    .trim()
  const m = t.match(/^(.+?[.!?])(\s|$)/)
  const s = m ? m[1] : t
  return s.length > 220 ? `${s.slice(0, 217).trimEnd()}…` : s
}

function titleOf(name) {
  return name
    .split(/[-/]/)
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ')
}

function binding(name) {
  return name
    .split('/')
    .pop()
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('')
}

const REPO_URL = 'https://github.com/aziontech/webkit/blob/main'

function specLinks(md, names) {
  return md.replace(/\]\((?!https?:|#|mailto:)([^)\s]+)\)/g, (m, target) => {
    const [path, hash = ''] = target.split('#')
    const resolved = posix.normalize(posix.join('.specs', path))
    const spec = resolved.match(/^\.specs\/([a-z0-9-]+)\.md$/)
    if (spec && names.has(spec[1])) return `](${spec[1]}.md${hash ? `#${hash}` : ''})`
    if (resolved.startsWith('..')) return m
    return `](${REPO_URL}/${resolved}${hash ? `#${hash}` : ''})`
  })
}

function link(from, to) {
  return posix.relative(posix.dirname(from), to)
}

function loadCatalog() {
  const catalog = JSON.parse(readFileSync(CATALOG_PATH, 'utf-8'))
  const part = (file) => JSON.parse(readFileSync(resolve(PKG_ROOT, file), 'utf-8'))
  return {
    ...catalog,
    pattern(id) {
      const { file, ...meta } = catalog.patterns[id]
      return file ? { ...meta, ...part(file) } : meta
    },
    examples(name) {
      const e = catalog.imports[name]
      if (!e) return []
      return e.examplesFile ? part(e.examplesFile).examples || [] : e.examples || []
    }
  }
}

function specSections(name) {
  const file = resolve(SPECS_DIR, `${name}.md`)
  if (!existsSync(file)) return {}
  const { body } = parseSpecFile(file)
  const out = {}
  for (const heading of SPEC_SECTIONS) {
    const text = stripComments(getSection(body, heading) ?? '').trim()
    if (text && text !== '_none_') out[heading] = text
  }
  const usage = stripComments(getSection(body, 'Usage') ?? '').trim()
  if (usage) out.Usage = usage
  return out
}

function allowedClasses(e) {
  return e.styleSeam
    ? 'Built to be personalized (style seam): any class is accepted on the tag.'
    : 'Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.'
}

function componentNames(catalog) {
  return Object.keys(catalog.imports)
    .filter((n) => catalog.imports[n].kind === 'component')
    .sort()
}

function componentApi(catalog, name) {
  const e = catalog.imports[name]
  return {
    name,
    binding: binding(name),
    import: e.import,
    treeShakeableImport: e.treeShakeableImport ?? e.import,
    category: e.category ?? null,
    surface: e.surface ?? null,
    structure: e.structure ?? null,
    compoundRoot: e.compoundRoot ?? false,
    subcomponents: e.subcomponents ?? [],
    purpose: e.purpose ?? null,
    setup: e.setup ?? null,
    useWhen: e.useWhen ?? [],
    avoidWhen: e.avoidWhen ?? [],
    related: e.related ?? [],
    bestPractices: e.bestPractices ?? [],
    props: e.props ?? [],
    events: e.events ?? [],
    slots: e.slots ?? [],
    styleSeam: e.styleSeam === true,
    examples: catalog.examples(name).map((x) => ({ name: x.name, sfc: x.sfc })),
    docs: `components/${name}.md`
  }
}

function componentPage(catalog, name, { full = true } = {}) {
  const api = componentApi(catalog, name)
  const spec = specSections(name)
  const path = `components/${name}.md`
  const out = [`# ${titleOf(name)}`, '']
  if (api.purpose) out.push(`> ${api.purpose}`, '')
  const facts = [
    `Import: \`import ${binding(api.treeShakeableImport.split('/').pop())} from '${api.treeShakeableImport}'\``,
    `Category: ${api.category ?? '—'} · Surface: ${api.surface ?? '—'} · Structure: ${api.structure ?? '—'}`,
    `API as JSON: [${name}.json](${name}.json)`
  ]
  if (api.treeShakeableImport !== api.import) {
    facts.splice(
      1,
      0,
      `Compound import (dot notation, not tree-shakeable): \`import ${api.binding} from '${api.import}'\``
    )
  }
  out.push(bullets(facts), '')
  if (api.setup) out.push('## Setup', '', api.setup, '')
  if (api.useWhen.length) out.push('## When to use', '', bullets(api.useWhen), '')
  if (api.bestPractices.length) out.push('## Do', '', bullets(api.bestPractices), '')
  out.push('## Don\u2019t', '', bullets([...api.avoidWhen, allowedClasses(api)]), '')
  if (api.related.length) {
    const names = new Set(componentNames(catalog))
    const related = api.related.map((r) =>
      r.replace(/^`?([a-z0-9-]+)`?/, (m, n) =>
        names.has(n) ? `[${n}](${link(path, `components/${n}.md`)})` : m
      )
    )
    out.push('## Related', '', bullets(related), '')
  }
  if (api.props.length) {
    out.push(
      '## Props',
      '',
      table(
        ['Prop', 'Type', 'Default', 'Required', 'Description'],
        api.props.map((p) => [
          `\`${p.name}\``,
          `\`${p.type}\``,
          p.default ? `\`${p.default}\`` : '',
          p.required,
          p.doc
        ])
      ),
      ''
    )
  }
  if (api.events.length) {
    out.push(
      '## Events',
      '',
      table(
        ['Event', 'Payload', 'Notes'],
        api.events.map((e) => [`\`${e.name}\``, e.payload ? `\`${e.payload}\`` : '', e.notes])
      ),
      ''
    )
  }
  if (api.slots.length) {
    out.push(
      '## Slots',
      '',
      table(
        ['Slot', 'Scope', 'Notes'],
        api.slots.map((s) => [`\`${s.name}\``, s.scope, s.notes])
      ),
      ''
    )
  }
  if (api.subcomponents.length) {
    out.push('## Sub-component imports', '', bullets(api.subcomponents.map((s) => `\`${s}\``)), '')
  }
  for (const heading of SPEC_SECTIONS) {
    if (spec[heading])
      out.push(
        `## ${heading === 'Accessibility (WCAG 2.1 AA)' ? 'Accessibility' : heading}`,
        '',
        demote(spec[heading]),
        ''
      )
  }
  const examples = full ? api.examples : api.examples.slice(0, 1)
  if (examples.length) {
    out.push('## Examples', '')
    for (const x of examples) out.push(`### ${x.name}`, '', code(x.sfc), '')
    if (!full && api.examples.length > 1) {
      out.push(
        `${api.examples.length - 1} more example(s) in [components/${name}.md](components/${name}.md).`,
        ''
      )
    }
  } else if (spec.Usage) {
    out.push('## Usage', '', spec.Usage, '')
  }
  const page =
    out
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trimEnd() + '\n'
  return specLinks(page, new Set(componentNames(catalog)))
}

function blockPage(catalog, id, { full = true } = {}) {
  const p = catalog.pattern(id)
  const path = `blocks/${id}.md`
  const names = new Set(componentNames(catalog))
  const out = [`# ${p.name} (\`${id}\`)`, '']
  if (p.summary) out.push(`> ${p.summary.replace(/\n+/g, ' ')}`, '')
  const facts = [
    `Surface: ${p.surface ?? 'product'}`,
    `Source: \`${p.source}\` in \`@aziontech/webkit\``,
    `MCP: \`get_pattern("${id}")\``
  ]
  if (p.components?.length) {
    facts.push(
      `Components: ${p.components
        .map((c) => {
          const n = c
            .replace(/^@aziontech\/webkit\//, '')
            .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
            .toLowerCase()
          return names.has(n) ? `[${binding(n)}](${link(path, `components/${n}.md`)})` : `\`${c}\``
        })
        .join(', ')}`
    )
  }
  if (p.skills?.length) facts.push(`Skills: ${p.skills.map((s) => `\`${s}\``).join(', ')}`)
  out.push(bullets(facts), '')
  if (p.intents?.length) out.push('## Asked as', '', p.intents.join('; '), '')
  if (p.guidelines) {
    out.push(withoutTitle(stripComments(p.guidelines)), '')
  } else if (p.guidelinesSummary) {
    out.push('## When to use', '', p.guidelinesSummary, '')
  }
  if (p.steps?.length)
    out.push(
      '## Steps',
      '',
      bullets(p.steps.map((s) => (typeof s === 'string' ? s : (s.name ?? JSON.stringify(s))))),
      ''
    )
  const variants = p.variants || []
  out.push(
    '## Variants',
    '',
    bullets([
      `\`${p.primary}\` — primary (the code below)`,
      ...variants.map((v) => `\`${v.name}\` — ${v.summary || ''}`.trim())
    ]),
    '',
    `Each variant is the same screen in another state: \`get_pattern("${id}", { variant })\`, or the file under \`blocks/${id}/variants/\`.`,
    ''
  )
  if (full) out.push(`## Code (\`${p.primary}\`)`, '', code(p.sfc), '')
  else
    out.push(
      `The code of every state is in [blocks/${id}.md](blocks/${id}.md) and \`${p.source}\`.`,
      ''
    )
  return (
    out
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trimEnd() + '\n'
  )
}

function tokenList(vars) {
  return vars.map((v) => `\`${v}\``).join(' · ')
}

function groupsTable(groups, keys) {
  return table(
    ['Group', 'Count', 'Tokens'],
    keys.filter((k) => groups[k]).map((k) => [k, String(groups[k].length), tokenList(groups[k])])
  )
}

const COLOR_GROUPS = [
  'primary',
  'secondary',
  'accent',
  'bg',
  'surface',
  'text',
  'border',
  'ring',
  'success',
  'warning',
  'danger',
  'info',
  'severity',
  'chart',
  'code',
  'illustration',
  'color'
]
const SPACING_GROUPS = [
  'spacing',
  'layout',
  'container',
  'size',
  'width',
  'height',
  'inset',
  'breakpoint'
]

function foundations(catalog) {
  const t = catalog.tokens || { groups: {}, typography: [], animations: [], animationGuide: {} }
  const guidelines = readRepo('packages/webkit/docs/GUIDELINES.md')
  const styleguide = readRepo('packages/webkit/docs/STYLEGUIDE.md')
  const layout = readRepo('skills/webkit-layout/SKILL.md')
  const usage = readRepo('skills/webkit-usage/SKILL.md')
  const section = (md, re) => demote(headingSection(md, re) ?? '', 0)
  const rule = (name) => withoutTitle(readRepo(`rules/${name}.md`) ?? '')
  const pages = [
    {
      slug: 'tokens',
      title: 'Design tokens',
      summary:
        'Every visual decision comes from a token: the token groups, what to use and what lint blocks.',
      body: [
        withoutTitle(section(styleguide, /^## 1\. Foundations/)),
        '## The rule',
        rule('webkit-tokens'),
        '## Token groups',
        `${(t.cssVars || []).length} CSS custom properties from \`@aziontech/theme\`, grouped by their first segment. The MCP tool \`list_tokens\` returns the same list.`,
        groupsTable(t.groups, Object.keys(t.groups).sort())
      ]
    },
    {
      slug: 'color',
      title: 'Color',
      summary: 'Semantic color roles, light and dark themes, and the color tokens by group.',
      body: [
        withoutTitle(readRepo('skills/webkit-theming-dark-mode/SKILL.md') ?? ''),
        '## Color tokens',
        groupsTable(t.groups, COLOR_GROUPS)
      ]
    },
    {
      slug: 'typography',
      title: 'Typography',
      summary:
        'The generated typography classes: font, size, line height and tracking in one class.',
      body: [
        'Text uses the generated classes from `@aziontech/theme`. Each one bundles font family, size, line height and tracking, so a raw Tailwind size (`text-sm`), `leading-*`, `tracking-*` or a `font-family` is never needed and lint blocks them.',
        '## Classes',
        bullets((t.typography || []).map((c) => `\`${c}\``)),
        '## Related tokens',
        groupsTable(t.groups, ['font', 'leading', 'tracking', 'line'])
      ]
    },
    {
      slug: 'spacing',
      title: 'Spacing and layout',
      summary: 'Page levels, the five measures, the two rhythm steps and the spacing scale.',
      body: [
        section(layout, /^## 1\. Three levels/),
        section(layout, /^## 2\. The measure/),
        section(layout, /^## 3\. The boundary/),
        section(layout, /^## 4\. Rhythm/),
        section(layout, /^## 5\. Every value/),
        section(layout, /^## 6\. The site frame/),
        section(layout, /^## 7\. The control cap/),
        '## Spacing and layout tokens',
        groupsTable(t.groups, SPACING_GROUPS)
      ]
    },
    {
      slug: 'motion',
      title: 'Motion',
      summary:
        'The catalogued animate-* utilities, their timing, when to use each, and reduced motion.',
      body: [
        rule('webkit-motion'),
        '## Animation utilities',
        table(
          ['Class', 'Value', 'Use when'],
          (t.animations || []).map((n) => [
            `\`animate-${n}\``,
            t.animationGuide?.[n]?.value ? `\`${t.animationGuide[n].value}\`` : '',
            t.animationGuide?.[n]?.useWhen ?? ''
          ])
        ),
        '## Duration and easing tokens',
        groupsTable(t.groups, ['transition', 'ease', 'animate'])
      ]
    },
    {
      slug: 'i18n',
      title: 'Languages (i18n)',
      summary:
        'Built-in strings in en, pt-BR and es, the provider, useLocale and locale-aware formatting.',
      body: [
        'WebKit ships every built-in string in three catalogs: `en` (default), `pt-BR` and `es`. Wrap the app in `WebkitProvider` with a `locale` and every component follows it; `useLocale()` from `@aziontech/webkit/use-locale` gives your own code the same `t`, `dir` and `Intl` formatters.',
        section(usage, /^## App-level setup/),
        rule('webkit-strings')
      ]
    },
    {
      slug: 'rtl',
      title: 'Right-to-left',
      summary:
        'Logical sides only, so every screen mirrors under dir="rtl"; what mirrors and what does not.',
      body: [rule('webkit-direction')]
    },
    {
      slug: 'devices',
      title: 'Devices',
      summary:
        'Viewport breakpoints for the shell, container queries for the content, touch targets and reflow at 320 px.',
      body: [section(layout, /^## 8\. Devices/)]
    },
    {
      slug: 'accessibility',
      title: 'Accessibility',
      summary:
        'WCAG 2.1 AA rules every component and screen follows: names, focus, keyboard, contrast, motion.',
      body: [rule('webkit-accessibility')]
    },
    {
      slug: 'usage',
      title: 'Using WebKit in an app',
      summary:
        'Start from a block, find a component, import it tree-shakeably, app-level setup and the quality checklist.',
      body: [withoutTitle(usage ?? ''), withoutTitle(section(guidelines, /^## Part B/))]
    }
  ]
  return pages.map((p) => ({
    ...p,
    md:
      [`# ${p.title}`, '', `> ${p.summary}`, '', ...p.body.filter(Boolean).flatMap((b) => [b, ''])]
        .join('\n')
        .replace(/\n{3,}/g, '\n\n')
        .trimEnd() + '\n'
  }))
}

function header(catalog) {
  return [
    `# Azion WebKit`,
    '',
    `> The Vue 3 design system of Azion (\`${catalog.package}\` ${catalog.webkitVersion}): components, screen blocks with guidelines, and the design foundations, written for agents that build Azion product, marketing and docs screens.`,
    '',
    'Start every screen from a block (a reviewed, copyable screen), then fill gaps with components. Import each component from its own subpath (`@aziontech/webkit/<name>`), style only through tokens, and keep strings in the locale catalogs. These pages are generated from `catalog.json`; agents with MCP get the same data from `webkit-mcp` (`search_patterns`, `get_pattern`, `suggest_component`, `get_component`).',
    '',
    `Installed copy: \`node_modules/${catalog.package}/llms/\`. Every component also has a JSON API next to its page (\`components/<name>.json\`).`,
    ''
  ].join('\n')
}

export function buildLlms(catalog = loadCatalog()) {
  const files = {}
  const index = [header(catalog)]
  const fullParts = [header(catalog)]

  const found = foundations(catalog)
  index.push('## Foundations', '')
  for (const f of found) {
    files[`foundations/${f.slug}.md`] = f.md
    index.push(`- [${f.title}](foundations/${f.slug}.md): ${f.summary}`)
    fullParts.push(`<!-- foundations/${f.slug}.md -->\n\n${f.md}`)
  }
  index.push('')

  const ids = Object.keys(catalog.patterns).sort()
  const blockGroups = {}
  for (const id of ids) (blockGroups[id.split('/')[0]] ||= []).push(id)
  for (const [group, list] of Object.entries(blockGroups)) {
    index.push(`## Blocks: ${titleOf(group)}`, '')
    for (const id of list) {
      const p = catalog.pattern(id)
      files[`blocks/${id}.md`] = blockPage(catalog, id)
      index.push(
        `- [${p.name} (${id})](blocks/${id}.md): ${firstSentence(p.guidelinesSummary || p.summary)}`
      )
      fullParts.push(`<!-- blocks/${id}.md -->\n\n${blockPage(catalog, id, { full: false })}`)
    }
    index.push('')
  }

  const names = componentNames(catalog)
  const byCategory = {}
  for (const n of names) (byCategory[catalog.imports[n].category ?? 'other'] ||= []).push(n)
  for (const cat of Object.keys(byCategory).sort()) {
    index.push(`## Components: ${CATEGORY_TITLES[cat] ?? titleOf(cat)}`, '')
    for (const n of byCategory[cat]) {
      files[`components/${n}.md`] = componentPage(catalog, n)
      files[`components/${n}.json`] = specLinks(
        JSON.stringify(componentApi(catalog, n), null, 1) + '\n',
        new Set(names)
      )
      index.push(
        `- [${binding(n)}](components/${n}.md): ${firstSentence(catalog.imports[n].purpose)}`
      )
      fullParts.push(`<!-- components/${n}.md -->\n\n${componentPage(catalog, n, { full: false })}`)
    }
    index.push('')
  }

  index.push(
    '## Optional',
    '',
    '- [llms-full.txt](llms-full.txt): every foundation, block and component page in one file, sized for one context window: block guidelines without their code and the first example of each component (the pages above hold the code and every example).',
    '- [catalog.json](../catalog.json): the machine catalog the pages are generated from (exports, props, tokens, blocks).',
    ''
  )
  files['llms.txt'] =
    index
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trimEnd() + '\n'
  files['llms-full.txt'] =
    fullParts
      .join('\n\n---\n\n')
      .replace(/\n{3,}/g, '\n\n')
      .trimEnd() + '\n'
  return files
}

function listFiles(dir, out = []) {
  if (!existsSync(dir)) return out
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) listFiles(p, out)
    else out.push(relative(OUT_DIR, p).split('\\').join('/'))
  }
  return out
}

export function checkLlms(files = buildLlms()) {
  const drift = []
  for (const [file, text] of Object.entries(files)) {
    const abs = resolve(OUT_DIR, file)
    if (!existsSync(abs)) drift.push(`missing llms/${file}`)
    else if (readFileSync(abs, 'utf-8') !== text) drift.push(`stale llms/${file}`)
  }
  for (const file of listFiles(OUT_DIR)) if (!(file in files)) drift.push(`extra llms/${file}`)
  const full = Buffer.byteLength(files['llms-full.txt'] ?? '')
  if (full > FULL_BUDGET_BYTES)
    drift.push(`llms-full.txt is ${full} bytes, over the ${FULL_BUDGET_BYTES} budget`)
  return drift
}

export function writeLlms(files = buildLlms()) {
  rmSync(OUT_DIR, { recursive: true, force: true })
  for (const [file, text] of Object.entries(files)) {
    const abs = resolve(OUT_DIR, file)
    mkdirSync(dirname(abs), { recursive: true })
    writeFileSync(abs, text, 'utf-8')
  }
  return files
}

export function summary(files) {
  const count = (re) => Object.keys(files).filter((f) => re.test(f)).length
  const kb = (f) => Math.round(Buffer.byteLength(files[f]) / 1024)
  return `llms/ written: llms.txt (${kb('llms.txt')} KB), llms-full.txt (${kb('llms-full.txt')} KB), ${count(/^components\/.*\.md$/)} component pages + ${count(/\.json$/)} JSON, ${count(/^blocks\//)} block pages, ${count(/^foundations\//)} foundation pages`
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const files = buildLlms()
  if (process.argv.includes('--check')) {
    const drift = checkLlms(files)
    if (drift.length) {
      process.stderr.write(
        `✖ llms/ out of sync (${drift.length}):\n  ${drift.slice(0, 20).join('\n  ')}\nRun: node scripts/build-llms.mjs (or catalog:build)\n`
      )
      process.exit(1)
    }
    process.stdout.write(`✓ llms/ in sync (${Object.keys(files).length} files)\n`)
    process.exit(0)
  }
  writeLlms(files)
  process.stdout.write(`${summary(files)}\n`)
}
