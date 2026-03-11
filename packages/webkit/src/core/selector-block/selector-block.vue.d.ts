declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
type __VLS_WithSlots<T, S> = T & (new () => {
    $slots: S;
});
declare const __VLS_base: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    title: {
        type: StringConstructor;
    };
    subtitle: {
        type: StringConstructor;
    };
    description: {
        type: StringConstructor;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    auto: {
        type: BooleanConstructor;
        default: boolean;
    };
    isCard: {
        type: BooleanConstructor;
        default: boolean;
    };
    hideSelector: {
        type: BooleanConstructor;
        default: boolean;
    };
    selected: {
        type: BooleanConstructor;
        default: boolean;
    };
    nameId: {
        type: StringConstructor;
        required: true;
    };
    inputClass: {
        type: StringConstructor;
    };
    rootClass: {
        type: StringConstructor;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    title: {
        type: StringConstructor;
    };
    subtitle: {
        type: StringConstructor;
    };
    description: {
        type: StringConstructor;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    auto: {
        type: BooleanConstructor;
        default: boolean;
    };
    isCard: {
        type: BooleanConstructor;
        default: boolean;
    };
    hideSelector: {
        type: BooleanConstructor;
        default: boolean;
    };
    selected: {
        type: BooleanConstructor;
        default: boolean;
    };
    nameId: {
        type: StringConstructor;
        required: true;
    };
    inputClass: {
        type: StringConstructor;
    };
    rootClass: {
        type: StringConstructor;
    };
}>> & Readonly<{}>, {
    disabled: boolean;
    auto: boolean;
    isCard: boolean;
    hideSelector: boolean;
    selected: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
type __VLS_Slots = {
    selector?: ((props: {}) => any) | undefined;
} & {
    footer?: ((props: {}) => any) | undefined;
};
//# sourceMappingURL=selector-block.vue.d.ts.map