// The WAF rule sets the sample is seeded with — the Secure → WAF Rules module.
//
// A RULE SET is a named threat posture: which families it inspects for, and whether
// it BLOCKS what it matches or only logs it. That mode is the field people actually
// reach for — "which of these are actually blocking" is the question a rule set list
// exists to answer — so it leads the fields.
//
// `threats` is a list per row (a rule set inspects several families at once), so it
// is a column rather than a field.
import { daysAgo, formatListDate } from '@shared/lib/dates'
import { authorAt, emailOf } from '@shared/lib/people'

/** How a rule set reacts to a match. `Blocking` is the enforcing posture. */
export const WAF_MODES = [
  { value: 'Blocking', label: 'Blocking' },
  { value: 'Learning', label: 'Learning' }
]

/**
 * The threat families a rule set can inspect for — the console's own eight, in the
 * console's order (its WAF Rule Set band lists them exactly like this). The set is
 * fixed by the product, not by us: a family the console cannot switch on is a family
 * this sample must not offer, or the two disagree about what a rule set even is.
 */
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

/** What each family guards against, shown under its name in Main Settings. */
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

/**
 * How hard a family inspects, per family. The console names these as words rather
 * than numbers because the reader is choosing a POSTURE, not calibrating a score —
 * and it offers the same five everywhere, so a rule set's shape is comparable.
 */
export const WAF_SENSITIVITIES = [
  { value: 'Highest', label: 'Highest' },
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' },
  { value: 'Lowest', label: 'Lowest' }
]

/** The label for a threat family id, falling back to the id itself. */
export const wafThreatLabel = (id) => WAF_THREATS[id] ?? id

/** The threat list a filter field offers. */
export const wafThreatOptions = Object.entries(WAF_THREATS).map(([value, label]) => ({
  value,
  label
}))

/** The seeded WAF rule sets, in list order. */
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
].map((ruleSet, index) => {
  const person = authorAt(index)
  return {
    ...ruleSet,
    threatLabels: ruleSet.threats.map(wafThreatLabel),
    author: person.name,
    authorEmail: emailOf(person.name),
    authorAvatar: person.avatar,
    lastModified: formatListDate(ruleSet.modifiedAt)
  }
})

/** A seeded rule set by id, or `undefined`. */
export const wafRuleById = (id) => WAF_RULES.find((ruleSet) => ruleSet.id === String(id))

// ── THE RULE SET'S OWN SCREEN ────────────────────────────────────────────────
// A rule set is not one record; it is three surfaces that only make sense together,
// which is why the console gives it TABS rather than a settings form:
//
//   Main Settings  what the rule set inspects for, and how hard  (the posture)
//   Tuning         what it actually matched in production        (the evidence)
//   Allowed Rules  the matches you have decided to permit        (the exceptions)
//
// The order is the workflow: you set a posture, you watch what it catches, and you
// carve out the false positives. Tuning is the only one of the three that is READ-ONLY
// — it is traffic, not configuration — and it is where the other two meet: a tuning row
// is the raw material an allowed rule is made from, which is what the console's
// "Add Allowed Rule" action does and why it lives on that tab.

/** Sensitivity a family starts at when a rule set switches it on. */
const DEFAULT_SENSITIVITY = 'Medium'

/**
 * Per-family configuration for one rule set: every family the product offers, each
 * with whether this set inspects for it and how hard.
 *
 * Derived from the set's own `threats` list rather than stored beside it, so the list
 * page's Threat Types column and this tab's switches can never disagree — they are one
 * fact read twice. A family the set does not carry is present but off, because Main
 * Settings has to offer all eight (turning one ON is the point of the tab).
 */
export const wafThreatConfig = (ruleSet) =>
  Object.keys(WAF_THREATS).map((id) => ({
    id,
    label: WAF_THREATS[id],
    hint: WAF_THREAT_HINTS[id],
    enabled: ruleSet.threats.includes(id),
    // The set's own sensitivity is the posture it was tuned to, so an enabled family
    // inherits it; a family that is off has no posture yet and starts at the middle.
    sensitivity: ruleSet.threats.includes(id) ? ruleSet.sensitivity : DEFAULT_SENSITIVITY
  }))

/**
 * TUNING — what the rule set matched, grouped by the rule that matched it.
 *
 * Counts first, then the top-10 lists behind them: the question this tab answers is
 * "which of my rules fire most, and is that traffic real?", so the number leads and the
 * evidence follows. The top-10s are stored as arrays and rendered as an overflow cell,
 * because a column of ten IPs is a column no one can read.
 */
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

/** The tuning rows for a rule set, hottest rule first. */
export const wafTuningFor = (id) =>
  [...(TUNING[String(id)] ?? [])]
    .sort((a, b) => b.hits - a.hits)
    .map((row) => ({
      ...row,
      // The counts the columns show are the lists' own lengths, so a row can never
      // claim more IPs than it can name.
      ipCount: row.ips.length,
      countryCount: row.countries.length,
      pathCount: row.paths.length
    }))

/**
 * ALLOWED RULES — the matches this rule set has been told to permit.
 *
 * One entry is a rule id plus WHERE it is allowed (a path) and, optionally, the part of
 * the request it is allowed in (`conditions`). Without those two it would be a blanket
 * "stop enforcing 1005", which is how a WAF quietly stops being one.
 */
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

/** The parts of a request an allowed rule can be scoped to. */
export const WAF_CONDITIONS = [
  { value: 'Path', label: 'Path' },
  { value: 'Query String', label: 'Query String' },
  { value: 'Request Body', label: 'Request Body' },
  { value: 'Request Header', label: 'Request Header' },
  { value: 'File Name', label: 'File Name' },
  { value: 'Raw Body', label: 'Raw Body' }
]

/** The allowed rules for a rule set, decorated like every other list row. */
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
