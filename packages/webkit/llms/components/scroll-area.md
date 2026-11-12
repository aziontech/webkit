# Scroll Area

> Structural layout primitive for scrolling regions: native overflow with themed thin scrollbars and keyboard scrolling. With `fade`, the edges that still have content to scroll to fade out, each sized by the distance left on that side (capped at 64px or a sixth of the viewport), so a list reads as continuing past its frame. A sticky header inside the viewport keeps its full opacity; the top fade starts below it.

- Import: `import ScrollArea from '@aziontech/webkit/scroll-area'`
- Category: layout · Surface: product · Structure: monolithic
- API as JSON: [scroll-area.json](https://github.com/aziontech/webkit/blob/main/.specs/scroll-area.json)

## When to use

- A region that must scroll inside a bounded box: a navigation list, a panel body, a wide table (`orientation="horizontal"`), a code region (`orientation="both"`).
- A long list whose edges should fade while more content lies beyond them (`fade`).

## Do

- Give it a bounded height, or a flex parent that constrains it. Without a limit the content never overflows and nothing scrolls.
- The root is focusable (`tabindex` 0) and scrolls with the arrow keys, Page Up/Down and Home/End. Set `aria-label` when no visible heading names the region.
- Pass `tabindex="-1"` only when the content is itself focusable and keyboard users can already reach all of it.
- Match `orientation` to the overflow axis: `vertical` clips horizontal overflow, and `horizontal` clips vertical overflow.

## Don’t

- The region is one of several the reader resizes by dragging → use `resizable`, with a ScrollArea inside a pane if its content overflows.
- It is an application navigation rail → use `sidebar`, which already scrolls its items.
- It is a code sample → use `code-block`, which already scrolls its lines.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [sidebar](sidebar.md) — scrolls its navigation inside a built-in ScrollArea.
- [code-block](code-block.md) — runs its code lines in a ScrollArea with `orientation="both"`.
- [resizable](resizable.md) — draggable regions; each pane can hold a ScrollArea.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `orientation` | `'vertical' \| 'horizontal' \| 'both'` | `'vertical'` | false | Scroll direction: `vertical` (lists, sidebars), `horizontal` (wide tables), `both` for two-axis overflow. |
| `ariaLabel` | `string` | `''` | false | Accessible name when the region is not labelled by visible text; omit when content provides context. |
| `fade` | `boolean` | `false` | false | Fades the edges that still have content to scroll to, sized by the distance left on each side. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | — |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-fade` is present while `fade` is on and at least one edge has content beyond it; the per-edge fade lengths are exposed as `--scroll-area-fade-top|bottom|left|right` on the root.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses; `Enter`/`Space` activates; `Escape` closes overlays where applicable.
- ARIA: the viewport sets only `aria-label` (from the prop) and `tabindex` itself. Every other consumer attribute — `role`, `aria-*`, `id`, listeners — is forwarded to it, so a log body can be `role="log"` with `aria-live`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.

## Examples

### Default

```vue
<script setup>
  import ScrollArea from '@aziontech/webkit/scroll-area'
</script>

<template>
  <ScrollArea
    orientation="vertical"
    aria-label="Scrollable content"
    class="h-[200px] max-w-(--container-md) rounded-(--shape-elements) border border-(--border-default) p-(--spacing-4) text-body-sm text-(--text-default)"
  >
    Jokester began sneaking into the castle in the middle of the night and leaving jokes all over
    the place: under the king's pillow, in his soup, even in the royal toilet. The king was furious,
    but he couldn't seem to stop Jokester. And then one day, the king tripped over one of Jokester's
    whoopee cushions and fell into the moat. He was so embarrassed that he decided to make Jokester
    the official court jester.
  </ScrollArea>
</template>
```

### Orientations

```vue
<script setup>
  import ScrollArea from '@aziontech/webkit/scroll-area'
</script>

<template>
  <div class="flex flex-wrap items-start gap-(--spacing-6)">
    <ScrollArea
      orientation="vertical"
      aria-label="Vertical scroll"
      class="h-[160px] w-[240px] rounded-(--shape-elements) border border-(--border-default) p-(--spacing-3) text-body-sm text-(--text-default)"
    >
      <div class="h-[320px]">Tall content that scrolls along the vertical axis.</div>
    </ScrollArea>
    <ScrollArea
      orientation="horizontal"
      aria-label="Horizontal scroll"
      class="w-[240px] rounded-(--shape-elements) border border-(--border-default) p-(--spacing-3) text-body-sm text-(--text-default)"
    >
      <p class="m-0 w-max whitespace-nowrap">
        This line is intentionally wider than the container so horizontal scrolling is required.
      </p>
    </ScrollArea>
    <ScrollArea
      orientation="both"
      aria-label="Two-axis scroll"
      class="h-[160px] w-[240px] rounded-(--shape-elements) border border-(--border-default) p-(--spacing-3) text-body-sm text-(--text-default)"
    >
      <div class="h-[320px] w-[480px]">Tall and wide content for two-axis scrolling.</div>
    </ScrollArea>
  </div>
</template>
```

### Fade

```vue
<script setup>
  import ScrollArea from '@aziontech/webkit/scroll-area'
</script>

<template>
  <div class="flex flex-wrap items-start gap-(--spacing-6)">
    <div
      class="w-[280px] overflow-hidden rounded-(--shape-elements) border border-(--border-default)"
    >
      <ScrollArea
        fade
        aria-label="Deployments"
        class="h-[240px] p-(--spacing-xs)"
      >
        <ul class="m-0 flex list-none flex-col gap-(--spacing-xxs) p-0">
          <li
            class="rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)"
          >
            edge-app-production
          </li>
          <li
            class="rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)"
          >
            edge-app-staging
          </li>
          <li
            class="rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)"
          >
            marketing-site
          </li>
          <li
            class="rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)"
          >
            docs-portal
          </li>
          <li
            class="rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)"
          >
            image-optimizer
          </li>
          <li
            class="rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)"
          >
            api-gateway
          </li>
          <li
            class="rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)"
          >
            auth-service
          </li>
          <li
            class="rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)"
          >
            checkout-function
          </li>
          <li
            class="rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)"
          >
            search-indexer
          </li>
          <li
            class="rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)"
          >
            media-transcoder
          </li>
          <li
            class="rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)"
          >
            waf-rules-engine
          </li>
          <li
            class="rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)"
          >
            analytics-collector
          </li>
        </ul>
      </ScrollArea>
    </div>
    <div
      class="w-[280px] overflow-hidden rounded-(--shape-elements) border border-(--border-default)"
    >
      <ScrollArea
        fade
        orientation="horizontal"
        aria-label="Regions"
        class="p-(--spacing-xs)"
      >
        <div class="flex w-max gap-(--spacing-xs)">
          <span
            class="rounded-(--shape-elements) border border-(--border-default) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)"
            >São Paulo</span
          >
          <span
            class="rounded-(--shape-elements) border border-(--border-default) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)"
            >Miami</span
          >
          <span
            class="rounded-(--shape-elements) border border-(--border-default) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)"
            >Frankfurt</span
          >
          <span
            class="rounded-(--shape-elements) border border-(--border-default) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)"
            >Tokyo</span
          >
          <span
            class="rounded-(--shape-elements) border border-(--border-default) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)"
            >Sydney</span
          >
          <span
            class="rounded-(--shape-elements) border border-(--border-default) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-default)"
            >Mumbai</span
          >
        </div>
      </ScrollArea>
    </div>
  </div>
</template>
```
