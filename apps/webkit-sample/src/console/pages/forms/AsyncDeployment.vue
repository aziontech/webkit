<script setup>
  // Scenario: AN ASYNC ACTION THAT OUTLIVES ITS SCREEN — and how its failure
  // finds a user who has walked away.
  //
  // The sibling scenario (`/forms/error-validation`) covers a failure that
  // happens WHILE the user is looking at the form: the request is short, the user
  // is present, and the error belongs inside the section that owns the broken
  // field. A deploy is the opposite on every axis. It takes half a minute, it
  // asks nothing of the user while it runs, and the whole point of it being async
  // is that they are free to go elsewhere. So the error has nowhere on this page
  // to land — the page may not be mounted when it arrives.
  //
  // That inverts where the report goes:
  //
  //   | The failure arrives…                  | Report it in…                    |
  //   | ------------------------------------- | -------------------------------- |
  //   | while the user is on the form         | a Message in the owning section  |
  //   | scoped to one field they must fix     | + that field's `invalid` state   |
  //   | after they left, from a background job| a TOAST — the only global surface|
  //
  // Three things follow, and they are the scenario:
  //
  //   1. THE RUN CANNOT LIVE IN THIS COMPONENT. Its timer, state and toast live
  //      at module scope in `src/lib/deploy-runs.js`, so navigating away does not
  //      cancel a deploy — this page unmounting is not an event the deploy hears.
  //   2. THE PROGRESS IS A LOADING TOAST (spinner, never auto-dismissing). It is
  //      the only thing that travels with the user through the whole console.
  //   3. THE ERROR TOAST IS CLOSABLE AND PERMANENT. A failure the user was not
  //      present for must not expire unseen; and something that never expires has
  //      to be dismissible by hand. Its anatomy carries the two ways out —
  //      Redeploy, and an escape to the Deployments module — because once it is
  //      dismissed, the toast was the only reference to the failure on screen.
  //      That anatomy lives in `ui/AppToaster.vue`.
  //
  // The card below is a VIEW of the run, never its owner: it reads `seek` so a
  // user coming back mid-deploy picks the logs up where they actually are instead
  // of watching them rewind, and its pace is derived from the run's duration so
  // it can never contradict the toast.
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

  // The email carried over from the login flow (falls back to a placeholder).
  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  // The step the simulated platform rejects — read from the error record, never
  // re-declared here: the store's copy explains THIS step, so choosing the step
  // separately would let the card say "Failed on Build" under a message about the
  // Edge Application. Configuring the Edge Application is the LAST step on
  // purpose: the build and the upload already succeeded, so the failure is the
  // recoverable kind and "Redeploy" is a real answer to it.
  const FAIL_STEP = DEPLOY_ERROR.step

  const REPO = { name: 'checkout-web', scope: 'gab-az' }

  // ── The simulated ending, held in the URL ─────────────────────────────────
  // `?outcome=error` is a route, not a component flag: it is linkable, it
  // survives a reload, and it can be handed to someone else to reproduce exactly
  // what you saw. Same reason Deployments keeps its active tab in `?tab=`.
  const outcome = computed({
    get: () => (route.query.outcome === 'error' ? 'error' : 'success'),
    set: (value) => router.replace({ query: { ...route.query, outcome: value } })
  })

  // ── The run ────────────────────────────────────────────────────────────────
  const run = computed(() => latestRun.value)
  const running = computed(() => Boolean(activeRun.value))
  const status = computed(() => run.value?.status ?? 'idle')

  // SegmentedButton has no group-level `disabled`; the option carries it, so the
  // choice locks per option while a run is in flight.
  const outcomes = computed(() =>
    [
      { label: 'Succeeds', value: 'success' },
      { label: 'Fails', value: 'error' }
    ].map((option) => ({ ...option, disabled: running.value }))
  )

  // Remount the card on a redeploy: the same run starts over, so its view has to
  // start over with it rather than hold the frozen failed logs.
  const flowKey = computed(() => `${run.value?.id}-${run.value?.attempt}`)

  // The card's pace, derived from the run's own duration so the last log line and
  // the toast's verdict land together.
  const flowInterval = computed(() =>
    logIntervalFor({
      durationMs: run.value?.durationMs ?? DEPLOY_DURATION_MS,
      failAt: run.value?.outcome === 'error' ? FAIL_STEP : ''
    })
  )

  const start = () => {
    if (running.value) return // one deploy at a time in this scenario
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
  <!-- The sidebar STAYS. It is not decoration here: walking into another module
       while the deploy runs is the behaviour this page exists to demonstrate,
       so the way out has to be one click away at all times. -->
  <AppLayout
    active="deployments"
    :breadcrumb="[{ label: 'Deployments', href: '/deployments' }, { label: 'Async deployment' }]"
  >
    <!-- The FOCUSED measure (`.layout-column-focused`, --container-4xl), the same
         column the rest of the deployment flow takes (the release composer, the
         deployment detail, the template deploy). This page is one run read end to
         end — a banner, then the pipeline card — with no table on it, so the DATA
         measure it used to carry only bought it dead width: at 1620px the log
         lines ran a head-turn away from the step names that label them.

         It is one of the Forms flows, so the rhythm sits on the BAND
         (`.layout-section-start` = --layout-boundary-start, the same step the
         boundary puts above the heading), not on the container — which also
         happens to be what this page needs: its bands are conditional (idle
         EmptyState vs. outcome banner + timeline), so every band after the
         heading carries its own top space and no stack gap has to guess which
         ones are rendered.

         `min-h-full`, never `h-full`: a flex column pinned to exactly the viewport
         height shrinks its children to fit instead of letting the content zone
         scroll — which silently crushed the failure Message to one line while its
         text spilled out of the banner. -->
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

      <!-- Demo scaffolding, dashed so it reads as not-part-of-the-product. -->
      <aside
        aria-label="Scenario simulation"
        class="layout-section-start flex flex-col gap-[var(--spacing-md)] rounded-[var(--shape-card)] border border-dashed border-[var(--border-default)] bg-[var(--bg-surface-raised)] p-[var(--spacing-lg)]"
      >
        <div class="flex flex-wrap items-center justify-between gap-[var(--spacing-sm)]">
          <p class="m-0 text-overline-sm text-[var(--text-muted)]">
            Simulation — how this deploy ends
          </p>
          <Tag
            :label="`${REPO.scope}/${REPO.name}`"
            severity="secondary"
            size="medium"
          />
        </div>
        <p class="m-0 text-body-sm text-[var(--text-muted)]">
          The ending is held in the URL (<code class="text-label-code-sm">?outcome=</code>), so a
          run is linkable and survives a reload. Pick one, press Deploy, and leave the page — the
          toast follows you and settles wherever you are.
        </p>
        <div class="flex flex-wrap items-center gap-[var(--spacing-sm)]">
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

      <!-- Idle: nothing is running and nothing has run yet. -->
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
        <!-- The failure lands here too, for the user who DID stay. The toast is
             the report for whoever left; this page owes the same recovery to
             whoever is still looking at it — same two ways out, stated once
             each, so neither surface is the only place to find them. -->
        <Message
          v-if="status === 'error'"
          key="status-failed"
          severity="danger"
          :label="run.error?.detail"
          class="layout-section-start animate-popup-scale-in motion-reduce:animate-none"
          style="--popup-origin: top"
        >
          <template #action>
            <div class="flex items-center gap-[var(--spacing-xs)]">
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

        <!-- The deploy card (it renders its own CardBox). `seek` is what makes
             coming back mid-run honest: the logs resume at the line the run is
             actually on. Its `finished` / `failed` events are deliberately NOT
             wired up — the run settles on its own timer in the store, and
             letting a view that may not even be mounted decide the outcome is
             exactly the coupling this scenario is about removing. -->
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
