import { templateBodyVisitorFactory } from '../util.js'

const SHELL = new Set(['bash', 'sh', 'shell', 'zsh', 'console'])

const OUTPUT_COMMENT =
  /^#\s*(?:HTTP\/\d|=>|->|→|⇒|output\b|outputs?:|returns?\b|prints?\b|expected\b|result\b|response\b|\d{3}\b|[{["]|v?\d+\.\d+)/i

const PROMPT = /^\$ /

function keyName(property) {
  if (property.type !== 'Property' || property.computed) return null
  if (property.key.type === 'Identifier') return property.key.name
  if (property.key.type === 'Literal') return String(property.key.value)
  return null
}

function staticString(node) {
  if (!node) return null
  if (node.type === 'Literal' && typeof node.value === 'string') return node.value
  if (node.type === 'TemplateLiteral' && node.expressions.length === 0) {
    return node.quasis[0]?.value.cooked ?? null
  }
  return null
}

export function outputLine(code) {
  const lines = code.split('\n').map((line) => line.trim())
  const prompted = lines.some((line) => PROMPT.test(line))
  if (prompted) {
    let continues = false
    for (const line of lines) {
      if (PROMPT.test(line)) {
        continues = line.endsWith('\\')
        continue
      }
      if (continues) {
        continues = line.endsWith('\\')
        continue
      }
      if (line && !line.startsWith('#')) return line
    }
  }
  let commands = 0
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index]
    if (!line) continue
    if (!line.startsWith('#')) {
      commands++
      continue
    }
    if (commands === 0 || line.startsWith('#!')) continue
    if (OUTPUT_COMMENT.test(line)) return line
    const rest = lines.slice(index + 1).filter(Boolean)
    if (rest.every((next) => next.startsWith('#'))) return line
  }
  return null
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Warn when a shell code sample (CodeBlock tab, DocCodeGroup sample) mixes what the reader runs with what the command prints: a `# HTTP/2 200` comment after the command, or output lines in a `$`-prompted transcript.'
    },
    schema: [],
    messages: {
      output:
        "This shell sample holds expected output ('{{line}}'). A command block holds only what the reader runs, so the copy control copies exactly that: move the output to the sample's `output` field (DocCodeGroup), a `<CodeBlock kind=\"output\">`, or the prose."
    }
  },
  create(context) {
    function check(node) {
      let language = null
      let code = null
      let codeNode = null
      for (const property of node.properties) {
        const key = keyName(property)
        if (key === 'language' || key === 'lang') language = staticString(property.value)
        if (key === 'code') {
          code = staticString(property.value)
          codeNode = property.value
        }
      }
      if (!language || !SHELL.has(language.toLowerCase()) || code === null) return
      const line = outputLine(code)
      if (line) context.report({ node: codeNode, messageId: 'output', data: { line } })
    }

    const scriptVisitor = { ObjectExpression: check }
    const factory = templateBodyVisitorFactory(context)
    return factory ? factory({ ObjectExpression: check }, scriptVisitor) : scriptVisitor
  }
}
