# Doc Accordion Group

> The FAQ and "expand for detail" block of a documentation page. It reads the `title` of each `DocAccordion` child to build the triggers and renders the child body in the panel, so an author writes only titles and prose. It always ships as a card (surface, outer rule, radius) so a run of rows reads as one closed group in an open prose column. Built on `Accordion` at `size="large"`.

- Import: `import DocAccordionGroup from '@aziontech/ui/doc-accordion-group'`
- Category: docs · Surface: docs · Structure: monolithic
- API as JSON: [doc-accordion-group.json](doc-accordion-group.json)

## When to use

- Use DocAccordionGroup only inside documentation pages (Markdown AccordionGroup); product UI uses Accordion.
- A list of questions with answers at the end of a guide.
- Optional detail that would interrupt the main path of a page (edge cases, troubleshooting).

## Do

- Write each title as the full question the reader would ask.
- Keep answers short; link out for anything longer than a few paragraphs.
- Open at most one entry by default.

## Don’t

- For steps the reader must follow in order — use `DocSteps`.
- For alternative paths through the same instruction — use `Tabs`.
- Inside an application screen — use `Accordion` directly.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- `DocAccordion` — the entry it reads.
- `Accordion` — the design-system surface it renders on.
- `Faq` — the marketing FAQ band.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `type` | `'single' \| 'multiple'` | `'single'` | false | Whether one or several entries can be open at once. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The `DocAccordion` children, in order. Each child's `title` and `defaultOpen` are read; its body is rendered inside the panel. |

## States

- Each row mirrors `Accordion` `data-state=open|closed`.
- The last row drops its own bottom rule while closed so it does not double the card edge.
- `data-doc-block` puts the group on the block rung of `DocProse`.

## Accessibility

- Each trigger is a button inside an `h3`, with `aria-expanded` and `aria-controls` from `Accordion`.
- Keyboard: `Tab` between triggers, `Enter`/`Space` toggles (from `Accordion`).
- The focus ring is drawn inside the button (`ring-inset`) so the card clipping does not cut it.
- Contrast: `--text-default` on `--bg-surface` in both themes.

## Right-to-left

- Layout: logical utilities only.
- Icons: none mirrored.
- Keyboard: unchanged (the underlying component handles arrow direction).

## Internationalization

- Built-in strings: none. Every visible string is content and arrives through props or slots, so the page supplies it in its own language.

## Responsive

- Fills its column; triggers wrap with `text-wrap-style: pretty` so a wrapped question keeps its chevron at the inline end.
- Reflow: no horizontal scroll at 320 px.

## Examples

### Default

```vue
<script setup>
  import DocAccordion from '@aziontech/ui/doc-accordion'
  import DocAccordionGroup from '@aziontech/ui/doc-accordion-group'
</script>

<template>
  <DocAccordionGroup>
    <DocAccordion
      title="Why does my first request miss the cache?"
      default-open
    >
      <p>Each location warms up on its own first request. Warm-up is per location, not global.</p>
    </DocAccordion>
    <DocAccordion title="Can I purge a single path?">
      <p>Yes. Purge by URL for one object, or by wildcard for a folder.</p>
    </DocAccordion>
    <DocAccordion title="How long does a purge take to reach every location?">
      <p>Usually a few seconds. The purge request returns once every location has confirmed it.</p>
    </DocAccordion>
  </DocAccordionGroup>
</template>
```

### Multiple

```vue
<script setup>
  import DocAccordion from '@aziontech/ui/doc-accordion'
  import DocAccordionGroup from '@aziontech/ui/doc-accordion-group'
</script>

<template>
  <DocAccordionGroup type="multiple">
    <DocAccordion
      title="Which runtimes are supported?"
      default-open
    >
      <p>JavaScript and TypeScript, plus WebAssembly modules compiled from other languages.</p>
    </DocAccordion>
    <DocAccordion
      title="Is there a cold start?"
      default-open
    >
      <p>Isolates start in under a millisecond, so there is no warm-up to plan for.</p>
    </DocAccordion>
  </DocAccordionGroup>
</template>
```

### Markdown

```vue
<script setup>
  import DocMarkdown from '@aziontech/ui/doc-markdown'

  const source = [
    '<AccordionGroup>',
    '  <Accordion title="Why does my first request miss the cache?">',
    '    Each location warms up on its own first request.',
    '  </Accordion>',
    '  <Accordion title="Can I purge a single path?">',
    '    Yes. Purge by URL for one object, or by wildcard for a folder.',
    '  </Accordion>',
    '</AccordionGroup>'
  ].join('\n')
</script>

<template>
  <DocMarkdown :source="source" />
</template>
```
