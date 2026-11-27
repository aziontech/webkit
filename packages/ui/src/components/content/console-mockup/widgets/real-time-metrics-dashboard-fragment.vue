<script setup lang="ts">
  import SidebarMenu from '../../../navigation/sidebar-menu/index'
  import type { MockupCursorTarget } from '../composables/use-mockup-cursor'
  import { useMockupScrollFrames } from '../composables/use-mockup-scroll-frames'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'
  import MockupScrollColumn from '../parts/mockup-scroll-column.vue'

  defineOptions({ name: 'RealTimeMetricsDashboardFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the list scrolls to Secure and the WAF, then the Bot Manager, dashboard is opened while it is, and back after. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const GROUPS = [
    { label: '', items: [{ id: 'overview', label: 'Overview' }] },
    {
      label: 'Build',
      items: [
        { id: 'applications', label: 'Applications' },
        { id: 'tiered-cache', label: 'Tiered Cache' },
        { id: 'functions', label: 'Functions' },
        { id: 'image-processor', label: 'Image Processor' }
      ]
    },
    {
      label: 'Secure',
      items: [
        { id: 'waf', label: 'WAF' },
        { id: 'firewall', label: 'Firewall' },
        { id: 'dns', label: 'DNS' },
        { id: 'bot-manager', label: 'Bot Manager' }
      ]
    },
    { label: 'Observe', items: [{ id: 'data-stream', label: 'Data Stream' }] }
  ]

  interface Frame {
    cursor: MockupCursorTarget
    press: boolean
    lifted: boolean
    selected: string
    forward: number
    back: number
  }

  const IDLE: MockupCursorTarget = { key: 'overview', x: 0.78, y: 0.7 }
  const row = (key: string): MockupCursorTarget => ({ key, x: 0.22, y: 0.6 })

  const REST = { cursor: IDLE, press: false, lifted: false, selected: 'overview' }
  const LIFTED = { ...REST, lifted: true }

  const FRAMES: Frame[] = [
    { ...REST, forward: 0, back: 0 },
    { ...LIFTED, forward: 160, back: 420 },
    { ...LIFTED, cursor: row('waf'), forward: 520, back: 420 },
    { ...LIFTED, cursor: row('waf'), press: true, forward: 420, back: 120 },
    { ...LIFTED, cursor: row('waf'), press: true, selected: 'waf', forward: 120, back: 160 },
    { ...LIFTED, cursor: row('waf'), selected: 'waf', forward: 160, back: 120 },
    { ...LIFTED, cursor: row('bot-manager'), selected: 'waf', forward: 760, back: 420 },
    {
      ...LIFTED,
      cursor: row('bot-manager'),
      press: true,
      selected: 'waf',
      forward: 420,
      back: 120
    },
    {
      ...LIFTED,
      cursor: row('bot-manager'),
      press: true,
      selected: 'bot-manager',
      forward: 120,
      back: 160
    },
    { ...LIFTED, cursor: row('bot-manager'), selected: 'bot-manager', forward: 160, back: 120 }
  ]

  const { frame, bindColumn } = useMockupScrollFrames(FRAMES, {
    active: () => props.active,
    hovered: () => props.hovered
  })
</script>

<template>
  <MockupScrollColumn
    :ref="bindColumn"
    class="[--console-mockup-fade-edge:14%] [--console-mockup-fade-start:76%]"
    :active="active"
    :anchor="frame.lifted ? 0 : null"
    :lead="12"
    :cursor="frame.cursor"
    cursor-name="John"
    :pressed="frame.press"
  >
    <SidebarMenu aria-label="Real-Time Metrics">
      <ConsoleMockupShellItem
        v-for="(group, index) in GROUPS"
        :key="group.label || 'overview'"
        :order="index"
        :data-anchor="group.label === 'Secure' || undefined"
      >
        <SidebarMenu.Group :label="group.label">
          <SidebarMenu.Item
            v-for="item in group.items"
            :key="item.id"
            :label="item.label"
            :active="frame.selected === item.id"
            :data-cursor="item.id"
          />
        </SidebarMenu.Group>
      </ConsoleMockupShellItem>
    </SidebarMenu>
  </MockupScrollColumn>
</template>
