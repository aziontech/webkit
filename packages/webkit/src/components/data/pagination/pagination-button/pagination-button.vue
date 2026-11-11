<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { PaginationInjectionKey } from '../injection-key'

  export type PaginationButtonKind = 'previous' | 'next' | 'number' | 'more'

  defineOptions({
    name: 'PaginationButton',
    inheritAttrs: false
  })

  interface Props {
    /** Button role within the pagination. */
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
  const ctx = inject(PaginationInjectionKey, null)

  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (ctx ? `${ctx.testId}__button` : 'data-pagination__button')
  )

  const inert = computed<boolean>(() => props.kind === 'more')

  const handleClick = (event: MouseEvent) => {
    if (props.disabled || inert.value) return
    emit('click', event)
  }
</script>

<template>
  <component
    :is="inert ? 'span' : 'button'"
    v-bind="$attrs"
    :type="inert ? undefined : 'button'"
    :data-testid="testId"
    :data-kind="kind"
    :data-selected="(!inert && selected) || null"
    :data-disabled="(!inert && disabled) || null"
    :disabled="inert ? undefined : disabled"
    :aria-hidden="inert ? 'true' : undefined"
    :aria-current="!inert && selected ? 'page' : undefined"
    :aria-disabled="(!inert && disabled) || undefined"
    class="relative isolate inline-flex h-7 min-w-7 pointer-coarse:h-11 pointer-coarse:min-w-11 items-center justify-center whitespace-nowrap text-(--text-default) text-button-lg first:rounded-s-(--shape-elements) last:rounded-e-(--shape-elements) transition-colors duration-150 ease-out motion-reduce:transition-none data-[kind=number]:bg-(--bg-surface) data-[kind=more]:bg-(--bg-surface) before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-(--bg-hover) before:opacity-0 before:transition-opacity before:duration-150 before:ease-out motion-reduce:before:transition-none before:content-[''] after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-(--bg-active) after:opacity-0 after:transition-opacity after:duration-150 after:ease-out motion-reduce:after:transition-none after:content-[''] hover:before:opacity-100 active:before:opacity-0 active:after:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) data-[selected]:bg-(--bg-selected) data-[selected]:border-(length:--border-width-default) data-[selected]:border-solid data-[selected]:border-(--border-default) data-[disabled]:text-(--text-disabled) data-[disabled]:cursor-not-allowed data-[disabled]:before:hidden data-[disabled]:after:hidden data-[kind=more]:before:hidden data-[kind=more]:after:hidden"
    @click="handleClick"
  >
    <span class="relative z-1 inline-flex items-center gap-(--spacing-xs)">
      <i
        v-if="kind === 'previous'"
        class="pi pi-chevron-left text-[length:inherit] leading-none rtl:-scale-x-100"
        aria-hidden="true"
      />
      <i
        v-if="kind === 'more'"
        class="pi pi-ellipsis-h text-[length:inherit] leading-none"
        aria-hidden="true"
      />
      <slot v-if="kind === 'number'" />
      <i
        v-if="kind === 'next'"
        class="pi pi-chevron-right text-[length:inherit] leading-none rtl:-scale-x-100"
        aria-hidden="true"
      />
    </span>
  </component>
</template>
