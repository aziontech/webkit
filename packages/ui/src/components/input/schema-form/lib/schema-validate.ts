import type { SchemaFormIssue, SchemaFormNode, SchemaFormSchema } from '../schema'
import { isRecord } from './schema-paths'

const isEmpty = (value: unknown) =>
  value === undefined ||
  value === null ||
  value === '' ||
  (Array.isArray(value) && value.length === 0)

function checkString(schema: SchemaFormSchema, text: string): SchemaFormIssue | null {
  if (schema.enum?.length && !schema.enum.map(String).includes(text)) return { key: 'enum' }
  if (schema.minLength !== undefined && [...text].length < schema.minLength)
    return { key: 'minLength', params: { min: schema.minLength } }
  if (schema.maxLength !== undefined && [...text].length > schema.maxLength)
    return { key: 'maxLength', params: { max: schema.maxLength } }
  if (schema.pattern) {
    try {
      if (!new RegExp(schema.pattern, 'u').test(text)) return { key: 'pattern' }
    } catch {
      return null
    }
  }
  return checkFormat(schema.format, text)
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u
const DATE = /^(\d{4})-(\d{2})-(\d{2})$/u

const validDate = (text: string) => {
  const match = DATE.exec(text)
  if (!match) return false
  const [year, month, day] = match.slice(1).map(Number) as [number, number, number]
  const date = new Date(Date.UTC(year, month - 1, day))
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  )
}

const validUri = (text: string) => {
  try {
    return Boolean(new URL(text).protocol)
  } catch {
    return false
  }
}

function checkFormat(format: unknown, text: string): SchemaFormIssue | null {
  if (format === 'email' && !EMAIL.test(text)) return { key: 'email' }
  if ((format === 'uri' || format === 'url') && !validUri(text)) return { key: 'uri' }
  if (format === 'date' && !validDate(text)) return { key: 'date' }
  return null
}

const countIssue = (schema: SchemaFormSchema, count: number): SchemaFormIssue | null => {
  if (schema.minItems !== undefined && count < schema.minItems)
    return { key: 'minItems', params: { min: schema.minItems } }
  if (schema.maxItems !== undefined && count > schema.maxItems)
    return { key: 'maxItems', params: { max: schema.maxItems } }
  return null
}

export function parseNumber(text: string): number | undefined {
  const trimmed = text.trim()
  if (!trimmed) return undefined
  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : Number.NaN
}

const lowerBound = (schema: SchemaFormSchema, value: number): SchemaFormIssue | null => {
  if (schema.minimum !== undefined && value < schema.minimum)
    return { key: 'minimum', params: { min: schema.minimum } }
  if (schema.exclusiveMinimum !== undefined && value <= schema.exclusiveMinimum)
    return { key: 'minimum', params: { min: schema.exclusiveMinimum } }
  return null
}

const upperBound = (schema: SchemaFormSchema, value: number): SchemaFormIssue | null => {
  if (schema.maximum !== undefined && value > schema.maximum)
    return { key: 'maximum', params: { max: schema.maximum } }
  if (schema.exclusiveMaximum !== undefined && value >= schema.exclusiveMaximum)
    return { key: 'maximum', params: { max: schema.exclusiveMaximum } }
  return null
}

function checkNumber(
  schema: SchemaFormSchema,
  integer: boolean,
  value: number
): SchemaFormIssue | null {
  if (Number.isNaN(value)) return { key: integer ? 'integer' : 'number' }
  if (integer && !Number.isInteger(value)) return { key: 'integer' }
  return lowerBound(schema, value) ?? upperBound(schema, value)
}

export const listLines = (text: string) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

const isBlank = (value: unknown, draft: string | undefined): boolean =>
  draft !== undefined
    ? !draft.trim()
    : isEmpty(value) || (isRecord(value) && !Object.keys(value).length)

const checkJson = (draft: string | undefined): SchemaFormIssue | null => {
  if (draft === undefined) return null
  try {
    JSON.parse(draft)
    return null
  } catch {
    return { key: 'json' }
  }
}

function checkList(
  node: SchemaFormNode,
  value: unknown,
  draft: string | undefined
): SchemaFormIssue | null {
  const lines = draft !== undefined ? listLines(draft) : (value as unknown[]).map(String)
  const count = countIssue(node.schema, lines.length)
  if (count) return count
  const items = node.schema.items ?? {}
  for (const [index, line] of lines.entries()) {
    const issue =
      node.itemType === 'string'
        ? checkString(items, line)
        : checkNumber(items, node.itemType === 'integer', parseNumber(line) ?? Number.NaN)
    if (issue) return { ...issue, line: index + 1 }
  }
  return null
}

const numberIssue = (
  node: SchemaFormNode,
  value: unknown,
  draft: string | undefined
): SchemaFormIssue | null | undefined => {
  const widget = node.widget
  if (widget !== 'number' && (widget !== 'select' || typeof value !== 'number')) return undefined
  const number = draft !== undefined ? parseNumber(draft) : Number(value)
  const issue = checkNumber(node.schema, node.type === 'integer', number ?? Number.NaN)
  return issue || widget === 'number' ? issue : undefined
}

function checkFilled(
  node: SchemaFormNode,
  value: unknown,
  draft: string | undefined
): SchemaFormIssue | null {
  const { schema, widget } = node
  if (widget === 'repeat' || widget === 'multiselect')
    return countIssue(schema, Array.isArray(value) ? value.length : 0)
  if (widget === 'map' || widget === 'combobox') return null
  if (node.variants.length)
    return node.options.map(String).includes(String(value)) ? null : { key: 'enum' }
  if (widget === 'json') return checkJson(draft)
  const numeric = numberIssue(node, value, draft)
  if (numeric !== undefined) return numeric
  if (widget === 'list') return checkList(node, value, draft)
  return checkString(schema, String(value))
}

export function validateNode(
  node: SchemaFormNode,
  value: unknown,
  draft?: string
): SchemaFormIssue | null {
  const widget = node.widget
  if (widget === 'fieldset' || widget === 'section' || widget === 'switch') return null
  if (isBlank(value, draft)) return node.required ? { key: 'required' } : null
  return checkFilled(node, value, draft)
}
