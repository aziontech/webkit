import { BOOT_ACCOUNT_ID, useAccounts } from './accounts'
import { FIRST_ORGANIZATION_ID, useOrganizations } from './organizations'
import { useSampleMode } from './sample-mode'
import { useWorkspaces } from './workspaces'

const { currentAccountId } = useAccounts()
const { currentOrganizationId } = useOrganizations()
const { workspaces, currentWorkspace } = useWorkspaces()
const { accountEmpty } = useSampleMode()

const KEEP_EVERY = 3

const MIN_ROWS = 3
const floorFor = (count) => Math.max(1, Math.min(MIN_ROWS, count - 1))

const hash = (input) => {
  let h = 0x811c9dc5
  for (let index = 0; index < input.length; index += 1) {
    h ^= input.charCodeAt(index)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

const seededIds = new Map()

const idOf = (row, index) => String(row?.id ?? index)

const atBootScope = () =>
  currentOrganizationId.value === FIRST_ORGANIZATION_ID &&
  currentAccountId.value === BOOT_ACCOUNT_ID &&
  currentWorkspace.value?.id === workspaces.value[0]?.id

export function tenancyRows(rows, scope) {
  if (!seededIds.has(scope)) seededIds.set(scope, new Set(rows.map(idOf)))
  const seeded = seededIds.get(scope)

  if (accountEmpty.value) return rows.filter((row, index) => !seeded.has(idOf(row, index)))

  if (atBootScope()) return rows

  const key = `${currentOrganizationId.value}:${currentAccountId.value}:${currentWorkspace.value?.id}:${scope}`

  const owned = rows.filter((row, index) => {
    const id = idOf(row, index)
    if (!seeded.has(id)) return true
    return hash(`${key}:${id}`) % KEEP_EVERY !== 0
  })

  const floor = floorFor(rows.length)
  return owned.length >= floor ? owned : rows.slice(0, floor)
}
