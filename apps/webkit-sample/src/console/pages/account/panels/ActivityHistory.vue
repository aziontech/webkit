<script setup>
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tag from '@aziontech/webkit/tag'
  import { daysAgo, formatListDate, hoursAgo } from '@shared/lib/dates'
  import { ref } from 'vue'

  import ColumnsButton from '../../../components/list/ColumnsButton.vue'
  import ExportButton from '../../../components/list/ExportButton.vue'
  import FilterButton from '../../../components/list/FilterButton.vue'
  import FilterChips from '../../../components/list/FilterChips.vue'
  import RefreshButton from '../../../components/list/RefreshButton.vue'
  import ControlsHeader from '../../../components/page/ControlsHeader.vue'
  import PageHeading from '../../../components/page/PageHeading.vue'
  import { DATE_PRESETS, formatDateRange, matchDate } from '../../../lib/behavior/filter-bar'
  import { useListFilters } from '../../../lib/behavior/list-state'
  import { FIT_COLUMN, TAG_COLUMN_WIDE } from '../../../lib/behavior/table-columns'

  const HELP = 'https://www.azion.com/en/documentation/'

  const activity = ref(
    [
      {
        id: 'a-1',
        action: 'Signed in',
        category: 'Auth',
        user: 'gabriel@cerne.digital',
        ip: '189.6.44.12',
        at: hoursAgo(6)
      },
      {
        id: 'a-2',
        action: 'Updated billing email',
        category: 'Billing',
        user: 'gabriel@cerne.digital',
        ip: '189.6.44.12',
        at: daysAgo(1)
      },
      {
        id: 'a-3',
        action: 'Created credential “CI / CD Pipeline”',
        category: 'Security',
        user: 'rafael.umman@azion.com',
        ip: '201.17.88.3',
        at: daysAgo(2)
      },
      {
        id: 'a-4',
        action: 'Invited marina.costa@azion.com',
        category: 'Users',
        user: 'gabriel@cerne.digital',
        ip: '189.6.44.12',
        at: daysAgo(6)
      },
      {
        id: 'a-5',
        action: 'Deployed vue-3-teste',
        category: 'Deploy',
        user: 'lucas.pereira@azion.com',
        ip: '177.92.10.55',
        at: daysAgo(8)
      }
    ].map((entry) => ({ ...entry, date: formatListDate(entry.at) }))
  )

  const activityColumns = [
    { accessorKey: 'action', header: 'Event', principal: true, hideable: false, grow: 2 },
    { accessorKey: 'category', header: 'Category', enableSorting: true, minWidth: TAG_COLUMN_WIDE },
    { accessorKey: 'user', header: 'User', minWidth: FIT_COLUMN },
    { accessorKey: 'ip', header: 'IP address', minWidth: FIT_COLUMN },
    { accessorKey: 'date', header: 'Date', enableSorting: true, minWidth: FIT_COLUMN }
  ]

  const columnVisibility = ref({})

  const categorySeverity = (category) =>
    ({
      Auth: 'info',
      Billing: 'primary',
      Security: 'warning',
      Users: 'secondary',
      Deploy: 'success'
    })[category] ?? 'secondary'

  const categoryOptions = [...new Set(activity.value.map((entry) => entry.category))]
    .sort((a, b) => a.localeCompare(b))
    .map((category) => ({ value: category, label: category }))

  const userOptions = [...new Set(activity.value.map((entry) => entry.user))]
    .sort((a, b) => a.localeCompare(b))
    .map((user) => ({ value: user, label: user }))

  const filterFields = [
    {
      id: 'category',
      label: 'Category',
      kind: 'options',
      options: categoryOptions,
      match: (entry, values) => values.includes(entry.category)
    },
    {
      id: 'user',
      label: 'User',
      kind: 'options',
      options: userOptions,
      match: (entry, values) => values.includes(entry.user)
    },
    {
      id: 'date',
      label: 'Date',
      kind: 'range',
      options: DATE_PRESETS,
      formatValue: formatDateRange,
      match: (entry, values) => matchDate(entry.at, values)
    }
  ]

  const {
    filters,
    search,
    pagination,
    visibleRows: visibleActivity,
    loading,
    refresh
  } = useListFilters(filterFields, activity)

  const tableRef = ref(null)
</script>

<template>
  <div class="min-h-0 flex-1 overflow-auto">
    <section class="layout-column layout-boundary flex min-w-0 flex-col">
      <PageHeading
        title="Activity History"
        description="Review recent account activity and audit events."
        :documentation="HELP"
      />

      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
        <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <ControlsHeader>
            <FilterButton
              v-model="filters"
              :fields="filterFields"
            />
            <InputText
              v-model="search"
              size="medium"
              placeholder="Search activity"
              aria-label="Search activity"
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
                filename="activity.csv"
              />
              <ColumnsButton
                v-model="columnVisibility"
                :columns="activityColumns"
              />
            </template>
          </ControlsHeader>

          <FilterChips
            v-model="filters"
            :fields="filterFields"
          />

          <CardBox :padded="false">
            <template #content>
              <TableRoot
                ref="tableRef"
                v-model:pagination="pagination"
                v-model:globalFilter="search"
                v-model:columnVisibility="columnVisibility"
                :data="visibleActivity"
                :columns="activityColumns"
                row-key="id"
                enable-sorting
                paginated
                :page-size="10"
                :border="false"
                :loading="loading"
              >
                <template #cell-category="{ value }">
                  <Tag
                    :label="value"
                    :severity="categorySeverity(value)"
                    size="medium"
                  />
                </template>
              </TableRoot>
            </template>
          </CardBox>
        </section>
      </section>
    </section>
  </div>
</template>
