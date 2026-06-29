<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { PaginatorInjectionKey } from '../injection-key'

  export type PaginationButtonKind = 'previous' | 'next' | 'number' | 'more'

  defineOptions({
    name: 'PaginationButton',
    inheritAttrs: false
  })

  interface Props {
    /** Button role within the paginator. */
    kind?: PaginationButtonKind
    /** Marks the current page (filled surface + aria-current). */
    selected?: boolean
    /** Disables interaction and applies disabled tokens. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'number',
    selected: false,
    disabled: false
  })

  const emit = defineEmits<{
    click: [event: MouseEvent]
  }>()

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(PaginatorInjectionKey, null)

  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (ctx ? `${ctx.testId}__button` : 'data-paginator__button')
  )

  const handleClick = (event: MouseEvent) => {
    if (props.disabled) return
    emit('click', event)
  }
</script>

<template>
  <button
    v-bind="$attrs"
    type="button"
    :data-testid="testId"
    :data-kind="kind"
    :data-selected="selected || null"
    :data-disabled="disabled || null"
    :disabled="disabled"
    :aria-current="selected ? 'page' : undefined"
    :aria-disabled="disabled || undefined"
    class="relative isolate inline-flex h-7 items-center justify-center whitespace-nowrap rounded-[var(--shape-button)] px-[var(--spacing-xs)] bg-[var(--bg-surface)] text-[var(--text-default)] text-button-lg transition-colors duration-150 ease-out motion-reduce:transition-none data-[kind=number]:w-10 data-[kind=more]:w-10 data-[kind=previous]:min-w-20 data-[kind=next]:min-w-20 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[var(--bg-hover)] before:opacity-0 before:transition-opacity before:duration-150 before:ease-out motion-reduce:before:transition-none before:content-[''] after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-[var(--bg-active)] after:opacity-0 after:transition-opacity after:duration-150 after:ease-out motion-reduce:after:transition-none after:content-[''] hover:before:opacity-100 active:after:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] data-[selected]:bg-[var(--bg-selected)] data-[selected]:border-[length:var(--border-width-default)] data-[selected]:border-solid data-[selected]:border-[var(--border-default)] data-[disabled]:bg-[var(--bg-disabled)] data-[disabled]:text-[var(--text-disabled)] data-[disabled]:cursor-not-allowed data-[disabled]:before:hidden data-[disabled]:after:hidden"
    @click="handleClick"
  >
    <span class="relative z-[1] inline-flex items-center gap-[var(--spacing-xs)]">
      <i
        v-if="kind === 'previous'"
        class="pi pi-chevron-left text-[length:inherit] leading-none"
        aria-hidden="true"
      />
      <i
        v-if="kind === 'more'"
        class="pi pi-ellipsis-h text-[length:inherit] leading-none"
        aria-hidden="true"
      />
      <slot v-if="kind !== 'more'" />
      <i
        v-if="kind === 'next'"
        class="pi pi-chevron-right text-[length:inherit] leading-none"
        aria-hidden="true"
      />
    </span>
  </button>
</template>
