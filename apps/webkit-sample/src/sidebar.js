// App-wide sidebar state: whether the rail is collapsed, and how wide it is when
// it isn't. A module-level singleton (like theme.js / font.js) so both survive
// route changes (the user keeps their choice when navigating between modules)
// and reloads (via localStorage).
import { ref, watch } from "vue";

const STORAGE_KEY = "webkit-sample-sidebar-collapsed";
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
  return { collapsed, railWidth };
}
