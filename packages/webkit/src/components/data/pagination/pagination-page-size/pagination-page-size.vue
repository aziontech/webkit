<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-locale/use-translate'
  import * as en from '../../../../i18n/messages/en'
  import { PaginationInjectionKey } from '../injection-key'

  defineOptions({
    name: 'PaginationPageSize',
    inheritAttrs: false
  })

  interface Props {
    /** Selected rows-per-page value. */
    modelValue?: number
    /** Available page-size options. */
    options?: number[]
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: 10,
    options: () => [10, 25, 50, 100]
  })

  const emit = defineEmits<{
    'update:modelValue': [value: number]
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ pagination: en.pagination })
  const ctx = inject(PaginationInjectionKey, null)

  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (ctx ? `${ctx.testId}__page-size` : 'data-pagination__page-size')
  )

  const displayOptions = computed<number[]>(() =>
    props.options.includes(props.modelValue)
      ? props.options
      : [...props.options, props.modelValue].sort((a, b) => a - b)
  )

  const handleChange = (event: Event) => {
    emit('update:modelValue', Number((event.target as HTMLSelectElement).value))
  }
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="relative inline-flex h-7 min-w-16 items-center rounded-(--shape-elements) border-(length:--border-width-default) border-solid border-(--border-default) bg-(--bg-surface) text-body-sm text-(--text-muted) has-[select:focus-visible]:ring-2 has-[select:focus-visible]:ring-(--ring-color) has-[select:focus-visible]:ring-offset-2 has-[select:focus-visible]:ring-offset-(--bg-canvas)"
  >
    <select
      :value="modelValue"
      class="h-full w-full cursor-pointer appearance-none rounded-(--shape-elements) border-0 bg-transparent ps-(--spacing-sm) pe-7 text-label-sm text-(--text-muted) focus-visible:outline-none pointer-coarse:-my-2 pointer-coarse:h-11 [&>option]:bg-(--bg-surface) [&>option]:text-(--text-default)"
      :aria-label="t('pagination.pageSize')"
      @change="handleChange"
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
      class="pi pi-chevron-down pointer-events-none absolute end-(--spacing-sm) text-[length:inherit] leading-none"
      aria-hidden="true"
    />
  </div>
</template>
