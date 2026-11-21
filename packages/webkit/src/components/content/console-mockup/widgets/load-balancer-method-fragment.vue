<script setup lang="ts">
  import FieldDescription from '../../../input/field/field-description/field-description.vue'
  import FieldLabel from '../../../input/field/field-label/field-label.vue'
  import NumberInput from '../../../input/number-input/number-input.vue'
  import type { MockupCursorTarget } from '../composables/use-mockup-cursor'
  import { useMockupFrames } from '../composables/use-mockup-frames'
  import { openAndPick, option } from '../lib/pick-frames'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'
  import MockupFragment from '../parts/mockup-fragment.vue'
  import MockupSelect from '../parts/mockup-select.vue'

  defineOptions({ name: 'LoadBalancerMethodFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the method is opened and IP Hash picked from its list while it is, and back after. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

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

  const REST = {
    cursor: IDLE,
    press: false,
    focused: false,
    open: false,
    highlight: -1,
    method: 'Round Robin'
  }

  const FRAMES: Frame[] = [
    { ...REST, forward: 0, back: 0 },
    ...openAndPick(
      REST,
      TRIGGER,
      [
        [0, 160, 300],
        [1, 380, 300],
        [2, 380, 420]
      ],
      { method: 'IP Hash' }
    ),
    { ...REST, cursor: option(2), focused: true, method: 'IP Hash', forward: 200, back: 260 },
    { ...REST, method: 'IP Hash', forward: 520, back: 420 }
  ]

  const { frame } = useMockupFrames(FRAMES, {
    active: () => props.active,
    hovered: () => props.hovered,
    stepOnTouch: true
  })
</script>

<template>
  <MockupFragment
    shell="legacy"
    class="[--console-mockup-fade-start:74%]"
    :active="active"
    stage-class="flex flex-col gap-(--spacing-lg) py-(--spacing-xs)"
    :cursor="frame.cursor"
    cursor-name="Jane"
    :pressed="frame.press"
  >
    <ConsoleMockupShellItem
      :order="0"
      :data-state="frame.open ? 'open' : 'closed'"
      class="relative data-[state=open]:z-1"
    >
      <div class="flex flex-col gap-(--spacing-xs)">
        <FieldLabel for="load-balancer-method">Method</FieldLabel>
        <MockupSelect
          :value="frame.method"
          :options="METHODS"
          :open="frame.open"
          :highlighted-index="frame.highlight"
          :focused="frame.focused"
          control-id="load-balancer-method"
          data-cursor="method"
          aria-label="Method"
        />
        <FieldDescription
          >Select the load balancing method to define how traffic is distributed across multiple
          origins.</FieldDescription
        >
      </div>
    </ConsoleMockupShellItem>

    <ConsoleMockupShellItem
      v-for="(field, index) in TIMEOUTS"
      :key="field.id"
      :order="index + 1"
    >
      <div class="flex flex-col gap-(--spacing-xs)">
        <FieldLabel :for="field.id">{{ field.label }}</FieldLabel>
        <NumberInput
          :id="field.id"
          :model-value="field.value"
          size="medium"
          :aria-label="field.label"
        />
        <FieldDescription>{{ field.description }}</FieldDescription>
      </div>
    </ConsoleMockupShellItem>
  </MockupFragment>
</template>
