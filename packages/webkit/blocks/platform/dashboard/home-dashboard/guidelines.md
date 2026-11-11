# Home dashboard

The Console's Home page inside the platform shell: the first screen a signed-in user lands on. Its job
is to get them back to work fast. For an account that owns resources it shows a short usage band and
the resources they touch most (projects, resources, domains, recents), every row a link. For a
brand-new account it becomes the first-access screen: a greeting, the command prompt and three doors
to a first project, a first domain and a coding agent. It is not an analytics page; detail lives on
each resource's own dashboard.

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

### A. Navigation rail — `Sidebar` (required)

The shell's rail with the navigation groups (Home, Projects, Deployments, …). On small screens it
moves into the navigation drawer (R–U). Collapse, expand and resize controls carry their own labels.

### B. Wordmark — `Brand` (required)

The product mark at the top of the rail and the header, inside a link labelled `Azion home`.

### C. Command palette — `Command` (required)

Opened from the rail search or ⌘K: `Search resources, pages and commands`, with `Recents`, the
navigation groups, `Actions` and `Account`. On a new account it is also what the Home prompt opens.

### D. Navigation — `Menu` (required)

The grouped navigation items inside the rail, and the account row at its foot.

### E. Account identity — `Avatar` (required)

The user's initials in the account row and the header's account button.

### F. Account and row actions — `DropdownMenu` (required)

The account menu (`Account Settings`, `Personal Tokens`, theme, `Home Page`, `Changelog`, `Feedback`,
`Docs`, `Log out`, `Upgrade to Pro`, system status) and, on each resource row, the hover-revealed
actions (`View details`, `Edit`, `Delete`).

### G. Control labels and metric definitions — `Tooltip` (required)

Names every icon-only control, and in each usage tile's aside slot explains the metric
(`Share of traffic served from cache instead of your origin.`). Also labels `Dismiss` on the agent card.

### H. Icon-only controls — `IconButton` (required)

Open navigation, search, row actions and dismiss. Each has an `aria-label` that names its target
(`Actions for my-app`, `Dismiss agent setup`).

### I. Theme — `ThemeSwitcher` (required)

Inside the account menu, labelled `Theme`.

### J. Create and upgrade — `Button` (required)

`Create` in the header, `Upgrade to Pro` in the account menu.

### K. System status — `StatusIndicator` (required)

`All systems normal` at the foot of the account menu, in words, with its status color.

### L. Top bar — `GlobalHeader` (required)

The header labelled `Console`: navigation toggle on small screens, wordmark, search, `Create`,
`Agent` and the account button.

### M. Search shortcut — `Kbd` (required)

Shows ⌘K on the search affordance so the shortcut is discoverable.

### N. Agent — `ButtonHighlight` (optional)

`Agent` in the header, the one emphasized entry to the coding agent. Only one highlighted button per
screen.

### O. Usage band — `StatTile` (required)

Four chartless tiles in an aside labelled `Usage`, each with value, unit and delta. Beside them, the
dismissible `Set up your coding agent` card. Home shows at most these four figures; the rest belongs on
a dashboard.

### P. Agent onboarding — `Card` (optional)

A whole-card button: the agent marks, `Set up your coding agent` and one sentence. Its dismiss
`IconButton` sits outside the button so the two actions never nest.

### Q. Resource rows — `Item` (required)

The `Projects`, `Resources`, `Domains` and `Recents` panels in a region labelled `Resources`. Every row
is one full-width link to the resource, with its actions menu revealed on hover and focus. An empty
panel says `Nothing here yet.` (`Nothing opened here yet.` for Recents).

### R. Navigation drawer — `Drawer` (required on small screens)

Holds the rail on narrow viewports, opened from the header's navigation toggle.

### S. Drawer layer — `DrawerPortal` (required with the drawer)

Renders the drawer at the document root so it stacks over the page.

### T. Drawer scrim — `DrawerOverlay` (required with the drawer)

Dims the page and closes the drawer on click.

### U. Drawer panel — `DrawerContent` (required with the drawer)

The labelled panel (`Navigation`) that contains the `Sidebar`.

## Do

- Greet by first name in a muted heading; it is the only personal line on the page.
- Make every resource row a single link with the actions menu as a separate control.
- Let the user dismiss the agent card for good.
- Show the first-access screen, not a grid of empty panels, when the account owns nothing.

## Don't

- Don't add charts to Home; link to the dashboard that has them.
- Don't put more than four usage tiles in the band.
- Don't nest the dismiss button inside the card's button.
- Don't show a second highlighted button next to `Agent`.

## Copy

- **Greeting:** time of day and first name. `Good morning, Alex`.
- **Tile labels:** the metric in sentence case. `Data transferred` (see the known gap below).
- **Tile tooltips:** one sentence with a period. `Total bytes delivered across all your resources.`
- **Agent card:** imperative title plus one sentence. `Set up your coding agent` / `Give your editor a prompt that teaches it to build and deploy here.`
- **Empty panel:** `Nothing here yet.`
- **Palette placeholder:** `Search resources, pages and commands`.
- Known gap: the SFC's tile labels (`Data Transferred`, `Requests / Second`, `Bandwidth Saving`, `Data Offload`) and some account menu items (`Account Settings`, `Personal Tokens`, `Home Page`) are in title case; `webkit-microcopy` requires sentence case.

## Accessibility

- The header is labelled `Console`, the rail `Main navigation`, the usage band `Usage`, the panels `Resources`, the drawer `Navigation`.
- Every icon-only control has an `aria-label` and a `Tooltip`.
- Row actions are reachable by keyboard: the menu trigger appears on focus as well as hover.
- The command palette opens with ⌘K and from the search affordance; the shortcut is shown with `Kbd`.
- Entrance animations and the card's dismiss transition honour `prefers-reduced-motion`.

## States

- Default: populated Home for an account that owns resources (usage band, agent card, resource panels).
- Empty: a brand-new account; the first-access screen with the greeting, the command prompt that opens the palette, and the three doors (create a project, add a domain with an availability check, set up an agent).

## Related

- `shells/console` — the shell Home renders inside.
- `platform/states/page-wires` — the Overview and Onboarding wires that hold Home while it loads.
- `platform/states/first-use` — the first-use state of one resource list.
- `platform/dashboard/analytics-dashboard` — where usage detail lives.
