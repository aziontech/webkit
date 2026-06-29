<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { PaginatorInjectionKey } from '../injection-key'

  defineOptions({
    name: 'PaginatorPageSize',
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
  const ctx = inject(PaginatorInjectionKey, null)

  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (ctx ? `${ctx.testId}__page-size` : 'data-paginator__page-size')
  )

  // The selector must never render blank: if the current value isn't one of the
  // configured options (e.g. a page size of 3 with the default [10, 25, 50, 100]),
  // fold it in so there's always a matching option for the selected value.
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
    class="relative inline-flex h-8 min-w-16 items-center rounded-[var(--shape-elements)] bg-[var(--bg-canvas)] text-body-sm text-[var(--text-muted)]"
  >
    <select
      :value="modelValue"
      aria-label="Rows per page"
      class="h-8 w-full cursor-pointer appearance-none rounded-[var(--shape-elements)] border-[length:var(--border-width-default)] border-solid border-[var(--border-default)] bg-[var(--bg-surface)] pl-[var(--spacing-sm)] pr-7 text-label-sm text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]"
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
      class="pi pi-chevron-down pointer-events-none absolute right-[var(--spacing-sm)] text-[length:inherit] leading-none"
      aria-hidden="true"
    />
  </div>
</template>
