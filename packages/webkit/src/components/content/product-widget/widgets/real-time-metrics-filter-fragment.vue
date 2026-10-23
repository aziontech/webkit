<script setup lang="ts">
  import { computed, onScopeDispose, ref, watch } from 'vue'

  import Button from '../../../actions/button/button.vue'
  import IconButton from '../../../actions/icon-button/icon-button.vue'
  import Chip from '../../../inputs/chip/chip.vue'
  import InputText from '../../../inputs/input-text/input-text.vue'
  import Badge from '../../badge/badge.vue'
  import CardBox from '../../card-box/card-box.vue'
  import ShellMockup from '../../shell-mockup/shell-mockup.vue'
  import ShellMockupPart from '../../shell-mockup/shell-mockup-part/shell-mockup-part.vue'
  import { type MockupCursorTarget, useMockupCursor } from '../composables/use-mockup-cursor'
  import MockupCursor from '../parts/mockup-cursor.vue'

  defineOptions({ name: 'RealTimeMetricsFilterFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the Period chip is reopened and Last 7 days picked while it is, and back after. */
    hover?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  const PERIODS = ['Last hour', 'Last 24 hours', 'Last 7 days', 'Last 30 days']

  const STRIP = [
    { label: 'Requests', value: '48.2', unit: 'M' },
    { label: 'Data Transferred', value: '6.4', unit: 'TB' },
    { label: 'Bandwidth Saved', value: '71', unit: '%' },
    { label: 'Status 5xx', value: '0.03', unit: '%' }
  ]

  interface Frame {
    cursor: MockupCursorTarget
    press: boolean
    open: boolean
    highlight: number
    period: string
    forward: number
    back: number
  }

  const IDLE: MockupCursorTarget = { key: 'chip', x: 1.15, y: 2.2 }
  const CHIP: MockupCursorTarget = { key: 'chip', x: 0.55, y: 0.6 }
  const option = (index: number): MockupCursorTarget => ({ key: `option-${index}`, x: 0.3, y: 0.6 })

  const REST = {
    cursor: IDLE,
    press: false,
    open: false,
    highlight: -1,
    period: 'Last 24 hours'
  }

  const PICKING = { ...REST, open: true }

  const FRAMES: Frame[] = [
    { ...REST, forward: 0, back: 0 },
    { ...REST, cursor: CHIP, forward: 120, back: 420 },
    { ...REST, cursor: CHIP, press: true, forward: 480, back: 160 },
    { ...PICKING, cursor: option(1), highlight: 1, forward: 200, back: 300 },
    { ...PICKING, cursor: option(2), highlight: 2, forward: 460, back: 420 },
    { ...PICKING, cursor: option(2), highlight: 2, press: true, forward: 420, back: 120 },
    {
      ...PICKING,
      cursor: option(2),
      highlight: 2,
      press: true,
      period: 'Last 7 days',
      forward: 120,
      back: 220
    },
    { ...REST, cursor: CHIP, period: 'Last 7 days', forward: 260, back: 260 }
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
      <div class="flex flex-col gap-(--layout-group-gap) py-(--spacing-xs)">
        <ShellMockupPart
          :order="0"
          :data-open="frame.open || null"
          class="relative data-open:z-1"
        >
          <span class="relative inline-flex">
            <Button
              label="Filter"
              kind="outlined"
              size="medium"
              icon="pi pi-filter"
            />
            <span class="pointer-events-none absolute -top-2 -right-2 flex">
              <Badge
                label="1"
                severity="primary"
                size="small"
              />
            </span>
          </span>

          <Transition
            enter-active-class="animate-popup-scale-in motion-reduce:animate-none"
            leave-active-class="animate-popup-scale-out motion-reduce:animate-none"
          >
            <div
              v-if="frame.open"
              class="absolute top-full left-0 z-1 mt-1 flex min-w-(--container-3xs) flex-col overflow-hidden rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised) shadow-(--shadow-sm) [--popup-origin:top_left]"
            >
              <div
                class="flex items-center gap-(--spacing-xs) border-b border-(--border-default) p-(--spacing-xs)"
              >
                <IconButton
                  icon="pi pi-angle-left"
                  kind="outlined"
                  size="small"
                  ariaLabel="Back to all filters"
                />
                <span class="truncate text-label-sm text-(--text-default)">Period</span>
              </div>

              <div class="flex flex-col border-b border-(--border-default) p-(--spacing-xs)">
                <InputText
                  model-value=""
                  size="medium"
                  placeholder="Filter period…"
                  aria-label="Search Period values"
                >
                  <template #iconLeft>
                    <i
                      class="pi pi-search"
                      aria-hidden="true"
                    />
                  </template>
                </InputText>
              </div>

              <div class="flex flex-col gap-(--spacing-xxs) p-(--spacing-xxs)">
                <span
                  v-for="(period, index) in PERIODS"
                  :key="period"
                  :data-cursor="`option-${index}`"
                  :data-highlighted="frame.highlight === index || null"
                  class="flex w-full items-center gap-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-label-sm text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance data-highlighted:bg-(--bg-hover) motion-reduce:transition-none"
                >
                  <span class="grow truncate">{{ period }}</span>
                  <i
                    :data-picked="frame.period === period || null"
                    class="pi pi-check invisible shrink-0 text-(--text-default) data-picked:visible"
                    aria-hidden="true"
                  />
                </span>
              </div>

              <div class="border-t border-(--border-default) p-(--spacing-xxs)">
                <span
                  class="flex w-full items-center gap-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-label-sm text-(--text-default)"
                >
                  <i
                    class="pi pi-filter-slash text-(--text-muted)"
                    aria-hidden="true"
                  />
                  Clear Period
                </span>
              </div>
            </div>
          </Transition>
        </ShellMockupPart>

        <ShellMockupPart :order="1">
          <span class="flex">
            <Chip
              label="Period"
              kind="filled"
              size="medium"
              clickable
              removable
              data-cursor="chip"
            >
              <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
                <span class="truncate text-(--text-muted)">Period</span>
                <span class="truncate">{{ frame.period }}</span>
              </span>
            </Chip>
          </span>
        </ShellMockupPart>

        <ShellMockupPart :order="2">
          <ul class="grid grid-cols-2 gap-(--spacing-md)">
            <li
              v-for="metric in STRIP"
              :key="metric.label"
              class="grid"
            >
              <CardBox>
                <template #content>
                  <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                    <span class="min-w-0 truncate text-body-sm text-(--text-muted)">
                      {{ metric.label }}
                    </span>
                    <p class="flex items-baseline gap-(--spacing-xxs)">
                      <span class="text-heading-lg text-(--text-default)">{{ metric.value }}</span>
                      <span class="text-body-md text-(--text-muted)">{{ metric.unit }}</span>
                    </p>
                  </div>
                </template>
              </CardBox>
            </li>
          </ul>
        </ShellMockupPart>
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
