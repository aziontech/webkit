// WHERE A CREATE FLOW GOES BACK TO.
//
// Every first-level create is a PAGE at `/<module>/new` (./surfaces.js holds the rule), and
// a page is reached from two kinds of place:
//
//   THE MODULE'S OWN LIST — the default, and what the flow assumes when nothing says
//     otherwise. Its own Create button is right there, so back means the list.
//   A SCREEN THAT SENT THEM — Overview's first-use card sends its own pinned address
//     (`from=/home-empty-state`), so a create started there returns to the version of
//     Overview that opened it rather than to a list the reader has never seen.
//
// So the ORIGIN travels in `?from=`, and the flow's chrome reads it: the breadcrumb's first
// crumb, the header's back button, Cancel, and the navigation that follows a successful
// create all point at the place the reader actually came from. Nothing else about the flow
// changes — it is the same page at the same URL either way, which is the whole reason it
// stayed a page instead of being embedded in the screen it was opened from.
//
// The LABEL is the origin's name, and a caller that HAS one sends it in `?fromLabel=` —
// a workload sends its own name, so a firewall created from its topology is framed by
// the workload the reader is still working in rather than by the module list they never
// opened. One origin carries a name we know without being told: the Creation Center,
// whose rail of resource rows is archived (../../pages/resources/archive/) and would send
// `from=/create` again if it were remounted. Everything else that sends no label keeps the
// module's own, which is what they were already showing.
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
 * @param {string | (() => string)} fallbackLabel that list's name, same shape. Used unless
 *   the origin sent a name of its own in `?fromLabel=`.
 * @returns {{ path: import('vue').ComputedRef<string>, label: import('vue').ComputedRef<string> }}
 */
export function useCreateOrigin(fallbackPath, fallbackLabel) {
  const route = useRoute()

  // A bare path only — anything after a `?` is dropped, because every caller pushes this as
  // `{ path }` with its own query and a path holding a query string would be pushed whole.
  const from = computed(() =>
    typeof route.query.from === 'string' ? route.query.from.split('?')[0] : ''
  )

  // Only read when an origin was actually sent: a label pointing at the module's own list
  // would name it something the list never calls itself.
  const fromLabel = computed(() =>
    from.value && typeof route.query.fromLabel === 'string' ? route.query.fromLabel.trim() : ''
  )

  return {
    path: computed(() => from.value || toValue(fallbackPath)),
    label: computed(() => {
      if (from.value === CREATION_CENTER_PATH) return CREATION_CENTER_LABEL
      return fromLabel.value || toValue(fallbackLabel)
    })
  }
}
