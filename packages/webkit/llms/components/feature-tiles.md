# Feature Tiles

> The reasons band of a marketing page: an optional centered section title over a frame grid of media tiles, each an image or an illustration above a short heading and a sentence. It is a page section — the site places it from a `{ _id: 'feature-tiles', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `frame-box`, `card-grid`, `media-tile` and `illustration`. `kind` picks the layout only: `artwork` is four columns with marks on every corner, `illustrated` is three columns with marks on the bottom rule; the tiles keep the same shape in both.

- Import: `import FeatureTiles from '@aziontech/webkit/feature-tiles'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [feature-tiles.json](https://github.com/aziontech/webkit/blob/main/.specs/feature-tiles.json)

## When to use

- To state three or four reasons to buy, each with a picture, under a product or pricing argument.

## Do

- Match the tile count to the kind: four tiles for `artwork`, three for `illustrated`.
- Give a tile either `image` (a URL) or `illustration` (a registry name), not both; `scale` only matters with `illustration`.
- Leave `title` empty to drop the header when the band sits under a hero that already states it; set `anchor` when a link above scrolls to the band.

## Don’t

- For linked use cases → use `use-case-links`.
- For a scroll-driven walkthrough with one screen per feature → use `feature-scroll`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [media-tile](media-tile.md) — the picture-over-copy cell each tile is rendered with.
- [feature-widgets](feature-widgets.md) — the sibling band whose cells carry an action each.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `kind` | `FeatureTilesKind` | `'artwork'` | false | Layout of the grid: `artwork` is four columns with marks on every corner, `illustrated` three columns with marks on the bottom rule. |
| `anchor` | `string` | `''` | false | In-page id set on the band so a `#hash` link can scroll to it. |
| `eyebrow` | `string` | `''` | false | Overline above the section title. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the centered section title as its `h2`; the band renders no header when empty. |
| `description` | `string` | `''` | false | Supporting sentence under the headline. |
| `tiles` | `FeatureTilesTile[]` | `[]` | false | The tiles rendered as frame cells, in order; each is `{ title, description, image?, illustration?, scale? }` where `image` is a picture URL, `illustration` a registry name drawn fluid, and `scale` its media scale. |

## Assets

- Illustrations: every valid name is in [illustrations.md](../foundations/illustrations.md) (MCP `list_assets({ kind: "illustrations" })`). An unknown name renders a "PLACE DESIGN ASSET" placeholder and warns in the console.

## States

- Visual states: `default`
- `data-kind` mirrors the `kind` prop and drives the column count and the frame marks
- Empty: when `tiles` is empty the band renders nothing — not the header, not the frame
- The header renders only when `title` is set

## Accessibility

- Visible focus: nothing in the band is interactive.
- Keyboard map: none.
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the headline is the section title's `h2` and each tile's heading is `media-tile`'s; illustrations are decorative and named by the tile's heading.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `section-title` and `media-tile`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion.
- Touch target ≥40×40 px — not applicable, nothing is interactive.

## Examples

### Default

```vue
<script setup>
  import branches from '@aziontech/webkit/assets/branches.svg'
  import personalTokens from '@aziontech/webkit/assets/personal-tokens.svg'
  import FeatureTiles from '@aziontech/webkit/feature-tiles'
</script>

<template>
  <FeatureTiles
    kind="artwork"
    eyebrow="Why Azion"
    title="From commit to live traffic, on one platform"
    description="Build, ship, and run an application on the same platform that serves it — one place to deploy from, one place to watch it from."
    :tiles="[
      {
        image: branches,
        title: 'Build at AI speed.',
        description:
          'Go from commit to a live URL in minutes. Test on a preview, promote when you are ready, and roll back without a rebuild.'
      },
      {
        image: personalTokens,
        title: 'Secure by default.',
        description:
          'Every workload runs in its own isolated environment, with WAF, rate limits, and leading compliance practices. No configuration required.'
      }
    ]"
  />
</template>
```

### Types

```vue
<script setup>
  import branches from '@aziontech/webkit/assets/branches.svg'
  import personalTokens from '@aziontech/webkit/assets/personal-tokens.svg'
  import FeatureTiles from '@aziontech/webkit/feature-tiles'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <FeatureTiles
      kind="artwork"
      eyebrow="Why Azion"
      title="From commit to live traffic, on one platform"
      description="Build, ship, and run an application on the same platform that serves it — one place to deploy from, one place to watch it from."
      :tiles="[
        {
          image: branches,
          title: 'Build at AI speed.',
          description:
            'Go from commit to a live URL in minutes. Test on a preview, promote when you are ready, and roll back without a rebuild.'
        },
        {
          image: personalTokens,
          title: 'Secure by default.',
          description:
            'Every workload runs in its own isolated environment, with WAF, rate limits, and leading compliance practices. No configuration required.'
        }
      ]"
    />
    <FeatureTiles
      kind="illustrated"
      anchor="why-pricing"
      :tiles="[
        {
          illustration: 'no-idle-no-waste',
          scale: 0.7,
          title: 'No idle. No waste',
          description:
            'Azion bills for actual consumption. You pay for what your applications use, not for infrastructure sitting idle waiting for demand.'
        },
        {
          illustration: 'traffic-and-cost-bar-chart',
          scale: 1,
          title: 'Stay in control',
          description:
            'Scale without losing control of your bill. Track consumption, set spending limits, and keep costs predictable as your applications grow.'
        },
        {
          illustration: 'chat-and-headset-tiles',
          scale: 0.8,
          title: 'White-glove when it matters',
          description:
            'Self-service when you want it, experts when you need them. Azion specialists and partners help you build, migrate, optimize, and scale.'
        }
      ]"
    />
  </div>
</template>
```
