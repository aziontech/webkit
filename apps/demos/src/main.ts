import './azion-ui.css'
import '../../../assets/fonts/proto-mono/proto-mono-woff2.css'
import './styles/main.css'
import '@aziontech/icons'

import { createApp } from 'vue'

import App from './app.vue'
import { loadCatalog, restoreSettings, settings } from './lib/settings'
import { router } from './router'

restoreSettings()
const app = createApp(App).use(router)
Promise.all([router.isReady(), loadCatalog(settings.locale)]).then(() => app.mount('#app'))
