import { scanScript } from './script-scan.js'

const CODE_EXT = /\.(vue|ts|tsx|js|jsx|mjs|cjs)$/
const TEST_PATH = /\.(test|spec)\.[^/]+$|(^|\/)(test|tests|__tests__|fixtures?)\//
const JS_EXT = /\.(js|jsx|mjs|cjs)$/

const DIRECTIVE =
  /^(!|eslint-|eslint\s|global\s|@ts-|prettier-ignore|@vite-ignore|@vue-ignore|v8\s+ignore|c8\s+ignore|istanbul\s+ignore|[#@]__PURE__|[#@]__NO_SIDE_EFFECTS__|#\s*source(Mapping)?URL|#(end)?region\b|webpack[A-Z]|azion-ui-migrate-ok$)/
const HTML_DIRECTIVE = /^(eslint-|prettier-ignore|azion-ui-migrate-ok$)/
const CODE_CONNECT_FILE = /\.figma\.(ts|js)$/
const CODE_CONNECT_DIRECTIVE = /^\/\/\s*(url|source|component)=\S/
const DEPRECATED_TAG = /@deprecated\b/
const JS_TYPE_TAG =
  /@(type|typedef|template|satisfies|callback|import|overload)\b|@(param|arg|argument|returns?|prop|property)\s*\{/
const API_DECL = /^(export\s+)?(declare\s+)?(type|interface)\s/
const API_MACRO =
  /^((export\s+)?(const|let)\s+[\w$]+(\s*:[^=]+)?\s*=\s*)?(withDefaults\s*\(\s*)?define(Props|Emits|Slots|Model|Expose|Options)\b/
export const isCommentScoped = (rel) => CODE_EXT.test(rel) && !TEST_PATH.test(rel)

function readBraced(s, from) {
  if (s[from] !== '{') return from
  let depth = 0
  for (let i = from; i < s.length; i++) {
    if (s[i] === '{') depth++
    else if (s[i] === '}' && --depth === 0) return i + 1
  }
  return s.length
}

function keepTag(tag) {
  const head = tag.match(/^@(\w+)\s*/)
  if (!head) return ''
  const name = head[1]
  if (name === 'deprecated' || name === 'import' || name === 'overload') return tag
  let i = head[0].length
  const typeEnd = readBraced(tag, i)
  const type = tag.slice(i, typeEnd).trim()
  i = typeEnd
  const rest = tag.slice(i).trim()
  const firstWord = rest.match(/^(\[[^\]]*\]|[\w$.]+)/)?.[0] ?? ''
  const parts = [`@${name}`]
  if (type) parts.push(type)
  if (
    ['param', 'arg', 'argument', 'property', 'prop', 'typedef', 'callback', 'template'].includes(
      name
    )
  ) {
    if (firstWord) parts.push(firstWord)
  } else if (!['type', 'returns', 'return', 'satisfies'].includes(name)) {
    return ''
  }
  return parts.join(' ')
}

function stripTypedJsdoc(body, indent = '') {
  const lines = body
    .replace(/^\/\*\*/, '')
    .replace(/\*\/$/, '')
    .split('\n')
    .map((l) => l.replace(/^\s*\*?\s?/, '').trimEnd())
  const tags = []
  let open = 0
  for (const line of lines) {
    if (open > 0 && tags.length) {
      tags[tags.length - 1] += '\n' + line
    } else if (line.trim().startsWith('@')) {
      tags.push(line.trim())
    } else continue
    open =
      (tags[tags.length - 1].match(/\{/g) ?? []).length -
      (tags[tags.length - 1].match(/\}/g) ?? []).length
  }
  const kept = tags.map(keepTag).filter(Boolean)
  if (kept.length === 0) return ''
  if (kept.length === 1 && !kept[0].includes('\n')) return `/** ${kept[0]} */`
  const inner = kept.flatMap((t) => t.split('\n')).map((l) => `${indent} * ${l}`.trimEnd())
  return ['/**', ...inner, `${indent} */`].join('\n')
}

const squash = (s) => s.replace(/\s+/g, ' ').trim()

function commentInner(body) {
  const inner = body.startsWith('/*')
    ? body.slice(2, -2).replace(/^\*+/, '')
    : body.replace(/^\/+/, '')
  return inner.trim()
}

function classify(text, cm) {
  const body = text.slice(cm.start, cm.end)
  const inner = commentInner(body)
  if (DIRECTIVE.test(inner)) return 'directive'
  if (!body.startsWith('/**')) return 'prose'
  if (DEPRECATED_TAG.test(body)) return 'directive'
  if (cm.js && JS_TYPE_TAG.test(body)) {
    return squash(stripTypedJsdoc(body)) === squash(body) ? 'directive' : 'typed-prose'
  }
  const following = text.slice(cm.end, Math.min(cm.end + 400, cm.scanEnd))
  if (/^[ \t]*\r?\n[ \t]*\r?\n/.test(following)) return 'prose'
  if (cm.ctx === 'type' || cm.ctx === 'expose') return 'api'
  const next = following.replace(/^(\s|\/\/[^\n]*|\/\*[\s\S]*?\*\/)*/, '')
  return API_DECL.test(next) || API_MACRO.test(next) ? 'api' : 'prose'
}

function htmlComments(text, from, to, out) {
  const re = /<!--[\s\S]*?-->/g
  re.lastIndex = from
  let m
  while ((m = re.exec(text)) && m.index < to) {
    const inner = m[0].slice(4, -3).trim()
    out.push({
      start: m.index,
      end: m.index + m[0].length,
      kind: HTML_DIRECTIVE.test(inner) ? 'directive' : 'prose'
    })
  }
}

export function findComments(rel, text) {
  const raw = []
  const found = []
  if (rel.endsWith('.vue')) {
    const open = /<script\b([^>]*)>/g
    let cursor = 0
    let m
    while ((m = open.exec(text))) {
      const start = m.index + m[0].length
      const close = text.indexOf('</script>', start)
      const end = close < 0 ? text.length : close
      htmlComments(text, cursor, m.index, found)
      scanScript(text, start, end, !/lang\s*=\s*["']tsx?["']/.test(m[1]), raw)
      cursor = end
      open.lastIndex = end
    }
    htmlComments(text, cursor, text.length, found)
  } else {
    scanScript(text, 0, text.length, JS_EXT.test(rel), raw)
  }
  const codeConnect = CODE_CONNECT_FILE.test(rel)
  for (const cm of raw) {
    const kind =
      codeConnect && CODE_CONNECT_DIRECTIVE.test(text.slice(cm.start, cm.end))
        ? 'directive'
        : classify(text, cm)
    found.push({ start: cm.start, end: cm.end, kind })
  }
  return found.sort((a, b) => a.start - b.start)
}

export function proseComments(rel, text) {
  return findComments(rel, text).filter((c) => c.kind === 'prose' || c.kind === 'typed-prose')
}
