<script setup>
  import CardBox from '@aziontech/webkit/card-box'
  import Dropdown from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Message from '@aziontech/webkit/message'
  import Select from '@aziontech/webkit/select'
  import Switch from '@aziontech/webkit/switch'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, reactive, ref } from 'vue'

  import DeploymentSettingsDrawer from '../../../components/deployment/DeploymentSettingsDrawer.vue'
  import WorkloadBindings from '../../../components/deployment/WorkloadBindings.vue'
  import FieldRow from '../../../components/form/FieldRow.vue'
  import SettingsSaveBar from '../../../components/form/SettingsSaveBar.vue'
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
  import Section from '../../../components/page/Section.vue'
  import { DATE_PRESETS, formatDateRange, matchDate } from '../../../lib/behavior/filter-bar'
  import { saveGroup, useBaseline } from '../../../lib/behavior/forms'
  import { useListFilters } from '../../../lib/behavior/list-state'
  import { FIT_COLUMN, TAG_COLUMN, TAG_COLUMN_WIDE } from '../../../lib/behavior/table-columns'
  import {
    applyDefaultsToWorkspace,
    azionDefaultStrategy,
    BINDING_POLICIES,
    bindingPolicyLabel,
    DEPLOYMENT_POLICIES,
    deploymentPolicyLabel,
    newWorkloadDefaults,
    removeStrategy,
    saveWorkloadDefaults,
    strategyStatusOptions,
    strategyTypeLabel,
    workspaceStrategies
  } from '../../../lib/data/deployment-strategies'
  import { tenancyRows } from '../../../lib/state/tenancy-scope'
  import { reachFor, reachLabel } from '../../../lib/state/workload-settings'

  const HELP = 'https://www.azion.com/en/documentation/products/deploy/'

  const defaults = newWorkloadDefaults.value
  const form = reactive({
    bindingPolicy: defaults.bindingPolicy,
    deploymentPolicy: defaults.deploymentPolicy,
    applyToExisting: false
  })

  const saving = ref(false)
  const { dirty, commit } = useBaseline(form)
  const snapshot = ref(JSON.parse(JSON.stringify(form)))

  const save = () =>
    saveGroup(saving, 'Deployment defaults saved.', () => {
      saveWorkloadDefaults({
        bindingPolicy: form.bindingPolicy,
        deploymentPolicy: form.deploymentPolicy
      })
      if (form.applyToExisting) {
        const count = applyDefaultsToWorkspace()
        toast.info(`${count} settings updated.`, {
          description: 'Every environment bound to them routes the new way on its next deploy.'
        })
      }
      form.applyToExisting = false
      commit()
      snapshot.value = JSON.parse(JSON.stringify(form))
    })

  const discard = () => {
    Object.assign(form, JSON.parse(JSON.stringify(snapshot.value)))
  }

  const settingColumns = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, hideable: false },
    {
      accessorKey: 'workloadsCount',
      header: 'Workloads',
      enableSorting: true,
      minWidth: TAG_COLUMN_WIDE
    },
    { accessorKey: 'type', header: 'Type', enableSorting: true, minWidth: TAG_COLUMN },
    {
      accessorKey: 'bindingPolicy',
      header: 'Binding policy',
      enableSorting: true,
      minWidth: FIT_COLUMN
    },
    {
      accessorKey: 'deploymentPolicy',
      header: 'Deployment policy',
      enableSorting: true,
      minWidth: FIT_COLUMN
    },
    { accessorKey: 'status', header: 'Status', enableSorting: true, minWidth: TAG_COLUMN },
    {
      accessorKey: 'lastModified',
      header: 'Last Modified',
      enableSorting: true,
      minWidth: FIT_COLUMN
    },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  const columnVisibility = ref({ type: false })

  const REACH_OPTIONS = [
    { value: 'shared', label: 'Shared' },
    { value: 'dedicated', label: 'Dedicated' },
    { value: 'unused', label: 'Unused' }
  ]

  const reachOf = (setting) => {
    if (setting.workloadsCount > 1) return 'shared'
    return setting.workloadsCount === 1 ? 'dedicated' : 'unused'
  }

  const filterFields = [
    {
      id: 'reach',
      label: 'Reach',
      kind: 'options',
      options: REACH_OPTIONS,
      match: (setting, values) => values.includes(reachOf(setting))
    },
    {
      id: 'status',
      label: 'Status',
      kind: 'options',
      options: strategyStatusOptions,
      match: (setting, values) => values.includes(setting.status)
    },
    {
      id: 'modified',
      label: 'Last Modified',
      kind: 'range',
      options: DATE_PRESETS,
      formatValue: formatDateRange,
      match: (setting, values) => !setting.updatedAt || matchDate(setting.updatedAt, values)
    }
  ]

  const allSettings = computed(() =>
    [azionDefaultStrategy, ...tenancyRows(workspaceStrategies.value, 'deployment-settings')].map(
      (strategy) => {
        const reach = reachFor(strategy.id)
        return {
          ...strategy,
          workloadsCount: reach?.count ?? 0,
          workloadNames: (reach?.workloads ?? []).map((workload) => workload.name),
          shared: Boolean(reach?.shared)
        }
      }
    )
  )

  const {
    filters,
    search,
    pagination,
    visibleRows: visibleSettings,
    loading,
    refresh
  } = useListFilters(filterFields, allSettings, { pageSize: 10 })

  const tableRef = ref(null)

  const reachTooltip = (row) =>
    row.workloadNames.length
      ? row.workloadNames.join(' · ')
      : 'No environment publishes with this setting yet.'

  const settingsOpen = ref(false)
  const newSettings = () => {
    settingsOpen.value = true
  }

  const onStrategyCreated = (strategy) => {
    toast.success(`${strategy.name} created.`, {
      description: 'Point an environment at it under All workloads to start publishing with it.'
    })
  }

  const pendingDelete = ref(null)
  const deleteOpen = ref(false)

  const deleteDescription = computed(() => {
    const count = pendingDelete.value?.workloadsCount ?? 0
    if (count === 0) {
      return 'The selected Deployment setting will be deleted. No environment publishes with it. Check the'
    }
    return `The selected Deployment setting will be deleted, and ${reachLabel(count)} will fall back to Azion Default on the next deploy. Check the`
  })

  const confirmDelete = () => {
    const row = pendingDelete.value
    if (!row) return
    if (removeStrategy(row.id)) toast.success(`${row.name} deleted`)
    pendingDelete.value = null
  }

  const onSettingAction = (event, value, row) => {
    if (value === 'delete') {
      pendingDelete.value = row
      deleteOpen.value = true
      return
    }
    const copy = {
      edit: `Editing ${row.name}`,
      duplicate: `Duplicating ${row.name}`
    }
    toast.info(copy[value] ?? row.name, {
      description: `${strategyTypeLabel(row.type)} · ${reachLabel(row.workloadsCount)} · ${bindingPolicyLabel(row.bindingPolicy)} · ${deploymentPolicyLabel(row.deploymentPolicy)}`
    })
  }
</script>

<template>
  <div class="min-h-0 flex-1 overflow-auto">
    <section class="layout-column layout-boundary flex min-w-0 flex-col">
      <PageHeading
        title="Build & Deployment"
        description="Every environment is linked to a Deployment Setting automatically, matching its deployment policy. Point two environments at the same setting when they should publish together."
        :documentation="HELP"
      >
        <template #actions>
          <HeadingAction
            label="Create Deployment Settings"
            kind="outlined"
            icon="pi pi-plus"
            @click="newSettings"
          />
        </template>
      </PageHeading>

      <section class="layout-section-start flex min-w-0 flex-col">
        <Message
          severity="info"
          size="small"
          closable
          label="A Deployment Setting says how a deploy routes: its binding policy, its deployment policy, and its rollout defaults. Every environment is linked to one automatically, matching its own deployment policy — and only a matching setting can be chosen. Point two environments at the same setting and a deploy into it publishes to both."
        />

        <div class="mt-(--layout-section-gap) flex min-w-0 flex-col">
          <Section
            stacked
            anchor
            :divided="false"
            title="New workload defaults"
            hint="What the Deployment Setting created with the next environment is born with."
          >
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <FieldRow
                    title="Binding policy"
                    description="Whether a version locks the resource IDs it shipped with. Changing it does not touch the settings that already exist."
                  >
                    <Select
                      v-model="form.bindingPolicy"
                      size="large"
                      class="w-full"
                      :disabled="saving"
                      :display-value="bindingPolicyLabel"
                    >
                      <Select.Trigger aria-label="Default binding policy" />
                      <Select.Content>
                        <Select.Option
                          v-for="option in BINDING_POLICIES"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </Select.Option>
                      </Select.Content>
                    </Select>
                  </FieldRow>

                  <FieldRow
                    title="Deployment policy"
                    description="Single serves one version and a deploy replaces it; Versioned gives each version its own URL. An environment can only use a setting that matches its own."
                  >
                    <Select
                      v-model="form.deploymentPolicy"
                      size="large"
                      class="w-full"
                      :disabled="saving"
                      :display-value="deploymentPolicyLabel"
                    >
                      <Select.Trigger aria-label="Default version policy" />
                      <Select.Content>
                        <Select.Option
                          v-for="option in DEPLOYMENT_POLICIES"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </Select.Option>
                      </Select.Content>
                    </Select>
                  </FieldRow>

                  <FieldRow
                    kind="compact"
                    title="Apply to existing Deployment Settings"
                    description="Rewrite every setting this workspace already holds with the values above. Azion Default is never changed."
                  >
                    <Switch
                      v-model="form.applyToExisting"
                      :disabled="saving"
                      aria-label="Apply to existing Deployment Settings"
                    />
                  </FieldRow>
                </Item.List>
              </template>
            </CardBox>
          </Section>

          <Section
            stacked
            anchor
            :divided="false"
            title="All workloads"
            hint="Every workload, every environment, and the Deployment Setting each one publishes with."
          >
            <WorkloadBindings />
          </Section>

          <Section
            stacked
            anchor
            :divided="false"
            title="Deployment Settings"
            hint="Every setting this account holds, and the workloads each one publishes to."
          >
            <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
              <ControlsHeader>
                <FilterButton
                  v-model="filters"
                  :fields="filterFields"
                />
                <InputText
                  v-model="search"
                  size="medium"
                  placeholder="Search settings"
                  aria-label="Search deployment settings"
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
                    filename="deployment-settings.csv"
                  />
                  <ColumnsButton
                    v-model="columnVisibility"
                    :columns="settingColumns"
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
                    :data="visibleSettings"
                    :columns="settingColumns"
                    row-key="id"
                    enable-sorting
                    paginated
                    :page-size="10"
                    :border="false"
                    :loading="loading"
                  >
                    <template #cell-name="{ value, row }">
                      <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                        <span class="truncate">{{ value }}</span>
                        <Tag
                          v-if="row.system"
                          label="Azion"
                          severity="secondary"
                          size="medium"
                        />
                      </span>
                    </template>

                    <template #cell-workloadsCount="{ row }">
                      <Tooltip :text="reachTooltip(row)">
                        <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                          <Tag
                            v-if="row.shared"
                            label="Shared"
                            severity="warning"
                            size="medium"
                          />
                          <span
                            class="truncate"
                            :class="row.workloadsCount ? '' : 'text-(--text-disabled)'"
                          >
                            {{ reachLabel(row.workloadsCount) }}
                          </span>
                        </span>
                      </Tooltip>
                    </template>

                    <template #cell-type="{ value }">
                      <Tag
                        :label="strategyTypeLabel(value)"
                        severity="info"
                        size="medium"
                      />
                    </template>

                    <template #cell-bindingPolicy="{ value }">
                      <span class="truncate">{{ bindingPolicyLabel(value) }}</span>
                    </template>

                    <template #cell-deploymentPolicy="{ value }">
                      <span class="truncate">{{ deploymentPolicyLabel(value) }}</span>
                    </template>

                    <template #cell-status="{ value }">
                      <Tag
                        :label="value"
                        :severity="value === 'Active' ? 'success' : 'secondary'"
                        size="medium"
                      />
                    </template>

                    <template #cell-lastModified="{ row }">
                      <LastModifiedCell :date="row.updatedAt || ''" />
                    </template>

                    <template #cell-actions="{ row }">
                      <Dropdown
                        v-if="!row.system"
                        placement="bottom-end"
                        @select="(event, value) => onSettingAction(event, value, row)"
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
                          <Dropdown.Option
                            value="duplicate"
                            label="Clone"
                          >
                            <template #left>
                              <i
                                class="pi pi-clone"
                                aria-hidden="true"
                              />
                            </template>
                          </Dropdown.Option>
                        </Dropdown.Group>
                        <Dropdown.Group>
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
                  </TableRoot>
                </template>
              </CardBox>
            </div>
          </Section>
        </div>
      </section>
    </section>

    <SettingsSaveBar
      :dirty="dirty"
      :saving="saving"
      @save="save"
      @discard="discard"
    />

    <DeploymentSettingsDrawer
      v-model:open="settingsOpen"
      @create="onStrategyCreated"
    />

    <DeleteDialog
      v-model:open="deleteOpen"
      kind="Deployment setting"
      :name="pendingDelete?.name ?? ''"
      :description="deleteDescription"
      @confirm="confirmDelete"
    />
  </div>
</template>
