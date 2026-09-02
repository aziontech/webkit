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

// Whether the arrival being rendered TRAVELLED between drill levels — into the `Functions`
// level, or back out to the root column — as opposed to moving between pages of the level
// the reader was already in.
//
// `Menu` cannot work this out for itself, and the reason is worth stating: activating the
// drill row also NAVIGATES (its landing row is a real page), so the shell remounts and the
// menu comes back with the same restored stack a navigation *inside* the level would give
// it. Measured, the entrance was 0 interpolated frames against the 16 a pop plays — the
// level simply appeared. This is the answer `enter-on-mount` needs, and it lives out here
// because the remount is exactly what it has to survive.
const entering = ref(false)

// Which page last reported, the level THAT page was in, and whether the rail has rendered.
let lastLevelFor = null
let shownLevel = null
let levelSeeded = false

/**
 * Report the level the page being rendered belongs to, and derive whether arriving there is
 * an entrance.
 *
 * Two guards earn their place, both borrowed from the console rail (lib/state/sidebar.js):
 * - **First render is never an entrance.** A cold load or a pasted link arrives already
 *   inside the level; it did not travel there, so the menu should be settled, not sliding.
 * - **One decision per page.** Both homes of the tree can be mounted over this singleton,
 *   and both report the same page — without keying on the page, the second report would
 *   clear the flag the first just set.
 *
 * @param {string} pageId - id of the row the page marks active.
 * @param {string[]} levels - the drill stack that page sits in.
 */
export function reportDocsLevel(pageId, levels) {
  const level = levels.join('/')
  if (pageId === lastLevelFor) return
  entering.value = levelSeeded && level !== shownLevel
  lastLevelFor = pageId
  shownLevel = level
  levelSeeded = true
}

/**
 * Record a level change the menu made ITSELF — a push through the drill row's arrow, or a
 * pop through `Menu.Back`.
 *
 * BOTH DIRECTIONS COUNT, because both leave the reader looking at the column they moved to:
 * the mounted menu plays that motion where it stands, and no navigation is involved. So the
 * level is already shown, and the next navigation must not replay an entrance for a column
 * that never left the screen.
 *
 * The push used to be left out, on the theory that the navigation following it was the
 * arrival that should animate. It was not: activating the drill row does not navigate (the
 * arrow only reveals the level), so the reader got the push's own slide and then a second,
 * identical slide on the first row they opened inside it — measured as two `data-motion=push`
 * cycles, 300ms apart. What still animates is a level change the menu did NOT make: a pasted
 * URL, the palette, a link in the prose, or the drill row's own label — none of them touch
 * this, so `reportDocsLevel` still calls those an entrance.
 *
 * @param {string[]} levels - the stack the menu is now on.
 */
export function recordDocsLevel(levels) {
  shownLevel = levels.join('/')
}

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
  return { collapsed, railWidth, expanded, entering }
}
