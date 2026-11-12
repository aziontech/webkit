# Recognition Marquee

> The analyst-recognition band: a section title over a framed strip of signed quotes — one per report, marked by the firm's logo — that scrolls continuously and pauses on hover or focus. It is a page section — the site places it from a `{ _id: 'recognition-marquee', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `frame-box` and `quote`.

- Import: `import RecognitionMarquee from '@aziontech/webkit/recognition-marquee'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [recognition-marquee.json](https://github.com/aziontech/webkit/blob/main/.specs/recognition-marquee.json)

## When to use

- To list analyst reports and awards on a page that needs third-party proof.

## Do

- Five to eight items; the loop needs enough width to read as continuous.
- Leave `duration` at `0` to let the strip pace itself (twelve seconds per item).

## Don’t

- For office photos → use `photo-marquee`.
- For customer quotes → use `client-quotes`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [quote](quote.md) — the signed card each recognition renders with.
- [photo-marquee](photo-marquee.md) — the sibling strip of pictures with the same loop.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `eyebrow` | `string` | `''` | false | Overline above the section title. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the section title as its `h2`; the band renders no header when empty. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the scrolling region. |
| `duration` | `number` | `0` | false | Seconds one loop of the strip takes; `0` paces it at twelve seconds per item. |
| `items` | `RecognitionMarqueeItem[]` | `[]` | false | The recognitions, in order; each is `{ text, reportName, date?, firmName, logo, logoLight? }` where `logo` is the firm's mark on the dark theme and `logoLight` the one on the light theme. |

## States

- Visual states: `default`, paused while the strip is hovered or holds focus
- Empty: when `items` is empty the band renders nothing
- The list is rendered twice for a seamless loop; the duplicate is `aria-hidden` and hidden under reduced motion, where the region scrolls by hand instead

## Accessibility

- Visible focus: the scrolling region is focusable and carries `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset`.
- Keyboard map: `Tab` reaches the region, which pauses the loop; under reduced motion arrow keys scroll it.
- ARIA: the band is a `<section>` named by its title (`aria-label`); the strip is a `region` named by `ariaLabel`; the second copy of the list is `aria-hidden`; each firm mark carries `firmName` as `alt`; each recognition is a `blockquote` signed by its report and date.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `quote` on `var(--bg-surface)`.
- `motion-reduce:animate-none` on the strip; the duplicate list is hidden so nothing moves and nothing repeats.
- Touch target ≥40×40 px — not applicable beyond the focusable region.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Motion: under `dir="rtl"` the marquee track starts offset (`rtl:translate-x-1/2`) and the animation runs reversed; `motion-reduce` stops it in both.
- Keyboard: no horizontal arrow-key logic.
- User data: none.

## Examples

### Default

```vue
<script setup>
  import forresterExtendedColor from '@aziontech/webkit/assets/forrester-extended-color.svg'
  import forresterExtendedReversed from '@aziontech/webkit/assets/forrester-extended-reversed.svg'
  import frostAndSullivanExtendedColor from '@aziontech/webkit/assets/frost-and-sullivan-extended-color.svg'
  import frostAndSullivanExtendedReversed from '@aziontech/webkit/assets/frost-and-sullivan-extended-reversed.svg'
  import g2SymbolColor from '@aziontech/webkit/assets/g2-symbol-color.svg'
  import gartnerExtendedColor from '@aziontech/webkit/assets/gartner-extended-color.svg'
  import gartnerExtendedReversed from '@aziontech/webkit/assets/gartner-extended-reversed.svg'
  import gigaomExtendedColor from '@aziontech/webkit/assets/gigaom-extended-color.svg'
  import gigaomExtendedReversed from '@aziontech/webkit/assets/gigaom-extended-reversed.svg'
  import RecognitionMarquee from '@aziontech/webkit/recognition-marquee'
</script>

<template>
  <RecognitionMarquee
    eyebrow="Analysts"
    title="Recognized as a market leader"
    aria-label="Analyst recognitions"
    :items="[
      {
        text: 'Named a Leader and Fast Mover, and the only vendor whose platform meets every key criterion the report sets for a full-stack edge deployment.',
        reportName: 'GigaOm Radar for Full-Stack Edge Deployments v3',
        date: 'May 2026',
        firmName: 'GigaOm',
        logo: gigaomExtendedReversed,
        logoLight: gigaomExtendedColor
      },
      {
        text: 'Evaluated as a Strong Performer among the edge development platforms that matter most.',
        reportName: 'The Forrester Wave™: Edge Development Platforms',
        date: 'March 2026',
        firmName: 'Forrester',
        logo: forresterExtendedReversed,
        logoLight: forresterExtendedColor
      },
      {
        text: 'Covered as a vendor in the market guide that defines the edge distribution platform category, in two consecutive editions.',
        reportName: 'Gartner Market Guide for Edge Distribution Platforms',
        date: 'November 2025',
        firmName: 'Gartner',
        logo: gartnerExtendedReversed,
        logoLight: gartnerExtendedColor
      },
      {
        text: 'Recognized as Latin America Company of the Year in the edge distribution platform industry, after being profiled among the Companies to Action on the Frost Radar™.',
        reportName: 'Frost & Sullivan Latin America Company of the Year',
        date: 'June 2026',
        firmName: 'Frost & Sullivan',
        logo: frostAndSullivanExtendedReversed,
        logoLight: frostAndSullivanExtendedColor
      },
      {
        text: 'Positioned as a Challenger and Fast Mover, with the application and API security stack evaluated as one platform rather than a set of bolt-ons.',
        reportName: 'GigaOm Radar for Application and API Security v5',
        date: 'March 2026',
        firmName: 'GigaOm',
        logo: gigaomExtendedReversed,
        logoLight: gigaomExtendedColor
      },
      {
        text: 'Recognized as a Leader in CDN, Web Security, and DDoS Protection, and a High Performer in Cloud Security, WAF, Bot Detection and Mitigation, SSL & TLS Certificate Tools, and API Security Tools.',
        reportName: 'G2 Reports',
        date: 'March 2026',
        firmName: 'G2',
        logo: g2SymbolColor
      },
      {
        text: 'Recognized as a Leader in CDN and a High Performer in Web Security, DDoS Protection, WAF, Bot Detection and Mitigation, SSL & TLS Certificate Tools, and DNS Security Solution.',
        reportName: 'G2 Reports',
        date: 'December 2025',
        firmName: 'G2',
        logo: g2SymbolColor
      }
    ]"
  />
</template>
```
