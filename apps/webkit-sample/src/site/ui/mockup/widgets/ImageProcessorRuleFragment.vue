<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import InputText from '@aziontech/webkit/input-text'
  import Select from '@aziontech/webkit/select'
  import { computed, onScopeDispose, ref, watch } from 'vue'

  import { type MockupCursorTarget, useMockupCursor } from '../composables/use-mockup-cursor'
  import MockupCursor from '../MockupCursor.vue'
  import MockupPart from '../MockupPart.vue'
  import MockupSelect from '../MockupSelect.vue'
  import ShellMockup from '../ShellMockup.vue'

  defineOptions({ name: 'ImageProcessorRuleFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; Optimize Images is picked as the rule's behavior while it is, and Deliver comes back after. */
    hover?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

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
  const option = (index: number): MockupCursorTarget => ({ key: `option-${index}`, x: 0.3, y: 0.6 })

  const REST = {
    cursor: IDLE,
    press: false,
    focused: false,
    open: false,
    highlight: -1,
    behavior: 'Deliver'
  }

  const PICKING = { ...REST, focused: true, open: true }

  const FRAMES: Frame[] = [
    { ...REST, forward: 0, back: 0 },
    { ...REST, cursor: TRIGGER, forward: 120, back: 420 },
    { ...REST, cursor: TRIGGER, press: true, focused: true, forward: 480, back: 160 },
    { ...PICKING, cursor: option(0), highlight: 0, forward: 160, back: 300 },
    { ...PICKING, cursor: option(1), highlight: 1, forward: 300, back: 260 },
    { ...PICKING, cursor: option(2), highlight: 2, forward: 380, back: 260 },
    { ...PICKING, cursor: option(2), highlight: 2, press: true, forward: 420, back: 120 },
    {
      ...PICKING,
      cursor: option(2),
      highlight: 2,
      press: true,
      behavior: 'Optimize Images',
      forward: 120,
      back: 220
    },
    {
      ...REST,
      cursor: option(2),
      focused: true,
      behavior: 'Optimize Images',
      forward: 200,
      back: 260
    }
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

  const shown = (value: string) => value
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
      <MockupPart :order="0">
        <div class="flex flex-col gap-(--spacing-sm)">
          <span class="flex items-center gap-(--spacing-sm)">
            <span class="text-body-sm text-(--text-default) capitalize">if</span>
            <span class="h-0 flex-1 border-t border-dashed border-(--border-default)" />
          </span>
          <span class="grid min-w-0 grid-cols-[4fr_4fr_5fr] gap-(--spacing-xs)">
            <InputText
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
            <InputText
              model-value="\.(jpe?g|png|gif|webp)$"
              size="medium"
              aria-label="Argument"
            />
          </span>
        </div>
      </MockupPart>

      <MockupPart :order="1">
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
      </MockupPart>

      <MockupPart
        :order="2"
        :data-open="frame.open || null"
        class="relative data-open:z-1"
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
              :highlight="frame.highlight"
              :focused="frame.focused"
              side="top"
              data-cursor="behavior"
              aria-label="Behavior"
            />
          </span>
        </div>
      </MockupPart>

      <MockupPart :order="3">
        <span class="flex">
          <Button
            label="Add Behavior"
            kind="outlined"
            size="small"
            icon="pi pi-plus-circle"
          />
        </span>
      </MockupPart>

      <MockupCursor
        name="Bianca"
        :x="position.x"
        :y="position.y"
        :pressed="frame.press"
      />
    </div>
  </ShellMockup>
</template>
