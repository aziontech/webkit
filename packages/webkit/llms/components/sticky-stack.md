# Sticky Stack

> A band that pins to the viewport and is read by scrolling through it: a stack of claims on one side, one piece of media on the other, and the scroll position — not a pointer — deciding which claim is open. Each claim expands in turn while the ones already read collapse and stack above it, so the column keeps one height and the reader always sees where they are in the run. The media beside it is replaced, not dimmed: the outgoing scene leaves and the incoming one mounts, so a scene that animates plays its entrance every time it is reached.

- Import: `import StickyStack from '@aziontech/webkit/sticky-stack'`
- Category: marketing · Surface: marketing · Structure: monolithic
- API as JSON: [sticky-stack.json](https://github.com/aziontech/webkit/blob/main/.specs/sticky-stack.json)

## When to use

- For a sequence of claims a reader should take in one at a time, each with a medium worth looking at — five ways a platform is used, each with the file you would actually write.
- When the media is the payload and the copy is the caption: a code sample, a console shot, an official scene.
- As the one band on a page that rewards scrolling slowly, placed where a reader has already committed to the page.

## Do

- Keep the run to three to six claims. The band holds the page for `dwell` of a screen per claim, and a reader who cannot see the end of it reads it as a page that will not let go.
- Write each claim to stand alone. A reader can land mid-band from a deep link or a focus jump, so no claim may depend on the one above it.
- Keep a title to one line. The collapsed rows set the column's height, and a title that wraps changes it for every claim at once.
- Keep a description to two or three lines. Only the open claim shows one, and a long one pushes the stack past the pinned frame.
- Give every claim a medium. The frame holds one at a time and mounts it fresh, so a claim with nothing to show reads as a band that broke rather than one that is quiet.
- Use media of the same shape. The frame does not resize between claims, and a scene that changes the frame's height un-pins the band mid-read.
- Set `--sticky-stack-top` to the height of any sticky header above the band, or the first claim opens underneath it. Set it on a wrapper around the band rather than on the band's own tag: custom properties inherit, and the band is not a style seam.
- Leave `showProgress` on. It is the only thing telling a reader how much of the pin is left.
- Raise `dwell` for claims that carry code a reader must actually read; lower it for scenes that are grasped at a glance.

## Don’t

- For peer claims a reader should be able to jump between at will → use `media-tabs`, which selects on hover, click and a timer without taking the scroll.
- For one claim beside one picture → use `media-split`.
- For questions and answers, or any run longer than about six items → use `faq`. A pinned band holds the page for its whole run, and a long run holds it too long.
- On a page that is already a single short screen: there is no scroll to spend.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [media-tabs](media-tabs.md) — the pointer-driven sibling. Same two-column anatomy; the selection moves on hover, click and a timer, and the band does not pin.
- [media-split](media-split.md) — one claim, one medium, no selection and no pin.
- [code-block](code-block.md) — the medium this band most often holds, one sample per claim.
- [illustration](illustration.md) — the official scene a claim's `media` slot otherwise holds.
- [section-title](section-title.md) — the heading above the band; this component carries no title of its own.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `StickyStackItem[]` | `[]` | false | The claims, in reading order; each item is a title, the sentence that opens with it, and the image shown while it is open. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Height the open claim is held to, and so the height of the whole stack beside the media. |
| `dwell` | `number` | `0.7` | false | Screen-heights of scrolling each claim holds while the band is pinned; the band's total scroll is one screen plus this much per claim. |
| `showProgress` | `boolean` | `true` | false | Fills a hairline along the open claim's bottom edge as its share of the scroll is spent. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `index-change` | `number` | The open claim changed; the payload is the index now open. Fires on the scroll that moved it and on a reader selecting a claim. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `media` | { item: StickyStackItem, index: number, active: boolean } | The claim's medium; replaces the image built from the item's own source. Mounted fresh on every change, so an entrance animation inside it replays. |
| `actions` | { item: StickyStackItem, index: number, active: boolean } | The claim's own controls, pinned to the bottom edge of the open claim. From `lg` up they show only while the claim is open and are out of the tab order while it is collapsed; below `lg` every claim is open and carries its own. Nothing renders when the slot is empty. |
| `backdrop` | — | Fills the media frame behind every claim's medium, from `lg` up. Mounted once and never swapped, so a texture or an animated surface placed here holds still while the media change over it. Nothing renders when the slot is empty. |

## States

- Visual states: `default`, `hover`, `focus-visible` on each claim's title control
- `data-active` marks the open claim; it holds the plain text tone and shows its description
- `data-complete` marks every claim already read; they collapse to their title and rest at a muted tone, further dimmed so the read part of the run is legible at a glance, stacked above the open one
- `data-size` carries the size token, which is what sets the open claim's height and so the stack's height
- `data-progress` is present on the root while `showProgress` is on
- The media frame shows exactly one medium: the outgoing one leaves as the incoming one mounts
- The backdrop is not part of the medium: it stays mounted across every change, under the medium that is leaving and the one arriving
- A claim's description is held to `var(--container-sm)` so the measure stays short however wide the column is
- Below `lg` the band does not pin: every claim is open, each with its own medium under it, and nothing moves
- Empty: when `items` is empty the band renders nothing

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` on every claim's title control
- Keyboard map: `Tab` reaches each claim's title control in reading order; focusing or activating one scrolls the band to that claim's share of the scroll, so a keyboard reader moves the band exactly as a pointer reader does. There is no key that scrolls the page other than the reader's own — the band never takes the scroll it is given.
- ARIA: the claim list is an `<ol>` (the run is ordered); the open claim's control carries `aria-current="true"`; the progress hairline is `aria-hidden="true"`; the scroll anchors are `aria-hidden="true"`
- Every claim's description stays in the accessibility tree while collapsed (clipped, never `display: none`), so the whole run is readable without scrolling through it
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the muted tone a read claim rests at
- `motion-reduce:transition-none` / `motion-reduce:animate-none` on every animated state; the pin itself is not motion and stays
- Touch target ≥40×40 px: each claim's control spans its whole row

## Examples

### Default

```vue
<script setup>
  import Illustration from '@aziontech/webkit/illustration'
  import StickyStack from '@aziontech/webkit/sticky-stack'

  const scenes = ['ai-applications', 'live-debugging', 'deploy-secure-mcp-server']

  const items = [
    {
      title: 'Automated deployment via Git or CLI',
      description:
        'Push to a branch or run one command; the platform builds the project and puts the result in every location, with the build before it a rollback away.'
    },
    {
      title: 'Infrastructure as code with Terraform',
      description:
        'Declare workloads, rules and domains in the provider and apply them the same way as the rest of your estate, with the same review and the same plan.'
    },
    {
      title: 'Metrics and events via GraphQL API',
      description:
        'Query the same numbers the console charts, from one endpoint, so a dashboard you already run can carry the platform alongside everything else.'
    }
  ]
</script>

<template>
  <StickyStack :items="items">
    <template #media="{ index }">
      <Illustration :name="scenes[index]" />
    </template>
  </StickyStack>
</template>
```

### Sizes

```vue
<script setup>
  import Illustration from '@aziontech/webkit/illustration'
  import StickyStack from '@aziontech/webkit/sticky-stack'

  const scenes = ['ai-applications', 'live-debugging', 'deploy-secure-mcp-server']

  const items = [
    {
      title: 'Automated deployment via Git or CLI',
      description:
        'Push to a branch or run one command; the platform builds the project and puts the result in every location, with the build before it a rollback away.'
    },
    {
      title: 'Infrastructure as code with Terraform',
      description:
        'Declare workloads, rules and domains in the provider and apply them the same way as the rest of your estate, with the same review and the same plan.'
    },
    {
      title: 'Metrics and events via GraphQL API',
      description:
        'Query the same numbers the console charts, from one endpoint, so a dashboard you already run can carry the platform alongside everything else.'
    }
  ]
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xxl)">
    <StickyStack
      size="small"
      :items="items"
    >
      <template #media="{ index }">
        <Illustration :name="scenes[index]" />
      </template>
    </StickyStack>
    <StickyStack
      size="medium"
      :items="items"
    >
      <template #media="{ index }">
        <Illustration :name="scenes[index]" />
      </template>
    </StickyStack>
    <StickyStack
      size="large"
      :items="items"
    >
      <template #media="{ index }">
        <Illustration :name="scenes[index]" />
      </template>
    </StickyStack>
  </div>
</template>
```
