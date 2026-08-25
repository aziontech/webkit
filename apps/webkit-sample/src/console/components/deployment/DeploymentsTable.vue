<script setup>
  // The deployment table — ONE table shape, reused by every surface that lists
  // deployments: the Deployments module, a workload's Version History, and a
  // workload's Deployments tab. Same columns, same cells, same controls, so a
  // deployment reads identically wherever it appears instead of each screen
  // re-deciding what a deployment row looks like.
  //
  // The row contract (src/lib/deployments.js is the vocabulary):
  //   versionId · status · duration · current · environment
  //   resourceType · resourceName · resourceId   — what was deployed
  //   deployedAt (Date) · date (display string)
  //   author · authorEmail (the Authors selector's key) · authorAvatar
  //
  // Narrowing is the FILTER BUTTON (list/FilterButton.vue) over the shared catalog in
  // src/lib/deployments.js — Status, Type, Environment and Author, what every
  // deployment surface narrows by, plus the Deployed window the module list adds. The
  // free-text search stays in the open, narrowing further through the table's global
  // filter. Never a field/operator/value builder: every one of these narrows by
  // membership, so an operator column would offer `is one of` on every row.
  //
  // WHERE the controls render depends on the nav level, and is the one thing this
  // component is configured for:
  //
  //   `controls` (default) — search and bar render in the table's own `#toolbar`,
  //     inside the card. This is what an internal level uses (a workload's Version
  //     History / Deployments tab), where the table is one band among several.
  //   `:controls="false"` — no toolbar at all. A FIRST-LEVEL page hoists them into its
  //     ControlsHeader and filter row above the card (see ui/ControlsHeader.vue) and
  //     owns their state, binding it here through the two models below.
  //
  // Both placements read the SAME catalog and the SAME `{ fieldId: values[] }` state,
  // so they cannot drift apart — which is what the separate controls component used to
  // buy at the cost of five models and a `clear` round trip.
  import Dropdown from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref, watch } from 'vue'

  import { applyFilters } from '../../lib/behavior/filter-bar'
  import { useListRefresh } from '../../lib/behavior/list-state'
  import { DEPLOYMENT_COLUMNS } from '../../lib/data/deployment-columns'
  import {
    environmentSeverity,
    resourceHref,
    resourceMeta,
    statusMeta
  } from '../../lib/data/deployments'
  import AuthorCell from '../list/AuthorCell.vue'
  import FilterButton from '../list/FilterButton.vue'
  import FilterChips from '../list/FilterChips.vue'
  import IdCell from '../list/IdCell.vue'
  import LastModifiedCell from '../list/LastModifiedCell.vue'

  const props = defineProps({
    /** Deployment records, already narrowed by whatever the page itself applies. */
    deployments: { type: Array, default: () => [] },
    /**
     * The filter catalog — `deploymentFilterFields(rows, { deployed })` from
     * src/lib/deployments.js. Passed in rather than built here because the Author
     * options come from the rows a SURFACE shows, and only the surface knows whether
     * its span is wide enough to want the Deployed window.
     */
    fields: { type: Array, default: () => [] },
    pageSize: { type: Number, default: 10 },
    searchPlaceholder: { type: String, default: 'Search...' },
    /** Carried on the resource link so the detail page keeps the session's email. */
    email: { type: String, default: '' },
    /** Render the controls in the table's own toolbar. `false` when the page hoists them. */
    controls: { type: Boolean, default: true },
    /**
     * Whether the rows are being fetched — skeletons instead of data. It is OR'd with
     * this table's own windows (a scope switch, and the Refresh button in the toolbar
     * below), so a page that hoists the controls passes its own flag here and the two
     * placements behave identically.
     */
    loading: { type: Boolean, default: false }
  })

  const emit = defineEmits(['row-click', 'action'])

  // Deployments belong to the scope that made them, so switching organization,
  // account or workspace reloads this table wherever it renders — the module list
  // or a workload's history. The flag is read here rather than passed in as a prop:
  // every surface that shows deployments has the same answer, and a caller could
  // not opt out truthfully (src/lib/tenancy-reload.js). `useListRefresh` folds that
  // window together with the Refresh button's, so one flag covers both causes
  // (../../lib/behavior/list-state.js), and the caller's `loading` joins them.
  const { loading: listLoading, refresh } = useListRefresh()
  const loading = computed(() => props.loading || listLoading.value)

  // The inner DS table. Download CSV in the toolbar below reaches it through the
  // table context; a page that HOISTS its controls reaches it through the two methods
  // exposed at the bottom of this block, since it holds a ref to this component and
  // not to the table inside it.
  const tableRef = ref(null)

  // The column model is shared with the pages above (../../lib/data/deployment-columns.js):
  // they render the Columns button on their own controls row, outside this table.
  const columns = DEPLOYMENT_COLUMNS

  // TWO models, not five. Both are `defineModel`, so an internal level that binds
  // neither gets local state for free while a first-level page that hoists the
  // controls owns the same two values and binds them here. The applied state is one
  // object keyed by field id (src/lib/filter-bar.js), so adding a field to the
  // catalog never adds a model.
  const search = defineModel('search', { type: String, default: '' })
  const filters = defineModel('filters', { type: Object, default: () => ({}) })
  // Third model, same argument as the two above: a page that hoists the Columns
  // button onto its controls row drives this; an internal level that binds nothing
  // gets local state for free.
  const columnVisibility = defineModel('columnVisibility', { type: Object, default: () => ({}) })
  const pagination = ref({ pageIndex: 0, pageSize: props.pageSize })

  // The bar pre-filters the rows, so the Table only ever sees what survives it; the
  // search then narrows that further through the global filter.
  const visibleDeployments = computed(() =>
    applyFilters(props.deployments, props.fields, filters.value)
  )

  // Narrowing `:data` from outside does not trip TanStack's `autoResetPageIndex`, so
  // landing on a page past the new last one would render an empty table. Rewind
  // whenever the row set is recomputed — which also covers `:deployments` changing
  // under a page that filters before passing them in.
  watch(visibleDeployments, () => {
    pagination.value = { ...pagination.value, pageIndex: 0 }
  })

  // For a FIRST-LEVEL page: it hoists the controls, so its Refresh and Download CSV
  // buttons sit outside this component and need a handle on the table inside it.
  // Forwarded rather than re-implemented — the CSV is still the DS's, over the visible
  // columns and the filtered rows.
  defineExpose({
    exportCsv: (options) => tableRef.value?.exportCsv(options),
    refresh
  })
</script>

<template>
  <Table
    ref="tableRef"
    v-model:pagination="pagination"
    v-model:globalFilter="search"
    v-model:columnVisibility="columnVisibility"
    :data="visibleDeployments"
    :columns="columns"
    row-key="id"
    enable-sorting
    paginated
    :page-size="pageSize"
    :border="false"
    :loading="loading"
    export-filename="deployments.csv"
    @row-click="(event, row) => emit('row-click', event, row)"
    @refresh="refresh"
  >
    <!-- The same controls the page can hoist, rendered here for an internal level, in
         the same shape the page pattern uses: the Filter button then the search on one
         row, the two listing actions at its right end, and the applied chips on a row
         under them (../list/FilterChips.vue, which renders nothing until something is
         applied).
         Refresh and Download CSV are the DS's OWN sub-components here, not the
         consumer-side pair the pages use: inside the table they can `inject` its
         context, which is exactly what those two do. The pages have to pass the table
         in because their controls row lives outside the card. -->
    <template
      v-if="controls"
      #toolbar
    >
      <div class="flex w-full flex-col gap-(--layout-group-gap)">
        <div class="flex w-full items-center gap-(--layout-group-gap)">
          <FilterButton
            v-model="filters"
            :fields="fields"
          />
          <InputText
            v-model="search"
            size="medium"
            :placeholder="searchPlaceholder"
            :aria-label="searchPlaceholder"
            class="min-w-36 grow basis-(--container-2xs)"
          >
            <template #iconLeft>
              <i
                class="pi pi-search"
                aria-hidden="true"
              />
            </template>
          </InputText>
          <!-- The two controls that act on the LISTING rather than narrow it. Both
               `medium`, so the row keeps one 32px height. -->
          <div class="flex shrink-0 items-center gap-(--spacing-xs)">
            <Table.RefreshButton />
            <Table.Export />
          </div>
        </div>
        <FilterChips
          v-model="filters"
          :fields="fields"
        />
      </div>
    </template>

    <template #cell-versionId="{ value, row }">
      <!-- The tag sits UNDER the id, not beside it: side by side it squeezes the
           id — the row's identity — into an ellipsis. -->
      <div class="flex min-w-0 items-start gap-(--spacing-xxs)">
        <span class="truncate text-body-sm text-(--text-default)">{{ value }}</span>
        <Tag
          v-if="row.current"
          label="Current"
          severity="info"
          size="small"
          icon="pi pi-arrow-circle-up"
        />
      </div>
    </template>

    <template #cell-id="{ value }">
      <IdCell
        :value="value"
        resource="deployment"
      />
    </template>

    <template #cell-status="{ row }">
      <!-- Status reads horizontally: the StatusIndicator carries its own label,
           so the build duration sits beside it instead of spending a second
           line. A finished build reports how long it took; one that has not
           finished has nothing honest to show. -->
      <div class="flex min-w-0 items-center gap-(--spacing-xs)">
        <StatusIndicator
          :severity="statusMeta(row.status).severity"
          :loading="statusMeta(row.status).loading"
          :label="row.status"
        />
        <span
          v-if="row.duration"
          class="shrink-0 text-body-xs text-(--text-muted)"
        >
          {{ row.duration }}
        </span>
      </div>
    </template>

    <template #cell-resourceName="{ value, row }">
      <div class="flex min-w-0 items-center">
        <!-- The resource's own module page. `@click.stop` keeps the row click
             (which opens the deployment drawer) from firing when the user means
             to open the resource. -->
        <router-link
          v-if="resourceHref(row)"
          :to="{ path: resourceHref(row), query: { email } }"
          class="flex min-w-0 items-center gap-(--spacing-xxs) text-body-sm text-(--text-default) no-underline hover:underline"
          @click.stop
        >
          <span class="truncate">{{ value }}</span>
          <i
            class="pi pi-arrow-up-right shrink-0 text-(--text-muted)"
            aria-hidden="true"
          />
        </router-link>
        <!-- Firewall and Custom Pages are nav-only in this sample, so those
             resources have no page to link to. -->
        <span
          v-else
          class="truncate text-body-sm text-(--text-default)"
          >{{ value }}</span
        >
      </div>
    </template>

    <template #cell-resourceType="{ value }">
      <!-- The product chip: its glyph plus its name. The label goes through the
           default slot with `truncate` so a narrow column ellipsizes it instead
           of clipping it against the Tag's own overflow-hidden. -->
      <Tag
        severity="secondary"
        size="medium"
        :icon="resourceMeta(value).icon"
        class="max-w-full"
      >
        <span class="min-w-0 truncate">{{ resourceMeta(value).label }}</span>
      </Tag>
    </template>

    <template #cell-environment="{ value }">
      <Tag
        :label="value"
        :severity="environmentSeverity(value)"
        size="medium"
      />
    </template>

    <template #cell-author="{ row }">
      <AuthorCell
        :author="row.author"
        :avatar-src="row.authorAvatar"
      />
    </template>

    <template #cell-date="{ row }">
      <LastModifiedCell :date="row.deployedAt" />
    </template>

    <template #cell-actions="{ row }">
      <Dropdown
        placement="bottom-end"
        @select="(event, value) => emit('action', event, value, row)"
      >
        <Dropdown.Trigger>
          <Tooltip text="Deployment actions">
            <IconButton
              icon="pi pi-ellipsis-h"
              kind="outlined"
              size="small"
              aria-label="Deployment actions"
            />
          </Tooltip>
        </Dropdown.Trigger>
        <Dropdown.Group>
          <Dropdown.Option
            value="details"
            label="View details"
          >
            <template #left>
              <i
                class="pi pi-eye"
                aria-hidden="true"
              />
            </template>
          </Dropdown.Option>
          <Dropdown.Option
            value="redeploy"
            label="Redeploy"
          >
            <template #left>
              <i
                class="pi pi-refresh"
                aria-hidden="true"
              />
            </template>
          </Dropdown.Option>
          <Dropdown.Option
            value="promote"
            label="Promote to production"
          >
            <template #left>
              <i
                class="pi pi-arrow-circle-up"
                aria-hidden="true"
              />
            </template>
          </Dropdown.Option>
        </Dropdown.Group>
      </Dropdown>
    </template>
  </Table>
</template>
