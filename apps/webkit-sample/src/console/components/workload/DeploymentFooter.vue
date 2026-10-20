<script setup lang="ts">
  import Accordion from '@aziontech/webkit/accordion'
  import Message from '@aziontech/webkit/message'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed } from 'vue'

  import { bindingPolicyLabel, deploymentPolicyLabel } from '../../lib/data/deployment-strategies'
  import { reachLabel } from '../../lib/state/workload-settings'
  import StateMark from '../page/StateMark.vue'

  interface Props {
    setting?: Record<string, unknown>
    email?: string
    workloadId?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    setting: null,
    email: '',
    workloadId: ''
  })

  const PANEL = 'deployment-settings'

  const settingsLabel = computed(() => props.setting?.name ?? '')

  const shared = computed(() => Boolean(props.setting?.shared))

  const reach = computed(() => reachLabel(props.setting?.workloadsCount ?? 0))

  const otherWorkloads = computed(() =>
    (props.setting?.workloads ?? [])
      .filter((workload) => String(workload.id) !== String(props.workloadId))
      .map((workload) => workload.name)
  )

  const safeguard = (label, enabled) => ({
    label,
    value: enabled ? 'Enabled' : 'Disabled',
    state: Boolean(enabled),
    tone: enabled ? 'text-(--text-default)' : 'text-(--text-muted)'
  })

  const policyFields = computed(() => {
    const setting = props.setting
    if (!setting) return []
    const canary = setting.strategyDefaults?.canary
    const skew = setting.strategyDefaults?.skewProtection
    return [
      { label: 'Binding policy', value: bindingPolicyLabel(setting.bindingPolicy) },
      { label: 'Deployment policy', value: deploymentPolicyLabel(setting.deploymentPolicy) },
      safeguard('Canary', canary?.enabled),
      safeguard('Skew protection', skew?.enabled)
    ]
  })
</script>

<template>
  <Accordion
    v-if="setting"
    class="[--accordion-inset:var(--spacing-md)]"
    type="single"
    arrow-position="left"
    collapsible
  >
    <Accordion.Item
      :value="PANEL"
      class="border-b-0"
    >
      <div class="relative">
        <Accordion.Trigger :level="3">
          <span class="flex min-h-12 items-center">
            <span class="text-label-md text-(--text-default)">Deployment Settings</span>
          </span>
        </Accordion.Trigger>

        <div
          class="flex flex-wrap items-center gap-x-(--spacing-sm) gap-y-(--spacing-xxs) px-(--spacing-md) pb-(--spacing-md) @lg/band:pointer-events-none @lg/band:absolute @lg/band:inset-y-0 @lg/band:right-0 @lg/band:max-w-[calc(100%-12rem)] @lg/band:justify-end @lg/band:px-0 @lg/band:pr-(--spacing-md) @lg/band:pb-0"
        >
          <Tag
            v-if="shared"
            :label="`Shared · ${reach}`"
            severity="warning"
            size="medium"
            class="shrink-0"
          />
          <Tooltip
            class="pointer-events-auto"
            :text="`Open ${settingsLabel} in Build & Deployment settings`"
          >
            <router-link
              :to="{ path: '/account/build-deployment', query: { email } }"
              class="group/link inline-flex min-w-0 items-center gap-(--spacing-xxs) text-body-sm text-(--text-default) no-underline"
            >
              <span class="truncate underline-offset-2 group-hover/link:underline">
                {{ settingsLabel }}
              </span>
              <i
                class="pi pi-external-link shrink-0 text-body-xs leading-none"
                aria-hidden="true"
              />
            </router-link>
          </Tooltip>
        </div>
      </div>

      <Accordion.Content>
        <div
          v-if="shared"
          class="px-(--spacing-md) pt-(--spacing-xs)"
        >
          <Message
            severity="warning"
            size="small"
            :label="`Deploying with this setting also publishes to ${otherWorkloads.join(', ')}.`"
          />
        </div>

        <div
          class="grid grid-cols-1 gap-(--spacing-lg) px-(--spacing-md) pt-(--spacing-xs) pb-(--spacing-md) sm:grid-cols-2 lg:grid-cols-4"
        >
          <div
            v-for="field in policyFields"
            :key="field.label"
            class="flex min-w-0 flex-col gap-(--spacing-xxs)"
          >
            <span class="text-label-sm text-(--text-muted)">{{ field.label }}</span>
            <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
              <StateMark
                v-if="field.state !== undefined"
                :enabled="field.state"
              />
              <span
                class="truncate text-body-sm"
                :class="field.tone ?? 'text-(--text-default)'"
              >
                {{ field.value }}
              </span>
            </span>
          </div>
        </div>
      </Accordion.Content>
    </Accordion.Item>
  </Accordion>
</template>
