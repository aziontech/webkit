<script setup lang="ts">
  import FieldDescription from '../../../input/field/field-description/field-description.vue'
  import FieldLabel from '../../../input/field/field-label/field-label.vue'
  import type { MockupCursorTarget } from '../composables/use-mockup-cursor'
  import { useMockupFrames } from '../composables/use-mockup-frames'
  import { openAndPick, option } from '../lib/pick-frames'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'
  import MockupFragment from '../parts/mockup-fragment.vue'
  import MockupSelect from '../parts/mockup-select.vue'

  defineOptions({ name: 'DataStreamSourceFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; WAF Events is picked as the data source while it is, and Applications comes back after. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const SOURCES = ['Applications', 'Functions', 'WAF Events', 'Activity History']

  interface Frame {
    cursor: MockupCursorTarget
    press: boolean
    focused: boolean
    open: boolean
    highlight: number
    source: string
    forward: number
    back: number
  }

  const IDLE: MockupCursorTarget = { key: 'source', x: 0.66, y: -0.9 }
  const TRIGGER: MockupCursorTarget = { key: 'source', x: 0.4, y: 0.6 }

  const REST = {
    cursor: IDLE,
    press: false,
    focused: false,
    open: false,
    highlight: -1,
    source: 'Applications'
  }

  const PICKED = { ...REST, source: 'WAF Events' }

  const FRAMES: Frame[] = [
    { ...REST, forward: 0, back: 0 },
    ...openAndPick(
      REST,
      TRIGGER,
      [
        [0, 160, 300],
        [1, 320, 260],
        [2, 300, 420]
      ],
      { source: 'WAF Events' }
    ),
    { ...PICKED, cursor: option(2), focused: true, forward: 200, back: 260 },
    { ...PICKED, cursor: IDLE, forward: 420, back: 0 }
  ]

  const { frame } = useMockupFrames(FRAMES, {
    active: () => props.active,
    hovered: () => props.hovered
  })
</script>

<template>
  <MockupFragment
    shell="legacy"
    class="[--console-mockup-fade-start:72%]"
    :active="active"
    stage-class="flex h-full flex-col gap-(--spacing-lg) py-(--spacing-xs)"
    :cursor="frame.cursor"
    cursor-name="Priya"
    :pressed="frame.press"
  >
    <ConsoleMockupShellItem
      :order="0"
      :data-state="frame.open ? 'open' : 'closed'"
      class="relative data-[state=open]:z-1"
    >
      <div class="flex flex-col gap-(--spacing-xs)">
        <FieldLabel
          for="data-stream-source"
          required
          >Data Source</FieldLabel
        >
        <MockupSelect
          control-id="data-stream-source"
          :value="frame.source"
          :options="SOURCES"
          :open="frame.open"
          :highlighted-index="frame.highlight"
          :focused="frame.focused"
          data-cursor="source"
          aria-label="Data Source"
        />
        <FieldDescription
          >Represents the data source the data will be collected from.</FieldDescription
        >
      </div>
    </ConsoleMockupShellItem>

    <ConsoleMockupShellItem :order="1">
      <div class="flex flex-col gap-(--spacing-xs)">
        <FieldLabel for="data-stream-template">Template</FieldLabel>
        <MockupSelect
          control-id="data-stream-template"
          value="siem-security-fields"
          aria-label="Template"
        />
        <FieldDescription
          >Represents a preset of variables for specific sources or an open template to choose
          variables.</FieldDescription
        >
      </div>
    </ConsoleMockupShellItem>

    <ConsoleMockupShellItem :order="2">
      <div class="flex flex-col gap-(--spacing-xs)">
        <span class="text-label-md text-(--text-default)">Data Set</span>
        <FieldDescription
          >Exhibits variables that'll be sent to the connector in a JSON format.</FieldDescription
        >
      </div>
    </ConsoleMockupShellItem>
  </MockupFragment>
</template>
