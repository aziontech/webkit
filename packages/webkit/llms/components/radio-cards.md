# Radio Cards

> Horizontal grid of selectable cards for mutually exclusive choices (plans, roles, feature tiers). Each option shows label, optional icon and description, with optional trailing content via the `tag` slot. Migrated from the legacy `radio-cards` core component into the webkit inputs layer.

- Import: `import RadioCards from '@aziontech/webkit/radio-cards'`
- Category: inputs · Surface: product · Structure: monolithic
- API as JSON: [radio-cards.json](https://github.com/aziontech/webkit/blob/main/.specs/radio-cards.json)

## When to use

- One choice among a few options where each option needs a label plus an optional icon or one-line description: usage intent, role, plan tier.
- Options laid out side by side as cards that wrap onto new rows, bound to one `v-model` value for the whole group.
- A card needs small trailing content under its text, such as a price or a "Recommended" tag, through the `tag` slot.

## Do

- Give every item a unique `value`; it is both the `v-model` payload and the render key.
- Name the group by passing `aria-labelledby` or `aria-label` on the component: it renders a `role="radiogroup"` with no visible label of its own. Set an item's `ariaLabel` when its `label` alone is ambiguous.
- disabled` applies to the whole group; there is no per-item disabled state, so leave unavailable options out of `items`.
- Use the `tag` slot for trailing content. The `default` slot replaces the whole card body (icon, label, description and `tag`), so use it only when the card needs a different layout.
- Arrow keys move and select in one step, as in any radio group, so `update:modelValue` fires while a keyboard user browses. Don't trigger navigation or requests on every change.

## Don’t

- You place each card-style radio by hand, or the choice must submit through a native form `name` → use `field` choice cards (`Field.Label` wrapping a horizontal `Field` with a `radio-button`).
- The options don't need card weight and read fine as inline rows → use horizontal `field`s with a `radio-button`.
- There are more options than fit in a row or two, or the choice sits in a compact form → use `select` inside a `field`.
- More than one option can be picked → use `field` choice cards with a `checkbox`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [field](field.md) — a `Field.Label` choice card is a single card-style radio (or checkbox) with title and description; compose several by hand with a shared `name`, or use a horizontal `Field` for an inline labelled row.
- [select](select.md) — dropdown for long option lists.
- onboarding-form` — uses this component for its usage-intent question.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `modelValue` | `string \| number \| undefined` | `undefined` | false | Currently selected item value (v-model). |
| `items` | `RadioCardsItem[]` | `undefined` | true | Options rendered as selectable cards; each entry must include `value` and `label`. |
| `disabled` | `boolean` | `false` | false | Disables all options and applies disabled tokens. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `update:modelValue` | `string \| number` | v-model when the user selects an option. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | { item: RadioCardsItem; selected: boolean } | Overrides the entire card body for an option. |
| `tag` | { item: RadioCardsItem; selected: boolean } | Trailing content below label/description (e.g. plan badge). |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`, `selected`
- `data-disabled` mirrors the `disabled` prop on root and each option
- `data-selected` mirrors whether `modelValue === item.value`
- Reflow: each option is capped at the width of the group (`max-w-full`) so long descriptions and tags wrap inside a narrow box.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` on each option.
- Keyboard map: `Tab` / arrow keys move focus between options; `Enter` / `Space` selects the focused option.
- ARIA: root `role="radiogroup"`; each option `role="radio"` with `aria-checked` and `aria-label` from `item.ariaLabel` or `item.label`. The `aria-label` replaces the option's text, so an item with a `description` also points `aria-describedby` at the rendered description, which would otherwise never be announced.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none` on color transitions.
- Touch target ≥40×40 px via card padding.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: none mirror.
- Keyboard: in a horizontal row `ArrowRight`/`ArrowLeft` move to the next/previous card, swapped under `dir="rtl"` (`logicalArrowKey`); `ArrowDown`/`ArrowUp` are unchanged.
- User data: none.

## Examples

### Default

```vue
<script setup>
  import RadioCards from '@aziontech/webkit/radio-cards'
  import { ref } from 'vue'

  const items = [
    {
      value: 'option1',
      icon: 'pi pi-check',
      label: 'Option One',
      description: 'First option description'
    },
    {
      value: 'option2',
      icon: 'pi pi-times',
      label: 'Option Two',
      description: 'Second option description'
    },
    {
      value: 'option3',
      icon: 'pi pi-star',
      label: 'Option Three',
      description: 'Third option description'
    }
  ]
  const selected = ref('option1')
</script>

<template>
  <RadioCards
    v-model="selected"
    :items="items"
  />
</template>
```

### Disabled

```vue
<script setup>
  import RadioCards from '@aziontech/webkit/radio-cards'
  import { ref } from 'vue'

  const items = [
    {
      value: 'option1',
      icon: 'pi pi-check',
      label: 'Option One',
      description: 'First option description'
    },
    {
      value: 'option2',
      icon: 'pi pi-times',
      label: 'Option Two',
      description: 'Second option description'
    },
    {
      value: 'option3',
      icon: 'pi pi-star',
      label: 'Option Three',
      description: 'Third option description'
    }
  ]
  const selected = ref('option1')
</script>

<template>
  <RadioCards
    v-model="selected"
    :items="items"
    disabled
  />
</template>
```

### WithTag

```vue
<script setup>
  import RadioCards from '@aziontech/webkit/radio-cards'
  import Tag from '@aziontech/webkit/tag'
  import { ref } from 'vue'

  const items = [
    {
      value: 'hobby',
      icon: 'pi pi-sparkles',
      label: 'Hobby',
      description: 'For learning and small personal projects.',
      ariaLabel: 'Hobby plan',
      tag: 'Hobby Plan'
    },
    {
      value: 'pro',
      icon: 'pi pi-chart-line',
      label: 'Pro',
      description: 'For professional or commercial applications.',
      ariaLabel: 'Pro plan',
      tag: 'Pro Plan'
    },
    {
      value: 'scale',
      icon: 'pi pi-file-check',
      label: 'Scale',
      description: 'For businesses requiring advanced security and compliance.',
      ariaLabel: 'Scale plan',
      tag: 'Scale Plan'
    }
  ]
  const selected = ref('hobby')
</script>

<template>
  <RadioCards
    v-model="selected"
    :items="items"
  >
    <template #tag="{ item }">
      <Tag
        :label="item.tag"
        severity="info"
      />
    </template>
  </RadioCards>
</template>
```
