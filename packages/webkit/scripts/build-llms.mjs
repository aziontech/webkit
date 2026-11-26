#!/usr/bin/env node

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, posix, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { loadManifest as loadIconManifest } from '../../icons/scripts/lib/icons-manifest.mjs'

import { getSection, parseSpecFile } from '../../../.claude/hooks/lib/spec.mjs'
import { hydratePart } from '../src/catalog/catalog.js'
import { composableExports } from './lib/composable-docs.mjs'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const PKG_ROOT = resolve(SCRIPT_DIR, '..')
const REPO_ROOT = resolve(PKG_ROOT, '../..')
const OUT_DIR = resolve(PKG_ROOT, 'llms')
const CATALOG_PATH = resolve(PKG_ROOT, 'catalog.json')
const SPECS_DIR = resolve(REPO_ROOT, '.specs')

export const FULL_BUDGETS = {
  'llms-full.txt': 2_600_000,
  'llms-full-site.txt': 760_000
}

const SPEC_SECTIONS = [
  'Sub-components',
  'v-model',
  'States',
  'Accessibility (WCAG 2.1 AA)',
  'Right-to-left',
  'Internationalization',
  'Responsive'
]

const PAGE_ONLY_SECTIONS = ['Right-to-left', 'Internationalization', 'Responsive']

const CATEGORY_TITLES = {
  action: 'Actions',
  ai: 'AI',
  chart: 'Charts',
  code: 'Code',
  content: 'Content',
  data: 'Data',
  docs: 'Documentation',
  feedback: 'Feedback',
  input: 'Inputs',
  layout: 'Layout',
  marketing: 'Marketing',
  navigation: 'Navigation',
  overlay: 'Overlay',
  provider: 'Providers',
  section: 'Page sections'
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
  return String(md)
    .split(/(^\s*```[^\n]*\n[\s\S]*?^\s*```[^\n]*$)/m)
    .map((chunk, i) => (i % 2 ? chunk : proseSpecLinks(chunk, names)))
    .join('')
}

function apiJson(api, names) {
  const linked = {}
  for (const [key, value] of Object.entries(api)) {
    linked[key] =
      key === 'examples'
        ? value.map((x) => ({ name: x.name, file: x.file }))
        : JSON.parse(specLinks(JSON.stringify(value), names))
  }
  return JSON.stringify(linked, null, 1) + '\n'
}

function proseSpecLinks(md, names) {
  return md.replace(
    /\]\((?!https?:|#|mailto:|\/|components\/|blocks\/|foundations\/)([^)\s]+)\)/g,
    (m, target) => {
      const [path, hash = ''] = target.split('#')
      const resolved = posix.normalize(posix.join('.specs', path))
      const spec = resolved.match(/^\.specs\/([a-z0-9-]+)\.md$/)
      if (spec && names.has(spec[1])) return `](${spec[1]}.md${hash ? `#${hash}` : ''})`
      const api = path.match(/^([a-z0-9-]+)\.json$/)
      if (api && names.has(api[1])) return m
      if (/^\.\.\/(foundations|blocks)\/[^/].*\.md$/.test(path)) return m
      if (resolved.startsWith('..')) return m
      return `](${REPO_URL}/${resolved}${hash ? `#${hash}` : ''})`
    }
  )
}

function link(from, to) {
  return posix.relative(posix.dirname(from), to)
}

function namesOnly(md) {
  return String(md).replace(
    /\[([^\]]+)\]\((?!https?:|components\/|blocks\/|foundations\/)[^)\s]+\.(?:md|json)(?:#[^)\s]*)?\)/g,
    '$1'
  )
}

function partNames(md, heading, more) {
  let fence = false
  const lines = String(md).split('\n')
  const start = lines.findIndex((l) => l.trim() === heading)
  if (start === -1) return md
  let end = lines.length
  const parts = []
  for (let i = start + 1; i < lines.length; i++) {
    if (/^\s*```/.test(lines[i])) fence = !fence
    if (fence) continue
    if (/^#{1,2}\s/.test(lines[i])) {
      end = i
      break
    }
    const h = lines[i].match(/^###\s+(.+)$/)
    if (h) parts.push(h[1].trim())
  }
  if (!parts.length) return md
  return [...lines.slice(0, start + 1), '', bullets(parts), '', more, '', ...lines.slice(end)].join(
    '\n'
  )
}

const tableCells = (line) =>
  line
    .replace(/\\\|/g, '\u0000')
    .split('|')
    .slice(1, -1)
    .map((c) => c.trim().replace(/\u0000/g, '\\|'))

function compactTables(md) {
  let fence = false
  return String(md)
    .split('\n')
    .map((line) => {
      if (/^\s*```/.test(line)) fence = !fence
      if (fence || !/^\|.*\|\s*$/.test(line)) return line
      const cells = tableCells(line)
      const row = cells.every((c) => /^:?-+:?$/.test(c))
        ? cells.map((c) => c.replace(/-+/, '---'))
        : cells
      return `| ${row.join(' | ')} |`
    })
    .join('\n')
}

function sectionAsNames(md, heading, more) {
  const lines = String(md).split('\n')
  const start = lines.findIndex((l) => l.trim() === heading)
  if (start === -1) return md
  const out = lines.slice(0, start + 1)
  let fence = false
  let cut = false
  let afterCode = false
  let i = start + 1
  for (; i < lines.length; i++) {
    if (!fence && /^#{1,2}\s/.test(lines[i])) break
    if (/^\s*```/.test(lines[i])) {
      if (!fence && /:\s*$/.test(out.at(-1) ?? '')) out.pop()
      else if (!fence && !out.at(-1)?.trim() && /:\s*$/.test(out.at(-2) ?? '')) out.splice(-2)
      fence = !fence
      afterCode = !fence
      cut = true
      continue
    }
    if (fence) continue
    if (afterCode && lines[i].trim()) {
      afterCode = false
      if (/^Then\b/.test(lines[i])) continue
    }
    if (/^\|/.test(lines[i])) {
      const rows = []
      while (i < lines.length && /^\|/.test(lines[i])) rows.push(tableCells(lines[i++]))
      i--
      const [head, , ...body] = rows
      out.push(`${head[0]}: ${body.map((r) => r[0]).join(', ')}.`)
      cut = true
      continue
    }
    out.push(lines[i])
  }
  if (cut) out.push('', more, '')
  return [...out, ...lines.slice(i)].join('\n')
}

function firstSentences(md) {
  let fence = false
  return String(md)
    .split('\n')
    .map((line) => {
      if (/^\s*```/.test(line)) fence = !fence
      const m = !fence && line.match(/^- (.+)$/)
      return m ? `- ${firstSentence(m[1])}` : line
    })
    .join('\n')
}

function loadCatalog() {
  return catalogView(JSON.parse(readFileSync(CATALOG_PATH, 'utf-8')), (file) =>
    JSON.parse(readFileSync(resolve(PKG_ROOT, file), 'utf-8'))
  )
}

const readSourceFile = (file) => readFileSync(resolve(PKG_ROOT, file), 'utf-8').replace(/\n$/, '')

export function catalogView(catalog, readPart) {
  const part = (file) => hydratePart(readPart(file), readSourceFile)
  const imports = Object.fromEntries(
    Object.entries(catalog.imports).map(([name, e]) => {
      const { docsFile, ...meta } = e
      return [name, docsFile ? { ...meta, ...part(docsFile) } : meta]
    })
  )
  return {
    ...catalog,
    imports,
    block(id) {
      const { file, ...meta } = catalog.blocks[id]
      return file ? { ...meta, ...part(file) } : meta
    },
    assetItems(kind) {
      const meta = catalog.assets?.[kind]
      if (!meta) return []
      return meta.file ? part(meta.file).items || [] : meta.items || []
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

const ASSET_PAGES = {
  illustrations: 'illustrations',
  diagrams: 'diagrams',
  brandMarks: 'brand-marks',
  icons: 'icons'
}

export function assetPagePath(kind) {
  return `foundations/${ASSET_PAGES[kind] ?? kind}.md`
}

function assetUsage(kind) {
  if (kind === 'illustrations')
    return code(
      '<script setup>\n  import Illustration from \'@aziontech/webkit/illustration\'\n</script>\n\n<template>\n  <Illustration name="ddos-protection" />\n</template>'
    )
  if (kind === 'diagrams')
    return code(
      '<script setup>\n  import Diagram from \'@aziontech/webkit/diagram\'\n</script>\n\n<template>\n  <Diagram name="cache" />\n</template>'
    )
  if (kind === 'brandMarks')
    return code(
      "<script setup>\n  import Marquee from '@aziontech/webkit/marquee'\n</script>\n\n<template>\n  <Marquee :marks=\"['itau', 'magalu', 'netshoes']\" />\n</template>"
    )
  if (kind === 'icons')
    return code(
      '<script setup>\n  import \'@aziontech/icons\'\n  import Button from \'@aziontech/webkit/button\'\n</script>\n\n<template>\n  <i class="az az-firewall" aria-hidden="true"></i>\n  <i class="az az-trash" aria-hidden="true"></i>\n  <i class="az-color az-react" aria-hidden="true"></i>\n  <Button icon="az az-plus">Create</Button>\n</template>'
    )
  return ''
}

function iconTables(items) {
  const { groups } = loadIconManifest()
  const out = []
  for (const [group, { title, summary, categories }] of Object.entries(groups)) {
    out.push(`### ${title}\n\n${summary}`)
    for (const [category, { title: heading }] of Object.entries(categories)) {
      const rows = items.filter((i) => i.group === group && i.category === category)
      if (!rows.length) continue
      const product = group === 'azion' && ['product', 'feature'].includes(category)
      out.push(
        `#### ${title} · ${heading}`,
        table(
          ['Class', ...(product ? ['Product'] : []), 'Stands for', 'Keywords'],
          rows.map((i) => [
            `\`${i.class}\``,
            ...(product ? [i.product ?? ''] : []),
            i.label ?? '',
            (i.keywords || []).join(', ')
          ])
        )
      )
    }
  }
  return out.join('\n\n')
}

function assetRows(kind, items) {
  if (kind === 'illustrations')
    return table(
      ['Name', 'Canvas', 'Status'],
      items.map((i) => [
        `\`${i.name}\``,
        i.canvas ?? '',
        i.deprecated ? `Old name, kept so existing page data renders: use \`${i.replacedBy}\`.` : ''
      ])
    )
  if (kind === 'icons') return iconTables(items)
  if (kind === 'brandMarks')
    return table(
      ['Name', 'Description', 'Drawn as'],
      items.map((i) => [`\`${i.name}\``, i.label ?? '', i.wordmark ? 'Text wordmark' : 'Mark'])
    )
  return table(
    ['Name', 'Description'],
    items.map((i) => [`\`${i.name}\``, i.label ?? ''])
  )
}

function assetPages(catalog) {
  const names = new Set(componentNames(catalog))
  return Object.entries(catalog.assets || {}).map(([kind, meta]) => {
    const path = assetPagePath(kind)
    const items = catalog.assetItems(kind)
    const usedBy = (meta.usedBy || []).map((n) =>
      names.has(n) ? `[${binding(n)}](${link(path, `components/${n}.md`)})` : `\`${n}\``
    )
    const intro = [
      meta.summary.slice(firstSentence(meta.summary).length).trim(),
      `${items.length} names. These are the only values the components accept. ${meta.unknown} The MCP tool \`list_assets({ kind: "${kind}" })\` returns the same list (with a \`query\` to filter), and \`catalog.json#assets.${kind}\` points at it as data.`,
      usedBy.length ? `Used by: ${usedBy.join(', ')}.` : ''
    ]
    return {
      slug: ASSET_PAGES[kind] ?? kind,
      title: meta.title,
      summary: firstSentence(meta.summary),
      compact: [
        ...intro,
        `## Names\n\n${items.map((i) => `\`${i.class ?? i.name}\`${i.deprecated ? ` (deprecated, use \`${i.replacedBy}\`)` : ''}`).join(' · ')}\n\nDescriptions${kind === 'icons' ? ', groups and keywords' : ''}: [${path}](${path.split('/').pop()}).`
      ],
      body: [...intro, '## Usage', assetUsage(kind), '## Names', assetRows(kind, items)]
    }
  })
}

function assetSection(catalog, name, path) {
  const kinds = Object.entries(catalog.assets || {}).filter(([, meta]) =>
    (meta.usedBy || []).includes(name)
  )
  if (!kinds.length) return []
  return [
    '## Assets',
    '',
    bullets(
      kinds.map(
        ([kind, meta]) =>
          `${meta.title}: every valid name is in [${assetPagePath(kind).split('/').pop()}](${link(path, assetPagePath(kind))}) (MCP \`list_assets({ kind: "${kind}" })\`). ${meta.unknown}`
      )
    ),
    ''
  ]
}

function allowedClasses(e) {
  return e.styleSeam
    ? 'Built to be personalized (style seam): any class is accepted on the tag.'
    : 'Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.'
}

function hasOwnPage(e) {
  return e.kind === 'component' || (e.kind === 'subcomponent' && Boolean(e.purpose))
}

function componentNames(catalog) {
  return Object.keys(catalog.imports)
    .filter((n) => hasOwnPage(catalog.imports[n]))
    .sort()
}

export function undocumentedExports(catalog, files) {
  const missing = []
  const page = (n) => files[`components/${n}.md`]
  const listed = (n, on) => Boolean(page(on)?.includes(`@aziontech/webkit/${n}`))
  for (const [n, e] of Object.entries(catalog.imports)) {
    if (!['component', 'subcomponent', 'root'].includes(e.kind)) continue
    const barrel = /\/index\.(ts|js)$/.test(e.target || '')
    if (hasOwnPage(e)) {
      if (!page(n)) missing.push(`${n} (${e.kind}): no components/${n}.md`)
    } else if (e.kind === 'subcomponent' && barrel) {
      missing.push(`${n}: a compound (${e.target}) classified as a sub-component of ${e.parent}`)
    } else if (e.kind === 'subcomponent' && !listed(n, e.parent)) {
      missing.push(`${n}: not listed on components/${e.parent}.md`)
    } else if (e.kind === 'root' && !listed(n, e.rootOf)) {
      missing.push(`${n}: not listed on components/${e.rootOf}.md`)
    }
  }
  return missing.sort()
}

const PREVIEW_FACT =
  'Stability: preview. The API may still change in a minor release, named in the changelog, until the owner marks it GA.'

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
    ...(e.stability === 'preview' ? { stability: 'preview' } : {}),
    assets: Object.entries(catalog.assets || {})
      .filter(([, meta]) => (meta.usedBy || []).includes(name))
      .map(([kind]) => ({ kind, page: assetPagePath(kind) })),
    examples: catalog.examples(name).map((x) => ({ name: x.name, file: x.file, sfc: x.sfc })),
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
    `Category: ${api.category ?? '—'} · Surface: ${api.surface ?? '—'} · Structure: ${api.structure ?? '—'}`
  ]
  if (api.stability === 'preview') facts.push(PREVIEW_FACT)
  if (full) facts.push(`API as JSON: [${name}.json](${name}.json)`)
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
  const tagRule = full || api.styleSeam ? [allowedClasses(api)] : []
  out.push('## Don\u2019t', '', bullets([...api.avoidWhen, ...tagRule]), '')
  if (api.related.length) {
    const names = new Set(componentNames(catalog))
    const related = api.related.map((r) =>
      r.replace(/^`?([a-z0-9-]+)`?/, (m, n) =>
        names.has(n) ? (full ? `[${n}](${link(path, `components/${n}.md`)})` : `\`${n}\``) : m
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
  out.push(...assetSection(catalog, name, path))
  if (api.subcomponents.length) {
    out.push('## Sub-component imports', '', bullets(api.subcomponents.map((s) => `\`${s}\``)), '')
  }
  for (const heading of SPEC_SECTIONS) {
    if (!spec[heading] || (!full && PAGE_ONLY_SECTIONS.includes(heading))) continue
    const text =
      !full && heading === 'Sub-components' ? firstSentences(spec[heading]) : spec[heading]
    out.push(
      `## ${heading === 'Accessibility (WCAG 2.1 AA)' ? 'Accessibility' : heading}`,
      '',
      demote(text),
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
  const p = catalog.block(id)
  const path = `blocks/${id}.md`
  const names = new Set(componentNames(catalog))
  const out = [`# ${p.name} (\`${id}\`)`, '']
  if (p.summary) {
    const summary = full || !p.guidelines ? p.summary : firstSentence(p.summary)
    out.push(`> ${summary.replace(/\n+/g, ' ')}`, '')
  }
  const facts = [
    `Surface: ${p.surface ?? 'app'}`,
    `Source: \`${p.source}\` in \`@aziontech/webkit\``,
    `MCP: \`get_block("${id}")\``
  ]
  if (p.stability === 'preview') facts.push(PREVIEW_FACT)
  if (p.components?.length) {
    facts.push(
      `Components: ${p.components
        .map((c) => {
          const n = c
            .replace(/^@aziontech\/webkit\//, '')
            .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
            .toLowerCase()
          if (!names.has(n)) return `\`${c}\``
          return full ? `[${binding(n)}](${link(path, `components/${n}.md`)})` : binding(n)
        })
        .join(', ')}`
    )
  }
  if (p.skills?.length) facts.push(`Skills: ${p.skills.map((s) => `\`${s}\``).join(', ')}`)
  out.push(bullets(facts), '')
  if (p.intents?.length) out.push('## Asked as', '', p.intents.join('; '), '')
  if (p.guidelines) {
    const guidelines = withoutTitle(stripComments(p.guidelines))
    out.push(
      full
        ? guidelines
        : sectionAsNames(
            partNames(
              guidelines,
              '## Building blocks',
              `What each part takes: [blocks/${id}.md](blocks/${id}.md).`
            ),
            '## Data',
            `What each prop and event does, and the go-live code: [blocks/${id}.md](blocks/${id}.md).`
          ),
      ''
    )
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
  if (!full) {
    out.push(
      '## Variants',
      '',
      `\`${p.primary}\` (primary)${variants.map((v) => ` · \`${v.name}\``).join('')}. Code: [blocks/${id}.md](blocks/${id}.md), \`get_block("${id}", { variant })\`.`,
      ''
    )
  } else {
    out.push(
      '## Variants',
      '',
      bullets([
        `\`${p.primary}\` — primary (the code below)`,
        ...variants.map((v) => `\`${v.name}\` — ${v.summary || ''}`.trim())
      ]),
      '',
      `Each variant is the same screen in another state: \`get_block("${id}", { variant })\`, or the file under \`blocks/${id}/variants/\`.`,
      '',
      `## Code (\`${p.primary}\`)`,
      '',
      code(p.sfc),
      ''
    )
    for (const [file, text] of Object.entries(p.files || {})) {
      out.push(`## \`${file}\``, '', code(text, 'ts'), '')
    }
  }
  return (
    out
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trimEnd() + '\n'
  )
}

function composableNames(catalog) {
  return Object.keys(catalog.imports)
    .filter((n) => /^use-[a-z0-9-]+$/.test(n) && /\.ts$/.test(catalog.imports[n].target || ''))
    .sort()
}

function camel(name) {
  return name.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())
}

function composableOrder(fn, exports) {
  const pascal = fn.charAt(0).toUpperCase() + fn.slice(1)
  const rank = (e) =>
    e.name === fn
      ? 0
      : e.name === `${pascal}Options`
        ? 1
        : e.name === `${pascal}Return`
          ? 2
          : e.kind === 'function'
            ? 3
            : 4
  return exports
    .map((e, i) => ({ e, i }))
    .sort((a, b) => rank(a.e) - rank(b.e) || a.i - b.i)
    .map(({ e }) => e)
}

function membersTable(members) {
  return table(
    ['Field', 'Type', 'Required', 'Description'],
    members.map((m) => [
      `\`${m.readonly ? 'readonly ' : ''}${m.name}\``,
      `\`${m.type}\``,
      m.required ? 'yes' : 'no',
      m.doc || ''
    ])
  )
}

function composableSection(e) {
  const out = []
  if (e.kind === 'function') {
    out.push(`## \`${e.name}\``, '')
    if (e.doc) out.push(e.doc, '')
    out.push(code(e.signature, 'ts'), '')
  } else if (e.kind === 'interface') {
    out.push(`## \`${e.name}${e.generics}\``, '')
    if (e.doc) out.push(e.doc, '')
    if (e.extends.length) out.push(`Extends ${e.extends.map((x) => `\`${x}\``).join(', ')}.`, '')
    if (e.members.length) out.push(membersTable(e.members), '')
  } else if (e.kind === 'type') {
    out.push(`## \`${e.name}${e.generics}\``, '')
    if (e.doc) out.push(e.doc, '')
    if (e.members?.length) out.push(membersTable(e.members), '')
    else out.push(code(`type ${e.name}${e.generics} = ${e.definition}`, 'ts'), '')
  } else if (e.kind === 'const') {
    out.push(`## \`${e.name}\``, '')
    if (e.doc) out.push(e.doc, '')
    if (e.type) out.push(code(`const ${e.name}: ${e.type}`, 'ts'), '')
  }
  return out
}

function composablePage(catalog, name) {
  const entry = catalog.imports[name]
  const parsed = composableExports(PKG_ROOT, entry.target)
  if (!parsed) return null
  const fn = camel(name)
  const exports = composableOrder(fn, parsed.exports)
  const values = exports
    .filter((e) => e.kind === 'function' || e.kind === 'const')
    .map((e) => e.name)
  const types = exports
    .filter((e) => e.kind === 'interface' || e.kind === 'type')
    .map((e) => e.name)
  const imports = [
    values.length ? `import { ${values.join(', ')} } from '${entry.import}'` : null,
    types.length ? `import type { ${types.join(', ')} } from '${entry.import}'` : null
  ].filter(Boolean)
  const out = [
    `# ${fn}`,
    '',
    `Composable \`${entry.import}\`. The signatures and option tables below are read from its typed source, [\`${parsed.file}\`](${REPO_URL}/packages/webkit/${parsed.file}).`,
    '',
    code(imports.join('\n'), 'ts'),
    ''
  ]
  const head = out.slice()
  for (const e of exports) out.push(...composableSection(e))
  const pascal = fn.charAt(0).toUpperCase() + fn.slice(1)
  const main = new Set([fn, `${pascal}Options`, `${pascal}Return`])
  const rest = exports.filter((e) => !main.has(e.name))
  const compact = head.slice()
  for (const e of exports.filter((x) => main.has(x.name))) compact.push(...composableSection(e))
  if (rest.length)
    compact.push(
      '## Other exports',
      '',
      `${rest.map((e) => `\`${e.name}\``).join(' · ')}. Signatures and fields: [composables/${name}.md](composables/${name}.md).`,
      ''
    )
  const tidy = (lines) =>
    lines
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trimEnd() + '\n'
  return {
    compact: tidy(compact),
    fn,
    summary: `\`${fn}\`${exports.length > 1 ? ` and ${exports.length - 1} more exports (options, return, helpers and types)` : ''}.`,
    md:
      out
        .join('\n')
        .replace(/\n{3,}/g, '\n\n')
        .trimEnd() + '\n'
  }
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

const breakpointText = (steps) =>
  Object.entries(steps || {})
    .map(([bp, v]) => `${bp}: ${typeof v === 'object' ? Object.values(v).join(' ') : v}`)
    .join(', ')

function semanticTable(values, filter) {
  const rows = Object.entries(values || {}).filter(([, v]) => filter(v))
  if (rows.every(([, v]) => v.type === 'color')) {
    return table(
      ['Token', 'Light', 'Dark', 'Purpose'],
      rows.map(([name, v]) => [`\`${name}\``, `\`${v.light}\``, `\`${v.dark}\``, v.purpose])
    )
  }
  return table(
    ['Token', 'Value', 'Breakpoints', 'Purpose'],
    rows.map(([name, v]) => [
      `\`${name}\``,
      typeof v.value === 'object' ? `\`${v.value['font-size'] ?? ''}\`` : `\`${v.value}\``,
      breakpointText(v.breakpoints),
      v.purpose
    ])
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
        groupsTable(t.groups, Object.keys(t.groups).sort()),
        '## Semantic tokens',
        `${Object.keys(t.values || {}).length} semantic tokens with their value and a one-line purpose: pick a token by its purpose, never by its value. \`catalog.json\` holds the same export under \`tokens.values\`, and the MCP tool \`list_tokens\` returns it per group or per token.`,
        '### Colours (light and dark)',
        semanticTable(t.values, (v) => v.type === 'color'),
        '### Spacing, layout, shape and layers',
        semanticTable(t.values, (v) => v.type === 'length' || v.type === 'number')
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
        table(
          ['Class', 'Base size', 'Steps to', 'Purpose'],
          (t.typography || []).map((c) => {
            const v = t.values?.[c]
            return [
              `\`${c}\``,
              v?.value?.['font-size'] ? `\`${v.value['font-size']}\`` : '',
              breakpointText(v?.breakpoints),
              v?.purpose ?? ''
            ]
          })
        ),
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
      slug: 'internationalization',
      title: 'Languages (internationalization)',
      summary:
        'Built-in strings in en, pt-BR and es, the provider, useLocale and locale-aware formatting.',
      body: [
        'WebKit ships every built-in string in three catalogs: `en` (built into the provider), `pt-BR` and `es` (opt-in entries `@aziontech/webkit/locales/pt-BR` and `@aziontech/webkit/locales/es`). Wrap the app in `ConfigProvider` with a `locale` and the catalogs it offers (`:catalogs="{ \'pt-BR\': ptBR, es }"`) and every component follows it; `useLocale()` from `@aziontech/webkit/use-locale` gives your own code the same `t`, `dir` and `Intl` formatters.',
        section(usage, /^## App-level setup/),
        rule('webkit-strings')
      ]
    },
    {
      slug: 'right-to-left',
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
      slug: 'keyboard',
      title: 'Keyboard',
      summary:
        'The console keyboard contract: focus on open, Esc, Enter and Cmd+Enter, Cmd+S, Cmd+K, /, ?, list keys, and no single-key shortcut while typing.',
      body: [rule('webkit-keyboard')],
      compact: [
        section(readRepo('rules/webkit-keyboard.md'), /^## The contract/),
        "Do, Don't, the Vue samples and what enforces each key, in full: `foundations/keyboard.md`."
      ]
    },
    {
      slug: 'site-pages',
      title: 'Site pages (Web Design Guide)',
      summary:
        'The Web Design Guide, SD-01 to SD-25 (SD-07 headline lines, SD-04 action labels): sections, heroes, line budgets and assets of every Azion web page.',
      body: [rule('webkit-site-pages')],
      compact: [
        section(readRepo('rules/webkit-site-pages.md'), /^## Index/),
        section(readRepo('rules/webkit-site-pages.md'), /^## Where the content comes from/),
        'Each rule in full, with Incorrect, Correct, Why and Exceptions: `foundations/site-pages.md`.'
      ]
    },
    {
      slug: 'usage',
      title: 'Using WebKit in an app',
      summary:
        'Start from a block, find a component, import it tree-shakeably, app-level setup and the quality checklist.',
      body: [withoutTitle(usage ?? ''), withoutTitle(section(guidelines, /^## Part B/))]
    }
  ]
  pages.push(...assetPages(catalog))
  const render = (p, body) =>
    [`# ${p.title}`, '', `> ${p.summary}`, '', ...body.filter(Boolean).flatMap((b) => [b, ''])]
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trimEnd() + '\n'
  return pages.map((p) => ({
    ...p,
    md: render(p, p.body),
    ...(p.compact ? { compact: render(p, p.compact) } : {})
  }))
}

function header(catalog) {
  return [
    `# Azion WebKit`,
    '',
    `> The Vue 3 design system of Azion (\`${catalog.package}\` ${catalog.webkitVersion}): components, screen blocks with guidelines, and the design foundations, written for agents that build Azion product, marketing and docs screens.`,
    '',
    'Start every screen from a block (a reviewed, copyable screen), then fill gaps with components. Import each component from its own subpath (`@aziontech/webkit/<name>`), style only through tokens, and keep strings in the locale catalogs. These pages are generated from `catalog.json`; agents with MCP get the same data from `@aziontech/webkit-mcp` (`search_blocks`, `get_block`, `suggest_component`, `get_component`, `list_assets`). The names a component takes for its artwork (illustrations, diagrams, brand marks, icon classes) are listed in the asset foundation pages below; never guess one from a file in `src/`.',
    '',
    `Installed copy: \`node_modules/${catalog.package}/llms/\`. Every component also has a JSON API next to its page (\`components/<name>.json\`).`,
    ''
  ].join('\n')
}

function patterns() {
  const abs = resolve(REPO_ROOT, 'skills/patterns.json')
  return existsSync(abs) ? JSON.parse(readFileSync(abs, 'utf-8')).patterns : []
}

export function buildLlms(catalog = loadCatalog()) {
  const files = {}
  const index = [header(catalog)]
  const fullParts = [
    `${header(catalog)}\n## How this file is cut\n\n${bullets([
      'Each component appears with its first example only, its sub-component notes cut to their first sentence, related names without links, and without its right-to-left, internationalization and responsive notes.',
      'Each block appears with its guidelines, its building blocks as names and its variants as names; the code is on the block page.',
      `Classes on a component tag: ${allowedClasses({})} A component marked style seam says so on its own entry.`,
      'Every page under `llms/` is complete: open it (the path is in the comment above each entry) for every example, part and variant.'
    ])}\n`
  ]
  const siteParts = [
    `${header(catalog)}\n## How this file is cut\n\n${bullets([
      'This file holds the components of the marketing and documentation sites (surface `site` and `docs`), cut like `llms-full.txt`: first example only, sub-component notes cut to their first sentence, related names without links, no right-to-left, internationalization and responsive notes.',
      'Foundations, blocks and the product (`app`) components are in `llms-full.txt`.',
      `Classes on a component tag: ${allowedClasses({})} A component marked style seam says so on its own entry.`
    ])}\n`
  ]

  const found = foundations(catalog)
  const slugs = new Set(found.map((f) => f.slug))
  const ruleLinks = (md) =>
    md?.replace(/\]\(\.\/webkit-([a-z0-9-]+)\.md(#[^)\s]*)?\)/g, (m, name, hash = '') =>
      slugs.has(name) ? `](./${name}.md${hash})` : `](${REPO_URL}/rules/webkit-${name}.md${hash})`
    )
  for (const f of found) {
    f.md = ruleLinks(f.md)
    if (f.compact) f.compact = ruleLinks(f.compact)
  }
  index.push('## Foundations', '')
  for (const f of found) {
    files[`foundations/${f.slug}.md`] = f.md
    index.push(`- [${f.title}](foundations/${f.slug}.md): ${f.summary}`)
    fullParts.push(`<!-- foundations/${f.slug}.md -->\n\n${namesOnly(f.compact ?? f.md)}`)
  }
  index.push('')

  const patternPages = patterns()
  if (patternPages.length) {
    index.push(
      '## Patterns',
      '',
      'How to build each kind of screen or problem. Read the pattern for the job before composing a screen, then start from its block.',
      ''
    )
    for (const page of patternPages)
      index.push(`- [${page.title}](../skills/${page.skill}/SKILL.md): ${page.summary}`)
    index.push('')
  }

  const ids = Object.keys(catalog.blocks).sort()
  const blockGroups = {}
  for (const id of ids) (blockGroups[id.split('/')[0]] ||= []).push(id)
  for (const [group, list] of Object.entries(blockGroups)) {
    index.push(`## Blocks: ${titleOf(group)}`, '')
    for (const id of list) {
      const p = catalog.block(id)
      files[`blocks/${id}.md`] = blockPage(catalog, id)
      index.push(
        `- [${p.name} (${id})](blocks/${id}.md): ${p.stability === 'preview' ? 'Preview. ' : ''}${firstSentence(p.guidelinesSummary || p.summary)}`
      )
      fullParts.push(
        `<!-- blocks/${id}.md -->\n\n${namesOnly(blockPage(catalog, id, { full: false }))}`
      )
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
      files[`components/${n}.json`] = apiJson(componentApi(catalog, n), new Set(names))
      index.push(
        `- [${binding(n)}](components/${n}.md): ${catalog.imports[n].stability === 'preview' ? 'Preview. ' : ''}${firstSentence(catalog.imports[n].purpose)}`
      )
      const surface = catalog.imports[n].surface ?? 'app'
      ;(surface === 'app' ? fullParts : siteParts).push(
        `<!-- components/${n}.md -->\n\n${namesOnly(componentPage(catalog, n, { full: false }))}`
      )
    }
    index.push('')
  }

  const composables = composableNames(catalog)
    .map((n) => [n, composablePage(catalog, n)])
    .filter(([, page]) => page)
  if (composables.length) {
    index.push('## Composables', '')
    for (const [n, page] of composables) {
      files[`composables/${n}.md`] = page.md
      index.push(`- [${page.fn}](composables/${n}.md): ${page.summary}`)
      fullParts.push(`<!-- composables/${n}.md -->\n\n${page.compact}`)
    }
    index.push('')
  }

  index.push(
    '## Optional',
    '',
    '- [llms-full.txt](llms-full.txt): every foundation, block and product (`app`) component page in one file: block guidelines with their parts and variants as names and without their code, and the first example of each component (the pages above hold the code, every example and every detail).',
    '- [llms-full-site.txt](llms-full-site.txt): the same cut for the marketing and documentation site components (surface `site` and `docs`).',
    '- [catalog.json](../catalog.json): the machine catalog the pages are generated from (exports, props, tokens, blocks).',
    ''
  )
  files['llms.txt'] =
    index
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trimEnd() + '\n'
  const joinParts = (parts) =>
    compactTables(parts.join('\n\n---\n\n'))
      .replace(/\n{3,}/g, '\n\n')
      .trimEnd() + '\n'
  files['llms-full.txt'] = joinParts(fullParts)
  files['llms-full-site.txt'] = joinParts(siteParts)
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
  for (const [file, budget] of Object.entries(FULL_BUDGETS)) {
    const bytes = Buffer.byteLength(files[file] ?? '')
    if (bytes > budget) drift.push(`${file} is ${bytes} bytes, over the ${budget} budget`)
  }
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
  return `llms/ written: llms.txt (${kb('llms.txt')} KB), llms-full.txt (${kb('llms-full.txt')} KB), llms-full-site.txt (${kb('llms-full-site.txt')} KB), ${count(/^components\/.*\.md$/)} component pages + ${count(/\.json$/)} JSON, ${count(/^blocks\//)} block pages, ${count(/^foundations\//)} foundation pages, ${count(/^composables\//)} composable pages`
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const files = buildLlms()
  if (process.argv.includes('--check')) {
    const drift = checkLlms(files)
    if (drift.length) {
      process.stderr.write(
        `✖ llms/ out of sync (${drift.length}):\n  ${drift.slice(0, 20).join('\n  ')}\nRun: node scripts/build-llms.mjs (or build:catalog)\n`
      )
      process.exit(1)
    }
    process.stdout.write(`✓ llms/ in sync (${Object.keys(files).length} files)\n`)
    process.exit(0)
  }
  writeLlms(files)
  process.stdout.write(`${summary(files)}\n`)
}
