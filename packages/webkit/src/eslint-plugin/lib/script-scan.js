const REGEX_AFTER_WORD = new Set([
  'return',
  'typeof',
  'instanceof',
  'in',
  'of',
  'new',
  'delete',
  'void',
  'throw',
  'case',
  'do',
  'else',
  'yield',
  'await'
])

function braceKind(code, parent) {
  if (parent === 'type') return 'type'
  const tail = code.slice(-300)
  if (/\binterface\s+[\w$]+[^{};]*$/.test(tail)) return 'type'
  if (/\btype\s+[\w$]+[^=;{}]*=[^;{}=]*$/.test(tail)) return 'type'
  if (/define(Props|Emits|Slots|Model)\s*<\s*$/.test(tail)) return 'type'
  if (/defineExpose\s*\(\s*$/.test(tail)) return 'expose'
  return 'code'
}

function skipString(text, i, to, quote) {
  let j = i + 1
  while (j < to) {
    const ch = text[j]
    if (ch === '\\') j += 2
    else if (ch === quote || ch === '\n') return j + 1
    else j++
  }
  return to
}

function scanTemplate(s, pos) {
  const { text, to } = s
  let j = pos
  while (j < to) {
    const ch = text[j]
    if (ch === '\\') j += 2
    else if (ch === '`') {
      s.code += '``'
      s.last = 'close'
      return j + 1
    } else if (ch === '$' && text[j + 1] === '{') {
      s.stack.push({ kind: 'tpl' })
      s.code += '${'
      s.last = 'punct'
      return j + 2
    } else j++
  }
  return to
}

const topKind = (s) => s.stack[s.stack.length - 1]?.kind ?? 'code'

function lineComment(s, i) {
  let j = s.text.indexOf('\n', i)
  if (j < 0 || j > s.to) j = s.to
  s.out.push({ start: i, end: j, ctx: topKind(s), js: s.js, scanEnd: s.to })
  return j
}

function blockComment(s, i) {
  let j = s.text.indexOf('*/', i + 2)
  j = j < 0 || j + 2 > s.to ? s.to : j + 2
  s.out.push({ start: i, end: j, ctx: topKind(s), js: s.js, scanEnd: s.to })
  return j
}

function quoted(s, i) {
  const next = skipString(s.text, i, s.to, s.text[i])
  s.code += '""'
  s.last = 'close'
  return next
}

const template = (s, i) => scanTemplate(s, i + 1)

function regexBodyEnd(text, from, to) {
  let j = from
  let inClass = false
  while (j < to) {
    const ch = text[j]
    if (ch === '\\') {
      j += 2
      continue
    }
    if (ch === '\n' || (ch === '/' && !inClass)) break
    if (ch === '[') inClass = true
    else if (ch === ']') inClass = false
    j++
  }
  return j
}

function isDivision(s) {
  if (s.last === 'num' || s.last === 'close') return true
  return s.last === 'word' && !REGEX_AFTER_WORD.has(s.lastWord)
}

function slash(s, i) {
  const { text, to } = s
  const division = isDivision(s)
  const j = division ? i + 1 : regexBodyEnd(text, i + 1, to)
  if (division || text[j] !== '/') {
    s.code += '/'
    s.last = 'punct'
    return i + 1
  }
  let k = j + 1
  while (k < to && /[a-z]/i.test(text[k])) k++
  s.code += '/r/'
  s.last = 'close'
  return k
}

function openBrace(s, i) {
  s.stack.push({ kind: braceKind(s.code, topKind(s)) })
  s.code += '{'
  s.last = 'punct'
  return i + 1
}

function closeBrace(s, i) {
  const popped = s.stack.pop()
  if (popped?.kind === 'tpl') return scanTemplate(s, i + 1)
  s.code += '}'
  s.last = 'close'
  return i + 1
}

function word(s, i) {
  let j = i + 1
  while (j < s.to && /[\w$]/.test(s.text[j])) j++
  s.lastWord = s.text.slice(i, j)
  s.code += s.lastWord
  s.last = 'word'
  return j
}

function number(s, i) {
  let j = i + 1
  while (j < s.to && /[\w.]/.test(s.text[j])) j++
  s.code += s.text.slice(i, j)
  s.last = 'num'
  return j
}

function closer(s, i) {
  s.code += s.text[i]
  s.last = 'close'
  return i + 1
}

function other(s, i) {
  const c = s.text[i]
  s.code += c
  if (!/\s/.test(c)) s.last = 'punct'
  return i + 1
}

const CHAR_HANDLERS = {
  '"': quoted,
  "'": quoted,
  '`': template,
  '{': openBrace,
  '}': closeBrace,
  ')': closer,
  ']': closer
}

const SLASH_HANDLERS = { '/': lineComment, '*': blockComment }

function handlerFor(c, n) {
  if (c === '/') return SLASH_HANDLERS[n] ?? slash
  if (CHAR_HANDLERS[c]) return CHAR_HANDLERS[c]
  if (/[A-Za-z_$]/.test(c)) return word
  return /[0-9]/.test(c) ? number : other
}

export function scanScript(text, from, to, js, out) {
  const s = { text, to, js, out, stack: [], code: '', last: 'punct', lastWord: '' }
  let i = from
  if (text.startsWith('#!', i)) {
    const eol = text.indexOf('\n', i)
    i = eol < 0 ? to : eol
  }
  while (i < to) i = handlerFor(text[i], text[i + 1])(s, i)
}
