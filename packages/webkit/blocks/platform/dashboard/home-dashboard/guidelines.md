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

### A. Row actions — `DropdownMenu` (required)

On each resource row, the hover-revealed actions (`View details`, `Edit`, `Delete`).

### B. Control labels and metric definitions — `Tooltip` (required)

Names every icon-only control, and in each usage tile's aside slot explains the metric
(`Share of traffic served from cache instead of your origin.`). Also labels `Dismiss` on the agent card.

### C. Icon-only controls — `IconButton` (required)

Row actions and dismiss. Each has an `aria-label` that names its target (`Actions for my-app`,
`Dismiss agent setup`).

### D. Usage band — `StatTileGroup`, `StatTile` (required)

Four chartless tiles joined in one `StatTileGroup` card (the group draws the surface and the dividers),
in an aside labelled `Usage`, each with a numeric `value`, a unit and a numeric `delta`. Beside them,
the dismissible `Set up your coding agent` card. Home shows at most these four figures; the rest
belongs on a dashboard.

### E. Agent onboarding — `Card` (optional)

A whole-card button: the agent marks, `Set up your coding agent` and one sentence. A mono mark is a
CSS mask whose `url('…')` is quoted: the build inlines the SVG as a `data:` URI, and unquoted it breaks
the declaration and the mark renders as a solid square. Its dismiss
`IconButton` sits outside the button so the two actions never nest.

### F. Resource rows — `Item` (required)

The `Projects`, `Resources`, `Domains` and `Recents` panels in a region labelled `Resources`. Every row
is one full-width link to the resource, with its actions menu revealed on hover and focus. An empty
panel says `Nothing here yet.` (`Nothing opened here yet.` for Recents).

## Do

- Greet by first name in a muted heading; it is the only personal line on the page.
- Make every resource row a single link with the actions menu as a separate control.
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
- Don't nest the dismiss button inside the card's button.
- Don't show a second highlighted button next to `Agent`.

## Copy

- **Greeting:** time of day and first name. `Good morning, Alex`.
- **Tile labels:** the metric in sentence case. `Data transferred`, `Requests per second`.
- **Tile tooltips:** one sentence with a period. `Total bytes delivered across all your resources.`
- **Agent card:** imperative title plus one sentence. `Set up your coding agent` / `Give your editor a prompt that teaches it to build and deploy here.`
- **Empty panel:** `Nothing here yet.`
- **Prompt label:** `Search resources, pages and commands`.

## Accessibility

- The usage band is labelled `Usage` and the panels `Resources`; the layout owns the header, the rail and the one `main`.
- Every icon-only control has an `aria-label` and a `Tooltip`.
- Row actions are reachable by keyboard: the menu trigger appears on focus as well as hover.
- On a new account the prompt opens the layout's command palette, which also opens with ⌘K / Ctrl K.
- Entrance animations and the card's dismiss transition honour `prefers-reduced-motion`.

## States

- Default: populated Home for an account that owns resources (usage band, agent card, resource panels).
- Empty: a brand-new account; the first-access screen with the greeting, the command prompt that opens the palette, and the three doors (create a project, add a domain with an availability check, set up an agent).

## Related

- `shells/console` — the shell Home renders inside.
- `platform/states/page-wires` — the Overview and Onboarding wires that hold Home while it loads.
- `platform/states/first-use` — the first-use state of one resource list.
- `platform/dashboard/analytics-dashboard` — where usage detail lives.
