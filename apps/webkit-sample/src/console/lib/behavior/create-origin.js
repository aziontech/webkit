// WHERE A CREATE FLOW GOES BACK TO.
//
// Every first-level create is a PAGE at `/<module>/new` (./surfaces.js holds the rule), and
// a page is reached from two kinds of place:
//
//   THE MODULE'S OWN LIST — the default, and what the flow assumes when nothing says
//     otherwise. Its own Create button is right there, so back means the list.
//   THE CREATION CENTER — the screen that lists every way in (`/create`). A reader who
//     picked "Workload" out of that rail did not come from the Workloads list and has
//     probably never seen it; dropping them there afterwards is a page they did not ask
//     for, and it silently loses the index they were working from.
//
// So the ORIGIN travels in `?from=`, and the flow's chrome reads it: the breadcrumb's first
// crumb, the header's back button, Cancel, and the navigation that follows a successful
// create all point at the place the reader actually came from. Nothing else about the flow
// changes — it is the same page at the same URL either way, which is the whole reason it
// stayed a page instead of being embedded in the pane it was opened from.
//
// `?from=` PREDATES THIS and keeps working exactly as it did: Overview's first-use card
// already sends its own pinned address (`from=/home-empty-state`) so a create started there
// returns to the version of Overview that opened it. Only the LABEL is new, and only for the
// Creation Center — the one origin whose name we know. Everything else keeps the module's
// own label, which is what those callers were already showing.
import { computed, toValue } from 'vue'
import { useRoute } from 'vue-router'

/** The Creation Center — the one origin a create flow can name. */
export const CREATION_CENTER_PATH = '/create'
export const CREATION_CENTER_LABEL = 'Creation Center'

/**
 * The place this create flow returns to, and what to call it.
 *
 * @param {string | (() => string)} fallbackPath where to go when nothing sent an origin —
 *   the module's own list. A getter, for a flow whose module is decided by a prop
 *   (the generated create page serves ten of them).
 * @param {string | (() => string)} fallbackLabel that list's name, same shape.
 * @returns {{ path: import('vue').ComputedRef<string>, label: import('vue').ComputedRef<string> }}
 */
export function useCreateOrigin(fallbackPath, fallbackLabel) {
  const route = useRoute()

  // A bare path only — anything after a `?` is dropped, because every caller pushes this as
  // `{ path }` with its own query and a path holding a query string would be pushed whole.
  const from = computed(() =>
    typeof route.query.from === 'string' ? route.query.from.split('?')[0] : ''
  )

  return {
    path: computed(() => from.value || toValue(fallbackPath)),
    label: computed(() =>
      from.value === CREATION_CENTER_PATH ? CREATION_CENTER_LABEL : toValue(fallbackLabel)
    )
  }
}
