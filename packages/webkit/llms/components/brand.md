# Brand

> The Azion brand logo, rendered as an inline SVG lockup. A single `kind` prop selects the lockup: `default` (the AZION wordmark) for standard surfaces, `reduced` (the "A" glyph) for compact headers and tight spaces, and `extended` (the AZION wordmark with the "move to the edge technologies®" tagline) for marketing-oriented layouts. It consolidates the loose `@aziontech/webkit/svg/azion/*` assets — which remain individually importable — behind one component.

- Import: `import Brand from '@aziontech/webkit/brand'`
- Category: content · Surface: product · Structure: monolithic
- API as JSON: [brand.json](https://github.com/aziontech/webkit/blob/main/.specs/brand.json)

## When to use

- The Azion logo in a header, navigation bar, footer, sign-in screen or product mockup.
- kind="reduced"` where space is tight (collapsed sidebar, mobile header).
- kind="extended"` in marketing layouts that carry the tagline.

## Do

- Choose the lockup with `kind` and the height with `size` (16 / 24 / 32 px); do not pass width or height classes, the width follows the lockup's aspect ratio.
- Do not recolor or rebuild the SVG; use the component so every surface shows the same mark.
- For a home link, wrap Brand in an anchor; its `role="img"` and accessible name "Azion" give the link its name.

## Don’t

- A customer or partner logo → use `logo-wall`.
- A person's or organization's picture → use `avatar`.
- A decorative product graphic → use `illustration`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [site-nav](site-nav.md) and `site-footer` — compose Brand for the site chrome.
- [avatar](avatar.md) — the picture or initials of a user, not the product mark.
- [logo-wall](logo-wall.md) — third-party company marks.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `kind` | `'default' \| 'reduced' \| 'extended'` | `'default'` | false | Brand lockup to render: `default` (AZION wordmark), `reduced` (the "A" glyph for tight spaces), `extended` (wordmark with the "move to the edge technologies®" tagline). |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Size token; sets the lockup height (16 / 24 / 32 px) while width scales automatically so each `kind` keeps its own aspect ratio. |

## States

- Visual states: `default`
- `data-kind` mirrors the `kind` prop
- `data-size` mirrors the `size` prop

## Accessibility

- The root carries `role="img"` and a default `aria-label` (`Azion`) so the logo has an accessible name; consumers may override the label via a passed `aria-label`.
- Non-interactive: the logo is not focusable and emits no events; the inner SVG is presentational.
- Contrast ≥3:1 for the brand mark against its background (large graphic).
- `motion-reduce` not applicable — the component is static.

## Examples

### Default

```vue
<script setup>
  import Brand from '@aziontech/webkit/brand'
</script>

<template>
  <Brand kind="default" />
</template>
```

### Types

```vue
<script setup>
  import Brand from '@aziontech/webkit/brand'
</script>

<template>
  <div class="flex flex-wrap items-center gap-8">
    <Brand kind="default" />
    <Brand kind="reduced" />
    <Brand kind="extended" />
  </div>
</template>
```

### Sizes

```vue
<script setup>
  import Brand from '@aziontech/webkit/brand'
</script>

<template>
  <div class="flex flex-wrap items-center gap-8">
    <Brand
      kind="default"
      size="small"
    />
    <Brand
      kind="default"
      size="medium"
    />
    <Brand
      kind="default"
      size="large"
    />
  </div>
</template>
```
