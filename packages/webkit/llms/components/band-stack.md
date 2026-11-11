# Band Stack

> A run of framed bands that follow one another down the page, each one drawn as two registration frames — its left half and its right half — sharing a hairline with the next. With `sticky` on, each band pins under the site header a step lower than the band before it, so the run piles up as the reader scrolls and every band already read stays visible as a ledge above the one being read. The component owns the band rules, the shared hairlines and the pin offsets, and by default every band is split into two frames: a `media-split` composed into the stack frames its copy cell and its media cell as two `frame-box`es, left and right, each with its four marks. The bands themselves are whatever the consumer composes into the default slot — each direct child becomes one band. It carries no copy, heading or media of its own.

- Import: `import BandStack from '@aziontech/webkit/band-stack'`
- Category: marketing · Surface: marketing · Structure: monolithic
- API as JSON: [band-stack.json](https://github.com/aziontech/webkit/blob/main/.specs/band-stack.json)

## When to use

- For a run of peer bands — three to six `media-split`s, one per solution or capability — that should read as one sequence.
- With `sticky`, when the run is the page's centrepiece and the reader should feel each band land on the last.
- Without `sticky`, to frame a run of bands with one shared hairline between neighbours, with no pinning.

## Do

- Keep the run to three to six bands. With `sticky` every band read stays pinned as a ledge, and a long run fills the viewport with ledges.
- Give every band the same height class (`media-split` `size="large"`, same `align`), so the ledges line up as the pile grows.
- Pass `flush` when the element directly above the stack already draws a rule (a `section-gap`, another frame), so the first band does not draw a second one.
- Give each band an opaque fill (`media-split` paints its own cells). A pinned band covers the one before it, and a transparent band shows the one underneath through it.
- Compose `media-split`s as the bands. The two frames are the band's own cells, so a child that is not a `media-split` carries no marks unless it frames itself — wrap it in a `frame-box` with `borders="none"`.
- Render the bands with `v-for` directly in the default slot; each direct child is one band, so a wrapper element around them collapses the run into a single band.

## Don’t

- For a run where the scroll position should decide which claim is open beside one media pane → use `sticky-stack`.
- For peer claims a reader jumps between at will → use `media-tabs`.
- For a single band → frame it with `frame-box` directly, or set `framed` on the `media-split`.
- For a grid of cards → use `card-grid`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [media-split](media-split.md) — the band this stack holds, typically at `size="large"`. Inside the stack it frames its own two cells, so leave its `framed` off.
- [sticky-stack](sticky-stack.md) — the scroll-driven sibling: one pinned frame whose open claim follows the scroll, instead of bands that pile up.
- [frame-box](frame-box.md) — the frame each band is drawn in.
- [section-gap](section-gap.md) — the spacer usually above the stack; pass `flush` so the first band does not draw a second rule under it.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `sticky` | `boolean` | `false` | false | Pin each band under the site header from `lg` up, a step lower than the band before it, so the run piles up as the page scrolls. |
| `flush` | `boolean` | `false` | false | Drop the first band's top rule, for a stack sitting directly under an element that already draws one. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The bands. Each direct child — including every child a `v-for` renders — is wrapped in its own frame and becomes one band; comment nodes are skipped. |

## States

- Visual states: `default`
- `data-sticky` mirrors the `sticky` prop and is what pins the bands: from `lg` up each band is `position: sticky`, its `top` the site header's height plus one `var(--spacing-md)` step per band before it. Below `lg` the bands stack in normal flow with no pinning, because a pinned pile of full-width bands leaves a phone no room to read
- `data-flush` mirrors the `flush` prop; the first band's frame then draws no top rule
- Each band is a `frame-box` with its top and bottom rules and no marks of its own. The stack provides a context that tells a `media-split` band to frame its two cells, left and right, each with all four registration marks, so every band reads as two frames and both sides of its seam are ticked. Every band after the first pulls up one pixel so neighbouring rules overlap into a single hairline, while each band still owns its top rule — the rule a pinned band shows when it covers the one before it
- The pin offset is owned by the component, not the page: the stack pins below the site header's `3.5rem` bar, and a page sets nothing to get it
- Later bands paint over earlier ones in DOM order, so the pile grows downward with no `z-index` of its own

## Accessibility

- Visible focus: not applicable to the stack; controls inside each band keep their own `focus-visible` ring.
- Keyboard map: none of its own — `Tab` moves through each band's controls in DOM order, band by band.
- ARIA: the stack is a plain `div` with no role; each band keeps its own semantics (`media-split` is a `section` named by its heading).
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): not applicable — the stack draws only rules; each band owns its text contrast.
- `motion-reduce:transition-none motion-reduce:transform-none` — not applicable, the stack declares no motion. Pinning is scroll position, not animation.
- Touch target — not applicable; the stack composes no control of its own.

## Examples

### Default

```vue
<script setup>
  import BandStack from '@aziontech/webkit/band-stack'
  import Illustration from '@aziontech/webkit/illustration'
  import MediaSplit from '@aziontech/webkit/media-split'
</script>

<template>
  <BandStack>
    <MediaSplit
      title="Build and Run Applications"
      description="Deploy applications and static sites straight from Git."
      size="large"
      align="center"
      :heading-level="3"
    >
      <template #media>
        <Illustration name="ai-applications" />
      </template>
    </MediaSplit>
    <MediaSplit
      title="Secure Applications and Networks"
      description="Stop DDoS attacks, bots and exploits before they reach your origin."
      size="large"
      align="center"
      :heading-level="3"
    >
      <template #media>
        <Illustration name="deploy-secure-mcp-server" />
      </template>
    </MediaSplit>
    <MediaSplit
      title="Observe Every Request"
      description="Follow logs, metrics and events from every location as they happen."
      size="large"
      align="center"
      :heading-level="3"
    >
      <template #media>
        <Illustration name="live-debugging" />
      </template>
    </MediaSplit>
  </BandStack>
</template>
```

### Sticky

```vue
<script setup>
  import BandStack from '@aziontech/webkit/band-stack'
  import Illustration from '@aziontech/webkit/illustration'
  import MediaSplit from '@aziontech/webkit/media-split'
</script>

<template>
  <BandStack
    sticky
    flush
  >
    <MediaSplit
      title="Build and Run Applications"
      description="Deploy applications and static sites straight from Git."
      size="large"
      align="center"
      :heading-level="3"
    >
      <template #media>
        <Illustration name="ai-applications" />
      </template>
    </MediaSplit>
    <MediaSplit
      title="Secure Applications and Networks"
      description="Stop DDoS attacks, bots and exploits before they reach your origin."
      size="large"
      align="center"
      :heading-level="3"
    >
      <template #media>
        <Illustration name="deploy-secure-mcp-server" />
      </template>
    </MediaSplit>
    <MediaSplit
      title="Observe Every Request"
      description="Follow logs, metrics and events from every location as they happen."
      size="large"
      align="center"
      :heading-level="3"
    >
      <template #media>
        <Illustration name="live-debugging" />
      </template>
    </MediaSplit>
  </BandStack>
</template>
```
