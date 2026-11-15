<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import PageHeader from '@aziontech/webkit/page-header'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, onBeforeUnmount, ref } from 'vue'

  interface StatusTag {
    label: string
    severity: TagSeverity
  }

  const REPO = { name: 'web-app', scope: 'acme' }

  const status = ref('idle')
  const running = computed(() => status.value === 'running')

  const statusTag = computed<StatusTag>(() => {
    if (status.value === 'running') return { label: 'Deploying', severity: 'info' }
    if (status.value === 'error') return { label: 'Failed', severity: 'danger' }
    if (status.value === 'success') return { label: 'Deployed', severity: 'success' }
    return { label: 'Idle', severity: 'neutral' }
  })

  const RUN_TOAST = 'async-submit-run'
  let runTimer: ReturnType<typeof setTimeout> | undefined

  const deploy = () => {
    if (running.value) return
    status.value = 'running'
    toast.loading(`Deploying ${REPO.name}…`, {
      id: RUN_TOAST,
      description: `${REPO.scope}/${REPO.name}. It keeps running if you leave.`
    })
    clearTimeout(runTimer)
    runTimer = setTimeout(() => {
      status.value = 'success'
      toast.success(`${REPO.name} is live.`, {
        id: RUN_TOAST,
        description: `It is available at ${REPO.name}.example.com.`,
        closable: true
      })
    }, 25000)
  }

  onBeforeUnmount(() => {
    clearTimeout(runTimer)
    toast.dismiss(RUN_TOAST)
  })
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column-focused flex min-h-full flex-col">
      <PageHeader
        title="Deploy web-app"
        description="Builds acme/web-app and publishes it to production. A deploy takes about half a minute and keeps running if you leave this page; the result reports back wherever you are."
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

      <div class="layout-section-start">
        <EmptyState
          bordered
          icon="ai ai-cloud-upload"
          title="No deployment running"
          description="Deploy web-app to build it and publish it to production. It takes about 25 seconds, and you can leave this page while it runs."
        >
          <template #actions>
            <Button
              label="Deploy"
              variant="primary"
              size="medium"
              icon="ai ai-play"
              :loading="running"
              @click="deploy"
            />
          </template>
        </EmptyState>
      </div>
    </div>
  </div>
</template>
