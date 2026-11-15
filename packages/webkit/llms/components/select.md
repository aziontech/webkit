# Select

> Select control for choosing exactly one option from a list; several values are `multi-select`. The trigger field mirrors `Input`'s visual API (size, hover/focus/filled/disabled/invalid/required states) so a Select sits next to a TextInput without visual drift. The dropdown panel is teleported to `body` and anchored to the trigger by the shared `usePlacement` composable — no `@floating-ui` runtime. A selected option shows a trailing check (`pi pi-check`) (the shadcn pattern), optionally a leading slot/icon and a trailing tag. The trigger shows the selected option's label (each option records its text, as Radix `SelectValue` does), not its raw value. Search and "Create new" footer are exposed as slots on `<SelectContent>`. Aligned with Figma frames `3714:10801` (trigger states) and `3899:29361` (options panel).

- Import: `import SelectRoot from '@aziontech/webkit/select-root'`
- Compound import (dot notation, not tree-shakeable): `import Select from '@aziontech/webkit/select'`
- Category: inputs · Surface: product · Structure: composition
- API as JSON: [select.json](https://github.com/aziontech/webkit/blob/main/.specs/select.json)

## When to use

- Use Select to pick exactly one value from a list of more than about seven options. For several values use MultiSelect; when the person may type a value that is not in the list use Combobox; for two to seven options shown at once use RadioGroup.
- One value from a list too long to show inline (regions, runtimes, plans).
- Options grouped under headings, with icons or trailing tags.
- A list that needs a search box or a "Create new" action inside the panel.

## Do

- Render `Select.Trigger` and `Select.Content` inside the root; the parts read the root's context and throw outside it.
- Give each `Select.Option` a stable `value`; pass `displayValue` to control how the trigger renders the selection.
- Type an options list as `SelectOptionItem<string>[]` and render it with `v-for` into `Select.Option` (`:value`, `:icon`, `:disabled`, the `label` as the slot); bind a typed model so `displayValue` and `update:modelValue` take that type with no cast.
- Use `readonly` to show a fixed selection and `disabled` when the field is unavailable; neither opens the panel.
- A switcher inside a line of text, such as the environment that ends a resource's breadcrumb (`Workloads › workload_01 › Production ⌄`), is `kind="transparent"` with `size="small"` and an `aria-label` on `Select.Trigger`: no border or fill until hover, sized to its value. Never put a bordered field in the header, and never restyle the trigger with `!` overrides.
- Keep `kind="transparent"` out of forms: it draws no border, so it cannot show the `invalid` or `required` border; a form field is the default `outlined` inside a `Field`.

## Don’t

- A select with a visible label and helper/error text in a form → put it inside a `field`; the trigger picks up the field's id, description and state.
- The field is always multi-pick → use `multi-select`.
- Two to seven options that fit on screen → use `radio-group` (`kind="card"` for cards).
- The list triggers actions or navigation instead of holding a value → use `dropdown-menu`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [field](field.md) — label, this select, and description/error, with the wiring done.
- [multi-select](multi-select.md) — multi-only variant with checkbox rows and an array model.
- [dropdown-menu](dropdown-menu.md) — action menu that reports the chosen option as an event and holds no form value.
- [input-group](input-group.md) — joins a select to an input, such as currency plus amount.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `defaultOpen` | `boolean` | `false` | false | Initial open state when uncontrolled. |
| `placeholder` | `string` | `''` | false | Trigger placeholder shown when no option is selected. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Size token; affects trigger height (small=28px, medium=32px, large=40px) matching `Input`. |
| `kind` | `'outlined' \| 'transparent'` | `'outlined'` | false | Trigger look: `outlined` is the bordered field; `transparent` has no border or fill until hover, sized to its value, for a switcher inside a line of text such as the environment at the end of a breadcrumb. |
| `disabled` | `boolean` | `false` | false | Disables the trigger and prevents opening; applies disabled tokens. |
| `readonly` | `boolean` | `false` | false | Marks the field read-only; the current selection is visible but the dropdown cannot open. |
| `required` | `boolean` | `false` | false | Marks the field as required; applies the required (warning) border and sets `aria-required` on the trigger, matching `Input`. The label's Required tag is owned by the wrapping form-field, not by this component. |
| `invalid` | `boolean` | `false` | false | Applies the invalid border + ring tokens and sets `aria-invalid` on the trigger. |
| `displayValue` | `(value: TValue) => string` | `undefined` | false | Custom formatter used by the trigger to render the selection; receives the current `modelValue`, typed as the bound model. Unset, the trigger shows the selected options' labels. |
| `name` | `string` | `''` | false | Form field name. Set, the root renders one hidden input per selected value (`String(value)`, objects as JSON) so a native `form` and `FormData` submit the selection; `required` then adds a hidden required proxy that blocks an empty submit, and `disabled` leaves the value out, as a native control does. |
| `modelValue` | `TValue` | `undefined as never` | false | Two-way value (`v-model`). |
| `open` | `boolean` | `undefined as never` | false | Two-way value (`v-model:open`). |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Composition slot; receives `<SelectTrigger>` and `<SelectContent>` (and the option tree inside it). |

## Sub-component imports

- `@aziontech/webkit/select-trigger`
- `@aziontech/webkit/select-content`
- `@aziontech/webkit/select-group`
- `@aziontech/webkit/select-option`

## Sub-components

- `select-trigger/select-trigger.vue` — Bordered trigger field with an optional `#prefix` slot (typed with `defineSlots`), selected-value label, and chevron-down. Mirrors `Input` size/state visuals. The selected value renders inside a `<bdi>`, so its own direction is isolated from the trigger's: an English value on a right-to-left page, or an Arabic value on a left-to-right one, keeps its character order while the label still aligns to the inline start. Prop `valueDir?: 'ltr' | 'rtl' | 'auto'` (default `undefined`, i.e. the `<bdi>` follows the value's first strong character) sets the `<bdi>`'s `dir`; pass `ltr` for values with no strong character whose order matters, such as dial codes (`PhoneInput` passes it, so `+1` never reads `1+`).
- `select-content/select-content.vue` — Popover panel teleported to `body` and anchored with `usePlacement`; exposes `default` (the options), `#search` and `#footer` slots, typed with `defineSlots`, and scrolls its option list when content exceeds `max-h-[320px]`.
- `select-group/select-group.vue` — Section wrapper for a labelled group of options; renders a `text-label-sm` heading in `--text-muted` when `label` is set. Groups never sit flush: `--spacing-sm` above every group but the first — the same rhythm DropdownMenu puts around its group divider and Command puts between two bare groups. No hairline: unlike DropdownMenu, this panel separates groups by space alone.
- `select-option/select-option.vue` — Selectable option row with a trailing check when selected, an optional `icon` (PrimeIcons, default `''`), an optional leading `#left` slot, the option label, and an optional trailing `#tag` slot. **One leading column for the whole list**: as soon as any option in the panel has an `icon` or a `#left` slot, _every_ option reserves the leading box (a fixed `size-4`), so a list mixing iconed and icon-less options keeps a single label edge instead of a ragged one. A panel where no option has either reserves nothing and pays no indent. The reservation is pure CSS — the list carries `group/options`, each option with a glyph carries `data-leading`, and `group-has-[[data-leading]]/options` turns the column on for all of them — so no option registry is needed for the column. Each option records its visible text with the root on mount and update, so the trigger names the selection by label; while a selected value has no recorded label and the panel is closed, the content renders only the selected options (and any group without a `value`) once in a `hidden` container (`<testId>__labels`) to collect them; a 1,000-option list with a preselection mounts within the `select-1k-preselected` budget.
- `select-group/select-group.vue` `label` defaults to `''` (no heading, no `aria-label`).

## v-model

| Model          | Type      | Default     | Emits               | Notes                                                                                                                                                                                                                           |
| -------------- | --------- | ----------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model`      | `TValue`  | `undefined` | `update:modelValue` | The selection via `defineModel`: the one picked value. Its type flows to `displayValue` and `update:modelValue`. Fires when an option is selected. Uncontrolled when unbound. |
| `v-model:open` | `boolean` | `undefined` | `update:open`       | Open state of the dropdown via `defineModel`. Fires when the dropdown opens or closes. Unbound, the dropdown keeps its own state, seeded by `defaultOpen`.                                                                      |

## States

- Visual states: `default`, `hover`, `focus-visible`, `filled`, `disabled`, `invalid`, `required`, `opened`
- `data-state` on the root and trigger: `open` | `closed`
- `data-size` on the trigger mirrors the `size` prop
- `data-kind` on the root, the trigger and the panel mirrors `kind` (`outlined` | `transparent`)
- `kind="transparent"`: the trigger and root size to the value (`w-auto`, capped at the container), no border, no fill, `--spacing-xs` inline padding, `.text-label-md` like a breadcrumb crumb, `--bg-mask` on hover and while open; the panel stops matching the trigger's width and takes at least `--container-3xs`
- `data-disabled`, `data-invalid`, `data-required`, `data-readonly`, `data-filled` mirror the matching props (or the selection state for `data-filled`)
- `data-selected` on `<SelectOption>` when the option's value is part of the current selection
- Long lists: above 300 options the list mounts in chunks of 100 as they scroll near view (unmounted chunks keep their height, 32 px per option), so opening a 1,000-option list stays within its runtime budget. The first arrow, `Home` or `End` key in the list mounts every option before moving focus, so keyboard navigation always reaches every option.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` on trigger and on every option row.
- Keyboard map (trigger): `Tab` focuses; `Space`/`Enter`/`ArrowDown` opens the panel; `Escape` closes it.
- Keyboard map (closed trigger): `Enter`, `Space`, `ArrowDown` and `ArrowUp` open the list (focus lands as described below); `Home` opens it on the first enabled option and `End` on the last; typing a printable character opens it on the first enabled option whose label starts with that character (with a search field, focus goes to the search field instead). Clicking the trigger while the list is open closes it. Tests: `select.test.ts` › Select keyboard and naming (APG select-only combobox).
- Keyboard map (open panel): opening focuses the search field when there is one, else the selected option, else the first enabled option; `ArrowDown`/`ArrowUp` move the active option and wrap; `Home`/`End` jump to first/last; `Enter`/`Space` select, close and return focus to the trigger; typing a printable character moves focus to the next enabled option whose label starts with the typed text (characters typed within 500 ms add up; ignored while the search field has focus); `Escape` closes and returns focus to the trigger; `Tab` closes and moves focus to the control after the trigger; `Shift+Tab` closes and returns focus to the trigger. Tests: `select.test.ts` › keyboard map (spec).
- ARIA: trigger uses `role="combobox"` with `aria-haspopup="listbox"`, `aria-expanded` bound to open state, `aria-controls` pointing to the list. The teleported content is a plain panel holding the optional search field, the list and the optional footer; the list (not the panel) carries `role="listbox"`, so the search field sits outside it, and is named by the root's `aria-label`, else by the root's `aria-labelledby`, else by the enclosing `Field` label, else by the trigger (which always has an `id`). The list uses `role="listbox"` (single-select, no `aria-multiselectable`). Each option uses `role="option"` with `aria-selected` mirroring its selection. Decorative icons (`pi pi-chevron-down`, `pi-heart`, etc.) are `aria-hidden="true"`.
- Nested overlays: the open list joins the shared overlay layer stack (`useOverlayLayer`), so inside a `Popover`, `Dialog` or `Drawer` an option click or `Escape` in the list closes only the list; the host overlay stays open.
- `aria-invalid` and `aria-required` on the trigger mirror the matching props.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons + borders), including disabled state.
- `motion-reduce:transition-none motion-reduce:animate-none` on every transition/animation-bearing class.
- Touch target ≥40×40 px on `size="large"`; smaller sizes are documented as dense-layout-only (consistent with `Input`).
- Teleported content: the teleported `role="listbox"` content binds `dir` and `lang` from the nearest `WebkitProvider` (`usePortalLocale`), so it keeps the provider's direction and language although it renders under `body`. With no provider nothing is set and the document's own `dir` and `lang` apply.

## Examples

### Default

```vue
<script setup>
  import Select from '@aziontech/webkit/select'
  import { ref } from 'vue'

  const value = ref('')
  const options = [
    { value: 'opt-1', label: 'Option 1' },
    { value: 'opt-2', label: 'Option 2' },
    { value: 'opt-3', label: 'Option 3' },
    { value: 'opt-4', label: 'Option 4' }
  ]
</script>

<template>
  <Select
    aria-label="Option"
    v-model="value"
    size="large"
    placeholder="Select an option"
  >
    <Select.Trigger />
    <Select.Content>
      <Select.Option
        v-for="o in options"
        :key="o.value"
        :value="o.value"
        >{{ o.label }}</Select.Option
      >
    </Select.Content>
  </Select>
</template>
```

### Sizes

```vue
<script setup>
  import Select from '@aziontech/webkit/select'
  import { ref } from 'vue'

  const value = ref('')
  const options = [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' }
  ]
  const sizes = ['small', 'medium', 'large']
</script>

<template>
  <div class="flex flex-col gap-4 w-[280px]">
    <Select
      :aria-label="`Option, ${s}`"
      v-for="s in sizes"
      :key="s"
      v-model="value"
      :size="s"
      :placeholder="s.charAt(0).toUpperCase() + s.slice(1)"
    >
      <Select.Trigger />
      <Select.Content>
        <Select.Option
          v-for="o in options"
          :key="o.value"
          :value="o.value"
          >{{ o.label }}</Select.Option
        >
      </Select.Content>
    </Select>
  </div>
</template>
```

### Transparent

```vue
<script setup>
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Select from '@aziontech/webkit/select'
  import { ref } from 'vue'

  const environment = ref('Production')
  const environments = ['Production', 'Staging', 'Preview']
</script>

<template>
  <Breadcrumb>
    <Breadcrumb.List>
      <li class="inline-flex items-center">
        <Breadcrumb.Item
          label="Workloads"
          href="#"
        />
      </li>
      <Breadcrumb.Separator />
      <li class="inline-flex items-center">
        <Breadcrumb.Item
          label="workload_01"
          href="#"
        />
      </li>
      <Breadcrumb.Separator />
      <li class="inline-flex min-w-0 items-center">
        <Select
          v-model="environment"
          kind="transparent"
          size="small"
        >
          <Select.Trigger aria-label="Switch environment" />
          <Select.Content>
            <Select.Group label="Environments">
              <Select.Option
                v-for="name in environments"
                :key="name"
                :value="name"
                >{{ name }}</Select.Option
              >
            </Select.Group>
          </Select.Content>
        </Select>
      </li>
    </Breadcrumb.List>
  </Breadcrumb>
</template>
```
