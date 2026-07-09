// Single source of truth for the Storybook "Show code" checks
// (.claude/rules/storybook-source.md). Consumed by TWO enforcement surfaces:
//   - .claude/hooks/validate-story-source.mjs     -> write-time gate (AI pipeline)
//   - packages/webkit/scripts/check-authoring.mjs -> DS CI ratchet (repo-wide), so an
//     editor push that never ran the hook cannot merge a broken "Show code" either.

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
// must be PascalCase(last segment of the subpath), i.e. `Chips`. This keeps the
// snippet, the component name, and the export path in lockstep.
function importBindingMismatches(content) {
  const out = []
  const re = /import\s+([A-Za-z_$][\w$]*)\s+from\s+['"]@aziontech\/webkit\/([^'"]+)['"]/g
  let m
  while ((m = re.exec(content))) {
    const binding = m[1]
    const subpath = m[2]
    if (subpath.startsWith('utils/')) continue // non-component helpers (e.g. utils/cn)
    const expected = toPascal(subpath.split('/').pop())
    if (binding !== expected) out.push({ binding, subpath, expected })
  }
  return out
}

// Lowercase/kebab tags of imported PascalCase components present as real tags.
function lowercaseTagHits(content, components) {
  const hits = []
  for (const name of components) {
    if (name === name.toLowerCase()) continue
    for (const tag of new Set([name.toLowerCase(), toKebab(name)])) {
      const re = new RegExp(`<\\/?${tag}(?=[\\s/>])`, 'g')
      if (re.test(content)) hits.push({ tag, expected: name })
    }
  }
  return hits
}

export function checks(result, baseline, isNew) {
  const violations = []
  const has = (s, str) => s.includes(str)

  const usesHelper = has(result, '_shared/story-source')
  const usesToSfc = has(result, 'toSfc(')
  const hasDocsConfig = has(result, 'autodocs') || /\bdocs\s*:/.test(result)

  // ---- anti-patterns (block when newly introduced) ----

  // `docs:` set to a function call rather than a plain object literal. Storybook
  // then prints the raw CSF story object instead of the runnable snippet.
  const docsCall = /\bdocs:\s*[A-Za-z_$][\w$]*\s*\(/
  if (docsCall.test(result) && !docsCall.test(baseline)) {
    violations.push({
      id: 'docs-not-literal',
      message:
        'parameters.docs is a function call. It must be a plain object literal; build the snippet with source.code: toSfc(...).'
    })
  }

  // Dynamic source transform — we use explicit source.code, never a transform.
  const transform = /\btransform:\s*(\(|async|function)/
  if (transform.test(result) && !transform.test(baseline)) {
    violations.push({
      id: 'handrolled-transform',
      message:
        'docs.source.transform is forbidden. Set an explicit source.code: toSfc(IMPORT, TEMPLATE) instead.'
    })
  }

  // Nested <template>.
  if (/<template>\s*<template>/.test(result) && !/<template>\s*<template>/.test(baseline)) {
    violations.push({
      id: 'nested-template',
      message:
        'Nested <template> in the snippet. toSfc adds exactly one wrapper — the body must not contain <template>.'
    })
  }

  // Lowercase/kebab tag of an imported component.
  const hits = lowercaseTagHits(result, importedComponents(result))
  const baseHits = new Set(
    lowercaseTagHits(baseline, importedComponents(baseline)).map((h) => h.tag)
  )
  const newHits = hits.filter((h) => !baseHits.has(h.tag))
  if (newHits.length) {
    violations.push({
      id: 'lowercase-tag',
      message: `Lowercase/kebab component tag(s): ${newHits
        .map((h) => `<${h.tag}> → <${h.expected}>`)
        .join(', ')}. Tags must match the PascalCase import.`
    })
  }

  // Import binding must match the export subpath (PascalCase). Catches
  // `import Chip from '@aziontech/webkit/chips'` (binding Chip vs subpath chips).
  const bindHits = importBindingMismatches(result)
  const baseBinds = new Set(
    importBindingMismatches(baseline).map((h) => `${h.binding}:${h.subpath}`)
  )
  const newBinds = bindHits.filter((h) => !baseBinds.has(`${h.binding}:${h.subpath}`))
  if (newBinds.length) {
    violations.push({
      id: 'import-binding-mismatch',
      message: `Import binding(s) do not match the export subpath: ${newBinds
        .map(
          (h) =>
            `import ${h.binding} from '@aziontech/webkit/${h.subpath}' → expected '${h.expected}'`
        )
        .join(
          '; '
        )}. Rename the binding, or the component/export, so file ↔ export ↔ name ↔ binding all agree.`
    })
  }

  // ---- presence (enforced for NEW story files that emit docs) ----
  if (isNew && hasDocsConfig) {
    if (!usesHelper) {
      violations.push({
        id: 'missing-helper',
        message:
          'New story emits docs but does not import the shared helper (_shared/story-source).'
      })
    }
    if (!usesToSfc) {
      violations.push({
        id: 'missing-source-code',
        message: 'New story does not build its Show code with source.code: toSfc(IMPORT, TEMPLATE).'
      })
    }
    if (!has(result, 'sourceState')) {
      violations.push({
        id: 'missing-sourcestate',
        message: "Missing canvas.sourceState: 'shown' in the meta docs block."
      })
    }
  }

  return violations
}
