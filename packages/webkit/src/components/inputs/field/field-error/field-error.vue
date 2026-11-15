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

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-field-error')
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
    class="inline-flex items-center text-label-sm text-(--danger-foreground)"
  >
    <span :data-testid="`${testId}__text`"><slot /></span>
  </p>
</template>
