<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  export type PaginationButtonType = 'previous' | 'next' | 'number' | 'more'

  defineOptions({
    name: 'PaginationButton',
    inheritAttrs: false
  })

  export interface PaginationButtonProps {
    /** Button role within the pagination. */
    type?: PaginationButtonType
    /** Marks the current page (filled surface + aria-current). */
    active?: boolean
    /** Disables interaction and applies disabled tokens. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<PaginationButtonProps>(), {
    type: 'number',
    active: false,
    disabled: false
  })

  const emit = defineEmits<{
    click: [event: MouseEvent]
  }>()

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'pagination-button'
  )

  const inert = computed<boolean>(() => props.type === 'more')

  const onClick = (event: MouseEvent) => {
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
    :data-type="type"
    :data-active="(!inert && active) || null"
    :data-disabled="(!inert && disabled) || null"
    :disabled="inert ? undefined : disabled"
    :aria-hidden="inert ? 'true' : undefined"
    :aria-current="!inert && active ? 'page' : undefined"
    :aria-disabled="(!inert && disabled) || undefined"
    class="relative isolate inline-flex h-7 min-w-7 items-center justify-center whitespace-nowrap text-(--text-default) text-button-lg tabular-nums first:rounded-s-(--shape-control) last:rounded-e-(--shape-control) transition-colors duration-150 ease-out motion-reduce:transition-none data-[type=number]:not-data-[active]:bg-(--bg-surface) data-[type=more]:bg-(--bg-surface) before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-(--bg-hover) before:opacity-0 before:transition-opacity before:duration-150 before:ease-out motion-reduce:before:transition-none before:content-[''] after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-(--bg-active) after:opacity-0 after:transition-opacity after:duration-150 after:ease-out motion-reduce:after:transition-none after:content-[''] hover:before:opacity-100 active:before:opacity-0 active:after:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) data-[active]:bg-(--bg-selected) data-[active]:not-first:border-s-(length:--border-width-default) data-[active]:not-last:border-e-(length:--border-width-default) data-[active]:border-solid data-[active]:border-(--border-default) data-[disabled]:text-(--text-disabled) data-[disabled]:cursor-not-allowed data-[disabled]:before:hidden data-[disabled]:after:hidden data-[type=more]:before:hidden data-[type=more]:after:hidden"
    @click="onClick"
  >
    <span class="relative z-1 inline-flex items-center gap-(--spacing-xs)">
      <i
        v-if="type === 'previous'"
        class="az az-chevron-left text-[length:inherit] leading-none rtl:-scale-x-100"
        aria-hidden="true"
      />
      <i
        v-if="type === 'more'"
        class="az az-ellipsis text-[length:inherit] leading-none"
        aria-hidden="true"
      />
      <slot v-if="type === 'number'" />
      <i
        v-if="type === 'next'"
        class="az az-chevron-right text-[length:inherit] leading-none rtl:-scale-x-100"
        aria-hidden="true"
      />
    </span>
    <span
      v-if="!inert"
      aria-hidden="true"
      data-slot="touch-target"
      class="absolute inset-x-0 inset-y-[min(0rem,calc(50%-22px))] hidden pointer-coarse:block"
    />
  </component>
</template>
