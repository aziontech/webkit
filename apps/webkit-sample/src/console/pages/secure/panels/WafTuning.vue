<script setup lang="ts">
  import CardBox from '@aziontech/webkit/card-box'
  import EmptyState from '@aziontech/webkit/empty-state'
  import InputText from '@aziontech/webkit/input-text'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, ref } from 'vue'

  import ColumnsButton from '../../../components/list/ColumnsButton.vue'
  import ExportButton from '../../../components/list/ExportButton.vue'
  import RefreshButton from '../../../components/list/RefreshButton.vue'
  import ControlsHeader from '../../../components/page/ControlsHeader.vue'
  import HeadingAction from '../../../components/page/HeadingAction.vue'
  import PageHeading from '../../../components/page/PageHeading.vue'
  import { useListRefresh } from '../../../lib/behavior/list-state'
  import { FIT_COLUMN } from '../../../lib/behavior/table-columns'
  import { wafTuningFor } from '../../../lib/data/waf-rules'

  interface Props {
    ruleSet: Record<string, unknown>
    onCreateAllowed?: (...args: unknown[]) => unknown
  }

  const props = withDefaults(defineProps<Props>(), {
    onCreateAllowed: null
  })

  const rows = computed(() => wafTuningFor(props.ruleSet.id))

  const search = ref('')

  const { loading, refresh } = useListRefresh()

  const tableRef = ref(null)
  const columnVisibility = ref({})

  const rowSelection = ref({})
  const selected = computed(() => rows.value.filter((row) => rowSelection.value[row.ruleId]))

  const columns = [
    {
      accessorKey: 'ruleId',
      header: 'Rule ID',
      enableSorting: true,
      principal: true,
      hideable: false
    },
    { accessorKey: 'hits', header: 'Hits', enableSorting: true, minWidth: FIT_COLUMN },
    { accessorKey: 'ipCount', header: 'IPs', enableSorting: true, minWidth: FIT_COLUMN },
    { accessorKey: 'countryCount', header: 'Countries', enableSorting: true, minWidth: FIT_COLUMN },
    { accessorKey: 'pathCount', header: 'Paths', enableSorting: true, minWidth: FIT_COLUMN },
    { accessorKey: 'ips', header: 'Top 10 IP Addresses', grow: 3 },
    { accessorKey: 'countries', header: 'Top 10 Countries', grow: 2 },
    { accessorKey: 'paths', header: 'Top 10 Paths', grow: 3 }
  ]

  const formatHits = (value) => new Intl.NumberFormat('en-US').format(value)

  const createAllowed = () => {
    props.onCreateAllowed?.(selected.value)
    rowSelection.value = {}
  }

  const exportCsv = () => {
    toast.info(`Exporting ${selected.value.length} tuning rows.`, {
      description: 'The file is prepared and downloaded from the browser.'
    })
  }
</script>

<template>
  <div class="layout-column layout-boundary flex min-w-0 flex-col">
    <PageHeading
      title="Tuning"
      description="Requests this rule set matched, grouped by rule. Review them, then allow the ones that are legitimate."
      size="small"
    >
      <template #actions>
        <HeadingAction
          label="Export to CSV"
          kind="outlined"
          icon="pi pi-download"
          :disabled="!selected.length"
          @click="exportCsv"
        />
        <HeadingAction
          label="Add Allowed Rule"
          kind="outlined"
          icon="pi pi-plus"
          :disabled="!selected.length"
          @click="createAllowed"
        />
      </template>
    </PageHeading>

    <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
      <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
        <ControlsHeader v-if="rows.length">
          <InputText
            v-model="search"
            size="medium"
            placeholder="Search by rule, IP, country or path"
            aria-label="Search tuning rows"
            class="min-w-36 grow basis-(--container-2xs)"
          >
            <template #iconLeft>
              <i
                class="pi pi-search"
                aria-hidden="true"
              />
            </template>
          </InputText>
          <template #actions>
            <RefreshButton
              :loading="loading"
              @refresh="refresh"
            />
            <ExportButton
              :table="tableRef"
              filename="waf-tuning.csv"
            />
            <ColumnsButton
              v-model="columnVisibility"
              :columns="columns"
            />
          </template>
        </ControlsHeader>

        <CardBox :padded="false">
          <template #content>
            <EmptyState
              v-if="!rows.length"
              icon="ai ai-waf"
              title="No matches yet"
              description="This rule set has not matched any request. Matches appear here as traffic arrives."
            />
            <TableRoot
              v-else
              ref="tableRef"
              v-model:globalFilter="search"
              v-model:columnVisibility="columnVisibility"
              v-model:rowSelection="rowSelection"
              :data="rows"
              :columns="columns"
              row-key="ruleId"
              enable-row-selection
              enable-sorting
              :border="false"
              :loading="loading"
            >
              <template #cell-hits="{ value }">
                <span class="tabular-nums">{{ formatHits(value) }}</span>
              </template>

              <template #cell-ipCount="{ value }">
                <span class="tabular-nums text-(--text-muted)">{{ value }}</span>
              </template>
              <template #cell-countryCount="{ value }">
                <span class="tabular-nums text-(--text-muted)">{{ value }}</span>
              </template>
              <template #cell-pathCount="{ value }">
                <span class="tabular-nums text-(--text-muted)">{{ value }}</span>
              </template>

              <template #cell-ips="{ value }">
                <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
                  <span class="truncate font-mono text-body-sm">{{
                    value.slice(0, 2).join(', ')
                  }}</span>
                  <Tag
                    v-if="value.length > 2"
                    :label="`+${value.length - 2}`"
                    size="small"
                  />
                </span>
              </template>
              <template #cell-countries="{ value }">
                <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
                  <span class="truncate">{{ value.slice(0, 2).join(', ') }}</span>
                  <Tag
                    v-if="value.length > 2"
                    :label="`+${value.length - 2}`"
                    size="small"
                  />
                </span>
              </template>
              <template #cell-paths="{ value }">
                <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
                  <span class="truncate font-mono text-body-sm">{{
                    value.slice(0, 2).join(', ')
                  }}</span>
                  <Tag
                    v-if="value.length > 2"
                    :label="`+${value.length - 2}`"
                    size="small"
                  />
                </span>
              </template>
            </TableRoot>
          </template>
        </CardBox>
      </section>
    </section>
  </div>
</template>
