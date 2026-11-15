import './webkit.css'
import './styles/main.css'
import '@aziontech/icons'

import { createApp } from 'vue'

import App from './app.vue'
import { restoreSettings } from './lib/settings'
import { router } from './router'

restoreSettings()
createApp(App).use(router).mount('#app')
