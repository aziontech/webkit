<script setup>
  import Button from '@aziontech/webkit/button'
  import Toaster from '@aziontech/webkit/toast-root'
  import ToastAction from '@aziontech/webkit/toast-action'
  import ToastClose from '@aziontech/webkit/toast-close'
  import ToastDescription from '@aziontech/webkit/toast-description'
  import ToastItem from '@aziontech/webkit/toast-item'
  import ToastTitle from '@aziontech/webkit/toast-title'
  import { useRoute, useRouter } from 'vue-router'

  import { redeployRun, runByToastId } from '../../lib/state/deploy-runs'

  const route = useRoute()
  const router = useRouter()

  const failedRun = (entry) => {
    const run = runByToastId(entry.id)
    return run?.status === 'error' ? run : null
  }

  const successRun = (entry) => {
    const run = runByToastId(entry.id)
    return run?.status === 'success' ? run : null
  }

  const go = (path, query = {}) =>
    router.push({
      path,
      query: { email: route.query.email || 'myemail@azion.com', ...query }
    })

  const retry = (run) => redeployRun(run.id)

  const openDeployment = (run) => {
    if (run.kind === 'resource') return go(`/deployments/${run.deployId}`)
    return run.record
      ? go(`/workloads/${run.record.workload.id}`, { name: run.record.workload.name })
      : go('/deployments')
  }
</script>

<template>
  <Toaster position="bottom-right">
    <template #default="{ toast: entry, dismiss }">
      <ToastItem
        key="toast-item-1"
        v-if="failedRun(entry)"
        :type="entry.type"
      >
        <ToastTitle>{{ entry.message }}</ToastTitle>
        <ToastDescription v-if="entry.description">
          {{ entry.description }}
        </ToastDescription>
        <div class="flex flex-wrap items-center gap-(--spacing-xs) pt-(--spacing-xxs)">
          <Button
            label="Redeploy"
            kind="outlined"
            size="small"
            @click="retry(failedRun(entry))"
          />
          <ToastAction
            label="View deployments"
            @click="
              () => {
                go('/deployments')
                dismiss()
              }
            "
          />
        </div>
        <template #trailing>
          <ToastClose @click="dismiss" />
        </template>
      </ToastItem>

      <ToastItem
        key="toast-item-2"
        v-else-if="successRun(entry)"
        :type="entry.type"
      >
        <ToastTitle>{{ entry.message }}</ToastTitle>
        <ToastDescription v-if="entry.description">
          {{ entry.description }}
        </ToastDescription>
        <div class="flex items-center pt-(--spacing-xxs)">
          <Button
            label="View deployment"
            kind="outlined"
            size="small"
            @click="
              () => {
                openDeployment(successRun(entry))
                dismiss()
              }
            "
          />
        </div>
        <template #trailing>
          <ToastClose
            v-if="entry.closable"
            @click="dismiss"
          />
        </template>
      </ToastItem>

      <ToastItem
        key="toast-item-3"
        v-else
        :type="entry.type"
      >
        <ToastTitle>{{ entry.message }}</ToastTitle>
        <ToastDescription v-if="entry.description">
          {{ entry.description }}
        </ToastDescription>
        <template
          v-if="entry.action || entry.closable"
          #trailing
        >
          <ToastAction
            v-if="entry.action"
            :label="entry.action.label"
            @click="(event) => entry.action.onClick(event)"
          />
          <ToastClose
            v-if="entry.closable"
            @click="dismiss"
          />
        </template>
      </ToastItem>
    </template>
  </Toaster>
</template>
