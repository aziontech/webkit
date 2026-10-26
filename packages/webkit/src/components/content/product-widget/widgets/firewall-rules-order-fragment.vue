<script setup lang="ts">
  import { computed, onScopeDispose, ref, watch } from 'vue'

  import Button from '../../../actions/button/button.vue'
  import InputNumber from '../../../inputs/input-number/input-number.vue'
  import Tag from '../../../tag/tag.vue'
  import Badge from '../../badge/badge.vue'
  import ShellMockup from '../../shell-mockup/shell-mockup.vue'
  import ShellMockupPart from '../../shell-mockup/shell-mockup-part/shell-mockup-part.vue'
  import { type MockupCursorTarget, useMockupCursor } from '../composables/use-mockup-cursor'
  import MockupCursor from '../parts/mockup-cursor.vue'

  defineOptions({ name: 'FirewallRulesOrderFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the WAF rule is moved up two positions and the order is left for review while it is, and back after. */
    hover?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  const SAVED = ['qa-qc-fw-nl', 'qa-qc-fw-rl', 'qa-qc-fw-cr', 'qa-qc-fw-fn', 'qa-qc-fw-waf']
  const RAISED_ONCE = ['qa-qc-fw-nl', 'qa-qc-fw-rl', 'qa-qc-fw-cr', 'qa-qc-fw-waf', 'qa-qc-fw-fn']
  const RAISED_TWICE = ['qa-qc-fw-nl', 'qa-qc-fw-rl', 'qa-qc-fw-waf', 'qa-qc-fw-cr', 'qa-qc-fw-fn']

  interface Frame {
    cursor: MockupCursorTarget
    press: boolean
    order: string[]
    review: boolean
    forward: number
    back: number
  }

  const IDLE: MockupCursorTarget = { key: 'raise', x: 1.5, y: 1.1 }
  const FIRST: MockupCursorTarget = { key: 'raise', x: 0.75, y: 0.26 }
  const SECOND: MockupCursorTarget = { key: 'raise', x: 0.75, y: 0.26 }
  const REVIEW: MockupCursorTarget = { key: 'review', x: 0.5, y: 0.6 }

  const FRAMES: Frame[] = [
    { cursor: IDLE, press: false, order: SAVED, review: false, forward: 0, back: 0 },
    { cursor: FIRST, press: false, order: SAVED, review: false, forward: 120, back: 420 },
    { cursor: FIRST, press: true, order: SAVED, review: false, forward: 460, back: 140 },
    { cursor: FIRST, press: true, order: RAISED_ONCE, review: false, forward: 120, back: 220 },
    { cursor: FIRST, press: false, order: RAISED_ONCE, review: false, forward: 160, back: 260 },
    { cursor: SECOND, press: false, order: RAISED_ONCE, review: false, forward: 420, back: 300 },
    { cursor: SECOND, press: true, order: RAISED_ONCE, review: false, forward: 380, back: 140 },
    { cursor: SECOND, press: true, order: RAISED_TWICE, review: false, forward: 120, back: 220 },
    { cursor: SECOND, press: false, order: RAISED_TWICE, review: false, forward: 160, back: 260 },
    { cursor: SECOND, press: false, order: RAISED_TWICE, review: true, forward: 420, back: 300 },
    { cursor: REVIEW, press: false, order: RAISED_TWICE, review: true, forward: 520, back: 420 }
  ]

  const LAST = FRAMES.length - 1

  const wanted = () => props.active && (props.hover || !canHover)

  const step = ref(0)
  const frame = computed(() => FRAMES[step.value])

  const stage = ref<globalThis.HTMLElement | null>(null)

  const { position } = useMockupCursor(stage, () => frame.value.cursor)

  const altered = (name: string) => frame.value.order.indexOf(name) !== SAVED.indexOf(name)

  const alteredCount = computed(() => SAVED.filter(altered).length)

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
    :fade="frame.review ? 'y' : 'bottom'"
    class="[--mockup-fade-edge:12%] [--mockup-fade-start:88%]"
    :chrome="false"
    :active="active"
    :width="420"
    :mobile-width="380"
  >
    <div
      ref="stage"
      :data-lifted="frame.review || null"
      class="relative flex flex-col py-(--spacing-xs) transition-[translate] duration-slow-01 ease-productive-entrance data-lifted:-translate-y-14 motion-reduce:transition-none"
    >
      <ShellMockupPart :order="0">
        <div
          class="grid h-11 grid-cols-[8.5rem_1fr_auto] items-center gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-sm) text-label-sm text-(--text-muted)"
        >
          <span />
          <span>Name</span>
          <span>Status</span>
        </div>
      </ShellMockupPart>

      <ShellMockupPart :order="1">
        <TransitionGroup
          tag="div"
          move-class="transition-transform duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
          class="flex flex-col"
        >
          <div
            v-for="(name, index) in frame.order"
            :key="name"
            :data-altered="altered(name) || null"
            class="grid h-11 grid-cols-[8.5rem_1fr_auto] items-center gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-sm) transition-colors duration-moderate-01 ease-productive-entrance data-altered:bg-(--bg-surface-raised) motion-reduce:transition-none"
          >
            <span class="flex items-center gap-(--spacing-sm)">
              <i
                class="pi pi-bars text-body-sm leading-none text-(--text-muted)"
                aria-hidden="true"
              />
              <span
                class="flex w-24"
                :data-cursor="name === 'qa-qc-fw-waf' ? 'raise' : undefined"
              >
                <InputNumber
                  :model-value="index + 1"
                  :min="1"
                  :max="SAVED.length"
                  size="small"
                  show-buttons
                  :aria-label="`${name} position`"
                />
              </span>
            </span>
            <span class="truncate text-body-sm text-(--text-default)">{{ name }}</span>
            <Tag
              label="Active"
              severity="success"
              size="small"
            />
          </div>
        </TransitionGroup>
      </ShellMockupPart>

      <div
        :data-shown="frame.review || null"
        class="flex h-14 items-center justify-end gap-(--spacing-sm) border-t border-(--border-default) px-(--spacing-sm) opacity-0 transition-opacity duration-moderate-01 ease-productive-entrance data-shown:opacity-100 motion-reduce:transition-none"
      >
        <Button
          label="Discard Changes"
          kind="outlined"
          size="small"
        />
        <span
          class="relative flex"
          data-cursor="review"
        >
          <Button
            label="Review Changes"
            size="small"
          />
          <span class="absolute -top-2 -right-2 flex">
            <Badge
              :label="String(alteredCount)"
              severity="secondary"
              size="small"
            />
          </span>
        </span>
      </div>

      <MockupCursor
        name="Ana"
        :x="position.x"
        :y="position.y"
        :pressed="frame.press"
      />
    </div>
  </ShellMockup>
</template>
