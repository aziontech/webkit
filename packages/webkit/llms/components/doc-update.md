# Doc Update

> One entry in a changelog: what shipped, when, and under which version. The release's identity sits in a left column — the date, the version under it, the tags under that — the notes sit on the right, and a rule runs between them for the length of the entry and bridges the block gap to the next one, so a set of entries reads as one continuous timeline rather than a stack of boxes. The label is an `h2` and a link to its own id, because every entry is a URL somebody sends — the id is the label slugified, unless an explicit `anchor` overrides it. Given a `title`, the entry becomes a release: the label turns into a plain date beside a node on the rule, and the title takes the `h2`, the anchor and the tags, sized above every heading the notes carry.

- Import: `import DocUpdate from '@aziontech/webkit/doc-update'`
- Category: documentation · Surface: docs · Structure: monolithic
- API as JSON: [doc-update.json](https://github.com/aziontech/webkit/blob/main/.specs/doc-update.json)

## When to use

- A changelog or release-notes page: one `DocUpdate` per release, newest first, inside `DocProse`.
- Any dated series a reader scans by its left edge — announcements, incident retrospectives, versioned API changes.

## Do

- Put the date (or release name) in `label` and the version in `description` — the left edge is what a reader scans, so the label carries the identity.
- Give each release its own entry with a `title` when one date ships several things — one title per entry, the date repeated, rather than several product headings inside one entry.
- Keep headings inside an entry one level below the heading: the label (or the `title`, when set) is the entry's `h2`.
- Set `anchor` only when two entries share a label; otherwise let the id derive from the label so shared links match what readers see.

## Don’t

- For a single dated aside inside a guide — that is a `DocCallout`, not a timeline entry.
- As a styled row inside another section. The label is an `h2`, so every entry claims a slot in the page outline; nesting one under a deeper heading breaks the outline.
- To generate a feed. Mintlify's `rss` prop is deliberately absent — this layer renders pages and generates nothing, so the prop would be inert.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- DocProse` — the contract around it: `data-doc-block` takes the block rung of the spacing ladder, and `data-doc-chrome` keeps prose rules off the label column.
- Tag` — renders the entry's tags row (`severity="secondary"`): small and rounded in the label column, medium with the default shape under a `title`.
- use-heading-nav` — the composable the label anchor calls. A page that owns its scroll container provides a scroller-aware handler with `provideHeadingNav`; rendered outside a provider, the injected default is a no-op — never a throw — and the browser's native hash navigation takes over.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | `''` | false | The entry's name — a date, a release name. Also its anchor. |
| `title` | `string` | `''` | false | The release's heading, shown above the notes. The label becomes the date beside it. |
| `description` | `string` | `''` | false | Secondary line under the label; usually the version. |
| `tags` | `string[]` | `[]` | false | Short labels categorising the entry: a product, an area, a kind of change. |
| `anchor` | `string` | `''` | false | Anchor override; wins over the slug derived from the label. Set it when two entries share a label. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The release notes: prose, lists, code, or any documentation component. |

## States

- Visual states: `default`, plus `hover` / `focus-visible` on the label anchor — the label underlines and the chain glyph fades in
- Anchor derivation: an explicit `anchor` prop wins; otherwise the id is the `label` slugified (inline markup stripped, lowercased, kebab-cased), or the `label` and `title` slugified together when a `title` is set, so entries sharing a date stay distinct. The `h2` takes the same id with a `-label` suffix, and the section's `aria-labelledby` points at it
- Heading navigation degrades gracefully: the anchor calls the handler a page provided via `provideHeadingNav`; outside a provider the injected default is a no-op — activation never throws, and native hash navigation handles the jump
- `data-doc-block` + `data-doc-update` mark the entry for `DocProse` block rhythm and let an entry that follows another bridge the rule through the block gap; `data-doc-chrome` keeps prose rules off the label column
- Below `md` the columns stack and the rule drops; from `md` up the label column sticks (`md:sticky`) while the notes scroll past
- Titled (`title` set, `data-titled` on the root and notes column): the label renders as a date, not a heading, centred on the title's first line; a decorative node sits on the rule at the same line (`md` up), centred on the rule in both directions (`-translate-x-1/2`, `rtl:translate-x-1/2`); the title is the `h2` and self-link, the tags move under it, and consecutive titled entries are padded apart below the notes

## Accessibility

- The label is a real `h2` inside a `section` whose `aria-labelledby` points at it, so every entry is a named region and joins the page outline and the "On this page" rail. With a `title`, the title is that `h2` and the date is plain text, so the region is named by what shipped.
- The titled node on the rule is decorative (`aria-hidden`).
- Keyboard map: `Tab` reaches the heading anchor (the label, or the title when set); `Enter` follows it — through the page's provided heading-nav handler, or native hash navigation without one. Nothing else in the entry's chrome is interactive.
- Visible focus: the anchor takes `focus-visible:outline-2 focus-visible:outline-offset-2` in the ring token.
- The chain glyph is decorative (`aria-hidden`) and revealed on `focus-visible` as well as hover, so the self-link affordance is not pointer-only.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons).
- Touch target: the label anchor is a text link on its own line in the label column, with nothing else competing for the hit area.

## Examples

### Default

```vue
<script setup>
  import DocProse from '@aziontech/webkit/doc-prose'
  import DocUpdate from '@aziontech/webkit/doc-update'
</script>

<template>
  <DocProse>
    <DocUpdate
      label="August 19, 2026"
      description="v2.4.0"
      :tags="['Console', 'Edge Functions']"
    >
      <p>
        Rules Engine conditions now match on request headers, so a rule can branch on anything the
        client sends without a function in the path.
      </p>
    </DocUpdate>
  </DocProse>
</template>
```

### Changelog

```vue
<script setup>
  import DocProse from '@aziontech/webkit/doc-prose'
  import DocUpdate from '@aziontech/webkit/doc-update'
</script>

<template>
  <DocProse>
    <DocUpdate
      label="August 19, 2026"
      description="v2.4.0"
      :tags="['Console', 'Edge Functions']"
    >
      <h3>Header matching in Rules Engine</h3>
      <p>
        Conditions now match on request headers, so a rule can branch on anything the client sends
        without a function in the path.
      </p>
      <ul>
        <li>New criteria: <code>request.headers</code> and <code>response.headers</code>.</li>
        <li>Existing rules keep working — nothing to migrate.</li>
      </ul>
    </DocUpdate>
    <DocUpdate
      label="August 5, 2026"
      description="v2.3.1"
      :tags="['CLI']"
    >
      <p>
        Fixed a crash when <code>azion deploy --local</code> ran in a workspace whose manifest had
        no function bound.
      </p>
    </DocUpdate>
    <DocUpdate
      label="July 28, 2026"
      description="v2.3.0"
      :tags="['API', 'Storage']"
    >
      <p>
        Object Storage buckets can be created and listed from the API, with pagination on every
        collection endpoint.
      </p>
    </DocUpdate>
  </DocProse>
</template>
```

### Releases

```vue
<script setup>
  import DocProse from '@aziontech/webkit/doc-prose'
  import DocUpdate from '@aziontech/webkit/doc-update'
</script>

<template>
  <DocProse>
    <DocUpdate
      label="September 2, 2026"
      title="Terraform Provider"
      description="Version 2.8.0"
      :tags="['Improvements', 'Bug Fixes']"
    >
      <h3>Improvements</h3>
      <ul>
        <li>
          Resources now support drift detection, so out-of-band changes made in the Azion Console
          are reverted by <code>terraform plan</code>.
        </li>
      </ul>
      <h3>Bug Fixes</h3>
      <ul>
        <li>Fixed <code>terraform import</code> across multiple data sources and resources.</li>
      </ul>
    </DocUpdate>
    <DocUpdate
      label="August 26, 2026"
      title="Azion CLI"
      description="Version 4.23.0"
      :tags="['Features']"
    >
      <p>Added a new command tree for managing DNS zones, records, and DNSSEC.</p>
    </DocUpdate>
    <DocUpdate
      label="August 26, 2026"
      title="Azion Console"
      :tags="['Bug Fixes']"
    >
      <p>Fixed the pagination controls being unusable on mobile.</p>
    </DocUpdate>
  </DocProse>
</template>
```
