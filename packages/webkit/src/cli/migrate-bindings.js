import { addStandaloneImports } from './migrate-compound.js'
import {
  escapeRe,
  kebab,
  pascalCase,
  replaceOutsideComments,
  webkitImports
} from './migrate-syntax.js'

function renameBinding(name, rule) {
  if (!rule.from || !rule.binding) return name
  if (name === rule.from) return rule.binding
  const extendsFrom = rule.binding.startsWith(rule.from) && rule.binding !== rule.from
  const alreadyNew =
    extendsFrom &&
    (name === rule.binding ||
      (name.startsWith(rule.binding) && /^[A-Z]/.test(name.slice(rule.binding.length))))
  const isChild = name.startsWith(rule.from) && /^[A-Z]/.test(name.slice(rule.from.length))
  return isChild && !alreadyNew ? rule.binding + name.slice(rule.from.length) : name
}

function addBindingRenames(imp, match, renames) {
  for (const name of imp.names) {
    const renamed = renameBinding(name, match.rule)
    if (renamed !== name) renames.identifiers.set(name, renamed)
  }
}

function addNamedRenames(imp, migration, renames) {
  for (const { imported, local } of imp.named) {
    const to = migration.types[imported] || (migration.named || {})[imported]
    if (!to || renames.identifiers.has(local)) continue
    if (local === imported) renames.identifiers.set(imported, to)
    else renames.types.push([imported, to])
  }
}

export function collectRenames(source, plan, migration) {
  const renames = { bindings: new Map(), identifiers: new Map(), types: [] }
  for (const imp of webkitImports(source)) {
    const resolved = plan.get(imp.subpath)
    if (resolved.manual) continue
    const { next, match } = resolved
    if (match && next !== imp.subpath) addBindingRenames(imp, match, renames)
    addNamedRenames(imp, migration, renames)
    for (const name of imp.names) {
      renames.bindings.set(renames.identifiers.get(name) || name, next)
    }
  }
  return renames
}

const alternation = (names) =>
  [...names]
    .sort((a, b) => b.length - a.length)
    .map(escapeRe)
    .join('|')

function applyTypeRenames(source, types, changes) {
  if (!types.length) return source
  const aliased = new Map(types)
  const out = source.replace(
    new RegExp(`(?<=\\{[^}]*?)(?<![\\w$])(${alternation(aliased.keys())})(?=\\s+as\\s)`, 'g'),
    (name) => aliased.get(name)
  )
  for (const [from, to] of types) changes.push(`${from} → ${to}`)
  return out
}

function applyIdentifierRenames(source, identifiers, changes) {
  let out = source
  if (identifiers.size) {
    out = replaceOutsideComments(
      out,
      new RegExp(`(?<![\\w$.-])(${alternation(identifiers.keys())})(?![\\w$])`, 'g'),
      (name) => identifiers.get(name)
    )
  }
  for (const [from, to] of identifiers) {
    out = replaceOutsideComments(
      out,
      new RegExp(`(</?)${escapeRe(kebab(from))}(?=[\\s/>])`, 'g'),
      (all, open) => `${open}${kebab(to)}`
    )
    changes.push(`${from} → ${to}`)
  }
  return out
}

export function applyRenames(source, renames, changes) {
  const typed = applyTypeRenames(source, renames.types, changes)
  return applyIdentifierRenames(typed, renames.identifiers, changes)
}

function renameMember(source, { binding, base, from, to }, ctx) {
  const re = new RegExp(`(?<![\\w$.])${escapeRe(binding)}\\.${escapeRe(from)}(?![\\w$])`, 'g')
  if (!re.test(source)) return source
  if (typeof to === 'object' && to.standalone) {
    const local = pascalCase(to.standalone)
    ctx.standalone.push({ binding, base, local, subpath: to.standalone })
    ctx.changes.push(`${binding}.${from} → ${local}`)
    return replaceOutsideComments(source, re, () => local)
  }
  if (typeof to === 'object') {
    ctx.warnings.push(`<${binding}.${from}> was removed in v6: ${to.removed}`)
    return source
  }
  const next = to ? `${binding}.${to}` : binding
  ctx.changes.push(`${binding}.${from} → ${next}`)
  return replaceOutsideComments(source, re, () => next)
}

export function renameMembers(source, bindings, migration, { changes, warnings }) {
  const ctx = { changes, warnings, standalone: [] }
  let out = source
  for (const [binding, base] of bindings) {
    const renames = (migration.members || {})[base]
    if (!renames) continue
    for (const [from, to] of Object.entries(renames)) {
      out = renameMember(out, { binding, base, from, to }, ctx)
    }
  }
  return addStandaloneImports(out, ctx.standalone)
}
