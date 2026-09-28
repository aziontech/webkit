<script setup>
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import CopyButton from '@aziontech/webkit/copy-button'
  import InputText from '@aziontech/webkit/input-text'
  import Tag from '@aziontech/webkit/tag'
  import { computed, ref } from 'vue'

  import { formatDuration, spanKind } from './run-trace.js'

  defineOptions({ inheritAttrs: false })

  const props = defineProps({
    /** The run's spans — `{ id, name, kind, depth, start, duration, status?, message? }[]`. */
    spans: { type: Array, required: true },
    /** The run's total duration in milliseconds; every bar is placed against it. */
    total: { type: Number, required: true }
  })

  /** The span the detail band reports, by id. Empty when nothing is selected. */
  const selected = defineModel('selected', { type: String, default: '' })

  const search = ref('')

  const WIDE_ENOUGH = 0.14
  const MIN_BAR = 0.006

  const toneOf = (span) => {
    if (span.status === 'error') return 'error'
    if (span.status === 'running') return 'running'
    return span.depth === 0 ? 'root' : 'ok'
  }

  const rows = computed(() => {
    const term = search.value.trim().toLowerCase()
    const span = props.total || 1
    return props.spans
      .filter((entry) => !term || entry.name.toLowerCase().includes(term))
      .map((entry) => ({
        ...entry,
        tone: toneOf(entry),
        offset: entry.start / span,
        width: Math.max(entry.duration / span, MIN_BAR),
        wide: entry.duration / span >= WIDE_ENOUGH
      }))
  })

  const ticks = computed(() =>
    [0, 0.25, 0.5, 0.75, 1].map((at) => ({ at, label: formatDuration(props.total * at) }))
  )

  const detail = computed(() => props.spans.find((entry) => entry.id === selected.value) ?? null)

  const detailFacts = computed(() => {
    const span = detail.value
    if (!span) return []
    return [
      { label: 'Type', value: spanKind(span).label },
      { label: 'Started at', value: `+${formatDuration(span.start)}` },
      { label: 'Duration', value: formatDuration(span.duration) },
      { label: 'Share of run', value: `${Math.round((span.duration / (props.total || 1)) * 100)}%` }
    ]
  })

  const select = (id) => {
    selected.value = selected.value === id ? '' : id
  }
</script>

<template>
  <CardBox
    v-bind="$attrs"
    :padded="false"
    class="@container"
  >
    <template #content>
      <div
        class="[--trace-name:9rem] @xl:[--trace-name:13rem] @3xl:[--trace-name:16rem] @5xl:[--trace-name:20rem]"
      >
        <div
          class="grid grid-cols-[var(--trace-name)_minmax(0,1fr)] items-stretch border-b border-(--border-muted)"
        >
          <div class="border-r border-(--border-muted) p-(--spacing-xs)">
            <InputText
              v-model="search"
              size="medium"
              placeholder="Search spans"
              aria-label="Search spans"
              class="w-full"
            >
              <template #iconLeft>
                <i
                  class="pi pi-search"
                  aria-hidden="true"
                />
              </template>
            </InputText>
          </div>

          <div class="flex items-center px-(--spacing-md)">
            <div class="relative h-(--size-10) w-full">
              <span
                v-for="tick in ticks"
                :key="tick.at"
                :data-edge="tick.at === 0 ? 'start' : tick.at === 1 ? 'end' : null"
                :style="{ '--tick-at': `${tick.at * 100}%` }"
                class="absolute top-1/2 left-(--tick-at) -translate-x-1/2 -translate-y-1/2 text-label-sm tabular-nums whitespace-nowrap text-(--text-muted) data-[edge=start]:translate-x-0 data-[edge=end]:-translate-x-full"
              >
                {{ tick.label }}
              </span>
            </div>
          </div>
        </div>

        <div class="relative">
          <div
            aria-hidden="true"
            class="pointer-events-none absolute inset-y-0 right-(--spacing-md) left-[calc(var(--trace-name)+var(--spacing-md))] hidden @xl:block"
          >
            <span class="absolute inset-y-0 left-1/4 w-px bg-(--border-muted)" />
            <span class="absolute inset-y-0 left-1/2 w-px bg-(--border-muted)" />
            <span class="absolute inset-y-0 left-3/4 w-px bg-(--border-muted)" />
          </div>

          <button
            v-for="row in rows"
            :key="row.id"
            type="button"
            :data-selected="row.id === selected || null"
            :style="{
              '--span-offset': String(row.offset),
              '--span-width': String(row.width),
              '--span-depth': String(row.depth)
            }"
            :aria-pressed="row.id === selected"
            class="group relative grid w-full grid-cols-[var(--trace-name)_minmax(0,1fr)] items-stretch border-b border-(--border-muted) text-left transition-colors duration-150 ease-out last:border-b-0 hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset focus-visible:outline-none data-selected:bg-(--bg-selected) motion-reduce:transition-none"
            @click="select(row.id)"
          >
            <span
              class="flex min-w-0 items-center gap-(--spacing-xs) border-r border-(--border-muted) py-(--spacing-xs) pe-(--spacing-sm) ps-[calc(var(--spacing-md)+var(--span-depth)*var(--spacing-sm))]"
            >
              <i
                :class="spanKind(row).icon"
                class="shrink-0 text-[0.9em] leading-none text-(--text-muted)"
                aria-hidden="true"
              />
              <span class="truncate font-mono text-body-xs text-(--text-default)">{{
                row.name
              }}</span>
              <span
                class="ms-auto hidden shrink-0 text-label-sm tabular-nums text-(--text-muted) @3xl:block"
              >
                {{ formatDuration(row.duration) }}
              </span>
            </span>

            <span class="flex items-center px-(--spacing-md) py-(--spacing-xs)">
              <span class="relative h-(--size-6) w-full">
                <span
                  :data-tone="row.tone"
                  class="absolute inset-y-0 left-[calc(var(--span-offset)*100%)] w-[calc(var(--span-width)*100%)] rounded-(--shape-button) border data-[tone=root]:border-(--info-border) data-[tone=root]:bg-(--info) data-[tone=ok]:border-(--success-border) data-[tone=ok]:bg-(--success) data-[tone=error]:border-(--danger-border) data-[tone=error]:bg-(--danger) data-[tone=running]:animate-pulse data-[tone=running]:border-(--warning-border) data-[tone=running]:bg-(--warning) motion-reduce:animate-none"
                >
                  <span
                    :data-tone="row.tone"
                    :data-wide="row.wide || null"
                    class="pointer-events-none absolute top-1/2 left-full ms-(--spacing-xxs) -translate-y-1/2 text-label-sm tabular-nums whitespace-nowrap data-[tone=root]:text-(--info-contrast) data-[tone=ok]:text-(--success-contrast) data-[tone=error]:text-(--danger-contrast) data-[tone=running]:text-(--warning-contrast) data-wide:left-(--spacing-xs) data-wide:ms-0"
                  >
                    {{ formatDuration(row.duration) }}
                  </span>
                </span>
              </span>
            </span>
          </button>

          <div
            v-if="!rows.length"
            class="flex min-h-(--size-20) flex-col items-center justify-center gap-(--spacing-xs) p-(--spacing-md)"
          >
            <p class="text-body-sm text-(--text-muted)">No span matches “{{ search }}”.</p>
            <Button
              label="Clear search"
              kind="text"
              size="medium"
              @click="search = ''"
            />
          </div>
        </div>

        <div
          v-if="detail"
          class="flex flex-col gap-(--spacing-sm) border-t border-(--border-muted) bg-(--bg-canvas) px-(--spacing-md) py-(--spacing-sm)"
        >
          <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
            <i
              :class="spanKind(detail).icon"
              class="shrink-0 text-[0.9em] leading-none text-(--text-muted)"
              aria-hidden="true"
            />
            <span class="truncate font-mono text-body-sm text-(--text-default)">
              {{ detail.name }}
            </span>
            <Tag
              key="tag-1"
              v-if="detail.status === 'error'"
              severity="danger"
              label="Failed"
              size="small"
            />
            <Tag
              key="tag-2"
              v-else-if="detail.status === 'running'"
              severity="warning"
              label="Running"
              size="small"
            />
            <CopyButton
              kind="outlined"
              :value="detail.name"
              aria-label="Copy span name"
              class="shrink-0"
            />
            <Button
              label="Close"
              kind="text"
              size="medium"
              class="ms-auto"
              @click="selected = ''"
            />
          </div>

          <div class="grid grid-cols-2 gap-(--spacing-sm) @xl:grid-cols-4">
            <div
              v-for="fact in detailFacts"
              :key="fact.label"
              class="flex min-w-0 flex-col gap-(--spacing-xxs)"
            >
              <span class="text-label-sm text-(--text-muted)">{{ fact.label }}</span>
              <span class="truncate text-body-sm tabular-nums text-(--text-default)">
                {{ fact.value }}
              </span>
            </div>
          </div>

          <p
            v-if="detail.message"
            class="text-body-sm text-(--danger-contrast)"
          >
            {{ detail.message }}
          </p>
        </div>
      </div>
    </template>
  </CardBox>
</template>
