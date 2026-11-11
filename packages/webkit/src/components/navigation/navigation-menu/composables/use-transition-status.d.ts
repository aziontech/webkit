/** @typedef {'starting' | 'ending' | 'idle' | undefined} TransitionStatus */
/**
 * @param {import('vue').MaybeRefOrGetter<boolean>} open
 * @param {boolean} [enableIdleState]
 */
export function useTransitionStatus(open: import("vue").MaybeRefOrGetter<boolean>, enableIdleState?: boolean): {
    mounted: import("vue").Ref<boolean, boolean>;
    setMounted: (value: any) => void;
    transitionStatus: import("vue").Ref<TransitionStatus, TransitionStatus>;
};
export type TransitionStatus = "starting" | "ending" | "idle" | undefined;
