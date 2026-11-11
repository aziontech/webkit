export function createChangeEventDetails(reason: import("./use-navigation-menu-root.js").ChangeReason, event: Event, trigger: Element | undefined): {
    reason: import("./use-navigation-menu-root.js").ChangeReason;
    event: Event;
    trigger: Element | undefined;
    cancel(): void;
    allowPropagation(): void;
    readonly isCanceled: boolean;
    readonly isPropagationAllowed: boolean;
};
