# Console

The application shell every signed-in page renders inside, built on `AppLayout`. The user browses and moves laterally between modules, so the shell keeps the whole product one step away: a navigation rail on the left (wordmark, the ⌘K palette, the grouped navigation, the account menu) and a content zone on the right headed by one global header (search, Create, Agent, the avatar). Pages render only their own content in the zone; this block's page bodies are stand-ins for `platform/view/table-view` and `platform/detail/details-page`.

## When to use

- Every browse page: first-level lists, Home and dashboards, resource details with their tabs, settings.

## When not to use

- Create, edit and deploy flows: use the focused shell headed by `headers/creation-header`, with no rail.
- Signed-out screens: `platform/auth` with `headers/auth-header`.
- Documentation and marketing: `shells/documentation`, `shells/website`.

## Building blocks

### A. Rail — `Sidebar` (required)

Full height, `resizable` by its edge and `collapsible` from its foot, with labelled resize and collapse controls (`Resize sidebar`, `Collapse sidebar`, `Expand sidebar`). Header holds the wordmark and the palette, body the navigation, footer the account. While compact the same `Sidebar` renders inside the `AppLayout` navigation drawer (block S).

### B. Wordmark — `Brand` (required)

At the top of the rail and at the start of the header, each linked home with `aria-label="Azion home"`.

### C. Palette — `Command` (required)

The ⌘K palette: `Command.Input`, then Recents (only while the query is empty), the navigation groups, Actions and Account, separated by `Command.Separator`, and `Command.Empty` for no match. Opened from the header search and the shortcut.

### D. Navigation — `Menu` (required)

The grouped sections with drill-in levels and `Menu.Back`, driven by `groups` and `active-id`. The active item is the current module.

### E. Identity — `Avatar` (required)

Twice: in the rail footer next to the user's name, and in the header inside a button labelled `Account settings`. The user is never shown signed out, even with the rail collapsed.

### F. Account menu — `DropdownMenu` (required)

Opens upward from the rail footer: identity, then Account settings and Personal tokens, the theme, links out (Home page, Changelog, Feedback, Docs), Log out, and the Upgrade to Pro and system status foot.

### G. Hints — `Tooltip` (required)

Names every icon-only control: the account menu, the navigation trigger, the collapsed Create and Agent, the toolbar icons.

### H. Icon actions — `IconButton` (required)

The account menu trigger, the navigation trigger while compact, search below `--container-2xl` (the `@2xl:` container variant), Create and Agent while compact, and the page toolbar (Refresh, Download CSV, Columns).

### I. Theme — `ThemeSwitcher` (required)

Inside the account menu, labelled `Theme`.

### J. Buttons — `Button` (required)

Upgrade to Pro (`secondary`) in the account menu; Create (`primary`) in the header while not compact; the page's own actions in the stand-in body.

### K. System status — `StatusIndicator` (required)

At the foot of the account menu: `All systems normal` with `success` severity; switch severity and label when the status page reports an incident.

### L. Header — `GlobalHeader` (required)

One header, inside the content zone (an `@container`), `aria-label="Console"`. The breadcrumb names the location on every level while not compact: one unlinked crumb on a first-level page, the module and the resource from the second level (see the DetailPage state).

### M. Shortcut — `Kbd` (required)

`meta` + `K` inside the search field-button shown while the bar is at least `--container-2xl` wide.

### N. Agent — `ButtonHighlight` (required)

The AI assistant entry in the header while not compact.

### O. Location — `Breadcrumb` (required)

In the header while not compact: `Resources` alone on the ListPage, with no link; module, resource and the environment `Select` on the DetailPage. A tab is never a crumb.

### P. Search field — `Input` (stand-in body)

The sample list's search, with a leading icon and an `aria-label`. The ListPage has no `PageHeader`: per `skills/webkit-navigation` the crumb names the first-level list and the page opens on its controls row, search and Filter on the start side, the toolbar icons, Documentation (outlined) and Create Resource (primary, large, the page's only large control) on the end side.

### Q. Table frame — `Card` (stand-in body)

Flush (`:padded="false"`), holding the table; the card is the only border.

### R. Frame — `AppLayout` (required)

Every state renders inside one `AppLayout`: the rail in `#navigation`, the header in `#header`, the page in the default slot (which scrolls on its own), flash messages in `#notifications` and the notifications list in `#tools`. The layout measures its own width, not the viewport's, so the shell turns compact in a narrow host (a split view, an embedded preview) the same way it does on a phone.

### S. Compact navigation — `AppLayout` navigation drawer (required below `compactBelow`)

While compact, `AppLayout` renders the same `Sidebar` inside its navigation drawer, named `Navigation`; the `#navigation` scope's `drawer` flag drops the rail-only resize and collapse controls there. The header scope's `compact` swaps the breadcrumb for the hamburger and wordmark and `openNavigation` opens the drawer. Choosing a `Menu` item calls `closeNavigation` from the `#navigation` scope, so the drawer closes on every navigation. No page composes its own `Drawer` for the rail.

## Do

- Compose this shell once in the app and render every browse page through its default slot.
- Keep the rail's navigation and the palette's navigation groups built from the same data.
- Keep exactly one `GlobalHeader` per page, inside the content zone.
- Apply the content inset once in the shell; pages never re-pad.

## Don't

- Don't render the rail on create, edit or deploy pages.
- Don't add page actions to the global header; they belong to the page's controls row or tab row.
- Don't hide the avatar when the rail is collapsed or in the drawer.
- Don't open the notifications region as a popover over the page; it is a region beside the content that the reader keeps open while working.

## Copy

- **Palette placeholder:** what can be searched: `Search resources, pages and commands`. **Empty:** a full sentence: `No resource, page or command matches your search.`
- **Navigation and menu items:** nouns as the module pages are titled, in sentence case (`Personal tokens`, `Activity history`, `Build and deployment`, `Account settings`); Azion product names keep theirs (`Edge DNS`). No ampersand.
- **Status:** a short state, not a sentence: `All systems normal`.
- **Header actions:** `Create`, `Agent`, `Search`.
- **Module create:** `Create` plus the entity, on the controls row: `Create Resource`.

## Accessibility

- The rail is a labelled navigation (`Main navigation`); its resize handle and collapse control have names and work by keyboard.
- ⌘K opens the palette and is announced with `aria-keyshortcuts="Meta+K"`; focus returns to the trigger on close.
- The drawer traps focus while open and returns it to the navigation trigger.
- Icon-only controls have both an `aria-label` and a tooltip.
- The bell is a toggle (`aria-pressed`) and names the unread count; unread items carry a visually hidden `Unread:` prefix, not colour alone.

## States

- ListPage: a first-level list page in the `AppLayout` default slot; the header carries the single unlinked `Resources` crumb and the page opens on its controls row.
- DetailPage: a resource detail page in the same `AppLayout` frame. The breadcrumb reads module, resource, then the environment as a small `Select` labelled `Switch environment` (a search `Input`, each environment tagged with its deployment policy, a muted line when nothing matches, Add Environment at its foot). The default slot holds one `main` with a full-bleed `PageTabs` (Overview, Deployments, Settings, the outlined Deploy in `#actions`) that stays in view while the tab content scrolls under it.
- Notifications: the bell opens the notifications region beside the content (a drawer when narrow), with unread items raised, Edit and Redeploy on each deploy, Mark all as read, Clear all, and the EmptyState once cleared; the failed deploy also shows as a flash Alert above the page. The flash sits in `#notifications` and the list in `#tools`, so both the rail and the list become drawers in a narrow host. The bell's `aria-label` carries the unread count and the `Badge` on it is hidden from assistive technology.

## Related

- `headers/resource-header` — this shell's header on its own.
- `headers/creation-header` — the focused shell for create, edit and deploy.
- `platform/view/table-view`, `platform/detail/details-page`, `platform/dashboard/home-dashboard` — the real page bodies.
