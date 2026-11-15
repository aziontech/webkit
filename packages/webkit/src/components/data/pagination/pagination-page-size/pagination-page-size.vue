<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'

  defineOptions({
    name: 'PaginationPageSize',
    inheritAttrs: false
  })

  export interface PaginationPageSizeProps {
    /** Available page-size options. */
    options?: number[]
  }

  const props = withDefaults(defineProps<PaginationPageSizeProps>(), {
    options: () => [10, 25, 50, 100]
  })

  /** Selected rows-per-page value. */
  const model = defineModel<number>({ default: 10 })

  const attrs = useAttrs()
  const { t } = useTranslate({ pagination: en.pagination })

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'pagination-page-size'
  )

  const displayOptions = computed<number[]>(() =>
    props.options.includes(model.value)
      ? props.options
      : [...props.options, model.value].sort((a, b) => a - b)
  )

  const onChange = (event: Event) => {
    model.value = Number((event.target as HTMLSelectElement).value)
  }
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="relative inline-flex h-7 min-w-16 items-center rounded-(--shape-control) border-(length:--border-width-default) border-solid border-(--border-default) bg-(--bg-surface) text-body-sm text-(--text-muted) has-[select:focus-visible]:ring-2 has-[select:focus-visible]:ring-(--ring-color) has-[select:focus-visible]:ring-offset-2 has-[select:focus-visible]:ring-offset-(--bg-canvas)"
  >
    <select
      :value="model"
      class="h-full w-full cursor-pointer appearance-none rounded-(--shape-control) border-0 bg-transparent ps-(--spacing-sm) pe-7 text-label-sm text-(--text-muted) focus-visible:outline-none pointer-coarse:-my-2 pointer-coarse:h-11 [&>option]:bg-(--bg-surface) [&>option]:text-(--text-default)"
      :aria-label="t('pagination.pageSize')"
      @change="onChange"
    >
      <option
        v-for="opt in displayOptions"
        :key="opt"
        :value="opt"
      >
        {{ opt }}
      </option>
    </select>
    <i
      class="ai ai-chevron-down pointer-events-none absolute end-(--spacing-sm) text-[length:inherit] leading-none"
      aria-hidden="true"
    />
  </div>
</template>
