<script setup>
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import ConsoleLayout from '@aziontech/webkit/console-layout'
  import EmptyState from '@aziontech/webkit/empty-state'
  import PageHeader from '@aziontech/webkit/page-header'
  import Tag from '@aziontech/webkit/tag'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { resetDeploy, run, startDeploy } from '../lib/deploy'
  import { findResource } from '../lib/store'

  const route = useRoute()
  const router = useRouter()
  const resource = computed(() => findResource(route.params.id))
  const breadcrumb = computed(() => [
    { label: 'Resources', href: '/resources' },
    {
      label: resource.value?.name ?? 'web-app',
      href: resource.value ? `/resources/${resource.value.id}` : undefined
    },
    { label: 'Deploy' }
  ])

  const REPO = computed(() => ({ name: resource.value?.name ?? 'web-app', scope: 'acme' }))

  const outcome = computed({
    get: () => run.outcome,
    set: (value) => (run.outcome = value)
  })
  const mine = computed(() => run.resourceId === resource.value?.id)
  const status = computed(() => (mine.value ? run.status : 'idle'))
  const running = computed(() => status.value === 'running')
  const deploy = () => {
    if (resource.value) startDeploy(resource.value)
  }
  const edit = () => router.push(`/resources/${resource.value?.id}/edit`)

  const outcomes = computed(() =>
    [
      { label: 'Succeeds', value: 'success' },
      { label: 'Fails', value: 'error' }
    ].map((option) => ({ ...option, disabled: running.value }))
  )

  const statusTag = computed(() => {
    if (status.value === 'running') return { label: 'Deploying', severity: 'info' }
    if (status.value === 'error') return { label: 'Failed', severity: 'danger' }
    if (status.value === 'success') return { label: 'Deployed', severity: 'success' }
    return { label: 'Idle', severity: 'secondary' }
  })
</script>

<template>
  <div class="layout-boundary">
    <ConsoleLayout.Breadcrumbs :items="breadcrumb" />
    <div class="layout-column-focused flex min-h-full flex-col">
      <PageHeader
        title="Deploy"
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
          Select an ending, press Deploy, and leave the page. The toast follows you through the demo
          and settles wherever you are, with Edit and Redeploy.
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
            @click="deploy"
          />
          <Button
            label="Reset scenario"
            kind="transparent"
            size="medium"
            :disabled="running"
            @click="resetDeploy"
          />
        </div>
      </aside>

      <div
        v-if="status === 'error'"
        key="status-failed"
        class="layout-section-start"
      >
        <Alert
          severity="danger"
          :label="`${REPO.name} wasn't deployed. The routing rules were refused.`"
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
                kind="secondary"
                size="medium"
                icon="pi pi-refresh"
                @click="deploy"
              />
            </div>
          </template>
        </Alert>
      </div>
      <div
        v-else-if="status === 'success'"
        key="status-live"
        class="layout-section-start"
      >
        <Alert
          severity="success"
          :label="`${REPO.name} is live at ${resource?.domain}.`"
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
                kind="secondary"
                size="medium"
                icon="pi pi-refresh"
                @click="deploy"
              />
            </div>
          </template>
        </Alert>
      </div>
      <div
        v-else
        key="status-idle"
        class="layout-section-start"
      >
        <EmptyState
          bordered
          icon="pi pi-cloud-upload"
          :title="running ? 'Deployment running' : 'No deployment running'"
          :description="
            running
              ? 'Open any module in the sidebar. The toast reports back wherever you are.'
              : 'Start one above. It takes a few seconds, long enough to walk away from, which is the whole point.'
          "
        >
          <template #actions>
            <Button
              label="Deploy"
              kind="primary"
              size="medium"
              :loading="running"
              :disabled="running"
              @click="deploy"
            />
          </template>
        </EmptyState>
      </div>
    </div>
  </div>
</template>
