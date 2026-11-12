import { importsOf } from './patterns.mjs'

export const GUIDELINE_FILE = 'guidelines.md'

export const GUIDELINE_SECTIONS = [
  'When to use',
  'When not to use',
  'Building blocks',
  'Do',
  "Don't",
  'Copy',
  'Accessibility',
  'States',
  'Related'
]

const BUILDING_BLOCK = /^###\s+([A-Z])\.\s+(.+?)\s+[—–-]\s+(.+)$/

export function parseGuidelines(md) {
  const lines = String(md || '')
    .replace(/\r\n/g, '\n')
    .split('\n')
  const titleLine = lines.find((l) => /^#\s+\S/.test(l))
  const title = titleLine ? titleLine.replace(/^#\s+/, '').trim() : ''
  const sections = {}
  const purpose = []
  let current = null
  let seenTitle = false
  for (const line of lines) {
    if (/^#\s+\S/.test(line) && !seenTitle) {
      seenTitle = true
      continue
    }
    const h2 = line.match(/^##\s+(.+?)\s*$/)
    if (h2) {
      current = h2[1]
      sections[current] = []
      continue
    }
    if (current) sections[current].push(line)
    else if (seenTitle) purpose.push(line)
  }
  const text = Object.fromEntries(
    Object.entries(sections).map(([name, body]) => [name, body.join('\n').trim()])
  )
  const buildingBlocks = (sections['Building blocks'] || [])
    .map((l) => l.match(BUILDING_BLOCK))
    .filter(Boolean)
    .map((m) => ({
      letter: m[1],
      title: m[2].trim(),
      components: [...m[3].matchAll(/`([A-Z][\w$.]*)`/g)].map((c) => c[1].split('.')[0])
    }))
  const states = (sections.States || [])
    .map((l) => l.match(/^\s*[-*]\s+(?:\*\*|`)?([A-Za-z][\w-]*)(?:\*\*|`)?\s*:/))
    .filter(Boolean)
    .map((m) => m[1])
  return {
    title,
    purpose: purpose.join('\n').trim().replace(/\s+/g, ' '),
    sections: text,
    buildingBlocks,
    states
  }
}

export function guidelinesSummary(md) {
  return parseGuidelines(md).purpose
}

function namedWebkitImports(sfc) {
  const names = []
  const re = /import\s+(type\s+)?[^'"]*?\{([^}]*)\}\s*from\s+['"]@aziontech\/webkit\/[^'"]+['"]/g
  for (const m of String(sfc).matchAll(re)) {
    if (m[1]) continue
    for (const part of m[2].split(',')) {
      const spec = part.trim()
      if (/^type\s/.test(spec)) continue
      const local = spec
        .split(/\s+as\s+/)
        .pop()
        .trim()
      if (/^[A-Z][a-z]/.test(local)) names.push(local)
    }
  }
  return names
}

export function primaryComponents(sfc) {
  return [
    ...new Set([
      ...importsOf(sfc)
        .map((i) => i.binding)
        .filter((b) => b && /^[A-Z]/.test(b)),
      ...namedWebkitImports(sfc)
    ])
  ]
}

export function checkGuidelines(id, pattern) {
  const errors = []
  const file = `blocks/${id}/${GUIDELINE_FILE}`
  if (!pattern.guidelines) return [`${id}: no ${file}`]
  const g = parseGuidelines(pattern.guidelines)
  if (!g.title) errors.push(`${file}: the "# <Block name>" title is missing`)
  if (!g.purpose) errors.push(`${file}: the purpose paragraph under the title is empty`)
  for (const name of GUIDELINE_SECTIONS) {
    if (!(name in g.sections)) errors.push(`${file}: section "## ${name}" is missing`)
    else if (!g.sections[name]) errors.push(`${file}: section "## ${name}" is empty`)
  }
  const imported = primaryComponents(pattern.sfc)
  const importedSet = new Set(imported)
  const named = new Set()
  g.buildingBlocks.forEach((b, i) => {
    const expected = String.fromCharCode(65 + i)
    if (b.letter !== expected)
      errors.push(
        `${file}: building block "${b.letter}. ${b.title}" should be lettered ${expected}`
      )
    if (!b.components.length && imported.length)
      errors.push(`${file}: building block "${b.letter}. ${b.title}" names no \`Component\``)
    for (const c of b.components) {
      named.add(c)
      if (!importedSet.has(c))
        errors.push(
          `${file}: building block "${b.letter}. ${b.title}" names \`${c}\`, which ${pattern.source} does not import`
        )
    }
  })
  if ('Building blocks' in g.sections && g.sections['Building blocks'] && !g.buildingBlocks.length)
    errors.push(`${file}: "## Building blocks" has no "### A. <Element> — \`Component\`" heading`)
  const missing = imported.filter((c) => !named.has(c))
  if (missing.length && g.buildingBlocks.length)
    errors.push(
      `${file}: no building block names ${missing.map((c) => `\`${c}\``).join(', ')}, imported by ${pattern.source}`
    )
  const states = new Set(g.states)
  for (const v of [pattern.primary, ...(pattern.variants || []).map((x) => x.name)]) {
    if (v && !states.has(v)) errors.push(`${file}: "## States" has no line for variant "${v}"`)
  }
  return errors
}

const TOAST_SOURCE = /^@aziontech\/webkit\/toast(?:-root)?$/
const APP_ROOT_BLOCKS = /^shells\//

function toastRegionNames(sfc) {
  const names = new Set(['Toaster'])
  for (const m of String(sfc).matchAll(/^\s*import\s+([\s\S]*?)\s+from\s+['"]([^'"]+)['"]/gm)) {
    if (!TOAST_SOURCE.test(m[2])) continue
    const clause = m[1].trim()
    if (/^type\s/.test(clause)) continue
    const def = clause.match(/^([A-Za-z_$][\w$]*)/)
    if (def) names.add(def[1])
    const named = clause.match(/\{([^}]*)\}/)
    for (const part of named ? named[1].split(',') : []) {
      const [imported, local = imported] = part
        .trim()
        .split(/\s+as\s+/)
        .map((s) => s.trim())
      if (imported === 'Toaster') names.add(local)
    }
  }
  return [...names]
}

export function rendersToastRegion(sfc) {
  const template = String(sfc).replace(/<script\b[\s\S]*?<\/script>/g, '')
  const tags = toastRegionNames(sfc).map((n) => n.replace(/\$/g, '\\$'))
  const re = new RegExp(`<(?:(?:${tags.join('|')})(?:\\.Toaster)?|toaster)(?=[\\s/>])`)
  return re.test(template)
}

export function checkToastRegion(id, pattern) {
  if (APP_ROOT_BLOCKS.test(id)) return []
  const sfcs = [
    { name: pattern.primary, sfc: pattern.sfc },
    ...(pattern.variants || []).map((v) => ({ name: v.name, sfc: v.sfc }))
  ]
  return sfcs
    .filter((v) => rendersToastRegion(v.sfc))
    .map(
      (v) =>
        `blocks/${id} (${v.name}): renders a \`Toaster\` in a page body. Only the first Toaster to mount is active and it gives the role up when it unmounts, so a page's copy is inert or silences every toast once the user leaves. Call \`toast\` only; the app mounts the one region (ToastPlugin, or one Toaster at its root, as blocks/shells/console does).`
    )
}
