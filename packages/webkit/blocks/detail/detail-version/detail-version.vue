<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import ConsoleLayout from '@aziontech/webkit/console-layout'
  import type { DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import Resizable from '@aziontech/webkit/resizable'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, reactive, ref, watch } from 'vue'

  import { ADD_ENVIRONMENT, ADD_VERSION, VERSION_TABS as tabs } from './detail-version-states'
  import CreatingWire from './parts/creating-wire.vue'
  import EnvironmentSwitcher from './parts/environment-switcher.vue'
  import SettingsPanel from './parts/settings-panel.vue'
  import VersionBar from './parts/version-bar.vue'
  import VersionHistory from './parts/version-history.vue'
  import VersionSwitcher from './parts/version-switcher.vue'
  import VersionTabBar from './parts/version-tab-bar.vue'
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
  const tabLabel = computed(() => tabs.find((tab) => tab.value === activeTab.value)?.label ?? '')

  const query = ref('')
  const environmentQuery = ref('')
  const form = reactive<VersionDetailSettings>({ name: '', active: false, modules: {} })
  const historyBasis = ref(348)
  const description = ref('')
  const draftText = ref('')
  const editing = ref(false)

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
  const save = (event: MouseEvent, action: string) =>
    emit('save', event, {
      action,
      settings: { ...form, modules: { ...form.modules } }
    })
  const confirmRevert = (event: MouseEvent) => emit('revert', event, viewed.value)

  const TAB_PANEL_CLASS =
    'grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] transition-opacity duration-moderate-01 ' +
    'ease-productive-entrance data-processing:opacity-32 motion-reduce:transition-none'
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
      <EnvironmentSwitcher
        v-if="environments.length"
        v-model:query="environmentQuery"
        variant="ghost"
        size="small"
        :environments="environments"
        :environment-name="environmentName"
        @pick="pickEnvironment"
        @add="(event) => emit('add-environment', event)"
      />
      <VersionSwitcher
        v-model:query="query"
        variant="ghost"
        size="small"
        :versions="versions"
        :environments="environments"
        :viewed-id="viewed.id"
        @pick="pickVersion"
        @add="(event) => emit('add-version', event)"
      />
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
        <EnvironmentSwitcher
          v-model:query="environmentQuery"
          class="w-full"
          :environments="environments"
          :environment-name="environmentName"
          @pick="pickEnvironment"
          @add="(event) => emit('add-environment', event)"
        />
      </div>
      <div class="min-w-0 flex-1">
        <VersionSwitcher
          v-model:query="query"
          class="w-full"
          :versions="versions"
          :environments="environments"
          :viewed-id="viewed.id"
          @pick="pickVersion"
          @add="(event) => emit('add-version', event)"
        />
      </div>
    </nav>
    <div class="grid min-h-0 flex-1">
      <Resizable
        orientation="horizontal"
        aria-label="Version workspace"
      >
        <Resizable.Pane aria-label="Version settings">
          <div class="flex min-h-0 min-w-0 flex-1 flex-col">
            <VersionTabBar
              v-model:tab="activeTab"
              :viewed="viewed"
              :history-expanded="historyExpanded"
              @select="openHistory"
            />

            <SettingsPanel
              v-if="activeTab === 'main-settings' && !creating"
              :form="form"
              :resource-name="resource.name"
              :version-name="viewed.name"
              :is-draft="isDraft"
            />
            <CreatingWire
              v-else-if="activeTab === 'main-settings'"
              :version-name="viewed.name"
            />
            <section
              v-else-if="$slots[activeTab]"
              :class="TAB_PANEL_CLASS"
            >
              <slot
                :name="activeTab"
                :label="tabLabel"
              />
            </section>
            <section
              v-else
              :class="TAB_PANEL_CLASS"
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

            <VersionBar
              :viewed="viewed"
              :version="version"
              :revert-diff="revertDiff"
              :creating="creating"
              :reverting="reverting"
              @save="save"
              @add-version="(event) => emit('add-version', event)"
              @redeploy="(event) => emit('redeploy', event)"
              @revert="confirmRevert"
            />
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
          @keydown.esc="historyExpanded = false"
        >
          <VersionHistory
            v-model:open="historyExpanded"
            v-model:editing="editing"
            v-model:draft-text="draftText"
            :resource-name="resource.name"
            :viewed-id="viewed.id"
            :version="version"
            :earlier="earlier"
            :description="description"
            @save="saveDescription"
          />
        </Resizable.Pane>
      </Resizable>
    </div>
  </div>
</template>
