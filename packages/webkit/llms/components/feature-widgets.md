# Feature Widgets

> The "three ways to start" band of a product page: a centered section title with up to two calls to action, over a bento grid where every cell is an illustration above a bold-led sentence and one affordance — a link button or a copy button that puts a prompt on the clipboard. It is a page section — the site places it from a `{ _id: 'feature-widgets', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `button`, `frame-box`, `bento-grid`, `illustration` and `button-highlight`.

- Import: `import FeatureWidgets from '@aziontech/webkit/feature-widgets'`
- Category: sections · Surface: marketing · Structure: monolithic
- API as JSON: [feature-widgets.json](https://github.com/aziontech/webkit/blob/main/.specs/feature-widgets.json)

## When to use

- To offer the same outcome through two or three entry points (agent, console, terminal), each with its own next step.

## Do

- Give each item exactly one of `action` (a link) or `copy` (text to put on the clipboard).
- Keep `copy.text` self-contained; it is what the reader pastes into their agent.
- Set `anchor` when a hero button scrolls to this band.

## Don’t

- For reasons without an action per cell → use `feature-tiles`.
- For a long argument per feature → use `feature-scroll`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [bento-grid](bento-grid.md) — the grid the cells are laid in.
- [button-highlight](button-highlight.md) — the copy affordance a cell renders when it carries `copy`.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `anchor` | `string` | `''` | false | In-page id set on the band so a `#hash` link can scroll to it. |
| `eyebrow` | `string` | `''` | false | Overline above the section title. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the centered section title as its `h2`, and the accessible name of the band. |
| `description` | `string` | `''` | false | Supporting sentence under the headline. |
| `primaryAction` | `FeatureWidgetsAction` | `undefined` | false | First button under the headline; `{ label, href, trailing? }`. Omitted when absent. |
| `secondaryAction` | `FeatureWidgetsAction` | `undefined` | false | Second, outlined button under the headline; `{ label, href, trailing? }` where `trailing` adds the chevron. Omitted when absent. |
| `columns` | `FeatureWidgetsColumns` | `3` | false | Column count of the grid from the medium breakpoint up: `2`, `3` or `4`. |
| `items` | `FeatureWidgetsItem[]` | `[]` | false | The cells, in order; each is `{ title, description, illustration, action?, copy? }` where `action` is `{ label, href }` rendered as an outlined link button and `copy` is `{ label, text }` rendered as a copy button that puts `text` on the clipboard. |

## Assets

- Illustrations: every valid name is in [illustrations.md](../foundations/illustrations.md) (MCP `list_assets({ kind: "illustrations" })`). An unknown name renders a "PLACE DESIGN ASSET" placeholder and warns in the console.

## States

- Visual states: `default`
- Empty: when `items` is empty the band renders nothing — not the header, not the frame
- The header renders only when `title` is set; the two actions ride with it
- A cell's copy button writes `copy.text` to the clipboard on activation; the feedback is `button-highlight`'s own

## Accessibility

- Visible focus: owned by the composed `button` and `button-highlight`, which carry the `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` ring.
- Keyboard map: `Tab` moves between the header actions and each cell's button; `Enter` / `Space` activates.
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the grid is an unnamed `bento-grid` inside that landmark, so the name is not duplicated; the cell lead is a `strong` inside the sentence, not a heading, so the outline stays the band's `h2`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): lead `var(--text-default)`, copy `var(--text-muted)`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the buttons' motion carries its own fallback; this band adds no motion.
- Touch target ≥40×40 px — the cell buttons are medium `button` / `button-highlight`.

## Examples

### Default

```vue
<script setup>
  import FeatureWidgets from '@aziontech/webkit/feature-widgets'
</script>

<template>
  <FeatureWidgets
    anchor="get-started"
    eyebrow="Get started"
    title="Start where you already work"
    description="The same function, three ways to ship it. Hand it to a coding agent, build it in the Console, or deploy it from the terminal."
    :primary-action="{ label: 'Start for free', href: '/signup' }"
    :secondary-action="{ label: 'Docs', href: '/site/docs', trailing: true }"
    :columns="3"
    :items="[
      {
        title: 'Ask your coding agent',
        description:
          'Connect the Azion MCP servers to Claude Code, Cursor or ChatGPT, and the agent creates, instances and routes the function, with a dry run before every write.',
        illustration: 'deploy-secure-mcp-server',
        copy: {
          label: 'Copy prompt',
          text: 'Create a function that answers 401 when a request has no Authorization header.'
        }
      },
      {
        title: 'Build it in the Console',
        description:
          'Choose the application it runs on, write the handler in the editor, name it, and create it. The rule that runs it is drafted for you.',
        illustration: 'build-applications',
        action: { label: 'Docs', href: '/site/docs' }
      },
      {
        title: 'Ship it from the terminal',
        description:
          'azion init scaffolds from 25 presets, azion dev serves it on localhost:3333, and azion deploy puts it on a live domain.',
        illustration: 'quick-start-with-templates',
        action: { label: 'Docs', href: '/site/docs' }
      }
    ]"
  />
</template>
```
