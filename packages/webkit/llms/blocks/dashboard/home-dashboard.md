# HomeDashboard (`dashboard/home-dashboard`)

> The whole Home page body, in both of its states. **Populated** (once the account owns a resource): a greeting heading, a usage band with four chartless StatTiles joined in one StatTileGroup card (each label explained by a `Hint` in the tile’s aside slot, each figure beside its unit and delta Tag) next to the dismissible agent onboarding card (one whole-card `Item` link), and a five-column resources grid with the Projects, Resources, Domains and Recents panels, every row a whole-row `Item` link to the resource, each panel heading a `Link` to its list, and an empty panel an `EmptyState`. **Empty** (a brand-new account): the first-access screen, a greeting under a centred headline, the command prompt that opens the layout’s palette (useConsoleLayout({ optional: true }), then layout?.openSearch()) on click or Enter, and the three doors (ship something new, add a domain with its availability check, onboard your agent). While either screen arrives, the PageWires Overview and Onboarding wires (`state/page-skeleton`) hold the page. Built from `StatTileGroup`, `StatTile`, `Hint`, `Card`, `Link`, `EmptyState`, `Alert`, `Tooltip`, `IconButton`, `Item`, `SearchTrigger`, `Popover`, `Spinner`, `Illustration`, `Button` and the agent marks from the webkit assets. A page body: render it in the default slot of ConsoleLayout, which owns the rail, the header and the main. The populated root carries data-layout-fill and scrolls itself: from xl each resource panel scrolls its rows; below xl the page scrolls as one. The first-access screen does not fill.

- Surface: app
- Source: `blocks/dashboard/home-dashboard/home-dashboard.vue` in `@aziontech/webkit`
- MCP: `get_block("dashboard/home-dashboard")`
- Components: [Alert](../../components/alert.md), `claudeMark`, `codexMark`, `cursorMark`, `geminiMark`, [Button](../../components/button.md), [Card](../../components/card.md), [DataTable](../../components/data-table.md), `DropdownMenuGroup`, `DropdownMenuItem`, [EmptyState](../../components/empty-state.md), [Hint](../../components/hint.md), [IconButton](../../components/icon-button.md), [Illustration](../../components/illustration.md), [Input](../../components/input.md), [Item](../../components/item.md), [Link](../../components/link.md), [Logo](../../components/logo.md), [Popover](../../components/popover.md), [SearchTrigger](../../components/search-trigger.md), [Spinner](../../components/spinner.md), [StatTile](../../components/stat-tile.md), [StatTileGroup](../../components/stat-tile-group.md), [Table](../../components/table.md), [Tag](../../components/tag.md), [Toast](../../components/toast.md), [Tooltip](../../components/tooltip.md), `use-console-layout`
- Skills: `webkit-layout`, `webkit-ui-states`, `webkit-microcopy`

## Asked as

home; home page; home dashboard; console home; usage overview; página inicial; início do console; first access; home empty state; new account home; welcome screen; first run; brand-new account; getting started home; primeiro acesso; tela de boas-vindas; home vazia; classic overview; overview dashboard; account summary; recent activity; monthly usage; visão geral; account landing overview

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

- Default: populated Home for an account that owns resources (usage band, agent card, resource panels).
- Error: Home's data could not load; the usage band and every panel show a danger `Alert` with Retry.
- Empty: a brand-new account; the first-access screen with the greeting, the command prompt that opens the palette, and the three doors (create a project, add a domain with an availability check, set up an agent).
- Summary: the classic overview; metric tiles with the window caption, the resources and recent activity tables, and the aside with monthly usage and a featured marketplace template.

## Related

- `shell/console` — the shell Home renders inside.
- `state/page-skeleton` — the Overview and Onboarding wires that hold Home while it loads.
- `state/first-use` — the first-use state of one resource list.
- `dashboard/analytics-dashboard` — where usage detail lives.

## Variants

- `Default` — primary (the code below)
- `Empty` — Home for a brand-new account: the first-access screen. Inside ConsoleLayout, clicking the prompt (or pressing Enter on it) opens the layout's command palette; type a domain such as example.com (taken) or acme.example.com (available) into the second door to run the availability check.
- `Error` — Populated Home whose data could not load: the usage band and every resource panel show a danger `Alert` with Retry in place of their content; the greeting and the agent card stay.
- `Summary` — The classic overview: four metric StatTiles with a Hint on each label and the window they cover in a caption, a resources DataTable card and a Recent activity DataTable card, each with a View all footer Link, beside an aside of a Monthly usage list card and a Marketplace trends card that pages through featured templates with Previous and Next.

Each variant is the same screen in another state: `get_block("dashboard/home-dashboard", { variant })`, or the file under `blocks/dashboard/home-dashboard/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import claudeMark from '@aziontech/webkit/assets/claude-symbol-color.svg'
  import codexMark from '@aziontech/webkit/assets/codex-symbol-mono.svg'
  import cursorMark from '@aziontech/webkit/assets/cursor-symbol-mono.svg'
  import geminiMark from '@aziontech/webkit/assets/gemini-symbol-color.svg'
  import Card from '@aziontech/webkit/card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import Item from '@aziontech/webkit/item'
  import Link from '@aziontech/webkit/link'
  import Logo from '@aziontech/webkit/logo'
  import StatTile from '@aziontech/webkit/stat-tile'
  import StatTileGroup from '@aziontech/webkit/stat-tile-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { ref } from 'vue'

  const metrics = [
    {
      label: 'Data transferred',
      value: 842,
      unit: 'GB',
      delta: 12.4,
      hint: 'Total bytes delivered across all your resources.'
    },
    {
      label: 'Requests per second',
      value: 1240,
      unit: '/s',
      delta: 3.8,
      hint: 'Average requests handled per second in the selected window.'
    },
    {
      label: 'Bandwidth saving',
      value: 588,
      unit: 'GB',
      delta: 6.2,
      hint: 'Bytes served from cache instead of your origin.'
    },
    {
      label: 'Data offload',
      value: 70,
      unit: '%',
      delta: -1.5,
      hint: 'Share of traffic served from cache instead of your origin.'
    }
  ]

  const panels = [
    {
      key: 'projects',
      label: 'Projects',
      path: '/projects',
      recent: false,
      marked: true,
      resources: [
        {
          id: '4410203040',
          type: 'projects',
          typeLabel: 'Project',
          name: 'marketing-site',
          presetIcon: 'ai-color ai-astro',
          presetLabel: 'Astro'
        },
        {
          id: '6630405070',
          type: 'projects',
          typeLabel: 'Project',
          name: 'docs-site',
          presetIcon: 'ai-color ai-nextjs',
          presetLabel: 'Next.js'
        },
        {
          id: '5520304060',
          type: 'projects',
          typeLabel: 'Project',
          name: 'black-friday-2026',
          presetIcon: 'ai-color ai-nextjs',
          presetLabel: 'Next.js'
        },
        {
          id: '2041778390',
          type: 'projects',
          typeLabel: 'Project',
          name: 'hello-world',
          presetIcon: 'ai-color ai-javascript',
          presetLabel: 'JavaScript'
        },
        {
          id: '1784552864',
          type: 'projects',
          typeLabel: 'Project',
          name: 'web-app',
          presetIcon: 'ai-color ai-vue',
          presetLabel: 'Vue'
        }
      ]
    },
    {
      key: 'resources',
      label: 'Resources',
      path: '/resources',
      recent: false,
      marked: false,
      resources: [
        { id: '1020655', type: 'resources', typeLabel: 'Resource', name: 'resource-01' },
        { id: '1031410003', type: 'resources', typeLabel: 'Resource', name: 'resource-02' },
        { id: '1031410001', type: 'resources', typeLabel: 'Resource', name: 'resource-03' }
      ]
    },
    {
      key: 'domains',
      label: 'Domains',
      path: '',
      recent: false,
      marked: false,
      resources: [
        { id: 'domain-1020655', type: 'domains', typeLabel: 'Domain', name: 'app.example.com' },
        {
          id: 'domain-1031410003',
          type: 'domains',
          typeLabel: 'Domain',
          name: '*.preview.example.com'
        },
        { id: 'domain-1031410001', type: 'domains', typeLabel: 'Domain', name: 'www.example.com' },
        { id: 'domain-1031410002', type: 'domains', typeLabel: 'Domain', name: 'api.example.com' }
      ]
    },
    {
      key: 'recents',
      label: 'Recents',
      path: '',
      recent: true,
      marked: false,
      resources: [
        { id: '1020655', type: 'resources', typeLabel: 'Resource', name: 'resource-01' },
        { id: 'domain-1020655', type: 'domains', typeLabel: 'Domain', name: 'app.example.com' },
        {
          id: '4410203040',
          type: 'projects',
          typeLabel: 'Project',
          name: 'marketing-site',
          presetIcon: 'ai-color ai-astro',
          presetLabel: 'Astro'
        },
        {
          id: '6630405070',
          type: 'projects',
          typeLabel: 'Project',
          name: 'docs-site',
          presetIcon: 'ai-color ai-nextjs',
          presetLabel: 'Next.js'
        },
        {
          id: '5520304060',
          type: 'projects',
          typeLabel: 'Project',
          name: 'black-friday-2026',
          presetIcon: 'ai-color ai-nextjs',
          presetLabel: 'Next.js'
        }
      ]
    }
  ]

  const agentMarks = [
    { name: 'Claude', src: claudeMark, mono: false },
    { name: 'Codex', src: codexMark, mono: true },
    { name: 'Gemini', src: geminiMark, mono: false },
    { name: 'Cursor', src: cursorMark, mono: true }
  ]

  const resourcePath = (resource: { type: string; id: string }) =>
    `/${resource.type}/${resource.id}`

  const agentOnboardingVisible = ref(true)
  const failed = false

  const emit = defineEmits<{ retry: [event: MouseEvent] }>()
</script>

<template>
  <div
    data-layout-fill
    class="layout-column layout-boundary relative flex h-dvh flex-col justify-center-safe overflow-y-auto xl:justify-start"
  >
    <header class="flex items-center">
      <h1 class="text-heading-sm text-(--text-muted)">
        Good morning,
        <span class="text-(--text-default)">Alex</span>
      </h1>
    </header>

    <div
      class="layout-section-start flex flex-col gap-(--layout-boundary-start) xl:min-h-0 xl:flex-1"
    >
      <aside
        class="animate-content-enter motion-reduce:animate-none flex w-full shrink-0 flex-col gap-(--layout-group-gap) xl:flex-row xl:items-stretch xl:gap-(--layout-section-gap)"
        aria-label="Usage"
      >
        <div class="min-w-0 xl:flex-1">
          <Alert
            v-if="failed"
            severity="danger"
            label="Couldn't load usage. Check your connection and retry."
            action-label="Retry"
            @action="(event) => emit('retry', event)"
          />
          <StatTileGroup v-else>
            <StatTile
              v-for="metric in metrics"
              :key="metric.label"
              :label="metric.label"
              :value="metric.value"
              :unit="metric.unit"
              :delta="metric.delta"
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
            v-if="agentOnboardingVisible"
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
                      class="flex items-center [&>*+*]:-ms-2 [&>*+*]:transition-[margin-left] [&>*+*]:duration-moderate-01 [&>*+*]:ease-productive-entrance group-hover/item:[&>*+*]:-ms-1.5 group-focus-visible/item:[&>*+*]:-ms-1.5 motion-reduce:[&>*+*]:transition-none"
                      aria-hidden="true"
                    >
                      <span
                        v-for="agent in agentMarks"
                        :key="agent.name"
                        class="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-control) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface-raised) text-(--text-default)"
                      >
                        <Logo
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
                placement="top"
              >
                <IconButton
                  icon="ai ai-x"
                  variant="ghost"
                  size="small"
                  aria-label="Dismiss agent setup"
                  @click="agentOnboardingVisible = false"
                />
              </Tooltip>
            </div>
          </div>
        </Transition>
      </aside>

      <section
        class="animate-content-enter motion-reduce:animate-none mt-(--spacing-lg) grid w-full min-w-0 grid-cols-1 gap-(--layout-group-gap) sm:grid-cols-2 lg:grid-cols-3 xl:min-h-0 xl:flex-1 xl:grid-cols-5 xl:gap-(--layout-section-gap) [--content-enter-delay:var(--transition-duration-fast-01)]"
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
              icon="ai ai-chevron-right"
            />
            <span v-else>{{ panel.label }}</span>
          </h2>

          <div class="min-w-0 xl:min-h-0 xl:flex-1 xl:overflow-y-auto xl:overscroll-contain">
            <Alert
              v-if="failed"
              severity="danger"
              :label="`Couldn't load ${panel.label.toLowerCase()}. Check your connection and retry.`"
              action-label="Retry"
              @action="(event) => emit('retry', event)"
            />
            <Item.List
              v-else-if="panel.resources.length"
              key="panel-rows"
            >
              <Item
                v-for="resource in panel.resources"
                :key="resource.type + '-' + resource.id"
                :href="resourcePath(resource)"
                size="small"
              >
                <Item.Content>
                  <Item.Title class="w-full">
                    <template v-if="panel.recent">
                      <span
                        class="flex shrink-0 items-center justify-center"
                        aria-hidden="true"
                      >
                        <i class="ai ai-history text-body-xs leading-none text-(--text-muted)" />
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
                    class="ai ai-chevron-right shrink-0 text-body-xs text-(--text-muted)"
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
    </div>
  </div>
</template>
```
