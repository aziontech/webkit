<script setup>
  // The deployment table — ONE table shape, reused by every surface that lists
  // deployments: the Deployments module, a workload's Version History, and a
  // workload's Deployments tab. Same columns, same cells, same toolbar, so a
  // deployment reads identically wherever it appears instead of each screen
  // re-deciding what a deployment row looks like.
  //
  // The row contract (src/lib/deployments.js is the vocabulary):
  //   versionId · status · duration · current · environment
  //   resourceType · resourceName · resourceId   — what was deployed
  //   deployedAt (Date) · date (display string)
  //   author · authorEmail (the Authors selector's key) · authorAvatar
  //
  // Narrowing is a SELECTOR PER COLUMN, never a field/operator/value builder:
  // Status, Environment and Authors are always visible here — they are what
  // every deployment surface narrows by — and a page that needs more (the module
  // list adds a date range) passes it through `#selectors` and pre-filters
  // `:deployments` itself. Table.Search narrows further, through the table's own
  // global filter.
  import Avatar from '@aziontech/webkit/avatar'
  import Dropdown from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Select from '@aziontech/webkit/select'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref, watch } from 'vue'

  import {
    environmentOptions,
    environmentSeverity,
    resourceHref,
    resourceMeta,
    statusMeta,
    statusOptions
  } from '../../lib/deployments'
  import { filterDisplay } from '../../lib/filters'
  import LastModifiedCell from './LastModifiedCell.vue'

  const props = defineProps({
    /** Deployment records, already narrowed by whatever the page's own selectors apply. */
    deployments: { type: Array, default: () => [] },
    pageSize: { type: Number, default: 10 },
    exportFilename: { type: String, default: 'deployments.csv' },
    // Short by design — the toolbar carries four selectors beside it, so the
    // field is the first thing to shrink (Applications.vue uses the same text).
    searchPlaceholder: { type: String, default: 'Search...' },
    /** Carried on the resource link so the detail page keeps the session's email. */
    email: { type: String, default: '' }
  })

  const emit = defineEmits(['row-click', 'action', 'clear'])

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

  // The table's own state, owned here so the "..." menu can clear it.
  const search = ref('')
  const statusFilter = ref([])
  const environmentFilter = ref([])
  const authorFilter = ref([])
  const pagination = ref({ pageIndex: 0, pageSize: props.pageSize })

  // Author options come from the rows themselves, so the selector can never
  // offer a person who has nothing in this table. Each option carries that
  // person's photo, so the filter identifies them the same way the Deployed cell
  // does — by face first, name second.
  const authorOptions = computed(() =>
    [
      ...new Map(
        props.deployments.map((deployment) => [
          deployment.authorEmail,
          { name: deployment.author, avatar: deployment.authorAvatar }
        ])
      )
    ]
      .sort(([, a], [, b]) => a.name.localeCompare(b.name))
      .map(([email, person]) => ({ value: email, label: person.name, avatar: person.avatar }))
  )

  // The roster can be long enough that scanning it beats reading it, so the
  // panel gets its own search field (Select.Content's `#search` slot). Cleared
  // on close so it never reopens pre-filtered.
  const authorQuery = ref('')
  const authorOpen = ref(false)
  watch(authorOpen, (open) => {
    if (!open) authorQuery.value = ''
  })
  const visibleAuthorOptions = computed(() => {
    const query = authorQuery.value.trim().toLowerCase()
    if (!query) return authorOptions.value
    return authorOptions.value.filter(
      (option) =>
        option.label.toLowerCase().includes(query) || option.value.toLowerCase().includes(query)
    )
  })

  // The selectors pre-filter the rows, so the Table only ever sees what survives
  // them; `Table.Search` then narrows that further through the global filter.
  const visibleDeployments = computed(() =>
    props.deployments.filter((deployment) => {
      if (statusFilter.value.length && !statusFilter.value.includes(deployment.status)) {
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

  // `clear` lets the page reset the selectors it owns in `#selectors` — this
  // component can only clear its own (the search text, Status, Environment and
  // Authors), and a menu item called "Clear filters" that leaves the page's
  // selectors set would be lying.
  const clearFilters = () => {
    search.value = ''
    statusFilter.value = []
    environmentFilter.value = []
    authorFilter.value = []
    emit('clear')
  }

  // `Table.Export` renders only its trigger slot, so wrapping the Dropdown in it
  // is what hands the menu the table's own CSV export (visible columns + filtered
  // rows) without a second button.
  const onToolbarAction = (value, exportCsv) => {
    if (value === 'export') {
      exportCsv()
      return
    }
    clearFilters()
  }
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
    :export-filename="exportFilename"
    @row-click="(event, row) => emit('row-click', event, row)"
  >
    <template #toolbar>
      <!-- Search leads, then one selector per column — Status and Environment
           here, plus whatever the page adds — then the table's own options.
           Every control is `large`, so the row is one 40px band. -->
      <div class="flex w-full flex-wrap items-center gap-[var(--spacing-xs)]">
        <!-- The search absorbs the slack (`grow`) and gives it all back when the
             row is tight: `min-w-0` lets it shrink past its content so four
             selectors and the page's own still fit one 40px band. A floor here
             would wrap the row instead of squeezing it — `flex-wrap` wraps, it
             does not shrink — which is why the placeholder is short. -->
        <Table.Search
          size="large"
          :placeholder="searchPlaceholder"
          class="min-w-0 grow basis-full 2xl:basis-0"
        />

        <!-- Width lives on the wrapper: the Select root declares w-full in its
             own static class, which wins over a consumer w-[…] on a tie. -->
        <div class="w-[var(--container-3xs)] shrink-0">
          <Select
            v-model="statusFilter"
            multiple
            size="large"
            placeholder="Status"
            :display-value="filterDisplay('Status', statusOptions)"
          >
            <Select.Trigger aria-label="Filter by status" />
            <Select.Content>
              <Select.Option
                v-for="option in statusOptions"
                :key="option.value"
                :value="option.value"
              >
                <template #left>
                  <StatusIndicator
                    :severity="statusMeta(option.value).severity"
                    :loading="statusMeta(option.value).loading"
                  />
                </template>
                {{ option.label }}
              </Select.Option>
            </Select.Content>
          </Select>
        </div>

        <div class="w-[var(--container-3xs)] shrink-0">
          <Select
            v-model="environmentFilter"
            multiple
            size="large"
            placeholder="Environment"
            :display-value="filterDisplay('Environment', environmentOptions)"
          >
            <Select.Trigger aria-label="Filter by environment" />
            <Select.Content>
              <Select.Option
                v-for="option in environmentOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </Select.Option>
            </Select.Content>
          </Select>
        </div>

        <div class="w-[var(--container-3xs)] shrink-0">
          <Select
            v-model="authorFilter"
            v-model:open="authorOpen"
            multiple
            size="large"
            placeholder="Authors"
            :display-value="filterDisplay('Authors', authorOptions)"
          >
            <Select.Trigger aria-label="Filter by author" />
            <Select.Content>
              <!-- `#search` renders above the scrolling list, so the field stays
                   put while the options move. `@keydown.stop` keeps the panel's
                   Arrow/Home/End handler from pulling focus onto an option while
                   the user is still typing. -->
              <template #search>
                <InputText
                  v-model="authorQuery"
                  size="medium"
                  class="w-full"
                  placeholder="Search authors..."
                  aria-label="Search authors"
                  @keydown.stop
                >
                  <template #iconLeft>
                    <i
                      class="pi pi-search"
                      aria-hidden="true"
                    />
                  </template>
                </InputText>
              </template>
              <Select.Option
                v-for="option in visibleAuthorOptions"
                :key="option.value"
                :value="option.value"
              >
                <template #left>
                  <Avatar
                    :src="option.avatar || undefined"
                    :alt="option.label"
                    :label="option.label"
                    size="small"
                    kind="square"
                  />
                </template>
                {{ option.label }}
              </Select.Option>
              <!-- A search that matches nothing must say so; an empty panel reads
                   as a broken filter. -->
              <p
                v-if="!visibleAuthorOptions.length"
                class="px-[var(--spacing-sm)] py-[var(--spacing-xs)] text-body-sm text-[var(--text-muted)]"
              >
                No author matches “{{ authorQuery }}”.
              </p>
            </Select.Content>
          </Select>
        </div>

        <slot name="selectors" />

        <Table.Export>
          <template #trigger="{ export: exportCsv }">
            <Dropdown
              placement="bottom-end"
              class="shrink-0"
              @select="(event, value) => onToolbarAction(value, exportCsv)"
            >
              <Dropdown.Trigger>
                <Tooltip text="Table options">
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="outlined"
                    aria-label="Table options"
                  />
                </Tooltip>
              </Dropdown.Trigger>
              <Dropdown.Group>
                <Dropdown.Option
                  value="export"
                  label="Export CSV"
                >
                  <template #left>
                    <i
                      class="pi pi-download"
                      aria-hidden="true"
                    />
                  </template>
                </Dropdown.Option>
                <Dropdown.Option
                  value="clear"
                  label="Clear filters"
                >
                  <template #left>
                    <i
                      class="pi pi-filter-slash"
                      aria-hidden="true"
                    />
                  </template>
                </Dropdown.Option>
              </Dropdown.Group>
            </Dropdown>
          </template>
        </Table.Export>
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
