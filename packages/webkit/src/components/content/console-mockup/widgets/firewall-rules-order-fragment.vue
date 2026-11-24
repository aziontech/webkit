<script setup lang="ts">
  import { computed, ref } from 'vue'

  import Button from '../../../action/button/button.vue'
  import NumberInput from '../../../input/number-input/number-input.vue'
  import Badge from '../../badge/badge.vue'
  import Tag from '../../tag/tag.vue'
  import { type MockupCursorTarget, useMockupCursor } from '../composables/use-mockup-cursor'
  import { useMockupFrames } from '../composables/use-mockup-frames'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'
  import MockupCursor from '../parts/mockup-cursor.vue'
  import MockupFragment from '../parts/mockup-fragment.vue'

  defineOptions({ name: 'FirewallRulesOrderFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the WAF rule is moved up two positions and the order is left for review while it is, and back after. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

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

  const { frame } = useMockupFrames(FRAMES, {
    active: () => props.active,
    hovered: () => props.hovered,
    stepOnTouch: true
  })

  const stageEl = ref<globalThis.HTMLElement | null>(null)

  const { position } = useMockupCursor(stageEl, () => frame.value.cursor)

  const altered = (name: string) => frame.value.order.indexOf(name) !== SAVED.indexOf(name)

  const alteredCount = computed(() => SAVED.filter(altered).length)

  const RULE_ROW_CLASS =
    'grid h-11 grid-cols-[8.5rem_1fr_auto] items-center gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-sm) transition-colors duration-moderate-01 ' +
    'ease-productive-entrance ' +
    'data-altered:bg-(--bg-surface-raised) ' +
    'motion-reduce:transition-none'

  const REVIEW_BAR_CLASS =
    'flex h-14 items-center justify-end gap-(--spacing-sm) border-t border-(--border-default) px-(--spacing-sm) opacity-0 transition-opacity duration-moderate-01 ' +
    'ease-productive-entrance ' +
    'data-[state=open]:opacity-100 ' +
    'motion-reduce:transition-none'
</script>

<template>
  <MockupFragment
    shell="legacy"
    :fade="frame.review ? 'y' : 'bottom'"
    class="[--console-mockup-fade-edge:12%] [--console-mockup-fade-start:88%]"
    :active="active"
  >
    <div
      ref="stageEl"
      :data-lifted="frame.review || null"
      class="relative flex flex-col py-(--spacing-xs) transition-[translate] duration-slow-01 ease-productive-entrance data-lifted:-translate-y-14 motion-reduce:transition-none"
    >
      <ConsoleMockupShellItem :order="0">
        <div
          class="grid h-11 grid-cols-[8.5rem_1fr_auto] items-center gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-sm) text-label-sm text-(--text-muted)"
        >
          <span />
          <span>Name</span>
          <span>Status</span>
        </div>
      </ConsoleMockupShellItem>

      <ConsoleMockupShellItem :order="1">
        <TransitionGroup
          tag="div"
          move-class="transition-transform duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
          class="flex flex-col"
        >
          <div
            v-for="(name, index) in frame.order"
            :key="name"
            :data-altered="altered(name) || null"
            :class="RULE_ROW_CLASS"
          >
            <span class="flex items-center gap-(--spacing-sm)">
              <i
                class="az az-menu text-body-sm leading-none text-(--text-muted)"
                aria-hidden="true"
              />
              <span
                class="flex w-24"
                :data-cursor="name === 'qa-qc-fw-waf' ? 'raise' : undefined"
              >
                <NumberInput
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
      </ConsoleMockupShellItem>

      <div
        :data-state="frame.review ? 'open' : 'closed'"
        :class="REVIEW_BAR_CLASS"
      >
        <Button
          label="Discard Changes"
          variant="outline"
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
          <span class="absolute -top-2 -end-2 flex">
            <Badge
              :label="String(alteredCount)"
              variant="secondary"
              size="small"
            />
          </span>
        </span>
      </div>

      <MockupCursor
        name="Jane"
        :x="position.x"
        :y="position.y"
        :pressed="frame.press"
      />
    </div>
  </MockupFragment>
</template>
