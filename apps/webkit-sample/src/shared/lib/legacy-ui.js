// Legacy UI — the sample repainted in the colours the live console still ships
// (@aziontech/theme 2.0.4). The palette itself is ../../legacy-ui.css; this is the
// switch that puts `ui-legacy` on <html> beside the theme's own `azion-light` /
// `azion-dark`, so the repaint reaches every route — console, site, hub, docs.
//
// Remembered like the theme mode and the sample version: which palette you are
// reviewing is a property of the session, not of the page.
import { computed, ref } from 'vue'

const STORAGE_KEY = 'webkit-sample-legacy-ui'

const readStored = () => {
  if (typeof localStorage === 'undefined') return false
  return localStorage.getItem(STORAGE_KEY) === 'true'
}

const legacy = ref(readStored())

const apply = (value) => {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('ui-legacy', value)
}

apply(legacy.value)

/**
 * Whether the screens are painted with the legacy console's palette.
 *
 * `legacyUi` is the flag every surface binds; `setLegacyUi` is the only way to move it,
 * so the class on <html> and the remembered answer can never disagree.
 */
export function useLegacyUi() {
  return { legacyUi: computed(() => legacy.value), setLegacyUi }
}

/** Repaint, or go back to the current palette. */
export function setLegacyUi(value) {
  const next = Boolean(value)
  legacy.value = next
  apply(next)
  if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, String(next))
}

/**
 * Read `?ui=legacy` on arrival, so a review link can pin the palette it is about.
 * Call once, with the router — like `installSamplePreset`.
 */
export function installLegacyUi(router) {
  router.afterEach((to) => {
    const ui = to.query.ui
    if (typeof ui === 'string') setLegacyUi(ui.toLowerCase() === 'legacy')
  })
}
