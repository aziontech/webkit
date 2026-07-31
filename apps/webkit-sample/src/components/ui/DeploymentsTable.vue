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
  // Narrowing is a SELECTOR PER COLUMN, never a field/operator/value builder: Status,
  // Type, Environment and Authors — what every deployment surface narrows by — stacked
  // in the filter popover behind one icon (ui/FilterPopover.vue), and a page that needs
  // more (the module list adds a date range) passes it through `#selectors`, where it
  // renders in the same panel, and pre-filters `:deployments` itself. The free-text
  // search stays in the open, narrowing further through the table's global filter.
  //
  // WHERE those fields render depends on the nav level, and is the one thing this
  // component is configured for:
  //
  //   `controls` (default) — the fields render in the table's own `#toolbar`, inside
  //     the card. This is what an internal level uses (a workload's Version History /
  //     Deployments tab), where the table is one band among several.
  //   `:controls="false"` — no toolbar at all. A FIRST-LEVEL page hoists the same
  //     fields into its ControlsHeader above the card (see ui/ControlsHeader.vue) and
  //     owns their state, binding it here through the models below.
  //
  // Either way the fields themselves come from ONE file, ui/DeploymentTableControls.vue,
  // so the two placements can never drift apart.
  import Dropdown from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref, watch } from 'vue'

  import {
    environmentSeverity,
    resourceHref,
    resourceMeta,
    statusMeta
  } from '../../lib/deployments'
  import { useTenancyReload } from '../../lib/tenancy-reload'
  import DeploymentTableControls from './DeploymentTableControls.vue'
  import LastModifiedCell from './LastModifiedCell.vue'

  const props = defineProps({
    /** Deployment records, already narrowed by whatever the page's own selectors apply. */
    deployments: { type: Array, default: () => [] },
    pageSize: { type: Number, default: 10 },
    // Short by design, and it now has the row nearly to itself: the selectors moved
    // into the filter popover, so only that one icon button sits beside the field
    // (Applications.vue uses the same text).
    searchPlaceholder: { type: String, default: 'Search...' },
    /** Carried on the resource link so the detail page keeps the session's email. */
    email: { type: String, default: '' },
    /** Render the controls in the table's own toolbar. `false` when the page hoists them. */
    controls: { type: Boolean, default: true }
  })

  const emit = defineEmits(['row-click', 'action', 'clear'])

  // Deployments belong to the scope that made them, so switching organization,
  // account or workspace reloads this table wherever it renders — the module list
  // or a workload's history. The flag is read here rather than passed in as a prop:
  // every surface that shows deployments has the same answer, and a caller could
  // not opt out truthfully (src/lib/tenancy-reload.js).
  const { tenancyReloading } = useTenancyReload()

  // Column model. `versionId` is the principal column; it keeps the principal
  // default share (2) because the id and the "Current" tag sit on ONE line — at
  // `grow: 1` the tag squeezes the id, the row's identity, into an ellipsis. The
  // trailing `actions` column is auto-pinned to the right edge.
  const columns = [
    { accessorKey: 'versionId', header: 'Version', enableSorting: true, principal: true },
    { accessorKey: 'status', header: 'Status', enableSorting: true },
    { accessorKey: 'resourceName', header: 'Resource', enableSorting: true, grow: 2 },
    { accessorKey: 'resourceType', header: 'Type', enableSorting: true, grow: 2 },
    { accessorKey: 'environment', header: 'Environment', enableSorting: true, grow: 2 },
    // Author and Deployed are one column: the avatar identifies the person (name
    // on its tooltip) and the timestamp reads relative, left-aligned — the same
    // Last Modified cell every other console list uses.
    { accessorKey: 'date', header: 'Deployed', enableSorting: true, grow: 3 },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  // The filter state. Models, not plain refs, so a first-level page that hoists the
  // controls out of the table can own the same four values and bind them here —
  // `defineModel` gives the uncontrolled case (an internal level, which passes none of
  // them) local state for free.
  const search = defineModel('search', { type: String, default: '' })
  const statusFilter = defineModel('statusFilter', { type: Array, default: () => [] })
  const typeFilter = defineModel('typeFilter', { type: Array, default: () => [] })
  const environmentFilter = defineModel('environmentFilter', { type: Array, default: () => [] })
  const authorFilter = defineModel('authorFilter', { type: Array, default: () => [] })
  const pagination = ref({ pageIndex: 0, pageSize: props.pageSize })

  // The selectors pre-filter the rows, so the Table only ever sees what survives
  // them; the search then narrows that further through the global filter.
  const visibleDeployments = computed(() =>
    props.deployments.filter((deployment) => {
      if (statusFilter.value.length && !statusFilter.value.includes(deployment.status)) {
        return false
      }
      if (typeFilter.value.length && !typeFilter.value.includes(deployment.resourceType)) {
        return false
      }
      if (
        environmentFilter.value.length &&
        !environmentFilter.value.includes(deployment.environment)
      ) {
        return false
      }
      if (authorFilter.value.length && !authorFilter.value.includes(deployment.authorEmail)) {
        return false
      }
      return true
    })
  )

  // Narrowing `:data` from outside does not trip TanStack's
  // `autoResetPageIndex`, so landing on a page past the new last one would render
  // an empty table. Rewind whenever the row set is recomputed.
  watch(visibleDeployments, () => {
    pagination.value = { ...pagination.value, pageIndex: 0 }
  })

  // `clear` lets the page reset the selectors it owns in `#selectors` — this component
  // can only clear the four it holds (Status, Type, Environment and Authors), and a
  // "Clear all" that left the page's fields set would be lying. The search is not part
  // of it: it sits outside the filter panel, in plain view, so the panel's footer has
  // no business wiping it.
  const clearFilters = () => {
    statusFilter.value = []
    typeFilter.value = []
    environmentFilter.value = []
    authorFilter.value = []
    emit('clear')
  }

  // What a page needs when it hoists the controls: its filter panel's "Clear all" has
  // to reach the four selectors this component holds.
  defineExpose({ clearFilters })
</script>

<template>
  <Table
    v-model:pagination="pagination"
    v-model:globalFilter="search"
    :data="visibleDeployments"
    :columns="columns"
    row-key="id"
    enable-sorting
    paginated
    :page-size="pageSize"
    :border="false"
    :loading="tenancyReloading"
    @row-click="(event, row) => emit('row-click', event, row)"
  >
    <!-- The same fields the page can hoist, rendered here for an internal level. One
         row, `flex-wrap`, the tight `--spacing-xs` rhythm — the controls component
         itself is `display: contents`, so its fields are direct children of this row. -->
    <template
      v-if="controls"
      #toolbar
    >
      <div class="flex w-full flex-wrap items-center gap-[var(--spacing-xs)]">
        <DeploymentTableControls
          v-model:search="search"
          v-model:status-filter="statusFilter"
          v-model:type-filter="typeFilter"
          v-model:environment-filter="environmentFilter"
          v-model:author-filter="authorFilter"
          :deployments="deployments"
          :search-placeholder="searchPlaceholder"
          @clear="clearFilters"
        >
          <template #selectors>
            <slot name="selectors" />
          </template>
        </DeploymentTableControls>
      </div>
    </template>

    <template #cell-versionId="{ value, row }">
      <!-- The tag sits UNDER the id, not beside it: side by side it squeezes the
           id — the row's identity — into an ellipsis. -->
      <div class="flex min-w-0 items-start gap-[var(--spacing-xxs)]">
        <span class="truncate text-body-sm text-[var(--text-default)]">{{ value }}</span>
        <Tag
          v-if="row.current"
          label="Current"
          severity="info"
          size="small"
          icon="pi pi-arrow-circle-up"
        />
      </div>
    </template>

    <template #cell-status="{ row }">
      <!-- Status reads horizontally: the StatusIndicator carries its own label,
           so the build duration sits beside it instead of spending a second
           line. A finished build reports how long it took; one that has not
           finished has nothing honest to show. -->
      <div class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
        <StatusIndicator
          :severity="statusMeta(row.status).severity"
          :loading="statusMeta(row.status).loading"
          :label="row.status"
        />
        <span
          v-if="row.duration"
          class="shrink-0 text-body-xs text-[var(--text-muted)]"
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
          class="flex min-w-0 items-center gap-[var(--spacing-xxs)] text-body-sm text-[var(--text-default)] no-underline hover:underline"
          @click.stop
        >
          <span class="truncate">{{ value }}</span>
          <i
            class="pi pi-arrow-up-right shrink-0 text-[var(--text-muted)]"
            aria-hidden="true"
          />
        </router-link>
        <!-- Firewall and Custom Pages are nav-only in this sample, so those
             resources have no page to link to. -->
        <span
          v-else
          class="truncate text-body-sm text-[var(--text-default)]"
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

    <template #cell-date="{ row }">
      <!-- Author + timestamp in one left-aligned cell (Applications.vue's Last
           Modified): the avatar names the person on its tooltip, so a separate
           Author column would repeat what this one already says. -->
      <LastModifiedCell
        :author="row.author"
        :avatar-src="row.authorAvatar"
        :date="row.deployedAt"
      />
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
            label="Promote to Production"
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
