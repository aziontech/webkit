# Doc Cta

> The closing offer of a documentation page, parked at the foot of the "On this page" rail after the outline. It is a docs card built like every other card on the page: a `FrameBox` with corner marks, a flat `--bg-surface` face, the wordmark at the headline size, a headline, a subtitle and full-width stacked actions. Set on the rail scale (14 px headline, 12 px copy) so it never out-shouts the page outline. Every string is content passed by the page.

- Import: `import DocCta from '@aziontech/webkit/doc-cta'`
- Category: documentation · Surface: docs · Structure: monolithic
- API as JSON: [doc-cta.json](https://github.com/aziontech/webkit/blob/main/.specs/doc-cta.json)

## When to use

- Once per documentation page, last in the right rail.

## Do

- One primary action; a secondary only when it is a real alternative (talk to sales).
- A one-line headline and a one-line subtitle.

## Don’t

- In the prose column — use `CallToAction` on marketing pages or a `DocCard` link in docs.
- More than once per page.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- DocOnThisPage` — the rail it closes.
- FrameBox` — the frame.
- CallToAction` — the marketing closing band.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `''` | false | The offer's headline; names the complementary landmark. |
| `label` | `string` | `''` | false | Fallback copy when the default slot is empty. |
| `primaryLabel` | `string` | `''` | false | The primary action's label; empty renders no primary action. |
| `primaryHref` | `string` | `''` | false | Where the primary action goes. |
| `secondaryLabel` | `string` | `''` | false | The secondary action's label; empty renders no secondary action. |
| `secondaryHref` | `string` | `''` | false | Where the secondary action goes. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The offer's copy, set as the headline's subtitle. |

## States

- Visual states: `default`.

## Accessibility

- `role="complementary"` named by the visible headline (`aria-labelledby`).
- The wordmark is the `Brand` image with its own accessible name.
- Buttons come from `Button` with visible focus.

## Right-to-left

- Layout: logical utilities only.
- Icons: none.
- Keyboard: unchanged.

## Internationalization

- Built-in strings: none. Every visible string is content and arrives through props or slots, so the page supplies it in its own language.

## Responsive

- Fills the rail (about 225 px); actions stack full width.

## Examples

### Default

```vue
<script setup>
  import DocCta from '@aziontech/webkit/doc-cta'
</script>

<template>
  <div class="max-w-56">
    <DocCta
      title="Ready to build?"
      primary-label="Start for free"
      primary-href="/signup"
    >
      Deploy your first application in minutes.
    </DocCta>
  </div>
</template>
```

### Two actions

```vue
<script setup>
  import DocCta from '@aziontech/webkit/doc-cta'
</script>

<template>
  <div class="max-w-56">
    <DocCta
      title="Running at scale?"
      primary-label="Start for free"
      primary-href="/signup"
      secondary-label="Talk to sales"
      secondary-href="/contact"
    >
      Plans with support and volume pricing.
    </DocCta>
  </div>
</template>
```
