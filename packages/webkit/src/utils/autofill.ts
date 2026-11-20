export type AutofillHintOptions = {
  autocomplete?: string
  type?: string
  readonly?: boolean
}

export const PASSWORD_MANAGER_IGNORE: Readonly<Record<string, string>> = Object.freeze({
  'data-1p-ignore': 'true',
  'data-lpignore': 'true',
  'data-bwignore': 'true',
  'data-form-type': 'other'
})

export function passwordManagerHints({
  autocomplete,
  type,
  readonly
}: AutofillHintOptions = {}): Readonly<Record<string, string>> {
  if (readonly) return PASSWORD_MANAGER_IGNORE
  const token = autocomplete?.trim().toLowerCase()
  if (token) return token === 'off' ? PASSWORD_MANAGER_IGNORE : {}
  if (type === 'email') return {}
  return PASSWORD_MANAGER_IGNORE
}
