# Resource header

The top bar of every page inside the persistent console shell. It sits in the content zone beside the navigation rail and carries what the user needs on any browse page: where they are (no breadcrumb at the first level, where the rail's active row already says it; the module and the resource from the second), search, the two ways to start something (Create and the Agent), and their account. It is the `ConsoleLayout` header on its own: `shells/console` renders the same bar through `ConsoleLayout`, so inside that shell use the layout and never this block. Copy this block only for an app that does not run on `ConsoleLayout`, or as a reference for the bar.

## When to use

- An app that does not use `ConsoleLayout` and needs the console bar on its own.
- First-level pages the rail routes to (lists, Home, dashboards, settings hubs).
- Second-level pages of a resource (details, versions, a resource's settings).

## When not to use

- Inside `shells/console`: `ConsoleLayout` already renders this bar, its search palette and its account menu; a second bar in the page is a bug.
- Create, edit and deploy flows: use `headers/creation-header`, which drops the rail and these actions.
- Signed-out screens: use `headers/auth-header`. Docs and marketing: `headers/docs-header`, `headers/site-header`.

## Building blocks

### A. Bar — `GlobalHeader` (required)

Default `content` placement, `aria-label="Console"` (the label every console bar uses), in the content zone, never above the rail. Start cluster in `GlobalHeader.Start`, empty `GlobalHeader.Center`, actions in `GlobalHeader.End`.

### B. Navigation trigger — `IconButton` (required)

Below `md` an outlined `pi-bars` icon button opens the rail as a drawer. In the end cluster, `SearchTrigger` comes first. Below `md`, Create and Agent also collapse into icon buttons.

### C. Brand — `Brand` (required)

Inside `GlobalHeader.Brand`, linked to the home route with `aria-label="Azion home"`. At the first level nothing follows it: the rail's active row names the module and the page opens on its own `PageHeader`, so the bar carries no breadcrumb, never a single crumb. From the second level (`SecondLevel`) a `Breadcrumb` follows it from `md`: the module with an `href`, then the resource's own name with no link. A tab is never a crumb.

### D. Create — `Button` (required)

`kind="primary"`, medium, `pi-plus-circle`: opens the Creation Center. One primary action in the bar.

### E. Agent — `ButtonHighlight` (required)

The AI assistant entry, medium, `ai-ask-azion` icon. It is the only highlight button on the page.

### F. Account — `DropdownMenu` + `Avatar` (required)

The avatar sits in a button labelled `Account menu` inside `DropdownMenu.Trigger`, always last. The menu opens the same groups as the `ConsoleLayout` account menu: the person's name and email on top, Account settings and Personal tokens, then Docs and Log out.

### G. Search — `SearchTrigger` (required)

The header search, first in the end cluster: the field (`Search` with the ⌘K / Ctrl K keycap) while the bar is at least `--container-2xl` wide, the magnifier alone below that (`collapsible`, inside the header's `@container`). It emits `open` on click and on the shortcut; the block binds `@open` to a `Command` palette (`v-model:open`) listing the pages. Never hand-rolled (rule `webkit-header-search`).

### H. Hints — `Tooltip` (required)

Names every icon-only control: the navigation trigger, and Create and Agent below `md`.

### I. Search palette — `Command` (required)

Opened by the search trigger with `v-model:open`: an input, a `Pages` group and an empty message (`No page matches your search.`).

## Do

- Use the resource's name as the last crumb (`webkit-sample-vue`), not the page type.
- Keep the order of the end cluster: Search, Create, Agent, avatar.
- Read every breakpoint and width from tokens so the bar answers to the theme.

## Don't

- Don't render a second header in the content, or a `PageHeader` that repeats the last crumb.
- Don't add page-level actions here; they go in the page's controls row or tab row.
- Don't link the last crumb.

## Copy

- **Create:** the verb alone: `Create`. **Agent:** `Agent`.
- **Breadcrumb:** the module as the rail names it (`Applications`), then the resource name as the user typed it.
- **Icon labels:** `Search`, `Open navigation`, `Account menu`.

## Accessibility

- The ⌘K shortcut is announced with `aria-keyshortcuts="Meta+K"` on the search control.
- Icon-only states of Create and Agent keep their names as `aria-label` and a tooltip.
- One `GlobalHeader` landmark per page, labelled.

## States

- FirstLevel: a module page the rail routes to; no breadcrumb (the rail's active row names the module).
- SecondLevel: a resource inside a module; the breadcrumb names the module and the resource from `md`, last crumb unlinked.

## Related

- `shells/console` — the shell whose `ConsoleLayout` renders this bar with the rail; use it instead of this block when you can.
- `headers/creation-header` — the bar for focused flows.
- `platform/detail/details-page`, `platform/view/table-view` — the second- and first-level pages under it.
