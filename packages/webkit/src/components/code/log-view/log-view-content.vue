<script setup lang="ts">
  import { computed, nextTick, onMounted, onUnmounted, ref, useAttrs, watch } from 'vue'

  import CopyButton from '../../actions/copy-button/copy-button.vue'
  import ScrollArea from '../../layout/scroll-area/scroll-area.vue'
  import Spinner from '../../utils/spinner/spinner.vue'
  import { splitTextByQuery } from './composables/split-text-by-query'
  import { useLogViewContext } from './composables/use-log-view-context'

  defineOptions({
    name: 'LogViewContent',
    inheritAttrs: false
  })

  defineSlots<{
    empty(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = useLogViewContext()

  const searchQuery = computed(() => ctx.search.value.trim())

  const segmentsFor = (text: string) => splitTextByQuery(text, searchQuery.value)

  const highlightMarkClass =
    'rounded-[var(--shape-elements)] bg-[var(--bg-selected)] text-inherit motion-reduce:transition-none'

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__content`
  )

  const scrollBodyWrapRef = ref<HTMLElement | null>(null)
  const scrollViewportRef = ref<HTMLElement | null>(null)
  const showBottomFade = ref(false)

  const updateBottomFade = () => {
    const viewport = scrollViewportRef.value

    if (!viewport) {
      showBottomFade.value = false
      return
    }

    showBottomFade.value = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight > 8
  }

  let resizeObserver: ResizeObserver | undefined

  const bindScrollViewport = (viewport: HTMLElement | null) => {
    if (scrollViewportRef.value) {
      scrollViewportRef.value.removeEventListener('scroll', updateBottomFade)
    }

    resizeObserver?.disconnect()
    resizeObserver = undefined
    scrollViewportRef.value = viewport

    if (!viewport) {
      showBottomFade.value = false
      return
    }

    viewport.addEventListener('scroll', updateBottomFade, { passive: true })

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => updateBottomFade())
      resizeObserver.observe(viewport)
    }

    updateBottomFade()
  }

  const resolveScrollViewport = () => {
    bindScrollViewport(scrollBodyWrapRef.value?.querySelector('[role="log"]') ?? null)
  }

  onMounted(() => {
    nextTick(resolveScrollViewport)
  })

  onUnmounted(() => {
    bindScrollViewport(null)
  })

  watch(
    () =>
      [
        ctx.filteredLines.value.length,
        ctx.warningsOnly.value,
        ctx.search.value,
        ctx.loading.value
      ] as const,
    () => {
      nextTick(resolveScrollViewport)
    }
  )
</script>

<template>
  <div
    ref="scrollBodyWrapRef"
    v-bind="attrs"
    :data-testid="testId"
    class="relative min-h-0 flex-1"
  >
    <div
      v-if="ctx.showCopy.value && !ctx.loading.value"
      class="absolute right-[var(--spacing-sm)] top-[var(--spacing-sm)] z-[3]"
      :data-testid="`${ctx.testId}__copy-anchor`"
    >
      <CopyButton
        :value="ctx.copyText.value"
        kind="outlined"
        size="small"
        ariaLabel="Copy logs"
        copiedLabel="Copied logs"
        :disabled="!ctx.canCopy.value"
        :data-testid="`${ctx.testId}__copy`"
        @copy="ctx.emitCopy"
      />
    </div>

    <div
      v-if="ctx.loading.value"
      role="status"
      aria-live="polite"
      :data-testid="`${testId}__loading`"
      class="flex h-full min-h-0 flex-col items-center justify-center gap-[var(--spacing-md)] bg-[var(--bg-canvas)]"
    >
      <Spinner class="size-6 text-[var(--text-default)]" />
      <span class="font-code text-label-sm text-[var(--text-muted)]">
        {{ ctx.loadingLabel.value }}
      </span>
    </div>

    <ScrollArea
      v-else
      orientation="both"
      :data-testid="`${testId}__body`"
      class="h-full min-h-0 bg-[var(--bg-canvas)] sm:overflow-x-hidden"
      role="log"
      aria-live="polite"
    >
      <template v-if="ctx.filteredLines.value.length">
        <div class="max-sm:min-w-max">
          <div
            v-for="line in ctx.filteredLines.value"
            :key="line.id"
            :data-testid="`${ctx.testId}__line`"
            :data-type="line.type"
            class="font-code text-label-sm relative flex gap-[var(--spacing-md)] border-l-2 border-l-transparent px-[var(--spacing-md)] py-[var(--spacing-xxs)] transition-colors duration-150 ease-out before:pointer-events-none before:absolute before:inset-0 before:bg-[var(--bg-hover)] before:opacity-0 before:transition-opacity before:duration-150 before:ease-out before:content-[''] hover:border-l-[var(--ring-color)] hover:bg-[var(--bg-surface-raised)] hover:before:opacity-100 data-[type=warning]:bg-[var(--warning)] data-[type=warning]:hover:bg-[var(--warning)] motion-reduce:transition-none motion-reduce:before:transition-none"
          >
            <span
              :data-testid="`${ctx.testId}__line-time`"
              class="relative z-[1] shrink-0 text-[var(--text-muted)]"
            >
              {{ line.time }}
            </span>

            <span
              v-if="line.type !== 'folder'"
              :data-testid="`${ctx.testId}__line-message`"
              class="relative z-[1] flex min-w-0 flex-1 items-center gap-[var(--spacing-xs)] text-[var(--text-default)] data-[type=success]:gap-[var(--spacing-xs)] data-[type=warning]:text-[var(--warning-contrast)] max-sm:whitespace-nowrap"
              :data-type="line.type"
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
                  class="shrink-0 whitespace-nowrap text-[var(--warning-contrast)]"
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
                  class="min-w-0 max-sm:whitespace-nowrap break-words whitespace-pre-wrap text-[var(--success-contrast)]"
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
                :data-testid="`${ctx.testId}__line-message`"
                class="relative z-[1] flex min-w-0 flex-1 items-center gap-[var(--spacing-xl)] text-[var(--text-default)] max-sm:whitespace-nowrap"
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
                  class="shrink-0 whitespace-nowrap text-[var(--warning-contrast)]"
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
                  :data-testid="`${ctx.testId}__line-size`"
                  class="flex shrink-0 items-center gap-[var(--spacing-sm)] whitespace-nowrap tabular-nums"
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
                    class="text-[var(--text-muted)]"
                    aria-hidden="true"
                    >|</span
                  >
                  <span class="text-[var(--text-muted)]">gzip:</span>
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

      <div
        v-else
        :data-testid="`${ctx.testId}__empty`"
        class="font-code px-[var(--spacing-md)] py-[var(--spacing-sm)] text-label-sm text-[var(--text-muted)]"
      >
        <slot name="empty">No log lines match the current filters.</slot>
      </div>
    </ScrollArea>

    <div
      v-show="showBottomFade && ctx.filteredLines.value.length > 0"
      aria-hidden="true"
      :data-testid="`${testId}__fade-bottom`"
      class="pointer-events-none absolute bottom-0 left-0 right-0 z-[2] h-[var(--spacing-xl)] bg-gradient-to-b from-transparent to-[var(--bg-canvas)] opacity-100 transition-opacity duration-150 ease-out motion-reduce:transition-none"
    />
  </div>
</template>
