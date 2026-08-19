// Recents — the order every tenancy switcher lists in.
//
// A switcher's roster has a natural order (the seed's ownership chain, alphabetical,
// whatever the API returns) and it is almost never the order the operator wants. What
// they want is what they were just in: an operator working an incident moves between
// the same two accounts twenty times, and each of those trips should not cost a scan
// of a ten-row list. So each panel lists the places you have been, most recent first,
// then everything else in its roster order — and the place you are in is always the
// first row.
//
// ONE MODULE FOR THE THREE LEVELS, because the rule is identical at each and the three
// panels are one component (../../components/shell/AccountSwitcher.vue). The scope key
// is that component's own `kind`, so there is nothing to map.
//
// NOT PERSISTED, on purpose. The tenancy selection itself is a plain `ref` in
// ./accounts.js / ./organizations.js / ./workspaces.js — a reload returns to the boot
// account — so recents that outlived the reload would order the list by a session the
// app had already forgotten. It is memory of a session, and it lasts exactly as long.
// (Contrast ./sample-mode.js and ../../../shared/lib/theme.js, which persist because
// they describe the reader's setup rather than their trail through it.)
import { ref } from 'vue'

/** The three scopes a switcher lists — the `kind` values of the switcher component. */
export const RECENT_SCOPES = ['organization', 'account', 'workspace']

const emptyTrail = () => ({ organization: [], account: [], workspace: [] })

// Ids, most recently visited first, per scope. Replaced rather than mutated so the
// switcher's computed re-runs.
const trail = ref(emptyTrail())

// Uncapped: the longest roster here is a few dozen rows, so a trail can never outgrow
// the list it orders. A real console would cap it at the number of rows a panel shows.
/** Record a visit. Moves `id` to the front of its scope's trail. */
export function rememberRecent(scope, id) {
  if (!RECENT_SCOPES.includes(scope)) return
  if (id === undefined || id === null) return
  const visited = trail.value[scope] ?? []
  trail.value = { ...trail.value, [scope]: [id, ...visited.filter((entry) => entry !== id)] }
}

/**
 * `items`, reordered: the current one first, then the trail in visit order, then the
 * rest untouched.
 *
 * Everything outside the trail shares one rank, and `Array.prototype.sort` is stable,
 * so the roster's own order survives inside that group — the list is re-ordered at the
 * top and unchanged below it. (One rank, not `Infinity`: `Infinity - Infinity` is `NaN`
 * and a comparator that returns `NaN` sorts arbitrarily.)
 */
export function orderByRecents(scope, items, currentId) {
  const visited = trail.value[scope] ?? []
  if (!visited.length && (currentId === undefined || currentId === null)) return items

  const rankOf = (item) => {
    if (item?.id === currentId) return -1
    const index = visited.indexOf(item?.id)
    return index === -1 ? visited.length : index
  }

  return [...items].sort((a, b) => rankOf(a) - rankOf(b))
}

/** Reset every trail — for a demo that wants the seeded order back. */
export function forgetRecents() {
  trail.value = emptyTrail()
}

export function useRecents() {
  return { trail, rememberRecent, orderByRecents, forgetRecents }
}
