# Help Panel

> The content of a help side region: a topic's title, a few sections of short guidance, and the "Learn more" links that leave for the documentation. Guided tutorials belong to `tutorial-panel`. It is the thing that goes **inside** a side region, not the region itself: the consumer places it in a `Drawer` or in the page's side rail, and that host owns opening, closing and the close button. It owns no open state, so it has no `Trigger` / `Content` and no `data-state="open|closed"`. Its anatomy is the anatomy of a help page — `Header`, `Section`, `Links` — composed by hand, so a topic can omit the links or carry one section or five.

- Import: `import HelpPanelRoot from '@aziontech/webkit/help-panel-root'`
- Compound import (dot notation, not tree-shakeable): `import HelpPanel from '@aziontech/webkit/help-panel'`
- Category: content · Surface: app · Structure: composition
- API as JSON: [help-panel.json](https://github.com/aziontech/webkit/blob/main/.specs/help-panel.json)

## When to use

- Use HelpPanel for static page help (title, guidance, Learn more links) in the app layout's tools region.
- A Console screen needs contextual help beside the work: what this page is for, what a field means, where the docs are.
- The help content is loaded asynchronously and the region must reserve its space while it arrives (`loading`).

## Do

- One topic per panel. When the reader moves to another part of the page, swap the panel's content — do not stack two headers.
- Keep each `Section` to a short paragraph or a short list. If the reader has to scroll a section, the content belongs in the docs and the panel should link to it.
- Title sections with the question the reader is asking (`What is a workload?`), not with a noun (`Overview`).
- Put links to the documentation in `HelpPanel.Links`, at the end, not inline in every section.
- Close affordances belong to the host. Do not put a close button in `HelpPanel.Header`; the `Drawer` or side rail already has one.

## Don’t

- A one-line hint attached to a single control → use `tooltip` or `hint`, or the field's `helper-text`.
- A guided tutorial with tasks, progress and hotspots on the real controls → use `tutorial-panel`.
- The region itself (overlay, slide-in, close button, focus trap) → use `drawer`; put `help-panel` inside it.
- Ordered steps the reader navigates between, with the step's form filling the column beside it → use `stepper`.
- Numbered instructions inside a documentation page, read all at once → use `doc-steps` + `doc-step`.
- A page with nothing configured yet, which needs one call to action → use `empty-state`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [drawer](drawer.md) — the host that opens, closes and traps focus around a help panel shown as an overlay.
- [tutorial-panel](tutorial-panel.md) — guided tutorials, drawn with these parts plus its own task list.
- [link](link.md) — the standalone link each `HelpPanel.Links` row is composed from.
- [skeleton](skeleton.md) — what the panel renders in place of its content while `loading`.
- [doc-prose](doc-prose.md) — long-form documentation prose; a help section is a few short paragraphs, not an article.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | `''` | false | Accessible name for the complementary landmark the panel renders. Empty uses the locale catalog (`Help`). |
| `loading` | `boolean` | `false` | false | Renders skeleton lines in place of the content while the help topic loads; sets aria-busy. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The panel's parts — `HelpPanel.Header`, `HelpPanel.Section`, `HelpPanel.Links` — in reading order. Not rendered while `loading`. |

## Sub-component imports

- `@aziontech/webkit/help-panel-header`
- `@aziontech/webkit/help-panel-section`
- `@aziontech/webkit/help-panel-links`

## Sub-components

The root ships a **compound API**: an `index.ts` (beside `help-panel.vue`) attaches every sub-component
to the root so `<HelpPanel.Header>`, `<HelpPanel.Section>` and `<HelpPanel.Links>` resolve from one
import; the standalone imports remain the tree-shaking path. The panel has no open/closed state, so
there is no `Trigger` / `Content` — every member is named after a part of a help page. 6.0 removed the
tutorial mode (`HelpPanel.Tutorial`, `HelpPanel.Task`): `TutorialPanel` owns tutorials.

- `help-panel-header/help-panel-header.vue` — The topic's title and an optional one-line description. Renders a `<header>` holding an `<h2>` and, when `description` is non-empty, a `<p>`. No close affordance — the host owns closing.
  - Props: `title?: string` (default `''` — the topic's name, rendered as the panel's heading), `description?: string` (default `''` — one line under the title saying what the topic covers; not rendered when empty).
  - Slot: `default` — optional extra content under the description (a `Tag` naming the product state, for example).
  - `data-testid` fallback: `content-help-panel-header`.
- `help-panel-section/help-panel-section.vue` — One block of guidance with its own heading. Renders a `<section aria-labelledby>` holding an `<h3>` (only when `title` is non-empty) and the slot, in `text-body-sm`, with a fixed vertical rhythm between paragraphs and lists inside it.
  - Props: `title?: string` (default `''` — the question this section answers; the section renders no heading when empty).
  - Slot: `default` — the section's prose: paragraphs, short lists, inline `text-link` anchors.
  - `data-testid` fallback: `content-help-panel-section`.
- `help-panel-links/help-panel-links.vue` — The "Learn more" footer: a heading over a column of `Link` items the consumer composes. Renders a `<section aria-labelledby>` holding an `<h3>` and a vertical flex column of the slot, separated from the content above by a `Separator`.
  - Props: `title?: string` (default `undefined` — the heading over the links; absent uses the locale catalog, `Learn more` in English, and an empty string renders no heading).
  - Slot: `default` — `Link` items, one per destination.
  - `data-testid` fallback: `content-help-panel-links`.
    Resulting layout (no per-component `package.json`; the root `packages/webkit/package.json#exports`
    resolves every path, and `.d.ts` is generated at publish time):

```
packages/webkit/src/components/content/help-panel/
├── help-panel.vue                         (root; aside landmark, loading state)
├── help-panel.test.ts
├── index.ts                               (compound: attaches the three parts to the root)
├── help-panel-header/
│   └── help-panel-header.vue
├── help-panel-section/
│   └── help-panel-section.vue
└── help-panel-links/
    └── help-panel-links.vue
```

Exports to add to `packages/webkit/package.json#exports` (flat public names; category lives in the
folder only):

```jsonc
"./help-panel": "./src/components/content/help-panel/index.ts",
"./help-panel-root": "./src/components/content/help-panel/help-panel.vue",
"./help-panel-header": "./src/components/content/help-panel/help-panel-header/help-panel-header.vue",
"./help-panel-section": "./src/components/content/help-panel/help-panel-section/help-panel-section.vue",
"./help-panel-links": "./src/components/content/help-panel/help-panel-links/help-panel-links.vue"
```

Composed DS components (all present in `packages/webkit/package.json#exports`, imported by relative path
inside the package): `skeleton` (root, `loading`), `divider` (`Links`).
`link` is composed by the consumer through slots, never imported by the panel.

## States

- Visual states: `default`, `loading`
- `data-loading` on the root mirrors the `loading` prop
- No `data-state` — the panel has no open/closed state (the host owns it)
- No `data-disabled` — nothing in the panel is interactive on its own; interactive content (`Link`, `Button`) is composed by the consumer and carries its own states

The root, while `loading`: the default slot is not rendered; in its place the root renders a title
line and three body lines with `Skeleton` (`kind="rectangle"`; title `width="60%"` `height="1.25rem"`, body
lines `width="100%"`, `width="100%"`, `width="75%"`, each `height="0.875rem"`), and sets
`aria-busy="true"`. The loading lines carry `aria-hidden="true"`; the landmark keeps its accessible
name.

- Responsive: the root is the `@container/help-panel`, so the content in the side panel adapts to the panel width.

## Accessibility

- Visible focus: the panel itself is not focusable; focus rings belong to the composed `Link` / `Button` controls, which already carry `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`.
- Keyboard map: `Tab` moves through the composed links and action buttons in reading order. The panel adds no key handling of its own — no roving tabindex, no arrow navigation. `Esc` and focus trap / restore are owned by the host (`Drawer`), not by the panel.
- ARIA: the root is an `<aside>` (complementary landmark) named by `aria-label` from `ariaLabel`; `aria-busy="true"` while `loading`. Headings form an outline — `HelpPanel.Header` is `<h2>`, `Section` / `Links` titles are `<h3>` — and each `<section>` is `aria-labelledby` its heading via `useId()`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons)
- Touch target ≥40×40 px — not applicable to the panel's own markup (nothing in it is interactive); the composed `Link` / `Button` controls meet it

## Examples

### Default

```vue
<script setup>
  import HelpPanel from '@aziontech/webkit/help-panel'
  import Link from '@aziontech/webkit/link'
</script>

<template>
  <div class="max-w-(--container-xs)">
    <HelpPanel aria-label="Help: Cache settings">
      <HelpPanel.Header
        title="Cache settings"
        description="How long content stays at the edge before it is fetched again."
      />
      <HelpPanel.Section title="What does the cache TTL control?">
        <p>
          The TTL sets how many seconds an object is served from the edge before the origin is asked
          for a fresh copy.
        </p>
      </HelpPanel.Section>
      <HelpPanel.Section title="When should I bypass the cache?">
        <p>Bypass it for responses that change per user, such as carts and account pages.</p>
      </HelpPanel.Section>
      <HelpPanel.Links>
        <Link
          label="Cache settings documentation"
          href="https://www.azion.com/en/documentation/"
          target="_blank"
        />
        <Link
          label="Purging cached content"
          href="https://www.azion.com/en/documentation/"
          target="_blank"
        />
      </HelpPanel.Links>
    </HelpPanel>
  </div>
</template>
```

### Loading

```vue
<script setup>
  import HelpPanel from '@aziontech/webkit/help-panel'
  import Link from '@aziontech/webkit/link'
</script>

<template>
  <div class="max-w-(--container-xs)">
    <HelpPanel
      aria-label="Help: Cache settings"
      loading
    >
      <HelpPanel.Header
        title="Cache settings"
        description="How long content stays at the edge before it is fetched again."
      />
      <HelpPanel.Section title="What does the cache TTL control?">
        <p>
          The TTL sets how many seconds an object is served from the edge before the origin is asked
          for a fresh copy.
        </p>
      </HelpPanel.Section>
      <HelpPanel.Section title="When should I bypass the cache?">
        <p>Bypass it for responses that change per user, such as carts and account pages.</p>
      </HelpPanel.Section>
      <HelpPanel.Links>
        <Link
          label="Cache settings documentation"
          href="https://www.azion.com/en/documentation/"
          target="_blank"
        />
        <Link
          label="Purging cached content"
          href="https://www.azion.com/en/documentation/"
          target="_blank"
        />
      </HelpPanel.Links>
    </HelpPanel>
  </div>
</template>
```
