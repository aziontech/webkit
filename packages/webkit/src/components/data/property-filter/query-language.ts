import {
  type FilteringProperty,
  operatorsOf,
  type PropertyFilterOperation,
  type PropertyFilterOperator,
  type PropertyFilterQuery,
  type PropertyFilterToken
} from '../../../composables/use-collection/lib/property-filter'
import { lexQuery, type QueryLexeme } from './lib/query-lexer'

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

const connectiveOf = (lexeme: QueryLexeme | undefined): PropertyFilterOperation | null => {
  if (!lexeme || lexeme.kind !== 'word' || lexeme.quoted) return null
  const word = lexeme.value.toLowerCase()
  return word === 'and' || word === 'or' ? word : null
}

const findProperty = (
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

type WalkState = {
  tokens: PropertyFilterToken[]
  connectives: PropertyFilterOperation[]
  error: QueryError | null
  expect: QueryRole
  property: FilteringProperty | undefined
  fieldName: string
  operator: PropertyFilterOperator | undefined
}

type WalkOptions = { properties: FilteringProperty[]; freeText: boolean; openTail: boolean }

const fail = (
  state: WalkState,
  code: QueryErrorCode,
  lexeme: QueryLexeme,
  params: Record<string, string | number> = {}
): void => {
  if (!state.error) state.error = { code, params, from: lexeme.from, to: lexeme.to }
}

const stepField = (
  state: WalkState,
  lexeme: QueryLexeme,
  next: QueryLexeme | undefined,
  options: WalkOptions
): void => {
  if (lexeme.kind === 'operator') {
    fail(state, 'missingValue', lexeme, { operator: lexeme.value })
    return
  }
  const known = findProperty(options.properties, lexeme.value)
  const tailField = options.openTail && !next && !lexeme.quoted && Boolean(known)
  if (next?.kind === 'operator' || tailField) {
    state.fieldName = lexeme.value
    state.property = known
    if (!known) fail(state, 'unknownField', lexeme, { field: lexeme.value })
    state.expect = 'operator'
    return
  }
  if (!options.freeText) fail(state, 'missingOperator', lexeme, { field: lexeme.value })
  state.tokens.push({ operator: ':', value: lexeme.value })
  state.expect = 'connective'
}

const stepOperator = (state: WalkState, lexeme: QueryLexeme): void => {
  const op = lexeme.value as PropertyFilterOperator
  if (lexeme.kind !== 'operator') {
    fail(state, 'missingOperator', lexeme, { field: state.fieldName })
  } else if (state.property && !operatorsOf(state.property).includes(op)) {
    fail(state, 'unknownOperator', lexeme, { operator: op, field: state.fieldName })
  }
  state.operator = op
  state.expect = 'value'
}

const stepValue = (state: WalkState, lexeme: QueryLexeme): void => {
  if (lexeme.kind === 'operator')
    fail(state, 'missingValue', lexeme, { operator: state.operator ?? '' })
  state.tokens.push({
    propertyKey: state.property?.key ?? state.fieldName,
    operator: state.operator ?? '=',
    value: lexeme.value
  })
  state.property = undefined
  state.expect = 'connective'
}

const stepConnective = (state: WalkState, lexeme: QueryLexeme): void => {
  const connective = connectiveOf(lexeme)
  if (connective) state.connectives.push(connective)
  else fail(state, 'expectedConnective', lexeme, { word: lexeme.value })
  state.expect = 'field'
}

const failIncomplete = (state: WalkState, last: QueryLexeme | undefined): void => {
  if (!last || state.error) return
  if (state.expect === 'operator') fail(state, 'missingOperator', last, { field: state.fieldName })
  else if (state.expect === 'value')
    fail(state, 'missingValue', last, { operator: state.operator ?? '' })
  else if (state.expect === 'field')
    fail(state, 'danglingConnective', last, { connective: last.value })
}

function walk(
  lexemes: QueryLexeme[],
  properties: FilteringProperty[],
  freeText: boolean,
  openTail = false
): Walk {
  const options: WalkOptions = { properties, freeText, openTail }
  const state: WalkState = {
    tokens: [],
    connectives: [],
    error: null,
    expect: 'field',
    property: undefined,
    fieldName: '',
    operator: undefined
  }
  const roles: QueryRole[] = []
  const owners: (FilteringProperty | undefined)[] = []
  lexemes.forEach((lexeme, index) => {
    roles.push(state.expect)
    owners.push(state.property)
    if (lexeme.quoted && !lexeme.closed)
      fail(state, 'unclosedQuote', lexeme, { position: lexeme.from + 1 })
    if (state.expect === 'field') stepField(state, lexeme, lexemes[index + 1], options)
    else if (state.expect === 'operator') stepOperator(state, lexeme)
    else if (state.expect === 'value') stepValue(state, lexeme)
    else stepConnective(state, lexeme)
  })
  failIncomplete(state, lexemes.at(-1))
  return {
    tokens: state.tokens,
    connectives: state.connectives,
    error: state.error,
    roles,
    owners,
    next: state.expect,
    nextProperty: state.property,
    nextOperator: state.expect === 'value' ? state.operator : undefined
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
