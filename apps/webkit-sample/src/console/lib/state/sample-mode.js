// The sample, in two versions: an EMPTY account and a POPULATED one.
//
// Every console screen is really two screens, and the second one is the one that
// never gets designed: a module with rows is a table, and a module with none has to
// say what the product is and how to get the first one. The sample used to be able
// to show only the populated half, with first use parked on its own review route.
// This module makes it a MODE, so the whole console can be walked in either version
// and the two compared screen for screen.
//
//   empty      → /home is the hero and the three doors (components/HomeEmptyState.vue);
//                Applications, Workloads and Functions render their first-use block
//                (components/ui/ProductFirstUse.vue) instead of a table.
//   populated  → /home is usage beside the resource list, opening on Applications
//                (components/Home.vue); every module lists its seeded rows.
//
// Modules the mode does not touch (Deployments, Edge DNS, Object Storage, …) keep
// their seeded rows in both versions. That is deliberate rather than unfinished:
// three modules is enough to review the pattern, and turning the whole console off
// would make the empty version a screenshot of nothing.
//
// ── HOW IT IS SET ──
//
// The "Sample preset" panel, opened from the account menu — the ⋮ menu in the
// sidebar footer (components/ui/SamplePresetDrawer.vue). The version is one of three
// knobs there; the other two (plan, account switching) live in ./sample-preset.js,
// which re-exports this one so the panel binds a single object. It is the one thing
// on screen that is a prototype affordance and not console UI — plus `?state=empty` /
// `?state=populated` on any URL, so a review comment can pin the version it is
// talking about. The query is read on arrival and then forgotten; it does not stay
// in the address bar, because it is a way IN to a version and not part of the route.
//
// ── WHY IT PERSISTS ──
//
// localStorage, like the sidebar and the theme (src/sidebar.js, src/theme.js): the
// version is a property of the session the reader is running, not of the page they
// are on, and having it reset on every reload would make a walkthrough impossible.
// A fresh browser opens POPULATED — the console with rows in it is the version most
// of the review is about, and an empty console is one knob away; opening on nothing
// made every reader's first move the same click.
import { computed, ref, watch } from 'vue'

const STORAGE_KEY = 'webkit-sample-mode'

/** The two versions, in the order the switcher offers them. */
export const SAMPLE_MODES = [
  { value: 'empty', label: 'Empty account', icon: 'pi pi-inbox' },
  { value: 'populated', label: 'Populated account', icon: 'pi pi-database' }
]

const isMode = (value) => SAMPLE_MODES.some((option) => option.value === value)

const DEFAULT_MODE = 'populated'

const readStored = () => {
  if (typeof localStorage === 'undefined') return DEFAULT_MODE
  const stored = localStorage.getItem(STORAGE_KEY)
  return isMode(stored) ? stored : DEFAULT_MODE
}

const mode = ref(readStored())

watch(mode, (value) => {
  if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, value)
})

/**
 * The version in force.
 *
 * `accountEmpty` is what pages bind: it is the account that owns nothing, which is
 * the fact a screen actually reacts to. Nothing outside the switcher should be
 * comparing `mode` to a string.
 */
export function useSampleMode() {
  return {
    mode,
    accountEmpty: computed(() => mode.value === 'empty'),
    setMode
  }
}

/** Switch versions. Ignores anything that is not one of the two. */
export function setMode(value) {
  if (isMode(value)) mode.value = value
}

/** Read `?state=` on arrival, so a link can pin a version. Call once, with the router. */
export function installSampleMode(router) {
  router.afterEach((to) => {
    const requested = to.query.state
    if (typeof requested === 'string') setMode(requested)
  })
}
