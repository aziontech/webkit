<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

import CardBox from "@aziontech/webkit/card-box";
import Accordion from "@aziontech/webkit/accordion";
import LogView from "@aziontech/webkit/log-view";
import LogViewHeader from "@aziontech/webkit/log-view-header";
import LogViewContent from "@aziontech/webkit/log-view-content";
import Tag from "@aziontech/webkit/tag";
import Spinner from "@aziontech/webkit/spinner";

// Drives the post-deploy "Deployment" card through its four states
// (Figma "Deployment States"): initial -> loading -> started -> finished.
const props = defineProps({
  repoOwner: { type: String, default: "aziontech" },
  repoPath: { type: String, default: "templates/nextjs" },
  scope: { type: String, default: "gab-az" },
});

const emit = defineEmits(["finished"]);

// Mock deployment log — revealed progressively while "started", shown in full
// once "finished".
const LOGS = [
  ["13:47:33", "[TASK] - #. Deploy started successfully!"],
  ["13:47:33", "[TASK] - #. Creating Azion token!"],
  ["13:47:33", "[TASK] - #. Add to Azion CLI!"],
  ["13:47:33", "Please remember to login before running any commands: 'azion login'"],
  ["13:47:33", "Token saved in /root/.azion/default/settings.toml"],
  ["13:47:33", "This token will be used by default with all commands"],
  ["13:47:33", "[TASK] - # Current directory: vue/vue3-vite-static/"],
  ["13:47:33", "[TASK] - #. Cloning template!"],
  ["13:47:38", "[TASK] - # Build template"],
  ["13:47:47", "added 478 packages, and audited 479 packages in 9s"],
  ["13:47:47", "82 packages are looking for funding"],
  ["13:47:47", "run `npm fund` for details"],
  ["13:47:47", "24 vulnerabilities (5 low, 7 moderate, 10 high, 2 critical)"],
  ["13:47:47", "To address all issues, run:"],
  ["13:47:47", "  npm audit fix --force"],
  ["13:49:08", "create mode 100644 src/main.js"],
  ["13:49:08", "create mode 100644 src/router/index.js"],
  ["13:49:09", "branch 'main' set up to track 'origin/main'."],
  ["13:49:09", "[TASK] - #. Set Azion Personal Token in the repository."],
  ["13:49:10", "[TASK] - #. Deploy finalized successfully!"],
];

// initial | loading | started | finished
const state = ref("initial");
const elapsed = ref(0);
const revealed = ref(0);
const logSearch = ref("");

const timers = [];
const after = (ms, fn) => timers.push(setTimeout(fn, ms));
const clearAll = () => {
  timers.forEach(clearTimeout);
  timers.length = 0;
  if (tick) clearInterval(tick);
  if (stream) clearInterval(stream);
};

let tick = null;
let stream = null;

const visibleLogs = computed(() => LOGS.slice(0, revealed.value));

// Map the mock log tuples to LogView's line model: the vulnerability line is a
// warning (so LogView's header surfaces the warning count) and the
// "successfully" milestones render as success lines.
const logViewLines = computed(() =>
  visibleLogs.value.map(([time, message], i) => ({
    id: String(i),
    time,
    type: message.includes("vulnerabilit")
      ? "warning"
      : message.includes("successfully")
        ? "success"
        : "text",
    message,
  })),
);

const elapsedLabel = computed(() => {
  const s = elapsed.value;
  return s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`;
});

const headerStatus = computed(() => {
  if (state.value === "initial") return "Preparing git repository";
  return `Project started ${elapsed.value}s ago.`;
});

// Stream log lines while in the "started" phase, then settle to "finished".
const startStreaming = () => {
  stream = setInterval(() => {
    if (revealed.value < LOGS.length) {
      revealed.value += 1;
    } else {
      clearInterval(stream);
      stream = null;
      // Settle into the "Completed" state, let it breathe, then hand off to
      // the success screen.
      after(500, () => {
        state.value = "finished";
        if (tick) clearInterval(tick);
      });
      after(2200, () => emit("finished"));
    }
  }, 160);
};

onMounted(() => {
  tick = setInterval(() => (elapsed.value += 1), 1000);
  after(2500, () => (state.value = "loading"));
  after(3600, () => {
    state.value = "started";
    startStreaming();
  });
});

onBeforeUnmount(clearAll);

// Azion arrow mark (leftmost glyph of the wordmark) for the clone illustration.
const azionMark =
  "M18.2868 0L0.490892 14.9821L0 17.561H2.5639L16.349 5.96141L14.1271 17.561H17.4898L20.8537 0H18.2868Z";
</script>

<template>
  <CardBox :padded="false" class="w-full">
    <!-- Header: title + live status / completed tag -->
    <template #header>
      <p class="text-heading-xs text-[var(--text-default)]">Deployment</p>
      <div class="flex items-center gap-[var(--spacing-sm)]">
        <Tag
          v-if="state === 'finished'"
          value="Completed"
          severity="success"
        />
        <span class="text-label-sm text-[var(--text-muted)]">
          {{ state === "finished" ? elapsedLabel : headerStatus }}
        </span>
        <Spinner
          v-if="state !== 'finished'"
          class="size-4 text-[var(--text-muted)]"
        />
      </div>
    </template>

    <template #content>
      <!-- Initial: cloning illustration -->
      <div
        v-if="state === 'initial'"
        class="flex min-h-[374px] flex-col items-center justify-center gap-[var(--spacing-xl)] p-[var(--spacing-lg)]"
      >
        <!-- Browser-window mock -->
        <div
          class="w-[260px] overflow-hidden rounded-[var(--shape-card)] border border-[var(--primary)] bg-[var(--bg-surface)]"
        >
          <div
            class="flex items-center gap-[var(--spacing-xxs)] border-b border-[var(--border-default)]"
          >
            <span class="size-2 rounded-full bg-[var(--danger)]" />
            <span class="size-2 rounded-full bg-[var(--warning)]" />
            <span class="size-2 rounded-full bg-[var(--success)]" />
          </div>
          <div class="flex flex-col gap-[var(--spacing-sm)] p-[var(--spacing-md)]">
            <div class="h-3 w-3/4 rounded-[var(--shape-flat)] bg-[var(--bg-surface-raised)]" />
            <div
              class="flex items-center justify-center gap-[var(--spacing-lg)] py-[var(--spacing-sm)]"
            >
              <span
                class="flex size-12 items-center justify-center rounded-[var(--shape-elements)] border border-[var(--border-default)] bg-[var(--bg-canvas)] text-[var(--text-default)]"
              >
                <i class="pi pi-github text-[24px]" aria-hidden="true" />
              </span>
              <span
                class="flex size-12 items-center justify-center rounded-[var(--shape-elements)] border border-[var(--border-selected)] bg-[var(--bg-canvas)] text-[var(--primary)]"
              >
                <svg viewBox="0 0 21 18" fill="currentColor" class="size-6">
                  <path :d="azionMark" />
                </svg>
              </span>
            </div>
            <div class="h-3 w-3/4 rounded-[var(--shape-flat)] bg-[var(--bg-surface-raised)]" />
          </div>
        </div>

        <!-- Cloning <repo> to <scope> -->
        <div
          class="flex max-w-[var(--container-lg)] flex-wrap items-center justify-center gap-[var(--spacing-xs)] text-label-sm text-[var(--text-default)]"
        >
          <span>Cloning</span>
          <span
            class="inline-flex items-center gap-[var(--spacing-xs)] rounded-[var(--shape-elements)] border border-[var(--border-default)] bg-[var(--bg-surface-raised)] px-[var(--spacing-xs)] py-[var(--spacing-xxs)]"
          >
            <i class="pi pi-github text-[length:inherit] leading-none" aria-hidden="true" />
            {{ repoOwner }}/{{ repoPath }}
          </span>
          <span class="text-[var(--text-muted)]">to</span>
          <span
            class="inline-flex items-center gap-[var(--spacing-xs)] rounded-[var(--shape-elements)] border border-[var(--border-default)] bg-[var(--bg-surface-raised)] px-[var(--spacing-xs)] py-[var(--spacing-xxs)]"
          >
            <i class="pi pi-github text-[length:inherit] leading-none" aria-hidden="true" />
            {{ scope }}
          </span>
        </div>
      </div>

      <!-- Loading / Started / Finished: Deployment Logs in an accordion,
           rendered by the LogView component (built-in count, search, warnings
           filter, copy, timestamps and scrolling). -->
      <Accordion v-else type="single" collapsible default-value="logs">
        <Accordion.Item value="logs">
          <Accordion.Trigger> 
            <h2 class="text-label-sm text-[var(--text-muted)]">Deployment Logs</h2>
          </Accordion.Trigger>
          <Accordion.Content>
            <LogView
              v-model:search="logSearch"
              :lines="logViewLines"
              :loading="state === 'loading'"
              loading-label="Loading..."
              class="h-[360px]"
            >
              <LogViewHeader />
              <LogViewContent />
            </LogView>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </template>
  </CardBox>
</template>
