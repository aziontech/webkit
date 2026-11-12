# Docs header

The top bar of the documentation site. A reader arrives from search or from the console, mid-task, and needs three things: find another page (search, the section links), know which product's docs they are in (the brand with the Docs tag), and get back to building (Console). It runs full bleed across the window and opens on the page boundary, like the documentation shell under it.

## When to use

- On every documentation page, inside `shells/documentation`.
- On a docs-like reference site (API reference, changelog) that shares the documentation navigation.

## When not to use

- Marketing pages: use `headers/site-header`.
- Console pages: use `headers/resource-header`; focused flows use `headers/creation-header`.

## Building blocks

### A. Bar — `GlobalHeader` (required)

Default `content` placement, `aria-label="Azion documentation"`. Start cluster in `GlobalHeader.Left`, an empty `GlobalHeader.Nav`, the actions in `GlobalHeader.Right`.

### B. Navigation trigger and GitHub — `IconButton` (required)

Below `lg`, an outlined `pi-bars` icon button opens the documentation navigation (the rail leaves at that width). In the end cluster, after the search, GitHub (`href` with `target="_blank"`).

### C. Brand — `Brand` (required)

Inside `GlobalHeader.Brand`, followed by a small `Docs` overline tag, both in one link to the docs home with `aria-label="Azion Docs home"`.

### D. Section links — `NavigationMenu` (required from lg)

The top-level sections (`Reference`, `Guides`, `Dev tools`) as `NavigationMenu.Trigger` links, with the popup (`Portal`, `Positioner` bottom-start, `Popup`, `Arrow`, `Viewport`) for sections that open a panel. Hidden below `lg`, where the trigger in B opens the same sections.

### E. Console — `Button` (required)

`kind="secondary"`, medium, last in the bar: the way back to the product.

### F. Search — `SearchTrigger` (required)

The header search, first in the end cluster: the field (`Search` with the ⌘K / Ctrl K keycap) while the bar is at least `--container-2xl` wide, the magnifier alone below that (`collapsible`, inside the header's `@container`). It emits `open` on click and on the shortcut and opens the `Command` palette. Never hand-rolled (rule `webkit-header-search`).

### G. Search palette — `Command` (required)

The ⌘K palette the header search opens: `Command.Input`, one group of pages, and `Command.Empty` for no match. It owns the ⌘K / Ctrl K shortcut while mounted.

## Do

- Keep Search first in the end cluster in every channel (docs, site, console), so it is always in the same place.
- Keep three to five section links; the per-product pages belong in the shell's sidebar.

## Don't

- Don't add Sign up or Start for free: the reader of docs is already a user or is evaluating; Console covers both.
- Don't duplicate the sidebar's page list in the menu.

## Copy

- **Section links:** nouns, sentence case, no verbs: `Reference`, `Guides`, `Dev tools`.
- **Icon button labels:** say the target: `Search docs` (the `SearchTrigger` label), `Azion on GitHub`, `Open documentation navigation`.
- **Console:** the product name alone: `Console`.

## Accessibility

- Every icon-only button has an `aria-label`; the GitHub link opens a new tab and should say so in its label or with an external-link affordance if your product requires it.
- `NavigationMenu` carries `aria-label="Documentation sections"` so it is distinguishable from the sidebar navigation.
- At 320 px only the trigger, brand and end icons remain; nothing scrolls horizontally.

## States

- Default: the only state; the section links show from `lg`, the trigger below it.

## Related

- `shells/documentation` — the shell this bar heads.
- `headers/site-header` — the marketing counterpart, same anatomy with `kind="site"`.
- `headers/resource-header` — the console counterpart.
