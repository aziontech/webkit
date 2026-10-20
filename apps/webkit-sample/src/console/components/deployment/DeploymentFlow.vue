<script setup lang="ts">
  import CardBox from '@aziontech/webkit/card-box'
  import { DEPLOY_SPLASH_MS } from '@shared/ui/deployment/deployment-steps.js'
  import DeploymentLogs from '@shared/ui/deployment/DeploymentLogs.vue'
  import DeploymentLogsControls from '@shared/ui/deployment/DeploymentLogsControls.vue'
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

  interface Props {
    repoOwner?: string
    repoPath?: string
    scope?: string
    outcome?: 'success' | 'error'
    failStep?: string
    interval?: number
    seek?: number
    title?: string
    steps?: unknown[]
    splash?: Record<string, unknown>
    statusLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    repoOwner: 'aziontech',
    repoPath: 'templates/nextjs',
    scope: 'gab-az',
    outcome: 'success',
    failStep: 'rules',
    interval: 200,
    seek: 0,
    title: 'Deployment',
    splash: null,
    statusLabel: 'Building'
  })

  const emit = defineEmits<{
    finished: []
    failed: [step: unknown]
  }>()

  const phase = ref(props.seek >= DEPLOY_SPLASH_MS ? 'live' : 'initial')
  const logSeek = computed(() => Math.max(0, props.seek - DEPLOY_SPLASH_MS))

  const failAt = computed(() => (props.outcome === 'error' ? props.failStep : ''))

  const logView = ref('phased')

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

  const splashModel = computed(
    () =>
      props.splash ?? {
        verb: 'Cloning',
        icon: 'pi pi-github',
        from: `${props.repoOwner}/${props.repoPath}`,
        to: props.scope
      }
  )

  const azionMark =
    'M18.2868 0L0.490892 14.9821L0 17.561H2.5639L16.349 5.96141L14.1271 17.561H17.4898L20.8537 0H18.2868Z'
</script>

<template>
  <CardBox
    :padded="false"
    class="w-full"
  >
    <template #header>
      <p class="truncate text-heading-xs text-(--text-default)">{{ title }}</p>
      <DeploymentLogsControls
        v-model:view="logView"
        :settled="settled"
        :status-label="statusLabel"
      />
    </template>

    <template #content>
      <div
        v-if="phase === 'initial'"
        class="flex min-h-(--size-96) flex-col items-center justify-center gap-(--spacing-xl) p-(--spacing-lg)"
      >
        <div
          class="w-(--size-64) overflow-hidden rounded-(--shape-card) border border-(--primary) bg-(--bg-surface)"
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
                  class="text-body-lg"
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
