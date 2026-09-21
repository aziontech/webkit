// Theme tokens + Tailwind v4 entry (`@import "tailwindcss"` + @theme + @source).
// Imported from JS — not via CSS `@import` in style.css — so the theme's
// `@source "../../packages/webkit/src"` resolves against the theme package's
// own location instead of being rebased into this app's tree.
import '@aziontech/theme'
import './style.css'
// The legacy console's palette, applied only while <html> carries `ui-legacy`
// (shared/lib/legacy-ui.js). Imported after the theme so the override it defines
// sits beside the tokens it overrides.
import './legacy-ui.css'

import { createApp } from 'vue'

import App from './App.vue'
import { router } from './router/index'

createApp(App).use(router).mount('#app')
