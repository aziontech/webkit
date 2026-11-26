# Subheader

> The heading of one band inside a page: an h2 with a one-line description, a copy-link button that appears when the heading is hovered or focused (when it has an `anchor`), and the band's own actions on the right. Below `md` the actions drop under the copy.

- Import: `import Subheader from '@aziontech/webkit/subheader'`
- Category: layout · Surface: app · Structure: monolithic
- API as JSON: [subheader.json](subheader.json)

## When to use

- Use Subheader for the h2 heading of one band inside a console page; for marketing pages use ModuleHeader, and for a settings band use SettingsGroup.
- A band of a page that holds a card, a table or a list: Payment information on Billing, Get started on a resource, General in a create form.
- A band that someone should be able to link to (`anchor`).

## Do

- Keep the description to one sentence; put longer guidance in the band body.
- Set `anchor` on bands people link to, so the h2 takes the id and the copy-link button appears.
- Keep band actions to one or two outlined medium buttons.
- Help for a band: the `description` first (level A of the in-product help standard). Subheader has no slot on its title line, so it takes no help glyph and never an `Info` link: the page's one `Info` link (`ConsoleLayout.ToolsTrigger`) sits after the h1 in `PageHeader`. A settings band that needs a click-open note uses `SettingsGroup`, whose `hint` renders a `Hint` after its title (level C).

## Don’t

- The page title → use `page-header`.
- A settings band whose guidance sits in a Hint and whose body is a card of setting rows → use `settings-group`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [page-header](page-header.md) — the page's h1.
- [settings-group](settings-group.md) — the settings band with a Hint, a gutter copy-link and an optional disclosure; use it, not this, for a band of `SettingsRow`s.
- [module-header](module-header.md) — the marketing section heading (centred, left or horizontal); use it on site pages, this one in the console.
- [copy-button](copy-button.md) — the copy-link affordance it renders, with the `az az-link` glyph that `settings-group` uses for the same action.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `—` | true | The band title, rendered as an h2. |
| `description` | `string` | `''` | false | One sentence under the title. |
| `size` | `'small' \| 'medium'` | `'medium'` | false | Kept for compatibility: in the console type set (CT-1) both sizes render the title at 14px medium. |
| `anchor` | `string` | `''` | false | Id of the h2 that a hash link targets; when set, a copy-link button appears beside the title on hover or focus. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `description` | — | Rich description content (links, inline code); replaces the `description` prop. |
| `actions` | — | The band's own actions, on the right of the copy. |
| `info` | — | An affordance right after the title and outside the h2, before the copy-link: a help button that opens the page's `HelpPanel`. |

## States

- Visual states: `default`, `hover` / `focus-within` (reveals the copy-link button)
- `data-size` mirrors the `size` prop on the root and the h2
- Responsive: the root is the `@container/subheader`; the actions take the full width under the copy below `@md` of the box and sit beside it from `@md`.
- Hover-free devices: the copy-link stays visible where the primary pointer cannot hover (`@media (hover: none)`), so it is never a hover-only affordance.

## Accessibility

- Visible focus: the copy-link `CopyButton` and the actions carry their own focus ring; focusing the copy-link reveals it.
- Keyboard map: `Tab` reaches the `info` slot's controls, the copy-link button, then the actions; `Enter`/`Space` copies the link.
- ARIA: the `info` slot sits outside the h2, so its button's name never joins the heading's name; name it after the topic (`Help: Domains`).
- ARIA: the copy-link button is named "Copy link to the {title} section" and announces "Link copied".
- Contrast ≥4.5:1 for the title and the description.
- `motion-reduce:transition-none` on the reveal.

## Right-to-left

- Layout: logical utilities only (`px-`, `gap-`, `justify-between`); the `info` slot and the copy-link follow the title on its inline end, and the actions sit at the inline end of the row.
- Icons: the copy glyph does not mirror.
- Keyboard: no horizontal arrow-key logic.
- User data: none.

## Internationalization

| Key                    | English source                     | Override prop |
| ---------------------- | ---------------------------------- | ------------- |
| `subheader.copyLink`   | `Copy link to the {title} section` | —             |
| `subheader.linkCopied` | `Link copied`                      | —             |

- Formatting: none. The `title`, `description` and slots are the consumer's text.

## Responsive

- Container queries: the root is `@container/subheader`; the actions take the full width under the copy below `@md` and sit beside it from `@md`.
- Narrow (≤ 640 px or a narrow container): the title wraps (`text-balance`); the `info` slot stays on the title's line.
- Touch: the copy-link stays visible where the pointer cannot hover (`@media (hover: none)`).
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Examples

### Default

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import Subheader from '@aziontech/webkit/subheader'
</script>

<template>
  <Subheader
    title="Payment information"
    description="Where invoices are sent, and whether the plan renews on its own."
    anchor="payment-information"
  >
    <template #actions>
      <Button
        label="Update"
        variant="outline"
        size="medium"
      />
    </template>
  </Subheader>
</template>
```

### WithActions

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import Subheader from '@aziontech/webkit/subheader'
</script>

<template>
  <Subheader
    title="Payment methods"
    description="Every card on the account. Invoices are charged to the default one."
    anchor="payment-methods"
  >
    <template #actions>
      <Button
        label="Add payment method"
        variant="outline"
        size="medium"
        icon="az az-plus"
      />
    </template>
  </Subheader>
</template>
```

### Sizes

```vue
<script setup>
  import Subheader from '@aziontech/webkit/subheader'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-lg)">
    <Subheader
      title="Delivery Settings"
      description="How the service answers requests at the edge."
    />
    <Subheader
      title="Recent activity"
      size="small"
    />
  </div>
</template>
```
