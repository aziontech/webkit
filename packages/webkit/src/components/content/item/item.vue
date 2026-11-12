<script setup lang="ts">
  import { computed, inject, provide, useAttrs, useSlots } from 'vue'

  import { cn } from '../../../utils/cn'
  import {
    focusVisibleRingClasses,
    ghostLayerClasses,
    itemRowShellClasses
  } from '../../inputs/presets/interactive-states'
  import {
    ItemContainerInjectionKey,
    ItemInjectionKey,
    type ItemKind,
    ItemListMemberInjectionKey,
    type ItemSize
  } from './injection-key'
  import { mergeAsChildSlot } from './merge-as-child'

  defineOptions({
    name: 'Item',
    inheritAttrs: false
  })

  export type { ItemKind, ItemSize }

  interface Props {
    /** Item root surface variant. `inline` removes the outer padding for inline placement and divided in-card lists. */
    kind?: ItemKind
    /** Item root density (padding and gap). */
    size?: ItemSize
    /** Merge the row layout/kind/size classes onto the single default-slot child instead of rendering a wrapper. */
    asChild?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'default',
    size: 'medium',
    asChild: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const slots = useSlots()
  const container = inject(ItemContainerInjectionKey, null)
  const isListMember = inject(ItemListMemberInjectionKey, false)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'content-item')

  const kind = computed<ItemKind>(() => container?.forceKind ?? props.kind)

  const rootBindings = computed(() => {
    const rest = { ...attrs }

    delete rest.class

    return {
      role: isListMember && !props.asChild ? 'listitem' : undefined,
      ...rest,
      'data-slot': 'item',
      'data-testid': testId.value,
      'data-kind': kind.value,
      'data-size': props.size,
      class: cn(
        itemRowShellClasses,
        props.asChild && [...focusVisibleRingClasses, ...ghostLayerClasses],
        attrs.class as string | undefined
      )
    }
  })

  provide(ItemInjectionKey, {
    testId: testId.value,
    kind: kind.value,
    size: props.size
  })
  provide(ItemListMemberInjectionKey, false)

  const ItemAsChild = () => mergeAsChildSlot(rootBindings.value, slots['default'])
</script>

<template>
  <div
    v-if="asChild && isListMember"
    role="listitem"
    data-slot="item-listitem"
  >
    <ItemAsChild />
  </div>
  <ItemAsChild v-else-if="asChild" />
  <div
    v-else
    v-bind="rootBindings"
  >
    <slot />
  </div>
</template>
