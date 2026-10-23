<script setup lang="ts">
  import { computed, onScopeDispose, ref, watch } from 'vue'

  import Button from '../../../actions/button/button.vue'
  import ShellMockup from '../../shell-mockup/shell-mockup.vue'
  import ShellMockupPart from '../../shell-mockup/shell-mockup-part/shell-mockup-part.vue'
  import { type MockupCursorTarget, useMockupCursor } from '../composables/use-mockup-cursor'
  import MockupCursor from '../parts/mockup-cursor.vue'
  import MockupSelect from '../parts/mockup-select.vue'

  defineOptions({ name: 'NetworkShieldRuleFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the rule's network list is picked from its list, qa-nl-ipcidr to qa-nl-countries, while it is, and back after. */
    hover?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  const NETWORK_LISTS = ['qa-nl-ipcidr', 'qa-nl-countries', 'qa-nl-syntax', 'qa-p-nl-ip']

  interface Frame {
    cursor: MockupCursorTarget
    press: boolean
    focused: boolean
    open: boolean
    highlight: number
    list: string
    forward: number
    back: number
  }

  const IDLE: MockupCursorTarget = { key: 'network-list', x: -0.2, y: 2.6 }
  const TRIGGER: MockupCursorTarget = { key: 'network-list', x: 0.4, y: 0.6 }
  const option = (index: number): MockupCursorTarget => ({ key: `option-${index}`, x: 0.3, y: 0.6 })

  const REST = {
    cursor: IDLE,
    press: false,
    focused: false,
    open: false,
    highlight: -1,
    list: NETWORK_LISTS[0]
  }

  const PICKING = { ...REST, focused: true, open: true }
  const PICKED = { ...REST, list: NETWORK_LISTS[1] }

  const FRAMES: Frame[] = [
    { ...REST, forward: 0, back: 0 },
    { ...REST, cursor: TRIGGER, forward: 120, back: 440 },
    { ...REST, cursor: TRIGGER, press: true, focused: true, forward: 560, back: 160 },
    { ...PICKING, cursor: option(0), highlight: 0, forward: 160, back: 300 },
    { ...PICKING, cursor: option(1), highlight: 1, forward: 460, back: 420 },
    { ...PICKING, cursor: option(1), highlight: 1, press: true, forward: 420, back: 120 },
    {
      ...PICKING,
      cursor: option(1),
      highlight: 1,
      press: true,
      list: NETWORK_LISTS[1],
      forward: 120,
      back: 220
    },
    { ...PICKED, cursor: option(1), focused: true, forward: 200, back: 260 },
    { ...PICKED, cursor: TRIGGER, forward: 260, back: 160 }
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
    class="[--mockup-fade-start:80%]"
    :chrome="false"
    :active="active"
    :width="420"
    :mobile-width="380"
  >
    <div
      ref="stage"
      class="relative"
    >
      <div class="relative flex flex-col gap-(--spacing-md) py-(--spacing-xs)">
        <ShellMockupPart
          :order="0"
          :data-open="frame.open || null"
          class="relative data-open:z-1"
        >
          <div class="flex flex-col gap-(--spacing-sm)">
            <span class="flex items-center gap-(--spacing-sm)">
              <span class="text-body-sm text-(--text-default)">If</span>
              <span class="h-0 flex-1 border-t border-dashed border-(--border-default)" />
            </span>
            <span class="grid min-w-0 grid-cols-[4fr_4fr_5fr] gap-(--spacing-xs)">
              <MockupSelect
                value="Network"
                aria-label="Variable"
              >
                <template #prefix>
                  <span class="text-body-sm text-(--text-muted)">$</span>
                </template>
              </MockupSelect>
              <MockupSelect
                value="matches"
                aria-label="Operator"
              />
              <MockupSelect
                :value="frame.list"
                :options="NETWORK_LISTS"
                :open="frame.open"
                :highlight="frame.highlight"
                :focused="frame.focused"
                data-cursor="network-list"
                aria-label="Network list"
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

        <ShellMockupPart :order="2">
          <div class="flex flex-col gap-(--spacing-sm)">
            <span class="flex items-center gap-(--spacing-sm)">
              <span class="text-body-sm text-(--text-default)">Then</span>
              <span class="h-0 flex-1 border-t border-dashed border-(--border-default)" />
            </span>
            <span class="grid min-w-0 grid-cols-2 gap-(--spacing-xs)">
              <MockupSelect
                value="Deny (403 Forbidden)"
                aria-label="Behavior"
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
        name="Sam"
        :x="position.x"
        :y="position.y"
        :pressed="frame.press"
      />
    </div>
  </ShellMockup>
</template>
