<script setup>
  // Deployment detail — the deploy PAGE, opened from a row in the Deployments
  // module (`/deployments/:id`).
  //
  // Why a page and not the drawer every other deployment opens. The read-only
  // drawer (ui/WorkloadDeploymentDrawer.vue) is right for a deployment whose whole
  // story is "which resource, which environment, who, when" — a row with its logs
  // attached. A deployment somebody has to DIAGNOSE needs the whole pipeline its
  // `azion deploy` ran: one step per resource the CLI applied, the artifacts each
  // one touched, the step that broke, and the ones that never ran after it. That
  // is something you link to, reload and come back to, so it lives at a URL.
  //
  // Three bands, in the order the questions arrive:
  //
  //   1. WHAT IS THIS?      the metadata CardBox (identity + what it deployed)
  //   2. WHAT HAPPENED?     the pipeline, in DeploymentFlow's card layout —
  //                         the same step view the deploy flow streams
  //   3. WHAT DO I DO NOW?  the outcome banner and its one recovery action
  //
  // The record comes from src/lib/azion-deploys.js, whose steps are the real
  // `azion deploy` pipeline and whose artifacts are this app's real ones
  // (azion.config.js + azion/azion.json) — the production deployment there is the
  // deploy that actually shipped this app.
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Divider from '@aziontech/webkit/divider'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Message from '@aziontech/webkit/message'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { deployById, stepsOf, triggerMeta } from '../lib/azion-deploys'
  import { formatListDate } from '../lib/dates'
  import { statusMeta } from '../lib/deployments'
  import { relativeTime } from '../lib/relative-time'
  import AppLayout from './ui/AppLayout.vue'
  import DeploymentLogs from './ui/DeploymentLogs.vue'
  import PageHeading from './ui/PageHeading.vue'

  const route = useRoute()
  const router = useRouter()

  // The email carried over from the login flow (falls back to a placeholder).
  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  // The record the URL names. `undefined` for an id that is not in the fixture —
  // a hand-typed or stale link, which the page has to answer for rather than
  // rendering a blank shell.
  const deploy = computed(() => deployById(String(route.params.id ?? '')))

  const status = computed(() => statusMeta(deploy.value?.status))
  const trigger = computed(() => triggerMeta(deploy.value?.trigger))
  const steps = computed(() => (deploy.value ? stepsOf(deploy.value) : []))

  const failed = computed(() => deploy.value?.status === 'Error')
  const running = computed(() => deploy.value?.status === 'Building')

  const goToDeployments = () =>
    router.push({ path: '/deployments', query: { email: userEmail.value } })

  // Redeploy, Logs and Requests are reported, not simulated: a redeploy is the
  // Deployments module's own action (it toasts there too), and the runtime log /
  // request streams belong to Real-Time Events and Real-Time Metrics, which this
  // sample does not carry. Saying so beats a button that looks live and is not.
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
</script>

<template>
  <AppLayout
    active="deployments"
    :breadcrumb="[
      { label: 'Deployments', href: '/deployments' },
      { label: deploy?.id ?? 'Deployment' }
    ]"
  >
    <!-- The FOCUSED measure. This was `layout-column layout-focused` — a class that
         does not exist, so the page silently fell back to the DATA measure and ran
         edge to edge. It is one deployment read end to end (identity, then the
         pipeline, then what to do), with no table, so it takes the focused column. -->
    <main class="layout-column-focused flex min-h-full flex-col">
      <!-- An id that is not a deployment gets an answer, not an empty page. -->
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
        <!-- The id IS the title: a deployment has no name, and its id is what a
             support thread, a CLI output and a URL all refer to. -->
        <PageHeading
          size="small"
          :title="deploy.id"
          :description="`Deployment of ${deploy.application.name} to ${deploy.workload.name} — every step the \`azion deploy\` pipeline ran, and what it left behind.`"
        >
          <template #actions>
            <Button
              label="Logs"
              kind="outlined"
              size="medium"
              icon="pi pi-align-left"
              @click="openLogs"
            />
            <Button
              label="Requests"
              kind="outlined"
              size="medium"
              icon="pi pi-arrow-right-arrow-left"
              @click="openRequests"
            />
            <!-- The divider separates reading the deployment from acting on it.
                 The wrapper gives the vertical rule its height: the component
                 fills its parent (`h-full`), and in a centred flex row that
                 resolves to nothing on its own. -->
            <span class="h-6">
              <Divider orientation="vertical" />
            </span>
            <Button
              label="Redeploy"
              kind="secondary"
              size="medium"
              icon="pi pi-refresh"
              @click="redeploy"
            />
          </template>
        </PageHeading>
        <!-- The page's parent section: the three bands below, in the order the
             questions arrive. -->
        <section class="layout-section-start flex min-w-0 flex-col gap-[var(--layout-section-gap)]">
          <!-- ── 1. What is this? ─────────────────────────────────────────────
               Identity in the header (the id, copyable, plus the status every
               deployment surface reads), the runtime facts in the body. -->
          <CardBox>
            <template #header>
              <div class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
                <span class="truncate text-label-code-sm text-[var(--text-default)]">
                  {{ deploy.id }}
                </span>
                <!-- The id is what you paste into a ticket or a CLI call, so it is
                     copyable from the one place it is stated as identity. -->
                <CopyButton
                  :value="deploy.id"
                  kind="outlined"
                  aria-label="Copy deployment id"
                  copied-label="Deployment id copied"
                />
              </div>
              <StatusIndicator
                :severity="status.severity"
                :loading="status.loading"
                :label="deploy.status"
              />
            </template>

            <template #content>
              <!-- Three columns on wide, two on tablet, one on phone. The order is
                   the order you ask: who made it and from where, then what it runs
                   with, then where it runs. -->
              <div class="grid grid-cols-1 gap-[var(--spacing-lg)] sm:grid-cols-2 lg:grid-cols-3">
                <div class="flex flex-col gap-[var(--spacing-xxs)]">
                  <span class="text-label-sm text-[var(--text-muted)]">Created</span>
                  <div class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
                    <!-- The face identifies the person; the tooltip carries the
                         name and the absolute date the relative one hides. -->
                    <Tooltip :text="`${deploy.author} · ${formatListDate(deploy.createdAt)}`">
                      <Avatar
                        :src="deploy.authorAvatar || undefined"
                        :alt="deploy.author"
                        :label="deploy.author"
                        size="small"
                        kind="square"
                      />
                    </Tooltip>
                    <span class="truncate text-body-sm text-[var(--text-default)]">
                      {{ relativeTime(deploy.createdAt) }}
                    </span>
                  </div>
                </div>

                <div class="flex flex-col gap-[var(--spacing-xxs)]">
                  <!-- Source is the WORKLOAD: the public entry point the
                       deployment publishes under. It links to that workload, so
                       the page is a step in the chain rather than a dead end. -->
                  <span class="text-label-sm text-[var(--text-muted)]">Source</span>
                  <router-link
                    :to="{
                      path: `/workloads/${deploy.workload.id}`,
                      query: { email: userEmail, name: deploy.workload.name }
                    }"
                    class="flex min-w-0 items-center gap-[var(--spacing-xs)] text-body-sm text-[var(--text-default)] no-underline hover:underline"
                  >
                    <i
                      class="ai ai-workloads shrink-0 text-[var(--text-muted)]"
                      aria-hidden="true"
                    />
                    <span class="truncate">{{ deploy.workload.name }}</span>
                    <i
                      class="pi pi-arrow-up-right shrink-0 text-[var(--text-muted)]"
                      aria-hidden="true"
                    />
                  </router-link>
                </div>

                <div class="flex flex-col gap-[var(--spacing-xxs)]">
                  <span class="text-label-sm text-[var(--text-muted)]">Environment</span>
                  <span class="text-body-sm text-[var(--text-default)]">
                    {{ deploy.environment }}
                  </span>
                </div>

                <div class="flex flex-col gap-[var(--spacing-xxs)]">
                  <!-- Azion starts a deployment from exactly two places, and which
                       one it was changes how you reproduce it: the Console (this
                       UI) or the CLI (`azion deploy`). The glyph comes from the
                       vocabulary, not from this page. -->
                  <span class="text-label-sm text-[var(--text-muted)]">Triggered By</span>
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

                <div class="flex flex-col gap-[var(--spacing-xxs)]">
                  <!-- What was deployed: the Edge Application the manifest applied.
                       It links to that application's page, so the page is a step in
                       the chain rather than a dead end. -->
                  <span class="text-label-sm text-[var(--text-muted)]">Application</span>
                  <router-link
                    :to="{
                      path: `/applications/${deploy.application.id}`,
                      query: { email: userEmail }
                    }"
                    class="flex min-w-0 items-center gap-[var(--spacing-xs)] text-body-sm text-[var(--text-default)] no-underline hover:underline"
                  >
                    <i
                      class="ai ai-edge-application shrink-0 text-[var(--text-muted)]"
                      aria-hidden="true"
                    />
                    <span class="truncate">{{ deploy.application.name }}</span>
                    <i
                      class="pi pi-arrow-up-right shrink-0 text-[var(--text-muted)]"
                      aria-hidden="true"
                    />
                  </router-link>
                </div>

                <div class="flex flex-col gap-[var(--spacing-xxs)]">
                  <!-- The build preset from azion.config.js: what turned the repo
                       into the bundle this deployment shipped. -->
                  <span class="text-label-sm text-[var(--text-muted)]">Preset</span>
                  <div class="flex min-w-0 items-center">
                    <Tooltip text="build.preset in azion.config.js">
                      <Tag
                        severity="secondary"
                        size="medium"
                        icon="pi pi-wrench"
                        :label="deploy.edge.preset"
                      />
                    </Tooltip>
                  </div>
                </div>

                <div class="flex flex-col gap-[var(--spacing-xxs)] sm:col-span-2 lg:col-span-3">
                  <!-- Where the assets went: the bucket and the prefix this run
                       uploaded under. `rotate-prefix` gives every deploy its own
                       prefix, which is exactly what makes a rollback possible — so
                       the prefix is the deployment's most useful artifact id. -->
                  <span class="text-label-sm text-[var(--text-muted)]">Storage</span>
                  <div
                    class="flex min-w-0 flex-wrap items-center gap-[var(--spacing-xs)] text-body-sm text-[var(--text-default)]"
                  >
                    <i
                      class="ai ai-edge-storage shrink-0 text-[var(--text-muted)]"
                      aria-hidden="true"
                    />
                    <span class="truncate">{{ deploy.edge.bucket }}</span>
                    <span
                      class="text-body-xs text-[var(--text-muted)]"
                      aria-hidden="true"
                      >·</span
                    >
                    <span class="text-label-code-sm text-[var(--text-muted)]">
                      {{ deploy.edge.prefix }}
                    </span>
                  </div>
                </div>
              </div>
            </template>
          </CardBox>

          <!-- ── 2. What happened? ────────────────────────────────────────────
               The pipeline, in ui/DeploymentFlow.vue's anatomy — the same one the
               template deploy and the async deploy render: a flush "Deployment"
               card, its title on the left and the run's source muted on the right,
               wrapping the SAME step view that flow streams
               (ui/DeploymentLogs.vue). One row per step: status glyph, title,
               feedback Tag, the CLI's timing, and its own log inside. What this
               page hands it is only the record — which step failed, which one is in
               flight, and how long the whole deployment took. -->
          <CardBox
            :padded="false"
            class="w-full"
          >
            <template #header>
              <p class="text-heading-xs text-[var(--text-default)]">Deployment</p>
              <span class="text-label-sm text-[var(--text-muted)]">
                {{ trigger.source }}
              </span>
            </template>

            <template #content>
              <DeploymentLogs
                :steps="steps"
                :fail-at="deploy.failedAt"
                :active-at="deploy.activeStep"
                :total-label="deploy.duration"
              />
            </template>
          </CardBox>

          <!-- ── 3. What do I do now? ─────────────────────────────────────────
               One banner, one action, matched to the outcome. It sits BELOW the
               steps on purpose: the failure's reason is the step that produced it,
               so the recovery reads after the evidence, not before it. -->
          <Message
            v-if="failed"
            severity="danger"
            size="small"
            :label="deploy.error.detail"
            class="animate-popup-scale-in motion-reduce:animate-none"
            style="--popup-origin: top"
          >
            <template #action>
              <div class="flex items-center gap-[var(--spacing-xs)]">
                <Button
                  label="Redeploy"
                  kind="secondary"
                  size="medium"
                  icon="pi pi-refresh"
                  @click="redeploy"
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
            v-else-if="running"
            severity="info"
            :label="`Deploying to ${deploy.workload.name} (${deploy.environment.toLowerCase()}). Nothing is published until the workload deployment is created — the previous deployment keeps serving traffic.`"
          />

          <Message
            v-else
            severity="success"
            :label="`Live at ${deploy.url} — published to ${deploy.workload.name} in ${deploy.duration}.`"
          >
            <template #action>
              <Button
                label="Visit"
                kind="secondary"
                size="medium"
                icon="pi pi-external-link"
                :href="deploy.url"
                target="_blank"
              />
            </template>
          </Message>
        </section>
      </template>
    </main>
  </AppLayout>
</template>
