# Resource header

The top bar of every page inside the persistent console shell. It sits in the content zone beside the navigation rail and carries what the user needs on any browse page: where they are (no breadcrumb at the first level, where the rail's active row already says it; the module and the resource from the second), search, the two ways to start something (Create and the Agent), and their account. It is the header that `shells/console` renders.

## When to use

- First-level pages the rail routes to (lists, Home, dashboards, settings hubs).
- Second-level pages of a resource (details, versions, a resource's settings).

## When not to use

- Create, edit and deploy flows: use `headers/creation-header`, which drops the rail and these actions.
- Signed-out screens: use `headers/auth-header`. Docs and marketing: `headers/docs-header`, `headers/site-header`.

## Building blocks

### A. Bar — `GlobalHeader` (required)

Default `content` placement, `aria-label="Azion Console"`, in the content zone, never above the rail. Start cluster in `GlobalHeader.Left`, empty `GlobalHeader.Middle`, actions in `GlobalHeader.Right`.

### B. Navigation trigger — `IconButton` (required)

Below `md` an outlined `pi-bars` icon button opens the rail as a drawer. In the end cluster, `SearchTrigger` comes first. Below `md`, Create and Agent also collapse into icon buttons.

### C. Brand — `Brand` (required)

Linked to the home route with `aria-label="Azion home"`. At the first level nothing follows it: the rail's active row names the module and the page opens on its own `PageHeader`, so the bar carries no breadcrumb, never a single crumb. From the second level (`SecondLevel`) a `Breadcrumb` follows it from `md`: the module with an `href`, then the resource's own name with no link. A tab is never a crumb.

### D. Create — `Button` (required)

`kind="primary"`, medium, `pi-plus-circle`: opens the Creation Center. One primary action in the bar.

### E. Agent — `ButtonHighlight` (required)

The AI assistant entry, medium, `ai-ask-azion` icon. It is the only highlight button on the page.

### F. Account — `Avatar` (required)

Inside a button labelled `Account settings`, always last.

### G. Search — `SearchTrigger` (required)

The header search, first in the end cluster: the field (`Search` with the ⌘K / Ctrl K keycap) while the bar is at least `--container-2xl` wide, the magnifier alone below that (`collapsible`, inside the header's `@container`). It emits `open` on click and on the shortcut and opens the `Command` palette. Never hand-rolled (rule `webkit-header-search`).

### H. Hints — `Tooltip` (required)

Names every icon-only control: the navigation trigger, and Create and Agent below `md`.

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
- **Icon labels:** `Search`, `Open navigation`, `Account settings`.

## Accessibility

- The ⌘K shortcut is announced with `aria-keyshortcuts="Meta+K"` on the search control.
- Icon-only states of Create and Agent keep their names as `aria-label` and a tooltip.
- One `GlobalHeader` landmark per page, labelled.

## States

- FirstLevel: a module page the rail routes to; no breadcrumb (the rail's active row names the module).
- SecondLevel: a resource inside a module; the breadcrumb names the module and the resource from `md`, last crumb unlinked.

## Related

- `shells/console` — the shell that renders this bar with the rail.
- `headers/creation-header` — the bar for focused flows.
- `platform/detail/details-page`, `platform/view/table-view` — the second- and first-level pages under it.
