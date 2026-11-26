import { defineAsyncComponent } from 'vue'

import SourcesButton from '../parts/sources-button.vue'
import type { SourcesItem } from '../types'

export interface SourcesRow {
  index: number
  item: SourcesItem
  href: string
  external: boolean
  meta: string
}

export interface SourcesGroup {
  key: 'cited' | 'more'
  label: string
  rows: SourcesRow[]
}

export const LazySourcesMenu = defineAsyncComponent({
  loader: () => import('../parts/sources-menu.vue'),
  loadingComponent: SourcesButton,
  delay: 0
})
