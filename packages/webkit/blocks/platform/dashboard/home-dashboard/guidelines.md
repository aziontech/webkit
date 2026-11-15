# Home dashboard

The Console's Home page: the first screen a signed-in user lands on. Its job
is to get them back to work fast. For an account that owns resources it shows a short usage band and
the resources they touch most (projects, resources, domains, recents), every row a link. For a
brand-new account it becomes the first-access screen: a greeting, the command prompt and three doors
to a first project, a first domain and a coding agent. It is not an analytics page; detail lives on
each resource's own dashboard.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shells/console`), which owns the rail, the header, the search palette and the `main`. The populated Home fits the screen at `xl` (each resource panel scrolls its own rows), so its root carries `data-layout-fill` and scrolls itself (`overflow-y-auto`): below `xl` the root scrolls as one page, its content centred while it fits (`justify-center-safe`). The first-access screen (Empty) is a centred page with nothing pinned; it does not fill, and the layout's `main` scrolls it (`h-dvh` on the populated root only sizes a standalone preview).

## When to use

- The landing page after sign-in in the Console.
- The reader needs to resume work (open a recent resource) more than to analyse data.
- The same page must serve both a populated and a brand-new account.

## When not to use

- Analysing traffic or usage: use `platform/dashboard/analytics-dashboard` or
  `platform/dashboard/data-dashboard`.
- The empty first page of one resource list: use `platform/states/first-use`.
- Only the shell, with another page inside: use `shells/console`.
- A placeholder while Home loads: use the Overview and Onboarding wires of `platform/states/page-wires`.

## Building blocks

### A. Control labels — `Tooltip` (required)

Names the icon-only `Dismiss` control on the agent card.

### B. Icon-only controls — `IconButton` (required)

Dismiss on the agent card, with an `aria-label` that names its target (`Dismiss agent setup`).

### C. Usage band — `StatTileGroup`, `StatTile`, `Hint` (required)

Four chartless tiles joined in one `StatTileGroup` card (the group draws the surface and the dividers),
in an aside labelled `Usage`, each with a numeric `value`, a unit and a numeric `delta`, and a `Hint`
in the aside slot that explains the metric (`Share of traffic served from cache instead of your origin.`);
`Hint` is focusable, so keyboard and touch readers reach the definition. Beside them,
the dismissible `Set up your coding agent` card. Home shows at most these four figures; the rest
belongs on a dashboard.

### D. Agent onboarding — `Card`, `Item`, `Logo` (optional)

A whole-card link (`Item` with `href` to the agent setup page): the agent marks, `Set up your coding agent` and one sentence. Each mark is a
decorative `Logo` at `size="small"` in a bordered tile; a mono mark takes `kind="current"` and the
tile's text colour, a coloured one `kind="color"`. Its dismiss `IconButton` sits outside the button
so the two controls never nest.

### E. Resource rows — `Item`, `Link`, `EmptyState` (required)

The `Projects`, `Resources`, `Domains` and `Recents` panels in a region labelled `Resources`. A panel
heading with a list page is a `Link` to it. Every row is an `Item` with `href` to the resource
(`/projects/4410203040`), so the whole row is one link with its own hover and focus ring; edit and
delete live on the resource's page, never as buttons inside the row. An empty panel is a small `EmptyState` (`No domains yet`, `Nothing opened yet`
for Recents).

### F. Failure — `Alert` (required)

When Home's data cannot load, the usage band and each panel show a danger `Alert` with Retry in place
of their content; the greeting and the agent card stay.

### G. Classic summary — `StatTile`, `Card`, `IconButton`, `Tooltip` (optional)

Variant Summary only; it adds `Hint`, `DataTable`, `Table`, `Tag` and `Link` to the page: the classic overview for readers who want figures and tables on Home instead of
resource panels. A main column and, from `xl`, an aside rail of `--container-xs` beside it (below
`xl` the aside follows the main column).

- **Metrics**: an `h2` with a `Hint` on what the figures cover, four `StatTile`s with a `Hint` in the
  aside (label, figure, unit; no delta and no sparkline), and the window they cover as a muted caption
  aligned to the end (`Jul 14, 2026, 6:56 PM – Jul 14, 2026, 7:56 PM UTC`).
- **Resources**: an `h2` with a `Hint`, then an unpadded `Card` around a compact `DataTable` of the
  resources changed last (name, domain as `Table.CellLink`, status as a small `Tag`, `Table.CellTime`
  with the author, `Table.CellActions`), and a `View all DNS zones` `Link` in the card footer.
- **Recent activity**: an unpadded `Card` around a compact `DataTable` of the last five operations
  (date, operation, type, resource, author email); `Created` and `Deleted` read as small success and
  danger `Tag`s, any other operation as plain text. `View all activity` in the footer.
- **Aside**: a `Monthly usage` `Card` with a key and value list and `View all usage`, then a
  `Marketplace trends` `Card` featuring one template (mark, name `Link`, one sentence, vendor and
  version) with Previous and Next `IconButton`s and position dots in the footer; the position is
  announced politely (`Template 2 of 3: Image optimizer`).

## Do

- Greet by first name in a muted heading; it is the only personal line on the page.
- Make every resource row a single link (`Item` with `href`) and keep row actions on the resource's page.
- Let the user dismiss the agent card for good.
- Show the first-access screen, not a grid of empty panels, when the account owns nothing.
- Open the layout's palette from the first-access prompt with `useConsoleLayout({ optional: true })` and `layout?.openSearch()` (the body also renders alone, in its preview and test, where the call returns `null`); never wrap `useConsoleLayout()` in `try` / `catch`, and never mount a second `Command`.
- Mark the populated page root with `data-layout-fill` and let it scroll, so the panels scroll their rows at `xl` and the page scrolls as one below it.

## Don't

- Don't add charts to Home; link to the dashboard that has them.
- Don't put more than four usage tiles in the band.
- Don't hand-build the band's card, grid or dividers around the tiles; `StatTileGroup` draws them.
- Don't pass figures as strings or flags as `'true'` / `'false'`: a tile's `value` and `delta` are
  numbers, and the string `'false'` is truthy.
- Don't nest the dismiss button inside the card's link.
- Don't show a second highlighted button next to `Agent`.

## Copy

- **Greeting:** time of day and first name. `Good morning, Alex`.
- **Tile labels:** the metric in sentence case. `Data transferred`, `Requests per second`.
- **Tile tooltips:** one sentence with a period. `Total bytes delivered across all your resources.`
- **Agent card:** imperative title plus one sentence. `Set up your coding agent` / `Give your editor a prompt that teaches it to build and deploy here.`
- **Empty panel:** `No <things> yet` with one sentence (`Domains you create show up here.`); Recents: `Nothing opened yet`.
- **Failure:** `Couldn't load <thing>. Check your connection and retry.` with Retry.
- **Prompt label:** `Search resources, pages and commands`.
- **Summary:** section headings `Metrics`, `Resources`, `Recent activity`; card titles `Monthly usage`, `Marketplace trends`; footer links `View all <thing>` in sentence case (`View all DNS zones`).

## Accessibility

- The usage band is labelled `Usage` and the panels `Resources`; the layout owns the header, the rail and the one `main`.
- Every icon-only control has an `aria-label` and a `Tooltip`.
- Every resource row is one link in the tab order; its focus ring is the row's.
- On a new account the prompt opens the layout's command palette, which also opens with ⌘K / Ctrl K.
- Entrance animations and the card's dismiss transition honour `prefers-reduced-motion`.

## States

- Default: populated Home for an account that owns resources (usage band, agent card, resource panels).
- Failed: Home's data could not load; the usage band and every panel show a danger `Alert` with Retry.
- Empty: a brand-new account; the first-access screen with the greeting, the command prompt that opens the palette, and the three doors (create a project, add a domain with an availability check, set up an agent).
- Summary: the classic overview; metric tiles with the window caption, the resources and recent activity tables, and the aside with monthly usage and a featured marketplace template.

## Related

- `shells/console` — the shell Home renders inside.
- `platform/states/page-wires` — the Overview and Onboarding wires that hold Home while it loads.
- `platform/states/first-use` — the first-use state of one resource list.
- `platform/dashboard/analytics-dashboard` — where usage detail lives.
