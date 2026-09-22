<script setup>
  // Deployment detail — the deploy PAGE at `/deployments/:id`, and the ONLY surface
  // a deployment is read on. Every list opens it: the Deployments module, a
  // workload's Deployments tab, an application's.
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
  // The recorded runs come from @shared/lib/azion-deploys.js, whose steps are the real
  // `azion deploy` pipeline and whose artifacts are this app's real ones
  // (azion.config.js + azion/azion.json) — the production deployment there is the
  // deploy that actually shipped this app.
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
  import { workloadById } from '../../lib/data/workloads'
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
  import { relativeTime } from '../../lib/format/relative-time'

  const route = useRoute()
  const router = useRouter()

  // The email carried over from the login flow (falls back to a placeholder).
  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  // The record the URL names — ANY deployment in the console, recorded run or seeded
  // history row, resolved to one shape by ../../lib/data/deployments.js. `undefined` for
  // an id nothing matches: a hand-typed or stale link, which the page has to answer
  // for rather than rendering a blank shell.
  // `workload` / `workloadName` ride the query because a workload this sample does
  // not seed has a DERIVED history: those version ids exist only relative to that
  // workload, so the link that listed them hands over which one it was. Everything
  // else resolves from the id alone.
  const deploy = computed(() =>
    deployPageRecord(String(route.params.id ?? ''), {
      workloadId: String(route.query.workload ?? ''),
      workloadName: String(route.query.workloadName ?? ''),
      applicationId: String(route.query.application ?? ''),
      applicationName: String(route.query.applicationName ?? '')
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
  // inside the component below it. Copying is not owned here at all — LogView carries
  // its own control, pinned over the lines it copies.
  const logView = ref('phased')

  // Which item of the logs accordion is open — `null` while it is collapsed, which
  // is how it arrives. The page holds it because the VIEW SWITCH depends on it: the
  // switch acts on the output behind this disclosure, so it is only offered while
  // that output is on screen. Offering it over a closed panel is a control for
  // something the reader cannot see.
  const logsOpen = ref(null)

  // A deployment this console did not record streams its pipeline LIVE (see the
  // template), and that stream is the only thing that knows when it ends: the record
  // still says "Building", because nothing re-fetches it in this sample. Without
  // this, such a page kept a spinner and "Building…" in the card header — and kept
  // the progress bar under a pipeline whose every step had already gone green.
  const streamSettled = ref(false)
  const onStreamSettled = () => {
    streamSettled.value = true
  }

  // What the CARD reports: the record's own outcome, or the stream's if the run
  // finished in front of the reader.
  const settled = computed(() => finished.value || streamSettled.value)

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

  // The Deployment Settings this run applied — the STRATEGY half of the create body
  // (lib/data/deployment-strategies.js): which application, firewall and custom page
  // its versions bind, and under which routing policies. A recorded run carries the
  // strategy it was started with by name; everything else falls back to Azion
  // Default, which that module documents as the strategy every deploy starts with
  // (it binds the application being deployed and nothing else).
  const strategy = computed(
    () =>
      strategies.value.find((entry) => entry.name === deploy.value?.strategyName) ??
      azionDefaultStrategy
  )

  // The rows the settings panel lists: the ROUTING POLICY half of the strategy —
  // how the versions it publishes bind their resources, and how many of them may
  // take traffic. The bindings themselves (application, firewall, custom page) are
  // named by the card above and by the strategy's own record, so repeating them
  // here would be the same facts twice on one screen.
  const strategyFields = computed(() => [
    { label: 'Binding Policy', value: bindingPolicyLabel(strategy.value.bindingPolicy) },
    { label: 'Version Policy', value: deploymentPolicyLabel(strategy.value.deploymentPolicy) }
  ])

  // The hostnames this deployment answers on. They belong to the WORKLOAD, not to
  // the deployment — a deploy publishes under the workload's domains — so they are
  // read from that record.
  //
  // UNCAPPED. It used to slice to three, which is a cap with no way past it: the
  // rest of a workload's aliases (up to ~99 of them) simply were not reachable from
  // here. The cell below is the Workloads list's own instead — primary domain on the
  // line, everything after it behind the "+N" Popover that pages and filters them.
  const domains = computed(() => {
    const workload = workloadById(deploy.value?.workload?.id)
    const list = workload?.domains ?? []
    const primary = deploy.value?.workload?.domain
    return primary && !list.includes(primary) ? [primary, ...list] : list
  })

  const primaryDomain = computed(() => domains.value[0] ?? '')

  // What the "+N" tag counts: everything after the primary.
  const aliasCount = computed(() => Math.max(domains.value.length - 1, 0))

  // Where Visit goes. A run this console recorded publishes a real address and
  // carries it; a seeded row does not — but a READY deployment is, by definition,
  // serving, and what it serves under is its workload's domain. So the address is
  // derived from the workload rather than left empty, and Visit is live for every
  // deployment that is actually live. Anything not Ready has published nothing, so
  // it still has nowhere to go and the button stays inert with the reason in its
  // tooltip.
  const visitUrl = computed(() => {
    if (deploy.value?.url) return deploy.value.url
    if (deploy.value?.status !== 'Ready') return ''
    const domain = deploy.value.workload.domain || workloadById(deploy.value.workload.id)?.domain
    return domain ? `https://${domain}` : ''
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
    <!-- FULL BLEED. The page is a stack of cards whose own headers name every
         region, so it takes the whole content width inside the shell's boundary
         rather than a measured column — the fields read as a grid across the card
         instead of wrapping early in a 4xl column. -->
    <main class="flex min-h-full w-full flex-col">
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
        <!-- The page's parent section: the three bands below, in the order the
             questions arrive. -->
        <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
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
          <!-- `[&>footer]:min-h-12` — the footer holds ONE flush 48px accordion row,
               and CardBox floors its footer at min-h-14 (56px). Left alone, the band
               stays 56px while the trigger inside it is 48px, so the row's hover fill
               and its border stop short of the card edge. The override lowers only
               that floor; the row's height is the accordion's own. -->
          <CardBox class="[&>footer]:min-h-12">
            <template #header>
              <p class="text-heading-xs text-(--text-default)">Deployment Details</p>

              <!-- The page's actions live on this card, because this card is now
                   what names the deployment. Visit is the one primary act and the
                   one whose availability is a FACT of the record — a deployment that
                   has not published has no URL — so it renders disabled with the
                   reason in its tooltip rather than vanishing. -->
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
              <!-- Three columns on wide, two on tablet, one on phone. The order is
                   the order you ask: who made it and from where, then what it runs
                   with, then where it runs. -->
              <div class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2 lg:grid-cols-3">
                <div class="flex flex-col gap-(--spacing-xxs)">
                  <span class="text-label-sm text-(--text-muted)">Created</span>
                  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
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
                    <!-- A deployment's status is a LIVE state, not a classification:
                         it moves while you are looking at it, and StatusIndicator is
                         what carries that (a dot per severity, a spinner and an
                         ellipsis while it is still going). -->
                    <StatusIndicator
                      :severity="status.severity"
                      :loading="status.loading"
                      :label="deploy.status"
                    />
                    <!-- `current` is the request body's own flag: the deployment that
                         SERVES. It reads as a word beside the state rather than as a
                         second badge — "Ready" and "Latest" are one sentence about
                         this record, not two labels competing for the same row. -->
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
                  <!-- EVERY EXTERNAL MARK SAYS WHERE IT GOES. The glyph announces that
                       the name leaves this page; the tooltip names the page it leaves
                       for, so the reader decides before the click instead of after. -->
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
                  <!-- WHAT was deployed. A deployment targets exactly one resource
                       (see lib/deployments.js), so this block is named by that
                       resource's own kind — Application, Firewall, Custom Page — and
                       links to it where the module exists to link to. -->
                  <span class="text-label-sm text-(--text-muted)">{{ resource.label }}</span>
                  <!-- `disabled` when there is no route: a tooltip promising a
                       destination on a name that opens nothing is worse than silence. -->
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
                      <!-- No route, no glyph: a mark that leads nowhere is worse than
                           no mark, which is why this leg renders as a plain `<div>`. -->
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
                  <!-- Azion starts a deployment from exactly two places, and which
                       one it was changes how you reproduce it: the Console (this
                       UI) or the CLI (`azion deploy`). The glyph comes from the
                       vocabulary, not from this page. Absent on a deployment whose
                       trigger was never recorded — an empty "Triggered By" teaches
                       less than no row at all. -->
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
                  <!-- The build preset from azion.config.js: what turned the repo
                       into the bundle this deployment shipped. Only a run this
                       console recorded has build artifacts to show. -->
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
                  <!-- Where the assets went: the bucket and the prefix this run
                       uploaded under. `rotate-prefix` gives every deploy its own
                       prefix, which is exactly what makes a rollback possible — so
                       the prefix is the deployment's most useful artifact id. -->
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
                  <!-- The hostnames this deployment answers on once it is current —
                       the workload's own domains (../../lib/data/workloads). A deployment
                       has none of its own: it publishes UNDER the workload's.

                       SAME CELL AS THE WORKLOADS LIST, not a second reading of the
                       same records: the glyph naming the subject (outside the anchor —
                       it is not part of what the link opens), the primary domain as
                       the link, the aliases behind the "+N" Popover that pages and
                       filters them (../../components/list/DomainOverflowPopover.vue),
                       and the copy control last. A stacked list of the first three was
                       both a shape these records have nowhere else and a dead end for
                       the other ninety-six. -->
                  <span class="text-label-sm text-(--text-muted)">Domains</span>
                  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <i
                      class="ai ai-domains shrink-0 text-[1.15em] text-(--text-muted)"
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

            <!-- ── Deployment Settings ────────────────────────────────────────
                 The STRATEGY this run applied, as a disclosure on the card's own
                 bottom edge: it is a property OF this deployment, not a section
                 beside it, and it is the answer to a second question ("what did it
                 bind?") that only some readers ask. Closed by default for that
                 reason.

                 Flush: the negative margins cancel the footer's own inset so the
                 row spans the card edge to edge and its inset comes from
                 `--accordion-inset`, which is set to the card's `--spacing-md` so
                 the trigger starts on the same vertical line as the card title and
                 the fields above it. -->
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

                    <!-- The strategy NAMES a record that lives in account settings
                         (Settings → Build & Deployment), so it is a way OUT of this screen and
                         takes the console's cross-resource link shape: the name, then a
                         12px `pi-external-link`. It cannot sit inside the trigger — that
                         is a `<button>`, and an anchor nested in one is invalid markup —
                         so it is layered onto the row the same way the logs switch is,
                         with `pointer-events-none` on the layer and `auto` on the link,
                         leaving the rest of the row a disclosure target. A layer cannot
                         make room for itself, so it is the WIDE case only: below `@lg` of
                         the card it is an ordinary second row under the trigger, the same
                         way the workload card's footer does it
                         (../../components/workload/DeploymentFooter.vue). -->
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
                    <!-- Padded inside the slot: the panel is flush by contract. -->
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

          <!-- ── 3. What happened? ────────────────────────────────────────────
               The pipeline, behind a disclosure. It is the longest region on the
               page and the one you open only when the summary above is not enough
               — so it is closed by default like the settings panel, and the card is
               its own chrome: one flush accordion whose trigger names the region
               and reports the outcome, and whose panel is the step view the deploy
               flow streams (ui/DeploymentLogs.vue).

               `label=""` — the trigger one line above already names it, and the
               prop exists for exactly this case; DeploymentLogs keeps its own Logs
               row so the view switch and the wall-clock stay attached to the output
               they act on, now that the card header is a trigger and cannot hold a
               control of its own. -->
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
                  <!-- `relative` scopes the layer below to the TRIGGER ROW rather
                       than to the whole item, so the switch cannot drift onto the
                       open panel. -->
                  <div class="relative">
                    <Accordion.Trigger>
                      <span class="flex min-h-14 flex-1 items-center gap-(--spacing-sm)">
                        <span class="text-label-md text-(--text-default)">Deployment Logs</span>
                        <!-- Collapsed, this trigger is the only thing the reader sees
                           of the run, so it reports the OUTCOME. A wall-clock is a
                           MEASUREMENT, not a state — it reads as text beside the
                           name, the way the step rows report their own timings.
                           A Tag is kept for the states that are a verdict (Error,
                           Building, Queued), where the severity is the message. -->
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

                    <!-- The status / view switch, layered ONTO the trigger row left
                         of its chevron. It cannot sit INSIDE the trigger: that is a
                         `<button>`, and a SegmentedButton nested in one is invalid
                         markup the browser takes apart. As a sibling painted on top
                         it keeps its own clicks, and `pointer-events-none` on the
                         layer (with `auto` on the control) leaves every other pixel
                         of the row hitting the trigger — so the disclosure stays a
                         full-width target.

                         Hidden below `sm`: the switch is 199px and the row's content
                         box is 334px at phone width, so it cannot share a line with
                         the name — it would paint over it. The Phased view is the
                         default and keeps its per-step copy, so nothing is stranded
                         there; only the whole-log view waits for the width. -->
                    <div
                      class="pointer-events-none absolute inset-y-0 right-0 hidden items-center pr-(--spacing-md) sm:flex"
                    >
                      <div class="pointer-events-auto flex items-center">
                        <!-- Only the switch. The run's status sits on the trigger
                             beside the name, so it is never reported twice and
                             never disappears with this layer at phone width.

                             Two conditions, for two different reasons: the run has
                             SETTLED (mid-run the switch would offer a view that
                             scrolls out from under someone who is waiting), and the
                             panel is OPEN (it acts on the output, so it appears
                             with it). -->
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
                    <!-- A deployment that has not STARTED has no pipeline, and drawing
                         one is the worst thing this card can do: ten green steps under
                         the word "Queued" is a screen that contradicts itself. So it
                         says what is true and what will happen — the rows appear when
                         the run does. -->
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

                    <!-- A recorded run hands over its own pipeline. A row-shaped
                         deployment has none, so `steps` is left undefined and the view
                         falls back to the canonical pipeline — streamed live while it
                         is Building, which is the one state where an illustration of
                         the steps is still an honest answer to "where is it?". -->
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
