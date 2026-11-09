<script setup lang="ts">
  import { computed, onScopeDispose, ref, watch } from 'vue'

  import Button from '../../../actions/button/button.vue'
  import IconButton from '../../../actions/icon-button/icon-button.vue'
  import InputText from '../../../inputs/input-text/input-text.vue'
  import Badge from '../../badge/badge.vue'
  import ShellMockup from '../../shell-mockup/shell-mockup.vue'
  import ShellMockupPart from '../../shell-mockup/shell-mockup-part/shell-mockup-part.vue'
  import { type MockupCursorTarget, useMockupCursor } from '../composables/use-mockup-cursor'
  import MockupCursor from '../parts/mockup-cursor.vue'

  defineOptions({ name: 'RealTimeEventsFilterFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the Source filter is opened and WAF picked from it while it is, and taken back out after. */
    hover?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

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

  const LAST = FRAMES.length - 1

  const wanted = () => props.active && (props.hover || !canHover)

  const step = ref(reduced || !canHover ? LAST : 0)
  const stage = ref<globalThis.HTMLElement | null>(null)

  const frame = computed(() => FRAMES[step.value])
  const { position } = useMockupCursor(stage, () => frame.value.cursor)

  const appliedCount = computed(() => (frame.value.picked ? 2 : 1))

  const summary = (id: string) => {
    if (id === 'period') return 'Last 24 hours'
    if (id === 'source' && frame.value.picked) return 'WAF'
    return ''
  }

  const picked = (id: string) => id === 'waf' && frame.value.picked

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
    class="[--mockup-fade-start:80%]"
    :chrome="false"
    :active="active"
    :width="420"
    :mobile-width="380"
  >
    <div
      ref="stage"
      class="relative flex flex-col gap-(--spacing-xxs) py-(--spacing-xs)"
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
              :label="String(appliedCount)"
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
        </div>
      </ShellMockupPart>

      <ShellMockupPart :order="1">
        <div
          class="grid w-fit min-w-(--container-3xs) max-w-(--container-xs) overflow-hidden rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised) shadow-(--shadow-sm)"
        >
          <div
            :data-shown="frame.level === 'fields' || null"
            :aria-hidden="frame.level !== 'fields'"
            class="flex -translate-x-[12%] flex-col opacity-0 transition-[translate,opacity] duration-moderate-01 ease-productive-entrance [grid-area:1/1] data-shown:translate-x-0 data-shown:opacity-100 motion-reduce:transition-none"
          >
            <div class="border-b border-(--border-default) p-(--spacing-xs)">
              <InputText
                model-value=""
                size="medium"
                class="w-full"
                placeholder="Filter by…"
                aria-label="Search filter fields"
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
                v-for="field in FIELDS"
                :key="field.id"
                :data-cursor="`row-${field.id}`"
                :data-hovered="(frame.level === 'fields' && frame.hovered === field.id) || null"
                class="flex w-full items-center gap-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-label-sm text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance data-hovered:bg-(--bg-hover) motion-reduce:transition-none"
              >
                <span class="grow truncate">{{ field.label }}</span>
                <span
                  v-if="summary(field.id)"
                  class="truncate text-(--text-muted)"
                >
                  {{ summary(field.id) }}
                </span>
                <i
                  class="pi pi-angle-right shrink-0 text-(--text-muted)"
                  aria-hidden="true"
                />
              </span>
            </div>
          </div>

          <div
            :data-shown="frame.level === 'values' || null"
            :aria-hidden="frame.level !== 'values'"
            class="flex translate-x-[12%] flex-col opacity-0 transition-[translate,opacity] duration-moderate-01 ease-productive-entrance [grid-area:1/1] data-shown:translate-x-0 data-shown:opacity-100 motion-reduce:transition-none"
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
              <span class="truncate text-label-sm text-(--text-default)">Source</span>
            </div>
            <div class="border-b border-(--border-default) p-(--spacing-xs)">
              <InputText
                model-value=""
                size="medium"
                class="w-full"
                placeholder="Filter source…"
                aria-label="Search Source values"
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
                v-for="source in SOURCES"
                :key="source.id"
                :data-cursor="`row-${source.id}`"
                :data-hovered="(frame.level === 'values' && frame.hovered === source.id) || null"
                class="flex w-full items-center gap-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-label-sm text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance data-hovered:bg-(--bg-hover) motion-reduce:transition-none"
              >
                <span class="grow truncate">{{ source.label }}</span>
                <i
                  :data-picked="picked(source.id) || null"
                  class="pi pi-check shrink-0 text-(--text-default) opacity-0 transition-opacity duration-fast-02 ease-productive-entrance data-picked:opacity-100 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </span>
            </div>
            <div
              :data-shown="frame.picked || null"
              class="border-t border-(--border-default) p-(--spacing-xxs) opacity-0 transition-opacity duration-fast-02 ease-productive-entrance data-shown:opacity-100 motion-reduce:transition-none"
            >
              <span
                class="flex w-full items-center gap-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-label-sm text-(--text-default)"
              >
                <i
                  class="pi pi-filter-slash text-(--text-muted)"
                  aria-hidden="true"
                />
                Clear Source
              </span>
            </div>
          </div>
        </div>
      </ShellMockupPart>

      <MockupCursor
        name="Ana"
        :x="position.x"
        :y="position.y"
        :pressed="frame.press"
      />
    </div>
  </ShellMockup>
</template>
