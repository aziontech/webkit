import '@aziontech/theme'
import './styles/main.css'
import '@aziontech/icons'
import '@aziontech/webkit/styles/country-flags'

import { ViteSSG } from 'vite-ssg'

import App from './App.vue'
import { preloadRoute } from './lib/data'
import { routes } from './routes'

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
