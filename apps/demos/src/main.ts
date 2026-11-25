import './webkit.css'
import '../../../assets/fonts/proto-mono/proto-mono-woff2.css'
import './styles/main.css'
import '@aziontech/icons'

import { createApp } from 'vue'

import App from './app.vue'
import { restoreSettings } from './lib/settings'
import { router } from './router'

restoreSettings()
const app = createApp(App).use(router)
router.isReady().then(() => app.mount('#app'))
