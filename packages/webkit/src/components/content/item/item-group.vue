<script setup lang="ts">
  import { computed, provide, useAttrs } from 'vue'

  import { ItemContainerInjectionKey } from './injection-key'

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

  // A group is a borderless, gapped list — force descendant Items inline so they don't draw their
  // own surface/padding inside the group (avoids the box-in-box effect).
  provide(ItemContainerInjectionKey, { forceKind: 'inline' })
</script>

<template>
  <div
    v-bind="$attrs"
    role="list"
    data-slot="item-group"
    :data-testid="testId"
    class="group/item-group flex flex-col gap-[var(--spacing-lg)]"
  >
    <slot />
  </div>
</template>
