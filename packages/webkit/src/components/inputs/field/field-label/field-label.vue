<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { useLocale } from '../../../../composables/use-locale'
  import * as en from '../../../../i18n/messages/en'
  import Hint from '../../hint/hint.vue'
  import { fieldContextKey } from '../injection-key'

  defineOptions({
    name: 'FieldLabel',
    inheritAttrs: false
  })

  export interface Props {
    /** Short explanation appended as a Hint glyph that reveals it on hover or focus. Empty renders no glyph. */
    hint?: string
  }

  withDefaults(defineProps<Props>(), {
    hint: ''
  })

  defineSlots<{
    default(): unknown
  }>()

  const field = inject(fieldContextKey, null)
  const attrs = useAttrs()
  const { t } = useLocale({ field: en.field })

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-field-label')
  const htmlFor = computed(() => (attrs['for'] as string | undefined) ?? field?.controlId)
  const required = computed(() => field?.required.value ?? false)
</script>

<template>
  <label
    v-bind="$attrs"
    data-slot="field-label"
    :for="htmlFor"
    :data-testid="testId"
    :data-required="required || null"
    :data-disabled="field?.disabled.value || null"
    class="group/field-label inline-flex w-fit items-center gap-(--spacing-xxs) text-label-sm text-(--text-default) data-[disabled]:text-(--text-muted) has-[>[data-slot=field]]:relative has-[>[data-slot=field]]:flex has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:cursor-pointer has-[>[data-slot=field]]:rounded-(--shape-button) has-[>[data-slot=field]]:border has-[>[data-slot=field]]:border-(--border-muted) has-[>[data-slot=field]]:bg-(--bg-surface) has-[>[data-slot=field]]:p-(--spacing-sm) has-[>[data-slot=field]]:transition-colors has-[>[data-slot=field]]:duration-150 has-[>[data-slot=field]]:ease-out motion-reduce:transition-none has-[>[data-slot=field]]:hover:bg-(--bg-hover) has-[>[data-slot=field]]:has-[:focus-visible]:outline-none has-[>[data-slot=field]]:has-[:focus-visible]:ring-2 has-[>[data-slot=field]]:has-[:focus-visible]:ring-(--ring-color) has-[>[data-slot=field]]:has-[:focus-visible]:ring-offset-1 has-[>[data-slot=field]]:has-[:focus-visible]:ring-offset-(--bg-canvas) has-[>[data-slot=field]]:has-[[data-checked]]:border-(--border-selected) has-[>[data-slot=field]]:has-[[data-checked]]:bg-(--bg-selected) has-[>[data-slot=field][data-disabled]]:cursor-not-allowed has-[>[data-slot=field][data-disabled]]:opacity-50 has-[>[data-slot=field][data-disabled]]:hover:bg-(--bg-surface)"
  >
    <slot />
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
      {{ t('field.required') }}
    </span>
    <Hint
      v-if="hint"
      :text="hint"
      :data-testid="`${testId}__hint`"
    />
  </label>
</template>
