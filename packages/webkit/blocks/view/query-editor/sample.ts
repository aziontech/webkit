import type {
  QueryEditorHistoryEntry,
  QueryEditorResult,
  QueryEditorTable
} from './query-editor.vue'

export const sampleSql = `CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`

export const sampleSelectSql = `SELECT id, name, email, created_at
FROM customers
ORDER BY created_at DESC
LIMIT 100;`

const customers: QueryEditorTable = {
  id: 'tbl-customers',
  name: 'customers',
  columns: [
    { id: 'col-1', name: 'id', type: 'int8', primaryKey: true, notNull: true },
    { id: 'col-2', name: 'name', type: 'text', primaryKey: false, notNull: true },
    { id: 'col-3', name: 'email', type: 'text', primaryKey: false, notNull: true },
    {
      id: 'col-4',
      name: 'created_at',
      type: 'timestamptz',
      primaryKey: false,
      notNull: false
    }
  ],
  rows: [
    {
      __k: 'row-1',
      id: 1,
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      created_at: '2026-07-21 08:15:00'
    },
    {
      __k: 'row-2',
      id: 2,
      name: 'John Smith',
      email: 'john.smith@example.com',
      created_at: '2026-07-21 08:15:01'
    },
    {
      __k: 'row-3',
      id: 3,
      name: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      created_at: null
    }
  ]
}

const orders: QueryEditorTable = {
  id: 'tbl-orders',
  name: 'orders',
  columns: [
    { id: 'col-5', name: 'id', type: 'int8', primaryKey: true, notNull: true },
    { id: 'col-6', name: 'customer_id', type: 'int8', primaryKey: false, notNull: true },
    { id: 'col-7', name: 'total', type: 'numeric', primaryKey: false, notNull: true }
  ],
  rows: [
    { __k: 'row-4', id: 1001, customer_id: 1, total: '42.50' },
    { __k: 'row-5', id: 1002, customer_id: 3, total: '18.00' }
  ]
}

const invoices: QueryEditorTable = {
  id: 'tbl-invoices',
  name: 'invoices',
  columns: [
    { id: 'col-8', name: 'id', type: 'int8', primaryKey: true, notNull: true },
    {
      id: 'col-9',
      name: 'created_at',
      type: 'timestamptz',
      primaryKey: false,
      notNull: false
    }
  ],
  rows: []
}

const eventKinds = ['page_view', 'sign_in', 'checkout', 'search']
const eventPaths = ['/', '/pricing', '/docs/start', '/cart', '/account']

const events: QueryEditorTable = {
  id: 'tbl-events',
  name: 'events',
  columns: [
    { id: 'col-10', name: 'id', type: 'int8', primaryKey: true, notNull: true },
    {
      id: 'col-11',
      name: 'occurred_at',
      type: 'timestamptz',
      primaryKey: false,
      notNull: true
    },
    { id: 'col-12', name: 'kind', type: 'text', primaryKey: false, notNull: true },
    { id: 'col-13', name: 'path', type: 'text', primaryKey: false, notNull: true },
    { id: 'col-14', name: 'status', type: 'int4', primaryKey: false, notNull: true },
    { id: 'col-15', name: 'duration_ms', type: 'int4', primaryKey: false, notNull: false }
  ],
  rows: Array.from({ length: 137 }, (_, index) => {
    const minute = String(index % 60).padStart(2, '0')
    const hour = String(8 + Math.floor(index / 60)).padStart(2, '0')
    return {
      __k: `ev-${index + 1}`,
      id: 5000 + index,
      occurred_at: `2026-11-10 ${hour}:${minute}:00`,
      kind: eventKinds[index % eventKinds.length],
      path: eventPaths[(index * 3) % eventPaths.length],
      status: index % 17 === 0 ? 500 : index % 9 === 0 ? 404 : 200,
      duration_ms: index % 11 === 0 ? null : 40 + ((index * 37) % 400)
    }
  })
}

export const sampleTables: QueryEditorTable[] = [customers, orders, invoices]

export const sampleTablesWithEvents: QueryEditorTable[] = [customers, events, orders, invoices]

export const sampleHistory: QueryEditorHistoryEntry[] = [
  { id: 'q-0', sql: sampleSql },
  {
    id: 'q-1',
    sql: `CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL REFERENCES customers (id),
  total NUMERIC NOT NULL
);`
  }
]

export const sampleHistoryAfterSelect: QueryEditorHistoryEntry[] = [
  { id: 'q-2', sql: sampleSelectSql },
  ...sampleHistory
]

export const sampleSelectResult: QueryEditorResult = {
  type: 'rows',
  columns: ['id', 'name', 'email', 'created_at'],
  rows: [
    {
      __k: 1,
      id: 1,
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      created_at: '2026-07-21 08:15:00'
    },
    {
      __k: 2,
      id: 2,
      name: 'John Smith',
      email: 'john.smith@example.com',
      created_at: '2026-07-21 08:15:01'
    },
    {
      __k: 3,
      id: 3,
      name: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      created_at: '2026-07-21 08:15:02'
    }
  ]
}
