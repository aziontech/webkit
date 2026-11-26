# Container

> The framed content column: a centered, width-capped block carrying only its two vertical rules, which every section below a hero stacks inside. It is the middle layer of the page language — the hero above it owns the page's top rule, the footer below it owns the bottom, and this column owns the sides — so a page's frame is drawn once, by three components, instead of by every band that happens to need an edge.

- Import: `import Container from '@aziontech/webkit/container'`
- Category: layout · Surface: site · Structure: monolithic
- API as JSON: [container.json](container.json)

## When to use

- Use Container once per marketing page as the framed column below the hero.
- As the container for every band below a `hero`, on a marketing, hub or documentation page.
- Whenever a stack of `module` bricks needs one continuous frame around it.
- For a plain prose column that should sit on the page's own measure, with `padded`.

## Do

- Leave `padded` off for a stack of modules: each brick owns its own padding, and column padding would double it and pull the bricks off the frame.
- Match `maxWidth` to the `hero` above it so the band's content and the column's content open on one vertical.
- Turn `bordered` off only for a column nested inside another frame, where the outer frame already draws the sides.

## Don’t

- For the full-bleed band at the top of a page → use `hero`, which is the hero rule.
- For one band inside the column → use `module`, the brick this container stacks.
- For a hairline grid of cells → use `card-grid`, which draws its rules as gaps.
- For a bordered box around arbitrary content → use `registration-frame`.
- Built to be personalized (style seam): any class is accepted on the tag.

## Related

- [hero](hero.md) — the full-bleed opening band above this column; its `border-b` is this column's top edge.
- [module](module.md) — the brick stacked inside this column.
- [card-grid](card-grid.md) — the hairline cell grid a module's body holds.
- [registration-frame](registration-frame.md) — the registration frame a module wraps its body in.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `maxWidth` | `ContainerWidth` | `'7xl'` | false | Width the column is capped at; `site` is the marketing measure every band of that page frame shares. |
| `bordered` | `boolean` | `true` | false | Draw the column's two vertical rules. |
| `padded` | `boolean` | `false` | false | Pad the column itself. Leave off for a stack of modules that own their padding. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The bands stacked inside the column, in reading order. |

## States

- Visual states: `default`
- `data-width` carries the resolved width key
- `data-bordered` present when the vertical rules are drawn
- `data-padded` present when the column pads its own content

## Accessibility

- Visible focus: not applicable — the column is a container and holds no interactive surface of its own.
- Keyboard map: none — the column is not focusable; `Tab` order is decided entirely by the slotted content.
- ARIA: the root adds no role, so the slotted content's semantics reach the accessibility tree unchanged.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons) — the rules are non-informational decoration and the slotted content owns its own contrast.
- `motion-reduce:transition-none motion-reduce:transform-none` — not applicable, the component is static.
- Touch target ≥40×40 px — not applicable, no interactive control.

## Examples

### Default

```vue
<script setup>
  import Container from '@aziontech/webkit/container'
  import RegistrationFrame from '@aziontech/webkit/registration-frame'
</script>

<template>
  <Container max-width="7xl">
    <RegistrationFrame borders="y">
      <div class="p-(--spacing-xl) text-center text-body-md text-(--text-muted)">First band</div>
    </RegistrationFrame>
    <RegistrationFrame
      flush
      borders="y"
      marks="bottom"
    >
      <div class="p-(--spacing-xl) text-center text-body-md text-(--text-muted)">Second band</div>
    </RegistrationFrame>
  </Container>
</template>
```

### Widths

```vue
<script setup>
  import Container from '@aziontech/webkit/container'
  import RegistrationFrame from '@aziontech/webkit/registration-frame'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <Container max-width="4xl">
      <RegistrationFrame borders="y"
        ><div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
          4xl
        </div></RegistrationFrame
      >
    </Container>
    <Container max-width="6xl">
      <RegistrationFrame borders="y"
        ><div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
          6xl
        </div></RegistrationFrame
      >
    </Container>
    <Container max-width="site">
      <RegistrationFrame borders="y"
        ><div class="p-(--spacing-lg) text-center text-body-md text-(--text-muted)">
          site
        </div></RegistrationFrame
      >
    </Container>
  </div>
</template>
```

### Bordered

```vue
<script setup>
  import Container from '@aziontech/webkit/container'
  import RegistrationFrame from '@aziontech/webkit/registration-frame'
</script>

<template>
  <Container :bordered="false">
    <RegistrationFrame borders="y">
      <div class="p-(--spacing-xl) text-center text-body-md text-(--text-muted)">
        A column inside another frame draws no sides
      </div>
    </RegistrationFrame>
  </Container>
</template>
```
