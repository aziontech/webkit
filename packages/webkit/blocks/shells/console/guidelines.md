# Console

The application shell every signed-in page renders inside. The user browses and moves laterally between modules, so the shell keeps the whole product one step away: a navigation rail on the left (wordmark, the ⌘K palette, the grouped navigation, the account menu) and a content zone on the right headed by one global header (search, Create, Agent, the avatar). Pages render only their own content in the zone; this block's page bodies are stand-ins for `platform/view/table-view` and `platform/detail/details-page`.

## When to use

- Every browse page: first-level lists, Home and dashboards, resource details with their tabs, settings.

## When not to use

- Create, edit and deploy flows: use the focused shell headed by `headers/creation-header`, with no rail.
- Signed-out screens: `platform/auth` with `headers/auth-header`.
- Documentation and marketing: `shells/documentation`, `shells/website`.

## Building blocks

### A. Rail — `Sidebar` (required)

Full height, `resizable` by its edge and `collapsible` from its foot, with labelled resize and collapse controls (`Resize sidebar`, `Collapse sidebar`, `Expand sidebar`). Header holds the wordmark and the palette, body the navigation, footer the account. Below `md` the same `Sidebar` renders inside the navigation drawer (block R).

### B. Wordmark — `Brand` (required)

At the top of the rail and at the start of the header, each linked home with `aria-label="Azion home"`.

### C. Palette — `Command` (required)

The ⌘K palette: `Command.Input`, then Recents (only while the query is empty), the navigation groups, Actions and Account, separated by `Command.Separator`, and `Command.Empty` for no match. Opened from the header search and the shortcut.

### D. Navigation — `Menu` (required)

The grouped sections with drill-in levels and `Menu.Back`, driven by `groups` and `active-id`. The active item is the current module.

### E. Identity — `Avatar` (required)

Twice: in the rail footer next to the user's name, and in the header inside a button labelled `Account settings`. The user is never shown signed out, even with the rail collapsed.

### F. Account menu — `DropdownMenu` (required)

Opens upward from the rail footer: identity, then Account Settings and Personal Tokens, the theme, links out (Home Page, Changelog, Feedback, Docs), Log out, and the Upgrade to Pro and system status foot.

### G. Hints — `Tooltip` (required)

Names every icon-only control: the account menu, the navigation trigger, the collapsed Create and Agent, the toolbar icons.

### H. Icon actions — `IconButton` (required)

The account menu trigger, the navigation trigger below `md`, search below `--container-2xl`, Create and Agent below `md`, and the page toolbar (Refresh, Download CSV, Columns).

### I. Theme — `ThemeSwitcher` (required)

Inside the account menu, labelled `Theme`.

### J. Buttons — `Button` (required)

Upgrade to Pro (`secondary`) in the account menu; Create (`primary`) in the header from `md`; the page's own actions in the stand-in body.

### K. System status — `StatusIndicator` (required)

At the foot of the account menu: `All systems normal` with `success` severity; switch severity and label when the status page reports an incident.

### L. Header — `GlobalHeader` (required)

One header, inside the content zone (an `@container`), `aria-label="Console"`. The breadcrumb joins it from the second level (see the DetailPage state).

### M. Shortcut — `Kbd` (required)

`meta` + `K` inside the search field-button shown while the bar is at least `--container-2xl` wide.

### N. Agent — `ButtonHighlight` (required)

The AI assistant entry in the header from `md`.

### O. Page title — `PageHeader` (stand-in body)

Title, description and actions of the sample list page. Real pages follow `skills/webkit-navigation`: a first-level list opens on its controls row, a tabbed page has no `PageHeader`.

### P. Search field — `Input` (stand-in body)

The sample list's search, with a leading icon and an `aria-label`.

### Q. Table frame — `Card` (stand-in body)

Flush (`:padded="false"`), holding the table; the card is the only border.

### R. Mobile navigation — `Drawer` (required below md)

Opened from the header trigger, small. Selecting an item closes it.

### S. Drawer layer — `DrawerPortal` (required below md)

Mounts the drawer at the document root.

### T. Drawer backdrop — `DrawerOverlay` (required below md)

Dims the page behind the open drawer.

### U. Drawer panel — `DrawerContent` (required below md)

`aria-label="Navigation"`, holding the same rail with brand, `Menu` and account footer.

## Do

- Compose this shell once in the app and render every browse page through its default slot.
- Keep the rail's navigation and the palette's navigation groups built from the same data.
- Keep exactly one `GlobalHeader` per page, inside the content zone.
- Apply the content inset once in the shell; pages never re-pad.

## Don't

- Don't render the rail on create, edit or deploy pages.
- Don't add page actions to the global header; they belong to the page's controls row or tab row.
- Don't hide the avatar when the rail is collapsed or in the drawer.

## Copy

- **Palette placeholder:** what can be searched: `Search resources, pages and commands`. **Empty:** a full sentence: `No resource, page or command matches your search.`
- **Navigation and menu items:** nouns as the module pages are titled; product entities keep their capitalization (`Personal Tokens`).
- **Status:** a short state, not a sentence: `All systems normal`.
- **Header actions:** `Create`, `Agent`, `Search`.

## Accessibility

- The rail is a labelled navigation (`Main navigation`); its resize handle and collapse control have names and work by keyboard.
- ⌘K opens the palette and is announced with `aria-keyshortcuts="Meta+K"`; focus returns to the trigger on close.
- The drawer traps focus while open and returns it to the navigation trigger.
- Icon-only controls have both an `aria-label` and a tooltip.

## States

- ListPage: a first-level list page in the content zone, header without breadcrumb.
- DetailPage: a resource detail page; the breadcrumb reads module, resource, then an environment Select, and a full-bleed tab bar carries Overview, Deployments and Settings with the outlined Deploy action.

## Related

- `headers/resource-header` — this shell's header on its own.
- `headers/creation-header` — the focused shell for create, edit and deploy.
- `platform/view/table-view`, `platform/detail/details-page`, `platform/dashboard/home-dashboard` — the real page bodies.

Known gap: the ListPage stand-in body renders a `PageHeader` on a first-level list and the header shows no crumb, while `skills/webkit-navigation` asks for a single unlinked crumb and no `PageHeader` on first-level lists.
