<script setup lang="ts">
  import Button from '../../../action/button/button.vue'
  import Input from '../../../input/input/input.vue'
  import Select from '../../../input/select/index'
  import type { MockupCursorTarget } from '../composables/use-mockup-cursor'
  import { useMockupFrames } from '../composables/use-mockup-frames'
  import { openAndPick, option } from '../lib/pick-frames'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'
  import MockupFragment from '../parts/mockup-fragment.vue'
  import MockupSelect from '../parts/mockup-select.vue'

  defineOptions({ name: 'ImageProcessorRuleFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; Optimize Images is picked as the rule's behavior while it is, and Deliver comes back after. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const BEHAVIORS = [
    'Forward Cookies',
    'No Content (204)',
    'Optimize Images',
    'Redirect HTTP to HTTPS'
  ]

  interface Frame {
    cursor: MockupCursorTarget
    press: boolean
    focused: boolean
    open: boolean
    highlight: number
    behavior: string
    forward: number
    back: number
  }

  const IDLE: MockupCursorTarget = { key: 'behavior', x: 1.5, y: 2.2 }
  const TRIGGER: MockupCursorTarget = { key: 'behavior', x: 0.4, y: 0.6 }

  const REST = {
    cursor: IDLE,
    press: false,
    focused: false,
    open: false,
    highlight: -1,
    behavior: 'Deliver'
  }

  const FRAMES: Frame[] = [
    { ...REST, forward: 0, back: 0 },
    ...openAndPick(
      REST,
      TRIGGER,
      [
        [0, 160, 300],
        [1, 300, 260],
        [2, 380, 260]
      ],
      { behavior: 'Optimize Images' }
    ),
    {
      ...REST,
      cursor: option(2),
      focused: true,
      behavior: 'Optimize Images',
      forward: 200,
      back: 260
    }
  ]

  const { frame } = useMockupFrames(FRAMES, {
    active: () => props.active,
    hovered: () => props.hovered
  })

  const shown = (value: unknown) => String(value)
</script>

<template>
  <MockupFragment
    shell="legacy"
    class="[--console-mockup-fade-start:72%]"
    :active="active"
    stage-class="flex h-full flex-col gap-(--spacing-md) py-(--spacing-xs)"
    :cursor="frame.cursor"
    cursor-name="Priya"
    :pressed="frame.press"
  >
    <ConsoleMockupShellItem :order="0">
      <div class="flex flex-col gap-(--spacing-sm)">
        <span class="flex items-center gap-(--spacing-sm)">
          <span class="text-body-sm text-(--text-default) capitalize">if</span>
          <span class="h-0 flex-1 border-t border-dashed border-(--border-default)" />
        </span>
        <span class="grid min-w-0 grid-cols-[4fr_4fr_5fr] gap-(--spacing-xs)">
          <Input
            model-value="${uri}"
            size="medium"
            aria-label="Variable"
          />
          <Select
            model-value="matches"
            size="medium"
            :display-value="shown"
          >
            <Select.Trigger aria-label="Operator" />
          </Select>
          <Input
            model-value="\.(jpe?g|png|gif|webp)$"
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
    >
      <div class="flex flex-col gap-(--spacing-sm)">
        <span class="flex items-center gap-(--spacing-sm)">
          <span class="text-body-sm text-(--text-default) capitalize">Then</span>
          <span class="h-0 flex-1 border-t border-dashed border-(--border-default)" />
        </span>
        <span class="grid min-w-0 grid-cols-2 gap-(--spacing-xs)">
          <MockupSelect
            :value="frame.behavior"
            :options="BEHAVIORS"
            :open="frame.open"
            :highlighted-index="frame.highlight"
            :focused="frame.focused"
            side="top"
            data-cursor="behavior"
            aria-label="Behavior"
          />
        </span>
      </div>
    </ConsoleMockupShellItem>

    <ConsoleMockupShellItem :order="3">
      <span class="flex">
        <Button
          label="Add Behavior"
          variant="outline"
          size="small"
          icon="az az-circle-plus"
        />
      </span>
    </ConsoleMockupShellItem>
  </MockupFragment>
</template>
