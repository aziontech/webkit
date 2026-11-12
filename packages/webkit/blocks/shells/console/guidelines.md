# Console

The application shell every signed-in page renders inside. The user browses and moves laterally between modules, so the shell keeps the whole product one step away: the navigation rail (wordmark, grouped navigation with drill-in levels, the account at its foot), one global header (breadcrumbs, search, the app's actions, the avatar) and the ⌘K palette. All of that is one component, `ConsoleLayout`: this block is the app's `App.vue` — compose it once around `RouterView` and every console page is only the body rendered through its default slot. The body here is a stand-in for `platform/view/table-view`.

## When to use

- The root of a console app: every browse page (first-level lists, Home and dashboards, resource details with their tabs, settings) renders inside it.

## When not to use

- Create, edit and deploy flows: use the focused shell headed by `headers/creation-header`, with no rail.
- Signed-out screens: `platform/auth` with `headers/auth-header`.
- Documentation and marketing: `shells/documentation`, `shells/website`.
- A page needing the resizable split panel: compose `AppLayout` directly for that page.

## Building blocks

### A. Shell — `ConsoleLayout` (required)

Composed once in `App.vue` around `RouterView`. `navigation` is the console tree as data: groups of rows `{ id, label, icon, to }` (`to` is followed with the app's router; `href` for plain URLs; `kind: 'drill'` with `groups` for Settings; `tagValue` for a `Preview` badge). The active row follows the current route; leave `active-id` empty in the app (this block sets it only because its preview has no router). `breadcrumbs` takes the trail from the route meta (`{ label, to }`; empty on a first-level page). `account` is the signed-in user. The layout renders the rail (resizable and collapsible, a drawer below 768 px of its own width), the header, the `SearchTrigger` wired to the ⌘K `Command` palette (every navigation page is listed), the avatar, and the single `<main>`; a page opens the same palette with `useConsoleLayout().openSearch()`.

### B. Actions — `Button` (required)

In the `actions` slot: Create (`primary`, `medium`, with its icon) while not compact. In the page body: Documentation (`outlined`) and the create action, and Upgrade to Pro (`secondary`) in the account menu.

### C. Agent — `ButtonHighlight` (required)

The AI assistant entry in the `actions` slot, after Create, while not compact.

### D. Hints — `Tooltip` (required)

Names every icon-only control: the compact Create and Agent, the page toolbar icons.

### E. Icon actions — `IconButton` (required)

Create and Agent while the `actions` slot's `compact` is true; the page toolbar (Refresh, Download CSV, Columns).

### F. Palette groups — `Command` (required)

In the `search` slot: Recents (only while the query is empty) and Actions, as `Command.Group`s of `Command.Item`s; their selection arrives as `search-select`. The navigation pages are added by the layout.

### G. Account menu — `DropdownMenu` (required)

In the `account-menu` slot, as `DropdownMenu.Group`s: identity, Account settings and Personal tokens, the theme, Docs, Log out, and the Upgrade to Pro and system status foot. The layout opens it from the rail footer and from the header avatar.

### H. Theme — `ThemeSwitcher` (required)

Inside the account menu, labelled `Theme`.

### I. System status — `StatusIndicator` (required)

At the foot of the account menu: `All systems normal` with `success` severity; switch severity and label when the status page reports an incident.

### J. Page title — `PageHeader` (stand-in body)

The list page's title and description, with Documentation and the create action in its `actions` slot.

### K. Search field — `Input` (stand-in body)

The list's search, with a leading icon and an `aria-label`, growing between Filter and the toolbar icons.

### L. Table frame — `Card` (stand-in body)

Flush (`:padded="false"`), holding the table; the card is the only border.

## Do

- Compose `ConsoleLayout` once in `App.vue` and render every browse page through its default slot; replace this block's stand-in body with `<RouterView />`.
- Keep the navigation in one data file shared by the app; the rail and the palette both read it.
- Give every row `to` for in-app routes; derive `breadcrumbs` from the route.
- Frame a list or form body with `layout-boundary` + `layout-column`; open a detail body flush on `PageTabs`.

## Don't

- Don't render `AppLayout`, `Sidebar`, `GlobalHeader`, `SearchTrigger`, a `Command` palette or a `<main>` in a page; the layout owns them.
- Don't render the rail on create, edit or deploy pages.
- Don't add page actions to the global header; they belong to the page's header, controls row or tab row.
- Don't hide the avatar when the rail is collapsed or in the drawer.
- Don't open the notifications region as a popover over the page; it is the layout's tools region beside the content.

## Copy

- **Palette groups:** `Recents`, `Actions`; the layout's placeholder `Search pages and commands` and its empty line come from the locale catalog.
- **Navigation and menu items:** nouns as the module pages are titled (`Personal tokens`, `Activity history`, `Build and deployment`, `Account settings`); Azion product names keep theirs (`Edge DNS`, `Real-Time Metrics`). No ampersand.
- **Status:** a short state, not a sentence: `All systems normal`.
- **Header actions:** `Create`, `Agent`.
- **Module create:** `Create` plus the entity: `Create Application`.

## Accessibility

- One `main` (the layout's), one `banner` (the header), the rail as a labelled navigation (`Main navigation`); the page body starts with its `h1` (`PageHeader`).
- ⌘K / Ctrl K opens the palette, announced through `aria-keyshortcuts` on the search; focus returns to the trigger on close.
- The rail's drawer traps focus while open, closes on `Escape` and when a row is chosen, and returns focus to the menu button.
- Icon-only controls have both an `aria-label` and a tooltip.
- The bell is a toggle (`aria-pressed`) and names the unread count; unread items carry a visually hidden `Unread:` prefix, not colour alone.

## States

- ListPage: a first-level list page in the `ConsoleLayout` default slot: no breadcrumb on a first level, the page opens on its `PageHeader` (title, description, Documentation and the create action) and its controls row (Filter, search, Refresh, Download CSV, Columns) over the table.
- DetailPage: a resource detail page rendered through `ConsoleLayout`. The `breadcrumbs` slot composes the trail (a crumb that is a control, so the data prop does not fit): `Breadcrumb.List` with Applications, the application, then the environment as a small `Select` labelled `Switch environment` (a search `Input`, each environment tagged with its deployment policy, a muted line when nothing matches, Add Environment at its foot). The default slot is flush and opens on a full-bleed `PageTabs` (Overview, Deployments, Settings, the outlined Deploy in `#actions`), sticky at the top of the layout's scrolling region so it stays in view while the tab content scrolls under it; no `main` of its own, the layout owns it.
- Notifications: the ListPage through `ConsoleLayout` with the bell after Create and Agent in the `actions` slot; it toggles the layout's tools region (`v-model:tools-open`, `tools-label="Notifications"`), a region beside the content and a drawer when narrow. The `tools` slot holds the list: unread items raised, Edit and Redeploy on each deploy, Mark all as read, Clear all, and the EmptyState `You are all caught up` once cleared. The failed deploy also shows as a flash Alert (Edit, Redeploy) in the `notifications` slot above the page. The bell's `aria-label` carries the unread count, `aria-pressed` follows the region, and the `Badge` on it is hidden from assistive technology.
- AccountSwitch: the ListPage through `ConsoleLayout` with the current account in the `header-start` slot, before the breadcrumbs (square `Avatar` with its initials, the name, a chevron), `Switch account (Ctrl+O)` on its tooltip and `aria-keyshortcuts`; while the slot's `compact` is true it shows the avatar and the chevron only (the name stays in its `aria-label`). It and the shortcut open a large `Dialog`, rendered beside the layout, with a search `Input` (name, ID or client ID) over a `Table` of the account tree: organizations, groups and workspaces indented by depth, expand and collapse buttons with `aria-expanded`, each name a button that switches, `Current` on the active one, type as `Table.CellStatus`, ID and client ID as `Table.CellId`. Switching closes the dialog and toasts `Switched to <name>.` with the IDs; the footer shows the current account and Account settings. A search with no match shows Clear search.

## Related

- `headers/resource-header` — this shell's header on its own.
- `headers/creation-header` — the focused shell for create, edit and deploy.
- `platform/view/table-view`, `platform/detail/details-page`, `platform/dashboard/home-dashboard` — the page bodies rendered in the slot.
