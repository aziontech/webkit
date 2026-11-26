import type { TagSeverity, TagVariant } from '@aziontech/ui/tag'

import type { UsersRole, UsersStatus, UsersTeam, UsersUser } from './account-users.vue'

export const USERS_ROLES: { value: Exclude<UsersRole, 'Owner'>; hint: string }[] = [
  { value: 'Admin', hint: 'Manages people, teams, billing and every account setting.' },
  { value: 'Developer', hint: 'Works on the resources their teams reach; no account settings.' },
  { value: 'Viewer', hint: 'Reads the resources their teams reach; changes nothing.' }
]

export const roleSeverity = (value: UsersRole): TagSeverity | undefined =>
  value === 'Owner'
    ? undefined
    : (({ Admin: 'info', Developer: 'neutral', Viewer: 'neutral' } as const)[value] ?? 'neutral')

export const roleVariant = (value: UsersRole): TagVariant | undefined =>
  value === 'Owner' ? 'primary' : undefined

export const displayName = (user: UsersUser): string => user.name || user.email

export const statusSeverity = (value: UsersStatus): TagSeverity =>
  (({ Active: 'success', Invited: 'warning', Inactive: 'neutral' }) as const)[value] ?? 'neutral'

export const teamsLabelOf = (teams: UsersTeam[], values: string[]): string =>
  values.length
    ? values.map((value) => teams.find((team) => team.value === value)?.label ?? value).join(', ')
    : 'No team (no access)'
