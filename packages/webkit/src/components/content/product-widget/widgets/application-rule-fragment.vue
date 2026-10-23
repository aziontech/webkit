<script setup lang="ts">
  import { computed, onScopeDispose, ref, watch } from 'vue'

  import Button from '../../../actions/button/button.vue'
  import IconButton from '../../../actions/icon-button/icon-button.vue'
  import InputText from '../../../inputs/input-text/input-text.vue'
  import Select from '../../../inputs/select/index'
  import ShellMockup from '../../shell-mockup/shell-mockup.vue'
  import ShellMockupPart from '../../shell-mockup/shell-mockup-part/shell-mockup-part.vue'
  import { type MockupCursorTarget, useMockupCursor } from '../composables/use-mockup-cursor'
  import MockupCursor from '../parts/mockup-cursor.vue'
  import MockupSelect from '../parts/mockup-select.vue'

  defineOptions({ name: 'ApplicationRuleFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; a second condition is added, its operator picked from the list, while it is, and taken back out after. */
    hover?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

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
  const option = (index: number): MockupCursorTarget => ({ key: `option-${index}`, x: 0.3, y: 0.6 })

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
  const PICKING = { ...TYPED, focused: true, open: true }
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
    { ...TYPED, cursor: OPERATOR, forward: 200, back: 420 },
    { ...TYPED, cursor: OPERATOR, press: true, focused: true, forward: 480, back: 160 },
    { ...PICKING, cursor: option(2), highlight: 2, forward: 160, back: 260 },
    { ...PICKING, cursor: option(1), highlight: 1, forward: 380, back: 260 },
    { ...PICKING, cursor: option(0), highlight: 0, forward: 260, back: 300 },
    { ...PICKING, cursor: option(0), highlight: 0, press: true, forward: 420, back: 120 },
    {
      ...PICKING,
      cursor: option(0),
      highlight: 0,
      press: true,
      operator: 'is equal',
      forward: 120,
      back: 220
    },
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

  const LAST = FRAMES.length - 1

  const wanted = () => props.active && (props.hover || !canHover)

  const step = ref(reduced || !canHover ? LAST : 0)
  const goingBack = ref(false)
  const stage = ref<globalThis.HTMLElement | null>(null)

  const frame = computed(() => FRAMES[step.value])
  const pressed = computed(() => frame.value.pressed && !goingBack.value)
  const variable = computed(() => VARIABLE.slice(0, frame.value.variable))
  const { position } = useMockupCursor(stage, () => frame.value.cursor)
  const argument = computed(() => ARGUMENT.slice(0, frame.value.argument))

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
    goingBack.value = !forward
    const next = step.value + (forward ? 1 : -1)
    const delay = forward ? FRAMES[next].forward : FRAMES[step.value].back
    timer = globalThis.setTimeout(() => {
      step.value = next
      advance()
    }, delay)
  }

  watch(wanted, advance, { immediate: true })

  onScopeDispose(halt)

  const shown = (value: unknown) => String(value)
</script>

<template>
  <ShellMockup
    kind="bare"
    shell="legacy"
    fade="bottom"
    class="[--mockup-fade-start:72%]"
    :chrome="false"
    :active="active"
    :width="420"
    :mobile-width="380"
  >
    <div
      ref="stage"
      class="relative flex h-full flex-col gap-(--spacing-md) py-(--spacing-xs)"
    >
      <div class="flex flex-col">
        <ShellMockupPart :order="0">
          <div class="flex flex-col gap-(--spacing-sm)">
            <span class="flex items-center gap-(--spacing-sm)">
              <span class="text-body-sm text-(--text-default) capitalize">if</span>
              <span class="h-0 flex-1 border-t border-dashed border-(--border-default)" />
            </span>
            <span class="grid min-w-0 grid-cols-[5fr_4fr_3fr] gap-(--spacing-xs)">
              <InputText
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
              <InputText
                model-value="/assets/"
                size="medium"
                aria-label="Argument"
              />
            </span>
          </div>
        </ShellMockupPart>

        <Transition
          enter-from-class="-translate-y-1 opacity-0"
          enter-active-class="transition-[opacity,translate] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
          leave-to-class="-translate-y-1 opacity-0"
          leave-active-class="transition-[opacity,translate] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
        >
          <div
            v-if="frame.added"
            :data-open="frame.open || null"
            class="overflow-hidden [interpolate-size:allow-keywords] data-open:overflow-visible"
          >
            <div class="flex flex-col gap-(--spacing-sm) pt-(--spacing-md)">
              <span class="flex items-center gap-(--spacing-sm)">
                <span class="text-body-sm text-(--text-default) capitalize">and</span>
                <span class="h-0 flex-1 border-t border-dashed border-(--border-default)" />
                <IconButton
                  icon="pi pi-trash"
                  kind="outlined"
                  size="small"
                  ariaLabel="Remove condition"
                />
              </span>
              <span class="grid min-w-0 grid-cols-[5fr_4fr_3fr] gap-(--spacing-xs)">
                <InputText
                  :model-value="variable"
                  data-cursor="variable"
                  size="medium"
                  aria-label="Variable"
                />
                <MockupSelect
                  :value="frame.operator"
                  :options="OPERATORS"
                  :open="frame.open"
                  :highlight="frame.highlight"
                  :focused="frame.focused"
                  data-cursor="operator"
                  aria-label="Operator"
                />
                <InputText
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

      <ShellMockupPart :order="1">
        <span class="flex gap-(--spacing-xs)">
          <span
            data-cursor="and"
            :data-pressed="pressed || null"
            class="inline-flex rounded-(--shape-button) ring-(--ring-color) ring-offset-(--bg-surface) transition-shadow duration-fast-02 ease-productive-entrance data-pressed:ring-2 data-pressed:ring-offset-2 motion-reduce:transition-none"
          >
            <Button
              label="And"
              kind="outlined"
              size="small"
              icon="pi pi-plus-circle"
            />
          </span>
          <Button
            label="Or"
            kind="outlined"
            size="small"
            icon="pi pi-plus-circle"
          />
        </span>
      </ShellMockupPart>

      <ShellMockupPart :order="2">
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
      </ShellMockupPart>

      <ShellMockupPart
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
      </ShellMockupPart>

      <MockupCursor
        name="Sam"
        :x="position.x"
        :y="position.y"
        :pressed="frame.press"
      />
    </div>
  </ShellMockup>
</template>
