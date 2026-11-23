<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Input from '../../input/input/input.vue'
  import { useLogViewerContext } from './composables/use-log-viewer-context'
  import type { LogViewerLineLevel } from './injection-key'

  defineOptions({
    name: 'LogViewerHeader',
    inheritAttrs: false
  })

  defineSlots<{
    start(): unknown
    end(): unknown
    search(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ logViewer: en.logViewer })
  const ctx = useLogViewerContext()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'log-viewer-header')

  const offeredLevels = computed<LogViewerLineLevel[]>(() => {
    if (ctx.levels.value.length) return ctx.levels.value
    return ctx.levelCounts.value.warn > 0 ? ['warn'] : []
  })

  const ROOT_CLASS =
    'flex shrink-0 flex-col gap-(--spacing-sm) border-b border-(--border-muted) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-sm) ' +
    'sm:h-[48px] sm:flex-row sm:items-center sm:justify-between sm:py-0'

  const LEVEL_CLASS =
    'relative inline-flex h-8 shrink-0 cursor-pointer items-center gap-(--spacing-2xs) whitespace-nowrap rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface) ' +
    'px-(--spacing-xs) text-label-sm text-(--text-muted) transition-colors duration-150 ease-out ' +
    "before:absolute before:inset-0 before:content-[''] hover:border-(--border-strong) hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 " +
    'focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) disabled:cursor-not-allowed disabled:opacity-60 ' +
    'data-[active]:border-(--border-selected) data-[active]:bg-(--bg-selected) data-[active]:text-(--text-default) ' +
    'motion-reduce:transition-none pointer-coarse:before:-inset-y-1.5'

  const LEVEL_DOT_CLASS =
    'size-2 shrink-0 rounded-full bg-(--text-muted) ' +
    'data-[level=error]:bg-(--danger-mark) data-[level=info]:bg-(--info-mark) data-[level=warn]:bg-(--warning-mark) ' +
    'forced-colors:bg-[CanvasText]'
</script>

<template>
  <header
    v-bind="attrs"
    :data-testid="testId"
    :class="ROOT_CLASS"
  >
    <div
      :data-testid="`${testId}__start`"
      class="-my-1.5 flex w-full min-w-0 items-center gap-(--spacing-sm) overflow-x-auto py-1.5 ps-1 -ms-1 pe-1 -me-1 [scrollbar-width:none] sm:w-auto [&::-webkit-scrollbar]:hidden"
    >
      <slot name="start">
        <span
          :data-testid="`${testId}__line-count`"
          class="shrink-0 whitespace-nowrap text-label-sm tabular-nums text-(--text-muted)"
        >
          {{ ctx.lineCountLabel.value }}
        </span>

        <div
          v-if="offeredLevels.length"
          role="group"
          :aria-label="t('logViewer.levels')"
          :data-testid="`${testId}__levels`"
          class="flex shrink-0 items-center gap-(--spacing-2xs)"
        >
          <button
            v-for="name in offeredLevels"
            :key="name"
            type="button"
            :data-level="name"
            :data-active="ctx.level.value === name || null"
            :aria-pressed="ctx.level.value === name"
            :aria-label="
              t('logViewer.levelCount', { level: name, count: ctx.levelCounts.value[name] })
            "
            :disabled="ctx.disabled.value"
            :data-testid="`${testId}__level`"
            :class="LEVEL_CLASS"
            @click="ctx.toggleLevel(name)"
          >
            <span
              :data-level="name"
              aria-hidden="true"
              :class="LEVEL_DOT_CLASS"
            />
            <span :data-testid="`${testId}__level-name`">{{ name }}</span>
            <span
              :data-testid="`${testId}__level-count`"
              class="tabular-nums text-(--text-default)"
              >{{ ctx.levelCounts.value[name] }}</span
            >
          </button>
        </div>
      </slot>
    </div>

    <div
      :data-testid="`${testId}__end`"
      class="flex w-full min-w-0 flex-col gap-(--spacing-sm) sm:flex-row sm:items-center sm:gap-(--spacing-sm) sm:w-auto"
    >
      <slot name="end">
        <slot name="search">
          <Input
            size="small"
            :model-value="ctx.search.value"
            :placeholder="ctx.searchPlaceholder.value"
            :disabled="ctx.disabled.value"
            :aria-label="t('logViewer.search')"
            :data-testid="`${testId}__search`"
            @update:model-value="ctx.setSearch"
          >
            <template #leading>
              <i
                class="az az-search"
                aria-hidden="true"
              />
            </template>
          </Input>
        </slot>
      </slot>
    </div>
  </header>
</template>
