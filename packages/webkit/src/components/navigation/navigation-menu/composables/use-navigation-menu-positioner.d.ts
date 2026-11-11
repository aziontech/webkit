export function useNavigationMenuPositioner(anchorRef: import("vue").MaybeRef<HTMLElement | null>, floatingRef: import("vue").Ref<HTMLElement | null>, arrowRef: import("vue").Ref<HTMLElement | null>, options: import("vue").MaybeRefOrGetter<{
    side?: string;
    align?: string;
    sideOffset?: number;
    alignOffset?: number;
    arrowPadding?: number;
    collisionPadding?: number | {
        x: number;
        y: number;
    };
}>, targetSize?: import("vue").MaybeRefOrGetter<{
    width: number;
    height: number;
} | null>): {
    floatingStyles: import("vue").ComputedRef<{
        position: string;
        top: string;
        left: string;
        transform: string;
        display: string;
        'min-width': string;
    }>;
    resolvedSide: import("vue").ComputedRef<string>;
    resolvedAlign: import("vue").ComputedRef<string>;
    availableWidth: import("vue").ComputedRef<null>;
    availableHeight: import("vue").ComputedRef<null>;
    arrowStyles: import("vue").ComputedRef<{
        left?: undefined;
        top?: undefined;
    } | {
        left: string;
        top?: undefined;
    } | {
        top: string;
        left?: undefined;
    }>;
    placed: import("vue").Ref<boolean, boolean>;
    popupOrigin: import("vue").Ref<string, string>;
    resetPlacement: () => void;
};
