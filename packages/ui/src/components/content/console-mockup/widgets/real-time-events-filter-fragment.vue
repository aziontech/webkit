<script setup lang="ts">
  import { computed } from 'vue'

  import IconButton from '../../../action/icon-button/icon-button.vue'
  import Input from '../../../input/input/input.vue'
  import type { MockupCursorTarget } from '../composables/use-mockup-cursor'
  import { useMockupFrames } from '../composables/use-mockup-frames'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'
  import EventsSearchBar from '../parts/events-search-bar.vue'
  import MockupFragment from '../parts/mockup-fragment.vue'

  defineOptions({ name: 'RealTimeEventsFilterFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the Source filter is opened and WAF picked from it while it is, and taken back out after. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const FIELDS = [
    { id: 'period', label: 'Period' },
    { id: 'source', label: 'Source' },
    { id: 'level', label: 'Level' }
  ]

  const SOURCES = [
    { id: 'http', label: 'HTTP Requests' },
    { id: 'waf', label: 'WAF' },
    { id: 'functions', label: 'Functions' },
    { id: 'firewall', label: 'Firewall' }
  ]

  interface Frame {
    cursor: MockupCursorTarget
    press: boolean
    level: 'fields' | 'values'
    hovered: string
    picked: boolean
    forward: number
    back: number
  }

  const IDLE: MockupCursorTarget = { key: 'row-source', x: 1.12, y: 2.2 }
  const SOURCE: MockupCursorTarget = { key: 'row-source', x: 0.4, y: 0.55 }
  const WAF: MockupCursorTarget = { key: 'row-waf', x: 0.4, y: 0.55 }

  const REST = {
    cursor: IDLE,
    press: false,
    level: 'fields' as const,
    hovered: '',
    picked: false
  }

  const VALUES = { ...REST, level: 'values' as const }

  const FRAMES: Frame[] = [
    { ...REST, forward: 0, back: 0 },
    { ...REST, cursor: SOURCE, hovered: 'source', forward: 160, back: 420 },
    { ...REST, cursor: SOURCE, hovered: 'source', press: true, forward: 460, back: 120 },
    { ...VALUES, cursor: SOURCE, press: true, forward: 140, back: 260 },
    { ...VALUES, cursor: WAF, hovered: 'waf', forward: 420, back: 420 },
    { ...VALUES, cursor: WAF, hovered: 'waf', press: true, forward: 460, back: 120 },
    { ...VALUES, cursor: WAF, hovered: 'waf', press: true, picked: true, forward: 120, back: 220 },
    { ...VALUES, cursor: WAF, hovered: 'waf', picked: true, forward: 160, back: 160 }
  ]

  const { frame } = useMockupFrames(FRAMES, {
    active: () => props.active,
    hovered: () => props.hovered
  })

  const appliedCount = computed(() => (frame.value.picked ? 2 : 1))

  const summary = (id: string) => {
    if (id === 'period') return 'Last 24 hours'
    if (id === 'source' && frame.value.picked) return 'WAF'
    return ''
  }

  const picked = (id: string) => id === 'waf' && frame.value.picked

  const FIELDS_PANEL_CLASS =
    'flex -translate-x-[12%] flex-col opacity-0 transition-[translate,opacity] duration-moderate-01 ease-productive-entrance [grid-area:1/1] ' +
    'data-active:translate-x-0 data-active:opacity-100 ' +
    'motion-reduce:transition-none'

  const MENU_ROW_CLASS =
    'flex w-full items-center gap-(--spacing-sm) rounded-(--shape-control) px-(--spacing-sm) py-(--spacing-xs) text-label-sm text-(--text-default) transition-colors duration-fast-02 ' +
    'ease-productive-entrance ' +
    'data-hovered:bg-(--bg-hover) ' +
    'motion-reduce:transition-none'

  const VALUES_PANEL_CLASS =
    'flex translate-x-[12%] flex-col opacity-0 transition-[translate,opacity] duration-moderate-01 ease-productive-entrance [grid-area:1/1] ' +
    'data-active:translate-x-0 data-active:opacity-100 ' +
    'motion-reduce:transition-none'

  const VALUES_FOOTER_CLASS =
    'border-t border-(--border-default) p-(--spacing-2xs) opacity-0 transition-opacity duration-fast-02 ease-productive-entrance ' +
    'data-[state=open]:opacity-100 ' +
    'motion-reduce:transition-none'
</script>

<template>
  <MockupFragment
    class="[--console-mockup-fade-start:80%]"
    :active="active"
    stage-class="flex flex-col gap-(--spacing-2xs) py-(--spacing-xs)"
    :cursor="frame.cursor"
    cursor-name="Jane"
    :pressed="frame.press"
  >
    <ConsoleMockupShellItem :order="0">
      <EventsSearchBar
        filter-label="Filter"
        placeholder="Search events, hosts, paths or addresses"
        aria-label="Search events"
        :applied="appliedCount"
      />
    </ConsoleMockupShellItem>

    <ConsoleMockupShellItem :order="1">
      <div
        class="grid w-fit min-w-(--container-3xs) max-w-(--container-xs) overflow-hidden rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface-raised) shadow-(--shadow-sm)"
      >
        <div
          :data-active="frame.level === 'fields' || null"
          :aria-hidden="frame.level !== 'fields'"
          :class="FIELDS_PANEL_CLASS"
        >
          <div class="border-b border-(--border-default) p-(--spacing-xs)">
            <Input
              tabindex="-1"
              model-value=""
              size="medium"
              class="w-full"
              placeholder="Filter by…"
              aria-label="Search filter fields"
            >
              <template #leading>
                <i
                  class="az az-search"
                  aria-hidden="true"
                />
              </template>
            </Input>
          </div>
          <div class="flex flex-col gap-(--spacing-2xs) p-(--spacing-2xs)">
            <span
              v-for="field in FIELDS"
              :key="field.id"
              :data-cursor="`row-${field.id}`"
              :data-hovered="(frame.level === 'fields' && frame.hovered === field.id) || null"
              :class="MENU_ROW_CLASS"
            >
              <span class="grow truncate">{{ field.label }}</span>
              <span
                v-if="summary(field.id)"
                class="truncate text-(--text-muted)"
              >
                {{ summary(field.id) }}
              </span>
              <i
                class="az az-chevron-right shrink-0 text-(--text-muted) rtl:-scale-x-100"
                aria-hidden="true"
              />
            </span>
          </div>
        </div>

        <div
          :data-active="frame.level === 'values' || null"
          :aria-hidden="frame.level !== 'values'"
          :class="VALUES_PANEL_CLASS"
        >
          <div
            class="flex items-center gap-(--spacing-xs) border-b border-(--border-default) p-(--spacing-xs)"
          >
            <IconButton
              icon="az az-chevron-left"
              variant="outline"
              size="small"
              ariaLabel="Back to all filters"
            />
            <span class="truncate text-label-sm text-(--text-default)">Source</span>
          </div>
          <div class="border-b border-(--border-default) p-(--spacing-xs)">
            <Input
              tabindex="-1"
              model-value=""
              size="medium"
              class="w-full"
              placeholder="Filter source…"
              aria-label="Search Source values"
            >
              <template #leading>
                <i
                  class="az az-search"
                  aria-hidden="true"
                />
              </template>
            </Input>
          </div>
          <div class="flex flex-col gap-(--spacing-2xs) p-(--spacing-2xs)">
            <span
              v-for="source in SOURCES"
              :key="source.id"
              :data-cursor="`row-${source.id}`"
              :data-hovered="(frame.level === 'values' && frame.hovered === source.id) || null"
              :class="MENU_ROW_CLASS"
            >
              <span class="grow truncate">{{ source.label }}</span>
              <i
                :data-selected="picked(source.id) || null"
                class="az az-check shrink-0 text-(--text-default) opacity-0 transition-opacity duration-fast-02 ease-productive-entrance data-selected:opacity-100 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </span>
          </div>
          <div
            :data-state="frame.picked ? 'open' : 'closed'"
            :class="VALUES_FOOTER_CLASS"
          >
            <span
              class="flex w-full items-center gap-(--spacing-sm) rounded-(--shape-control) px-(--spacing-sm) py-(--spacing-xs) text-label-sm text-(--text-default)"
            >
              <i
                class="az az-filter-off text-(--text-muted)"
                aria-hidden="true"
              />
              Clear Source
            </span>
          </div>
        </div>
      </div>
    </ConsoleMockupShellItem>
  </MockupFragment>
</template>
