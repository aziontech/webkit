// Accounts store — a module-level singleton (like organizations.js /
// sidebar.js / theme.js) so the header's account switcher and the Switch
// Account drawer share one source of truth. Switching the current account
// persists for the session, so the header pill reflects the choice across
// every page. The organization that owns this tree lives in organizations.js.
//
// The console is multi-tenant, and the tenancy words changed: "brand",
// "reseller" and "client" are retired, and the tiers are now ORGANIZATION owns
// GROUP owns WORKSPACE, top → bottom. That is a rename of three tiers onto two
// words plus one that already existed, so the old four-tier chain (brand →
// reseller → group → client) folds to three: a brand is an Organization, a
// client is a Workspace, and the reseller tier is gone — the groups it held now
// hang off the Organization directly, which is the tier a partner channel was
// standing in for. The switcher renders the whole tree at once
// (./accounts.js § listAccountTree) rather than one tier at a time.
import { computed, ref } from 'vue'

import { useSampleMode } from './sample-mode.js'

const { accountEmpty } = useSampleMode()

// The three tiers of the hierarchy, top → bottom. `singular` matches an
// account's `type`; `icon` is the tier's glyph — the leading mark on every tree
// row, so a level is legible before its label is read — and `severity` colours
// the Type tag. Order mirrors the ownership chain.
//
// `value` is the plural slug an API would take as `account_type`; it survives
// the rename because the tree still has to name a tier to a server.
export const accountTypes = [
  {
    value: 'organizations',
    label: 'Organizations',
    singular: 'organization',
    typeLabel: 'Organization',
    icon: 'pi pi-building',
    severity: 'accent'
  },
  {
    value: 'groups',
    label: 'Groups',
    singular: 'group',
    typeLabel: 'Group',
    icon: 'pi pi-users',
    severity: 'info'
  },
  {
    value: 'workspaces',
    label: 'Workspaces',
    singular: 'workspace',
    typeLabel: 'Workspace',
    icon: 'pi pi-th-large',
    severity: 'secondary'
  }
]

// Look up the tier descriptor for an account's `type` (the singular form).
// Falls back to the leaf tier, which is what an unknown row most likely is.
export const accountTypeOf = (type) =>
  accountTypes.find((entry) => entry.singular === type) ?? accountTypes[2]

// Initials for an account's avatar.
//
// The design system's Avatar takes the first two CHARACTERS of the label, which
// is right for one-word names and wrong the moment two customers share a stem:
// "Magalu" and "Madeira Madeira" both come out "MA", in the same list, which is
// exactly what the mark exists to prevent. So a multi-word name is initialled by
// word ("Madeira Madeira" → MM, "Caixa Econômica Federal" → CE) and a one-word
// name keeps the two-character form ("Magalu" → MA, "iFood" → IF).
export const accountInitials = (name) => {
  const words = String(name ?? '')
    .trim()
    .split(/\s+/)
    // A word has to START with a letter or digit to lend an initial, or
    // "Retail & Marketplace" comes out "R&".
    .filter((word) => /^[\p{L}\p{N}]/u.test(word))
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase()
  return (words[0] ?? '').slice(0, 2).toUpperCase()
}

// WHERE THE SAMPLE OPENS: Caixa Econômica Federal, a workspace.
//
// Not the first row of the roster, which is why this is named for booting and not
// for being first (its counterpart FIRST_ORGANIZATION_ID happens to be both). A
// WORKSPACE is what an operator actually operates in — the Group and Organization
// above it are structure, there to be browsed rather than inhabited — so the
// sample should open inside one, with real workloads under it and the customer's
// own mark on the header pill.
//
// Exported because it is also the middle link of the scope that owns every seeded
// resource row (see ./tenancy-scope.js): the app boots into the full lists, and
// switching away projects them.
export const BOOT_ACCOUNT_ID = 28836

// Seeded tenants across all three tiers, linked into one tree by `parentId`
// (`null` = an Organization, the root tier — there is no synthetic node above
// them any more). WORKSPACES are named after the COMPANY that owns them, because
// that is what one is in the console: a customer's traffic, storage and bill. The
// Groups above them are the segments those customers are managed in, so a
// switcher row reads as a real place ("Magalu", under Retail & Marketplace)
// rather than a test fixture. A few carry resource metadata (last accessed,
// labels, monthly charges) so the Manage Resources table reads like the console;
// the rest render "—".
//
// THE RESELLER TIER IS GONE with the rename, and its ids went with it: the two
// networks that held groups (LatAm 4471, EMEA 4519) were the partner channel the
// word named, so the Groups they held now hang off the Organization directly, and
// APAC (4602), which held nothing, has nothing to re-parent.
const seedAccounts = [
  // Organizations — the root tier.
  {
    id: 1,
    name: 'Azion',
    clientId: '0001b',
    type: 'organization',
    parentId: null,
    labels: ['primary']
  },
  { id: 812, name: 'Nebula Partners', clientId: '0204c', type: 'organization', parentId: null },

  // Groups — the segment each set of customer workspaces is managed in.
  { id: 9032, name: 'Retail & Marketplace', clientId: '4500p', type: 'group', parentId: 1 },
  { id: 9088, name: 'Digital Commerce', clientId: '4710q', type: 'group', parentId: 1 },
  { id: 9140, name: 'Enterprise Accounts', clientId: '4881r', type: 'group', parentId: 1 },

  // Workspaces — one per customer. The switcher's tree renders every tier, so
  // `lastAccessed` is not what decides who appears there; it is the "Last accessed"
  // column of the Manage Resources page. Every one is `active`: these are real
  // companies, and a seeded "suspended" against a real name states something about
  // them that isn't ours to state.
  {
    id: 6,
    name: 'Magalu',
    clientId: '0001a',
    type: 'workspace',
    parentId: 9032,
    lastAccessed: '2 hours ago',
    status: 'active',
    charges: '1,284.00',
    labels: ['retail', 'prod']
  },
  {
    id: 33024,
    name: 'Madeira Madeira',
    clientId: '1860h',
    type: 'workspace',
    parentId: 9032,
    lastAccessed: 'Yesterday',
    status: 'active',
    charges: '612.40'
  },
  // Tray is LWSA's commerce platform, so the two sit in the same segment.
  {
    id: 29025,
    name: 'Tray',
    clientId: '4797u',
    type: 'workspace',
    parentId: 9088,
    lastAccessed: '3 days ago',
    status: 'active',
    charges: '42.10'
  },
  { id: 5791, name: 'LWSA', clientId: '4151o', type: 'workspace', parentId: 9088, status: 'active' },
  {
    id: 31204,
    name: 'iFood',
    clientId: '4206r',
    type: 'workspace',
    parentId: 9140,
    lastAccessed: '1 week ago',
    status: 'active',
    labels: ['delivery']
  },
  {
    id: BOOT_ACCOUNT_ID,
    name: 'Caixa Econômica Federal',
    clientId: '3493x',
    type: 'workspace',
    parentId: 9140,
    lastAccessed: '1 month ago',
    status: 'active',
    charges: '3,910.75'
  },

  // The four customers this repo already owns a square brand mark for but had no
  // account to show it on: GPA and Itaú ship a purpose-drawn 24px tile
  // (../../../shared/ui/brand/clients/symbols/), Renner and HeroSpark a white symbol
  // the site's own home page paints on their brand colour. Same minimal shape as LWSA
  // above — a real company, an id and a segment, and no invented metrics: the Manage
  // Resources table renders "—" for what a seed does not claim.
  { id: 21447, name: 'GPA', clientId: '2298k', type: 'workspace', parentId: 9032, status: 'active' },
  {
    id: 18932,
    name: 'Renner',
    clientId: '3120m',
    type: 'workspace',
    parentId: 9032,
    status: 'active'
  },
  {
    id: 40118,
    name: 'HeroSpark',
    clientId: '4880t',
    type: 'workspace',
    parentId: 9088,
    status: 'active'
  },
  { id: 12903, name: 'Itaú', clientId: '1075n', type: 'workspace', parentId: 9140, status: 'active' }
]

const allAccounts = ref(seedAccounts)
const currentAccountId = ref(BOOT_ACCOUNT_ID)

// THE EMPTY VERSION HAS ONE ACCOUNT (./lib/sample-mode.js).
//
// A brand-new customer is a single tenant: there is no Organization → Group →
// Workspace tree above them, so the roster is the one workspace they operate and
// there is nothing to switch to (../state/sample-preset.js carries the preference
// that used to hide the switcher entirely on that version).
// The roster still projects to that one account, because everything else in the
// console — the profile, Account Settings, the resource scope — still asks who it is.
// Same shape as the organization roster next door: one source, no fork, and flipping
// the version back restores the whole tree.
const accounts = computed(() => {
  if (!accountEmpty.value) return allAccounts.value
  const own =
    allAccounts.value.find((account) => account.id === BOOT_ACCOUNT_ID) ?? allAccounts.value[0]
  return own ? [{ ...own, parentId: null }] : []
})

const currentAccount = computed(
  () => accounts.value.find((account) => account.id === currentAccountId.value) ?? accounts.value[0]
)

// Switch the logged-in account. Idempotent — re-selecting the current account
// is a no-op the caller can treat as "already here".
const switchAccount = (account) => {
  const changed = account.id !== currentAccountId.value
  currentAccountId.value = account.id
  return changed
}

// Direct children of a node (by parent id; `null` for the roots).
export const accountChildren = (parentId) =>
  accounts.value.filter((account) => (account.parentId ?? null) === parentId)

/**
 * Flatten a tenancy list into the rows a tree renders.
 *
 * ONE implementation for both trees — the switcher's dialog and the Manage
 * Resources page — so a level's indent, its chevron and its Type label can never
 * disagree between the two.
 *
 * A node is a ROOT when its `parentId` is null or names a node absent from the
 * list: that is what lets the same function flatten the whole roster and a
 * search-narrowed subset without a second code path.
 *
 * SEARCH prunes and reveals in one pass. A node survives when it matches or when
 * any descendant does — so the path down to a match stays on screen instead of a
 * matching workspace appearing at the root with no parent — and while a term is
 * live every surviving node is forced open, because a match hidden inside a
 * collapsed parent is a filter that answers with a blank list.
 *
 * @param {Array<object>} list Accounts to lay out.
 * @param {{ expandedIds?: Set<number>, search?: string }} [options]
 * @returns {Array<object>} Rows tagged with `depth`, `hasChildren`, `expanded`,
 *   `typeLabel` and `icon`.
 */
export function accountTreeRows(list, { expandedIds = new Set(), search = '' } = {}) {
  const needle = String(search).trim().toLowerCase()
  const ids = new Set(list.map((account) => account.id))

  const childrenOf = new Map()
  for (const account of list) {
    const parent = account.parentId != null && ids.has(account.parentId) ? account.parentId : null
    if (!childrenOf.has(parent)) childrenOf.set(parent, [])
    childrenOf.get(parent).push(account)
  }

  // Name, account id and client id — a support thread carries an id far more often
  // than a name. The TIER is not in the haystack: it is what the tree itself says.
  const matches = (account) =>
    !needle ||
    `${account.name} ${account.id} ${account.clientId}`.toLowerCase().includes(needle)

  const walk = (parentId, depth) => {
    const out = []
    for (const account of childrenOf.get(parentId) ?? []) {
      const children = childrenOf.get(account.id) ?? []
      const subtree = walk(account.id, depth + 1)
      if (needle && !matches(account) && subtree.length === 0) continue

      const type = accountTypeOf(account.type)
      const expanded = needle ? true : expandedIds.has(account.id)
      out.push({
        ...account,
        depth,
        hasChildren: children.length > 0,
        expanded,
        typeLabel: type.typeLabel,
        icon: type.icon
      })
      if (expanded) out.push(...subtree)
    }
    return out
  }

  return walk(null, 0)
}

// Every node that owns children — what an "expand all" starts from, and the
// default the switcher's tree opens on: the whole roster is a couple of dozen
// rows, so opening it closed would cost three clicks to reach the tier an
// operator actually switches to.
export const expandableAccountIds = (list) => {
  const parents = new Set()
  for (const account of list) {
    if (account.parentId != null) parents.add(account.parentId)
  }
  return parents
}

// Flatten the live store's tree (Manage Resources). Same rules as above.
export function flattenTree(expandedIds) {
  return accountTreeRows(accounts.value, { expandedIds })
}

// THE ROSTER IS A REQUEST — the whole tree, once.
//
// The console fetched one tier at a time (`listTypeAccountService`, one request per
// `account_type`), which is what a tier-at-a-time table needs. A TREE needs the
// shape, not a slice: the switcher renders Organizations with their Groups and
// Workspaces beneath them, so it asks once and then expands and filters what it is
// holding — no request per chevron.
//
// Here the seed stands in for that API, and the latency is the point: it is what
// makes the dialog's skeleton rows and its retry path real rather than theoretical.
const ROSTER_LATENCY_MS = 420

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Every tenancy the operator can act as, across all three tiers.
 *
 * @returns {Promise<{ results: Array<object> }>} The flat list; the caller lays it
 *   out with `accountTreeRows`.
 */
export async function listAccountTree() {
  await wait(ROSTER_LATENCY_MS)
  return { results: accounts.value.map((account) => ({ ...account })) }
}

// One shared instance across every import (module-level singleton).
export function useAccounts() {
  return { accounts, currentAccount, currentAccountId, switchAccount }
}
