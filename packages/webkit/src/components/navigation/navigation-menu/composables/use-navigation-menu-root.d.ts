/** @typedef {'trigger-press' | 'trigger-hover' | 'outside-press' | 'list-navigation' | 'focus-out' | 'escape-key' | 'link-press' | 'none'} ChangeReason */
/** @typedef {'left' | 'right' | 'up' | 'down' | null} ActivationDirection */
/**
 * @typedef {object} NavigationMenuRootContext
 * @property {import('vue').ComputedRef<string | number | null>} value
 * @property {import('vue').ComputedRef<boolean>} open
 * @property {import('vue').ComputedRef<'horizontal' | 'vertical'>} orientation
 * @property {import('vue').ComputedRef<boolean>} nested
 * @property {import('vue').Ref<ActivationDirection>} activationDirection
 * @property {import('vue').Ref<HTMLElement | null>} viewportEl
 * @property {import('vue').Ref<HTMLElement | null>} activeTriggerEl
 * @property {import('vue').Ref<HTMLElement | null>} popupEl
 * @property {import('vue').Ref<boolean>} instant
 * @property {number} delay
 * @property {number} closeDelay
 * @property {(next: string | number | null, details: ReturnType<typeof createChangeEventDetails>) => void} setValue
 * @property {(itemValue: string | number, details: ReturnType<typeof createChangeEventDetails>) => void} scheduleOpen
 * @property {(details: ReturnType<typeof createChangeEventDetails>) => void} scheduleClose
 * @property {() => void} cancelTimers
 * @property {(itemValue: string | number, el: HTMLElement) => void} registerTrigger
 * @property {(itemValue: string | number) => void} unregisterTrigger
 * @property {(itemValue: string | number) => boolean} isItemOpen
 * @property {(event: KeyboardEvent) => void} onTriggerKeydown
 * @property {(event: KeyboardEvent) => void} onPopupKeydown
 * @property {() => void} close
 * @property {() => void} unmount
 */
/**
 * @typedef {object} NavigationMenuItemContext
 * @property {import('vue').ComputedRef<string | number>} itemValue
 * @property {import('vue').ComputedRef<boolean>} open
 */
/**
 * @typedef {object} NavigationMenuPortalContext
 * @property {import('vue').Ref<HTMLElement | null>} viewportEl
 */
/**
 * @param {import('vue').Ref<string | number | null>} controlledValue
 * @param {import('vue').Ref<string | number | null>} defaultValue
 * @param {import('vue').ComputedRef<boolean>} isControlled
 * @param {import('vue').Ref<string | number | null>} internalValue
 * @param {{
 *   delay: number
 *   closeDelay: number
 *   orientation: 'horizontal' | 'vertical'
 *   nested: boolean
 *   dir?: import('vue').Ref<'ltr' | 'rtl'>
 * }} options
 * @param {(event: string, ...args: unknown[]) => void} emit
 */
export function useNavigationMenuRootState(controlledValue: import("vue").Ref<string | number | null>, defaultValue: import("vue").Ref<string | number | null>, isControlled: import("vue").ComputedRef<boolean>, internalValue: import("vue").Ref<string | number | null>, options: {
    delay: number;
    closeDelay: number;
    orientation: "horizontal" | "vertical";
    nested: boolean;
    dir?: import("vue").Ref<"ltr" | "rtl">;
}, emit: (event: string, ...args: unknown[]) => void): {
    value: import("vue").ComputedRef<string | number | null>;
    open: import("vue").ComputedRef<boolean>;
    orientation: import("vue").ComputedRef<"horizontal" | "vertical">;
    nested: import("vue").ComputedRef<boolean>;
    activationDirection: import("vue").Ref<ActivationDirection, ActivationDirection>;
    viewportEl: import("vue").ShallowRef<null, null>;
    viewportTargetEl: import("vue").ShallowRef<null, null>;
    activeTriggerEl: import("vue").ShallowRef<null, null>;
    popupEl: import("vue").ShallowRef<null, null>;
    positionerEl: import("vue").ShallowRef<null, null>;
    currentContentEl: import("vue").ShallowRef<null, null>;
    popupMounted: import("vue").Ref<boolean, boolean>;
    popupTransitionStatus: import("vue").Ref<import("./use-transition-status.js").TransitionStatus, import("./use-transition-status.js").TransitionStatus>;
    popupSize: Readonly<import("vue").Ref<import("./use-navigation-menu-viewport-size").NavigationMenuPopupSize | null, import("./use-navigation-menu-viewport-size").NavigationMenuPopupSize | null>>;
    setPopupMounted: (value: any) => void;
    instant: import("vue").Ref<boolean, boolean>;
    componentMounted: import("vue").Ref<boolean, boolean>;
    delay: number;
    closeDelay: number;
    setValue: (nextValue: string | number | null, details: ReturnType<typeof createChangeEventDetails>) => void;
    scheduleOpen: (itemValue: string | number, details: ReturnType<typeof createChangeEventDetails>) => void;
    scheduleClose: (details: ReturnType<typeof createChangeEventDetails>) => void;
    cancelTimers: () => void;
    registerTrigger: (itemValue: string | number, el: HTMLElement) => void;
    unregisterTrigger: (itemValue: string | number) => void;
    isItemOpen: (itemValue: string | number) => boolean;
    onTriggerKeydown: (event: KeyboardEvent) => void;
    onPopupKeydown: (event: KeyboardEvent) => void;
    close: () => void;
    unmount: () => void;
    createChangeEventDetails: typeof createChangeEventDetails;
};
export { createChangeEventDetails };
export type ChangeReason = "trigger-press" | "trigger-hover" | "outside-press" | "list-navigation" | "focus-out" | "escape-key" | "link-press" | "none";
export type ActivationDirection = "left" | "right" | "up" | "down" | null;
export type NavigationMenuRootContext = {
    value: import("vue").ComputedRef<string | number | null>;
    open: import("vue").ComputedRef<boolean>;
    orientation: import("vue").ComputedRef<"horizontal" | "vertical">;
    nested: import("vue").ComputedRef<boolean>;
    activationDirection: import("vue").Ref<ActivationDirection>;
    viewportEl: import("vue").Ref<HTMLElement | null>;
    activeTriggerEl: import("vue").Ref<HTMLElement | null>;
    popupEl: import("vue").Ref<HTMLElement | null>;
    instant: import("vue").Ref<boolean>;
    delay: number;
    closeDelay: number;
    setValue: (next: string | number | null, details: ReturnType<typeof createChangeEventDetails>) => void;
    scheduleOpen: (itemValue: string | number, details: ReturnType<typeof createChangeEventDetails>) => void;
    scheduleClose: (details: ReturnType<typeof createChangeEventDetails>) => void;
    cancelTimers: () => void;
    registerTrigger: (itemValue: string | number, el: HTMLElement) => void;
    unregisterTrigger: (itemValue: string | number) => void;
    isItemOpen: (itemValue: string | number) => boolean;
    onTriggerKeydown: (event: KeyboardEvent) => void;
    onPopupKeydown: (event: KeyboardEvent) => void;
    close: () => void;
    unmount: () => void;
};
export type NavigationMenuItemContext = {
    itemValue: import("vue").ComputedRef<string | number>;
    open: import("vue").ComputedRef<boolean>;
};
export type NavigationMenuPortalContext = {
    viewportEl: import("vue").Ref<HTMLElement | null>;
};
import { createChangeEventDetails } from './create-change-event-details.js';
