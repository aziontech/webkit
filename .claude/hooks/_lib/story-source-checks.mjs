// Single source of truth for the Storybook "Show code" checks
// (.claude/rules/storybook-source.md). Consumed by TWO enforcement surfaces:
//   - .claude/hooks/validate-story-source.mjs     -> write-time gate (AI pipeline)
//   - packages/webkit/scripts/check-authoring.mjs -> DS CI ratchet (repo-wide), so an
//     editor push that never ran the hook cannot merge a broken "Show code" either.
//
// STRICT MODE: the whole stories tree was migrated to the canonical pattern on
// 2026-07-03, so every check applies to the full RESULT of a write — there is no
// legacy to grandfather. Foundations catalog pages (stories/foundations/*) are
// exempt from the toSfc/helper requirement (they document tokens, not a
// component API) but must still keep `docs` a literal and set
// `canvas.sourceState` (use 'none' — a copy-paste SFC is meaningless there).

export const STORY_RE = /\.stories\.(js|jsx|mjs|ts|tsx)$/

const toKebab = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
const toPascal = (kebab) =>
  kebab
    .split(/[-/]/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('')

// PascalCase components imported from the webkit package.
function importedComponents(content) {
  const names = new Set()
  const re = /import\s+([A-Z][A-Za-z0-9]*)\s+from\s+['"]@aziontech\/webkit\/[^'"]+['"]/g
  let m
  while ((m = re.exec(content))) names.add(m[1])
  return [...names]
}

// Default imports of webkit components whose binding does not match the export
// subpath. `import Chip from '@aziontech/webkit/chips'` is wrong — the binding
// must be PascalCase(last segment of the subpath). This keeps the snippet, the
// component name, and the export path in lockstep.
function importBindingMismatches(content) {
  const out = []
  const re = /import\s+([A-Za-z_$][\w$]*)\s+from\s+['"]@aziontech\/webkit\/([^'"]+)['"]/g
  let m
  while ((m = re.exec(content))) {
    const binding = m[1]
    const subpath = m[2]
    if (subpath.startsWith('utils/') || subpath.startsWith('styles/')) continue // non-component helpers
    const expected = toPascal(subpath.split('/').pop())
    if (binding !== expected) out.push({ binding, subpath, expected })
  }
  return out
}

// Native HTML element names. A webkit component can share a name with one of
// these (Label/label, Table/table, Button/button, ...). A lowercase such tag in
// slot markup is legitimate native HTML, not a mis-cased component reference, so
// it is NOT flagged. The real target of this check is a lowercase tag of a
// NON-native component name (<skeleton>, <chips>, <avatar>, <empty-state>),
// which never resolves when pasted.
// prettier-ignore
const NATIVE_HTML = new Set([
  'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi',
  'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code',
  'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog',
  'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer',
  'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr',
  'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li',
  'link', 'main', 'map', 'mark', 'menu', 'meta', 'meter', 'nav', 'object', 'ol',
  'optgroup', 'option', 'output', 'p', 'picture', 'pre', 'progress', 'q', 'rp',
  'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'slot', 'small',
  'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody',
  'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr',
  'track', 'u', 'ul', 'var', 'video', 'wbr'
])

// Lowercase/kebab tags of imported PascalCase components present as real tags.
function lowercaseTagHits(content, components) {
  const hits = []
  for (const name of components) {
    if (name === name.toLowerCase()) continue
    for (const tag of new Set([name.toLowerCase(), toKebab(name)])) {
      if (NATIVE_HTML.has(tag)) continue // legitimate native element, not a mis-cased component
      const re = new RegExp(`<\\/?${tag}(?=[\\s/>])`, 'g')
      if (re.test(content)) hits.push({ tag, expected: name })
    }
  }
  return hits
}

export function checks(result, relPath = '') {
  const violations = []
  const has = (s, str) => s.includes(str)

  const isFoundations = relPath.includes('stories/foundations/')
  const usesHelper = has(result, '_shared/story-source')
  const usesToSfc = has(result, 'toSfc(')
  const hasDocsConfig = has(result, 'autodocs') || /\bdocs\s*:/.test(result)

  // ---- anti-patterns (always blocked) ----

  // `docs:` set to a function call rather than a plain object literal. Storybook
  // then prints the raw CSF story object instead of the runnable snippet.
  if (/\bdocs:\s*[A-Za-z_$][\w$]*\s*\(/.test(result)) {
    violations.push({
      id: 'docs-not-literal',
      message:
        'parameters.docs is a function call. It must be a plain object literal; build the snippet with source.code: toSfc(...).'
    })
  }

  // Dynamic source — we use explicit source.code, never a transform or 'dynamic'.
  if (/\btransform:\s*(\(|async|function)/.test(result)) {
    violations.push({
      id: 'handrolled-transform',
      message:
        'docs.source.transform is forbidden. Set an explicit source.code: toSfc(IMPORT, TEMPLATE) instead.'
    })
  }
  if (/\btype:\s*['"]dynamic['"]/.test(result)) {
    violations.push({
      id: 'dynamic-source',
      message:
        "docs.source.type: 'dynamic' is forbidden. Set an explicit source.code: toSfc(IMPORT, TEMPLATE)."
    })
  }

  // Nested <template>.
  if (/<template>\s*<template>/.test(result)) {
    violations.push({
      id: 'nested-template',
      message:
        'Nested <template> in the snippet. toSfc adds exactly one wrapper — the body must not contain <template>.'
    })
  }

  // Lowercase/kebab tag of an imported component.
  const hits = lowercaseTagHits(result, importedComponents(result))
  if (hits.length) {
    violations.push({
      id: 'lowercase-tag',
      message: `Lowercase/kebab component tag(s): ${hits
        .map((h) => `<${h.tag}> → <${h.expected}>`)
        .join(', ')}. Tags must match the PascalCase import.`
    })
  }

  // Import binding must match the export subpath (PascalCase). Catches
  // `import Chip from '@aziontech/webkit/chips'` (binding Chip vs subpath chips).
  const bindHits = importBindingMismatches(result)
  if (bindHits.length) {
    violations.push({
      id: 'import-binding-mismatch',
      message: `Import binding(s) do not match the export subpath: ${bindHits
        .map(
          (h) =>
            `import ${h.binding} from '@aziontech/webkit/${h.subpath}' → expected '${h.expected}'`
        )
        .join(
          '; '
        )}. Rename the binding, or the component/export, so file ↔ export ↔ name ↔ binding all agree.`
    })
  }

  // Deprecated Storybook wiring.
  if (/argTypesRegex/.test(result)) {
    violations.push({
      id: 'argtypes-regex',
      message:
        'parameters.actions.argTypesRegex is deprecated. Declare each event explicitly in argTypes with { action }.'
    })
  }
  if (/^[A-Z][A-Za-z0-9]*\.(args|argTypes|parameters)\s*=/m.test(result)) {
    violations.push({
      id: 'legacy-csf2-assignment',
      message:
        'Legacy `Story.args = {...}` assignment. Use CSF3 object-form stories (export const X = { args, render, parameters }).'
    })
  }

  // Figma references live in <name>.figma.ts (Code Connect), never in stories.
  if (/addon-designs|figma\.com/.test(result)) {
    violations.push({
      id: 'figma-reference',
      message:
        'Figma links/addon-designs are forbidden in stories. The Figma mapping is owned by the component `.figma.ts` (Code Connect).'
    })
  }

  // Destructuring/spreading the reactive `args` proxy freezes property reads at
  // setup time and silently breaks the Controls panel.
  if (
    /(?:const|let|var)\s*\{[^}]*\}\s*=\s*args\b/.test(result) ||
    /\{\s*\.\.\.args\b/.test(result)
  ) {
    violations.push({
      id: 'args-destructure',
      message:
        'Destructuring or spreading `args` breaks Controls reactivity. Return { args } from setup() and bind v-bind="args" directly.'
    })
  }

  // ---- presence (every story file that emits docs) ----
  if (hasDocsConfig) {
    if (!isFoundations && !usesHelper) {
      violations.push({
        id: 'missing-helper',
        message: 'Story emits docs but does not import the shared helper (_shared/story-source).'
      })
    }
    if (!isFoundations && !usesToSfc) {
      violations.push({
        id: 'missing-source-code',
        message: 'Story does not build its Show code with source.code: toSfc(IMPORT, TEMPLATE).'
      })
    }
    if (!has(result, 'sourceState')) {
      violations.push({
        id: 'missing-sourcestate',
        message:
          "Missing canvas.sourceState in the meta docs block ('shown' for component/template stories, 'none' for foundations catalogs)."
      })
    }
  }

  return violations
}
