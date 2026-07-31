<script setup>
  // DeploymentLogs — the single, reusable view of an Azion deployment's steps and
  // output, whatever kind of deployment it is. Each step is one accordion item
  // carrying its own log, its feedback as a Tag (Complete / Failed / Skipped /
  // Queued), and how long it took. A flush ProgressBar on the bottom edge keeps
  // the sense of forward motion while something is still moving, and the header
  // carries the outcome and the total time.
  //
  // The step MODEL is the caller's (see deployment-steps.js for the template
  // deploy flow, src/lib/azion-deploys.js for the `azion deploy` pipeline the
  // deploy page renders): title, description and an optional `durationLabel` when
  // the platform reported its own timing.
  //
  // A step carries NO glyph of its own. Every row draws exactly one — the status
  // glyph below — so whatever the caller's pipeline is, its rows read the same as
  // the rows the deploy flow streams; a decorative icon beside the title was a
  // second thing in the status column's position, saying nothing about state.
  //
  // Two modes, one component:
  //   • live   — streams through the steps in order and emits `finished` / `failed`
  //              (the deploy flow, while a deployment is in progress).
  //   • static — renders a deployment that already settled elsewhere, exactly as
  //              far as it got: all the way through, stopped at `failAt` (the
  //              steps behind it never ran), or still on `activeAt`. Used by the
  //              read-only Workload deployment drawer and the deploy page.
  import Accordion from '@aziontech/webkit/accordion'
  import CopyButton from '@aziontech/webkit/copy-button'
  import LogView from '@aziontech/webkit/log-view'
  import LogViewContent from '@aziontech/webkit/log-view-content'
  import ProgressBar from '@aziontech/webkit/progress-bar'
  import Spinner from '@aziontech/webkit/spinner'
  import Tag from '@aziontech/webkit/tag'
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

  import { DEFAULT_DEPLOYMENT_STEPS, STEP_GAP_MS } from './deployment-steps.js'

  const props = defineProps({
    // Step model: [{ key, title, description, duration, durationLabel,
    // logs: [[time, message, type?]], failLogs: [[time, message]] }].
    // `failLogs` is the step's whole output when it is the one named by `failAt`,
    // and is only read in that case.
    // `durationLabel` is optional: a caller whose platform reports its own
    // timings ("122ms", "15m") passes them verbatim rather than having them
    // re-derived here.
    steps: { type: Array, default: () => DEFAULT_DEPLOYMENT_STEPS },
    // When true, stream through the steps and emit `finished`; otherwise render a
    // deployment that has already settled (its logs shown, its steps done).
    live: { type: Boolean, default: false },
    // Milliseconds between revealed log lines. Raising it is how a deploy is made
    // to take realistically long (an async run the user is meant to walk away
    // from) without inventing filler log lines.
    interval: { type: Number, default: 200 },
    // Key of the step that FAILED. Live: the run stops there and `failed` is
    // emitted. Static: the deployment is rendered as having stopped there — the
    // steps behind it read `skipped`, because they are never going to run.
    // The named step plays its `failLogs` in place of its `logs`.
    failAt: { type: String, default: '' },
    // Key of the step a STATIC deployment is currently on (ignored while live,
    // where the stream decides). What is behind it is done, what is ahead is
    // queued — so a deployment still in flight is not drawn as finished.
    activeAt: { type: String, default: '' },
    // Wall-clock of the whole deployment, when the caller knows it (the platform
    // reported it). Otherwise it is measured live, or summed from the model.
    totalLabel: { type: String, default: '' },
    // Milliseconds already elapsed when this view mounts, so a run that outlived
    // the page (see src/lib/deploy-runs.js) is picked up where it actually is
    // rather than restarted from the first line when the user comes back.
    seek: { type: Number, default: 0 }
  })

  const emit = defineEmits(['finished', 'failed'])

  // The tuples a step plays. The step named by `failAt` plays its `failLogs` — its
  // WHOLE output on that path, preamble included, and never an error tail appended
  // to the success log: a log that says "completed successfully" three lines above
  // its own error contradicts itself, which is worse than no log.
  //
  // The line TYPE is mapped here, not in the fixture, because the same sentence
  // means different things in different states. Inside a failed step nothing is a
  // milestone, so only the CLI's own `[ERROR]` marker is raised to `warning` (the
  // strongest type LogView's vocabulary carries) and every other line is plain
  // text — a green check three lines above the error would read as progress.
  //
  // A step with NO `failLogs` keeps its `logs` verbatim even when it is the one
  // that failed: a caller that resolved its own failure output before handing it
  // over (src/lib/azion-deploys.js does) has already said what that step printed.
  const tuplesFor = (step) => {
    if (step.key !== props.failAt || !step.failLogs?.length) return step.logs
    return step.failLogs.map(([time, message]) => [
      time,
      message,
      message.includes('[ERROR]') ? 'warning' : 'text'
    ])
  }

  const stepList = computed(() => props.steps.map((step) => ({ ...step, logs: tuplesFor(step) })))
  const lastIndex = computed(() => stepList.value.length - 1)
  const failIndex = computed(() =>
    props.failAt ? stepList.value.findIndex((step) => step.key === props.failAt) : -1
  )
  const activeAtIndex = props.activeAt
    ? props.steps.findIndex((step) => step.key === props.activeAt)
    : -1

  // Where a STATIC deployment stopped: the step that failed, the step it is on,
  // or (nothing named) the last one, i.e. it went all the way through.
  const settledIndex = failIndex.value !== -1 ? failIndex.value : activeAtIndex
  const staticStep = settledIndex !== -1 ? settledIndex : lastIndex.value

  // running | finished | failed. Live starts running; static is whatever the
  // caller says it settled as. `finished` and `failed` are both terminal: no
  // spinner, no progress bar.
  const phase = ref(
    props.live || activeAtIndex !== -1 ? 'running' : failIndex.value !== -1 ? 'failed' : 'finished'
  )
  const settled = computed(() => phase.value !== 'running')
  // Index of the step currently streaming (-1 before any step starts in live).
  const activeStep = ref(props.live ? -1 : staticStep)
  // How many log lines are revealed per step. Static: everything up to the step
  // it settled on; a step that never ran reveals nothing.
  const revealed = ref(
    stepList.value.map((step, i) => (props.live || i > staticStep ? 0 : step.logs.length))
  )
  // Elapsed seconds each step took while streaming (live only).
  const measured = ref(stepList.value.map(() => 0))
  // The open accordion item. Live: follows the running step. Static: the step
  // that needs reading — the failure or the one in flight — else the last.
  const openStep = ref(props.live ? null : (stepList.value[staticStep]?.key ?? null))

  const totalDuration = stepList.value.reduce((n, step) => n + (step.duration ?? 0), 0)
  const elapsed = ref(props.live ? Math.round(props.seek / 1000) : totalDuration)
  const stepStartedAt = ref(0)

  const timers = []
  const after = (ms, fn) => timers.push(setTimeout(fn, ms))

  let tick = null
  let stream = null

  const clearAll = () => {
    timers.forEach(clearTimeout)
    timers.length = 0
    if (tick) clearInterval(tick)
    if (stream) clearInterval(stream)
  }

  // done | running | failed | skipped | pending, for a given step.
  //
  // `skipped` only exists after a failure: the steps behind the broken one are
  // not "waiting", they are never going to run, and saying "Waiting…" under a
  // failed deploy reads as a flow that is still alive.
  const stepStatus = (i) => {
    if (phase.value === 'failed') {
      if (i < activeStep.value) return 'done'
      return i === activeStep.value ? 'failed' : 'skipped'
    }
    if (phase.value === 'finished' || i < activeStep.value) return 'done'
    if (i === activeStep.value && phase.value === 'running') return 'running'
    return 'pending'
  }

  // The per-step feedback, as a Tag. A running step gets none: the spinner beside
  // it already says so, and a "Running" chip next to a spinner is one fact twice.
  const STEP_TAGS = {
    done: { label: 'Complete', severity: 'success' },
    failed: { label: 'Failed', severity: 'danger' },
    skipped: { label: 'Skipped', severity: 'secondary' },
    pending: { label: 'Queued', severity: 'secondary' }
  }
  const stepTag = (i) => STEP_TAGS[stepStatus(i)] ?? null

  // Per-step elapsed, as a label. A caller whose platform reports its own timing
  // passes it verbatim (`durationLabel`: "122ms", "15m"); otherwise it is measured
  // while live and read from the model when static. Empty when there is nothing
  // honest to show — a step that never ran has no duration.
  const durationLabel = (i) => {
    const step = stepList.value[i]
    if (step.durationLabel) return step.durationLabel
    const seconds = props.live ? measured.value[i] : (step.duration ?? 0)
    return seconds > 0 ? formatDuration(seconds) : ''
  }

  // Map a step's revealed tuples onto LogView's line model: the vulnerability
  // line is a warning and the "successfully"/"finalized" milestones are success.
  // A tuple may carry its own type as a third element (the failing step's error
  // output does), which wins over the derivation.
  const toLine = ([time, message, type], i) => ({
    id: String(i),
    time,
    type:
      type ??
      (message.includes('vulnerabilit')
        ? 'warning'
        : /successfully|finalized/.test(message)
          ? 'success'
          : 'text'),
    message
  })

  const linesByStep = computed(() =>
    stepList.value.map((step, i) => step.logs.slice(0, revealed.value[i]).map(toLine))
  )

  // Overall progress across every step's log lines — feeds the bottom ProgressBar.
  const totalLines = computed(() => stepList.value.reduce((n, step) => n + step.logs.length, 0))
  const progress = computed(() => {
    if (phase.value === 'finished') return 100
    const done = revealed.value.reduce((sum, n) => sum + n, 0)
    return Math.round((done / totalLines.value) * 100)
  })

  // The failing step's own title, so the header names WHAT broke rather than
  // reporting a bare "Failed".
  const failedTitle = computed(() => stepList.value[failIndex.value]?.title ?? '')

  const formatDuration = (s) => (s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`)

  // Every revealed log line, grouped under its step title — the payload the
  // header's copy button hands to the clipboard as plain text.
  const allLogsText = computed(() =>
    stepList.value
      .map((step, i) => {
        const lines = linesByStep.value[i]
        if (!lines.length) return ''
        const body = lines.map(({ time, message }) => `[${time}] ${message}`).join('\n')
        return `## ${step.title}\n${body}`
      })
      .filter(Boolean)
      .join('\n\n')
  )

  const elapsedLabel = computed(() => formatDuration(elapsed.value))
  const activeTitle = computed(() => stepList.value[activeStep.value]?.title ?? '')

  // The deployment's wall-clock: what the caller reported, else what this view
  // measured (live) or summed from the model. Empty when neither is known — a
  // static deployment whose steps carry their own labels has no total to sum, and
  // printing "0s" for it would be a made-up number.
  const timeLabel = computed(() => {
    if (props.totalLabel) return props.totalLabel
    return props.live || totalDuration > 0 ? elapsedLabel.value : ''
  })

  const statusLabel = computed(() => {
    const time = timeLabel.value
    if (phase.value === 'finished') return time ? `Deployed in ${time}` : 'Deployed'
    if (phase.value === 'failed') return time ? `Failed after ${time}` : 'Failed'
    if (!activeTitle.value) return time
    return time ? `${activeTitle.value} · ${time}` : activeTitle.value
  })

  // Stop the deploy on the step named by `failAt`: it keeps the error output it
  // just streamed on screen and open, and hands the failure up. The steps behind
  // it never start — a broken deploy does not carry on to the next stage.
  const failOn = (i) => {
    measured.value[i] = Math.max(1, elapsed.value - stepStartedAt.value)
    phase.value = 'failed'
    emit('failed', stepList.value[i].key)
  }

  // Stream one step's log lines, then record its duration and hand off to the
  // next step (or settle the whole flow when the last step is done).
  // `from` is the line to resume at, non-zero only when picking up a run that was
  // already in progress before this view mounted (see `seek`).
  const runStep = (i, from = 0) => {
    activeStep.value = i
    openStep.value = stepList.value[i].key
    stepStartedAt.value = elapsed.value
    revealed.value[i] = from

    stream = setInterval(() => {
      if (revealed.value[i] < stepList.value[i].logs.length) {
        revealed.value[i] += 1
        return
      }

      clearInterval(stream)
      stream = null

      if (i === failIndex.value) {
        failOn(i)
        return
      }

      measured.value[i] = Math.max(1, elapsed.value - stepStartedAt.value)

      if (i + 1 < stepList.value.length) {
        after(STEP_GAP_MS, () => runStep(i + 1))
      } else {
        // Everything is done: collapse all steps to their success summary, then
        // hand off (the consumer swaps to whatever comes next).
        after(500, () => {
          phase.value = 'finished'
          openStep.value = null
        })
        after(2200, () => emit('finished'))
      }
    }, props.interval)
  }

  // Pick up a run already in flight: convert the elapsed time into the number of
  // log lines that should already be on screen, fill the steps behind it, and
  // start streaming from the line the run is actually on. Without this, coming
  // back to a page mid-deploy would rewind the logs to the first line.
  const resumeFrom = (ms) => {
    let remaining = Math.floor(ms / props.interval)

    for (let i = 0; i < stepList.value.length; i++) {
      const count = stepList.value[i].logs.length
      if (remaining < count) {
        runStep(i, remaining)
        return
      }
      revealed.value[i] = count
      measured.value[i] = stepList.value[i].duration ?? 1
      remaining -= count

      // The run is already past its failing step — settle straight into failure
      // rather than replaying steps that never ran.
      if (i === failIndex.value) {
        activeStep.value = i
        openStep.value = stepList.value[i].key
        phase.value = 'failed'
        emit('failed', stepList.value[i].key)
        return
      }
    }

    runStep(lastIndex.value, stepList.value[lastIndex.value].logs.length)
  }

  onMounted(() => {
    if (!props.live) return
    tick = setInterval(() => {
      if (phase.value === 'running') elapsed.value += 1
    }, 1000)
    if (props.seek > 0) resumeFrom(props.seek)
    else runStep(0)
  })

  onBeforeUnmount(clearAll)
</script>

<template>
  <div class="flex w-full flex-col">
    <!-- Header: label + live status / completed tag + running total time -->
    <div
      class="flex items-center justify-between gap-[var(--spacing-sm)] border-b border-[var(--border-default)] px-[var(--spacing-sm)] py-[var(--spacing-sm)]"
    >
      <p class="text-heading-xxs text-[var(--text-default)]">Deployment Logs</p>
      <div class="flex items-center gap-[var(--spacing-sm)]">
        <Tag
          v-if="phase === 'finished'"
          label="Completed"
          severity="success"
        />
        <Tag
          v-else-if="phase === 'failed'"
          :label="failedTitle ? `Failed on ${failedTitle}` : 'Failed'"
          severity="danger"
        />
        <span class="text-label-sm text-[var(--text-muted)]">{{ statusLabel }}</span>
        <Spinner
          v-if="!settled"
          class="size-4 text-[var(--text-default)]"
        />
        <!-- The logs are the evidence of a failure, so copying them matters
             more here than after a clean deploy. -->
        <CopyButton
          v-if="settled"
          :value="allLogsText"
          kind="outlined"
          aria-label="Copy all logs"
          copied-label="Logs copied"
          :disabled="!allLogsText"
        />
      </div>
    </div>

    <!-- One accordion item per deploy step. The running step is open and streams
         its logs; queued steps read as loading; finished steps collapse to a
         success feedback + duration. -->
    <Accordion
      v-model:value="openStep"
      type="single"
      collapsible
    >
      <Accordion.Item
        v-for="(step, i) in stepList"
        :key="step.key"
        :value="step.key"
      >
        <Accordion.Trigger>
          <span class="flex flex-1 items-center gap-[var(--spacing-sm)] py-[var(--spacing-xs)]">
            <!-- Per-step status glyph -->
            <span class="flex size-5 shrink-0 items-center justify-center">
              <i
                v-if="stepStatus(i) === 'done'"
                class="pi pi-check text-[var(--success-contrast)]"
                aria-hidden="true"
              />
              <i
                v-else-if="stepStatus(i) === 'failed'"
                class="pi pi-times-circle text-[var(--danger-contrast)]"
                aria-hidden="true"
              />
              <!-- A skipped step gets a static glyph, never a spinner: nothing
                   about it is still in motion. -->
              <i
                v-else-if="stepStatus(i) === 'skipped'"
                class="pi pi-minus-circle text-[var(--text-muted)] opacity-60"
                aria-hidden="true"
              />
              <Spinner
                v-else-if="stepStatus(i) === 'running'"
                key="running"
                class="size-4 text-[var(--text-default)]"
              />
              <Spinner
                v-else
                key="pending"
                class="size-4 text-[var(--text-muted)] opacity-60"
              />
            </span>

            <span class="flex min-w-0 flex-col text-left">
              <span class="flex flex-wrap items-center gap-[var(--spacing-xs)]">
                <span class="text-label-sm text-[var(--text-default)]">
                  {{ step.title }}
                </span>
                <!-- Per-step feedback is a Tag, the same vocabulary every other
                     status in the console uses. A running step has none — the
                     spinner in the glyph column already says it. -->
                <Tag
                  v-if="stepTag(i)"
                  :label="stepTag(i).label"
                  :severity="stepTag(i).severity"
                  size="small"
                />
              </span>
              <!-- On the failing step this line is the failure's reason, so it
                   wraps instead of truncating: the sentence IS the report. -->
              <span
                :data-state="stepStatus(i)"
                class="text-pretty text-body-xs text-[var(--text-muted)] data-[state=failed]:text-[var(--danger-contrast)]"
              >
                {{ step.description }}
              </span>
            </span>

            <!-- How long the step took, once there is something honest to show. -->
            <span class="ml-auto flex shrink-0 items-center">
              <span
                v-if="durationLabel(i)"
                class="text-label-code-sm text-[var(--text-muted)]"
              >
                {{ durationLabel(i) }}
              </span>
            </span>
          </span>
        </Accordion.Trigger>
        <Accordion.Content>
          <!-- Flush inside the accordion panel: the item already frames the
               region, so LogView drops its own border and radius. -->
          <!-- `loading` is reserved for a step that is genuinely still coming
               (its spinner promises lines). A skipped step is not waiting for
               anything, so it renders the empty body with a sentence that says
               why it has no output. -->
          <LogView
            :lines="linesByStep[i]"
            :border="false"
            :loading="stepStatus(i) === 'pending'"
            loading-label="Waiting to start…"
            class="h-[260px]"
          >
            <LogViewContent>
              <template #empty>
                <template v-if="stepStatus(i) === 'skipped'">
                  Never ran — the deployment stopped at
                  {{ failedTitle || 'an earlier step' }}.
                </template>
                <template v-else>No log lines yet.</template>
              </template>
            </LogViewContent>
          </LogView>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>

    <!-- Overall progress as a flush bar on the bottom edge — keeps the sense of
         forward motion regardless of which step is open. Removed once the
         deployment settles either way, since there is no more motion to convey
         (a bar frozen mid-track under a failed deploy reads as still running). -->
    <ProgressBar
      v-if="!settled"
      :value="progress"
      :max="100"
      size="small"
      shape="flat"
      class="w-full"
      aria-label="Deployment progress"
    />
  </div>
</template>
