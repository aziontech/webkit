<script setup lang="ts">
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import Tag from '../../tag/tag.vue'
  import type { MockupCursorTarget } from '../composables/use-mockup-cursor'
  import { useMockupFrames } from '../composables/use-mockup-frames'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'
  import EventsSearchBar from '../parts/events-search-bar.vue'
  import MockupFragment from '../parts/mockup-fragment.vue'

  defineOptions({ name: 'RealTimeEventsLogFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; an event row is opened and the log downloaded as CSV while it is, and back after. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const LEVEL_SEVERITY: Record<string, 'danger' | 'warning' | 'info' | 'neutral'> = {
    Error: 'danger',
    Warning: 'warning',
    Info: 'info',
    Debug: 'neutral'
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

  const { frame } = useMockupFrames(FRAMES, {
    active: () => props.active,
    hovered: () => props.hovered
  })

  const selected = (index: number) => index === 0 && frame.value.selected

  const BUTTON_RING_CLASS =
    'inline-flex shrink-0 rounded-(--shape-button) ring-(--ring-color) ring-offset-(--bg-surface) transition-shadow duration-fast-02 ease-productive-entrance ' +
    'data-pressed:ring-2 data-pressed:ring-offset-2 ' +
    'motion-reduce:transition-none'

  const EXPAND_CELL_CLASS =
    'flex min-h-12 items-center justify-center border-b border-(--border-default) px-(--spacing-xs) transition-colors duration-fast-02 ease-productive-entrance ' +
    'data-selected:bg-(--bg-selected) ' +
    'motion-reduce:transition-none'

  const EXPAND_CHEVRON_CLASS =
    'az az-chevron-right text-(--text-muted) transition-transform duration-fast-02 ease-productive-entrance ' +
    'data-[state=open]:rotate-90 data-[state=open]:text-(--primary) ' +
    'motion-reduce:transition-none rtl:-scale-x-100 rtl:data-[state=open]:-rotate-90'

  const TIME_CELL_CLASS =
    'flex min-h-12 items-center border-b border-(--border-default) px-(--spacing-xs) text-label-code-sm whitespace-nowrap tabular-nums text-(--text-muted) transition-colors ' +
    'duration-fast-02 ease-productive-entrance ' +
    'data-selected:bg-(--bg-selected) ' +
    'motion-reduce:transition-none'

  const LEVEL_CELL_CLASS =
    'flex min-h-12 items-center border-b border-(--border-default) px-(--spacing-xs) transition-colors duration-fast-02 ease-productive-entrance ' +
    'data-selected:bg-(--bg-selected) ' +
    'motion-reduce:transition-none'

  const SOURCE_CELL_CLASS =
    'flex min-h-12 items-center border-b border-(--border-default) px-(--spacing-xs) text-label-md whitespace-nowrap text-(--text-default) transition-colors duration-fast-02 ' +
    'ease-productive-entrance ' +
    'data-selected:bg-(--bg-selected) ' +
    'motion-reduce:transition-none'

  const MESSAGE_CELL_CLASS =
    'flex min-h-12 min-w-0 items-center border-b border-(--border-default) px-(--spacing-xs) text-label-md text-(--text-default) transition-colors duration-fast-02 ' +
    'ease-productive-entrance ' +
    'data-selected:bg-(--bg-selected) ' +
    'motion-reduce:transition-none'
</script>

<template>
  <MockupFragment
    class="[--console-mockup-fade-start:70%]"
    :active="active"
    :width="480"
    :mobile-width="420"
    stage-class="flex flex-col gap-(--spacing-sm) py-(--spacing-xs)"
    :cursor="frame.cursor"
    cursor-name="Jordan"
    :pressed="frame.press"
  >
    <ConsoleMockupShellItem :order="0">
      <EventsSearchBar
        filter-label="Filter"
        placeholder="Search events, hosts, paths or addresses"
        aria-label="Search events"
      >
        <IconButton
          icon="az az-refresh"
          variant="outline"
          size="medium"
          ariaLabel="Refresh"
        />
        <span
          data-cursor="download"
          :data-pressed="frame.exporting || null"
          :class="BUTTON_RING_CLASS"
        >
          <IconButton
            icon="az az-download"
            variant="outline"
            size="medium"
            ariaLabel="Download CSV"
          />
        </span>
      </EventsSearchBar>
    </ConsoleMockupShellItem>

    <ConsoleMockupShellItem :order="1">
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
            :class="EXPAND_CELL_CLASS"
          >
            <i
              :data-state="selected(index) ? 'open' : 'closed'"
              :class="EXPAND_CHEVRON_CLASS"
              aria-hidden="true"
            />
          </span>
          <span
            :data-selected="selected(index) || null"
            :class="TIME_CELL_CLASS"
          >
            {{ event.time }}
          </span>
          <span
            :data-selected="selected(index) || null"
            :class="LEVEL_CELL_CLASS"
          >
            <Tag
              :label="event.level"
              :severity="LEVEL_SEVERITY[event.level]"
              size="medium"
            />
          </span>
          <span
            :data-selected="selected(index) || null"
            :class="SOURCE_CELL_CLASS"
          >
            {{ event.source }}
          </span>
          <span
            :data-selected="selected(index) || null"
            :class="MESSAGE_CELL_CLASS"
          >
            <span class="min-w-0 truncate">{{ event.message }}</span>
          </span>
        </template>
      </div>
    </ConsoleMockupShellItem>
  </MockupFragment>
</template>
