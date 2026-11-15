import AppHeaderRoot from './app-header.vue'
import AppHeaderBrand from './app-header-brand.vue'
import AppHeaderCenter from './app-header-center.vue'
import AppHeaderContainer from './app-header-container.vue'
import AppHeaderEnd from './app-header-end.vue'
import AppHeaderStart from './app-header-start.vue'

type CompoundAppHeader = typeof AppHeaderRoot & {
  Container: typeof AppHeaderContainer
  Start: typeof AppHeaderStart
  Center: typeof AppHeaderCenter
  End: typeof AppHeaderEnd
  Brand: typeof AppHeaderBrand
}

const AppHeader = Object.assign(AppHeaderRoot, {
  Container: AppHeaderContainer,
  Start: AppHeaderStart,
  Center: AppHeaderCenter,
  End: AppHeaderEnd,
  Brand: AppHeaderBrand
}) as CompoundAppHeader

export default AppHeader
export type { AppHeaderVariant } from './app-header.vue'
export type { AppHeaderProps } from './app-header.vue'
