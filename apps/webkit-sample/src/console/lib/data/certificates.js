import { daysAgo, formatListDate } from '@shared/lib/dates'
import { authorAt, emailOf } from '@shared/lib/people'

const daysAhead = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000)

export const CERTIFICATE_TYPES = {
  'edge-certificate': 'Edge Certificate',
  'trusted-ca': 'Trusted CA',
  'let-s-encrypt': "Let's Encrypt",
  'revocation-list': 'Certificate Revocation List'
}

export const certificateTypeLabel = (id) => CERTIFICATE_TYPES[id] ?? id

export const certificateTypeOptions = Object.entries(CERTIFICATE_TYPES).map(([value, label]) => ({
  value,
  label
}))

export const EXPIRY_WINDOWS = [
  { value: 'expired', label: 'Expired' },
  { value: '30d', label: 'Within 30 days' },
  { value: '90d', label: 'Within 90 days' },
  { value: '1y', label: 'Within a year' }
]

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

export const certificateById = (id) =>
  CERTIFICATES.find((certificate) => certificate.id === String(id))

export const certificateOptionsOfType = (type) =>
  CERTIFICATES.filter((certificate) => certificate.type === type)
    .sort((left, right) => Number(right.status === 'Active') - Number(left.status === 'Active'))
    .map((certificate) => ({ value: certificate.id, label: certificate.name }))

export const certificateName = (id) => certificateById(id)?.name ?? ''

export const AZION_CERTIFICATE = 'Azion (free)'

export const DOMAIN_CERTIFICATE_TYPES = ['edge-certificate', 'let-s-encrypt']

export const domainCertificateOptions = () => [
  { value: '', label: AZION_CERTIFICATE },
  ...DOMAIN_CERTIFICATE_TYPES.flatMap((type) => certificateOptionsOfType(type))
]

export const domainCertificateLabel = (id) => (id ? certificateName(id) : AZION_CERTIFICATE)

const subjectCovers = (subject, host) => {
  const pattern = String(subject ?? '').toLowerCase()
  if (!pattern) return false
  if (pattern === host) return true
  if (!pattern.startsWith('*.')) return false
  const parent = pattern.slice(2)
  return host.endsWith(`.${parent}`) && host.slice(0, -(parent.length + 1)).split('.').length === 1
}

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
