# Photo Marquee

> The office band of the careers page: a horizontal section title over a framed strip of photographs of varied aspect ratios that scrolls continuously and pauses on hover or focus. It is a page section — the site places it from a `{ _id: 'photo-marquee', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title` and `frame-box`.

- Import: `import PhotoMarquee from '@aziontech/webkit/photo-marquee'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [photo-marquee.json](https://github.com/aziontech/webkit/blob/main/.specs/photo-marquee.json)

## When to use

- To show a place or a team in pictures without a grid.

## Do

- Give every photo its `width` and `height` so the strip reserves each slot before the picture loads.
- Leave `duration` at `0` to let the strip pace itself (ten seconds per photo).

## Don’t

- For quotes → use `recognition-marquee`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [recognition-marquee](recognition-marquee.md) — the sibling strip of quotes with the same loop.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `''` | false | Headline of the band, rendered by the horizontal section title as its `h2`; the band renders no header when empty. |
| `description` | `string` | `''` | false | Paragraph beside the headline. |
| `descriptionWidth` | `PhotoMarqueeDescriptionWidth` | `'narrow'` | false | Width the description is capped at: `narrow` or `wide`. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the scrolling region. |
| `duration` | `number` | `0` | false | Seconds one loop of the strip takes; `0` paces it at ten seconds per photo. |
| `photos` | `PhotoMarqueePhoto[]` | `[]` | false | The photographs, in order; each is `{ src, alt, width, height }`. |

## States

- Visual states: `default`, paused while the strip is hovered or holds focus
- Empty: when `photos` is empty the band renders nothing
- The list is rendered twice for a seamless loop; the duplicate is `aria-hidden`, its photos carry an empty `alt`, and it is hidden under reduced motion, where the region scrolls by hand instead

## Accessibility

- Visible focus: the scrolling region is focusable and carries `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset`.
- Keyboard map: `Tab` reaches the region, which pauses the loop; under reduced motion arrow keys scroll it.
- ARIA: the band is a `<section>` named by its title (`aria-label`); the strip is a `region` named by `ariaLabel`; every photo carries its `alt` once — the duplicate copy is `aria-hidden` with empty `alt`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `section-title`.
- `motion-reduce:animate-none` on the strip; the duplicate list is hidden so nothing moves and nothing repeats.
- Touch target ≥40×40 px — not applicable beyond the focusable region.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Motion: under `dir="rtl"` the marquee track starts offset (`rtl:translate-x-1/2`) and the animation runs reversed, so photos flow in reading order; `motion-reduce` stops it in both.
- Keyboard: no horizontal arrow-key logic.
- User data: none.

## Examples

### Default

```vue
<script setup>
  import placeholderImage from '@aziontech/webkit/assets/placeholder-image.svg'
  import PhotoMarquee from '@aziontech/webkit/photo-marquee'
</script>

<template>
  <PhotoMarquee
    title="Work at Azion"
    description="The Azion Way of Life pairs high performance with autonomy, authenticity, and enjoyment. You manage your own routine and answer for outcomes, working with teammates across countries and cultures. There's no dress code: what counts is the ideas, energy, and integrity you bring."
    description-width="wide"
    aria-label="Azion offices"
    :photos="[
      {
        src: placeholderImage + '#office-desks',
        alt: 'An open-plan office with a fern-lined shelf and a person working at a shared desk',
        width: 1066,
        height: 1600
      },
      {
        src: placeholderImage + '#office-lounge',
        alt: 'A lounge corridor with a sofa and two sling chairs along a wall of windows',
        width: 1600,
        height: 1066
      },
      {
        src: placeholderImage + '#team-talk',
        alt: 'A team member giving a talk in front of a screen while colleagues listen with laptops',
        width: 900,
        height: 1600
      },
      {
        src: placeholderImage + '#office-window-bar',
        alt: 'One person reading on a window bench while two colleagues talk at a window counter',
        width: 1066,
        height: 1600
      },
      {
        src: placeholderImage + '#office-shelves',
        alt: 'Shelves of ferns and collectible figures beside a glass-walled meeting room',
        width: 1600,
        height: 1066
      },
      {
        src: placeholderImage + '#office-private-room',
        alt: 'A wood-panelled meeting room with a person working on a laptop by the window',
        width: 1600,
        height: 1066
      }
    ]"
  />
</template>
```
