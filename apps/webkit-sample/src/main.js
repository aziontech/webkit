import { createApp } from 'vue'

// Theme tokens + Tailwind v4 entry (`@import "tailwindcss"` + @theme + @source).
// Imported from JS — not via CSS `@import` in style.css — so the theme's
// `@source "../../packages/webkit/src"` resolves against the theme package's
// own location instead of being rebased into this app's tree.
import '@aziontech/theme'
import './style.css'
import App from './App.vue'
import { router } from './router'

createApp(App).use(router).mount('#app')
