import type { SchemaEditorCsv, SchemaEditorRelation, SchemaEditorTable } from './schema-editor.vue'

export const sampleDatabase = 'acme-store'

export const sampleTables: SchemaEditorTable[] = [
  {
    name: 'customers',
    columns: [
      { name: 'id', type: 'int8', primaryKey: true, notNull: true, defaultValue: '' },
      { name: 'name', type: 'text', primaryKey: false, notNull: true, defaultValue: '' },
      { name: 'email', type: 'varchar', primaryKey: false, notNull: true, defaultValue: '' },
      {
        name: 'created_at',
        type: 'timestamptz',
        primaryKey: false,
        notNull: false,
        defaultValue: 'now()'
      }
    ],
    rowCount: 3
  },
  {
    name: 'orders',
    columns: [
      { name: 'id', type: 'int8', primaryKey: true, notNull: true, defaultValue: '' },
      { name: 'customer_id', type: 'int8', primaryKey: false, notNull: true, defaultValue: '' },
      { name: 'total', type: 'numeric', primaryKey: false, notNull: true, defaultValue: '' }
    ],
    rowCount: 2
  }
]

export const sampleCsv: SchemaEditorCsv = {
  file: { name: 'subscribers.csv', size: 412, type: 'text/csv' },
  text: [
    'id,customer_id,email,plan,active,joined_at',
    '1,1,ada@example.com,pro,true,2026-03-02',
    '2,2,lin@example.com,free,true,2026-04-18',
    '3,1,ops@example.com,team,false,2026-05-07',
    '4,3,"kim, j@example.com",pro,true,2026-06-21',
    '5,2,ravi@example.com,free,true,2026-07-30',
    '6,3,sol@example.com,team,true,2026-09-12'
  ].join('\n')
}

export const sampleRelations: SchemaEditorRelation[] = [
  {
    key: 'fk-seed',
    column: 'customer_id',
    table: 'customers',
    references: 'id',
    onDelete: 'CASCADE'
  }
]
