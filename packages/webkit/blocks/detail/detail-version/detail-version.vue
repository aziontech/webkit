<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import ConsoleLayout from '@aziontech/webkit/console-layout'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import Resizable from '@aziontech/webkit/resizable'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import Select from '@aziontech/webkit/select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Spinner from '@aziontech/webkit/spinner'
  import SplitButton from '@aziontech/webkit/split-button'
  import Switch from '@aziontech/webkit/switch'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag, { type TagSeverity, type TagVariant } from '@aziontech/webkit/tag'
  import Textarea from '@aziontech/webkit/textarea'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, reactive, ref, watch } from 'vue'

  import { sampleResource, sampleRevertDiff, sampleSettings, sampleVersions } from './sample'

  /** Where a version is in its life: an editable draft, the deployed one, or an earlier built one. */
  export type VersionDetailState = 'draft' | 'deployed' | 'ready'

  /** A tab of the version workspace. */
  export type VersionDetailTab =
    | 'main-settings'
    | 'source'
    | 'device-groups'
    | 'cache-settings'
    | 'functions-instances'
    | 'rules-engine'

  /** The resource the version belongs to. */
  export interface VersionDetailResource {
    /** Resource name, shown in the trail and in the page links. */
    name: string
    /** Link to the resource page. */
    href: string
  }

  /** One version of the resource. */
  export interface VersionDetailVersion {
    /** Version id, used in the route. */
    id: string
    /** Version name shown in the trail and the history. */
    name: string
    /** Lifecycle state; it decides whether the page is editable. */
    state: VersionDetailState
    /** The version description. */
    comment: string
    /** Who created the version. */
    author: string
    /** Relative creation time, such as 1 day ago. */
    createdAgo: string
    /** Creation date shown in the tab row of a built version. */
    createdOn?: string
  }

  /** The values of the Settings tab. */
  export interface VersionDetailSettings {
    /** Resource name. */
    name: string
    /** Whether the resource serves traffic. */
    active: boolean
    /** Module switches, keyed by module key. */
    modules: Record<string, boolean>
  }

  /** One setting a revert changes. */
  export interface VersionDetailChange {
    /** Setting name. */
    setting: string
    /** Value on the deployed version. */
    from: string
    /** Value after the revert. */
    to: string
  }

  /** What reverting to the viewed version changes against the deployed one. */
  export interface VersionDetailRevertDiff {
    /** The settings that change. */
    settings: VersionDetailChange[]
    /** Rules the revert adds. */
    rulesAdded: number
    /** Rules the revert removes. */
    rulesRemoved: number
    /** One sentence on the rules that change. */
    rulesNote: string
  }

  /** An environment the resource deploys to. */
  export interface VersionDetailEnvironment {
    /** Environment name. */
    name: string
    /** Deployment policy shown as its tag. */
    policy: string
    /** Id of the version live there, or an empty string. */
    serves: string
  }

  /** The payload of a save from the version bar. */
  export interface VersionDetailSave {
    /** The save action picked in the split button. */
    action: string
    /** The settings as edited. */
    settings: VersionDetailSettings
  }

  export interface VersionDetailProps {
    /** The resource; left out, the sample resource renders. */
    resource?: VersionDetailResource
    /** Every version, newest first; left out, the sample versions render. */
    versions?: VersionDetailVersion[]
    /** The Settings tab values of the viewed version; left out, the sample settings render. */
    settings?: VersionDetailSettings
    /** The diff the revert dialog shows; left out, the sample diff renders. */
    revertDiff?: VersionDetailRevertDiff
    /** The environments; when set, the trail starts with an environment crumb. */
    environments?: VersionDetailEnvironment[]
    /** A new version is being copied from the viewed one. */
    creating?: boolean
    /** A revert to the viewed version is running. */
    reverting?: boolean
  }

  const props = withDefaults(defineProps<VersionDetailProps>(), {
    resource: undefined,
    versions: undefined,
    settings: undefined,
    revertDiff: undefined,
    environments: undefined,
    creating: false,
    reverting: false
  })

  const emit = defineEmits<{
    save: [event: MouseEvent, payload: VersionDetailSave]
    'save-description': [event: MouseEvent, description: string]
    'add-version': [event: MouseEvent | KeyboardEvent]
    'add-environment': [event: MouseEvent | KeyboardEvent]
    redeploy: [event: MouseEvent]
    revert: [event: MouseEvent, version: VersionDetailVersion]
  }>()

  const versionId = defineModel<string>('versionId', { default: '' })
  const activeTab = defineModel<VersionDetailTab>('tab', { default: 'main-settings' })
  const historyExpanded = defineModel<boolean>('historyOpen', { default: false })
  const environment = defineModel<string>('environment', { default: '' })

  defineSlots<{
    /** The Source tab panel; the fallback links to its own page. */
    source?(props: { label: string }): unknown
    /** The Device Groups tab panel. */
    'device-groups'?(props: { label: string }): unknown
    /** The Cache Settings tab panel. */
    'cache-settings'?(props: { label: string }): unknown
    /** The Functions Instances tab panel. */
    'functions-instances'?(props: { label: string }): unknown
    /** The Rules Engine tab panel. */
    'rules-engine'?(props: { label: string }): unknown
  }>()

  const tabs: { value: VersionDetailTab; label: string }[] = [
    { value: 'main-settings', label: 'Settings' },
    { value: 'source', label: 'Source' },
    { value: 'device-groups', label: 'Device Groups' },
    { value: 'cache-settings', label: 'Cache Settings' },
    { value: 'functions-instances', label: 'Functions Instances' },
    { value: 'rules-engine', label: 'Rules Engine' }
  ]
  const STATE_TAGS: Record<
    VersionDetailState,
    { label: string; severity?: TagSeverity; variant?: TagVariant; icon: string }
  > = {
    draft: { label: 'Draft', severity: 'warning', icon: 'az az-file-pen' },
    deployed: { label: 'Deployed', variant: 'primary', icon: '' },
    ready: { label: 'Ready', severity: 'success', icon: '' }
  }
  const defaultModules = [
    {
      key: 'protocol_optimization',
      title: 'Protocol Optimization',
      description: 'Optimize protocols and manage dynamic content delivery.'
    },
    { key: 'cache', title: 'Cache', description: 'Customize advanced cache settings.' },
    {
      key: 'device_detection',
      title: 'Device Detection',
      description: 'Detect device types to configure responsive rules.'
    },
    {
      key: 'custom_code',
      title: 'Custom Code',
      description: 'Run your own code on every request.'
    },
    {
      key: 'image_optimization',
      title: 'Image Optimization',
      description: 'Enable dynamic image editing options.'
    },
    {
      key: 'load_balancing',
      title: 'Load Balancing',
      description:
        'Balance traffic to your origins ensuring reliability and network congestion control.'
    }
  ]
  const saveOptions = [
    { label: 'Save and deploy', value: 'deploy' },
    { label: 'Save and build', value: 'build' },
    { label: 'Save', value: 'save' }
  ]
  const wireSections = [
    { id: 'general', rows: ['62%', '48%'] },
    { id: 'modules', rows: ['54%', '66%', '44%'] }
  ]
  const ADD_VERSION = '__create-version__'
  const ADD_ENVIRONMENT = '__create-environment__'

  const resource = computed(() => props.resource ?? sampleResource)
  const versions = computed(() => props.versions ?? sampleVersions)
  const revertDiff = computed(() => props.revertDiff ?? sampleRevertDiff)
  const environments = computed(() => props.environments ?? [])
  const viewed = computed<VersionDetailVersion>(
    () =>
      versions.value.find((entry) => entry.id === versionId.value) ??
      versions.value[0] ?? {
        name: versionId.value,
        id: versionId.value,
        state: 'ready',
        comment: '',
        author: '',
        createdAgo: ''
      }
  )
  const isDraft = computed(() => viewed.value.state === 'draft')
  const deployed = computed(() => versions.value.find((entry) => entry.state === 'deployed'))
  const version = computed(() =>
    viewed.value.state === 'ready' ? (deployed.value ?? viewed.value) : viewed.value
  )
  const earlier = computed(() =>
    versions.value.slice(versions.value.findIndex((entry) => entry.id === version.value.id) + 1)
  )
  const tagFor = (entry: VersionDetailVersion) => STATE_TAGS[entry.state]
  const tabLabel = computed(() => tabs.find((tab) => tab.value === activeTab.value)?.label ?? '')
  const statusLabel = computed(() => {
    if (props.creating) return 'Creating new version…'
    if (props.reverting) return `Reverting to ${viewed.value.name}…`
    if (isDraft.value) return 'Draft'
    return viewed.value.state === 'deployed'
      ? 'Viewing a deployed version'
      : 'Viewing an earlier version'
  })
  const statusLine = computed(() => {
    if (props.creating) return `Copying ${viewed.value.name} into a new draft.`
    if (isDraft.value) return 'This version is open for editing. Deploy it when ready.'
    return viewed.value.comment
  })

  const query = ref('')
  const environmentQuery = ref('')
  const form = reactive<VersionDetailSettings>({ name: '', active: false, modules: {} })
  const saveAction = ref<string | undefined>('deploy')
  const historyBasis = ref(348)
  const description = ref('')
  const draftText = ref('')
  const editing = ref(false)
  const shown = ref(5)
  const confirmOpen = ref(false)

  const matches = computed(() =>
    versions.value.filter((entry) =>
      entry.name.toLowerCase().includes(query.value.trim().toLowerCase())
    )
  )
  const environmentMatches = computed(() => {
    const needle = environmentQuery.value.trim().toLowerCase()
    if (!needle) return environments.value
    return environments.value.filter((entry) => entry.name.toLowerCase().includes(needle))
  })
  const environmentName = computed(() => environment.value || environments.value[0]?.name || '')

  watch(
    () => props.settings ?? sampleSettings,
    (next) => {
      form.name = next.name
      form.active = next.active
      form.modules = { ...next.modules }
    },
    { immediate: true }
  )
  watch(
    () => version.value.comment,
    (next) => {
      description.value = next
    },
    { immediate: true }
  )

  const servedIn = (id: string) =>
    environments.value.filter((entry) => entry.serves === id).map((entry) => entry.name)
  const pickVersion = (value: unknown) => {
    if (value !== ADD_VERSION && value !== undefined && value !== null)
      versionId.value = String(value)
  }
  const pickEnvironment = (value: unknown) => {
    if (value === ADD_ENVIRONMENT || value === undefined || value === null) return
    environment.value = String(value)
    const served = environments.value.find((entry) => entry.name === value)?.serves
    if (served) versionId.value = served
  }

  const openHistory = (_event: MouseEvent | KeyboardEvent, value: DropdownMenuItemValue) => {
    if (value === 'history' && historyExpanded.value) {
      historyExpanded.value = false
      return
    }
    editing.value = value === 'edit'
    if (editing.value) draftText.value = description.value
    historyExpanded.value = true
  }
  const saveDescription = (event: MouseEvent) => {
    description.value = draftText.value.trim()
    editing.value = false
    emit('save-description', event, description.value)
  }
  const save = (event: MouseEvent) =>
    emit('save', event, {
      action: saveAction.value ?? 'deploy',
      settings: { ...form, modules: { ...form.modules } }
    })
  const confirmRevert = (event: MouseEvent) => {
    confirmOpen.value = false
    emit('revert', event, viewed.value)
  }

  const CONTACT_SALES_LINK_CLASS =
    'inline-flex items-center gap-(--spacing-2xs) rounded-(--shape-button) text-(--text-link) underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance ' +
    'hover:text-(--text-link-hover) underline hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 ' +
    'focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none'

  const VERSION_LINK_CLASS =
    'group flex w-full min-w-0 gap-(--spacing-sm) rounded-(--shape-button) text-start no-underline ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)'
</script>

<template>
  <div
    data-layout-fill
    class="flex h-dvh min-h-0 flex-col"
  >
    <ConsoleLayout.Breadcrumb
      :items="[
        { label: 'Resources', href: '/resources' },
        { label: resource.name, href: resource.href }
      ]"
    >
      <Select
        v-if="environments.length"
        variant="ghost"
        size="small"
        :model-value="environmentName"
        :display-value="(value) => String(value ?? '')"
        @update:model-value="pickEnvironment"
        @update:open="
          (open) => {
            if (!open) environmentQuery = ''
          }
        "
      >
        <Select.Trigger aria-label="Switch environment" />
        <Select.Content>
          <template #search>
            <Input
              v-model="environmentQuery"
              size="small"
              placeholder="Search environments"
              aria-label="Search environments"
              @keydown.stop
            >
              <template #leading>
                <i
                  class="az az-search"
                  aria-hidden="true"
                />
              </template>
            </Input>
          </template>
          <Select.Group label="Environments">
            <Select.Item
              v-for="entry in environmentMatches"
              :key="entry.name"
              :value="entry.name"
            >
              {{ entry.name }}
              <template #tag>
                <Tag
                  :label="entry.policy"
                  severity="neutral"
                  size="small"
                />
              </template>
            </Select.Item>
            <p
              v-if="!environmentMatches.length"
              class="px-(--spacing-xs) py-(--spacing-2xs) text-body-sm text-(--text-muted)"
            >
              No environments match"{{ environmentQuery }}".
            </p>
          </Select.Group>
          <template #footer>
            <Select.Item
              :value="ADD_ENVIRONMENT"
              class="w-full"
              @click="(event: MouseEvent) => emit('add-environment', event)"
              @keydown.enter="(event: KeyboardEvent) => emit('add-environment', event)"
            >
              <span class="flex items-center gap-(--spacing-xs)">
                <i
                  class="az az-circle-plus"
                  aria-hidden="true"
                />
                Add Environment
              </span>
            </Select.Item>
          </template>
        </Select.Content>
      </Select>
      <Select
        variant="ghost"
        size="small"
        :model-value="viewed.id"
        @update:model-value="pickVersion"
        :display-value="(id) => versions.find((entry) => entry.id === id)?.name ?? String(id ?? '')"
        @update:open="
          (open) => {
            if (!open) query = ''
          }
        "
      >
        <Select.Trigger aria-label="Switch version" />
        <Select.Content>
          <template #search>
            <Input
              v-model="query"
              size="small"
              placeholder="Search versions"
              aria-label="Search versions"
              @keydown.stop
            >
              <template #leading>
                <i
                  class="az az-search"
                  aria-hidden="true"
                />
              </template>
            </Input>
          </template>
          <Select.Group label="Versions">
            <Select.Item
              v-for="entry in matches"
              :key="entry.id"
              :value="entry.id"
            >
              {{ entry.name }}
              <span
                v-if="servedIn(entry.id).length"
                class="text-body-xs text-(--text-muted)"
                >Live in {{ servedIn(entry.id).join(', ') }}</span
              >
              <template #tag>
                <Tag
                  :label="tagFor(entry).label"
                  :variant="tagFor(entry).variant"
                  :severity="tagFor(entry).severity"
                  :icon="tagFor(entry).icon"
                  size="small"
                />
              </template>
            </Select.Item>
            <p
              v-if="!matches.length"
              class="px-(--spacing-xs) py-(--spacing-2xs) text-body-sm text-(--text-muted)"
            >
              No versions match"{{ query }}".
            </p>
          </Select.Group>
          <template #footer>
            <Select.Item
              :value="ADD_VERSION"
              class="w-full"
              @click="(event: MouseEvent) => emit('add-version', event)"
              @keydown.enter="(event: KeyboardEvent) => emit('add-version', event)"
            >
              <span class="flex items-center gap-(--spacing-xs)">
                <i
                  class="az az-circle-plus"
                  aria-hidden="true"
                />
                Add Version
              </span>
            </Select.Item>
          </template>
        </Select.Content>
      </Select>
    </ConsoleLayout.Breadcrumb>
    <nav
      aria-label="Breadcrumb"
      class="flex min-w-0 items-center gap-(--spacing-xs) border-b border-(--border-default) bg-(--bg-surface) px-(--spacing-md) py-(--spacing-xs) md:hidden"
    >
      <Tooltip :content="`Back to ${resource.name} versions`">
        <IconButton
          icon="az az-arrow-left"
          variant="ghost"
          size="medium"
          :href="`${resource.href}?tab=versions`"
          :aria-label="`Back to ${resource.name} versions`"
        />
      </Tooltip>
      <div
        v-if="environments.length"
        class="min-w-0 flex-1"
      >
        <Select
          :model-value="environmentName"
          :display-value="(value) => String(value ?? '')"
          class="w-full"
          @update:model-value="pickEnvironment"
          @update:open="
            (open) => {
              if (!open) environmentQuery = ''
            }
          "
        >
          <Select.Trigger aria-label="Switch environment" />
          <Select.Content>
            <template #search>
              <Input
                v-model="environmentQuery"
                size="small"
                placeholder="Search environments"
                aria-label="Search environments"
                @keydown.stop
              >
                <template #leading>
                  <i
                    class="az az-search"
                    aria-hidden="true"
                  />
                </template>
              </Input>
            </template>
            <Select.Group label="Environments">
              <Select.Item
                v-for="entry in environmentMatches"
                :key="entry.name"
                :value="entry.name"
              >
                {{ entry.name }}
                <template #tag>
                  <Tag
                    :label="entry.policy"
                    severity="neutral"
                    size="small"
                  />
                </template>
              </Select.Item>
              <p
                v-if="!environmentMatches.length"
                class="px-(--spacing-xs) py-(--spacing-2xs) text-body-sm text-(--text-muted)"
              >
                No environments match"{{ environmentQuery }}".
              </p>
            </Select.Group>
            <template #footer>
              <Select.Item
                :value="ADD_ENVIRONMENT"
                class="w-full"
                @click="(event: MouseEvent) => emit('add-environment', event)"
                @keydown.enter="(event: KeyboardEvent) => emit('add-environment', event)"
              >
                <span class="flex items-center gap-(--spacing-xs)">
                  <i
                    class="az az-circle-plus"
                    aria-hidden="true"
                  />
                  Add Environment
                </span>
              </Select.Item>
            </template>
          </Select.Content>
        </Select>
      </div>
      <div class="min-w-0 flex-1">
        <Select
          :model-value="viewed.id"
          @update:model-value="pickVersion"
          :display-value="
            (id) => versions.find((entry) => entry.id === id)?.name ?? String(id ?? '')
          "
          class="w-full"
          @update:open="
            (open) => {
              if (!open) query = ''
            }
          "
        >
          <Select.Trigger aria-label="Switch version" />
          <Select.Content>
            <template #search>
              <Input
                v-model="query"
                size="small"
                placeholder="Search versions"
                aria-label="Search versions"
                @keydown.stop
              >
                <template #leading>
                  <i
                    class="az az-search"
                    aria-hidden="true"
                  />
                </template>
              </Input>
            </template>
            <Select.Group label="Versions">
              <Select.Item
                v-for="entry in matches"
                :key="entry.id"
                :value="entry.id"
              >
                {{ entry.name }}
                <span
                  v-if="servedIn(entry.id).length"
                  class="text-body-xs text-(--text-muted)"
                  >Live in {{ servedIn(entry.id).join(', ') }}</span
                >
                <template #tag>
                  <Tag
                    :label="tagFor(entry).label"
                    :variant="tagFor(entry).variant"
                    :severity="tagFor(entry).severity"
                    :icon="tagFor(entry).icon"
                    size="small"
                  />
                </template>
              </Select.Item>
              <p
                v-if="!matches.length"
                class="px-(--spacing-xs) py-(--spacing-2xs) text-body-sm text-(--text-muted)"
              >
                No versions match"{{ query }}".
              </p>
            </Select.Group>
            <template #footer>
              <Select.Item
                :value="ADD_VERSION"
                class="w-full"
                @click="(event: MouseEvent) => emit('add-version', event)"
                @keydown.enter="(event: KeyboardEvent) => emit('add-version', event)"
              >
                <span class="flex items-center gap-(--spacing-xs)">
                  <i
                    class="az az-circle-plus"
                    aria-hidden="true"
                  />
                  Add Version
                </span>
              </Select.Item>
            </template>
          </Select.Content>
        </Select>
      </div>
    </nav>
    <div class="grid min-h-0 flex-1">
      <Resizable
        orientation="horizontal"
        aria-label="Version workspace"
      >
        <Resizable.Pane aria-label="Version settings">
          <div class="flex min-h-0 min-w-0 flex-1 flex-col">
            <PageTabs v-model="activeTab">
              <Tabs.Trigger
                v-for="tab in tabs"
                :key="tab.value"
                :value="tab.value"
                :label="tab.label"
              />
              <template #actions>
                <span
                  v-if="!isDraft && viewed.createdOn"
                  class="hidden text-body-sm text-(--text-muted) md:inline"
                >
                  Created {{ viewed.createdOn }}
                </span>
                <Tag
                  :label="tagFor(viewed).label"
                  :variant="tagFor(viewed).variant"
                  :severity="tagFor(viewed).severity"
                  :icon="tagFor(viewed).icon"
                  size="medium"
                />
                <DropdownMenu
                  side="bottom"
                  align="end"
                  @select="openHistory"
                >
                  <DropdownMenu.Trigger>
                    <IconButton
                      icon="az az-ellipsis"
                      variant="ghost"
                      size="small"
                      aria-label="Version actions"
                    />
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Group>
                    <DropdownMenu.Item
                      v-if="isDraft"
                      value="edit"
                      label="Edit version info"
                    >
                      <template #leading>
                        <i
                          class="az az-pencil"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      value="history"
                      :label="historyExpanded ? 'Hide version history' : 'Show version history'"
                    >
                      <template #leading>
                        <i
                          class="az az-history"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Item>
                  </DropdownMenu.Group>
                </DropdownMenu>
              </template>
            </PageTabs>

            <section
              v-if="activeTab === 'main-settings' && !creating"
              class="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] transition-opacity duration-moderate-01 ease-productive-entrance data-processing:opacity-32 motion-reduce:transition-none"
            >
              <ScrollArea
                aria-label="Version settings"
                fade
              >
                <div class="flex min-h-full flex-col">
                  <fieldset
                    :disabled="!isDraft"
                    class="contents"
                  >
                    <legend class="sr-only">
                      {{ resource.name }} {{ viewed.name }}{{ isDraft ? '' : ', read-only' }}
                    </legend>
                    <form
                      class="flex min-h-full flex-col"
                      aria-label="Main settings"
                      novalidate
                      @submit.prevent
                    >
                      <div
                        class="layout-column-form layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
                      >
                        <PageHeader
                          title="Settings"
                          description="Core configuration for this resource."
                          size="small"
                        />

                        <fieldset
                          class="mx-0 mt-(--layout-section-gap) flex min-w-0 flex-col border-0 p-0"
                        >
                          <legend class="sr-only">Main settings</legend>

                          <SettingsGroup
                            label="General"
                            hint="How this resource is identified across the console, and whether it is serving traffic."
                            anchor="general"
                          >
                            <Card :padded="false">
                              <template #default>
                                <Item.List>
                                  <SettingsRow
                                    title="Name"
                                    description="A unique and descriptive name to identify the resource."
                                  >
                                    <Input
                                      v-model="form.name"
                                      size="large"
                                      class="w-full"
                                      aria-label="Name"
                                    />
                                  </SettingsRow>
                                  <SettingsRow
                                    title="Active"
                                    description="When disabled, the resource stops serving traffic."
                                    variant="compact"
                                  >
                                    <Switch
                                      v-model="form.active"
                                      aria-label="Active"
                                    />
                                  </SettingsRow>
                                </Item.List>
                              </template>
                            </Card>
                          </SettingsGroup>

                          <SettingsGroup
                            label="Modules"
                            hint="The capabilities this resource runs with, each of which can be toggled here."
                            anchor="modules"
                          >
                            <Card :padded="false">
                              <template #default>
                                <Item.List>
                                  <SettingsRow
                                    v-for="mod in defaultModules"
                                    :key="mod.key"
                                    :title="mod.title"
                                    :description="mod.description"
                                    variant="compact"
                                  >
                                    <Switch
                                      v-model="form.modules[mod.key]"
                                      :aria-label="mod.title"
                                    />
                                  </SettingsRow>
                                </Item.List>
                              </template>
                            </Card>
                          </SettingsGroup>

                          <SettingsGroup
                            label="Subscription modules"
                            hint="Paid add-ons that are activated with sales, not from this page."
                            anchor="subscription-modules"
                          >
                            <Card :padded="false">
                              <template #default>
                                <Item.List>
                                  <SettingsRow
                                    title="WebSocket Proxy"
                                    variant="compact"
                                  >
                                    <template #description>
                                      Enhance real-time data exchange between your resource and
                                      backend services using the WebSocket protocol.
                                      <a
                                        href="https://example.com/contact-sales"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        :class="CONTACT_SALES_LINK_CLASS"
                                      >
                                        Contact sales
                                        <i
                                          class="az az-external-link shrink-0 text-body-sm leading-none"
                                          aria-hidden="true"
                                        />
                                      </a>
                                    </template>
                                    <Tooltip content="Contact sales to activate this module.">
                                      <Switch
                                        v-model="form.modules.web_socket_proxy"
                                        disabled
                                        aria-label="WebSocket Proxy"
                                      />
                                    </Tooltip>
                                  </SettingsRow>
                                </Item.List>
                              </template>
                            </Card>
                          </SettingsGroup>
                        </fieldset>
                      </div>
                    </form>
                  </fieldset>
                </div>
              </ScrollArea>
            </section>
            <section
              v-else-if="activeTab === 'main-settings'"
              class="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] transition-opacity duration-moderate-01 ease-productive-entrance data-processing:opacity-32 motion-reduce:transition-none"
            >
              <ScrollArea
                aria-label="Version settings"
                fade
              >
                <div
                  role="status"
                  aria-busy="true"
                  class="layout-column-form layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap) animate-fade-in motion-reduce:animate-none"
                  data-testid="version-detail-wire"
                >
                  <span class="sr-only">Creating a new version from {{ viewed.name }}.</span>
                  <div
                    class="flex flex-col gap-(--spacing-xs)"
                    aria-hidden="true"
                  >
                    <Skeleton
                      width="8rem"
                      height="1.25rem"
                    />
                    <Skeleton
                      width="18rem"
                      height="0.875rem"
                    />
                  </div>
                  <div
                    class="mt-(--layout-section-gap) flex flex-col gap-(--layout-section-gap)"
                    aria-hidden="true"
                  >
                    <div
                      v-for="section in wireSections"
                      :key="section.id"
                      class="flex flex-col gap-(--layout-group-gap)"
                    >
                      <Skeleton
                        width="6rem"
                        height="1rem"
                      />
                      <Card :padded="false">
                        <template #default>
                          <div class="flex flex-col divide-y divide-(--border-default)">
                            <div
                              v-for="(width, index) in section.rows"
                              :key="index"
                              class="flex items-center gap-(--spacing-md) p-(--spacing-md)"
                            >
                              <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xs)">
                                <Skeleton
                                  width="7rem"
                                  height="0.875rem"
                                />
                                <Skeleton
                                  :width="width"
                                  height="0.75rem"
                                />
                              </div>
                              <span class="flex shrink-0">
                                <Skeleton
                                  width="2.25rem"
                                  height="1.25rem"
                                />
                              </span>
                            </div>
                          </div>
                        </template>
                      </Card>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </section>
            <section
              v-else-if="$slots[activeTab]"
              class="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] transition-opacity duration-moderate-01 ease-productive-entrance data-processing:opacity-32 motion-reduce:transition-none"
            >
              <slot
                :name="activeTab"
                :label="tabLabel"
              />
            </section>
            <section
              v-else
              class="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] transition-opacity duration-moderate-01 ease-productive-entrance data-processing:opacity-32 motion-reduce:transition-none"
            >
              <div class="layout-column layout-boundary flex min-w-0 flex-col">
                <div class="layout-section-start">
                  <EmptyState
                    size="medium"
                    icon="az az-external-link"
                    :title="tabLabel"
                    :description="`${tabLabel} opens on its own page.`"
                  >
                    <template #actions>
                      <Button
                        :label="`Open ${tabLabel}`"
                        variant="outline"
                        size="small"
                        :href="`/resources/${resource.name}/${activeTab}`"
                      />
                    </template>
                  </EmptyState>
                </div>
              </div>
            </section>

            <Transition
              appear
              enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
              enter-from-class="translate-y-2 opacity-0"
            >
              <footer
                class="flex min-h-14 shrink-0 flex-col border-t border-(--border-default) bg-(--bg-surface)"
                data-testid="version-detail-bar"
              >
                <div
                  class="layout-boundary-inline flex min-w-0 flex-1 items-center gap-(--spacing-sm) py-(--spacing-xs)"
                >
                  <span
                    v-if="creating || isDraft"
                    class="hidden size-8 shrink-0 items-center justify-center rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface-raised) md:flex"
                    aria-hidden="true"
                  >
                    <Spinner v-if="creating" />
                    <i
                      v-else
                      class="az az-file-pen text-body-sm text-(--text-default)"
                    />
                  </span>
                  <div
                    class="flex min-w-0 flex-1 flex-col"
                    role="status"
                  >
                    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                      <span class="truncate text-body-sm text-(--text-default)">{{
                        statusLabel
                      }}</span>
                      <span
                        v-if="!creating"
                        class="hidden shrink-0 sm:inline-flex"
                      >
                        <Tag
                          :label="isDraft ? 'Editable' : 'Read-only'"
                          :severity="isDraft ? 'info' : 'neutral'"
                          :icon="isDraft ? '' : 'az az-lock'"
                          size="small"
                        />
                      </span>
                    </div>
                    <p
                      class="hidden truncate text-body-xs text-(--text-muted) md:block"
                      :title="statusLine"
                    >
                      {{ statusLine }}
                    </p>
                  </div>

                  <div class="flex shrink-0 items-center gap-(--spacing-xs)">
                    <SplitButton
                      v-if="isDraft && !creating"
                      :label="saveOptions.find((option) => option.value === saveAction)?.label"
                      :icon="saveAction === 'deploy' ? 'az az-cloud-upload' : ''"
                      variant="primary"
                      size="medium"
                      :items="saveOptions"
                      @click="save"
                      @item-click="(_event, item) => (saveAction = item.value)"
                    />
                    <template v-else>
                      <Button
                        label="Add Version"
                        variant="outline"
                        size="medium"
                        icon="az az-plus"
                        :loading="creating"
                        @click="(event: MouseEvent) => emit('add-version', event)"
                      />
                      <Button
                        v-if="viewed.state !== 'ready'"
                        label="Redeploy"
                        variant="outline"
                        size="medium"
                        icon="az az-refresh"
                        :disabled="creating"
                        @click="(event: MouseEvent) => emit('redeploy', event)"
                      />
                      <ConfirmDialog
                        v-else
                        v-model:open="confirmOpen"
                        :title="`Revert to ${viewed.name}?`"
                        :description="`Reverting deploys ${viewed.name} to Production in place of ${version.name}. ${version.name} stays in the version history, so you can redeploy it later.`"
                        :confirm-label="`Revert to ${viewed.name}`"
                        variant="primary"
                        size="medium"
                        @confirm="confirmRevert"
                      >
                        <template #trigger>
                          <Button
                            :label="`Revert to ${viewed.name}`"
                            variant="primary"
                            size="medium"
                            icon="az az-undo"
                            :loading="reverting"
                          />
                        </template>
                        <div class="flex min-w-0 flex-col gap-(--spacing-md) pt-(--spacing-md)">
                          <section
                            aria-labelledby="revert-settings-title"
                            class="flex min-w-0 flex-col gap-(--spacing-xs)"
                          >
                            <h3
                              id="revert-settings-title"
                              class="text-label-md text-(--text-default)"
                            >
                              What changes against {{ version.name }}
                            </h3>
                            <ul
                              class="flex min-w-0 flex-col divide-y divide-(--border-muted) rounded-(--shape-control) border border-(--border-default)"
                            >
                              <li
                                v-for="change in revertDiff.settings"
                                :key="change.setting"
                                class="flex min-w-0 items-center justify-between gap-(--spacing-sm) px-(--spacing-sm) py-(--spacing-xs)"
                              >
                                <span class="truncate text-body-sm text-(--text-default)">{{
                                  change.setting
                                }}</span>
                                <span class="sr-only">{{
                                  `changes from ${change.from} to ${change.to}`
                                }}</span>
                                <span
                                  class="flex shrink-0 items-center gap-(--spacing-xs) text-body-sm"
                                  aria-hidden="true"
                                >
                                  <span class="text-(--text-muted) line-through">{{
                                    change.from
                                  }}</span>
                                  <i class="az az-arrow-right text-body-xs text-(--text-muted)" />
                                  <span class="text-(--text-default)">{{ change.to }}</span>
                                </span>
                              </li>
                            </ul>
                          </section>
                          <p class="text-body-sm text-(--text-default)">
                            Rules: {{ revertDiff.rulesAdded }} added,
                            {{ revertDiff.rulesRemoved }} removed. {{ revertDiff.rulesNote }}
                          </p>
                        </div>
                      </ConfirmDialog>
                    </template>
                  </div>
                </div>
              </footer>
            </Transition>
          </div>
        </Resizable.Pane>
        <Resizable.Handle
          v-if="historyExpanded"
          aria-label="Resize the version history"
        />
        <Resizable.Pane
          v-model:basis="historyBasis"
          v-model:open="historyExpanded"
          collapsible
          :min="280"
          :max="560"
          aria-label="Version history"
        >
          <aside
            :inert="!historyExpanded"
            aria-labelledby="version-history-title"
            class="flex min-h-0 min-w-0 flex-1 flex-col bg-(--bg-surface)"
            data-testid="version-detail-history"
            @keydown.esc="historyExpanded = false"
          >
            <header
              class="flex min-h-14 shrink-0 items-center justify-between gap-(--spacing-xs) border-b border-(--border-default) py-(--spacing-xs) ps-(--spacing-lg) pe-(--spacing-sm)"
            >
              <h2
                id="version-history-title"
                class="truncate text-label-lg text-(--text-default)"
              >
                Version history
              </h2>
              <IconButton
                icon="az az-x"
                variant="ghost"
                size="small"
                aria-label="Close version history"
                @click="historyExpanded = false"
              />
            </header>
            <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain p-(--spacing-lg)">
              <ol class="flex flex-col">
                <li class="relative flex gap-(--spacing-sm) pb-(--spacing-lg)">
                  <span
                    class="absolute bottom-0 start-3.5 top-7 w-px -translate-x-1/2 bg-(--border-default)"
                    aria-hidden="true"
                  />
                  <span
                    class="relative flex size-7 shrink-0 items-center justify-center rounded-full bg-(--accent) text-(--accent-foreground)"
                    aria-hidden="true"
                  >
                    <i
                      :class="version.state === 'draft' ? 'az az-file-pen' : 'az az-code'"
                      class="text-body-xs"
                    />
                  </span>
                  <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-2xs) pt-0.5">
                    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                      <span class="truncate text-label-md text-(--text-default)">
                        {{ version.name }}
                      </span>
                      <span class="flex shrink-0">
                        <Tag
                          :label="tagFor(version).label"
                          :variant="tagFor(version).variant"
                          :severity="tagFor(version).severity"
                          size="small"
                        />
                      </span>
                      <span
                        v-if="version.state === 'draft' && !editing"
                        class="ms-auto shrink-0"
                      >
                        <IconButton
                          icon="az az-pencil"
                          variant="ghost"
                          size="small"
                          aria-label="Edit version info"
                          @click="
                            () => {
                              draftText = description
                              editing = true
                            }
                          "
                        />
                      </span>
                    </div>
                    <p class="text-label-sm text-(--text-muted)">Current version</p>

                    <div
                      v-if="version.state === 'draft' && editing"
                      class="flex flex-col gap-(--spacing-sm) pt-(--spacing-xs)"
                    >
                      <Field>
                        <Field.Label>Description</Field.Label>
                        <Textarea
                          v-model="draftText"
                          placeholder="What changed in this version?"
                        />
                        <Field.Description
                          >Shows in the version list and on the deployment.</Field.Description
                        >
                      </Field>
                      <div class="flex justify-end gap-(--spacing-xs)">
                        <Button
                          label="Cancel"
                          variant="outline"
                          size="small"
                          @click="editing = false"
                        />
                        <Button
                          label="Save"
                          variant="primary"
                          size="small"
                          @click="saveDescription"
                        />
                      </div>
                    </div>
                    <template v-else>
                      <p
                        :data-empty="!description || null"
                        class="text-body-sm text-(--text-default) data-empty:text-(--text-muted)"
                      >
                        {{ description || 'No description' }}
                      </p>
                      <span
                        class="flex min-w-0 items-center gap-(--spacing-xs) text-body-xs text-(--text-muted)"
                      >
                        <span class="flex shrink-0">
                          <Avatar
                            :alt="version.author"
                            :label="version.author"
                            size="small"
                            variant="square"
                          />
                        </span>
                        <span class="truncate"
                          >{{ version.author }} · {{ version.createdAgo }}</span
                        >
                      </span>
                    </template>
                  </div>
                </li>

                <li
                  v-if="version.state === 'draft'"
                  class="relative flex flex-col pb-(--spacing-lg)"
                >
                  <span
                    class="absolute bottom-0 start-3.5 top-7 w-px -translate-x-1/2 bg-(--border-default)"
                    aria-hidden="true"
                  />
                  <p class="flex gap-(--spacing-sm)">
                    <span
                      class="relative flex size-7 shrink-0 items-center justify-center"
                      aria-hidden="true"
                    >
                      <span
                        class="size-2 rounded-full border border-(--border-strong) bg-(--bg-surface)"
                      />
                    </span>
                    <span class="pt-1 text-body-sm text-(--text-muted)">
                      No changes yet. Each change you save shows up here.
                    </span>
                  </p>
                </li>

                <li
                  v-for="(entry, index) in earlier.slice(0, shown)"
                  :key="entry.id"
                  class="relative flex pb-(--spacing-lg) last:pb-0"
                >
                  <span
                    v-if="index < earlier.slice(0, shown).length - 1"
                    class="absolute bottom-0 start-3.5 top-7 w-px -translate-x-1/2 bg-(--border-default)"
                    aria-hidden="true"
                  />
                  <a
                    :href="`/resources/${resource.name}/versions/${entry.name}`"
                    :aria-current="entry.id === viewed.id ? 'page' : undefined"
                    :class="VERSION_LINK_CLASS"
                  >
                    <span
                      class="relative flex size-7 shrink-0 items-center justify-center rounded-full border border-(--border-default) bg-(--bg-surface) text-(--text-default)"
                      aria-hidden="true"
                    >
                      <i class="az az-code text-body-xs" />
                    </span>
                    <span class="flex min-w-0 flex-1 flex-col gap-(--spacing-2xs) pt-0.5">
                      <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                        <span
                          class="truncate text-label-md text-(--text-default) group-hover:underline"
                        >
                          {{ entry.name }}
                        </span>
                        <span class="flex shrink-0">
                          <Tag
                            :label="tagFor(entry).label"
                            :variant="tagFor(entry).variant"
                            :severity="tagFor(entry).severity"
                            size="small"
                          />
                        </span>
                        <span
                          v-if="entry.id === viewed.id"
                          class="flex shrink-0"
                        >
                          <Tag
                            label="Viewing"
                            severity="info"
                            size="small"
                          />
                        </span>
                      </span>
                      <span class="line-clamp-2 text-body-sm text-(--text-muted)">
                        {{ entry.comment }}
                      </span>
                      <span
                        class="flex min-w-0 items-center gap-(--spacing-xs) text-body-xs text-(--text-muted)"
                      >
                        <span class="flex shrink-0">
                          <Avatar
                            :alt="entry.author"
                            :label="entry.author"
                            size="small"
                            variant="square"
                          />
                        </span>
                        <span class="truncate">{{ entry.author }} · {{ entry.createdAgo }}</span>
                      </span>
                    </span>
                  </a>
                </li>
              </ol>

              <div
                v-if="earlier.length > shown"
                class="pt-(--spacing-sm)"
              >
                <Button
                  label="Show older"
                  variant="ghost"
                  size="small"
                  @click="shown += 5"
                />
              </div>
            </div>
          </aside>
        </Resizable.Pane>
      </Resizable>
    </div>
  </div>
</template>
