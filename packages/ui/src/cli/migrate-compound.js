import { azionUiImports, escapeRe, kebab, pascalCase, PREFIX, scanTag } from './migrate-syntax.js'

export function addStandaloneImports(source, moved) {
  if (!moved.length) return source
  let out = source
  const imported = new Set(azionUiImports(out).flatMap((imp) => imp.names))
  for (const binding of new Set(moved.map((m) => m.binding))) {
    const own = azionUiImports(out).find((imp) => imp.names.includes(binding))
    if (!own) continue
    const lines = moved
      .filter((m) => m.binding === binding && !imported.has(m.local))
      .map((m) => m.subpath)
      .filter((subpath, i, all) => all.indexOf(subpath) === i)
      .sort()
      .map((subpath) => {
        imported.add(pascalCase(subpath))
        return `import ${pascalCase(subpath)} from '${PREFIX}${subpath}'`
      })
    const at = out.indexOf(own.statement)
    const lineStart = out.lastIndexOf('\n', at) + 1
    const indent = out.slice(lineStart, at).match(/^[ \t]*/)[0]
    const end = at + own.statement.length
    const newline = out.indexOf('\n', end)
    const lineEnd = newline < 0 ? out.length : newline
    const insert = lines.map((line) => `\n${indent}${line}`).join('')
    out = out.slice(0, lineEnd) + insert + out.slice(lineEnd)
    const rest = out.slice(0, lineStart) + out.slice(lineEnd)
    const name = escapeRe(binding)
    const code = rest
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(new RegExp(`(["'])(?!${name}\\1)[^"'\\n]*\\1`, 'g'), '""')
    const stillUsed =
      new RegExp(`(?<![\\w$.-])${name}(?![\\w$])`).test(code) ||
      new RegExp(`</?(${name}|${escapeRe(kebab(binding))})(?=[\\s/>.])`).test(rest)
    if (stillUsed) continue
    if (own.names.length === 1) {
      out = out.slice(0, lineStart) + out.slice(lineEnd + 1)
    } else {
      const statement = own.statement.replace(
        new RegExp(`^import\\s+${escapeRe(binding)}\\s*,\\s*`),
        'import '
      )
      out = out.slice(0, at) + statement + out.slice(end)
    }
  }
  return out
}

function lineOfStatement(source, statement) {
  const at = source.indexOf(statement)
  const start = source.lastIndexOf('\n', at) + 1
  const newline = source.indexOf('\n', at + statement.length)
  const end = newline < 0 ? source.length : newline + 1
  const alone =
    /^[ \t]*$/.test(source.slice(start, at)) &&
    /^;?[ \t]*\r?\n?$/.test(source.slice(at + statement.length, end))
  return { at, start, end, alone }
}

function insideEveryTime(source, childRe, parentRe) {
  const events = [
    ...[...source.matchAll(parentRe)].map((m) => ({ m, parent: true })),
    ...[...source.matchAll(childRe)].map((m) => ({ m, parent: false }))
  ].sort((a, b) => a.m.index - b.m.index)
  let depth = 0
  for (const { m, parent } of events) {
    const closing = m[1] === '/'
    if (!parent) {
      if (depth <= 0) return false
      continue
    }
    if (closing) depth -= 1
    else if (source[scanTag(source, m.index + m[0].length) - 1] !== '/') depth += 1
  }
  return true
}

const tagPattern = (name) =>
  new RegExp(`<(/?)(${escapeRe(name)}|${escapeRe(kebab(name))})(?=[\\s/>])`, 'g')

const usedAsIdentifier = (text, name) =>
  new RegExp(`(?<![\\w$.-])${escapeRe(name)}(?![\\w$])`).test(text)

function attachPlan(source, subpath, root) {
  const imports = azionUiImports(source)
  const own = imports.find((imp) => imp.subpath === subpath)
  if (!own || own.named.length || own.names.length !== 1) return null
  const rootImport = imports.find(
    (imp) => imp.subpath === root && imp.names.length > imp.named.length
  )
  return {
    own,
    local: own.names[0],
    rootImport,
    parent: rootImport ? rootImport.names[0] : pascalCase(root)
  }
}

function attachable(source, plan, line) {
  const { local, rootImport, parent } = plan
  if (!line.alone) return false
  const childRe = tagPattern(local)
  const rest = (source.slice(0, line.start) + source.slice(line.end))
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(childRe, '')
  if (usedAsIdentifier(rest, local)) return false
  if (!rootImport && usedAsIdentifier(rest.replace(tagPattern(parent), ''), parent)) return false
  return insideEveryTime(source, childRe, tagPattern(parent))
}

function attachOne(source, plan, line, { root, member }) {
  const { own, rootImport, parent } = plan
  const importLine = source.slice(line.start, line.end)
  const out =
    source.slice(0, line.start) +
    (rootImport
      ? ''
      : importLine.replace(own.statement, `import ${parent} from '${PREFIX}${root}'`)) +
    source.slice(line.end)
  return out.replace(tagPattern(plan.local), (all, slash) => `<${slash}${parent}.${member}`)
}

export function attachToCompound(source, attached = {}) {
  let out = source
  const changes = []
  for (const [subpath, target] of Object.entries(attached)) {
    const plan = attachPlan(out, subpath, target.root)
    if (!plan) continue
    const line = lineOfStatement(out, plan.own.statement)
    if (!attachable(out, plan, line)) continue
    out = attachOne(out, plan, line, target)
    changes.push(`<${plan.local}> (${PREFIX}${subpath}) → <${plan.parent}.${target.member}>`)
  }
  return { source: out, changes }
}
