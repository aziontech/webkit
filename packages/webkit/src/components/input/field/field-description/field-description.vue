<script setup lang="ts">
  import { computed, inject, onBeforeUnmount, useAttrs, useId } from 'vue'

  import { FieldInjectionKey } from '../injection-key'

  defineOptions({
    name: 'FieldDescription',
    inheritAttrs: false
  })

  type FieldDescriptionTone = 'helper' | 'invalid' | 'required' | 'disabled'

  defineSlots<{
    default(): unknown
  }>()

  const field = inject(FieldInjectionKey, null)
  const attrs = useAttrs()
  const generatedId = `field-description-${useId()}`

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'field-description')
  const id = computed(() => (attrs['id'] as string | undefined) ?? generatedId)

  const type = computed<FieldDescriptionTone>(() => {
    if (!field) return 'helper'
    if (field.disabled.value) return 'disabled'
    if (field.invalid.value && !field.hasError.value) return 'invalid'
    if (field.required.value) return 'required'
    return 'helper'
  })

  if (field) onBeforeUnmount(field.register('description', id.value))
</script>

<template>
  <p
    v-bind="$attrs"
    :id="id"
    data-slot="field-description"
    :data-type="type"
    :data-testid="testId"
    class="inline-flex items-center text-label-sm data-[type=helper]:text-(--text-muted) data-[type=disabled]:text-(--text-muted) data-[type=invalid]:text-(--danger-foreground) data-[type=required]:text-(--warning-foreground) data-[type=disabled]:gap-(--spacing-2xs)"
  >
    <i
      v-if="type === 'disabled'"
      class="az az-lock flex shrink-0 items-center"
      aria-hidden="true"
      :data-testid="`${testId}__icon`"
    />
    <span :data-testid="`${testId}__text`"><slot /></span>
  </p>
</template>
