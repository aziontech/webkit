<script setup lang="ts">
  import { computed, ref, useAttrs, watch } from 'vue'

  import { useLazyChunks } from '../../../composables/use-lazy-chunks'
  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import Button from '../../actions/button/button.vue'
  import CopyButton from '../../actions/copy-button/copy-button.vue'
  import Alert from '../../feedback/alert/alert.vue'
  import EmptyState from '../../feedback/empty-state/empty-state.vue'
  import ScrollArea from '../../layout/scroll-area/scroll-area.vue'
  import Spinner from '../../utils/spinner/spinner.vue'
  import { formatLogLineText } from './composables/format-log-line-text'
  import { splitTextByQuery } from './composables/split-text-by-query'
  import { useLogViewContext } from './composables/use-log-view-context'
  import type { LogViewLine } from './injection-key'

  defineOptions({
    name: 'LogViewContent',
    inheritAttrs: false
  })

  defineSlots<{
    empty(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ logView: en.logView })
  const ctx = useLogViewContext()

  const searchQuery = computed(() => ctx.search.value.trim())

  const { split, observe } = useLazyChunks({ rowHeight: 24, release: true })
  const chunks = computed(() => split(ctx.filteredLines.value))

  const announced = ref<{ id: string; text: string }[]>([])

  const snapshot = (lines: LogViewLine[]) => ({
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
    if (ctx.lines.value.length === 0) return t('logView.noLines')
    if (searchQuery.value) return t('logView.noMatch', { query: searchQuery.value })
    return t('logView.empty')
  })

  const segmentsFor = (text: string) => splitTextByQuery(text, searchQuery.value)

  const highlightMarkClass =
    'rounded-(--shape-elements) bg-(--bg-selected) text-inherit motion-reduce:transition-none'

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId.value}__content`
  )
</script>

<template>
  <div
    v-bind="attrs"
    :data-testid="testId"
    class="relative min-h-0 flex-1"
  >
    <div
      v-if="ctx.copyable.value && !ctx.loading.value && !ctx.error.value"
      class="absolute end-(--spacing-sm) top-(--spacing-sm) z-3"
      :data-testid="`${ctx.testId.value}__copy-anchor`"
    >
      <CopyButton
        :value="ctx.copyText.value"
        kind="outlined"
        size="small"
        :ariaLabel="t('logView.copy')"
        :copiedLabel="t('logView.copied')"
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
      class="h-full min-h-0 bg-(--bg-canvas) sm:data-[orientation=both]:overflow-x-hidden"
    >
      <template v-if="ctx.filteredLines.value.length">
        <div class="max-sm:min-w-max">
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
                class="text-label-code-sm relative flex gap-(--spacing-md) border-s-2 border-s-transparent px-(--spacing-md) py-(--spacing-xxs) transition-colors duration-150 ease-out before:pointer-events-none before:absolute before:inset-0 before:bg-(--bg-hover) before:opacity-0 before:transition-opacity before:duration-150 before:ease-out before:content-[''] hover:border-s-(--ring-color) hover:bg-(--bg-surface-raised) hover:before:opacity-100 data-[type=warning]:bg-(--warning) data-[type=warning]:hover:bg-(--warning) data-[level=warn]:bg-(--warning) data-[level=warn]:hover:bg-(--warning) data-[level=error]:bg-(--danger) data-[level=error]:hover:bg-(--danger) motion-reduce:transition-none motion-reduce:before:transition-none"
              >
                <span
                  v-if="line.time"
                  :data-testid="`${ctx.testId.value}__line-time`"
                  :data-level="line.level"
                  dir="ltr"
                  class="relative z-1 shrink-0 text-(--text-muted) data-[level=error]:text-(--text-default)"
                >
                  {{ line.time }}
                </span>

                <span
                  v-if="line.level"
                  :data-testid="`${ctx.testId.value}__line-level`"
                  :data-level="line.level"
                  dir="ltr"
                  class="relative z-1 w-12 shrink-0 uppercase text-(--text-muted) data-[level=error]:text-(--danger-contrast) data-[level=info]:text-(--info-contrast) data-[level=warn]:text-(--warning-contrast)"
                >
                  {{ line.level }}
                </span>

                <span
                  v-if="line.type !== 'folder'"
                  :data-testid="`${ctx.testId.value}__line-message`"
                  dir="auto"
                  class="relative z-1 flex min-w-0 flex-1 items-center gap-(--spacing-xs) text-(--text-default) data-[level=error]:text-(--danger-contrast) data-[type=success]:gap-(--spacing-xs) data-[type=warning]:text-(--warning-contrast) max-sm:whitespace-nowrap"
                  :data-type="line.type"
                  :data-level="line.level"
                >
                  <template v-if="line.type === 'framework-version'">
                    <span class="shrink-0 whitespace-nowrap">
                      <template
                        v-for="(segment, segmentIndex) in segmentsFor(line.message)"
                        :key="`${line.id}-message-${segmentIndex}`"
                      >
                        <mark
                          v-if="segment.match"
                          :class="highlightMarkClass"
                        >
                          {{ segment.text }}
                        </mark>
                        <template v-else>{{ segment.text }}</template>
                      </template>
                    </span>
                    <span
                      v-if="line.suffix"
                      class="shrink-0 whitespace-nowrap text-(--warning-contrast)"
                    >
                      <template
                        v-for="(segment, segmentIndex) in segmentsFor(line.suffix)"
                        :key="`${line.id}-suffix-${segmentIndex}`"
                      >
                        <mark
                          v-if="segment.match"
                          :class="highlightMarkClass"
                        >
                          {{ segment.text }}
                        </mark>
                        <template v-else>{{ segment.text }}</template>
                      </template>
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
                      class="min-w-0 max-sm:whitespace-nowrap break-words whitespace-pre-wrap text-(--success-contrast)"
                    >
                      <template
                        v-for="(segment, segmentIndex) in segmentsFor(line.message)"
                        :key="`${line.id}-message-${segmentIndex}`"
                      >
                        <mark
                          v-if="segment.match"
                          :class="highlightMarkClass"
                        >
                          {{ segment.text }}
                        </mark>
                        <template v-else>{{ segment.text }}</template>
                      </template>
                    </span>
                  </template>

                  <template v-else>
                    <span class="min-w-0 max-sm:whitespace-nowrap break-words">
                      <template
                        v-for="(segment, segmentIndex) in segmentsFor(line.message)"
                        :key="`${line.id}-message-${segmentIndex}`"
                      >
                        <mark
                          v-if="segment.match"
                          :class="highlightMarkClass"
                        >
                          {{ segment.text }}
                        </mark>
                        <template v-else>{{ segment.text }}</template>
                      </template>
                    </span>
                  </template>
                </span>

                <template v-else>
                  <span
                    :data-testid="`${ctx.testId.value}__line-message`"
                    dir="auto"
                    class="relative z-1 flex min-w-0 flex-1 items-center gap-(--spacing-xl) text-(--text-default) max-sm:whitespace-nowrap"
                  >
                    <span class="w-16 shrink-0 whitespace-nowrap">
                      <template
                        v-for="(segment, segmentIndex) in segmentsFor(line.message)"
                        :key="`${line.id}-message-${segmentIndex}`"
                      >
                        <mark
                          v-if="segment.match"
                          :class="highlightMarkClass"
                        >
                          {{ segment.text }}
                        </mark>
                        <template v-else>{{ segment.text }}</template>
                      </template>
                    </span>
                    <span
                      v-if="line.folderType"
                      class="shrink-0 whitespace-nowrap text-(--warning-contrast)"
                    >
                      <template
                        v-for="(segment, segmentIndex) in segmentsFor(line.folderType)"
                        :key="`${line.id}-folder-type-${segmentIndex}`"
                      >
                        <mark
                          v-if="segment.match"
                          :class="highlightMarkClass"
                        >
                          {{ segment.text }}
                        </mark>
                        <template v-else>{{ segment.text }}</template>
                      </template>
                    </span>

                    <span
                      v-if="line.size"
                      :data-testid="`${ctx.testId.value}__line-size`"
                      class="flex shrink-0 items-center gap-(--spacing-sm) whitespace-nowrap tabular-nums"
                    >
                      <span>
                        <template
                          v-for="(segment, segmentIndex) in segmentsFor(line.size)"
                          :key="`${line.id}-size-${segmentIndex}`"
                        >
                          <mark
                            v-if="segment.match"
                            :class="highlightMarkClass"
                          >
                            {{ segment.text }}
                          </mark>
                          <template v-else>{{ segment.text }}</template>
                        </template>
                      </span>
                      <span
                        class="text-(--text-muted)"
                        aria-hidden="true"
                        >|</span
                      >
                      <span class="text-(--text-muted)">{{ t('logView.gzip') }}</span>
                      <span>
                        <template
                          v-for="(segment, segmentIndex) in segmentsFor(line.gzipSize ?? '')"
                          :key="`${line.id}-gzip-${segmentIndex}`"
                        >
                          <mark
                            v-if="segment.match"
                            :class="highlightMarkClass"
                          >
                            {{ segment.text }}
                          </mark>
                          <template v-else>{{ segment.text }}</template>
                        </template>
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
            :icon="searchQuery ? 'pi pi-search' : 'pi pi-align-left'"
            :title="emptyTitle"
          >
            <template
              v-if="searchQuery"
              #actions
            >
              <Button
                :label="t('logView.clearSearch')"
                kind="transparent"
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
