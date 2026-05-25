<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { DropdownMenuInjectionKey } from './injection-key'
  import { dropdownMenuGroupClasses } from './presets/styles'

  defineOptions({
    name: 'DropdownMenuGroup',
    inheritAttrs: false
  })

  withDefaults(
    defineProps<{
      /** Section label shown above a group of items. */
      label?: string
    }>(),
    {
      label: ''
    }
  )

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(DropdownMenuInjectionKey)

  const rootClasses = computed(() =>
    cn(dropdownMenuGroupClasses, attrs.class as string | undefined)
  )
</script>

<template>
  <div
    role="presentation"
    :class="rootClasses"
    :data-testid="`${ctx?.testId}__group`"
  >
    <span :data-testid="`${ctx?.testId}__group-label`">
      <slot>{{ label }}</slot>
    </span>
  </div>
</template>
