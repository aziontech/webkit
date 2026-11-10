<script setup lang="ts">
  import { computed, inject, onBeforeUnmount, useAttrs, useId } from 'vue'

  import HelperText from '../../helper-text/helper-text.vue'
  import { fieldContextKey } from '../injection-key'

  defineOptions({
    name: 'FieldError',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const field = inject(fieldContextKey, null)
  const attrs = useAttrs()
  const generatedId = `field-error-${useId()}`

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-field-error')
  const id = computed(() => (attrs['id'] as string | undefined) ?? generatedId)

  if (field) onBeforeUnmount(field.register('error', id.value))
</script>

<template>
  <HelperText
    v-bind="$attrs"
    :id="id"
    role="alert"
    data-slot="field-error"
    kind="invalid"
    :data-testid="testId"
  >
    <slot />
  </HelperText>
</template>
