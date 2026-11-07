import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import TableRoot from '@aziontech/webkit/table-root'
import Tooltip from '@aziontech/webkit/tooltip'

import { toSfc } from '../../_shared/story-source'
import {
  declare,
  mergeScripts,
  pageScroll,
  scriptLines,
  shell,
  SHELL_COMPONENTS,
  shellState
} from './_shell-markup'

const ACTIVE = 'workloads'

const STRIP = [
  { label: 'Active workloads', value: '25', hint: 'Active workloads in this account.' },
  { label: 'Requests', value: '2.4M', hint: 'Requests served in the last 24 hours.' },
  { label: 'Data transferred', value: '318 GB', hint: 'Egress in the last 24 hours.' },
  { label: 'Error rate', value: '0.12%', hint: '5xx responses in the last 24 hours.' }
]

const RECENT = [
  {
    key: 'workloads/1020655',
    name: 'workload_01',
    subtitle: 'my-workload-1.azion.run',
    icon: 'ai ai-workloads',
    type: 'Workload',
    modified: 'Nov 6, 2026'
  },
  {
    key: 'domains/domain-1020655',
    name: 'my-workload-1.azion.run',
    subtitle: 'Served by workload_01',
    icon: 'ai ai-domains',
    type: 'Domain',
    modified: 'Nov 6, 2026'
  },
  {
    key: 'workloads/1031410003',
    name: 'azion-stage-preview',
    subtitle: '*-preview.azion.run',
    icon: 'ai ai-workloads',
    type: 'Workload',
    modified: 'Nov 4, 2026'
  },
  {
    key: 'domains/domain-1031410003',
    name: '*-preview.azion.run',
    subtitle: 'Served by azion-stage-preview',
    icon: 'ai ai-domains',
    type: 'Domain',
    modified: 'Nov 4, 2026'
  },
  {
    key: 'workloads/1031410001',
    name: 'azion-com-prod',
    subtitle: 'www.azion.com',
    icon: 'ai ai-workloads',
    type: 'Workload',
    modified: 'Nov 3, 2026'
  },
  {
    key: 'workloads/1031410002',
    name: 'azion-com-br-prod',
    subtitle: 'www.azion.com.br',
    icon: 'ai ai-workloads',
    type: 'Workload',
    modified: 'Nov 3, 2026'
  }
]

const COLUMNS = [
  { accessorKey: 'name', header: 'Name', principal: true, hideable: false },
  { accessorKey: 'type', header: 'Type', minWidth: 80 },
  { accessorKey: 'modified', header: 'Last Modified', minWidth: 80 }
]

const COLUMNS_LINES = [
  'const columns = [',
  "  { accessorKey: 'name', header: 'Name', principal: true, hideable: false },",
  "  { accessorKey: 'type', header: 'Type', minWidth: 80 },",
  "  { accessorKey: 'modified', header: 'Last Modified', minWidth: 80 }",
  ']'
]

const MAIN = `<main class="layout-column flex min-h-full flex-col">
  <header class="flex flex-col gap-(--spacing-md) md:flex-row md:items-start md:justify-between">
    <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
      <div class="flex min-w-0 items-center gap-(--spacing-xs)">
        <h1
          data-size="medium"
          class="text-balance text-(--text-default) data-[size=small]:text-heading-xs data-[size=medium]:text-heading-sm data-[size=large]:text-heading-lg"
        >
          Workloads
        </h1>
      </div>
      <p class="text-pretty text-body-sm text-(--text-muted)">How your workloads are serving traffic right now.</p>
    </div>
    <div class="flex w-full flex-wrap items-center gap-(--spacing-sm) md:w-auto md:shrink-0 md:flex-nowrap">
      <Button label="Create Workload" icon="pi pi-plus" kind="outlined" size="medium" class="w-full md:w-auto" />
    </div>
  </header>

  <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
    <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-4">
      <li v-for="metric in strip" :key="metric.label" class="grid">
        <CardBox>
          <template #content>
            <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
              <Tooltip :text="metric.hint">
                <span class="min-w-0 truncate text-body-sm text-(--text-muted)">
                  {{ metric.label }}
                </span>
              </Tooltip>
              <p class="text-heading-lg text-(--text-default)">{{ metric.value }}</p>
            </div>
          </template>
        </CardBox>
      </li>
    </ul>

    <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
      <div class="flex items-center justify-between gap-(--spacing-sm)">
        <h2 class="text-heading-xs text-(--text-default)">Recent</h2>
        <a
          href="/workloads"
          class="rounded-(--shape-button) px-(--spacing-xxs) text-label-sm text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
        >
          All Workloads
        </a>
      </div>

      <CardBox :padded="false">
        <template #content>
          <TableRoot :data="recent" :columns="columns" row-key="key" :border="false">
            <template #cell-name="{ row, value }">
              <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                <i :class="row.icon" class="shrink-0 text-body-lg text-(--text-muted)" aria-hidden="true" />
                <span class="truncate cursor-pointer hover:underline">{{ value }}</span>
                <span v-if="row.subtitle" class="hidden min-w-0 truncate text-body-sm text-(--text-muted) md:inline">
                  {{ row.subtitle }}
                </span>
              </div>
            </template>
          </TableRoot>
        </template>
      </CardBox>
    </section>
  </section>
</main>`

const TEMPLATE = shell({
  withBreadcrumb: false,
  main: pageScroll(MAIN, 'overflow-auto layout-boundary')
})

const PAGE_SCRIPT = [
  "import CardBox from '@aziontech/webkit/card-box'",
  "import TableRoot from '@aziontech/webkit/table-root'",
  '',
  declare('strip', STRIP),
  '',
  declare('recent', RECENT),
  '',
  ...COLUMNS_LINES
]

const components = {
  ...SHELL_COMPONENTS,
  Button,
  CardBox,
  TableRoot,
  Tooltip
}

const meta = {
  title: 'Templates/Platform/Shell/ModuleOverview',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'A product module’s overview page inside the console shell, as the console’s ModuleOverview renders it: the medium page heading with the module’s create action, a strip of four metric cards (the module’s resource count, then three usage figures for the last 24 hours, each label carrying its definition in a Tooltip), and a Recent band whose heading links to the full list over a flush table of the six most recently modified resources, each row led by its product glyph with the subtitle beside the name from `md` up. One block serves five routes with different data: `/workloads/overview` (Active workloads, Requests, Data transferred, Error rate, with each workload’s domains in Recent), `/applications/overview` (Applications, Requests, Cache hit ratio, Saved by cache), `/functions/overview` (Functions, Invocations, Error rate, Average duration), `/firewall/overview` (Firewalls, Blocked requests, WAF matches, Rate limited, with network lists in Recent) and `/object-storage/overview` (Buckets, Stored, Objects, Egress). A module with nothing recently modified shows a medium EmptyState in place of the table. Built from `CardBox`, `Tooltip`, `TableRoot` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components,
    setup: () => ({
      ...shellState(ACTIVE),
      strip: STRIP,
      recent: RECENT,
      columns: COLUMNS
    }),
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The Workloads overview: 25 active workloads, the 24-hour request, egress and error figures, and the recent workloads with the domains they serve.'
      },
      source: {
        code: toSfc(
          mergeScripts(
            scriptLines({ parts: ['Tooltip'], active: ACTIVE, declarations: [], state: [] }),
            PAGE_SCRIPT
          ),
          TEMPLATE
        )
      }
    }
  }
}
