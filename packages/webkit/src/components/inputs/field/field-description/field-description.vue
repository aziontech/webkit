<script setup lang="ts">
  import { computed, inject, onBeforeUnmount, useAttrs, useId } from 'vue'

  import HelperText, { type HelperTextKind } from '../../helper-text/helper-text.vue'
  import { fieldContextKey } from '../injection-key'

  defineOptions({
    name: 'FieldDescription',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const field = inject(fieldContextKey, null)
  const attrs = useAttrs()
  const generatedId = `field-description-${useId()}`

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'input-field-description'
  )
  const id = computed(() => (attrs['id'] as string | undefined) ?? generatedId)

  const kind = computed<HelperTextKind>(() => {
    if (!field) return 'helper'
    if (field.disabled.value) return 'disabled'
    if (field.invalid.value && !field.hasError.value) return 'invalid'
    if (field.required.value) return 'required'
    return 'helper'
  })

  if (field) onBeforeUnmount(field.register('description', id.value))
</script>

<template>
  <HelperText
    v-bind="$attrs"
    :id="id"
    data-slot="field-description"
    :kind="kind"
    :data-testid="testId"
  >
    <slot />
  </HelperText>
</template>
