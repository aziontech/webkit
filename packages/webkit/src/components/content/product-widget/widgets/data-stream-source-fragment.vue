<script setup lang="ts">
  import { computed, onScopeDispose, ref, watch } from 'vue'

  import HelperText from '../../../inputs/helper-text/helper-text.vue'
  import Label from '../../../inputs/label/label.vue'
  import ShellMockup from '../../shell-mockup/shell-mockup.vue'
  import ShellMockupPart from '../../shell-mockup/shell-mockup-part/shell-mockup-part.vue'
  import { type MockupCursorTarget, useMockupCursor } from '../composables/use-mockup-cursor'
  import MockupCursor from '../parts/mockup-cursor.vue'
  import MockupSelect from '../parts/mockup-select.vue'

  defineOptions({ name: 'DataStreamSourceFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; WAF Events is picked as the data source while it is, and Applications comes back after. */
    hover?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

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
  const option = (index: number): MockupCursorTarget => ({ key: `option-${index}`, x: 0.3, y: 0.6 })

  const REST = {
    cursor: IDLE,
    press: false,
    focused: false,
    open: false,
    highlight: -1,
    source: 'Applications'
  }

  const PICKING = { ...REST, focused: true, open: true }
  const PICKED = { ...REST, source: 'WAF Events' }

  const FRAMES: Frame[] = [
    { ...REST, forward: 0, back: 0 },
    { ...REST, cursor: TRIGGER, forward: 120, back: 420 },
    { ...REST, cursor: TRIGGER, press: true, focused: true, forward: 480, back: 160 },
    { ...PICKING, cursor: option(0), highlight: 0, forward: 160, back: 300 },
    { ...PICKING, cursor: option(1), highlight: 1, forward: 320, back: 260 },
    { ...PICKING, cursor: option(2), highlight: 2, forward: 300, back: 420 },
    { ...PICKING, cursor: option(2), highlight: 2, press: true, forward: 420, back: 120 },
    {
      ...PICKING,
      cursor: option(2),
      highlight: 2,
      press: true,
      source: 'WAF Events',
      forward: 120,
      back: 220
    },
    { ...PICKED, cursor: option(2), focused: true, forward: 200, back: 260 },
    { ...PICKED, cursor: IDLE, forward: 420, back: 0 }
  ]

  const LAST = FRAMES.length - 1

  const wanted = () => props.active && (props.hover || !canHover)

  const step = ref(reduced || !canHover ? LAST : 0)
  const stage = ref<globalThis.HTMLElement | null>(null)

  const frame = computed(() => FRAMES[step.value])
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
    class="[--mockup-fade-start:72%]"
    :chrome="false"
    :active="active"
    :width="420"
    :mobile-width="380"
  >
    <div
      ref="stage"
      class="relative flex h-full flex-col gap-(--spacing-lg) py-(--spacing-xs)"
    >
      <ShellMockupPart
        :order="0"
        :data-open="frame.open || null"
        class="relative data-open:z-1"
      >
        <div class="flex flex-col gap-(--spacing-xs)">
          <Label
            for="data-stream-source"
            label="Data Source"
            required
          />
          <MockupSelect
            control-id="data-stream-source"
            :value="frame.source"
            :options="SOURCES"
            :open="frame.open"
            :highlight="frame.highlight"
            :focused="frame.focused"
            data-cursor="source"
            aria-label="Data Source"
          />
          <HelperText label="Represents the data source the data will be collected from." />
        </div>
      </ShellMockupPart>

      <ShellMockupPart :order="1">
        <div class="flex flex-col gap-(--spacing-xs)">
          <Label
            for="data-stream-template"
            label="Template"
          />
          <MockupSelect
            control-id="data-stream-template"
            value="siem-security-fields"
            aria-label="Template"
          />
          <HelperText
            label="Represents a preset of variables for specific sources or an open template to choose variables."
          />
        </div>
      </ShellMockupPart>

      <ShellMockupPart :order="2">
        <div class="flex flex-col gap-(--spacing-xs)">
          <span class="text-label-md text-(--text-default)">Data Set</span>
          <HelperText
            label="Exhibits variables that'll be sent to the connector in a JSON format."
          />
        </div>
      </ShellMockupPart>

      <MockupCursor
        name="Bianca"
        :x="position.x"
        :y="position.y"
        :pressed="frame.press"
      />
    </div>
  </ShellMockup>
</template>
