<script setup lang="ts">
  import { computed, onScopeDispose, ref, useAttrs, watch } from 'vue'

  import { scrollParent } from '../../../../composables/use-lazy-chunks'
  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import Button from '../../../action/button/button.vue'
  import Spinner from '../../../feedback/spinner/spinner.vue'
  import { useDataTableContext } from '../composables/use-data-table-context'
  import { LAZY_MARGIN } from '../composables/use-data-table-lazy-rows'

  defineOptions({
    name: 'DataTableLoadMore',
    inheritAttrs: false
  })

  export interface DataTableLoadMoreProps {
    /** More rows exist after the last one: `load-more` fires as the end of the rows nears the viewport, and a Load more button is offered. False shows the end line once more rows were requested. */
    moreRows?: boolean
    /** The next rows are loading: a loading line replaces the button and further requests wait. */
    loading?: boolean
  }

  const props = withDefaults(defineProps<DataTableLoadMoreProps>(), {
    moreRows: false,
    loading: false
  })

  const emit = defineEmits<{
    'load-more': [event: Event]
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ dataTable: en.dataTable })
  const ctx = useDataTableContext()
  const { rowTotal, lazy } = ctx.loadMore

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'data-table-load-more'
  )

  const requested = ref<boolean>(false)
  const shown = computed<boolean>(
    () =>
      !ctx.loading.value &&
      rowTotal.value > 0 &&
      (props.moreRows || props.loading || requested.value)
  )
  const armed = computed<boolean>(
    () => shown.value && props.moreRows && !props.loading && !lazy.value
  )
  const requestMore = (event: Event = new Event('load-more')): void => {
    if (!props.moreRows || props.loading || ctx.loading.value) return
    requested.value = true
    emit('load-more', event)
  }

  const sentinelEl = ref<HTMLElement | null>(null)
  let observer: IntersectionObserver | null = null
  const observe = (): void => {
    observer?.disconnect()
    observer = null
    const el = sentinelEl.value
    if (!el || !armed.value || typeof IntersectionObserver === 'undefined') return
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[entries.length - 1]?.isIntersecting) requestMore()
      },
      { root: scrollParent(el), rootMargin: `${LAZY_MARGIN}px` }
    )
    observer.observe(el)
  }
  watch([sentinelEl, armed, rowTotal], observe, { flush: 'post' })
  watch(
    () => props.loading,
    (value) => ctx.loadMore.setLoading(value),
    { immediate: true }
  )
  onScopeDispose(() => {
    observer?.disconnect()
    ctx.loadMore.setLoading(false)
  })
</script>

<template>
  <div
    v-if="shown"
    v-bind="$attrs"
    :data-testid="testId"
    class="sticky start-0 flex w-full flex-col"
  >
    <div
      v-if="armed"
      ref="sentinelEl"
      aria-hidden="true"
      :data-testid="`${testId}__sentinel`"
      class="h-px w-full"
    />
    <div
      role="status"
      class="flex min-h-10 items-center justify-center gap-(--spacing-xs) px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)"
    >
      <template v-if="loading">
        <Spinner
          aria-hidden="true"
          class="size-4"
        />
        <span :data-testid="`${testId}__loading`">{{ t('dataTable.loadingMore') }}</span>
      </template>
      <Button
        v-else-if="moreRows"
        variant="ghost"
        size="small"
        :label="t('dataTable.loadMore')"
        :data-testid="`${testId}__load`"
        @click="requestMore"
      />
      <span
        v-else
        :data-testid="`${testId}__end`"
        >{{ t('dataTable.noMoreRows') }}</span
      >
    </div>
  </div>
</template>
