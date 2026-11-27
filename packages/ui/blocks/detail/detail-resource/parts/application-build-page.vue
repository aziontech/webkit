<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import ConfirmDialog from '@aziontech/ui/confirm-dialog'
  import Tag from '@aziontech/ui/tag'
  import { toast } from '@aziontech/ui/toast'
  import { useUnsavedChanges } from '@aziontech/ui/use-unsaved-changes'
  import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'

  import {
    buildApplication as APP,
    buildApplicationDeployments as deployments,
    buildApplicationVersions as versions,
    buildDeploymentSeverity as deploymentSeverity,
    resourceTabs as tabs
  } from '../sample'
  import ApplicationBuildForm from './application-build-form.vue'
  import ApplicationBuildOverview from './application-build-overview.vue'
  import ApplicationDeploymentsTab from './application-deployments-tab.vue'
  import ApplicationVersionsTab from './application-versions-tab.vue'
  import DeployDrawer from './deploy-drawer.vue'
  import ProjectDropTarget from './project-drop-target.vue'
  import ResourceTabBar from './resource-tab-bar.vue'

  const currentTab = ref('overview')

  const build = reactive({
    productionBranch: 'main',
    previewBranch: 'develop',
    buildCommand: 'platform build',
    deployCommand: 'platform deploy --local'
  })
  const saving = ref(false)

  const commitSave = () =>
    new Promise<void>((resolve) => {
      saving.value = true
      setTimeout(() => {
        guard.commit()
        saving.value = false
        toast.success('Build settings saved.')
        resolve()
      }, 800)
    })

  const guard = useUnsavedChanges(() => build, {
    onDiscard: (baseline) => Object.assign(build, baseline),
    onSave: commitSave
  })
  guard.commit()
  const dirty = guard.isDirty
  const onSaveShortcut = () => {
    if (!dirty.value || saving.value) return
    commitSave()
  }
  const leaveDialog = guard.dialogProps
  const leaveLabels = guard.labels

  const activeTab = computed({
    get: () => currentTab.value,
    set: async (value) => {
      if (!value || value === currentTab.value) return
      if (currentTab.value === 'build' && !(await guard.confirmLeave())) return
      currentTab.value = value
    }
  })

  const dragDepth = ref(0)
  const dragging = computed(() => dragDepth.value > 0)
  const dropped = ref('')

  const hasFiles = (event: DragEvent) =>
    Array.from(event.dataTransfer?.types ?? []).includes('Files')

  const onDragenter = (event: DragEvent) => {
    if (!hasFiles(event)) return
    event.preventDefault()
    dragDepth.value += 1
  }

  const onDragover = (event: DragEvent) => {
    if (hasFiles(event)) event.preventDefault()
  }

  const onDragleave = (event: DragEvent) => {
    if (!hasFiles(event)) return
    dragDepth.value = Math.max(0, dragDepth.value - 1)
  }

  const deployOpen = ref(false)
  const deploying = ref(false)

  const onDrop = (event: DragEvent) => {
    if (!hasFiles(event)) return
    event.preventDefault()
    dragDepth.value = 0
    const [first] = Array.from(event.dataTransfer?.files ?? [])
    const path = (first as (File & { webkitRelativePath?: string }) | undefined)?.webkitRelativePath
    dropped.value = path?.split('/')[0] || first?.name || 'dropped files'
    deployOpen.value = true
  }

  const dropZoneEl = ref<HTMLElement | null>(null)
  onMounted(() => {
    dropZoneEl.value?.addEventListener('dragenter', onDragenter)
    dropZoneEl.value?.addEventListener('dragover', onDragover)
    dropZoneEl.value?.addEventListener('dragleave', onDragleave)
    dropZoneEl.value?.addEventListener('drop', onDrop)
  })
  onBeforeUnmount(() => {
    dropZoneEl.value?.removeEventListener('dragenter', onDragenter)
    dropZoneEl.value?.removeEventListener('dragover', onDragover)
    dropZoneEl.value?.removeEventListener('dragleave', onDragleave)
    dropZoneEl.value?.removeEventListener('drop', onDrop)
  })

  const openDeploy = () => {
    dropped.value = ''
    deployOpen.value = true
  }

  const deploySource = computed(() => dropped.value || `the ${build.productionBranch} branch`)

  const RUN_TOAST = 'application-build-deploy'
  let timer: ReturnType<typeof setTimeout> | undefined

  const runDeploy = () => {
    deployOpen.value = false
    deploying.value = true
    toast.loading(`Deploying ${APP.name}…`, {
      id: RUN_TOAST,
      description: 'It keeps running if you leave this page.'
    })
    clearTimeout(timer)
    timer = setTimeout(() => {
      deploying.value = false
      toast.success(`${APP.name} is live.`, {
        id: RUN_TOAST,
        description: `A new version built from ${deploySource.value} serves Production.`,
        duration: 0,
        closable: true,
        actions: [
          { label: 'Edit', onClick: () => (currentTab.value = 'build') },
          { label: 'Redeploy', onClick: runDeploy }
        ]
      })
    }, 1500)
  }

  onBeforeUnmount(() => {
    clearTimeout(timer)
    toast.dismiss(RUN_TOAST)
  })
</script>

<template>
  <div
    ref="dropZoneEl"
    class="flex min-h-0 flex-1 flex-col"
  >
    <ResourceTabBar
      v-model="activeTab"
      :tabs="tabs"
      :dirty-tab="dirty ? 'build' : ''"
    >
      <template #actions>
        <Button
          label="Deploy"
          variant="outline"
          size="medium"
          icon="az az-cloud-upload"
          :loading="deploying"
          @click="openDeploy"
        />
      </template>
    </ResourceTabBar>

    <section class="relative min-h-0 flex-1">
      <ProjectDropTarget
        :name="APP.name"
        :dragging="dragging"
      />

      <ApplicationBuildForm
        v-if="activeTab === 'build'"
        :form="build"
        :repository="APP.repository"
        :dirty="dirty"
        :saving="saving"
        @save="commitSave"
        @save-shortcut="onSaveShortcut"
        @discard="guard.discard()"
      />

      <div
        v-else
        class="layout-column layout-boundary flex min-w-0 flex-col"
      >
        <ApplicationBuildOverview
          v-if="activeTab === 'overview'"
          :branch="build.productionBranch"
        />

        <ApplicationVersionsTab
          v-else-if="activeTab === 'versions'"
          :versions="versions"
          :latest="APP.version"
        />

        <ApplicationDeploymentsTab
          v-else
          :deployments="deployments"
          :severity="deploymentSeverity"
        />
      </div>
    </section>

    <DeployDrawer
      v-model:open="deployOpen"
      :title="`Deploy ${APP.name}`"
      @deploy="runDeploy"
    >
      <template #description>
        We build a new version of {{ APP.name }} from {{ deploySource }}, then it goes live in
        Production. The deployment that is live keeps serving until the new one is ready.
      </template>
      <dl class="m-0 grid grid-cols-[auto_1fr] gap-x-(--spacing-md) gap-y-(--spacing-xs)">
        <dt class="text-label-sm text-(--text-muted)">Source</dt>
        <dd class="m-0 truncate text-body-sm text-(--text-default)">{{ deploySource }}</dd>
        <dt class="text-label-sm text-(--text-muted)">Environment</dt>
        <dd class="m-0">
          <Tag
            label="Production"
            severity="neutral"
            size="small"
          />
        </dd>
      </dl>
    </DeployDrawer>

    <ConfirmDialog v-bind="leaveDialog">
      <template #actions>
        <Button
          :label="leaveLabels.keepEditing"
          variant="ghost"
          size="medium"
          :disabled="leaveDialog.loading"
          @click="guard.keepEditing"
        />
        <Button
          :label="leaveLabels.discard"
          variant="outline"
          size="medium"
          :disabled="leaveDialog.loading"
          @click="guard.discardAndLeave"
        />
        <Button
          :label="leaveLabels.save"
          variant="primary"
          size="medium"
          :loading="leaveDialog.loading"
          @click="guard.saveAndLeave"
        />
      </template>
    </ConfirmDialog>
  </div>
</template>
