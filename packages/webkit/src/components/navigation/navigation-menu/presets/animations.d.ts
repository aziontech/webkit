export function waitForAnimationFrames(frameCount?: number): Promise<any>;
export function waitForElementAnimations(element: Element | null | undefined): Promise<void>;
export function waitForOpenTransition(element: Element | null | undefined): Promise<void>;
export function waitForCloseTransition(element: Element | null | undefined): Promise<void>;
export namespace navigationMenuTransitionClasses {
    let positioner: string;
    let popup: string;
    let content: string;
    let viewport: string;
}
export namespace PRESET_IDS {
    let POPUP_MORPH: string;
    let CONTENT_DIRECTIONAL: string;
    let INSTANT: string;
}
import { NAVIGATION_MENU_CLOSE_DURATION_MS } from '../composables/navigation-menu-css-vars.js';
import { NAVIGATION_MENU_DURATION_MS } from '../composables/navigation-menu-css-vars.js';
import { NAVIGATION_MENU_EASING } from '../composables/navigation-menu-css-vars.js';
export { NAVIGATION_MENU_CLOSE_DURATION_MS, NAVIGATION_MENU_DURATION_MS, NAVIGATION_MENU_EASING };
