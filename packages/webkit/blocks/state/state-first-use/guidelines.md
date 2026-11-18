# First use

What a first-level list shows before the account owns any resource of that kind. The user's job is to create the first one, so the block replaces the empty table with a short explanation and every way to get started on the same screen: the methods to create one (import, CLI, from scratch), then the promotions that shortcut it (a Catalog template, a coding agent). Every list that is still empty renders this block with its own nouns, methods and promos.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shell/shell-console`), which owns the rail, the header and the `main`.

## When to use

- Use state-first-use on a list page before the account owns any resource of that kind.
- The first visit to a list page (Resources, Services, Domains…) when the account has none of that resource.
- When there is more than one way to create the first item and each deserves its own action.

## When not to use

- A list that has items but a filter or search matched none: use the no-match state of `view/view-table`.
- An empty panel inside a dashboard or detail page: use `EmptyState` alone, without the method list.
- Choosing what to create across every resource kind: use `create/create-hub`.
- The Home page before the first project: use `dashboard/dashboard-home` (its Empty state).
- A list that failed to load: that is an error, not first use; see `skills/webkit-ui-states`.

## Building blocks

### A. Frame — `Card` (required)

A flush `Card` (`:padded="false"`) holds the explanation and the method list as one object. Each promo below sits in its own flush `Card`, two columns from `md`.

### B. Agent marks — `Logo` (optional)

The coding-agent promo stacks the agent marks, each a decorative `Logo` at `size="small"` in a bordered tile. A mono mark takes `variant="current"` and the tile's text colour, a coloured one `variant="color"`.

### C. Explanation — `EmptyState` (required)

The resource glyph, a headline that names the first action, and one sentence on the ways to do it. Its `#actions` slot holds only the documentation link; the create actions live in the method list. The icon slot shows the resource glyph; an app may draw a richer figure there.

### D. Documentation — `Link` (required)

`Documentation`, opening the docs for this resource in a new tab. One link, no button.

### E. Methods — `Item` (required)

An `Item.List` under the `EmptyState`, one `Item` per way to create the first resource: the method glyph in `Item.Media type="icon"` (the component draws the frame), `Item.Title` and `Item.Description`, and one action in `Item.Actions`. List the methods in order of how most users start (repository import, CLI, from scratch).

### F. Method action — `Button` (required)

One per method. The recommended method takes `variant="primary"` (`Import`); the others take `variant="outline"` (`Create`). Only one primary on the block.

### G. Command row — `InputGroupRoot` (CLI method)

Joins the read-only command and its copy button into one control, full width.

### H. Command — `Input` (CLI method)

`readonly`, `monospace`, `:spellcheck="false"` and `size="large"`, holding the command to run in the
code face, with an `aria-label` that names it.

### I. Copy — `CopyButton` (CLI method)

Copies the command, with an `aria-label` (`Copy the Via CLI command`) and a `copied-label` (`Command copied`) that confirms it.

### J. Placeholder — `Skeleton` (Loading)

While `loading` is set, `Skeleton`s draw the block's footprint in a busy status region: the empty-state band, one row per method and the two promo cards.

## Data

The block shows no records and fetches nothing: a real app sets the copy and the links for its resource and listens for the two create methods. `FirstUseProps` is exported from `state-first-use.vue`; every prop defaults to the copy above.

| Prop             | Type      | What it does                                                          |
| ---------------- | --------- | --------------------------------------------------------------------- |
| `loading`        | `boolean` | The account is still loading; `Skeleton`s draw the block's footprint. |
| `title`          | `string`  | The `EmptyState` title (`Create your first resource`).                |
| `description`    | `string`  | The sentence under it.                                                |
| `docsHref`       | `string`  | Where Documentation goes, in a new tab.                               |
| `command`        | `string`  | The command the Via CLI row shows and copies (`azion deploy`).        |
| `agentSetupHref` | `string`  | Where Set up your coding agent goes (`/agent-setup`).                 |

| Event    | Payload   | When                     |
| -------- | --------- | ------------------------ |
| `import` | `(event)` | Import, on From GitHub.  |
| `create` | `(event)` | Create, on From scratch. |

To go live, render the block while the list request is pending or returns nothing:

```vue
<script setup lang="ts">
  import StateFirstUse from './state-first-use.vue'

  const { data, pending } = useDomains()
</script>

<template>
  <StateFirstUse
    v-if="pending || data?.length === 0"
    :loading="pending"
    title="Create your first domain"
    docs-href="https://example.com/docs/domains"
    @import="openImport"
    @create="openCreate"
  />
</template>
```

## Do

- Rewrite the headline, lead, methods and promos for each resource kind; the structure stays, the nouns change.
- Show the Catalog template promo only for resource kinds that have a template catalog.
- Keep one primary action across the whole block, on the method most users take.
- Keep the documentation link as the only action in the `EmptyState`.
- Hold the block's own footprint while the account reloads (the empty-state band, one row per method and the promo cards, in `Skeleton`s), so it does not jump in.

## Don't

- Don't draw an agent mark by hand (an `img` or a CSS mask): `Logo` already inks it for the theme.
- Don't show list controls (search, filters, pagination, column settings) over a list that has never had an item.
- Don't render this block for a filtered list with no matches; that state says how to clear the filter.
- Don't show it while the list is still loading; the user would see "create your first" for an account that has items.
- Don't add a second primary button to a promo card; the whole card is the action.

## Copy

- **Headline:** names the first action and the noun: `Create your first resource`.
- **Lead:** one sentence on the ways in: `Start from scratch, from a template or by importing your code.`
- **Method title:** two or three words for how: `From GitHub`, `Via CLI`, `From scratch`.
- **Method description:** one sentence on what happens: `Import a repository and deploy it on every push.`
- **Method action:** one verb: `Import`, `Create`.
- **Promo title:** sentence case, product names capitalized: `Start from a Catalog template`, `Set up your coding agent`.
- **Promo description:** one sentence on the result: `Deploy a framework starter and the resource that serves it, in one step.`
- **Documentation link:** `Documentation`.

## Accessibility

- The method icons and promo marks are decorative (`aria-hidden="true"`, `alt=""`); the titles carry the meaning.
- Each promo is a real link (`<a href>`) covering the card, because both navigate; the Catalog one opens a new tab, shows the external-link glyph and says so to screen readers.
- The command `Input` has an `aria-label`; the copy button has its own label and announces the copied state.
- The documentation link opens in a new tab; say so in the destination or let `Link` mark it.
- The headline is the page's first heading under the list title, not a second `h1`.

## States

- Default: `title` and `description`, three create methods and the two promos.
- Loading: `loading`; while the account reloads, `Skeleton`s draw the block's footprint (empty-state band, three method rows, two promo cards) in a busy status region.

## Related

- `view/view-table` — the list this block stands in for once the first item exists, and the home of the no-match state.
- `create/create-hub` — every create entry point across resource kinds.
- `create/create-deploy-template` — where the Catalog template promo leads.
- `state/state-project-intake` — the drop target and upload overlay an empty page can also render.
- `state/state-page-skeleton` — the skeleton painted before the page knows whether the list is empty.
