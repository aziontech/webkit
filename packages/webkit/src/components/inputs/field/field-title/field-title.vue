<script setup lang="ts">
  import { computed, inject, onBeforeUnmount, useAttrs, useId } from 'vue'

  import { FieldInjectionKey } from '../injection-key'

  defineOptions({
    name: 'FieldTitle',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const field = inject(FieldInjectionKey, null)
  const attrs = useAttrs()
  const generatedId = `field-title-${useId()}`

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-field-title')
  const id = computed(() => (attrs['id'] as string | undefined) ?? generatedId)

  if (field) onBeforeUnmount(field.register('title', id.value))
</script>

<template>
  <div
    v-bind="$attrs"
    :id="id"
    data-slot="field-title"
    :data-testid="testId"
    class="flex w-fit items-center gap-(--spacing-2xs) text-body-sm text-(--text-default)"
  >
    <slot />
  </div>
</template>
