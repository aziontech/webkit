# Radio Group

> RadioGroup is the one "pick one of a few" component: it picks exactly one value from a short list of labelled options shown at once. The root is a `radiogroup` that owns the value (`v-model`), the shared form `name`, the group `disabled` / `required` / `invalid` state, the layout axis and the option look (`variant`), and hands them to every `RadioGroup.Item` through `provide`/`inject`; each item draws a radio circle beside its label, or, with `variant="card"`, a bordered card with an optional icon, description and trailing tag (Radix and shadcn style card radios the same way). The options are composed as `RadioGroup.Item`s, or passed as data through `options`. Because the items are native radios that share one `name`, the group is a single tab stop and the arrow keys move the selection, as the APG radio group pattern asks, with no wiring by the consumer. Before 6.0 the bare circle was `RadioButton` and the card look was `RadioCards`; both are folded in here.

- Import: `import RadioGroupRoot from '@aziontech/webkit/radio-group-root'`
- Compound import (dot notation, not tree-shakeable): `import RadioGroup from '@aziontech/webkit/radio-group'`
- Category: input · Surface: app · Structure: composition
- API as JSON: [radio-group.json](https://github.com/aziontech/webkit/blob/main/.specs/radio-group.json)

## When to use

- Use RadioGroup to pick exactly one of two to seven options shown at once in a form; set `variant="card"` when each option needs an icon, a description or card weight (plans, roles). For more options use Select; to switch a view or mode in place use ToggleGroup; for the theme in app chrome use ThemeSwitcher.
- A required choice of one option among two to seven, where every option should stay visible (billing cycle, region, notification channel).
- A settings form that posts with a native `form` or `FormData`: the selected value submits under `name`.
- A choice inside a `Field` that needs the group label, description and error wired to it.

## Do

- Name the group: put it in a `Field.Set` with a `Field.Legend`, give the `Field` a `Field.Title`, or set `aria-label` on the root.
- Keep labels short and parallel, and order options by likelihood or by a natural sequence.
- Preselect a sensible option when one exists; leave it empty only when the person must choose deliberately, and then set `required`.
- Use `orientation="horizontal"` only for two or three short options; longer lists read better stacked.
- Set `name` whenever the form posts natively; without it the radios share a generated name that is still submitted.
- Do not compose radios by hand (a `Field.Label` choice card around a bare radio): every radio is a `RadioGroup.Item` inside a `RadioGroup`.
- With `variant="card"`, give options a `description` rather than a longer label, and use the `tag` slot for a price or a "Recommended" tag. Use `orientation="horizontal"` for cards that share a row; they wrap at 12rem.
- Pass `options` when the list is data (a plan catalog, roles from an API); the `option` slot replaces an option's label, for a custom body such as an avatar.

## Don’t

- More than about seven options, or options loaded on demand → use `Select`.
- A single on/off setting → use `Switch` or `Checkbox`.
- Several options that may all be on at once → use `Checkbox` items in a `Field.Set`.
- A compact segmented control that switches a view → use `ToggleGroup`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [toggle-group](toggle-group.md) — a segmented button group for switching views or filters.
- [theme-switcher](theme-switcher.md) — the system / light / dark choice in app chrome.
- [select](select.md) — one value from a longer list.
- [field](field.md) — wraps the group with its title, description and error; `Field.Set` with `Field.Legend` names it natively.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `name` | `string` | `''` | false | Form field name shared by every radio; the selected value submits under it. Empty uses a generated name so the radios still group. |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | false | Layout axis: options stacked, or in a wrapping row. Arrow keys move the selection on both axes either way. |
| `variant` | `'default' \| 'card'` | `'default'` | false | Look of every option: a circle beside its label, or a bordered card for options with an icon, a description or card weight (plans, roles). `RadioGroupVariant`, exported. |
| `options` | `TOption[]` | `[]` | false | Options rendered as `RadioGroup.Item` rows, in place of composed items (`TOption extends RadioGroupOption`: `{ value, label, description?, icon?, ariaLabel?, disabled? }`, exported); extra fields reach the `option` and `tag` slots. Empty renders the default slot. |
| `disabled` | `boolean` | `false` | false | Disables every option and applies the disabled tokens. |
| `required` | `boolean` | `false` | false | Requires a selection: sets `aria-required` on the group and `required` on the radios, so a native form blocks an empty submit. |
| `invalid` | `boolean` | `false` | false | Marks the group invalid: sets `aria-invalid` on the group and on every radio. |
| `modelValue` | `TOption['value'] \| undefined` | `undefined` | false | Two-way value (`v-model`). |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The `RadioGroup.Item`s. Not rendered while `options` is set. |
| `option` | { option: TOption; selected: boolean } | Body of one data-driven option, in place of its label. |
| `tag` | { option: TOption; selected: boolean } | Trailing content of one data-driven option, such as a price or a tag. |

## Sub-component imports

- `@aziontech/webkit/radio-group-item`

## Sub-components

- `radio-group-item/radio-group-item.vue` — one option: a `label` that wraps a native radio and the option text from its default slot. With the default `variant` the radio is drawn as a circle at the inline start; with `variant="card"` the whole label is a bordered card and the native radio covers it, invisible. It reads the group's value, `name`, `variant`, `disabled`, `required` and `invalid` from the injected context, so it takes no `v-model` and no `name` of its own; selecting it writes its `value` to the group. Props: `value: string` (required, no default) — the value written to the group when this option is selected; `disabled?: boolean` (default `false`) — disables this option only; `description?: string` (default `''`) — one-line explanation under the label, also the radio's `aria-describedby`; `icon?: string` (default `''`) — Azion icon class of a glyph before the label; `ariaLabel?: string` (default `''`) — accessible name of the radio when the label alone is ambiguous or is not text. An `aria-labelledby` attribute on the item is forwarded to its radio (it does not land on the `label`), so a radio with no label text can be named by a heading elsewhere, such as a card header; `ariaLabel` wins over it. Slots: `default` — the option label; clicking it selects the option; `tag` — trailing content under the label and description. Test id: `<root testid>__item`, its radio `<root testid>__item__control`, label `__item__label`, description `__item__description`, icon `__item__icon`. It throws when rendered outside a `RadioGroup`. Use RadioGroup.Item only inside RadioGroup; do not compose radios by hand.

Layout:

```
packages/webkit/src/components/input/radio-group/
├── radio-group.vue
├── index.ts
├── injection-key.ts
└── radio-group-item/
    └── radio-group-item.vue
```

`index.ts` attaches the item to the root as `RadioGroup.Item`. Exports: `./radio-group` → `index.ts`, `./radio-group-root` → `radio-group.vue`, `./radio-group-item` → `radio-group-item/radio-group-item.vue`.

## v-model

| Model     | Type                            | Default     | Emits               | Notes                                                                                                                               |
| --------- | ------------------------------- | ----------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `v-model` | `TOption['value'] \| undefined` | `undefined` | `update:modelValue` | Selected value via `defineModel` on the root. Unbound, the group keeps its own selection, starting empty. Emits the item's `value`. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `checked`, `disabled`, `invalid`
- Root: `role="radiogroup"`; `data-orientation` (`vertical` | `horizontal`); `data-variant` (`default` | `card`); `data-disabled`, `data-required` and `data-invalid` mirror the group state (the `Field` state included).
- Item: `data-variant` mirrors the group's; `data-checked` while selected, `data-disabled` while the item or the group is disabled, `data-invalid` while the group is invalid. A card shows `var(--border-selected)` and `var(--primary-selected)` while checked, `var(--bg-hover)` on hover and the focus ring on the card itself.
- The circle: `var(--border-input)` ring on `var(--bg-surface)`, `var(--primary)` when checked with a `var(--primary-foreground)` dot, `var(--danger-border)` when invalid, disabled tokens at 50 % opacity.
- Not states of this component: `loading`, `empty`, `error` (the `Field.Error` carries the message) and `readonly` (a fixed choice is plain text, not a disabled group).

## Accessibility

- Visible focus: `ring-2 ring-(--ring-color) ring-offset-1` on the focused circle, or on the whole card with `variant="card"`.
- Keyboard map (APG radio group, native radios sharing one `name`): `Tab` enters the group on the checked radio, or the first one when none is checked, and the next `Tab` leaves it; `ArrowDown` / `ArrowRight` select the next enabled option and `ArrowUp` / `ArrowLeft` the previous one, wrapping at the ends and skipping disabled options; `Space` selects the focused option.
- ARIA: root `role="radiogroup"` with `aria-labelledby` (the `Field.Title` ids) or the consumer's `aria-label`, `aria-describedby` (the `Field.Description` / `Field.Error` ids), `aria-required` and `aria-invalid`; each option is a native `type="radio"` input named by its wrapping `label`. No `aria-checked` on the native radios: the checked state is native.
- Contrast ≥4.5:1 for the label text, ≥3:1 for the circle, including the disabled state.
- Touch target: the whole label is clickable, and the native input extends to 44 × 44 px on a coarse pointer.

## Right-to-left

- Layout: logical utilities only (`gap-*`, flex rows that follow `dir`); the circle sits at the inline start of each label.
- Icons: none.
- Keyboard: native radios — the browser moves the selection with the arrow keys and follows `dir="rtl"` for `ArrowLeft` / `ArrowRight`.
- User data: labels are slot content; wrap domains or ids in `bdi` at the call site when needed.

## Internationalization

No built-in strings: every visible text comes from the item slots, the `options` labels and descriptions, and the consumer's `aria-label`.

- Formatting: none

## Responsive

- Container queries: none.
- Narrow (≤ 640 px or a narrow container): a horizontal group wraps onto more rows; labels wrap within their option.
- Touch: the label is the target; the input grows to 44 px on `pointer: coarse`.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Examples

### Default

```vue
<script setup>
  import RadioGroup from '@aziontech/webkit/radio-group'
  import { ref } from 'vue'

  const cycle = ref('monthly')
</script>

<template>
  <RadioGroup
    v-model="cycle"
    name="billing-cycle"
    aria-label="Billing cycle"
  >
    <RadioGroup.Item value="monthly">Monthly</RadioGroup.Item>
    <RadioGroup.Item value="yearly">Yearly, two months free</RadioGroup.Item>
    <RadioGroup.Item
      value="contract"
      disabled
    >
      Annual contract
    </RadioGroup.Item>
  </RadioGroup>
</template>
```

### Horizontal

```vue
<script setup>
  import RadioGroup from '@aziontech/webkit/radio-group'
  import { ref } from 'vue'

  const protocol = ref('https')
</script>

<template>
  <RadioGroup
    v-model="protocol"
    name="protocol"
    orientation="horizontal"
    aria-label="Protocol"
  >
    <RadioGroup.Item value="http">HTTP</RadioGroup.Item>
    <RadioGroup.Item value="https">HTTPS</RadioGroup.Item>
    <RadioGroup.Item value="both">Both</RadioGroup.Item>
  </RadioGroup>
</template>
```

### Disabled

```vue
<script setup>
  import RadioGroup from '@aziontech/webkit/radio-group'
  import { ref } from 'vue'

  const plan = ref('pro')
</script>

<template>
  <RadioGroup
    v-model="plan"
    name="plan"
    disabled
    aria-label="Plan"
  >
    <RadioGroup.Item value="free">Free</RadioGroup.Item>
    <RadioGroup.Item value="pro">Pro</RadioGroup.Item>
    <RadioGroup.Item value="enterprise">Enterprise</RadioGroup.Item>
  </RadioGroup>
</template>
```
