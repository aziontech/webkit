---
name: select
category: inputs
structure: composition
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3714-10801
  node_id: 3714:10801
checksum: a123b0b175da6abaef4ce596d346240767ca5dd7c812832ca07dd8730a65fb88
created: 2026-06-15
last_updated: 2026-11-12
---

# Select — Component Spec

## Purpose

Select control for choosing one (`multiple={false}`) or many (`multiple={true}`) options from a list. The trigger field mirrors `Input`'s visual API (size, hover/focus/filled/disabled/invalid/required states) so a Select sits next to a TextInput without visual drift. The dropdown panel is teleported to `body` and anchored to the trigger by the shared `usePlacement` composable — no `@floating-ui` runtime. Each option carries a radio indicator in single mode or a checkbox indicator in multi mode, optionally a leading slot/icon and a trailing tag. Search and "Create new" footer are exposed as slots on `<SelectContent>`.

Aligned with Figma frames `3714:10801` (trigger states) and `3899:29361` (options panel).

## When to use

- One value from a list too long to show inline (regions, runtimes, plans).
- Options grouped under headings, with icons or trailing tags.
- A list that needs a search box or a "Create new" action inside the panel.

## When NOT to use

- A select with a visible label and helper/error text in a form → put it inside a `field`; the trigger picks up the field's id, description and state.
- The field is always multi-pick → use `multi-select`.
- Two to five options that fit on screen → use horizontal `field`s with a `radio-button`, or `radio-cards` for cards.
- The list triggers actions or navigation instead of holding a value → use `dropdown`.

## Related

- `field` — label, this select, and description/error, with the wiring done.
- `multi-select` — multi-only variant with checkbox rows and an array model.
- `dropdown` — action menu that reports the chosen option as an event and holds no form value.
- `input-group` — joins a select to an input, such as currency plus amount.

## Best practices

- Render `Select.Trigger` and `Select.Content` inside the root; the parts read the root's context and throw outside it.
- Give each `Select.Option` a stable `value`; pass `displayValue` to control how the trigger renders the selection.
- Type an options list as `SelectOptionItem<string>[]` and render it with `v-for` into `Select.Option` (`:value`, `:icon`, `:disabled`, the `label` as the slot); bind a typed model so `displayValue` and `update:modelValue` take that type with no cast.
- With `multiple`, `modelValue` becomes an array; for a field that is always multi-pick prefer `multi-select`.
- Use `readonly` to show a fixed selection and `disabled` when the field is unavailable; neither opens the panel.
- A switcher inside a line of text, such as the environment that ends a resource's breadcrumb (`Workloads › workload_01 › Production ⌄`), is `kind="transparent"` with `size="small"` and an `aria-label` on `Select.Trigger`: no border or fill until hover, sized to its value. Never put a bordered field in the header, and never restyle the trigger with `!` overrides.
- Keep `kind="transparent"` out of forms: it draws no border, so it cannot show the `invalid` or `required` border; a form field is the default `outlined` inside a `Field`.

## Usage

```vue
<script setup>
  import Select from '@aziontech/webkit/select'

  const value = defineModel({ default: '' })
</script>

<template>
  <Select
    v-model="value"
    size="medium"
    placeholder="Select an option"
  >
    <Select.Trigger />
    <Select.Content>
      <Select.Group label="Group A">
        <Select.Option value="opt-1">Option 1</Select.Option>
        <Select.Option value="opt-2">Option 2</Select.Option>
      </Select.Group>
      <Select.Group label="Group B">
        <Select.Option
          value="opt-3"
          icon="pi pi-heart"
          >Option 3</Select.Option
        >
      </Select.Group>
    </Select.Content>
  </Select>
</template>
```

## Sub-components

- `select-trigger/select-trigger.vue` — Bordered trigger field with optional left icon slot, selected-value label, and chevron-down. Mirrors `Input` size/state visuals. The selected value renders inside a `<bdi>`, so its own direction is isolated from the trigger's: an English value on a right-to-left page, or an Arabic value on a left-to-right one, keeps its character order while the label still aligns to the inline start. Prop `valueDir?: 'ltr' | 'rtl' | 'auto'` (default `undefined`, i.e. the `<bdi>` follows the value's first strong character) sets the `<bdi>`'s `dir`; pass `ltr` for values with no strong character whose order matters, such as dial codes (`PhoneInput` passes it, so `+55` never reads `55+`).
- `select-content/select-content.vue` — Popover panel teleported to `body` and anchored with `usePlacement`; exposes `#search` and `#footer` slots and scrolls its option list when content exceeds `max-h-[320px]`.
- `select-group/select-group.vue` — Section wrapper for a labelled group of options; renders a `text-label-sm` heading in `--text-muted` when `label` is set. Groups never sit flush: `--spacing-sm` above every group but the first — the same rhythm DropdownMenu puts around its group divider and Command puts between two bare groups. No hairline: unlike DropdownMenu, this panel separates groups by space alone.
- `select-option/select-option.vue` — Selectable option row with a mode-aware indicator (radio in single mode, checkbox in multi mode), an optional `icon` (PrimeIcons), an optional leading `#left` slot, the option label, and an optional trailing `#tag` slot. **One leading column for the whole list**: as soon as any option in the panel has an `icon` or a `#left` slot, _every_ option reserves the leading box (a fixed `size-4`), so a list mixing iconed and icon-less options keeps a single label edge instead of a ragged one. A panel where no option has either reserves nothing and pays no indent. The reservation is pure CSS — the list carries `group/options`, each option with a glyph carries `data-leading`, and `group-has-[[data-leading]]/options` turns the column on for all of them — so no option registry is needed.

## Props

| Prop           | Type                             | Default      | Required | JSDoc                                                                                                                                                                                                              |
| -------------- | -------------------------------- | ------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `modelValue`   | `TValue`                         | `undefined`  | false    | Two-way bound selection. Scalar in single mode; array in multi mode. Its type flows to `displayValue` and `update:modelValue`.                                                                                     |
| `multiple`     | `boolean`                        | `false`      | false    | When true, switches the component to multi-select; options render checkbox indicators and `modelValue` is an array.                                                                                                |
| `open`         | `boolean`                        | `undefined`  | false    | Controlled open state for the dropdown. Use with `v-model:open`.                                                                                                                                                   |
| `defaultOpen`  | `boolean`                        | `false`      | false    | Initial open state when uncontrolled.                                                                                                                                                                              |
| `placeholder`  | `string`                         | `undefined`  | false    | Trigger placeholder shown when no option is selected.                                                                                                                                                              |
| `size`         | `'small' \| 'medium' \| 'large'` | `'medium'`   | false    | Size token; affects trigger height (small=28px, medium=32px, large=40px) matching `Input`.                                                                                                                         |
| `kind`         | `'outlined' \| 'transparent'`    | `'outlined'` | false    | Trigger look: `outlined` is the bordered field; `transparent` has no border or fill until hover, sized to its value, for a switcher inside a line of text such as the environment at the end of a breadcrumb.      |
| `disabled`     | `boolean`                        | `false`      | false    | Disables the trigger and prevents opening; applies disabled tokens.                                                                                                                                                |
| `readonly`     | `boolean`                        | `false`      | false    | Marks the field read-only; the current selection is visible but the dropdown cannot open.                                                                                                                          |
| `required`     | `boolean`                        | `false`      | false    | Marks the field as required; applies the required (warning) border and sets `aria-required` on the trigger, matching `Input`. The label's Required tag is owned by the wrapping form-field, not by this component. |
| `invalid`      | `boolean`                        | `false`      | false    | Applies the invalid border + ring tokens and sets `aria-invalid` on the trigger.                                                                                                                                   |
| `displayValue` | `(value: TValue) => string`      | `undefined`  | false    | Custom formatter used by the trigger to render the selected label(s); receives the current `modelValue`, typed as the bound model.                                                                                 |

**Generic.** The root is generic over `TValue extends SelectValue` (`string | number | unknown[] | undefined`, the default), inferred from the bound `modelValue`: with a `string` model, `displayValue` takes `(value: string) => string` and `update:modelValue` sends a `string`, so a handler needs no narrowing. With `multiple`, bind an array (`string[]`) and both follow it.

**Types.** `@aziontech/webkit/select` (and `-root`) export `SelectValue`, `SelectKind`, `SelectSize` and `SelectOptionItem<TValue = string>` (`{ value: TValue; label: string; icon?: string; disabled?: boolean }`), the shape of an options list rendered as `Select.Option` rows, so a list with disabled entries needs no local type.

## Events

| Event               | Payload   | Notes                                                         |
| ------------------- | --------- | ------------------------------------------------------------- |
| `update:modelValue` | `TValue`  | Fires when an option is selected (single) or toggled (multi). |
| `update:open`       | `boolean` | Fires when the dropdown opens or closes.                      |

## Slots

| Slot      | Scope | Notes                                                                                               |
| --------- | ----- | --------------------------------------------------------------------------------------------------- |
| `default` | —     | Composition slot; receives `<SelectTrigger>` and `<SelectContent>` (and the option tree inside it). |

## States

- Visual states: `default`, `hover`, `focus-visible`, `filled`, `disabled`, `invalid`, `required`, `opened`
- `data-state` on the root and trigger: `open` | `closed`
- `data-size` on the trigger mirrors the `size` prop
- `data-kind` on the root, the trigger and the panel mirrors `kind` (`outlined` | `transparent`)
- `kind="transparent"`: the trigger and root size to the value (`w-auto`, capped at the container), no border, no fill, `--spacing-xs` inline padding, `.text-label-md` like a breadcrumb crumb, `--bg-mask` on hover and while open; the panel stops matching the trigger's width and takes at least `--container-3xs`
- `data-disabled`, `data-invalid`, `data-required`, `data-readonly`, `data-filled` mirror the matching props (or the selection state for `data-filled`)
- `data-mode` on the root: `single` | `multiple`
- `data-selected` on `<SelectOption>` when the option's value is part of the current selection
- Long lists: above 300 options the list mounts in chunks of 100 as they scroll near view (unmounted chunks keep their height, 32 px per option), so opening a 1,000-option list stays within its runtime budget. The first arrow, `Home` or `End` key in the list mounts every option before moving focus, so keyboard navigation always reaches every option.

## Motion & Animations

| Trigger                                         | Animation / Transition                                             | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback                                          |
| ----------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------- | ---------------------------------------------------------------- |
| dropdown open / close (on `SelectContent` only) | popup scale-in / scale-out semantic utilities from `animations.js` | semantic (150ms in / 110ms out · cubic-bezier)    | reduced-motion fallback via the matching `motion-reduce` utility |
| trigger state change (border/ring/bg)           | `transition-colors duration-150 ease-out`                          | inline (matches catalog)                          | `motion-reduce:transition-none`                                  |

## Tokens

| Region                               | Token (DESIGN.md)                                                                                                               |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| typography (trigger, option label)   | `.text-label-sm`                                                                                                                |
| typography (group heading)           | `.text-label-sm` + `text-(--text-muted)`                                                                                        |
| surface (trigger)                    | `var(--bg-surface)`                                                                                                             |
| surface (trigger disabled)           | `var(--bg-disabled)`                                                                                                            |
| surface (transparent hover / open)   | `var(--bg-mask)`                                                                                                                |
| typography (transparent trigger)     | `.text-label-md`                                                                                                                |
| panel min width (transparent)        | `var(--container-3xs)`                                                                                                          |
| surface (panel)                      | `var(--bg-surface-raised)`                                                                                                      |
| surface (option hover)               | `var(--bg-hover)`                                                                                                               |
| surface (option selected)            | `var(--bg-selected)`                                                                                                            |
| text                                 | `var(--text-default)`                                                                                                           |
| text (placeholder, group heading)    | `var(--text-muted)`                                                                                                             |
| text (disabled)                      | `var(--text-disabled)`                                                                                                          |
| border (default)                     | `var(--border-default)`                                                                                                         |
| border (hover)                       | `var(--border-strong)`                                                                                                          |
| border (invalid)                     | `var(--danger-border)`                                                                                                          |
| border (required)                    | `var(--warning-border)`                                                                                                         |
| ring (focus)                         | `var(--ring-color)`                                                                                                             |
| ring (invalid focus)                 | `var(--danger)`                                                                                                                 |
| spacing (trigger horizontal padding) | `var(--spacing-sm)`                                                                                                             |
| spacing (panel list padding.x)       | `var(--spacing-xxs)`                                                                                                            |
| spacing (panel list padding.y)       | `var(--spacing-xs)` — the vertical seam is one step up from the row inset so the first/last row does not crowd the panel border |
| spacing (between groups)             | `var(--spacing-sm)`                                                                                                             |
| option leading column                | `size-4` (16px), reserved for every option when any option has a glyph                                                          |
| spacing (option padding)             | `var(--spacing-xs)`                                                                                                             |
| spacing (option gap)                 | `var(--spacing-xs)`                                                                                                             |
| shape                                | `var(--shape-elements)`                                                                                                         |
| shadow (panel)                       | `var(--shadow-xs)`                                                                                                              |

## Decisions and open questions

- **`kind` on Select (2026-11-12).** The console's workload page ends its breadcrumb on the environment (`Production ⌄`) drawn as text, and the design sample got it by overriding the trigger with `!` classes (`border-0! bg-transparent! h-6! …`). The look is now `kind="transparent"`, named from the shared vocabulary (`transparent` = no surface until hover, as `Button` and `ButtonGroup`); the bordered field is `outlined`, the default, so no existing select changes. Decided: the transparent trigger keeps the `size` heights (28 px at `small`, not the sample's 24 px) so its target stays the same as every other small control; it zeroes the focus ring offset like the sample, since it sits inside a line of text; and its panel takes at least `--container-3xs` instead of the trigger's width, which would be a few characters wide. The `./select` budget moves from 19.75 KB to 20 KB (measured 19.91 KB, up from 19.73 KB).

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` on trigger and on every option row.
- Keyboard map (trigger): `Tab` focuses; `Space`/`Enter`/`ArrowDown` opens the panel; `Escape` closes it.
- Keyboard map (open panel): opening focuses the search field when there is one, else the selected option, else the first enabled option; `ArrowDown`/`ArrowUp` move the active option and wrap; `Home`/`End` jump to first/last; `Enter`/`Space` select, close and return focus to the trigger; `Escape` closes and returns focus to the trigger; `Tab` closes and moves focus to the control after the trigger; `Shift+Tab` closes and returns focus to the trigger. Tests: `select.test.ts` › keyboard map (spec).
- ARIA: trigger uses `role="combobox"` with `aria-haspopup="listbox"`, `aria-expanded` bound to open state, `aria-controls` pointing to the content element. Content uses `role="listbox"` with `aria-multiselectable` mirroring `multiple`. Each option uses `role="option"` with `aria-selected` mirroring its selection. Decorative icons (`pi pi-chevron-down`, `pi-heart`, etc.) are `aria-hidden="true"`.
- `aria-invalid` and `aria-required` on the trigger mirror the matching props.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons + borders), including disabled state.
- `motion-reduce:transition-none motion-reduce:animate-none` on every transition/animation-bearing class.
- Touch target ≥40×40 px on `size="large"`; smaller sizes are documented as dense-layout-only (consistent with `Input`).
- Teleported content: the teleported `role="listbox"` content binds `dir` and `lang` from the nearest `WebkitProvider` (`usePortalLocale`), so it keeps the provider's direction and language although it renders under `body`. With no provider nothing is set and the document's own `dir` and `lang` apply.

## Examples

- Default
- Sizes — composite story rendering all three sizes side by side (canonical composite example).
- Transparent — justification: the `kind="transparent"` trigger only reads right in its place, the environment switcher at the end of a breadcrumb (`Workloads › workload_01 › Production`).
- Single — justification: documents the radio-style indicator and scalar `modelValue` shape (the default mode); pairs with `Multiple` to make the two modes browseable in one click.
- Multiple — justification: documents the checkbox-style indicator and array `modelValue` shape that the `multiple` prop unlocks.
- WithGroups — justification: documents the `<SelectGroup label="…">` heading anatomy from Figma `3899:29361` (Group region), which is not reachable from Default.
- WithSearchAndFooter — justification: documents the `#search` and `#footer` slots on `<SelectContent>` (Top/Bottom regions in Figma `3899:29361`), which are slot-only and invisible from Default.
- WithOptionExtras — justification: documents the `icon`, `#left`, and `#tag` slots on `<SelectOption>` in one composite frame.
- LongList — justification: documents the panel's internal scroll behaviour (options list wrapped in `ScrollArea`) when the option count exceeds the `max-h-60` viewport; not reachable from any other story.
- Filled — justification: pre-populated `modelValue` shows the filled visual state, which is implicit (no prop).
- Invalid — justification: documents the `invalid` visual treatment, which is a top-level prop with distinct token bindings.
- Required — justification: documents the `required` warning-border treatment and its submit-state binding (`submitted && !value`), which a static Default cannot show without flagging the field on first render.
- Disabled

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `.claude/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `.claude/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `.claude/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + per `kind` + per `size` + Disabled, unless the spec's "Examples" section explicitly justifies the addition.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
