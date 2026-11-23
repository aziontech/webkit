<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import PageHeader from '@aziontech/webkit/page-header'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, onMounted, reactive, ref, watch } from 'vue'

  import {
    bindingLabel,
    reachLabel,
    rewrittenNames,
    servicesBoundTo,
    settingNameIn,
    type SettingsRowData
  } from './deployment-policies'
  import DeploymentDefaultsGroup from './parts/deployment-defaults-group.vue'
  import DeploymentSaveBar from './parts/deployment-save-bar.vue'
  import DeploymentServicesGroup from './parts/deployment-services-group.vue'
  import DeploymentSettingDrawer, {
    type DeploymentSettingDraftValues
  } from './parts/deployment-setting-drawer.vue'
  import DeploymentSettingsTable from './parts/deployment-settings-table.vue'
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
    save: [event: MouseEvent | KeyboardEvent, values: DeploymentSettingsDefaultsValues]
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
  const save = (event: MouseEvent | KeyboardEvent) => {
    if (props.saving) return
    toast.dismiss(SAVE_TOAST)
    emit('save', event, { ...form })
  }
  const onSaveShortcut = (event: KeyboardEvent) => {
    if (!dirty.value || props.saving) return
    save(event)
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
  const settingName = (id: unknown): string => settingNameIn(settingList.value, id)
  const boundTo = (id: string) => servicesBoundTo(serviceList.value, id)

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

  const drawerEl = ref<InstanceType<typeof DeploymentSettingDrawer> | null>(null)
  const openCreate = () => drawerEl.value?.openCreate()

  const commitDraft = (event: Event, editingId: string, draft: DeploymentSettingDraftValues) => {
    const values = { ...draft, updatedAt: new Date(), updatedBy: author.value }
    const name = draft.name
    const current = settingById(editingId)
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
      drawerEl.value?.openEdit(source)
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

  const INFO_ALERT_LABEL =
    'A Deployment Setting says how a deploy routes: its binding policy, its deployment policy and its rollout defaults. Every environment is linked to one automatically, matching its ' +
    'own deployment policy, and only a matching setting can be chosen. Point two environments at the same setting and a deploy into it publishes to both.'
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
            aria-label="Documentation (opens in a new tab)"
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
          :label="INFO_ALERT_LABEL"
          @close="infoOpen = false"
        />

        <div class="flex min-w-0 flex-col">
          <DeploymentDefaultsGroup
            :form="form"
            :first-load="firstLoad"
            :saving="saving"
          />

          <DeploymentServicesGroup
            :service-list="serviceList"
            :setting-list="settingList"
            :first-load="firstLoad"
            @rebind="rebind"
          />

          <DeploymentSettingsTable
            :setting-list="settingList"
            :service-list="serviceList"
            :loading="loading"
            :first-load="firstLoad"
            @refresh="(event) => emit('refresh', event)"
            @action="onAction"
          />
        </div>
      </section>

      <DeploymentSaveBar
        :dirty="dirty"
        :saving="saving"
        :rewritten="form.applyToExisting ? rewrittenNames(settingList, form.bindingPolicy) : []"
        :binding-label="bindingLabel(form.bindingPolicy)"
        @save-shortcut="onSaveShortcut"
        @discard="discard"
        @save="save"
      />
    </div>

    <DeploymentSettingDrawer
      ref="drawerEl"
      :setting-list="settingList"
      :defaults="saved"
      @submit="commitDraft"
    />

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
