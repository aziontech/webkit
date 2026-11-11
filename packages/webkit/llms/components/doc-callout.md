# Doc Callout

> The admonition a documentation page interrupts itself with — Note, Info, Tip, Check, Warning, Danger — rendered on the webkit `Alert` surface, so the severity colour, the border, the icon and the radius come from the design system rather than from this layer. Its anatomy is a glyph and a column of prose — a sentence, or a few short paragraphs and a list — nothing else: no title row.

- Import: `import DocCallout from '@aziontech/webkit/doc-callout'`
- Category: documentation · Surface: docs · Structure: monolithic
- API as JSON: [doc-callout.json](https://github.com/aziontech/webkit/blob/main/.specs/doc-callout.json)

## When to use

- An aside the reader must not miss mid-prose: a caveat, a prerequisite, a warning about data loss.
- A short confirmation that a step worked (`check`), or a shortcut worth knowing (`tip`).

## Do

- Let the glyph and the tint carry the severity; do not restate it in the copy ("Warning: …").
- Keep the body short — a sentence or two, links and inline code. A list is fine when the aside enumerates actions; the callout lays it out itself, because `DocProse` stops at its edge.
- Reach for `tip` when the aside claims nothing about stakes. Borrowing `check` for a friendly shortcut paints a shortcut the same green as a confirmed success.

## Don’t

- For a block that needs its own box — a fenced sample, a table, a card grid. Those belong outside the callout; its body is prose, at most a short list.
- For an application-screen banner or a form error — use `Alert` directly, which is what this composes.
- As a section heading. A callout is an interruption, not structure.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- Alert` — the webkit surface this renders on; reach for it directly outside documentation prose.
- DocProse` — the contract around it. A callout marks itself `data-doc-chrome`, so prose rules stop at its edge, and `data-doc-block`, so it takes the block rung of the ladder.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `kind` | `'note' \| 'info' \| 'tip' \| 'check' \| 'warning' \| 'danger'` | `'note'` | false | Which admonition this is; drives the severity color and the icon. |
| `label` | `string` | `''` | false | Fallback copy when the default slot is empty. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The callout copy: prose with links and inline code, or paragraphs and a list, laid out by the callout since `DocProse` stops at its edge. The copy region is a flow container, so server-rendered block markup stays inside the box. |

## States

- Visual states: `default` (the component is not interactive and holds no state)
- `data-kind` mirrors the `kind` prop, so a test or a consumer can target one flavour
- `data-neutral` is present only for `tip`, the one kind that carries no severity
- `data-doc-block` + `data-doc-chrome` are the `DocProse` contract (block rung; prose stops here)

## Accessibility

- Visible focus: the callout is not focusable; a link inside it inherits the prose focus ring.
- Keyboard map: none of its own — `Tab` reaches only a link in the copy.
- ARIA: the role comes from `Alert`; the glyph is decorative (`aria-hidden`), so the copy is the accessible content.
- Contrast ≥4.5:1: the copy is `--text-default` in every kind, measured 13.31:1–18.97:1 across the six fills in both themes. The inline-code chip keeps `--text-default` too, measured 10.05:1–14.43:1 — the severity ink on that chip drops to 4.03:1 in dark danger, which is why it is not used.
- `tip` deliberately does **not** speak in `--text-muted` (3.95:1 light, under AA).
- Touch target: not applicable; the component is not interactive.

## Examples

### Default

```vue
<script setup>
  import DocCallout from '@aziontech/webkit/doc-callout'
</script>

<template>
  <DocCallout kind="note">
    The first request to a location is a cache miss. Warm-up is per location, not global.
  </DocCallout>
</template>
```

### Prose

```vue
<script setup>
  import DocCallout from '@aziontech/webkit/doc-callout'
</script>

<template>
  <DocCallout kind="warning">
    <p>
      Certificates cross-signed by the retired root stop validating on older devices. It will be
      necessary to take the following actions:
    </p>
    <ul>
      <li>
        <strong>Certificates on the retired chain</strong>: migrate to the new chain or to an Azion
        certificate.
      </li>
      <li><strong>Other certificates</strong>: no action needed; they are unaffected.</li>
    </ul>
  </DocCallout>
</template>
```

### Kinds

```vue
<script setup>
  import DocCallout from '@aziontech/webkit/doc-callout'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-md)">
    <DocCallout kind="note">A neutral aside the reader should not skip.</DocCallout>
    <DocCallout kind="info">Background that explains why the step exists.</DocCallout>
    <DocCallout kind="tip"
      >Run <code>azion deploy --local</code> to skip the remote install.</DocCallout
    >
    <DocCallout kind="check">The certificate is issued and renews on its own.</DocCallout>
    <DocCallout kind="warning"
      >Changing the preset rebuilds every function in the workload.</DocCallout
    >
    <DocCallout kind="danger"
      >Deleting a workload releases its domain and cannot be undone.</DocCallout
    >
  </div>
</template>
```
