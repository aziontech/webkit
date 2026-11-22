<script setup lang="ts">
  import Alert, { type AlertSeverity } from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import type { LogViewerStep } from '@aziontech/webkit/log-viewer'
  import type { StatusIndicatorSeverity } from '@aziontech/webkit/status-indicator'

  import DeploymentDetailsCard from './deployment-details-card.vue'
  import DeploymentLogsCard from './deployment-logs-card.vue'

  export interface DeploymentPageProps {
    /** Color of the banner over the page. */
    severity: AlertSeverity
    /** Text of the banner over the page. */
    message: string
    /** The run failed and can be started again from the banner. */
    redeployable?: boolean
    /** The deployment serves traffic, so Visit opens its address. */
    live?: boolean
    /** Who started the deployment. */
    author: string
    /** The full date and time the deployment was created at. */
    createdAt: string
    /** How long ago the deployment was created. */
    createdAgo: string
    /** The status of the deployment, in the details and beside an unfinished log. */
    status: { severity: StatusIndicatorSeverity; label: string }
    /** How long the run took; left empty, it reads Not started. */
    duration?: string
    /** The environment the deployment targets. */
    environment: string
    /** What started the deployment: its name, its icon and the command behind it. */
    trigger: { label: string; icon: string; command: string }
    /** The storage prefix the assets were uploaded under. */
    storagePrefix: string
    /** The steps of the run; left empty, the logs card reads not started. */
    steps?: LogViewerStep[]
  }

  withDefaults(defineProps<DeploymentPageProps>(), {
    redeployable: false,
    live: false,
    duration: '',
    steps: () => []
  })
</script>

<template>
  <div class="layout-boundary flex min-h-0 w-full flex-1 flex-col">
    <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
      <div class="[--popup-origin:top] animate-popup-scale-in motion-reduce:animate-none">
        <Alert
          :severity="severity"
          size="small"
          :label="message"
        >
          <template
            v-if="redeployable"
            #actions
          >
            <Button
              label="Redeploy"
              variant="secondary"
              size="medium"
              icon="az az-refresh"
            />
          </template>
        </Alert>
      </div>

      <DeploymentDetailsCard
        :live="live"
        :author="author"
        :created-at="createdAt"
        :created-ago="createdAgo"
        :status="status"
        :duration="duration"
        :environment="environment"
        :trigger="trigger"
        :storage-prefix="storagePrefix"
      />

      <DeploymentLogsCard
        :status="status"
        :duration="duration"
        :steps="steps"
      />
    </section>
  </div>
</template>
