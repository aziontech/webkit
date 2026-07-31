<script setup>
  import CardBox from '@aziontech/webkit/card-box'
  import Spinner from '@aziontech/webkit/spinner'
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

  import { DEPLOY_SPLASH_MS } from './deployment-steps.js'
  import DeploymentLogs from './DeploymentLogs.vue'

  // Drives the post-deploy "Deployment" card: a brief "cloning" splash, then the
  // live DeploymentLogs view (the shared step accordion — see deployment-steps.js
  // for the pipeline it streams). When the logs finish streaming, we hand off to the
  // success screen via `finished` — or, when the run is one that breaks, stop on the
  // failing step and hand up `failed`.
  //
  // The card is a VIEW of a deploy, never its owner. It holds no authority over
  // whether the deploy succeeded: an async run outlives this component (see
  // src/lib/deploy-runs.js), so unmounting it must not cancel anything and
  // mounting it mid-run must not rewind anything. `seek` is what makes the second
  // half true — the card picks the run up where it already is.
  const props = defineProps({
    repoOwner: { type: String, default: 'aziontech' },
    repoPath: { type: String, default: 'templates/nextjs' },
    scope: { type: String, default: 'gab-az' },
    // Which ending this run has. 'error' stops the logs on `failStep`.
    outcome: {
      type: String,
      default: 'success',
      validator: (value) => ['success', 'error'].includes(value)
    },
    // The step that breaks when `outcome` is 'error'. Defaults to the Rules Engine:
    // it is the recoverable failure (everything is built, uploaded and created, and
    // only the rules are rejected), and it is the step src/lib/deploy-runs.js names
    // in the failure it reports — see DEPLOY_ERROR there.
    failStep: { type: String, default: 'rules' },
    // Milliseconds between revealed log lines — the deploy's pace.
    interval: { type: Number, default: 200 },
    // Milliseconds already elapsed, for a run that started before this mounted.
    seek: { type: Number, default: 0 }
  })

  const emit = defineEmits(['finished', 'failed'])

  // initial (cloning splash) | live (streaming logs). A run resumed past the
  // splash goes straight to the logs — replaying "Cloning…" for a deploy that is
  // three quarters done would be a lie about where it is.
  const phase = ref(props.seek >= DEPLOY_SPLASH_MS ? 'live' : 'initial')
  const logSeek = computed(() => Math.max(0, props.seek - DEPLOY_SPLASH_MS))

  const failAt = computed(() => (props.outcome === 'error' ? props.failStep : ''))

  let splashTimer = null
  onMounted(() => {
    if (phase.value === 'live') return
    splashTimer = setTimeout(() => (phase.value = 'live'), DEPLOY_SPLASH_MS - props.seek)
  })
  onBeforeUnmount(() => {
    if (splashTimer) clearTimeout(splashTimer)
  })

  // Azion arrow mark (leftmost glyph of the wordmark) for the clone illustration.
  const azionMark =
    'M18.2868 0L0.490892 14.9821L0 17.561H2.5639L16.349 5.96141L14.1271 17.561H17.4898L20.8537 0H18.2868Z'
</script>

<template>
  <CardBox
    :padded="false"
    class="w-full"
  >
    <!-- Header: title + preparing status while cloning -->
    <template #header>
      <p class="text-heading-xs text-[var(--text-default)]">Deployment</p>
      <div
        v-if="phase === 'initial'"
        class="flex items-center gap-[var(--spacing-sm)]"
      >
        <span class="text-label-sm text-[var(--text-muted)]"> Preparing git repository </span>
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
                <i
                  class="pi pi-github text-[24px]"
                  aria-hidden="true"
                />
              </span>
              <span
                class="flex size-12 items-center justify-center rounded-[var(--shape-elements)] border border-[var(--border-selected)] bg-[var(--bg-canvas)] text-[var(--primary)]"
              >
                <svg
                  viewBox="0 0 21 18"
                  fill="currentColor"
                  class="size-6"
                >
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
            <i
              class="pi pi-github text-[length:inherit] leading-none"
              aria-hidden="true"
            />
            {{ repoOwner }}/{{ repoPath }}
          </span>
          <span class="text-[var(--text-muted)]">to</span>
          <span
            class="inline-flex items-center gap-[var(--spacing-xs)] rounded-[var(--shape-elements)] border border-[var(--border-default)] bg-[var(--bg-surface-raised)] px-[var(--spacing-xs)] py-[var(--spacing-xxs)]"
          >
            <i
              class="pi pi-github text-[length:inherit] leading-none"
              aria-hidden="true"
            />
            {{ scope }}
          </span>
        </div>
      </div>

      <!-- Live: the shared DeploymentLogs view streams the steps. -->
      <DeploymentLogs
        v-else
        live
        :interval="interval"
        :fail-at="failAt"
        :seek="logSeek"
        @finished="emit('finished')"
        @failed="(step) => emit('failed', step)"
      />
    </template>
  </CardBox>
</template>
