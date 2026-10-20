import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import IconButton from '@aziontech/webkit/icon-button'
import InputText from '@aziontech/webkit/input-text'
import TabView from '@aziontech/webkit/tab-view'
import Tooltip from '@aziontech/webkit/tooltip'
import { ref } from 'vue'

import { toSfc } from '../../_shared/story-source'
import {
  BREADCRUMB,
  declare,
  DOCS_HREF,
  scriptLines,
  shell,
  SHELL_COMPONENTS,
  shellState
} from './_shell-markup'

const LIST_MAIN = `<div class="layout-boundary min-h-0 flex-1 overflow-auto animate-page-enter motion-reduce:animate-none">
  <main class="layout-column flex min-h-full flex-col">
    <header class="flex flex-col gap-(--spacing-md) md:flex-row md:items-start md:justify-between">
      <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
        <h1 class="text-balance text-heading-sm text-(--text-default)">Workloads</h1>
        <p class="text-pretty text-body-sm text-(--text-muted)">View and manage your workloads.</p>
      </div>
      <div class="flex w-full flex-wrap items-center gap-(--spacing-sm) md:w-auto md:shrink-0 md:flex-nowrap">
        <div class="grid w-full md:w-auto">
          <Button label="Documentation" icon="pi pi-book" kind="outlined" size="large" href="${DOCS_HREF}" target="_blank" />
        </div>
        <div class="grid w-full md:w-auto">
          <Button label="Create Workload" icon="pi pi-plus" kind="outlined" size="large" />
        </div>
      </div>
    </header>

    <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
      <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
        <header class="flex items-center gap-(--layout-group-gap)">
          <div class="flex min-w-0 grow items-center gap-(--spacing-xs)">
            <Button label="Filter" kind="outlined" size="medium" icon="pi pi-filter" />
            <div class="min-w-36 grow basis-(--container-2xs)">
              <InputText v-model="search" size="medium" placeholder="Search workloads" aria-label="Search workloads">
                <template #iconLeft>
                  <i class="pi pi-search" aria-hidden="true" />
                </template>
              </InputText>
            </div>
          </div>
          <div class="flex shrink-0 items-center gap-(--spacing-xs)">
            <Tooltip text="Refresh">
              <IconButton icon="pi pi-refresh" aria-label="Refresh" kind="outlined" size="medium" />
            </Tooltip>
            <Tooltip text="Download CSV">
              <IconButton icon="pi pi-download" aria-label="Download CSV" kind="outlined" size="medium" />
            </Tooltip>
            <Tooltip text="Columns">
              <IconButton icon="ai ai-column" aria-label="Columns" kind="outlined" size="medium" />
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
  </main>
</div>`

const DETAIL_MAIN = `<div class="min-h-0 flex-1 overflow-auto animate-page-enter motion-reduce:animate-none">
  <main class="flex h-full flex-col">
    <div class="border-b border-(--border-default)">
      <div class="layout-boundary-inline flex items-center gap-(--spacing-sm) py-(--spacing-sm)">
        <div class="-ml-(--spacing-xs) min-w-0 flex-1">
          <TabView v-model:value="activeTab">
            <TabView.List>
              <TabView.Item value="overview" label="Overview" />
              <TabView.Item value="deployments" label="Deployments" />
              <TabView.Item value="settings" label="Settings" />
            </TabView.List>
          </TabView>
        </div>
        <div class="flex min-h-8 shrink-0 items-center gap-(--spacing-xs)">
          <Button label="Deploy" kind="primary" size="medium" icon="pi pi-cloud-upload" />
        </div>
      </div>
    </div>

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
  </main>
</div>`

const LIST_TEMPLATE = shell({ withBreadcrumb: false, main: LIST_MAIN })
const DETAIL_TEMPLATE = shell({ withBreadcrumb: true, main: DETAIL_MAIN })

const LIST_SCRIPT = scriptLines({
  parts: ['CardBox', 'InputText'],
  declarations: [],
  state: ["const search = ref('')"]
})

const DETAIL_SCRIPT = scriptLines({
  parts: ['Breadcrumb', 'CardBox', 'TabView'],
  declarations: ['', declare('breadcrumb', BREADCRUMB)],
  state: ["const activeTab = ref('overview')"]
})

const components = {
  ...SHELL_COMPONENTS,
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
          'The console’s application shell: a full-height navigation rail on the left that the user resizes by its edge and collapses from its foot, as the console’s AppSidebar does (the Azion mark, the ⌘K palette, the navigation groups and the account menu with the theme switch at its foot) and a content zone on the right whose global header carries the breadcrumb from the second level on, the search affordance, the Create button, the Agent button and the account avatar; below `md` the rail becomes a Drawer opened from the hamburger that leads the mark. Every signed-in console screen renders it, from the Workloads and Applications lists to a workload’s Overview, Deployments and Settings tabs. Built from `Sidebar`, `Brand`, `Menu`, `CommandMenu`, `Dropdown`, `ThemeSwitcher`, `StatusIndicator`, `Avatar`, `GlobalHeader`, `Breadcrumb`, `Button`, `ButtonHighlight`, `IconButton`, `Tooltip`, `Kbd`, `Drawer` and, per page, `TabView`, `InputText` and `CardBox`.'
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
          'A first-level resource list: no breadcrumb in the bar, a page heading with its Documentation link and the outlined Create Workload action, the list controls row, and a flush CardBox where the table goes.'
      },
      source: { code: toSfc(LIST_SCRIPT, LIST_TEMPLATE) }
    }
  }
}

export const DetailPage = {
  render: () => ({
    components,
    setup: () => ({ ...shellState(), breadcrumb: BREADCRUMB, activeTab: ref('overview') }),
    template: DETAIL_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'A second-level resource page: the breadcrumb names the module and the resource, a full-bleed TabView bar under the header carries the Overview, Deployments and Settings tabs with the primary Deploy action, and the content scrolls beneath it.'
      },
      source: { code: toSfc(DETAIL_SCRIPT, DETAIL_TEMPLATE) }
    }
  }
}
