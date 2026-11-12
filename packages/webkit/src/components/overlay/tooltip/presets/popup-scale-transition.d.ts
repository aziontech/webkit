export namespace tooltipMotion {
    namespace open {
        let duration: string;
        let curve: string;
    }
    namespace close {
        let duration_1: string;
        export { duration_1 as duration };
        let curve_1: string;
        export { curve_1 as curve };
    }
}
export const TOOLTIP_EXIT_MS: number;
export const popupScaleTransitionEnterActiveClasses: string;
export const popupScaleTransitionEnterFromClasses: "scale-[0.95] opacity-0 motion-reduce:scale-100 motion-reduce:opacity-100";
export const popupScaleTransitionEnterToClasses: "scale-100 opacity-100";
export const popupScaleTransitionLeaveActiveClasses: string;
export const popupScaleTransitionLeaveFromClasses: "scale-100 opacity-100";
export const popupScaleTransitionLeaveToClasses: "scale-[0.95] opacity-0 motion-reduce:scale-100 motion-reduce:opacity-100";
