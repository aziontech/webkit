<script setup lang="ts">
  import { computed, onMounted, onScopeDispose, ref, watch } from 'vue'

  import Menu from '../../../navigation/menu/index'
  import ShellMockup from '../../shell-mockup/shell-mockup.vue'
  import ShellMockupPart from '../../shell-mockup/shell-mockup-part/shell-mockup-part.vue'
  import { type MockupCursorTarget, useMockupCursor } from '../composables/use-mockup-cursor'
  import MockupCursor from '../parts/mockup-cursor.vue'

  defineOptions({ name: 'RealTimeMetricsDashboardFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the list scrolls to Secure and the WAF, then the Bot Manager, dashboard is opened while it is, and back after. */
    hover?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

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

  const LAST = FRAMES.length - 1
  const LEAD = 12

  const wanted = () => props.active && (props.hover || !canHover)

  const step = ref(reduced || !canHover ? LAST : 0)
  const frame = computed(() => FRAMES[step.value])

  const stage = ref<globalThis.HTMLElement | null>(null)
  const column = ref<globalThis.HTMLElement | null>(null)
  const anchorTop = ref(0)

  const measure = () => {
    anchorTop.value =
      column.value?.querySelector<globalThis.HTMLElement>('[data-anchor]')?.offsetTop ?? 0
  }

  const { position } = useMockupCursor(stage, () => frame.value.cursor, column)

  const scrollStyle = computed(() => ({
    translate: `0 ${frame.value.lifted ? LEAD - anchorTop.value : 0}px`
  }))

  let timer: ReturnType<typeof globalThis.setTimeout> | null = null

  const halt = () => {
    if (timer) globalThis.clearTimeout(timer)
    timer = null
  }

  const advance = () => {
    halt()
    const target = wanted() ? LAST : 0
    if (step.value === target) return
    if (reduced) {
      step.value = target
      return
    }
    measure()
    const forward = target > step.value
    const next = step.value + (forward ? 1 : -1)
    const delay = forward ? FRAMES[next].forward : FRAMES[step.value].back
    timer = globalThis.setTimeout(() => {
      step.value = next
      advance()
    }, delay)
  }

  watch(wanted, advance, { immediate: true })

  onMounted(measure)

  onScopeDispose(halt)
</script>

<template>
  <ShellMockup
    kind="bare"
    :fade="frame.lifted ? 'y' : 'bottom'"
    class="[--mockup-fade-edge:14%] [--mockup-fade-start:76%]"
    :chrome="false"
    :active="active"
    :width="420"
    :mobile-width="380"
  >
    <div
      ref="stage"
      class="relative"
    >
      <div
        ref="column"
        :style="scrollStyle"
        class="relative py-(--spacing-xs) transition-[translate] duration-slow-01 ease-productive-entrance motion-reduce:transition-none"
      >
        <Menu aria-label="Real-Time Metrics">
          <ShellMockupPart
            v-for="(group, index) in GROUPS"
            :key="group.label || 'overview'"
            :order="index"
            :data-anchor="group.label === 'Secure' || undefined"
          >
            <Menu.Group :label="group.label">
              <Menu.Item
                v-for="item in group.items"
                :key="item.id"
                :label="item.label"
                :selected="frame.selected === item.id"
                :data-cursor="item.id"
              />
            </Menu.Group>
          </ShellMockupPart>
        </Menu>
      </div>

      <MockupCursor
        name="Lucas"
        :x="position.x"
        :y="position.y"
        :pressed="frame.press"
      />
    </div>
  </ShellMockup>
</template>
