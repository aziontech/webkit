<script setup lang="ts">
  import CodeBlock from '../../../code/code-block/code-block.vue'
  import FieldDescription from '../../../input/field/field-description/field-description.vue'
  import FieldLabel from '../../../input/field/field-label/field-label.vue'
  import Input from '../../../input/input/input.vue'
  import type { MockupCursorTarget } from '../composables/use-mockup-cursor'
  import { useMockupFrames } from '../composables/use-mockup-frames'
  import { openAndPick, option } from '../lib/pick-frames'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'
  import MockupFragment from '../parts/mockup-fragment.vue'
  import MockupSelect from '../parts/mockup-select.vue'

  defineOptions({ name: 'FirewallFunctionFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the instance's function is picked from its list while it is, and back after. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const FUNCTIONS = ['qa-fn-fw', 'qa-fw02-inline-pr3882', 'qa-p-fw-fn', 'qa-qc-fwfn']

  const ARGUMENTS = [
    {
      label: 'Arguments',
      value: 'arguments',
      language: 'json',
      code: '{}'
    }
  ]

  interface Frame {
    cursor: MockupCursorTarget
    press: boolean
    focused: boolean
    open: boolean
    highlight: number
    picked: string
    forward: number
    back: number
  }

  const IDLE: MockupCursorTarget = { key: 'function', x: 0.82, y: 1.6 }
  const TRIGGER: MockupCursorTarget = { key: 'function', x: 0.35, y: 0.6 }

  const REST = {
    cursor: IDLE,
    press: false,
    focused: false,
    open: false,
    highlight: -1,
    picked: 'qa-fn-fw'
  }

  const FRAMES: Frame[] = [
    { ...REST, forward: 0, back: 0 },
    ...openAndPick(
      REST,
      TRIGGER,
      [
        [1, 160, 300],
        [3, 460, 420]
      ],
      { picked: 'qa-qc-fwfn' }
    ),
    { ...REST, cursor: option(3), focused: true, picked: 'qa-qc-fwfn', forward: 200, back: 260 },
    { ...REST, cursor: TRIGGER, picked: 'qa-qc-fwfn', forward: 260, back: 160 }
  ]

  const { frame } = useMockupFrames(FRAMES, {
    active: () => props.active,
    hovered: () => props.hovered
  })
</script>

<template>
  <MockupFragment
    shell="legacy"
    class="[--console-mockup-fade-start:78%]"
    :active="active"
    :cursor="frame.cursor"
    cursor-name="John"
    :pressed="frame.press"
  >
    <div class="relative flex flex-col gap-(--spacing-lg) py-(--spacing-xs)">
      <ConsoleMockupShellItem :order="0">
        <div class="flex flex-col gap-(--spacing-xs)">
          <FieldLabel
            for="firewall-function-name"
            required
            >Name</FieldLabel
          >
          <Input
            id="firewall-function-name"
            model-value="qa-qc-fwfi"
            size="medium"
            placeholder="My Firewall function instance"
          />
          <FieldDescription
            >Give a unique and descriptive name to identify the Firewall function
            instance.</FieldDescription
          >
        </div>
      </ConsoleMockupShellItem>

      <ConsoleMockupShellItem
        :order="1"
        :data-state="frame.open ? 'open' : 'closed'"
        class="relative data-[state=open]:z-1"
      >
        <div class="flex flex-col gap-(--spacing-xs)">
          <FieldLabel
            for="firewall-function-select"
            required
            >Function</FieldLabel
          >
          <MockupSelect
            :value="frame.picked"
            :options="FUNCTIONS"
            :open="frame.open"
            :highlighted-index="frame.highlight"
            :focused="frame.focused"
            control-id="firewall-function-select"
            data-cursor="function"
            aria-label="Function"
          />
        </div>
      </ConsoleMockupShellItem>

      <ConsoleMockupShellItem :order="2">
        <div class="flex flex-col gap-(--spacing-sm)">
          <span class="flex flex-col gap-(--spacing-2xs)">
            <span class="text-label-md text-(--text-default)">Arguments</span>
            <span class="text-body-xs text-(--text-muted)">
              Configure the function arguments to customize its behavior.
            </span>
          </span>
          <CodeBlock
            :tabs="ARGUMENTS"
            show-line-numbers
            copy-aria-label="Copy the function arguments"
          />
          <FieldDescription
            >Customize the arguments in JSON format. Once set, they can be called in code using
            event.args('arg_name').</FieldDescription
          >
        </div>
      </ConsoleMockupShellItem>
    </div>
  </MockupFragment>
</template>
