import { templateBodyVisitorFactory } from '../util.js'

const VIEWPORT_MINUS = String.raw`calc\((?:\s|_)*100[dsl]?vh(?:\s|_)*-`

const CLASS_HACK = new RegExp(String.raw`^!?(?:min-h|h|size)-\[${VIEWPORT_MINUS}`)

const STYLE_HACK = new RegExp(
  String.raw`(?:^|[;{\s])((?:min-)?height\s*:\s*${VIEWPORT_MINUS}[^;]*)`,
  'g'
)

const STYLE_PINNED = /position\s*:\s*(?:sticky|fixed)/

const VALUE_HACK = new RegExp(String.raw`^\s*${VIEWPORT_MINUS}`)

const HEIGHT_KEYS = new Set(['height', 'minHeight', 'min-height', 'blockSize', 'minBlockSize'])

const utilityOf = (token) => {
  let depth = 0
  let start = 0
  for (let i = 0; i < token.length; i++) {
    const ch = token[i]
    if (ch === '[' || ch === '(') depth++
    else if (ch === ']' || ch === ')') depth--
    else if (ch === ':' && depth === 0) start = i + 1
  }
  return token.slice(start)
}

const tokensOf = (classString) =>
  String(classString || '')
    .split(/\s+/)
    .filter(Boolean)

const pinnedClass = (classString) =>
  tokensOf(classString)
    .map(utilityOf)
    .some((u) => u === 'sticky' || u === 'fixed')

export function viewportHeightClasses(classString) {
  if (pinnedClass(classString)) return []
  const tokens = tokensOf(classString)
  const utilities = tokens.map(utilityOf)
  return tokens.filter((_, i) => CLASS_HACK.test(utilities[i]))
}

export function viewportHeightStyles(styleString) {
  const text = String(styleString || '')
  if (STYLE_PINNED.test(text)) return []
  return [...text.matchAll(STYLE_HACK)].map((m) => m[1].trim())
}

const staticClassOf = (element) => {
  for (const attr of element?.startTag?.attributes ?? []) {
    if (!attr.directive && attr.key?.name === 'class') return attr.value?.value ?? ''
  }
  return ''
}

const insidePinnedElement = (node) => {
  for (let parent = node.parent; parent; parent = parent.parent) {
    if (parent.type === 'VElement' && pinnedClass(staticClassOf(parent))) return true
  }
  return false
}

const keyName = (property) => {
  const key = property?.key
  if (!key || property.computed) return null
  if (key.type === 'Identifier') return key.name
  if (key.type === 'Literal' && typeof key.value === 'string') return key.value
  return null
}

const pinnedObject = (object) =>
  (object?.properties ?? []).some(
    (p) =>
      keyName(p) === 'position' &&
      p.value?.type === 'Literal' &&
      (p.value.value === 'sticky' || p.value.value === 'fixed')
  )

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow sizing a page body to the viewport minus the chrome above it (`h-[calc(100dvh-…)]`, `min-h-[calc(100vh-…)]`, `height: calc(100dvh - …)`): it breaks as soon as the header, a notification or the tools region changes. Inside `ConsoleLayout`, `data-layout-fill` on the page root makes the main a fixed-height region the root fills. A `sticky` or `fixed` element may cap itself to the viewport.'
    },
    schema: [],
    messages: {
      viewportCalc:
        "`{{value}}` sizes the page to the viewport minus the chrome above it, so it overflows or leaves a gap as soon as the header, a notification or the tools region changes. Inside `ConsoleLayout`, put `data-layout-fill` on the page body's root: the main becomes a fixed-height, non-scrolling region the root fills, and the panes inside take `flex-1 min-h-0`. Only a pinned (`sticky` or `fixed`) element may size itself against the viewport."
    }
  },
  create(context) {
    const report = (node, value) =>
      context.report({ node, messageId: 'viewportCalc', data: { value } })

    const checkString = (node, text) => {
      if (insidePinnedElement(node)) return
      for (const value of viewportHeightClasses(text)) report(node, value)
      for (const value of viewportHeightStyles(text)) report(node, value)
    }

    const checkLiteral = (node) => {
      if (typeof node.value !== 'string') return
      const property =
        node.parent?.type === 'Property' && node.parent.value === node ? node.parent : null
      if (property && HEIGHT_KEYS.has(keyName(property))) {
        if (VALUE_HACK.test(node.value) && !pinnedObject(property.parent)) {
          report(node, `${keyName(property)}: ${node.value.trim()}`)
        }
        return
      }
      checkString(node, node.value)
    }

    const scriptVisitor = {
      Literal: checkLiteral,
      TemplateElement(node) {
        checkString(node, node.value?.cooked ?? node.value?.raw ?? '')
      }
    }

    const templateVisitor = {
      ...scriptVisitor,
      'VAttribute[directive=false]'(node) {
        const name = node.key?.name
        const text = node.value?.value
        if (typeof text !== 'string' || insidePinnedElement(node)) return
        if (name === 'class') {
          for (const value of viewportHeightClasses(text)) report(node, value)
        } else if (name === 'style') {
          for (const value of viewportHeightStyles(text)) report(node, value)
        }
      }
    }

    const factory = templateBodyVisitorFactory(context)
    return factory ? factory(templateVisitor, scriptVisitor) : scriptVisitor
  }
}
