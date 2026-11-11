export namespace drawerSizePixels {
    let small: string;
    let medium: string;
    let large: string;
}
export namespace drawerSizeSummaries {
    let small_1: string;
    export { small_1 as small };
    let medium_1: string;
    export { medium_1 as medium };
    let large_1: string;
    export { large_1 as large };
}
export function getDrawerShellSizeStyle(size: "small" | "medium" | "large", isDesktop: boolean): {
    width?: undefined;
    maxWidth?: undefined;
} | {
    width: string;
    maxWidth: string;
};
