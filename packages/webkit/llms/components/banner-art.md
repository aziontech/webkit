# Banner Art

> The decorative backdrop a site, hub or docs band stands on, for a `Hero` `background` slot or any band with `relative overflow-hidden`: `globe` hangs half a globe past the page's inline-end rule over the dot lattice, `map` insets the world map beside the copy, `network` lays the map full bleed with its PoPs lit and a scrim over the copy column. From the design sample's `shared/ui/banners` (GlobeBanner, MapBanner, NetworkBanner), drawn with WebKit's own `SpinningGlobe` and `NetworkMap` so there is one map and one globe in the system. The inventory's "`Banner` `art` variants" became this sibling component under `marketing/banner`: `Banner` is an announcement band with its own surfaces, and a backdrop layer is a different thing.

- Import: `import BannerArt from '@aziontech/webkit/banner-art'`
- Category: marketing · Surface: marketing · Structure: monolithic
- API as JSON: [banner-art.json](https://github.com/aziontech/webkit/blob/main/.specs/banner-art.json)

## When to use

- Behind the opening band of a landing, the hub or the docs home.

## Do

- One backdrop per page.
- Keep the copy at the inline start: every art is washed toward it.

## Don’t

- As content: it is `aria-hidden` and says nothing.
- Behind dense text or a form.
- For a plain texture — use `TextureMaterial`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- Hero` — the `background` slot it fills.
- NetworkMap`, `SpinningGlobe` — what it draws.
- TextureMaterial` — the dot lattice.
- Banner` — the announcement band (unrelated surface).

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `art` | `'globe' \ \| 'map' \ \| 'network'` | `'map'` | false | Which backdrop to draw. |
| `animated` | `boolean` | `true` | false | Spins the globe or pulses the PoPs; a still frame when false or under reduced motion. |

## States

- `data-art` mirrors `art`.

## Accessibility

- `aria-hidden="true"` and `pointer-events-none`: never announced, never in the way of a click.
- The washes keep the copy column at canvas contrast.

## Right-to-left

- The globe hangs off the inline-end rule and the washes run from the inline start in both directions (`rtl:` variants).
- Keyboard: not focusable.

## Internationalization

- Built-in strings: none.

## Responsive

- The globe is sized off the band height (a size container on the backdrop) and capped by `150vw` and `--container-5xl`.
- The map takes the full width below medium and the inline-end three fifths from medium.

## Examples

### Default

```vue
<script setup>
  import BannerArt from '@aziontech/webkit/banner-art'
  import Hero from '@aziontech/webkit/hero-root'
  import HeroTitle from '@aziontech/webkit/hero-title'
</script>

<template>
  <Hero
    kind="band"
    size="large"
    max-width="site"
  >
    <template #background>
      <BannerArt art="map" />
    </template>
    <HeroTitle
      eyebrow="Network"
      eyebrow-prefix="//"
      title="Close to every user, by default"
      description="Requests land on the nearest location and stay there."
    />
  </Hero>
</template>
```

### Arts

```vue
<script setup>
  import BannerArt from '@aziontech/webkit/banner-art'

  const arts = [
    { art: 'globe', label: 'Globe' },
    { art: 'map', label: 'Map' },
    { art: 'network', label: 'Network' }
  ]
</script>

<template>
  <div class="flex flex-col gap-(--spacing-md)">
    <div
      v-for="item in arts"
      :key="item.art"
      class="relative h-80 overflow-hidden border border-(--border-default) bg-(--bg-canvas)"
    >
      <BannerArt :art="item.art" />
      <p class="relative z-10 m-0 p-(--spacing-lg) text-heading-md text-(--text-default)">
        {{ item.label }}
      </p>
    </div>
  </div>
</template>
```
