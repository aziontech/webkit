# Ticker

> An endlessly looping row of brand marks — the trust strip that names the companies running on the platform, and the stack strip that names the frameworks and clouds a workload already uses. The marks come from the package's own registry and are drawn in one ink, so a strip reads as a list rather than as a dozen competing palettes. The same strip can instead print short claims, each with an optional leading icon, for the benefits line that floors a closing band.

- Import: `import Ticker from '@aziontech/webkit/ticker'`
- Category: marketing · Surface: marketing · Structure: monolithic
- API as JSON: [ticker.json](https://github.com/aziontech/webkit/blob/main/.specs/ticker.json)

## When to use

- Under a hero, to name the companies a product already serves ("Trusted by mission-critical workloads").
- To state compatibility as a list of framework, cloud and tooling marks ("Your Stack, Your Way").
- Whenever the set of marks is longer than the row that holds it and no single mark has to be read.
- To run a handful of short benefits ("Deploy to 330+ cities instantly") along the floor of a closing band, where each claim restates what the band above already argues.

## Do

- Name marks from the registry rather than passing artwork: the registry is what keeps one company's mark identical on every surface, and a name with no entry still renders as its own wordmark so a strip is never incomplete.
- Let `duration` derive itself. The component holds speed constant rather than duration (two seconds per mark, six per item, since a claim is read and a mark is not), so an eleven-mark strip and a thirty-mark strip advance at the same rate; pass a number only to slow one deliberately.
- Keep `label` to the claim the row makes, not to a heading — the strip sits under a hero, and a second heading competes with the one above it.
- Use `size="small"` only where the strip is the quietest thing on the page, such as the floor of a sign-in column; `medium` is the marketing band and carries its own responsive ladder.
- Keep each `items` label to a short clause with no punctuation to end it, and give every item the same kind of icon; the row repeats, so a claim is read as one of a run, never on its own.
- Never put a call to action, a price or anything else a reader needs inside a strip. It scrolls away, and under `prefers-reduced-motion` it becomes a wrapped grid instead.

## Don’t

- When every mark must be seen → use `logo-wall`, which wraps into a grid and never moves.
- When the reader chooses how far to go through browsable content → use `carousel`, which is user-driven and never advances on its own.
- For a mark a reader must act on, such as a partner directory → the strip is decorative motion, so put linked marks in a `logo-wall`.
- For one mark in its own right (a header lockup, a client story card) → use `brand`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [logo-wall](logo-wall.md) — the static, wrapping grid of consumer-supplied marks; reach for the strip only when the wall would be too long.
- [carousel](carousel.md) — the user-driven snap scroller; this one moves on its own and holds no essential content.
- [brand](brand.md) — the Azion lockup, for the product's own mark rather than a third party's.
- [overline](overline.md) — renders the `label` above the row.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `kind` | `'plain' \| 'band'` | `'plain'` | false | Whether the strip paints its own ground; `band` fills it with the page canvas so a textured hero cannot show through the marks, and the floor still reads continuous with the band above it. |
| `marks` | `string[]` | `[]` | false | Registry names of the marks rendered in the row, in order; an unregistered name renders as its own typographic wordmark so the row stays complete. |
| `items` | `TickerItem[]` | `[]` | false | Short claims printed in the row instead of marks, each with its label and an optional leading icon class; when set, `marks` is not rendered. |
| `label` | `string` | `''` | false | Overline above the row, stating the claim the marks make. |
| `size` | `'small' \| 'medium'` | `'medium'` | false | Mark scale; `medium` is the marketing band and climbs 32/40/48 px by device class, `small` is a flat 24 px for a column. |
| `duration` | `number` | `0` | false | Seconds for one full pass; left at `0` it is derived from the number of marks, or of items, so every strip moves at one speed. |
| `ariaLabel` | `string` | `''` | false | Accessible name for the row of marks, announced instead of an unnamed list. |

## Assets

- Brand marks: every valid name is in [brand-marks.md](../foundations/brand-marks.md) (MCP `list_assets({ kind: "brandMarks" })`). An unknown name is not drawn as a mark: `Ticker` prints it as a typographic wordmark, the quote components show no mark.

## States

- Visual states: every mark rests at 70% opacity and lifts to full on `hover`; an item is real text and rests at full ink
- `data-size` mirrors the `size` prop and is what drives the mark height, the cell width and the row gap
- `data-content` is `items` when `items` is set and `marks` otherwise; in `items` mode the cells size to their text, the row gap widens to `--spacing-xxl` (never under twice `--spacing-xl`, so a phone keeps room between claims), and the label steps down to `text-body-sm` under `size="small"`
- `data-kind` mirrors the `kind` prop; `band` paints the page canvas and the strip's own vertical rhythm so nothing behind it shows through while the fill still matches the band it floors, `plain` leaves it transparent over whatever it sits on
- `data-duplicate` marks every `aria-hidden` copy after the first — the copies the loop translates into place, and the ones hidden outright under reduced motion
- Short rows: the row repeats until half the track is at least as wide as the strip, so a strip with few marks never shows an empty run; the pass lengthens with each repeat so the speed stays the same
- Empty: when `marks` and `items` are both empty the row renders nothing, so a page with no marks to name shows no empty band
- Reduced motion: the track stops and wraps into a centred static grid, with the duplicate rows removed, so every mark stays reachable

## Accessibility

- Visible focus: none of its own — no mark is a focusable target, so the strip adds no tab stop and needs no ring. The loop still pauses on `:focus-within`, so anything a consumer places over it stays still while it is reached.
- Keyboard map: no arrow-key model and no tab stop — this is a list, not a composite widget.
- ARIA: the row is a `<ul>` of `<li>` named by `ariaLabel` when set; every copy after the first carries `aria-hidden="true"` so a screen reader hears each mark once, and each mark is titled with its own name. In `items` mode the labels are the row's text and each icon is `aria-hidden`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): marks are drawn in `var(--text-default)` at 70%, which WCAG 1.4.11 exempts as a logotype; the typographic fallback is real text and clears the minimum in both themes at that strength. Item labels are real text drawn at full `var(--text-default)`, so their contrast is the ground's to meet, and a strip placed on anything but the canvas or a surface must keep the labels at body size or larger.
- `motion-reduce:animate-none` on the track and `motion-reduce:transition-none` on the mark hover. WCAG 2.2.2 applies — the loop is longer than five seconds, so it pauses on hover and on focus-within, and stops outright under `prefers-reduced-motion`.
- Touch target ≥40×40 px: marks are not interactive targets; the whole strip is one decorative band.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Motion: the marquee runs toward the start edge in both directions: under `dir="rtl"` the track starts offset (`rtl:translate-x-1/2`) and the animation runs reversed; `motion-reduce` stops it in both.
- Keyboard: no horizontal arrow-key logic.
- User data: none.

## Examples

### Default

```vue
<script setup>
  import Ticker from '@aziontech/webkit/ticker'
</script>

<template>
  <Ticker
    label="Trusted by mission-critical workloads"
    aria-label="Companies running on Azion"
    :marks="[
      'global-fashion-group',
      'herospark',
      'itau',
      'nzn',
      'netshoes',
      'caixa',
      'agibank',
      'prime-video',
      'america-movil',
      'gpa',
      'fourbank'
    ]"
  />
</template>
```

### Sizes

```vue
<script setup>
  import Ticker from '@aziontech/webkit/ticker'
</script>

<template>
  <div class="flex flex-col gap-12">
    <Ticker
      size="medium"
      label="Medium — the marketing band"
      :marks="[
        'global-fashion-group',
        'herospark',
        'itau',
        'nzn',
        'netshoes',
        'caixa',
        'agibank',
        'prime-video',
        'america-movil',
        'gpa',
        'fourbank'
      ]"
    />
    <Ticker
      size="small"
      label="Small — a column's floor"
      :marks="[
        'global-fashion-group',
        'herospark',
        'itau',
        'nzn',
        'netshoes',
        'caixa',
        'agibank',
        'prime-video',
        'america-movil',
        'gpa',
        'fourbank'
      ]"
    />
  </div>
</template>
```

### Frameworks

```vue
<script setup>
  import Ticker from '@aziontech/webkit/ticker'
</script>

<template>
  <Ticker
    label="Your Stack, Your Way"
    aria-label="Frameworks and clouds Azion runs"
    :marks="[
      'nextjs',
      'astro',
      'react',
      'vue',
      'angular',
      'nuxt',
      'gatsby',
      'hugo',
      'preact',
      'remix',
      'qwik',
      'vite',
      'aws',
      'gcp',
      'azure',
      'terraform',
      'github',
      'openai',
      'anthropic',
      'sqlite'
    ]"
  />
</template>
```
