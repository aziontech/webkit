<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import Tag from '../../content/tag/tag.vue'
  import Input from '../../inputs/input/input.vue'
  import { useLogViewContext } from './composables/use-log-view-context'

  defineOptions({
    name: 'LogViewHeader',
    inheritAttrs: false
  })

  defineSlots<{
    left(): unknown
    right(): unknown
    search(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ logView: en.logView })
  const ctx = useLogViewContext()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId.value}__header`
  )
</script>

<template>
  <header
    v-bind="attrs"
    :data-testid="testId"
    class="flex shrink-0 flex-col gap-(--spacing-sm) border-b border-(--border-muted) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-sm) sm:h-[48px] sm:flex-row sm:items-center sm:justify-between sm:py-0"
  >
    <div
      :data-testid="`${testId}__left`"
      class="flex w-full min-w-0 flex-wrap items-center gap-(--spacing-sm) sm:w-auto"
    >
      <slot name="left">
        <span
          :data-testid="`${testId}__line-count`"
          class="text-label-code-sm text-(--text-muted)"
        >
          {{ ctx.lineCountLabel.value }}
        </span>

        <button
          v-if="ctx.warningCount.value > 0"
          type="button"
          :data-testid="`${testId}__warnings-filter`"
          :aria-pressed="ctx.level.value === 'warn'"
          :disabled="ctx.disabled.value"
          class="inline-flex h-8 min-w-8 items-center justify-center rounded-(--shape-elements) p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) disabled:cursor-not-allowed disabled:opacity-60 pointer-coarse:h-11"
          @click="ctx.toggleLevel('warn')"
        >
          <Tag
            severity="warning"
            icon="ai ai-triangle-alert"
            :label="ctx.warningTagLabel.value"
          />
        </button>

        <div
          v-if="ctx.levels.value.length"
          role="group"
          :aria-label="t('logView.levels')"
          :data-testid="`${testId}__levels`"
          class="flex min-w-0 flex-wrap items-center gap-(--spacing-xxs)"
        >
          <button
            v-for="name in ctx.levels.value"
            :key="name"
            type="button"
            :data-level="name"
            :data-active="ctx.level.value === name || null"
            :aria-pressed="ctx.level.value === name"
            :aria-label="
              t('logView.levelCount', { level: name, count: ctx.levelCounts.value[name] })
            "
            :disabled="ctx.disabled.value"
            :data-testid="`${testId}__level`"
            class="inline-flex h-8 shrink-0 cursor-pointer items-center gap-(--spacing-xxs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-xs) text-label-code-sm text-(--text-muted) transition-colors duration-150 ease-out hover:border-(--border-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) disabled:cursor-not-allowed disabled:opacity-60 data-[active]:border-(--border-selected) data-[active]:bg-(--bg-selected) data-[active]:text-(--text-default) motion-reduce:transition-none pointer-coarse:h-11"
            @click="ctx.toggleLevel(name)"
          >
            <span
              :data-level="name"
              aria-hidden="true"
              class="size-2 shrink-0 rounded-full bg-(--text-muted) data-[level=error]:bg-(--danger-contrast) data-[level=info]:bg-(--info-contrast) data-[level=warn]:bg-(--warning-contrast) forced-colors:bg-[CanvasText]"
            />
            <span>{{ name }}</span>
            <span class="tabular-nums text-(--text-default)">{{
              ctx.levelCounts.value[name]
            }}</span>
          </button>
        </div>
      </slot>
    </div>

    <div
      :data-testid="`${testId}__right`"
      class="flex w-full min-w-0 flex-col gap-(--spacing-sm) sm:flex-row sm:items-center sm:gap-(--spacing-sm) sm:w-auto"
    >
      <slot name="right">
        <slot name="search">
          <Input
            size="small"
            :model-value="ctx.search.value"
            :placeholder="ctx.searchPlaceholder.value"
            :disabled="ctx.disabled.value"
            :aria-label="t('logView.search')"
            :data-testid="`${testId}__search`"
            @update:model-value="ctx.setSearch"
          >
            <template #prefix>
              <i
                class="ai ai-search"
                aria-hidden="true"
              />
            </template>
          </Input>
        </slot>
      </slot>
    </div>
  </header>
</template>
