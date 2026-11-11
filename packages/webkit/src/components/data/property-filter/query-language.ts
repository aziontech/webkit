import {
  type FilteringProperty,
  operatorsOf,
  PROPERTY_FILTER_OPERATORS,
  type PropertyFilterOperation,
  type PropertyFilterOperator,
  type PropertyFilterQuery,
  type PropertyFilterToken
} from '../../../composables/use-collection/property-filter'

export type QueryLexeme = {
  kind: 'word' | 'operator'
  text: string
  value: string
  from: number
  to: number
  quoted: boolean
  closed: boolean
}

/** A suggestion for the word at the caret in query mode; `insert` replaces that word. */
export type PropertyFilterQuerySuggestion = { label: string; insert: string; description?: string }

/** Payload of `submit`: the query string and its flat token list when it parses into one. */
export type PropertyFilterSubmit = { text: string; query: PropertyFilterQuery | null }

export type QueryRole = 'field' | 'operator' | 'value' | 'connective'

export type QueryErrorCode =
  | 'unknownField'
  | 'unknownOperator'
  | 'missingOperator'
  | 'missingValue'
  | 'expectedConnective'
  | 'danglingConnective'
  | 'unclosedQuote'

export type QueryError = {
  code: QueryErrorCode
  params: Record<string, string | number>
  from: number
  to: number
}

export type QueryContext = {
  role: QueryRole
  property?: FilteringProperty
  operator?: PropertyFilterOperator
  word: string
  from: number
  to: number
}

export type QueryParse = {
  tokens: PropertyFilterToken[]
  connectives: PropertyFilterOperation[]
  error: QueryError | null
}

const OPERATOR_CHARS = '!=:^<>'
const OPERATORS_BY_LENGTH = [...PROPERTY_FILTER_OPERATORS].sort((a, b) => b.length - a.length)

const isSpace = (char: string): boolean => /\s/.test(char)

export function lexQuery(text: string): QueryLexeme[] {
  const out: QueryLexeme[] = []
  let index = 0
  while (index < text.length) {
    const char = text[index] as string
    if (isSpace(char)) {
      index += 1
      continue
    }
    if (char === '"' || char === "'") {
      const close = text.indexOf(char, index + 1)
      const end = close === -1 ? text.length : close + 1
      out.push({
        kind: 'word',
        text: text.slice(index, end),
        value: text.slice(index + 1, close === -1 ? text.length : close),
        from: index,
        to: end,
        quoted: true,
        closed: close !== -1
      })
      index = end
      continue
    }
    const operator = OPERATORS_BY_LENGTH.find((op) => text.startsWith(op, index))
    if (operator) {
      out.push({
        kind: 'operator',
        text: operator,
        value: operator,
        from: index,
        to: index + operator.length,
        quoted: false,
        closed: true
      })
      index += operator.length
      continue
    }
    let end = index
    while (
      end < text.length &&
      !isSpace(text[end] as string) &&
      !OPERATOR_CHARS.includes(text[end] as string) &&
      text[end] !== '"' &&
      text[end] !== "'"
    ) {
      end += 1
    }
    if (end === index) end += 1
    const word = text.slice(index, end)
    out.push({
      kind: 'word',
      text: word,
      value: word,
      from: index,
      to: end,
      quoted: false,
      closed: true
    })
    index = end
  }
  return out
}

const connectiveOf = (lexeme: QueryLexeme | undefined): PropertyFilterOperation | null => {
  if (!lexeme || lexeme.kind !== 'word' || lexeme.quoted) return null
  const word = lexeme.value.toLowerCase()
  return word === 'and' || word === 'or' ? word : null
}

export const findProperty = (
  properties: FilteringProperty[],
  name: string
): FilteringProperty | undefined => {
  const needle = name.toLowerCase()
  return properties.find((p) => p.key.toLowerCase() === needle)
}

type Walk = QueryParse & {
  roles: QueryRole[]
  owners: (FilteringProperty | undefined)[]
  next: QueryRole
  nextProperty: FilteringProperty | undefined
  nextOperator: PropertyFilterOperator | undefined
}

function walk(
  lexemes: QueryLexeme[],
  properties: FilteringProperty[],
  freeText: boolean,
  openTail = false
): Walk {
  const tokens: PropertyFilterToken[] = []
  const connectives: PropertyFilterOperation[] = []
  const roles: QueryRole[] = []
  const owners: (FilteringProperty | undefined)[] = []
  let error: QueryError | null = null
  let expect = 'field' as QueryRole
  let property: FilteringProperty | undefined
  let fieldName = ''
  let operator: PropertyFilterOperator | undefined
  const fail = (code: QueryErrorCode, lexeme: QueryLexeme, params = {}): void => {
    if (!error) error = { code, params, from: lexeme.from, to: lexeme.to }
  }
  lexemes.forEach((lexeme, index) => {
    roles.push(expect)
    owners.push(property)
    if (lexeme.quoted && !lexeme.closed)
      fail('unclosedQuote', lexeme, { position: lexeme.from + 1 })
    if (expect === 'field') {
      const next = lexemes[index + 1]
      if (lexeme.kind === 'operator') {
        fail('missingValue', lexeme, { operator: lexeme.value })
        return
      }
      const tailField =
        openTail && !next && !lexeme.quoted && Boolean(findProperty(properties, lexeme.value))
      if (next?.kind === 'operator' || tailField) {
        fieldName = lexeme.value
        property = findProperty(properties, lexeme.value)
        if (!property) fail('unknownField', lexeme, { field: lexeme.value })
        expect = 'operator'
        return
      }
      if (!freeText) fail('missingOperator', lexeme, { field: lexeme.value })
      tokens.push({ operator: ':', value: lexeme.value })
      expect = 'connective'
      return
    }
    if (expect === 'operator') {
      const op = lexeme.value as PropertyFilterOperator
      if (lexeme.kind !== 'operator') {
        fail('missingOperator', lexeme, { field: fieldName })
      } else if (property && !operatorsOf(property).includes(op)) {
        fail('unknownOperator', lexeme, { operator: op, field: fieldName })
      }
      operator = op
      expect = 'value'
      return
    }
    if (expect === 'value') {
      if (lexeme.kind === 'operator') fail('missingValue', lexeme, { operator: operator ?? '' })
      tokens.push({
        propertyKey: property?.key ?? fieldName,
        operator: operator ?? '=',
        value: lexeme.value
      })
      property = undefined
      expect = 'connective'
      return
    }
    const connective = connectiveOf(lexeme)
    if (connective) {
      connectives.push(connective)
      expect = 'field'
      return
    }
    fail('expectedConnective', lexeme, { word: lexeme.value })
    expect = 'field'
  })
  const last = lexemes.at(-1)
  if (last && !error) {
    if (expect === 'operator') fail('missingOperator', last, { field: fieldName })
    else if (expect === 'value') fail('missingValue', last, { operator: operator ?? '' })
    else if (expect === 'field') fail('danglingConnective', last, { connective: last.value })
  }
  return {
    tokens,
    connectives,
    error,
    roles,
    owners,
    next: expect,
    nextProperty: property,
    nextOperator: expect === 'value' ? operator : undefined
  }
}

export function parseQuery(
  text: string,
  properties: FilteringProperty[],
  freeText = true
): QueryParse {
  const { tokens, connectives, error } = walk(lexQuery(text), properties, freeText)
  return { tokens, connectives, error }
}

export function flatQuery(parse: QueryParse): PropertyFilterQuery | null {
  if (parse.error || !parse.tokens.length) return null
  const kinds = new Set(parse.connectives)
  if (kinds.size > 1) return null
  return { tokens: parse.tokens, operation: kinds.has('or') ? 'or' : 'and' }
}

export function queryContext(
  text: string,
  caret: number,
  properties: FilteringProperty[],
  freeText = true
): QueryContext {
  const lexemes = lexQuery(text)
  const index = lexemes.findIndex((l) => l.from <= caret && caret <= l.to)
  const current = lexemes[index]
  if (current) {
    const walked = walk(lexemes.slice(0, index + 1), properties, freeText, true)
    const previous = lexemes[index - 1]
    const role = walked.roles[index] ?? 'field'
    return {
      role,
      property: walked.owners[index],
      operator:
        role === 'value' && previous?.kind === 'operator'
          ? (previous.value as PropertyFilterOperator)
          : undefined,
      word: current.quoted ? current.value : current.text,
      from: current.from,
      to: current.to
    }
  }
  const walked = walk(
    lexemes.filter((l) => l.to < caret),
    properties,
    freeText,
    true
  )
  return {
    role: walked.next,
    property: walked.nextProperty,
    operator: walked.nextOperator,
    word: '',
    from: caret,
    to: caret
  }
}

export const quoteValue = (value: string): string =>
  /^[^\s"'!=:^<>]+$/.test(value) ? value : `"${value.replaceAll('"', '')}"`
