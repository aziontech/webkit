<script setup>
// DeploymentLogs — the single, reusable view of an Azion deploy's output. The
// deploy is broken into the sequential steps Azion runs (build, upload,
// configure application); each step is one accordion item that streams its own
// logs, shows a spinner while pending/running and a success feedback + how long
// it took once done. A flush ProgressBar on the bottom edge keeps the sense of
// forward motion, and the header carries the running total time.
//
// Two modes, one component:
//   • live   — streams through the steps in order and emits `finished`
//              (used by the deploy flow while a deployment is in progress).
//   • static — renders a completed deployment: every log shown, every step done
//              (used by the read-only Workload deployment drawer).
import Accordion from "@aziontech/webkit/accordion";
import CopyButton from "@aziontech/webkit/copy-button";
import LogView from "@aziontech/webkit/log-view";
import LogViewContent from "@aziontech/webkit/log-view-content";
import ProgressBar from "@aziontech/webkit/progress-bar";
import Spinner from "@aziontech/webkit/spinner";
import Tag from "@aziontech/webkit/tag";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

import { DEFAULT_DEPLOYMENT_STEPS } from "./deployment-steps.js";

const props = defineProps({
  // Step model: [{ key, title, description, duration, logs: [[time, message]] }].
  steps: { type: Array, default: () => DEFAULT_DEPLOYMENT_STEPS },
  // When true, stream through the steps and emit `finished`; otherwise render a
  // completed deployment (all logs shown, all steps done).
  live: { type: Boolean, default: false },
});

const emit = defineEmits(["finished"]);

const stepList = computed(() => props.steps);
const lastIndex = computed(() => stepList.value.length - 1);

// running | finished — live starts running; static is finished from the start.
const phase = ref(props.live ? "running" : "finished");
// Index of the step currently streaming (-1 before any step starts in live).
const activeStep = ref(props.live ? -1 : lastIndex.value);
// How many log lines are revealed per step.
const revealed = ref(stepList.value.map((step) => (props.live ? 0 : step.logs.length)));
// Elapsed seconds each step took while streaming (live only).
const measured = ref(stepList.value.map(() => 0));
// The open accordion item. Live: follows the running step. Static: the last.
const openStep = ref(props.live ? null : stepList.value[lastIndex.value]?.key ?? null);

const totalDuration = stepList.value.reduce((n, step) => n + (step.duration ?? 0), 0);
const elapsed = ref(props.live ? 0 : totalDuration);
const stepStartedAt = ref(0);

const timers = [];
const after = (ms, fn) => timers.push(setTimeout(fn, ms));

let tick = null;
let stream = null;

const clearAll = () => {
  timers.forEach(clearTimeout);
  timers.length = 0;
  if (tick) clearInterval(tick);
  if (stream) clearInterval(stream);
};

// pending (queued) | running (streaming) | done (finished) for a given step.
const stepStatus = (i) => {
  if (phase.value === "finished" || i < activeStep.value) return "done";
  if (i === activeStep.value && phase.value === "running") return "running";
  return "pending";
};

// Per-step elapsed: measured while live, from the step model when static.
const durationFor = (i) =>
  props.live ? measured.value[i] : (stepList.value[i].duration ?? 0);

// Map a step's revealed tuples onto LogView's line model: the vulnerability
// line is a warning and the "successfully"/"finalized" milestones are success.
const toLine = ([time, message], i) => ({
  id: String(i),
  time,
  type: message.includes("vulnerabilit")
    ? "warning"
    : /successfully|finalized/.test(message)
      ? "success"
      : "text",
  message,
});

const linesByStep = computed(() =>
  stepList.value.map((step, i) => step.logs.slice(0, revealed.value[i]).map(toLine)),
);

// Overall progress across every step's log lines — feeds the bottom ProgressBar.
const totalLines = computed(() =>
  stepList.value.reduce((n, step) => n + step.logs.length, 0),
);
const progress = computed(() => {
  if (phase.value === "finished") return 100;
  const done = revealed.value.reduce((sum, n) => sum + n, 0);
  return Math.round((done / totalLines.value) * 100);
});

const formatDuration = (s) =>
  s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`;

// Every revealed log line, grouped under its step title — the payload the
// header's copy button hands to the clipboard as plain text.
const allLogsText = computed(() =>
  stepList.value
    .map((step, i) => {
      const lines = linesByStep.value[i];
      if (!lines.length) return "";
      const body = lines.map(({ time, message }) => `[${time}] ${message}`).join("\n");
      return `## ${step.title}\n${body}`;
    })
    .filter(Boolean)
    .join("\n\n"),
);

const elapsedLabel = computed(() => formatDuration(elapsed.value));
const activeTitle = computed(() => stepList.value[activeStep.value]?.title ?? "");
const statusLabel = computed(() =>
  phase.value === "finished"
    ? `Deployed in ${elapsedLabel.value}`
    : activeTitle.value
      ? `${activeTitle.value} · ${elapsedLabel.value}`
      : elapsedLabel.value,
);

// Stream one step's log lines, then record its duration and hand off to the
// next step (or settle the whole flow when the last step is done).
const runStep = (i) => {
  activeStep.value = i;
  openStep.value = stepList.value[i].key;
  stepStartedAt.value = elapsed.value;
  revealed.value[i] = 0;

  stream = setInterval(() => {
    if (revealed.value[i] < stepList.value[i].logs.length) {
      revealed.value[i] += 1;
      return;
    }

    clearInterval(stream);
    stream = null;
    measured.value[i] = Math.max(1, elapsed.value - stepStartedAt.value);

    if (i + 1 < stepList.value.length) {
      after(450, () => runStep(i + 1));
    } else {
      // Everything is done: collapse all steps to their success summary, then
      // hand off (the consumer swaps to whatever comes next).
      after(500, () => {
        phase.value = "finished";
        openStep.value = null;
      });
      after(2200, () => emit("finished"));
    }
  }, 200);
};

onMounted(() => {
  if (!props.live) return;
  tick = setInterval(() => {
    if (phase.value !== "finished") elapsed.value += 1;
  }, 1000);
  runStep(0);
});

onBeforeUnmount(clearAll);
</script>

<template>
  <div class="flex w-full flex-col">
    <!-- Header: label + live status / completed tag + running total time -->
    <div
      class="flex items-center justify-between gap-[var(--spacing-sm)] border-b border-[var(--border-default)] px-[var(--spacing-md)] py-[var(--spacing-sm)]"
    >
      <p class="text-heading-xxs text-[var(--text-default)]">Deployment Logs</p>
      <div class="flex items-center gap-[var(--spacing-sm)]">
        <Tag v-if="phase === 'finished'" label="Completed" severity="success" />
        <span class="text-label-sm text-[var(--text-muted)]">{{ statusLabel }}</span>
        <Spinner
          v-if="phase !== 'finished'"
          class="size-4 text-[var(--text-default)]"
        />
        <CopyButton
          v-if="phase === 'finished'"
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
    <Accordion v-model:value="openStep" type="single" collapsible>
      <Accordion.Item
        v-for="(step, i) in stepList"
        :key="step.key"
        :value="step.key"
      >
        <Accordion.Trigger>
          <span
            class="flex flex-1 items-center gap-[var(--spacing-sm)] py-[var(--spacing-xs)]"
          >
            <!-- Per-step status glyph -->
            <span class="flex size-5 shrink-0 items-center justify-center">
              <i
                v-if="stepStatus(i) === 'done'"
                class="pi pi-check text-[var(--success-contrast)]"
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
              <span class="text-label-sm text-[var(--text-default)]">
                {{ step.title }}
              </span>
              <span class="truncate text-body-xs text-[var(--text-muted)]">
                {{ step.description }}
              </span>
            </span>

            <!-- Per-step feedback: elapsed time (code label) when done,
                 live/queued status otherwise -->
            <span class="ml-auto flex shrink-0 items-center">
              <span
                v-if="stepStatus(i) === 'done'"
                class="text-label-code-sm text-[var(--text-muted)]"
              >
                {{ formatDuration(durationFor(i)) }}
              </span>
              <span
                v-else-if="stepStatus(i) === 'running'"
                class="text-label-sm text-[var(--text-default)]"
              >
                Running…
              </span>
              <span v-else class="text-label-sm text-[var(--text-muted)]">
                Waiting…
              </span>
            </span>
          </span>
        </Accordion.Trigger>
        <Accordion.Content>
          <LogView
            :lines="linesByStep[i]"
            :loading="stepStatus(i) === 'pending'"
            loading-label="Waiting to start…"
            class="h-[260px]"
          >
            <LogViewContent />
          </LogView>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>

    <!-- Overall progress as a flush bar on the bottom edge — keeps the sense of
         forward motion regardless of which step is open. Removed once the
         deployment completes, since there is no more motion to convey. -->
    <ProgressBar
      v-if="phase !== 'finished'"
      :value="progress"
      :max="100"
      size="small"
      shape="flat"
      class="w-full"
      aria-label="Deployment progress"
    />
  </div>
</template>
