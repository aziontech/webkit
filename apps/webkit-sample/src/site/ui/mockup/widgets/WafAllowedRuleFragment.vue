<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Label from '@aziontech/webkit/label'
  import Select from '@aziontech/webkit/select'
  import { computed, onMounted, onScopeDispose, ref, watch } from 'vue'

  import { type MockupCursorTarget, useMockupCursor } from '../composables/use-mockup-cursor'
  import MockupCursor from '../MockupCursor.vue'
  import MockupPart from '../MockupPart.vue'
  import MockupSelect from '../MockupSelect.vue'
  import ShellMockup from '../ShellMockup.vue'

  defineOptions({ name: 'WafAllowedRuleFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; a second condition is added, scrolled into view and given a match from its list while it is, and taken back out after. */
    hover?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  const RULE =
    '1000 - Possible SQL Injection attack: SQL keywords found in Body, Path, Query String or Cookies'

  const CONDITIONS = [
    'Any HTTP Header Value',
    'Any HTTP Header Name',
    'Specific HTTP Header Value',
    'Specific HTTP Header Name'
  ]

  interface Frame {
    cursor: MockupCursorTarget
    press: boolean
    pressed: boolean
    added: boolean
    lifted: boolean
    focused: boolean
    open: boolean
    highlight: number
    condition: string
    forward: number
    back: number
  }

  const IDLE: MockupCursorTarget = { key: 'add', x: 2.6, y: -0.4 }
  const ADD: MockupCursorTarget = { key: 'add', x: 0.55, y: 0.6 }
  const TRIGGER: MockupCursorTarget = { key: 'condition', x: 0.35, y: 0.6 }
  const option = (index: number): MockupCursorTarget => ({ key: `option-${index}`, x: 0.3, y: 0.6 })

  const REST = {
    cursor: IDLE,
    press: false,
    pressed: false,
    added: false,
    lifted: false,
    focused: false,
    open: false,
    highlight: -1,
    condition: CONDITIONS[0]
  }

  const LIFTED = { ...REST, cursor: TRIGGER, added: true, lifted: true }
  const PICKING = { ...LIFTED, focused: true, open: true }
  const PICKED = { ...LIFTED, condition: CONDITIONS[1] }

  const FRAMES: Frame[] = [
    { ...REST, forward: 0, back: 0 },
    { ...REST, cursor: ADD, forward: 120, back: 420 },
    { ...REST, cursor: ADD, press: true, pressed: true, forward: 480, back: 0 },
    { ...REST, cursor: ADD, pressed: true, added: true, forward: 220, back: 380 },
    { ...REST, cursor: ADD, added: true, forward: 160, back: 460 },
    { ...LIFTED, forward: 120, back: 420 },
    { ...LIFTED, press: true, focused: true, forward: 560, back: 160 },
    { ...PICKING, cursor: option(0), highlight: 0, forward: 160, back: 300 },
    { ...PICKING, cursor: option(1), highlight: 1, forward: 460, back: 420 },
    { ...PICKING, cursor: option(1), highlight: 1, press: true, forward: 420, back: 120 },
    {
      ...PICKING,
      cursor: option(1),
      highlight: 1,
      press: true,
      condition: CONDITIONS[1],
      forward: 120,
      back: 220
    },
    { ...PICKED, cursor: option(1), focused: true, forward: 200, back: 260 },
    { ...PICKED, forward: 260, back: 160 }
  ]

  const LAST = FRAMES.length - 1
  const LEAD = 20

  const wanted = () => props.active && (props.hover || !canHover)

  const step = ref(reduced || !canHover ? LAST : 0)
  const goingBack = ref(false)

  const frame = computed(() => FRAMES[step.value])
  const pressed = computed(() => frame.value.pressed && !goingBack.value)

  const stage = ref<globalThis.HTMLElement | null>(null)
  const column = ref<globalThis.HTMLElement | null>(null)
  const conditionsTop = ref(0)

  const measure = () => {
    conditionsTop.value =
      column.value?.querySelector<globalThis.HTMLElement>('[data-anchor]')?.offsetTop ?? 0
  }

  const { position } = useMockupCursor(stage, () => frame.value.cursor, column)

  const scrollStyle = computed(() => ({
    translate: `0 ${frame.value.lifted ? LEAD - conditionsTop.value : 0}px`
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
    goingBack.value = !forward
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

  const shown = (value: string) => value
</script>

<template>
  <ShellMockup
    kind="bare"
    shell="legacy"
    :fade="frame.lifted ? 'y' : 'bottom'"
    class="[--mockup-fade-edge:16%] [--mockup-fade-start:72%]"
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
        class="relative flex flex-col gap-(--spacing-lg) py-(--spacing-xs) transition-[translate] duration-slow-01 ease-productive-entrance motion-reduce:transition-none"
      >
        <MockupPart :order="0">
          <div class="flex flex-col gap-(--spacing-xs)">
            <Label
              for="waf-allowed-rule-id"
              label="Rule ID"
              required
            />
            <Select
              :model-value="RULE"
              size="medium"
              :display-value="shown"
            >
              <Select.Trigger
                id="waf-allowed-rule-id"
                aria-label="Rule ID"
              />
            </Select>
          </div>
        </MockupPart>

        <MockupPart :order="1">
          <div class="flex flex-col gap-(--spacing-xs)">
            <Label
              for="waf-allowed-path"
              label="Path"
            />
            <InputText
              id="waf-allowed-path"
              model-value="/search"
              size="medium"
              aria-label="Path"
            />
          </div>
        </MockupPart>

        <div
          data-anchor
          class="flex flex-col gap-(--spacing-md)"
        >
          <div class="flex flex-col">
            <MockupPart :order="2">
              <div
                class="flex items-center gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
              >
                <i
                  class="pi pi-chevron-right text-body-xs text-(--text-muted)"
                  aria-hidden="true"
                />
                <span class="flex min-w-0 flex-1 flex-col">
                  <span class="truncate text-label-md text-(--text-default)">
                    Match Specific Query String Value
                  </span>
                  <span class="text-body-xs text-(--text-muted)">Value: q</span>
                </span>
                <IconButton
                  icon="pi pi-trash"
                  kind="outlined"
                  size="small"
                  aria-label="Remove condition"
                />
              </div>
            </MockupPart>

            <Transition
              enter-active-class="animate-slide-down motion-reduce:animate-none"
              leave-active-class="animate-slide-down [animation-direction:reverse] motion-reduce:animate-none"
            >
              <div
                v-if="frame.added"
                :data-open="frame.open || null"
                class="overflow-hidden [interpolate-size:allow-keywords] data-open:overflow-visible"
              >
                <div class="pt-(--spacing-md)">
                  <div
                    class="flex flex-col rounded-(--shape-card) border border-(--border-default)"
                  >
                    <span
                      class="flex items-center gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
                    >
                      <i
                        class="pi pi-chevron-down text-body-xs text-(--text-muted)"
                        aria-hidden="true"
                      />
                      <span class="min-w-0 flex-1 truncate text-label-md text-(--text-default)">
                        Match {{ frame.condition }}
                      </span>
                      <IconButton
                        icon="pi pi-trash"
                        kind="outlined"
                        size="small"
                        aria-label="Remove condition"
                      />
                    </span>
                    <span class="flex flex-col gap-(--spacing-xs) p-(--spacing-md)">
                      <Label
                        for="waf-allowed-condition"
                        label="Condition"
                        required
                      />
                      <MockupSelect
                        :value="frame.condition"
                        :options="CONDITIONS"
                        :open="frame.open"
                        :highlight="frame.highlight"
                        :focused="frame.focused"
                        side="top"
                        data-cursor="condition"
                        control-id="waf-allowed-condition"
                        aria-label="Condition"
                      />
                    </span>
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          <MockupPart :order="3">
            <span
              data-cursor="add"
              :data-pressed="pressed || null"
              class="inline-flex rounded-(--shape-button) ring-(--ring-color) ring-offset-(--bg-surface) transition-shadow duration-fast-02 ease-productive-entrance data-pressed:ring-2 data-pressed:ring-offset-2 motion-reduce:transition-none"
            >
              <Button
                label="Condition"
                kind="outlined"
                size="small"
                icon="pi pi-plus"
              />
            </span>
          </MockupPart>
        </div>
      </div>

      <MockupCursor
        name="Rafael"
        :x="position.x"
        :y="position.y"
        :pressed="frame.press"
      />
    </div>
  </ShellMockup>
</template>
