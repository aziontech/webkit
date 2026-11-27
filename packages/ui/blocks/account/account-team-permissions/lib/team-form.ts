import { nextTick } from 'vue'

export interface TeamFormErrors {
  /** Message under the Name field; empty when valid. */
  name: string
  /** Message over the permissions table; empty when valid. */
  permissions: string
}

export const focusById = (id: string) => nextTick(() => document.getElementById(id)?.focus())

export function validateTeam(name: string, permissions: string[], errors: TeamFormErrors): boolean {
  errors.name = name.trim() ? '' : 'This field is required.'
  errors.permissions = permissions.length ? '' : 'Select at least one permission.'
  if (errors.name) {
    focusById('team-name')
    return false
  }
  if (errors.permissions) {
    focusById('team-permissions-filter')
    return false
  }
  return true
}
