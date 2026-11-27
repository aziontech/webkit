import { PROPERTY_FILTER_OPERATORS } from '../../../../composables/use-collection/lib/property-filter'

export type QueryLexeme = {
  kind: 'word' | 'operator'
  text: string
  value: string
  from: number
  to: number
  quoted: boolean
  closed: boolean
}

const OPERATOR_CHARS = '!=:^<>'
const OPERATORS_BY_LENGTH = [...PROPERTY_FILTER_OPERATORS].sort((a, b) => b.length - a.length)

const isSpace = (char: string): boolean => /\s/.test(char)

const quotedLexeme = (text: string, index: number, quote: string): QueryLexeme => {
  const close = text.indexOf(quote, index + 1)
  const end = close === -1 ? text.length : close + 1
  return {
    kind: 'word',
    text: text.slice(index, end),
    value: text.slice(index + 1, close === -1 ? text.length : close),
    from: index,
    to: end,
    quoted: true,
    closed: close !== -1
  }
}

const operatorLexeme = (operator: string, index: number): QueryLexeme => ({
  kind: 'operator',
  text: operator,
  value: operator,
  from: index,
  to: index + operator.length,
  quoted: false,
  closed: true
})

const endsWord = (char: string): boolean =>
  isSpace(char) || OPERATOR_CHARS.includes(char) || char === '"' || char === "'"

const wordLexeme = (text: string, index: number): QueryLexeme => {
  let end = index
  while (end < text.length && !endsWord(text[end] as string)) end += 1
  if (end === index) end += 1
  const word = text.slice(index, end)
  return {
    kind: 'word',
    text: word,
    value: word,
    from: index,
    to: end,
    quoted: false,
    closed: true
  }
}

const lexemeAt = (text: string, index: number): QueryLexeme => {
  const char = text[index] as string
  if (char === '"' || char === "'") return quotedLexeme(text, index, char)
  const operator = OPERATORS_BY_LENGTH.find((op) => text.startsWith(op, index))
  return operator ? operatorLexeme(operator, index) : wordLexeme(text, index)
}

export function lexQuery(text: string): QueryLexeme[] {
  const out: QueryLexeme[] = []
  let index = 0
  while (index < text.length) {
    if (isSpace(text[index] as string)) {
      index += 1
      continue
    }
    const lexeme = lexemeAt(text, index)
    out.push(lexeme)
    index = lexeme.to
  }
  return out
}
