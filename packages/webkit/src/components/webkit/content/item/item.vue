<script setup lang="ts">
  import { computed, provide, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { itemRowShellClasses } from '../../inputs/presets/interactive-states'
  import { ItemInjectionKey, type ItemKind, type ItemSize } from './injection-key'
  import ItemRoot from './item-root'

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
    /** Merge layout classes onto the single default-slot child (e.g. anchor); focus/hover stay on slotted controls. */
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

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'content-item')

  const rootClass = computed(() => cn(itemRowShellClasses, attrs.class as string | undefined))

  provide(ItemInjectionKey, {
    testId: testId.value,
    kind: props.kind,
    size: props.size
  })
</script>

<template>
  <ItemRoot
    v-bind="attrs"
    :as-child="asChild"
    data-slot="item"
    :data-testid="testId"
    :data-kind="kind"
    :data-size="size"
    :class="rootClass"
  >
    <slot />
  </ItemRoot>
</template>
