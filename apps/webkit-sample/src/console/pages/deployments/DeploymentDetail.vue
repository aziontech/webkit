<script setup>
  import Accordion from '@aziontech/webkit/accordion'
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Dropdown from '@aziontech/webkit/dropdown'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import Message from '@aziontech/webkit/message'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { triggerMeta } from '@shared/lib/azion-deploys'
  import { formatListDate } from '@shared/lib/dates'
  import { LOG_VIEWS } from '@shared/ui/deployment/deployment-steps.js'
  import DeploymentLogs from '@shared/ui/deployment/DeploymentLogs.vue'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import DomainOverflowPopover from '../../components/list/DomainOverflowPopover.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import {
    azionDefaultStrategy,
    bindingPolicyLabel,
    deploymentPolicyLabel,
    strategies
  } from '../../lib/data/deployment-strategies'
  import { deployPageRecord, resourceMeta, statusMeta } from '../../lib/data/deployments'
  import { workloadById } from '../../lib/data/workloads'
  import { relativeTime } from '../../lib/format/relative-time'

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const deploy = computed(() =>
    deployPageRecord(String(route.params.id ?? ''), {
      workloadId: String(route.query.workload ?? ''),
      workloadName: String(route.query.workloadName ?? ''),
      applicationId: String(route.query.application ?? ''),
      applicationName: String(route.query.applicationName ?? '')
    })
  )

  const resource = computed(() => resourceMeta(deploy.value?.resource?.type))
  const resourceLink = computed(() =>
    resource.value.path && deploy.value?.resource?.id
      ? {
          path: `${resource.value.path}/${deploy.value.resource.id}`,
          query: { email: userEmail.value }
        }
      : null
  )

  const trigger = computed(() => (deploy.value?.trigger ? triggerMeta(deploy.value.trigger) : null))
  const edge = computed(() => deploy.value?.edge ?? null)

  const steps = computed(() => deploy.value?.steps ?? [])
  const recorded = computed(() => steps.value.length > 0)

  const failed = computed(() => deploy.value?.status === 'Error')
  const running = computed(() => deploy.value?.status === 'Building')

  const finished = computed(() => failed.value || deploy.value?.status === 'Ready')
  const status = computed(() => statusMeta(deploy.value?.status))

  const logView = ref('phased')

  const logsOpen = ref(null)

  const streamSettled = ref(false)
  const onStreamSettled = () => {
    streamSettled.value = true
  }

  const settled = computed(() => finished.value || streamSettled.value)

  const banner = computed(() => {
    if (!deploy.value) return null
    const { workload, environment, duration, url, error } = deploy.value
    const state = deploy.value.status
    const where = `${workload.name} (${environment.toLowerCase()})`

    if (state === 'Error')
      return {
        severity: 'danger',
        label:
          error?.detail ??
          `This deployment failed. Nothing was published — ${workload.name} keeps serving its previous deployment.`
      }
    if (state === 'Building')
      return {
        severity: 'info',
        label: `Deploying to ${where}. Nothing is published until the workload deployment is created — the previous deployment keeps serving traffic.`
      }
    if (state === 'Queued')
      return {
        severity: 'info',
        label: `Queued for ${where}. The pipeline starts as soon as a runner is free.`
      }
    if (state === 'Draft')
      return {
        severity: 'warning',
        label: `Draft — prepared for ${where} and never published.`
      }
    return {
      severity: 'success',
      label: url
        ? `Live at ${url} — published to ${where} in ${duration}.`
        : `Live — serving ${where}${duration ? ` · published in ${duration}` : ''}.`
    }
  })

  const strategy = computed(
    () =>
      strategies.value.find((entry) => entry.name === deploy.value?.strategyName) ??
      azionDefaultStrategy
  )

  const strategyFields = computed(() => [
    { label: 'Binding Policy', value: bindingPolicyLabel(strategy.value.bindingPolicy) },
    { label: 'Version Policy', value: deploymentPolicyLabel(strategy.value.deploymentPolicy) }
  ])

  const domains = computed(() => {
    const workload = workloadById(deploy.value?.workload?.id)
    const list = workload?.domains ?? []
    const primary = deploy.value?.workload?.domain
    return primary && !list.includes(primary) ? [primary, ...list] : list
  })

  const primaryDomain = computed(() => domains.value[0] ?? '')

  const aliasCount = computed(() => Math.max(domains.value.length - 1, 0))

  const visitUrl = computed(() => {
    if (deploy.value?.url) return deploy.value.url
    if (deploy.value?.status !== 'Ready') return ''
    const domain = deploy.value.workload.domain || workloadById(deploy.value.workload.id)?.domain
    return domain ? `https://${domain}` : ''
  })

  const goToDeployments = () =>
    router.push({ path: '/deployments', query: { email: userEmail.value } })

  const redeploy = () =>
    toast.info(`Redeploying ${deploy.value?.id}`, {
      description: 'A redeploy runs the same pipeline again, from the same commit.'
    })

  const openLogs = () =>
    toast.info('Runtime logs', {
      description:
        'Request-time logs stream in Real-Time Events. The deployment’s own output is in the steps below.'
    })

  const openRequests = () =>
    toast.info('Requests', {
      description: 'Per-deployment request metrics live in Real-Time Metrics.'
    })

  const onAction = (event, value) => {
    if (value === 'logs') return openLogs()
    if (value === 'requests') return openRequests()
    redeploy()
  }
</script>

<template>
  <AppLayout
    active="deployments"
    :breadcrumb="[
      { label: 'Deployments', href: '/deployments' },
      { label: deploy?.id ?? 'Deployment' }
    ]"
  >
    <main class="flex min-h-full w-full flex-col">
      <EmptyState
        v-if="!deploy"
        bordered
        icon="pi pi-search"
        title="Deployment not found"
        :description="`No deployment matches “${route.params.id}”. It may have been removed, or the link may be stale.`"
      >
        <template #actions>
          <Button
            label="Back to deployments"
            kind="primary"
            size="medium"
            @click="goToDeployments"
          />
        </template>
      </EmptyState>

      <template v-else>
        <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
          <Message
            :key="`status-${deploy.status}`"
            :severity="banner.severity"
            size="small"
            :label="banner.label"
            class="animate-popup-scale-in motion-reduce:animate-none"
            style="--popup-origin: top"
          >
            <template
              v-if="failed"
              #action
            >
              <Button
                label="Redeploy"
                kind="secondary"
                size="medium"
                icon="pi pi-refresh"
                @click="redeploy"
              />
            </template>
          </Message>

          <CardBox class="[&>footer]:min-h-12">
            <template #header>
              <p class="text-heading-xs text-(--text-default)">Deployment Details</p>

              <div class="flex shrink-0 items-center gap-(--spacing-xs)">
                <Tooltip :text="visitUrl || 'Available once the deployment is live'">
                  <Button
                    label="Visit"
                    kind="secondary"
                    size="medium"
                    icon="pi pi-external-link"
                    :href="visitUrl"
                    :disabled="!visitUrl"
                    target="_blank"
                  />
                </Tooltip>

                <Dropdown
                  placement="bottom-end"
                  @select="onAction"
                >
                  <Dropdown.Trigger>
                    <Tooltip text="Deployment actions">
                      <IconButton
                        icon="pi pi-ellipsis-h"
                        kind="outlined"
                        size="medium"
                        aria-label="Deployment actions"
                      />
                    </Tooltip>
                  </Dropdown.Trigger>
                  <Dropdown.Group>
                    <Dropdown.Option
                      value="logs"
                      label="Logs"
                    >
                      <template #left>
                        <i
                          class="pi pi-align-left"
                          aria-hidden="true"
                        />
                      </template>
                    </Dropdown.Option>
                    <Dropdown.Option
                      value="requests"
                      label="Requests"
                    >
                      <template #left>
                        <i
                          class="pi pi-arrow-right-arrow-left"
                          aria-hidden="true"
                        />
                      </template>
                    </Dropdown.Option>
                  </Dropdown.Group>
                  <Dropdown.Group>
                    <Dropdown.Option
                      value="redeploy"
                      label="Redeploy"
                    >
                      <template #left>
                        <i
                          class="pi pi-refresh"
                          aria-hidden="true"
                        />
                      </template>
                    </Dropdown.Option>
                  </Dropdown.Group>
                </Dropdown>
              </div>
            </template>

            <template #content>
              <div class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2 lg:grid-cols-3">
                <div class="flex flex-col gap-(--spacing-xxs)">
                  <span class="text-label-sm text-(--text-muted)">Created</span>
                  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <Tooltip :text="`${deploy.author} · ${formatListDate(deploy.createdAt)}`">
                      <Avatar
                        :src="deploy.authorAvatar || undefined"
                        :alt="deploy.author"
                        :label="deploy.author"
                        size="small"
                        kind="square"
                      />
                    </Tooltip>
                    <span class="truncate text-body-sm text-(--text-default)">
                      {{ deploy.author }}
                    </span>
                    <span class="shrink-0 text-body-sm text-(--text-muted)">
                      {{ relativeTime(deploy.createdAt) }}
                    </span>
                  </div>
                </div>
                <div class="flex flex-col gap-(--spacing-xxs)">
                  <span class="text-label-sm text-(--text-muted)">Status</span>
                  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <StatusIndicator
                      :severity="status.severity"
                      :loading="status.loading"
                      :label="deploy.status"
                    />
                    <span
                      v-if="deploy.current"
                      class="shrink-0 text-body-sm text-(--text-muted)"
                    >
                      Latest
                    </span>
                  </div>
                </div>
                <div class="flex flex-col gap-(--spacing-xxs)">
                  <span class="text-label-sm text-(--text-muted)">Duration</span>
                  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <i
                      class="pi pi-clock shrink-0 text-(--text-muted)"
                      aria-hidden="true"
                    />
                    <span class="truncate text-body-sm text-(--text-default)">
                      {{ deploy.duration || '—' }}
                    </span>
                  </div>
                </div>
                <div class="flex flex-col gap-(--spacing-xxs)">
                  <span class="text-label-sm text-(--text-muted)">Environment</span>
                  <div class="flex min-w-0 items-center">
                    <Tag
                      severity="secondary"
                      size="medium"
                      :label="deploy.environment"
                    />
                  </div>
                </div>
                <div class="flex flex-col gap-(--spacing-xxs)">
                  <span class="text-label-sm text-(--text-muted)">Workload</span>
                  <Tooltip :text="`Open ${deploy.workload.name} in Workloads`">
                    <router-link
                      :to="{
                        path: `/workloads/${deploy.workload.id}`,
                        query: { email: userEmail, name: deploy.workload.name }
                      }"
                      class="group/link inline-flex min-w-0 items-center gap-(--spacing-xxs) text-body-sm text-(--text-default) no-underline"
                    >
                      <span class="truncate underline-offset-2 group-hover/link:underline">
                        {{ deploy.workload.name }}
                      </span>
                      <i
                        class="pi pi-external-link shrink-0 text-body-xs leading-none"
                        aria-hidden="true"
                      />
                    </router-link>
                  </Tooltip>
                </div>
                <div class="flex flex-col gap-(--spacing-xxs)">
                  <span class="text-label-sm text-(--text-muted)">{{ resource.label }}</span>
                  <Tooltip
                    :text="`Open ${deploy.resource.name} in ${resource.label}`"
                    :disabled="!resourceLink"
                  >
                    <component
                      :is="resourceLink ? 'router-link' : 'div'"
                      :to="resourceLink || undefined"
                      class="group/link inline-flex min-w-0 items-center gap-(--spacing-xxs) text-body-sm text-(--text-default) no-underline"
                    >
                      <span
                        class="truncate underline-offset-2"
                        :class="resourceLink ? 'group-hover/link:underline' : ''"
                      >
                        {{ deploy.resource.name }}
                      </span>
                      <i
                        v-if="resourceLink"
                        class="pi pi-external-link shrink-0 text-body-xs leading-none"
                        aria-hidden="true"
                      />
                    </component>
                  </Tooltip>
                </div>
                <div
                  v-if="trigger"
                  class="flex flex-col gap-(--spacing-xxs)"
                >
                  <span class="text-label-sm text-(--text-muted)">Triggered By</span>
                  <div class="flex min-w-0 items-center">
                    <Tooltip :text="trigger.source">
                      <Tag
                        severity="secondary"
                        size="medium"
                        :icon="trigger.icon"
                        :label="trigger.label"
                      />
                    </Tooltip>
                  </div>
                </div>
                <div
                  v-if="edge"
                  class="flex flex-col gap-(--spacing-xxs)"
                >
                  <span class="text-label-sm text-(--text-muted)">Preset</span>
                  <div class="flex min-w-0 items-center">
                    <Tooltip text="build.preset in azion.config.js">
                      <Tag
                        severity="secondary"
                        size="medium"
                        icon="pi pi-wrench"
                        :label="edge.preset"
                      />
                    </Tooltip>
                  </div>
                </div>
                <div
                  v-if="edge"
                  class="flex flex-col gap-(--spacing-xxs) sm:col-span-2 lg:col-span-3"
                >
                  <span class="text-label-sm text-(--text-muted)">Storage</span>
                  <div
                    class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs) text-body-sm text-(--text-default)"
                  >
                    <i
                      class="ai ai-edge-storage shrink-0 text-(--text-muted)"
                      aria-hidden="true"
                    />
                    <span class="truncate">{{ edge.bucket }}</span>
                    <span
                      class="text-body-xs text-(--text-muted)"
                      aria-hidden="true"
                      >·</span
                    >
                    <span class="text-label-code-sm text-(--text-muted)">
                      {{ edge.prefix }}
                    </span>
                  </div>
                </div>
                <div
                  v-if="primaryDomain"
                  class="flex flex-col gap-(--spacing-xxs) sm:col-span-2 lg:col-span-3"
                >
                  <span class="text-label-sm text-(--text-muted)">Domains</span>
                  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <i
                      class="ai ai-domains shrink-0 text-body-lg text-(--text-muted)"
                      aria-hidden="true"
                    />
                    <Tooltip :text="`Open ${primaryDomain} in a new tab`">
                      <a
                        :href="`https://${primaryDomain}`"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="group/link inline-flex min-w-0 items-center gap-(--spacing-xxs) text-body-sm text-(--text-default) no-underline"
                      >
                        <span class="truncate underline-offset-2 group-hover/link:underline">
                          {{ primaryDomain }}
                        </span>
                        <i
                          class="pi pi-external-link shrink-0 text-body-xs leading-none"
                          aria-hidden="true"
                        />
                      </a>
                    </Tooltip>
                    <DomainOverflowPopover
                      v-if="aliasCount"
                      :domains="domains"
                      :count="aliasCount"
                    />
                    <CopyButton
                      kind="outlined"
                      :value="primaryDomain"
                      aria-label="Copy domain name"
                      class="shrink-0"
                    />
                  </div>
                </div>
              </div>
            </template>

            <template #footer>
              <Accordion
                class="@container/band -mx-(--spacing-md) -my-(--spacing-sm) w-[calc(100%+2*var(--spacing-md))] [--accordion-inset:var(--spacing-md)]"
                type="single"
                arrow-position="left"
                collapsible
              >
                <Accordion.Item value="settings">
                  <div class="relative">
                    <Accordion.Trigger>
                      <span class="flex min-h-12 flex-1 items-center gap-(--spacing-sm)">
                        <span class="text-label-md text-(--text-default)">Deployment Settings</span>
                      </span>
                    </Accordion.Trigger>

                    <div
                      class="flex flex-wrap items-center gap-x-(--spacing-sm) gap-y-(--spacing-xxs) px-(--spacing-md) pb-(--spacing-md) @lg/band:pointer-events-none @lg/band:absolute @lg/band:inset-y-0 @lg/band:right-0 @lg/band:max-w-[calc(100%-12rem)] @lg/band:justify-end @lg/band:px-0 @lg/band:pr-(--spacing-md) @lg/band:pb-0"
                    >
                      <Tooltip
                        class="pointer-events-auto"
                        :text="`Open ${strategy.name} in Build & Deployment settings`"
                      >
                        <router-link
                          :to="{
                            path: '/account/build-deployment',
                            query: { email: userEmail }
                          }"
                          class="group/link inline-flex min-w-0 items-center gap-(--spacing-xxs) text-body-sm text-(--text-default) no-underline"
                        >
                          <span class="truncate underline-offset-2 group-hover/link:underline">
                            {{ strategy.name }}
                          </span>
                          <i
                            class="pi pi-external-link shrink-0 text-body-xs leading-none"
                            aria-hidden="true"
                          />
                        </router-link>
                      </Tooltip>
                    </div>
                  </div>
                  <Accordion.Content>
                    <div
                      class="grid grid-cols-1 gap-(--spacing-lg) px-(--spacing-md) pt-(--spacing-xs) pb-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3"
                    >
                      <div
                        v-for="field in strategyFields"
                        :key="field.label"
                        class="flex flex-col gap-(--spacing-xxs)"
                      >
                        <span class="text-label-sm text-(--text-muted)">{{ field.label }}</span>
                        <span class="truncate text-body-sm text-(--text-default)">
                          {{ field.value }}
                        </span>
                      </div>
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion>
            </template>
          </CardBox>

          <CardBox
            :padded="false"
            class="w-full"
          >
            <template #content>
              <Accordion
                v-model:value="logsOpen"
                class="[--accordion-inset:var(--spacing-md)]"
                type="single"
                arrow-position="left"
                collapsible
              >
                <Accordion.Item value="logs">
                  <div class="relative">
                    <Accordion.Trigger>
                      <span class="flex min-h-14 flex-1 items-center gap-(--spacing-sm)">
                        <span class="text-label-md text-(--text-default)">Deployment Logs</span>
                        <span
                          v-if="settled && !failed && deploy.duration"
                          class="text-label-sm text-(--text-muted)"
                        >
                          {{ deploy.duration }}
                        </span>
                        <StatusIndicator
                          v-else
                          :severity="status.severity"
                          :loading="status.loading"
                          :label="deploy.status"
                        />
                      </span>
                    </Accordion.Trigger>

                    <div
                      class="pointer-events-none absolute inset-y-0 right-0 hidden items-center pr-(--spacing-md) sm:flex"
                    >
                      <div class="pointer-events-auto flex items-center">
                        <SegmentedButton
                          v-if="settled && logsOpen === 'logs'"
                          v-model="logView"
                          :options="LOG_VIEWS"
                          class="shrink-0"
                          size="medium"
                          aria-label="Log view"
                        />
                      </div>
                    </div>
                  </div>

                  <Accordion.Content>
                    <EmptyState
                      v-if="!finished && !running"
                      :bordered="false"
                      class="py-(--spacing-xl)"
                      icon="pi pi-clock"
                      :title="`${deploy.status} — not started`"
                      :description="
                        deploy.status === 'Draft'
                          ? 'A draft is prepared and never published, so it has no pipeline to show.'
                          : 'The steps appear here as soon as the deployment starts running.'
                      "
                    />

                    <DeploymentLogs
                      v-else
                      v-model:view="logView"
                      :header="false"
                      :progress-bar="false"
                      :steps="recorded ? steps : undefined"
                      :live="!recorded && running"
                      :fail-at="deploy.failedAt"
                      :active-at="deploy.activeStep"
                      :total-label="deploy.duration"
                      @finished="onStreamSettled"
                      @failed="onStreamSettled"
                    />
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion>
            </template>
          </CardBox>
        </section>
      </template>
    </main>
  </AppLayout>
</template>
