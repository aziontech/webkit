import { readFileSync } from 'node:fs'
import { dirname, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

import { templateBodyVisitorFactory } from '../lib/rule-utils.js'

const OWNERS_URL = new URL('../owners.json', import.meta.url)
const PACKAGE_ROOT = dirname(dirname(dirname(fileURLToPath(OWNERS_URL))))
const HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml'
const TABLE_PARTS = ['thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'colgroup', 'col']
const INLINE_LINK_CLASS = 'text-link'

let cache = null

function loadOwners() {
  if (!cache) cache = JSON.parse(readFileSync(OWNERS_URL, 'utf8'))
  return cache
}

function ownerOfElement(owners, name) {
  if (owners.elements[name]) return { key: name, entry: owners.elements[name] }
  if (TABLE_PARTS.includes(name)) return { key: 'table', entry: owners.elements.table }
  return null
}

function packagePath(filename) {
  const rel = relative(PACKAGE_ROOT, filename)
  if (!rel || rel.startsWith('..')) return null
  return rel.split(sep).join('/')
}

function isOwnedBy(entry, rel) {
  if (!rel) return false
  return Object.keys(entry.owners).some((owner) => rel === owner || rel.startsWith(`${owner}/`))
}

function stringsIn(expression) {
  const found = []
  const visit = (node) => {
    if (!node || typeof node !== 'object') return
    if (node.type === 'Literal' && typeof node.value === 'string') found.push(node.value)
    if (node.type === 'TemplateLiteral' && node.expressions.length === 0) {
      found.push(node.quasis[0].value.cooked)
    }
    for (const key of ['test', 'consequent', 'alternate', 'left', 'right', 'expression']) {
      if (node[key]) visit(node[key])
    }
    if (Array.isArray(node.elements)) node.elements.forEach(visit)
  }
  visit(expression)
  return found
}

function classTokens(value) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => token.replace(/^!/, '').split(':').pop().replace(/!$/, ''))
}

function staticAttribute(node, name) {
  return (node.startTag?.attributes ?? []).find(
    (attr) => !attr.directive && attr.key?.name === name
  )
}

function boundAttribute(node, name) {
  return (node.startTag?.attributes ?? []).find(
    (attr) =>
      attr.directive &&
      attr.key?.name?.name === 'bind' &&
      attr.key.argument?.type === 'VIdentifier' &&
      attr.key.argument.name === name
  )
}

function isInlineLink(node) {
  const value = staticAttribute(node, 'class')?.value?.value ?? ''
  return classTokens(value).includes(INLINE_LINK_CLASS)
}

function createChecker(context) {
  const owners = loadOwners()
  const useOwners = context.options[0]?.owners === true
  const rel = useOwners ? packagePath(context.filename ?? context.getFilename()) : null
  const allowed = (entry) => useOwners && isOwnedBy(entry, rel)
  return {
    element(node, name) {
      const hit = ownerOfElement(owners, name)
      if (!hit || allowed(hit.entry)) return
      if (hit.key === 'a' && isInlineLink(node)) return
      context.report({
        node: node.startTag,
        messageId: 'element',
        data: { name, use: hit.entry.use }
      })
    },
    role(node, name) {
      const entry = owners.roles[name]
      if (!entry || allowed(entry)) return
      context.report({ node, messageId: 'role', data: { name, use: entry.use } })
    },
    classText(node, text) {
      for (const token of classTokens(text)) {
        const entry = owners.classes[token]
        if (!entry || allowed(entry)) continue
        context.report({ node, messageId: 'className', data: { name: token, use: entry.use } })
      }
    }
  }
}

function checkTag(check, node) {
  if (node.namespace === HTML_NAMESPACE && node.rawName === node.name) {
    check.element(node, node.name)
  }
  if (node.rawName !== 'component') return
  const is = staticAttribute(node, 'is')
  if (is?.value) check.element(node, is.value.value)
  const bound = boundAttribute(node, 'is')
  for (const name of stringsIn(bound?.value?.expression)) check.element(node, name)
}

function checkRoles(check, node) {
  const role = staticAttribute(node, 'role')
  for (const name of (role?.value?.value ?? '').split(/\s+/).filter(Boolean)) {
    check.role(role, name)
  }
  const boundRole = boundAttribute(node, 'role')
  for (const name of stringsIn(boundRole?.value?.expression)) check.role(boundRole, name)
}

function checkClasses(check, node) {
  const staticClass = staticAttribute(node, 'class')
  if (staticClass?.value) check.classText(staticClass, staticClass.value.value)
  const boundClass = boundAttribute(node, 'class')
  for (const text of stringsIn(boundClass?.value?.expression)) check.classText(boundClass, text)
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'A native control element (button, a, input, textarea, select, dialog, table, progress, ' +
        'hr, kbd), an ARIA widget role (dialog, menu, listbox, tab, switch, checkbox, tooltip, ' +
        'progressbar) or a marker class (animate-spin, animate-pulse) belongs to the Azion UI ' +
        'component that owns it. Anywhere else, render that component instead.'
    },
    schema: [
      {
        type: 'object',
        properties: { owners: { type: 'boolean' } },
        additionalProperties: false
      }
    ],
    messages: {
      element: 'Raw <{{name}}> outside its owners. Use {{use}} (src/eslint-plugin/owners.json).',
      role: 'role="{{name}}" outside its owners. Use {{use}} (src/eslint-plugin/owners.json).',
      className: '{{name}} outside its owner. Use {{use}} (src/eslint-plugin/owners.json).'
    }
  },
  create(context) {
    const check = createChecker(context)
    const scriptVisitor = {
      Literal(node) {
        if (typeof node.value === 'string') check.classText(node, node.value)
      },
      TemplateElement(node) {
        check.classText(node, node.value.cooked ?? '')
      }
    }
    const factory = templateBodyVisitorFactory(context)
    if (!factory) return scriptVisitor
    const templateVisitor = {
      VElement(node) {
        checkTag(check, node)
        checkRoles(check, node)
        checkClasses(check, node)
      }
    }
    return factory(templateVisitor, scriptVisitor)
  }
}
