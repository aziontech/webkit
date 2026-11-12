# HomeDashboard (`platform/dashboard/home-dashboard`)

> The whole Home page body, in both of its states. **Populated** (once the account owns a resource): a greeting heading, a usage band with four chartless StatTiles joined in one StatTileGroup card (each label explained in a Tooltip in the tile’s aside slot, each figure beside its unit and delta Tag) next to the dismissible agent onboarding card, and a five-column resources grid with the Projects, Resources, Domains and Recents panels, every row a full-width link with a hover-revealed actions DropdownMenu. **Empty** (a brand-new account): the first-access screen, a greeting under a centred headline, the command prompt that opens the layout’s palette (useConsoleLayout().openSearch()) on click or Enter, and the three doors (ship something new, add a domain with its availability check, onboard your agent). The first-access content on its own is the Onboarding template; while either screen arrives, the PageWires Overview and Onboarding wires hold the page. Built from `StatTileGroup`, `StatTile`, `Card`, `Tooltip`, `IconButton`, `Item`, `DropdownMenu`, `SearchTrigger`, `Popover`, `Spinner`, `Illustration`, `Button` and the agent marks from the webkit assets. A page body: render it in the default slot of ConsoleLayout, which owns the rail, the header and the main.

- Surface: product
- Source: `blocks/platform/dashboard/home-dashboard/home-dashboard.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/dashboard/home-dashboard")`
- Components: `claudeMark`, `codexMark`, `cursorMark`, `geminiMark`, [Button](../../../components/button.md), [Card](../../../components/card.md), [DropdownMenu](../../../components/dropdown-menu.md), [IconButton](../../../components/icon-button.md), [Illustration](../../../components/illustration.md), [Input](../../../components/input.md), [Item](../../../components/item.md), [Popover](../../../components/popover.md), [SearchTrigger](../../../components/search-trigger.md), [Spinner](../../../components/spinner.md), [StatTile](../../../components/stat-tile.md), [StatTileGroup](../../../components/stat-tile-group.md), [Tooltip](../../../components/tooltip.md), `use-console-layout`
- Skills: `webkit-layout`, `webkit-ui-states`, `webkit-microcopy`

## Asked as

home; home page; home dashboard; console home; usage overview; página inicial; início do console; first access; home empty state; new account home; welcome screen; first run; brand-new account; getting started home; primeiro acesso; tela de boas-vindas; home vazia

The Console's Home page: the first screen a signed-in user lands on. Its job
is to get them back to work fast. For an account that owns resources it shows a short usage band and
the resources they touch most (projects, resources, domains, recents), every row a link. For a
brand-new account it becomes the first-access screen: a greeting, the command prompt and three doors
to a first project, a first domain and a coding agent. It is not an analytics page; detail lives on
each resource's own dashboard.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shells/console`), which owns the rail, the header, the search palette and the `main`.

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

### A. Row actions — `DropdownMenu` (required)

On each resource row, the hover-revealed actions (`View details`, `Edit`, `Delete`).

### B. Control labels and metric definitions — `Tooltip` (required)

Names every icon-only control, and in each usage tile's aside slot explains the metric
(`Share of traffic served from cache instead of your origin.`). Also labels `Dismiss` on the agent card.

### C. Icon-only controls — `IconButton` (required)

Row actions and dismiss. Each has an `aria-label` that names its target (`Actions for my-app`,
`Dismiss agent setup`).

### D. Usage band — `StatTileGroup`, `StatTile` (required)

Four chartless tiles joined in one `StatTileGroup` card (the group draws the surface and the dividers),
in an aside labelled `Usage`, each with a numeric `value`, a unit and a numeric `delta`. Beside them,
the dismissible `Set up your coding agent` card. Home shows at most these four figures; the rest
belongs on a dashboard.

### E. Agent onboarding — `Card` (optional)

A whole-card button: the agent marks, `Set up your coding agent` and one sentence. A mono mark is a
CSS mask whose `url('…')` is quoted: the build inlines the SVG as a `data:` URI, and unquoted it breaks
the declaration and the mark renders as a solid square. Its dismiss
`IconButton` sits outside the button so the two actions never nest.

### F. Resource rows — `Item` (required)

The `Projects`, `Resources`, `Domains` and `Recents` panels in a region labelled `Resources`. Every row
is one full-width link to the resource, with its actions menu revealed on hover and focus. An empty
panel says `Nothing here yet.` (`Nothing opened here yet.` for Recents).

## Do

- Greet by first name in a muted heading; it is the only personal line on the page.
- Make every resource row a single link with the actions menu as a separate control.
- Let the user dismiss the agent card for good.
- Show the first-access screen, not a grid of empty panels, when the account owns nothing.
- Open the layout's palette from the first-access prompt with `useConsoleLayout().openSearch()`; never mount a second `Command`.

## Don't

- Don't add charts to Home; link to the dashboard that has them.
- Don't put more than four usage tiles in the band.
- Don't hand-build the band's card, grid or dividers around the tiles; `StatTileGroup` draws them.
- Don't pass figures as strings or flags as `'true'` / `'false'`: a tile's `value` and `delta` are
  numbers, and the string `'false'` is truthy.
- Don't nest the dismiss button inside the card's button.
- Don't show a second highlighted button next to `Agent`.

## Copy

- **Greeting:** time of day and first name. `Good morning, Alex`.
- **Tile labels:** the metric in sentence case. `Data transferred`, `Requests per second`.
- **Tile tooltips:** one sentence with a period. `Total bytes delivered across all your resources.`
- **Agent card:** imperative title plus one sentence. `Set up your coding agent` / `Give your editor a prompt that teaches it to build and deploy here.`
- **Empty panel:** `Nothing here yet.`
- **Prompt label:** `Search resources, pages and commands`.

## Accessibility

- The usage band is labelled `Usage` and the panels `Resources`; the layout owns the header, the rail and the one `main`.
- Every icon-only control has an `aria-label` and a `Tooltip`.
- Row actions are reachable by keyboard: the menu trigger appears on focus as well as hover.
- On a new account the prompt opens the layout's command palette, which also opens with ⌘K / Ctrl K.
- Entrance animations and the card's dismiss transition honour `prefers-reduced-motion`.

## States

- Default: populated Home for an account that owns resources (usage band, agent card, resource panels).
- Empty: a brand-new account; the first-access screen with the greeting, the command prompt that opens the palette, and the three doors (create a project, add a domain with an availability check, set up an agent).

## Related

- `shells/console` — the shell Home renders inside.
- `platform/states/page-wires` — the Overview and Onboarding wires that hold Home while it loads.
- `platform/states/first-use` — the first-use state of one resource list.
- `platform/dashboard/analytics-dashboard` — where usage detail lives.

## Variants

- `Default` — primary (the code below)
- `Empty` — Home for a brand-new account: the first-access screen. Inside ConsoleLayout, clicking the prompt (or pressing Enter on it) opens the layout's command palette; type a domain such as example.com (taken) or my-new-site.dev (available) into the second door to run the availability check.

Each variant is the same screen in another state: `get_pattern("platform/dashboard/home-dashboard", { variant })`, or the file under `blocks/platform/dashboard/home-dashboard/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import claudeMark from '@aziontech/webkit/assets/claude-symbol-color.svg'
  import codexMark from '@aziontech/webkit/assets/codex-symbol-mono.svg'
  import cursorMark from '@aziontech/webkit/assets/cursor-symbol-mono.svg'
  import geminiMark from '@aziontech/webkit/assets/gemini-symbol-color.svg'
  import Card from '@aziontech/webkit/card'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import Item from '@aziontech/webkit/item'
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
          presetIcon: 'ai-cor ai-astro',
          presetLabel: 'Astro'
        },
        {
          id: '6630405070',
          type: 'projects',
          typeLabel: 'Project',
          name: 'docs-site',
          presetIcon: 'ai-cor ai-next',
          presetLabel: 'Next.js'
        },
        {
          id: '5520304060',
          type: 'projects',
          typeLabel: 'Project',
          name: 'black-friday-2026',
          presetIcon: 'ai-cor ai-next',
          presetLabel: 'Next.js'
        },
        {
          id: '2041778390',
          type: 'projects',
          typeLabel: 'Project',
          name: 'hello-world',
          presetIcon: 'ai-cor ai-js',
          presetLabel: 'JavaScript'
        },
        {
          id: '1784552864',
          type: 'projects',
          typeLabel: 'Project',
          name: 'web-app',
          presetIcon: 'ai-cor ai-vue',
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
          presetIcon: 'ai-cor ai-astro',
          presetLabel: 'Astro'
        },
        {
          id: '6630405070',
          type: 'projects',
          typeLabel: 'Project',
          name: 'docs-site',
          presetIcon: 'ai-cor ai-next',
          presetLabel: 'Next.js'
        },
        {
          id: '5520304060',
          type: 'projects',
          typeLabel: 'Project',
          name: 'black-friday-2026',
          presetIcon: 'ai-cor ai-next',
          presetLabel: 'Next.js'
        }
      ]
    }
  ]

  const agentMarks = [
    { name: 'claude', src: claudeMark, mono: false },
    { name: 'codex', src: codexMark, mono: true },
    { name: 'gemini', src: geminiMark, mono: false },
    { name: 'cursor', src: cursorMark, mono: true }
  ]

  const agentOnboardingVisible = ref(true)
</script>

<template>
  <div
    class="layout-column layout-boundary relative flex min-h-full flex-1 flex-col justify-center xl:h-full xl:min-h-0 xl:justify-start"
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
          <StatTileGroup>
            <StatTile
              v-for="metric in metrics"
              :key="metric.label"
              :label="metric.label"
              :value="metric.value"
              :unit="metric.unit"
              :delta="metric.delta"
            >
              <template #aside>
                <Tooltip :text="metric.hint">
                  <i
                    class="pi pi-info-circle text-body-sm text-(--text-muted)"
                    aria-hidden="true"
                  />
                </Tooltip>
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
              <template #content>
                <button
                  type="button"
                  class="group relative flex h-full w-full flex-col items-start gap-(--spacing-md) rounded-(--shape-card) p-(--spacing-md) text-start transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-(--bg-surface-raised) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset"
                >
                  <span
                    class="flex items-center [&>*+*]:-ms-2 [&>*+*]:transition-[margin-left] [&>*+*]:duration-moderate-01 [&>*+*]:ease-productive-entrance group-hover:[&>*+*]:-ms-1.5 group-focus-visible:[&>*+*]:-ms-1.5 motion-reduce:[&>*+*]:transition-none"
                    aria-hidden="true"
                  >
                    <span
                      v-for="agent in agentMarks"
                      :key="agent.name"
                      class="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-elements) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface-raised)"
                    >
                      <span
                        v-if="agent.mono"
                        class="size-(--size-4) shrink-0 bg-current text-(--text-default) mask-(--agent-mark) mask-contain mask-center mask-no-repeat"
                        :style="{ '--agent-mark': `url('${agent.src}')` }"
                      />
                      <img
                        v-else
                        :src="agent.src"
                        alt=""
                        class="size-(--size-4) shrink-0"
                      />
                    </span>
                  </span>

                  <span class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                    <span class="text-heading-xxs text-(--text-default)"
                      >Set up your coding agent</span
                    >
                    <span class="text-pretty text-body-sm text-(--text-muted)"
                      >Give your editor a prompt that teaches it to build and deploy here.</span
                    >
                  </span>
                </button>
              </template>
            </Card>
            <div class="absolute end-(--spacing-xs) top-(--spacing-xs)">
              <Tooltip
                text="Dismiss"
                placement="top"
              >
                <IconButton
                  icon="pi pi-times"
                  kind="transparent"
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
            <a
              v-if="panel.path"
              :href="panel.path"
              class="inline-flex items-center gap-(--spacing-xxs) rounded-(--shape-button) outline-none hover:underline focus-visible:ring-2 focus-visible:ring-(--ring-color)"
            >
              {{ panel.label }}
              <i
                class="pi pi-chevron-right text-body-xs leading-none text-(--text-muted)"
                aria-hidden="true"
              />
            </a>
            <span v-else>{{ panel.label }}</span>
          </h2>

          <div class="min-w-0 xl:min-h-0 xl:flex-1 xl:overflow-y-auto xl:overscroll-contain">
            <Item.List
              v-if="panel.resources.length"
              key="panel-rows"
            >
              <Item
                v-for="resource in panel.resources"
                :key="resource.type + '-' + resource.id"
                role="listitem"
                size="small"
              >
                <Item.Content>
                  <Item.Title class="w-full">
                    <template v-if="panel.recent">
                      <span
                        class="flex shrink-0 items-center justify-center"
                        aria-hidden="true"
                      >
                        <i class="pi pi-history text-body-xs leading-none text-(--text-muted)" />
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
                    <button
                      type="button"
                      data-row-link
                      class="min-w-0 cursor-pointer truncate text-start text-label-md text-(--text-default) outline-none group-hover/item:underline focus-visible:underline after:absolute after:inset-0 after:content-['']"
                    >
                      {{ resource.name }}
                    </button>
                  </Item.Title>
                </Item.Content>

                <div class="relative z-10 grid size-(--size-7) place-items-center">
                  <Item.Actions class="w-full">
                    <div
                      class="col-start-1 row-start-1 opacity-0 transition-opacity duration-150 ease-out motion-reduce:transition-none group-hover/item:opacity-100 group-focus-within/item:opacity-100"
                    >
                      <DropdownMenu placement="bottom-end">
                        <DropdownMenu.Trigger>
                          <Tooltip text="Resource actions">
                            <IconButton
                              icon="pi pi-ellipsis-h"
                              kind="transparent"
                              size="small"
                              :aria-label="'Actions for ' + resource.name"
                            />
                          </Tooltip>
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Group>
                          <DropdownMenu.Option
                            value="view"
                            label="View details"
                          />
                          <DropdownMenu.Option
                            value="edit"
                            label="Edit"
                          />
                        </DropdownMenu.Group>

                        <DropdownMenu.Group>
                          <DropdownMenu.Option
                            value="delete"
                            label="Delete"
                          >
                            <template #left>
                              <i
                                class="pi pi-trash"
                                aria-hidden="true"
                              />
                            </template>
                          </DropdownMenu.Option>
                        </DropdownMenu.Group>
                      </DropdownMenu>
                    </div>

                    <i
                      class="pi pi-chevron-right col-start-1 row-start-1 shrink-0 text-body-xs text-(--text-muted) transition-opacity duration-150 ease-out motion-reduce:transition-none group-hover/item:opacity-0 group-focus-within/item:opacity-0"
                      aria-hidden="true"
                    />
                  </Item.Actions>
                </div>
              </Item>
            </Item.List>

            <p
              v-else
              class="px-(--spacing-md) py-(--spacing-sm) text-body-sm text-(--text-muted)"
            >
              {{ panel.recent ? 'Nothing opened here yet.' : 'Nothing here yet.' }}
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
```
