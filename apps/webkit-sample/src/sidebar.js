// App-wide sidebar collapse state. A module-level singleton (like theme.js /
// font.js) so the collapsed/expanded rail persists across route changes (the
// user keeps their choice when navigating between modules) and across reloads
// (via localStorage).
import { ref, watch } from "vue";

const STORAGE_KEY = "webkit-sample-sidebar-collapsed";

const readStoredCollapsed = () => {
  if (typeof localStorage === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "true";
};

const collapsed = ref(readStoredCollapsed());

watch(collapsed, (value) => {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(STORAGE_KEY, String(value));
  }
});

export function useSidebar() {
  return { collapsed };
}
