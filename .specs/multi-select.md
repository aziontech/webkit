---
name: multi-select
category: inputs
structure: composition
status: implemented
spec_version: 11
template: 2
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3899-29362
  node_id: 3899:29362
checksum: a1bfdff70c1b386075e9fe5977dca7d7cd2ba07f3931db6df2d5a8864c53e6d6
created: 2026-06-25
last_updated: 2026-11-15
---

# MultiSelect — Component Spec

## Purpose

Select control specialised for choosing many options from a list. The trigger field mirrors `Input`'s visual API (size, hover/focus/filled/disabled/invalid/required states) so a MultiSelect sits next to other form fields without visual drift. The dropdown panel is teleported to `body` and anchored to the trigger by the shared `usePlacement` composable — no `@floating-ui` runtime. Every option row carries a checkbox indicator (the `Checkbox` webkit component), optionally a leading slot/icon and a trailing tag. Search and "Create new" footer are exposed as slots on `<MultiSelectContent>`. Since spec v4 the trigger can also show the selection as removable chips (`kind="chips"`, capped by `chipLimit` with a `+N more` chip), take typed text to filter the options in place (`searchable`), offer an `Add "…"` row for a typed value that matches no option (`allowCustom`, emits `create`), and render its own loading, error and empty list states (`loading`, `error`, `emptyTitle`) — the same vocabulary as `combobox`. MultiSelect is the one multi-pick field (`Select` picks exactly one): `modelValue` is always an array and the indicator is always a checkbox.

Aligned with Figma frame `3899:29362` (options panel). The trigger reuses the `Input`/`Select` trigger visuals.

## When to use

- Use MultiSelect whenever the person picks several values from a list in a form field; the chosen ones show as a count or chips in the trigger. For two to five options that fit on screen use a Checkbox per option; to build a large subset with both sides visible use TransferList.
- Choosing several values from a long list (regions, tags, permissions) in a compact field.
- A filter whose selected values stay editable from the same dropdown.
- Grouped options with icons or trailing tags, optionally with search.
- Tagging a record with labels people pick or type (`kind="chips"` + `searchable` + `allowCustom`).
- Options fetched from a server as the person types (`searchable`, `:filter="false"`, `@search`, `loading`, `error`).

## When NOT to use

- Only one value may be chosen → use `select`.
- A labelled form field with helper/error text → put it inside a `field`.
- A handful of options that fit on screen → use a horizontal `field` with a `checkbox` for each.
- The user builds a subset and needs the chosen and remaining items side by side → use `transfer-list`.
- Free-form tags with no list of options to pick from → use `tag-editor`.

## Related

- `select` — single-choice counterpart.
- `field` — wraps this control with its label, description and error; it hands the trigger its id and state.
- `transfer-list` — dual-list transfer for building larger subsets.
- `checkbox` — the indicator every option row renders.
- `combobox` — single-value field with typed text; `searchable`, `allowCustom`, `filter`, `loading` and `emptyTitle` share its meaning.
- `chip` — each selected value in `kind="chips"`.

## Best practices

- `modelValue` is always an array; start it as `[]`, never `null`.
- Pass `displayValue` to summarise long selections (e.g. "3 regions") instead of a list that overflows the trigger.
- Keep each option's `value` stable and unique; selection is matched by value.
- Put a search input in the `search` slot and a create action in the `footer` slot of `MultiSelect.Content` — or set `searchable` (and `allowCustom`) to type in the trigger itself; do not combine the two.
- With `kind="chips"`, set `chipLimit` when the field sits in a dense row; leave it `0` in a form so every chip wraps and stays removable.
- `create` only reports the typed value: add the new option to your list and its value to the model in the handler.
- For a server-side search, set `:filter="false"`, fetch on `search`, and drive `loading` and `error` from the request.

## Usage

```vue
<script setup>
  import MultiSelect from '@aziontech/webkit/multi-select'
  import MultiSelectTrigger from '@aziontech/webkit/multi-select-trigger'
  import MultiSelectContent from '@aziontech/webkit/multi-select-content'
  import MultiSelectGroup from '@aziontech/webkit/multi-select-group'
  import MultiSelectOption from '@aziontech/webkit/multi-select-option'

  const value = defineModel({ default: () => [] })
</script>

<template>
  <MultiSelect
    v-model="value"
    size="medium"
    placeholder="Select options"
  >
    <MultiSelectTrigger />
    <MultiSelectContent>
      <MultiSelectGroup label="Group A">
        <MultiSelectOption value="opt-1">Option 1</MultiSelectOption>
        <MultiSelectOption value="opt-2">Option 2</MultiSelectOption>
      </MultiSelectGroup>
      <MultiSelectGroup label="Group B">
        <MultiSelectOption
          value="opt-3"
          icon="ai ai-heart"
          >Option 3</MultiSelectOption
        >
      </MultiSelectGroup>
    </MultiSelectContent>
  </MultiSelect>
</template>
```

Chips, typed filter and a create row:

```vue
<script setup>
  import MultiSelect from '@aziontech/webkit/multi-select'
  import { ref } from 'vue'

  const labels = ref(['production', 'staging', 'docs-site'])
  const value = ref(['production'])
  const add = (event, label) => {
    labels.value.push(label)
    value.value = [...value.value, label]
  }
</script>

<template>
  <MultiSelect
    v-model="value"
    kind="chips"
    :chip-limit="3"
    searchable
    allow-custom
    placeholder="Add labels"
    aria-label="Labels"
    @create="add"
  >
    <MultiSelect.Trigger />
    <MultiSelect.Content>
      <MultiSelect.Option
        v-for="label in labels"
        :key="label"
        :value="label"
        >{{ label }}</MultiSelect.Option
      >
    </MultiSelect.Content>
  </MultiSelect>
</template>
```

## Sub-components

- `multi-select-trigger/multi-select-trigger.vue` — With the default `kind="summary"` and no `searchable`, a bordered trigger button; otherwise a bordered field (`min-h` of the size, wrapping) that holds the chips (`kind="chips"`: one removable `Chip` of size `small` per selected value, the first `chipLimit` of them followed by a non-removable `+N more` chip when `chipLimit` > 0), then the combobox control — an `input` when `searchable` (its placeholder is the selection summary when `kind="summary"`), else a button — then the chevron. A click anywhere on the field but a chip's remove button opens the panel and focuses the control. The default trigger: bordered trigger field with an optional `#prefix` slot (typed with `defineSlots`), selected-value label (comma-joined option labels, or `displayValue`). Each option records its label text with the root when it mounts; on mount `MultiSelectContent` renders only the selected options (and any group without a `value`) once inside a `hidden` container so their labels are known before the panel first opens, then drops it, and chevron-down. Mirrors `Input` size/state visuals.
- `multi-select-content/multi-select-content.vue` — Popover panel teleported to `body` and anchored with `usePlacement`; exposes `default` (the options), `#search` and `#footer` slots, typed with `defineSlots`, and scrolls its option list when content exceeds `max-h-[320px]`. It owns the list states: `loading` replaces the options with a spinner row (`Loading options`), a non-empty `error` replaces them with the message, and when no option is visible it shows `emptyTitle` (or `No matches`). With `allowCustom` and typed text that equals no option label, it appends an `Add "…"` option row after the options. A visually hidden polite status region next to the panel announces the loading, error, empty and match-count states.
- `multi-select-group/multi-select-group.vue` — Section wrapper for a labelled group of options; hidden while the typed filter hides every one of its options; renders a `text-label-sm` heading in `--text-muted` when `label` is set. Groups never sit flush: `--spacing-sm` above every group but the first — the same rhythm DropdownMenu puts around its group divider and Command puts between two bare groups. No hairline: unlike DropdownMenu, this panel separates groups by space alone.
- `multi-select-option/multi-select-option.vue` — Selectable option row; hidden (`v-show`) while `searchable` + `filter` and its label text does not contain the typed text (case and accent insensitive, in the active locale); with a checkbox indicator (the `Checkbox` webkit component), an optional `icon` (an Azion icon class), an optional leading `#left` slot, the option label, and an optional trailing `#tag` slot. **One leading column for the whole list**: as soon as any option in the panel has an `icon` or a `#left` slot, _every_ option reserves the leading box (a fixed `size-4`), so a list mixing iconed and icon-less options keeps a single label edge instead of a ragged one. A panel where no option has either reserves nothing and pays no indent. The reservation is pure CSS — the list carries `group/options`, each option with a glyph carries `data-leading`, and `group-has-[[data-leading]]/options` turns the column on for all of them — so no option registry is needed.

## Props

| Prop           | Type                             | Default     | Required | JSDoc                                                                                                                                                                                                                                                                |
| -------------- | -------------------------------- | ----------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defaultOpen`  | `boolean`                        | `false`     | false    | Initial open state when uncontrolled.                                                                                                                                                                                                                                |
| `placeholder`  | `string`                         | `''`        | false    | Trigger placeholder shown when no option is selected.                                                                                                                                                                                                                |
| `size`         | `'small' \| 'medium' \| 'large'` | `'medium'`  | false    | Size token; affects trigger height (small=28px, medium=32px, large=40px) matching `Input`.                                                                                                                                                                           |
| `disabled`     | `boolean`                        | `false`     | false    | Disables the trigger and prevents opening; applies disabled tokens.                                                                                                                                                                                                  |
| `readonly`     | `boolean`                        | `false`     | false    | Marks the field read-only; the current selection is visible but the dropdown cannot open.                                                                                                                                                                            |
| `required`     | `boolean`                        | `false`     | false    | Marks the field as required; sets `aria-required` on the trigger. Visual indicator (asterisk) is owned by the wrapping form-field, not by this component.                                                                                                            |
| `invalid`      | `boolean`                        | `false`     | false    | Applies the invalid border + ring tokens and sets `aria-invalid` on the trigger.                                                                                                                                                                                     |
| `displayValue` | `(value: TValue[]) => string`    | `undefined` | false    | Custom formatter used by the trigger to render the selected labels; receives the current `modelValue` array.                                                                                                                                                         |
| `name`         | `string`                         | `''`        | false    | Form field name. Set, the root renders one hidden input per selected value so a native `form` and `FormData` submit every selection under that name; `required` then adds a hidden required proxy that blocks an empty submit, and `disabled` leaves the values out. |
| `kind`         | `'summary' \| 'chips'`           | `'summary'` | false    | How the trigger shows the selection: `summary` joins the labels (or `displayValue`), `chips` renders one removable chip per value.                                                                                                                                   |
| `chipLimit`    | `number`                         | `0`         | false    | With `kind="chips"`, the most chips shown before a `+N more` chip; `0` shows every chip and wraps.                                                                                                                                                                   |
| `searchable`   | `boolean`                        | `false`     | false    | Types in the trigger: the text filters the options, `Backspace` in an empty field removes the last value.                                                                                                                                                            |
| `filter`       | `boolean`                        | `true`      | false    | With `searchable`, hides the options whose label does not contain the typed text. Turn off when the server filters on `search`.                                                                                                                                      |
| `allowCustom`  | `boolean`                        | `false`     | false    | With `searchable`, offers typed text that matches no option as an `Add "…"` row that emits `create`.                                                                                                                                                                 |
| `loading`      | `boolean`                        | `false`     | false    | Shows the loading row in place of the options while they are fetched.                                                                                                                                                                                                |
| `error`        | `string`                         | `''`        | false    | Message shown in place of the options when they failed to load; empty shows the options.                                                                                                                                                                             |
| `emptyTitle`   | `string`                         | `''`        | false    | Text of the list when no option is visible. Empty uses the locale catalog.                                                                                                                                                                                           |

**Generic.** The root is generic over `TValue` (default `unknown`), the item type of the bound `modelValue`: with a `string[]` model, `displayValue` takes `(value: string[]) => string` and `update:modelValue` sends a `string[]`, so a handler needs no cast. `@aziontech/webkit/multi-select` exports the types `MultiSelectSize` and `MultiSelectKind`.

## v-model

| Model          | Type       | Default     | Emits               | Notes                                                                                                                                                                                                     |
| -------------- | ---------- | ----------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model`      | `TValue[]` | `[]`        | `update:modelValue` | The selection via `defineModel`. Always an array; each item is the `value` of a selected `<MultiSelectOption>`. Fires when an option is toggled with the next selection array. Uncontrolled when unbound. |
| `v-model:open` | `boolean`  | `undefined` | `update:open`       | Open state of the dropdown via `defineModel`. Fires when the dropdown opens or closes. Unbound, the dropdown keeps its own state, seeded by `defaultOpen`.                                                |

## Events

| Event    | Payload                                               | Notes                                                                                                                                                                                                         |
| -------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `search` | `string`                                              | The typed text, on each keystroke (`searchable`), and `''` when the panel closes and the text is cleared. Value event: no DOM event.                                                                          |
| `create` | `(event: MouseEvent \| KeyboardEvent, value: string)` | The `Add "…"` row was activated (`allowCustom`), by click or by `Enter` in the field or on the row; `value` is the trimmed typed text. The typed text is cleared; the consumer adds the option and the value. |

## Slots

| Slot      | Scope | Notes                                                                                                         |
| --------- | ----- | ------------------------------------------------------------------------------------------------------------- |
| `default` | —     | Composition slot; receives `<MultiSelectTrigger>` and `<MultiSelectContent>` (and the option tree inside it). |

## States

- Visual states: `default`, `hover`, `focus-visible`, `filled`, `disabled`, `invalid`, `opened`
- `data-state` on the root and trigger: `open` | `closed`
- `data-size` on the trigger mirrors the `size` prop
- `data-disabled`, `data-invalid`, `data-required`, `data-readonly`, `data-filled` mirror the matching props (or the selection state for `data-filled`)
- `data-selected` on `<MultiSelectOption>` when the option's value is part of the current selection
- `data-kind` on the root and trigger mirrors `kind`; `data-searchable` on the trigger mirrors `searchable`
- `loading`: `aria-busy` on the listbox and the loading row; `error`: the message row; `empty`: the empty row — each in place of the options, in the panel
- `data-kind="create"` on the `Add "…"` row
- Typed filter: while the typed text is not empty, every chunk is mounted so the filter sees every option.
- Long lists: above 300 options the list mounts in chunks of 100 as they scroll near view (unmounted chunks keep their height, 32 px per option), so opening a 1,000-option list stays within its runtime budget. The first arrow, `Home` or `End` key in the list mounts every option before moving focus, so keyboard navigation always reaches every option.

## Motion & Animations

| Trigger                                              | Animation / Transition                                             | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback                                          |
| ---------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------- | ---------------------------------------------------------------- |
| dropdown open / close (on `MultiSelectContent` only) | popup scale-in / scale-out semantic utilities from `animations.js` | semantic (150ms in / 110ms out · cubic-bezier)    | reduced-motion fallback via the matching `motion-reduce` utility |
| trigger state change (border/ring/bg)                | `transition-colors duration-150 ease-out`                          | inline (matches catalog)                          | `motion-reduce:transition-none`                                  |
| checkbox indicator check/uncheck                     | inherits from `Checkbox` webkit component                          | inherits from `Checkbox`                          | inherits from `Checkbox`                                         |
| loading row spinner                                  | inherits from `Spinner`                                            | inherits from `Spinner`                           | inherits from `Spinner`                                          |

## Tokens

| Region                               | Token (DESIGN.md)                                                                                                               |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| typography (trigger, option label)   | `.text-label-sm`                                                                                                                |
| typography (group heading)           | `.text-label-sm` + `text-(--text-muted)`                                                                                        |
| surface (trigger)                    | `var(--bg-surface)`                                                                                                             |
| surface (trigger disabled)           | `var(--bg-disabled)`                                                                                                            |
| surface (panel)                      | `var(--bg-surface)`                                                                                                             |
| surface (option hover)               | `var(--bg-hover)`                                                                                                               |
| surface (option selected)            | `var(--bg-selected)`                                                                                                            |
| text                                 | `var(--text-default)`                                                                                                           |
| text (placeholder, group heading)    | `var(--text-muted)`                                                                                                             |
| text (disabled)                      | `var(--text-disabled)`                                                                                                          |
| border (default)                     | `var(--border-default)`                                                                                                         |
| border (hover)                       | `var(--border-strong)`                                                                                                          |
| border (invalid)                     | `var(--danger-border)`                                                                                                          |
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
| chips (`kind="chips"`)               | `Chip` `kind="filled"` `size="small"` (24px); the `+N more` chip `kind="outlined"`                                              |
| spacing (between chips, wrap rows)   | `var(--spacing-xxs)`                                                                                                            |
| typed text / placeholder             | `.text-label-sm`, `var(--text-default)` / `var(--text-muted)`                                                                   |
| list state rows (loading, empty)     | `.text-body-sm` + `var(--text-muted)`                                                                                           |
| list state row (error)               | `.text-body-sm` + `var(--danger)` icon                                                                                          |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` on trigger and on every option row.
- Keyboard map (trigger): `Tab` focuses; `Space`/`Enter`/`ArrowDown` opens the panel; `Escape` closes it.
- Keyboard map (closed trigger): `Enter`, `Space`, `ArrowDown` and `ArrowUp` open the list (focus lands as described below); `Home` opens it on the first enabled option and `End` on the last; typing a printable character opens it on the first enabled option whose label starts with that character (with a search field, focus goes to the search field instead). Clicking the trigger while the list is open closes it. Tests: `multi-select.test.ts` › Select keyboard and naming (APG select-only combobox).
- Keyboard map (`searchable` field): typing filters and opens the panel; `ArrowDown` opens and focuses the first visible option, `ArrowUp` the last; `Enter` activates the `Add "…"` row when it is offered, else opens the panel; `Backspace` in an empty field removes the last selected value; `Escape` closes the panel, then clears the text; `Tab` closes and moves on. From the list, `Escape`, `Tab` and `Shift+Tab` return focus to the field instead of a trigger button.
- Chips: each chip's remove button is in the tab order and named `Remove <label>` (from `Chip`); removing one never opens the panel. The `+N more` chip is plain text.
- Keyboard map (open panel): opening focuses the search field when there is one, else the first selected option, else the first enabled option; `ArrowDown`/`ArrowUp` move between enabled options and wrap; `Home`/`End` jump to first/last enabled; `Enter`/`Space` toggles the focused option and keeps the panel open; typing a printable character moves focus to the next enabled option whose label starts with the typed text (characters typed within 500 ms add up; ignored while the search field has focus); `Escape` closes and returns focus to the trigger; `Tab` closes and moves focus to the control after the trigger; `Shift+Tab` closes and returns focus to the trigger. Tests: `multi-select.test.ts` › keyboard map (spec).
- ARIA: trigger uses `role="combobox"` with `aria-haspopup="listbox"`, `aria-expanded` bound to open state, `aria-controls` pointing to the list. The teleported content is a plain panel holding the optional search field, the list and the optional footer; the list (not the panel) carries `role="listbox"`, so the search field sits outside it, and is named by the root's `aria-label`, else by the root's `aria-labelledby`, else by the enclosing `Field` label, else by the trigger (which always has an `id`). The list uses `role="listbox"` with `aria-multiselectable="true"`. Each option uses `role="option"` with `aria-selected` mirroring its selection. Decorative icons (`ai ai-chevron-down`, `ai-heart`, etc.) are `aria-hidden="true"`. The checkbox indicator is decorative for screen readers (the `role="option"` + `aria-selected` carries the semantic); the inner `Checkbox` sits in an `inert`, `aria-hidden="true"` wrapper, so the option has no focusable descendant.
- Nested overlays: the open list joins the shared overlay layer stack (`useOverlayLayer`), so inside a `Popover`, `Dialog` or `Drawer` an option click or `Escape` in the list closes only the list; the host overlay stays open.
- `aria-invalid` and `aria-required` on the trigger mirror the matching props.
- With `kind="chips"` or `searchable`, the `combobox` role, `id`, name and `aria-*` move from the field to its control (the `input` gets `aria-autocomplete="list"`); the field itself is a plain container.
- List states sit in `role="presentation"` rows; a visually hidden `role="status"` region announces `Loading options`, the error message, the empty text, or `{count} options` after typing.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons + borders), including disabled state.
- `motion-reduce:transition-none motion-reduce:animate-none` on every transition/animation-bearing class.
- Touch target ≥40×40 px on `size="large"`; smaller sizes are documented as dense-layout-only (consistent with `Input`).
- Teleported content: the teleported `role="listbox"` content binds `dir` and `lang` from the nearest `WebkitProvider` (`usePortalLocale`), so it keeps the provider's direction and language although it renders under `body`. With no provider nothing is set and the document's own `dir` and `lang` apply.

## Internationalization

| Key                   | English source                                | Override prop |
| --------------------- | --------------------------------------------- | ------------- |
| `multiSelect.empty`   | `No matches`                                  | `emptyTitle`  |
| `multiSelect.loading` | `Loading options`                             | —             |
| `multiSelect.add`     | `Add "{value}"`                               | —             |
| `multiSelect.more`    | `+{count} more`                               | —             |
| `multiSelect.count`   | `{count} option` / `{count} options` (plural) | —             |

- The chip remove names come from `chip.removeNamed`.
- Typed-text matching folds case and accents with the active locale (`toLocaleLowerCase`, NFD).
- `+{count} more` and `{count} options` go through the plural rules and number format of the active locale.

## Right-to-left

- Layout: logical utilities only (`ps-`/`pe-`, `ms-auto`, `text-start`); chips flow from the start edge and wrap.
- Icons: the chevron is not mirrored.
- Keyboard: `ArrowDown`/`ArrowUp` are not direction-dependent; `Backspace` removes the last value in reading order.
- User data: chip labels and typed text use `dir="auto"` through `Chip` and the input.
- Teleported content: see Accessibility — the panel binds `dir` and `lang` from the nearest `WebkitProvider`.

## Responsive

- The trigger fills its container; with `kind="chips"` and `chipLimit` `0` the chips wrap onto several lines and the field grows (`min-h` of the size, never a fixed height).
- Touch: chip remove buttons follow `Chip`'s target; options are 32 px rows.
- Reflow: no horizontal scroll at 320 px and 200 % zoom; a long chip label truncates inside the chip.

## Performance

- Bundle budget: `./multi-select` in `.size-limit.json` (adds `Chip` and `Spinner` to the compound).
- Runtime budget: `multi-select-1k` (open and filter 1,000 options from the consumer) and `multi-select-1k-typed` (open a `searchable` chips field over 1,000 options and type a filter) in `perf-budgets.json`, measured by `src/test/performance.test.ts`.
- Each option compares its own label with the typed text; the panel counts the visible options from a registry of mounted labels, linear in the option count per keystroke.

## Examples

- Default
- Sizes — composite story rendering all three sizes side by side (canonical composite example).
- WithGroups — justification: documents the `<MultiSelectGroup label="…">` heading anatomy from Figma `3899:29362` (Group region), which is not reachable from Default.
- WithSearchAndFooter — justification: documents the `#search` and `#footer` slots on `<MultiSelectContent>` (Top/Bottom regions in Figma `3899:29362`), which are slot-only and invisible from Default.
- WithOptionExtras — justification: documents the `icon`, `#left`, and `#tag` slots on `<MultiSelectOption>` in one composite frame.
- LongList — justification: documents the panel's internal scroll behaviour (options list wrapped in `ScrollArea`) when the option count exceeds the `max-h-80` viewport; not reachable from any other story.
- Filled — justification: pre-populated `modelValue` array shows the filled visual state (checkbox indicators in their checked state for the selected rows), which is implicit (no prop).
- Invalid — justification: documents the `invalid` visual treatment, which is a top-level prop with distinct token bindings.
- Disabled
- Chips — justification: documents `kind="chips"` with `chipLimit` (removable chips and the `+N more` chip), a trigger anatomy no other example shows.
- TypeToFilter — justification: documents `searchable` + `allowCustom` (typing in the trigger, `Backspace`, the `Add "…"` row and `create`).
- ListStates — justification: documents the `loading`, `error` and empty list states the panel owns, which no other example reaches.

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
