# Section Gap

> The empty registration frame that divides two page sections. On a page with no margins between sections, this frame *is* the gap: it holds the vertical air, and its own two rules are what separate the sections it sits between — which is why it is a frame and not a spacer `div`. `size` picks how much air, on a three-step scale built from the theme's own spacing tokens.

- Import: `import SectionGap from '@aziontech/webkit/section-gap'`
- Category: marketing · Surface: marketing · Structure: monolithic
- API as JSON: [section-gap.json](https://github.com/aziontech/webkit/blob/main/.specs/section-gap.json)

## When to use

- Between two stacked page sections on a full-bleed, framed layout.
- Wherever a page needs breathing room that still reads as part of the frame instead of as empty margin.
- To change the weight of one break without touching its neighbours — a `large` gap before a new part of the page, `small` between two bands that belong together.

## Do

- Pick the step by what the break means, not by how the page happens to look: `medium` is the ordinary break between sections, `large` opens a new part of the page, `small` keeps two related bands close.
- Do not override the height from the call site. The steps are multiples of `--spacing-xxl`, so they already scale with the viewport; a hand-set height freezes one break out of the page rhythm.
- Keep one step per break — stacking two gaps to reach a bigger one draws an extra pair of rules.
- Let it carry the shared rule: it renders `flush`, so its top rule is subtracted and the section above supplies it instead of doubling it. It still ticks every corner (`marks="all"`): the shared rule is given away, the registration mark is not.
- Reach for `hatch` here rather than on a section header: the gap is the one band with no copy of its own, so the texture gives the break identity without sitting behind a headline.
- Leave the ruling unmasked. Each line is one solid ink edge to edge and its transparency is the ink's own, so the field reads as ruled page material rather than as a fill that fades out; a vignette on a band this short reads as a smear.
- Do not wrap it in a padded container; the gap is the padding.

## Don’t

- To space two elements inside a section → use the layout's own `gap-(--spacing-*)` utility.
- To draw a single separating line with no air → use `divider` instead.
- When the gap must hold content (a headline, a CTA) → use `section-title`, or a `frame-box` you fill yourself.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [frame-box](frame-box.md) — the frame this component configures; reach for it directly when the gap needs content or different rules.
- [texture-material](texture-material.md) — the layer that paints the ruling, composed here at its `lines` kind.
- [section-title](section-title.md) — the framed header that usually follows a gap; it owns no vertical air of its own beyond its padding, so the gaps around it are what set the page's rhythm.
- divider` — a hairline with no vertical air.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | How much vertical air the gap holds, as a multiple of `--spacing-xxl`: `small` is 1× (keeps two related bands close), `medium` 2× (the ordinary break), `large` 3× (opens a new part of the page). The token is responsive, so every step scales with the viewport. |
| `hatch` | `boolean` | `false` | false | Draw the gap's ruled line texture — fine vertical rules at a fixed pitch. |

## States

- Visual states: `default`
- `data-size` mirrors the `size` prop: `small` | `medium` | `large`
- `data-hatch` present when the hatch texture is drawn; the texture layer itself is addressable at `marketing-section-gap__hatch`

## Accessibility

- Visible focus: not applicable — the gap holds no content and no interactive surface.
- Keyboard map: none — the gap is not focusable and is skipped by `Tab`.
- ARIA: no role and no accessible name; the frame's rules and corner marks are decoration inherited from `frame-box`, which marks them `aria-hidden="true"`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons) — no text; the rules are non-informational decoration.
- `motion-reduce:transition-none motion-reduce:transform-none` — not applicable, the component is static.
- Touch target ≥40×40 px — not applicable, no interactive control.

## Examples

### Default

```vue
<script setup>
  import SectionGap from '@aziontech/webkit/section-gap'
  import FrameBox from '@aziontech/webkit/frame-box'
</script>

<template>
  <div>
    <FrameBox borders="y">
      <div class="p-(--spacing-xl) text-center text-body-md text-(--text-muted)">Section above</div>
    </FrameBox>
    <SectionGap size="medium" />
    <FrameBox
      flush
      marks="bottom"
      borders="y"
    >
      <div class="p-(--spacing-xl) text-center text-body-md text-(--text-muted)">Section below</div>
    </FrameBox>
  </div>
</template>
```

### Hatch

```vue
<script setup>
  import SectionGap from '@aziontech/webkit/section-gap'
  import FrameBox from '@aziontech/webkit/frame-box'
</script>

<template>
  <div>
    <FrameBox borders="y">
      <div class="p-(--spacing-xl) text-center text-body-md text-(--text-muted)">Section above</div>
    </FrameBox>
    <SectionGap
      hatch
      size="large"
    />
    <FrameBox
      flush
      marks="bottom"
      borders="y"
    >
      <div class="p-(--spacing-xl) text-center text-body-md text-(--text-muted)">Section below</div>
    </FrameBox>
  </div>
</template>
```

### Sizes

```vue
<script setup>
  import SectionGap from '@aziontech/webkit/section-gap'
  import FrameBox from '@aziontech/webkit/frame-box'
</script>

<template>
  <div>
    <FrameBox borders="y">
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        size="small" — one --spacing-xxl below
      </div>
    </FrameBox>
    <SectionGap size="small" />
    <FrameBox
      flush
      marks="bottom"
      borders="y"
    >
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        size="medium" — two below
      </div>
    </FrameBox>
    <SectionGap size="medium" />
    <FrameBox
      flush
      marks="bottom"
      borders="y"
    >
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
        size="large" — three below
      </div>
    </FrameBox>
    <SectionGap size="large" />
    <FrameBox
      flush
      marks="bottom"
      borders="y"
    >
      <div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">End</div>
    </FrameBox>
  </div>
</template>
```
