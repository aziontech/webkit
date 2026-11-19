<script setup lang="ts">
  import Accordion from '@aziontech/webkit/accordion'
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import DataTable from '@aziontech/webkit/data-table'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import Pagination from '@aziontech/webkit/pagination-root'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import RadioGroup from '@aziontech/webkit/radio-group'
  import SaveBar from '@aziontech/webkit/save-bar'
  import Select from '@aziontech/webkit/select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Switch from '@aziontech/webkit/switch'
  import { type TableColumn, type TableExposed } from '@aziontech/webkit/table'
  import TableCellActions from '@aziontech/webkit/table-cell-actions'
  import TableCellStatus from '@aziontech/webkit/table-cell-status'
  import TableCellTime from '@aziontech/webkit/table-cell-time'
  import Tag from '@aziontech/webkit/tag'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { type FilteringProperty, useCollection } from '@aziontech/webkit/use-collection'
  import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'

  import { sampleCurrentUser, sampleDefaults, sampleServices, sampleSettings } from './sample'

  /** Whether a version locks the resource IDs it shipped with. */
  export type DeploymentSettingsBindingPolicy = 'STRICT' | 'FLEXIBLE'
  /** One live version, or a URL per version. */
  export type DeploymentSettingsDeploymentPolicy = 'single_version' | 'versioned_urls'
  /** Whether environments can choose the setting. */
  export type DeploymentSettingsStatus = 'Active' | 'Inactive'

  /** One Deployment Setting, a row of the table. */
  export interface DeploymentSettingsSetting {
    /** Stable key; environments point at it. */
    id: string
    /** Display name, unique in the account. */
    name: string
    /** Optional internal note. */
    description: string
    /** The account's Default setting: no row actions, every environment falls back to it. */
    system: boolean
    /** How versions bind to their resources. */
    bindingPolicy: DeploymentSettingsBindingPolicy
    /** How traffic reaches the versions. */
    deploymentPolicy: DeploymentSettingsDeploymentPolicy
    /** Inactive settings stay listed but cannot be chosen. */
    status: DeploymentSettingsStatus
    /** When it changed last. */
    updatedAt: Date
    /** Who changed it last. */
    updatedBy: string
  }

  /** One environment of a service and the setting it publishes with. */
  export interface DeploymentSettingsEnvironment {
    /** Environment name, unique in its service. */
    name: string
    /** The environment's own policy; only matching settings can be chosen. */
    deploymentPolicy: DeploymentSettingsDeploymentPolicy
    /** The id of the setting it publishes with. */
    settingId: string
    /** The link was made automatically and never changed. */
    auto: boolean
  }

  /** One service and its environments. */
  export interface DeploymentSettingsService {
    /** Stable key, used in the service link. */
    id: string
    /** Display name. */
    name: string
    /** Its environments. */
    environments: DeploymentSettingsEnvironment[]
  }

  /** The defaults the next service starts with. */
  export interface DeploymentSettingsDefaults {
    /** Binding policy of the next setting. */
    bindingPolicy: DeploymentSettingsBindingPolicy
    /** Deployment policy of the next setting. */
    deploymentPolicy: DeploymentSettingsDeploymentPolicy
  }

  /** What Save sends: the defaults and whether to apply the binding policy to existing settings. */
  export interface DeploymentSettingsDefaultsValues extends DeploymentSettingsDefaults {
    /** Give every custom setting the binding policy above. */
    applyToExisting: boolean
  }

  /** The new binding of one environment. */
  export interface DeploymentSettingsBinding {
    /** The service id. */
    serviceId: string
    /** The environment name. */
    environment: string
    /** The id of the setting it now publishes with. */
    settingId: string
  }

  export interface DeploymentSettingsProps {
    /** Every Deployment Setting of the account. Left out, the sample renders. */
    settings?: DeploymentSettingsSetting[]
    /** Every service and its environments. Left out, the sample renders. */
    services?: DeploymentSettingsService[]
    /** The saved new service defaults; Discard returns to them. Left out, the sample renders. */
    defaults?: DeploymentSettingsDefaults
    /** Unsaved edits the defaults open with, so the SaveBar shows at once. */
    defaultDraft?: Partial<DeploymentSettingsDefaultsValues>
    /** Who local edits are stamped with in Last modified. Left out, the sample renders. */
    currentUser?: string
    /** The page data is loading: with no settings it is the first load, with settings a refresh. */
    loading?: boolean
    /** The defaults save is in flight: Save spins and Discard locks. */
    saving?: boolean
    /** Why the defaults save failed, shown in a danger toast; the edits are kept. */
    error?: string
  }

  const props = withDefaults(defineProps<DeploymentSettingsProps>(), {
    settings: undefined,
    services: undefined,
    defaults: undefined,
    defaultDraft: () => ({}),
    currentUser: undefined,
    loading: false,
    saving: false,
    error: ''
  })

  const emit = defineEmits<{
    save: [event: MouseEvent, values: DeploymentSettingsDefaultsValues]
    discard: [event: MouseEvent]
    refresh: [event: MouseEvent]
    bind: [binding: DeploymentSettingsBinding]
    create: [event: Event, setting: DeploymentSettingsSetting]
    update: [event: Event, setting: DeploymentSettingsSetting]
    clone: [
      event: Event,
      payload: { source: DeploymentSettingsSetting; copy: DeploymentSettingsSetting }
    ]
    delete: [event: Event, setting: DeploymentSettingsSetting]
  }>()

  type SettingsRowData = DeploymentSettingsSetting & {
    type: string
    reach: 'Shared' | 'Dedicated' | 'Unused'
    services: string[]
  }

  const BINDING_POLICIES: {
    value: DeploymentSettingsBindingPolicy
    label: string
    description: string
  }[] = [
    {
      value: 'STRICT',
      label: 'Strict',
      description: 'Lock resource IDs to each version. Promoted versions stay Strict.'
    },
    {
      value: 'FLEXIBLE',
      label: 'Flexible',
      description: 'Allow resource IDs to change across versions.'
    }
  ]
  const DEPLOYMENT_POLICIES: {
    value: DeploymentSettingsDeploymentPolicy
    label: string
    description: string
  }[] = [
    {
      value: 'single_version',
      label: 'Single',
      description: 'One version serves the environment. Deploying replaces what is live.'
    },
    {
      value: 'versioned_urls',
      label: 'Versioned',
      description: 'Each version keeps its own URL, so several are reachable at once.'
    }
  ]
  const bindingLabel = (value: unknown): string =>
    BINDING_POLICIES.find((policy) => policy.value === value)?.label ?? String(value ?? '')
  const deploymentLabel = (value: unknown): string =>
    DEPLOYMENT_POLICIES.find((policy) => policy.value === value)?.label ?? String(value ?? '')

  const SERVICES_PAGE_SIZE = 10
  const SAVE_TOAST = 'deployment-defaults-save'

  const settingsSource = computed<DeploymentSettingsSetting[]>(
    () => props.settings ?? (props.loading ? [] : sampleSettings)
  )
  const servicesSource = computed<DeploymentSettingsService[]>(
    () => props.services ?? (props.loading ? [] : sampleServices)
  )
  const settingList = ref<DeploymentSettingsSetting[]>([])
  const serviceList = ref<DeploymentSettingsService[]>([])
  watch(
    settingsSource,
    (next) => {
      settingList.value = [...next]
    },
    { immediate: true }
  )
  watch(
    servicesSource,
    (next) => {
      serviceList.value = [...next]
    },
    { immediate: true }
  )
  const author = computed(() => props.currentUser ?? sampleCurrentUser)
  const firstLoad = computed(() => props.loading && settingList.value.length === 0)
  const infoOpen = ref(true)

  const savedSource = computed<DeploymentSettingsDefaults>(() => props.defaults ?? sampleDefaults)
  const saved = reactive<DeploymentSettingsDefaultsValues>({
    ...savedSource.value,
    applyToExisting: false
  })
  const form = reactive<DeploymentSettingsDefaultsValues>({ ...saved, ...props.defaultDraft })
  watch(
    () => JSON.stringify(savedSource.value),
    () => {
      Object.assign(saved, savedSource.value, { applyToExisting: false })
      Object.assign(form, saved)
    }
  )
  const dirty = computed(
    () =>
      form.bindingPolicy !== saved.bindingPolicy ||
      form.deploymentPolicy !== saved.deploymentPolicy ||
      form.applyToExisting !== saved.applyToExisting
  )
  const discard = (event: MouseEvent) => {
    Object.assign(form, saved)
    emit('discard', event)
  }
  const save = (event: MouseEvent) => {
    if (props.saving) return
    toast.dismiss(SAVE_TOAST)
    emit('save', event, { ...form })
  }
  const showFailure = () => {
    toast.error("The deployment defaults weren't saved.", {
      description: props.error,
      action: { label: 'Retry', onClick: (event: MouseEvent) => save(event) },
      id: SAVE_TOAST
    })
  }
  onMounted(() => {
    if (props.error) showFailure()
  })
  watch(
    () => props.error,
    (next) => {
      if (next && !props.saving) showFailure()
    }
  )
  watch(
    () => props.saving,
    (now, before) => {
      if (!before || now) return
      if (props.error) {
        showFailure()
        return
      }
      const apply = form.applyToExisting
      if (apply) {
        settingList.value = settingList.value.map((setting) =>
          setting.system
            ? setting
            : {
                ...setting,
                bindingPolicy: form.bindingPolicy,
                updatedAt: new Date(),
                updatedBy: author.value
              }
        )
      }
      Object.assign(saved, { ...form, applyToExisting: false })
      form.applyToExisting = false
      toast.success('Deployment defaults saved.', {
        description: apply
          ? `${settingList.value.filter((setting) => !setting.system).length} settings now use the ${bindingLabel(form.bindingPolicy)} binding policy. Default is never changed.`
          : 'The next service is created with them. Existing settings keep theirs.',
        id: SAVE_TOAST
      })
    }
  )

  const systemId = computed(() => settingList.value.find((setting) => setting.system)?.id ?? '')
  const settingById = (id: string) => settingList.value.find((setting) => setting.id === id)
  const settingName = (id: unknown): string => settingById(String(id))?.name ?? ''
  const boundTo = (id: string) =>
    serviceList.value.filter((service) =>
      service.environments.some((environment) => environment.settingId === id)
    )
  const reachLabel = (count: number) =>
    count === 0 ? 'No services' : count === 1 ? '1 service' : `${count} services`

  const serviceRows = computed(() =>
    serviceList.value.map((service) => ({
      ...service,
      settings: service.environments
        .map((environment) => settingName(environment.settingId))
        .join(' ')
    }))
  )
  const {
    items: pagedServices,
    totalCount: matchingServiceCount,
    filterProps: serviceFilterProps,
    paginationProps: servicePaginationProps,
    clearFilters: clearServiceSearch
  } = useCollection({
    items: serviceRows,
    columns: [{ accessorKey: 'name' }, { accessorKey: 'settings' }],
    filtering: { fields: ['name', 'settings'] },
    pagination: { pageSize: SERVICES_PAGE_SIZE, pageSizeOptions: [SERVICES_PAGE_SIZE] }
  })
  const sharedCount = computed(
    () =>
      serviceList.value.filter((service) =>
        service.environments.some((environment) => boundTo(environment.settingId).length > 1)
      ).length
  )
  const optionsFor = (environment: DeploymentSettingsEnvironment) =>
    settingList.value.filter(
      (setting) =>
        setting.deploymentPolicy === environment.deploymentPolicy ||
        setting.id === environment.settingId
    )

  const rebind = (
    service: DeploymentSettingsService,
    environment: DeploymentSettingsEnvironment,
    value: unknown
  ) => {
    const id = String(value)
    if (!id || id === environment.settingId) return
    serviceList.value = serviceList.value.map((item) =>
      item.id !== service.id
        ? item
        : {
            ...item,
            environments: item.environments.map((env) =>
              env.name === environment.name ? { ...env, settingId: id, auto: false } : env
            )
          }
    )
    emit('bind', { serviceId: service.id, environment: environment.name, settingId: id })
    const reach = boundTo(id).length
    const title = `${service.name} · ${environment.name} now publishes with ${settingName(id)}.`
    if (reach > 1) {
      toast.warning(title, {
        description: `A deploy into ${settingName(id)} reaches ${reachLabel(reach)}.`
      })
      return
    }
    toast.success(title, { description: 'It reaches this service only.' })
  }

  const rows = computed<SettingsRowData[]>(() =>
    settingList.value.map((setting) => {
      const bound = boundTo(setting.id).map((service) => service.name)
      return {
        ...setting,
        type: setting.system ? 'System' : 'Custom',
        reach: bound.length > 1 ? 'Shared' : bound.length === 1 ? 'Dedicated' : 'Unused',
        services: bound
      }
    })
  )

  const columns: TableColumn[] = [
    { accessorKey: 'name', header: 'Name', sortable: true, principal: true, hideable: false },
    { accessorKey: 'services', header: 'Services', minWidth: 170 },
    { accessorKey: 'type', header: 'Type', sortable: true, minWidth: 110 },
    { accessorKey: 'bindingPolicy', header: 'Binding policy', sortable: true, minWidth: 140 },
    {
      accessorKey: 'deploymentPolicy',
      header: 'Deployment policy',
      sortable: true,
      minWidth: 160
    },
    { accessorKey: 'status', header: 'Status', sortable: true, minWidth: 110 },
    { accessorKey: 'updatedAt', header: 'Last modified', sortable: true, minWidth: 170 },
    { id: 'actions', type: 'action', hideable: false }
  ]

  const properties: FilteringProperty[] = [
    { key: 'name', label: 'Name' },
    {
      key: 'reach',
      label: 'Reach',
      options: [{ value: 'Shared' }, { value: 'Dedicated' }, { value: 'Unused' }]
    },
    {
      key: 'bindingPolicy',
      label: 'Binding policy',
      options: BINDING_POLICIES.map((policy) => ({ value: policy.value, label: policy.label }))
    },
    { key: 'status', label: 'Status', options: [{ value: 'Active' }, { value: 'Inactive' }] }
  ]

  const { tableProps, propertyFilterProps, preferencesProps, matchingItems, clearFilters } =
    useCollection({
      items: rows,
      columns,
      filtering: { fields: ['name', 'description', 'reach', 'status'] },
      propertyFiltering: { properties },
      sorting: { defaultState: [{ desc: true, id: 'updatedAt' }] },
      pagination: { pageSize: 10, pageSizeOptions: [10, 25, 50] },
      preferences: {
        storageKey: 'deployment-settings',
        defaults: { columns: [{ id: 'type', visible: false }] }
      }
    })

  const settingsTableEl = ref<TableExposed<SettingsRowData> | null>(null)
  const exportCsv = () => settingsTableEl.value?.exportCsv({ filename: 'deployment-settings.csv' })

  const blankDraft = () => ({
    name: '',
    description: '',
    active: true,
    bindingPolicy: saved.bindingPolicy,
    deploymentPolicy: saved.deploymentPolicy
  })
  const drawerOpen = ref(false)
  const editingId = ref('')
  const draft = reactive(blankDraft())
  const nameError = ref('')
  const formEl = ref<HTMLFormElement | null>(null)
  const drawerTitle = computed(() =>
    editingId.value ? 'Edit Deployment Setting' : 'Create Deployment Setting'
  )

  const openCreate = () => {
    editingId.value = ''
    Object.assign(draft, blankDraft())
    nameError.value = ''
    drawerOpen.value = true
  }
  const openEdit = (setting: DeploymentSettingsSetting) => {
    editingId.value = setting.id
    Object.assign(draft, {
      name: setting.name,
      description: setting.description,
      active: setting.status === 'Active',
      bindingPolicy: setting.bindingPolicy,
      deploymentPolicy: setting.deploymentPolicy
    })
    nameError.value = ''
    drawerOpen.value = true
  }

  const submit = (event: Event) => {
    const name = draft.name.trim()
    nameError.value = !name
      ? 'This field is required.'
      : settingList.value.some((setting) => setting.name === name && setting.id !== editingId.value)
        ? 'A Deployment Setting with this name already exists.'
        : ''
    if (nameError.value) {
      nextTick(() => formEl.value?.querySelector<HTMLElement>('#deployment-settings-name')?.focus())
      return
    }
    const values = {
      name,
      description: draft.description.trim(),
      bindingPolicy: draft.bindingPolicy,
      deploymentPolicy: draft.deploymentPolicy,
      status: (draft.active ? 'Active' : 'Inactive') as DeploymentSettingsStatus,
      updatedAt: new Date(),
      updatedBy: author.value
    }
    const current = settingById(editingId.value)
    if (current) {
      const next = { ...current, ...values }
      settingList.value = settingList.value.map((setting) =>
        setting.id === current.id ? next : setting
      )
      emit('update', event, next)
      toast.success(`${name} saved.`, {
        description: 'Environments that publish with it use the change on their next deploy.'
      })
    } else {
      const created: DeploymentSettingsSetting = {
        ...values,
        id: `ds-${settingList.value.length + 1}-${name}`,
        system: false
      }
      settingList.value = [...settingList.value, created]
      emit('create', event, created)
      toast.success(`${name} created.`, {
        description: 'Point an environment at it under All services to start publishing with it.'
      })
    }
    drawerOpen.value = false
  }

  const pending = ref<SettingsRowData | null>(null)
  const deleteOpen = ref(false)
  const deleteDescription = computed(() => {
    const count = pending.value?.services.length ?? 0
    const name = pending.value?.name ?? ''
    return count === 0
      ? `${name} is deleted. No environment publishes with it.`
      : `${name} is deleted, and ${reachLabel(count)} fall back to Default on their next deploy.`
  })
  const remove = (event: Event) => {
    const row = pending.value
    if (!row) return
    const fallback = systemId.value
    serviceList.value = serviceList.value.map((service) => ({
      ...service,
      environments: service.environments.map((environment) =>
        environment.settingId === row.id
          ? { ...environment, settingId: fallback, auto: true }
          : environment
      )
    }))
    const setting = settingById(row.id)
    settingList.value = settingList.value.filter((item) => item.id !== row.id)
    deleteOpen.value = false
    if (setting) emit('delete', event, setting)
    toast.success(`${row.name} deleted.`)
  }

  const onAction = (event: Event, value: DropdownMenuItemValue, row: SettingsRowData) => {
    const source = settingById(row.id)
    if (!source) return
    if (value === 'edit') {
      openEdit(source)
      return
    }
    if (value === 'clone') {
      const copy: DeploymentSettingsSetting = {
        ...source,
        id: `ds-${settingList.value.length + 1}-${row.id}-copy`,
        name: `${row.name}-copy`,
        system: false,
        updatedAt: new Date(),
        updatedBy: author.value
      }
      settingList.value = [...settingList.value, copy]
      emit('clone', event, { source, copy })
      toast.success(`${copy.name} created from ${row.name}.`, {
        description: 'The copy has the same policies and no environment yet.'
      })
      return
    }
    if (value === 'delete') {
      pending.value = row
      deleteOpen.value = true
    }
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex flex-col">
      <PageHeader
        title="Build and deployment"
        description="Every environment is linked to a Deployment Setting automatically, matching its deployment policy. Point two environments at the same setting when they should publish together."
      >
        <template #actions>
          <Button
            label="Documentation"
            icon="az az-book"
            variant="outline"
            size="medium"
            href="https://example.com/docs/deployment-settings"
            target="_blank"
          />
          <Button
            label="Create Deployment Setting"
            icon="az az-plus"
            variant="primary"
            size="medium"
            @click="openCreate"
          />
        </template>
      </PageHeader>

      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
        <Alert
          v-if="infoOpen"
          severity="info"
          size="small"
          closable
          label="A Deployment Setting says how a deploy routes: its binding policy, its deployment policy and its rollout defaults. Every environment is linked to one automatically, matching its own deployment policy, and only a matching setting can be chosen. Point two environments at the same setting and a deploy into it publishes to both."
          @close="infoOpen = false"
        />

        <div class="flex min-w-0 flex-col">
          <SettingsGroup
            label="New service defaults"
            anchor="new-service-defaults"
            hint="What the Deployment Setting created with the next service starts with."
          >
            <Card :padded="false">
              <template #default>
                <Item.List>
                  <SettingsRow
                    title="Binding policy"
                    description="Whether a version locks the resource IDs it shipped with. Changing it does not touch the settings that already exist."
                  >
                    <Skeleton
                      v-if="firstLoad"
                      height="2.5rem"
                    />
                    <Select
                      v-else
                      v-model="form.bindingPolicy"
                      size="large"
                      class="w-full"
                      :disabled="saving"
                      :display-value="bindingLabel"
                    >
                      <Select.Trigger aria-label="Binding policy" />
                      <Select.Content>
                        <Select.Item
                          v-for="policy in BINDING_POLICIES"
                          :key="policy.value"
                          :value="policy.value"
                        >
                          {{ policy.label }}
                        </Select.Item>
                      </Select.Content>
                    </Select>
                  </SettingsRow>
                  <SettingsRow
                    title="Deployment policy"
                    description="Single serves one version and a deploy replaces it; Versioned gives each version its own URL. An environment can only use a setting that matches its own."
                  >
                    <Skeleton
                      v-if="firstLoad"
                      height="2.5rem"
                    />
                    <Select
                      v-else
                      v-model="form.deploymentPolicy"
                      size="large"
                      class="w-full"
                      :disabled="saving"
                      :display-value="deploymentLabel"
                    >
                      <Select.Trigger aria-label="Deployment policy" />
                      <Select.Content>
                        <Select.Item
                          v-for="policy in DEPLOYMENT_POLICIES"
                          :key="policy.value"
                          :value="policy.value"
                        >
                          {{ policy.label }}
                        </Select.Item>
                      </Select.Content>
                    </Select>
                  </SettingsRow>
                  <SettingsRow
                    title="Apply to existing Deployment Settings"
                    description="Give every setting this account already holds the binding policy above when you save. Default is never changed."
                    variant="compact"
                  >
                    <Switch
                      v-model="form.applyToExisting"
                      :disabled="saving || firstLoad"
                      aria-label="Apply to existing Deployment Settings"
                    />
                  </SettingsRow>
                </Item.List>
              </template>
            </Card>
          </SettingsGroup>

          <SettingsGroup
            label="All services"
            anchor="all-services"
            hint="Every service, every environment, and the Deployment Setting each one publishes with."
          >
            <Card :padded="false">
              <template #default>
                <div
                  v-if="firstLoad"
                  class="flex flex-col gap-(--spacing-sm) p-(--spacing-md)"
                >
                  <Skeleton
                    width="40%"
                    height="1.25rem"
                  />
                  <Skeleton height="2.5rem" />
                </div>
                <EmptyState
                  v-else-if="!serviceList.length"
                  size="small"
                  icon="az az-server"
                  title="No services yet"
                  description="Each environment of a new service is linked to a matching Deployment Setting automatically."
                />
                <Accordion
                  v-else
                  type="single"
                  icon-position="leading"
                  collapsible
                >
                  <Accordion.Item value="all-services">
                    <Accordion.Trigger :heading-level="3">
                      <span class="flex flex-1 flex-wrap items-center gap-(--spacing-sm)">
                        <span class="text-label-md text-(--text-default)">All services</span>
                        <span class="text-body-sm text-(--text-muted)">{{
                          reachLabel(serviceList.length)
                        }}</span>
                        <Tag
                          v-if="sharedCount"
                          :label="`${sharedCount} on a shared setting`"
                          severity="warning"
                          size="small"
                        />
                      </span>
                    </Accordion.Trigger>
                    <Accordion.Content>
                      <div class="flex min-w-0 flex-col gap-(--spacing-md)">
                        <Input
                          v-bind="serviceFilterProps"
                          size="medium"
                          placeholder="Search services or settings"
                          aria-label="Search services or Deployment Settings"
                          class="w-full"
                        >
                          <template #leading>
                            <i
                              class="az az-search"
                              aria-hidden="true"
                            />
                          </template>
                        </Input>
                        <div
                          v-if="!matchingServiceCount"
                          role="status"
                        >
                          <EmptyState
                            size="small"
                            icon="az az-search"
                            title="No matching services"
                            :description="`No service or setting matches “${serviceFilterProps.modelValue}”.`"
                          >
                            <template #actions>
                              <Button
                                label="Clear search"
                                variant="outline"
                                size="small"
                                @click="clearServiceSearch"
                              />
                            </template>
                          </EmptyState>
                        </div>
                        <ul
                          v-else
                          class="m-0 flex list-none flex-col p-0"
                          aria-label="Services"
                        >
                          <li
                            v-for="service in pagedServices"
                            :key="service.id"
                            class="flex min-w-0 flex-col gap-(--spacing-xs) border-b border-(--border-muted) py-(--spacing-sm) last:border-b-0"
                          >
                            <a
                              :href="`/services/${service.id}`"
                              class="truncate text-label-md text-(--text-default) no-underline hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
                              >{{ service.name }}</a
                            >
                            <div
                              v-for="environment in service.environments"
                              :key="environment.name"
                              class="flex min-w-0 flex-wrap items-center gap-(--spacing-sm)"
                            >
                              <Tag
                                :label="environment.name"
                                severity="neutral"
                                size="small"
                              />
                              <Tag
                                :label="deploymentLabel(environment.deploymentPolicy)"
                                severity="info"
                                size="small"
                              />
                              <Select
                                :model-value="environment.settingId"
                                size="medium"
                                class="min-w-0 grow basis-(--container-2xs)"
                                :display-value="settingName"
                                @update:model-value="(value) => rebind(service, environment, value)"
                              >
                                <Select.Trigger
                                  :aria-label="`Deployment Setting for ${service.name} ${environment.name}`"
                                />
                                <Select.Content>
                                  <Select.Item
                                    v-for="option in optionsFor(environment)"
                                    :key="option.id"
                                    :value="option.id"
                                    :disabled="option.status === 'Inactive'"
                                  >
                                    {{ option.name }}
                                  </Select.Item>
                                </Select.Content>
                              </Select>
                              <Tag
                                v-if="environment.auto"
                                key="auto"
                                label="Linked automatically"
                                severity="neutral"
                                size="small"
                              />
                              <Tag
                                key="shared"
                                v-if="boundTo(environment.settingId).length > 1"
                                :label="`Shared · ${reachLabel(boundTo(environment.settingId).length)}`"
                                severity="warning"
                                size="small"
                              />
                            </div>
                          </li>
                        </ul>
                        <Pagination
                          v-if="matchingServiceCount > SERVICES_PAGE_SIZE"
                          v-bind="servicePaginationProps"
                          aria-label="Services pages"
                        />
                      </div>
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion>
              </template>
            </Card>
          </SettingsGroup>

          <SettingsGroup
            label="Deployment Settings"
            anchor="deployment-settings"
            hint="Every setting this account holds, and the services each one publishes to."
          >
            <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
              <header class="flex flex-wrap items-start gap-(--layout-group-gap)">
                <div class="flex min-w-0 grow basis-(--container-2xs)">
                  <PropertyFilter
                    v-bind="propertyFilterProps"
                    placeholder="Filter Deployment Settings"
                    aria-label="Filter Deployment Settings"
                  />
                </div>
                <div class="flex shrink-0 flex-wrap items-center gap-(--spacing-xs)">
                  <Tooltip
                    content="Refresh"
                    class="shrink-0"
                  >
                    <IconButton
                      icon="az az-refresh"
                      variant="outline"
                      size="medium"
                      :loading="loading && !firstLoad"
                      aria-label="Refresh"
                      @click="emit('refresh', $event)"
                    />
                  </Tooltip>
                  <Tooltip
                    content="Download CSV"
                    class="shrink-0"
                  >
                    <IconButton
                      icon="az az-download"
                      variant="outline"
                      size="medium"
                      :disabled="!matchingItems.length"
                      aria-label="Download CSV"
                      @click="exportCsv"
                    />
                  </Tooltip>
                  <CollectionPreferences
                    v-bind="preferencesProps"
                    title="Table preferences"
                  />
                </div>
              </header>

              <Card :padded="false">
                <template #default>
                  <DataTable
                    ref="settingsTableEl"
                    v-bind="tableProps"
                    :loading="loading"
                    sortable
                    :bordered="false"
                    aria-label="Deployment Settings"
                  >
                    <template #cell-name="{ row }">
                      <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                        <span class="truncate">{{ row.name }}</span>
                        <Tag
                          v-if="row.system"
                          label="System"
                          severity="neutral"
                          size="small"
                          class="shrink-0"
                        />
                      </span>
                    </template>
                    <template #cell-services="{ row }">
                      <Tooltip
                        :content="
                          row.services.length
                            ? row.services.join(' · ')
                            : 'No environment publishes with this setting yet.'
                        "
                      >
                        <span
                          class="flex min-w-0 items-center gap-(--spacing-xs)"
                          tabindex="0"
                        >
                          <Tag
                            v-if="row.reach === 'Shared'"
                            label="Shared"
                            severity="warning"
                            size="small"
                            class="shrink-0"
                          />
                          <span
                            class="truncate"
                            :data-unused="row.reach === 'Unused' || null"
                            >{{ reachLabel(row.services.length) }}</span
                          >
                        </span>
                      </Tooltip>
                    </template>
                    <template #cell-type="{ value }">
                      <Tag
                        :label="value"
                        severity="info"
                        size="small"
                      />
                    </template>
                    <template #cell-bindingPolicy="{ value }">
                      <span class="truncate">{{ bindingLabel(value) }}</span>
                    </template>
                    <template #cell-deploymentPolicy="{ value }">
                      <span class="truncate">{{ deploymentLabel(value) }}</span>
                    </template>
                    <template #cell-status="{ value }">
                      <TableCellStatus
                        :label="value"
                        :severity="value === 'Active' ? 'success' : 'neutral'"
                      />
                    </template>
                    <template #cell-updatedAt="{ row }">
                      <TableCellTime
                        :value="row.updatedAt"
                        :author="row.system ? '' : row.updatedBy"
                      />
                    </template>
                    <template #header-actions>
                      <span class="sr-only">Actions</span>
                    </template>
                    <template #cell-actions="{ row }">
                      <TableCellActions
                        v-if="!row.system"
                        :name="row.name"
                        @select="(event, value) => onAction(event, value, row)"
                      >
                        <DropdownMenu.Group>
                          <DropdownMenu.Item
                            value="edit"
                            label="Edit"
                          />
                          <DropdownMenu.Item
                            value="clone"
                            label="Clone"
                          />
                        </DropdownMenu.Group>
                        <DropdownMenu.Group>
                          <DropdownMenu.Item
                            value="delete"
                            label="Delete"
                          />
                        </DropdownMenu.Group>
                      </TableCellActions>
                    </template>
                    <template #empty>
                      <EmptyState
                        size="small"
                        icon="az az-search"
                        title="No matching Deployment Settings"
                        description="No setting matches these filters."
                      >
                        <template #actions>
                          <Button
                            label="Clear filters"
                            variant="outline"
                            size="small"
                            @click="clearFilters"
                          />
                        </template>
                      </EmptyState>
                    </template>
                  </DataTable>
                </template>
              </Card>
            </div>
          </SettingsGroup>
        </div>
      </section>

      <Transition
        enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
        enter-from-class="translate-y-2 opacity-0"
        leave-active-class="transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
        leave-to-class="translate-y-2 opacity-0"
      >
        <SaveBar v-if="dirty || saving">
          You have unsaved changes.
          <template #actions>
            <Button
              type="button"
              label="Discard"
              variant="outline"
              size="medium"
              :disabled="saving"
              @click="discard"
            />
            <Button
              label="Save"
              variant="primary"
              size="medium"
              :loading="saving"
              @click="save"
            />
          </template>
        </SaveBar>
      </Transition>
    </div>

    <Drawer
      v-model:open="drawerOpen"
      size="large"
      side="end"
      dismissible
      closable
    >
      <DrawerContent>
        <form
          ref="formEl"
          class="flex min-h-0 flex-1 flex-col"
          :aria-label="drawerTitle"
          novalidate
          @submit.prevent="submit"
        >
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
              <DrawerTitle>{{ drawerTitle }}</DrawerTitle>
              <p class="text-body-sm text-(--text-muted)">
                A Deployment Setting says how a deploy routes: whether versions lock the resource
                IDs they shipped with, and how many of them take traffic. An environment publishes
                with exactly one.
              </p>
            </div>
          </PanelHeader>

          <PanelBody>
            <fieldset class="m-0 flex min-w-0 flex-col border-0 p-0">
              <legend class="sr-only">{{ drawerTitle }}</legend>
              <SettingsGroup
                label="General"
                hint="How this setting reads in this list and in the field that applies it."
              >
                <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
                  <Field
                    required
                    :invalid="Boolean(nameError)"
                  >
                    <Field.Label for="deployment-settings-name">Name</Field.Label>
                    <Input
                      id="deployment-settings-name"
                      v-model="draft.name"
                      size="large"
                      placeholder="production-hardened"
                      autocomplete="off"
                      @update:model-value="nameError = ''"
                    />
                    <Field.Description>{{
                      nameError || 'Name it after the services or the traffic it serves.'
                    }}</Field.Description>
                  </Field>
                  <Field>
                    <Field.Label for="deployment-settings-description">Description</Field.Label>
                    <Textarea
                      id="deployment-settings-description"
                      v-model="draft.description"
                      :rows="3"
                    />
                    <Field.Description
                      >Optional. Used for internal identification.</Field.Description
                    >
                  </Field>
                  <Field orientation="horizontal">
                    <Switch
                      id="deployment-settings-active"
                      v-model="draft.active"
                    />
                    <Field.Content>
                      <Field.Label for="deployment-settings-active">Active</Field.Label>
                      <Field.Description
                        >When off, the setting stays in the list but no environment can choose
                        it.</Field.Description
                      >
                    </Field.Content>
                  </Field>
                </div>
              </SettingsGroup>

              <SettingsGroup
                label="Routing and policy"
                hint="How versions bind to the resources they ship with, and how traffic reaches them."
              >
                <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
                  <fieldset
                    class="m-0 flex w-full min-w-0 flex-col gap-(--spacing-xs) border-0 p-0"
                  >
                    <Field.Legend type="label">Binding policy</Field.Legend>
                    <RadioGroup
                      v-model="draft.bindingPolicy"
                      name="deployment-settings-binding"
                      aria-label="Binding policy"
                    >
                      <RadioGroup.Item
                        v-for="policy in BINDING_POLICIES"
                        :key="policy.value"
                        :value="policy.value"
                        :description="policy.description"
                        >{{ policy.label }}</RadioGroup.Item
                      >
                    </RadioGroup>
                  </fieldset>
                  <fieldset
                    class="m-0 flex w-full min-w-0 flex-col gap-(--spacing-xs) border-0 p-0"
                  >
                    <Field.Legend type="label">Deployment policy</Field.Legend>
                    <RadioGroup
                      v-model="draft.deploymentPolicy"
                      name="deployment-settings-policy"
                      aria-label="Deployment policy"
                      :disabled="Boolean(editingId)"
                    >
                      <RadioGroup.Item
                        v-for="policy in DEPLOYMENT_POLICIES"
                        :key="policy.value"
                        :value="policy.value"
                        :description="policy.description"
                        >{{ policy.label }}</RadioGroup.Item
                      >
                    </RadioGroup>
                    <Field.Description
                      >Cannot be changed after the setting is created.</Field.Description
                    >
                  </fieldset>
                </div>
              </SettingsGroup>
            </fieldset>
          </PanelBody>

          <PanelFooter>
            <div class="flex w-full justify-end gap-(--spacing-xs)">
              <Button
                type="button"
                label="Cancel"
                variant="outline"
                size="medium"
                @click="drawerOpen = false"
              />
              <Button
                type="submit"
                :label="editingId ? 'Save changes' : 'Create Deployment Setting'"
                variant="primary"
                size="medium"
              />
            </div>
          </PanelFooter>
        </form>
      </DrawerContent>
    </Drawer>

    <ConfirmDialog
      v-model:open="deleteOpen"
      title="Delete Deployment Setting"
      :description="deleteDescription"
      confirm-label="Delete"
      size="small"
      @confirm="remove"
    />
  </div>
</template>
