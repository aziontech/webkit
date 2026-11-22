# DashboardHome (`dashboard/dashboard-home`)

> The whole Home page body, in both of its states. **Populated** (once the account owns a resource): a greeting heading, a usage band with four chartless StatTiles joined in one StatTileGroup card (each label explained by a `Hint` in the tile’s aside slot, each figure beside its unit and delta Tag) next to the dismissible agent onboarding card (one whole-card `Item` link), and a five-column resources grid with the Projects, Resources, Domains and Recents panels, every row a whole-row `Item` link to the resource, each panel heading a `Link` to its list, and an empty panel an `EmptyState`. **Empty** (a brand-new account): the first-access screen, a greeting under a centred headline, the command prompt that opens the layout’s palette (useConsoleLayout({ optional: true }), then layout?.openSearch()) on click or Enter, and the three doors (ship something new, add a domain with its availability check, onboard your agent). While either screen arrives, the PageWires Overview and Onboarding wires (`state/state-page-skeleton`) hold the page. Built from `StatTileGroup`, `StatTile`, `Hint`, `Card`, `Link`, `EmptyState`, `Alert`, `Tooltip`, `IconButton`, `Item`, `SearchTrigger`, `Popover`, `Spinner`, `Illustration`, `Button` and the agent marks from the webkit assets. A page body: render it in the default slot of ConsoleLayout, which owns the rail, the header and the main. The populated root carries data-layout-fill and scrolls itself: from xl each resource panel scrolls its rows; below xl the page scrolls as one. The first-access screen does not fill.

- Surface: app
- Source: `blocks/dashboard/dashboard-home/dashboard-home.vue` in `@aziontech/webkit`
- MCP: `get_block("dashboard/dashboard-home")`
- Components: [Alert](../../components/alert.md), `claudeMark`, `codexMark`, `cursorMark`, `geminiMark`, [Button](../../components/button.md), [Card](../../components/card.md), [DataTable](../../components/data-table.md), `DropdownMenuGroup`, `DropdownMenuItem`, [EmptyState](../../components/empty-state.md), [Hint](../../components/hint.md), [IconButton](../../components/icon-button.md), [Illustration](../../components/illustration.md), [Input](../../components/input.md), [Item](../../components/item.md), [Item](../../components/item.md), [Link](../../components/link.md), [Popover](../../components/popover.md), [SearchTrigger](../../components/search-trigger.md), [Skeleton](../../components/skeleton.md), [Spinner](../../components/spinner.md), [StatTile](../../components/stat-tile.md), [StatTileGroup](../../components/stat-tile-group.md), `TableCellActions`, `TableCellLink`, `TableCellTime`, [Tag](../../components/tag.md), [ThirdPartyLogo](../../components/third-party-logo.md), [Toast](../../components/toast.md), [Tooltip](../../components/tooltip.md), `use-console-layout`
- Skills: `webkit-layout`, `webkit-ui-states`, `webkit-microcopy`

## Asked as

home; home page; home dashboard; console home; usage overview; página inicial; início do console; first access; home empty state; new account home; welcome screen; first run; brand-new account; getting started home; primeiro acesso; tela de boas-vindas; home vazia; classic overview; overview dashboard; account summary; recent activity; monthly usage; visão geral; account landing overview

The Console's Home page: the first screen a signed-in user lands on. Its job
is to get them back to work fast. For an account that owns resources it shows a short usage band and
the resources they touch most (projects, resources, domains, recents), every row a link. For a
brand-new account it becomes the first-access screen: a greeting, the command prompt and three doors
to a first project, a first domain and a coding agent. It is not an analytics page; detail lives on
each resource's own dashboard.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shell/shell-console`), which owns the rail, the header, the search palette and the `main`. The populated Home fits the screen at `xl` (each resource panel scrolls its own rows), so its root carries `data-layout-fill` and scrolls itself (`overflow-y-auto`): below `xl` the root scrolls as one page, its content centred while it fits (`justify-center-safe`). The first-access screen (Empty) is a centred page with nothing pinned; it does not fill, and the layout's `main` scrolls it (`h-dvh` on the populated root only sizes a standalone preview).

## When to use

- Use dashboard-home for the account's landing overview.
- The landing page after sign-in in the Console.
- The reader needs to resume work (open a recent resource) more than to analyse data.
- The same page must serve both a populated and a brand-new account.

## When not to use

- Analysing traffic or usage: use `dashboard/dashboard-analytics`
  (Traffic by default, Usage for consumption).
- The empty first page of one resource list: use `state/state-first-use`.
- Only the shell, with another page inside: use `shell/shell-console`.
- A placeholder while Home loads: use the Overview and Onboarding wires of `state/state-page-skeleton`.

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

### D. Agent onboarding — `Card`, `Item`, `ThirdPartyLogo` (optional)

A whole-card link (`Item` with `href` to the agent setup page): the agent marks, `Set up your coding agent` and one sentence. Each mark is a
decorative `ThirdPartyLogo` at `size="small"` in a bordered tile; a mono mark takes `variant="current"` and the
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
  resources changed last (name, domain as `TableCellLink`, status as a small `Tag`, `TableCellTime`
  with the author, `TableCellActions`), and a `View all DNS zones` `Link` in the card footer.
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

The block takes its figures and rows through props and emits every action; it fetches nothing. `HomeDashboardProps` and the record types (`HomeDashboardMetrics`, `HomeDashboardResource`, `HomeDashboardDomainAvailability`) are exported from `dashboard-home.vue`, and `sample.ts` holds the sample name, figures and rows the block renders when a prop is left out (the figures and rows never while `loading` or `error` is set). The tile labels, units and hints and the panel headings stay in the SFC.

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

  import DashboardHome, { type HomeDashboardDomainAvailability } from './dashboard-home.vue'

  const { data, pending, error, refresh } = useHome()
  const availability = ref<HomeDashboardDomainAvailability>()
  const checkDomain = async (name: string) => {
    availability.value = { name, registered: await isRegistered(name) }
  }
</script>

<template>
  <DashboardHome
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

- `shell/shell-console` — the shell Home renders inside.
- `state/state-page-skeleton` — the Overview and Onboarding wires that hold Home while it loads.
- `state/state-first-use` — the state-first-use state of one resource list.
- `dashboard/dashboard-analytics` — where usage detail lives.

## Variants

- `Default` — primary (the code below)
- `Empty` — Home for a brand-new account: the first-access screen. Inside ConsoleLayout, clicking the prompt (or pressing Enter on it) opens the layout's command palette; type a domain such as example.com (taken) or acme.example.com (available) into the second door to run the availability check.
- `Error` — Populated Home whose data could not load: the usage band and every resource panel show a danger `Alert` with Retry in place of their content; the greeting and the agent card stay.
- `Summary` — The classic overview: four metric StatTiles with a Hint on each label and the window they cover in a caption, a resources DataTable card and a Recent activity DataTable card, each with a View all footer Link, beside an aside of a Monthly usage list card and a Marketplace trends card that pages through featured templates with Previous and Next.

Each variant is the same screen in another state: `get_block("dashboard/dashboard-home", { variant })`, or the file under `blocks/dashboard/dashboard-home/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import { computed } from 'vue'

  import { homeMetricDefinitions } from './home-metrics'
  import HomeFirstAccess from './parts/home-first-access.vue'
  import HomePanels from './parts/home-panels.vue'
  import HomeUsageBand from './parts/home-usage-band.vue'
  import {
    sampleDomains,
    sampleMetrics,
    sampleProjects,
    sampleRecents,
    sampleResources,
    sampleUserName
  } from './sample'

  /** The four tiles of the usage band, in the order they render. */
  export type HomeDashboardMetricId =
    'data-transferred' | 'requests-per-second' | 'bandwidth-saving' | 'data-offload'

  /** The measured part of one usage tile. */
  export interface HomeDashboardMetric {
    /** The figure in the tile's unit; null reads as a dash. */
    value: number | null
    /** Change against the previous window, in percent; null hides the delta. */
    delta: number | null
  }

  /** The usage figures by tile; a tile left out reads as a dash. */
  export type HomeDashboardMetrics = Partial<Record<HomeDashboardMetricId, HomeDashboardMetric>>

  /** One row of a resource panel. */
  export interface HomeDashboardResource {
    /** Stable key. */
    id: string
    /** Display name. */
    name: string
    /** The resource page the whole row links to. */
    href: string
    /** The kind of resource, shown before the name in Recents. */
    typeLabel?: string
    /** Icon class of the project preset, shown before the name in Projects. */
    presetIcon?: string
    /** Name of the project preset, the icon's title. */
    presetLabel?: string
  }

  /** The availability answer for a domain the reader typed. */
  export interface HomeDashboardDomainAvailability {
    /** The domain the answer is for. */
    name: string
    /** True when the domain is taken. */
    registered: boolean
  }

  export interface HomeDashboardProps {
    /** First name in the greeting. Left out, the sample name renders. */
    userName?: string
    /** Time-of-day greeting before the name. */
    greeting?: string
    /** The usage band figures. Left out, the sample renders. */
    metrics?: HomeDashboardMetrics
    /** Rows of the Projects panel. */
    projects?: HomeDashboardResource[]
    /** Rows of the Resources panel. */
    resources?: HomeDashboardResource[]
    /** Rows of the Domains panel. */
    domains?: HomeDashboardResource[]
    /** Rows of the Recents panel, most recent first. */
    recents?: HomeDashboardResource[]
    /** Answer to the last check-domain event; the first-access screen shows it once its name matches the field. */
    domainAvailability?: HomeDashboardDomainAvailability
    /** Home's data is loading; the tiles and the panels hold a skeleton. */
    loading?: boolean
    /** Why Home's data could not load; the usage band and every panel show it in a danger alert with Retry. */
    error?: string
  }

  const props = withDefaults(defineProps<HomeDashboardProps>(), {
    userName: undefined,
    greeting: 'Good morning',
    metrics: undefined,
    projects: undefined,
    resources: undefined,
    domains: undefined,
    recents: undefined,
    domainAvailability: undefined,
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    retry: [event: MouseEvent]
    'create-project': [event: MouseEvent]
    'check-domain': [name: string]
    'register-domain': [event: MouseEvent, name: string]
    'copy-prompt': [event: MouseEvent]
  }>()

  const agentSetup = defineModel<boolean>('agentSetup', { default: true })

  type PanelKey = 'projects' | 'resources' | 'domains' | 'recents'

  const panelDefinitions: {
    key: PanelKey
    label: string
    path: string
    recent: boolean
    marked: boolean
  }[] = [
    { key: 'projects', label: 'Projects', path: '/projects', recent: false, marked: true },
    { key: 'resources', label: 'Resources', path: '/resources', recent: false, marked: false },
    { key: 'domains', label: 'Domains', path: '', recent: false, marked: false },
    { key: 'recents', label: 'Recents', path: '', recent: true, marked: false }
  ]

  const failed = computed(() => props.error !== '')
  const blank = computed(() => props.loading || failed.value)
  const fallback = <T,>(value: T | undefined, sample: T, empty: T): T =>
    value ?? (blank.value ? empty : sample)

  const name = computed(() => props.userName ?? sampleUserName)
  const metricValues = computed(() => fallback(props.metrics, sampleMetrics, {}))
  const tiles = computed(() =>
    homeMetricDefinitions.map((definition) => ({
      ...definition,
      ...(metricValues.value[definition.id] ?? { value: null, delta: null })
    }))
  )

  const lists = computed<Record<PanelKey, HomeDashboardResource[]>>(() => ({
    projects: fallback(props.projects, sampleProjects, []),
    resources: fallback(props.resources, sampleResources, []),
    domains: fallback(props.domains, sampleDomains, []),
    recents: fallback(props.recents, sampleRecents, [])
  }))
  const panels = computed(() =>
    panelDefinitions.map((definition) => ({
      ...definition,
      resources: lists.value[definition.key]
    }))
  )
  const firstAccess = computed(
    () => !blank.value && Object.values(lists.value).every((list) => list.length === 0)
  )
</script>

<template>
  <div
    v-if="!firstAccess"
    data-layout-fill
    class="layout-column layout-boundary relative flex h-dvh flex-col justify-center-safe overflow-y-auto xl:justify-start"
  >
    <header class="flex items-center">
      <h1 class="text-heading-sm text-(--text-muted)">
        {{ greeting }},
        <span class="text-(--text-default)">{{ name }}</span>
      </h1>
    </header>

    <div
      class="layout-section-start flex flex-col gap-(--layout-boundary-start) xl:min-h-0 xl:flex-1"
    >
      <HomeUsageBand
        v-model:agent-setup="agentSetup"
        :tiles="tiles"
        :loading="loading"
        :error="error"
        @retry="(event) => emit('retry', event)"
      />
      <HomePanels
        :panels="panels"
        :loading="loading"
        :error="error"
        @retry="(event) => emit('retry', event)"
      />
    </div>
  </div>

  <HomeFirstAccess
    v-else
    :greeting="greeting"
    :name="name"
    :domain-availability="domainAvailability"
    @create-project="(event) => emit('create-project', event)"
    @check-domain="(value) => emit('check-domain', value)"
    @register-domain="(event, value) => emit('register-domain', event, value)"
    @copy-prompt="(event) => emit('copy-prompt', event)"
  />
</template>
```

## `sample.ts`

```ts
import type { HomeDashboardMetrics, HomeDashboardResource } from './dashboard-home.vue'

export const sampleUserName = 'Alex'

export const sampleMetrics: HomeDashboardMetrics = {
  'data-transferred': { value: 842, delta: 12.4 },
  'requests-per-second': { value: 1240, delta: 3.8 },
  'bandwidth-saving': { value: 588, delta: 6.2 },
  'data-offload': { value: 70, delta: -1.5 }
}

const marketingSite: HomeDashboardResource = {
  id: '4410203040',
  name: 'marketing-site',
  href: '/projects/4410203040',
  typeLabel: 'Project',
  presetIcon: 'az-color az-astro',
  presetLabel: 'Astro'
}

const docsSite: HomeDashboardResource = {
  id: '6630405070',
  name: 'docs-site',
  href: '/projects/6630405070',
  typeLabel: 'Project',
  presetIcon: 'az-color az-nextjs',
  presetLabel: 'Next.js'
}

const blackFriday: HomeDashboardResource = {
  id: '5520304060',
  name: 'black-friday-2026',
  href: '/projects/5520304060',
  typeLabel: 'Project',
  presetIcon: 'az-color az-nextjs',
  presetLabel: 'Next.js'
}

const resourceOne: HomeDashboardResource = {
  id: '1020655',
  name: 'resource-01',
  href: '/resources/1020655',
  typeLabel: 'Resource'
}

const appDomain: HomeDashboardResource = {
  id: 'domain-1020655',
  name: 'app.example.com',
  href: '/domains/domain-1020655',
  typeLabel: 'Domain'
}

export const sampleProjects: HomeDashboardResource[] = [
  marketingSite,
  docsSite,
  blackFriday,
  {
    id: '2041778390',
    name: 'hello-world',
    href: '/projects/2041778390',
    typeLabel: 'Project',
    presetIcon: 'az-color az-javascript',
    presetLabel: 'JavaScript'
  },
  {
    id: '1784552864',
    name: 'web-app',
    href: '/projects/1784552864',
    typeLabel: 'Project',
    presetIcon: 'az-color az-vue',
    presetLabel: 'Vue'
  }
]

export const sampleResources: HomeDashboardResource[] = [
  resourceOne,
  { id: '1031410003', name: 'resource-02', href: '/resources/1031410003', typeLabel: 'Resource' },
  { id: '1031410001', name: 'resource-03', href: '/resources/1031410001', typeLabel: 'Resource' }
]

export const sampleDomains: HomeDashboardResource[] = [
  appDomain,
  {
    id: 'domain-1031410003',
    name: '*.preview.example.com',
    href: '/domains/domain-1031410003',
    typeLabel: 'Domain'
  },
  {
    id: 'domain-1031410001',
    name: 'www.example.com',
    href: '/domains/domain-1031410001',
    typeLabel: 'Domain'
  },
  {
    id: 'domain-1031410002',
    name: 'api.example.com',
    href: '/domains/domain-1031410002',
    typeLabel: 'Domain'
  }
]

export const sampleRecents: HomeDashboardResource[] = [
  resourceOne,
  appDomain,
  marketingSite,
  docsSite,
  blackFriday
]

export const sampleRegisteredDomains: string[] = ['example.com', 'example.org', 'example.net']

export type SummaryOperation = 'Created' | 'Edited' | 'Deleted'

export interface SummaryZone {
  id: string
  name: string
  domain: string
  status: 'Active' | 'Inactive'
  author: string
  modifiedAt: string
}

export interface SummaryActivity {
  id: string
  date: string
  operation: SummaryOperation
  type: string
  resource: string
  email: string
}

export interface SummaryTemplate {
  id: string
  name: string
  icon: string
  description: string
  vendor: string
  version: string
}

export const sampleSummaryRange = 'Jul 14, 2026, 6:56 PM – Jul 14, 2026, 7:56 PM UTC'

export const sampleSummaryZones: SummaryZone[] = [
  {
    id: '4410203040',
    name: 'example-com',
    domain: 'example.com',
    status: 'Active',
    author: 'jane.doe@example.com',
    modifiedAt: '2026-07-18T09:12:00Z'
  },
  {
    id: '5520304060',
    name: 'acme-store',
    domain: 'store.example.com',
    status: 'Active',
    author: 'john.smith@example.com',
    modifiedAt: '2026-07-20T08:30:00Z'
  }
]

export const sampleSummaryActivity: SummaryActivity[] = [
  {
    id: 'act-1',
    date: 'Jul 13, 2026, 1:52 PM',
    operation: 'Created',
    type: 'User login',
    resource: 'User login for Jane Doe',
    email: 'jane.doe@example.com'
  },
  {
    id: 'act-2',
    date: 'Jun 30, 2026, 6:54 PM',
    operation: 'Deleted',
    type: 'DNS zone',
    resource: 'DNS zone example.org',
    email: 'jane.doe@example.com'
  },
  {
    id: 'act-3',
    date: 'Jun 30, 2026, 6:54 PM',
    operation: 'Created',
    type: 'DNS zone',
    resource: 'DNS zone example.org',
    email: 'jane.doe@example.com'
  },
  {
    id: 'act-4',
    date: 'Jun 30, 2026, 6:53 PM',
    operation: 'Created',
    type: 'User login',
    resource: 'User login for Jane Doe',
    email: 'jane.doe@example.com'
  },
  {
    id: 'act-5',
    date: 'Jun 24, 2026, 1:55 AM',
    operation: 'Edited',
    type: 'Response rule',
    resource: 'Response rule Set storage origin for acme-store',
    email: 'jane.doe@example.com'
  }
]

export const sampleSummaryUsage = [
  { id: 'dns-zones', label: 'DNS zones', value: '2' },
  { id: 'applications', label: 'Applications', value: '5' },
  { id: 'functions', label: 'Function invocations', value: '1.2M' }
]

export const sampleSummaryTemplates: SummaryTemplate[] = [
  {
    id: 'jwt',
    name: 'JWT',
    icon: 'az az-key',
    description:
      'Streamline authentication by processing and validating JSON Web Tokens (JWTs) before a request reaches your origin.',
    vendor: 'Acme',
    version: '1.1.0'
  },
  {
    id: 'image-optimizer',
    name: 'Image optimizer',
    icon: 'az az-image',
    description: 'Resize, crop and convert images on request, and cache every variant.',
    vendor: 'Acme',
    version: '2.4.0'
  },
  {
    id: 'bot-detection',
    name: 'Bot detection',
    icon: 'az az-shield',
    description: 'Score each request and block automated traffic before it costs you capacity.',
    vendor: 'Acme',
    version: '0.9.2'
  }
]
```

## `home-metrics.ts`

```ts
import type { HomeDashboardMetricId } from './dashboard-home.vue'

/** The fixed part of one usage tile. */
export interface HomeMetricDefinition {
  /** The tile key. */
  id: HomeDashboardMetricId
  /** The tile label. */
  label: string
  /** The unit after the figure. */
  unit: string
  /** One sentence that defines the figure. */
  hint: string
}

export const homeMetricDefinitions: HomeMetricDefinition[] = [
  {
    label: 'Data transferred',
    id: 'data-transferred',
    unit: 'GB',
    hint: 'Total bytes delivered across all your resources.'
  },
  {
    label: 'Requests per second',
    id: 'requests-per-second',
    unit: '/s',
    hint: 'Average requests handled per second in the selected window.'
  },
  {
    label: 'Bandwidth saving',
    id: 'bandwidth-saving',
    unit: 'GB',
    hint: 'Bytes served from cache instead of your origin.'
  },
  {
    label: 'Data offload',
    id: 'data-offload',
    unit: '%',
    hint: 'Share of traffic served from cache instead of your origin.'
  }
]
```

## `parts/home-domain-check.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Input from '@aziontech/webkit/input'
  import Popover from '@aziontech/webkit/popover'
  import Spinner from '@aziontech/webkit/spinner'
  import { computed, onScopeDispose, reactive, ref, watch } from 'vue'

  import type { HomeDashboardDomainAvailability } from '../dashboard-home.vue'
  import { sampleRegisteredDomains } from '../sample'

  export interface HomeDomainCheckProps {
    /** Answer to the last check-domain event; shown once its name matches the field. */
    domainAvailability?: HomeDashboardDomainAvailability
  }

  const props = withDefaults(defineProps<HomeDomainCheckProps>(), {
    domainAvailability: undefined
  })

  const emit = defineEmits<{
    'check-domain': [name: string]
    'register-domain': [event: MouseEvent, name: string]
  }>()

  const DOMAIN_SHAPE = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9-]+)*\.[a-z]{2,}$/i
  const CHECK_DEBOUNCE_MS = 900

  const domain = ref('')
  const check = reactive({ open: false, pending: false, name: '' })
  const sampleVerdict = ref<HomeDashboardDomainAvailability | null>(null)
  const verdict = computed(() => {
    const answer = props.domainAvailability ?? sampleVerdict.value
    return !check.pending && answer?.name === check.name ? answer : null
  })
  const fieldWidth = ref(0)
  let checkTimer: ReturnType<typeof globalThis.setTimeout> | undefined

  const measureField = (event: Event) => {
    const form = (event.target as Element | null)?.closest?.('form')
    if (form) fieldWidth.value = Math.round(form.offsetWidth)
  }

  watch(domain, (value) => {
    globalThis.clearTimeout(checkTimer)
    const next = value.trim().toLowerCase()
    if (!DOMAIN_SHAPE.test(next)) {
      check.open = false
      check.pending = false
      return
    }
    check.open = true
    check.pending = true
    check.name = next
    checkTimer = globalThis.setTimeout(() => {
      check.pending = false
      if (props.domainAvailability === undefined)
        sampleVerdict.value = { name: next, registered: sampleRegisteredDomains.includes(next) }
      emit('check-domain', next)
    }, CHECK_DEBOUNCE_MS)
  })

  onScopeDispose(() => globalThis.clearTimeout(checkTimer))

  const onCheckOpen = (value: boolean) => {
    if (!value) check.open = false
  }
</script>

<template>
  <Popover
    :open="check.open"
    side="bottom"
    align="start"
    :side-offset="8"
    class="w-full"
    @update:open="onCheckOpen"
  >
    <Popover.Trigger class="w-full">
      <form
        class="w-full"
        @submit.prevent
      >
        <Input
          v-model="domain"
          placeholder="Type in your domain"
          size="medium"
          aria-label="Domain to add"
          @input="measureField"
        />
      </form>
    </Popover.Trigger>

    <Popover.Content>
      <div
        class="overflow-hidden transition-[height] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
        :style="fieldWidth ? { width: fieldWidth + 'px' } : {}"
      >
        <Transition
          mode="out-in"
          enter-active-class="animate-fade-in motion-reduce:animate-none"
          leave-active-class="animate-fade-out motion-reduce:animate-none"
        >
          <div
            v-if="!verdict"
            key="checking"
            class="flex items-center justify-center gap-(--spacing-xs) p-(--spacing-sm) text-center text-body-sm text-(--text-muted)"
          >
            <div class="contents text-(--text-muted)">
              <Spinner class="shrink-0" />
            </div>
            Checking {{ check.name }}...
          </div>

          <div
            v-else
            key="verdict"
            class="flex flex-col gap-(--spacing-sm) p-(--spacing-sm)"
          >
            <p class="text-body-sm text-(--text-default)">
              <template v-if="verdict.registered">
                {{ check.name }} is already registered. Try another name.
              </template>
              <template v-else>
                {{ check.name }} is available. We register it and issue the certificate.
              </template>
            </p>
            <Button
              v-if="!verdict.registered"
              label="Register"
              variant="secondary"
              size="medium"
              class="w-full"
              @click="(event) => emit('register-domain', event, check.name)"
            />
          </div>
        </Transition>
      </div>
    </Popover.Content>
  </Popover>
</template>
```

## `parts/home-first-access.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Illustration from '@aziontech/webkit/illustration'
  import SearchTrigger from '@aziontech/webkit/search-trigger'
  import { useConsoleLayout } from '@aziontech/webkit/use-console-layout'

  import type { HomeDashboardDomainAvailability } from '../dashboard-home.vue'
  import HomeDomainCheck from './home-domain-check.vue'

  export interface HomeFirstAccessProps {
    /** Time-of-day greeting before the name. */
    greeting: string
    /** First name in the greeting. */
    name: string
    /** Answer to the last check-domain event. */
    domainAvailability?: HomeDashboardDomainAvailability
  }

  withDefaults(defineProps<HomeFirstAccessProps>(), { domainAvailability: undefined })

  const emit = defineEmits<{
    'create-project': [event: MouseEvent]
    'check-domain': [name: string]
    'register-domain': [event: MouseEvent, name: string]
    'copy-prompt': [event: MouseEvent]
  }>()

  const layout = useConsoleLayout({ optional: true })

  const openSearch = () => layout?.openSearch()
</script>

<template>
  <div class="layout-column layout-boundary relative flex min-h-full flex-1 flex-col">
    <div class="my-auto flex w-full flex-col gap-(--layout-section-gap) py-(--spacing-xl)">
      <div
        class="animate-content-enter motion-reduce:animate-none flex flex-col items-center gap-(--spacing-lg)"
      >
        <div class="flex flex-col items-center gap-(--spacing-xs)">
          <p class="text-center text-body-md text-(--text-muted)">{{ greeting }}, {{ name }}</p>
          <h1 class="text-balance text-center text-heading-lg text-(--text-default)">
            Let's build something new.
          </h1>
        </div>

        <div class="flex w-full max-w-(--container-2xl) flex-col items-stretch">
          <SearchTrigger
            class="w-full"
            label="Search resources, pages and commands"
            @open="openSearch"
          />
        </div>
      </div>

      <div
        class="animate-content-enter motion-reduce:animate-none grid grid-cols-1 gap-(--spacing-lg) md:grid-cols-3 [--content-enter-delay:var(--transition-duration-fast-01)]"
      >
        <Card :padded="false">
          <template #default>
            <div class="flex h-full flex-col p-(--spacing-sm)">
              <div
                class="flex aspect-4/3 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
              >
                <Illustration name="modern-frontends" />
              </div>

              <div
                class="flex flex-1 flex-col gap-(--spacing-md) px-(--spacing-sm) pb-(--spacing-sm) pt-(--spacing-md)"
              >
                <div class="flex flex-1 flex-col gap-(--spacing-xs)">
                  <h3 class="text-label-md text-(--text-default)">Ship something new</h3>
                  <p class="text-pretty text-body-sm text-(--text-muted)">
                    Deploy a static site or a full-stack app, with compute, AI, storage and media on
                    the same build.
                  </p>
                </div>
                <div class="flex items-center gap-(--spacing-xs)">
                  <Button
                    label="Create Project"
                    variant="outline"
                    size="medium"
                    @click="(event) => emit('create-project', event)"
                  />
                </div>
              </div>
            </div>
          </template>
        </Card>
        <Card :padded="false">
          <template #default>
            <div class="flex h-full flex-col p-(--spacing-sm)">
              <div
                class="flex aspect-4/3 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
              >
                <Illustration name="dns-protection" />
              </div>

              <div
                class="flex flex-1 flex-col gap-(--spacing-md) px-(--spacing-sm) pb-(--spacing-sm) pt-(--spacing-md)"
              >
                <div class="flex flex-1 flex-col gap-(--spacing-xs)">
                  <h3 class="text-label-md text-(--text-default)">Add a domain</h3>
                  <p class="text-pretty text-body-sm text-(--text-muted)">
                    Register a new one or bring your own. DNS, automatic HTTPS and DDoS protection
                    come with it.
                  </p>
                </div>
                <div class="flex items-center gap-(--spacing-xs)">
                  <HomeDomainCheck
                    :domain-availability="domainAvailability"
                    @check-domain="(value) => emit('check-domain', value)"
                    @register-domain="(event, value) => emit('register-domain', event, value)"
                  />
                </div>
              </div>
            </div>
          </template>
        </Card>
        <Card :padded="false">
          <template #default>
            <div class="flex h-full flex-col p-(--spacing-sm)">
              <div
                class="flex aspect-4/3 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
              >
                <Illustration name="ai-applications" />
              </div>

              <div
                class="flex flex-1 flex-col gap-(--spacing-md) px-(--spacing-sm) pb-(--spacing-sm) pt-(--spacing-md)"
              >
                <div class="flex flex-1 flex-col gap-(--spacing-xs)">
                  <h3 class="text-label-md text-(--text-default)">Onboard your agent</h3>
                  <p class="text-pretty text-body-sm text-(--text-muted)">
                    Give Claude, Cursor, Windsurf, Codex or OpenCode a prompt that sets your project
                    up to deploy here.
                  </p>
                </div>
                <div class="flex items-center gap-(--spacing-xs)">
                  <Button
                    label="Copy prompt"
                    variant="outline"
                    size="medium"
                    icon="az az-copy"
                    @click="(event) => emit('copy-prompt', event)"
                  />
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>
```

## `parts/home-panels.vue`

```ts
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Item from '@aziontech/webkit/item'
  import Link from '@aziontech/webkit/link'
  import Skeleton from '@aziontech/webkit/skeleton'

  import type { HomeDashboardResource } from '../dashboard-home.vue'

  /** One resource panel of the grid. */
  export interface HomePanel {
    /** Stable key. */
    key: string
    /** The panel heading. */
    label: string
    /** The page the heading links to; empty shows plain text. */
    path: string
    /** The panel lists recently opened resources. */
    recent: boolean
    /** The rows carry the project preset icon. */
    marked: boolean
    /** The rows. */
    resources: HomeDashboardResource[]
  }

  export interface HomePanelsProps {
    /** The panels, in the order they render. */
    panels: HomePanel[]
    /** The rows are loading. */
    loading: boolean
    /** Why the rows could not load; empty shows the rows. */
    error: string
  }

  defineProps<HomePanelsProps>()

  const emit = defineEmits<{ retry: [event: MouseEvent] }>()

  const CARD_GRID_CLASS =
    'animate-content-enter motion-reduce:animate-none mt-(--spacing-lg) grid w-full min-w-0 grid-cols-1 gap-(--layout-group-gap) ' +
    'sm:grid-cols-2 lg:grid-cols-3 xl:min-h-0 xl:flex-1 xl:grid-cols-5 xl:gap-(--layout-section-gap) ' +
    '[--content-enter-delay:var(--transition-duration-fast-01)]'
</script>

<template>
  <section
    :class="CARD_GRID_CLASS"
    aria-label="Resources"
  >
    <div
      v-for="panel in panels"
      :key="panel.key"
      class="flex min-w-0 flex-col gap-(--spacing-xs) xl:min-h-0"
      :class="panel.recent ? 'sm:col-span-2 lg:col-span-3 xl:col-span-2' : ''"
    >
      <h2
        class="flex min-h-(--size-6) items-center gap-(--spacing-xs) text-label-sm text-(--text-default)"
      >
        <span
          v-if="panel.marked || panel.recent"
          class="shrink-0"
          aria-hidden="true"
        />
        <Link
          v-if="panel.path"
          :href="panel.path"
          :label="panel.label"
          size="small"
          icon="az az-chevron-right"
        />
        <span v-else>{{ panel.label }}</span>
      </h2>

      <div class="min-w-0 xl:min-h-0 xl:flex-1 xl:overflow-y-auto xl:overscroll-contain">
        <Alert
          v-if="error"
          severity="danger"
          :label="`Couldn't load ${panel.label.toLowerCase()}. ${error}`"
          action-label="Retry"
          @action="(event) => emit('retry', event)"
        />
        <div
          v-else-if="loading"
          key="panel-loading"
          class="flex flex-col gap-(--spacing-xs)"
        >
          <Skeleton
            v-for="line in 3"
            :key="line"
            height="2rem"
          />
        </div>
        <Item.List
          v-else-if="panel.resources.length"
          key="panel-rows"
        >
          <Item
            v-for="resource in panel.resources"
            :key="resource.href"
            :href="resource.href"
            size="small"
          >
            <Item.Content>
              <Item.Title class="w-full">
                <template v-if="panel.recent">
                  <span
                    class="flex shrink-0 items-center justify-center"
                    aria-hidden="true"
                  >
                    <i class="az az-history text-body-xs leading-none text-(--text-muted)" />
                  </span>
                  <span class="min-w-(--size-24) shrink-0 text-body-sm text-(--text-muted)"
                    >{{ resource.typeLabel }} /</span
                  >
                </template>

                <span
                  v-else-if="panel.marked"
                  class="flex shrink-0 items-center justify-center"
                  aria-hidden="true"
                >
                  <i
                    v-if="resource.presetIcon"
                    :class="resource.presetIcon"
                    class="text-body-lg leading-none"
                    :title="resource.presetLabel"
                  />
                </span>
                <span class="min-w-0 truncate text-label-md text-(--text-default)">
                  {{ resource.name }}
                </span>
              </Item.Title>
            </Item.Content>

            <Item.Actions>
              <i
                class="az az-chevron-right shrink-0 text-body-xs text-(--text-muted)"
                aria-hidden="true"
              />
            </Item.Actions>
          </Item>
        </Item.List>

        <EmptyState
          v-else
          size="small"
          :title="panel.recent ? 'Nothing opened yet' : `No ${panel.label.toLowerCase()} yet`"
          :description="
            panel.recent
              ? 'Resources you open show up here.'
              : `${panel.label} you create show up here.`
          "
        />
      </div>
    </div>
  </section>
</template>
```

## `parts/home-usage-band.vue`

```ts
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import claudeMark from '@aziontech/webkit/assets/claude-symbol-color.svg'
  import codexMark from '@aziontech/webkit/assets/codex-symbol-mono.svg'
  import cursorMark from '@aziontech/webkit/assets/cursor-symbol-mono.svg'
  import geminiMark from '@aziontech/webkit/assets/gemini-symbol-color.svg'
  import Card from '@aziontech/webkit/card'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import Item from '@aziontech/webkit/item-root'
  import StatTile from '@aziontech/webkit/stat-tile'
  import StatTileGroup from '@aziontech/webkit/stat-tile-group'
  import ThirdPartyLogo from '@aziontech/webkit/third-party-logo'
  import Tooltip from '@aziontech/webkit/tooltip'

  import type { HomeMetricDefinition } from '../home-metrics'

  /** One usage tile, its definition and its measured figure. */
  export interface HomeUsageTile extends HomeMetricDefinition {
    /** The figure; null reads as a dash. */
    value: number | null
    /** Change against the previous window; null hides the delta. */
    delta: number | null
  }

  export interface HomeUsageBandProps {
    /** The usage tiles, in the order they render. */
    tiles: HomeUsageTile[]
    /** The figures are loading. */
    loading: boolean
    /** Why the figures could not load; empty shows the tiles. */
    error: string
  }

  defineProps<HomeUsageBandProps>()

  const emit = defineEmits<{ retry: [event: MouseEvent] }>()

  const agentSetup = defineModel<boolean>('agentSetup', { required: true })

  const agentMarks = [
    { name: 'Claude', src: claudeMark, mono: false },
    { name: 'Codex', src: codexMark, mono: true },
    { name: 'Gemini', src: geminiMark, mono: false },
    { name: 'Cursor', src: cursorMark, mono: true }
  ]

  const AGENT_STACK_CLASS =
    'flex items-center [&>*+*]:-ms-2 [&>*+*]:transition-[margin-left] [&>*+*]:duration-moderate-01 [&>*+*]:ease-productive-entrance group-hover/item:[&>*+*]:-ms-1.5 ' +
    'group-focus-visible/item:[&>*+*]:-ms-1.5 motion-reduce:[&>*+*]:transition-none'

  const AGENT_MARK_CLASS =
    'flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-control) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface-raised) ' +
    'text-(--text-default)'
</script>

<template>
  <aside
    class="animate-content-enter motion-reduce:animate-none flex w-full shrink-0 flex-col gap-(--layout-group-gap) xl:flex-row xl:items-stretch xl:gap-(--layout-section-gap)"
    aria-label="Usage"
  >
    <div class="min-w-0 xl:flex-1">
      <Alert
        v-if="error"
        severity="danger"
        :label="`Couldn't load usage. ${error}`"
        action-label="Retry"
        @action="(event) => emit('retry', event)"
      />
      <StatTileGroup v-else>
        <StatTile
          v-for="metric in tiles"
          :key="metric.label"
          :label="metric.label"
          :value="metric.value"
          :unit="metric.unit"
          :delta="metric.delta"
          :loading="loading"
          :error="error"
        >
          <template #aside>
            <Hint :content="metric.hint" />
          </template>
        </StatTile>
      </StatTileGroup>
    </div>

    <Transition
      leave-active-class="transition-[scale,translate,opacity] duration-moderate-01 ease-productive-exit motion-reduce:transition-none"
      leave-to-class="scale-95 translate-y-(--spacing-xs) opacity-0"
    >
      <div
        v-if="agentSetup"
        class="relative w-full shrink-0 xl:w-[30%] xl:max-w-(--container-xs)"
      >
        <Card
          :padded="false"
          class="w-full"
        >
          <template #default>
            <Item
              href="/agents/setup"
              class="h-full"
            >
              <span class="flex min-w-0 flex-col items-start gap-(--spacing-md)">
                <span
                  :class="AGENT_STACK_CLASS"
                  aria-hidden="true"
                >
                  <span
                    v-for="agent in agentMarks"
                    :key="agent.name"
                    :class="AGENT_MARK_CLASS"
                  >
                    <ThirdPartyLogo
                      :name="agent.name"
                      :src="agent.src"
                      :variant="agent.mono ? 'current' : 'color'"
                      decorative
                      size="small"
                    />
                  </span>
                </span>

                <span class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                  <span class="text-heading-2xs text-(--text-default)"
                    >Set up your coding agent</span
                  >
                  <span class="text-pretty text-body-sm text-(--text-muted)"
                    >Give your editor a prompt that teaches it to build and deploy here.</span
                  >
                </span>
              </span>
            </Item>
          </template>
        </Card>
        <div class="absolute end-(--spacing-xs) top-(--spacing-xs)">
          <Tooltip
            content="Dismiss"
            side="top"
          >
            <IconButton
              icon="az az-x"
              variant="ghost"
              size="small"
              aria-label="Dismiss agent setup"
              @click="agentSetup = false"
            />
          </Tooltip>
        </div>
      </div>
    </Transition>
  </aside>
</template>
```
