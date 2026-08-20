<script setup>
  // DeploymentLogs — the single, reusable view of an Azion deployment's steps and
  // output, whatever kind of deployment it is. Each step is one accordion item on
  // ONE line — a status glyph, its title, its sentence and how long it took —
  // carrying its own log behind the disclosure. A flush ProgressBar on the bottom
  // edge keeps the sense of forward motion while something is still moving, and the
  // header carries the progress read (N/M steps + the step in flight), the outcome
  // and the total time.
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
  //
  // ── The anatomy changes with the state ─────────────────────────────────────
  // A deployment IN FLIGHT and a deployment that has SETTLED are asked different
  // questions, so the two rows above the steps carry different things:
  //
  //   |          | Card header (the host's, or `title`'s) | Logs row              |
  //   | -------- | ------------------------------------- | --------------------- |
  //   | running  | the live status ("Building…")          | N/M steps + the step  |
  //   |          |                                       | it is on              |
  //   | settled  | the Phased/Complete switch            | the outcome tag       |
  //
  // Nothing in the running column is a CONTROL. While a deploy is in flight the
  // question is where it is — which the step rows and the progress bar answer — and
  // the switch is about reading it afterwards: the Complete view is a log that
  // scrolls out from under someone who is waiting. So it appears only once the
  // deployment settles, either way.
  //
  // Copying is nowhere in that table, because it is not this card's control: it is
  // LogView's, pinned over the lines it copies (see `show-copy` below). Copy-all is
  // the Complete view's own button; per-step copy is each step's.
  //
  // TWO VIEWS of that output, switched once the deployment has SETTLED — a run in
  // flight only has the first one:
  //   • Phased   — the accordion above: one row per step, with its glyph and its
  //                timing, and only the step you open showing its log. The
  //                synthetic read — WHERE the deployment is, or what broke.
  //   • Complete — every revealed line of every step in one continuous LogView, in
  //                pipeline order. The raw read — what the CLI actually printed,
  //                which is what you scan when the step summary is not enough (and
  //                what you copy into a support thread — from LogView's own button).
  // The switch is a VIEW preference, not state: both views render the same lines
  // from the same model, so flipping between them never changes what is true. The
  // header's status and the progress bar are shared, because they describe the
  // deployment rather than either view of it.
  import Accordion from '@aziontech/webkit/accordion'
  import LogView from '@aziontech/webkit/log-view'
  import LogViewContent from '@aziontech/webkit/log-view-content'
  import ProgressBar from '@aziontech/webkit/progress-bar'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import Spinner from '@aziontech/webkit/spinner'
  import Tag from '@aziontech/webkit/tag'
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

  import { DEFAULT_DEPLOYMENT_STEPS, LOG_VIEWS, STEP_GAP_MS } from './deployment-steps.js'

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
    seek: { type: Number, default: 0 },
    // The heading on the header row. Empty on a surface whose own chrome already
    // names this region (ui/DeploymentFlow.vue's card header), where a second
    // heading would be the same word twice — the progress read beside it (N/M
    // steps, and the step the run is on) still renders either way.
    label: { type: String, default: 'Deployment Logs' },
    // Draw the Logs row — the label, the progress read / outcome tag, and (unless
    // `controls` is off) the switch and the wall-clock. Off leaves only the steps and
    // the progress bar, for a surface that shows a deployment as an ILLUSTRATION of
    // one rather than as a thing to operate (the home page's deploy cell). With no
    // switch there is no second view, so `phased` is the only one rendered, and the
    // per-step copy control goes with it — nothing here is for taking away.
    header: { type: Boolean, default: true },
    // Whether the Logs row carries the deployment's CONTROL and its wall-clock —
    // the Phased/Complete switch, and "Failed after 48s".
    //
    // Off on a surface whose own card header carries them instead: the deployment
    // page hoists the switch up beside the card title (where the design puts it, in
    // the row that names the card) and states the timing in the page heading.
    // Rendering either here as well would put the same control, and the same number,
    // twice on one screen. Such a host drives the view with `v-model:view`.
    controls: { type: Boolean, default: true }
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

  // The per-step feedback, as a Tag — for the two states a GLYPH cannot carry on
  // its own. A chip is spent only where the row would otherwise be ambiguous:
  //
  //   • failed  — which step broke is the whole report, so it is said in words.
  //   • skipped — a step that will never run looks, glyph-only, like one that has
  //               not run yet; "Skipped" is what separates them.
  //
  // `done`, `running` and `pending` get none. A green check already reads as
  // complete, a spinner as running, and a hollow ring as queued — so a chip beside
  // any of them is one fact twice, and a "Queued" chip on every row of a pipeline
  // that has not started is the noisiest way to say nothing has happened.
  const STEP_TAGS = {
    failed: { label: 'Failed', severity: 'danger' },
    skipped: { label: 'Skipped', severity: 'secondary' }
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

  // ── The two views ──────────────────────────────────────────────────────────
  // `phased` opens on purpose (see LOG_VIEWS in deployment-steps.js for why).
  //
  // A model rather than local state, because the SWITCH is not always rendered
  // here: a host whose card header carries it (`controls: false`) drives this with
  // `v-model:view` and renders the control beside its own title. Unbound, the model
  // is ordinary local state, so every other surface is unchanged.
  //
  // A deployment IN FLIGHT is always `phased`: no surface renders the switch until
  // the deployment settles, so nothing can move this off `phased` mid-stream.
  const view = defineModel('view', { type: String, default: 'phased' })
  const views = LOG_VIEWS

  // Every revealed line, in pipeline order, as one stream. Ids are re-keyed across
  // the whole run so LogView never sees two lines under the same id — the per-step
  // ids restart at 0 in every step.
  const allLines = computed(() =>
    linesByStep.value.flatMap((lines, step) =>
      lines.map((line) => ({ ...line, id: `${step}-${line.id}` }))
    )
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

  const elapsedLabel = computed(() => formatDuration(elapsed.value))
  const activeTitle = computed(() => stepList.value[activeStep.value]?.title ?? '')

  // How far along the pipeline is, counted in STEPS rather than log lines: "4/7
  // steps" is the answer to "where is this?", which is the first thing anyone
  // arriving at a deployment wants and the one thing neither the step rows nor the
  // progress bar state outright.
  const doneCount = computed(
    () => stepList.value.filter((_step, i) => stepStatus(i) === 'done').length
  )
  const progressLabel = computed(() => `${doneCount.value}/${stepList.value.length} steps`)

  // The deployment's wall-clock: what the caller reported, else what this view
  // measured (live) or summed from the model. Empty when neither is known — a
  // static deployment whose steps carry their own labels has no total to sum, and
  // printing "0s" for it would be a made-up number.
  const timeLabel = computed(() => {
    if (props.totalLabel) return props.totalLabel
    return props.live || totalDuration > 0 ? elapsedLabel.value : ''
  })

  // The outcome and the wall-clock. While the deployment is running this is the
  // TIME only: the step it is on is named beside the step count in the same row, and
  // printing it again here left the row saying "Build" twice.
  const outcomeLabel = computed(() => {
    const time = timeLabel.value
    if (phase.value === 'finished') return time ? `Deployed in ${time}` : 'Deployed'
    if (phase.value === 'failed') return time ? `Failed after ${time}` : 'Failed'
    return time
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
        // Everything is done. The phase flips on the SAME frame as the last log line,
        // not on a timer: `finished` is what retires the progress bar, and a bar left
        // sitting at a full 100% under a pipeline that has already finished reads as
        // a deploy still doing something. The steps then collapse to their success
        // summary a beat later, and the consumer is handed the outcome after that.
        phase.value = 'finished'
        after(500, () => {
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
    <!-- The Logs row. It names the region on the left and REPORTS on the right, and
         what it reports is a function of the state (see the table in the script):
         while the deployment runs, where it is — how many steps are behind it and
         the one it is on; once it has settled, the outcome. The two never coexist —
         a finished pipeline's step count is "10/10", the tag restated as arithmetic,
         and a running one has no outcome yet.

         Inset `--spacing-md`, the same as the accordion triggers and the LogView
         lines below it (and, since the card header shares it, as the card's own
         title): every row of this card starts on one vertical line. -->
    <div
      v-if="header"
      class="flex min-h-12 items-center justify-between gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
    >
      <p
        v-if="label"
        class="shrink-0 text-heading-xxs text-(--text-default)"
      >
        {{ label }}
      </p>

      <div class="ml-auto flex min-w-0 items-center gap-(--spacing-sm)">
        <!-- Running: the progress read. -->
        <template v-if="!settled">
          <span class="shrink-0 text-label-sm text-(--text-default)">{{ progressLabel }}</span>
          <span
            v-if="activeTitle"
            class="truncate text-label-sm text-(--text-muted)"
          >
            {{ activeTitle }}
          </span>
        </template>

        <!-- Settled: the outcome, named after the step that decided it. -->
        <Tag
          v-else-if="phase === 'finished'"
          key="finished"
          label="Completed"
          severity="success"
        />
        <Tag
          v-else
          key="failed"
          :label="failedTitle ? `Failed on ${failedTitle}` : 'Failed'"
          severity="danger"
        />

        <!-- The wall-clock and the view switch, for a surface with nowhere else to
             put them. A host that owns a card header takes them over
             (`:controls="false"`) and renders them up there, beside the card's title
             — which is where the design puts them.

             Either way they exist only once the deployment has SETTLED: mid-run the
             switch would offer a view that scrolls out from under someone who is
             waiting.

             No copy control beside the switch. Copying belongs to the LOG, and
             LogView already carries it — the Complete view's own button copies the
             whole stream, and each step in the Phased view copies its output. -->
        <template v-if="controls && settled">
          <span class="text-label-sm text-(--text-muted)">{{ outcomeLabel }}</span>
          <SegmentedButton
            v-model="view"
            :options="views"
            aria-label="Log view"
          />
        </template>
        <!-- No spinner in this row. A running deployment is always in the Phased
             view, and that view already turns one on the running STEP, beside the
             step it belongs to — plus the progress bar on the bottom edge, plus the
             status in the card header above. A fourth would make several things spin
             to say one thing. -->
      </div>
    </div>

    <!-- PHASED — one accordion item per deploy step. The running step is open and
         streams its logs; queued steps read as loading; finished steps collapse to a
         success feedback + duration. -->
    <Accordion
      v-if="view === 'phased'"
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
          <!-- No padding of its own: the trigger already carries the DS row height
               (min-h-8), and a step row that fits on one line should read at that
               height. The two lines it used to be doubled the list for no
               information — eight rows of chrome instead of eight facts. -->
          <span class="flex min-h-8 flex-1 items-center gap-(--spacing-sm)">
            <!-- Per-step status glyph — the row's whole state vocabulary, one
                 glyph per row, in the same column down the list so the pipeline
                 reads as a column of states rather than as a stack of sentences. -->
            <span class="flex size-5 shrink-0 items-center justify-center">
              <!-- Done: a filled disc, so a finished step registers as a solid
                   mark at a glance rather than as a stroke among strokes. -->
              <span
                v-if="stepStatus(i) === 'done'"
                class="flex size-4 items-center justify-center rounded-full bg-(--success)"
              >
                <i
                  class="pi pi-check text-[9px] leading-none text-(--success-contrast)"
                  aria-hidden="true"
                />
              </span>
              <i
                v-else-if="stepStatus(i) === 'failed'"
                class="pi pi-times-circle text-(--danger-contrast)"
                aria-hidden="true"
              />
              <!-- A skipped step gets a static glyph, never a spinner: nothing
                   about it is still in motion. -->
              <i
                v-else-if="stepStatus(i) === 'skipped'"
                class="pi pi-minus-circle text-(--text-muted) opacity-60"
                aria-hidden="true"
              />
              <Spinner
                v-else-if="stepStatus(i) === 'running'"
                key="running"
                class="size-4 text-(--text-default)"
              />
              <!-- Queued: a hollow ring, NOT a dimmed spinner. A spinner on every
                   queued row had the whole pipeline turning before anything had
                   started; a still ring says "waiting" without claiming motion. -->
              <span
                v-else
                class="size-3.5 rounded-full border border-dashed border-(--border-default)"
              />
            </span>

            <!-- One line per step: the title, then its sentence beside it, muted
                 and clipped. The failing step is the exception — there the
                 sentence is the reason it broke, so it wraps and reads in full. -->
            <span
              :data-state="stepStatus(i)"
              class="flex min-w-0 flex-1 items-baseline gap-(--spacing-xs) text-left data-[state=failed]:flex-wrap"
            >
              <span
                :data-state="stepStatus(i)"
                class="shrink-0 text-label-sm text-(--text-default) data-[state=pending]:text-(--text-muted) data-[state=skipped]:text-(--text-muted)"
              >
                {{ step.title }}
              </span>
              <!-- Feedback only where a glyph is not enough (failed / skipped) —
                   see STEP_TAGS. -->
              <Tag
                v-if="stepTag(i)"
                :label="stepTag(i).label"
                :severity="stepTag(i).severity"
                size="small"
              />
              <span
                :data-state="stepStatus(i)"
                class="min-w-0 truncate text-body-xs text-(--text-muted) data-[state=failed]:whitespace-normal data-[state=failed]:text-pretty data-[state=failed]:text-(--danger-contrast)"
              >
                {{ step.description }}
              </span>
            </span>

            <!-- How long the step took, once there is something honest to show. -->
            <span class="ml-auto flex shrink-0 items-center">
              <span
                v-if="durationLabel(i)"
                class="text-label-code-sm text-(--text-muted)"
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
          <!-- `show-copy` follows the SETTLED state, not just `header`: while the
               deployment is in flight there is nothing copyable anywhere on this
               card, per-step included. A step's log is still being written — copying
               it hands over a fragment that stops mid-pipeline and reads, in a
               support thread, as the whole story. Copy comes back with the outcome,
               when the log is final. -->
          <LogView
            :lines="linesByStep[i]"
            :border="false"
            :show-copy="header && settled"
            :loading="stepStatus(i) === 'pending'"
            loading-label="Waiting to start…"
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

    <!-- COMPLETE — the same lines as one continuous log, in pipeline order. No step
         chrome: the CLI's own prefixes (`[build]`, `[upload]`, …) already say which
         phase printed a line, so repeating the step title per row would only push the
         message further from the timestamp. Flush, because the card around this view
         already frames it. -->
    <LogView
      v-else
      :lines="allLines"
      :border="false"
      :show-copy="settled"
      :loading="!settled && !allLines.length"
      loading-label="Waiting to start…"
    >
      <LogViewContent>
        <template #empty>No log lines yet.</template>
      </LogViewContent>
    </LogView>

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
