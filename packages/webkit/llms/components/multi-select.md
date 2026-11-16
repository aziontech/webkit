# Multi Select

> Select control specialised for choosing many options from a list. The trigger field mirrors `Input`'s visual API (size, hover/focus/filled/disabled/invalid/required states) so a MultiSelect sits next to other form fields without visual drift. The dropdown panel is teleported to `body` and anchored to the trigger by the shared `usePlacement` composable — no `@floating-ui` runtime. Every option row carries a checkbox indicator (the `Checkbox` webkit component), optionally a leading slot/icon and a trailing tag. Search and "Create new" footer are exposed as slots on `<MultiSelectContent>`. Since spec v4 the trigger can also show the selection as removable chips (`variant="chips"`, capped by `chipLimit` with a `+N more` chip), take typed text to filter the options in place (`searchable`), offer an `Add "…"` row for a typed value that matches no option (`allowCustom`, emits `create`), and render its own loading, error and empty list states (`loading`, `error`, `emptyTitle`) — the same vocabulary as `combobox`. MultiSelect is the one multi-pick field (`Select` picks exactly one): `modelValue` is always an array and the indicator is always a checkbox. Aligned with Figma frame `3899:29362` (options panel). The trigger reuses the `Input`/`Select` trigger visuals.

- Import: `import MultiSelectRoot from '@aziontech/webkit/multi-select-root'`
- Compound import (dot notation, not tree-shakeable): `import MultiSelect from '@aziontech/webkit/multi-select'`
- Category: input · Surface: app · Structure: composition
- API as JSON: [multi-select.json](multi-select.json)

## When to use

- Use MultiSelect whenever the person picks several values from a list in a form field; the chosen ones show as a count or chips in the trigger. For two to five options that fit on screen use a Checkbox per option; to build a large subset with both sides visible use TransferList.
- Choosing several values from a long list (regions, tags, permissions) in a compact field.
- A filter whose selected values stay editable from the same dropdown.
- Grouped options with icons or trailing tags, optionally with search.
- Tagging a record with labels people pick or type (`variant="chips"` + `searchable` + `allowCustom`).
- Options fetched from a server as the person types (`searchable`, `:filter="false"`, `@search`, `loading`, `error`).

## Do

- `modelValue` is always an array; start it as `[]`, never `null`.
- Pass `displayValue` to summarise long selections (e.g. "3 regions") instead of a list that overflows the trigger.
- Keep each option's `value` stable and unique; selection is matched by value.
- Put a search input in the `search` slot and a create action in the `footer` slot of `MultiSelect.Content` — or set `searchable` (and `allowCustom`) to type in the trigger itself; do not combine the two.
- With `variant="chips"`, set `chipLimit` when the field sits in a dense row; leave it `0` in a form so every chip wraps and stays removable.
- `create` only reports the typed value: add the new option to your list and its value to the model in the handler.
- For a server-side search, set `:filter="false"`, fetch on `search`, and drive `loading` and `error` from the request.

## Don’t

- Only one value may be chosen → use `select`.
- A labelled form field with helper/error text → put it inside a `field`.
- A handful of options that fit on screen → use a horizontal `field` with a `checkbox` for each.
- The user builds a subset and needs the chosen and remaining items side by side → use `transfer-list`.
- Free-form tags with no list of options to pick from → use `tag-editor`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [select](select.md) — single-choice counterpart.
- [field](field.md) — wraps this control with its label, description and error; it hands the trigger its id and state.
- [transfer-list](transfer-list.md) — dual-list transfer for building larger subsets.
- [checkbox](checkbox.md) — the indicator every option row renders.
- [combobox](combobox.md) — single-value field with typed text; `searchable`, `allowCustom`, `filter`, `loading` and `emptyTitle` share its meaning.
- [chip](chip.md) — each selected value in `variant="chips"`.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `defaultOpen` | `boolean` | `false` | false | Initial open state when uncontrolled. |
| `placeholder` | `string` | `''` | false | Trigger placeholder shown when no option is selected. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Size token; affects trigger height (small=28px, medium=32px, large=40px) matching `Input`. |
| `disabled` | `boolean` | `false` | false | Disables the trigger and prevents opening; applies disabled tokens. |
| `readonly` | `boolean` | `false` | false | Marks the field read-only; the current selection is visible but the dropdown cannot open. |
| `required` | `boolean` | `false` | false | Marks the field as required; sets `aria-required` on the trigger. Visual indicator (asterisk) is owned by the wrapping form-field, not by this component. |
| `invalid` | `boolean` | `false` | false | Applies the invalid border + ring tokens and sets `aria-invalid` on the trigger. |
| `displayValue` | `(value: TValue[]) => string` | `undefined` | false | Custom formatter used by the trigger to render the selected labels; receives the current `modelValue` array. |
| `name` | `string` | `''` | false | Form field name. Set, the root renders one hidden input per selected value so a native `form` and `FormData` submit every selection under that name; `required` then adds a hidden required proxy that blocks an empty submit, and `disabled` leaves the values out. |
| `variant` | `'summary' \| 'chips'` | `'summary'` | false | How the trigger shows the selection: `summary` joins the labels (or `displayValue`), `chips` renders one removable chip per value. |
| `chipLimit` | `number` | `0` | false | With `variant="chips"`, the most chips shown before a `+N more` chip; `0` shows every chip and wraps. |
| `searchable` | `boolean` | `false` | false | Types in the trigger: the text filters the options, `Backspace` in an empty field removes the last value. |
| `filter` | `boolean` | `true` | false | With `searchable`, hides the options whose label does not contain the typed text. Turn off when the server filters on `search`. |
| `allowCustom` | `boolean` | `false` | false | With `searchable`, offers typed text that matches no option as an `Add "…"` row that emits `create`. |
| `loading` | `boolean` | `false` | false | Shows the loading row in place of the options while they are fetched. |
| `error` | `string` | `''` | false | Message shown in place of the options when they failed to load; empty shows the options. |
| `emptyTitle` | `string` | `''` | false | Text of the list when no option is visible. Empty uses the locale catalog. |
| `modelValue` | `TValue[]` | `() => []` | false | Two-way value (`v-model`). |
| `open` | `boolean` | `undefined as never` | false | Two-way value (`v-model:open`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `search` | `string` | The typed text, on each keystroke (`searchable`), and `''` when the panel closes and the text is cleared. Value event: no DOM event. |
| `create` | `(event: MouseEvent \| KeyboardEvent, value: string)` | The `Add "…"` row was activated (`allowCustom`), by click or by `Enter` in the field or on the row; `value` is the trimmed typed text. The typed text is cleared; the consumer adds the option and the value. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Composition slot; receives `<MultiSelectTrigger>` and `<MultiSelectContent>` (and the option tree inside it). |

## Sub-component imports

- `@aziontech/webkit/multi-select-trigger`
- `@aziontech/webkit/multi-select-content`
- `@aziontech/webkit/multi-select-group`
- `@aziontech/webkit/multi-select-item`

## Sub-components

- `multi-select-trigger/multi-select-trigger.vue` — With the default `variant="summary"` and no `searchable`, a bordered trigger button; otherwise a bordered field (`min-h` of the size, wrapping) that holds the chips (`variant="chips"`: one removable `Chip` of size `small` per selected value, the first `chipLimit` of them followed by a non-removable `+N more` chip when `chipLimit` > 0), then the combobox control — an `input` when `searchable` (its placeholder is the selection summary when `variant="summary"`), else a button — then the chevron. A click anywhere on the field but a chip's remove button opens the panel and focuses the control. The default trigger: bordered trigger field with an optional `#leading` slot (typed with `defineSlots`), selected-value label (comma-joined option labels, or `displayValue`). Each option records its label text with the root when it mounts; on mount `MultiSelectContent` renders only the selected options (and any group without a `value`) once inside a `hidden` container so their labels are known before the panel first opens, then drops it, and chevron-down. Mirrors `Input` size/state visuals.
- `multi-select-content/multi-select-content.vue` — Popover panel teleported to `body` and anchored with `usePlacement`; exposes `default` (the options), `#search` and `#footer` slots, typed with `defineSlots`, and scrolls its option list when content exceeds `max-h-[320px]`. It owns the list states: `loading` replaces the options with a spinner row (`Loading options`), a non-empty `error` replaces them with the message, and when no option is visible it shows `emptyTitle` (or `No matches`). With `allowCustom` and typed text that equals no option label, it appends an `Add "…"` option row after the options. A visually hidden polite status region next to the panel announces the loading, error, empty and match-count states.
- `multi-select-group/multi-select-group.vue` — Section wrapper for a labelled group of options; hidden while the typed filter hides every one of its options; renders a `text-label-sm` heading in `--text-muted` when `label` is set. Groups never sit flush: `--spacing-sm` above every group but the first — the same rhythm DropdownMenu puts around its group divider and Command puts between two bare groups. No hairline: unlike DropdownMenu, this panel separates groups by space alone.
- `multi-select-item/multi-select-item.vue` — Selectable option row; hidden (`v-show`) while `searchable` + `filter` and its label text does not contain the typed text (case and accent insensitive, in the active locale); with a checkbox indicator (the `Checkbox` webkit component), an optional `icon` (an Azion icon class), an optional leading `#leading` slot, the option label, and an optional trailing `#tag` slot. **One leading column for the whole list**: as soon as any option in the panel has an `icon` or a `#leading` slot, _every_ option reserves the leading box (a fixed `size-4`), so a list mixing iconed and icon-less options keeps a single label edge instead of a ragged one. A panel where no option has either reserves nothing and pays no indent. The reservation is pure CSS — the list carries `group/options`, each option with a glyph carries `data-leading`, and `group-has-[[data-leading]]/options` turns the column on for all of them — so no option registry is needed.

## v-model

| Model          | Type       | Default     | Emits               | Notes                                                                                                                                                                                                   |
| -------------- | ---------- | ----------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model`      | `TValue[]` | `[]`        | `update:modelValue` | The selection via `defineModel`. Always an array; each item is the `value` of a selected `<MultiSelectItem>`. Fires when an option is toggled with the next selection array. Uncontrolled when unbound. |
| `v-model:open` | `boolean`  | `undefined` | `update:open`       | Open state of the dropdown via `defineModel`. Fires when the dropdown opens or closes. Unbound, the dropdown keeps its own state, seeded by `defaultOpen`.                                              |

## States

- Visual states: `default`, `hover`, `focus-visible`, `filled`, `disabled`, `invalid`, `opened`
- `data-state` on the root and trigger: `open` | `closed`
- `data-size` on the trigger mirrors the `size` prop
- `data-disabled`, `data-invalid`, `data-required`, `data-readonly`, `data-filled` mirror the matching props (or the selection state for `data-filled`)
- `data-selected` on `<MultiSelectItem>` when the option's value is part of the current selection
- `data-variant` on the root and trigger mirrors `variant`; `data-searchable` on the trigger mirrors `searchable`
- `loading`: `aria-busy` on the listbox and the loading row; `error`: the message row; `empty`: the empty row — each in place of the options, in the panel
- `data-variant="create"` on the `Add "…"` row
- Typed filter: while the typed text is not empty, every chunk is mounted so the filter sees every option.
- Long lists: above 300 options the list mounts in chunks of 100 as they scroll near view (unmounted chunks keep their height, 32 px per option), so opening a 1,000-option list stays within its runtime budget. The first arrow, `Home` or `End` key in the list mounts every option before moving focus, so keyboard navigation always reaches every option.
- `data-side` (`bottom` | `top`) and `data-align` (`start`) on the listbox panel mirror where it landed after flipping; `start` follows the text direction, so under `rtl` the panel lines up with the field's right edge

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` on trigger and on every option row.
- Keyboard map (trigger): `Tab` focuses; `Space`/`Enter`/`ArrowDown` opens the panel; `Escape` closes it.
- Keyboard map (closed trigger): `Enter`, `Space`, `ArrowDown` and `ArrowUp` open the list (focus lands as described below); `Home` opens it on the first enabled option and `End` on the last; typing a printable character opens it on the first enabled option whose label starts with that character (with a search field, focus goes to the search field instead). Clicking the trigger while the list is open closes it. Tests: `multi-select.test.ts` › Select keyboard and naming (APG select-only combobox).
- Keyboard map (`searchable` field): typing filters and opens the panel; `ArrowDown` opens and focuses the first visible option, `ArrowUp` the last; `Enter` activates the `Add "…"` row when it is offered, else opens the panel; `Backspace` in an empty field removes the last selected value; `Escape` closes the panel, then clears the text; `Tab` closes and moves on. From the list, `Escape`, `Tab` and `Shift+Tab` return focus to the field instead of a trigger button.
- Chips: each chip's remove button is in the tab order and named `Remove <label>` (from `Chip`); removing one never opens the panel. The `+N more` chip is plain text.
- Keyboard map (open panel): opening focuses the search field when there is one, else the first selected option, else the first enabled option; `ArrowDown`/`ArrowUp` move between enabled options and wrap; `Home`/`End` jump to first/last enabled; `Enter`/`Space` toggles the focused option and keeps the panel open; typing a printable character moves focus to the next enabled option whose label starts with the typed text (characters typed within 500 ms add up; ignored while the search field has focus); `Escape` closes and returns focus to the trigger; `Tab` closes and moves focus to the control after the trigger; `Shift+Tab` closes and returns focus to the trigger. Tests: `multi-select.test.ts` › keyboard map (spec).
- ARIA: trigger uses `role="combobox"` with `aria-haspopup="listbox"`, `aria-expanded` bound to open state, `aria-controls` pointing to the list. The teleported content is a plain panel holding the optional search field, the list and the optional footer; the list (not the panel) carries `role="listbox"`, so the search field sits outside it, and is named by the root's `aria-label`, else by the root's `aria-labelledby`, else by the enclosing `Field` label, else by the trigger (which always has an `id`). The list uses `role="listbox"` with `aria-multiselectable="true"`. Each option uses `role="option"` with `aria-selected` mirroring its selection. Decorative icons (`ai ai-chevron-down`, `ai-heart`, etc.) are `aria-hidden="true"`. The checkbox indicator is decorative for screen readers (the `role="option"` + `aria-selected` carries the semantic); the inner `Checkbox` sits in an `inert`, `aria-hidden="true"` wrapper, so the option has no focusable descendant.
- Nested overlays: the open list joins the shared overlay layer stack (`useOverlayLayer`), so inside a `Popover`, `Dialog` or `Drawer` an option click or `Escape` in the list closes only the list; the host overlay stays open.
- `aria-invalid` and `aria-required` on the trigger mirror the matching props.
- With `variant="chips"` or `searchable`, the `combobox` role, `id`, name and `aria-*` move from the field to its control (the `input` gets `aria-autocomplete="list"`); the field itself is a plain container.
- List states sit in `role="presentation"` rows; a visually hidden `role="status"` region announces `Loading options`, the error message, the empty text, or `{count} options` after typing.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons + borders), including disabled state.
- `motion-reduce:transition-none motion-reduce:animate-none` on every transition/animation-bearing class.
- Touch target ≥40×40 px on `size="large"`; smaller sizes are documented as dense-layout-only (consistent with `Input`).
- Teleported content: the teleported `role="listbox"` content binds `dir` and `lang` from the nearest `WebkitProvider` (`usePortalLocale`), so it keeps the provider's direction and language although it renders under `body`. With no provider nothing is set and the document's own `dir` and `lang` apply.

## Right-to-left

- Layout: logical utilities only (`ps-`/`pe-`, `ms-auto`, `text-start`); chips flow from the start edge and wrap.
- Icons: the chevron is not mirrored.
- Keyboard: `ArrowDown`/`ArrowUp` are not direction-dependent; `Backspace` removes the last value in reading order.
- User data: chip labels and typed text use `dir="auto"` through `Chip` and the input.
- Teleported content: see Accessibility — the panel binds `dir` and `lang` from the nearest `WebkitProvider`.

## Internationalization

| Key                   | English source                                | Override prop |
| --------------------- | --------------------------------------------- | ------------- |
| `multiSelect.noMatch` | `No matches`                                  | `emptyTitle`  |
| `multiSelect.loading` | `Loading options`                             | —             |
| `multiSelect.add`     | `Add "{value}"`                               | —             |
| `multiSelect.more`    | `+{count} more`                               | —             |
| `multiSelect.count`   | `{count} option` / `{count} options` (plural) | —             |

- The chip remove names come from `chip.removeNamed`.
- Typed-text matching folds case and accents with the active locale (`toLocaleLowerCase`, NFD).
- `+{count} more` and `{count} options` go through the plural rules and number format of the active locale.

## Responsive

- The trigger fills its container; with `variant="chips"` and `chipLimit` `0` the chips wrap onto several lines and the field grows (`min-h` of the size, never a fixed height).
- Touch: chip remove buttons follow `Chip`'s target; options are 32 px rows.
- Reflow: no horizontal scroll at 320 px and 200 % zoom; a long chip label truncates inside the chip.

## Examples

### Default

```vue
<script setup>
  import MultiSelectContent from '@aziontech/webkit/multi-select-content'
  import MultiSelectItem from '@aziontech/webkit/multi-select-item'
  import MultiSelectRoot from '@aziontech/webkit/multi-select-root'
  import MultiSelectTrigger from '@aziontech/webkit/multi-select-trigger'
  import { ref } from 'vue'

  const value = ref(['opt-1'])
  const options = [
    { value: 'opt-1', label: 'Option 1' },
    { value: 'opt-2', label: 'Option 2' },
    { value: 'opt-3', label: 'Option 3' },
    { value: 'opt-4', label: 'Option 4' }
  ]
</script>

<template>
  <div class="w-full max-w-70">
    <MultiSelectRoot
      aria-label="Options"
      v-model="value"
      placeholder="Select options"
    >
      <MultiSelectTrigger />
      <MultiSelectContent>
        <MultiSelectItem
          v-for="o in options"
          :key="o.value"
          :value="o.value"
          >{{ o.label }}</MultiSelectItem
        >
      </MultiSelectContent>
    </MultiSelectRoot>
  </div>
</template>
```

### Sizes

```vue
<script setup>
  import MultiSelectContent from '@aziontech/webkit/multi-select-content'
  import MultiSelectItem from '@aziontech/webkit/multi-select-item'
  import MultiSelectRoot from '@aziontech/webkit/multi-select-root'
  import MultiSelectTrigger from '@aziontech/webkit/multi-select-trigger'
  import { ref } from 'vue'

  const value = ref([])
  const options = [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' }
  ]
  const sizes = ['small', 'medium', 'large']
</script>

<template>
  <div class="flex w-full max-w-70 flex-col gap-(--spacing-md)">
    <MultiSelectRoot
      :aria-label="`Option, ${s}`"
      v-for="s in sizes"
      :key="s"
      v-model="value"
      :size="s"
      :placeholder="s.charAt(0).toUpperCase() + s.slice(1)"
    >
      <MultiSelectTrigger />
      <MultiSelectContent>
        <MultiSelectItem
          v-for="o in options"
          :key="o.value"
          :value="o.value"
          >{{ o.label }}</MultiSelectItem
        >
      </MultiSelectContent>
    </MultiSelectRoot>
  </div>
</template>
```

### Groups

```vue
<script setup>
  import MultiSelectContent from '@aziontech/webkit/multi-select-content'
  import MultiSelectGroup from '@aziontech/webkit/multi-select-group'
  import MultiSelectItem from '@aziontech/webkit/multi-select-item'
  import MultiSelectRoot from '@aziontech/webkit/multi-select-root'
  import MultiSelectTrigger from '@aziontech/webkit/multi-select-trigger'
  import { ref } from 'vue'

  const value = ref([])
  const groups = [
    {
      label: 'Group A',
      options: [
        { value: 'a-1', label: 'Option 1' },
        { value: 'a-2', label: 'Option 2' }
      ]
    },
    {
      label: 'Group B',
      options: [
        { value: 'b-1', label: 'Option 1' },
        { value: 'b-2', label: 'Option 2' }
      ]
    }
  ]
</script>

<template>
  <div class="w-full max-w-70">
    <MultiSelectRoot
      aria-label="Options"
      v-model="value"
      placeholder="Select options"
    >
      <MultiSelectTrigger />
      <MultiSelectContent>
        <MultiSelectGroup
          v-for="g in groups"
          :key="g.label"
          :label="g.label"
        >
          <MultiSelectItem
            v-for="o in g.options"
            :key="o.value"
            :value="o.value"
            >{{ o.label }}</MultiSelectItem
          >
        </MultiSelectGroup>
      </MultiSelectContent>
    </MultiSelectRoot>
  </div>
</template>
```
