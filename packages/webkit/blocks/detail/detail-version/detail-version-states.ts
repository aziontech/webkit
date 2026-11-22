import type { TagSeverity, TagVariant } from '@aziontech/webkit/tag'

import type {
  VersionDetailState,
  VersionDetailTab,
  VersionDetailVersion
} from './detail-version.vue'

/** How a version state reads as a tag. */
export interface VersionDetailStateTag {
  /** Tag label. */
  label: string
  /** Tag severity. */
  severity?: TagSeverity
  /** Tag variant. */
  variant?: TagVariant
  /** Tag glyph, or an empty string. */
  icon: string
}

export const STATE_TAGS: Record<VersionDetailState, VersionDetailStateTag> = {
  draft: { label: 'Draft', severity: 'warning', icon: 'az az-file-pen' },
  deployed: { label: 'Deployed', variant: 'primary', icon: '' },
  ready: { label: 'Ready', severity: 'success', icon: '' }
}

export const tagFor = (entry: VersionDetailVersion): VersionDetailStateTag =>
  STATE_TAGS[entry.state]

export const VERSION_TABS: { value: VersionDetailTab; label: string }[] = [
  { value: 'main-settings', label: 'Settings' },
  { value: 'source', label: 'Source' },
  { value: 'device-groups', label: 'Device Groups' },
  { value: 'cache-settings', label: 'Cache Settings' },
  { value: 'functions-instances', label: 'Functions Instances' },
  { value: 'rules-engine', label: 'Rules Engine' }
]

export const ADD_VERSION = '__create-version__'
export const ADD_ENVIRONMENT = '__create-environment__'
