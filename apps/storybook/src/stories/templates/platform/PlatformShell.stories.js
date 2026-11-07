import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import IconButton from '@aziontech/webkit/icon-button'
import InputText from '@aziontech/webkit/input-text'
import TabView from '@aziontech/webkit/tab-view'
import Tooltip from '@aziontech/webkit/tooltip'
import { ref } from 'vue'

import { toSfc } from '../../_shared/story-source'
import { indent } from '../../_shared/markup'
import {
  declare,
  DOCS_HREF,
  ENVIRONMENT_CRUMB,
  ENVIRONMENT_CRUMB_COMPONENTS,
  ENVIRONMENT_CRUMB_DECLARATIONS,
  ENVIRONMENT_CRUMB_PARTS,
  ENVIRONMENT_CRUMB_STATE,
  environmentCrumbState,
  pageScroll,
  pageTabs,
  scriptLines,
  shell,
  SHELL_COMPONENTS,
  shellState,
  WORKLOAD_TABS
} from './_shell-markup'

const LIST_MAIN = `<main class="layout-column flex min-h-full flex-col">
  <header class="flex flex-col gap-(--spacing-md) md:flex-row md:items-start md:justify-between">
    <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
      <div class="flex min-w-0 items-center gap-(--spacing-xs)">
        <h1 class="text-balance text-heading-sm text-(--text-default)">Workloads</h1>
      </div>
      <p class="text-pretty text-body-sm text-(--text-muted)">View and manage your workloads.</p>
    </div>
    <div class="flex w-full flex-wrap items-center gap-(--spacing-sm) md:w-auto md:shrink-0 md:flex-nowrap">
      <Button
        label="Documentation"
        icon="pi pi-book"
        kind="outlined"
        size="medium"
        href="${DOCS_HREF}"
        target="_blank"
        class="w-full md:w-auto"
      />
      <Button label="Create Workload" icon="pi pi-plus" kind="outlined" size="medium" class="w-full md:w-auto" />
    </div>
  </header>

  <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
    <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
      <header class="flex items-center gap-(--layout-group-gap)">
        <div class="flex min-w-0 grow items-center gap-(--spacing-xs)">
          <Button label="Filter" kind="outlined" size="medium" icon="pi pi-filter" />
          <InputText
            v-model="search"
            size="medium"
            placeholder="Search workloads"
            aria-label="Search workloads"
            class="min-w-36 grow basis-(--container-2xs)"
          >
            <template #iconLeft>
              <i class="pi pi-search" aria-hidden="true" />
            </template>
          </InputText>
        </div>
        <div class="flex shrink-0 items-center gap-(--spacing-xs)">
          <Tooltip text="Refresh" class="shrink-0">
            <IconButton icon="pi pi-refresh" kind="outlined" size="medium" aria-label="Refresh" />
          </Tooltip>
          <Tooltip text="Download CSV" class="shrink-0">
            <IconButton icon="pi pi-download" kind="outlined" size="medium" aria-label="Download CSV" />
          </Tooltip>
          <Tooltip text="Columns">
            <IconButton icon="ai ai-column" kind="outlined" size="medium" aria-label="Columns" />
          </Tooltip>
        </div>
      </header>

      <section class="flex min-h-0 flex-col">
        <CardBox :padded="false">
          <template #content>
            <div class="flex min-h-(--container-3xs) items-center justify-center text-body-sm text-(--text-muted)">
              Table
            </div>
          </template>
        </CardBox>
      </section>
    </section>
  </section>
</main>`

const DETAIL_MAIN = `<main class="flex h-full flex-col">
${indent(pageTabs('<Button label="Deploy" kind="outlined" size="medium" icon="pi pi-cloud-upload" />'))}

  <section class="min-h-0 flex-1 overflow-auto">
    <div class="layout-column layout-boundary flex min-w-0 flex-col">
      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
        <CardBox :padded="false">
          <template #content>
            <div class="flex min-h-(--container-3xs) items-center justify-center text-body-sm text-(--text-muted)">
              Page content
            </div>
          </template>
        </CardBox>
      </section>
    </div>
  </section>
</main>`

const LIST_TEMPLATE = shell({
  withBreadcrumb: false,
  main: pageScroll(LIST_MAIN, 'overflow-auto layout-boundary')
})

const DETAIL_TEMPLATE = shell({
  withBreadcrumb: true,
  crumb: ENVIRONMENT_CRUMB,
  main: pageScroll(DETAIL_MAIN)
})

const LIST_SCRIPT = scriptLines({
  parts: ['CardBox', 'InputText'],
  declarations: [],
  state: ["const search = ref('')"]
})

const DETAIL_SCRIPT = scriptLines({
  parts: ['Breadcrumb', 'CardBox', 'TabView', ...ENVIRONMENT_CRUMB_PARTS],
  declarations: [...ENVIRONMENT_CRUMB_DECLARATIONS, '', declare('tabs', WORKLOAD_TABS)],
  state: ["const activeTab = ref('overview')", ...ENVIRONMENT_CRUMB_STATE]
})

const components = {
  ...SHELL_COMPONENTS,
  ...ENVIRONMENT_CRUMB_COMPONENTS,
  Button,
  CardBox,
  IconButton,
  InputText,
  TabView,
  'TabView.List': TabView.List,
  'TabView.Item': TabView.Item,
  Tooltip
}

const meta = {
  title: 'Templates/Platform/Shell/PlatformShell',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The console’s application shell, as AppLayout and AppSidebar render it: a full-height navigation rail on the left that the user resizes by its edge and collapses from its foot (the Azion mark, the ⌘K palette with its Recents, navigation, Actions and Account groups, the navigation Menu, and the account menu with the theme switch, the Upgrade to Pro action and the system status at its foot) and a content zone on the right whose global header carries the breadcrumb from the second level on, the search affordance, the Create button, the Agent button and the account avatar. The search is a 32px field-shaped button while the bar’s content box is at least `--container-2xl` (752px) wide and an outlined IconButton below it; below `md` the rail becomes a Drawer opened from the hamburger that leads the mark. Every signed-in console screen renders it, from the Workloads and Applications lists to a workload’s Overview, Deployments and Settings tabs, the module overviews and Home. Built from `Sidebar`, `Brand`, `Menu`, `CommandMenu`, `Dropdown`, `ThemeSwitcher`, `StatusIndicator`, `Avatar`, `GlobalHeader`, `Breadcrumb`, `Button`, `ButtonHighlight`, `IconButton`, `Tooltip`, `Kbd`, `Drawer` and, per page, `TabView`, `Select`, `Tag`, `InputText` and `CardBox`; the page bodies here are stand-ins, the real ones are the ModuleList, SummaryPage and ModuleOverview templates.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const ListPage = {
  render: () => ({
    components,
    setup: () => ({ ...shellState(), search: ref('') }),
    template: LIST_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'A first-level resource list: no breadcrumb in the bar (the crumb starts at the second level), the medium page heading with its Documentation link and the outlined Create Workload action at the medium size, the list controls row, and a flush CardBox where the table goes.'
      },
      source: { code: toSfc(LIST_SCRIPT, LIST_TEMPLATE) }
    }
  }
}

export const DetailPage = {
  render: () => ({
    components,
    setup: () => ({
      ...shellState(),
      ...environmentCrumbState(),
      tabs: WORKLOAD_TABS,
      activeTab: ref('overview')
    }),
    template: DETAIL_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'A workload detail page: the breadcrumb reads Workloads, the workload, then its environment, whose last crumb is a Select that searches the workload’s environments, tags each with its deployment policy and offers Add Environment at its foot; a full-bleed TabView bar under the header carries the Overview, Deployments and Settings tabs with the outlined Deploy action, and the content scrolls beneath it.'
      },
      source: { code: toSfc(DETAIL_SCRIPT, DETAIL_TEMPLATE) }
    }
  }
}
