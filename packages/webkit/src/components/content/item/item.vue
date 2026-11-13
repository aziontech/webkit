<script setup lang="ts">
  import { computed, inject, provide, useAttrs } from 'vue'

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

  defineOptions({
    name: 'Item',
    inheritAttrs: false
  })

  export type { ItemKind, ItemSize }

  interface Props {
    /** Item root surface variant. `inline` removes the outer padding for inline placement and divided in-card lists; `option` is a compact chooser row that fills when pressed or selected. */
    kind?: ItemKind
    /** Item root density (padding and gap). */
    size?: ItemSize
    /** When set, the whole row renders as an anchor link to this URL. */
    href?: string
    /** Renders the whole row as a button; bind the click handler on the Item. Ignored when href is set. */
    clickable?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'default',
    size: 'medium',
    href: '',
    clickable: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const container = inject(ItemContainerInjectionKey, null)
  const isListMember = inject(ItemListMemberInjectionKey, false)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'content-item')

  const kind = computed<ItemKind>(() => container?.forceKind ?? props.kind)

  const isLink = computed(() => props.href.length > 0)
  const interactive = computed(() => isLink.value || props.clickable)
  const rootTag = computed(() => {
    if (isLink.value) return 'a'
    return props.clickable ? 'button' : 'div'
  })

  const rootBindings = computed(() => {
    const rest = { ...attrs }

    delete rest.class

    return {
      role: isListMember && !interactive.value ? 'listitem' : undefined,
      type: rootTag.value === 'button' ? 'button' : undefined,
      ...rest,
      href: isLink.value ? props.href : undefined,
      'data-slot': 'item',
      'data-testid': testId.value,
      'data-kind': kind.value,
      'data-size': props.size,
      class: cn(
        itemRowShellClasses,
        interactive.value && [
          'cursor-pointer text-start no-underline',
          ...focusVisibleRingClasses,
          ...ghostLayerClasses
        ],
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
</script>

<template>
  <div
    v-if="interactive && isListMember"
    role="listitem"
    data-slot="item-listitem"
  >
    <component
      :is="rootTag"
      v-bind="rootBindings"
    >
      <slot />
    </component>
  </div>
  <component
    :is="rootTag"
    v-else
    v-bind="rootBindings"
  >
    <slot />
  </component>
</template>
