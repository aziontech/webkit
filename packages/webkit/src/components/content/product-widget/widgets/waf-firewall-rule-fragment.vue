<script setup lang="ts">
  import { computed, onMounted, onScopeDispose, ref, watch } from 'vue'

  import Button from '../../../actions/button/button.vue'
  import InputText from '../../../inputs/input-text/input-text.vue'
  import ShellMockup from '../../shell-mockup/shell-mockup.vue'
  import ShellMockupPart from '../../shell-mockup/shell-mockup-part/shell-mockup-part.vue'
  import { type MockupCursorTarget, useMockupCursor } from '../composables/use-mockup-cursor'
  import MockupCursor from '../parts/mockup-cursor.vue'
  import MockupSelect from '../parts/mockup-select.vue'

  defineOptions({ name: 'WafFirewallRuleFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the WAF mode is picked from its list, Logging to Blocking, while it is, and back after. */
    hover?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  const MODES = ['Logging', 'Blocking']

  interface Frame {
    cursor: MockupCursorTarget
    press: boolean
    lifted: boolean
    focused: boolean
    open: boolean
    highlight: number
    mode: string
    forward: number
    back: number
  }

  const IDLE: MockupCursorTarget = { key: 'mode', x: -0.35, y: -0.9 }
  const TRIGGER: MockupCursorTarget = { key: 'mode', x: 0.35, y: 0.6 }
  const option = (index: number): MockupCursorTarget => ({ key: `option-${index}`, x: 0.3, y: 0.6 })

  const REST = {
    cursor: IDLE,
    press: false,
    lifted: false,
    focused: false,
    open: false,
    highlight: -1,
    mode: 'Logging'
  }

  const LIFTED = { ...REST, lifted: true }
  const PICKING = { ...LIFTED, focused: true, open: true }

  const FRAMES: Frame[] = [
    { ...REST, forward: 0, back: 0 },
    { ...LIFTED, cursor: TRIGGER, forward: 120, back: 440 },
    { ...LIFTED, cursor: TRIGGER, press: true, focused: true, forward: 560, back: 160 },
    { ...PICKING, cursor: option(0), highlight: 0, forward: 160, back: 300 },
    { ...PICKING, cursor: option(1), highlight: 1, forward: 460, back: 420 },
    { ...PICKING, cursor: option(1), highlight: 1, press: true, forward: 420, back: 120 },
    {
      ...PICKING,
      cursor: option(1),
      highlight: 1,
      press: true,
      mode: 'Blocking',
      forward: 120,
      back: 220
    },
    { ...LIFTED, cursor: option(1), focused: true, mode: 'Blocking', forward: 200, back: 260 },
    { ...LIFTED, cursor: TRIGGER, mode: 'Blocking', forward: 260, back: 160 }
  ]

  const LAST = FRAMES.length - 1
  const LEAD = 20

  const wanted = () => props.active && (props.hover || !canHover)

  const step = ref(reduced || !canHover ? LAST : 0)
  const frame = computed(() => FRAMES[step.value])

  const stage = ref<globalThis.HTMLElement | null>(null)
  const column = ref<globalThis.HTMLElement | null>(null)
  const thenTop = ref(0)

  const measure = () => {
    thenTop.value =
      column.value?.querySelector<globalThis.HTMLElement>('[data-anchor]')?.offsetTop ?? 0
  }

  const { position } = useMockupCursor(stage, () => frame.value.cursor, column)

  const scrollStyle = computed(() => ({
    translate: `0 ${frame.value.lifted ? LEAD - thenTop.value : 0}px`
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
    shell="legacy"
    :fade="frame.lifted ? 'y' : 'bottom'"
    class="[--mockup-fade-edge:16%] [--mockup-fade-start:76%]"
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
        class="relative flex flex-col gap-(--spacing-md) py-(--spacing-xs) transition-[translate] duration-slow-01 ease-productive-entrance motion-reduce:transition-none"
      >
        <ShellMockupPart :order="0">
          <div class="flex flex-col gap-(--spacing-sm)">
            <span class="flex items-center gap-(--spacing-sm)">
              <span class="text-body-sm text-(--text-default)">If</span>
              <span class="h-0 flex-1 border-t border-(--border-default)" />
            </span>
            <span class="grid min-w-0 grid-cols-[5fr_4fr_2fr] gap-(--spacing-xs)">
              <MockupSelect
                value="Request Uri"
                aria-label="Variable"
              >
                <template #prefix>
                  <span class="text-body-sm text-(--text-muted)">$</span>
                </template>
              </MockupSelect>
              <MockupSelect
                value="starts with"
                aria-label="Operator"
              />
              <InputText
                model-value="/"
                size="medium"
                aria-label="Argument"
              />
            </span>
          </div>
        </ShellMockupPart>

        <ShellMockupPart :order="1">
          <span class="flex gap-(--spacing-xs)">
            <Button
              label="And"
              kind="outlined"
              size="small"
              icon="pi pi-plus-circle"
            />
            <Button
              label="Or"
              kind="outlined"
              size="small"
              icon="pi pi-plus-circle"
            />
          </span>
        </ShellMockupPart>

        <ShellMockupPart
          :order="2"
          :data-open="frame.open || null"
          class="relative data-open:z-1"
          data-anchor
        >
          <div class="flex flex-col gap-(--spacing-sm)">
            <span class="flex items-center gap-(--spacing-sm)">
              <span class="text-body-sm text-(--text-default)">Then</span>
              <span class="h-0 flex-1 border-t border-(--border-default)" />
            </span>
            <span class="grid min-w-0 grid-cols-2 gap-x-(--spacing-xs) gap-y-(--spacing-md)">
              <MockupSelect
                value="Set WAF"
                aria-label="Behavior"
              />
              <MockupSelect
                value="qa-qc-waf"
                aria-label="WAF"
              />
              <span class="col-start-2 flex">
                <MockupSelect
                  :value="frame.mode"
                  :options="MODES"
                  :open="frame.open"
                  :highlight="frame.highlight"
                  :focused="frame.focused"
                  data-cursor="mode"
                  aria-label="WAF mode"
                />
              </span>
              <MockupSelect
                value="Set Rate Limit"
                aria-label="Behavior"
              />
              <InputText
                model-value="10"
                size="medium"
                aria-label="Average rate"
              />
              <span class="col-start-2 flex">
                <InputText
                  model-value="20"
                  size="medium"
                  aria-label="Burst"
                />
              </span>
              <MockupSelect
                value="Tag Event"
                aria-label="Behavior"
              />
              <InputText
                model-value="checkout-guard"
                size="medium"
                aria-label="Tag"
              />
            </span>
          </div>
        </ShellMockupPart>

        <ShellMockupPart :order="3">
          <Button
            label="Add Behavior"
            kind="outlined"
            size="small"
            icon="pi pi-plus-circle"
          />
        </ShellMockupPart>
      </div>

      <MockupCursor
        name="Marcus"
        :x="position.x"
        :y="position.y"
        :pressed="frame.press"
      />
    </div>
  </ShellMockup>
</template>
