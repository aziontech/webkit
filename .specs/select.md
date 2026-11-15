---
name: select
category: inputs
structure: composition
status: implemented
spec_version: 11
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3714-10801
  node_id: 3714:10801
checksum: 18f76aadc4e71bd5b3609a80f842f907580c01b2a9448760f53b07c36b94345f
created: 2026-06-15
last_updated: 2026-11-15
---

# Select — Component Spec

## Purpose

Select control for choosing exactly one option from a list; several values are `multi-select`. The trigger field mirrors `Input`'s visual API (size, hover/focus/filled/disabled/invalid/required states) so a Select sits next to a TextInput without visual drift. The dropdown panel is teleported to `body` and anchored to the trigger by the shared `usePlacement` composable — no `@floating-ui` runtime. A selected option shows a trailing check (`ai ai-check`) (the shadcn pattern), optionally a leading slot/icon and a trailing tag. The trigger shows the selected option's label (each option records its text, as Radix `SelectValue` does), not its raw value. Search and "Create new" footer are exposed as slots on `<SelectContent>`.

Aligned with Figma frames `3714:10801` (trigger states) and `3899:29361` (options panel).

## When to use

- Use Select to pick exactly one value from a list of more than about seven options. For several values use MultiSelect; when the person may type a value that is not in the list use Combobox; for two to seven options shown at once use RadioGroup.
- One value from a list too long to show inline (regions, runtimes, plans).
- Options grouped under headings, with icons or trailing tags.
- A list that needs a search box or a "Create new" action inside the panel.

## When NOT to use

- A select with a visible label and helper/error text in a form → put it inside a `field`; the trigger picks up the field's id, description and state.
- The field is always multi-pick → use `multi-select`.
- Two to seven options that fit on screen → use `radio-group` (`variant="card"` for cards).
- The list triggers actions or navigation instead of holding a value → use `dropdown-menu`.

## Related

- `field` — label, this select, and description/error, with the wiring done.
- `multi-select` — multi-only variant with checkbox rows and an array model.
- `dropdown-menu` — action menu that reports the chosen option as an event and holds no form value.
- `input-group` — joins a select to an input, such as currency plus amount.

## Best practices

- Render `Select.Trigger` and `Select.Content` inside the root; the parts read the root's context and throw outside it.
- Give each `Select.Option` a stable `value`; pass `displayValue` to control how the trigger renders the selection.
- Type an options list as `SelectOptionItem<string>[]` and render it with `v-for` into `Select.Option` (`:value`, `:icon`, `:disabled`, the `label` as the slot); bind a typed model so `displayValue` and `update:modelValue` take that type with no cast.
- Use `readonly` to show a fixed selection and `disabled` when the field is unavailable; neither opens the panel.
- A switcher inside a line of text, such as the environment that ends a resource's breadcrumb (`Workloads › workload_01 › Production ⌄`), is `variant="ghost"` with `size="small"` and an `aria-label` on `Select.Trigger`: no border or fill until hover, sized to its value. Never put a bordered field in the header, and never restyle the trigger with `!` overrides.
- Keep `variant="ghost"` out of forms: it draws no border, so it cannot show the `invalid` or `required` border; a form field is the default `outline` inside a `Field`.

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
          icon="ai ai-heart"
          >Option 3</Select.Option
        >
      </Select.Group>
    </Select.Content>
  </Select>
</template>
```

## Sub-components

- `select-trigger/select-trigger.vue` — Bordered trigger field with an optional `#leading` slot (typed with `defineSlots`), selected-value label, and chevron-down. Mirrors `Input` size/state visuals. The selected value renders inside a `<bdi>`, so its own direction is isolated from the trigger's: an English value on a right-to-left page, or an Arabic value on a left-to-right one, keeps its character order while the label still aligns to the inline start. Prop `valueDir?: 'ltr' | 'rtl' | 'auto'` (default `undefined`, i.e. the `<bdi>` follows the value's first strong character) sets the `<bdi>`'s `dir`; pass `ltr` for values with no strong character whose order matters, such as dial codes (`PhoneInput` passes it, so `+1` never reads `1+`).
- `select-content/select-content.vue` — Popover panel teleported to `body` and anchored with `usePlacement`; exposes `default` (the options), `#search` and `#footer` slots, typed with `defineSlots`, and scrolls its option list when content exceeds `max-h-[320px]`.
- `select-group/select-group.vue` — Section wrapper for a labelled group of options; renders a `text-label-sm` heading in `--text-muted` when `label` is set. Groups never sit flush: `--spacing-sm` above every group but the first — the same rhythm DropdownMenu puts around its group divider and Command puts between two bare groups. No hairline: unlike DropdownMenu, this panel separates groups by space alone.
- `select-option/select-option.vue` — Selectable option row with a trailing check when selected, an optional `icon` (an Azion icon class, default `''`), an optional leading `#leading` slot, the option label, and an optional trailing `#tag` slot. **One leading column for the whole list**: as soon as any option in the panel has an `icon` or a `#leading` slot, _every_ option reserves the leading box (a fixed `size-4`), so a list mixing iconed and icon-less options keeps a single label edge instead of a ragged one. A panel where no option has either reserves nothing and pays no indent. The reservation is pure CSS — the list carries `group/options`, each option with a glyph carries `data-leading`, and `group-has-[[data-leading]]/options` turns the column on for all of them — so no option registry is needed for the column. Each option records its visible text with the root on mount and update, so the trigger names the selection by label; while a selected value has no recorded label and the panel is closed, the content renders only the selected options (and any group without a `value`) once in a `hidden` container (`<testId>__labels`) to collect them; a 1,000-option list with a preselection mounts within the `select-1k-preselected` budget.
- `select-group/select-group.vue` `label` defaults to `''` (no heading, no `aria-label`).

## Props

| Prop           | Type                             | Default     | Required | JSDoc                                                                                                                                                                                                                                                                                                          |
| -------------- | -------------------------------- | ----------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defaultOpen`  | `boolean`                        | `false`     | false    | Initial open state when uncontrolled.                                                                                                                                                                                                                                                                          |
| `placeholder`  | `string`                         | `''`        | false    | Trigger placeholder shown when no option is selected.                                                                                                                                                                                                                                                          |
| `size`         | `'small' \| 'medium' \| 'large'` | `'medium'`  | false    | Size token; affects trigger height (small=28px, medium=32px, large=40px) matching `Input`.                                                                                                                                                                                                                     |
| `variant`      | `'outline' \| 'ghost'`           | `'outline'` | false    | Trigger look: `outline` is the bordered field; `ghost` has no border or fill until hover, sized to its value, for a switcher inside a line of text such as the environment at the end of a breadcrumb.                                                                                                         |
| `disabled`     | `boolean`                        | `false`     | false    | Disables the trigger and prevents opening; applies disabled tokens.                                                                                                                                                                                                                                            |
| `readonly`     | `boolean`                        | `false`     | false    | Marks the field read-only; the current selection is visible but the dropdown cannot open.                                                                                                                                                                                                                      |
| `required`     | `boolean`                        | `false`     | false    | Marks the field as required; applies the required (warning) border and sets `aria-required` on the trigger, matching `Input`. The label's Required tag is owned by the wrapping form-field, not by this component.                                                                                             |
| `invalid`      | `boolean`                        | `false`     | false    | Applies the invalid border + ring tokens and sets `aria-invalid` on the trigger.                                                                                                                                                                                                                               |
| `displayValue` | `(value: TValue) => string`      | `undefined` | false    | Custom formatter used by the trigger to render the selection; receives the current `modelValue`, typed as the bound model. Unset, the trigger shows the selected options' labels.                                                                                                                              |
| `name`         | `string`                         | `''`        | false    | Form field name. Set, the root renders one hidden input per selected value (`String(value)`, objects as JSON) so a native `form` and `FormData` submit the selection; `required` then adds a hidden required proxy that blocks an empty submit, and `disabled` leaves the value out, as a native control does. |

**Generic.** Props stay an inline literal in `defineProps` because the root is generic (a named `interface Props` fails declaration emit, TS4025). The root is generic over `TValue extends SelectValue` (`string | number | undefined`, the default), inferred from the bound `modelValue`: with a `string` model, `displayValue` takes `(value: string) => string` and `update:modelValue` sends a `string`, so a handler needs no narrowing.

**Types.** `@aziontech/webkit/select` (and `-root`) export `SelectValue`, `SelectVariant`, `SelectSize` and `SelectOptionItem<TValue = string>` (`{ value: TValue; label: string; icon?: string; disabled?: boolean }`), the shape of an options list rendered as `Select.Option` rows, so a list with disabled entries needs no local type.

## v-model

| Model          | Type      | Default     | Emits               | Notes                                                                                                                                                                         |
| -------------- | --------- | ----------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model`      | `TValue`  | `undefined` | `update:modelValue` | The selection via `defineModel`: the one picked value. Its type flows to `displayValue` and `update:modelValue`. Fires when an option is selected. Uncontrolled when unbound. |
| `v-model:open` | `boolean` | `undefined` | `update:open`       | Open state of the dropdown via `defineModel`. Fires when the dropdown opens or closes. Unbound, the dropdown keeps its own state, seeded by `defaultOpen`.                    |

## Events

_none_

## Slots

| Slot      | Scope | Notes                                                                                               |
| --------- | ----- | --------------------------------------------------------------------------------------------------- |
| `default` | —     | Composition slot; receives `<SelectTrigger>` and `<SelectContent>` (and the option tree inside it). |

## States

- Visual states: `default`, `hover`, `focus-visible`, `filled`, `disabled`, `invalid`, `required`, `opened`
- `data-state` on the root and trigger: `open` | `closed`
- `data-size` on the trigger mirrors the `size` prop
- `data-variant` on the root, the trigger and the panel mirrors `variant` (`outline` | `ghost`)
- `variant="ghost"`: the trigger and root size to the value (`w-auto`, capped at the container), no border, no fill, `--spacing-xs` inline padding, `.text-label-md` like a breadcrumb crumb, `--bg-mask` on hover and while open; the panel stops matching the trigger's width and takes at least `--container-3xs`
- `data-disabled`, `data-invalid`, `data-required`, `data-readonly`, `data-filled` mirror the matching props (or the selection state for `data-filled`)
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
| spacing (panel list padding.x)       | `var(--spacing-2xs)`                                                                                                            |
| spacing (panel list padding.y)       | `var(--spacing-xs)` — the vertical seam is one step up from the row inset so the first/last row does not crowd the panel border |
| spacing (between groups)             | `var(--spacing-sm)`                                                                                                             |
| option leading column                | `size-4` (16px), reserved for every option when any option has a glyph                                                          |
| spacing (option padding)             | `var(--spacing-xs)`                                                                                                             |
| spacing (option gap)                 | `var(--spacing-xs)`                                                                                                             |
| shape                                | `var(--shape-control)`                                                                                                          |
| shadow (panel)                       | `var(--shadow-xs)`                                                                                                              |

## Decisions and open questions

- **`variant` on Select (2026-11-12).** The console's workload page ends its breadcrumb on the environment (`Production ⌄`) drawn as text, and the design sample got it by overriding the trigger with `!` classes (`border-0! bg-transparent! h-6! …`). The look is now `variant="ghost"`, named from the shared vocabulary (`ghost` = no surface until hover, as `Button` and `ButtonGroup`); the bordered field is `outline`, the default, so no existing select changes. Decided: the transparent trigger keeps the `size` heights (28 px at `small`, not the sample's 24 px) so its target stays the same as every other small control; it zeroes the focus ring offset like the sample, since it sits inside a line of text; and its panel takes at least `--container-3xs` instead of the trigger's width, which would be a few characters wide. The `./select` budget moves from 19.75 KB to 20 KB (measured 19.91 KB, up from 19.73 KB).

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` on trigger and on every option row.
- Keyboard map (trigger): `Tab` focuses; `Space`/`Enter`/`ArrowDown` opens the panel; `Escape` closes it.
- Keyboard map (closed trigger): `Enter`, `Space`, `ArrowDown` and `ArrowUp` open the list (focus lands as described below); `Home` opens it on the first enabled option and `End` on the last; typing a printable character opens it on the first enabled option whose label starts with that character (with a search field, focus goes to the search field instead). Clicking the trigger while the list is open closes it. Tests: `select.test.ts` › Select keyboard and naming (APG select-only combobox).
- Keyboard map (open panel): opening focuses the search field when there is one, else the selected option, else the first enabled option; `ArrowDown`/`ArrowUp` move the active option and wrap; `Home`/`End` jump to first/last; `Enter`/`Space` select, close and return focus to the trigger; typing a printable character moves focus to the next enabled option whose label starts with the typed text (characters typed within 500 ms add up; ignored while the search field has focus); `Escape` closes and returns focus to the trigger; `Tab` closes and moves focus to the control after the trigger; `Shift+Tab` closes and returns focus to the trigger. Tests: `select.test.ts` › keyboard map (spec).
- ARIA: trigger uses `role="combobox"` with `aria-haspopup="listbox"`, `aria-expanded` bound to open state, `aria-controls` pointing to the list. The teleported content is a plain panel holding the optional search field, the list and the optional footer; the list (not the panel) carries `role="listbox"`, so the search field sits outside it, and is named by the root's `aria-label`, else by the root's `aria-labelledby`, else by the enclosing `Field` label, else by the trigger (which always has an `id`). The list uses `role="listbox"` (single-select, no `aria-multiselectable`). Each option uses `role="option"` with `aria-selected` mirroring its selection. Decorative icons (`ai ai-chevron-down`, `ai-heart`, etc.) are `aria-hidden="true"`.
- Nested overlays: the open list joins the shared overlay layer stack (`useOverlayLayer`), so inside a `Popover`, `Dialog` or `Drawer` an option click or `Escape` in the list closes only the list; the host overlay stays open.
- `aria-invalid` and `aria-required` on the trigger mirror the matching props.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons + borders), including disabled state.
- `motion-reduce:transition-none motion-reduce:animate-none` on every transition/animation-bearing class.
- Touch target ≥40×40 px on `size="large"`; smaller sizes are documented as dense-layout-only (consistent with `Input`).
- Teleported content: the teleported `role="listbox"` content binds `dir` and `lang` from the nearest `WebkitProvider` (`usePortalLocale`), so it keeps the provider's direction and language although it renders under `body`. With no provider nothing is set and the document's own `dir` and `lang` apply.

## Examples

- Default
- Sizes — composite story rendering all three sizes side by side (canonical composite example).
- Transparent — justification: the `variant="ghost"` trigger only reads right in its place, the environment switcher at the end of a breadcrumb (`Workloads › workload_01 › Production`).
- Single — justification: documents the trailing check and the scalar `modelValue` shape.
- WithGroups — justification: documents the `<SelectGroup label="…">` heading anatomy from Figma `3899:29361` (Group region), which is not reachable from Default.
- WithSearchAndFooter — justification: documents the `#search` and `#footer` slots on `<SelectContent>` (Top/Bottom regions in Figma `3899:29361`), which are slot-only and invisible from Default.
- WithOptionExtras — justification: documents the `icon`, `#leading`, and `#tag` slots on `<SelectOption>` in one composite frame.
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
- Do not add examples beyond Default + per `variant` + per `size` + Disabled, unless the spec's "Examples" section explicitly justifies the addition.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
