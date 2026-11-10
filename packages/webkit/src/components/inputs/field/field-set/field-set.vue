<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'FieldSet',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-field-set')
</script>

<template>
  <fieldset
    v-bind="$attrs"
    data-slot="field-set"
    :data-testid="testId"
    class="m-0 flex min-w-0 flex-col gap-(--spacing-md) border-0 p-0 has-[>[data-slot=field-legend]+[data-slot=field-description]]:gap-(--spacing-sm)"
  >
    <slot />
  </fieldset>
</template>
