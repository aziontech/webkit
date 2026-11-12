# Feature List

> The features a plan, product or upgrade includes, each behind a check mark, in one or two columns. It is the "what you get" list of a plan card, an upgrade card or a change-plan drawer: short labels, an optional one-line description under each, and a check that says "included", never "done". It replaces the hand-written `ul` with a `pi pi-check` per row that the billing pages and the change-plan drawer drew with different icon colours.

- Import: `import FeatureList from '@aziontech/webkit/feature-list'`
- Category: content · Surface: product · Structure: monolithic
- API as JSON: [feature-list.json](https://github.com/aziontech/webkit/blob/main/.specs/feature-list.json)

## When to use

- The perks of an upgrade card (Upgrade to Pro: Unlimited Applications, Unlimited Workloads, Custom Domains).
- The features a plan includes in a change-plan or upgrade drawer, each with a short description.
- Any short list of included capabilities where the check is the only marker.

## Do

- Keep each label to a few words in title case or sentence case, one capability per row; put the detail in `description`, not in the label.
- Use `columns: 2` for six or more short labels in a wide card; it falls back to one column in a narrow box on its own.
- Name the list with `ariaLabel` (for example "Pro plan features") when no visible heading right above it says what the features belong to.
- Do not hand-write the list with your own check icons: the check colour and spacing are part of the component.

## Don’t

- Steps or tasks with a done/not-done state (a production checklist, a setup guide) → use `outcome-mark` per row, or the `stepper`.
- A comparison of features across plans → use `compare-plans` or `table`.
- Label and value facts → use `key-value-pairs`.
- Rows that navigate or carry actions → use `item`.
- Marketing pricing cards on the site → use `card-pricing` / `pricing-plans`, which carry their own feature lists.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [key-value-pairs](key-value-pairs.md) — the plan facts that sit next to the feature list in a billing card.
- [card](card.md) — the surface the list sits in; FeatureList brings no surface of its own.
- [outcome-mark](outcome-mark.md) — the mark for a step that finished, which this check is not.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `FeatureListItem[]` | `[]` | false | The features, in order; each item is `{ label: string; description?: string }`. |
| `columns` | `1 \| 2` | `1` | false | Columns when the list's own box is at least the md container; a narrower box always shows one column. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the list when no visible heading names it. |

## States

- Visual states: `default`
- `data-columns` on the list mirrors `columns`
- Empty: with no `items` the component renders nothing (no empty list, no placeholder); the card around it decides what to say
- No `loading`, `disabled`, `invalid`, `readonly`, `error` or `open` states: the list is static, read-only text

## Accessibility

- Visible focus: none; the list has no interactive part.
- Keyboard map: no tab stop.
- ARIA: a native `ul` with `role="list"` (so the list semantics survive `list-style: none` in Safari); each feature is an `li`; the check glyph is `aria-hidden="true"`; `ariaLabel` is set as `aria-label` on the `ul` only when non-empty.
- Contrast ≥4.5:1 for the label and the muted description, ≥3:1 for the check glyph, on `var(--bg-surface)` in both themes.
- No motion.
- No touch target: nothing is interactive.

## Right-to-left

- Layout: logical utilities only; the check sits at the inline start and the text after it, so the row mirrors under `dir="rtl"`.
- Icons: the check does not mirror.
- Keyboard: no arrow-key logic.
- User data: each label and description renders `dir="auto"`, so a product name in another script keeps its own direction.

## Internationalization

No built-in strings: every visible text comes from `items`, and the accessible name from `ariaLabel`.

- Formatting: none

## Responsive

- Container queries: the root is `@container/feature-list`; `columns: 2` applies from `@md` of that box (472 px) and the list shows one column below it, so a card in a split view or on a phone stacks the features by itself.
- Narrow (≤ 640 px or a narrow container): one column; labels and descriptions wrap, never truncate.
- Touch: nothing is interactive.
- Reflow: no horizontal scroll at 320 px and 200 % zoom; long unbroken words break.

## Examples

### Default

```vue
<script setup>
  import FeatureList from '@aziontech/webkit/feature-list'

  const features = [
    { label: 'Unlimited Applications' },
    { label: 'Unlimited Workloads' },
    { label: 'Custom Domains' },
    { label: 'Priority Support' }
  ]
</script>

<template>
  <FeatureList
    :items="features"
    aria-label="Pro plan features"
  />
</template>
```

### Columns

```vue
<script setup>
  import FeatureList from '@aziontech/webkit/feature-list'

  const features = [
    { label: 'Unlimited Applications' },
    { label: 'Unlimited Workloads' },
    { label: 'Custom Domains' },
    { label: 'Priority Support' },
    { label: 'Real-Time Metrics' },
    { label: 'Data Stream' },
    { label: 'Web Application Firewall' },
    { label: 'Team Permissions' }
  ]
</script>

<template>
  <FeatureList
    :items="features"
    :columns="2"
    aria-label="Pro plan features"
  />
</template>
```

### WithDescriptions

```vue
<script setup>
  import FeatureList from '@aziontech/webkit/feature-list'

  const features = [
    {
      label: 'Unlimited Applications',
      description: 'Deploy as many applications as your projects need.'
    },
    {
      label: 'Custom Domains',
      description: 'Serve every application from your own domain, with managed certificates.'
    },
    {
      label: 'Priority Support',
      description: 'Reach the support team by chat and get an answer within one business day.'
    }
  ]
</script>

<template>
  <FeatureList
    :items="features"
    aria-label="Pro plan features"
  />
</template>
```
