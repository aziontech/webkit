<script setup lang="ts">
  import { computed, type ComputedRef, provide, shallowReactive, useAttrs } from 'vue'

  import SelectGroup from '../../select/select-group/select-group.vue'
  import { MultiSelectGroupInjectionKey } from '../injection-key'

  defineOptions({
    name: 'MultiSelectGroup',
    inheritAttrs: false
  })

  export interface MultiSelectGroupProps {
    /** Heading text rendered above the grouped options. */
    label?: string
  }
  withDefaults(defineProps<MultiSelectGroupProps>(), {
    label: ''
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const options = shallowReactive(new Map<symbol, ComputedRef<boolean>>())
  provide(MultiSelectGroupInjectionKey, {
    register: (id, visible) => {
      options.set(id, visible)
    },
    unregister: (id) => {
      options.delete(id)
    }
  })

  const visible = computed(() => {
    if (options.size === 0) return true
    for (const option of options.values()) if (option.value) return true
    return false
  })

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'multi-select-group'
  )
</script>

<template>
  <SelectGroup
    v-show="visible"
    v-bind="$attrs"
    :label="label"
    :data-testid="testId"
  >
    <slot />
  </SelectGroup>
</template>
