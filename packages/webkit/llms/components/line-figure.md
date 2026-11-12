# Line Figure

> An isometric line-art figure that answers the pointer: one per product (cache TTL, load balancer, DNS lookup, firewall, a 404 page and 20 more), drawn by a small engine into one SVG with the illustration tokens, so it follows the theme. Each figure loads on demand. The pointer, or focus with arrow keys, moves the figure through its answer; `play` walks it through on its own until a person arrives; under reduced motion it holds a still frame. From the design sample's `shared/ui/line-figure` (engine MIT, kept with its `LICENSE`). The figures are marketing assets, listed in the marketing inventory.

- Import: `import LineFigure from '@aziontech/webkit/line-figure'`
- Category: content · Surface: product · Structure: monolithic
- API as JSON: [line-figure.json](https://github.com/aziontech/webkit/blob/main/.specs/line-figure.json)

## When to use

- The art beside a product's copy on a landing or a docs home.
- An empty state or a not-found page (`azion-404`).

## Do

- One figure per view; two figures answering the pointer compete.
- Pass `aria-label` when the page says something more specific than the figure's own description.
- Use `play` only where nothing else moves.
- Take the name from `llms/foundations/line-figures.md` or `list_assets({ kind: "lineFigures" })`; an unknown name draws nothing.
- In a container that sizes to its content (the `EmptyState` `icon` slot, a centred flex column) the figure takes its natural 400×320 size, capped by the space available. Put it in a sized wrapper (`<div class="w-60 max-w-full">`) when the art should be smaller.

## Don’t

- For static, non-interactive art — use `Illustration`.
- For data — use the charts.
- Inside dense application screens.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- Illustration` — static art from the registry.
- ProductWidget`, `ShellMockup` — product scenes.
- EmptyState` — can carry a figure in its art slot.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `name` | `LineFigureName \| ''` | `''` | false | Registered figure to draw; an unknown or empty name draws nothing. |
| `intensity` | `number` | `0.5` | false | How strongly the figure answers the pointer, from 0 (subtle) to 1 (strong). |
| `play` | `boolean` | `false` | false | Walks the figure through its answer on its own until a pointer or focus arrives; a still frame under reduced motion. |
| `ariaLabel` | `string` | `''` | false | Accessible name; falls back to the figure's own English description. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `read` | `caption: string` | The figure's current reading each time it changes (the first reading on mount). |

## Assets

- Line figures: every valid name is in [line-figures.md](../foundations/line-figures.md) (MCP `list_assets({ kind: "lineFigures" })`). An unknown or empty name draws nothing.

## States

- `data-name` mirrors `name`; `data-play` is present while `play` is on.
- Empty: no role and an empty SVG for an unknown name.

## Accessibility

- `role="img"` named by `ariaLabel` or the figure description; the SVG is `aria-hidden`.
- The figure is not a control: it never takes focus on its own, and the page stays operable without it.
- Readings go out through `read`; a page that shows them should put them in a polite live region (see the Play example).

## Right-to-left

- Layout: the figure is a picture and is not mirrored (isometric art has no reading direction).
- Keyboard: unchanged.

## Internationalization

- Built-in strings: the 25 figure descriptions are English asset metadata (like an illustration's name), used only when `ariaLabel` is empty. A localized page passes `aria-label`.

## Responsive

- Fills its width at a 5:4 aspect; strokes stay 1px at every size (`vector-effect: non-scaling-stroke`).
- The SVG is in flow with a natural 400×320 size, so a parent that sizes to its content (a flex column with centred items, the `EmptyState` `icon` slot) gets a 400 px wide figure, never a 0 px one; a narrower container shrinks it, and a sized wrapper sets another size.

## Examples

### Default

```vue
<script setup>
  import LineFigure from '@aziontech/webkit/line-figure'
</script>

<template>
  <div class="max-w-(--container-sm)">
    <LineFigure name="cache-ttl" />
  </div>
</template>
```

### Play

```vue
<script setup>
  import LineFigure from '@aziontech/webkit/line-figure'
  import { ref } from 'vue'

  const reading = ref('')
</script>

<template>
  <div class="flex max-w-(--container-sm) flex-col gap-(--spacing-sm)">
    <LineFigure
      name="lb-rotor"
      play
      :intensity="0.8"
      @read="reading = $event"
    />
    <p
      class="m-0 text-body-sm text-(--text-muted)"
      aria-live="polite"
    >
      {{ reading }}
    </p>
  </div>
</template>
```

### Gallery

```vue
<script setup>
  import LineFigure from '@aziontech/webkit/line-figure'

  const names = [
    'azion-404',
    'build-terminal',
    'secure-shield',
    'infra-workloads',
    'ai-versioning',
    'store-replicas',
    'observe-stream',
    'platform-edge',
    'cache-ttl',
    'lb-rotor',
    'ddos-flood',
    'bot-lineup',
    'dns-lookup',
    'metrics-gauge',
    'image-variants',
    'orchestrator-scale',
    'functions-invoke',
    'applications-rules',
    'object-storage-bucket',
    'deployments-release',
    'variables-keys',
    'connectors-link',
    'custom-pages-status',
    'certificates-chain',
    'network-lists-gate'
  ]
</script>

<template>
  <ul class="m-0 grid list-none grid-cols-2 gap-(--spacing-md) p-0 md:grid-cols-4">
    <li
      v-for="name in names"
      :key="name"
      class="flex flex-col gap-(--spacing-xs)"
    >
      <LineFigure :name="name" />
      <span class="text-label-code-sm text-(--text-muted)">{{ name }}</span>
    </li>
  </ul>
</template>
```
