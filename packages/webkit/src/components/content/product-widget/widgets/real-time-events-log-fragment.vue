<script setup lang="ts">
  import { computed, onScopeDispose, ref, watch } from 'vue'

  import Button from '../../../actions/button/button.vue'
  import IconButton from '../../../actions/icon-button/icon-button.vue'
  import InputText from '../../../inputs/input-text/input-text.vue'
  import Tag from '../../../tag/tag.vue'
  import Badge from '../../badge/badge.vue'
  import ShellMockup from '../../shell-mockup/shell-mockup.vue'
  import ShellMockupPart from '../../shell-mockup/shell-mockup-part/shell-mockup-part.vue'
  import { type MockupCursorTarget, useMockupCursor } from '../composables/use-mockup-cursor'
  import MockupCursor from '../parts/mockup-cursor.vue'

  defineOptions({ name: 'RealTimeEventsLogFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; an event row is opened and the log downloaded as CSV while it is, and back after. */
    hover?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  const LEVEL_SEVERITY: Record<string, 'danger' | 'warning' | 'info' | 'secondary'> = {
    Error: 'danger',
    Warning: 'warning',
    Info: 'info',
    Debug: 'secondary'
  }

  const EVENTS = [
    {
      time: 'Oct 16, 14:21:07',
      level: 'Error',
      source: 'WAF',
      message: 'Blocked SQL injection attempt on /api/session'
    },
    {
      time: 'Oct 16, 14:20:52',
      level: 'Warning',
      source: 'HTTP Requests',
      message: 'Origin responded 502 after 3 retries'
    },
    {
      time: 'Oct 16, 14:20:41',
      level: 'Info',
      source: 'Functions',
      message: 'auth-handler completed in 12ms'
    },
    {
      time: 'Oct 16, 14:20:33',
      level: 'Warning',
      source: 'Firewall',
      message: 'Rate limit reached for a single address'
    },
    {
      time: 'Oct 16, 14:20:19',
      level: 'Error',
      source: 'WAF',
      message: 'Blocked cross-site scripting attempt on /search'
    },
    {
      time: 'Oct 16, 14:20:06',
      level: 'Debug',
      source: 'Functions',
      message: 'geo-router resolved region sa-east-1'
    },
    {
      time: 'Oct 16, 14:19:58',
      level: 'Info',
      source: 'HTTP Requests',
      message: 'Delivered from cache'
    },
    {
      time: 'Oct 16, 14:19:44',
      level: 'Error',
      source: 'Firewall',
      message: 'Network list “Known scrapers” denied the request'
    }
  ]

  interface Frame {
    cursor: MockupCursorTarget
    press: boolean
    selected: boolean
    exporting: boolean
    forward: number
    back: number
  }

  const IDLE: MockupCursorTarget = { key: 'row-0', x: 8, y: 4.3 }
  const ROW: MockupCursorTarget = { key: 'row-0', x: 0.45, y: 0.55 }
  const DOWNLOAD: MockupCursorTarget = { key: 'download', x: 0.55, y: 0.6 }

  const REST = { cursor: IDLE, press: false, selected: false, exporting: false }
  const OPENED = { ...REST, selected: true }

  const FRAMES: Frame[] = [
    { ...REST, forward: 0, back: 0 },
    { ...REST, cursor: ROW, forward: 160, back: 420 },
    { ...REST, cursor: ROW, press: true, forward: 460, back: 120 },
    { ...OPENED, cursor: ROW, press: true, forward: 120, back: 220 },
    { ...OPENED, cursor: ROW, forward: 160, back: 300 },
    { ...OPENED, cursor: DOWNLOAD, forward: 520, back: 420 },
    { ...OPENED, cursor: DOWNLOAD, press: true, forward: 480, back: 120 },
    { ...OPENED, cursor: DOWNLOAD, press: true, exporting: true, forward: 120, back: 220 },
    { ...OPENED, cursor: DOWNLOAD, exporting: true, forward: 200, back: 160 }
  ]

  const LAST = FRAMES.length - 1

  const wanted = () => props.active && (props.hover || !canHover)

  const step = ref(reduced || !canHover ? LAST : 0)
  const stage = ref<globalThis.HTMLElement | null>(null)

  const frame = computed(() => FRAMES[step.value])
  const { position } = useMockupCursor(stage, () => frame.value.cursor)

  const selected = (index: number) => index === 0 && frame.value.selected

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
    class="[--mockup-fade-start:70%]"
    :chrome="false"
    :active="active"
    :width="480"
    :mobile-width="420"
  >
    <div
      ref="stage"
      class="relative flex flex-col gap-(--spacing-sm) py-(--spacing-xs)"
    >
      <ShellMockupPart :order="0">
        <div class="flex items-center gap-(--spacing-xs)">
          <span class="relative shrink-0">
            <Button
              label="Filter"
              kind="outlined"
              size="medium"
              icon="pi pi-filter"
            />
            <Badge
              label="1"
              severity="primary"
              size="small"
              aria-hidden="true"
              class="pointer-events-none absolute -top-2 -right-2 min-w-5"
            />
          </span>
          <InputText
            model-value=""
            size="medium"
            placeholder="Search events, hosts, paths or addresses"
            aria-label="Search events"
            class="min-w-0 grow"
          >
            <template #iconLeft>
              <i
                class="pi pi-search"
                aria-hidden="true"
              />
            </template>
          </InputText>
          <IconButton
            icon="pi pi-refresh"
            kind="outlined"
            size="medium"
            ariaLabel="Refresh"
          />
          <span
            data-cursor="download"
            :data-pressed="frame.exporting || null"
            class="inline-flex shrink-0 rounded-(--shape-button) ring-(--ring-color) ring-offset-(--bg-surface) transition-shadow duration-fast-02 ease-productive-entrance data-pressed:ring-2 data-pressed:ring-offset-2 motion-reduce:transition-none"
          >
            <IconButton
              icon="pi pi-download"
              kind="outlined"
              size="medium"
              ariaLabel="Download CSV"
            />
          </span>
        </div>
      </ShellMockupPart>

      <ShellMockupPart :order="1">
        <div
          class="grid grid-cols-[auto_auto_auto_auto_minmax(0,1fr)] border-t border-(--border-default)"
        >
          <span class="flex h-9 items-center border-b border-(--border-default) px-(--spacing-xs)">
            <span class="sr-only">Open the event document</span>
          </span>
          <span
            v-for="heading in ['Time', 'Level', 'Source', 'Event']"
            :key="heading"
            class="flex h-9 items-center border-b border-(--border-default) px-(--spacing-xs) text-label-sm text-(--text-muted)"
          >
            {{ heading }}
          </span>

          <template
            v-for="(event, index) in EVENTS"
            :key="event.time"
          >
            <span
              :data-selected="selected(index) || null"
              :data-cursor="`row-${index}`"
              class="flex min-h-12 items-center justify-center border-b border-(--border-default) px-(--spacing-xs) transition-colors duration-fast-02 ease-productive-entrance data-selected:bg-(--bg-selected) motion-reduce:transition-none"
            >
              <i
                :data-open="selected(index) || null"
                class="pi pi-angle-right text-(--text-muted) transition-transform duration-fast-02 ease-productive-entrance data-open:rotate-90 data-open:text-(--primary) motion-reduce:transition-none"
                aria-hidden="true"
              />
            </span>
            <span
              :data-selected="selected(index) || null"
              class="flex min-h-12 items-center border-b border-(--border-default) px-(--spacing-xs) text-label-code-sm whitespace-nowrap tabular-nums text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance data-selected:bg-(--bg-selected) motion-reduce:transition-none"
            >
              {{ event.time }}
            </span>
            <span
              :data-selected="selected(index) || null"
              class="flex min-h-12 items-center border-b border-(--border-default) px-(--spacing-xs) transition-colors duration-fast-02 ease-productive-entrance data-selected:bg-(--bg-selected) motion-reduce:transition-none"
            >
              <Tag
                :label="event.level"
                :severity="LEVEL_SEVERITY[event.level]"
                size="medium"
              />
            </span>
            <span
              :data-selected="selected(index) || null"
              class="flex min-h-12 items-center border-b border-(--border-default) px-(--spacing-xs) text-label-md whitespace-nowrap text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance data-selected:bg-(--bg-selected) motion-reduce:transition-none"
            >
              {{ event.source }}
            </span>
            <span
              :data-selected="selected(index) || null"
              class="flex min-h-12 min-w-0 items-center border-b border-(--border-default) px-(--spacing-xs) text-label-md text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance data-selected:bg-(--bg-selected) motion-reduce:transition-none"
            >
              <span class="min-w-0 truncate">{{ event.message }}</span>
            </span>
          </template>
        </div>
      </ShellMockupPart>

      <MockupCursor
        name="Jordan"
        :x="position.x"
        :y="position.y"
        :pressed="frame.press"
      />
    </div>
  </ShellMockup>
</template>
