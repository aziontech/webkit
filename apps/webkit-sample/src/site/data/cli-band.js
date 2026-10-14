import { markRaw } from 'vue'

import FunctionsTerminalScene from '../ui/FunctionsTerminalScene.vue'
import { PRODUCT_DOCS } from './product-pages.js'

export const cliBand = ({ title, description, script = 'deploy' }) => ({
  section: 'MediaSplitBand',
  eyebrow: 'Azion CLI',
  title,
  description,
  scene: {
    component: markRaw(FunctionsTerminalScene),
    props: { script, texture: false, speed: 2.5 }
  },
  actions: [
    { label: 'Start free', href: '/signup' },
    { label: 'Install the CLI', href: PRODUCT_DOCS, kind: 'outlined', icon: 'pi pi-book' }
  ]
})
