// App-wide font-family state. A module-level singleton (like theme.js) so the
// selected typeface persists across route changes and reloads (localStorage).
//
// This is a TEST HARNESS: it swaps only the primary *sans* face while keeping
// 100% of the theme's type scale (sizes / weights / letter-spacing) intact. It
// works by setting `--app-font` on <html>; src/style.css points the inherited
// body font (and the button text tokens) at that variable. Code (Roboto Mono),
// overlines & big numbers (Proto Mono), and icon glyphs keep their own faces.
//
// Non-default families load lazily from Google Fonts on first selection.
import { ref, watch } from "vue";

const STORAGE_KEY = "webkit-sample-font";

// The available faces. `value` is the persisted key; `stack` is the CSS
// font-family applied to --app-font; `href` is the Google Fonts stylesheet
// (omitted for the default, which the app already ships from the Azion CDN).
export const FONTS = [
  { value: "sora", label: "Sora (Default)", stack: "'Sora', sans-serif" },
  {
    value: "inter",
    label: "Inter",
    stack: "'Inter', sans-serif",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap",
  },
  {
    value: "rubik",
    label: "Rubik",
    stack: "'Rubik', sans-serif",
    href: "https://fonts.googleapis.com/css2?family=Rubik:wght@300..900&display=swap",
  },
  {
    value: "ibm-plex-sans",
    label: "IBM Plex Sans",
    stack: "'IBM Plex Sans', sans-serif",
    href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap",
  },
  {
    value: "geist",
    label: "Geist",
    stack: "'Geist', sans-serif",
    href: "https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap",
  },
  {
    value: "roboto",
    label: "Roboto",
    stack: "'Roboto', sans-serif",
    href: "https://fonts.googleapis.com/css2?family=Roboto:wght@100..900&display=swap",
  },
  {
    value: "work-sans",
    label: "Work Sans",
    stack: "'Work Sans', sans-serif",
    href: "https://fonts.googleapis.com/css2?family=Work+Sans:wght@100..900&display=swap",
  },
  {
    value: "instrument-sans",
    label: "Instrument Sans",
    stack: "'Instrument Sans', sans-serif",
    href: "https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400..700&display=swap",
  },
];

const DEFAULT_FONT = "sora";
const VALUES = FONTS.map((f) => f.value);

const readStoredFont = () => {
  if (typeof localStorage === "undefined") return DEFAULT_FONT;
  const saved = localStorage.getItem(STORAGE_KEY);
  return VALUES.includes(saved) ? saved : DEFAULT_FONT;
};

// Inject the Google Fonts stylesheet once, on demand. Idempotent by id.
const ensureFontLoaded = (font) => {
  if (!font?.href || typeof document === "undefined") return;
  const id = `google-font-${font.value}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = font.href;
  document.head.appendChild(link);
};

const applyFont = (value) => {
  const font = FONTS.find((f) => f.value === value) ?? FONTS[0];
  ensureFontLoaded(font);
  const root = document.documentElement;
  root.style.setProperty("--app-font", font.stack);
  root.setAttribute("data-font", font.value);
};

const font = ref(readStoredFont());

watch(
  font,
  (value) => {
    applyFont(value);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, value);
    }
  },
  { immediate: true },
);

export function useFont() {
  return { font, fonts: FONTS };
}
