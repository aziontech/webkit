<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { ItemInjectionKey, ItemListMemberInjectionKey } from './injection-key'

  defineOptions({
    name: 'ItemSeparator',
    inheritAttrs: false
  })

  const attrs = useAttrs()
  const ctx = inject(ItemInjectionKey)
  const isListMember = inject(ItemListMemberInjectionKey, false)

  const testId = computed(
    () =>
      (attrs['data-testid'] as string | undefined) ?? `${ctx?.testId ?? 'content-item'}__separator`
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :role="isListMember ? 'none' : 'separator'"
    data-slot="item-separator"
    :data-testid="testId"
    class="my-0 h-px w-full shrink-0 bg-(--border-muted)"
  />
</template>
