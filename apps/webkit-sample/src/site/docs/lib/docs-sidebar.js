// Docs-shell rail state: whether the documentation navigation is collapsed, and
// how wide it is when it isn't. A module-level singleton (like theme.js /
// sidebar.js) so both survive route changes and reloads (via localStorage).
//
// Deliberately SEPARATE from sidebar.js: the console rail and the docs rail are
// two different objects, sized for two different jobs — a 275-row documentation
// tree wants more room than a product nav — so collapsing or sizing one must not
// move the other.
import { ref, watch } from 'vue'

const COLLAPSED_KEY = 'webkit-sample-docs-sidebar-collapsed'
const WIDTH_KEY = 'webkit-sample-docs-sidebar-width'

const readStoredCollapsed = () => {
  if (typeof localStorage === 'undefined') return false
  return localStorage.getItem(COLLAPSED_KEY) === 'true'
}

// `null` means "not sized yet" — the shell seeds it from the rail's natural width
// on first mount, after which the drag handle owns it. Stored in px: the value is
// the outcome of a pointer gesture, so px is its native unit; the bounds it is
// clamped to are the ones that come from tokens.
const readStoredWidth = () => {
  if (typeof localStorage === 'undefined') return null
  const stored = Number(localStorage.getItem(WIDTH_KEY))
  return Number.isFinite(stored) && stored > 0 ? stored : null
}

const collapsed = ref(readStoredCollapsed())
const railWidth = ref(readStoredWidth())

// Which CONDENSED rows are expanded. A singleton for the same reason the two above are:
// `DocsLayout` remounts on every navigation (each view renders its own), so a row the
// reader opened by hand would fold itself the moment they picked a page inside it — which
// is the one click that makes folding most wrong. NOT persisted to localStorage: an open
// row is a position in this visit's reading, not a preference like the rail's width.
// `Menu` owns the model; this is where the consumer holds it between mounts, which is
// exactly what its `v-model:expanded` exists for.
const expanded = ref([])

watch(collapsed, (value) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(COLLAPSED_KEY, String(value))
  }
})

watch(railWidth, (value) => {
  if (typeof localStorage !== 'undefined' && value != null) {
    localStorage.setItem(WIDTH_KEY, String(Math.round(value)))
  }
})

export function useDocsSidebar() {
  return { collapsed, railWidth, expanded }
}
