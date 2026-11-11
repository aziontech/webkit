/**
 * @param {import('./use-navigation-menu-root.js').ChangeReason} reason
 * @param {Event} event
 * @param {Element | undefined} trigger
 */
export function createChangeEventDetails(reason: import("./use-navigation-menu-root.js").ChangeReason, event: Event, trigger: Element | undefined): {
    reason: import("./use-navigation-menu-root.js").ChangeReason;
    event: Event;
    trigger: Element | undefined;
    cancel(): void;
    allowPropagation(): void;
    readonly isCanceled: boolean;
    readonly isPropagationAllowed: boolean;
};
