<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  export type ChipSize = 'small' | 'medium'

  defineOptions({
    name: 'Chips',
    inheritAttrs: false
  })

  interface Props {
    /** Fallback text when the default slot is empty. */
    label?: string
    /** Size token; `medium` is 24px tall, `small` is 20px. */
    size?: ChipSize
    /** When true, renders a trailing remove button that emits remove. */
    removable?: boolean
  }

  withDefaults(defineProps<Props>(), {
    label: undefined,
    size: 'medium',
    removable: false
  })

  const emit = defineEmits<{
    remove: [event: MouseEvent]
  }>()

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-chips')

  function onRemove(event: MouseEvent) {
    emit('remove', event)
  }
</script>

<template>
  <span
    v-bind="$attrs"
    :data-testid="testId"
    :data-size="size"
    :data-removable="removable || null"
    :class="attrs.class"
    class="inline-flex items-center justify-center overflow-hidden border border-[var(--border-default)] border-[length:var(--border-width-default)] bg-[var(--bg-surface-raised)] text-[var(--text-default)] shadow-[var(--shadow-sm)] leading-none rounded-[var(--shape-elements)] gap-[var(--spacing-xxs)] data-[size=medium]:text-label-md data-[size=small]:text-label-sm data-[size=medium]:h-6 data-[size=small]:h-5 data-[size=medium]:py-[var(--spacing-xs)] data-[size=medium]:px-[var(--spacing-sm)] data-[size=small]:p-[var(--spacing-xs)] data-[size=medium]:data-[removable]:pr-[var(--spacing-xs)] data-[size=small]:data-[removable]:pr-[var(--spacing-xxs)]"
  >
    <slot v-if="$slots['default']" />
    <span
      v-else-if="label"
      :data-testid="`${testId}__label`"
    >
      {{ label }}
    </span>
    <button
      v-if="removable"
      type="button"
      aria-label="Remove"
      :data-testid="`${testId}__remove`"
      class="inline-flex shrink-0 items-center justify-center rounded-[var(--shape-elements)] text-[var(--text-default)] transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]"
      @click="onRemove"
    >
      <i
        class="pi pi-times flex shrink-0 items-center size-[14px]"
        aria-hidden="true"
        :data-testid="`${testId}__remove-icon`"
      />
    </button>
  </span>
</template>
