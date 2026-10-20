import { daysAgo, formatListDate } from '@shared/lib/dates'
import { authorAt, emailOf } from '@shared/lib/people'

export const WAF_MODES = [
  { value: 'Blocking', label: 'Blocking' },
  { value: 'Learning', label: 'Learning' }
]

export const WAF_THREATS = {
  'sql-injection': 'SQL Injection',
  'remote-file-inclusion': 'Remote File Inclusion (RFI)',
  'directory-traversal': 'Directory Traversal',
  'cross-site-scripting': 'Cross-Site Scripting (XSS)',
  'file-upload': 'File Upload',
  'evading-tricks': 'Evading Tricks',
  'unwanted-access': 'Unwanted Access',
  'identified-attack': 'Identified Attack'
}

export const WAF_THREAT_HINTS = {
  'sql-injection':
    'Detects attempts to inject SQL statements through the request, in order to read or alter the database behind it.',
  'remote-file-inclusion':
    'Detects attempts to make the application load and execute a file hosted somewhere else.',
  'directory-traversal':
    'Detects attempts to reach files outside the intended directory by walking the path.',
  'cross-site-scripting':
    'Prevents the injection of client-side scripts into pages viewed by visitors.',
  'file-upload': 'Detects attempts to upload files.',
  'evading-tricks': 'Prevents the use of encoding tricks to evade protection mechanisms.',
  'unwanted-access':
    'Detects requests aimed at administrative pages, vulnerable files, or applications not meant to be public.',
  'identified-attack':
    'Detects requests carrying the signature of known attacks and exploit toolkits.'
}

export const WAF_SENSITIVITIES = [
  { value: 'Highest', label: 'Highest' },
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' },
  { value: 'Lowest', label: 'Lowest' }
]

export const wafThreatLabel = (id) => WAF_THREATS[id] ?? id

export const wafThreatOptions = Object.entries(WAF_THREATS).map(([value, label]) => ({
  value,
  label
}))

export const WAF_RULES = [
  {
    id: '9930041',
    name: 'OWASP Core',
    mode: 'Blocking',
    threats: [
      'sql-injection',
      'cross-site-scripting',
      'remote-file-inclusion',
      'directory-traversal',
      'identified-attack'
    ],
    sensitivity: 'High',
    status: 'Active',
    modifiedAt: daysAgo(8)
  },
  {
    id: '9930042',
    name: 'API Strict',
    mode: 'Blocking',
    threats: ['sql-injection', 'identified-attack', 'evading-tricks'],
    sensitivity: 'Highest',
    status: 'Active',
    modifiedAt: daysAgo(3)
  },
  {
    id: '9930043',
    name: 'Upload Guard',
    mode: 'Learning',
    threats: ['file-upload', 'remote-file-inclusion'],
    sensitivity: 'Medium',
    status: 'Active',
    modifiedAt: daysAgo(23)
  },
  {
    id: '9930044',
    name: 'Marketing Lenient',
    mode: 'Learning',
    threats: ['cross-site-scripting'],
    sensitivity: 'Low',
    status: 'Inactive',
    modifiedAt: daysAgo(71)
  },
  {
    id: '9930045',
    name: 'Checkout Hardened',
    mode: 'Blocking',
    threats: ['sql-injection', 'cross-site-scripting', 'identified-attack', 'evading-tricks'],
    sensitivity: 'Highest',
    status: 'Active',
    modifiedAt: daysAgo(1)
  }
].map(wafRuleRow)

export function wafRuleRow(ruleSet, index = 0) {
  const person = authorAt(index)
  return {
    ...ruleSet,
    threatLabels: ruleSet.threats.map(wafThreatLabel),
    author: person.name,
    authorEmail: emailOf(person.name),
    authorAvatar: person.avatar,
    lastModified: formatListDate(ruleSet.modifiedAt)
  }
}

export const wafRuleById = (id) => WAF_RULES.find((ruleSet) => ruleSet.id === String(id))

const DEFAULT_SENSITIVITY = 'Medium'

export const wafThreatConfig = (ruleSet) =>
  Object.keys(WAF_THREATS).map((id) => ({
    id,
    label: WAF_THREATS[id],
    hint: WAF_THREAT_HINTS[id],
    enabled: ruleSet.threats.includes(id),
    sensitivity: ruleSet.threats.includes(id) ? ruleSet.sensitivity : DEFAULT_SENSITIVITY
  }))

const TUNING = {
  9930041: [
    {
      ruleId: '1005',
      hits: 18432,
      ips: ['203.0.113.41', '198.51.100.7', '203.0.113.90', '192.0.2.15'],
      countries: ['Brazil', 'United States', 'Germany'],
      paths: ['/api/v1/search', '/api/v1/login', '/checkout']
    },
    {
      ruleId: '1015',
      hits: 6210,
      ips: ['198.51.100.22', '203.0.113.8'],
      countries: ['United States', 'Netherlands'],
      paths: ['/admin', '/wp-login.php']
    },
    {
      ruleId: '1302',
      hits: 934,
      ips: ['192.0.2.77'],
      countries: ['Russia'],
      paths: ['/api/v1/upload']
    }
  ],
  9930042: [
    {
      ruleId: '1005',
      hits: 4102,
      ips: ['203.0.113.5', '198.51.100.61'],
      countries: ['United States', 'Ireland'],
      paths: ['/v2/graphql', '/v2/tokens']
    },
    {
      ruleId: '1201',
      hits: 288,
      ips: ['192.0.2.31'],
      countries: ['Singapore'],
      paths: ['/v2/webhooks']
    }
  ],
  9930043: [
    {
      ruleId: '1302',
      hits: 12904,
      ips: ['203.0.113.120', '198.51.100.44', '192.0.2.9'],
      countries: ['Brazil', 'Argentina'],
      paths: ['/uploads', '/media/import']
    }
  ],
  9930044: [],
  9930045: [
    {
      ruleId: '1005',
      hits: 2011,
      ips: ['203.0.113.200'],
      countries: ['Brazil'],
      paths: ['/checkout/pay']
    },
    {
      ruleId: '1015',
      hits: 815,
      ips: ['198.51.100.90', '203.0.113.14'],
      countries: ['Mexico', 'Chile'],
      paths: ['/checkout/session']
    }
  ]
}

export const wafTuningFor = (id) =>
  [...(TUNING[String(id)] ?? [])]
    .sort((a, b) => b.hits - a.hits)
    .map((row) => ({
      ...row,
      ipCount: row.ips.length,
      countryCount: row.countries.length,
      pathCount: row.paths.length
    }))

const ALLOWED = {
  9930041: [
    {
      id: 'wa-001',
      ruleId: '1005',
      description: 'Search accepts quotes in free-text queries',
      path: '/api/v1/search',
      conditions: ['Query String', 'Request Body'],
      status: 'Active',
      modifiedAt: daysAgo(5)
    },
    {
      id: 'wa-002',
      ruleId: '1015',
      description: 'Legacy admin path kept for the migration window',
      path: '/admin/legacy',
      conditions: ['Path'],
      status: 'Inactive',
      modifiedAt: daysAgo(40)
    }
  ],
  9930042: [
    {
      id: 'wa-003',
      ruleId: '1005',
      description: 'GraphQL bodies carry SQL-like operator names',
      path: '/v2/graphql',
      conditions: ['Request Body'],
      status: 'Active',
      modifiedAt: daysAgo(2)
    }
  ],
  9930043: [
    {
      id: 'wa-004',
      ruleId: '1302',
      description: 'Media import uploads archives on purpose',
      path: '/media/import',
      conditions: ['Request Body', 'File Name'],
      status: 'Active',
      modifiedAt: daysAgo(11)
    }
  ],
  9930044: [],
  9930045: []
}

export const WAF_CONDITIONS = [
  { value: 'Path', label: 'Path' },
  { value: 'Query String', label: 'Query String' },
  { value: 'Request Body', label: 'Request Body' },
  { value: 'Request Header', label: 'Request Header' },
  { value: 'File Name', label: 'File Name' },
  { value: 'Raw Body', label: 'Raw Body' }
]

export const wafAllowedFor = (id) =>
  (ALLOWED[String(id)] ?? []).map((rule, index) => {
    const person = authorAt(index)
    return {
      ...rule,
      author: person.name,
      authorEmail: emailOf(person.name),
      authorAvatar: person.avatar,
      lastModified: formatListDate(rule.modifiedAt)
    }
  })
