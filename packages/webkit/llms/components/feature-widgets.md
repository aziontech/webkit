# Feature Widgets

> The "three ways to start" band of a product page: a centered section title with up to two calls to action, over a bento grid where every cell is a live console scene (or an illustration) above a bold-led sentence and its affordances — a link button, a copy button that puts a prompt on the clipboard and confirms it with "Copied" for two seconds, or both. A cell's scene plays its beat while the pointer is over the cell. It is a page section — the site places it from a `{ _id: 'feature-widgets', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `button`, `registration-frame`, `bento-grid`, `illustration`, `highlight-button` and the webkit scene assets.

- Import: `import FeatureWidgets from '@aziontech/webkit/feature-widgets'`
- Category: section · Surface: site · Structure: monolithic
- API as JSON: [feature-widgets.json](feature-widgets.json)

## When to use

- Use FeatureWidgets when each cell has its own action or copy button.
- To offer the same outcome through two or three entry points (agent, console, terminal), each with its own next step.

## Do

- Give each item an `action` (a link), a `copy` (text to put on the clipboard), or both when the reader may want the docs and the prompt.
- On a product page give each item a `scene` naming a `ConsoleMockup` fragment (`{ component: 'ConsoleMockup', props: { name } }`); keep `illustration` for cells with no console to show.
- Keep `copy.text` self-contained; it is what the reader pastes into their agent.
- Set `anchor` when a hero button scrolls to this band.

## Don’t

- For reasons without an action per cell → use `feature-tiles` (with pictures) or `capability-grid` (without).
- For a long argument per feature → use `feature-scroll`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [bento-grid](bento-grid.md) — the grid the cells are laid in.
- [highlight-button](highlight-button.md) — the copy affordance a cell renders when it carries `copy`.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `anchor` | `string` | `''` | false | In-page id set on the band so a `#hash` link can scroll to it. |
| `eyebrow` | `string` | `''` | false | Eyebrow above the section title. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the section title as its `h2`, and the accessible name of the band. |
| `description` | `string` | `''` | false | Supporting sentence under the headline. |
| `primaryAction` | `SectionTitleAction` | `undefined` | false | First button under the headline; `{ label, href, trailing? }`. Omitted when absent. |
| `secondaryAction` | `SectionTitleAction` | `undefined` | false | Second, outlined button under the headline; `{ label, href, trailing? }` where `trailing` adds the chevron. Omitted when absent. |
| `titleAlign` | `SectionTitleAlign` | `'center'` | false | Alignment of the section title over the grid: `center`, `start` or `split`. |
| `columns` | `FeatureWidgetsColumns` | `2` | false | Column count of the grid from the medium breakpoint up: `2`, `3` or `4`. |
| `copiedLabel` | `string` | `''` | false | Label a cell's copy button shows for two seconds after a copy; empty uses the catalog's `Copied`. |
| `items` | `FeatureWidgetsItem[]` | `[]` | false | The cells, in order; each is `{ title, description, scene?, illustration?, action?, copy? }` where `scene` is `{ component, props? }` naming a webkit scene asset drawn in a 20rem window and handed `hover` while the pointer is over the cell, `illustration` is drawn when no scene is set, `action` is `{ label, href }` rendered as an outlined link button and `copy` is `{ label, text }` rendered as a copy button that puts `text` on the clipboard; a cell may carry both. |

## Assets

- Illustrations: every valid name is in [illustrations.md](../foundations/illustrations.md) (MCP `list_assets({ kind: "illustrations" })`). An unknown name renders a "PLACE DESIGN ASSET" placeholder and warns in the console.
- Diagrams: every valid name is in [diagrams.md](../foundations/diagrams.md) (MCP `list_assets({ kind: "diagrams" })`). An unknown name draws nothing.

## States

- Visual states: `default`
- Empty: when `items` is empty the band renders nothing — not the header, not the frame
- The header renders only when `title` is set; the two actions ride with it
- A cell's copy button writes `copy.text` to the clipboard on activation, then reads `copiedLabel` (or the catalog's `Copied`) with a check icon for two seconds before it returns to its label; the timer is cleared when the band unmounts. A failed write leaves the label as it was
- A cell with both `action` and `copy` renders the link button first, then the copy button
- Media per cell: `scene` wins over `illustration`; the scene receives `hover: true` while the pointer is over its cell (also on `pointermove`, so a pointer left still while the page scrolls under it counts). A scene name that is not registered draws nothing

## Accessibility

- Visible focus: owned by the composed `button` and `highlight-button`, which carry the `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` ring.
- Keyboard map: `Tab` moves between the header actions and each cell's buttons; `Enter` / `Space` activates. The scene's hover beat is decorative, so keyboard users lose nothing without it.
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the grid is an unnamed `bento-grid` inside that landmark, so the name is not duplicated; the cell lead is a `strong` inside the sentence, not a heading, so the outline stays the band's `h2`; the action row is a polite live region, so the copy button's "Copied" is announced.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): lead `var(--text-default)`, copy `var(--text-muted)`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the buttons' motion carries its own fallback; this band adds no motion.
- Touch target ≥40×40 px — the cell buttons are medium `button` / `highlight-button`.

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

### Live scenes

```vue
<script setup>
  import FeatureWidgets from '@aziontech/webkit/feature-widgets'

  const docs = 'https://www.azion.com/en/documentation/products/build/applications/'

  const items = [
    {
      title: 'Cache settings you reuse.',
      description:
        'Set the CDN TTL, stale cache and large file optimization once, then reuse the setting wherever the application needs it.',
      scene: { component: 'ConsoleMockup', props: { name: 'application-cache' } },
      action: { label: 'Docs', href: docs }
    },
    {
      title: 'Rules that decide what is cached.',
      description:
        'Match a path, a method or a header, and attach a cache setting to just that traffic.',
      scene: { component: 'ConsoleMockup', props: { name: 'application-rule' } },
      action: { label: 'Docs', href: docs }
    },
    {
      title: 'Functions for the cases rules miss.',
      description:
        'Rewrite cache headers on the response in a few lines of JavaScript, running in every data center before the response leaves.',
      scene: { component: 'ConsoleMockup', props: { name: 'application-function' } },
      action: { label: 'Docs', href: docs },
      copy: {
        label: 'Copy prompt',
        text: 'Write an Azion function that sets cache-control to public, max-age=3600 on every response from /assets.'
      }
    }
  ]
</script>

<template>
  <FeatureWidgets
    anchor="built-in"
    eyebrow="Built in"
    title="Every cache control in one application"
    description="Cache settings, the rules that apply them and the functions that shape responses live inside the application, versioned and deployed with it."
    :columns="3"
    :items="items"
  />
</template>
```
