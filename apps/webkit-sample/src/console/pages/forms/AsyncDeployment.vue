<script setup>
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Message from '@aziontech/webkit/message'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import Tag from '@aziontech/webkit/tag'
  import { logIntervalFor } from '@shared/ui/deployment/deployment-steps.js'
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import DeploymentFlow from '../../components/deployment/DeploymentFlow.vue'
  import PageHeading from '../../components/page/PageHeading.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import {
    activeRun,
    DEPLOY_DURATION_MS,
    DEPLOY_ERROR,
    elapsedOf,
    latestRun,
    redeployRun,
    resetDeployRuns,
    startDeployRun
  } from '../../lib/state/deploy-runs'

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const FAIL_STEP = DEPLOY_ERROR.step

  const REPO = { name: 'checkout-web', scope: 'gab-az' }

  const outcome = computed({
    get: () => (route.query.outcome === 'error' ? 'error' : 'success'),
    set: (value) => router.replace({ query: { ...route.query, outcome: value } })
  })

  const run = computed(() => latestRun.value)
  const running = computed(() => Boolean(activeRun.value))
  const status = computed(() => run.value?.status ?? 'idle')

  const outcomes = computed(() =>
    [
      { label: 'Succeeds', value: 'success' },
      { label: 'Fails', value: 'error' }
    ].map((option) => ({ ...option, disabled: running.value }))
  )

  const flowKey = computed(() => `${run.value?.id}-${run.value?.attempt}`)

  const flowInterval = computed(() =>
    logIntervalFor({
      durationMs: run.value?.durationMs ?? DEPLOY_DURATION_MS,
      failAt: run.value?.outcome === 'error' ? FAIL_STEP : ''
    })
  )

  const start = () => {
    if (running.value) return
    startDeployRun({
      name: REPO.name,
      scope: REPO.scope,
      outcome: outcome.value,
      durationMs: DEPLOY_DURATION_MS
    })
  }

  const retry = () => run.value && redeployRun(run.value.id)

  const goToDeployments = () =>
    router.push({ path: '/deployments', query: { email: userEmail.value } })

  const openWorkload = () =>
    router.push({
      path: `/workloads/${run.value?.record?.workload.id ?? ''}`,
      query: { email: userEmail.value, name: run.value?.record?.workload.name }
    })

  const statusTag = computed(() => {
    if (status.value === 'running') return { label: 'Deploying', severity: 'info' }
    if (status.value === 'error') return { label: 'Failed', severity: 'danger' }
    if (status.value === 'success') return { label: 'Deployed', severity: 'success' }
    return { label: 'Idle', severity: 'secondary' }
  })
</script>

<template>
  <AppLayout
    active="deployments"
    :breadcrumb="[{ label: 'Deployments', href: '/deployments' }, { label: 'Async deployment' }]"
  >
    <main class="layout-column-focused flex min-h-full flex-col">
      <PageHeading
        size="large"
        title="Async deployment"
        description="A deploy runs for half a minute and asks nothing of you while it does. Start one, then open any module in the sidebar. The run keeps going and reports back through the toast, wherever you are."
      >
        <template #actions>
          <Tag
            :label="statusTag.label"
            :severity="statusTag.severity"
            size="medium"
          />
        </template>
      </PageHeading>

      <aside
        aria-label="Scenario simulation"
        class="layout-section-start flex flex-col gap-(--spacing-md) rounded-(--shape-card) border border-dashed border-(--border-default) bg-(--bg-surface-raised) p-(--spacing-lg)"
      >
        <div class="flex flex-wrap items-center justify-between gap-(--spacing-sm)">
          <p class="m-0 text-overline-sm text-(--text-muted)">Simulation — how this deploy ends</p>
          <Tag
            :label="`${REPO.scope}/${REPO.name}`"
            severity="secondary"
            size="medium"
          />
        </div>
        <p class="m-0 text-body-sm text-(--text-muted)">
          The ending is held in the URL (<code class="text-label-code-sm">?outcome=</code>), so a
          run is linkable and survives a reload. Pick one, press Deploy, and leave the page — the
          toast follows you and settles wherever you are.
        </p>
        <div class="flex flex-wrap items-center gap-(--spacing-sm)">
          <SegmentedButton
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
            @click="start"
          />
          <Button
            label="Reset scenario"
            kind="text"
            size="medium"
            :disabled="running"
            @click="resetDeployRuns"
          />
        </div>
      </aside>

      <EmptyState
        v-if="status === 'idle'"
        bordered
        class="layout-section-start"
        icon="pi pi-cloud-upload"
        title="No deployment running"
        description="Start one above. It takes about 25 seconds, long enough to walk away from, which is the whole point."
      >
        <template #actions>
          <Button
            label="Deploy"
            kind="primary"
            size="medium"
            @click="start"
          />
        </template>
      </EmptyState>

      <template v-else>
        <Message
          v-if="status === 'error'"
          key="status-failed"
          severity="danger"
          :label="run.error?.detail"
          class="layout-section-start animate-popup-scale-in motion-reduce:animate-none"
          style="--popup-origin: top"
        >
          <template #action>
            <div class="flex items-center gap-(--spacing-xs)">
              <Button
                label="Redeploy"
                kind="secondary"
                size="medium"
                icon="pi pi-refresh"
                @click="retry"
              />
              <Button
                label="View deployments"
                kind="text"
                size="medium"
                @click="goToDeployments"
              />
            </div>
          </template>
        </Message>

        <Message
          v-else-if="status === 'success'"
          key="status-live"
          severity="success"
          :label="`${run.name} is live at ${run.record?.workload.domain}. It took ${run.attempt} attempt${run.attempt > 1 ? 's' : ''}.`"
          class="layout-section-start animate-popup-scale-in motion-reduce:animate-none"
          style="--popup-origin: top"
        >
          <template #action>
            <Button
              label="Open workload"
              kind="secondary"
              size="medium"
              @click="openWorkload"
            />
          </template>
        </Message>

        <DeploymentFlow
          v-if="status !== 'success'"
          :key="flowKey"
          class="layout-section-start"
          :repo-owner="run.scope"
          :repo-path="run.name"
          :scope="run.scope"
          :outcome="run.outcome"
          :fail-step="FAIL_STEP"
          :interval="flowInterval"
          :seek="elapsedOf(run)"
        />
      </template>
    </main>
  </AppLayout>
</template>
