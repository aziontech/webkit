<script setup>
  // Deployment detail — the deploy PAGE at `/deployments/:id`, and the ONLY surface
  // a deployment is read on. Every list opens it: the Deployments module, a
  // workload's Deployments tab, its Version History.
  //
  // It used to be two surfaces. A deployment whose pipeline this console recorded got
  // this page; every other row got a read-only drawer. That split cost more than it
  // saved: the same click gave two different depths of answer, and the shallower one
  // closed on the Escape key, could not be linked to, and could not be reloaded — for
  // the one record people quote to each other by id. So there is one surface, and it
  // renders what each record actually knows (see `deployPageRecord`): a recorded run
  // brings its artifacts, its trigger and its real steps, a row-shaped deployment
  // brings who deployed what, where and when, and the fields it has no answer for are
  // dropped rather than filled in with guesses.
  //
  // The page reads top-down as: WHO AM I LOOKING AT (the heading — the id, its
  // copy control, when it started and how long it took), WHERE DOES IT STAND (the
  // status banner, the first band), WHAT IS IT MADE OF (Build Details), and WHAT
  // HAPPENED (the pipeline).
  //
  // The banner leads rather than trailing the steps. It is the page's status line:
  // a running deployment's banner says what is and is not published yet, which is
  // the thing that decides whether you keep reading at all — so it is answered
  // before the evidence, not after it. The failure's own explanation still lives
  // in the step that produced it, one screen down, where the log is.
  //
  // The recorded runs come from src/lib/azion-deploys.js, whose steps are the real
  // `azion deploy` pipeline and whose artifacts are this app's real ones
  // (azion.config.js + azion/azion.json) — the production deployment there is the
  // deploy that actually shipped this app.
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Dropdown from '@aziontech/webkit/dropdown'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import Message from '@aziontech/webkit/message'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { deployPageRecord, triggerMeta } from '@shared/lib/azion-deploys'
  import { formatListDate } from '@shared/lib/dates'
  import DeploymentLogs from '@shared/ui/deployment/DeploymentLogs.vue'
  import DeploymentLogsControls from '@shared/ui/deployment/DeploymentLogsControls.vue'
  import { computed, ref, useTemplateRef } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import PageHeading from '../../components/page/PageHeading.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import { resourceMeta, statusMeta } from '../../lib/data/deployments'
  import { relativeTime } from '../../lib/format/relative-time'

  const route = useRoute()
  const router = useRouter()

  // The email carried over from the login flow (falls back to a placeholder).
  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  // The record the URL names — ANY deployment in the console, recorded run or seeded
  // history row, resolved to one shape by src/lib/azion-deploys.js. `undefined` for
  // an id nothing matches: a hand-typed or stale link, which the page has to answer
  // for rather than rendering a blank shell.
  // `workload` / `workloadName` ride the query because a workload this sample does
  // not seed has a DERIVED history: those version ids exist only relative to that
  // workload, so the link that listed them hands over which one it was. Everything
  // else resolves from the id alone.
  const deploy = computed(() =>
    deployPageRecord(String(route.params.id ?? ''), {
      workloadId: String(route.query.workload ?? ''),
      workloadName: String(route.query.workloadName ?? '')
    })
  )

  // What it deployed, named the way the console names that kind of resource — and
  // linked only where a module page exists to link to (Applications does; Firewall
  // and Custom Pages are nav-only in this sample, so those read as plain text).
  const resource = computed(() => resourceMeta(deploy.value?.resource?.type))
  const resourceLink = computed(() =>
    resource.value.path && deploy.value?.resource?.id
      ? {
          path: `${resource.value.path}/${deploy.value.resource.id}`,
          query: { email: userEmail.value }
        }
      : null
  )

  // Present only for a run this console recorded. A seeded row has no trigger and no
  // build artifacts, and the page drops those fields rather than inventing them.
  const trigger = computed(() => (deploy.value?.trigger ? triggerMeta(deploy.value.trigger) : null))
  const edge = computed(() => deploy.value?.edge ?? null)

  // The pipeline. A recorded run hands over its own steps — which one failed, which
  // never ran; a row-shaped deployment has none, so the card streams the canonical
  // pipeline as an illustration of where it is (what the read-only drawer did for
  // these rows before every deployment became a page). `steps: []` is the honest
  // marker of that difference, so it is read here rather than hidden in the fixture.
  const steps = computed(() => deploy.value?.steps ?? [])
  const recorded = computed(() => steps.value.length > 0)

  const failed = computed(() => deploy.value?.status === 'Error')
  const running = computed(() => deploy.value?.status === 'Building')

  // FINISHED is the test the log controls hang on — not "isn't running". A Queued or
  // a Draft deployment has produced nothing: no view to switch, nothing to copy, and
  // no pipeline to draw. Lumping those in with "settled" is what made a queued
  // deployment render ten completed steps under the word "Queued".
  const finished = computed(() => failed.value || deploy.value?.status === 'Ready')
  const status = computed(() => statusMeta(deploy.value?.status))

  // The log view, owned here because the CONTROL is here: the switch sits in the
  // pipeline card's header (see the template), so the state it drives cannot live
  // inside the component below it. The copy payload travels the other way — the
  // logs component knows which lines are revealed, and exposes them.
  const logView = ref('phased')
  const logsRef = useTemplateRef('logsRef')
  const logsText = computed(() => logsRef.value?.logsText ?? '')

  // The heading's supporting line: when the run started, then what it has to show
  // for it. Both halves are facts about the RUN, which is what a heading whose
  // title is an opaque id owes the reader — the prose about what was deployed and
  // where moved into Build Details, which states it as fields you can click.
  //
  // The second clause is derived, never a fixed "Completed in": a deployment in
  // flight has no duration to report (the fixture leaves it empty), so a template
  // that assumed one printed "Completed in ." on the one status where the reader
  // most needs the truth.
  const timing = computed(() => {
    if (!deploy.value) return ''
    const { duration } = deploy.value
    const started = `Started ${formatListDate(deploy.value.createdAt)}`
    if (running.value) return `${started} · Running`
    if (failed.value)
      return duration ? `${started} · Failed after ${duration}` : `${started} · Failed`
    if (deploy.value.status === 'Ready')
      return duration ? `${started} · Completed in ${duration}` : `${started} · Completed`
    // Queued / Draft: nothing has been spent yet, and the banner names the state.
    return started
  })

  // The status banner — one per state, and every state the console's deployment
  // vocabulary carries (lib/deployments.js), not just the three a recorded run ends
  // in. A seeded row can be Queued or Draft, and reading "Live at ." on a deployment
  // that has not run is worse than saying nothing.
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
    // Ready. The URL is what a recorded run publishes; a seeded row has none, so it
    // reports what it serves rather than a link it cannot supply.
    return {
      severity: 'success',
      label: url
        ? `Live at ${url} — published to ${where} in ${duration}.`
        : `Live — serving ${where}${duration ? ` · published in ${duration}` : ''}.`
    }
  })

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

  // Everything except Visit lives behind the overflow. Visiting the deployment is
  // the one thing you do WITH a deployment; redeploying it and reading its runtime
  // streams are things you do about it, and a header that spends four buttons on
  // them competes with the id it is supposed to be naming.
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
             support thread, a CLI output and a URL all refer to. Which is also why
             the copy control sits IN the title row (`title-suffix`) rather than
             among the actions — it copies that id, so it belongs where the id is,
             and the card below no longer has to restate the id to be copyable. -->
        <PageHeading
          size="small"
          :title="deploy.id"
          :description="timing"
        >
          <template #title-suffix>
            <CopyButton
              :value="deploy.id"
              kind="outlined"
              aria-label="Copy deployment id"
              copied-label="Deployment id copied"
            />
          </template>

          <template #actions>
            <!-- Visit is the page's one primary act, and it is the one action whose
                 availability is a FACT of the record: a deployment that has not
                 published yet has no URL to open. Rendering it disabled rather than
                 hiding it keeps the header stable as the run settles, and the
                 tooltip says why it is off — a button that vanishes teaches nothing.
                 With no `href` it is a real `<button disabled>`, so it is inert to
                 the keyboard too, not just visually. -->
            <Tooltip :text="deploy.url ? deploy.url : 'Available once the deployment is live'">
              <Button
                label="Visit"
                kind="secondary"
                size="medium"
                icon="pi pi-external-link"
                :href="deploy.url"
                :disabled="!deploy.url"
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
          </template>
        </PageHeading>
        <!-- The page's parent section: the three bands below, in the order the
             questions arrive. -->
        <section class="layout-section-start flex min-w-0 flex-col gap-[var(--layout-section-gap)]">
          <!-- ── 1. Where does it stand? ──────────────────────────────────────
               One banner, matched to the outcome, as the page's status line. The
               running one is the reason it leads: "nothing is published yet" is
               what decides whether the rest of the page is urgent, and it is not a
               conclusion the reader should have to scroll past ten steps to reach.
               The failing one carries the recovery here too, because a failure
               read at the top is where the reader decides what to do next. -->
          <!-- One banner, one severity, one sentence per state (see `banner`). The
               failure is the only one that carries an action: Redeploy is the answer
               to it, and no other state has an answer that is not already in the
               header. Visit deliberately is not repeated here — the same link twice
               on one screen makes the reader choose between identical things. -->
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

          <!-- ── 2. What is it made of? ───────────────────────────────────────
               The runtime facts, under a header that just names them. The identity
               that used to sit here (the id + its copy control + the status) moved
               to the two places that already carry it: the heading, and the
               pipeline card whose progress the status describes. A card header
               repeating the page title was the same string twice, 80px apart. -->
          <CardBox>
            <template #header>
              <p class="text-heading-xs text-[var(--text-default)]">Build Details</p>
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

                <div
                  v-if="trigger"
                  class="flex flex-col gap-[var(--spacing-xxs)]"
                >
                  <!-- Azion starts a deployment from exactly two places, and which
                       one it was changes how you reproduce it: the Console (this
                       UI) or the CLI (`azion deploy`). The glyph comes from the
                       vocabulary, not from this page. Absent on a deployment whose
                       trigger was never recorded — an empty "Triggered By" teaches
                       less than no row at all. -->
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
                  <!-- WHAT was deployed. A deployment targets exactly one resource
                       (see lib/deployments.js), so this block is named by that
                       resource's own kind — Application, Firewall, Custom Page — and
                       links to it where the module exists to link to. -->
                  <span class="text-label-sm text-[var(--text-muted)]">{{ resource.label }}</span>
                  <component
                    :is="resourceLink ? 'router-link' : 'div'"
                    :to="resourceLink || undefined"
                    class="flex min-w-0 items-center gap-[var(--spacing-xs)] text-body-sm text-[var(--text-default)] no-underline"
                    :class="resourceLink ? 'hover:underline' : ''"
                  >
                    <i
                      :class="[resource.icon, 'shrink-0 text-[var(--text-muted)]']"
                      aria-hidden="true"
                    />
                    <span class="truncate">{{ deploy.resource.name }}</span>
                    <i
                      v-if="resourceLink"
                      class="pi pi-arrow-up-right shrink-0 text-[var(--text-muted)]"
                      aria-hidden="true"
                    />
                  </component>
                </div>

                <div
                  v-if="edge"
                  class="flex flex-col gap-[var(--spacing-xxs)]"
                >
                  <!-- The build preset from azion.config.js: what turned the repo
                       into the bundle this deployment shipped. Only a run this
                       console recorded has build artifacts to show. -->
                  <span class="text-label-sm text-[var(--text-muted)]">Preset</span>
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
                  class="flex flex-col gap-[var(--spacing-xxs)] sm:col-span-2 lg:col-span-3"
                >
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
                    <span class="truncate">{{ edge.bucket }}</span>
                    <span
                      class="text-body-xs text-[var(--text-muted)]"
                      aria-hidden="true"
                      >·</span
                    >
                    <span class="text-label-code-sm text-[var(--text-muted)]">
                      {{ edge.prefix }}
                    </span>
                  </div>
                </div>
              </div>
            </template>
          </CardBox>

          <!-- ── 3. What happened? ────────────────────────────────────────────
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
              <!-- This side of the header changes with the run: the live status
                   while it is building, the two log controls once it has settled.
                   Both belong to the PIPELINE — "Building…" is a statement about the
                   steps directly below, and the switch/copy act on their output — so
                   they sit on the pipeline's own card rather than in the page header.
                   The rule lives in ui/DeploymentLogsControls.vue, shared with the
                   deploy flow card so the two cannot disagree. -->
              <DeploymentLogsControls
                v-model:view="logView"
                :settled="finished"
                :status-label="deploy.status"
                :severity="status.severity"
                :loading="status.loading"
                :logs-text="logsText"
              />
            </template>

            <template #content>
              <!-- A deployment that has not STARTED has no pipeline, and drawing one
                   is the worst thing this card can do: ten green steps under the word
                   "Queued" is a screen that contradicts itself. So it says what is
                   true and what will happen — the rows appear when the run does. -->
              <EmptyState
                v-if="!finished && !running"
                :bordered="false"
                class="py-[var(--spacing-xl)]"
                icon="pi pi-clock"
                :title="`${deploy.status} — not started`"
                :description="
                  deploy.status === 'Draft'
                    ? 'A draft is prepared and never published, so it has no pipeline to show.'
                    : 'The steps appear here as soon as the deployment starts running.'
                "
              />

              <!-- `label=\"Logs\"`, not the default \"Deployment Logs\": the card header
                   one line above already says Deployment. `:controls=\"false\"` — the
                   switch and the copy are rendered in that header, and the wall-clock
                   is in the page heading.

                   A recorded run hands over its own pipeline. A row-shaped deployment
                   has none, so `steps` is left undefined and the view falls back to
                   the canonical pipeline — streamed live while it is Building, which
                   is the one state where an illustration of the steps is still an
                   honest answer to "where is it?". -->
              <DeploymentLogs
                v-else
                ref="logsRef"
                v-model:view="logView"
                label="Logs"
                :controls="false"
                :steps="recorded ? steps : undefined"
                :live="!recorded && running"
                :fail-at="deploy.failedAt"
                :active-at="deploy.activeStep"
                :total-label="deploy.duration"
              />
            </template>
          </CardBox>
        </section>
      </template>
    </main>
  </AppLayout>
</template>
