interface ColumnType {
  value: string
  description: string
  glyph: string
}

export const TYPES: ColumnType[] = [
  { value: 'int2', description: 'Signed two-byte integer', glyph: '#' },
  { value: 'int4', description: 'Signed four-byte integer', glyph: '#' },
  { value: 'int8', description: 'Signed eight-byte integer', glyph: '#' },
  { value: 'float4', description: 'Single precision floating-point number', glyph: '#' },
  { value: 'float8', description: 'Double precision floating-point number', glyph: '#' },
  { value: 'numeric', description: 'Exact number of selectable precision', glyph: '#' },
  { value: 'json', description: 'Textual JSON data', glyph: '{}' },
  { value: 'jsonb', description: 'Binary JSON data, decomposed', glyph: '{}' },
  { value: 'text', description: 'Variable-length character string', glyph: 'T' },
  { value: 'varchar', description: 'Variable-length string with a limit', glyph: 'T' },
  { value: 'uuid', description: 'Universally unique identifier', glyph: '#' },
  { value: 'bool', description: 'Logical boolean, true or false', glyph: 'B' },
  { value: 'date', description: 'Calendar date: year, month, day', glyph: '@' },
  { value: 'timestamp', description: 'Date and time', glyph: '@' },
  { value: 'timestamptz', description: 'Date and time, with time zone', glyph: '@' }
]

export const INTEGER_TYPES = ['int2', 'int4', 'int8']

export const ON_DELETE = [
  { value: 'NO ACTION', label: 'No action' },
  { value: 'CASCADE', label: 'Cascade' },
  { value: 'SET NULL', label: 'Set null' }
]

export const glyphOf = (value: string) => TYPES.find((type) => type.value === value)?.glyph ?? '#'

export const filterTypes = (query: string) => {
  const term = query.trim().toLowerCase()
  if (!term) return TYPES
  return TYPES.filter(
    (type) => type.value.includes(term) || type.description.toLowerCase().includes(term)
  )
}
