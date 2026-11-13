<script setup lang="ts">
  import CardBox from '@aziontech/webkit/card-box'
  import { DEPLOY_SPLASH_MS } from '@shared/ui/deployment/deployment-steps.js'
  import DeploymentLogs from '@shared/ui/deployment/DeploymentLogs.vue'
  import DeploymentLogsControls from '@shared/ui/deployment/DeploymentLogsControls.vue'
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

  import CloningAsset from './CloningAsset.vue'

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
        icon: 'ai ai-github',
        from: `${props.repoOwner}/${props.repoPath}`,
        to: props.scope
      }
  )

  const splashLabel = computed(() =>
    [
      splashModel.value.verb,
      splashModel.value.from,
      splashModel.value.to && `to ${splashModel.value.to}`
    ]
      .filter(Boolean)
      .join(' ')
  )
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
      <Transition
        mode="out-in"
        enter-active-class="animate-fade-in motion-reduce:animate-none"
        leave-active-class="animate-fade-out motion-reduce:animate-none"
      >
        <div
          v-if="phase === 'initial'"
          key="initial"
          class="flex h-60 items-center justify-center p-(--spacing-lg)"
        >
          <p
            class="sr-only"
            aria-live="polite"
          >
            {{ splashLabel }}
          </p>
          <CloningAsset
            :icon="splashModel.icon"
            :mark-class="splashModel.markClass"
          />
        </div>

        <div
          v-else
          key="live"
        >
          <DeploymentLogs
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
        </div>
      </Transition>
    </template>
  </CardBox>
</template>
