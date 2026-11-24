import { calleeName, isComposableFile, isTsFile } from '../lib/composable-file.js'

const COMPOSABLE_NAME = /^use[A-Z0-9]/
const MUTABLE_REF = new Set(['ref', 'shallowRef'])
const ELEMENT_NAME = /(El|Element)$/
const ELEMENT_TYPE = /\b(\w*Element|ComponentPublicInstance)\b/
const FUNCTION_TYPES = new Set([
  'FunctionDeclaration',
  'FunctionExpression',
  'ArrowFunctionExpression'
])

function declarationOf(stmt) {
  const exported =
    stmt.type === 'ExportNamedDeclaration' || stmt.type === 'ExportDefaultDeclaration'
  return exported ? stmt.declaration : stmt
}

function localFunctions(program) {
  const local = new Map()
  for (const stmt of program.body) {
    const decl = declarationOf(stmt)
    if (!decl) continue
    if (decl.type === 'FunctionDeclaration' && decl.id) {
      local.set(decl.id.name, { fn: decl, typed: false })
    } else if (decl.type === 'VariableDeclaration') {
      for (const d of decl.declarations) {
        if (d.id.type === 'Identifier' && d.init) {
          local.set(d.id.name, { fn: d.init, typed: Boolean(d.id.typeAnnotation) })
        }
      }
    }
  }
  return local
}

function namedExports(stmt) {
  const names = []
  const decl = stmt.declaration
  if (decl?.type === 'FunctionDeclaration' && decl.id) names.push(decl.id.name)
  if (decl?.type === 'VariableDeclaration') {
    for (const d of decl.declarations) if (d.id.type === 'Identifier') names.push(d.id.name)
  }
  for (const s of stmt.specifiers ?? []) {
    if (s.local?.type === 'Identifier') names.push(s.local.name)
  }
  return names
}

function defaultExports(stmt) {
  const decl = stmt.declaration
  if (decl.type === 'FunctionDeclaration' && decl.id) return [decl.id.name]
  return decl.type === 'Identifier' ? [decl.name] : []
}

const EXPORT_NAMES = {
  ExportNamedDeclaration: namedExports,
  ExportDefaultDeclaration: defaultExports
}

function exportedNames(program) {
  const exported = new Set()
  for (const stmt of program.body) {
    for (const name of EXPORT_NAMES[stmt.type]?.(stmt) ?? []) exported.add(name)
  }
  return exported
}

function isComposable(name, fn) {
  return Boolean(name) && COMPOSABLE_NAME.test(name) && Boolean(fn) && FUNCTION_TYPES.has(fn.type)
}

function exportedComposables(program) {
  const local = localFunctions(program)
  const found = []
  for (const name of exportedNames(program)) {
    const entry = local.get(name)
    if (entry && isComposable(name, entry.fn)) {
      found.push({ name, fn: entry.fn, typed: entry.typed || Boolean(entry.fn.returnType) })
    }
  }
  return found
}

function walkOwnBody(fn, visit) {
  const walk = (node) => {
    if (!node || typeof node.type !== 'string') return
    if (node !== fn && FUNCTION_TYPES.has(node.type)) return
    if (visit(node)) return
    for (const key of Object.keys(node)) {
      if (key === 'parent') continue
      const value = node[key]
      if (Array.isArray(value)) value.forEach(walk)
      else if (value && typeof value.type === 'string') walk(value)
    }
  }
  walk(fn.body)
}

function ownReturns(fn) {
  if (fn.body.type !== 'BlockStatement') return [fn.body]
  const out = []
  walkOwnBody(fn, (node) => {
    if (node.type !== 'ReturnStatement') return false
    if (node.argument) out.push(node.argument)
    return true
  })
  return out
}

function unwrap(node) {
  let n = node
  while (n && (n.type === 'TSAsExpression' || n.type === 'TSSatisfiesExpression')) n = n.expression
  return n
}

function holdsElement(declarator, init, sourceCode) {
  if (ELEMENT_NAME.test(declarator.id.name)) return true
  const typeArgs = init.typeArguments || init.typeParameters
  const annotation = declarator.id.typeAnnotation
  return [typeArgs, annotation].some((n) => n && ELEMENT_TYPE.test(sourceCode.getText(n)))
}

function isMutableRefDeclarator(node, sourceCode) {
  if (node.type !== 'VariableDeclarator' || node.id.type !== 'Identifier') return false
  const init = unwrap(node.init)
  return (
    init?.type === 'CallExpression' &&
    MUTABLE_REF.has(calleeName(init)) &&
    !holdsElement(node, init, sourceCode)
  )
}

function mutableRefsDeclaredIn(fn, sourceCode) {
  const names = new Set()
  walkOwnBody(fn, (node) => {
    if (isMutableRefDeclarator(node, sourceCode)) names.add(node.id.name)
    return false
  })
  return names
}

function checkReturnedObject(context, name, refs, value) {
  for (const prop of value.properties) {
    if (prop.type !== 'Property') continue
    const v = unwrap(prop.value)
    if (v?.type === 'Identifier' && refs.has(v.name)) {
      context.report({ node: prop, messageId: 'mutableRef', data: { name, ref: v.name } })
    }
  }
}

function checkReturn(context, name, refs, value) {
  if (value.type === 'CallExpression' && calleeName(value) === 'reactive') {
    context.report({ node: value, messageId: 'reactiveReturn', data: { name } })
  } else if (value.type === 'Identifier' && refs.has(value.name)) {
    context.report({ node: value, messageId: 'mutableRef', data: { name, ref: value.name } })
  } else if (value.type === 'ObjectExpression') {
    checkReturnedObject(context, name, refs, value)
  }
}

function checkComposable(context, sourceCode, ts, { name, fn, typed }) {
  if (ts && !typed) {
    context.report({
      node: fn,
      messageId: 'missingReturnType',
      data: { name, suffix: name.slice(3) }
    })
  }
  const refs = mutableRefsDeclaredIn(fn, sourceCode)
  for (const raw of ownReturns(fn)) {
    const value = unwrap(raw)
    if (value) checkReturn(context, name, refs, value)
  }
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'An exported composable returns read-only state: no reactive() object, no raw ref(), and ' +
        'an explicit return type in TypeScript (see the webkit-composables rule shipped by `npx ' +
        '@aziontech/webkit init`).'
    },
    schema: [],
    messages: {
      reactiveReturn:
        '`{{name}}` returns `reactive(...)`; destructuring it loses reactivity. Return an object of refs, computed values and functions.',
      mutableRef:
        '`{{name}}` returns `{{ref}}`, a `ref()` the caller can reassign. Return `readonly({{ref}})` (or a `computed`) and expose writes through a function.',
      missingReturnType:
        '`{{name}}` has no explicit return type. Declare it (and export it when a consumer holds the result, e.g. `Use{{suffix}}Return`).'
    }
  },
  create(context) {
    const filename = context.filename ?? context.getFilename()
    if (!isComposableFile(filename)) return {}
    const ts = isTsFile(filename)
    const sourceCode = context.sourceCode ?? context.getSourceCode()

    return {
      Program(program) {
        for (const composable of exportedComposables(program)) {
          checkComposable(context, sourceCode, ts, composable)
        }
      }
    }
  }
}
