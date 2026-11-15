import GlobalHeaderRoot from './global-header.vue'
import GlobalHeaderBrand from './global-header-brand.vue'
import GlobalHeaderCenter from './global-header-center.vue'
import GlobalHeaderContainer from './global-header-container.vue'
import GlobalHeaderEnd from './global-header-end.vue'
import GlobalHeaderStart from './global-header-start.vue'

type CompoundGlobalHeader = typeof GlobalHeaderRoot & {
  Container: typeof GlobalHeaderContainer
  Start: typeof GlobalHeaderStart
  Center: typeof GlobalHeaderCenter
  End: typeof GlobalHeaderEnd
  Brand: typeof GlobalHeaderBrand
}

const GlobalHeader = Object.assign(GlobalHeaderRoot, {
  Container: GlobalHeaderContainer,
  Start: GlobalHeaderStart,
  Center: GlobalHeaderCenter,
  End: GlobalHeaderEnd,
  Brand: GlobalHeaderBrand
}) as CompoundGlobalHeader

export default GlobalHeader
export type { GlobalHeaderKind } from './global-header.vue'
