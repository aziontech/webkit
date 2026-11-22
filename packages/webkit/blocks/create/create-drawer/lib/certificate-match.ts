export interface CertificateSubject {
  /** Certificate id; an empty string is the free platform certificate. */
  value: string
  /** The host or wildcard it covers. */
  subject: string
}

export function subjectCovers(subject: string, host: string): boolean {
  const pattern = subject.toLowerCase()
  if (!pattern) return false
  if (pattern === host) return true
  if (!pattern.startsWith('*.')) return false
  const parent = pattern.slice(2)
  return host.endsWith(`.${parent}`) && host.slice(0, -(parent.length + 1)).split('.').length === 1
}

export function certificateForDomain(certificates: CertificateSubject[], host: string): string {
  const name = host.trim().toLowerCase()
  if (!name) return ''
  const candidates = certificates.filter((option) => subjectCovers(option.subject, name))
  const exact = candidates.find((option) => option.subject.toLowerCase() === name)
  return (exact ?? candidates[0])?.value ?? ''
}
