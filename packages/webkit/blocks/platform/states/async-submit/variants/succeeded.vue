<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import PageHeader from '@aziontech/webkit/page-header'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

  interface StatusTag {
    label: string
    severity: TagSeverity
  }

  const REPO = { name: 'web-app', scope: 'acme' }

  const status = ref('success')

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
    return { label: 'Idle', severity: 'neutral' }
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
    </div>
  </div>
</template>
