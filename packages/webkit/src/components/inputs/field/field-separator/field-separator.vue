<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'FieldSeparator',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'input-field-separator'
  )
</script>

<template>
  <div
    v-bind="$attrs"
    data-slot="field-separator"
    :data-testid="testId"
    :data-content="$slots['default'] ? '' : null"
    class="relative flex items-center gap-(--spacing-sm) text-label-sm text-(--text-muted)"
  >
    <span
      role="separator"
      aria-orientation="horizontal"
      class="h-px flex-1 bg-(--border-default)"
    />
    <template v-if="$slots['default']">
      <span :data-testid="`${testId}__content`">
        <slot />
      </span>
      <span
        aria-hidden="true"
        class="h-px flex-1 bg-(--border-default)"
      />
    </template>
  </div>
</template>
