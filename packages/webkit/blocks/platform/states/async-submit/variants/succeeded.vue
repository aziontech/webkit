<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import PageHeader from '@aziontech/webkit/page-header'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import { toast, Toaster } from '@aziontech/webkit/toast'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

  interface StatusTag {
    label: string
    severity: TagSeverity
  }

  const REPO = { name: 'web-app', scope: 'acme' }

  const outcome = ref('success')
  const status = ref('success')
  const running = computed(() => status.value === 'running')

  const outcomes = computed(() =>
    [
      { label: 'Succeeds', value: 'success' },
      { label: 'Fails', value: 'error' }
    ].map((option) => ({ ...option, disabled: running.value }))
  )

  const run = {
    name: 'web-app',
    scope: 'acme',
    attempt: 1,
    record: { service: { domain: 'web-app.example.com' } },
    error: {
      detail:
        'The template built, its assets were uploaded and the service was created, but a rule with the same behavior is already bound to this domain, so the routing rules were refused. Nothing was published, so a redeploy starts from the same commit.'
    }
  }

  const statusTag = computed<StatusTag>(() => {
    if (status.value === 'running') return { label: 'Deploying', severity: 'info' }
    if (status.value === 'error') return { label: 'Failed', severity: 'danger' }
    if (status.value === 'success') return { label: 'Deployed', severity: 'success' }
    return { label: 'Idle', severity: 'secondary' }
  })

  const RUN_TOAST = 'async-submit-run'

  const edit = () => toast.dismiss(RUN_TOAST)

  const redeploy = () =>
    toast.loading(`Deploying ${run.name}…`, {
      id: RUN_TOAST,
      description: `${REPO.scope}/${REPO.name}. It keeps running if you leave.`
    })

  onMounted(() =>
    toast.success(`${run.name} is live.`, {
      id: RUN_TOAST,
      description: `It is available at ${run.record.service.domain}.`,
      closable: true,
      actions: [
        { label: 'Edit', onClick: edit },
        { label: 'Redeploy', onClick: redeploy }
      ]
    })
  )

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

      <div
        key="status-live"
        class="[--popup-origin:top] layout-section-start animate-popup-scale-in motion-reduce:animate-none"
      >
        <Alert
          severity="success"
          :label="`${run.name} is live at ${run.record?.service.domain}. It took ${run.attempt} attempt${run.attempt > 1 ? 's' : ''}.`"
        >
          <template #action>
            <div class="flex items-center gap-(--spacing-xs)">
              <Button
                label="Edit"
                kind="transparent"
                size="medium"
                @click="edit"
              />
              <Button
                label="Redeploy"
                kind="transparent"
                size="medium"
                icon="pi pi-refresh"
                @click="redeploy"
              />
              <Button
                label="Open service"
                kind="secondary"
                size="medium"
              />
            </div>
          </template>
        </Alert>
      </div>

      <Toaster position="bottom-right" />
    </div>
  </div>
</template>
