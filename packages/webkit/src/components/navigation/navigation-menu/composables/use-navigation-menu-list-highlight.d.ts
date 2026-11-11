export function useNavigationMenuListHighlight(containerRef: import("vue").Ref<HTMLElement | import("vue").ComponentPublicInstance | null>, root: ReturnType<typeof import("./use-navigation-menu-context.js").useNavigationMenuRoot>): {
    selectorStyle: import("vue").ComputedRef<{
        left: string;
        top: string;
        width: string;
        height: string;
        opacity: number;
    }>;
    setTarget: (target: HTMLElement | import("vue").ComponentPublicInstance | null) => void;
    handleTargetPointerLeave: (event: PointerEvent, target: HTMLElement | import("vue").ComponentPublicInstance | null) => void;
    handleListPointerLeave: (event: PointerEvent) => void;
    syncToActiveTrigger: () => void;
    hide: () => void;
};
export type NavigationMenuListHighlightContext = {
    setTarget: (element: HTMLElement | null) => void;
    handleTargetPointerLeave: (event: PointerEvent, element: HTMLElement | null) => void;
};
