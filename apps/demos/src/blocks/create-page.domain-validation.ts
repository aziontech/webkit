/** Why a field shows its message: an empty required field, a value the endpoint rejects, or guidance. */
export type CreatePageErrorKind = 'helper' | 'invalid' | 'required'

/** The messages of the Name and Domain name fields. */
export interface CreatePageDomainErrors {
  /** The message under Name; empty while the field is valid. */
  name: string
  /** Why Name shows its message. */
  nameKind: CreatePageErrorKind
  /** The message under Domain name; empty while the field is valid. */
  domain: string
  /** Why Domain name shows its message. */
  domainKind: CreatePageErrorKind
}

const NAME_MAX = 50
const DOMAIN_PATTERN = /^(?=.{4,253}$)((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\.)+[a-zA-Z]{2,63}$/

export function validateDomainForm(
  form: { name: string; domain: string },
  errors: CreatePageDomainErrors
): boolean {
  const name = form.name.trim()
  if (!name) {
    errors.nameKind = 'required'
    errors.name = 'This field is required.'
  } else if (name.length > NAME_MAX) {
    errors.nameKind = 'invalid'
    errors.name = 'Use at most ' + NAME_MAX + ' characters.'
  } else {
    errors.name = ''
  }

  const domain = form.domain.trim()
  if (!domain) {
    errors.domainKind = 'required'
    errors.domain = 'This field is required.'
  } else if (!DOMAIN_PATTERN.test(domain)) {
    errors.domainKind = 'invalid'
    errors.domain = 'Enter a valid domain name. Example: example.com.'
  } else {
    errors.domain = ''
  }

  return !errors.name && !errors.domain
}
