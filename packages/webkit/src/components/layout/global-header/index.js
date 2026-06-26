import GlobalHeaderRoot from './global-header.vue'
import GlobalHeaderBrand from './global-header-brand.vue'
import GlobalHeaderContainer from './global-header-container.vue'
import GlobalHeaderLeft from './global-header-left.vue'
import GlobalHeaderMiddle from './global-header-middle.vue'
import GlobalHeaderRight from './global-header-right.vue'

/** @type {any} */
const GlobalHeader = GlobalHeaderRoot

GlobalHeader.Container = GlobalHeaderContainer
GlobalHeader.Left = GlobalHeaderLeft
GlobalHeader.Middle = GlobalHeaderMiddle
// Figma names the center region "Nav"; expose it as an alias without dropping Middle.
GlobalHeader.Nav = GlobalHeaderMiddle
GlobalHeader.Right = GlobalHeaderRight
GlobalHeader.Brand = GlobalHeaderBrand

export default GlobalHeader
