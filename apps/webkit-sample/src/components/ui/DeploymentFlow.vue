<script setup>
import CardBox from "@aziontech/webkit/card-box";
import Spinner from "@aziontech/webkit/spinner";
import { onBeforeUnmount, onMounted, ref } from "vue";

import DeploymentLogs from "./DeploymentLogs.vue";

// Drives the post-deploy "Deployment" card: a brief "cloning" splash, then the
// live DeploymentLogs view (the shared 3-step accordion). When the logs finish
// streaming, we hand off to the success screen via `finished`.
defineProps({
  repoOwner: { type: String, default: "aziontech" },
  repoPath: { type: String, default: "templates/nextjs" },
  scope: { type: String, default: "gab-az" },
});

const emit = defineEmits(["finished"]);

// initial (cloning splash) | live (streaming logs)
const phase = ref("initial");

let splashTimer = null;
onMounted(() => {
  splashTimer = setTimeout(() => (phase.value = "live"), 2400);
});
onBeforeUnmount(() => {
  if (splashTimer) clearTimeout(splashTimer);
});

// Azion arrow mark (leftmost glyph of the wordmark) for the clone illustration.
const azionMark =
  "M18.2868 0L0.490892 14.9821L0 17.561H2.5639L16.349 5.96141L14.1271 17.561H17.4898L20.8537 0H18.2868Z";
</script>

<template>
  <CardBox :padded="false" class="w-full">
    <!-- Header: title + preparing status while cloning -->
    <template #header>
      <p class="text-heading-xs text-[var(--text-default)]">Deployment</p>
      <div
        v-if="phase === 'initial'"
        class="flex items-center gap-[var(--spacing-sm)]"
      >
        <span class="text-label-sm text-[var(--text-muted)]">
          Preparing git repository
        </span>
        <Spinner class="size-4 text-[var(--text-muted)]" />
      </div>
    </template>

    <template #content>
      <!-- Initial: cloning illustration -->
      <div
        v-if="phase === 'initial'"
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

      <!-- Live: the shared DeploymentLogs view streams the steps. -->
      <DeploymentLogs v-else live @finished="emit('finished')" />
    </template>
  </CardBox>
</template>
