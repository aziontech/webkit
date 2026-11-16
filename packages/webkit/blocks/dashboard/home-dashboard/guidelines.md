# Home dashboard

The Console's Home page: the first screen a signed-in user lands on. Its job
is to get them back to work fast. For an account that owns resources it shows a short usage band and
the resources they touch most (projects, resources, domains, recents), every row a link. For a
brand-new account it becomes the first-access screen: a greeting, the command prompt and three doors
to a first project, a first domain and a coding agent. It is not an analytics page; detail lives on
each resource's own dashboard.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shell/console`), which owns the rail, the header, the search palette and the `main`. The populated Home fits the screen at `xl` (each resource panel scrolls its own rows), so its root carries `data-layout-fill` and scrolls itself (`overflow-y-auto`): below `xl` the root scrolls as one page, its content centred while it fits (`justify-center-safe`). The first-access screen (Empty) is a centred page with nothing pinned; it does not fill, and the layout's `main` scrolls it (`h-dvh` on the populated root only sizes a standalone preview).

## When to use

- Use home-dashboard for the account's landing overview.
- The landing page after sign-in in the Console.
- The reader needs to resume work (open a recent resource) more than to analyse data.
- The same page must serve both a populated and a brand-new account.

## When not to use

- Analysing traffic or usage: use `dashboard/analytics-dashboard`
  (Traffic by default, Usage for consumption).
- The empty first page of one resource list: use `state/first-use`.
- Only the shell, with another page inside: use `shell/console`.
- A placeholder while Home loads: use the Overview and Onboarding wires of `state/page-skeleton`.

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
decorative `Logo` at `size="small"` in a bordered tile; a mono mark takes `variant="current"` and the
tile's text colour, a coloured one `variant="color"`. Its dismiss `IconButton` sits outside the button
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

### H. Loading — `Skeleton` (required)

While Home's data loads (`loading`), each usage tile holds a skeleton figure and each panel keeps its
heading over three `Skeleton` rows, so the grid does not reflow when the rows arrive.

### I. First access — `SearchTrigger`, `Card`, `Illustration`, `Button`, `Input`, `Popover`, `Spinner` (required)

When the account owns nothing (every panel list is `[]`), the page becomes the first-access screen:
the greeting over `Let's build something new.`, a `SearchTrigger` that opens the layout's command
palette, and three `Card` doors, each an `Illustration` over a title, one sentence and one action.
`Create Project` is an outlined medium `Button`; `Add a domain` is an `Input` whose valid domain
opens a `Popover` under it with a `Spinner` and `Checking <domain>...` until the answer arrives, then
`is already registered` or `is available` with a secondary `Register` `Button`; `Onboard your agent`
is an outlined `Copy prompt` `Button`.

## Data

The block takes its figures and rows through props and emits every action; it fetches nothing. `HomeDashboardProps` and the record types (`HomeDashboardMetrics`, `HomeDashboardResource`, `HomeDashboardDomainAvailability`) are exported from `home-dashboard.vue`, and `sample.ts` holds the sample name, figures and rows the block renders when a prop is left out (the figures and rows never while `loading` or `error` is set). The tile labels, units and hints and the panel headings stay in the SFC.

| Prop                  | Type                              | What it does                                                                                                 |
| --------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `userName`            | `string`                          | The first name in the greeting.                                                                              |
| `greeting`            | `string`                          | The time-of-day greeting before it; defaults to `Good morning`.                                              |
| `metrics`             | `HomeDashboardMetrics`            | The value and delta of each usage tile, keyed by tile id; a tile left out reads as a dash.                   |
| `projects`            | `HomeDashboardResource[]`         | The Projects panel rows, each with its `href` and preset icon.                                               |
| `resources`           | `HomeDashboardResource[]`         | The Resources panel rows.                                                                                    |
| `domains`             | `HomeDashboardResource[]`         | The Domains panel rows.                                                                                      |
| `recents`             | `HomeDashboardResource[]`         | The Recents panel rows, most recent first, each with its `typeLabel`.                                        |
| `domainAvailability`  | `HomeDashboardDomainAvailability` | The answer to the last `check-domain`; the popover shows `Checking` until its `name` matches the field.      |
| `v-model:agent-setup` | `boolean`                         | Whether the agent card shows; Dismiss sets it to `false`, so persist it to dismiss the card for good.        |
| `loading`             | `boolean`                         | Home's data is loading: the tiles and the panels hold a `Skeleton`.                                          |
| `error`               | `string`                          | Why Home's data could not load, shown after `Couldn't load <thing>.` in the band's and each panel's `Alert`. |

Pass `[]` for all four lists on an account that owns nothing: the page becomes the first-access screen.

| Event               | Payload         | When                                                                             |
| ------------------- | --------------- | -------------------------------------------------------------------------------- |
| `retry`             | `(event)`       | Retry in the usage band's or a panel's error alert.                              |
| `update:agentSetup` | `(value)`       | Dismiss on the agent card.                                                       |
| `create-project`    | `(event)`       | Create Project on the first-access screen.                                       |
| `check-domain`      | `(name)`        | A valid domain stayed in the field for 900 ms; answer with `domainAvailability`. |
| `register-domain`   | `(event, name)` | Register under an available domain.                                              |
| `copy-prompt`       | `(event)`       | Copy prompt on the agent door.                                                   |

Every row, panel heading and the agent card are links (`href`), so navigation needs no event. To go live, render the block from a page that owns the requests and pass what they return:

```vue
<script setup lang="ts">
  import { ref } from 'vue'

  import HomeDashboard, { type HomeDashboardDomainAvailability } from './home-dashboard.vue'

  const { data, pending, error, refresh } = useHome()
  const availability = ref<HomeDashboardDomainAvailability>()
  const checkDomain = async (name: string) => {
    availability.value = { name, registered: await isRegistered(name) }
  }
</script>

<template>
  <HomeDashboard
    :user-name="data?.user.firstName"
    :metrics="data?.usage"
    :projects="data?.projects ?? []"
    :resources="data?.resources ?? []"
    :domains="data?.domains ?? []"
    :recents="data?.recents ?? []"
    :domain-availability="availability"
    :loading="pending"
    :error="error ? 'Check your connection and retry.' : ''"
    @retry="refresh"
    @check-domain="checkDomain"
  />
</template>
```

Then delete `sample.ts` and its import.

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

- Default: populated Home for an account that owns resources (`metrics`, `projects`, `resources`, `domains`, `recents`): usage band, agent card, resource panels.
- Error: `error` holds the message; Home's data could not load, and the usage band and every panel show a danger `Alert` with Retry.
- Empty: `projects`, `resources`, `domains` and `recents` are all `[]`; a brand-new account gets the first-access screen with the greeting, the command prompt that opens the palette, and the three doors (create a project, add a domain with an availability check, set up an agent).
- Summary: the classic overview; metric tiles with the window caption, the resources and recent activity tables, and the aside with monthly usage and a featured marketplace template.

## Related

- `shell/console` — the shell Home renders inside.
- `state/page-skeleton` — the Overview and Onboarding wires that hold Home while it loads.
- `state/first-use` — the first-use state of one resource list.
- `dashboard/analytics-dashboard` — where usage detail lives.
