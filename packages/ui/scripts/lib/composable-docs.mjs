import { existsSync, readFileSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import { babelParse } from 'vue/compiler-sfc'

const PARSE_OPTIONS = { sourceType: 'module', plugins: ['typescript'] }

function parseFile(file) {
  const source = readFileSync(file, 'utf-8')
  return { source, ast: babelParse(source, PARSE_OPTIONS) }
}

function resolveModule(from, spec) {
  const base = resolve(dirname(from), spec)
  for (const candidate of [`${base}.ts`, `${base}/index.ts`, base]) {
    if (existsSync(candidate) && candidate.endsWith('.ts')) return candidate
  }
  return null
}

function docOf(node) {
  const comments = (node.leadingComments || []).filter(
    (c) => c.type === 'CommentBlock' && c.value.startsWith('*')
  )
  const last = comments[comments.length - 1]
  if (!last) return ''
  return last.value
    .replace(/^\*/, '')
    .split('\n')
    .map((line) => line.replace(/^\s*\*\s?/, ''))
    .filter((line) => !/^@/.test(line.trim()))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function oneLine(text) {
  return String(text)
    .replace(/\s+/g, ' ')
    .replace(/<\s+/g, '<')
    .replace(/\s+>/g, '>')
    .replace(/,\s*>/g, '>')
    .trim()
}

function slice(source, node) {
  return source.slice(node.start, node.end)
}

function keyName(source, key) {
  if (key.type === 'Identifier') return key.name
  if (key.type === 'StringLiteral') return key.value
  return slice(source, key)
}

function memberOf(source, m) {
  if (m.type === 'TSPropertySignature') {
    const type = m.typeAnnotation
      ? oneLine(slice(source, m.typeAnnotation.typeAnnotation))
      : 'unknown'
    return {
      name: keyName(source, m.key),
      type,
      required: !m.optional,
      readonly: Boolean(m.readonly),
      doc: docOf(m)
    }
  }
  if (m.type === 'TSMethodSignature') {
    const params = m.parameters ?? m.params ?? []
    const ret = m.typeAnnotation ?? m.returnType
    const signature = `(${params.map((p) => oneLine(slice(source, p))).join(', ')}) => ${
      ret ? oneLine(slice(source, ret.typeAnnotation)) : 'void'
    }`
    return {
      name: keyName(source, m.key),
      type: signature,
      required: !m.optional,
      readonly: false,
      doc: docOf(m)
    }
  }
  return null
}

function functionSignature(source, name, fn) {
  const generics = fn.typeParameters ? slice(source, fn.typeParameters) : ''
  const params = (fn.params || []).map((p) => slice(source, p)).join(', ')
  const ret = fn.returnType ? slice(source, fn.returnType.typeAnnotation) : ''
  return oneLine(`function ${name}${generics}(${params})${ret ? `: ${ret}` : ''}`)
}

function describeDeclaration(source, node, wrapper) {
  const doc = docOf(wrapper) || docOf(node)
  if (node.type === 'TSDeclareFunction' || node.type === 'FunctionDeclaration') {
    return {
      kind: 'function',
      name: node.id.name,
      signature: functionSignature(source, node.id.name, node),
      doc
    }
  }
  if (node.type === 'TSInterfaceDeclaration') {
    const generics = node.typeParameters ? oneLine(slice(source, node.typeParameters)) : ''
    const heritage = (node.extends || []).map((h) => oneLine(slice(source, h)))
    return {
      kind: 'interface',
      name: node.id.name,
      generics,
      extends: heritage,
      members: node.body.body.map((m) => memberOf(source, m)).filter(Boolean),
      doc
    }
  }
  if (node.type === 'TSTypeAliasDeclaration') {
    const generics = node.typeParameters ? oneLine(slice(source, node.typeParameters)) : ''
    const members =
      node.typeAnnotation.type === 'TSTypeLiteral'
        ? node.typeAnnotation.members.map((m) => memberOf(source, m)).filter(Boolean)
        : null
    return {
      kind: 'type',
      name: node.id.name,
      generics,
      members,
      definition: oneLine(slice(source, node.typeAnnotation)),
      doc
    }
  }
  if (node.type === 'VariableDeclaration') {
    const d = node.declarations[0]
    const init = d.init
    if (init && (init.type === 'ArrowFunctionExpression' || init.type === 'FunctionExpression')) {
      return {
        kind: 'function',
        name: d.id.name,
        signature: functionSignature(source, d.id.name, init),
        doc
      }
    }
    const type = d.id.typeAnnotation
      ? oneLine(slice(source, d.id.typeAnnotation.typeAnnotation))
      : ''
    return { kind: 'const', name: d.id.name, type, doc }
  }
  return null
}

function declarationsIn(source, ast) {
  const out = new Map()
  for (const stmt of ast.program.body) {
    const node = stmt.type === 'ExportNamedDeclaration' ? stmt.declaration : stmt
    if (!node) continue
    const wrapper = stmt
    const name =
      node.id?.name ?? (node.type === 'VariableDeclaration' ? node.declarations[0]?.id?.name : null)
    if (!name) continue
    const described = describeDeclaration(source, node, wrapper)
    if (!described) continue
    if (described.kind === 'function' && out.get(name)?.kind === 'function') continue
    out.set(name, described)
  }
  return out
}

const cache = new Map()

function moduleExports(file, seen = new Set()) {
  if (cache.has(file)) return cache.get(file)
  if (seen.has(file)) return []
  seen.add(file)
  const { source, ast } = parseFile(file)
  const local = declarationsIn(source, ast)
  const result = []
  for (const stmt of ast.program.body) {
    if (stmt.type === 'ExportNamedDeclaration' && stmt.source) {
      const target = resolveModule(file, stmt.source.value)
      if (!target) continue
      const theirs = new Map(moduleExports(target, seen).map((e) => [e.name, e]))
      for (const spec of stmt.specifiers) {
        const found = theirs.get(spec.local.name)
        if (found) result.push({ ...found, name: spec.exported.name })
      }
    } else if (stmt.type === 'ExportAllDeclaration') {
      const target = resolveModule(file, stmt.source.value)
      if (target) result.push(...moduleExports(target, seen))
    } else if (stmt.type === 'ExportNamedDeclaration' && stmt.declaration) {
      const node = stmt.declaration
      const name =
        node.id?.name ??
        (node.type === 'VariableDeclaration' ? node.declarations[0]?.id?.name : null)
      if (name && local.has(name)) result.push(local.get(name))
    } else if (stmt.type === 'ExportNamedDeclaration') {
      for (const spec of stmt.specifiers) {
        const found = local.get(spec.local.name)
        if (found) result.push({ ...found, name: spec.exported.name })
      }
    }
  }
  const unique = []
  const names = new Set()
  for (const e of result) {
    if (names.has(e.name)) continue
    names.add(e.name)
    unique.push(e)
  }
  cache.set(file, unique)
  return unique
}

export function composableExports(pkgRoot, target) {
  const file = resolve(pkgRoot, target)
  if (!existsSync(file)) return null
  return {
    file: relative(pkgRoot, file).split('\\').join('/'),
    exports: moduleExports(file)
  }
}
