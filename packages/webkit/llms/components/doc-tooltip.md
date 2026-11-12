# Doc Tooltip

> The inline gloss: a term in running prose that carries its own definition, shown when the reader hovers or focuses it. The trigger is a real button marked with a dotted underline — the convention print has used for a glossed term for a century — so the definition is reachable by keyboard and not only by pointer.

- Import: `import DocTooltip from '@aziontech/webkit/doc-tooltip'`
- Category: documentation · Surface: docs · Structure: monolithic
- API as JSON: [doc-tooltip.json](https://github.com/aziontech/webkit/blob/main/.specs/doc-tooltip.json)

## When to use

- A term a page uses in passing but cannot stop to define — a product name, an acronym, a unit.
- A definition worth one or two sentences, optionally closing on a "read more" link to the page that does stop to define it.

## Do

- Gloss the term where the reader first meets it, not every time it appears.
- Give `title` the term itself and `tip` the definition; that pairing is also what names the panel for assistive tech.
- Add `link-label` only with an `href`. A call to action needs somewhere to go, and its presence is what turns the panel into a dialog the reader can enter.

## Don’t

- To label an icon button or any control — that is `Tooltip`, the webkit hover hint: one line, on the contrast surface, `pointer-events-none`.
- For an aside the reader must not miss — a gloss is opt-in and easy to never open. Use `DocCallout`.
- For content longer than a couple of sentences, or anything with more than one link — that is a page, not a gloss.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- Tooltip` — the webkit hover hint on a control. A different object: one line, unable to hold a link the reader must travel to. The name collision is why this component keeps the `Doc` prefix.
- DocProse` — the prose this sits inside; the gloss marks itself `data-doc-chrome` so prose rules stop at its edge.
- Link` — the call-to-action inside an interactive panel.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `tip` | `string` | `''` | false | The definition shown inside the panel. |
| `title` | `string` | `''` | false | Bold lead-in above the definition — usually the term itself. |
| `linkLabel` | `string` | `''` | false | Label for the panel's call-to-action link. Needs `href`. |
| `href` | `string` | `''` | false | Destination for the call-to-action link. |
| `placement` | `'top' \| 'bottom' \| 'auto'` | `'top'` | false | Where the panel opens; `'auto'` picks the side with the most room. |
| `delay` | `number` | `150` | false | Hover-open delay in milliseconds. |
| `label` | `string` | `''` | false | Fallback trigger text when the default slot is empty. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The glossed term, rendered inline in the sentence. |

## States

- Visual states: `default`, `hover`, `focus-visible`, and `open`
- `data-state` on both the trigger and the panel: `open` | `closed`
- `data-interactive` is present only when the panel carries a call to action, which is what makes it a dialog rather than a tooltip
- `data-placement` on the panel records the side the placement composable resolved
- `data-doc-chrome` on both parts is the `DocProse` contract

## Accessibility

- Visible focus: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color)` on the trigger.
- **The call to action splits the contract in two, and the component follows the shape it actually has.** With no CTA the panel is a real `role="tooltip"` and the trigger takes `aria-describedby`. With a CTA it is a small `role="dialog"`, announced through `aria-expanded` + `aria-controls`, and named by its headline (or by the definition when there is none) so it is never an unlabelled group. A `role="tooltip"` holding a link is a trap: the link is unreachable to anyone not using a mouse.
- Keyboard map: `Tab` focuses the term and opens the panel; from the trigger, `Tab` enters an interactive panel; `Tab` or `Shift+Tab` inside the panel closes it and returns focus to the term, so the next `Tab` simply moves on; `Escape` closes and returns focus; `Enter` / `Space` toggles.
- Closing and returning focus is one move, not two: focusing the term fires `focusin`, which is the event that opens the panel, so a naive close-then-focus re-opened it and trapped the reader on the glossed word. One focus event is deliberately made inert to break that loop.
- Leaving an interactive panel is deferred by one short beat, because the pointer has to cross the offset gap to reach the CTA; closing on the first `mouseleave` makes that link unclickable. A passive panel has nothing to travel to and closes at once.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons).
- Touch target: the trigger is inline text, sized by the prose around it; tapping toggles rather than hovers.
- Teleported content: the teleported panel binds `dir` and `lang` from the nearest `WebkitProvider` (`usePortalLocale`), so it keeps the provider's direction and language although it renders under `body`. With no provider nothing is set and the document's own `dir` and `lang` apply.

## Examples

### Default

```vue
<script setup>
  import DocProse from '@aziontech/webkit/doc-prose'
  import DocTooltip from '@aziontech/webkit/doc-tooltip'
</script>

<template>
  <DocProse>
    <p>
      Every deploy produces an
      <DocTooltip
        title="Edge Application"
        tip="The build that runs at the edge, close to the people using it."
      >
        edge application
      </DocTooltip>
      built from your <code>azion.config.js</code>.
    </p>
  </DocProse>
</template>
```

### Kinds

```vue
<script setup>
  import DocProse from '@aziontech/webkit/doc-prose'
  import DocTooltip from '@aziontech/webkit/doc-tooltip'
</script>

<template>
  <DocProse>
    <p>
      A passive gloss just defines the term: a
      <DocTooltip
        title="workload"
        tip="The binding between a domain and the application that answers on it."
      >
        workload
      </DocTooltip>
      is the pairing the deploy creates. Its panel is a real tooltip describing the term.
    </p>
    <p>
      An interactive gloss closes on somewhere to go, so it is a small dialog instead: an
      <DocTooltip
        title="Edge Application"
        tip="The build that runs at the edge, close to the people using it."
        link-label="Read the guide"
        href="/docs/edge-application"
      >
        edge application
      </DocTooltip>
      can be read about at length.
    </p>
  </DocProse>
</template>
```
