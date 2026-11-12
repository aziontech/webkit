# Search Trigger

> The field-shaped button in a top bar that opens search: a magnifier, a muted label (`Search` by default) and the keycap of the shortcut that opens the same palette (`⌘K` on macOS, `Ctrl K` elsewhere, drawn by `Kbd`). It looks like an input so the bar reads "you can search here", but it is one `<button>` that emits `open` — on click and on the shortcut itself, which it binds on the window unless a mounted `Command` already listens for it. The consumer opens `Command` (or its own search) from `open`. Every app header — console, demo, docs and site — carries one: it is the single way search is offered in a top bar. With `collapsible` it folds to the magnifier alone inside a narrow container (with its label as a tooltip), so one element serves the wide and the narrow bar.

- Import: `import SearchTrigger from '@aziontech/webkit/search-trigger'`
- Category: actions · Surface: product · Structure: monolithic
- API as JSON: [search-trigger.json](https://github.com/aziontech/webkit/blob/main/.specs/search-trigger.json)

## When to use

- The search entry of every app header — console, demo, docs or site top bar (`GlobalHeader.Right`) — that opens the `Command` palette or a search dialog. A header without it is incomplete.
- Anywhere a shortcut-backed launcher should look like a field without being one.

## Do

- Wire `@open` to the same state the shortcut opens (`<Command v-model:open="open">`), so the button and ⌘K never disagree. Without a `Command` on the page, `@open` also fires on ⌘K / Ctrl K, so a custom search dialog gets the shortcut for free.
- Keep `shortcut` equal to the key the `Command` root listens for (`K`), or clear it (`shortcut=""`) when no shortcut exists.
- Do not hand-roll the field (`<button>` + magnifier + `Kbd`) or put a bare magnifier `IconButton` in a header: the `webkit/header-search-trigger` lint rule flags both.
- With `collapsible`, put the bar inside an `@container` (the header blocks do); the trigger folds while that container is narrower than 47rem (752 px, the `--container-2xl` token) and without a container it stays folded. Do not add your own breakpoint around it: 47rem is the one threshold every header uses.
- With `collapsible`, the button sits inside the `Tooltip` wrapper, so put layout classes (`ms-auto`, `order-*`) on a parent, not on the trigger.
- Name the target in the label when the scope is narrow (`Search docs`); the label is also the accessible name.

## Don’t

- To type a query in place (filter a list, search a table) → use `Input` with a search icon, `PropertyFilter`, or the `Table` search part.
- For the palette itself → use `Command`; this only opens it.
- For an icon-only toolbar action that is not search → use `IconButton`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- Command` — the palette this button opens; when it is mounted it owns the global ⌘K / Ctrl+K listener and `v-model:open`, and the trigger stands its own listener down.
- Kbd` — draws the keycap with the OS-aware modifier glyph.
- IconButton` — the shape the trigger folds to when `collapsible` and the container is narrow.
- Tooltip` — shows the label over the folded magnifier on hover and focus.
- GlobalHeader` — the bar it sits in, usually in `GlobalHeader.Right`.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | `''` | false | Visible muted text and accessible name; empty uses the catalog's `Search`. |
| `shortcut` | `string` | `'K'` | false | Key that opens search with ⌘ or Ctrl: drawn in the keycap, announced through `aria-keyshortcuts` and bound on the window unless a mounted `Command` already listens for it; empty removes all three. |
| `collapsible` | `boolean` | `false` | false | Folds to the magnifier alone while the nearest container is narrower than 47rem (752px, the `--container-2xl` token); the label stays the accessible name and shows as a tooltip on hover and focus. |
| `disabled` | `boolean` | `false` | false | Disables the button and its shortcut; `open` is not emitted. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `open` | `MouseEvent \| KeyboardEvent` | Fires when the button is activated (pointer, Enter or Space) and on ⌘K / Ctrl K when no mounted `Command` claims that shortcut; not while `disabled`. |

## States

- Visual states: `default`, `hover` (border strengthens), `focus-visible` (ring), `disabled`.
- `data-disabled` mirrors `disabled`; `data-collapsible` mirrors `collapsible`.
- Folded (`collapsible` in a container narrower than 47rem): a `Tooltip` (`placement="bottom"`, test id `<testid>__tooltip`) shows the label on hover and focus. It is disabled while the trigger is unfolded or `disabled`; the trigger measures its own label with a `ResizeObserver` to know which form is drawn.
- Not applicable: `loading`, `empty`, `error`, `readonly`, `invalid`, `open`/`closed` (the palette owns open state).

## Accessibility

- Pattern: a WAI-ARIA APG **button** (`<button type="button">`); its accessible name is the label (`aria-label` keeps it when the label is visually hidden in the folded form).
- Shortcut: `aria-keyshortcuts="Meta+K Control+K"` (both chords `Command` listens for, so the server and the client render the same attribute) when `shortcut` is set; the keycap is `aria-hidden` so the name is not read twice.
- Keyboard map: `Tab` focuses; `Enter` and `Space` activate; `⌘K` / `Ctrl K` anywhere on the page opens search (handled by `Command` when one is mounted, otherwise by the trigger, which emits `open`).
- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`.
- Disabled: native `disabled` (out of the tab order, not announced as actionable); text and border keep ≥ 3:1 against the surface.
- Contrast: muted label ≥ 4.5:1 on `--bg-surface` in light and dark; magnifier ≥ 3:1.
- `motion-reduce:transition-none` on the colour transition.
- Touch target: drawn 32 px tall in the wide form and 32 × 32 px folded on every pointer, the same box as the header's `IconButton` medium neighbours. On a coarse pointer an invisible `aria-hidden` span (`data-slot="touch-target"`, `inset-[min(0rem,calc(50%-22px))]`, the `IconButton` technique) grows the hit area to at least 44 × 44 px without changing the drawn size.

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

- Container queries: with `collapsible`, while the nearest `@container` is narrower than 47rem (`@min-[47rem]`, 752 px, equal to the `--container-2xl` token) the label and keycap hide and the button becomes a 32 × 32 px square with a tooltip; from 47rem it is the field (`w-56`). The threshold is the design sample's measured one (the console bar with breadcrumb, Create, Agent and avatar runs out of room at 740 px of content box). It is written as `@min-[47rem]` and not `@2xl` because the theme ships its container scale in `:root`, not in `@theme`, so Tailwind's `@2xl` still compiles to its own 42rem.
- Narrow: without `collapsible` the label truncates with an ellipsis and the keycap stays.
- Touch: drawn at 32 px everywhere; the hit area grows invisibly to 44 px on `pointer: coarse`; no hover-only affordance (hover only strengthens the border; the folded tooltip also opens on focus).
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
  <SearchTrigger @open="open = true" />
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
