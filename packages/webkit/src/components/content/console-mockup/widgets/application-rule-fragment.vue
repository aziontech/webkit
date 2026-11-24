<script setup lang="ts">
  import { computed } from 'vue'

  import Button from '../../../action/button/button.vue'
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import Input from '../../../input/input/input.vue'
  import Select from '../../../input/select/index'
  import type { MockupCursorTarget } from '../composables/use-mockup-cursor'
  import { useMockupFrames } from '../composables/use-mockup-frames'
  import { openAndPick, option } from '../lib/pick-frames'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'
  import MockupFragment from '../parts/mockup-fragment.vue'
  import MockupSelect from '../parts/mockup-select.vue'

  defineOptions({ name: 'ApplicationRuleFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; a second condition is added, its operator picked from the list, while it is, and taken back out after. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const VARIABLE = '${request_method}'
  const ARGUMENT = 'GET'

  const OPERATORS = ['is equal', 'is not equal', 'starts with', 'does not start with']

  interface Frame {
    cursor: MockupCursorTarget
    press: boolean
    pressed: boolean
    added: boolean
    variable: number
    focused: boolean
    open: boolean
    highlight: number
    operator: string
    argument: number
    forward: number
    back: number
  }

  const IDLE: MockupCursorTarget = { key: 'and', x: 2.6, y: 1.4 }
  const AND: MockupCursorTarget = { key: 'and', x: 0.55, y: 0.6 }
  const VARIABLE_FIELD: MockupCursorTarget = { key: 'variable', x: 0.8, y: 0.6 }
  const OPERATOR: MockupCursorTarget = { key: 'operator', x: 0.4, y: 0.6 }
  const ARGUMENT_FIELD: MockupCursorTarget = { key: 'argument', x: 0.6, y: 0.6 }

  const REST = {
    cursor: IDLE,
    press: false,
    pressed: false,
    added: false,
    variable: 0,
    focused: false,
    open: false,
    highlight: -1,
    operator: 'starts with',
    argument: 0
  }

  const TYPED = { ...REST, added: true, variable: VARIABLE.length }
  const PICKED = { ...TYPED, operator: 'is equal' }

  const FRAMES: Frame[] = [
    { ...REST, forward: 0, back: 0 },
    { ...REST, cursor: AND, forward: 120, back: 420 },
    { ...REST, cursor: AND, press: true, pressed: true, forward: 480, back: 0 },
    { ...REST, cursor: AND, pressed: true, added: true, forward: 220, back: 60 },
    { ...REST, cursor: VARIABLE_FIELD, added: true, forward: 160, back: 420 },
    { ...REST, cursor: VARIABLE_FIELD, added: true, press: true, forward: 480, back: 120 },
    ...Array.from(VARIABLE, (_, index) => ({
      ...REST,
      cursor: VARIABLE_FIELD,
      added: true,
      variable: index + 1,
      forward: index === 0 ? 160 : 45,
      back: 18
    })),
    ...openAndPick(
      TYPED,
      OPERATOR,
      [
        [2, 160, 260],
        [1, 380, 260],
        [0, 260, 300]
      ],
      { operator: 'is equal' },
      [
        [200, 420],
        [480, 160]
      ]
    ),
    { ...PICKED, cursor: option(0), focused: true, forward: 200, back: 260 },
    { ...PICKED, cursor: ARGUMENT_FIELD, forward: 220, back: 420 },
    { ...PICKED, cursor: ARGUMENT_FIELD, press: true, forward: 480, back: 120 },
    ...Array.from(ARGUMENT, (_, index) => ({
      ...PICKED,
      cursor: ARGUMENT_FIELD,
      argument: index + 1,
      forward: index === 0 ? 200 : 90,
      back: 40
    }))
  ]

  const { frame, goingBack } = useMockupFrames(FRAMES, {
    active: () => props.active,
    hovered: () => props.hovered
  })

  const pressed = computed(() => frame.value.pressed && !goingBack.value)
  const variable = computed(() => VARIABLE.slice(0, frame.value.variable))
  const argument = computed(() => ARGUMENT.slice(0, frame.value.argument))

  const shown = (value: unknown) => String(value)

  const BUTTON_RING_CLASS =
    'inline-flex rounded-(--shape-button) ring-(--ring-color) ring-offset-(--bg-surface) transition-shadow duration-fast-02 ease-productive-entrance ' +
    'data-pressed:ring-2 data-pressed:ring-offset-2 ' +
    'motion-reduce:transition-none'
</script>

<template>
  <MockupFragment
    shell="legacy"
    class="[--console-mockup-fade-start:72%]"
    :active="active"
    stage-class="flex h-full flex-col gap-(--spacing-md) py-(--spacing-xs)"
    :cursor="frame.cursor"
    cursor-name="Sam"
    :pressed="frame.press"
  >
    <div class="flex flex-col">
      <ConsoleMockupShellItem :order="0">
        <div class="flex flex-col gap-(--spacing-sm)">
          <span class="flex items-center gap-(--spacing-sm)">
            <span class="text-body-sm text-(--text-default) capitalize">if</span>
            <span class="h-0 flex-1 border-t border-dashed border-(--border-default)" />
          </span>
          <span class="grid min-w-0 grid-cols-[5fr_4fr_3fr] gap-(--spacing-xs)">
            <Input
              model-value="${uri}"
              size="medium"
              aria-label="Variable"
            />
            <Select
              model-value="starts with"
              size="medium"
              :display-value="shown"
            >
              <Select.Trigger aria-label="Operator" />
            </Select>
            <Input
              model-value="/assets/"
              size="medium"
              aria-label="Argument"
            />
          </span>
        </div>
      </ConsoleMockupShellItem>

      <Transition
        enter-from-class="-translate-y-1 opacity-0"
        enter-active-class="transition-[opacity,translate] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
        leave-to-class="-translate-y-1 opacity-0"
        leave-active-class="transition-[opacity,translate] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
      >
        <div
          v-if="frame.added"
          :data-state="frame.open ? 'open' : 'closed'"
          class="overflow-hidden [interpolate-size:allow-keywords] data-[state=open]:overflow-visible"
        >
          <div class="flex flex-col gap-(--spacing-sm) pt-(--spacing-md)">
            <span class="flex items-center gap-(--spacing-sm)">
              <span class="text-body-sm text-(--text-default) capitalize">and</span>
              <span class="h-0 flex-1 border-t border-dashed border-(--border-default)" />
              <IconButton
                icon="az az-trash"
                variant="outline"
                size="small"
                ariaLabel="Remove condition"
              />
            </span>
            <span class="grid min-w-0 grid-cols-[5fr_4fr_3fr] gap-(--spacing-xs)">
              <Input
                :model-value="variable"
                data-cursor="variable"
                size="medium"
                aria-label="Variable"
              />
              <MockupSelect
                :value="frame.operator"
                :options="OPERATORS"
                :open="frame.open"
                :highlighted-index="frame.highlight"
                :focused="frame.focused"
                data-cursor="operator"
                aria-label="Operator"
              />
              <Input
                :model-value="argument"
                data-cursor="argument"
                size="medium"
                aria-label="Argument"
              />
            </span>
          </div>
        </div>
      </Transition>
    </div>

    <ConsoleMockupShellItem :order="1">
      <span class="flex gap-(--spacing-xs)">
        <span
          data-cursor="and"
          :data-pressed="pressed || null"
          :class="BUTTON_RING_CLASS"
        >
          <Button
            label="And"
            variant="outline"
            size="small"
            icon="az az-circle-plus"
          />
        </span>
        <Button
          label="Or"
          variant="outline"
          size="small"
          icon="az az-circle-plus"
        />
      </span>
    </ConsoleMockupShellItem>

    <ConsoleMockupShellItem :order="2">
      <div class="flex flex-col gap-(--spacing-sm)">
        <span class="flex items-center gap-(--spacing-sm)">
          <span class="text-body-sm text-(--text-default) capitalize">Then</span>
          <span class="h-0 flex-1 border-t border-dashed border-(--border-default)" />
        </span>
        <span class="grid min-w-0 grid-cols-2 gap-(--spacing-xs)">
          <Select
            model-value="Set Cache Policy"
            size="medium"
            :display-value="shown"
          >
            <Select.Trigger aria-label="Behavior" />
          </Select>
          <Select
            model-value="qa-p-cache"
            size="medium"
            :display-value="shown"
          >
            <Select.Trigger aria-label="Cache Setting" />
          </Select>
        </span>
      </div>
    </ConsoleMockupShellItem>

    <ConsoleMockupShellItem
      :order="3"
      class="-mt-(--spacing-xs)"
    >
      <span class="grid min-w-0 grid-cols-2 gap-(--spacing-xs)">
        <Select
          model-value="Deliver"
          size="medium"
          :display-value="shown"
        >
          <Select.Trigger aria-label="Behavior" />
        </Select>
      </span>
    </ConsoleMockupShellItem>
  </MockupFragment>
</template>
