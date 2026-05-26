import {
  curve,
  duration
} from '../../../../../../theme/src/tokens/primitives/animations/animate.js'

export const POPUP_WIDTH = '--popup-width'
export const POPUP_HEIGHT = '--popup-height'
export const POSITIONER_WIDTH = '--positioner-width'
export const POSITIONER_HEIGHT = '--positioner-height'

export const NAVIGATION_MENU_EASING = curve['productive-entrance']
export const NAVIGATION_MENU_DURATION_MS = Number.parseInt(duration['slow-01'], 10)
export const NAVIGATION_MENU_CLOSE_DURATION_MS = Number.parseInt(duration['moderate-01'], 10)
