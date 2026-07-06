// Pure query functions over a loaded webkit catalog.
//
// Every function here takes the catalog object returned by `loadCatalog()` and
// returns plain JSON — no MCP SDK, no I/O, no side effects. This is what makes the
// tool surface testable with `node --test` alone. `server.js` is a thin adapter that
// exposes each of these as an MCP tool.
//
// The overarching goal: given the version-locked catalog of the webkit the consuming
// project actually installed, help an AI generate correct + performant webkit code —
// the right component, the right (tree-shakeable) import, real props, and a runnable
// SFC — instead of reinventing or reaching for PrimeVue.

const NOT_AVAILABLE = {
  ok: false,
  available: false,
  message:
    '@aziontech/webkit is not installed in this project (or its catalog.json is not resolvable). ' +
    'Install @aziontech/webkit (or @aziontech/webkit.dev), or set WEBKIT_CATALOG_PATH to its catalog.json.'
}

/** kebab subpath → PascalCase binding: `empty-state` → `EmptyState`, `table-row` → `TableRow`. */
export function pascalCase(subpath) {
  const last = String(subpath).split('/').pop() || ''
  return last
    .split('-')
    .filter(Boolean)
    .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1))
    .join('')
}

/** The subpath of a full import path, stripped of the catalog's package prefix. */
function subpathOf(catalog, importPath) {
  const prefix = catalog.prefix
  const s = String(importPath || '')
  return s.startsWith(prefix) ? s.slice(prefix.length) : s
}

/** A compact card for list/search results. */
function componentCard(catalog, name) {
  const e = catalog.getEntry(name)
  if (!e) return null
  return {
    name,
    category: e.category ?? null,
    structure: e.structure ?? null,
    status: e.status ?? null,
    import: e.import,
    treeShakeableImport: e.treeShakeableImport ?? e.import,
    binding: pascalCase(name)
  }
}

/**
 * List every renderable component (kind === 'component'), optionally filtered by category.
 * Returns compact cards — enough to pick a component, not the full API.
 */
export function listComponents(catalog, { category } = {}) {
  if (!catalog.available) return NOT_AVAILABLE
  const wanted = category ? String(category).toLowerCase() : null
  const components = catalog.subpaths
    .filter((sub) => catalog.getEntry(sub)?.kind === 'component')
    .filter((sub) => !wanted || (catalog.getEntry(sub)?.category || '').toLowerCase() === wanted)
    .map((sub) => componentCard(catalog, sub))
    .sort((a, b) => a.name.localeCompare(b.name))
  return {
    ok: true,
    available: true,
    version: catalog.version,
    count: components.length,
    ...(wanted ? { category: wanted } : {}),
    components
  }
}

/** Distinct categories present in the catalog, for discovery / filtering. */
export function listCategories(catalog) {
  if (!catalog.available) return NOT_AVAILABLE
  const cats = new Set()
  for (const sub of catalog.subpaths) {
    const c = catalog.getEntry(sub)?.category
    if (c) cats.add(c)
  }
  return { ok: true, available: true, categories: [...cats].sort() }
}

/**
 * The POSITIVE token inventory — what a consumer SHOULD use (the complement of the deny
 * rules in validate_usage). Without a `category`, returns the group index (name + count)
 * plus the typography utility classes. With a `category` (a group name like "primary",
 * "bg", "text", "spacing", "radius", "shadow"), returns that group's CSS custom
 * properties. Answers "I can't hardcode #hex — which token do I use instead?".
 */
export function listTokens(catalog, { category } = {}) {
  if (!catalog.available) return NOT_AVAILABLE
  const tokens = catalog.tokens || { cssVars: [], typography: [], groups: {} }
  const groupNames = Object.keys(tokens.groups)

  if (category != null && String(category).length) {
    const key = String(category).toLowerCase().trim()
    const group = tokens.groups[key]
    if (!group) {
      return {
        ok: false,
        available: true,
        found: false,
        category: key,
        groups: groupNames,
        message: `No token group "${key}". Available groups: ${groupNames.join(', ')}.`
      }
    }
    return { ok: true, available: true, found: true, category: key, tokens: group }
  }

  return {
    ok: true,
    available: true,
    groups: groupNames.map((name) => ({ name, count: tokens.groups[name].length })),
    typography: tokens.typography,
    hint: 'Call list_tokens with a category (e.g. "primary", "bg", "text", "spacing", "radius", "shadow") for the CSS custom properties in that group.'
  }
}

/**
 * Full entry for a component (props / events / slots / subcomponents), or a
 * not-found object carrying fuzzy suggestions so the caller can recover.
 */
export function getComponent(catalog, name) {
  if (!catalog.available) return NOT_AVAILABLE
  const key = String(name || '').trim()
  const e = catalog.getEntry(key)
  if (!e) {
    return {
      ok: false,
      available: true,
      found: false,
      name: key,
      suggestions: catalog.suggestSubpaths(key),
      message: `No webkit export named "${key}".`
    }
  }
  return {
    ok: true,
    available: true,
    found: true,
    name: key,
    binding: pascalCase(key),
    kind: e.kind,
    category: e.category ?? null,
    structure: e.structure ?? null,
    status: e.status ?? null,
    import: e.import,
    treeShakeableImport: e.treeShakeableImport ?? e.import,
    compoundRoot: e.compoundRoot ?? false,
    subcomponents: e.subcomponents ?? [],
    parent: e.parent ?? null,
    rootOf: e.rootOf ?? null,
    props: e.props ?? [],
    events: e.events ?? [],
    slots: e.slots ?? []
  }
}

/**
 * The CORRECT + PERFORMANT import line for a component.
 *
 * For a compound root (`compoundRoot: true`) the performant default is the
 * tree-shakeable `<name>-root` import (nothing else is pulled in); the compound
 * dot-notation import is offered as the ergonomic alternative that ships every
 * sub-component. For everything else the tree-shakeable import IS the plain import.
 */
export function getImport(catalog, name) {
  if (!catalog.available) return NOT_AVAILABLE
  const key = String(name || '').trim()
  const e = catalog.getEntry(key)
  if (!e) {
    return {
      ok: false,
      available: true,
      found: false,
      name: key,
      suggestions: catalog.suggestSubpaths(key),
      message: `No webkit export named "${key}".`
    }
  }

  // A distinct tree-shakeable root exists only when the catalog gives one. A .vue-rooted
  // compound already IS its own lean root (treeShakeableImport === import). An index.ts
  // compound with no `-root` export has none (treeShakeableImport === null).
  const hasLeanRoot = e.treeShakeableImport != null
  const tree = e.treeShakeableImport ?? e.import
  const binding = pascalCase(subpathOf(catalog, tree))
  const result = {
    ok: true,
    available: true,
    found: true,
    name: key,
    binding,
    // The performant import to prefer.
    import: `import ${binding} from '${tree}'`,
    importPath: tree,
    treeShakeable: hasLeanRoot
  }

  if (e.compoundRoot) {
    const subs = e.subcomponents ?? []
    const subExample = subs[0] ?? `${catalog.prefix}name-part`
    // Two compound shapes. An index.ts Object.assign compound has a DISTINCT -root
    // (tree !== import): the compound import gives dot-notation but is not tree-shakeable.
    // A .vue-rooted compound is already its own lean root (tree === import): no separate
    // non-tree-shakeable alternative exists; its sub-components are just separate exports.
    if (hasLeanRoot && tree !== e.import) {
      const compoundBinding = pascalCase(key)
      result.compoundAlternative = {
        import: `import ${compoundBinding} from '${e.import}'`,
        importPath: e.import,
        binding: compoundBinding,
        note:
          `The compound import (${e.import}) attaches every sub-component for dot-notation ` +
          `(${compoundBinding}.Row, …), but it is NOT tree-shakeable — it retains all ` +
          `sub-components even when you render only the root. Prefer the -root import above ` +
          `for the smallest bundle; use the compound when you want the dot-notation ergonomics.`,
        subcomponents: subs
      }
      result.note =
        `${key} is a compound root. The tree-shakeable root import (above) is preferred; ` +
        `import sub-components individually (e.g. ${subExample}) to keep the bundle minimal.`
    } else {
      result.subcomponents = subs
      result.note =
        `${key} owns sub-components (e.g. ${subExample}). The import above is already the lean ` +
        `root; import each sub-component from its own subpath as needed.`
    }
  }

  return result
}

/** Score a component against a free-text need. Higher is better; 0 = no match. */
function scoreMatch(name, category, query) {
  const q = query.toLowerCase().trim()
  if (!q) return 0
  const n = name.toLowerCase()
  const c = (category || '').toLowerCase()
  const words = q.split(/[\s/_-]+/).filter(Boolean)

  let score = 0
  if (n === q) score += 100
  if (n.includes(q)) score += 40
  if (q.includes(n) && n.length >= 3) score += 30
  if (c && (c === q || q.includes(c))) score += 10
  for (const w of words) {
    if (w.length < 2) continue
    if (n === w) score += 25
    else if (n.includes(w)) score += 15
    else if (w.includes(n) && n.length >= 3) score += 12
    if (c.includes(w)) score += 4
  }
  return score
}

/**
 * Fuzzy / substring search across component names + categories. Returns ranked
 * cards so a phrase like "dropdown" or "paginated table" resolves to a real
 * component instead of the AI reinventing one.
 */
export function searchComponents(catalog, query) {
  if (!catalog.available) return NOT_AVAILABLE
  const q = String(query || '')
  const ranked = catalog.subpaths
    .filter((sub) => catalog.getEntry(sub)?.kind === 'component')
    .map((sub) => {
      const e = catalog.getEntry(sub)
      return { sub, score: scoreMatch(sub, e.category, q) }
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.sub.localeCompare(b.sub))
    .slice(0, 10)
    .map((r) => ({ ...componentCard(catalog, r.sub), score: r.score }))

  return { ok: true, available: true, query: q, count: ranked.length, matches: ranked }
}

/**
 * Given a plain-language need, suggest the single best-fitting component (plus a
 * couple of runners-up). Falls back to edit-distance suggestions when nothing
 * scores on the substring/word heuristic.
 */
export function suggestComponent(catalog, need) {
  if (!catalog.available) return NOT_AVAILABLE
  const q = String(need || '')
  const search = searchComponents(catalog, q)
  if (search.matches.length > 0) {
    const [best, ...rest] = search.matches
    return {
      ok: true,
      available: true,
      need: q,
      found: true,
      best,
      alternatives: rest.slice(0, 3)
    }
  }
  // Nothing matched by words — offer typo-level suggestions over the raw phrase.
  const fuzzy = catalog
    .suggestSubpaths(q.toLowerCase().replace(/\s+/g, '-'))
    .filter((sub) => catalog.getEntry(sub)?.kind === 'component')
    .map((sub) => componentCard(catalog, sub))
  return {
    ok: true,
    available: true,
    need: q,
    found: false,
    best: fuzzy[0] ?? null,
    alternatives: fuzzy.slice(1, 4),
    message: fuzzy.length
      ? `No strong match for "${q}". Closest names by spelling:`
      : `No component matches "${q}". Try listComponents or searchComponents with a broader term.`
  }
}

/** Pick a small set of illustrative props (required first, then leading scalars). */
function exampleProps(props) {
  const scalar = (t) => /^('.*'|string|number|boolean)/.test(String(t || '').trim())
  const literalDefault = (p) => {
    // Prefer the documented default for enums; otherwise synthesize by type.
    const d = String(p.default ?? '').trim()
    if (d && d !== '—' && d !== "''" && d !== '[]' && d !== '{}') return d.replace(/^'|'$/g, '')
    const t = String(p.type || '').trim()
    if (/^'/.test(t)) return t.split('|')[0].trim().replace(/^'|'$/g, '') // first enum literal
    if (t === 'boolean') return true
    if (t === 'number') return 0
    return 'text'
  }

  const required = props.filter((p) => String(p.required).toLowerCase() === 'yes')
  const leading = props.filter((p) => String(p.required).toLowerCase() !== 'yes' && scalar(p.type))
  const chosen = [...required, ...leading].slice(0, Math.max(required.length, 2)).slice(0, 3)

  return chosen.map((p) => {
    const t = String(p.type || '').trim()
    if (t === 'boolean') {
      // Boolean true renders as a bare attribute; false is omitted.
      const v = literalDefault(p)
      return { name: p.name, attr: v ? p.name : null }
    }
    if (t === 'number') return { name: p.name, attr: `:${p.name}="${literalDefault(p)}"` }
    if (scalar(t)) {
      // String / enum → quoted static attribute.
      return { name: p.name, attr: `${p.name}="${literalDefault(p)}"` }
    }
    // Non-scalar (array / object / function): a static string would be wrong
    // (`columns="text"` is not runnable). Bind an empty literal of the right shape so
    // the snippet still parses and runs — the consumer fills it in.
    const isArray = /\[\]\s*$|^Array\s*<|^readonly\s/.test(t)
    const isFn = /=>|\bFunction\b/.test(t)
    const literal = isArray ? '[]' : isFn ? '() => {}' : '{}'
    return { name: p.name, attr: `:${p.name}="${literal}"` }
  })
}

/**
 * A runnable single-file component synthesized from the entry: a `<script setup>`
 * with the tree-shakeable import, and a `<template>` using the PascalCase tag with
 * a couple of example props derived from the props table. No PrimeVue, no
 * placeholders — paste-and-run.
 */
export function getUsageExample(catalog, name) {
  if (!catalog.available) return NOT_AVAILABLE
  const comp = getComponent(catalog, name)
  if (!comp.found) return comp

  const tree = comp.treeShakeableImport
  const binding = pascalCase(subpathOf(catalog, tree))
  const importLine = `import ${binding} from '${tree}'`

  const attrs = exampleProps(comp.props)
    .map((p) => p.attr)
    .filter(Boolean)
  const hasDefaultSlot = comp.slots.some((s) => s.name === 'default' || s.name === '—' || !s.name)
  const openTag = attrs.length ? `<${binding} ${attrs.join(' ')}` : `<${binding}`

  let tag
  if (hasDefaultSlot) {
    tag = `${openTag}>${binding} content</${binding}>`
  } else {
    tag = `${openTag} />`
  }

  const sfc = `<script setup>\n${importLine}\n</script>\n\n<template>\n  ${tag}\n</template>\n`

  return {
    ok: true,
    available: true,
    found: true,
    name: comp.name,
    binding,
    import: importLine,
    sfc,
    note: comp.compoundRoot
      ? `${comp.name} is a compound root — sub-components (${(comp.subcomponents ?? [])
          .slice(0, 3)
          .join(', ')}${(comp.subcomponents ?? []).length > 3 ? ', ...' : ''}) compose inside it.`
      : undefined
  }
}

/**
 * Validate a piece of usage before it ships:
 *  - `import`  → is the path a real, non-denied webkit export? (else suggestions)
 *  - `classes` → do any token rules (hex, rgb, tailwind palette, raw text size,
 *    PrimeVue color) fire on the class string?
 * Returns `{ ok, problems: [...] }`.
 */
export function validateUsage(catalog, { import: importPath, classes } = {}) {
  if (!catalog.available) return NOT_AVAILABLE
  const problems = []

  if (importPath != null && String(importPath).length) {
    const raw = String(importPath).trim()
    const bare = catalog.bare
    const prefix = catalog.prefix
    // Match the webkit package itself only — NOT sibling packages that share the name
    // as a prefix (`@aziontech/webkit-cli`, `@aziontech/webkit-mcp`). Those are not
    // webkit imports, so they must fall into the "nothing to validate" branch.
    const isWebkit = raw === bare || raw.startsWith(prefix)
    if (!isWebkit) {
      problems.push({
        kind: 'import',
        severity: 'info',
        import: raw,
        message: `Not a @aziontech/webkit import — nothing to validate against the catalog.`
      })
    } else {
      const sub = raw === bare ? '' : raw.slice(prefix.length)
      const denied = catalog.deniedPrefixes.find((p) => raw.startsWith(p))
      if (denied) {
        problems.push({
          kind: 'import',
          severity: 'error',
          import: raw,
          message: `Denied import path (private internals): starts with "${denied}". Use a published export.`,
          suggestions: catalog.suggestSubpaths(sub)
        })
      } else if (!catalog.has(sub)) {
        const nearest = catalog.nearestPublishedPrefix(sub)
        problems.push({
          kind: 'import',
          severity: 'error',
          import: raw,
          message: `Unknown webkit export "${raw}".`,
          nearestPublishedPrefix: nearest ? `${prefix}${nearest}` : null,
          suggestions: catalog.suggestSubpaths(sub)
        })
      }
    }
  }

  if (classes != null && String(classes).length) {
    const str = String(classes)
    for (const rule of catalog.tokenRules) {
      if (rule.re.test(str)) {
        problems.push({
          kind: 'token',
          severity: 'error',
          ruleId: rule.id,
          message: rule.message
        })
      }
    }
  }

  return { ok: problems.length === 0, available: true, problems }
}
