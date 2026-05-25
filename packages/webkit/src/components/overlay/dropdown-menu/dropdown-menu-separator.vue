<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { DropdownMenuInjectionKey } from './injection-key'
  import { dropdownMenuSeparatorClasses } from './presets/styles'

  defineOptions({
    name: 'DropdownMenuSeparator',
    inheritAttrs: false
  })

  const attrs = useAttrs()
  const ctx = inject(DropdownMenuInjectionKey)

  const rootClasses = computed(() =>
    cn(dropdownMenuSeparatorClasses, attrs.class as string | undefined)
  )
</script>

<template>
  <div
    role="separator"
    :class="rootClasses"
    :data-testid="`${ctx?.testId}__separator`"
  />
</template>
