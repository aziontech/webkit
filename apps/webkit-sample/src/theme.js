// App-wide theme state. A module-level singleton so the selected mode persists
// across route changes (Dashboard <-> Account Settings) within the session and
// across reloads (via localStorage).
//
// The mode is mirrored onto the document root: `data-theme` toggles the theme
// tokens shipped by @aziontech/theme (:root/[data-theme=light] vs
// [data-theme=dark]); "system" follows the OS preference live.
import { ref, watch } from "vue";

const STORAGE_KEY = "webkit-sample-theme";
const MODES = ["system", "light", "dark"];

const prefersDark =
  typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null;

const readStoredTheme = () => {
  if (typeof localStorage === "undefined") return "system";
  const saved = localStorage.getItem(STORAGE_KEY);
  return MODES.includes(saved) ? saved : "system";
};

// Resolve "system" to the concrete OS preference; light/dark pass through.
const resolveTheme = (mode) =>
  mode === "system" ? (prefersDark?.matches ? "dark" : "light") : mode;

const applyTheme = (mode) => {
  const resolved = resolveTheme(mode);
  const root = document.documentElement;
  // Drive BOTH selectors the theme ships: `data-theme` and the `.azion.azion-*`
  // class pair. The class pair has the highest specificity, so it must track the
  // active theme or a stale `azion-dark` would override `[data-theme=light]`.
  root.setAttribute("data-theme", resolved);
  root.classList.add("azion");
  root.classList.toggle("azion-dark", resolved === "dark");
  root.classList.toggle("azion-light", resolved === "light");
};

const theme = ref(readStoredTheme());

watch(
  theme,
  (mode) => {
    applyTheme(mode);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, mode);
    }
  },
  { immediate: true },
);

// Keep "system" in sync when the OS preference flips while the app is open.
if (prefersDark) {
  prefersDark.addEventListener("change", () => {
    if (theme.value === "system") applyTheme("system");
  });
}

export function useTheme() {
  return { theme };
}
