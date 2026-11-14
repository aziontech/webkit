import GlobalHeaderRoot from './global-header.vue'
import GlobalHeaderBrand from './global-header-brand.vue'
import GlobalHeaderCenter from './global-header-center.vue'
import GlobalHeaderContainer from './global-header-container.vue'
import GlobalHeaderEnd from './global-header-end.vue'
import GlobalHeaderLeft from './global-header-left.vue'
import GlobalHeaderMiddle from './global-header-middle.vue'
import GlobalHeaderRight from './global-header-right.vue'
import GlobalHeaderStart from './global-header-start.vue'

type CompoundGlobalHeader = typeof GlobalHeaderRoot & {
  Container: typeof GlobalHeaderContainer
  Start: typeof GlobalHeaderStart
  Center: typeof GlobalHeaderCenter
  End: typeof GlobalHeaderEnd
  Brand: typeof GlobalHeaderBrand
  /** @deprecated since 6.0 — use `GlobalHeader.Start`. Removed in 7.0. */
  Left: typeof GlobalHeaderLeft
  /** @deprecated since 6.0 — use `GlobalHeader.Center`. Removed in 7.0. */
  Middle: typeof GlobalHeaderMiddle
  /** @deprecated since 6.0 — use `GlobalHeader.Center`. Removed in 7.0. */
  Nav: typeof GlobalHeaderMiddle
  /** @deprecated since 6.0 — use `GlobalHeader.End`. Removed in 7.0. */
  Right: typeof GlobalHeaderRight
}

const GlobalHeader = Object.assign(GlobalHeaderRoot, {
  Container: GlobalHeaderContainer,
  Start: GlobalHeaderStart,
  Center: GlobalHeaderCenter,
  End: GlobalHeaderEnd,
  Brand: GlobalHeaderBrand,
  Left: GlobalHeaderLeft,
  Middle: GlobalHeaderMiddle,
  Nav: GlobalHeaderMiddle,
  Right: GlobalHeaderRight
}) as CompoundGlobalHeader

export default GlobalHeader
export type { GlobalHeaderKind } from './global-header.vue'
