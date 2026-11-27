import type { SchemaEditorRelation } from '../edit-schema.vue'

export interface DraftColumn {
  key: string
  name: string
  type: string
  primaryKey: boolean
  defaultValue: string
}

export interface DraftTable {
  name: string
  columns: DraftColumn[]
  relations: SchemaEditorRelation[]
}

export const columnDefinition = [
  { key: 'name', label: 'Name', required: true },
  { key: 'type', label: 'Type' },
  { key: 'defaultValue', label: 'Default' },
  { key: 'primaryKey', label: 'Primary' }
]

export const relationDefinition = [
  { key: 'column', label: 'Column', required: true },
  { key: 'table', label: 'References table', required: true },
  { key: 'references', label: 'References column', required: true },
  { key: 'onDelete', label: 'On delete' }
]

export const createDraftIds = () => {
  let uid = 0
  const newColumn = (
    name = '',
    type = 'text',
    primaryKey = false,
    defaultValue = ''
  ): DraftColumn => ({
    key: `c-${(uid += 1)}`,
    name,
    type,
    primaryKey,
    defaultValue
  })
  const newRelation = (): SchemaEditorRelation => ({
    key: `fk-${(uid += 1)}`,
    column: '',
    table: '',
    references: '',
    onDelete: 'NO ACTION'
  })
  const blankTable = (): DraftTable => ({
    name: '',
    columns: [
      newColumn('id', 'int8', true),
      newColumn('created_at', 'timestamptz', false, 'now()')
    ],
    relations: []
  })
  return { newColumn, newRelation, blankTable }
}

export const duplicateNamesOf = (columns: DraftColumn[]) => {
  const seen = new Map<string, number>()
  for (const column of columns) {
    const name = column.name.trim().toLowerCase()
    seen.set(name, (seen.get(name) ?? 0) + 1)
  }
  return new Set([...seen].filter(([, count]) => count > 1).map(([name]) => name))
}

export const tableNameProblem = (name: string) => {
  if (!name.trim()) return 'This field is required.'
  if (!/^[a-z_][a-z0-9_]*$/i.test(name.trim())) {
    return 'Start with a letter or an underscore; use letters, numbers and underscores.'
  }
  return ''
}

export const relationErrorOf = (relation: SchemaEditorRelation) => {
  const missing = (['column', 'table', 'references'] as const).find((key) => !relation[key])
  return missing
    ? { [missing]: 'Choose the column, the table and the column it references.' }
    : undefined
}

export const relationIncomplete = (relation: SchemaEditorRelation) =>
  !relation.column || !relation.table || !relation.references

export const createdDescription = (rows: number, relations: number) =>
  [
    rows ? `${rows} ${rows === 1 ? 'row' : 'rows'} imported from CSV.` : '',
    relations ? `${relations} foreign ${relations === 1 ? 'key' : 'keys'} added.` : ''
  ]
    .filter(Boolean)
    .join(' ') || undefined
