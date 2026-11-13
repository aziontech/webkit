<script setup lang="ts">
  import { computed, inject, provide, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'
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
        'group/item relative flex w-full flex-wrap items-center',
        'rounded-(--shape-button) border border-transparent text-body-sm text-(--text-default)',
        'data-[kind=outlined]:border-(--border-muted) data-[kind=outlined]:bg-(--bg-surface)',
        'data-[kind=muted]:bg-(--bg-hover)',
        '[&:not([data-kind=option])]:data-[size=medium]:gap-(--spacing-md) [&:not([data-kind=inline],[data-kind=option])]:data-[size=medium]:p-(--spacing-md)',
        '[&:not([data-kind=option])]:data-[size=small]:gap-(--spacing-xs) [&:not([data-kind=inline],[data-kind=option])]:data-[size=small]:px-(--spacing-md) [&:not([data-kind=inline],[data-kind=option])]:data-[size=small]:py-(--spacing-sm)',
        'data-[kind=option]:gap-(--spacing-sm) data-[kind=option]:px-(--spacing-sm) data-[kind=option]:py-(--spacing-xs) data-[kind=option]:aria-pressed:bg-(--bg-selected) data-[kind=option]:aria-selected:bg-(--bg-selected)',
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
