// What switching tenancy scope does to the page you are already on.
//
// The header carries three switchers, and they are one chain: an ORGANIZATION
// owns the account tree, an ACCOUNT owns its workspaces, and a WORKSPACE is the
// slice of that account's resources you are looking at. Moving any of the three
// re-scopes everything on screen, so the console's answer is a RELOAD, not a
// silent swap of the rows underneath. This module owns the two halves of that.
//
// 1. THE RELOAD WINDOW (`tenancyReloading`) — a short flag each module list
//    binds to its Table's `loading`, so the rows become skeletons and come back
//    as the new scope's. It is module-level rather than per-page on purpose: a
//    page that MOUNTS inside the window — the list a detail view retreats to,
//    see (2) — opens already loading instead of flashing the old scope's rows
//    for a frame.
//
// 2. THE RETREAT from an opened resource — a detail view is addressed by an id
//    that only existed in the scope we left, so there is nothing there to
//    reload. The router replaces it with the module list that owns it, which
//    then skeletons like any other list. Create/edit FORM routes are left
//    alone: they hold typed input, and taking it away is a bigger surprise than
//    a stale scope.
//
// Which rows each scope then owns is the other half of the story — see
// ./tenancy-scope.js. Installed once, by the app shell (App.vue).
import { computed, ref, watch } from 'vue'

import { useAccounts } from '../accounts'
import { useOrganizations } from '../organizations'
import { useWorkspaces } from '../workspaces'

// How long the skeletons stay. Long enough to read as a fetch (and to cover the
// retreat's route change), short enough that nobody waits for it.
const RELOAD_MS = 900

// Detail route `name` → the module list that owns it.
const LIST_OF_DETAIL = {
  'application-detail': '/applications',
  'workload-detail': '/workloads',
  'deployment-detail': '/deployments',
  'edge-dns-zone-detail': '/edge-dns',
  'bucket-browser': '/object-storage',
  'sql-database-detail': '/sql-database'
}

const reloading = ref(false)
// Pages bind this; only `installTenancyReload` drives it.
const tenancyReloading = computed(() => reloading.value)
let timer

// Read the reload window. Bind `tenancyReloading` to a data-driven Table's
// `loading` (it renders skeleton rows aligned to the columns) or to whatever
// stands in for rows on a page that has none.
export function useTenancyReload() {
  return { tenancyReloading }
}

// Wire every scope switch → reload + retreat. Call once, with the app's router.
export function installTenancyReload(router) {
  const { currentAccountId } = useAccounts()
  const { currentOrganizationId } = useOrganizations()
  const { currentWorkspace } = useWorkspaces()

  // All three switchers are idempotent, so re-picking the current organization /
  // account / workspace never gets here: no reload is triggered for a switch
  // that did not happen. Switching ACCOUNT also moves the workspace (it is
  // derived from the account in scope), and Vue flushes both in one pass — one
  // switch, one reload.
  watch(
    [currentOrganizationId, currentAccountId, () => currentWorkspace.value?.id],
    () => {
      reloading.value = true
      clearTimeout(timer)
      timer = setTimeout(() => {
        reloading.value = false
      }, RELOAD_MS)

      const route = router.currentRoute.value
      const list = LIST_OF_DETAIL[route.name]
      if (!list) return

      // `replace`, not `push`: the resource we are leaving does not exist in the
      // new scope, so Back must not return to it. The email is the sample's
      // session identity and carries over; the rest of the query (tab, filters)
      // described the resource, and goes with it.
      const email = route.query.email
      router.replace({ path: list, query: email ? { email } : {} })
    }
  )
}
