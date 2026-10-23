---
name: select
category: inputs
structure: composition
status: draft
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3714-10801
  node_id: 3714:10801
checksum: d8aa1f285b4062a3bbb0d9c8503bebc4dd16a420c6e049c96eae3c53d8b13b33
created: 2026-06-15
last_updated: 2026-10-23
---

# Select — Component Spec

## Purpose

Select control for choosing one (`multiple={false}`) or many (`multiple={true}`) options from a list. The trigger field mirrors `InputText`'s visual API (size, hover/focus/filled/disabled/invalid/required states) so a Select sits next to a TextInput without visual drift. The dropdown is a panel Teleported to `body`, anchored to the trigger with `position: fixed` by the shared `usePlacement` composable — no `@floating-ui` runtime. With `native`, the same compound renders the platform `<select>` instead (system picker, form submission, autofill). Each option carries a radio indicator in single mode or a checkbox indicator in multi mode, optionally a leading slot/icon and a trailing tag. Search and "Create new" footer are exposed as slots on `<SelectContent>`.

Aligned with Figma frames `3714:10801` (trigger states) and `3899:29361` (options panel).

## Usage

```vue
<script setup>
import Select from '@aziontech/webkit/select'

const value = defineModel({ default: '' })
</script>

<template>
  <Select v-model="value" size="medium" placeholder="Select an option">
    <Select.Trigger />
    <Select.Content>
      <Select.Group label="Group A">
        <Select.Option value="opt-1">Option 1</Select.Option>
        <Select.Option value="opt-2">Option 2</Select.Option>
      </Select.Group>
      <Select.Group label="Group B">
        <Select.Option value="opt-3" icon="pi pi-heart">Option 3</Select.Option>
      </Select.Group>
    </Select.Content>
  </Select>
</template>
```

The field needs a name: either `ariaLabel="…"` on the root, or a `<label for>` pointing at `inputId`. Native mode reuses the same parts:

```vue
<template>
  <label for="fruit">Fruit</label>
  <Select v-model="value" native input-id="fruit" name="fruit" required placeholder="Select a fruit">
    <Select.Trigger />
    <Select.Content>
      <Select.Option value="lemon">Lemon</Select.Option>
      <Select.Option value="orange">Orange</Select.Option>
    </Select.Content>
  </Select>
</template>
```

## Sub-components

- `select-trigger/select-trigger.vue` — Bordered trigger field with optional left icon slot, selected-value label, and chevron-down. Mirrors `InputText` size/state visuals. Renders nothing in `native` mode.
- `select-content/select-content.vue` — Panel Teleported to `body` and anchored with `usePlacement`; exposes `#search` and `#footer` slots, which render **outside** the `role="listbox"` element, and scrolls its option list (`ScrollArea` wrapping the listbox) when content exceeds `max-h-60`. In `native` mode it renders only its default slot, as the select's options.
- `select-group/select-group.vue` — Section wrapper for a labelled group of options (an `<optgroup>` in `native` mode); renders a `text-label-sm` heading in `--text-muted` when `label` is set. Groups never sit flush: `--spacing-sm` above every group but the first — the same rhythm Dropdown puts around its group divider and CommandMenu puts between two bare groups. No hairline: unlike Dropdown, this panel separates groups by space alone.
- `select-option/select-option.vue` — Selectable option row (an `<option>` in `native` mode, where only the default slot renders) with a mode-aware indicator (radio in single mode, checkbox in multi mode), an optional `icon` (PrimeIcons), an optional leading `#left` slot, the option label, and an optional trailing `#tag` slot. **One leading column for the whole list**: as soon as any option in the panel has an `icon` or a `#left` slot, *every* option reserves the leading box (a fixed `size-4`), so a list mixing iconed and icon-less options keeps a single label edge instead of a ragged one. A panel where no option has either reserves nothing and pays no indent. The reservation is pure CSS — the list carries `group/options`, each option with a glyph carries `data-leading`, and `group-has-[[data-leading]]/options` turns the column on for all of them — so no option registry is needed.

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `modelValue` | `string \| number \| unknown[]` | `undefined` | false | Two-way bound selection. Scalar in single mode; array in multi mode. |
| `multiple` | `boolean` | `false` | false | When true, switches the component to multi-select; options render checkbox indicators and `modelValue` is an array. |
| `open` | `boolean` | `undefined` | false | Controlled open state for the dropdown. Use with `v-model:open`. |
| `defaultOpen` | `boolean` | `false` | false | Initial open state when uncontrolled. |
| `placeholder` | `string` | `undefined` | false | Trigger placeholder shown when no option is selected. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Size token; affects trigger height (small=28px, medium=32px, large=40px) matching `InputText`. |
| `disabled` | `boolean` | `false` | false | Disables the trigger and prevents opening; applies disabled tokens. |
| `readonly` | `boolean` | `false` | false | Marks the field read-only; the current selection is visible but the dropdown cannot open. |
| `required` | `boolean` | `false` | false | Marks the field as required; sets `aria-required` on the trigger. Visual indicator (asterisk) is owned by the wrapping form-field, not by this component. |
| `invalid` | `boolean` | `false` | false | Applies the invalid border + ring tokens and sets `aria-invalid` on the trigger. |
| `displayValue` | `(value: unknown) => string` | `undefined` | false | Custom formatter used by the trigger to render the selected label(s); receives the current `modelValue`. |
| `ariaLabel` | `string` | `''` | false | Accessible name for the field when no visible label is associated with it; applied to the trigger (or the native select) and to the listbox. |
| `inputId` | `string` | `''` | false | Id of the trigger, or of the native select; target it with a `<label for>`. A `useId()` id is used when empty. An `id` passed on `Select.Trigger` wins. |
| `native` | `boolean` | `false` | false | Renders the platform `<select>` + `<option>`/`<optgroup>`: system picker on mobile, form submission, `required` validation, autofill. `#search`, `#footer`, option `icon`/`#left`/`#tag` do not render. |
| `name` | `string` | `''` | false | Form field name. Native mode submits the select; the custom mode submits one hidden input per selected value. |
| `autocomplete` | `string` | `''` | false | Autofill hint forwarded to the native select. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `update:modelValue` | `unknown` | Fires when an option is selected (single) or toggled (multi). |
| `update:open` | `boolean` | Fires when the dropdown opens or closes. |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | Composition slot; receives `<SelectTrigger>` and `<SelectContent>` (and the option tree inside it). |

## States

- Visual states: `default`, `hover`, `focus-visible`, `filled`, `disabled`, `invalid`, `opened`
- `data-state` on the root and trigger: `open` | `closed`
- `data-size` on the trigger mirrors the `size` prop
- `data-disabled`, `data-invalid`, `data-required`, `data-readonly`, `data-filled` mirror the matching props (or the selection state for `data-filled`)
- `data-mode` on the root: `single` | `multiple`
- `data-selected` on `<SelectOption>` when the option's value is part of the current selection
- `data-highlighted` on `<SelectOption>` while it is the keyboard-active option (`aria-activedescendant`) and the trigger or listbox holds focus
- `data-native` on the root in `native` mode

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| dropdown open / close (on `SelectContent` only) | popup scale-in / scale-out semantic utilities from `animations.js` | semantic (150ms in / 110ms out · cubic-bezier) | reduced-motion fallback via the matching `motion-reduce` utility |
| trigger state change (border/ring/bg) | `transition-colors duration-150 ease-out` | inline (matches catalog) | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (trigger, option label) | `.text-label-sm` |
| typography (group heading) | `.text-label-sm` + `text-(--text-muted)` |
| surface (trigger) | `var(--bg-surface)` |
| surface (trigger disabled) | `var(--bg-disabled)` |
| surface (panel) | `var(--bg-surface-raised)` |
| surface (option hover) | `var(--bg-hover)` |
| surface (option selected) | `var(--bg-selected)` |
| text | `var(--text-default)` |
| text (placeholder, group heading) | `var(--text-muted)` |
| text (disabled) | `var(--text-disabled)` |
| border (default) | `var(--border-default)` |
| border (hover) | `var(--border-strong)` |
| border (invalid) | `var(--danger-border)` |
| ring (focus) | `var(--ring-color)` |
| ring (invalid focus) | `var(--danger)` |
| spacing (trigger horizontal padding) | `var(--spacing-sm)` |
| spacing (panel list padding.x) | `var(--spacing-xxs)` |
| spacing (panel list padding.y) | `var(--spacing-xs)` — the vertical seam is one step up from the row inset so the first/last row does not crowd the panel border |
| spacing (between groups) | `var(--spacing-sm)` |
| option leading column | `size-4` (16px), reserved for every option when any option has a glyph |
| spacing (option padding) | `var(--spacing-xs)` |
| spacing (option gap) | `var(--spacing-xs)` |
| shape | `var(--shape-elements)` |
| shadow (panel) | `var(--shadow-xs)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.2 AA)

**Pattern decision (ENG-47996).** Single mode follows the ARIA APG **select-only combobox**; multiple mode follows the APG **listbox** (a combobox holds a single value, so a multi-value field opens a multiselectable listbox from a plain button). The previous anatomy mixed both: DOM focus moved into the options while `aria-expanded` / `aria-controls` stayed on the trigger, the `ScrollArea` wrapper and the `#search` / `#footer` slots sat inside `role="listbox"` (axe `aria-required-children`), the trigger had no name unless the consumer passed one (`button-name`, 4.1.2), focus fell to `body` on close (2.4.3), and there was no typeahead. `native` is the zero-cost baseline: the platform control carries all of it.

| WCAG 2.2 | How it is met |
|---|---|
| 1.3.1 Info and Relationships | `role="listbox"` owns only `option` / `group` children; `aria-controls`, `aria-activedescendant`, `aria-selected`, `aria-multiselectable` and `aria-required` expose the structure and state. |
| 2.1.1 Keyboard | Every action has a key (maps below), typeahead included; the panel is never pointer-only. |
| 2.4.3 Focus Order | Single mode keeps DOM focus on the trigger; multiple mode moves it into the listbox on open; Escape, Tab and a pointer pick return it to the trigger. |
| 2.4.7 Focus Visible | `focus-visible` ring on the trigger; the active option carries `data-highlighted` (hover background + inset ring). |
| 4.1.2 Name, Role, Value | Name from `ariaLabel` or a `<label for>` targeting `inputId`; the listbox is named the same way; value is the trigger's text. |

- ARIA (single): trigger is `<button type="button" role="combobox" aria-haspopup="listbox">` with `aria-expanded`, `aria-controls` (the listbox id), `aria-activedescendant` (the active option while open), `aria-invalid`, `aria-required`. DOM focus stays on the trigger.
- ARIA (multiple): trigger is `<button type="button" aria-haspopup="listbox">` with `aria-expanded`, `aria-controls`, `aria-invalid` (no `role="combobox"`). The listbox gets `tabindex="0"`, `aria-multiselectable="true"`, `aria-activedescendant`, `aria-required`, and receives focus on open — unless `#search` is used, whose input owns focus and its own `aria-activedescendant`.
- Listbox: `role="listbox"` on the element inside `ScrollArea` (the scroller is `tabindex="-1"`), `aria-label` resolved from `ariaLabel`, the trigger's `aria-label`, `aria-labelledby` or `<label for>` when the panel opens. Options are `role="option"` with an `id`, `aria-selected` and `aria-disabled`, never focusable themselves; a pointer press on the list does not move focus. Decorative icons are `aria-hidden="true"`.
- Keyboard map (trigger, closed): `Enter` / `Space` / `ArrowDown` / `ArrowUp` open on the selected option (or the first); `Home` / `End` open on the first / last option; a printable character opens and jumps to the first match.
- Keyboard map (single, open — focus on the trigger): `ArrowDown` / `ArrowUp` move the active option, wrapping and skipping disabled options; `Home` / `End` jump; `Enter` / `Space` / `Alt+ArrowUp` select and close; `Escape` closes without changing the value; `Tab` closes without selecting and moves on; printable characters run typeahead (a repeated character cycles through matches, the buffer resets after 500 ms).
- Keyboard map (multiple, open — focus in the listbox): the same movement and typeahead keys; `Enter` / `Space` toggle the active option and keep the panel open; `Escape` and `Tab` close and return focus to the trigger.
- Native mode: the platform keyboard, picker and announcements; `aria-label`, `aria-invalid`, `aria-readonly` on the select; `readonly` reverts any change the picker makes.
- `aria-invalid` and `aria-required` mirror the matching props.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons + borders), including disabled state.
- `motion-reduce:transition-none motion-reduce:animate-none` on every transition/animation-bearing class.
- Touch target ≥40×40 px on `size="large"`; smaller sizes are documented as dense-layout-only (consistent with `InputText`).
- Gate: `select.test.ts` runs `expectNoA11yViolations` with the panel open (single and multiple) and on the story fixtures, closed and open.

## Stories (Storybook)

- Default
- Sizes — composite story rendering all three sizes side by side (canonical composite per `storybook-write` skill).
- Single — justification: documents the radio-style indicator and scalar `modelValue` shape (the default mode); pairs with `Multiple` to make the two modes browseable in one click.
- Multiple — justification: documents the checkbox-style indicator and array `modelValue` shape that the `multiple` prop unlocks.
- WithGroups — justification: documents the `<SelectGroup label="…">` heading anatomy from Figma `3899:29361` (Group region), which is not reachable from Default.
- WithSearchAndFooter — justification: documents the `#search` and `#footer` slots on `<SelectContent>` (Top/Bottom regions in Figma `3899:29361`), which are slot-only and invisible from Default.
- WithOptionExtras — justification: documents the `icon`, `#left`, and `#tag` slots on `<SelectOption>` in one composite frame.
- LongList — justification: documents the panel's internal scroll behaviour (options list wrapped in `ScrollArea`) when the option count exceeds the `max-h-60` viewport; not reachable from any other story.
- Filled — justification: pre-populated `modelValue` shows the filled visual state, which is implicit (no prop).
- Invalid — justification: documents the `invalid` visual treatment, which is a top-level prop with distinct token bindings.
- Disabled
- Native — justification: documents the `native` prop (platform select, `<optgroup>`, `name` submission inside a `<form>`, `required` validation), a different rendering path not reachable from any other story.

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
- Do not add Figma references to Storybook stories. No `parameters.design`, no `parameters.figma`, no Figma URLs in `docs.description.*`, no `@storybook/addon-designs` import. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not use `parameters.actions.argTypesRegex` (deprecated in Storybook 8 and silently misroutes Vue 3 emits) or `parameters.actions.handles` (DOM-only). Declare every event explicitly in `argTypes` with a camelCase `on<Event>` key and `{ action: '<emitted-name>' }`. Do not use the legacy CSF2 `Name.args = {...}` form — always object-style CSF3.
- Do not add bespoke Storybook stories beyond Default + per `kind` + per `size` + Disabled, unless the spec's "Stories (Storybook)" section explicitly justifies the addition.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
