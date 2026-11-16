# Backdrop

> The decorative backdrop a site, hub or docs band stands on, for a `Hero` `background` slot or any band with `relative overflow-hidden`: `globe` hangs half a globe past the page's inline-end rule over the dot lattice, `map` insets the world map beside the copy, `network` lays the map full bleed with its PoPs lit, the sample's `MapMesh` traffic crossing between them (`NetworkMap` `traffic`: links and packets, the links alone as the still frame under reduced motion) and a scrim over the copy column. From the design sample's `shared/ui/banners` (GlobeBanner, MapBanner, NetworkBanner), drawn with WebKit's own `SpinningGlobe` and `NetworkMap` so there is one map and one globe in the system. The inventory's "`Banner` `art` variants" became this sibling component, `backdrop`: `Banner` is an announcement band with its own surfaces, and a backdrop layer is a different thing.

- Import: `import Backdrop from '@aziontech/webkit/backdrop'`
- Category: marketing · Surface: site · Structure: monolithic
- API as JSON: [backdrop.json](backdrop.json)

## When to use

- Behind the opening band of a landing, the hub or the docs home.

## Do

- One backdrop per page.
- Keep the copy at the inline start: every art is washed toward it.

## Don’t

- As content: it is `aria-hidden` and says nothing.
- Behind dense text or a form.
- For a plain texture — use `Texture`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- `Hero` — the `background` slot it fills.
- `NetworkMap`, `SpinningGlobe` — what it draws.
- `Texture` — the dot lattice.
- `Banner` — the announcement band (unrelated surface).

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `variant` | `BackdropVariant` | `'map'` | false | Which backdrop to draw: `globe`, `map` or `network`. |
| `animated` | `boolean` | `true` | false | Spins the globe or pulses the PoPs; a still frame when false or under reduced motion. |

## States

- `data-variant` mirrors the backdrop drawn.

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
  import Backdrop from '@aziontech/webkit/backdrop'
  import Hero from '@aziontech/webkit/hero-root'
  import HeroTitle from '@aziontech/webkit/hero-title'
</script>

<template>
  <Hero
    variant="band"
    size="large"
    max-width="site"
  >
    <template #background>
      <Backdrop variant="map" />
    </template>
    <HeroTitle
      eyebrow="Network"
      eyebrow-prefix="//"
      title="Close to every user, by default"
      description="Requests land on the nearest location and stay there."
      size="large"
    />
  </Hero>
</template>
```

### Arts

```vue
<script setup>
  import Backdrop from '@aziontech/webkit/backdrop'

  const arts = [
    { variant: 'globe', label: 'Globe' },
    { variant: 'map', label: 'Map' },
    { variant: 'network', label: 'Network' }
  ]
</script>

<template>
  <div class="flex flex-col gap-(--spacing-md)">
    <div
      v-for="item in arts"
      :key="item.variant"
      class="relative h-80 overflow-hidden border border-(--border-default) bg-(--bg-canvas)"
    >
      <Backdrop :variant="item.variant" />
      <p class="relative z-10 m-0 p-(--spacing-lg) text-heading-md text-(--text-default)">
        {{ item.label }}
      </p>
    </div>
  </div>
</template>
```
