<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import DataTable, { type TableColumn } from '@aziontech/webkit/data-table'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import Link from '@aziontech/webkit/link'
  import StatTile from '@aziontech/webkit/stat-tile'
  import Table from '@aziontech/webkit/table'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref } from 'vue'

  type Operation = 'Created' | 'Edited' | 'Deleted'

  interface ZoneRow {
    id: string
    name: string
    domain: string
    status: 'Active' | 'Inactive'
    author: string
    modifiedAt: string
  }

  interface ActivityRow {
    id: string
    date: string
    operation: Operation
    type: string
    resource: string
    email: string
  }

  interface Template {
    id: string
    name: string
    icon: string
    description: string
    vendor: string
    version: string
  }

  const metrics = [
    {
      id: 'data-transferred',
      label: 'Data transferred',
      value: 842,
      unit: 'GB',
      hint: 'Total bytes delivered across all your resources.'
    },
    {
      id: 'requests-per-second',
      label: 'Requests per second',
      value: 1240,
      unit: '/s',
      hint: 'Average requests handled per second in the selected window.'
    },
    {
      id: 'bandwidth-saving',
      label: 'Bandwidth saving',
      value: 588,
      unit: 'GB',
      hint: 'Bytes served from cache instead of your origin.'
    },
    {
      id: 'data-offload',
      label: 'Data offload',
      value: 70,
      unit: '%',
      hint: 'Share of traffic served from cache instead of your origin.'
    }
  ]

  const metricsRange = 'Jul 14, 2026, 6:56 PM – Jul 14, 2026, 7:56 PM UTC'

  const zones: ZoneRow[] = [
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

  const zoneColumns: TableColumn[] = [
    { id: 'name', accessorKey: 'name', header: 'Zone name', principal: true, hideable: false },
    { id: 'domain', accessorKey: 'domain', header: 'Domain', grow: 2 },
    { id: 'status', accessorKey: 'status', header: 'Status', minWidth: 112 },
    { id: 'lastModified', accessorKey: 'modifiedAt', header: 'Last modified', minWidth: 184 },
    { id: 'actions', type: 'action', hideable: false }
  ]

  const activity: ActivityRow[] = [
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

  const activityColumns: TableColumn[] = [
    { id: 'date', accessorKey: 'date', header: 'Date', principal: true, hideable: false },
    { id: 'operation', accessorKey: 'operation', header: 'Operation', minWidth: 120 },
    { id: 'type', accessorKey: 'type', header: 'Type' },
    { id: 'resource', accessorKey: 'resource', header: 'Resource', grow: 2 },
    { id: 'email', accessorKey: 'email', header: 'Author email', minWidth: 184 }
  ]

  const operationSeverity: Record<Operation, TagSeverity | null> = {
    Created: 'success',
    Deleted: 'danger',
    Edited: null
  }

  const monthlyUsage = [
    { id: 'dns-zones', label: 'DNS zones', value: '2' },
    { id: 'applications', label: 'Applications', value: '5' },
    { id: 'functions', label: 'Function invocations', value: '1.2M' }
  ]

  const templates: Template[] = [
    {
      id: 'jwt',
      name: 'JWT',
      icon: 'ai ai-key',
      description:
        'Streamline authentication by processing and validating JSON Web Tokens (JWTs) before a request reaches your origin.',
      vendor: 'Acme',
      version: '1.1.0'
    },
    {
      id: 'image-optimizer',
      name: 'Image optimizer',
      icon: 'ai ai-image',
      description: 'Resize, crop and convert images on request, and cache every variant.',
      vendor: 'Acme',
      version: '2.4.0'
    },
    {
      id: 'bot-detection',
      name: 'Bot detection',
      icon: 'ai ai-shield',
      description: 'Score each request and block automated traffic before it costs you capacity.',
      vendor: 'Acme',
      version: '0.9.2'
    }
  ]

  const templateIndex = ref(0)
  const featured = computed(() => templates[templateIndex.value] ?? templates[0])

  const stepTemplate = (delta: number) => {
    templateIndex.value = (templateIndex.value + delta + templates.length) % templates.length
  }

  const onZoneAction = (value: string | number, row: ZoneRow) => {
    const labels: Record<string, string> = {
      view: 'Opening',
      edit: 'Editing',
      delete: 'Deleting'
    }
    toast.info(`${labels[String(value)] ?? 'Opening'} ${row.name}.`, {
      description: `Zone ID ${row.id}`
    })
  }
</script>

<template>
  <div class="layout-boundary">
    <div
      class="layout-column flex min-w-0 flex-col gap-(--layout-section-gap) xl:flex-row xl:items-start"
    >
      <div class="flex min-w-0 flex-1 flex-col gap-(--layout-section-gap)">
        <section
          aria-labelledby="summary-metrics"
          class="flex min-w-0 flex-col gap-(--layout-group-gap)"
        >
          <div class="flex items-center gap-(--spacing-xs)">
            <h2
              id="summary-metrics"
              class="text-heading-xs text-(--text-default)"
            >
              Metrics
            </h2>
            <Hint
              content="Traffic across every resource in the last hour, refreshed each minute."
            />
          </div>

          <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 xl:grid-cols-4">
            <li
              v-for="metric in metrics"
              :key="metric.id"
              class="flex min-w-0 flex-col"
            >
              <StatTile
                :label="metric.label"
                :value="metric.value"
                :unit="metric.unit"
              >
                <template #aside>
                  <Hint :content="metric.hint" />
                </template>
              </StatTile>
            </li>
          </ul>

          <p class="text-end text-body-2xs text-pretty text-(--text-muted)">
            {{ metricsRange }}
          </p>
        </section>

        <section
          aria-labelledby="summary-resources"
          class="flex min-w-0 flex-col gap-(--layout-group-gap)"
        >
          <div class="flex items-center gap-(--spacing-xs)">
            <h2
              id="summary-resources"
              class="text-heading-xs text-(--text-default)"
            >
              Resources
            </h2>
            <Hint content="The DNS zones you changed most recently." />
          </div>

          <Card :padded="false">
            <template #default>
              <DataTable
                :data="zones"
                :columns="zoneColumns"
                row-key="id"
                density="compact"
                :bordered="false"
              >
                <template #cell-domain="{ row }">
                  <Table.CellLink
                    :label="row.domain"
                    :href="`https://${row.domain}`"
                    copyable
                  />
                </template>
                <template #cell-status="{ value }">
                  <Tag
                    :label="value"
                    :severity="value === 'Active' ? 'success' : 'neutral'"
                    size="small"
                  />
                </template>
                <template #cell-lastModified="{ row }">
                  <Table.CellTime
                    :value="row.modifiedAt"
                    :author="row.author"
                  />
                </template>
                <template #cell-actions="{ row }">
                  <Table.CellActions
                    :name="row.name"
                    @select="(_event, value) => onZoneAction(value, row)"
                  >
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        value="view"
                        label="View details"
                      />
                      <DropdownMenuItem
                        value="edit"
                        label="Edit"
                      />
                    </DropdownMenuGroup>
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        value="delete"
                        label="Delete"
                      />
                    </DropdownMenuGroup>
                  </Table.CellActions>
                </template>
              </DataTable>
            </template>
            <template #footer>
              <Link
                label="View all DNS zones"
                size="medium"
                href="#"
              />
            </template>
          </Card>
        </section>

        <section
          aria-labelledby="summary-activity"
          class="flex min-w-0 flex-col gap-(--layout-group-gap)"
        >
          <h2
            id="summary-activity"
            class="text-heading-xs text-(--text-default)"
          >
            Recent activity
          </h2>

          <Card :padded="false">
            <template #default>
              <DataTable
                :data="activity"
                :columns="activityColumns"
                row-key="id"
                density="compact"
                :bordered="false"
              >
                <template #cell-date="{ value }">
                  <span class="min-w-0 truncate tabular-nums">{{ value }}</span>
                </template>
                <template #cell-operation="{ row }">
                  <Tag
                    v-if="operationSeverity[row.operation]"
                    :label="row.operation"
                    :severity="operationSeverity[row.operation] ?? undefined"
                    size="small"
                  />
                  <span
                    v-else
                    class="text-(--text-default)"
                    >{{ row.operation }}</span
                  >
                </template>
              </DataTable>
            </template>
            <template #footer>
              <Link
                label="View all activity"
                size="medium"
                href="#"
              />
            </template>
          </Card>
        </section>
      </div>

      <aside
        aria-label="Usage and marketplace"
        class="flex w-full min-w-0 flex-col gap-(--layout-section-gap) xl:max-w-(--container-xs) xl:shrink-0"
      >
        <Card title="Monthly usage">
          <template #default>
            <dl class="flex flex-col gap-(--spacing-sm)">
              <div
                v-for="usage in monthlyUsage"
                :key="usage.id"
                class="flex items-center justify-between gap-(--spacing-md)"
              >
                <dt class="min-w-0 truncate text-body-sm text-(--text-muted)">
                  {{ usage.label }}
                </dt>
                <dd class="m-0 shrink-0 text-label-sm tabular-nums text-(--text-default)">
                  {{ usage.value }}
                </dd>
              </div>
            </dl>
          </template>
          <template #footer>
            <Link
              label="View all usage"
              size="medium"
              href="#"
            />
          </template>
        </Card>

        <Card title="Marketplace trends">
          <template #default>
            <article
              :key="featured.id"
              :aria-label="`${featured.name}, template ${templateIndex + 1} of ${templates.length}`"
              class="flex min-w-0 flex-col gap-(--spacing-sm)"
            >
              <div class="flex min-w-0 items-center gap-(--spacing-sm)">
                <span
                  class="flex size-6 shrink-0 items-center justify-center rounded-(--shape-control) bg-(--bg-surface-raised) text-(--primary)"
                >
                  <i
                    :class="featured.icon"
                    class="text-body-sm"
                    aria-hidden="true"
                  />
                </span>
                <Link
                  :label="featured.name"
                  size="medium"
                  href="#"
                />
              </div>
              <p class="text-body-xs text-pretty text-(--text-muted)">
                {{ featured.description }}
              </p>
              <p class="flex items-center gap-(--spacing-md) text-body-2xs text-(--text-muted)">
                <span>
                  By
                  <span class="text-(--text-default)">{{ featured.vendor }}</span>
                </span>
                <span>
                  Version
                  <span class="tabular-nums text-(--text-default)">{{ featured.version }}</span>
                </span>
              </p>
            </article>
          </template>
          <template #footer>
            <div class="flex items-center gap-(--spacing-sm)">
              <Tooltip content="Previous template">
                <IconButton
                  icon="ai ai-chevron-left"
                  variant="ghost"
                  size="small"
                  aria-label="Previous template"
                  @click="stepTemplate(-1)"
                />
              </Tooltip>
              <div
                class="flex items-center gap-(--spacing-xs)"
                aria-hidden="true"
              >
                <span
                  v-for="(template, index) in templates"
                  :key="template.id"
                  :data-active="index === templateIndex || null"
                  class="size-2 rounded-full bg-(--border-default) transition-colors duration-fast-02 ease-productive-entrance data-active:bg-(--text-default) motion-reduce:transition-none"
                />
              </div>
              <Tooltip content="Next template">
                <IconButton
                  icon="ai ai-chevron-right"
                  variant="ghost"
                  size="small"
                  aria-label="Next template"
                  @click="stepTemplate(1)"
                />
              </Tooltip>
              <span
                class="sr-only"
                aria-live="polite"
                >Template {{ templateIndex + 1 }} of {{ templates.length }}:
                {{ featured.name }}</span
              >
            </div>
          </template>
        </Card>
      </aside>
    </div>
  </div>
</template>
