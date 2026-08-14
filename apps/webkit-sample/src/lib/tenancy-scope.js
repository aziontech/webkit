// Which seeded rows a tenancy scope owns.
//
// The sample has no backend: every module's list is a seeded constant. That is
// fine until the operator moves the header's switchers — reloading the SAME
// twelve applications under a different organization, account or workspace says
// resources are global, which is the one thing the Organization → Account →
// Workspace chain exists to deny. So a list is PROJECTED through the scope in
// force: a stable hash of the three ids and the module decides which seeded rows
// that scope owns, so the list changes with the scope and comes back identical
// when the operator switches back.
//
// All three links count, because each one narrows the last: an organization owns
// the account tree, an account owns the infrastructure, and a workspace is the
// slice of it in view. A workspace switch changing nothing would be the most
// visible lie of the three — it is the level whose whole purpose is to show less.
//
// Two guarantees keep the projection honest rather than merely random:
//
// - The scope the app BOOTS into owns the full seed, so every other flow in the
//   sample starts from the list it has always had.
// - Rows created in THIS session are never projected away. A resource the
//   operator just made is theirs and stays visible; only the seed is partitioned.
//
// The skeleton that covers a new projection arriving is the other half — see
// ./tenancy-reload.js.
//
// ── THE EMPTY VERSION OWNS NOTHING ──
//
// The sample's EMPTY version (./sample-mode.js) is a brand-new account, and a new
// account has no rows in any module — not "fewer applications", none, everywhere.
// That is enforced HERE rather than in sixteen list pages: every module already
// projects its seed through this function, so one branch makes the whole console
// empty and keeps it impossible for a module to be added later that forgets to.
// What the session PROVISIONED still shows, by the same rule the projection
// already follows: a resource the operator just created in the empty account is
// theirs, and watching it appear in a console that had nothing is the whole point
// of walking the empty version.
import { FIRST_ACCOUNT_ID, useAccounts } from '../accounts'
import { FIRST_ORGANIZATION_ID, useOrganizations } from '../organizations'
import { useWorkspaces } from '../workspaces'
import { useSampleMode } from './sample-mode'

// The stores are read once, here: `useWorkspaces()` builds its computeds on every
// call, and this runs inside a page's computed on every re-projection.
const { currentAccountId } = useAccounts()
const { currentOrganizationId } = useOrganizations()
const { workspaces, currentWorkspace } = useWorkspaces()
const { accountEmpty } = useSampleMode()

// A hash miss every third row: each scope owns roughly two thirds of a seed,
// enough that two scopes never read as the same list.
const KEEP_EVERY = 3

// Floor, so no module projects down to a near-empty list and turns a populated
// module into an empty state by accident. A short seed (Edge DNS ships two zones)
// gets a lower floor, so there is still room for a row to drop and the module
// reads as this scope's rather than as everyone's.
const MIN_ROWS = 3
const floorFor = (count) => Math.max(1, Math.min(MIN_ROWS, count - 1))

// FNV-1a over a string — small, stable and dependency-free. Same scope, same
// module, same subset, forever.
const hash = (input) => {
  let h = 0x811c9dc5
  for (let index = 0; index < input.length; index += 1) {
    h ^= input.charCodeAt(index)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

// The row ids each module was seeded with, captured the first time it projects.
// Anything absent from it appeared later — created in this session — and is
// exempt.
const seededIds = new Map()

const idOf = (row, index) => String(row?.id ?? index)

// Where the app opens: the first organization, the first account, and that
// account's first workspace (the switchers seed no explicit workspace pick).
const atBootScope = () =>
  currentOrganizationId.value === FIRST_ORGANIZATION_ID &&
  currentAccountId.value === FIRST_ACCOUNT_ID &&
  currentWorkspace.value?.id === workspaces.value[0]?.id

// The rows of `scope` (a module key: 'applications', 'edge-dns', …) that the
// current organization / account / workspace owns. Call it inside a `computed` so
// the list re-projects when any of the three changes.
export function tenancyRows(rows, scope) {
  if (!seededIds.has(scope)) seededIds.set(scope, new Set(rows.map(idOf)))
  const seeded = seededIds.get(scope)

  // The empty account: every seeded row goes, in every module. Only what this
  // session created survives, so a deploy made in the empty version still lands.
  if (accountEmpty.value) return rows.filter((row, index) => !seeded.has(idOf(row, index)))

  if (atBootScope()) return rows

  const key = `${currentOrganizationId.value}:${currentAccountId.value}:${currentWorkspace.value?.id}:${scope}`

  const owned = rows.filter((row, index) => {
    const id = idOf(row, index)
    // Created in this session — the operator's own row, not part of the seed.
    if (!seeded.has(id)) return true
    return hash(`${key}:${id}`) % KEEP_EVERY !== 0
  })

  const floor = floorFor(rows.length)
  return owned.length >= floor ? owned : rows.slice(0, floor)
}
