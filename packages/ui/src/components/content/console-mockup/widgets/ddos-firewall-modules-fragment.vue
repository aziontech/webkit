<script setup lang="ts">
  import Tag from '../../tag/tag.vue'
  import type { MockupCursorTarget } from '../composables/use-mockup-cursor'
  import { useMockupScrollFrames } from '../composables/use-mockup-scroll-frames'
  import { FIREWALL_MODULES } from '../lib/firewall-modules'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'
  import MockupScrollColumn from '../parts/mockup-scroll-column.vue'
  import ModuleSwitchCard from '../parts/module-switch-card.vue'

  defineOptions({ name: 'DdosFirewallModulesFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the modules scroll to Network Shield, which is switched on beside the always-on DDoS module while it is, and back off after. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  interface Frame {
    cursor: MockupCursorTarget
    press: boolean
    shield: boolean
    anchor: number
    forward: number
    back: number
  }

  const IDLE: MockupCursorTarget = { key: 'ddos', x: 8, y: 3 }
  const SWITCH: MockupCursorTarget = { key: 'network-shield', x: 0.6, y: 0.6 }

  const REST = { cursor: IDLE, press: false, shield: false, anchor: 0 }
  const SCROLLED = { ...REST, anchor: 1 }

  const FRAMES: Frame[] = [
    { ...REST, forward: 0, back: 0 },
    { ...SCROLLED, forward: 160, back: 420 },
    { ...SCROLLED, cursor: SWITCH, forward: 650, back: 420 },
    { ...SCROLLED, cursor: SWITCH, press: true, forward: 520, back: 120 },
    { ...SCROLLED, cursor: SWITCH, press: true, shield: true, forward: 120, back: 160 },
    { ...SCROLLED, cursor: SWITCH, shield: true, forward: 160, back: 120 }
  ]

  const { frame, bindColumn } = useMockupScrollFrames(FRAMES, {
    active: () => props.active,
    hovered: () => props.hovered,
    stepOnTouch: true
  })

  const enabled = (key: string) =>
    key === 'network-shield' ? frame.value.shield : key !== 'functions'
</script>

<template>
  <MockupScrollColumn
    :ref="bindColumn"
    shell="legacy"
    class="[--console-mockup-fade-edge:18%] [--console-mockup-fade-start:78%]"
    column-class="flex flex-col gap-(--spacing-sm)"
    :active="active"
    :anchor="frame.anchor || null"
    :lead="28"
    observe
    :cursor="frame.cursor"
    cursor-name="Alex"
    :pressed="frame.press"
  >
    <span class="text-label-md text-(--text-default)">Modules</span>

    <ConsoleMockupShellItem
      v-for="(module, index) in FIREWALL_MODULES"
      :key="module.key"
      :order="index"
      data-anchor
    >
      <ModuleSwitchCard
        :title="module.title"
        :description="module.description"
        :checked="enabled(module.key)"
        :disabled="module.locked"
        :cursor-key="module.key"
        :data-locked="module.locked || null"
        class="data-locked:border-[color-mix(in_srgb,var(--primary)_40%,transparent)]"
      >
        <span
          v-if="module.locked"
          class="mt-(--spacing-xs) flex"
        >
          <Tag
            label="Automatically enabled in all accounts"
            icon="az az-lock"
            severity="neutral"
            size="small"
          />
        </span>
      </ModuleSwitchCard>
    </ConsoleMockupShellItem>
  </MockupScrollColumn>
</template>
