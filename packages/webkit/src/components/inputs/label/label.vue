<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Tag from '../../tag/tag.vue'

  defineOptions({
    name: 'Label',
    inheritAttrs: false
  })

  interface Props {
    /** Fallback text when the default slot is empty. */
    value?: string
    /** Appends a `Required` tag next to the label text. */
    required?: boolean
  }

  withDefaults(defineProps<Props>(), {
    value: undefined,
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
      <template v-else-if="value">{{ value }}</template>
    </span>
    <Tag
      v-if="required"
      value="Required"
      severity="warning"
      size="small"
      :data-testid="`${testId}__required`"
    />
  </label>
</template>
