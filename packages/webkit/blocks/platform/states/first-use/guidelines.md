# First use

What a first-level list shows before the account owns any resource of that kind. The user's job is to create the first one, so the block replaces the empty table with a short explanation and every way to get started on the same screen: the methods to create one (import, CLI, from scratch), then the promotions that shortcut it (a Catalog template, a coding agent). Every list that is still empty renders this block with its own nouns, methods and promos.

## When to use

- The first visit to a list page (Resources, Services, Domains…) when the account has none of that resource.
- When there is more than one way to create the first item and each deserves its own action.

## When not to use

- A list that has items but a filter or search matched none: use the no-match state of `platform/view/table-view`.
- An empty panel inside a dashboard or detail page: use `EmptyState` alone, without the method list.
- Choosing what to create across every resource kind: use `platform/create/create-hub`.
- The Home page before the first project: use `platform/dashboard/home-dashboard` (its Empty state).
- A list that failed to load: that is an error, not first use; see `skills/webkit-ui-states`.

## Building blocks

### A. Frame — `Card` (required)

A flush `Card` (`:padded="false"`) holds the explanation and the method list as one object. Each promo below sits in its own flush `Card`, two columns from `md`.

### B. Explanation — `EmptyState` (required)

The resource glyph, a headline that names the first action, and one sentence on the ways to do it. Its `#actions` slot holds only the documentation link; the create actions live in the method list. The icon slot shows the resource glyph; an app may draw a richer figure there.

### C. Documentation — `Link` (required)

`Documentation`, opening the docs for this resource in a new tab. One link, no button.

### D. Methods — `Item` (required)

An `Item.List` under the `EmptyState`, one `Item` per way to create the first resource: a bordered icon frame in `Item.Media`, `Item.Title` and `Item.Description`, and one action in `Item.Actions`. List the methods in order of how most users start (repository import, CLI, from scratch).

### E. Method action — `Button` (required)

One per method. The recommended method takes `kind="primary"` (`Import`); the others take `kind="outlined"` (`Create`). Only one primary on the block.

### F. Command row — `InputGroupRoot` (CLI method)

Joins the read-only command and its copy button into one control, full width.

### G. Command — `Input` (CLI method)

`readonly`, `monospace`, `:spellcheck="false"` and `size="large"`, holding the command to run in the
code face, with an `aria-label` that names it.

### H. Copy — `CopyButton` (CLI method)

Copies the command, with an `aria-label` (`Copy the Via CLI command`) and a `copied-label` (`Command copied`) that confirms it.

## Do

- Rewrite the headline, lead, methods and promos for each resource kind; the structure stays, the nouns change.
- Show the Catalog template promo only for resource kinds that have a template catalog.
- Keep one primary action across the whole block, on the method most users take.
- Keep the documentation link as the only action in the `EmptyState`.
- Hold the block's footprint with `Skeleton` bands while the account reloads, so it does not jump in.

## Don't

- Don't write an agent mark's mask as an unquoted `url(...)`: the build inlines the SVG as a `data:` URI and the unquoted value renders the mark as a solid square. Quote it (`url('…')`).
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
- Each promo is a real `<button type="button">` covering the card, so it is reachable and announced by its title.
- The command `Input` has an `aria-label`; the copy button has its own label and announces the copied state.
- The documentation link opens in a new tab; say so in the destination or let `Link` mark it.
- The headline is the page's first heading under the list title, not a second `h1`.

## States

- Default: the explanation, three create methods and the two promos.
- Loading: while the account reloads, two `Skeleton` bands hold the block's footprint.

## Related

- `platform/view/table-view` — the list this block stands in for once the first item exists, and the home of the no-match state.
- `platform/create/create-hub` — every create entry point across resource kinds.
- `platform/create/deploy-template` — where the Catalog template promo leads.
- `platform/states/project-intake` — the drop target and upload overlay an empty page can also render.
- `platform/states/page-wires` — the skeleton painted before the page knows whether the list is empty.
