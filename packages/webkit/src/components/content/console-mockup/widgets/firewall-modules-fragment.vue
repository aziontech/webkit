<script setup lang="ts">
  import Tag from '../../tag/tag.vue'
  import { useMockupScrollFrames } from '../composables/use-mockup-scroll-frames'
  import { FIREWALL_MODULES } from '../lib/firewall-modules'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'
  import LegacySwitch from '../parts/legacy-switch.vue'
  import MockupScrollColumn from '../parts/mockup-scroll-column.vue'
  import ModuleSwitchCard from '../parts/module-switch-card.vue'

  defineOptions({ name: 'FirewallModulesFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; Network Shield and then Web Application Firewall are switched on while it is, and back off after. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  interface Frame {
    scrolled: boolean
    network: boolean
    waf: boolean
    forward: number
    back: number
  }

  const FRAMES: Frame[] = [
    { scrolled: false, network: false, waf: false, forward: 0, back: 0 },
    { scrolled: true, network: false, waf: false, forward: 200, back: 420 },
    { scrolled: true, network: true, waf: false, forward: 700, back: 420 },
    { scrolled: true, network: true, waf: true, forward: 520, back: 360 }
  ]

  const { frame, bindColumn } = useMockupScrollFrames(FRAMES, {
    active: () => props.active,
    hovered: () => props.hovered,
    stepOnTouch: true
  })

  const enabled = (key: string) => {
    if (key === 'network-shield') return frame.value.network
    if (key === 'waf') return frame.value.waf
    return true
  }
</script>

<template>
  <MockupScrollColumn
    :ref="bindColumn"
    shell="legacy"
    class="[--console-mockup-fade-edge:16%] [--console-mockup-fade-start:74%]"
    column-class="flex flex-col gap-(--spacing-sm)"
    :active="active"
    :anchor="frame.scrolled ? 0 : null"
    :lead="28"
    observe
  >
    <span class="text-label-md text-(--text-default)">Modules</span>

    <ConsoleMockupShellItem
      v-for="(module, index) in FIREWALL_MODULES"
      :key="module.key"
      :order="index"
      :data-anchor="module.key === 'network-shield' || undefined"
    >
      <ModuleSwitchCard
        :title="module.title"
        :description="module.description"
        :checked="enabled(module.key)"
        :disabled="module.locked"
      >
        <span
          v-if="module.locked"
          class="mt-(--spacing-xs) flex"
        >
          <Tag
            label="Automatically enabled in all accounts"
            icon="az az-lock"
            severity="info"
            size="small"
          />
        </span>
      </ModuleSwitchCard>
    </ConsoleMockupShellItem>

    <span class="mt-(--spacing-sm) text-label-md text-(--text-default)">Debug Rules</span>
    <span class="flex items-start gap-(--spacing-sm)">
      <LegacySwitch :checked="true" />
      <span class="flex min-w-0 flex-col gap-(--spacing-2xs)">
        <span class="text-label-md text-(--text-default)">Active</span>
        <span class="text-body-xs text-(--text-muted)">
          Rules that were successfully executed will be shown under the $traceback field in Data
          Streaming and Real-Time Events or the $stacktrace variable in GraphQL.
        </span>
      </span>
    </span>
  </MockupScrollColumn>
</template>
