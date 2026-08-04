// App-wide sidebar state: whether the rail is collapsed, and how wide it is when
// it isn't. A module-level singleton (like theme.js / font.js) so both survive
// route changes (the user keeps their choice when navigating between modules)
// and reloads (via localStorage).
import { ref, watch } from "vue";

const STORAGE_KEY = "webkit-sample-sidebar-collapsed";
const EXPANDED_KEY = "webkit-sample-sidebar-expanded";
const WIDTH_KEY = "webkit-sample-sidebar-width";

const readStoredCollapsed = () => {
  if (typeof localStorage === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "true";
};

// `null` means "not sized yet" — the shell seeds it from the rail's natural
// width on first mount, after which the drag handle owns it. Stored in px: the
// value is the outcome of a pointer gesture, so px is its native unit; the
// bounds it is clamped to are the ones that come from tokens.
const readStoredWidth = () => {
  if (typeof localStorage === "undefined") return null;
  const stored = Number(localStorage.getItem(WIDTH_KEY));
  return Number.isFinite(stored) && stored > 0 ? stored : null;
};

// Which nav categories the user has opened. Every page renders its own AppLayout, so the
// sidebar remounts on navigation — held in the component this would reset, and opening one
// category would appear to close the others. The user owns this; the active route only ever
// ADDS to it (see AppSidebar), so feedback never costs someone their own choice.
const readStoredExpanded = () => {
  if (typeof localStorage === "undefined") return [];
  try {
    const stored = JSON.parse(localStorage.getItem(EXPANDED_KEY) ?? "[]");
    return Array.isArray(stored) ? stored.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
};

const expanded = ref(readStoredExpanded());

// Which drill level the rail is showing, as Menu's stack of ancestor ids. This has to outlive
// the component for the same reason `expanded` does — every page renders its own AppLayout, so
// the rail remounts on navigation — and here it is load-bearing rather than merely nice:
// activating a drill row also routes to that level's landing page, so held in the component the
// level would collapse on the very navigation that opened it.
//
// Deliberately NOT persisted, unlike the three above: a pushed level is where you are looking
// right now, not a preference, so a fresh load starts at the root.
const navPath = ref([]);

// Whether the navigation the rail is being rebuilt for TRAVELLED between levels — into the
// Settings level, or back out to the root rail — as opposed to moving between rows of the level
// the reader was already in. Both remount the rail with the same restored stack, so `Menu` cannot
// tell them apart; this is the answer it needs for `enter-on-mount`.
//
// Derived from the PAGE, not from the control that was clicked, so every route into a level
// animates alike: the rail's own Settings row, the header's account menu, the ⌘K palette, a
// breadcrumb, a pasted link. Keyed on which control it was, only the rail's row would.
const navEntering = ref(false);

// Which page last reported, the level THAT page was in, and whether the rail has rendered at all.
let lastLevelFor = null;
let shownLevel = null;
let levelSeeded = false;

/**
 * Reports the level the page being rendered belongs to, and derives whether arriving there is an
 * entrance. Call it with the id of the row the page marks active.
 *
 * The comparison is page-against-page (`shownLevel`), deliberately NOT against `navPath`.
 * Activating the rail's own drill row pushes the level *before* it navigates, so by the time the
 * remount reports, `navPath` already holds the new level — measured against it, the one entrance
 * the reader is most likely to use would be the only one that never animates.
 *
 * Two guards earn their place:
 * - **First render is never an entrance.** A cold load or a deep link arrives already inside the
 *   level; it did not travel there, so the menu should be settled, not sliding.
 * - **One decision per page.** Two rails are mounted (the desktop one and the mobile drawer), and
 *   both report the same page. Without keying on `activeId` the second report would clear the
 *   flag the first just set.
 */
export function reportNavLevel(activeId, levels) {
  const level = levels.join("/");
  if (activeId !== lastLevelFor) {
    navEntering.value = levelSeeded && level !== shownLevel;
    lastLevelFor = activeId;
    shownLevel = level;
    levelSeeded = true;
  }
  if (level !== navPath.value.join("/")) navPath.value = levels;
}

/**
 * Takes the stack back from `Menu` (the `path` model). A POP is the one level change that does not
 * navigate: `Menu.Back` plays its own motion in the mounted menu and leaves the reader looking at
 * the level it returned to. Recording that as the shown level is what stops the NEXT navigation
 * from replaying an entrance for a rail already on screen. A push is left alone — the navigation
 * that follows it is the arrival that should animate.
 */
export function setNavPath(levels) {
  const isPop = levels.length < navPath.value.length;
  navPath.value = levels;
  if (isPop) shownLevel = levels.join("/");
}

watch(
  expanded,
  (value) => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(EXPANDED_KEY, JSON.stringify(value));
    }
  },
  { deep: true }
);

const collapsed = ref(readStoredCollapsed());
const railWidth = ref(readStoredWidth());

watch(collapsed, (value) => {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(STORAGE_KEY, String(value));
  }
});

watch(railWidth, (value) => {
  if (typeof localStorage !== "undefined" && value != null) {
    localStorage.setItem(WIDTH_KEY, String(Math.round(value)));
  }
});

export function useSidebar() {
  return { collapsed, railWidth, expanded, navPath, navEntering };
}
