<script setup>
  // Settings → Environments. The places a deployment lands, as records.
  //
  // ── WHY IT SITS BESIDE BUILD & DEPLOYMENT ──
  //
  // The two are one decision read from two ends. An environment declares its DEPLOYMENT
  // POLICY — one version serving, or a URL per version — and a Deployment Setting carries
  // the same field; matching them is what links an environment to the setting that serves
  // it (../../../lib/state/workload-settings.js). Put the two categories anywhere but
  // next to each other and the reader has to hold that rule in their head across a
  // navigation.
  //
  // ── WHAT A ROW SAYS ──
  //
  // The columns are the v6 record, minus the parts that are not decisions: the policy it
  // publishes with, how the edge answers /robots.txt for it, whether anything restricts
  // reaching it, and what builds it. `Deployments` is the one derived column — how many
  // workloads publish into this environment — because an environment nobody uses is the
  // one safe to change.
  //
  // LAYOUT — the DATA measure (`.layout-column`), the shape every settings category that
  // lists rows takes (./Credentials.vue). It owns its own scroll region: the shell hands
  // each view a plain flex column (see ../AccountSettings.vue).
  import CardBox from '@aziontech/webkit/card-box'
  import Dropdown from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Message from '@aziontech/webkit/message'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref } from 'vue'

  import CreateEnvironmentDrawer from '../../../components/environment/CreateEnvironmentDrawer.vue'
  import ColumnsButton from '../../../components/list/ColumnsButton.vue'
  import DeleteDialog from '../../../components/list/DeleteDialog.vue'
  import ExportButton from '../../../components/list/ExportButton.vue'
  import FilterButton from '../../../components/list/FilterButton.vue'
  import FilterChips from '../../../components/list/FilterChips.vue'
  import LastModifiedCell from '../../../components/list/LastModifiedCell.vue'
  import RefreshButton from '../../../components/list/RefreshButton.vue'
  import ControlsHeader from '../../../components/page/ControlsHeader.vue'
  import HeadingAction from '../../../components/page/HeadingAction.vue'
  import PageHeading from '../../../components/page/PageHeading.vue'
  import { DATE_PRESETS, formatDateRange, matchDate } from '../../../lib/behavior/filter-bar'
  import { useListFilters } from '../../../lib/behavior/list-state'
  import { FIT_COLUMN, TAG_COLUMN, TAG_COLUMN_WIDE } from '../../../lib/behavior/table-columns'
  import {
    branchModeLabel,
    DEPLOYMENT_POLICY_OPTIONS,
    deploymentPolicyLabel,
    environments,
    removeEnvironment,
    ROBOTS_POLICY_OPTIONS,
    robotsPolicyLabel
  } from '../../../lib/data/environments'
  import { workloadBindings } from '../../../lib/state/workload-settings'

  const HELP = 'https://www.azion.com/en/documentation/products/deploy/'

  const environmentColumns = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, hideable: false },
    {
      accessorKey: 'deploymentPolicy',
      header: 'Deployment policy',
      enableSorting: true,
      minWidth: TAG_COLUMN
    },
    {
      accessorKey: 'workloadsCount',
      header: 'Workloads',
      enableSorting: true,
      minWidth: TAG_COLUMN_WIDE
    },
    {
      accessorKey: 'robotsPolicy',
      header: 'Robots',
      enableSorting: true,
      minWidth: FIT_COLUMN
    },
    { accessorKey: 'protectionLabel', header: 'Protection', minWidth: FIT_COLUMN },
    { accessorKey: 'branchLabel', header: 'Branch tracking', minWidth: FIT_COLUMN },
    {
      accessorKey: 'lastModified',
      header: 'Last Modified',
      enableSorting: true,
      minWidth: FIT_COLUMN
    },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  // Robots ships OFF: it is a per-environment answer a reader sets once and rarely scans
  // for, and eight columns plus the actions cell is more than the width holds.
  const columnVisibility = ref({ robotsPolicy: false })

  const filterFields = [
    {
      id: 'deploymentPolicy',
      label: 'Deployment policy',
      kind: 'options',
      options: DEPLOYMENT_POLICY_OPTIONS.map((option) => ({
        value: option.value,
        label: option.label
      })),
      match: (environment, values) => values.includes(environment.deploymentPolicy)
    },
    {
      id: 'robotsPolicy',
      label: 'Robots policy',
      kind: 'options',
      options: ROBOTS_POLICY_OPTIONS.map((option) => ({
        value: option.value,
        label: option.label
      })),
      match: (environment, values) => values.includes(environment.robotsPolicy)
    },
    {
      id: 'modified',
      label: 'Last Modified',
      kind: 'range',
      options: DATE_PRESETS,
      formatValue: formatDateRange,
      match: (environment, values) => matchDate(environment.updatedAt, values)
    }
  ]

  // How many workloads publish into each environment — derived from the one pairing the
  // console shares, never counted a second time here.
  const usageByName = computed(() => {
    const counts = new Map()
    workloadBindings.value.forEach((workload) => {
      workload.environments.forEach((environment) => {
        counts.set(environment.name, (counts.get(environment.name) ?? 0) + 1)
      })
    })
    return counts
  })

  // The two derived cells. Both say what is ON rather than listing what is off: "no
  // protection" and "not tracking a branch" are the ordinary state, and spelling them out
  // on every row is a caveat repeated until nobody reads any of it.
  const protectionLabel = (environment) => {
    const enabled = Object.values(environment.protection ?? {}).filter(
      (protection) => protection?.enabled
    ).length
    if (!enabled) return ''
    const allowlist = environment.protection?.ipAllowlist
    if (enabled === 1 && allowlist?.enabled) {
      return `IP allowlist · ${allowlist.cidrs.length} ${allowlist.cidrs.length === 1 ? 'range' : 'ranges'}`
    }
    return `${enabled} enabled`
  }

  const branchLabel = (environment) => {
    const tracking = environment.branchTracking
    if (!tracking?.enabled) return ''
    return `${branchModeLabel(tracking.mode)} ${tracking.branchMatch}`
  }

  const allEnvironments = computed(() =>
    environments.value.map((environment) => ({
      ...environment,
      workloadsCount: usageByName.value.get(environment.name) ?? 0,
      protectionLabel: protectionLabel(environment),
      branchLabel: branchLabel(environment)
    }))
  )

  const {
    filters,
    search,
    pagination,
    visibleRows: visibleEnvironments,
    loading,
    refresh
  } = useListFilters(filterFields, allEnvironments, { pageSize: 10 })

  const tableRef = ref(null)

  const createOpen = ref(false)
  const newEnvironment = () => {
    createOpen.value = true
  }

  const onEnvironmentCreated = (environment) => {
    toast.success(`${environment.name} created.`, {
      description: `Deployment Settings set to ${deploymentPolicyLabel(environment.deploymentPolicy)} can serve it.`
    })
  }

  // Production is the environment every workload publishes into, so it is not removable
  // — the menu does not offer it, and the store refuses it either way.
  const pendingDelete = ref(null)
  const deleteOpen = ref(false)

  const deleteDescription = computed(() => {
    const count = pendingDelete.value?.workloadsCount ?? 0
    if (count === 0) {
      return 'The selected environment will be deleted. No workload publishes into it. Check the'
    }
    return `The selected environment will be deleted, and ${count} ${count === 1 ? 'workload' : 'workloads'} will stop publishing into it. Check the`
  })

  const confirmDelete = () => {
    const row = pendingDelete.value
    if (!row) return
    if (removeEnvironment(row.id)) toast.success(`${row.name} deleted`)
    pendingDelete.value = null
  }

  const onEnvironmentAction = (event, value, row) => {
    if (value === 'delete') {
      pendingDelete.value = row
      deleteOpen.value = true
      return
    }
    toast.info(`Editing ${row.name}`, {
      description: `${deploymentPolicyLabel(row.deploymentPolicy)} · Robots: ${robotsPolicyLabel(row.robotsPolicy)}`
    })
  }
</script>

<template>
  <div class="min-h-0 flex-1 overflow-auto">
    <section class="layout-column layout-boundary flex min-w-0 flex-col">
      <PageHeading
        title="Environments"
        description="Where a deployment lands. Each one declares how its URLs work, who may reach it, and what builds it."
        :documentation="HELP"
      >
        <template #actions>
          <HeadingAction
            label="Create Environment"
            kind="outlined"
            icon="pi pi-plus"
            @click="newEnvironment"
          />
        </template>
      </PageHeading>

      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
        <!-- THE LINK BETWEEN THE TWO CATEGORIES, said once. An environment's deployment
             policy is not a preference: it decides which Deployment Settings can ever
             serve it, which is the whole reason these two pages sit side by side.
             It sits at the SECTION step, beside the band rather than inside it: the
             controls, the chips and the table are one thing — a set of rows and the two
             controls that narrow it — and a banner joined to them at the group step reads
             as part of the narrowing. Build & Deployment places its own the same way. -->
        <Message
          severity="info"
          size="small"
          closable
          label="An environment's deployment policy decides which Deployment Settings can serve it — only a setting with the same policy can be linked. Build & Deployment holds those settings and the pairing."
        />

        <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <ControlsHeader>
            <FilterButton
              v-model="filters"
              :fields="filterFields"
            />
            <InputText
              v-model="search"
              size="medium"
              placeholder="Search environments"
              aria-label="Search environments"
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
                filename="environments.csv"
              />
              <ColumnsButton
                v-model="columnVisibility"
                :columns="environmentColumns"
              />
            </template>
          </ControlsHeader>

          <FilterChips
            v-model="filters"
            :fields="filterFields"
          />

          <CardBox :padded="false">
            <template #content>
              <Table
                ref="tableRef"
                v-model:pagination="pagination"
                v-model:globalFilter="search"
                v-model:columnVisibility="columnVisibility"
                :data="visibleEnvironments"
                :columns="environmentColumns"
                row-key="id"
                enable-sorting
                paginated
                :page-size="10"
                :border="false"
                :loading="loading"
              >
                <template #cell-name="{ value }">
                  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <span class="truncate">{{ value }}</span>
                  </div>
                </template>

                <!-- THE FIELD THE OTHER PAGE MATCHES ON. Tagged rather than plain,
                     because it is the environment's most consequential property and the
                     column a reader scans when they are working out why a setting is not
                     offered. -->
                <template #cell-deploymentPolicy="{ value }">
                  <Tag
                    :label="deploymentPolicyLabel(value)"
                    severity="info"
                    size="medium"
                  />
                </template>

                <template #cell-workloadsCount="{ value }">
                  <span
                    class="truncate"
                    :class="value ? '' : 'text-(--text-disabled)'"
                  >
                    {{ value === 1 ? '1 workload' : `${value} workloads` }}
                  </span>
                </template>

                <template #cell-robotsPolicy="{ value }">
                  <span class="truncate">{{ robotsPolicyLabel(value) }}</span>
                </template>

                <!-- The two derived cells read as "nothing set" when nothing is, in the
                     disabled ink every other list uses for an absent value. -->
                <template #cell-protectionLabel="{ value }">
                  <span
                    class="truncate"
                    :class="value ? '' : 'text-(--text-disabled)'"
                  >
                    {{ value || 'Open' }}
                  </span>
                </template>

                <template #cell-branchLabel="{ value }">
                  <span
                    class="truncate"
                    :class="value ? '' : 'text-(--text-disabled)'"
                  >
                    {{ value || 'Not tracking' }}
                  </span>
                </template>

                <template #cell-lastModified="{ row }">
                  <LastModifiedCell :date="row.updatedAt || ''" />
                </template>

                <template #cell-actions="{ row }">
                  <Dropdown
                    placement="bottom-end"
                    @select="(event, value) => onEnvironmentAction(event, value, row)"
                  >
                    <Dropdown.Trigger>
                      <Tooltip text="Row actions">
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
                        <template #left>
                          <i
                            class="pi pi-pencil"
                            aria-hidden="true"
                          />
                        </template>
                      </Dropdown.Option>
                    </Dropdown.Group>
                    <!-- Production has no delete: every workload publishes into it. -->
                    <Dropdown.Group v-if="row.id !== 'env-production'">
                      <Dropdown.Option
                        value="delete"
                        label="Delete"
                      >
                        <template #left>
                          <i
                            class="pi pi-trash"
                            aria-hidden="true"
                          />
                        </template>
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

    <CreateEnvironmentDrawer
      v-model:open="createOpen"
      @create="onEnvironmentCreated"
    />

    <DeleteDialog
      v-model:open="deleteOpen"
      kind="Environment"
      :name="pendingDelete?.name ?? ''"
      :description="deleteDescription"
      @confirm="confirmDelete"
    />
  </div>
</template>
