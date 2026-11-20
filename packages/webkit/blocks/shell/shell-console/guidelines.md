# ShellConsole

The application shell every signed-in page renders inside. The user browses and moves laterally between modules, so the shell keeps the whole product one step away: the navigation rail (wordmark, grouped navigation with drill-in levels, the account at its foot), one global header (breadcrumbs, search, the app's actions, the avatar) and the ⌘K palette. All of that is one component, `ConsoleLayout`: this block is the app's `App.vue` — compose it once around `RouterView` and every console page is only the body rendered through its default slot. The body here is a stand-in for `view/view-table`.

## When to use

- The root of a console app: every browse page (first-level lists, Home and dashboards, resource details with their tabs, settings) renders inside it.

## When not to use

- Create, edit and deploy flows: use the focused shell headed by `top-bar/top-bar-creation`, with no rail.
- Signed-out screens: `auth/auth-sign-in` with `top-bar/top-bar-auth`.
- Documentation and marketing: `shell/shell-docs`, `shell/shell-site`.
- A page needing the resizable split panel: compose `AppLayout` directly for that page.

## Building blocks

### A. Shell — `ConsoleLayoutRoot` (required)

Composed once in `App.vue` around `RouterView` (imported from `console-layout-root` and bound as `ConsoleLayoutRoot`, the PascalCase of the path, since the root has no dot-notation parts; a page that renders `ConsoleLayout.Breadcrumb`, as DetailPage does, imports the compound `console-layout` instead). `navigation` is the console tree as data: groups of rows `{ id, label, icon, href }` (an in-app `href` is followed with the app's router, an external one loads normally; `type: 'drill'` with `groups` for Settings; `tagValue` for a `Preview` badge). The active row follows the current route; leave `active-id` empty in the app (this block sets it only because its preview has no router). `breadcrumbs` takes a static trail from the route meta (`{ label, href? }`, the last crumb, the current page, without `href`; empty on a first-level page); a page that owns its trail renders `ConsoleLayout.Breadcrumb` instead, and a workspace page puts `data-layout-fill` on its root. `account` is the signed-in user. The layout renders the rail (resizable and collapsible, a drawer below 768 px of its own width), the header, the `SearchTrigger` wired to the ⌘K `Command` palette (every navigation page is listed), the avatar, and the single `<main>`; a page opens the same palette with `useConsoleLayout().openSearch()`.

### B. Actions — `Button` (required)

In the `actions` slot: Create (`primary`, `medium`, with its icon) while not compact. In the page body: Documentation (`outline`) and the create action, and Upgrade to Pro as an item of the account menu.

### C. Agent — `HighlightButton` (required)

The AI assistant entry in the `actions` slot, after Create, while not compact.

### D. Hints — `Tooltip` (required)

Names every icon-only control: the compact Create and Agent, and the bell.

### E. Icon actions — `IconButton` (required)

Create and Agent while the `actions` slot's `compact` is true; the bell in Notifications.

### F. Palette groups — `Command` (required)

In the `search` slot: Recents (only while the query is empty) and Actions, as `Command.Group`s of `Command.Item`s; their selection arrives as `search-select`. The navigation pages are added by the layout.

### G. Account menu — `DropdownMenu` (required)

In the `account-menu` slot, as `DropdownMenu.Group`s: identity, Account settings and Personal tokens, the theme, Docs, Log out, and the Upgrade to Pro item over the system status foot. Every control in it is a `DropdownMenu.Item`, so the arrow keys reach all of them: a button or a segmented control inside a menu is skipped by the arrows and breaks the menu pattern. The layout opens it from the rail footer and from the header avatar. The layout emits `account-select` `(event, value)` for each item; the block answers `logout` by emitting `sign-out` `(event)`, sets the theme on `theme:system`, `theme:dark` and `theme:light`, and clears nothing itself.

### H. Theme — `DropdownMenu.Item` radios (required)

Inside the account menu, a `DropdownMenu.Group` labelled `Theme` with three `type="radio"` items, System, Dark and Light, bound to `useColorMode()`. Not a `ThemeSwitcher`: its buttons are not menu items, so the keyboard cannot reach them inside the menu.

### I. System status — `StatusIndicator` (required)

At the foot of the account menu: `All systems operational` with `success` severity; switch severity and label when the status page reports an incident.

### J. Page title — `PageHeader` (stand-in body)

The list page's title and description, with Documentation and the create action in its `actions` slot.

### K. Table frame — `Card` (stand-in body)

Flush (`:padded="false"`), standing in for the page body; the list page's controls row and table come from `view/view-table` (Table toolbar parts), never a hand-built row of buttons in the shell.

### L. Toast region — `Toaster` (required)

The app's one toast region, at `bottom-end`, mounted once by the shell because it is the app root. Pages and the other states only call `toast`; none renders a `Toaster` of its own.

## Data

`navigation`, `account` and the recents are the shell's own constants, which the app replaces with its navigation file and signed-in user. The states render the shell and fill its slots instead of copying it:

| Slot             | Scope         | What goes in it                                                               |
| ---------------- | ------------- | ----------------------------------------------------------------------------- |
| default          |               | The page body (`<RouterView />` in the app); a stand-in list page when empty. |
| `actions`        | `{ compact }` | Header actions after Create and Agent (the Notifications bell).               |
| `sidebar-header` | `{ compact }` | Content under the wordmark in the rail (the AccountSwitch switcher).          |
| `header-leading` | `{ compact }` | Content before the breadcrumbs in the header (the switcher while compact).    |
| `notifications`  |               | Flash messages above the page body.                                           |
| `tools`          |               | The tools region beside the content (the notification list).                  |

`v-model:tools-open` opens and closes the tools region, and `tools-label` names it. It emits one event:

| Event      | Payload   | When                                    |
| ---------- | --------- | --------------------------------------- |
| `sign-out` | `(event)` | Log out in the account menu was chosen. |

Handle it where the session lives: clear the token (`sessionStorage.removeItem`, the in-memory ref) and route to sign-in (`router.push('/login')`). When this block is the app's `App.vue`, there is no parent to listen, so either mount it with the handler (`createApp(App, { onSignOut })`) or render it from a thin `App.vue` (`<ConsoleShell @sign-out="signOut" />`). Never leave Log out as a menu item that does nothing.

## Do

- Compose `ConsoleLayoutRoot` once in `App.vue` and render every browse page through its default slot; replace this block's stand-in body with `<RouterView />`.
- Keep the navigation in one data file shared by the app; the rail and the palette both read it.
- Give every row an `href` (never `to` or `path`); derive a static `breadcrumbs` trail from the route.
- Let a detail page set its own trail, control crumb included, with `ConsoleLayout.Breadcrumb`.
- Frame a list or form body with `layout-boundary` + `layout-column`; open a detail body flush on `PageTabs`.

## Don't

- Don't render `AppLayout`, `Sidebar`, `AppHeader`, `SearchTrigger`, a `Command` palette or a `<main>` in a page; the layout owns them.
- Don't put a page's control crumb in `App.vue`, or size a body with `calc(100dvh - …)`.
- Don't render the rail on create, edit or deploy pages.
- Don't add page actions to the global header; they belong to the page's header, controls row or tab row.
- Don't hide the avatar when the rail is collapsed or in the drawer.
- Don't render the account switcher in both `sidebar-header` and `header-leading` at once; pick by the slots' `compact`.
- Don't leave an empty account table when the list fails to load; show the danger `Alert` with Retry in its place.
- Don't open the notifications region as a popover over the page; it is the layout's tools region beside the content.

## Copy

- **Palette groups:** `Recents`, `Actions`; the layout's placeholder `Search pages and commands` and its empty line come from the locale catalog.
- **Navigation and menu items:** nouns as the module pages are titled (`Personal tokens`, `Activity history`, `Build and deployment`, `Account settings`); Azion product names keep theirs (`Edge DNS`, `Real-Time Metrics`). No ampersand.
- **Status:** a short state, not a sentence: `All systems operational`.
- **Load failure:** what failed, as a sentence: `The account list could not be loaded.`; the action is `Retry`, the word every block uses (auth included).
- **Header actions:** `Create`, `Agent`.
- **Module create:** `Create` plus the entity: `Create Application`.

## Accessibility

- One `main` (the layout's), one `banner` (the header), the rail as a labelled navigation (`Main navigation`); the page body starts with its `h1` (`PageHeader`).
- ⌘K / Ctrl K opens the palette, announced through `aria-keyshortcuts` on the search; focus returns to the trigger on close.
- The rail's drawer traps focus while open, closes on `Escape` and when a row is chosen, and returns focus to the menu button.
- Icon-only controls have both an `aria-label` and a tooltip.
- The bell is a toggle (`aria-pressed`) and names the unread count; unread items carry a visually hidden `Unread:` prefix, not colour alone.

## States

- ListPage: a first-level list page in the `ConsoleLayout` default slot: no breadcrumb on a first level, the page opens on its `PageHeader` (title, description, Documentation and the create action) over the page body. The controls row and the table belong to `view/view-table`, which builds them from the Table toolbar parts; the shell does not draw them.
- DetailPage: a resource detail page rendered through `ConsoleLayout`. The page body sets its own trail with `ConsoleLayout.Breadcrumb`: Applications and the application as `items`, then the environment in its slot, a `Select` with `variant="ghost"` and `size="small"` labelled `Switch environment` (a search `Input`, each environment tagged with its deployment policy, a muted line when nothing matches, Add Environment at its foot). While compact the header hides the crumbs but keeps the environment `Select` in place of the brand, so Deploy always has its target in view; the body repeats the rest of the trail under `md` in its own `nav` row named Application (a ghost back `IconButton` to Applications and the application name). The default slot is flush and opens on a full-bleed `PageTabs` (Overview, Deployments, Settings, the outlined Deploy in `#actions`), sticky at the top of the layout's scrolling region so it stays in view while the tab content scrolls under it; no `main` of its own, the layout owns it.
- Notifications: the ListPage through `ConsoleLayout` with the bell after Create and Agent in the `actions` slot; it toggles the layout's tools region (`v-model:tools-open`, `tools-label="Notifications"`), a region beside the content and a drawer when narrow. The `tools` slot holds the list as `Item.List` of `Item` rows (`Item.Media type="icon"` toned through `data-type`, title, description, time, `Item.Actions`), five at a time with `Show older` for the rest: unread items marked with a `New` tag (and a visually hidden `Unread:` prefix), Edit and Redeploy on each deploy, Mark all as read, Clear all (it empties the list and toasts `Notifications cleared.` with Undo, which brings them back), and the EmptyState `You are all caught up` once cleared. The failed deploy also shows as a flash Alert (Edit, Redeploy) in the `notifications` slot above the page. The bell's `aria-label` carries the unread count, `aria-pressed` follows the region, and the `Badge` on it is hidden from assistive technology.
- AccountSwitch: the ListPage through `ConsoleLayout` with the current account in the `sidebar-header` slot, full width in the rail under the wordmark (square `Avatar` with its initials, the name, a sort glyph), `Switch account (Ctrl+O)` on its tooltip (to the right) and `aria-keyshortcuts`; the rail slot renders nothing while `compact` is true, and the same switcher moves to the `header-leading` slot, before the breadcrumbs, with the avatar and the chevron only (the name stays in its `aria-label`). It and the shortcut open a large `Dialog`, rendered beside the layout, with a search `Input` (name, ID or client ID) over a `Table` of the account tree: organizations, groups and workspaces indented by depth, expand and collapse buttons with `aria-expanded`, each name a button that switches, `Current` on the active one, type as `TableCellStatus`, ID and client ID as `TableCellId`. Each name is a `Button` with `variant="link"`. The table pages ten rows at a time (`paginated`), and while the list loads on open it shows the `Table` loading rows. Switching closes the dialog and toasts `Switched to <name>.` with the IDs; the footer shows the current account and Account settings. A search with no match shows Clear search. The search `Input` takes its `id` from `useId()` so the dialog can focus it on open.
- AccountSwitchError: the AccountSwitch dialog when the account list fails to load. A danger `Alert` (`The account list could not be loaded.`, action `Retry`) takes the place of the account `Table` under the search; the search, the title and the footer stay. Retry loads the list again and shows the table.

## Related

- `top-bar/top-bar-creation` — the focused shell for create, edit and deploy.
- `view/view-table`, `detail/detail-resource`, `dashboard/dashboard-home` — the page bodies rendered in the slot.
