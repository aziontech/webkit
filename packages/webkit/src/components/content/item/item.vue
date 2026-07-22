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

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'content-item')

  // Inside a list container (ItemGroup forces `inline`, ItemList forces `default`), the container's
  // kind wins to avoid a box-in-box effect.
  const kind = computed<ItemKind>(() => container?.forceKind ?? props.kind)

  const rootBindings = computed(() => {
    const rest = { ...attrs }

    delete rest.class

    return {
      ...rest,
      'data-slot': 'item',
      'data-testid': testId.value,
      'data-kind': kind.value,
      'data-size': props.size,
      // as-child target is the sole focusable/hoverable element for the whole row, so it draws the
      // focus ring and hover/active ghost layers.
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

  // as-child: clone the single default-slot child and merge the row bindings (layout, kind, size, data-*) onto it.
  const ItemAsChild = () => mergeAsChildSlot(rootBindings.value, slots['default'])
</script>

<template>
  <ItemAsChild v-if="asChild" />
  <div
    v-else
    v-bind="rootBindings"
  >
    <slot />
  </div>
</template>
