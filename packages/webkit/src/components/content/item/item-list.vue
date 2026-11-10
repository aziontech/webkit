<script setup lang="ts">
  import { computed, provide, useAttrs } from 'vue'

  import { ItemContainerInjectionKey, ItemListMemberInjectionKey } from './injection-key'

  defineOptions({
    name: 'ItemList',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'content-item-list')

  provide(ItemContainerInjectionKey, { forceKind: 'default' })
  provide(ItemListMemberInjectionKey, true)
</script>

<template>
  <div
    v-bind="$attrs"
    role="list"
    data-slot="item-list"
    :data-testid="testId"
    class="flex w-full flex-col [&>[data-slot=item]]:rounded-none [&>[data-slot=item]]:border-b-(color:--border-muted) [&>[data-slot=item]:last-child]:border-b-[color:transparent] [&>[data-slot=item-listitem]>[data-slot=item]]:rounded-none [&>[data-slot=item-listitem]>[data-slot=item]]:border-b-(color:--border-muted) [&>[data-slot=item-listitem]:last-child>[data-slot=item]]:border-b-[color:transparent]"
  >
    <slot />
  </div>
</template>
