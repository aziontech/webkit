# Search Trigger

> The field-shaped button in a top bar that opens search: a magnifier, a muted label (`Search` by default) and the keycap of the shortcut that opens the same palette (`⌘K` on macOS, `Ctrl K` elsewhere, drawn by `Kbd`). It looks like an input so the bar reads "you can search here", but it is one `<button>` that emits `click`; the consumer opens `Command` (or its own search) from it. With `collapsible` it folds to the magnifier alone inside a narrow container, so one element serves the wide and the narrow bar.

- Import: `import SearchTrigger from '@aziontech/webkit/search-trigger'`
- Category: actions · Surface: product · Structure: monolithic
- API as JSON: [search-trigger.json](https://github.com/aziontech/webkit/blob/main/.specs/search-trigger.json)

## When to use

- The search entry of a console, demo or docs top bar (`GlobalHeader` end region) that opens the `Command` palette or a search dialog.
- Anywhere a shortcut-backed launcher should look like a field without being one.

## Do

- Wire `@click` to the same state the shortcut opens (`<Command v-model:open="open">`), so the button and ⌘K never disagree.
- Keep `shortcut` equal to the key the `Command` root listens for (`K`), or clear it (`shortcut=""`) when no shortcut exists.
- With `collapsible`, put the bar inside an `@container` (the header blocks do); the trigger folds below the container's `2xl` size and without a container it stays folded.
- Name the target in the label when the scope is narrow (`Search docs`); the label is also the accessible name.

## Don’t

- To type a query in place (filter a list, search a table) → use `Input` with a search icon, `PropertyFilter`, or the `Table` search part.
- For the palette itself → use `Command`; this only opens it.
- For an icon-only toolbar action that is not search → use `IconButton`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- Command` — the palette this button opens; it owns the global ⌘K / Ctrl+K listener and `v-model:open`.
- Kbd` — draws the keycap with the OS-aware modifier glyph.
- IconButton` — the shape the trigger folds to when `collapsible` and the container is narrow.
- GlobalHeader` — the bar it sits in, usually in `GlobalHeader.Right`.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | `''` | false | Visible muted text and accessible name; empty uses the catalog's `Search`. |
| `shortcut` | `string` | `'K'` | false | Key drawn after the platform modifier in the keycap and announced through `aria-keyshortcuts`; empty hides the keycap. |
| `collapsible` | `boolean` | `false` | false | Folds to the magnifier alone below the nearest container's `2xl` size; the label stays the accessible name. |
| `disabled` | `boolean` | `false` | false | Disables the button; `click` is not emitted. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `click` | `MouseEvent` | Fires when the button is activated (pointer, Enter or Space); not while `disabled`. |

## States

- Visual states: `default`, `hover` (border strengthens), `focus-visible` (ring), `disabled`.
- `data-disabled` mirrors `disabled`; `data-collapsible` mirrors `collapsible`.
- Not applicable: `loading`, `empty`, `error`, `readonly`, `invalid`, `open`/`closed` (the palette owns open state).

## Accessibility

- Pattern: a WAI-ARIA APG **button** (`<button type="button">`); its accessible name is the label (`aria-label` keeps it when the label is visually hidden in the folded form).
- Shortcut: `aria-keyshortcuts="Meta+K Control+K"` (both chords `Command` listens for, so the server and the client render the same attribute) when `shortcut` is set; the keycap is `aria-hidden` so the name is not read twice.
- Keyboard map: `Tab` focuses; `Enter` and `Space` activate; the global shortcut belongs to `Command`.
- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`.
- Disabled: native `disabled` (out of the tab order, not announced as actionable); text and border keep ≥ 3:1 against the surface.
- Contrast: muted label ≥ 4.5:1 on `--bg-surface` in light and dark; magnifier ≥ 3:1.
- `motion-reduce:transition-none` on the colour transition.
- Touch target: 32 px tall in the wide form and 32 × 32 px folded on fine pointers (the `IconButton` medium it replaces); on coarse pointers `pointer-coarse:min-h-11` (and `pointer-coarse:min-w-11` folded) raises it to 44 px.

## Right-to-left

- Layout: logical utilities only (`ps-`/`pe-`, `gap-`, `text-start`); the magnifier leads at the inline start.
- Icons: the magnifier and the keycap are not mirrored.
- Keyboard: no arrow keys.
- User data: none; the keycap is `dir="ltr"` (from `Kbd`) so `⌘K` keeps its order.

## Internationalization

| Key                   | English source | Override prop |
| --------------------- | -------------- | ------------- |
| `searchTrigger.label` | `Search`       | `label`       |

- Formatting: none. The modifier glyph comes from `Kbd` (`kbd.ctrl` on non-Apple platforms).

## Responsive

- Container queries: with `collapsible`, below `@2xl` (the nearest `@container`) the label and keycap hide and the button becomes a 32 × 32 px square; from `@2xl` it is the field (`w-56`, shrinkable).
- Narrow: without `collapsible` the label truncates with an ellipsis and the keycap stays.
- Touch: ≥ 32 px on fine pointers, 44 px on `pointer: coarse`; no hover-only affordance (hover only strengthens the border).
- Reflow: no horizontal scroll at 320 px and 200 % zoom; the field shrinks to its content.

## Examples

### Default

```vue
<script setup>
  import Command from '@aziontech/webkit/command'
  import SearchTrigger from '@aziontech/webkit/search-trigger'
  import { ref } from 'vue'

  const open = ref(false)
  const pages = ['Workloads', 'Applications', 'Functions', 'Firewall']
</script>

<template>
  <SearchTrigger @click="open = true" />
  <Command
    v-model:open="open"
    shortcut="meta+k"
    @select="open = false"
  >
    <Command.Input placeholder="Search pages" />
    <Command.List>
      <Command.Empty>No results.</Command.Empty>
      <Command.Group heading="Pages">
        <Command.Item
          v-for="page in pages"
          :key="page"
          :value="page"
          >{{ page }}</Command.Item
        >
      </Command.Group>
    </Command.List>
  </Command>
</template>
```

### Collapsible

```vue
<script setup>
  import SearchTrigger from '@aziontech/webkit/search-trigger'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-md)">
    <div
      class="@container w-64 rounded-(--shape-elements) border border-(--border-default) p-(--spacing-sm)"
    >
      <SearchTrigger collapsible />
    </div>
    <div
      class="@container w-full max-w-3xl rounded-(--shape-elements) border border-(--border-default) p-(--spacing-sm)"
    >
      <SearchTrigger
        collapsible
        label="Search docs"
      />
    </div>
  </div>
</template>
```

### Disabled

```vue
<script setup>
  import SearchTrigger from '@aziontech/webkit/search-trigger'
</script>

<template>
  <SearchTrigger disabled />
</template>
```
