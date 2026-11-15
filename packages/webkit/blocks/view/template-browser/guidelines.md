# Template browser

The catalog of templates a person starts a project from. They arrive from the creation hub or a "Start from a template" link, already knowing roughly what they want (a framework, a kind of site, a small function) and needing to find it, check what it contains and start the deploy. The page is one heading over one band: a single search and filter control, then the templates grouped by category. A tile opens a preview drawer with the facts and the README, and the drawer's Deploy hands off to the deploy template flow, which owns the run and its outcome.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shell/console`), which owns the rail, the header and the `main`.

## When to use

- Use template-browser for the catalog of templates a project starts from; it is the one product template catalog.
- A gallery of starting points (framework starters, sample sites, small functions) people pick one of and deploy.
- People choose by recognising a framework mark and a name, then confirm by reading what the template contains.
- The catalog is tens of items, small enough to show every match grouped by category without paging.
- The deploy itself happens elsewhere (`create/deploy-template`), so this screen ends on a link.

## When not to use

- The first screen of creation, where templates are one option among import, upload and blank: use `create/create-hub`.
- Installing integrations or extensions into an existing resource: use `view/marketplace`.
- The resources a person already created, as cards: use `view/card-view`.
- Configuring and running the deploy of the chosen template: use `create/deploy-template`.
- Hundreds of items that need paging, sorting and saved preferences: use `view/card-view` with `CardList`.

## Building blocks

### A. Page heading — `PageHeader`, `Button` (required)

`PageHeader` at its medium size with the title "Templates" and one sentence of purpose. Its actions slot holds only the outlined medium Documentation `Button`, opening the docs in a new tab. There is no Create action: every template is its own way in.

### B. Search and filter — `PropertyFilter` (required)

One `PropertyFilter` bound with `v-bind="propertyFilterProps"` from `useCollection`, at full width above the sections. Free text searches the name and the description; Category and Framework are properties with `options`, in catalog order. Every token lives in the URL (`url: true`), so a filtered catalog survives a reload and can be shared. There is no second search field and no filter popover.

### C. Category sections — `Card` (required)

One `section` per category that still has matches, labelled by its `h2` in the muted small label style (Frameworks, Starters, Functions), each with a `ul` grid of one to four tiles a row by the width of the content (container queries on the `@container/templates` section, so an open rail does not overstate the room). A tile is a `Card kind="integration"`: the framework mark as its `logo` (colour marks use `ai-color`, and the black Next.js mark inverts in dark), the name as an `h3` holding a button that emits `select` and opens the preview, two lines of description and the framework as a secondary badge. The title's stretched target makes the whole tile one target with the hover wash and the focus ring inside the tile; the markup lives in `Card`, not in the block. Tiles in a row share a height.

### D. No matching templates — `EmptyState`, `Button` (required)

When `status` is `no-match`, the sections give way to a medium `EmptyState` with the filter-slash glyph, "No matching templates", one sentence, and an outlined small Clear filters `Button` bound to `clearFilters`. The filter keeps its tokens, so the person can see what hid the tiles.

### E. Preview drawer — `Drawer`, `DrawerContent`, `DrawerTitle`, `PanelHeader`, `PanelBody`, `PanelFooter` (required)

A large right `Drawer` controlled by `v-model:open`, opened by the tile. `PanelHeader` carries the mark, the template name as `DrawerTitle` and the drawer's own close button; `PanelBody` scrolls; `PanelFooter` holds the actions at the end: View repository (outlined, trailing external-link icon, new tab) and the primary Deploy. Deploy is a link to the deploy template flow with the template's id; the drawer never runs the deploy itself.

### F. Template facts — `KeyValueList` (required)

Under the description, a two-column `KeyValueList` named "Template details": Framework, Category, Repository (in `bdi`) and Updated. Keep it to facts that help choose; settings belong to the deploy form.

### G. README — `Card`, `DocProse` (required)

A `section` labelled by its "README" heading, with the template's README in a `Card` through `DocProse`, so markdown rendered to plain HTML gets the documentation type scale. Headings inside start at `h4`, under the drawer's own headings.

## Do

- Run the catalog on one `useCollection` call with `filtering`, `propertyFiltering` and `url: true`, and bind `propertyFilterProps`.
- Group the matches by category in a fixed order and drop a category with no match.
- Make the tile's name the only interactive element, and stretch it over the tile.
- Show the framework on the tile as text in a badge, not only as the mark.
- Open the preview in a drawer, so the catalog and the filter stay where they were.
- End the preview on Deploy, a link into `create/deploy-template`, and let that flow run the deploy and raise the async-submit toast.
- Keep README headings below the drawer title (`h4` and down).

## Don't

- Don't deploy from the tile or the drawer without the deploy flow; the template needs a scope, a repository name and its settings.
- Don't put a Deploy button on every tile; the preview is where a person confirms the choice.
- Don't page the catalog or add preferences; a grouped list of tens of items reads better whole.
- Don't colour the tile per framework; the surface stays neutral and the brand shows only in the mark.
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
- The tile's target is a real `button` named by the template name; the description and the framework follow it in reading order.
- The focus ring is drawn inside the tile on the stretched target, so it is never clipped by the grid.
- The drawer traps focus, is named by `DrawerTitle`, closes on Escape and returns focus to the tile that opened it.
- The `PropertyFilter` is named by its `aria-label` and announces the match count after each change.
- The loading band is `aria-busy`; the failure `Alert` is announced and its Retry is a button.

## States

- Default: the catalog is loaded; the filter, the three category sections of tiles and the preview drawer are wired, and filtering to nothing shows No matching templates with Clear filters.
- Preview: the drawer is open on Next.js Starter with its details, the README, View repository and Deploy.
- NoMatch: the search "kubernetes" matches nothing; the token stays and the empty state offers Clear filters.
- Loading: the filter is disabled and two sections of `Skeleton` tiles (mark, name, two lines, tag) hold the layout in a band that is `aria-busy` and named Loading templates.
- Error: the catalog could not load; a danger `Alert` reads Couldn't load templates with Retry, and a medium empty state offers Import from Git so a project can still start.

## Related

- `create/deploy-template` — where Deploy leads; it owns the form, the run and the async-submit toast.
- `state/async-submit` — the toast and inline outcome every deploy follows.
- `view/marketplace` — installable integrations into an existing resource; it lists no templates.
- `create/create-hub` — the creation hub that links here for "Start from a template".
- `Card` and `useCollection` — see `skills/webkit-lists`.
