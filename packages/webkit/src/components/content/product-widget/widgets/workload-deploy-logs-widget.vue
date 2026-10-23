<script setup lang="ts">
  import { duration } from '@aziontech/theme/animations'
  import { onScopeDispose, ref, watch } from 'vue'

  import StatusIndicator from '../../../feedback/status-indicator/status-indicator.vue'
  import Divider from '../../../layout/divider/divider.vue'
  import Tag from '../../../tag/tag.vue'
  import CardBox from '../../card-box/card-box.vue'
  import ShellMockup, {
    type ShellMockupFade,
    type ShellMockupKind
  } from '../../shell-mockup/shell-mockup.vue'
  import ShellMockupPart from '../../shell-mockup/shell-mockup-part/shell-mockup-part.vue'
  import { DEFAULT_DEPLOYMENT_STEPS } from '../data/deployment-steps'
  import DeploymentLogs from '../parts/deployment-logs.vue'

  defineOptions({ name: 'WorkloadDeployLogsWidget' })

  interface Props {
    /** How the mockup is plated. */
    kind?: ShellMockupKind
    /** Draw the console bar over the body. */
    chrome?: boolean
    /** Design width of the frame from `md` up. */
    width?: number
    /** Edge the mockup fades out along. */
    fade?: ShellMockupFade
    /** Whether this widget is the one showing; the deployment streams only while it is. */
    active?: boolean
    /** Milliseconds between revealed log lines. */
    interval?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'bare',
    chrome: false,
    width: 600,
    fade: 'none',
    active: true,
    interval: 120
  })

  const STEP_KEYS = ['build', 'upload', 'application', 'rules', 'deploy']
  const STEPS = DEFAULT_DEPLOYMENT_STEPS.filter((step) => STEP_KEYS.includes(step.key))
  const SUMMARY_HOLD_MS = 4800

  const DEPLOYED = [
    { key: 'workload', icon: 'ai ai-workloads', eyebrow: 'Workload', name: 'storefront-prod' },
    {
      key: 'application',
      icon: 'ai ai-edge-application',
      eyebrow: 'Application',
      name: 'storefront'
    },
    { key: 'firewall', icon: 'ai ai-edge-firewall', eyebrow: 'Firewall', name: 'edge-rules' },
    { key: 'domains', icon: 'ai ai-domains', eyebrow: 'Domains', name: 'shop.example.com +2' }
  ]

  const rowDelay = (index: number) => ({
    transitionDelay: `${Math.round(globalThis.parseFloat(duration['fast-02']) * index)}ms`
  })

  const run = ref(0)
  const deployed = ref(false)

  let restartTimer: ReturnType<typeof setTimeout> | null = null

  const clearRestart = () => {
    if (restartTimer) clearTimeout(restartTimer)
    restartTimer = null
  }

  const restart = () => {
    clearRestart()
    deployed.value = false
    run.value += 1
  }

  const onFinished = () => {
    deployed.value = true
    restartTimer = setTimeout(restart, SUMMARY_HOLD_MS)
  }

  watch(
    () => props.active,
    (active) => {
      if (active) restart()
      else clearRestart()
    }
  )

  onScopeDispose(clearRestart)
</script>

<template>
  <ShellMockup
    :kind="kind"
    :chrome="chrome"
    :width="width"
    :fade="fade"
    :active="active"
  >
    <div class="flex h-full flex-col justify-center p-(--spacing-xs)">
      <ShellMockupPart :order="0">
        <CardBox
          :padded="false"
          class="w-full"
        >
          <template #header>
            <p class="truncate text-heading-xs text-(--text-default)">Deployment</p>
            <StatusIndicator
              :loading="!deployed"
              :severity="deployed ? 'success' : 'info'"
              :label="deployed ? 'Deployed' : 'Building'"
            />
          </template>

          <template #content>
            <Transition
              mode="out-in"
              leave-active-class="animate-fade-out motion-reduce:animate-none"
            >
              <div
                v-if="deployed"
                key="summary"
              >
                <TransitionGroup
                  appear
                  tag="ul"
                  class="m-0 flex list-none flex-col p-0"
                  enter-from-class="translate-y-2 opacity-0"
                  enter-active-class="transition-[translate,opacity] duration-slow-01 ease-expressive-entrance motion-reduce:transition-none"
                >
                  <li
                    v-for="(resource, index) in DEPLOYED"
                    :key="resource.key"
                    :style="rowDelay(index)"
                  >
                    <Divider v-if="index" />
                    <div
                      class="flex items-center gap-(--spacing-sm) px-(--spacing-md) py-(--spacing-sm)"
                    >
                      <i
                        :class="resource.icon"
                        class="shrink-0 text-body-md leading-none text-(--text-muted)"
                        aria-hidden="true"
                      />
                      <span class="flex min-w-0 flex-col">
                        <span class="truncate text-label-sm text-(--text-muted)">
                          {{ resource.eyebrow }}
                        </span>
                        <span class="truncate text-label-md text-(--text-default)">
                          {{ resource.name }}
                        </span>
                      </span>
                      <Tag
                        class="ml-auto shrink-0"
                        label="Deployed"
                        severity="success"
                        size="small"
                      />
                    </div>
                  </li>
                </TransitionGroup>
              </div>
              <div
                v-else
                key="logs"
              >
                <DeploymentLogs
                  :key="active ? run : 'idle'"
                  :live="active"
                  active-at="build"
                  label="Logs"
                  :controls="false"
                  :progress-bar="false"
                  :steps="STEPS"
                  :interval="interval"
                  @finished="onFinished"
                />
              </div>
            </Transition>
          </template>
        </CardBox>
      </ShellMockupPart>
    </div>
  </ShellMockup>
</template>
