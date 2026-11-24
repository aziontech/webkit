import '@aziontech/theme'
import '@aziontech/theme/fonts.css'
import '../../../assets/fonts/proto-mono/proto-mono-woff2.css'
import './styles/main.css'
import '@aziontech/icons'
import '@aziontech/webkit/styles/country-flags'

import { ViteSSG } from 'vite-ssg'

import App from './app.vue'
import { loadDocsShell } from './lib/docs-shell-loader'
import { preloadRoute } from './lib/route-data'
import { routes } from './router'

if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/frame/')) {
  void loadDocsShell()
}

export const createApp = ViteSSG(
  App,
  {
    routes,
    scrollBehavior(to, _from, saved) {
      if (saved) return saved
      if (to.hash) return { el: to.hash, top: 80 }
      return { top: 0 }
    }
  },
  ({ router }) => {
    router.beforeResolve(async (to) => {
      await preloadRoute(to)
    })
  },
  { hydration: true }
)
