# Logo

> A third-party mark (a client, a competitor, an analyst firm, a standard or certification, a coding agent) drawn right on both themes. The asset registries already hold the files (`@aziontech/webkit/assets/client-registry`, `@aziontech/webkit/assets/competitor-registry` and the `@aziontech/webkit/assets/<file>.svg` exports); every surface that drew one repeated the same theme rule by hand (two `img` tags revealed per `[data-theme]`, a `brightness-0` silhouette, a CSS mask in `currentColor`) and none had every route. `Logo` holds the rule once: a light/dark pair of files, or one file inverted on the theme where it would vanish, or one ink (the theme's black or white, the surrounding `currentColor`, or black pinned for a coloured fill), and the company's name as a typographic wordmark when there is no file yet. It replaces the design sample's `AgentMark` and `ClientMark`. It is a renderer: it takes the file URLs from a registry entry and imports no registry itself, so a page pays only for the marks it shows.

- Import: `import Logo from '@aziontech/webkit/logo'`
- Category: content · Surface: app · Structure: monolithic
- API as JSON: [logo.json](https://github.com/aziontech/webkit/blob/main/.specs/logo.json)

## When to use

- Use Logo for any other company's mark (client, competitor, agent, certification).
- A logo wall, a trust strip, a client story card, a quote attribution, a comparison column head: any place that shows another company's mark.
- The coding agents a prompt works with (Claude, Codex, Gemini, Cursor), drawn in the ink of the surface they sit on.
- A list of standards or analyst firms (SOC, PCI DSS, Gartner, Forrester).

## Do

- Pass a registry entry as it stands: `name`, `src` from `logo`, `src-light` from `logoLight`, `artwork` from `artwork`. The registry knows which theme each file is drawn for.
- Set the height with `size`: `small` (16 px) beside a label or in a table cell, `medium` (24 px, the default) in a card or a list, `large` (32 px) in a logo wall or a quote attribution. The width follows each file's own aspect ratio. Cap wide wordmarks with `max-w-*`.
- In a list of many clients, use `variant="monochrome"`: per-brand colour reads as noise next to twenty others.
- On a coloured fill (white, `--primary`), use `variant="knockout"`: a fill does not follow the theme, so the ink must not either.
- On a surface that is dark in both themes, or among drawn diagram parts, use `variant="current"` so the mark takes the surface's own ink.
- When the text beside the mark already names the company, set `decorative`.

## Don’t

- The Azion logo → use `Brand`.
- A card network beside a payment method → use `PaymentBrand`.
- A person or an account → use `Avatar`.
- A product icon or a UI glyph → use an icon from `@aziontech/icons`.
- A grid of client marks → use `LogoWall`; it renders each mark and can render `Logo` in its `mark` slot.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [brand](brand.md) — the Azion lockup; `Logo` is everyone else's.
- [payment-brand](payment-brand.md) — card-network plates, drawn in tokens.
- [logo-wall](logo-wall.md) — the grid that lays marks out; `Logo` draws one mark.
- [avatar](avatar.md) — a person's or an organization's picture with initials.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `name` | `string` | `—` | true | The company or product the mark belongs to; the accessible name, and the typographic wordmark drawn when no file is set. |
| `src` | `string` | `''` | false | URL of the mark; on its own it serves both themes, and with `srcLight` it is the dark-theme file. Empty draws the wordmark. |
| `srcLight` | `string` | `''` | false | URL of the light-theme file; with `src` both files render and the theme reveals one. |
| `artwork` | `'color' \| 'light' \| 'dark'` | `'color'` | false | The ink a single file is drawn in: `light` art (for dark surfaces) is inverted on the light theme, `dark` art is inverted on the dark theme, `color` is kept as is. Ignored when `srcLight` is set or `variant` is not `color`. |
| `variant` | `'color' \| 'monochrome' \| 'current' \| 'knockout'` | `'color'` | false | Ink: `color` keeps the vendor's colours, `monochrome` paints one silhouette black on light and white on dark, `current` paints it in the surrounding text colour, `knockout` pins it black for a mark on a coloured fill. |
| `ariaLabel` | `string` | `''` | false | Accessible name when it should differ from `name`. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Height of the mark: `small` 16 px, `medium` 24 px, `large` 32 px; the width follows the file's aspect ratio. |
| `decorative` | `boolean` | `false` | false | Hides the mark from assistive technology when the text beside it already names the company. |

## States

- `data-variant` on the root: `color` | `monochrome` | `current` | `knockout`.
- `data-route` on the root: `pair` (both files in the DOM, the theme reveals one), `single` (one file, filtered by `artwork` or the ink of `variant`), `wordmark` (no file: the name in type).
- `data-artwork` on the root mirrors `artwork`.
- `data-size` on the root mirrors `size`: `small` is `h-4`, `medium` is `h-6`, `large` is `h-8`.
- `data-sized` on the root when the caller's class sets a height (`h-*` or `size-*`, with or without a breakpoint); it then wins over `size`.
- Not applicable: `loading`, `empty`, `error`, `disabled`, `readonly`, `invalid`, `open`/`closed` (a static mark).

## Accessibility

- Pattern: an image (`role="img"` on the root) named by `ariaLabel`, else `name`. The files inside have empty `alt` and are `aria-hidden`, so a light/dark pair is announced once.
- With `decorative` the root is `aria-hidden="true"` and has no role.
- Not focusable; no keyboard map (a static mark).
- Contrast: marks are logos (WCAG 1.4.3 exempts logotypes); the `monochrome` route makes a mark pure black or white against the page, and `knockout` pure black on a light fill.
- Forced colors: the `current` route paints `currentColor`, so it follows `CanvasText`.
- No motion.

## Right-to-left

- Layout: one inline element; no physical spacing.
- Icons: logos are never mirrored.
- Keyboard: none.
- User data: the wordmark is the company name, wrapped in `dir="auto"` so a name in another script keeps its own direction.

## Internationalization

No built-in strings: the accessible name and the wordmark are the `name` the consumer passes (a trademark, not translated).

- Formatting: none.

## Responsive

- Container queries: none; `size` sets the height and the caller sets the width cap (`max-w-*`).
- Narrow: the files keep their aspect ratio inside the cap (`object-contain`); the wordmark does not wrap.
- Touch: not interactive.
- Reflow: no horizontal scroll at 320 px when the caller caps the width.

## Examples

### Default

```vue
<script setup>
  import { CLIENTS } from '@aziontech/webkit/assets/client-registry'
  import Logo from '@aziontech/webkit/logo'

  const client = CLIENTS.find((entry) => entry.name === 'Agibank')
</script>

<template>
  <Logo
    :name="client.name"
    :src="client.logo"
    :src-light="client.logoLight"
    :artwork="client.artwork"
    size="large"
    class="max-w-40"
  />
</template>
```

### Sizes

```vue
<script setup>
  import { CLIENTS } from '@aziontech/webkit/assets/client-registry'
  import Logo from '@aziontech/webkit/logo'

  const client = CLIENTS.find((entry) => entry.name === 'Agibank')
  const sizes = ['small', 'medium', 'large']
</script>

<template>
  <div class="flex flex-col gap-(--spacing-md)">
    <div
      v-for="size in sizes"
      :key="size"
      class="flex flex-wrap items-center gap-(--spacing-xl)"
    >
      <span class="w-20 text-label-md text-(--text-muted)">{{ size }}</span>
      <Logo
        :name="client.name"
        :src="client.logo"
        :src-light="client.logoLight"
        :artwork="client.artwork"
        :size="size"
        class="max-w-40"
      />
      <Logo
        name="Acme Inc."
        :size="size"
      />
    </div>
  </div>
</template>
```

### Variants

```vue
<script setup>
  import claudeSymbol from '@aziontech/webkit/assets/claude-symbol-color.svg'
  import itauExtendedReversed from '@aziontech/webkit/assets/itau-extended-reversed.webp'
  import netshoesExtendedColor from '@aziontech/webkit/assets/netshoes-extended-color.svg'
  import netshoesExtendedReversed from '@aziontech/webkit/assets/netshoes-extended-reversed.svg'
  import Logo from '@aziontech/webkit/logo'

  const variants = [
    { variant: 'color', label: 'Color', fill: 'bg-(--bg-canvas)', ink: 'text-(--text-muted)' },
    {
      variant: 'monochrome',
      label: 'Monochrome',
      fill: 'bg-(--bg-canvas)',
      ink: 'text-(--text-muted)'
    },
    {
      variant: 'current',
      label: 'Current',
      fill: 'bg-(--bg-canvas) text-(--text-muted)',
      ink: 'text-(--text-muted)'
    },
    {
      variant: 'knockout',
      label: 'Knockout',
      fill: 'bg-(--color-base-white)',
      ink: 'text-(--color-base-black)'
    }
  ]
</script>

<template>
  <div class="flex flex-col gap-(--spacing-md)">
    <div
      v-for="row in variants"
      :key="row.variant"
      class="flex flex-wrap items-center gap-(--spacing-xl) rounded-(--shape-card) border border-(--border-default) p-(--spacing-md)"
      :class="row.fill"
    >
      <span
        class="w-28 text-label-md"
        :class="row.ink"
        >{{ row.label }}</span
      >
      <Logo
        name="Netshoes"
        :src="netshoesExtendedReversed"
        :src-light="netshoesExtendedColor"
        :variant="row.variant"
        class="max-w-32"
      />
      <Logo
        name="Itaú"
        :src="itauExtendedReversed"
        artwork="light"
        :variant="row.variant"
        class="max-w-32"
      />
      <Logo
        name="Claude"
        :src="claudeSymbol"
        :variant="row.variant"
      />
      <Logo
        name="Acme Inc."
        :variant="row.variant"
      />
    </div>
  </div>
</template>
```
