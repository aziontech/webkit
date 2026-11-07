import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import { componentsFor, page, RELATIVE_TIME, runScript, scriptOf } from './_observe-markup'

const BODY = `const metrics = [
  {
    label: 'Total Data Transferred',
    value: '0',
    unit: 'Bytes',
    hint: 'Total bytes delivered across all your applications.'
  },
  {
    label: 'Requests per Second',
    value: '0',
    unit: '/s',
    hint: 'Average requests handled per second in the selected window.'
  },
  {
    label: 'Bandwidth Saving',
    value: '0',
    unit: 'Bytes/s',
    hint: 'Bytes served from cache instead of your origin.'
  },
  {
    label: 'Data Transf. Offload',
    value: '0',
    unit: '',
    hint: 'Share of traffic offloaded from your origin to the edge.'
  }
]

const metricsRange = 'Jul 14, 2026, 06:56:46 PM - Jul 14, 2026, 07:56:46 PM'

const resources = [
  {
    id: 'zone-1',
    zoneName: 'aasdasdasdas',
    domain: 'r72xyxc3d9.azion.run',
    status: 'Active',
    author: 'Robson Junior',
    authorAvatar: '',
    lastModified: 'July 18, 2026, 09:12:00 AM'
  },
  {
    id: 'zone-2',
    zoneName: 'MyFunction',
    domain: 'domain.com',
    status: 'Active',
    author: 'Isaque Böck',
    authorAvatar: '',
    lastModified: 'July 20, 2026, 08:30:00 AM'
  }
]

const resourceColumns = [
  { accessorKey: 'zoneName', header: 'Zone Name', principal: true, hideable: false },
  { accessorKey: 'domain', header: 'Domain', grow: 2 },
  { accessorKey: 'status', header: 'Status', minWidth: 104 },
  { accessorKey: 'lastModified', header: 'Last Modified', minWidth: 80 },
  { id: 'actions', kind: 'action', hideable: false }
]

const activity = [
  {
    id: 'act-1',
    date: 'Jul 13, 2026, 01:52:58 PM',
    operation: 'Created',
    type: 'User Login',
    resource: 'User Login 11108 - Gabriel Lisboa',
    email: 'gabriel.mendonca@azion.com'
  },
  {
    id: 'act-2',
    date: 'Jun 30, 2026, 06:54:59 PM',
    operation: 'Deleted',
    type: 'Dns Zone',
    resource: 'Dns Zone extat.com',
    email: 'gabriel.mendonca@azion.com'
  },
  {
    id: 'act-3',
    date: 'Jun 30, 2026, 06:54:30 PM',
    operation: 'Created',
    type: 'Dns Zone',
    resource: 'Dns Zone extat.com',
    email: 'gabriel.mendonca@azion.com'
  },
  {
    id: 'act-4',
    date: 'Jun 30, 2026, 06:53:15 PM',
    operation: 'Created',
    type: 'User Login',
    resource: 'User Login 11108 - Gabriel Lisboa',
    email: 'gabriel.mendonca@azion.com'
  },
  {
    id: 'act-5',
    date: 'Jun 24, 2026, 01:55:58 AM',
    operation: 'Edited',
    type: 'Application Response Rule',
    resource: 'Application Response Rule Set Storage Origin for App',
    email: 'gabriel.mendonca@azion.com'
  }
]

const activityColumns = [
  { accessorKey: 'date', header: 'Date', principal: true, hideable: false },
  { accessorKey: 'operation', header: 'Operation', minWidth: 136 },
  { accessorKey: 'type', header: 'Type' },
  { accessorKey: 'resource', header: 'Resource', grow: 2 },
  { accessorKey: 'email', header: 'Author email', minWidth: 80 }
]

const operationSeverity = (operation) => {
  if (operation === 'Created') return 'success'
  if (operation === 'Deleted') return 'danger'
  return null
}

const monthlyUsage = [{ label: 'Edge DNS DNS - Zones', value: '2' }]

const featuredTemplate = {
  name: 'JWT',
  description: 'Streamline authentication by processing and validating JSON Web Tokens (JWTs).',
  author: 'Azion',
  version: '1.1.0'
}

${RELATIVE_TIME}`

const sectionTitle = (title, about) =>
  about
    ? `<div class="flex items-center gap-(--spacing-xs)">
  <h2 class="text-heading-xs text-(--text-default)">${title}</h2>
  <IconButton icon="pi pi-question-circle" kind="transparent" size="small" aria-label="${about}" />
</div>`
    : `<h2 class="text-heading-xs text-(--text-default)">${title}</h2>`

const viewAll = (label) => `<template #footer>
  <Link label="${label}" size="medium" :show-icon="false" href="#" />
</template>`

const METRICS = `<section class="flex flex-col gap-(--layout-group-gap)">
${indent(sectionTitle('Metrics', 'About metrics'))}

  <div class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 xl:grid-cols-4">
    <CardBox v-for="metric in metrics" :key="metric.label">
      <template #content>
        <div class="flex flex-col gap-(--spacing-md)">
          <div class="flex items-center gap-(--spacing-xs)">
            <span class="min-w-0 truncate text-label-sm text-(--text-default)">
              {{ metric.label }}
            </span>
            <Tooltip :text="metric.hint">
              <i class="pi pi-info-circle text-body-sm text-(--text-muted)" aria-hidden="true" />
            </Tooltip>
          </div>
          <div class="flex items-baseline gap-(--spacing-xxs)">
            <span class="text-big-number-sm tabular-nums text-(--text-default)">
              {{ metric.value }}
            </span>
            <span v-if="metric.unit" class="text-body-xs text-(--text-muted)">
              {{ metric.unit }}
            </span>
          </div>
        </div>
      </template>
    </CardBox>
  </div>

  <p class="text-pretty text-right text-body-xxs text-(--text-muted)">
    {{ metricsRange }}
  </p>
</section>`

const RESOURCES = `<section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
${indent(sectionTitle('Resources', 'About resources'))}

  <CardBox :padded="false">
    <template #content>
      <TableRoot :data="resources" :columns="resourceColumns" row-key="id">
        <template #cell-domain="{ value }">
          <div class="flex w-full min-w-0 items-center gap-(--spacing-xs)">
            <Tooltip :text="'Open ' + value + ' in a new tab'" class="min-w-0 shrink!">
              <a
                :href="'https://' + value"
                target="_blank"
                rel="noopener noreferrer"
                data-link="true"
                class="group/link data-link:cursor-pointer inline-flex min-w-0 items-center gap-(--spacing-xxs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                @click.stop
              >
                <span class="truncate underline-offset-2 group-hover/link:underline">
                  {{ value }}
                </span>
                <span class="sr-only">{{ ' (opens in a new tab)' }}</span>
                <i class="pi pi-external-link shrink-0 text-body-xs leading-none" aria-hidden="true" />
              </a>
            </Tooltip>
            <CopyButton kind="outlined" :value="value" aria-label="Copy domain name" class="ml-auto shrink-0" />
          </div>
        </template>
        <template #cell-status="{ value }">
          <Tag :label="value" :severity="value === 'Active' ? 'success' : 'secondary'" size="medium" />
        </template>
        <template #cell-lastModified="{ value, row }">
          <div class="flex min-w-0 items-center gap-(--spacing-xs)">
            <Tooltip :text="row.author">
              <Avatar
                :src="row.authorAvatar || undefined"
                :alt="row.author"
                :label="row.author"
                size="small"
                kind="square"
              />
            </Tooltip>
            <span class="truncate text-body-sm text-(--text-muted)">{{ relativeTime(value) }}</span>
          </div>
        </template>
        <template #cell-actions>
          <Tooltip text="Zone actions">
            <IconButton icon="pi pi-ellipsis-h" kind="transparent" size="small" aria-label="Zone actions" />
          </Tooltip>
        </template>
      </TableRoot>
    </template>
${indent(viewAll('View all Edge DNS'), 2)}
  </CardBox>
</section>`

const ACTIVITY = `<section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
${indent(sectionTitle('Recent Activity'))}

  <CardBox :padded="false">
    <template #content>
      <TableRoot :data="activity" :columns="activityColumns" row-key="id">
        <template #cell-operation="{ value }">
          <Tag v-if="operationSeverity(value)" :label="value" :severity="operationSeverity(value)" size="small" />
          <span v-else class="text-(--text-default)">{{ value }}</span>
        </template>
      </TableRoot>
    </template>
${indent(viewAll('View all Activity'), 2)}
  </CardBox>
</section>`

const ASIDE = `<aside class="flex w-full flex-col xl:max-w-(--container-xs) xl:shrink-0">
  <CardBox>
    <template #header>
      <h2 class="text-heading-xs text-(--text-default)">Monthly Usage</h2>
    </template>
    <template #content>
      <ul class="flex flex-col gap-(--spacing-sm)">
        <li v-for="usage in monthlyUsage" :key="usage.label" class="flex items-center justify-between gap-(--spacing-md)">
          <span class="min-w-0 truncate text-body-sm text-(--text-muted)">
            {{ usage.label }}
          </span>
          <span class="shrink-0 text-label-sm tabular-nums text-(--text-default)">
            {{ usage.value }}
          </span>
        </li>
      </ul>
    </template>
${indent(viewAll('View all Usage'), 2)}
  </CardBox>

  <CardBox class="layout-section-start">
    <template #header>
      <h2 class="text-heading-xs text-(--text-default)">Marketplace Trends</h2>
    </template>
    <template #content>
      <article class="flex flex-col gap-(--spacing-sm)">
        <div class="flex items-center gap-(--spacing-sm)">
          <span class="flex size-6 shrink-0 items-center justify-center rounded-(--shape-elements) bg-(--bg-surface-raised) text-(--primary)">
            <i class="ai ai-marketplace text-body-sm" aria-hidden="true" />
          </span>
          <Link :label="featuredTemplate.name" size="medium" :show-icon="false" href="#" />
        </div>
        <p class="text-pretty text-body-xs text-(--text-muted)">
          {{ featuredTemplate.description }}
        </p>
        <p class="flex items-center gap-(--spacing-md) text-body-xxs text-(--text-muted)">
          <span>
            By
            <span class="text-(--text-default)">{{ featuredTemplate.author }}</span>
          </span>
          <span>
            Version
            <span class="text-(--text-default)">{{ featuredTemplate.version }}</span>
          </span>
        </p>
      </article>
    </template>
    <template #footer>
      <div class="flex items-center gap-(--spacing-sm)">
        <IconButton icon="pi pi-chevron-left" kind="transparent" size="small" aria-label="Previous trend" />
        <div class="flex items-center gap-(--spacing-xs)">
          <span class="size-2 rounded-full bg-(--text-default)" />
          <span class="size-2 rounded-full bg-(--border-default)" />
          <span class="size-2 rounded-full bg-(--border-default)" />
        </div>
        <IconButton icon="pi pi-chevron-right" kind="transparent" size="small" aria-label="Next trend" />
      </div>
    </template>
  </CardBox>
</aside>`

const MARKUP =
  page(`<main class="layout-column flex flex-col gap-(--layout-boundary-start) xl:flex-row xl:items-start xl:gap-(--layout-section-gap)">
  <div class="flex min-w-0 flex-1 flex-col">
${indent(METRICS, 2)}

${indent(RESOURCES, 2)}

${indent(ACTIVITY, 2)}
  </div>

${indent(ASIDE)}
</main>`)

const meta = {
  title: 'Templates/Platform/Observe/Dashboard',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The account dashboard as the console renders it at /dashboard, under the Overview entry: a main column with the Metrics strip (four CardBox tiles, each label beside an info glyph whose Tooltip holds the hint, the value in the big-number type over its unit) and its time window, the Resources table of DNS zones (the domain as an external link with a copy button, a Status Tag, the editor’s Avatar with the relative time, and a zone actions IconButton), and the Recent Activity table with Created and Deleted as Tags; each table card ends in a View all Link. Beside it from the xl breakpoint, and below it under that, the Monthly Usage card and the Marketplace Trends card with its featured template and pager. Built from `CardBox`, `IconButton`, `Tooltip`, `TableRoot`, `Tag`, `CopyButton`, `Avatar` and `Link`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components: componentsFor(MARKUP),
    setup: () => runScript(BODY),
    template: MARKUP
  }),
  parameters: {
    docs: {
      description: {
        story:
          'A new account’s dashboard: zeroed metrics, two DNS zones, the five latest account events, one usage line and the JWT template featured.'
      },
      source: { code: toSfc(scriptOf(MARKUP, BODY), MARKUP) }
    }
  }
}
