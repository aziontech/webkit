<script setup>
  import Button from '@aziontech/webkit/button'
  import Dropdown from '@aziontech/webkit/dropdown'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import ResizablePanel from '@aziontech/webkit/resizable-panel'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import Spinner from '@aziontech/webkit/spinner'
  import SplitButton from '@aziontech/webkit/split-button'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, nextTick, onScopeDispose, provide, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import VersionCrumb from '../../components/application/VersionCrumb.vue'
  import VersionHistoryPanel from '../../components/application/VersionHistoryPanel.vue'
  import VersionWire from '../../components/application/VersionWire.vue'
  import ApplicationDeployDrawer from '../../components/deployment/ApplicationDeployDrawer.vue'
  import ApplicationEnvironmentDeployDrawer from '../../components/deployment/ApplicationEnvironmentDeployDrawer.vue'
  import UnsavedChangesGuard from '../../components/form/UnsavedChangesGuard.vue'
  import PageTabs from '../../components/page/PageTabs.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import { slidePane } from '../../lib/behavior/pane-slide'
  import { isTabDirty, tabCommit } from '../../lib/behavior/tab-dirty'
  import { useTabEnter } from '../../lib/behavior/tab-enter'
  import { VERSION_CHANGE_KEY, VERSION_COMMIT_KEY } from '../../lib/behavior/version-commit'
  import { applicationById } from '../../lib/data/applications'
  import { provisionedApplications } from '../../lib/data/provisioning'
  import { deployFlow } from '../../lib/state/sample-preset'
  import {
    applicationVersion,
    applicationVersions,
    buildApplicationVersion,
    createDraftFrom,
    earlierVersions,
    noteVersionChange,
    setVersionComment,
    versionComment
  } from '../../lib/data/releases'
  import {
    isActionAvailable,
    isEditable,
    isProcessing,
    VERSION_ACTIONS,
    VERSION_STATES,
    versionStateMeta,
    versionViewCopy
  } from '../../lib/data/versioning'
  import CacheSettings from './panels/CacheSettings.vue'
  import DeviceGroups from './panels/DeviceGroups.vue'
  import FunctionsInstances from './panels/FunctionsInstances.vue'
  import MainSettings from './panels/MainSettings.vue'
  import RulesEngine from './panels/RulesEngine.vue'
  import Source from './panels/Source.vue'

  const route = useRoute()
  const router = useRouter()

  const application = computed(() => {
    const id = String(route.params.id || '1784552864')
    const seeded = applicationById(id) ?? provisionedApplications.value.find((app) => app.id === id)
    return seeded ?? { id, name: String(route.query.name || 'webkit-sample-vue'), source: 'git' }
  })

  const version = computed(() =>
    applicationVersion(String(application.value.name), String(route.params.versionId))
  )

  const versions = computed(() => applicationVersions(String(application.value.name)))

  const state = computed(() => version.value?.state ?? '')
  const stateMeta = computed(() => versionStateMeta(state.value))
  const viewCopy = computed(() => versionViewCopy(state.value))
  const readOnly = computed(() => !isEditable(state.value))
  const deployable = computed(() => isActionAvailable(state.value, VERSION_ACTIONS.DEPLOY))
  const deployed = computed(() => state.value === VERSION_STATES.ACTIVE)
  const processing = computed(() => isProcessing(state.value))
  const canBranch = computed(
    () => readOnly.value && isActionAvailable(state.value, VERSION_ACTIONS.NEW_DRAFT_FROM)
  )

  const SAVE_SETTLE_MS = 50
  const SAVE_TIMEOUT_MS = 4000

  provide(VERSION_COMMIT_KEY, true)
  provide(VERSION_CHANGE_KEY, (text) => {
    if (version.value && !readOnly.value)
      noteVersionChange(String(application.value.name), version.value.id, text)
  })

  const barRef = ref(null)
  let barObserver = null

  const publishBarHeight = (height) => {
    const root = globalThis.document?.documentElement
    if (!root) return
    if (height) root.style.setProperty('--toast-offset-bottom', `${height}px`)
    else root.style.removeProperty('--toast-offset-bottom')
  }

  watch(barRef, (element) => {
    barObserver?.disconnect()
    barObserver = null
    if (!element) return publishBarHeight(0)
    barObserver = new globalThis.ResizeObserver(() => publishBarHeight(element.offsetHeight))
    barObserver.observe(element)
  })

  onScopeDispose(() => {
    barObserver?.disconnect()
    publishBarHeight(0)
  })

  const createdLabel = computed(() =>
    version.value?.createdAt
      ? `Created ${new Date(version.value.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })}`
      : ''
  )

  const versionsHref = computed(() => `/applications/${application.value.id}?tab=versions`)

  const tabs = computed(() => [
    {
      value: 'main-settings',
      label: 'Settings',
      component: MainSettings,
      props: { application: application.value }
    },
    {
      value: 'source',
      label: 'Source',
      component: Source,
      props: { application: application.value },
      versioned: false
    },
    { value: 'device-groups', label: 'Device Groups', component: DeviceGroups, props: {} },
    { value: 'cache-settings', label: 'Cache Settings', component: CacheSettings, props: {} },
    {
      value: 'functions-instances',
      label: 'Functions Instances',
      component: FunctionsInstances,
      props: {}
    },
    { value: 'rules-engine', label: 'Rules Engine', component: RulesEngine, props: {} }
  ])

  const currentTab = computed(() =>
    tabs.value.some((tab) => tab.value === route.query.tab) ? route.query.tab : 'main-settings'
  )

  const leavingTab = ref(null)
  const leavingCommit = computed(() => (leavingTab.value ? tabCommit(leavingTab.value) : null))
  const tabGuard = ref(null)

  const goToTab = (value) => router.replace({ query: { ...route.query, tab: value } })

  const activeTab = computed({
    get: () => currentTab.value,
    set: async (value) => {
      if (!value) return
      const from = currentTab.value
      if (value === from || !isTabDirty(from)) return goToTab(value)

      leavingTab.value = from
      await nextTick()
      const proceed = await tabGuard.value?.ask()
      leavingTab.value = null
      if (proceed) goToTab(value)
    }
  })

  const confirmLeave = async () => {
    const dirtyTab = tabs.value.find((tab) => isTabDirty(tab.value))?.value
    if (!dirtyTab) return true
    leavingTab.value = dirtyTab
    await nextTick()
    const proceed = await tabGuard.value?.ask()
    leavingTab.value = null
    return Boolean(proceed)
  }

  const switchVersion = async (versionId) => {
    if (!(await confirmLeave())) return
    router.push({
      path: `/applications/${application.value.id}/versions/${versionId}`,
      query: route.query
    })
  }

  const scrollRef = ref(null)
  const scrollEl = computed(() => scrollRef.value?.$el ?? null)
  const enterRef = ref(null)
  useTabEnter(enterRef, activeTab, scrollEl)

  const activeView = computed(
    () => tabs.value.find((tab) => tab.value === activeTab.value) ?? tabs.value[0]
  )

  const dirtyCommits = computed(() =>
    tabs.value.map((tab) => tabCommit(tab.value)).filter((commit) => commit?.dirty)
  )
  const dirty = computed(() => dirtyCommits.value.length > 0)
  const saving = ref(false)

  const sourceName = computed(
    () =>
      versions.value.find((entry) => entry.id === version.value?.sourceVersionId)?.name ?? ''
  )

  const draftActivity = computed(() => {
    const count = version.value?.changes?.length ?? 0
    const since = sourceName.value ? ` since ${sourceName.value}` : ''
    if (count) return `${count} ${count === 1 ? 'change' : 'changes'}${since}.`
    return sourceName.value ? `Copied from ${sourceName.value}. No changes yet.` : ''
  })

  const barTitle = computed(() =>
    creating.value ? 'Creating new version…' : viewCopy.value.title
  )

  const barDescription = computed(() => {
    if (creating.value) return `Copying ${version.value?.name} into a new draft.`
    if (dirty.value) return dirtyCommits.value[0].label || 'Unsaved changes.'
    if (readOnly.value) return version.value?.comment || viewCopy.value.description
    return draftActivity.value || viewCopy.value.description
  })

  const busy = computed(() => processing.value || creating.value)

  const settle = async () => {
    const started = Date.now()
    while (
      tabs.value.some((tab) => tabCommit(tab.value)?.saving) &&
      Date.now() - started < SAVE_TIMEOUT_MS
    ) {
      await new Promise((resolve) => setTimeout(resolve, SAVE_SETTLE_MS))
    }
  }

  const saveAll = async () => {
    saving.value = true
    try {
      dirtyCommits.value.forEach((commit) => commit.save?.())
      await nextTick()
      await settle()
    } finally {
      saving.value = false
    }
  }

  const discardAll = () => dirtyCommits.value.forEach((commit) => commit.discard?.())

  const deployOpen = ref(false)
  const drawerMode = ref('pinned')

  const historyOpen = ref(false)
  const historyEditing = ref(false)

  const HISTORY_WIDTH = { DEFAULT: 348, MIN: 280, MAX: 560 }

  const splitRef = ref(null)
  const historyPanelRef = ref(null)
  const historyCollapsed = ref(true)
  const historyBasis = ref(HISTORY_WIDTH.DEFAULT)
  const historyWidth = ref(HISTORY_WIDTH.DEFAULT)

  const narrowLayout = () => globalThis.matchMedia?.('(max-width: 47.999rem)').matches ?? false

  watch(historyBasis, (width) => {
    if (!narrowLayout()) historyWidth.value = width
  })

  watch(historyOpen, async (isOpen) => {
    const pane = historyPanelRef.value?.$el?.parentElement
    if (isOpen) {
      historyBasis.value = narrowLayout()
        ? (splitRef.value?.offsetWidth ?? historyWidth.value)
        : historyWidth.value
      historyCollapsed.value = false
      await nextTick()
      const animation = await slidePane(pane, 0, historyBasis.value, 'entrance')
      animation?.cancel()
      return
    }
    if (historyCollapsed.value) return
    const animation = await slidePane(pane, pane?.offsetWidth ?? 0, 0, 'exit')
    if (!historyOpen.value) historyCollapsed.value = true
    await nextTick()
    animation?.cancel()
  })

  watch(historyCollapsed, (collapsed) => {
    if (collapsed && historyOpen.value) historyOpen.value = false
  })

  const earlier = computed(() =>
    earlierVersions(String(application.value.name), version.value?.id ?? '')
  )

  const versionDescription = computed({
    get: () => versionComment(version.value),
    set: (text) => setVersionComment(version.value, text)
  })

  const suggestedDescription = computed(
    () => !version.value?.comment && Boolean(version.value?.changes?.length)
  )

  const VERSION_MENU = { EDIT: 'edit', HISTORY: 'history' }

  const openHistory = (event, value) => {
    if (value === VERSION_MENU.HISTORY && historyOpen.value) {
      historyOpen.value = false
      return
    }
    historyEditing.value = value === VERSION_MENU.EDIT && !readOnly.value
    historyOpen.value = true
  }

  const openEarlierVersion = (event, versionId) => {
    historyOpen.value = false
    switchVersion(versionId)
  }

  const openDeploy = () => {
    drawerMode.value = 'pinned'
    deployOpen.value = true
  }

  const SAVE_OPTIONS = [
    { label: 'Save and Deploy', value: 'deploy' },
    { label: 'Save and Build', value: 'build' },
    { label: 'Save', value: 'save' }
  ]

  const saveAction = ref('deploy')
  const saveOption = computed(
    () => SAVE_OPTIONS.find((option) => option.value === saveAction.value) ?? SAVE_OPTIONS[0]
  )
  const saveIcon = computed(() => (saveAction.value === 'deploy' ? 'pi pi-cloud-upload' : ''))

  const selectSaveAction = (event, item) => {
    saveAction.value = item.value
  }

  const saveOnly = async () => {
    if (!dirty.value) {
      toast.info('No changes to save.', {
        description: `${version.value.name} already matches what is stored.`
      })
      return
    }
    await saveAll()
    toast.success('Version saved.', {
      description: `${version.value.name} stays a draft. Build it or deploy it when it is ready.`,
      closable: true
    })
  }

  const runSaveAction = () => {
    if (saveAction.value === 'save') return saveOnly()
    if (saveAction.value === 'build') return saveAndBuild()
    return saveAndDeploy()
  }

  const saveAndBuild = async () => {
    await saveAll()
    buildApplicationVersion(String(application.value.name), version.value.id)
    toast.success('Build started.', {
      description: `${version.value.name} becomes a Ready version you can deploy when it finishes.`,
      closable: true
    })
  }

  const saveAndDeploy = async () => {
    await saveAll()
    drawerMode.value = 'build'
    deployOpen.value = true
  }

  const newVersionFromCrumb = async () => {
    if (await confirmLeave()) newVersion()
  }

  const CREATE_MS = 900
  const creating = ref(false)

  const newVersion = async () => {
    if (creating.value) return
    creating.value = true
    const source = version.value
    await new Promise((resolve) => setTimeout(resolve, CREATE_MS))
    const draft = createDraftFrom(String(application.value.name), source.id)
    await router.push({
      path: `/applications/${application.value.id}/versions/${draft.id}`,
      query: route.query
    })
    creating.value = false
    toast.success('Created new version.', {
      description: `${draft.name} is a draft copied from ${source.name}. Edit it, then build or deploy.`,
      closable: true
    })
  }
</script>

<template>
  <AppLayout
    active="applications"
    :padded="false"
    :breadcrumb="[
      { label: 'Applications', href: '/applications' },
      { label: application.name, href: versionsHref },
      { label: version?.name ?? String(route.params.versionId) }
    ]"
  >
    <template
      v-if="version"
      #crumb
    >
      <VersionCrumb
        :model-value="version.id"
        :versions="versions"
        @update:model-value="switchVersion"
        @create="newVersionFromCrumb"
      />
    </template>

    <div
      v-if="version"
      ref="splitRef"
      class="grid h-full min-h-0"
    >
      <ResizablePanel
        orientation="horizontal"
        aria-label="Version workspace"
      >
        <ResizablePanel.Pane aria-label="Version settings">
          <main class="flex min-h-0 min-w-0 flex-1 flex-col">
            <PageTabs
              v-model:value="activeTab"
              :tabs="tabs"
            >
              <template #actions>
                <span
                  v-if="createdLabel && !isEditable(state)"
                  class="hidden text-body-sm text-(--text-muted) md:inline"
                >
                  {{ createdLabel }}
                </span>
                <Tag
                  :label="stateMeta.label"
                  :severity="stateMeta.severity"
                  :icon="stateMeta.icon"
                  size="medium"
                />
                <Dropdown
                  v-if="!creating"
                  placement="bottom-end"
                  @select="openHistory"
                >
                  <Dropdown.Trigger>
                    <IconButton
                      icon="pi pi-ellipsis-h"
                      kind="transparent"
                      size="small"
                      aria-label="Version actions"
                    />
                  </Dropdown.Trigger>
                  <Dropdown.Group>
                    <Dropdown.Option
                      v-if="!readOnly"
                      :value="VERSION_MENU.EDIT"
                      label="Edit version info"
                    >
                      <template #left>
                        <i
                          class="pi pi-pencil"
                          aria-hidden="true"
                        />
                      </template>
                    </Dropdown.Option>
                    <Dropdown.Option
                      :value="VERSION_MENU.HISTORY"
                      :label="historyOpen ? 'Hide version history' : 'Show version history'"
                    >
                      <template #left>
                        <i
                          class="pi pi-history"
                          aria-hidden="true"
                        />
                      </template>
                    </Dropdown.Option>
                  </Dropdown.Group>
                </Dropdown>
              </template>
            </PageTabs>

            <section
              :inert="processing"
              :aria-busy="processing"
              :data-processing="processing || null"
              class="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] transition-opacity duration-moderate-01 ease-productive-entrance data-processing:opacity-32 motion-reduce:transition-none"
            >
              <ScrollArea
                ref="scrollRef"
                aria-label="Version settings"
              >
                <VersionWire
                  v-if="creating"
                  :label="`Creating a new version from ${version.name}.`"
                />
                <div
                  v-else
                  ref="enterRef"
                  :key="version.id"
                  class="flex min-h-full flex-col"
                >
                  <fieldset
                    :disabled="readOnly && activeView.versioned !== false"
                    class="contents"
                  >
                    <legend class="sr-only">
                      {{ application.name }} {{ version.name }}{{ readOnly ? ', read-only' : '' }}
                    </legend>
                    <KeepAlive>
                      <component
                        :is="activeView.component"
                        v-bind="activeView.props"
                      />
                    </KeepAlive>
                  </fieldset>
                </div>
              </ScrollArea>
            </section>

            <Transition
              appear
              enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
              enter-from-class="translate-y-2 opacity-0"
            >
              <footer
                ref="barRef"
                class="flex min-h-14 shrink-0 flex-col border-t border-(--border-default) bg-(--bg-surface)"
                data-testid="application-version-bar"
              >
                <div
                  class="layout-boundary-inline flex min-w-0 flex-1 items-center gap-(--spacing-sm) py-(--spacing-xs)"
                >
                  <span
                    v-if="viewCopy.icon || busy"
                    class="hidden size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised) md:flex"
                    aria-hidden="true"
                  >
                    <Spinner
                      v-if="busy"
                      class="size-4 text-(--text-default)"
                    />
                    <i
                      v-else
                      :class="viewCopy.icon"
                      class="text-body-sm text-(--text-default)"
                    />
                  </span>
                  <div
                    class="flex min-w-0 flex-1 flex-col"
                    role="status"
                  >
                    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                      <span class="truncate text-body-sm text-(--text-default)">{{ barTitle }}</span>
                      <Tag
                        v-if="state === VERSION_STATES.READY && !creating"
                        :label="stateMeta.label"
                        :severity="stateMeta.severity"
                        size="small"
                        class="shrink-0"
                      />
                      <span
                        v-if="!busy"
                        class="hidden shrink-0 sm:inline-flex"
                      >
                        <Tag
                          v-if="readOnly"
                          key="read-only"
                          label="Read Only"
                          severity="secondary"
                          icon="pi pi-lock"
                          size="small"
                        />
                        <Tag
                          v-else
                          key="editable"
                          label="Editable"
                          severity="info"
                          size="small"
                        />
                      </span>
                    </div>
                    <Transition
                      mode="out-in"
                      enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
                      enter-from-class="translate-y-2 opacity-0"
                      leave-active-class="transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
                      leave-to-class="translate-y-2 opacity-0"
                    >
                      <p
                        v-if="barDescription"
                        :key="dirty ? 'dirty' : 'clean'"
                        :data-dirty="dirty || null"
                        class="hidden truncate text-body-xs text-(--text-muted) data-dirty:text-(--text-default) md:block"
                        :title="barDescription"
                      >
                        {{ barDescription }}
                      </p>
                    </Transition>
                  </div>

                  <div
                    v-if="!readOnly"
                    class="flex shrink-0 items-center gap-(--spacing-xs)"
                  >
                    <Transition
                      enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
                      enter-from-class="translate-y-2 opacity-0"
                      leave-active-class="transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
                      leave-to-class="translate-y-2 opacity-0"
                    >
                      <Button
                        v-if="dirty"
                        label="Discard"
                        kind="outlined"
                        size="medium"
                        :disabled="saving"
                        @click="discardAll"
                      />
                    </Transition>
                    <SplitButton
                      :label="saveOption.label"
                      :icon="saveIcon"
                      kind="primary"
                      size="medium"
                      :model="SAVE_OPTIONS"
                      :loading="saving"
                      @click="runSaveAction"
                      @item-click="selectSaveAction"
                    />
                  </div>

                  <div
                    v-else-if="canBranch"
                    class="flex shrink-0 items-center gap-(--spacing-xs)"
                  >
                    <Button
                      label="New Version"
                      kind="outlined"
                      size="medium"
                      icon="pi pi-plus"
                      :loading="creating"
                      @click="newVersion"
                    />
                    <Button
                      v-if="deployable && deployed"
                      key="redeploy"
                      label="Redeploy"
                      kind="outlined"
                      size="medium"
                      icon="pi pi-refresh"
                      :disabled="creating"
                      @click="openDeploy"
                    />
                    <Button
                      v-else-if="deployable"
                      key="deploy"
                      label="Deploy"
                      kind="primary"
                      size="medium"
                      icon="pi pi-cloud-upload"
                      :disabled="creating"
                      @click="openDeploy"
                    />
                  </div>
                </div>
              </footer>
            </Transition>
          </main>
        </ResizablePanel.Pane>
        <ResizablePanel.Handle
          v-if="!historyCollapsed"
          aria-label="Resize the version history"
        />
        <ResizablePanel.Pane
          v-model:basis="historyBasis"
          v-model:collapsed="historyCollapsed"
          collapsible
          :min="HISTORY_WIDTH.MIN"
          :max="HISTORY_WIDTH.MAX"
          aria-label="Version history"
        >
          <VersionHistoryPanel
            ref="historyPanelRef"
            v-model:open="historyOpen"
            v-model:editing="historyEditing"
            v-model:description="versionDescription"
            :version="version"
            :earlier="earlier"
            :source-id="version.sourceVersionId ?? ''"
            :editable="!readOnly"
            :suggested="suggestedDescription"
            @version-click="openEarlierVersion"
          />
        </ResizablePanel.Pane>
      </ResizablePanel>
    </div>

    <main
      v-else
      class="layout-column-focused layout-boundary flex h-full flex-col justify-center"
    >
      <EmptyState
        bordered
        icon="pi pi-history"
        title="Version not found"
        :description="`${application.name} has no version ${route.params.versionId}. It may have been deleted.`"
      >
        <template #actions>
          <Button
            label="View Versions"
            kind="outlined"
            size="medium"
            @click="router.push(versionsHref)"
          />
        </template>
      </EmptyState>
    </main>

    <component
      :is="deployFlow === 'workload' ? ApplicationDeployDrawer : ApplicationEnvironmentDeployDrawer"
      v-if="version"
      v-model:open="deployOpen"
      :application="application"
      :pinned-version-id="drawerMode === 'pinned' ? version.id : ''"
      :build-version-id="drawerMode === 'build' ? version.id : ''"
    />

    <UnsavedChangesGuard
      ref="tabGuard"
      savable
      :route-guard="false"
      :dirty="Boolean(leavingCommit?.dirty)"
      :saving="Boolean(leavingCommit?.saving)"
      @save="leavingCommit?.save?.()"
      @discard="leavingCommit?.discard?.()"
    />
  </AppLayout>
</template>
