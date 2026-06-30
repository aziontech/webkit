<script setup lang="ts">
  import { computed, provide, useAttrs, useSlots } from 'vue'

  import { cn } from '../../../utils/cn'
  import { itemRowShellClasses } from '../../inputs/presets/interactive-states'
  import { ItemInjectionKey, type ItemKind, type ItemSize } from './injection-key'
  import { mergeAsChildSlot } from './merge-as-child'

  defineOptions({
    name: 'Item',
    inheritAttrs: false
  })

  export type { ItemKind, ItemSize }

  interface Props {
    /** Item root surface variant. */
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

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'content-item')

  const rootBindings = computed(() => {
    const rest = { ...attrs }

    delete rest.class

    return {
      ...rest,
      'data-slot': 'item',
      'data-testid': testId.value,
      'data-kind': props.kind,
      'data-size': props.size,
      class: cn(itemRowShellClasses, attrs.class as string | undefined)
    }
  })

  provide(ItemInjectionKey, {
    testId: testId.value,
    kind: props.kind,
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
