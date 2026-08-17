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

/** The threat families a rule set can inspect for. */
export const WAF_THREATS = {
  sql: 'SQL Injection',
  xss: 'Cross-Site Scripting',
  rfi: 'Remote File Inclusion',
  lfi: 'Local File Inclusion',
  rce: 'Remote Command Execution',
  'file-upload': 'File Upload',
  'evading-tricks': 'Evading Tricks'
}

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
    threats: ['sql', 'xss', 'rfi', 'lfi', 'rce'],
    sensitivity: 'High',
    status: 'Active',
    modifiedAt: daysAgo(8)
  },
  {
    id: '9930042',
    name: 'API Strict',
    mode: 'Blocking',
    threats: ['sql', 'rce', 'evading-tricks'],
    sensitivity: 'Highest',
    status: 'Active',
    modifiedAt: daysAgo(3)
  },
  {
    id: '9930043',
    name: 'Upload Guard',
    mode: 'Learning',
    threats: ['file-upload', 'rfi'],
    sensitivity: 'Medium',
    status: 'Active',
    modifiedAt: daysAgo(23)
  },
  {
    id: '9930044',
    name: 'Marketing Lenient',
    mode: 'Learning',
    threats: ['xss'],
    sensitivity: 'Low',
    status: 'Inactive',
    modifiedAt: daysAgo(71)
  },
  {
    id: '9930045',
    name: 'Checkout Hardened',
    mode: 'Blocking',
    threats: ['sql', 'xss', 'rce', 'evading-tricks'],
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
