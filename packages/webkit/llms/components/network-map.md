# Network Map

> A decorative, full-bleed layer that paints the dotted world map with Azion's PoPs lit in the brand accent. It is a material — it takes no content and claims no space — but unlike a static illustration it is tuned by the consumer (region, PoP density, landmass opacity, static or animated) to sit behind a band's copy.

- Import: `import NetworkMap from '@aziontech/webkit/network-map'`
- Category: content · Surface: product · Structure: monolithic
- API as JSON: [network-map.json](https://github.com/aziontech/webkit/blob/main/.specs/network-map.json)

## When to use

- As the backdrop of a band whose subject is the network (reach, data centers, latency, resilience), composed as a sibling under the band's copy inside a positioned, clipping ancestor.
- When a band is about one part of the network, so only that region's PoPs should light (`region`) while the whole world stays drawn.
- When the same artwork has to read with more or fewer PoPs lit, or with none at all (`density="none"`), from one component instead of separate exports.

## Do

- Give the layer a positioned ancestor (`relative overflow-hidden`); it fills that box and nothing else.
- Never offset or resize the layer with utilities (`left-*`, `w-*`, `inset-*`). It always fills its positioned ancestor, and `position` + `fade` place the map inside that box — so a fade measures from the band's own edges. An offset box moves the fade's edges off the band's and makes the two placements fight.
- To make the map smaller or larger inside its box, set `scale` instead of resizing the layer. The map shrinks toward its `position` corner, so there is no hard edge and the fade keeps measuring from the band's edges.
- Keep `opacity` low (the default `0.4`) when copy sits over the landmass; the PoPs keep full strength so the network still reads.
- For copy on one side of a band, park the map on the other side with `position` and fade it toward the copy (`position="right"` + `fade="left"`); the default stops need no consumer class.
- Tune where a fade holds and ends with `--network-map-fade-start` / `--network-map-fade-end` only when the default stops do not fit, instead of adding masks.
- Leave `animated` off by default; turn it on for the one band per page whose subject is the network.
- To nudge the map or let it run off the band, set `offsetX` / `offsetY` (for example `:offset-x="0.15"` to bleed right, `:offset-y="-0.1"` to bleed up) instead of offsetting the layer.
- asia` and `oceania` hold no PoPs — the artwork carries no accent field there — so either region lights none and the map reads as landmass alone.

## Don’t

- For a real node/edge diagram driven by data → use `flow`.
- As a wrapper around content. The layer is absolutely positioned and paints only itself; content is a sibling above it.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [frame-box](frame-box.md) — the ruled box a network band usually sits in; it supplies the positioned, clipping ancestor.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `region` | `'world' \| 'atlantic' \| 'americas' \| 'north-america' \| 'south-america' \| 'europe' \| 'africa' \| 'asia' \| 'oceania'` | `'world'` | false | Which part of the world has its PoPs lit; the map always frames the whole world. |
| `density` | `'none' \| 'low' \| 'medium' \| 'high'` | `'medium'` | false | How many PoPs are lit, from `none` to `high`. |
| `animated` | `boolean` | `false` | false | Pulses the PoPs in three staggered waves; static when false. |
| `opacity` | `number` | `0.4` | false | Opacity of the landmass dots, from 0 to 1; the PoPs stay at full strength. |
| `position` | `'center' \| 'top' \| 'bottom' \| 'left' \| 'right' \| 'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'center'` | false | Where the map parks in the space the box leaves over. |
| `scale` | `number` | `0.85` | false | Size of the map relative to the box; 1 fits it, below 1 shrinks it toward its position, above 1 enlarges it. |
| `offsetX` | `number` | `0` | false | Horizontal shift as a fraction of the map width; negative moves it left, positive right, past the box edge if large enough. |
| `offsetY` | `number` | `0` | false | Vertical shift as a fraction of the map height; negative moves it up, positive down, past the box edge if large enough. |
| `fade` | `'none' \| 'top' \| 'bottom' \| 'left' \| 'right' \| 'edges' \| 'vignette'` | `'none'` | false | Fades the map out along an axis so it meets content without a hard edge. |

## States

- Visual states: `default`
- `data-region`, `data-density` and `data-fade` on the root mirror their props; `data-fade` drives the mask that fades the layer out
- `density="none"` draws the landmass alone, with no hole where a PoP would be — every PoP cell is also a landmass cell
- `density` levels are cumulative: `low` (65 PoPs) ⊂ `medium` (186) ⊂ `high` (275); `core` carries a PoP on every main Brazilian capital, so they light at every density
- Each PoP path carries `data-animated` (present only when `animated` is set) and `data-phase` (`0` / `1` / `2`), which select the pulse and its wave delay
- The map always frames the whole world; `region` only chooses which PoPs light — a PoP renders when its cell falls inside the region's bounds, and a phase with no PoP left renders no path
- `scale` sizes the map around the `position` anchor, so it renders at that fraction of its fitted size while the anchored edge stays put; a value of 0 or below falls back to `1`
- `offsetX` / `offsetY` translate the map after `position` and `scale` place it, by that fraction of the map's own width / height; the sign is the direction (negative left / up, positive right / down), so each axis moves independently of the anchor
- The default `scale` of `0.85` leaves room on both axes, so every `position` moves the map in any box shape. At `1` the fitted map fills one axis edge to edge, so `position` acts only on the other axis: `top` / `center` / `bottom` render alike in a wide box, and `left` / `center` / `right` in a tall one
- `top` / `bottom` / `left` / `right` fade the map out toward that edge: full ink from the opposite edge up to `--network-map-fade-start`, zero at `--network-map-fade-end`, both measured from the opposite edge. `top` / `bottom` default to 16% / 55%; `left` / `right` default to 50% / 80%, which clears a copy column on that side of a band
- Custom properties tune the fade in place, set from the consumer's class: `--network-map-fade-start` / `--network-map-fade-end` (where the fade holds full ink and where it reaches zero)

## Accessibility

- Decorative: the root is `aria-hidden="true"` and `pointer-events-none`; the network's claims are carried by the band's copy, never by the artwork
- Keyboard map: none — the layer is not focusable and has no interactive parts
- Visible focus: not applicable (nothing receives focus)
- Contrast: not applicable to the artwork (decorative); the copy above it keeps its own ≥4.5:1 against the band, which the low default `opacity` protects
- `motion-reduce:animate-none` stops the pulse under reduced motion
- Touch target: not applicable (no interactive parts)

## Examples

### Default

```vue
<script setup>
  import NetworkMap from '@aziontech/webkit/network-map'
</script>

<template>
  <div class="relative h-80 w-full overflow-hidden bg-(--bg-canvas)">
    <NetworkMap
      region="world"
      density="medium"
      :opacity="0.4"
      position="center"
      :scale="0.85"
      fade="none"
    />
  </div>
</template>
```

### Regions

```vue
<script setup>
  import NetworkMap from '@aziontech/webkit/network-map'
</script>

<template>
  <div class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3">
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">world</span>
      <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
        <NetworkMap region="world" />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">atlantic</span>
      <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
        <NetworkMap region="atlantic" />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">americas</span>
      <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
        <NetworkMap region="americas" />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">north-america</span>
      <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
        <NetworkMap region="north-america" />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">south-america</span>
      <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
        <NetworkMap region="south-america" />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">europe</span>
      <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
        <NetworkMap region="europe" />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">africa</span>
      <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
        <NetworkMap region="africa" />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">asia</span>
      <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
        <NetworkMap region="asia" />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">oceania</span>
      <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
        <NetworkMap region="oceania" />
      </div>
    </div>
  </div>
</template>
```

### Densities

```vue
<script setup>
  import NetworkMap from '@aziontech/webkit/network-map'
</script>

<template>
  <div class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2">
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">none</span>
      <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
        <NetworkMap density="none" />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">low</span>
      <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
        <NetworkMap density="low" />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">medium</span>
      <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
        <NetworkMap density="medium" />
      </div>
    </div>
    <div class="flex flex-col gap-(--spacing-xs)">
      <span class="text-label-sm text-(--text-muted)">high</span>
      <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
        <NetworkMap density="high" />
      </div>
    </div>
  </div>
</template>
```
