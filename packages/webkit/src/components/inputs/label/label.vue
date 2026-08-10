<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Hint from '../hint/hint.vue'

  defineOptions({
    name: 'Label',
    inheritAttrs: false
  })

  interface Props {
    /** Fallback text when the default slot is empty. */
    label?: string
    /** Appends a required indicator (an orange asterisk followed by the word "Required") next to the label text. */
    required?: boolean
    /** Short explanation appended as a Hint glyph that reveals it on hover or focus. Empty renders no glyph. */
    hint?: string
  }

  withDefaults(defineProps<Props>(), {
    label: '',
    required: false,
    hint: ''
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
    :data-hinted="hint ? '' : null"
    :class="attrs.class"
    class="inline-flex items-center text-label-sm text-(--text-default) data-[hinted]:gap-(--spacing-xxs) data-[required]:gap-(--spacing-xxs)"
  >
    <span :data-testid="`${testId}__text`">
      <slot v-if="$slots['default']" />
      <template v-else-if="label">{{ label }}</template>
    </span>
    <span
      v-if="required"
      :data-testid="`${testId}__required`"
      class="text-label-sm text-(--text-muted)"
    >
      <span
        aria-hidden="true"
        class="text-(--primary)"
        >*</span
      >
      (Required)
    </span>
    <!-- The hint is the label's only focusable stop; it swallows its own click so
         reaching for the explanation never toggles the control this label points at. -->
    <Hint
      v-if="hint"
      :text="hint"
      :data-testid="`${testId}__hint`"
    />
  </label>
</template>
