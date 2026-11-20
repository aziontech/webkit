<script setup lang="ts">
  import { computed, inject, onBeforeUnmount, useAttrs, useId } from 'vue'

  import { FieldInjectionKey } from '../injection-key'

  defineOptions({
    name: 'FieldError',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const field = inject(FieldInjectionKey, null)
  const attrs = useAttrs()
  const generatedId = `field-error-${useId()}`

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'field-error')
  const id = computed(() => (attrs['id'] as string | undefined) ?? generatedId)

  if (field) onBeforeUnmount(field.register('error', id.value))
</script>

<template>
  <p
    v-bind="$attrs"
    :id="id"
    role="alert"
    data-slot="field-error"
    data-type="invalid"
    :data-testid="testId"
    class="inline-flex items-center gap-(--spacing-2xs) text-label-sm text-(--text-danger)"
  >
    <i
      class="az az-circle-alert flex shrink-0 items-center"
      aria-hidden="true"
      :data-testid="`${testId}__icon`"
    />
    <span :data-testid="`${testId}__text`"><slot /></span>
  </p>
</template>
