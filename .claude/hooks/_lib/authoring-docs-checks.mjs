// Canonical engine for the skill/agent doc standards (.claude/rules/authoring-docs.md).
// Imported by BOTH the write-time hook (validate-authoring-docs.mjs) and the CI ratchet
// (packages/webkit/scripts/check-authoring-docs.mjs) — one definition, two surfaces.
// No external deps: reuses parseYamlFrontmatter from ./spec.mjs.

import { parseYamlFrontmatter } from './spec.mjs'

const LOC = {
  skillInternal: /^\.claude\/skills\/([a-z][a-z0-9-]*)\/SKILL\.md$/,
  agentInternal: /^\.claude\/agents\/([a-z][a-z0-9-]*)\.md$/,
  skillConsumer: /^packages\/webkit\/cli-templates\/claude\/skills\/([a-z][a-z0-9-]*)\/SKILL\.md$/,
  agentConsumer: /^packages\/webkit\/cli-templates\/claude\/agents\/([a-z][a-z0-9-]*)\.md$/
}

// rel is POSIX-normalized. Returns null for anything that is not a governed doc
// (_README.md fails the [a-z]-first regex; reference .md files inside a skill folder
// are not SKILL.md; rules are governed elsewhere by standards.mjs).
export function docFileKind(rel) {
  let m
  if ((m = LOC.skillInternal.exec(rel)))
    return { kind: 'skill', variant: 'internal', scope: 'webkit', unit: m[1] }
  if ((m = LOC.agentInternal.exec(rel)))
    return { kind: 'agent', variant: 'internal', scope: 'webkit', unit: m[1] }
  if ((m = LOC.skillConsumer.exec(rel)))
    return { kind: 'skill', variant: 'consumer', scope: 'general', unit: m[1] }
  if ((m = LOC.agentConsumer.exec(rel)))
    return { kind: 'agent', variant: 'consumer', scope: 'general', unit: m[1] }
  return null
}

// --- file-as-example patterns (the four the task named) ---
const FAE_COMPONENT_SRC_PATH =
  /packages\/webkit\/src\/components\/[a-z][a-z0-9-]*\/[a-z][a-z0-9-]*\/[a-z][a-z0-9-]*\.(?:vue|ts)\b/g
const FAE_EXEMPLAR =
  /\b(?:canonicals?|exemplar|shape reference|for reference|Monolithic|Atomic|used in)\b[^\n]{0,60}?`?\b[a-z][a-z0-9-]+\.(?:vue|ts)`?/g
const FAE_SRC_ESCAPE = /(?:\.\.\/){2,}(?:packages\/webkit\/)?src\/components\//g
const FAE_EXPORTS_LOOKUP =
  /\b(?:look\s*up|find|locate|search(?:\s+for)?|read|consult|browse)\b[^\n]{0,50}?package\.json#exports/gi

export const MESSAGES = {
  'frontmatter-missing': 'no YAML frontmatter block (--- … ---).',
  'name-mismatch':
    'frontmatter `name` must equal the folder name (skills) / filename without .md (agents).',
  'description-empty': 'frontmatter `description` is missing or blank.',
  'scope-missing': 'frontmatter is missing the required `scope:` field (general|webkit).',
  'scope-invalid': 'frontmatter `scope` must be exactly "general" or "webkit".',
  'scope-mismatch':
    'frontmatter `scope` disagrees with the file location (cli-templates ⇒ general; .claude ⇒ webkit).',
  'consumer-skill-prefix': 'a consumer skill `name` must start with "webkit-".',
  'consumer-skill-status': 'a consumer skill must declare `status:`.',
  'consumer-skill-last-updated': 'a consumer skill must declare `last_updated:`.',
  'enforced-by-missing':
    'a skill must declare a non-empty `enforced_by:` flow array — every skill maps to ≥1 enforcer (a rule id, `ui-verify`, or `review`) so nothing is merely advisory.',
  'component-src-path':
    'file-as-example: hardcoded component source path — find components via the webkit MCP/catalog, not a src/ path.',
  'file-as-exemplar':
    'file-as-example: names a component .vue/.ts as an exemplar — reference the catalog (MCP get_component), not a movable filename.',
  'src-escape':
    'file-as-example: a ../ climb into src/components — components are found via the MCP/catalog.',
  'exports-as-lookup':
    'file-as-example: package.json#exports used as a component lookup — use the MCP/catalog.'
}

function splitFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!m) return { fm: null, fmText: '' }
  return { fm: parseYamlFrontmatter(m[1]), fmText: m[1] }
}

// `enforced_by` is a YAML flow array (`enforced_by: [a, b, c]`). The shared frontmatter
// parser doesn't handle arrays, so extract it from the raw frontmatter text. Exported so the
// invariant test resolves each entry against the skill's rule population without re-parsing.
export function parseEnforcedBy(fmText) {
  if (!fmText) return []
  const m = fmText.match(/^enforced_by:[ \t]*\[([^\]]*)\][ \t]*$/m)
  if (!m) return []
  return m[1]
    .split(',')
    .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean)
}

// parseYamlFrontmatter represents an empty-valued key (`description:`) as {} (it treats a
// blank value as the start of a nested object). Treat an empty object as an empty string so
// `description-empty` / `scope-missing` fire correctly for a present-but-blank key.
const str = (v) => {
  if (v == null) return ''
  if (typeof v === 'string') return v.trim()
  if (typeof v === 'object') return Object.keys(v).length ? String(v) : ''
  return String(v).trim()
}

/** Returns [{ id, message }] for the governed doc at rel, or [] if rel is not governed. */
export function scanDoc(rel, content) {
  const info = docFileKind(rel)
  if (!info) return []
  const out = []
  const push = (id) => out.push({ id, message: MESSAGES[id] })

  const { fm, fmText } = splitFrontmatter(content)
  if (!fm) {
    push('frontmatter-missing')
  } else {
    if (str(fm.name) !== info.unit) push('name-mismatch')
    if (!str(fm.description)) push('description-empty')
    const scope = str(fm.scope)
    if (!scope) push('scope-missing')
    else if (scope !== 'general' && scope !== 'webkit') push('scope-invalid')
    else if (scope !== info.scope) push('scope-mismatch')

    // Every skill (internal + consumer) declares what enforces it — a rule id, `ui-verify`,
    // or `review` — so no skill is merely advisory. Presence is checked here (write-time +
    // CI ratchet); resolution of each entry is checked by the standards invariant test.
    if (info.kind === 'skill' && parseEnforcedBy(fmText).length === 0) push('enforced-by-missing')

    if (info.kind === 'skill' && info.variant === 'consumer') {
      if (!str(fm.name).startsWith('webkit-')) push('consumer-skill-prefix')
      if (!str(fm.status)) push('consumer-skill-status')
      if (!str(fm.last_updated)) push('consumer-skill-last-updated')
    }
  }

  // file-as-example — skills only (agents are prose role docs, no component refs expected)
  if (info.kind === 'skill') {
    for (const _m of content.matchAll(FAE_COMPONENT_SRC_PATH)) push('component-src-path')
    for (const _m of content.matchAll(FAE_EXEMPLAR)) push('file-as-exemplar')
    for (const _m of content.matchAll(FAE_SRC_ESCAPE)) push('src-escape')
    for (const _m of content.matchAll(FAE_EXPORTS_LOOKUP)) push('exports-as-lookup')
  }

  return out
}
