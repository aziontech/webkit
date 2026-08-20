<script setup>
  // WAF Rules — the Azion Console "WAF Rules" module. The app shell (single sidebar +
  // GlobalHeader with the module breadcrumb) comes from AppLayout; this page renders
  // only its content, in the shape every module list takes (the webkit-lists skill):
  // a PAGE HEADING over a CONTROLS HEADER (search + Filter) over a data-driven <Table>
  // in a flush CardBox. As a first-level module list it carries no navigation tabs; the
  // heading names the module and holds its create action, and the controls row below it
  // only narrows the list (../../components/page/PageHeading.vue).
  //
  // A RULE SET is a named threat posture: which families it inspects for, and whether
  // it BLOCKS what it matches or only logs it. That mode is the question this list
  // exists to answer — which of these are actually blocking — so it leads the fields.
  //
  // Narrowing is the shared FILTER BUTTON (list/FilterButton.vue), beside the search in
  // the controls row: the COLUMNS decide the fields, the button pre-filters `:data`, and
  // the search narrows what is left through the table's own global filter.
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Dropdown from '@aziontech/webkit/dropdown'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import ProductFirstUse from '../../components/home/ProductFirstUse.vue'
  import AuthorCell from '../../components/list/AuthorCell.vue'
  import ColumnsButton from '../../components/list/ColumnsButton.vue'
  import DeleteDialog from '../../components/list/DeleteDialog.vue'
  import FilterButton from '../../components/list/FilterButton.vue'
  import FilterChips from '../../components/list/FilterChips.vue'
  import LastModifiedCell from '../../components/list/LastModifiedCell.vue'
  import TagListCell from '../../components/list/TagListCell.vue'
  import ControlsHeader from '../../components/page/ControlsHeader.vue'
  import HeadingAction from '../../components/page/HeadingAction.vue'
  import PageHeading from '../../components/page/PageHeading.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import { DATE_PRESETS, formatDateRange, matchDate } from '../../lib/behavior/filter-bar'
  import { useListFilters } from '../../lib/behavior/list-state'
  import { createResourcePath } from '../../lib/data/create-resources'
  import { productFirstUse } from '../../lib/data/product-empty-states'
  import { WAF_MODES, WAF_RULES } from '../../lib/data/waf-rules'
  import { useSampleMode } from '../../lib/state/sample-mode'
  import { tenancyRows } from '../../lib/state/tenancy-scope'

  // The sample's EMPTY version: this module before it owns anything. The same block the
  // /empty-states gallery reviews, rendered in the module's own page
  // (../lib/sample-mode.js, ./ui/ProductFirstUse.vue).
  const { accountEmpty } = useSampleMode()
  const firstUse = productFirstUse('waf-rules')

  // This page holds its own copy of the seed because it deletes rows; mutating the
  // shared array would leak that into every surface reading it.
  const ruleSets = ref([...WAF_RULES])

  // A rule set belongs to one place in the tenancy chain, so the seed is projected
  // through the organization / account / workspace in force (src/lib/tenancy-scope.js).
  const scopedRuleSets = computed(() => tenancyRows(ruleSets.value, 'waf-rules'))

  const columns = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, hideable: false },
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'mode', header: 'Mode', enableSorting: true },
    { accessorKey: 'threatLabels', header: 'Threat Types', grow: 3 },
    { accessorKey: 'sensitivity', header: 'Sensitivity', enableSorting: true },
    { accessorKey: 'status', header: 'Status', enableSorting: true },
    { accessorKey: 'author', header: 'Last Editor', enableSorting: true, grow: 2 },
    { accessorKey: 'lastModified', header: 'Last Modified', enableSorting: true, grow: 2 },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  // ── The filter catalog ────────────────────────────────────────────────────
  // Mode, Sensitivity and Status are the enumerable columns. Threat Types is a LIST
  // per row (a rule set inspects several families at once), so it is a column only.
  const filterFields = [
    {
      id: 'mode',
      label: 'Mode',
      kind: 'options',
      options: WAF_MODES,
      match: (ruleSet, values) => values.includes(ruleSet.mode)
    },
    {
      id: 'sensitivity',
      label: 'Sensitivity',
      kind: 'options',
      // Listed weakest to strongest, the way the product presents them, rather than
      // alphabetically — which would read High, Highest, Low, Medium.
      options: [
        { value: 'Low', label: 'Low' },
        { value: 'Medium', label: 'Medium' },
        { value: 'High', label: 'High' },
        { value: 'Highest', label: 'Highest' }
      ],
      match: (ruleSet, values) => values.includes(ruleSet.sensitivity)
    },
    {
      id: 'status',
      label: 'Status',
      kind: 'options',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' }
      ],
      match: (ruleSet, values) => values.includes(ruleSet.status)
    },
    {
      id: 'modified',
      label: 'Last Modified',
      kind: 'range',
      options: DATE_PRESETS,
      formatValue: formatDateRange,
      match: (ruleSet, values) => matchDate(ruleSet.modifiedAt, values)
    }
  ]

  // Filter state, search value, surviving rows and their pagination — one place,
  // including the rewind that keeps a narrowed list off a page offset it no longer
  // has rows for (src/lib/list-state.js). `loading` is the tenancy reload window.
  const {
    filters,
    search,
    pagination,
    visibleRows: visibleRuleSets,
    loading: tenancyReloading
  } = useListFilters(filterFields, scopedRuleSets, { pageSize: 8 })

  // Which columns are switched off, driven by the Columns button beside the filter
  // (../../components/list/ColumnsButton.vue). Only a HIDDEN column is ever recorded, so this
  // never has to be kept in step with the column model above.
  //
  // ID SHIPS OFF. It is the column an operator wants when they are quoting a resource
  // into a support thread or an API call, and almost never while scanning the list —
  // so it starts hidden and is one switch away. That is the whole point of the panel:
  // a column can be available without being in the way by default.
  const columnVisibility = ref({ id: false })

  // Creating: the module's own create page. Its fields come from this resource's
  // POST body in the Azion v4 API (../lib/create-resources.js), so the form asks for
  // what the platform actually takes. The email rides along the way every route in this
  // prototype carries it.
  const route = useRoute()
  const router = useRouter()

  const create = () =>
    router.push({
      path: createResourcePath('waf-rules'),
      query: { email: route.query.email || undefined }
    })

  // Deleting is the one row action here with no undo, so the menu click only ARMS it:
  // the row is held until the dialog has been given its name back.
  const pendingDelete = ref(null)
  const deleteOpen = ref(false)

  const confirmDelete = () => {
    const row = pendingDelete.value
    if (!row) return
    ruleSets.value = ruleSets.value.filter((item) => item.id !== row.id)
    toast.success(`${row.name} deleted.`)
    pendingDelete.value = null
  }

  // The row is the way in: clicking it opens Main Settings, the tab a reader arrives
  // wanting, and the row menu's Edit lands in exactly the same place.
  const openRuleSet = (row) => router.push(`/waf-rules/${row.id}`)

  const onRowAction = (event, action, row) => {
    // EDIT OPENS THE RULE SET'S OWN PAGE. Not the generated settings page the other
    // Secure modules use: a rule set is three surfaces, not one record, so it has a
    // TABBED detail (./WafRuleDetail.vue) the same way an application does. The generated
    // route is excluded for this module in ../../router/console.routes.js for the same
    // reason, so there is exactly one place a rule set is edited.
    if (action === 'edit') {
      openRuleSet(row)
      return
    }
    if (action === 'delete') {
      pendingDelete.value = row
      deleteOpen.value = true
      return
    }
    toast.info(row.name, { description: `${action} is disabled in the demo.` })
  }

  const statusSeverity = (status) =>
    ({ Active: 'success', Inactive: 'secondary' })[status] ?? 'secondary'
</script>

<template>
  <AppLayout
    active="waf-rules"
    :breadcrumb="[{ label: 'WAF Rules' }]"
  >
    <main
      class="flex min-h-full flex-col"
      :class="accountEmpty ? 'layout-column-focused' : 'layout-column'"
    >
      <!-- THE PAGE HEADING. A first-level resource page names itself: the module name
           over one line saying what the module is, with the module's own action on the
           right. The breadcrumb says WHERE you are; the heading says WHAT this page is,
           and it gives that action one fixed home above the list instead of a control
           that rides the row narrowing it.
           The action stays here over an EMPTY list as well: where a page's action sits is
           a property of the page, not of how many rows it has. The empty state's own
           button is the in-content door — a `secondary` inside the card — not this same
           control moving.
           `size="medium"` is the first-level list scale (components/page/PageHeading.vue):
           the title names the collection, and the table under it is what the page is for.
           The parent section below is no longer `:first-child`, so `.layout-section-start`
           opens it at the boundary step — the list sits tight under the heading (theme
           semantic/layouts § "THE PAGE SHAPE"). -->
      <PageHeading
        v-if="!accountEmpty"
        size="medium"
        title="WAF Rules"
        description="Manage the rule sets that inspect traffic for injection, scripting, and file-inclusion attempts."
        :documentation="firstUse.learnMore.href"
      >
        <template #actions>
          <HeadingAction
            label="Create WAF rule set"
            kind="primary"
            icon="pi pi-plus"
            @click="create"
          />
        </template>
      </PageHeading>

      <!-- FIRST USE, IN HOME'S CONTAINER.
           The same box the first access uses on /home (./HomeEmptyState.vue) and the
           /empty-states gallery around it (../ProductEmptyStates.vue): centred in the
           viewport rather than hanging from the top edge. This screen and that one are the
           same KIND of screen — a short block answering "there is nothing here yet" — and a
           short block pinned to the top with a void under it reads as content that failed
           to load. The section step is gone with it: a centred box measures from the middle,
           and a top margin would only pull it off centre.
           CENTRED WITH AUTO MARGINS, not `min-h-full justify-center`. That pair looks
           right and does nothing: `min-height: 100%` resolves against a parent whose own
           height is `auto` (main is `min-h-full`, not `h-full`), so the box stayed at
           content height and `justify-center` then centred the content inside itself — a
           no-op. `my-auto` asks the flex parent to split its free space above and below
           this one item, which is the definition of centred; and when the block is TALLER
           than the viewport the auto margins collapse to 0 instead of clipping its top,
           which is what `flex-1 justify-center` would have done. -->
      <div
        v-if="accountEmpty"
        class="my-auto flex w-full flex-col py-(--spacing-xl)"
      >
        <ProductFirstUse :product="firstUse" />
      </div>

      <section
        v-else
        class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)"
      >
        <!-- ONE band: the controls, the filters and the rows they narrow. -->
        <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <ControlsHeader v-if="scopedRuleSets.length">
            <InputText
              v-model="search"
              size="medium"
              placeholder="Search rule sets"
              aria-label="Search rule sets"
              class="min-w-36 grow basis-(--container-2xs)"
            >
              <template #iconLeft>
                <i
                  class="pi pi-search"
                  aria-hidden="true"
                />
              </template>
            </InputText>
            <FilterButton
              v-model="filters"
              :fields="filterFields"
            />
            <ColumnsButton
              v-model="columnVisibility"
              :columns="columns"
            />
          </ControlsHeader>

          <FilterChips
            v-if="scopedRuleSets.length"
            v-model="filters"
            :fields="filterFields"
          />

          <!-- Empty = one clear next action; otherwise the borderless Table in a
               flush CardBox, framed edge-to-edge. -->
          <section
            v-if="!scopedRuleSets.length"
            class="flex min-h-0 flex-1 items-center justify-center"
          >
            <CardBox class="w-full max-w-(--container-2xl)">
              <template #content>
                <EmptyState
                  size="medium"
                  title="No WAF rule sets yet"
                  description="Create a rule set to inspect traffic for injection, scripting and file-inclusion attempts."
                  class="flex-1 rounded-(--shape-card) border border-dashed border-(--border-default) bg-(--bg-surface-raised)"
                >
                  <template #icon>
                    <span class="relative flex size-10 items-center justify-center">
                      <span
                        aria-hidden="true"
                        class="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-xl,12px)] border border-(--border-strong) bg-(--bg-canvas) opacity-5"
                      />
                      <span
                        aria-hidden="true"
                        class="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-(--shape-card) border border-(--border-strong) bg-(--bg-canvas) opacity-10"
                      />
                      <span
                        class="relative flex size-10 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface)"
                      >
                        <i
                          class="ai ai-waf-rules text-[1rem] leading-none text-(--text-default)"
                          aria-hidden="true"
                        />
                      </span>
                    </span>
                  </template>
                  <template #actions>
                    <Button
                      label="Create WAF rule set"
                      kind="secondary"
                      size="large"
                      icon="pi pi-plus"
                      @click="create"
                    />
                  </template>
                </EmptyState>
              </template>
            </CardBox>
          </section>

          <section
            v-else
            class="flex min-h-0 flex-col"
          >
            <CardBox :padded="false">
              <template #content>
                <Table
                  v-model:pagination="pagination"
                  v-model:globalFilter="search"
                  v-model:columnVisibility="columnVisibility"
                  :data="visibleRuleSets"
                  :columns="columns"
                  row-key="id"
                  enable-sorting
                  paginated
                  :page-size="8"
                  :border="false"
                  :loading="tenancyReloading"
                  @row-click="(event, row) => openRuleSet(row)"
                >
                  <!-- The principal column reads as the way in it is. -->
                  <template #cell-name="{ value }">
                    <span class="cursor-pointer truncate hover:underline">{{ value }}</span>
                  </template>

                  <template #cell-mode="{ value }">
                    <Tag
                      :label="value"
                      :severity="value === 'Blocking' ? 'danger' : 'info'"
                      size="medium"
                    />
                  </template>

                  <template #cell-threatLabels="{ row }">
                    <!-- ONE LINE, always: the first two threat types, the rest behind
                         "+N" (../../components/list/TagListCell.vue). A wrapping chip
                         list made the row as tall as its longest list. -->
                    <TagListCell
                      :items="row.threatLabels"
                      noun="threat types"
                    />
                  </template>

                  <template #cell-status="{ value }">
                    <Tag
                      :label="value"
                      :severity="statusSeverity(value)"
                      size="medium"
                    />
                  </template>
                  <!-- WHO and WHEN are two columns now, so each cell says one thing:
                       the face and the name here, the relative time next to it. -->
                  <template #cell-author="{ row }">
                    <AuthorCell
                      :author="row.author"
                      :avatar-src="row.authorAvatar"
                    />
                  </template>

                  <template #cell-lastModified="{ row }">
                    <LastModifiedCell :date="row.modifiedAt" />
                  </template>

                  <template #cell-actions="{ row }">
                    <Dropdown
                      placement="bottom-end"
                      @select="(event, action) => onRowAction(event, action, row)"
                    >
                      <Dropdown.Trigger>
                        <Tooltip text="Actions">
                          <IconButton
                            icon="pi pi-ellipsis-h"
                            kind="outlined"
                            size="small"
                            aria-label="Row actions"
                          />
                        </Tooltip>
                      </Dropdown.Trigger>
                      <Dropdown.Group>
                        <Dropdown.Option
                          value="edit"
                          label="Edit"
                        >
                          <template #left
                            ><i
                              class="pi pi-pencil"
                              aria-hidden="true"
                          /></template>
                        </Dropdown.Option>
                        <Dropdown.Option
                          value="clone"
                          label="Clone"
                        >
                          <template #left
                            ><i
                              class="pi pi-clone"
                              aria-hidden="true"
                          /></template>
                        </Dropdown.Option>
                      </Dropdown.Group>
                      <Dropdown.Group>
                        <Dropdown.Option
                          value="delete"
                          label="Delete"
                        >
                          <template #left
                            ><i
                              class="pi pi-trash"
                              aria-hidden="true"
                          /></template>
                        </Dropdown.Option>
                      </Dropdown.Group>
                    </Dropdown>
                  </template>
                </Table>
              </template>
            </CardBox>
          </section>
        </section>
      </section>

      <DeleteDialog
        v-model:open="deleteOpen"
        kind="WAF rule set"
        :name="pendingDelete?.name ?? ''"
        @confirm="confirmDelete"
      />
    </main>
  </AppLayout>
</template>
