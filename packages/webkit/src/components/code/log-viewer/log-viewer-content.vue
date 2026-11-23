<script setup lang="ts">
  import { computed, h, ref, useAttrs, watch } from 'vue'

  import { useLazyChunks } from '../../../composables/use-lazy-chunks'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Button from '../../action/button/button.vue'
  import CopyButton from '../../action/copy-button/copy-button.vue'
  import Alert from '../../feedback/alert/alert.vue'
  import EmptyState from '../../feedback/empty-state/empty-state.vue'
  import Spinner from '../../feedback/spinner/spinner.vue'
  import ScrollArea from '../../layout/scroll-area/scroll-area.vue'
  import { formatLogLineText } from './composables/format-log-line-text'
  import { splitTextByQuery } from './composables/split-text-by-query'
  import { useLogViewerContext } from './composables/use-log-viewer-context'
  import type { LogViewerLine } from './injection-key'

  defineOptions({
    name: 'LogViewerContent',
    inheritAttrs: false
  })

  defineSlots<{
    empty(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ logViewer: en.logViewer })
  const ctx = useLogViewerContext()

  const searchQuery = computed(() => ctx.search.value.trim())

  const { split, observe } = useLazyChunks({ rowHeight: 24, release: true })
  const chunks = computed(() => split(ctx.filteredLines.value))

  const announced = ref<{ id: string; text: string }[]>([])

  const snapshot = (lines: LogViewerLine[]) => ({
    length: lines.length,
    firstId: lines[0]?.id,
    lastId: lines[lines.length - 1]?.id
  })

  let seen = snapshot(ctx.lines.value)

  watch(
    () => [ctx.lines.value, ctx.lines.value.length] as const,
    ([next]) => {
      const previous = seen
      seen = snapshot(next)
      const appended =
        previous.length > 0 &&
        next.length > previous.length &&
        next[0]?.id === previous.firstId &&
        next[previous.length - 1]?.id === previous.lastId
      if (!appended) {
        announced.value = []
        return
      }
      const added = new Set(next.slice(previous.length).map((line) => line.id))
      announced.value = ctx.filteredLines.value
        .filter((line) => added.has(line.id))
        .map((line) => ({ id: line.id, text: formatLogLineText(line) }))
    }
  )

  const emptyTitle = computed(() => {
    if (ctx.lines.value.length === 0) return t('logViewer.noLines')
    if (searchQuery.value) return t('logViewer.noMatch', { query: searchQuery.value })
    return t('logViewer.empty')
  })

  const columns = computed(() => {
    let time = 0
    let level = 0
    for (const line of ctx.lines.value) {
      time = Math.max(time, line.time.length)
      level = Math.max(level, line.level?.length ?? 0)
    }
    return { time, level }
  })

  const width = (length: number) =>
    `calc(${length} * (1ch + var(--text-label-code-sm-letter-spacing)))`

  const Highlight = (props: { text: string }) =>
    splitTextByQuery(props.text, searchQuery.value).map((segment) =>
      segment.match
        ? h(
            'mark',
            {
              class:
                'rounded-(--shape-control) bg-(--bg-selected) text-inherit motion-reduce:transition-none'
            },
            segment.text
          )
        : segment.text
    )

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'log-viewer-content'
  )

  const LINE_CLASS =
    'text-label-code-sm relative flex gap-(--spacing-md) border-s-2 border-s-transparent px-(--spacing-md) py-(--spacing-2xs) transition-colors duration-150 ease-out ' +
    "before:pointer-events-none before:absolute before:inset-0 before:bg-(--bg-hover) before:opacity-0 before:transition-opacity before:duration-150 before:ease-out before:content-[''] " +
    'hover:border-s-(--ring-color) hover:bg-(--bg-surface-raised) hover:before:opacity-100 ' +
    'data-[level=warn]:bg-(--warning) data-[level=warn]:hover:bg-(--warning) data-[level=error]:bg-(--danger) data-[level=error]:hover:bg-(--danger) ' +
    'motion-reduce:transition-none motion-reduce:before:transition-none'

  const LINE_LEVEL_CLASS =
    'relative z-1 w-(--log-viewer-level-width) shrink-0 uppercase text-(--text-muted) ' +
    'data-[level=error]:text-(--danger-foreground) data-[level=info]:text-(--info-foreground) data-[level=warn]:text-(--warning-foreground)'

  const LINE_MESSAGE_CLASS =
    'relative z-1 flex min-w-0 flex-1 items-center gap-(--spacing-xs) text-(--text-default) ' +
    'data-[level=error]:text-(--danger-foreground) ' +
    'data-[type=success]:gap-(--spacing-xs) ' +
    'data-[level=warn]:text-(--warning-foreground) ' +
    'max-sm:whitespace-nowrap'
</script>

<template>
  <div
    v-bind="attrs"
    :data-testid="testId"
    :data-copyable="(ctx.copyable.value && !ctx.loading.value && !ctx.error.value) || null"
    class="relative min-h-0 flex-1 data-[copyable]:min-h-13"
  >
    <div
      v-if="ctx.copyable.value && !ctx.loading.value && !ctx.error.value"
      class="absolute end-(--spacing-sm) top-(--spacing-sm) z-3"
      :data-testid="`${ctx.testId.value}__copy-anchor`"
    >
      <CopyButton
        :value="ctx.copyText.value"
        variant="outline"
        size="small"
        :ariaLabel="t('logViewer.copy')"
        :copiedLabel="t('logViewer.copied')"
        :disabled="!ctx.canCopy.value"
        :data-testid="`${ctx.testId.value}__copy`"
        @copy="ctx.emitCopy"
      />
    </div>

    <div
      role="log"
      aria-live="polite"
      :data-testid="`${testId}__announcer`"
      class="sr-only"
    >
      <div
        v-for="entry in announced"
        :key="entry.id"
      >
        {{ entry.text }}
      </div>
    </div>

    <div
      v-if="ctx.loading.value"
      role="status"
      aria-live="polite"
      :data-testid="`${testId}__loading`"
      class="flex h-full min-h-0 flex-col items-center justify-center gap-(--spacing-md) bg-(--bg-canvas) py-(--spacing-xl)"
    >
      <Spinner class="size-6 text-(--text-default)" />
      <span class="text-label-code-sm text-(--text-muted)">
        {{ ctx.loadingLabel.value }}
      </span>
    </div>

    <div
      v-else-if="ctx.error.value"
      :data-testid="`${testId}__error`"
      class="bg-(--bg-canvas) p-(--spacing-md)"
    >
      <Alert
        severity="danger"
        :label="ctx.error.value"
      />
    </div>

    <ScrollArea
      v-else
      orientation="both"
      fade
      :data-testid="`${testId}__body`"
      dir="ltr"
      class="h-full min-h-0 bg-(--bg-canvas) sm:data-[orientation=both]:overflow-x-hidden"
    >
      <template v-if="ctx.filteredLines.value.length">
        <div
          class="max-sm:min-w-max"
          :style="{
            '--log-viewer-time-width': width(columns.time),
            '--log-viewer-level-width': width(columns.level)
          }"
        >
          <template
            v-for="chunk in chunks"
            :key="chunk.index"
          >
            <div
              v-if="!chunk.mounted"
              :ref="(el) => observe(el, chunk.index)"
              :data-chunk="chunk.index"
              aria-hidden="true"
              :style="{ height: `${chunk.estimatedHeight}px` }"
            />
            <div
              v-else
              :ref="(el) => observe(el, chunk.index)"
              :data-chunk="chunk.index"
              :data-chunk-count="chunk.items.length"
            >
              <div
                v-for="line in chunk.items"
                :key="line.id"
                :data-testid="`${ctx.testId.value}__line`"
                :data-type="line.type"
                :data-level="line.level"
                :class="LINE_CLASS"
              >
                <span
                  v-if="columns.time"
                  :data-testid="`${ctx.testId.value}__line-time`"
                  :data-level="line.level"
                  dir="ltr"
                  class="relative z-1 w-(--log-viewer-time-width) shrink-0 text-end whitespace-nowrap tabular-nums text-(--text-muted) data-[level=error]:text-(--text-default)"
                >
                  {{ line.time }}
                </span>

                <span
                  v-if="columns.level"
                  :data-testid="`${ctx.testId.value}__line-level`"
                  :data-level="line.level"
                  dir="ltr"
                  :class="LINE_LEVEL_CLASS"
                >
                  {{ line.level }}
                </span>

                <span
                  v-if="line.type !== 'folder'"
                  :data-testid="`${ctx.testId.value}__line-message`"
                  dir="auto"
                  :class="LINE_MESSAGE_CLASS"
                  :data-type="line.type"
                  :data-level="line.level"
                >
                  <template v-if="line.type === 'framework-version'">
                    <span class="shrink-0 whitespace-nowrap">
                      <Highlight :text="line.message" />
                    </span>
                    <span
                      v-if="line.suffix"
                      class="shrink-0 whitespace-nowrap text-(--warning-foreground)"
                    >
                      <Highlight :text="line.suffix" />
                    </span>
                  </template>

                  <template v-else-if="line.type === 'success'">
                    <span
                      v-if="!line.message.includes('✔') && !line.message.includes('✓')"
                      class="shrink-0 whitespace-nowrap"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                    <span
                      class="min-w-0 max-sm:whitespace-nowrap break-words whitespace-pre-wrap text-(--success-foreground)"
                    >
                      <Highlight :text="line.message" />
                    </span>
                  </template>

                  <template v-else>
                    <span class="min-w-0 max-sm:whitespace-nowrap break-words">
                      <Highlight :text="line.message" />
                    </span>
                  </template>
                </span>

                <template v-else>
                  <span
                    :data-testid="`${ctx.testId.value}__line-message`"
                    dir="auto"
                    class="relative z-1 flex min-w-0 flex-1 items-center gap-(--spacing-xl) text-(--text-default) max-sm:whitespace-nowrap"
                  >
                    <span class="min-w-16 shrink-0 whitespace-nowrap">
                      <Highlight :text="line.message" />
                    </span>
                    <span
                      v-if="line.folderType"
                      class="shrink-0 whitespace-nowrap text-(--warning-foreground)"
                    >
                      <Highlight :text="line.folderType" />
                    </span>

                    <span
                      v-if="line.size"
                      :data-testid="`${ctx.testId.value}__line-size`"
                      class="flex shrink-0 items-center gap-(--spacing-sm) whitespace-nowrap tabular-nums"
                    >
                      <span>
                        <Highlight :text="line.size" />
                      </span>
                      <span
                        class="text-(--text-muted)"
                        aria-hidden="true"
                        >|</span
                      >
                      <span class="text-(--text-muted)">{{ t('logViewer.gzip') }}</span>
                      <span>
                        <Highlight :text="line.gzipSize ?? ''" />
                      </span>
                    </span>
                  </span>
                </template>
              </div>
            </div>
          </template>
        </div>
      </template>

      <div
        v-else
        :data-testid="`${ctx.testId.value}__empty`"
        class="px-(--spacing-md) py-(--spacing-sm)"
      >
        <slot name="empty">
          <EmptyState
            size="small"
            :icon="searchQuery ? 'az az-search' : 'az az-align-left'"
            :title="emptyTitle"
          >
            <template
              v-if="searchQuery"
              #actions
            >
              <Button
                :label="t('logViewer.clearSearch')"
                variant="ghost"
                size="medium"
                :disabled="ctx.disabled.value"
                @click="ctx.setSearch('')"
              />
            </template>
          </EmptyState>
        </slot>
      </div>
    </ScrollArea>
  </div>
</template>
