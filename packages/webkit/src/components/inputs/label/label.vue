<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'Label',
    inheritAttrs: false
  })

  interface Props {
    /** Fallback text when the default slot is empty. */
    label?: string
    /** Appends a required indicator (an orange asterisk followed by the word "Required") next to the label text. */
    required?: boolean
  }

  withDefaults(defineProps<Props>(), {
    label: '',
    required: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-label')
</script>

<template>
  <label
    v-bind="$attrs"
    :data-testid="testId"
    :data-required="required || null"
    :class="attrs.class"
    class="inline-flex items-center text-label-sm text-[var(--text-default)] data-[required]:gap-[var(--spacing-xxs)]"
  >
    <span :data-testid="`${testId}__text`">
      <slot v-if="$slots['default']" />
      <template v-else-if="label">{{ label }}</template>
    </span>
    <span
      v-if="required"
      :data-testid="`${testId}__required`"
      class="text-label-sm text-[var(--text-muted)]"
    >
      <span
        aria-hidden="true"
        class="text-[var(--primary)]"
        >*</span
      >
      (Required)
    </span>
  </label>
</template>
