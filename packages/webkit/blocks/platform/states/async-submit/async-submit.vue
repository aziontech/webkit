<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import PageHeader from '@aziontech/webkit/page-header'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import { toast, Toaster } from '@aziontech/webkit/toast'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { computed, onBeforeUnmount, ref } from 'vue'

  interface StatusTag {
    label: string
    severity: TagSeverity
  }

  const REPO = { name: 'web-app', scope: 'acme' }

  const outcome = ref('success')
  const status = ref('idle')
  const running = computed(() => status.value === 'running')

  const outcomes = computed(() =>
    [
      { label: 'Succeeds', value: 'success' },
      { label: 'Fails', value: 'error' }
    ].map((option) => ({ ...option, disabled: running.value }))
  )

  const statusTag = computed<StatusTag>(() => {
    if (status.value === 'running') return { label: 'Deploying', severity: 'info' }
    if (status.value === 'error') return { label: 'Failed', severity: 'danger' }
    if (status.value === 'success') return { label: 'Deployed', severity: 'success' }
    return { label: 'Idle', severity: 'secondary' }
  })

  const RUN_TOAST = 'async-submit-run'

  onBeforeUnmount(() => toast.dismiss(RUN_TOAST))
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column-focused flex min-h-full flex-col">
      <PageHeader
        title="Async deployment"
        description="A deploy runs for half a minute and asks nothing of you while it does. Start one, then open any module in the sidebar. The run keeps going and reports back through the toast, wherever you are."
        size="large"
      >
        <template #actions>
          <Tag
            :label="statusTag.label"
            :severity="statusTag.severity"
            size="medium"
          />
        </template>
      </PageHeader>

      <aside
        aria-label="Scenario simulation"
        class="layout-section-start flex flex-col gap-(--spacing-md) rounded-(--shape-card) border border-dashed border-(--border-default) bg-(--bg-surface-raised) p-(--spacing-lg)"
      >
        <div class="flex flex-wrap items-center justify-between gap-(--spacing-sm)">
          <p class="m-0 text-overline-sm text-(--text-muted)">Simulation: how this deploy ends</p>
          <Tag
            :label="`${REPO.scope}/${REPO.name}`"
            severity="secondary"
            size="medium"
          />
        </div>
        <p class="m-0 text-body-sm text-(--text-muted)">
          The ending is held in the URL (<code class="text-label-code-sm">?outcome=</code>), so a
          run is linkable and survives a reload. Select one, press Deploy, and leave the page. The
          toast follows you and settles wherever you are.
        </p>
        <div class="flex flex-wrap items-center gap-(--spacing-sm)">
          <ToggleGroup
            v-model="outcome"
            :options="outcomes"
            aria-label="Simulated deployment outcome"
          />
          <Button
            label="Deploy"
            kind="primary"
            size="medium"
            icon="pi pi-play"
            :loading="running"
            :disabled="running"
          />
          <Button
            label="Reset scenario"
            kind="transparent"
            size="medium"
            :disabled="running"
          />
        </div>
      </aside>

      <div class="layout-section-start">
        <EmptyState
          bordered
          icon="pi pi-cloud-upload"
          title="No deployment running"
          description="Start one above. It takes about 25 seconds, long enough to walk away from, which is the whole point."
        >
          <template #actions>
            <Button
              label="Deploy"
              kind="primary"
              size="medium"
            />
          </template>
        </EmptyState>
      </div>

      <Toaster position="bottom-right" />
    </div>
  </div>
</template>
