<script setup>
  import CardBox from '@aziontech/webkit/card-box'
  import { DEPLOY_SPLASH_MS } from '@shared/ui/deployment/deployment-steps.js'
  import DeploymentLogs from '@shared/ui/deployment/DeploymentLogs.vue'
  import DeploymentLogsControls from '@shared/ui/deployment/DeploymentLogsControls.vue'
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

  // THE PROVISIONING RUN, for any resource. A brief splash, then the live DeploymentLogs
  // view (the shared step accordion). When the logs finish streaming it hands off via
  // `finished` — or, when the run is one that breaks, stops on the failing step and hands
  // up `failed`.
  //
  // It started life as the TEMPLATE DEPLOY card and was hardcoded to that story: the
  // header said "Deployment", the splash said "Cloning <repo> to <scope>", the steps were
  // the template pipeline. Every create flow that ends in a resource chain needs this same
  // card with a different story, so those three are props now (`title`, `splash`, `steps`)
  // and their defaults reproduce the template deploy exactly — see them below.
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
    seek: { type: Number, default: 0 },
    // ── THE THREE PROPS THAT MAKE THIS CARD RESOURCE-AGNOSTIC ──────────────
    //
    // This card was a TEMPLATE DEPLOY card: its header said "Deployment", its splash said
    // "Cloning <repo> to <scope>", and its steps were the template pipeline. All three
    // were correct for the one flow that used it and wrong for every other resource that
    // now ends in a provisioning run — a workload create provisions a domain and a
    // release, and no part of that is a clone.
    //
    // So the three are props, and every default reproduces the template-deploy behaviour
    // exactly. A caller that passes none of them gets the card it always got.
    //
    // The card's name. "Deployment" for a deploy; "Provisioning" for a create that builds
    // a resource chain.
    title: { type: String, default: 'Deployment' },
    // Step model, forwarded to DeploymentLogs. `undefined` lets that component keep its
    // own default (the template pipeline), so this stays additive.
    steps: { type: Array, default: undefined },
    // The splash the card holds before the logs start: `{ verb, icon, from, to }`. Null
    // keeps the GitHub clone story built from `repoOwner` / `repoPath` / `scope` below.
    splash: { type: Object, default: null },
    // The live status beside the card name while the run is moving. It defaulted to
    // "Building" — the deploy's own vocabulary — and a workload provisioning run builds
    // nothing, so the header was narrating work the pipeline never does. No ellipsis:
    // DeploymentLogsControls adds one while loading.
    statusLabel: { type: String, default: 'Building' }
  })

  const emit = defineEmits(['finished', 'failed'])

  // initial (cloning splash) | live (streaming logs). A run resumed past the
  // splash goes straight to the logs — replaying "Cloning…" for a deploy that is
  // three quarters done would be a lie about where it is.
  const phase = ref(props.seek >= DEPLOY_SPLASH_MS ? 'live' : 'initial')
  const logSeek = computed(() => Math.max(0, props.seek - DEPLOY_SPLASH_MS))

  const failAt = computed(() => (props.outcome === 'error' ? props.failStep : ''))

  // The log view. It lives here because the SWITCH is in this card's header while
  // the lines it acts on are inside DeploymentLogs, so the view travels down as a
  // model. Copying does not travel at all — it is LogView's own control, pinned over
  // the lines inside the card.
  const logView = ref('phased')

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

  // The splash, resolved: whatever the caller described, or the clone story this card was
  // born with. One shape either way, so the template below has no branch in it.
  const splashModel = computed(
    () =>
      props.splash ?? {
        verb: 'Cloning',
        icon: 'pi pi-github',
        from: `${props.repoOwner}/${props.repoPath}`,
        to: props.scope
      }
  )

  // Azion arrow mark (leftmost glyph of the wordmark) for the splash illustration.
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
      <p class="truncate text-heading-xs text-(--text-default)">{{ title }}</p>
      <DeploymentLogsControls
        v-model:view="logView"
        :settled="settled"
        :status-label="statusLabel"
      />
    </template>

    <template #content>
      <!-- Initial: cloning illustration -->
      <div
        v-if="phase === 'initial'"
        class="flex min-h-[374px] flex-col items-center justify-center gap-(--spacing-xl) p-(--spacing-lg)"
      >
        <!-- Browser-window mock -->
        <div
          class="w-[260px] overflow-hidden rounded-(--shape-card) border border-(--primary) bg-(--bg-surface)"
        >
          <div class="flex items-center gap-(--spacing-xxs) border-b border-(--border-default)">
            <span class="size-2 rounded-full bg-(--danger)" />
            <span class="size-2 rounded-full bg-(--warning)" />
            <span class="size-2 rounded-full bg-(--success)" />
          </div>
          <div class="flex flex-col gap-(--spacing-sm) p-(--spacing-md)">
            <div class="h-3 w-3/4 rounded-(--shape-flat) bg-(--bg-surface-raised)" />
            <div class="flex items-center justify-center gap-(--spacing-lg) py-(--spacing-sm)">
              <span
                class="flex size-12 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-canvas) text-(--text-default)"
              >
                <i
                  :class="splashModel.icon"
                  class="text-[24px]"
                  aria-hidden="true"
                />
              </span>
              <span
                class="flex size-12 items-center justify-center rounded-(--shape-elements) border border-(--border-selected) bg-(--bg-canvas) text-(--primary)"
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
            <div class="h-3 w-3/4 rounded-(--shape-flat) bg-(--bg-surface-raised)" />
          </div>
        </div>

        <!-- Cloning <repo> to <scope> -->
        <div
          class="flex max-w-(--container-lg) flex-wrap items-center justify-center gap-(--spacing-xs) text-label-sm text-(--text-default)"
        >
          <span>{{ splashModel.verb }}</span>
          <span
            class="inline-flex items-center gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised) px-(--spacing-xs) py-(--spacing-xxs)"
          >
            <i
              :class="splashModel.icon"
              class="text-[length:inherit] leading-none"
              aria-hidden="true"
            />
            {{ splashModel.from }}
          </span>
          <!-- The second chip is only drawn when the story has a destination. A clone goes
               FROM a repo TO a scope; a provisioning run has one subject and no second
               half, and "Provisioning my-workload to" trailing into nothing is worse than
               no chip. -->
          <template v-if="splashModel.to">
            <span class="text-(--text-muted)">to</span>
            <span
              class="inline-flex items-center gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised) px-(--spacing-xs) py-(--spacing-xxs)"
            >
              <i
                :class="splashModel.icon"
                class="text-[length:inherit] leading-none"
                aria-hidden="true"
              />
              {{ splashModel.to }}
            </span>
          </template>
        </div>
      </div>

      <!-- Live: the shared DeploymentLogs view streams the steps. No label — the
           card header above already names this region, and a second heading
           ("Deployment Logs") under "Deployment" is one title too many. What is
           left of that row is the progress read: how many steps are done and which
           one is running, the two things the header cannot say. -->
      <!-- `label="Logs"` and `:controls="false"`: this card owns the header above, so
           the switch is rendered there (settled only), and the row below keeps the
           progress read / outcome the design gives it. -->
      <DeploymentLogs
        v-else
        v-model:view="logView"
        live
        label="Logs"
        :controls="false"
        :steps="steps"
        :interval="interval"
        :fail-at="failAt"
        :seek="logSeek"
        @finished="onFinished"
        @failed="onFailed"
      />
    </template>
  </CardBox>
</template>
