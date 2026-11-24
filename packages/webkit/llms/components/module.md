# Module

> The brick of the page column: a section whose header row is divided from its body by a hairline and which is divided from the module above it by another. Stacked inside a `container`, a run of modules reads as one continuous frame, because each module draws only its own top rule and hands its sides to the column. It is where a band's header and a band's content are joined, so no page has to re-draw that join.

- Import: `import Module from '@aziontech/webkit/module'`
- Category: layout · Surface: site · Structure: monolithic
- API as JSON: [module.json](module.json)

## When to use

- Use Module for each band inside Container.
- For every band stacked inside a `container`.
- Whenever a band needs a header row divided from its content by a rule.
- For a body-only band, by passing no title and no header slot.

## Do

- Pass `divided` as `false` on the first module in a column: its top edge is already the hero's bottom rule, and drawing its own would put two hairlines on one pixel.
- Pass `padded` as `false` when the body is an edge-to-edge `card-grid` or `doc-card-group`, so the grid's rules meet the frame with no gutter. The unpadded body's top and side edges are drawn for it, by the header's bottom rule and the column's two side rules, so a framed part placed directly in it (a `registration-frame`, and the `doc-card-group` built on one) drops its own top and side rules and its top corner marks instead of drawing a second hairline beside them. Its bottom rule stays and closes the body, so pass `divided` as `false` on the module that follows — two modules never stack two rules on one seam.
- Use `title` and `eyebrow` for the ordinary header, and reach for the `header` slot only when the row needs markup the default header cannot express.

## Don’t

- For the full-bleed band at the top of a page → use `hero`.
- For the column the modules stack inside → use `container`.
- For the header alone, with no body → use `module-header`, which this module composes.
- For a hairline grid of cells → use `card-grid` inside this module's body.
- Built to be personalized (style seam): any class is accepted on the tag.

## Related

- [container](container.md) — the framed column this module stacks inside.
- [module-header](module-header.md) — the header row this module renders by default.
- [card-grid](card-grid.md) — the edge-to-edge cell grid a module's body commonly holds.
- [registration-frame](registration-frame.md) — the registration frame a body wraps itself in.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `''` | false | Headline of the module's header row, rendered as its `h2`. |
| `description` | `string` | `''` | false | Supporting sentence under the headline. |
| `eyebrow` | `string` | `''` | false | Short uppercase overline rendered above the headline. |
| `align` | `ModuleAlign` | `'start'` | false | Layout of the default header row. |
| `divided` | `boolean` | `true` | false | Draw the top rule that divides this module from the one above it. |
| `padded` | `boolean` | `true` | false | Pad the module's body. Leave off for an edge-to-edge grid that owns its cell padding. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The module's body. |
| `header` | — | Replaces the default header row entirely. |
| `actions` | — | Trailing controls inside the default header row. |

## States

- Visual states: `default`
- `data-align` carries the header layout
- `data-divided` present when the top rule is drawn
- `data-padded` present when the body is padded
- `data-frame-edges` present on the body when it is not padded: the header and the column draw the body's top and side edges, so a `registration-frame` placed directly in it drops its own top and side rules and its top corner marks

## Accessibility

- Visible focus: not applicable — the module is a container; controls composed into it keep their own `focus-visible:ring-2 focus-visible:ring-(--ring-color)` ring.
- Keyboard map: none — the module is not focusable; `Tab` order is decided entirely by the slotted content.
- ARIA: the root renders a `section` and adds no role; the header's heading level comes from `module-header`, so a page's headings stay in order.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons) — the rules are non-informational decoration and the header and body own their own contrast.
- `motion-reduce:transition-none motion-reduce:transform-none` — not applicable, the component is static.
- Touch target ≥40×40 px — not applicable, no interactive control of its own.

## Examples

### Default

```vue
<script setup>
  import Module from '@aziontech/webkit/module'
</script>

<template>
  <Module
    eyebrow="Platform"
    title="Build, run, and protect applications"
    description="One sentence naming what the band is about."
  >
    <p class="m-0 text-body-md text-(--text-muted)">Everything the band has to say.</p>
  </Module>
</template>
```

### Alignments

```vue
<script setup>
  import Module from '@aziontech/webkit/module'
</script>

<template>
  <div>
    <Module
      :divided="false"
      align="start"
      eyebrow="Platform"
      title="Left"
    >
      <p class="m-0 text-body-md text-(--text-muted)">The header sits at the start edge.</p>
    </Module>
    <Module
      align="center"
      eyebrow="Platform"
      title="Centered"
    >
      <p class="m-0 text-body-md text-(--text-muted)">The header is centered.</p>
    </Module>
    <Module
      align="split"
      eyebrow="Platform"
      title="Horizontal"
      description="The description takes its own column."
    >
      <p class="m-0 text-body-md text-(--text-muted)">
        The headline and its description share a row.
      </p>
    </Module>
  </div>
</template>
```

### Divided

```vue
<script setup>
  import Module from '@aziontech/webkit/module'
</script>

<template>
  <div>
    <Module
      :divided="false"
      title="Deploy from Git"
      description="Connect a repository and every push builds a preview."
    >
      <p class="m-0 text-body-md text-(--text-muted)">
        Merges to the main branch go to production; every other branch gets its own preview URL.
      </p>
    </Module>
    <Module
      title="Roll back in one click"
      description="Every deploy stays available, so the previous release is always one step away."
    >
      <p class="m-0 text-body-md text-(--text-muted)">
        Promote any earlier deploy to production without rebuilding it.
      </p>
    </Module>
  </div>
</template>
```
