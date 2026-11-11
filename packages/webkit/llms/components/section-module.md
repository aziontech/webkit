# Section Module

> The brick of the page column: a section whose header row is divided from its body by a hairline and which is divided from the module above it by another. Stacked inside a `section-container`, a run of modules reads as one continuous frame, because each module draws only its own top rule and hands its sides to the column. It is where a band's header and a band's content are joined, so no page has to re-draw that join.

- Import: `import SectionModule from '@aziontech/webkit/section-module'`
- Category: marketing · Surface: marketing · Structure: monolithic
- API as JSON: [section-module.json](https://github.com/aziontech/webkit/blob/main/.specs/section-module.json)

## When to use

- For every band stacked inside a `section-container`.
- Whenever a band needs a header row divided from its content by a rule.
- For a body-only band, by passing no title and no header slot.

## Do

- Pass `divided` as `false` on the first module in a column: its top edge is already the hero's bottom rule, and drawing its own would put two hairlines on one pixel.
- Pass `padded` as `false` when the body is an edge-to-edge `card-grid`, so the grid's rules meet the frame with no gutter.
- Use `title` and `eyebrow` for the ordinary header, and reach for the `header` slot only when the row needs markup the default header cannot express.

## Don’t

- For the full-bleed band at the top of a page → use `hero`.
- For the column the modules stack inside → use `section-container`.
- For the header alone, with no body → use `section-title`, which this module composes.
- For a hairline grid of cells → use `card-grid` inside this module's body.
- Built to be personalized (style seam): any class is accepted on the tag.

## Related

- [section-container](section-container.md) — the framed column this module stacks inside.
- [section-title](section-title.md) — the header row this module renders by default.
- [card-grid](card-grid.md) — the edge-to-edge cell grid a module's body commonly holds.
- [frame-box](frame-box.md) — the registration frame a body wraps itself in.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `''` | false | Headline of the module's header row, rendered as its `h2`. |
| `description` | `string` | `''` | false | Supporting sentence under the headline. |
| `eyebrow` | `string` | `''` | false | Short uppercase overline rendered above the headline. |
| `kind` | `SectionModuleKind` | `'left'` | false | Layout of the default header row. |
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
- `data-kind` carries the header layout
- `data-divided` present when the top rule is drawn
- `data-padded` present when the body is padded

## Accessibility

- Visible focus: not applicable — the module is a container; controls composed into it keep their own `focus-visible:ring-2 focus-visible:ring-(--ring-color)` ring.
- Keyboard map: none — the module is not focusable; `Tab` order is decided entirely by the slotted content.
- ARIA: the root renders a `section` and adds no role; the header's heading level comes from `section-title`, so a page's headings stay in order.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons) — the rules are non-informational decoration and the header and body own their own contrast.
- `motion-reduce:transition-none motion-reduce:transform-none` — not applicable, the component is static.
- Touch target ≥40×40 px — not applicable, no interactive control of its own.

## Examples

### Default

```vue
<script setup>
  import SectionModule from '@aziontech/webkit/section-module'
</script>

<template>
  <SectionModule
    eyebrow="Platform"
    title="Build, run, and protect applications"
    description="One sentence naming what the band is about."
  >
    <p class="m-0 text-body-md text-(--text-muted)">Everything the band has to say.</p>
  </SectionModule>
</template>
```

### Kinds

```vue
<script setup>
  import SectionModule from '@aziontech/webkit/section-module'
</script>

<template>
  <div>
    <SectionModule
      :divided="false"
      kind="left"
      eyebrow="Platform"
      title="Left"
    >
      <p class="m-0 text-body-md text-(--text-muted)">The header sits at the start edge.</p>
    </SectionModule>
    <SectionModule
      kind="centered"
      eyebrow="Platform"
      title="Centered"
    >
      <p class="m-0 text-body-md text-(--text-muted)">The header is centered.</p>
    </SectionModule>
    <SectionModule
      kind="horizontal"
      eyebrow="Platform"
      title="Horizontal"
      description="The description takes its own column."
    >
      <p class="m-0 text-body-md text-(--text-muted)">
        The headline and its description share a row.
      </p>
    </SectionModule>
  </div>
</template>
```

### Divided

```vue
<script setup>
  import SectionModule from '@aziontech/webkit/section-module'
</script>

<template>
  <div>
    <SectionModule
      :divided="false"
      title="First module"
    >
      <p class="m-0 text-body-md text-(--text-muted)">
        Its top edge belongs to the hero above it, so it draws none.
      </p>
    </SectionModule>
    <SectionModule title="Second module">
      <p class="m-0 text-body-md text-(--text-muted)">
        This one draws the rule that divides the two.
      </p>
    </SectionModule>
  </div>
</template>
```
