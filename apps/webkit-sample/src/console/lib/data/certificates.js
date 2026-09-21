// The certificates the sample is seeded with — the Secure → Certificate Manager
// module.
//
// A certificate list is read by asking one question first: what is about to expire.
// So EXPIRY is a real field here rather than only a sortable column, and it is a set
// of forward-looking windows (`Expired`, `Within 30 days`, …) rather than the
// backward-looking periods every other date field offers — "changed in the last 7
// days" is the wrong question to ask of an expiry date.
//
// `expiresAt` is the real instant; `expires` is the display string derived from it.
import { daysAgo, formatListDate } from '@shared/lib/dates'
import { authorAt, emailOf } from '@shared/lib/people'

/** A date `days` from now — the mirror of `daysAgo`, for expiry dates. */
const daysAhead = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000)

/** Certificate kind → the label every surface shows. */
export const CERTIFICATE_TYPES = {
  'edge-certificate': 'Edge Certificate',
  'trusted-ca': 'Trusted CA',
  'let-s-encrypt': "Let's Encrypt",
  'revocation-list': 'Certificate Revocation List'
}

/** The label for a certificate type id, falling back to the id itself. */
export const certificateTypeLabel = (id) => CERTIFICATE_TYPES[id] ?? id

/** The type list a filter field offers. */
export const certificateTypeOptions = Object.entries(CERTIFICATE_TYPES).map(([value, label]) => ({
  value,
  label
}))

/**
 * The expiry windows the Expiry field offers.
 *
 * `kind: 'range'` on the field, so exactly one is picked at a time — the windows
 * overlap by design (everything expiring within 30 days is also expiring within 90),
 * and holding two at once would say nothing the wider one does not.
 */
export const EXPIRY_WINDOWS = [
  { value: 'expired', label: 'Expired' },
  { value: '30d', label: 'Within 30 days' },
  { value: '90d', label: 'Within 90 days' },
  { value: '1y', label: 'Within a year' }
]

/** Whether `date` falls inside the picked expiry window. */
export const matchExpiry = (date, values) => {
  const [window] = values ?? []
  if (!window || !(date instanceof Date)) return true
  const days = (date.getTime() - Date.now()) / (24 * 60 * 60 * 1000)
  if (window === 'expired') return days < 0
  if (window === '30d') return days >= 0 && days <= 30
  if (window === '90d') return days >= 0 && days <= 90
  if (window === '1y') return days >= 0 && days <= 365
  return true
}

/** The seeded certificates, in list order. */
export const CERTIFICATES = [
  {
    id: 'cert-8801',
    name: 'edgeflow.com wildcard',
    type: 'edge-certificate',
    subject: '*.edgeflow.com',
    issuer: 'DigiCert',
    status: 'Active',
    expiresAt: daysAhead(212),
    modifiedAt: daysAgo(153)
  },
  {
    id: 'cert-8802',
    name: 'azion.design',
    type: 'let-s-encrypt',
    subject: 'azion.design',
    issuer: "Let's Encrypt",
    status: 'Active',
    expiresAt: daysAhead(21),
    modifiedAt: daysAgo(69)
  },
  {
    id: 'cert-8803',
    name: 'api.edgeflow.com',
    type: 'edge-certificate',
    subject: 'api.edgeflow.com',
    issuer: 'DigiCert',
    status: 'Active',
    expiresAt: daysAhead(74),
    modifiedAt: daysAgo(291)
  },
  {
    id: 'cert-8804',
    name: 'legacy origin CA',
    type: 'trusted-ca',
    subject: 'legacy.edgeflow.com',
    issuer: 'Internal CA',
    status: 'Expired',
    expiresAt: daysAhead(-38),
    modifiedAt: daysAgo(403)
  },
  {
    id: 'cert-8805',
    name: 'staging wildcard',
    type: 'edge-certificate',
    subject: '*.staging.edgeflow.com',
    issuer: 'DigiCert',
    status: 'Active',
    expiresAt: daysAhead(340),
    modifiedAt: daysAgo(25)
  },
  {
    id: 'cert-8806',
    name: 'partner mTLS CA',
    type: 'trusted-ca',
    subject: 'partners.edgeflow.com',
    issuer: 'Internal CA',
    status: 'Pending',
    expiresAt: daysAhead(3),
    modifiedAt: daysAgo(4)
  },
  {
    id: 'cert-8807',
    name: 'partner revocation list',
    type: 'revocation-list',
    subject: 'partners.edgeflow.com',
    issuer: 'Internal CA',
    status: 'Active',
    expiresAt: daysAhead(180),
    modifiedAt: daysAgo(11)
  }
].map(certificateRow)

/**
 * A certificate as a LIST ROW — the record itself plus the fields its table displays.
 *
 * Exported because the seed is not the only source of rows any more: a certificate created
 * in this session is stored as the answers the reader gave (../state/created-resources.js)
 * and has to arrive in the list as the SAME row, derived fields and all. Two projections
 * would be two lists that disagree about what a row is.
 *
 * @param {object} certificate The base record.
 * @param {number} [index] Position in the seed — picks the round-robin author.
 * @returns {object} The row.
 */
export function certificateRow(certificate, index = 0) {
  const person = authorAt(index)
  return {
    ...certificate,
    typeLabel: certificateTypeLabel(certificate.type),
    expires: formatListDate(certificate.expiresAt),
    author: person.name,
    authorEmail: emailOf(person.name),
    authorAvatar: person.avatar,
    lastModified: formatListDate(certificate.modifiedAt)
  }
}

/** A seeded certificate by id, or `undefined`. */
export const certificateById = (id) =>
  CERTIFICATES.find((certificate) => certificate.id === String(id))

/**
 * The certificates of one type as SELECTABLE ROWS — what a field binding a certificate
 * offers. Active first, because an expired certificate is a value the reader almost never
 * wants and never the one they mean by default.
 */
export const certificateOptionsOfType = (type) =>
  CERTIFICATES.filter((certificate) => certificate.type === type)
    .sort((left, right) => Number(right.status === 'Active') - Number(left.status === 'Active'))
    .map((certificate) => ({ value: certificate.id, label: certificate.name }))

/** The name of a certificate by id, or `''`. */
export const certificateName = (id) => certificateById(id)?.name ?? ''

// ── WHAT SERVES A DOMAIN ─────────────────────────────────────────────────────
//
// Only two of the four types can front a domain: an Edge Certificate the account
// uploaded, and a Let's Encrypt one the platform issued. A Trusted CA verifies the
// CLIENT (mutual authentication) and a revocation list revokes — offering either as the
// certificate a visitor is served with would be offering a value that cannot work.

/** The label the free, platform-managed certificate carries on every surface. */
export const AZION_CERTIFICATE = 'Azion (free)'

/** The certificate types that can serve a domain, in the order a field offers them. */
export const DOMAIN_CERTIFICATE_TYPES = ['edge-certificate', 'let-s-encrypt']

/**
 * The certificates a domain can be served with — the free one first, then the account's
 * own. One list, so the form that picks it and the table that reports it cannot disagree
 * about what the options are or what the empty value means.
 */
export const domainCertificateOptions = () => [
  { value: '', label: AZION_CERTIFICATE },
  ...DOMAIN_CERTIFICATE_TYPES.flatMap((type) => certificateOptionsOfType(type))
]

/** The name a certificate id reads as, with `''` meaning the free platform one. */
export const domainCertificateLabel = (id) => (id ? certificateName(id) : AZION_CERTIFICATE)

/** Whether a certificate's subject covers `host` — exactly, or as a `*.` wildcard. */
const subjectCovers = (subject, host) => {
  const pattern = String(subject ?? '').toLowerCase()
  if (!pattern) return false
  if (pattern === host) return true
  if (!pattern.startsWith('*.')) return false
  const parent = pattern.slice(2)
  return host.endsWith(`.${parent}`) && host.slice(0, -(parent.length + 1)).split('.').length === 1
}

/**
 * The certificate that already covers `host`, or `''` for the free platform one.
 *
 * THE FORM ANSWERS THIS ITSELF rather than making the reader answer it. An account that
 * holds `*.edgeflow.com` has already decided what serves `api.edgeflow.com`; asking is
 * asking them to look up their own certificate list mid-form, and the cost of getting it
 * wrong is a domain that answers with the wrong name on its certificate.
 *
 * An EXACT subject wins over a wildcard — a certificate issued for this one host is a
 * more deliberate answer than the one that happens to cover it — and an expired or
 * pending certificate is never picked, because it cannot serve anything today.
 *
 * @param {string} host The address the domain answers on.
 * @returns {string} A certificate id, or `''` for the free Azion certificate.
 */
export const certificateForDomain = (host) => {
  const name = String(host ?? '')
    .trim()
    .toLowerCase()
  if (!name) return ''

  const candidates = CERTIFICATES.filter(
    (certificate) =>
      DOMAIN_CERTIFICATE_TYPES.includes(certificate.type) &&
      certificate.status === 'Active' &&
      subjectCovers(certificate.subject, name)
  )

  const exact = candidates.find(
    (certificate) => String(certificate.subject).toLowerCase() === name
  )
  return (exact ?? candidates[0])?.id ?? ''
}
