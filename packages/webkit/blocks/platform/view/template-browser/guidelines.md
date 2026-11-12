# Template browser

The catalog of templates a person starts a project from. They arrive from the creation hub, the marketplace or a "Start from a template" link, already knowing roughly what they want (a framework, a kind of site, a small function) and needing to find it, check what it contains and start the deploy. The page is one heading over one band: a single search and filter control, then the templates grouped by category. A tile opens a preview drawer with the facts and the README, and the drawer's Deploy hands off to the deploy template flow, which owns the run and its outcome.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shells/console`), which owns the rail, the header and the `main`.

## When to use

- A gallery of starting points (framework starters, sample sites, small functions) people pick one of and deploy.
- People choose by recognising a framework mark and a name, then confirm by reading what the template contains.
- The catalog is tens of items, small enough to show every match grouped by category without paging.
- The deploy itself happens elsewhere (`platform/create/deploy-template`), so this screen ends on a link.

## When not to use

- The first screen of creation, where templates are one option among import, upload and blank: use `platform/create/create-hub`.
- Installing integrations or extensions into an existing resource: use `platform/view/marketplace`.
- The resources a person already created, as cards: use `platform/view/card-view`.
- Configuring and running the deploy of the chosen template: use `platform/create/deploy-template`.
- Hundreds of items that need paging, sorting and saved preferences: use `platform/view/card-view` with `Cards`.

## Building blocks

### A. Page heading — `PageHeader`, `Button` (required)

`PageHeader` at its medium size with the title "Templates" and one sentence of purpose. Its actions slot holds only the outlined medium Documentation `Button`, opening the docs in a new tab. There is no Create action: every template is its own way in.

### B. Search and filter — `PropertyFilter` (required)

One `PropertyFilter` bound with `v-bind="propertyFilterProps"` from `useCollection`, at full width above the sections. Free text searches the name and the description; Category and Framework are properties with `options`, in catalog order. Every token lives in the URL (`url: true`), so a filtered catalog survives a reload and can be shared. There is no second search field and no filter popover.

### C. Category sections — `Card`, `Tag` (required)

One `section` per category that still has matches, labelled by its `h2` in the muted small label style (Frameworks, Starters, Functions), each with a `ul` grid of one to four tiles a row by width. A tile is a `Card` with the framework mark in a 40 px raised box (grey until hover, the `grayscale` to colour shift of the design), the name as an `h3` that holds a button with `aria-haspopup="dialog"`, two lines of description and a small secondary `Tag` with the framework. The button's stretched `after` box makes the whole tile one target, draws the translucent hover wash and the focus ring inside the tile, and leaves the `Card` surface untouched. Tiles in a row share a height.

### D. No matching templates — `EmptyState`, `Button` (required)

When `status` is `no-match`, the sections give way to a medium `EmptyState` with the filter-slash glyph, "No matching templates", one sentence, and an outlined small Clear filters `Button` bound to `clearFilters`. The filter keeps its tokens, so the person can see what hid the tiles.

### E. Preview drawer — `Drawer`, `DrawerPortal`, `DrawerOverlay`, `DrawerContent`, `DrawerTitle`, `DrawerClose`, `PanelHeader`, `PanelContent`, `PanelFooter` (required)

A medium right `Drawer` controlled by `v-model:open`, opened by the tile. `PanelHeader` carries the mark, the template name as `DrawerTitle` and `DrawerClose`; `PanelContent` scrolls; `PanelFooter` holds the actions at the end: View repository (outlined, trailing external-link icon, new tab) and the primary Deploy. Deploy is a link to the deploy template flow with the template's id; the drawer never runs the deploy itself.

### F. Template facts — `KeyValuePairs` (required)

Under the description, a two-column `KeyValuePairs` named "Template details": Framework, Category, Repository (in `bdi`) and Updated. Keep it to facts that help choose; settings belong to the deploy form.

### G. README — `Card`, `DocProse` (required)

A `section` labelled by its "README" heading, with the template's README in a `Card` through `DocProse`, so markdown rendered to plain HTML gets the documentation type scale. Headings inside start at `h4`, under the drawer's own headings.

## Do

- Run the catalog on one `useCollection` call with `filtering`, `propertyFiltering` and `url: true`, and bind `propertyFilterProps`.
- Group the matches by category in a fixed order and drop a category with no match.
- Make the tile's name the only interactive element, and stretch it over the tile.
- Show the framework on the tile as text in a `Tag`, not only as the mark.
- Open the preview in a drawer, so the catalog and the filter stay where they were.
- End the preview on Deploy, a link into `platform/create/deploy-template`, and let that flow run the deploy and raise the async-submit toast.
- Keep README headings below the drawer title (`h4` and down).

## Don't

- Don't deploy from the tile or the drawer without the deploy flow; the template needs a scope, a repository name and its settings.
- Don't put a Deploy button on every tile; the preview is where a person confirms the choice.
- Don't page the catalog or add preferences; a grouped list of tens of items reads better whole.
- Don't colour the tile per framework; the mark carries the brand and the surface stays neutral.
- Don't hide the filter while loading or after a failure; disable it, so the page keeps its shape.
- Don't show the README as raw markdown or in a code block.

## Copy

- **Title:** "Templates". Description: one sentence with a period, e.g. "Start a project from a template and deploy it in a few steps."
- **Filter:** placeholder and `aria-label` "Search templates".
- **Sections:** the category in title case, plural: "Frameworks", "Starters", "Functions".
- **Tile:** the template name as its owner writes it, e.g. "Next.js Starter"; a description of one sentence, under two lines.
- **Drawer actions:** "View repository", "Deploy".
- **No match:** "No matching templates", then "No template matches this search. Remove a filter to widen the results.", and "Clear filters".
- **Failure:** "Couldn't load templates. Check your connection and retry." with "Retry"; the empty state "Templates are unavailable" with "Import from Git".
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- The layout owns the one `main` landmark; the `PageHeader` title is the only `h1`, each category is an `h2`, each tile name an `h3`.
- Each category is a `section` labelled by its heading and holds a `ul`, so the count of templates is announced.
- The tile's target is a real `button` with `aria-haspopup="dialog"`, named by the template name; the description and the framework follow it in reading order.
- The focus ring is drawn inside the tile on the stretched target, so it is never clipped by the grid.
- The drawer traps focus, is named by `DrawerTitle`, closes on Escape and returns focus to the tile that opened it.
- The `PropertyFilter` is named by its `aria-label` and announces the match count after each change.
- The loading band is `aria-busy`; the failure `Alert` is announced and its Retry is a button.

## States

- Default: the catalog is loaded; the filter, the three category sections of tiles and the preview drawer are wired, and filtering to nothing shows No matching templates with Clear filters.
- Preview: the drawer is open on Next.js Starter with its details, the README, View repository and Deploy.
- NoMatch: the search "kubernetes" matches nothing; the token stays and the empty state offers Clear filters.
- Loading: the filter is disabled and two sections of `Skeleton` tiles (mark, name, two lines, tag) hold the layout in a band that is `aria-busy` and named Loading templates.
- Failed: the catalog could not load; a danger `Alert` reads Couldn't load templates with Retry, and a medium empty state offers Import from Git so a project can still start.

## Related

- `platform/create/deploy-template` — where Deploy leads; it owns the form, the run and the async-submit toast.
- `platform/states/async-submit` — the toast and inline outcome every deploy follows.
- `platform/view/marketplace` — the marketplace page whose Templates tab opens this catalog, and its integrations.
- `platform/create/create-hub` — the creation hub that links here for "Start from a template".
- `Card` and `useCollection` — see `skills/webkit-lists`.
