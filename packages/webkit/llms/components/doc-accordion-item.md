# Doc Accordion Item

> One collapsible entry inside a `DocAccordionGroup`. It carries its title and its body only; the group owns the open-state model, the trigger and the panel. Rendered on its own it is a `display: contents` wrapper around its body.

- Import: `import DocAccordionItem from '@aziontech/webkit/doc-accordion-item'`
- Category: documentation · Surface: docs · Structure: monolithic
- API as JSON: [doc-accordion-item.json](https://github.com/aziontech/webkit/blob/main/.specs/doc-accordion-item.json)

## When to use

- As a direct child of `DocAccordionGroup`.

## Do

- Keep the title a question; keep the body prose.

## Don’t

- Outside a `DocAccordionGroup` — it renders no trigger of its own.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- DocAccordionGroup` — the group that reads it.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `''` | false | The question the trigger shows; `DocAccordionGroup` reads it to build the row. |
| `defaultOpen` | `boolean` | `false` | false | Opens this entry on first render. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The answer shown when the entry is open. |

## States

- Visual states: `default` (the group owns open and closed).

## Accessibility

- No role of its own; the group renders the heading, the button and the region.

## Right-to-left

- Layout: logical utilities only.
- Icons: none mirrored.
- Keyboard: unchanged (the underlying component handles arrow direction).

## Internationalization

- Built-in strings: none. Every visible string is content and arrives through props or slots, so the page supplies it in its own language.

## Responsive

- Inherits the group.

## Examples

### Default

```vue
<script setup>
  import DocAccordionGroup from '@aziontech/webkit/doc-accordion-group'
  import DocAccordionItem from '@aziontech/webkit/doc-accordion-item'
</script>

<template>
  <DocAccordionGroup>
    <DocAccordionItem
      title="Can I keep a stale object while the origin is down?"
      default-open
    >
      <p>
        Yes. Turn on stale cache and the last good copy is served until the origin answers again.
      </p>
    </DocAccordionItem>
  </DocAccordionGroup>
</template>
```
