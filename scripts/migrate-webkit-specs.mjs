#!/usr/bin/env node
/**
 * Generate `.specs/<name>.md` from existing webkit components and approve them.
 * Run: node scripts/migrate-webkit-specs.mjs [--dry-run]
 */

import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'
import {
  bodyChecksum,
  constraintsBlockHasCanonicalBullets,
  parseVueSfc,
  validateFrontmatter
} from '../.claude/hooks/_lib/spec.mjs'

const ROOT = resolve(import.meta.dirname, '..')
const WEBKIT = join(ROOT, 'packages/webkit/src/components')
const SPECS = join(ROOT, '.specs')
const TEMPLATE_CONSTRAINTS = readFileSync(join(SPECS, '_template.md'), 'utf-8')
  .split('## Constraints — DO NOT')[1]
  .trim()

const TODAY = '2026-05-22'
const DRY_RUN = process.argv.includes('--dry-run')

const PURPOSE = {
  actions: 'Interactive control for user actions.',
  content: 'Displays content or metadata in the UI.',
  feedback: 'Communicates status, alerts, or progress to the user.',
  inputs: 'Collects or edits user input.',
  layout: 'Structural layout primitive for scrolling or regions.',
  navigation: 'Helps users move between views or sections.',
  overlay: 'Layered surface above the page (modal, drawer, menu).',
  templates: 'Composed template block for a product flow.',
  utils: 'Shared visual utility used by other components.',
  data: 'Presents structured data.'
}

function resolveRootVue(componentDir, name) {
  const candidates = [
    join(componentDir, `${name}.vue`),
    join(componentDir, `${name}-root.vue`)
  ]
  for (const p of candidates) {
    if (existsSync(p)) return p
  }
  const vueFiles = readdirSync(componentDir).filter((f) => f.endsWith('.vue'))
  const rootish = vueFiles.find((f) => f.includes('root'))
  if (rootish) return join(componentDir, rootish)
  return vueFiles.length === 1 ? join(componentDir, vueFiles[0]) : null
}

function listComponents() {
  const out = []
  for (const category of readdirSync(WEBKIT)) {
    const catPath = join(WEBKIT, category)
    if (!statSync(catPath).isDirectory()) continue
    for (const name of readdirSync(catPath)) {
      const componentDir = join(catPath, name)
      if (!statSync(componentDir).isDirectory()) continue
      if (!resolveRootVue(componentDir, name)) continue
      out.push({ category, name })
    }
  }
  return out.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))
}

function readFigmaMeta(componentDir, name) {
  const figmaPath = join(componentDir, `${name}.figma.ts`)
  if (!existsSync(figmaPath)) return null
  const text = readFileSync(figmaPath, 'utf-8')
  const urlMatch = text.match(/https:\/\/www\.figma\.com\/design\/[^'\s]+/)
  if (!urlMatch) return null
  const url = urlMatch[0]
  const nodeMatch = url.match(/node-id=([0-9]+)-([0-9]+)/)
  const node_id = nodeMatch ? `${nodeMatch[1]}:${nodeMatch[2]}` : undefined
  return { url: node_id ? url : url.split('?')[0], node_id }
}

function extractScript(vueText) {
  const m = vueText.match(/<script[^>]*>([\s\S]*?)<\/script>/)
  return m ? m[1] : ''
}

function extractRuntimeProps(script) {
  const m = script.match(/defineProps\s*\(\s*\{([\s\S]*?)\}\s*\)/)
  if (!m) return []
  const block = m[1]
  const out = []
  const re = /(\w+):\s*\{([\s\S]*?)\n\s*\}/g
  let match
  while ((match = re.exec(block)) !== null) {
    const name = match[1]
    const def = match[2]
    const typeRaw = def.match(/type:\s*(\w+)/)?.[1] ?? 'String'
    const typeMap = { String: 'string', Boolean: 'boolean', Number: 'number', Object: 'object', Array: 'unknown[]' }
    let type = typeMap[typeRaw] ?? 'string'
    const validatorOpts = def.match(/\[([^\]]+)\]\.includes/)?.[1]
    if (validatorOpts) {
      const opts = validatorOpts.split(',').map((s) => s.trim().replace(/['"]/g, ''))
      type = opts.map((o) => `'${o}'`).join(' | ')
    }
    const defaultMatch = def.match(/default:\s*([^,\n}]+)/)
    const hasDefault = def.includes('default:')
    let defaultVal = '—'
    if (hasDefault && defaultMatch) {
      const raw = defaultMatch[1].trim()
      if (raw === "''" || raw === '""') defaultVal = "''"
      else if (raw === 'false' || raw === 'true') defaultVal = raw
      else if (/^['"]/.test(raw)) defaultVal = raw.replace(/['"]/g, "'")
      else if (/^\d/.test(raw)) defaultVal = raw
      else defaultVal = `'${raw}'`
    }
    out.push({
      name,
      type,
      default: defaultVal,
      required: hasDefault ? 'no' : 'yes',
      jsdoc: humanizeProp(name)
    })
  }
  return out
}

function extractArrayEmits(script) {
  const m = script.match(/defineEmits\s*\(\s*\[([^\]]*)\]\s*\)/)
  if (!m) return []
  return m[1]
    .split(',')
    .map((s) => s.trim().replace(/['"]/g, ''))
    .filter(Boolean)
    .map((name) => ({ name, payload: name === 'click' ? 'MouseEvent' : 'unknown' }))
}

function extractTemplateSlots(vueText) {
  const names = new Set()
  for (const m of vueText.matchAll(/<slot\s+name=["']([^"']+)["']/g)) names.add(m[1])
  for (const m of vueText.matchAll(/\$slots\[['"]([^'"]+)['"]\]/g)) names.add(m[1])
  for (const m of vueText.matchAll(/\$slots\.(\w+)/g)) {
    if (!['default'].includes(m[1])) names.add(m[1])
  }
  return [...names].map((name) => ({ name, scope: '—', notes: name === 'default' ? 'Main content.' : 'Named slot.' }))
}

function humanizeProp(name) {
  const map = {
    kind: 'Visual variant.',
    size: 'Size token; affects height, padding, and typography.',
    disabled: 'Disables interaction and applies disabled tokens.',
    loading: 'Shows loading state and disables activation.',
    open: 'Controlled open state. Use with `v-model:open`.',
    defaultOpen: 'Initial open state when uncontrolled.',
    closeable: 'When true, overlay click and Escape close the surface.',
    label: 'Visible label text.',
    href: 'When set, renders as a link (`<a>`).',
    target: 'Link target when `href` is set.',
    icon: 'PrimeIcons class for the leading/trailing icon.',
    ariaLabel: 'Accessible name for icon-only controls.'
  }
  return map[name] ?? `${name.replace(/([A-Z])/g, ' $1').trim()}.`
}

function mergeProps(rootVue) {
  const script = extractScript(rootVue)
  const ts = parseVueSfc(rootVue)
  const runtime = extractRuntimeProps(script)
  if (runtime.length) return runtime
  return ts.props.map((p) => ({
    name: p.name,
    type: p.type.replace(/\s*\|\s*undefined/g, '').trim() || 'string',
    default: p.optional ? 'undefined' : '—',
    required: p.optional ? 'no' : 'yes',
    jsdoc: p.jsdoc || humanizeProp(p.name)
  }))
}

function mergeEmits(rootVue) {
  const script = extractScript(rootVue)
  const ts = parseVueSfc(rootVue)
  const array = extractArrayEmits(script)
  if (array.length) return array
  return ts.emits.map((e) => ({
    name: e.name,
    payload: e.payload || 'void',
    notes: e.name.startsWith('update:') ? `v-model:${e.name.slice(7)}.` : '—'
  }))
}

function mergeSlots(rootVue) {
  const ts = parseVueSfc(rootVue)
  const fromScript = ts.slots.map((s) => ({ name: s.name, scope: '—', notes: '—' }))
  const fromTemplate = extractTemplateSlots(rootVue)
  const map = new Map()
  for (const s of [...fromScript, ...fromTemplate]) map.set(s.name, s)
  if (!map.has('default') && rootVue.includes('<slot')) {
    map.set('default', { name: 'default', scope: '—', notes: 'Main content.' })
  }
  return [...map.values()]
}

function listSubComponents(componentDir, rootFile) {
  return readdirSync(componentDir)
    .filter((f) => f.endsWith('.vue') && f !== rootFile)
    .map((f) => {
      const base = f.replace(/\.vue$/, '')
      return { file: f, desc: `Public sub-component \`${base}\`.` }
    })
}

function inferStructure(componentDir, rootFile) {
  const subs = listSubComponents(componentDir, rootFile)
  return subs.length > 0 ? 'composition' : 'monolithic'
}

function extractAnimations(vueFiles) {
  const joined = vueFiles.join('\n')
  const anims = new Set()
  for (const m of joined.matchAll(/\banimate-[a-z0-9-]+\b/g)) anims.add(m[0])
  const hasTransition = /\btransition-/.test(joined)
  if (anims.size === 0 && !hasTransition) return '_none_'
  const rows = []
  for (const a of anims) {
    rows.push(
      `| open/close | \`${a}\` | semantic | \`motion-reduce:animate-none\` |`
    )
  }
  if (hasTransition) {
    rows.push(
      '| state change | `transition-colors duration-150 ease-out` | inline | `motion-reduce:transition-none` |'
    )
  }
  return rows.length ? rows.join('\n') : '_none_'
}

function buildStories(props) {
  const lines = ['- Default']
  const kind = props.find((p) => p.name === 'kind')
  const size = props.find((p) => p.name === 'size')
  const disabled = props.find((p) => p.name === 'disabled')
  if (kind?.type.includes('|')) {
    for (const k of kind.type.split('|').map((s) => s.trim().replace(/'/g, ''))) {
      if (k && k !== '—') lines.push(`- ${titleCase(k)} (kind)`)
    }
  }
  if (size?.type.includes('|')) {
    for (const s of size.type.split('|').map((x) => x.trim().replace(/'/g, ''))) {
      if (s && s !== '—') lines.push(`- ${titleCase(s)} (size)`)
    }
  }
  if (disabled) lines.push('- Disabled')
  return lines.join('\n')
}

function titleCase(s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function propsTable(props) {
  if (!props.length) {
    return '| _none_ | — | — | — | Public API is slots-only. |'
  }
  const header =
    '| Prop | Type | Default | Required | JSDoc |\n|---|---|---|---|---|'
  const rows = props.map(
    (p) =>
      `| \`${p.name}\` | \`${p.type}\` | \`${p.default}\` | ${p.required} | ${p.jsdoc} |`
  )
  return [header, ...rows].join('\n')
}

function eventsTable(events) {
  if (!events.length) return '| _none_ | — | — |'
  const header = '| Event | Payload | Notes |\n|---|---|---|'
  const rows = events.map((e) => `| \`${e.name}\` | \`${e.payload}\` | ${e.notes ?? '—'} |`)
  return [header, ...rows].join('\n')
}

function slotsTable(slots) {
  if (!slots.length) return '| _none_ | — | — |'
  const header = '| Slot | Scope | Notes |\n|---|---|---|'
  const rows = slots.map((s) => `| \`${s.name}\` | ${s.scope} | ${s.notes} |`)
  return [header, ...rows].join('\n')
}

function defaultTokens(category) {
  const typo =
    category === 'actions'
      ? '.text-button-lg'
      : category === 'inputs'
        ? '.text-body-sm'
        : '.text-body-sm'
  return `| typography | ${typo} |
| surface | \`var(--bg-surface)\` |
| text | \`var(--text-default)\` |
| spacing | \`var(--spacing-3)\` |
| shape | \`var(--shape-elements)\` |
| ring | \`var(--ring-color)\` |`
}

function buildBody({ title, category, structure, componentDir, name, rootFile, rootVue, allVue }) {
  const props = mergeProps(rootVue)
  const events = mergeEmits(rootVue)
  const slots = mergeSlots(rootVue)
  const subs = listSubComponents(componentDir, rootFile)
  const motion = extractAnimations(allVue)

  let subSection = ''
  if (structure === 'composition' && subs.length) {
    subSection = `## Sub-components\n\n${subs.map((s) => `- \`${s.file}\` — ${s.desc}`).join('\n')}\n\n`
  }

  const states = [
    '- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`',
    structure === 'composition' ? '- `data-state` values: `open` | `closed` (where applicable)' : '',
    props.some((p) => p.name === 'disabled') ? '- `data-disabled` mirrors the `disabled` prop' : ''
  ]
    .filter(Boolean)
    .join('\n')

  const motionSection =
    motion === '_none_'
      ? '_none_'
      : `| Trigger | Animation / Transition | Token | Reduced-motion fallback |\n|---|---|---|---|\n${motion}`

  return `# ${title} — Component Spec

## Purpose

${PURPOSE[category] ?? 'Webkit component.'} Migrated from the existing implementation at \`packages/webkit/src/components/${category}/${name}/\`.

${subSection}## Props

${propsTable(props)}

## Events

${eventsTable(events)}

## Slots

${slotsTable(slots)}

## States

${states}

## Motion & Animations

${motionSection}

## Tokens

| Region | Token (Design.md) |
|---|---|
${defaultTokens(category)}

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: \`focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]\`
- Keyboard map: \`Tab\` focuses; \`Enter\`/\`Space\` activates; \`Escape\` closes overlays where applicable.
- ARIA: root uses appropriate roles (\`button\`, \`dialog\`, \`status\`, etc.) per sub-component.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- \`motion-reduce:transition-none motion-reduce:transform-none\` on animated states.
- Touch target ≥40×40 px where the control is interactive.

## Stories (Storybook)

${buildStories(props)}

## Constraints — DO NOT

${TEMPLATE_CONSTRAINTS}
`
}

function buildFrontmatter(fm) {
  const lines = [
    '---',
    `name: ${fm.name}`,
    `category: ${fm.category}`,
    `structure: ${fm.structure}`,
    `status: ${fm.status}`,
    'spec_version: 1',
  ]
  if (fm.figma?.url) {
    lines.push('figma:')
    lines.push(`  url: ${fm.figma.url}`)
    if (fm.figma.node_id) lines.push(`  node_id: ${fm.figma.node_id}`)
  }
  if (fm.checksum) lines.push(`checksum: ${fm.checksum}`)
  lines.push(`created: ${fm.created ?? TODAY}`)
  lines.push(`last_updated: ${fm.last_updated ?? TODAY}`)
  lines.push('---')
  lines.push('')
  return lines.join('\n')
}

function validateSpec(name, body, fm) {
  const failures = []
  failures.push(...validateFrontmatter(fm))
  const constraints = constraintsBlockHasCanonicalBullets(body)
  if (!constraints.ok) failures.push(`Constraints missing: ${constraints.missing.join(', ')}`)
  if (!getSection(body, 'Props')) failures.push('Props section missing')
  if (!getSection(body, 'Events')) failures.push('Events section missing')
  return failures
}

function getSection(body, heading) {
  const re = new RegExp(`^## ${heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'm')
  return re.test(body)
}

function titleFromName(name) {
  return name
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function main() {
  const components = listComponents()
  const results = []

  for (const { category, name } of components) {
    const componentDir = join(WEBKIT, category, name)
    const rootPath = resolveRootVue(componentDir, name)
    if (!rootPath) {
      results.push({ name, ok: false, error: `missing root .vue in ${componentDir}` })
      continue
    }
    const rootFile = basename(rootPath)
    const rootVue = readFileSync(rootPath, 'utf-8')
    const allVue = readdirSync(componentDir)
      .filter((f) => f.endsWith('.vue'))
      .map((f) => readFileSync(join(componentDir, f), 'utf-8'))
    const structure = inferStructure(componentDir, rootFile)
    const figma = readFigmaMeta(componentDir, name)
    const body = buildBody({
      title: titleFromName(name),
      category,
      structure,
      componentDir,
      name,
      rootFile,
      rootVue,
      allVue
    })
    const fm = {
      name,
      category,
      structure,
      status: 'draft',
      spec_version: 1,
      created: TODAY,
      last_updated: TODAY,
      ...(figma ? { figma } : {})
    }
    const failures = validateSpec(name, body, fm)
    if (failures.length) {
      results.push({ name, ok: false, error: failures.join('; ') })
      continue
    }
    const checksum = bodyChecksum(body)
    fm.status = 'approved'
    fm.checksum = checksum
    const full = buildFrontmatter(fm) + body
    const outPath = join(SPECS, `${name}.md`)
    if (!DRY_RUN) writeFileSync(outPath, full, 'utf-8')
    results.push({ name, ok: true, path: outPath, checksum: checksum.slice(0, 8) })
  }

  if (!DRY_RUN) {
    writeFileSync(join(ROOT, '.claude/hooks/_lib/legacy-components.json'), '[]\n', 'utf-8')
  }

  console.log(JSON.stringify({ dryRun: DRY_RUN, results }, null, 2))
  const failed = results.filter((r) => !r.ok)
  process.exit(failed.length ? 1 : 0)
}

main()
