import type {
  QueryEditorHistoryEntry,
  QueryEditorResult,
  QueryEditorTable
} from './view-query-editor.vue'

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

const subscribers: QueryEditorTable = {
  id: 'tbl-subscribers',
  name: 'subscribers',
  columns: [
    { id: 'col-20', name: 'id', type: 'int8', primaryKey: true, notNull: true },
    { id: 'col-21', name: 'email', type: 'text', primaryKey: false, notNull: true },
    { id: 'col-22', name: 'plan', type: 'text', primaryKey: false, notNull: true },
    { id: 'col-23', name: 'active', type: 'bool', primaryKey: false, notNull: false },
    {
      id: 'col-24',
      name: 'joined_at',
      type: 'timestamptz',
      primaryKey: false,
      notNull: false
    },
    { id: 'col-25', name: 'seats', type: 'int4', primaryKey: false, notNull: false }
  ],
  rows: []
}

export const sampleTables: QueryEditorTable[] = [customers, orders, invoices]

export const sampleTablesWithEvents: QueryEditorTable[] = [customers, events, orders, invoices]

export const sampleTablesWithSubscribers: QueryEditorTable[] = [
  customers,
  orders,
  events,
  subscribers,
  invoices
]

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

/** One SQL quick template. */
export interface QueryEditorTemplate {
  title: string
  description: string
  icon: string
  sql: string
}

export const sampleTemplates: QueryEditorTemplate[] = [
  {
    title: 'Create table',
    description: 'Create a basic customers table with auto-increment ID and timestamp',
    icon: 'az az-table',
    sql: `CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`
  },
  {
    title: 'Insert data',
    description: 'Insert sample customer records into the customers table',
    icon: 'az az-circle-plus',
    sql: `INSERT INTO customers (name, email) VALUES
  ('Jane Doe', 'jane.doe@example.com'),
  ('John Smith', 'john.smith@example.com'),
  ('Alex Morgan', 'alex.morgan@example.com');`
  },
  {
    title: 'Select all',
    description: 'Retrieve all records from customers table with limit',
    icon: 'az az-list',
    sql: `SELECT id, name, email, created_at
FROM customers
ORDER BY created_at DESC
LIMIT 100;`
  },
  {
    title: 'Count records',
    description: 'Count total number of records in customers table',
    icon: 'az az-hash',
    sql: 'SELECT COUNT(*) AS total_customers FROM customers;'
  },
  {
    title: 'Related table',
    description: 'Create an orders table that references the customers table',
    icon: 'az az-box',
    sql: `CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL REFERENCES customers (id),
  total NUMERIC NOT NULL
);`
  },
  {
    title: 'Insert related rows',
    description: 'Insert sample orders for existing customers',
    icon: 'az az-arrow-right-left',
    sql: `INSERT INTO orders (customer_id, total) VALUES
  (1, 42.50),
  (3, 18.00);`
  },
  {
    title: 'Join tables',
    description: 'List every order with the name of the customer who placed it',
    icon: 'az az-search',
    sql: `SELECT orders.id, customers.name, orders.total
FROM orders
JOIN customers ON customers.id = orders.customer_id
ORDER BY orders.id DESC;`
  },
  {
    title: 'Create index',
    description: 'Create an index to speed up lookups of orders by customer',
    icon: 'az az-sitemap',
    sql: `CREATE INDEX IF NOT EXISTS orders_customer_id_idx
ON orders (customer_id);`
  },
  {
    title: 'Top customers',
    description: 'Find the 3 customers with the highest order totals',
    icon: 'az az-arrow-down-wide-narrow',
    sql: `SELECT customers.name, SUM(orders.total) AS total_spent
FROM customers
JOIN orders ON orders.customer_id = customers.id
GROUP BY customers.id
ORDER BY total_spent DESC
LIMIT 3;`
  }
]

/** The CSV the ImportCsv variant opens with. */
export const sampleCsvOnStart = {
  file: { name: 'subscribers-export.csv', size: 389, type: 'text/csv' },
  text: [
    'id,Email,plan_name,active,joined_at,referrer',
    '1,jane.doe@example.com,pro,true,2026-03-02,newsletter',
    '2,lin@example.com,free,true,2026-04-18,',
    '3,ops@example.com,team,maybe,2026-05-07,partner',
    '4,"kim, j@example.com",pro,true,2026-06-21,',
    '5,,free,true,2026-07-30,search',
    '6,ravi@example.com,free,false,2026-08-11,',
    '7,noor@example.com,team,true,next week,ads'
  ].join('\n')
}
