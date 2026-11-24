import { templateBodyVisitorFactory } from '../lib/rule-utils.js'

const TOOLTIP_LIMIT = 80

const HINT_LIMIT = 280

const HELP_ICONS = new Set(['az-circle-info', 'az-info', 'az-circle-question', 'az-circle-help'])

const HELP_TRIGGERS = new Set(['tooltip', 'popovertrigger', 'hovercardtrigger'])

const LITERAL_TEXT = new Set(['kbd', 'code', 'pre', 'samp'])

const tagOf = (node) =>
  String(node?.rawName ?? '')
    .replace(/[-.]/g, '')
    .toLowerCase()

const squeeze = (text) => String(text).replace(/\s+/g, ' ').trim()

function literalOf(expression) {
  if (!expression) return null
  if (expression.type === 'Literal' && typeof expression.value === 'string') return expression.value
  if (expression.type === 'TemplateLiteral' && expression.expressions.length === 0)
    return expression.quasis.map((quasi) => quasi.value.cooked ?? '').join('')
  return null
}

function boundName(attribute) {
  if (attribute.key?.name?.name !== 'bind') return null
  const argument = attribute.key.argument
  return argument?.type === 'VIdentifier' ? argument.name : null
}

function attributeValue(attribute, name) {
  if (!attribute.directive)
    return attribute.key?.name === name ? (attribute.value?.value ?? '') : null
  return boundName(attribute) === name ? literalOf(attribute.value?.expression) : null
}

function staticAttribute(node, name) {
  for (const attribute of node.startTag?.attributes ?? []) {
    const value = attributeValue(attribute, name)
    if (value !== null) return value
  }
  return null
}

function hasClickListener(node) {
  return (node.startTag?.attributes ?? []).some(
    (attribute) =>
      attribute.directive &&
      attribute.key?.name?.name === 'on' &&
      attribute.key.argument?.type === 'VIdentifier' &&
      attribute.key.argument.name === 'click'
  )
}

function textOnlyQuestionMark(node) {
  const children = node.children ?? []
  let mark = false
  for (const child of children) {
    if (child.type === 'VText') {
      const text = child.value.trim()
      if (text === '') continue
      if (text !== '?' || mark) return false
      mark = true
      continue
    }
    if (child.type === 'VExpressionContainer' && literalOf(child.expression) === '?' && !mark) {
      mark = true
      continue
    }
    return false
  }
  return mark
}

function isQuestionMark(node) {
  if (LITERAL_TEXT.has(tagOf(node))) return false
  if (squeeze(staticAttribute(node, 'label') ?? '') === '?') return true
  return textOnlyQuestionMark(node)
}

function hasHelpIcon(node) {
  const tokens = [staticAttribute(node, 'class'), staticAttribute(node, 'icon')]
    .filter(Boolean)
    .flatMap((value) => value.split(/\s+/))
  return tokens.some((token) => HELP_ICONS.has(token))
}

function helpTriggerAbove(node) {
  let clickable = hasClickListener(node)
  let current = node.parent
  while (current && current.type === 'VElement') {
    const tag = tagOf(current)
    if (HELP_TRIGGERS.has(tag)) return tag === 'tooltip' && clickable ? null : current
    if (hasClickListener(current)) clickable = true
    current = current.parent
  }
  return null
}

const isHintSource = (filename) => /(^|[\\/])hint\.vue$/.test(String(filename ?? ''))

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Help beside a label is a Hint: the small info glyph that opens a short note on click. ' +
        'A Tooltip only names a control in a few words, a typed question mark or an info icon ' +
        'inside a Tooltip or Popover trigger is hand-made help, and an explanation longer than ' +
        'a short note belongs in a HelpPanel.'
    },
    schema: [],
    messages: {
      longTooltip:
        'A tooltip names a control in a few words. Put an explanation in a Hint (click-open note) ' +
        'or a Field description.',
      handMadeHelp: 'Use Hint for help beside a label.',
      longHint: 'Longer help goes in a HelpPanel.'
    }
  },
  create(context) {
    const factory = templateBodyVisitorFactory(context)
    if (!factory) return {}
    if (isHintSource(context.filename ?? context.getFilename?.())) return {}

    return factory({
      VElement(node) {
        const tag = tagOf(node)
        if (tag === 'tooltip') {
          const content = staticAttribute(node, 'content')
          if (content !== null && squeeze(content).length > TOOLTIP_LIMIT)
            context.report({ node: node.startTag, messageId: 'longTooltip' })
        }
        if (tag === 'hint') {
          const content = staticAttribute(node, 'content')
          if (content !== null && squeeze(content).length > HINT_LIMIT)
            context.report({ node: node.startTag, messageId: 'longHint' })
          return
        }
        if (isQuestionMark(node)) {
          context.report({ node: node.startTag, messageId: 'handMadeHelp' })
          return
        }
        if (hasHelpIcon(node) && helpTriggerAbove(node))
          context.report({ node: node.startTag, messageId: 'handMadeHelp' })
      }
    })
  }
}
