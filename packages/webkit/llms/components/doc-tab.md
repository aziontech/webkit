# Doc Tab

> One panel inside `DocTabs`. It carries its title and its body only; `DocTabs` reads the title to build the strip. Rendered on its own it is a `display: contents` wrapper around its body.

- Import: `import DocTab from '@aziontech/webkit/doc-tab'`
- Category: documentation · Surface: docs · Structure: monolithic
- API as JSON: [doc-tab.json](https://github.com/aziontech/webkit/blob/main/.specs/doc-tab.json)

## When to use

- As a direct child of `DocTabs`.

## Do

- A short title: the platform or tool name.

## Don’t

- Outside `DocTabs` — it renders no tab of its own.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- DocTabs`.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `''` | false | The tab label; `DocTabs` reads it to build the strip. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The panel body. |

## States

- Visual states: `default` (`DocTabs` owns selection).

## Accessibility

- No role of its own; `DocTabs` renders the tab and the tabpanel.

## Right-to-left

- Layout: logical utilities only.
- Icons: none mirrored.
- Keyboard: unchanged (the underlying component handles arrow direction).

## Internationalization

- Built-in strings: none. Every visible string is content and arrives through props or slots, so the page supplies it in its own language.

## Responsive

- Inherits `DocTabs`.

## Examples

### Default

```vue
<script setup>
  import DocTab from '@aziontech/webkit/doc-tab'
  import DocTabs from '@aziontech/webkit/doc-tabs'
</script>

<template>
  <DocTabs>
    <DocTab title="Console">
      <p>Open the application, then Settings, then Domains.</p>
    </DocTab>
    <DocTab title="CLI">
      <p>Run the link command from the project folder.</p>
    </DocTab>
  </DocTabs>
</template>
```
