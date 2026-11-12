# Multi Select

> Select control specialised for choosing many options from a list. The trigger field mirrors `Input`'s visual API (size, hover/focus/filled/disabled/invalid/required states) so a MultiSelect sits next to other form fields without visual drift. The dropdown panel is teleported to `body` and anchored to the trigger by the shared `usePlacement` composable — no `@floating-ui` runtime. Every option row carries a checkbox indicator (the `Checkbox` webkit component), optionally a leading slot/icon and a trailing tag. Search and "Create new" footer are exposed as slots on `<MultiSelectContent>`. Unlike `Select` (which toggles between single and multi via a `multiple` prop), MultiSelect is multi-only: `modelValue` is always an array and the indicator is always a checkbox. Aligned with Figma frame `3899:29362` (options panel). The trigger reuses the `Input`/`Select` trigger visuals.

- Import: `import MultiSelectRoot from '@aziontech/webkit/multi-select-root'`
- Compound import (dot notation, not tree-shakeable): `import MultiSelect from '@aziontech/webkit/multi-select'`
- Category: inputs · Surface: product · Structure: composition
- API as JSON: [multi-select.json](https://github.com/aziontech/webkit/blob/main/.specs/multi-select.json)

## When to use

- Choosing several values from a long list (regions, tags, permissions) in a compact field.
- A filter whose selected values stay editable from the same dropdown.
- Grouped options with icons or trailing tags, optionally with search.

## Do

- modelValue` is always an array; start it as `[]`, never `null`.
- Pass `displayValue` to summarise long selections (e.g. "3 regions") instead of a list that overflows the trigger.
- Keep each option's `value` stable and unique; selection is matched by value.
- Put a search input in the `search` slot and a create action in the `footer` slot of `MultiSelect.Content`.

## Don’t

- Only one value may be chosen → use `select`.
- A labelled form field with helper/error text → put it (or `select` with `multiple`) inside a `field`.
- A handful of options that fit on screen → use a horizontal `field` with a `checkbox` for each.
- The user builds a subset and needs the chosen and remaining items side by side → use `pick-list`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [select](select.md) — single-choice counterpart; also accepts `multiple`.
- [field](field.md) — wraps this control with its label, description and error; it hands the trigger its id and state.
- [pick-list](pick-list.md) — dual-list transfer for building larger subsets.
- [checkbox](checkbox.md) — the indicator every option row renders.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `modelValue` | `unknown[]` | `() => []` | false | Two-way bound selection. Always an array; each item is the `value` of a selected `<MultiSelectOption>`. |
| `open` | `boolean` | `undefined` | false | Controlled open state for the dropdown. Use with `v-model:open`. |
| `defaultOpen` | `boolean` | `false` | false | Initial open state when uncontrolled. |
| `placeholder` | `string` | `''` | false | Trigger placeholder shown when no option is selected. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Size token; affects trigger height (small=28px, medium=32px, large=40px) matching `Input`. |
| `disabled` | `boolean` | `false` | false | Disables the trigger and prevents opening; applies disabled tokens. |
| `readonly` | `boolean` | `false` | false | Marks the field read-only; the current selection is visible but the dropdown cannot open. |
| `required` | `boolean` | `false` | false | Marks the field as required; sets `aria-required` on the trigger. Visual indicator (asterisk) is owned by the wrapping form-field, not by this component. |
| `invalid` | `boolean` | `false` | false | Applies the invalid border + ring tokens and sets `aria-invalid` on the trigger. |
| `displayValue` | `(value: unknown[]) => string` | `undefined` | false | Custom formatter used by the trigger to render the selected labels; receives the current `modelValue` array. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `update:modelValue` | `unknown[]` | Fires when an option is toggled; payload is the next selection array. |
| `update:open` | `boolean` | Fires when the dropdown opens or closes. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Composition slot; receives `<MultiSelectTrigger>` and `<MultiSelectContent>` (and the option tree inside it). |

## Sub-component imports

- `@aziontech/webkit/multi-select-trigger`
- `@aziontech/webkit/multi-select-content`
- `@aziontech/webkit/multi-select-group`
- `@aziontech/webkit/multi-select-option`

## Sub-components

- `multi-select-trigger/multi-select-trigger.vue` — Bordered trigger field with optional left icon slot, selected-value label (comma-joined option labels, or `displayValue`). Each option records its label text with the root when it mounts; on mount `MultiSelectContent` renders its options once inside a `hidden` container so the labels are known before the panel first opens, then drops it, and chevron-down. Mirrors `Input` size/state visuals.
- `multi-select-content/multi-select-content.vue` — Popover panel teleported to `body` and anchored with `usePlacement`; exposes `#search` and `#footer` slots and scrolls its option list when content exceeds `max-h-[320px]`.
- `multi-select-group/multi-select-group.vue` — Section wrapper for a labelled group of options; renders a `text-label-sm` heading in `--text-muted` when `label` is set. Groups never sit flush: `--spacing-sm` above every group but the first — the same rhythm DropdownMenu puts around its group divider and Command puts between two bare groups. No hairline: unlike DropdownMenu, this panel separates groups by space alone.
- `multi-select-option/multi-select-option.vue` — Selectable option row with a checkbox indicator (the `Checkbox` webkit component), an optional `icon` (PrimeIcons), an optional leading `#left` slot, the option label, and an optional trailing `#tag` slot. **One leading column for the whole list**: as soon as any option in the panel has an `icon` or a `#left` slot, _every_ option reserves the leading box (a fixed `size-4`), so a list mixing iconed and icon-less options keeps a single label edge instead of a ragged one. A panel where no option has either reserves nothing and pays no indent. The reservation is pure CSS — the list carries `group/options`, each option with a glyph carries `data-leading`, and `group-has-[[data-leading]]/options` turns the column on for all of them — so no option registry is needed.

## States

- Visual states: `default`, `hover`, `focus-visible`, `filled`, `disabled`, `invalid`, `opened`
- `data-state` on the root and trigger: `open` | `closed`
- `data-size` on the trigger mirrors the `size` prop
- `data-disabled`, `data-invalid`, `data-required`, `data-readonly`, `data-filled` mirror the matching props (or the selection state for `data-filled`)
- `data-selected` on `<MultiSelectOption>` when the option's value is part of the current selection
- Long lists: above 300 options the list mounts in chunks of 100 as they scroll near view (unmounted chunks keep their height, 32 px per option), so opening a 1,000-option list stays within its runtime budget. The first arrow, `Home` or `End` key in the list mounts every option before moving focus, so keyboard navigation always reaches every option.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` on trigger and on every option row.
- Keyboard map (trigger): `Tab` focuses; `Space`/`Enter`/`ArrowDown` opens the panel; `Escape` closes it.
- Keyboard map (open panel): opening focuses the search field when there is one, else the first selected option, else the first enabled option; `ArrowDown`/`ArrowUp` move between enabled options and wrap; `Home`/`End` jump to first/last enabled; `Enter`/`Space` toggles the focused option and keeps the panel open; `Escape` closes and returns focus to the trigger; `Tab` closes and moves focus to the control after the trigger; `Shift+Tab` closes and returns focus to the trigger. Tests: `multi-select.test.ts` › keyboard map (spec).
- ARIA: trigger uses `role="combobox"` with `aria-haspopup="listbox"`, `aria-expanded` bound to open state, `aria-controls` pointing to the content element. Content uses `role="listbox"` with `aria-multiselectable="true"`. Each option uses `role="option"` with `aria-selected` mirroring its selection. Decorative icons (`pi pi-chevron-down`, `pi-heart`, etc.) are `aria-hidden="true"`. The checkbox indicator is decorative for screen readers (the `role="option"` + `aria-selected` carries the semantic); the inner `Checkbox` is `aria-hidden="true"`.
- `aria-invalid` and `aria-required` on the trigger mirror the matching props.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons + borders), including disabled state.
- `motion-reduce:transition-none motion-reduce:animate-none` on every transition/animation-bearing class.
- Touch target ≥40×40 px on `size="large"`; smaller sizes are documented as dense-layout-only (consistent with `Input`).
- Teleported content: the teleported `role="listbox"` content binds `dir` and `lang` from the nearest `WebkitProvider` (`usePortalLocale`), so it keeps the provider's direction and language although it renders under `body`. With no provider nothing is set and the document's own `dir` and `lang` apply.

## Examples

### Default

```vue
<script setup>
  import MultiSelectContent from '@aziontech/webkit/multi-select-content'
  import MultiSelectOption from '@aziontech/webkit/multi-select-option'
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
  <div style="width: 280px">
    <MultiSelectRoot
      aria-label="Options"
      v-model="value"
      placeholder="Select options"
    >
      <MultiSelectTrigger />
      <MultiSelectContent>
        <MultiSelectOption
          v-for="o in options"
          :key="o.value"
          :value="o.value"
          >{{ o.label }}</MultiSelectOption
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
  import MultiSelectOption from '@aziontech/webkit/multi-select-option'
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
  <div
    class="flex flex-col gap-4"
    style="width: 280px"
  >
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
        <MultiSelectOption
          v-for="o in options"
          :key="o.value"
          :value="o.value"
          >{{ o.label }}</MultiSelectOption
        >
      </MultiSelectContent>
    </MultiSelectRoot>
  </div>
</template>
```

### WithGroups

```vue
<script setup>
  import MultiSelectContent from '@aziontech/webkit/multi-select-content'
  import MultiSelectGroup from '@aziontech/webkit/multi-select-group'
  import MultiSelectOption from '@aziontech/webkit/multi-select-option'
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
  <div style="width: 280px">
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
          <MultiSelectOption
            v-for="o in g.options"
            :key="o.value"
            :value="o.value"
            >{{ o.label }}</MultiSelectOption
          >
        </MultiSelectGroup>
      </MultiSelectContent>
    </MultiSelectRoot>
  </div>
</template>
```
