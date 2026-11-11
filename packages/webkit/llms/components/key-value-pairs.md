# Key Value Pairs

> A grid of labelled facts about one subject: each pair is a key (the term) and its value, which may be plain text or a composed component such as a `Link`, `Tag`, `CopyButton` or `StatusIndicator`. It renders a native description list laid out in 1 to 4 responsive columns, optionally split into titled groups, and owns its loading and empty-value surfaces. It replaces the hand-rolled label/value grids the resource detail templates (`ResourceSummary`, the detail Overview tabs) draw today.

- Import: `import KeyValuePairsRoot from '@aziontech/webkit/key-value-pairs-root'`
- Compound import (dot notation, not tree-shakeable): `import KeyValuePairs from '@aziontech/webkit/key-value-pairs'`
- Category: content · Surface: product · Structure: composition
- API as JSON: [key-value-pairs.json](https://github.com/aziontech/webkit/blob/main/.specs/key-value-pairs.json)

## When to use

- The facts band of a resource detail or Overview page: ID, status, region, created at, domain.
- A read-only summary of settings before a confirm step (review step, deploy summary).
- Any set of named attributes of a single subject where the reader scans keys to find a value.
- Facts that fall into named clusters (General, Networking, Source) shown side by side as titled columns.

## Do

- Keep keys short nouns in sentence case ("Created", "Region"), never sentences or trailing colons.
- Order pairs by what the reader looks for first: identity, status, then the rest.
- Use `columns` for width, not for grouping; use `KeyValuePairs.Group` when the facts form named clusters, one group per column.
- Do not mix bare Items and Groups at the same level; pick one shape per instance.
- Leave the value slot out (or render nothing in it) when a value is absent; the component shows the em dash and its accessible "Not set". Do not type your own "-", "N/A" or "None".
- Put a `CopyButton` after an ID or key, never in place of the visible value.
- Use the `info` slot for a short `Hint` that explains the key; long explanations belong in the page, not in a tooltip.
- Drive `loading` from the data request so the labels stay in place and only the values shimmer.

## Don’t

- Rows of many subjects compared attribute by attribute → use `table`.
- Editable fields → use the form field components (`field` with `input`, `select`, …); this component is read-only.
- A single headline figure with a trend → use `stat-tile`.
- A list of items with no key/value relation → use a plain list or `item`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [table](table.md) — many subjects, one row each; KeyValuePairs describes one subject.
- [card](card.md) — the surface a KeyValuePairs usually sits in; KeyValuePairs brings no surface of its own.
- [copy-button](copy-button.md) — the trailing copy affordance for IDs and keys inside a value.
- [status-indicator](status-indicator.md), `tag` — status and category values.
- [link](link.md) — a value that navigates (a domain, a linked resource).
- [hint](hint.md) — the info glyph composed into an Item's `info` slot.
- [skeleton](skeleton.md) — rendered in place of each value while the root is `loading`.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `columns` | `1 \| 2 \| 3 \| 4` | `1` | false | Columns at full width; fewer columns when a cell would get narrower than `--container-3xs`. |
| `loading` | `boolean` | `false` | false | Replaces every value with a skeleton while the data loads; labels stay visible. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the list when no visible heading names it. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | KeyValuePairs.Item` children, or `KeyValuePairs.Group` children — one shape per instance. |

## Sub-component imports

- `@aziontech/webkit/key-value-pairs-item`
- `@aziontech/webkit/key-value-pairs-group`

## Sub-components

The root `key-value-pairs.vue` renders a `<dl>` that is the grid. It provides a context (`injection-key.ts` + `composables/use-key-value-pairs-context.ts`) holding the root test id and the `loading` state, read-only. Every part throws a clear error when used outside `<KeyValuePairs>`.

Markup is valid HTML in both shapes: an Item is a `<div>` wrapping one `<dt>` and one `<dd>` (allowed as a direct child of `<dl>`). A Group is also a `<div>` child of the root `<dl>`: its title is the `<dt>`, and its `<dd>` holds a nested `<dl>` with the group's Items — a term whose description is a list of pairs. A heading element is not used for the group title because `<dt>` does not allow heading content.

- `key-value-pairs.vue` — the root: the `<dl>` grid, the `columns` layout, `aria-label`, `aria-busy`, the context.
- `key-value-pairs-item/key-value-pairs-item.vue` — one pair: `<div>` → `<dt>` (label + `info`) + `<dd>` (value).
  - Props: `label: string` (required — the key, rendered in the `<dt>`).
  - Events: _none_.
  - Slots: `default` — the value (text or composed components); fallback is the empty-value marker (`<span aria-hidden="true">—</span><span class="sr-only">Not set</span>`), shown when the slot is omitted or renders nothing. `info` — optional affordance after the label text inside the `<dt>`, such as a `Hint`.
  - While the root is `loading`, the `<dd>` renders a `Skeleton` in place of the value; the label stays visible.
  - `data-testid` fallback `${rootTestId}-item`; a consumer `data-testid` on the Item wins.
- `key-value-pairs-group/key-value-pairs-group.vue` — a titled column: `<div>` → `<dt>` (title) + `<dd>` → nested `<dl>` stacking its Items in one column.
  - Props: `title: string` (required — the group's term, shown above its Items).
  - Events: _none_.
  - Slots: `default` — the group's `KeyValuePairs.Item` children.
  - Occupies one cell of the root grid, so `columns` sets how many groups sit side by side.
  - `data-testid` fallback `${rootTestId}-group`; a consumer `data-testid` on the Group wins.

## States

- Visual states: `default`, `loading`, empty value (per Item)
- `data-columns` on the root mirrors `columns` and drives the grid template through `data-[columns=n]:` variants
- `data-loading` on the root mirrors `loading`; `aria-busy="true"` while loading
- Empty value: the Item's `<dd>` shows `—` (`aria-hidden`) plus a visually hidden "Not set"
- Responsive columns follow the list's own box, not the viewport: the grid is `repeat(auto-fill, minmax(min(100%, max(--container-3xs, share)), 1fr))`, where the share is the box divided by `columns`. It shows `columns` columns when every cell gets at least `--container-3xs` (256 px), fewer otherwise, and one column in a narrow box; a list in a drawer or split view lays out for that box.

- No `disabled`, `invalid`, `readonly`, `error`, `open` states: the component is read-only and fetches nothing. An error loading the facts is the page's surface (e.g. `message`), not this component's.

## Accessibility

- Native description list: root `<dl>`, each Item `<div>` → `<dt>` + `<dd>`; each Group `<div>` → `<dt>` + `<dd>` → nested `<dl>`. Screen readers announce term/definition pairs with no ARIA roles added.
- `ariaLabel` is applied as `aria-label` on the root `<dl>` only when non-empty; when a visible heading precedes the list, the consumer names it with `aria-labelledby` through `$attrs` instead.
- Loading: `aria-busy="true"` on the root; each `Skeleton` is decorative (`aria-hidden`), so assistive tech reads the labels and waits for the values.
- Empty value: `—` is `aria-hidden="true"`; a `sr-only` "Not set" gives the `<dd>` an announced value.
- Keyboard map: the component itself has no tab stop. Focus moves only through interactive values and `info` affordances (`Link`, `CopyButton`, `Hint`) in reading order, each with its own focus ring and key handling.
- Reading order follows source order: row by row across the grid, top to bottom inside a group.
- Contrast: `var(--text-muted)` keys and `var(--text-default)` values at ≥4.5:1 on `var(--bg-surface)` and `var(--bg-canvas)` in both themes.
- No motion of its own; the composed `Skeleton` carries `motion-reduce:animate-none`.
- Touch targets belong to the composed interactive values; the component adds none.

## Examples

### Default

```vue
<script setup>
  import KeyValuePairs from '@aziontech/webkit/key-value-pairs'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Link from '@aziontech/webkit/link'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
</script>

<template>
  <KeyValuePairs aria-label="Workload details">
    <KeyValuePairs.Item label="Workload ID">
      <span>1752167890</span>
      <CopyButton
        value="1752167890"
        aria-label="Copy workload ID"
      />
    </KeyValuePairs.Item>
    <KeyValuePairs.Item label="Status">
      <StatusIndicator
        severity="success"
        label="Active"
      />
    </KeyValuePairs.Item>
    <KeyValuePairs.Item label="Created">Nov 10, 2026, 14:32</KeyValuePairs.Item>
    <KeyValuePairs.Item label="Region">South America (São Paulo)</KeyValuePairs.Item>
    <KeyValuePairs.Item label="Domain">
      <Link
        label="shop.example.com"
        href="https://shop.example.com"
        size="small"
      />
    </KeyValuePairs.Item>
  </KeyValuePairs>
</template>
```

### Columns

```vue
<script setup>
  import KeyValuePairs from '@aziontech/webkit/key-value-pairs'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Link from '@aziontech/webkit/link'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xl)">
    <KeyValuePairs
      :columns="2"
      aria-label="Workload details in two columns"
    >
      <KeyValuePairs.Item label="Workload ID">
        <span>1752167890</span>
        <CopyButton
          value="1752167890"
          aria-label="Copy workload ID"
        />
      </KeyValuePairs.Item>
      <KeyValuePairs.Item label="Status">
        <StatusIndicator
          severity="success"
          label="Active"
        />
      </KeyValuePairs.Item>
      <KeyValuePairs.Item label="Created">Nov 10, 2026, 14:32</KeyValuePairs.Item>
      <KeyValuePairs.Item label="Region">South America (São Paulo)</KeyValuePairs.Item>
      <KeyValuePairs.Item label="Domain">
        <Link
          label="shop.example.com"
          href="https://shop.example.com"
          size="small"
        />
      </KeyValuePairs.Item>
    </KeyValuePairs>
    <KeyValuePairs
      :columns="3"
      aria-label="Workload details in three columns"
    >
      <KeyValuePairs.Item label="Workload ID">
        <span>1752167890</span>
        <CopyButton
          value="1752167890"
          aria-label="Copy workload ID"
        />
      </KeyValuePairs.Item>
      <KeyValuePairs.Item label="Status">
        <StatusIndicator
          severity="success"
          label="Active"
        />
      </KeyValuePairs.Item>
      <KeyValuePairs.Item label="Created">Nov 10, 2026, 14:32</KeyValuePairs.Item>
      <KeyValuePairs.Item label="Region">South America (São Paulo)</KeyValuePairs.Item>
      <KeyValuePairs.Item label="Domain">
        <Link
          label="shop.example.com"
          href="https://shop.example.com"
          size="small"
        />
      </KeyValuePairs.Item>
    </KeyValuePairs>
    <KeyValuePairs
      :columns="4"
      aria-label="Workload details in four columns"
    >
      <KeyValuePairs.Item label="Workload ID">
        <span>1752167890</span>
        <CopyButton
          value="1752167890"
          aria-label="Copy workload ID"
        />
      </KeyValuePairs.Item>
      <KeyValuePairs.Item label="Status">
        <StatusIndicator
          severity="success"
          label="Active"
        />
      </KeyValuePairs.Item>
      <KeyValuePairs.Item label="Created">Nov 10, 2026, 14:32</KeyValuePairs.Item>
      <KeyValuePairs.Item label="Region">South America (São Paulo)</KeyValuePairs.Item>
      <KeyValuePairs.Item label="Domain">
        <Link
          label="shop.example.com"
          href="https://shop.example.com"
          size="small"
        />
      </KeyValuePairs.Item>
    </KeyValuePairs>
  </div>
</template>
```

### Groups

```vue
<script setup>
  import KeyValuePairs from '@aziontech/webkit/key-value-pairs'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Hint from '@aziontech/webkit/hint'
  import Link from '@aziontech/webkit/link'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
</script>

<template>
  <KeyValuePairs
    :columns="3"
    aria-label="Workload details"
  >
    <KeyValuePairs.Group title="General">
      <KeyValuePairs.Item label="Workload ID">
        <span>1752167890</span>
        <CopyButton
          value="1752167890"
          aria-label="Copy workload ID"
        />
      </KeyValuePairs.Item>
      <KeyValuePairs.Item label="Status">
        <StatusIndicator
          severity="success"
          label="Active"
        />
      </KeyValuePairs.Item>
      <KeyValuePairs.Item label="Created">Nov 10, 2026, 14:32</KeyValuePairs.Item>
    </KeyValuePairs.Group>
    <KeyValuePairs.Group title="Networking">
      <KeyValuePairs.Item label="Domain">
        <Link
          label="shop.example.com"
          href="https://shop.example.com"
          size="small"
        />
      </KeyValuePairs.Item>
      <KeyValuePairs.Item label="Region">
        <template #info>
          <Hint text="Where the workload was first provisioned." />
        </template>
        South America (São Paulo)
      </KeyValuePairs.Item>
      <KeyValuePairs.Item label="Custom certificate" />
    </KeyValuePairs.Group>
    <KeyValuePairs.Group title="Source">
      <KeyValuePairs.Item label="Repository">acme/storefront</KeyValuePairs.Item>
      <KeyValuePairs.Item label="Branch">main</KeyValuePairs.Item>
      <KeyValuePairs.Item label="Framework">Next.js</KeyValuePairs.Item>
    </KeyValuePairs.Group>
  </KeyValuePairs>
</template>
```
