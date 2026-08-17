<script setup>
  import CardBox from '@aziontech/webkit/card-box'
  import { DEPLOY_SPLASH_MS } from '@shared/ui/deployment/deployment-steps.js'
  import DeploymentLogs from '@shared/ui/deployment/DeploymentLogs.vue'
  import DeploymentLogsControls from '@shared/ui/deployment/DeploymentLogsControls.vue'
  import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'

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

  // The log view, and the payload the header's copy control hands over. Both live
  // here because the CONTROLS are in this card's header while the lines they act on
  // are inside DeploymentLogs: the view travels down as a model, the text comes back
  // up through the exposed `logsText`. Empty during the cloning splash, when there is
  // no logs component mounted yet — which is also a run that has not settled, so the
  // header is showing its status and no copy control at all.
  const logView = ref('phased')
  const logsRef = useTemplateRef('logsRef')
  const logsText = computed(() => logsRef.value?.logsText ?? '')

  // Whether the run this card is watching has stopped moving. It is a VIEW flag,
  // not the outcome: the run's authority stays in src/lib/deploy-runs.js. All it
  // does is retire the header spinner, since a settled deploy has no motion left
  // to convey (the logs below carry which way it settled).
  const settled = ref(false)
  const onFinished = () => {
    settled.value = true
    emit('finished')
  }
  const onFailed = (step) => {
    settled.value = true
    emit('failed', step)
  }

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
    <!-- Header: the card's name on the left, and on the right whatever the state
         puts there — the live status while it deploys, the log controls once it has
         settled (ui/DeploymentLogsControls.vue, shared with the deployment page).
         What STEP it is on, and how many are done, belong to the row below, which
         names both; repeating either here would be the same fact twice.
         No glyph: the card says "Deployment" and the rows under it are the
         deployment. A decorative cloud beside that word was the only thing on this
         card that did not report on the run. -->
    <template #header>
      <p class="truncate text-heading-xs text-[var(--text-default)]">Deployment</p>
      <DeploymentLogsControls
        v-model:view="logView"
        :settled="settled"
        :logs-text="logsText"
      />
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

      <!-- Live: the shared DeploymentLogs view streams the steps. No label — the
           card header above already names this region, and a second heading
           ("Deployment Logs") under "Deployment" is one title too many. What is
           left of that row is the progress read: how many steps are done and which
           one is running, the two things the header cannot say. -->
      <!-- `label="Logs"` and `:controls="false"`: this card owns the header above, so
           the switch and the copy are rendered there (settled only), and the row
           below keeps the progress read / outcome the design gives it. -->
      <DeploymentLogs
        v-else
        ref="logsRef"
        v-model:view="logView"
        live
        label="Logs"
        :controls="false"
        :interval="interval"
        :fail-at="failAt"
        :seek="logSeek"
        @finished="onFinished"
        @failed="onFailed"
      />
    </template>
  </CardBox>
</template>
