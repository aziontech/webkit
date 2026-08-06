import { curve, duration } from '@aziontech/theme/animations'

export const POPUP_WIDTH = '--popup-width'
export const POPUP_HEIGHT = '--popup-height'
/**
 * Natural width of the panel in flow, pinned on the viewport target so the panel
 * lays out at its own width while the popup box animates around it. Without it
 * the panel tracks the animating box and re-wraps its text on every frame, which
 * reads as juddering rather than as one shape morphing.
 */
export const VIEWPORT_WIDTH = '--viewport-width'

export const NAVIGATION_MENU_EASING = curve['productive-entrance']
// Must match `duration-moderate-02` on the popup/positioner transitions in
// `presets/animations.js` — this is what the open/close awaiters wait out.
export const NAVIGATION_MENU_DURATION_MS = Number.parseInt(duration['moderate-02'], 10)
export const NAVIGATION_MENU_CLOSE_DURATION_MS = Number.parseInt(duration['moderate-01'], 10)
