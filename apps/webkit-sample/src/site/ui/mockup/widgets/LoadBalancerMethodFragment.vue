<script setup lang="ts">
  import HelperText from '@aziontech/webkit/helper-text'
  import InputNumber from '@aziontech/webkit/input-number'
  import Label from '@aziontech/webkit/label'
  import { computed, onScopeDispose, ref, watch } from 'vue'

  import { type MockupCursorTarget, useMockupCursor } from '../composables/use-mockup-cursor'
  import MockupCursor from '../MockupCursor.vue'
  import MockupPart from '../MockupPart.vue'
  import MockupSelect from '../MockupSelect.vue'
  import ShellMockup from '../ShellMockup.vue'

  defineOptions({ name: 'LoadBalancerMethodFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the method is opened and IP Hash picked from its list while it is, and back after. */
    hover?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  const METHODS = ['Round Robin', 'Least Connections', 'IP Hash']

  const TIMEOUTS = [
    {
      id: 'load-balancer-max-retries',
      label: 'Max Retries',
      value: 3,
      description:
        'Maximum number of retry attempts for failed connections. Value 0 for no retries. Valid range: 0-20.'
    },
    {
      id: 'load-balancer-connection-timeout',
      label: 'Connection Timeout',
      value: 30,
      description:
        'Maximum time (in seconds) the Connector will wait to establish a connection with the origin. Valid range: 1-300.'
    },
    {
      id: 'load-balancer-read-write-timeout',
      label: 'Read/Write Timeout',
      value: 60,
      description:
        'Maximum time (in seconds) the Connector will wait for data to be read from or written to the origin. Valid range: 1-600.'
    }
  ]

  interface Frame {
    cursor: MockupCursorTarget
    press: boolean
    focused: boolean
    open: boolean
    highlight: number
    method: string
    forward: number
    back: number
  }

  const IDLE: MockupCursorTarget = { key: 'method', x: 0.86, y: 2.6 }
  const TRIGGER: MockupCursorTarget = { key: 'method', x: 0.4, y: 0.6 }
  const option = (index: number): MockupCursorTarget => ({ key: `option-${index}`, x: 0.3, y: 0.6 })

  const REST = {
    cursor: IDLE,
    press: false,
    focused: false,
    open: false,
    highlight: -1,
    method: 'Round Robin'
  }

  const PICKING = { ...REST, focused: true, open: true }

  const FRAMES: Frame[] = [
    { ...REST, forward: 0, back: 0 },
    { ...REST, cursor: TRIGGER, forward: 120, back: 420 },
    { ...REST, cursor: TRIGGER, press: true, focused: true, forward: 480, back: 160 },
    { ...PICKING, cursor: option(0), highlight: 0, forward: 160, back: 300 },
    { ...PICKING, cursor: option(1), highlight: 1, forward: 380, back: 300 },
    { ...PICKING, cursor: option(2), highlight: 2, forward: 380, back: 420 },
    { ...PICKING, cursor: option(2), highlight: 2, press: true, forward: 420, back: 120 },
    {
      ...PICKING,
      cursor: option(2),
      highlight: 2,
      press: true,
      method: 'IP Hash',
      forward: 120,
      back: 220
    },
    { ...REST, cursor: option(2), focused: true, method: 'IP Hash', forward: 200, back: 260 },
    { ...REST, method: 'IP Hash', forward: 520, back: 420 }
  ]

  const LAST = FRAMES.length - 1

  const wanted = () => props.active && (props.hover || !canHover)

  const step = ref(0)
  const frame = computed(() => FRAMES[step.value])

  const stage = ref<globalThis.HTMLElement | null>(null)

  const { position } = useMockupCursor(stage, () => frame.value.cursor)

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
    const forward = target > step.value
    const next = step.value + (forward ? 1 : -1)
    const delay = forward ? FRAMES[next].forward : FRAMES[step.value].back
    timer = globalThis.setTimeout(() => {
      step.value = next
      advance()
    }, delay)
  }

  watch(wanted, advance, { immediate: true })

  onScopeDispose(halt)
</script>

<template>
  <ShellMockup
    kind="bare"
    shell="legacy"
    fade="bottom"
    class="[--mockup-fade-start:74%]"
    :chrome="false"
    :active="active"
    :width="420"
    :mobile-width="380"
  >
    <div
      ref="stage"
      class="relative flex flex-col gap-(--spacing-lg) py-(--spacing-xs)"
    >
      <MockupPart
        :order="0"
        :data-open="frame.open || null"
        class="relative data-open:z-1"
      >
        <div class="flex flex-col gap-(--spacing-xs)">
          <Label
            for="load-balancer-method"
            label="Method"
          />
          <MockupSelect
            :value="frame.method"
            :options="METHODS"
            :open="frame.open"
            :highlight="frame.highlight"
            :focused="frame.focused"
            control-id="load-balancer-method"
            data-cursor="method"
            aria-label="Method"
          />
          <HelperText
            label="Select the load balancing method to define how traffic is distributed across multiple origins."
          />
        </div>
      </MockupPart>

      <MockupPart
        v-for="(field, index) in TIMEOUTS"
        :key="field.id"
        :order="index + 1"
      >
        <div class="flex flex-col gap-(--spacing-xs)">
          <Label
            :for="field.id"
            :label="field.label"
          />
          <InputNumber
            :id="field.id"
            :model-value="field.value"
            size="medium"
            :aria-label="field.label"
          />
          <HelperText :label="field.description" />
        </div>
      </MockupPart>

      <MockupCursor
        name="Ana"
        :x="position.x"
        :y="position.y"
        :pressed="frame.press"
      />
    </div>
  </ShellMockup>
</template>
