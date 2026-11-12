import GlobalHeaderRoot from './global-header.vue'
import GlobalHeaderBrand from './global-header-brand.vue'
import GlobalHeaderContainer from './global-header-container.vue'
import GlobalHeaderLeft from './global-header-left.vue'
import GlobalHeaderMiddle from './global-header-middle.vue'
import GlobalHeaderRight from './global-header-right.vue'

type CompoundGlobalHeader = typeof GlobalHeaderRoot & {
  Container: typeof GlobalHeaderContainer
  Left: typeof GlobalHeaderLeft
  Middle: typeof GlobalHeaderMiddle
  Nav: typeof GlobalHeaderMiddle
  Right: typeof GlobalHeaderRight
  Brand: typeof GlobalHeaderBrand
}

const GlobalHeader = Object.assign(GlobalHeaderRoot, {
  Container: GlobalHeaderContainer,
  Left: GlobalHeaderLeft,
  Middle: GlobalHeaderMiddle,
  Nav: GlobalHeaderMiddle,
  Right: GlobalHeaderRight,
  Brand: GlobalHeaderBrand
}) as CompoundGlobalHeader

export default GlobalHeader
export type { GlobalHeaderKind } from './global-header.vue'
