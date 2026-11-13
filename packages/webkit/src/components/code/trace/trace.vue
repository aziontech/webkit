<script setup lang="ts">
  import { computed, nextTick, ref, useAttrs, useId, watch } from 'vue'

  import { logicalArrowKey, useDirection } from '../../../composables/use-direction'
  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import Button from '../../actions/button/button.vue'
  import CopyButton from '../../actions/copy-button/copy-button.vue'
  import Tag from '../../content/tag/tag.vue'
  import Input from '../../inputs/input/input.vue'

  export type TraceSpanStatus = 'ok' | 'error' | 'running'

  export interface TraceSpan {
    /** Stable key of the span. */
    id: string
    /** The span this one ran inside. Unset or unknown makes it a root span. */
    parentId?: string
    /** What the span measured. */
    name: string
    /** The service or kind that ran it, printed after the name. */
    service?: string
    /** Icon class shown before the name. */
    icon?: string
    /** Milliseconds from the start of the trace. */
    start: number
    /** Milliseconds the span lasted. */
    duration: number
    /** Outcome of the span. Unset reads as ok. */
    status?: TraceSpanStatus
    /** One line about the outcome, shown in the details of a failed span. */
    message?: string
    /** Extra facts listed in the details. */
    attributes?: Record<string, string | number>
  }

  type Row = {
    span: TraceSpan
    depth: number
    parentId: string | null
    hasChildren: boolean
    expanded: boolean
    posinset: number
    setsize: number
    tone: 'root' | 'ok' | 'error' | 'running'
    offset: number
    width: number
    wide: boolean
    flip: boolean
  }

  defineOptions({
    name: 'Trace',
    inheritAttrs: false
  })

  interface Props {
    /** Spans of the trace, each `{ id, parentId?, name, service?, icon?, start, duration, status?, message?, attributes? }` in milliseconds. */
    spans?: TraceSpan[]
    /** Id of the span whose details show under the waterfall. Supports v-model:selected. */
    selected?: string
    /** Accessible name of the waterfall. Empty uses the locale catalog. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    spans: () => [],
    selected: '',
    ariaLabel: ''
  })

  const emit = defineEmits<{
    'update:selected': [id: string]
  }>()

  const attrs = useAttrs()
  const { t, locale } = useTranslate({ trace: en.trace })
  const uid = useId()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'code-trace'
  )
  const rootAttrs = computed(() =>
    Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'data-testid'))
  )

  const gridRef = ref<HTMLElement | null>(null)
  const dir = useDirection(gridRef)

  const current = ref<string>(props.selected)
  watch(
    () => props.selected,
    (next) => {
      current.value = next
    }
  )

  const search = ref<string>('')
  const collapsed = ref<Set<string>>(new Set())
  const focusedId = ref<string>('')

  const known = computed(() => new Set(props.spans.map((span) => span.id)))

  const childrenOf = computed(() => {
    const map = new Map<string | null, TraceSpan[]>()
    props.spans.forEach((span) => {
      const key = span.parentId && known.value.has(span.parentId) ? span.parentId : null
      const list = map.get(key) ?? []
      list.push(span)
      map.set(key, list)
    })
    map.forEach((list) => list.sort((a, b) => a.start - b.start))
    return map
  })

  const total = computed<number>(() =>
    Math.max(1, ...props.spans.map((span) => span.start + span.duration))
  )

  const term = computed<string>(() => search.value.trim().toLocaleLowerCase())

  const matches = (span: TraceSpan): boolean =>
    span.name.toLocaleLowerCase().includes(term.value) ||
    (span.service ?? '').toLocaleLowerCase().includes(term.value)

  const shown = computed<Set<string> | null>(() => {
    if (!term.value) return null
    const keep = new Set<string>()
    const visit = (span: TraceSpan): boolean => {
      const kids = (childrenOf.value.get(span.id) ?? []).map(visit)
      const hit = matches(span) || kids.some(Boolean)
      if (hit) keep.add(span.id)
      return hit
    }
    ;(childrenOf.value.get(null) ?? []).forEach(visit)
    return keep
  })

  const rows = computed<Row[]>(() => {
    const out: Row[] = []
    const walk = (parentId: string | null, depth: number): void => {
      const siblings = (childrenOf.value.get(parentId) ?? []).filter(
        (span) => !shown.value || shown.value.has(span.id)
      )
      siblings.forEach((span, index) => {
        const hasChildren = (childrenOf.value.get(span.id) ?? []).length > 0
        const expanded = hasChildren && (Boolean(shown.value) || !collapsed.value.has(span.id))
        const offset = Math.min(1, Math.max(0, span.start / total.value))
        const width = Math.max(span.duration / total.value, 0.006)
        let tone: Row['tone'] = depth === 0 ? 'root' : 'ok'
        if (span.status === 'error') tone = 'error'
        if (span.status === 'running') tone = 'running'
        out.push({
          span,
          depth,
          parentId,
          hasChildren,
          expanded,
          posinset: index + 1,
          setsize: siblings.length,
          tone,
          offset,
          width,
          wide: width >= 0.14,
          flip: width < 0.14 && offset + width > 0.8
        })
        if (expanded) walk(span.id, depth + 1)
      })
    }
    walk(null, 0)
    return out
  })

  const secondsFormat = computed(
    () =>
      new Intl.NumberFormat(locale.value, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  )

  const formatDuration = (ms: number): string =>
    ms >= 1000
      ? t('trace.seconds', { value: secondsFormat.value.format(ms / 1000) })
      : t('trace.milliseconds', { value: Math.round(ms) })

  const ticks = computed(() =>
    [0, 0.25, 0.5, 0.75, 1].map((at) => ({
      at,
      edge: at === 0 ? 'start' : at === 1 ? 'end' : null,
      label: formatDuration(total.value * at)
    }))
  )

  const tabStop = computed<string>(() => {
    const ids = rows.value.map((row) => row.span.id)
    if (ids.includes(focusedId.value)) return focusedId.value
    if (ids.includes(current.value)) return current.value
    return ids[0] ?? ''
  })

  const detail = computed<TraceSpan | null>(
    () => props.spans.find((span) => span.id === current.value) ?? null
  )

  const detailFacts = computed(() => {
    const span = detail.value
    if (!span) return []
    const facts = [
      { label: t('trace.startedAt'), value: `+${formatDuration(span.start)}` },
      { label: t('trace.duration'), value: formatDuration(span.duration) },
      {
        label: t('trace.share'),
        value: t('trace.percent', { value: Math.round((span.duration / total.value) * 100) })
      }
    ]
    if (span.service) facts.unshift({ label: t('trace.service'), value: span.service })
    return facts
  })

  const detailAttributes = computed(() =>
    Object.entries(detail.value?.attributes ?? {}).map(([key, value]) => ({
      key,
      value: String(value)
    }))
  )

  const setSelected = (id: string): void => {
    current.value = id
    emit('update:selected', id)
  }

  const rowElement = (id: string): HTMLElement | null =>
    gridRef.value?.querySelector<HTMLElement>(`[data-span-id="${CSS.escape(id)}"]`) ?? null

  const focusRow = async (id: string): Promise<void> => {
    focusedId.value = id
    await nextTick()
    rowElement(id)?.focus()
  }

  const toggle = (row: Row): void => {
    if (!row.hasChildren || shown.value) return
    const next = new Set(collapsed.value)
    if (next.has(row.span.id)) next.delete(row.span.id)
    else next.add(row.span.id)
    collapsed.value = next
  }

  const select = (row: Row): void => {
    focusedId.value = row.span.id
    setSelected(current.value === row.span.id ? '' : row.span.id)
  }

  const close = (): void => {
    const id = current.value
    setSelected('')
    if (id && rows.value.some((row) => row.span.id === id)) void focusRow(id)
  }

  const onKeydown = (event: KeyboardEvent, index: number): void => {
    const row = rows.value[index]
    if (!row) return
    const key = logicalArrowKey(event.key, dir.value)
    const go = (target: Row | undefined): void => {
      event.preventDefault()
      if (target) void focusRow(target.span.id)
    }
    switch (key) {
      case 'ArrowDown':
        return go(rows.value[index + 1])
      case 'ArrowUp':
        return go(rows.value[index - 1])
      case 'Home':
        return go(rows.value[0])
      case 'End':
        return go(rows.value[rows.value.length - 1])
      case 'ArrowRight':
        event.preventDefault()
        if (row.hasChildren && !row.expanded) toggle(row)
        else if (row.expanded) void focusRow(rows.value[index + 1]?.span.id ?? row.span.id)
        return
      case 'ArrowLeft':
        event.preventDefault()
        if (row.expanded && !shown.value) toggle(row)
        else if (row.parentId) void focusRow(row.parentId)
        return
      case 'Enter':
      case ' ':
        event.preventDefault()
        select(row)
        return
      default:
    }
  }

  const statusLabel = (status?: TraceSpanStatus): string => {
    if (status === 'error') return t('trace.failed')
    if (status === 'running') return t('trace.running')
    return ''
  }

  const rowLabel = (row: Row): string =>
    [
      row.span.name,
      row.span.service ?? '',
      `+${formatDuration(row.span.start)}`,
      formatDuration(row.span.duration),
      statusLabel(row.span.status)
    ]
      .filter(Boolean)
      .join(', ')

  const detailId = `${uid}-detail`
</script>

<template>
  <div
    v-bind="rootAttrs"
    :data-testid="testId"
    class="@container/trace flex w-full min-w-0 flex-col overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface)"
  >
    <div
      class="[--trace-name:9rem] @xl/trace:[--trace-name:13rem] @3xl/trace:[--trace-name:16rem] @5xl/trace:[--trace-name:20rem] grid grid-cols-[var(--trace-name)_minmax(0,1fr)] items-stretch border-b border-(--border-muted)"
    >
      <div class="border-e border-(--border-muted) p-(--spacing-xs)">
        <Input
          v-model="search"
          size="medium"
          :placeholder="t('trace.search')"
          :aria-label="t('trace.search')"
          :data-testid="`${testId}__search`"
          class="w-full"
        >
          <template #iconLeft>
            <i
              class="pi pi-search text-(--text-muted)"
              aria-hidden="true"
            />
          </template>
        </Input>
      </div>
      <div
        class="flex items-center px-(--spacing-md)"
        aria-hidden="true"
      >
        <div
          class="relative h-(--size-10) w-full"
          :data-testid="`${testId}__axis`"
        >
          <span
            v-for="tick in ticks"
            :key="tick.at"
            :data-edge="tick.edge"
            :style="{ '--tick-at': `${tick.at * 100}%` }"
            class="absolute inset-y-0 start-(--tick-at) flex w-0 items-center justify-center data-[edge=end]:justify-end data-[edge=start]:justify-start"
          >
            <span class="text-label-sm whitespace-nowrap text-(--text-muted) tabular-nums">{{
              tick.label
            }}</span>
          </span>
        </div>
      </div>
    </div>

    <div class="relative">
      <div
        aria-hidden="true"
        class="[--trace-name:9rem] @xl/trace:[--trace-name:13rem] @3xl/trace:[--trace-name:16rem] @5xl/trace:[--trace-name:20rem] pointer-events-none absolute inset-y-0 start-[calc(var(--trace-name)+var(--spacing-md))] end-(--spacing-md) hidden @xl/trace:block"
      >
        <span class="absolute inset-y-0 start-1/4 w-px bg-(--border-muted)" />
        <span class="absolute inset-y-0 start-1/2 w-px bg-(--border-muted)" />
        <span class="absolute inset-y-0 start-3/4 w-px bg-(--border-muted)" />
      </div>

      <div
        v-if="rows.length"
        ref="gridRef"
        role="treegrid"
        :aria-label="ariaLabel || t('trace.label')"
        :aria-describedby="detail ? detailId : undefined"
        :data-testid="`${testId}__grid`"
        class="relative flex flex-col"
      >
        <div
          v-for="(row, index) in rows"
          :key="row.span.id"
          role="row"
          :tabindex="row.span.id === tabStop ? 0 : -1"
          :aria-level="row.depth + 1"
          :aria-posinset="row.posinset"
          :aria-setsize="row.setsize"
          :aria-expanded="row.hasChildren ? row.expanded : undefined"
          :aria-selected="row.span.id === current"
          :aria-label="rowLabel(row)"
          :data-span-id="row.span.id"
          :data-selected="row.span.id === current || null"
          :data-testid="`${testId}__row`"
          :style="{
            '--span-offset': String(row.offset),
            '--span-width': String(row.width),
            '--span-depth': String(row.depth)
          }"
          class="[--trace-name:9rem] @xl/trace:[--trace-name:13rem] @3xl/trace:[--trace-name:16rem] @5xl/trace:[--trace-name:20rem] grid min-h-9 w-full cursor-pointer grid-cols-[var(--trace-name)_minmax(0,1fr)] items-stretch border-b border-(--border-muted) text-start transition-colors duration-150 ease-out last:border-b-0 hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:outline-none focus-visible:ring-inset data-selected:bg-(--bg-selected) motion-reduce:transition-none pointer-coarse:min-h-11"
          @click="select(row)"
          @focus="focusedId = row.span.id"
          @keydown="onKeydown($event, index)"
        >
          <span
            role="gridcell"
            class="flex min-w-0 items-center gap-(--spacing-xxs) border-e border-(--border-muted) py-(--spacing-xs) ps-[calc(var(--spacing-xs)+var(--span-depth)*var(--spacing-md))] pe-(--spacing-sm)"
          >
            <span
              v-if="row.hasChildren"
              :data-testid="`${testId}__toggle`"
              class="flex size-5 shrink-0 items-center justify-center rounded-(--shape-button) text-(--text-muted) hover:bg-(--bg-active) hover:text-(--text-default)"
              aria-hidden="true"
              @click.stop="toggle(row)"
            >
              <i
                :class="
                  row.expanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right rtl:-scale-x-100'
                "
                class="text-[0.7em]"
              />
            </span>
            <span
              v-else
              class="size-5 shrink-0"
              aria-hidden="true"
            />
            <i
              v-if="row.span.icon"
              :class="row.span.icon"
              class="shrink-0 text-[0.9em] leading-none text-(--text-muted)"
              aria-hidden="true"
            />
            <span class="truncate text-body-code-sm text-(--text-default)"
              ><bdi>{{ row.span.name }}</bdi></span
            >
            <span
              v-if="row.span.service"
              class="hidden shrink-0 truncate text-label-sm text-(--text-muted) @3xl/trace:block"
              ><bdi>{{ row.span.service }}</bdi></span
            >
            <i
              v-if="row.span.status === 'error'"
              class="pi pi-exclamation-circle ms-auto shrink-0 text-(--danger-contrast)"
              aria-hidden="true"
            />
          </span>
          <span
            role="gridcell"
            class="flex items-center px-(--spacing-md) py-(--spacing-xs)"
          >
            <span class="relative h-(--size-6) w-full">
              <span
                :data-tone="row.tone"
                :data-testid="`${testId}__bar`"
                class="absolute inset-y-0 start-[calc(var(--span-offset)*100%)] w-[calc(var(--span-width)*100%)] rounded-(--shape-button) border data-[tone=error]:border-(--danger-border) data-[tone=error]:bg-(--danger) data-[tone=ok]:border-(--success-border) data-[tone=ok]:bg-(--success) data-[tone=root]:border-(--info-border) data-[tone=root]:bg-(--info) data-[tone=running]:border-(--warning-border) data-[tone=running]:bg-(--warning)"
              >
                <span
                  :data-tone="row.tone"
                  :data-wide="row.wide || null"
                  :data-flip="row.flip || null"
                  class="pointer-events-none absolute start-full top-1/2 ms-(--spacing-xxs) -translate-y-1/2 text-label-sm whitespace-nowrap tabular-nums data-flip:start-auto data-flip:end-full data-flip:ms-0 data-flip:me-(--spacing-xxs) data-wide:start-(--spacing-xs) data-wide:ms-0 data-[tone=error]:text-(--danger-contrast) data-[tone=ok]:text-(--success-contrast) data-[tone=root]:text-(--info-contrast) data-[tone=running]:text-(--warning-contrast)"
                  aria-hidden="true"
                  >{{ formatDuration(row.span.duration) }}</span
                >
              </span>
            </span>
          </span>
        </div>
      </div>

      <div
        v-else
        class="flex min-h-(--size-20) flex-col items-center justify-center gap-(--spacing-xs) p-(--spacing-md)"
        :data-testid="`${testId}__empty`"
      >
        <p
          v-if="term"
          class="text-body-sm text-(--text-muted)"
        >
          {{ t('trace.noMatch', { query: search.trim() }) }}
        </p>
        <p
          v-else
          class="text-body-sm text-(--text-muted)"
        >
          {{ t('trace.empty') }}
        </p>
        <Button
          v-if="term"
          :label="t('trace.clearSearch')"
          kind="transparent"
          size="medium"
          @click="search = ''"
        />
      </div>
    </div>

    <section
      v-if="detail"
      :id="detailId"
      :aria-label="t('trace.details', { name: detail.name })"
      :data-testid="`${testId}__detail`"
      class="flex flex-col gap-(--spacing-sm) border-t border-(--border-muted) bg-(--bg-canvas) px-(--spacing-md) py-(--spacing-sm)"
    >
      <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
        <i
          v-if="detail.icon"
          :class="detail.icon"
          class="shrink-0 text-[0.9em] leading-none text-(--text-muted)"
          aria-hidden="true"
        />
        <span class="truncate text-body-code-sm text-(--text-default)"
          ><bdi>{{ detail.name }}</bdi></span
        >
        <Tag
          v-if="detail.status === 'error'"
          key="failed"
          severity="danger"
          :label="t('trace.failed')"
          size="small"
        />
        <Tag
          v-else-if="detail.status === 'running'"
          key="running"
          severity="warning"
          :label="t('trace.running')"
          size="small"
        />
        <CopyButton
          :value="detail.name"
          :aria-label="t('trace.copyName')"
          kind="outlined"
          class="shrink-0"
        />
        <span class="ms-auto flex">
          <Button
            :label="t('trace.close')"
            :data-testid="`${testId}__close`"
            kind="transparent"
            size="medium"
            @click="close"
          />
        </span>
      </div>

      <dl class="m-0 grid grid-cols-2 gap-(--spacing-sm) @xl/trace:grid-cols-4">
        <div
          v-for="fact in detailFacts"
          :key="fact.label"
          class="flex min-w-0 flex-col gap-(--spacing-xxs)"
        >
          <dt class="text-label-sm text-(--text-muted)">{{ fact.label }}</dt>
          <dd class="m-0 truncate text-body-sm text-(--text-default) tabular-nums">
            {{ fact.value }}
          </dd>
        </div>
      </dl>

      <p
        v-if="detail.message"
        class="text-body-sm text-(--danger-contrast)"
      >
        {{ detail.message }}
      </p>

      <div
        v-if="detailAttributes.length"
        class="flex flex-col gap-(--spacing-xs) border-t border-(--border-muted) pt-(--spacing-sm)"
      >
        <p class="text-label-sm text-(--text-default)">{{ t('trace.attributes') }}</p>
        <dl
          class="m-0 grid grid-cols-[minmax(0,10rem)_minmax(0,1fr)] gap-x-(--spacing-md) gap-y-(--spacing-xxs)"
        >
          <template
            v-for="item in detailAttributes"
            :key="item.key"
          >
            <dt class="truncate text-label-sm text-(--text-muted)">
              <bdi>{{ item.key }}</bdi>
            </dt>
            <dd class="m-0 min-w-0 text-label-code-sm break-words text-(--text-default)">
              <bdi>{{ item.value }}</bdi>
            </dd>
          </template>
        </dl>
      </div>
    </section>
  </div>
</template>
