<script setup lang="ts">
  import CodeBlock from '@aziontech/webkit/code-block'
  import HelperText from '@aziontech/webkit/helper-text'
  import InputText from '@aziontech/webkit/input-text'
  import Label from '@aziontech/webkit/label'
  import { computed, onScopeDispose, ref, watch } from 'vue'

  import { type MockupCursorTarget, useMockupCursor } from '../composables/use-mockup-cursor'
  import MockupCursor from '../MockupCursor.vue'
  import MockupPart from '../MockupPart.vue'
  import MockupSelect from '../MockupSelect.vue'
  import ShellMockup from '../ShellMockup.vue'

  defineOptions({ name: 'FirewallFunctionFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the instance's function is picked from its list while it is, and back after. */
    hover?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

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
  const option = (index: number): MockupCursorTarget => ({ key: `option-${index}`, x: 0.3, y: 0.6 })

  const REST = {
    cursor: IDLE,
    press: false,
    focused: false,
    open: false,
    highlight: -1,
    picked: 'qa-fn-fw'
  }

  const PICKING = { ...REST, focused: true, open: true }

  const FRAMES: Frame[] = [
    { ...REST, forward: 0, back: 0 },
    { ...REST, cursor: TRIGGER, forward: 120, back: 420 },
    { ...REST, cursor: TRIGGER, press: true, focused: true, forward: 480, back: 160 },
    { ...PICKING, cursor: option(1), highlight: 1, forward: 160, back: 300 },
    { ...PICKING, cursor: option(3), highlight: 3, forward: 460, back: 420 },
    { ...PICKING, cursor: option(3), highlight: 3, press: true, forward: 420, back: 120 },
    {
      ...PICKING,
      cursor: option(3),
      highlight: 3,
      press: true,
      picked: 'qa-qc-fwfn',
      forward: 120,
      back: 220
    },
    { ...REST, cursor: option(3), focused: true, picked: 'qa-qc-fwfn', forward: 200, back: 260 },
    { ...REST, cursor: TRIGGER, picked: 'qa-qc-fwfn', forward: 260, back: 160 }
  ]

  const LAST = FRAMES.length - 1

  const wanted = () => props.active && (props.hover || !canHover)

  const step = ref(reduced || !canHover ? LAST : 0)
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
    class="[--mockup-fade-start:78%]"
    :chrome="false"
    :active="active"
    :width="420"
    :mobile-width="380"
  >
    <div
      ref="stage"
      class="relative"
    >
      <div class="relative flex flex-col gap-(--spacing-lg) py-(--spacing-xs)">
        <MockupPart :order="0">
          <div class="flex flex-col gap-(--spacing-xs)">
            <Label
              for="firewall-function-name"
              label="Name"
              required
            />
            <InputText
              id="firewall-function-name"
              model-value="qa-qc-fwfi"
              size="medium"
              placeholder="My Firewall function instance"
            />
            <HelperText
              label="Give a unique and descriptive name to identify the Firewall function instance."
            />
          </div>
        </MockupPart>

        <MockupPart
          :order="1"
          :data-open="frame.open || null"
          class="relative data-open:z-1"
        >
          <div class="flex flex-col gap-(--spacing-xs)">
            <Label
              for="firewall-function-select"
              label="Function"
              required
            />
            <MockupSelect
              :value="frame.picked"
              :options="FUNCTIONS"
              :open="frame.open"
              :highlight="frame.highlight"
              :focused="frame.focused"
              control-id="firewall-function-select"
              data-cursor="function"
              aria-label="Function"
            />
          </div>
        </MockupPart>

        <MockupPart :order="2">
          <div class="flex flex-col gap-(--spacing-sm)">
            <span class="flex flex-col gap-(--spacing-xxs)">
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
            <HelperText
              label="Customize the arguments in JSON format. Once set, they can be called in code using event.args('arg_name')."
            />
          </div>
        </MockupPart>
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
