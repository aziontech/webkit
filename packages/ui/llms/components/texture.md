# Texture

> The one decorative surface every band in the system is painted on: a full-bleed, non-interactive layer that tiles a texture behind whatever sits above it. It is a material, not a container — it takes no content and claims no space, so a band composes it into its own backdrop slot and keeps ownership of its layout.

- Import: `import Texture from '@aziontech/ui/texture'`
- Category: content · Surface: site · Structure: monolithic
- API as JSON: [texture.json](texture.json)

## When to use

- In a band's `background` slot (`hero`), where the opening band needs the site's own lattice under its copy.
- Behind a panel, dropzone or slide that would read as empty at a flat fill.
- Anywhere a surface should look like a technical drawing ground without shipping an image.

## Do

- Give the layer a positioned ancestor (`relative`) that also clips it; it fills that box and nothing else.
- Keep the texture behind copy, never over it. `dots` is the quiet default; `lines` is quieter still and reads as ruled paper; `dither` and `pixelate` are loud enough to need their ink dropped or their dense end steered away from the words.
- Do not stack two layers at different pitches — that reads as a moiré, not as a texture.
- Quiet a texture with `--texture-ink` rather than with `opacity`, so the ground keeps showing through at full strength.
- Leave it out when the band already sits inside a `registration-frame`; rules plus texture is usually one layer too many.

## Don’t

- To draw the rules between real content cells → use `registration-frame`, whose rules are structural.
- For the ruled divider between sections → use `spacer`, which composes this layer's `lines` variant and owns that treatment.
- For a meaningful image or diagram → use `illustration`.
- As a wrapper around content. The layer is absolutely positioned and paints only itself; content is a sibling above it, inside the positioned ancestor.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [hero](hero.md) — the band whose `background` slot this is composed into.
- [registration-frame](registration-frame.md) — structural rules and corner marks, not decoration.
- [spacer](spacer.md) — the hatched rhythm band between sections.
- [hero](hero.md) — the marketing band that paints this texture behind its own copy.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `variant` | `'dots' \| 'grid' \| 'lines' \| 'dither' \| 'pixelate' \| 'none'` | `'dots'` | false | Which texture to paint; `none` renders the layer with no texture at all. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Pitch of the tiling — how far apart the cells sit. |
| `fade` | `'none' \| 'top' \| 'bottom' \| 'left' \| 'right' \| 'edges' \| 'vignette'` | `'none'` | false | Fades the layer out along an axis so it meets content without a hard edge. |

## States

- Visual states: `default`
- `data-variant`, `data-size` and `data-fade` mirror their props and drive which texture paints, at what pitch, and how it fades out
- `variant="none"` paints nothing, so a band can switch its texture off without unmounting the layer
- `fade="none"` leaves the layer unmasked; every other value masks it so the ink reaches zero before the layer's own edge; `top` and `bottom` are a single fade — full ink at the leading edge, zero at `--texture-fade-end`; `left` and `right` fade out toward the named edge in the same way, full ink at the opposite edge, which is how a band keeps its texture behind the media and clears it under the copy. Setting `--texture-fade-lead: transparent` adds a second ramp in from zero at the leading edge, so the layer also clears whatever overlaps that edge; `hero` sets it on its backdrop because its opening band sits under the site header, and no other band needs it
- Custom properties tune a texture in place, set from the consumer's class: `--texture-ink` (every variant), `--texture-fade-start` / `--texture-fade-end` (where the fade holds full ink and where it reaches zero), `--texture-fade-lead` (the ink at the leading edge of `top` / `bottom`; `black` by default, `transparent` for the double fade), `--texture-from` / `--texture-to` / `--texture-direction` (the `dither` ramp's density span and axis), `--texture-pool-x` (where both `pixelate` light pools sit on the x axis), `--texture-pool-a` / `--texture-pool-b` (each pool's own `x y` position, so the two can sit on opposite edges; either falls back to `--texture-pool-x`), `--texture-wave-gain` (multiplies the ink of both `pixelate` waves, 1 by default, capped at full ink, so a band can make the motion read over the pools), `--texture-wave-pace` (scales how far both waves drift, 1 by default; 2 doubles the distance, and so the speed, without changing the animation's duration token)

- A texture is a backdrop for text only (RV-T2-1). Never draw a chart, diagram, map, stat or page-JSON content scene on it; the root carries `data-slot="texture"` and hides itself (`display: none`) when its parent holds a `[data-plain-ground]` that is not inside an opaque `[data-opaque]` window. The texture-backdrop check (write time and CI) and the visual texture-backdrop spec enforce it.

## Accessibility

- Visible focus: not applicable — the layer is decorative and holds no interactive control.
- Keyboard map: none; the layer is `pointer-events-none` and is never in the tab order.
- ARIA: the root carries `aria-hidden="true"`, so no texture is announced and the layer adds no role.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the ink is mixed down from `var(--text-default)` to a surface step, deliberately below text contrast — content above the layer keeps its own colours and its own contrast against the page canvas.
- `motion-reduce:animate-none` on both pixelate waves; every other variant is static.
- Pause, Stop, Hide (WCAG 2.2.2): the pixelate waves run once and stop by themselves within 5 seconds, so the layer needs no pause control.
- Touch target ≥40×40 px — not applicable, no interactive target.

## Examples

### Default

```vue
<script setup>
  import Texture from '@aziontech/ui/texture'
</script>

<template>
  <div class="relative h-80 w-full overflow-hidden bg-(--bg-canvas)">
    <Texture
      variant="dots"
      size="medium"
      fade="none"
    />
  </div>
</template>
```

### Variants

```vue
<script setup>
  import Texture from '@aziontech/ui/texture'
</script>

<template>
  <div class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2">
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">dots</span>
      <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
        <Texture variant="dots" />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">grid</span>
      <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
        <Texture variant="grid" />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">lines</span>
      <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
        <Texture variant="lines" />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">dither</span>
      <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
        <Texture variant="dither" />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">pixelate</span>
      <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
        <Texture variant="pixelate" />
      </div>
    </div>
  </div>
</template>
```

### Sizes

```vue
<script setup>
  import Texture from '@aziontech/ui/texture'
</script>

<template>
  <div class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-3">
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">small</span>
      <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
        <Texture size="small" />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">medium</span>
      <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
        <Texture size="medium" />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">large</span>
      <div class="relative h-64 overflow-hidden bg-(--bg-canvas)">
        <Texture size="large" />
      </div>
    </div>
  </div>
</template>
```
