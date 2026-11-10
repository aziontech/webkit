import CardBox from '@aziontech/webkit/card-box'
import Dropdown from '@aziontech/webkit/dropdown'
import IconButton from '@aziontech/webkit/icon-button'
import Item from '@aziontech/webkit/item'
import StatTile from '@aziontech/webkit/stat-tile'
import Tooltip from '@aziontech/webkit/tooltip'
import { ref } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import {
  FIRST_ACCESS_COMPONENTS,
  FIRST_ACCESS_SCRIPT,
  firstAccessMain,
  firstAccessState
} from './_home-markup'
import {
  AGENT_LOGOS,
  AGENT_MARK_IMPORTS,
  AGENT_MARKS,
  AGENT_MARKS_LINES,
  AGENT_PROMO,
  declare,
  mergeScripts,
  pageScroll,
  promoCard,
  scriptLines,
  shell,
  SHELL_COMPONENTS,
  shellState
} from './_shell-markup'

const ACTIVE = 'home'

const METRICS = [
  {
    label: 'Data Transferred',
    value: 842,
    unit: 'GB',
    delta: 12.4,
    hint: 'Total bytes delivered across all your resources.'
  },
  {
    label: 'Requests / Second',
    value: 1240,
    unit: '/s',
    delta: 3.8,
    hint: 'Average requests handled per second in the selected window.'
  },
  {
    label: 'Bandwidth Saving',
    value: 588,
    unit: 'GB',
    delta: 6.2,
    hint: 'Bytes served from cache instead of your origin.'
  },
  {
    label: 'Data Offload',
    value: 70,
    unit: '%',
    delta: -1.5,
    hint: 'Share of traffic served from cache instead of your origin.'
  }
]

const project = (id, name, preset, presetLabel) => ({
  id,
  type: 'projects',
  typeLabel: 'Project',
  name,
  presetIcon: `ai-cor ai-${preset}`,
  presetLabel
})

const resource = (id, name) => ({ id, type: 'resources', typeLabel: 'Resource', name })

const domain = (id, name) => ({ id, type: 'domains', typeLabel: 'Domain', name })

const PANELS = [
  {
    key: 'projects',
    label: 'Projects',
    path: '/projects',
    recent: false,
    marked: true,
    resources: [
      project('4410203040', 'marketing-site', 'astro', 'Astro'),
      project('6630405070', 'docs-site', 'next', 'Next.js'),
      project('5520304060', 'black-friday-2026', 'next', 'Next.js'),
      project('2041778390', 'hello-world', 'js', 'JavaScript'),
      project('1784552864', 'web-app', 'vue', 'Vue')
    ]
  },
  {
    key: 'resources',
    label: 'Resources',
    path: '/resources',
    recent: false,
    marked: false,
    resources: [
      resource('1020655', 'resource-01'),
      resource('1031410003', 'resource-02'),
      resource('1031410001', 'resource-03')
    ]
  },
  {
    key: 'domains',
    label: 'Domains',
    path: '',
    recent: false,
    marked: false,
    resources: [
      domain('domain-1020655', 'app.example.com'),
      domain('domain-1031410003', '*.preview.example.com'),
      domain('domain-1031410001', 'www.example.com'),
      domain('domain-1031410002', 'api.example.com')
    ]
  },
  {
    key: 'recents',
    label: 'Recents',
    path: '',
    recent: true,
    marked: false,
    resources: [
      resource('1020655', 'resource-01'),
      domain('domain-1020655', 'app.example.com'),
      project('4410203040', 'marketing-site', 'astro', 'Astro'),
      project('6630405070', 'docs-site', 'next', 'Next.js'),
      project('5520304060', 'black-friday-2026', 'next', 'Next.js')
    ]
  }
]

const METRIC = `<StatTile
  v-for="metric in metrics"
  :key="metric.label"
  :label="metric.label"
  :value="metric.value"
  :unit="metric.unit"
  :delta="metric.delta"
>
  <template #aside>
    <Tooltip :text="metric.hint">
      <i class="pi pi-info-circle text-body-sm text-(--text-muted)" aria-hidden="true" />
    </Tooltip>
  </template>
</StatTile>`

const AGENT_CARD = `<Transition
  leave-active-class="transition-[scale,translate,opacity] duration-moderate-01 ease-productive-exit motion-reduce:transition-none"
  leave-to-class="scale-95 translate-y-(--spacing-xs) opacity-0"
>
  <div v-if="agentOnboardingVisible" class="relative w-full shrink-0 xl:w-[30%] xl:max-w-(--container-xs)">
${indent(promoCard({ ...AGENT_PROMO, logos: AGENT_LOGOS }), 2)}
    <div class="absolute right-(--spacing-xs) top-(--spacing-xs)">
      <Tooltip text="Dismiss" placement="top">
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
</Transition>`

const ROW = `<Item
  v-for="resource in panel.resources"
  :key="resource.type + '-' + resource.id"
  role="listitem"
  size="small"
>
  <Item.Content>
    <Item.Title class="w-full">
      <template v-if="panel.recent">
        <span class="flex shrink-0 items-center justify-center" aria-hidden="true">
          <i class="pi pi-history text-body-xs leading-none text-(--text-muted)" />
        </span>
        <span class="min-w-(--size-24) shrink-0 text-body-sm text-(--text-muted)">{{ resource.typeLabel }} /</span>
      </template>

      <span v-else-if="panel.marked" class="flex shrink-0 items-center justify-center" aria-hidden="true">
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
        class="min-w-0 cursor-pointer truncate text-left text-label-md text-(--text-default) outline-none group-hover/item:underline focus-visible:underline after:absolute after:inset-0 after:content-['']"
      >
        {{ resource.name }}
      </button>
    </Item.Title>
  </Item.Content>

  <div class="relative z-10 grid size-(--size-7) place-items-center">
    <Item.Actions class="w-full">
      <div class="col-start-1 row-start-1 opacity-0 transition-opacity duration-150 ease-out motion-reduce:transition-none group-hover/item:opacity-100 group-focus-within/item:opacity-100">
        <Dropdown
          placement="bottom-end"
        >
          <Dropdown.Trigger>
            <Tooltip text="Resource actions">
              <IconButton
                icon="pi pi-ellipsis-h"
                kind="transparent"
                size="small"
                :aria-label="'Actions for ' + resource.name"
              />
            </Tooltip>
          </Dropdown.Trigger>

          <Dropdown.Group>
            <Dropdown.Option value="view" label="View details" />
            <Dropdown.Option value="edit" label="Edit" />
          </Dropdown.Group>

          <Dropdown.Group>
            <Dropdown.Option value="delete" label="Delete">
              <template #left>
                <i class="pi pi-trash" aria-hidden="true" />
              </template>
            </Dropdown.Option>
          </Dropdown.Group>
        </Dropdown>
      </div>

      <i
        class="pi pi-chevron-right col-start-1 row-start-1 shrink-0 text-body-xs text-(--text-muted) transition-opacity duration-150 ease-out motion-reduce:transition-none group-hover/item:opacity-0 group-focus-within/item:opacity-0"
        aria-hidden="true"
      />
    </Item.Actions>
  </div>
</Item>`

const PANEL = `<div
  v-for="panel in panels"
  :key="panel.key"
  class="flex min-w-0 flex-col gap-(--spacing-xs) xl:min-h-0"
  :class="panel.recent ? 'sm:col-span-2 lg:col-span-3 xl:col-span-2' : ''"
>
  <h2 class="flex min-h-(--size-6) items-center gap-(--spacing-xs) text-label-sm text-(--text-default)">
    <span v-if="panel.marked || panel.recent" class="shrink-0" aria-hidden="true" />
    <a
      v-if="panel.path"
      :href="panel.path"
      class="inline-flex items-center gap-(--spacing-xxs) rounded-(--shape-button) outline-none hover:underline focus-visible:ring-2 focus-visible:ring-(--ring-color)"
    >
      {{ panel.label }}
      <i class="pi pi-chevron-right text-body-xs leading-none text-(--text-muted)" aria-hidden="true" />
    </a>
    <span v-else>{{ panel.label }}</span>
  </h2>

  <div class="min-w-0 xl:min-h-0 xl:flex-1 xl:overflow-y-auto xl:overscroll-contain">
    <Item.List v-if="panel.resources.length" key="panel-rows">
${indent(ROW, 3)}
    </Item.List>

    <p v-else class="px-(--spacing-md) py-(--spacing-sm) text-body-sm text-(--text-muted)">
      {{ panel.recent ? 'Nothing opened here yet.' : 'Nothing here yet.' }}
    </p>
  </div>
</div>`

const MAIN = `<div
  class="layout-column layout-boundary relative flex min-h-full flex-col justify-center xl:h-full xl:min-h-0 xl:justify-start"
>
  <header class="flex items-center">
    <h1 class="text-heading-sm text-(--text-muted)">
      Good morning,
      <span class="text-(--text-default)">Gabriel</span>
    </h1>
  </header>

  <main class="layout-section-start flex flex-col gap-(--layout-boundary-start) xl:min-h-0 xl:flex-1">
    <aside
      class="animate-content-enter motion-reduce:animate-none flex w-full shrink-0 flex-col gap-(--layout-group-gap) xl:flex-row xl:items-stretch xl:gap-(--layout-section-gap)"
      aria-label="Usage"
    >
      <div class="grid min-w-0 grid-cols-1 gap-(--layout-group-gap) sm:grid-cols-2 xl:flex-1 xl:grid-cols-4">
${indent(METRIC, 4)}
      </div>

${indent(AGENT_CARD, 3)}
    </aside>

    <section
      class="animate-content-enter motion-reduce:animate-none mt-(--spacing-lg) grid w-full min-w-0 grid-cols-1 gap-(--layout-group-gap) sm:grid-cols-2 lg:grid-cols-3 xl:min-h-0 xl:flex-1 xl:grid-cols-5 xl:gap-(--layout-section-gap) [--content-enter-delay:var(--transition-duration-fast-01)]"
      aria-label="Resources"
    >
${indent(PANEL, 3)}
    </section>
  </main>
</div>`

const TEMPLATE = shell({ withBreadcrumb: false, main: pageScroll(MAIN) })

const EMPTY_TEMPLATE = shell({
  withBreadcrumb: false,
  main: pageScroll(firstAccessMain({ palette: true }))
})

const PAGE_SCRIPT = [
  ...AGENT_MARK_IMPORTS,
  "import CardBox from '@aziontech/webkit/card-box'",
  "import Item from '@aziontech/webkit/item'",
  "import StatTile from '@aziontech/webkit/stat-tile'",
  "import { ref } from 'vue'",
  '',
  declare('metrics', METRICS),
  '',
  declare('panels', PANELS),
  '',
  ...AGENT_MARKS_LINES,
  '',
  'const agentOnboardingVisible = ref(true)'
]

const components = {
  ...SHELL_COMPONENTS,
  CardBox,
  Dropdown,
  'Dropdown.Trigger': Dropdown.Trigger,
  'Dropdown.Group': Dropdown.Group,
  'Dropdown.Option': Dropdown.Option,
  IconButton,
  Item,
  'Item.List': Item.List,
  'Item.Content': Item.Content,
  'Item.Title': Item.Title,
  'Item.Actions': Item.Actions,
  StatTile,
  Tooltip
}

const meta = {
  title: 'Templates/Platform/Shell/HomeDashboard',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The whole Home page inside the platform shell, in both of its states. **Populated** (once the account owns a resource): a greeting heading, a usage band with four chartless StatTiles (each label explained in a Tooltip in the tile’s aside slot, each figure beside its unit and delta Tag) next to the dismissible agent onboarding card, and a five-column resources grid with the Projects, Resources, Domains and Recents panels, every row a full-width link with a hover-revealed actions Dropdown. **Empty** (a brand-new account): the first-access screen, a greeting under a centred headline, the command prompt that opens the shell’s palette on click or Enter, and the three doors (ship something new, add a domain with its availability check, onboard your agent). The first-access content on its own is the Onboarding template; while either screen arrives, the PageWires Overview and Onboarding wires hold the page. Built from `StatTile`, `CardBox`, `Tooltip`, `IconButton`, `Item`, `Dropdown`, `InputText`, `Kbd`, `Popover`, `Spinner`, `Illustration`, `Button` and the agent marks from the webkit assets.'
      },
      canvas: { sourceState: 'shown' }
    },
    webkit: {
      intents: [
        'home',
        'home page',
        'home dashboard',
        'console home',
        'usage overview',
        'página inicial',
        'início do console',
        'first access',
        'home empty state',
        'new account home',
        'welcome screen',
        'first run',
        'brand-new account',
        'getting started home',
        'primeiro acesso',
        'tela de boas-vindas',
        'home vazia'
      ],
      skills: ['webkit-layout', 'webkit-ui-states', 'webkit-microcopy']
    }
  }
}

export default meta

export const Default = {
  name: 'Populated',
  render: () => ({
    components,
    setup: () => ({
      ...shellState(ACTIVE),
      metrics: METRICS,
      panels: PANELS,
      agentMarks: AGENT_MARKS,
      agentOnboardingVisible: ref(true)
    }),
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Home for an account with resources: the usage strip and the agent card, then the panels with each project’s framework mark and the recent resources prefixed by their type.'
      },
      source: {
        code: toSfc(
          mergeScripts(
            scriptLines({ parts: [], active: ACTIVE, declarations: [], state: [] }),
            PAGE_SCRIPT
          ),
          TEMPLATE
        )
      }
    }
  }
}

export const Empty = {
  render: () => ({
    components: { ...components, ...FIRST_ACCESS_COMPONENTS },
    setup: () => ({
      ...shellState(ACTIVE),
      ...firstAccessState()
    }),
    template: EMPTY_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Home for a brand-new account: the first-access screen in the shell. Click the prompt (or press Enter on it) to open the command palette; type a domain such as example.com (taken) or my-new-site.dev (available) into the second door to run the availability check.'
      },
      source: {
        code: toSfc(
          mergeScripts(
            scriptLines({ parts: [], active: ACTIVE, declarations: [], state: [] }),
            FIRST_ACCESS_SCRIPT
          ),
          EMPTY_TEMPLATE
        )
      }
    }
  }
}
