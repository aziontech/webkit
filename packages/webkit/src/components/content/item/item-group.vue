<script setup lang="ts">
  import { computed, provide, useAttrs } from 'vue'

  import { ItemContainerInjectionKey, ItemListMemberInjectionKey } from './injection-key'

  defineOptions({
    name: 'ItemGroup',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-item-group'
  )

  provide(ItemContainerInjectionKey, { forceKind: 'inline' })
  provide(ItemListMemberInjectionKey, true)
</script>

<template>
  <div
    v-bind="$attrs"
    role="list"
    data-slot="item-group"
    :data-testid="testId"
    class="group/item-group flex flex-col gap-(--spacing-lg)"
  >
    <slot />
  </div>
</template>
