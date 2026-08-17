<script setup>
  // Settings → Activity History. The recent account audit log.
  //
  // LAYOUT — a LIST band on the DATA measure (`.layout-column`). The page stack has
  // no vertical gap: it holds the heading plus ONE band below it — the controls row
  // over the table it narrows — which carries the band step and stacks its two parts
  // at the group step (see src/styles/layout.css). It owns its
  // own scroll region because the shell hands each tab a plain flex column (see
  // AccountSettings.vue).
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { daysAgo, formatListDate, hoursAgo } from '@shared/lib/dates'
  import { ref } from 'vue'

  import FilterBar from '../../../components/list/FilterBar.vue'
  import ControlsHeader from '../../../components/page/ControlsHeader.vue'
  import PageHeading from '../../../components/page/PageHeading.vue'
  import { DATE_PRESETS, formatDateRange, matchDate } from '../../../lib/behavior/filter-bar'
  import { useListFilters } from '../../../lib/behavior/list-state'

  // `at` is the real instant — the Date field compares it — and `date` (the sortable
  // display string) is derived from it by one formatter rather than hand-written per
  // row: parsing a display string back into a Date is engine-dependent, so a filter
  // built on it would compare garbage on some browsers (src/lib/dates.js).
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
    { accessorKey: 'action', header: 'Event', principal: true, grow: 2 },
    { accessorKey: 'category', header: 'Category', enableSorting: true },
    { accessorKey: 'user', header: 'User' },
    { accessorKey: 'ip', header: 'IP address' },
    { accessorKey: 'date', header: 'Date', enableSorting: true }
  ]

  const categorySeverity = (category) =>
    ({
      Auth: 'info',
      Billing: 'accent',
      Security: 'warning',
      Users: 'secondary',
      Deploy: 'success'
    })[category] ?? 'secondary'

  // ── The filter catalog ────────────────────────────────────────────────────
  // The COLUMNS decide the fields: Category and User are enumerable, Date becomes
  // relative periods plus a Custom month grid, and Event / IP Address are free text
  // covered by the search field. An audit log is read by asking two questions — who
  // did it, and when — so those two are the ones that earn a chip.
  //
  // Both option lists come from the entries themselves, so neither can offer a
  // category or a person with nothing behind them.
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
    visibleRows: visibleActivity
  } = useListFilters(filterFields, activity)
</script>

<template>
  <div class="min-h-0 flex-1 overflow-auto">
    <section class="layout-column layout-boundary flex min-w-0 flex-col">
      <PageHeading
        title="Activity History"
        description="Review recent account activity and audit events."
      />

      <!-- The page's parent section. It holds one section here — the controls row
           over the table it narrows, at the GROUP step — and spaces whatever sits
           inside it at --layout-section-gap. -->
      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
        <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <!-- The band's CONTROLS: narrowing on the left, the band's own action on the
               right, above the card — the same row every list in the console opens with. -->
          <ControlsHeader>
            <!-- Search drives the table's global filter from outside the card, so the field is
                 a plain InputText (`Table.Search` is context-aware and only works inside
                 `<Table>`). One horizontal band: it grows into the row's slack and compresses
                 rather than wrapping (see ui/ControlsHeader.vue). -->
            <InputText
              v-model="search"
              size="large"
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
          </ControlsHeader>

          <!-- The filter bar takes its own row: it grows as filters are applied, so
               sharing the controls row would make the search field jump width. -->
          <FilterBar
            v-model="filters"
            :fields="filterFields"
          />

          <CardBox :padded="false">
            <template #content>
              <Table
                v-model:pagination="pagination"
                v-model:globalFilter="search"
                :data="visibleActivity"
                :columns="activityColumns"
                row-key="id"
                enable-sorting
                paginated
                :page-size="10"
                :border="false"
              >
                <template #cell-category="{ value }">
                  <Tag
                    :label="value"
                    :severity="categorySeverity(value)"
                    size="medium"
                  />
                </template>
              </Table>
            </template>
          </CardBox>
        </section>
      </section>
    </section>
  </div>
</template>
