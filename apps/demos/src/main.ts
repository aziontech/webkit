import './webkit.css'
import './styles.css'
import '@aziontech/icons'

import { createApp } from 'vue'

import App from './App.vue'
import { restoreSettings } from './lib/settings'
import { router } from './router'

restoreSettings()
createApp(App).use(router).mount('#app')
