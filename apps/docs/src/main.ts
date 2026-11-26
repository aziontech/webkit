import '@aziontech/theme'
import '@aziontech/theme/fonts.css'
import '../../../assets/fonts/proto-mono/proto-mono-woff2.css'
import './styles/main.css'
import '@aziontech/icons'
import '@aziontech/ui/styles/country-flags'

import { ViteSSG } from 'vite-ssg'

import App from './app.vue'
import { loadDocsShell } from './lib/docs-shell-loader'
import { loadMessages } from './lib/i18n'
import { splitLocalePath } from './lib/locale-path'
import { preloadRoute } from './lib/route-data'
import { settings } from './lib/settings'
import { loadAzionUiCatalog } from './lib/azion-ui-catalogs'
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
    router.beforeEach(async (to) => {
      const { locale, path } = splitLocalePath(to.path)
      if (locale) settings.locale = locale
      else if (import.meta.env.SSR) settings.locale = 'en'
      await Promise.all([loadMessages(settings.locale), loadAzionUiCatalog(settings.locale)])
      return locale ? { path, query: to.query, hash: to.hash, replace: true } : true
    })
    router.beforeResolve(async (to) => {
      await preloadRoute(to)
    })
  },
  { hydration: true }
)
