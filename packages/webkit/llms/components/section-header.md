# Section Header

> The heading of one band inside a page: an h2 with a one-line description, a copy-link button that appears when the heading is hovered or focused (when it has an `anchor`), and the band's own actions on the right. Below `md` the actions drop under the copy.

- Import: `import SectionHeader from '@aziontech/webkit/section-header'`
- Category: layout · Surface: product · Structure: monolithic
- API as JSON: [section-header.json](https://github.com/aziontech/webkit/blob/main/.specs/section-header.json)

## When to use

- A band of a page that holds a card, a table or a list: Payment information on Billing, Get started on a resource, General in a create form.
- A band that someone should be able to link to (`anchor`).

## Do

- Keep the description to one sentence; put longer guidance in the band body.
- Set `anchor` on bands people link to, so the h2 takes the id and the copy-link button appears.
- Keep band actions to one or two outlined medium buttons.

## Don’t

- The page title → use `page-header`.
- A settings band whose guidance sits in a Hint and whose body is a card of setting rows → use `settings-section`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [page-header](page-header.md) — the page's h1.
- [settings-section](settings-section.md) — the settings band with a Hint, a gutter copy-link and an optional disclosure.
- [copy-button](copy-button.md) — the copy-link affordance it renders.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `—` | true | The band title, rendered as an h2. |
| `description` | `string` | `''` | false | One sentence under the title. |
| `size` | `'small' \| 'medium'` | `'medium'` | false | Heading scale of the title (subset: no `large`). |
| `anchor` | `string` | `''` | false | Id of the h2 that a hash link targets; when set, a copy-link button appears beside the title on hover or focus. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `description` | — | Rich description content (links, inline code); replaces the `description` prop. |
| `actions` | — | The band's own actions, on the right of the copy. |

## States

- Visual states: `default`, `hover` / `focus-within` (reveals the copy-link button)
- `data-size` mirrors the `size` prop on the root and the h2
- Responsive: the root is the `@container/section-header`; the actions take the full width under the copy below `@md` of the box and sit beside it from `@md`.
- Hover-free devices: the copy-link stays visible where the primary pointer cannot hover (`@media (hover: none)`), so it is never a hover-only affordance.

## Accessibility

- Visible focus: the copy-link `CopyButton` and the actions carry their own focus ring; focusing the copy-link reveals it.
- Keyboard map: `Tab` reaches the copy-link button, then the actions; `Enter`/`Space` copies the link.
- ARIA: the copy-link button is named "Copy link to the {title} section" and announces "Link copied".
- Contrast ≥4.5:1 for the title and the description.
- `motion-reduce:transition-none` on the reveal.

## Examples

### Default

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import SectionHeader from '@aziontech/webkit/section-header'
</script>

<template>
  <SectionHeader
    title="Payment information"
    description="Where invoices are sent, and whether the plan renews on its own."
    anchor="payment-information"
  >
    <template #actions>
      <Button
        label="Update"
        kind="outlined"
        size="medium"
      />
    </template>
  </SectionHeader>
</template>
```

### WithActions

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import SectionHeader from '@aziontech/webkit/section-header'
</script>

<template>
  <SectionHeader
    title="Payment methods"
    description="Every card on the account. Invoices are charged to the default one."
    anchor="payment-methods"
  >
    <template #actions>
      <Button
        label="Add payment method"
        kind="outlined"
        size="medium"
        icon="pi pi-plus"
      />
    </template>
  </SectionHeader>
</template>
```

### Sizes

```vue
<script setup>
  import SectionHeader from '@aziontech/webkit/section-header'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-lg)">
    <SectionHeader
      title="Delivery Settings"
      description="How the service answers requests at the edge."
    />
    <SectionHeader
      title="Recent activity"
      size="small"
    />
  </div>
</template>
```
