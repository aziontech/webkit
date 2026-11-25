# Brand

> The Azion brand logo, rendered as an inline SVG lockup. A single `variant` prop selects the lockup: `default` (the AZION wordmark) for standard surfaces, `reduced` (the "A" glyph) for compact headers and tight spaces, and `extended` (the AZION wordmark over "technologies") for marketing-oriented layouts. It is the one public way to draw the Azion mark: the drawings live inside the package and are not exported on their own. The lockups that carry the "Move to the Edge" tagline were retired in 6.0.

- Import: `import Brand from '@aziontech/webkit/brand'`
- Category: content · Surface: app · Structure: monolithic
- API as JSON: [brand.json](brand.json)

## When to use

- Use Brand only for the Azion logo.
- The Azion logo in a header, navigation bar, footer, sign-in screen or product mockup.
- `variant="reduced"` where space is tight (collapsed sidebar, mobile header).
- `variant="extended"` in marketing layouts that show "AZION technologies".
- `treatment="monochrome"` where the orange mark cannot be used (a one-colour print, a document, a partner page that asks for a black or white logo); `treatment="knockout"` on an orange `--primary` fill.

## Do

- Choose the lockup with `variant` and the height with `size` (16 / 24 / 32 px); do not pass width or height classes, the width follows the lockup's aspect ratio.
- Do not recolor or rebuild the SVG; use the component so every surface shows the same mark. The colour comes from `treatment`, never from a class.
- For a home link, wrap Brand in an anchor; its `role="img"` and accessible name "Azion" give the link its name.
- Take the logo only from Brand, never from a copied SVG file or a website URL.
- Keep clear contrast between the logo and its background, and clear space around it; never shrink it below the `small` size.
- Do not set the logo next to text or interface elements in the brand primary colour: the signature lockup already carries it.
- The `color` treatment works on light and dark surfaces: the orange mark stays, and the "technologies" line of the extended lockup follows the text colour (dark on a white background, light on a dark one).
- One-colour versions come from `treatment`: `monochrome` is black on light and white on dark, `knockout` is the label colour of an orange `--primary` fill. Never recolour a copy of the drawing.

## Don’t

- A customer, partner or competitor logo → use `third-party-logo` (one mark) or `logo-wall` (a grid of them).
- A person's or organization's picture → use `avatar`.
- A decorative product graphic → use `illustration`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [site-header-section](site-header-section.md) and `site-footer-section` — compose Brand for the site chrome.
- [avatar](avatar.md) — the picture or initials of a user, not the product mark.
- [third-party-logo](third-party-logo.md) — another company's mark; `Brand` is only Azion's own.
- [logo-wall](logo-wall.md) — a grid of other companies' marks.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `variant` | `'default' \| 'reduced' \| 'extended'` | `'default'` | false | Brand lockup to render: `default` (AZION wordmark), `reduced` (the "A" glyph for tight spaces), `extended` (wordmark over "technologies"). |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Size token; sets the lockup height (16 / 24 / 32 px) while width scales automatically so each `variant` keeps its own aspect ratio. |
| `decorative` | `boolean` | `false` | false | Hides the mark from assistive tech when visible text beside it already says Azion. |
| `treatment` | `'color' \| 'monochrome' \| 'knockout'` | `'color'` | false | How the mark is inked: `color` keeps the orange mark, `monochrome` paints it in one colour (black on light, white on dark), `knockout` paints it in the label colour of an orange fill. |

## States

- Visual states: `default`
- `data-variant` mirrors the `variant` prop
- `data-size` mirrors the `size` prop
- `data-treatment` mirrors the `treatment` prop

## Accessibility

- The root carries `role="img"` and a default `aria-label` (`Azion`) so the logo has an accessible name; consumers may override the label via a passed `aria-label`. With `decorative` the root drops `role` and the name and is `aria-hidden`, for a mark next to visible Azion text (the same option `ThirdPartyLogo` has; `Brand` is the Azion house mark, `ThirdPartyLogo` any other company's mark).
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
  <Brand variant="default" />
</template>
```

### Variants

```vue
<script setup>
  import Brand from '@aziontech/webkit/brand'
</script>

<template>
  <div class="flex flex-wrap items-center gap-8">
    <Brand variant="default" />
    <Brand variant="reduced" />
    <Brand variant="extended" />
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
      variant="default"
      size="small"
    />
    <Brand
      variant="default"
      size="medium"
    />
    <Brand
      variant="default"
      size="large"
    />
  </div>
</template>
```
