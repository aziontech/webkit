<script setup>
  // Manage Resources — the console's resource manager, modeled on the cloud
  // "Manage resources" surface. It renders the tenancy hierarchy (Organization →
  // Group → Workspace, since "brand", "reseller" and "client" were retired — see
  // ../../lib/state/accounts.js) as an EXPANDABLE tree table with checkbox
  // multi-select, a toolbar of bulk actions, and a right info panel whose
  // Permissions / Labels tabs reflect the current selection.
  //
  // The webkit Table has no tree engine, so the tree is laid out by the store:
  // `expanded` holds the open node ids and `flattenTree` emits only the visible
  // rows tagged with depth + hasChildren — the same function the switcher's own
  // tree uses (../../components/shell/SwitchAccountDialog.vue), so the two cannot
  // drift on indent, chevron or tier label. The Name cell renders the chevron and
  // the indentation. Selection rides the Table's own enableRowSelection.
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Checkbox from '@aziontech/webkit/checkbox'
  import Currency from '@aziontech/webkit/currency'
  import Dropdown from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import Message from '@aziontech/webkit/message'
  import TabView from '@aziontech/webkit/tab-view'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref } from 'vue'

  import IdCell from '../../components/list/IdCell.vue'
  import TagListCell from '../../components/list/TagListCell.vue'
  import PageHeading from '../../components/page/PageHeading.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import {
    accountInitials,
    accountTypeOf,
    flattenTree,
    useAccounts
  } from '../../lib/state/accounts.js'

  // Where `Documentation` goes. The docs ROOT: the account hierarchy has no entry in
  // lib/data/product-empty-states.js (that registry covers the product modules), and an
  // unverified deep link is worse than the index. Replace when the topic URL is known.
  const HELP = 'https://www.azion.com/en/documentation/'

  const { accounts, currentAccountId } = useAccounts()

  // This table is rendered in COMPOSITION mode (the rows animate their own height), so
  // its chip columns cannot take the data-driven `minWidth` the other lists use — that
  // one is MEASURED, and a measurement needs a column the table owns end to end. Here
  // every row is its own flex container, so a content-sized column would resolve to a
  // different width per row and drift the header away from the body. These say the
  // width as an inline flex basis instead, hand-measured against the widest content
  // each column ever shows. Inline so it beats the cell's own
  // `data-[grow=1]:flex-[1_0_5rem]` without needing `!important`.
  //
  // They are LOCAL numbers, not the shared floors in ../../lib/behavior/table-columns.js:
  // those are floors for the measurement to grow from, and a floor is by definition
  // below what a column ends up at — borrowing one here clipped the `retail` / `prod`
  // chips by 3px, with nothing to grow them back.
  //
  // Type is the widest: its chip carries a tier GLYPH as well as a label, so
  // `Organization` needs 129px where a bare `Active` needs 82 and two labels need 109.
  const tagColumnStyle = { flex: '0 0 104px' }
  const tagColumnWideStyle = { flex: '0 0 136px' }
  const labelsColumnStyle = { flex: '0 0 112px' }

  // Name is the one column here with no natural width — it carries up to four levels of
  // indentation, a chevron and a tier glyph before the name — and `grow` cannot say so.
  // The weight is `1 | 2 | 3` (a `data-[grow=N]` variant, so the 5 this column used to
  // ask for matched NOTHING and it silently became the NARROWEST column in the table at
  // 60px), and it sets `flex-shrink: 0`, so with eight columns and the info panel open
  // this table has less room than the bases add up to and something has to give.
  //
  // `4 1 0` makes Name the column that gives: it takes four shares of what the chip
  // columns handed back, and yields first when there is nothing to take, rather than the
  // table growing a horizontal scrollbar that pushes the row-actions menu off screen.
  // Not more than four shares — past that the three remaining weighted columns drop
  // below the width their own headers need and Last accessed ellipsizes.
  const nameColumnStyle = { flex: '4 1 0' }

  // --- Tree state ---------------------------------------------------------
  // Open the path down to the current account so the tree reads on load.
  const expanded = ref(new Set([0, 1, 4471, 9032]))
  const isExpanded = (id) => expanded.value.has(id)
  const toggle = (id) => {
    const next = new Set(expanded.value)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    expanded.value = next
  }
  // Reassigning `expanded` (never mutating in place) is what makes this reactive.
  const visibleRows = computed(() => flattenTree(expanded.value))

  // Fluid accordion: a row animates its HEIGHT (0 ↔ natural) while fading on
  // reveal and collapse, so the list grows/shrinks smoothly and the rows below
  // reflow with it. Driven by <TransitionGroup> JS hooks (css:false) via the Web
  // Animations API — height is a layout property, so siblings follow. WAAPI is
  // used (not CSS classes) so it never conflicts with Table.Row's own
  // transition-colors. TransitionGroup skips the initial render, so only rows
  // added/removed by expand/collapse animate. Reduced motion opts out.
  const REVEAL_MS = 220
  const REVEAL_EASE = 'cubic-bezier(0.39, 0.57, 0.56, 1)'
  const reducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  const animateRowHeight = (el, done, reverse) => {
    if (reducedMotion()) return done()
    const frames = [
      { height: '0px', opacity: 0 },
      { height: `${el.offsetHeight}px`, opacity: 1 }
    ]
    el.style.overflow = 'hidden'
    const animation = el.animate(reverse ? [...frames].reverse() : frames, {
      duration: REVEAL_MS,
      easing: REVEAL_EASE
    })
    animation.onfinish = () => {
      el.style.overflow = ''
      done()
    }
  }
  const onRowEnter = (el, done) => animateRowHeight(el, done, false)
  const onRowLeave = (el, done) => animateRowHeight(el, done, true)

  // --- Selection ----------------------------------------------------------
  const rowSelection = ref({})
  const selectedRows = computed(() =>
    accounts.value.filter((account) => rowSelection.value[String(account.id)])
  )
  const selectedCount = computed(() => selectedRows.value.length)
  const hasSelection = computed(() => selectedCount.value > 0)
  const clearSelection = () => {
    rowSelection.value = {}
  }
  // Selection is hand-rolled (composition mode): a plain id→true map, updated
  // immutably so the computed views react.
  const setRowSelected = (row, selected) => {
    const next = { ...rowSelection.value }
    if (selected) next[String(row.id)] = true
    else delete next[String(row.id)]
    rowSelection.value = next
  }
  const toggleRow = (row) => setRowSelected(row, !rowSelection.value[String(row.id)])
  // Select-all reflects the currently VISIBLE rows (tri-state via indeterminate).
  const allVisibleSelected = computed(
    () =>
      visibleRows.value.length > 0 &&
      visibleRows.value.every((row) => rowSelection.value[String(row.id)])
  )
  const someVisibleSelected = computed(
    () =>
      !allVisibleSelected.value &&
      visibleRows.value.some((row) => rowSelection.value[String(row.id)])
  )
  const toggleSelectAll = (selected) => {
    const next = {}
    if (selected) visibleRows.value.forEach((row) => (next[String(row.id)] = true))
    rowSelection.value = next
  }

  const statusSeverity = (status) =>
    ({ active: 'success', suspended: 'danger', pending: 'warning' })[status] ?? 'secondary'
  const statusLabel = (status) => (status ? status[0].toUpperCase() + status.slice(1) : '')

  // --- Toolbar / row actions (stubbed per scope) --------------------------
  const infoPanelOpen = ref(true)
  const toggleInfoPanel = () => {
    infoPanelOpen.value = !infoPanelOpen.value
  }
  const refresh = () => toast.success('Resources refreshed.')
  const createProject = () => toast.info('Create project is disabled in the demo.')
  const createFolder = () => toast.info('Create folder is disabled in the demo.')

  const bulkAction = (verb) => {
    if (!hasSelection.value) return
    const names = selectedRows.value.map((row) => row.name).join(', ')
    toast.info(`${verb} ${selectedCount.value} resource${selectedCount.value === 1 ? '' : 's'}.`, {
      description: names
    })
  }
  const onRowAction = (event, value, row) => {
    if (value === 'expand') return toggle(row.id)
    toast.info(row.name, { description: `${accountTypeOf(row.type).typeLabel} · ID ${row.id}` })
  }
  const pendingDeletion = () => toast.info('No resources are pending deletion.')

  // --- Info panel ---------------------------------------------------------
  const infoTab = ref('permissions')
  const infoTabs = [
    { value: 'permissions', label: 'Permissions' },
    { value: 'labels', label: 'Labels' }
  ]
  const selectionTitle = computed(() =>
    selectedCount.value === 0
      ? 'No resource selected'
      : `${selectedCount.value} resource${selectedCount.value === 1 ? '' : 's'} selected`
  )
  // A single-selection resource drives the detailed panel content.
  const focused = computed(() => (selectedCount.value === 1 ? selectedRows.value[0] : null))
  // Example role bindings, so the Permissions tab reads like the console.
  const roleBindings = [
    { role: 'Owner', members: 2 },
    { role: 'Editor', members: 5 },
    { role: 'Viewer', members: 11 }
  ]
  const focusedLabels = computed(() => focused.value?.labels ?? [])
</script>

<template>
  <AppLayout
    active="resources"
    :breadcrumb="[{ label: 'Manage Resources' }]"
  >
    <main class="flex h-full min-h-0 flex-col">
      <PageHeading
        title="Manage Resources"
        description="Organize accounts into a hierarchy of brands, resellers, groups, and clients."
        :documentation="HELP"
      >
        <template #actions>
          <Tooltip text="Refresh">
            <IconButton
              icon="pi pi-refresh"
              kind="outlined"
              size="large"
              aria-label="Refresh resources"
              @click="refresh"
            />
          </Tooltip>
          <Button
            :label="infoPanelOpen ? 'Hide info panel' : 'Show info panel'"
            :icon="infoPanelOpen ? 'pi pi-angle-double-right' : 'pi pi-angle-double-left'"
            kind="text"
            size="large"
            @click="toggleInfoPanel"
          />
        </template>
      </PageHeading>

      <!-- Action toolbar: create on the left, bulk actions gated by selection. -->
      <div class="layout-section-start flex flex-wrap items-center gap-(--spacing-xs)">
        <Button
          label="Create project"
          icon="pi pi-plus"
          kind="primary"
          size="medium"
          @click="createProject"
        />
        <Button
          label="Create folder"
          icon="pi pi-folder"
          kind="outlined"
          size="medium"
          @click="createFolder"
        />
        <div
          class="mx-(--spacing-xs) h-(--size-5) w-px bg-(--border-muted)"
          role="separator"
          aria-orientation="vertical"
        />
        <Button
          label="Move"
          icon="pi pi-arrow-right-arrow-left"
          kind="outlined"
          size="medium"
          :disabled="!hasSelection"
          @click="bulkAction('Move')"
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          kind="outlined"
          size="medium"
          :disabled="!hasSelection"
          @click="bulkAction('Delete')"
        />
        <Button
          label="Tags"
          icon="pi pi-tag"
          kind="outlined"
          size="medium"
          :disabled="!hasSelection"
          @click="bulkAction('Tag')"
        />
      </div>

      <!-- Split: the resource tree + the info panel. -->
      <div class="layout-group-start flex min-h-0 flex-1 gap-(--spacing-lg)">
        <section class="flex min-w-0 flex-1 flex-col gap-(--spacing-sm)">
          <div class="flex items-center justify-between">
            <h2 class="text-heading-xs text-(--text-default)">Resources</h2>
            <Button
              v-if="hasSelection"
              label="Clear selection"
              kind="text"
              size="small"
              @click="clearSelection"
            />
          </div>

          <CardBox :padded="false">
            <template #content>
              <!-- Composition mode: rendering the rows ourselves lets a
                   <TransitionGroup> animate each row's HEIGHT on reveal/collapse
                   (the data-driven Table renders rows internally, so it can't). -->
              <Table
                max-height="calc(100dvh - 20rem)"
                :border="false"
              >
                <Table.Header frozen>
                  <Table.Row>
                    <Table.HeadCell kind="checkbox">
                      <Checkbox
                        binary
                        :model-value="allVisibleSelected"
                        :indeterminate="someVisibleSelected"
                        aria-label="Select all resources"
                        @update:model-value="toggleSelectAll"
                      />
                    </Table.HeadCell>
                    <!-- Widest column by a distance: it carries four levels of
                         indentation, a chevron and a glyph BEFORE the name, so at
                         depth 3 there has to be room left to render a workspace's
                         name at all. It takes what the chip columns give back
                         (`nameColumnStyle` above) rather than a `grow` weight. -->
                    <Table.HeadCell
                      principal
                      :style="nameColumnStyle"
                      >Name</Table.HeadCell
                    >
                    <Table.HeadCell :grow="1">ID</Table.HeadCell>
                    <Table.HeadCell :style="tagColumnWideStyle">Type</Table.HeadCell>
                    <Table.HeadCell :grow="1">Last accessed</Table.HeadCell>
                    <Table.HeadCell :style="tagColumnStyle">Status</Table.HeadCell>
                    <Table.HeadCell
                      :grow="1"
                      align="end"
                    >
                      <span class="inline-flex items-center gap-(--spacing-xxs)">
                        Charges
                        <Tooltip text="Estimated month-to-date charges.">
                          <i
                            class="pi pi-question-circle text-body-xs text-(--text-muted)"
                            aria-hidden="true"
                          />
                        </Tooltip>
                      </span>
                    </Table.HeadCell>
                    <Table.HeadCell :style="labelsColumnStyle">Labels</Table.HeadCell>
                    <Table.HeadCell kind="action" />
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  <!-- Each row is wrapped in a single-root <div> that is the
                       transition target: Table.Row's template leads with an HTML
                       comment (a multi-root/fragment component), and Vue can't
                       attach a `leave` hook to a fragment root — so the wrapper is
                       what animates. css:false runs the JS height hooks; the
                       wrapper animating height in flow makes siblings reflow. -->
                  <TransitionGroup
                    :css="false"
                    @enter="onRowEnter"
                    @leave="onRowLeave"
                  >
                    <div
                      v-for="row in visibleRows"
                      :key="row.id"
                    >
                      <Table.Row
                        :selected="!!rowSelection[String(row.id)]"
                        class="cursor-pointer"
                        @click="toggleRow(row)"
                      >
                        <Table.Cell kind="checkbox">
                          <Checkbox
                            binary
                            :model-value="!!rowSelection[String(row.id)]"
                            :aria-label="`Select ${row.name}`"
                            @click.stop
                            @update:model-value="(value) => setRowSelected(row, value)"
                          />
                        </Table.Cell>

                        <!-- Name: chevron + indentation + type glyph + name.
                             One step per level is `--spacing-md`, not `-lg`:
                             the glyph already marks the level, and 24px a level
                             spent a third of the column on empty space by the
                             time the tree reached a client. -->
                        <Table.Cell
                          principal
                          :style="nameColumnStyle"
                        >
                          <span
                            class="flex min-w-0 items-center gap-(--spacing-xxs)"
                            :style="{ paddingLeft: `calc(var(--spacing-md) * ${row.depth})` }"
                          >
                            <Tooltip
                              v-if="row.hasChildren"
                              :text="isExpanded(row.id) ? 'Collapse' : 'Expand'"
                            >
                              <IconButton
                                :icon="
                                  isExpanded(row.id) ? 'pi pi-chevron-down' : 'pi pi-chevron-right'
                                "
                                kind="outlined"
                                size="small"
                                :aria-label="isExpanded(row.id) ? 'Collapse' : 'Expand'"
                                :aria-expanded="isExpanded(row.id)"
                                @click.stop="toggle(row.id)"
                              />
                            </Tooltip>
                            <span
                              v-else
                              class="size-(--size-7) shrink-0"
                              aria-hidden="true"
                            />
                            <!-- Groups and Workspaces get an avatar: they are the
                                 tiers an operator acts as (a switch lands on a
                                 Workspace), so they carry the same kind of mark as
                                 the header pill. An Organization is structure — its
                                 tier glyph is what it is, and that keeps the tree
                                 scannable. -->
                            <Avatar
                              v-if="row.type === 'group' || row.type === 'workspace'"
                              :label="accountInitials(row.name)"
                              size="small"
                              kind="square"
                            />
                            <i
                              v-else
                              :class="accountTypeOf(row.type).icon"
                              class="shrink-0 text-body-sm text-(--text-muted)"
                              aria-hidden="true"
                            />
                            <span class="truncate text-label-sm text-(--text-default)">
                              {{ row.name }}
                            </span>
                            <i
                              v-if="row.id === currentAccountId"
                              class="pi pi-check shrink-0 text-body-xs text-(--text-muted)"
                              aria-hidden="true"
                            />
                          </span>
                        </Table.Cell>

                        <!-- The id renders through the shared cell, so it can be
                             copied here the way it can in every module list
                             (../../components/list/IdCell.vue) — the id is the one
                             thing on this row an operator pastes elsewhere. An
                             Organization has no id of its own, and the em dash is
                             this column's "not applicable" rather than a blank. -->
                        <Table.Cell :grow="1">
                          <span
                            v-if="row.type === 'organization'"
                            class="text-body-sm text-(--text-muted)"
                            >—</span
                          >
                          <IdCell
                            v-else
                            :value="row.id"
                            :resource="row.typeLabel.toLowerCase()"
                          />
                        </Table.Cell>

                        <Table.Cell :style="tagColumnWideStyle">
                          <Tag
                            :label="row.typeLabel"
                            :icon="accountTypeOf(row.type).icon"
                            :severity="accountTypeOf(row.type).severity"
                            size="small"
                          />
                        </Table.Cell>

                        <Table.Cell :grow="1">
                          <span class="text-body-sm text-(--text-muted)">
                            {{ row.lastAccessed || '—' }}
                          </span>
                        </Table.Cell>

                        <Table.Cell :style="tagColumnStyle">
                          <Tag
                            v-if="row.status"
                            :label="statusLabel(row.status)"
                            :severity="statusSeverity(row.status)"
                            size="medium"
                          />
                          <span
                            v-else
                            class="text-body-sm text-(--text-muted)"
                            >—</span
                          >
                        </Table.Cell>

                        <Table.Cell
                          :grow="1"
                          align="end"
                        >
                          <Currency
                            v-if="row.charges"
                            :value="row.charges"
                            size="small"
                          />
                          <span
                            v-else
                            class="text-body-sm text-(--text-muted)"
                            >—</span
                          >
                        </Table.Cell>

                        <Table.Cell :style="labelsColumnStyle">
                          <!-- ONE LINE, always: labels that outgrow the column go behind
                               "+N" instead of wrapping and making this row taller than
                               its neighbours (../../components/list/TagListCell.vue).
                               The component renders the em dash when there are none. -->
                          <TagListCell
                            :items="row.labels ?? []"
                            noun="labels"
                          />
                        </Table.Cell>

                        <Table.Cell kind="action">
                          <span @click.stop>
                            <Dropdown
                              placement="bottom-end"
                              @select="(event, value) => onRowAction(event, value, row)"
                            >
                              <Dropdown.Trigger>
                                <Tooltip text="Resource actions">
                                  <IconButton
                                    icon="pi pi-ellipsis-v"
                                    kind="outlined"
                                    size="small"
                                    aria-label="Resource actions"
                                  />
                                </Tooltip>
                              </Dropdown.Trigger>
                              <Dropdown.Group>
                                <Dropdown.Option
                                  value="view"
                                  label="View details"
                                />
                                <Dropdown.Option
                                  v-if="row.hasChildren"
                                  value="expand"
                                  :label="isExpanded(row.id) ? 'Collapse' : 'Expand'"
                                />
                              </Dropdown.Group>
                              <Dropdown.Group>
                                <Dropdown.Option
                                  value="move"
                                  label="Move"
                                />
                                <Dropdown.Option
                                  value="delete"
                                  label="Delete"
                                />
                              </Dropdown.Group>
                            </Dropdown>
                          </span>
                        </Table.Cell>
                      </Table.Row>
                    </div>
                  </TransitionGroup>
                </Table.Body>
              </Table>
            </template>
          </CardBox>

          <button
            type="button"
            class="self-start text-label-sm text-(--text-link) transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)"
            @click="pendingDeletion"
          >
            Resources pending deletion
          </button>
        </section>

        <!-- Info panel: Permissions / Labels for the current selection. -->
        <aside
          v-if="infoPanelOpen"
          class="hidden w-(--container-xs) shrink-0 lg:block"
          aria-label="Resource details"
        >
          <CardBox>
            <template #content>
              <div class="flex flex-col gap-(--spacing-md)">
                <h2 class="text-heading-xs text-(--text-default)">{{ selectionTitle }}</h2>

                <TabView v-model:value="infoTab">
                  <TabView.List>
                    <TabView.Item
                      v-for="tab in infoTabs"
                      :key="tab.value"
                      :value="tab.value"
                      :label="tab.label"
                    />
                  </TabView.List>
                </TabView>

                <!-- Empty: nothing selected. -->
                <Message
                  v-if="!hasSelection"
                  severity="info"
                  label="Select at least one resource."
                />

                <!-- Permissions -->
                <template v-else-if="infoTab === 'permissions'">
                  <div
                    v-if="focused"
                    class="flex flex-col gap-(--spacing-md)"
                  >
                    <div class="flex items-center gap-(--spacing-xs)">
                      <Tag
                        :label="focused.typeLabel ?? accountTypeOf(focused.type).typeLabel"
                        :icon="accountTypeOf(focused.type).icon"
                        :severity="accountTypeOf(focused.type).severity"
                        size="small"
                      />
                      <span class="truncate text-label-md text-(--text-default)">
                        {{ focused.name }}
                      </span>
                    </div>
                    <ul class="flex flex-col gap-(--spacing-xs)">
                      <li
                        v-for="binding in roleBindings"
                        :key="binding.role"
                        class="flex items-center justify-between rounded-(--shape-elements) bg-(--bg-surface-raised) px-(--spacing-sm) py-(--spacing-xs)"
                      >
                        <span class="text-label-sm text-(--text-default)">{{ binding.role }}</span>
                        <span class="text-body-xs text-(--text-muted)">
                          {{ binding.members }} member{{ binding.members === 1 ? '' : 's' }}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <Message
                    v-else
                    severity="info"
                    label="Select a single resource to view its role bindings."
                  />
                </template>

                <!-- Labels -->
                <template v-else>
                  <div
                    v-if="focused && focusedLabels.length"
                    class="flex flex-wrap gap-(--spacing-xs)"
                  >
                    <Tag
                      v-for="label in focusedLabels"
                      :key="label"
                      :label="label"
                      severity="secondary"
                      size="medium"
                    />
                  </div>
                  <Message
                    key="message-3"
                    v-else-if="focused"
                    severity="info"
                    label="This resource has no labels."
                  />
                  <Message
                    key="message-4"
                    v-else
                    severity="info"
                    label="Select a single resource to view its labels."
                  />
                </template>
              </div>
            </template>
          </CardBox>
        </aside>
      </div>
    </main>
  </AppLayout>
</template>
