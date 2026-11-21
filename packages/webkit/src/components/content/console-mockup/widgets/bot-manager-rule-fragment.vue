<script setup lang="ts">
  import Button from '../../../action/button/button.vue'
  import Input from '../../../input/input/input.vue'
  import type { MockupCursorTarget } from '../composables/use-mockup-cursor'
  import { useMockupScrollFrames } from '../composables/use-mockup-scroll-frames'
  import { openAndPick, option } from '../lib/pick-frames'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'
  import MockupScrollColumn from '../parts/mockup-scroll-column.vue'
  import MockupSelect from '../parts/mockup-select.vue'

  defineOptions({ name: 'BotManagerRuleFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the Bot Manager function instance is picked from its list while it is, and cleared after. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const PLACEHOLDER = 'Select a Function'
  const INSTANCES = ['bot-manager-lite', 'secure-token', 'massive-redirect']

  interface Frame {
    cursor: MockupCursorTarget
    press: boolean
    lifted: boolean
    focused: boolean
    open: boolean
    highlight: number
    instance: string
    forward: number
    back: number
  }

  const IDLE: MockupCursorTarget = { key: 'instance', x: -0.35, y: -0.9 }
  const TRIGGER: MockupCursorTarget = { key: 'instance', x: 0.35, y: 0.6 }

  const REST = {
    cursor: IDLE,
    press: false,
    lifted: false,
    focused: false,
    open: false,
    highlight: -1,
    instance: PLACEHOLDER
  }

  const LIFTED = { ...REST, lifted: true }
  const PICKED = INSTANCES[0]

  const FRAMES: Frame[] = [
    { ...REST, forward: 0, back: 0 },
    ...openAndPick(
      LIFTED,
      TRIGGER,
      [
        [2, 160, 300],
        [0, 460, 420]
      ],
      { instance: PICKED },
      [
        [120, 440],
        [560, 160]
      ]
    ),
    { ...LIFTED, cursor: option(0), focused: true, instance: PICKED, forward: 200, back: 260 },
    { ...LIFTED, cursor: TRIGGER, instance: PICKED, forward: 260, back: 160 }
  ]

  const { frame, bindColumn } = useMockupScrollFrames(FRAMES, {
    active: () => props.active,
    hovered: () => props.hovered
  })
</script>

<template>
  <MockupScrollColumn
    :ref="bindColumn"
    shell="legacy"
    class="[--console-mockup-fade-edge:16%] [--console-mockup-fade-start:76%]"
    column-class="flex flex-col gap-(--spacing-md)"
    :active="active"
    :anchor="frame.lifted ? 0 : null"
    :lead="20"
    :cursor="frame.cursor"
    cursor-name="Jane"
    :pressed="frame.press"
  >
    <ConsoleMockupShellItem :order="0">
      <div class="flex flex-col gap-(--spacing-sm)">
        <span class="flex items-center gap-(--spacing-sm)">
          <span class="text-body-sm text-(--text-default)">If</span>
          <span class="h-0 flex-1 border-t border-(--border-default)" />
        </span>
        <span class="grid min-w-0 grid-cols-[5fr_4fr_3fr] gap-(--spacing-xs)">
          <MockupSelect
            value="Request Uri"
            aria-label="Variable"
          >
            <template #leading>
              <span class="text-body-sm text-(--text-muted)">$</span>
            </template>
          </MockupSelect>
          <MockupSelect
            value="starts with"
            aria-label="Operator"
          />
          <Input
            model-value="/login"
            size="medium"
            aria-label="Argument"
          />
        </span>
      </div>
    </ConsoleMockupShellItem>

    <ConsoleMockupShellItem :order="1">
      <span class="flex gap-(--spacing-xs)">
        <Button
          label="And"
          variant="outline"
          size="small"
          icon="az az-circle-plus"
        />
        <Button
          label="Or"
          variant="outline"
          size="small"
          icon="az az-circle-plus"
        />
      </span>
    </ConsoleMockupShellItem>

    <ConsoleMockupShellItem
      :order="2"
      :data-state="frame.open ? 'open' : 'closed'"
      class="relative data-[state=open]:z-1"
      data-anchor
    >
      <div class="flex flex-col gap-(--spacing-sm)">
        <span class="flex items-center gap-(--spacing-sm)">
          <span class="text-body-sm text-(--text-default)">Then</span>
          <span class="h-0 flex-1 border-t border-(--border-default)" />
        </span>
        <span class="grid min-w-0 grid-cols-2 gap-(--spacing-xs)">
          <MockupSelect
            value="Run Function"
            aria-label="Behavior"
          />
          <MockupSelect
            :value="frame.instance"
            :options="INSTANCES"
            :open="frame.open"
            :highlighted-index="frame.highlight"
            :focused="frame.focused"
            data-cursor="instance"
            aria-label="Function"
          />
        </span>
      </div>
    </ConsoleMockupShellItem>

    <ConsoleMockupShellItem :order="3">
      <Button
        label="Add Behavior"
        variant="outline"
        size="small"
        icon="az az-circle-plus"
      />
    </ConsoleMockupShellItem>
  </MockupScrollColumn>
</template>
