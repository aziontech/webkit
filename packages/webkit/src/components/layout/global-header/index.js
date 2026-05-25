import GlobalHeaderRoot from './global-header.vue'
import GlobalHeaderBrand from './global-header-brand.vue'
import GlobalHeaderLeft from './global-header-left.vue'
import GlobalHeaderMiddle from './global-header-middle.vue'
import GlobalHeaderRight from './global-header-right.vue'

/** @type {any} */
const GlobalHeader = GlobalHeaderRoot

GlobalHeader.Left = GlobalHeaderLeft
GlobalHeader.Middle = GlobalHeaderMiddle
GlobalHeader.Right = GlobalHeaderRight
GlobalHeader.Brand = GlobalHeaderBrand

export default GlobalHeader
