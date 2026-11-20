<script setup lang="ts">
  import { computed, inject, provide, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'
  import {
    ItemContainerInjectionKey,
    ItemInjectionKey,
    ItemListMemberInjectionKey,
    type ItemSize,
    type ItemVariant
  } from './injection-key'

  defineOptions({
    name: 'Item',
    inheritAttrs: false
  })

  export type { ItemSize, ItemVariant }

  export interface ItemProps {
    /** Item root surface variant. `inline` removes the outer padding for inline placement and divided in-card lists; `option` is a compact chooser row that fills when pressed or selected. */
    variant?: ItemVariant
    /** Item root density (padding and gap). */
    size?: ItemSize
    /** When set, the whole row renders as an anchor link to this URL. */
    href?: string
    /** Renders the whole row as a button; bind the click handler on the Item. Ignored when href is set. */
    clickable?: boolean
  }

  const props = withDefaults(defineProps<ItemProps>(), {
    variant: 'default',
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

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'item')

  const variant = computed<ItemVariant>(() => container?.forceVariant ?? props.variant)

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
      'data-variant': variant.value,
      'data-size': props.size,
      class: cn(
        'group/item relative flex w-full flex-wrap items-center',
        'rounded-(--shape-button) border border-transparent text-body-sm text-(--text-default)',
        'data-[variant=outline]:border-(--border-muted) data-[variant=outline]:bg-(--bg-surface)',
        'data-[variant=muted]:bg-(--bg-hover)',
        '[&:not([data-variant=option])]:data-[size=medium]:gap-(--spacing-md) [&:not([data-variant=inline],[data-variant=option])]:data-[size=medium]:p-(--spacing-md)',
        '[&:not([data-variant=option])]:data-[size=small]:gap-(--spacing-xs) [&:not([data-variant=inline],[data-variant=option])]:data-[size=small]:px-(--spacing-md) [&:not([data-variant=inline],[data-variant=option])]:data-[size=small]:py-(--spacing-sm)',
        'data-[variant=option]:gap-(--spacing-sm) data-[variant=option]:px-(--spacing-sm) data-[variant=option]:py-(--spacing-xs) data-[variant=option]:aria-pressed:bg-(--bg-selected) data-[variant=option]:aria-selected:bg-(--bg-selected)',
        interactive.value && [
          'cursor-pointer text-start no-underline',
          'aria-pressed:bg-(--bg-selected) aria-selected:bg-(--bg-selected)',
          'focus-visible:outline-none',
          'focus-visible:ring-2 focus-visible:ring-(--ring-color)',
          'focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)',
          'before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit]',
          "before:bg-(--bg-hover) before:opacity-0 before:content-['']",
          'before:transition-opacity before:duration-fast-02 before:ease-productive-entrance',
          'after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit]',
          "after:bg-(--bg-active) after:opacity-0 after:content-['']",
          'after:transition-opacity after:duration-fast-02 after:ease-productive-entrance',
          'hover:before:opacity-100 active:after:opacity-100',
          'motion-reduce:before:transition-none motion-reduce:after:transition-none'
        ],
        attrs.class as string | undefined
      )
    }
  })

  provide(ItemInjectionKey, {
    testId: testId.value,
    variant: variant.value,
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
