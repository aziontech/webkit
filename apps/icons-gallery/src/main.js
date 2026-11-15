import { createApp } from 'vue'
import Vue3ColorPicker from 'vue3-colorpicker'

import './styles/main.css'
import '@aziontech/icons'
import 'vue3-colorpicker/style.css'

import App from './app.vue'
import { initializeTheme } from './lib/theme'

initializeTheme()
createApp(App).use(Vue3ColorPicker).mount('#app')
