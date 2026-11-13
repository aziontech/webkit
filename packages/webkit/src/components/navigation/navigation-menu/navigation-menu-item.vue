<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  import { cn } from '../../../utils/cn'
  import {
    provideNavigationMenuItem,
    useNavigationMenuRoot
  } from './composables/use-navigation-menu-context'
  import { createChangeEventDetails } from './composables/use-navigation-menu-root'

  defineOptions({ name: 'NavigationMenuItem', inheritAttrs: false })

  export type NavigationMenuItemLayout = 'root' | 'entry'

  interface Props {
    /** Root submenu item vs panel entry row. */
    layout?: NavigationMenuItemLayout
    /** Entry link URL when `layout="entry"`. */
    href?: string
    /** Muted secondary line for entry rows. */
    description?: string
    /** Brand link styling for featured entries. */
    featured?: boolean
    /** Closes the menu when the entry is clicked. */
    closeOnClick?: boolean
    /** Marks the entry as the current page. */
    active?: boolean
    /** Submenu item value (auto-generated when omitted). */
    value?: string | number
  }

  const props = withDefaults(defineProps<Props>(), {
    layout: 'root',
    href: undefined,
    description: undefined,
    featured: false,
    closeOnClick: false,
    active: false,
    value: undefined
  })

  defineSlots<{
    default(): unknown
    icon(): unknown
  }>()

  const attrs = useAttrs()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-menu__item'
  )

  const root = useNavigationMenuRoot()
  const autoId = useId()
  const itemValue = computed(() => props.value ?? autoId)
  const open = computed(() => root.isItemOpen(itemValue.value))
  const isEntry = computed(() => props.layout === 'entry')

  provideNavigationMenuItem({
    itemValue,
    open
  })

  const ENTRY_CLASS =
    'group flex min-h-14 w-full items-start gap-(--spacing-xs) ' +
    'rounded-(--shape-button) border border-transparent px-(--spacing-md) py-(--spacing-sm) no-underline ' +
    'text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none ' +
    'hover:bg-(--bg-hover) ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) ' +
    'focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)'

  const onEntryClick = (event: MouseEvent) => {
    if (!props.closeOnClick) {
      return
    }

    root.setValue(
      null,
      createChangeEventDetails('link-press', event, event.currentTarget as HTMLElement)
    )
  }
</script>

<template>
  <li
    v-if="!isEntry"
    :class="cn(attrs.class as string | undefined)"
    :data-testid="testId"
  >
    <slot />
  </li>
  <li
    v-else
    :data-testid="testId"
  >
    <a
      :href="href"
      :class="cn(ENTRY_CLASS, attrs.class as string | undefined)"
      :data-testid="`${testId}__link`"
      :data-active="active ? '' : undefined"
      :data-featured="featured ? '' : undefined"
      :aria-current="active ? 'page' : undefined"
      @click="onEntryClick"
    >
      <span
        v-if="$slots['icon']"
        class="mt-0.5 flex size-4 shrink-0 items-center justify-center text-(--text-default) [&_i]:text-body-md"
        aria-hidden="true"
        :data-testid="`${testId}__icon`"
      >
        <slot name="icon" />
      </span>
      <span class="flex min-w-0 flex-col">
        <span
          class="text-label-md text-(--text-default) group-hover:text-(--text-default) data-[featured]:text-(--text-link) data-[featured]:group-hover:text-(--text-link)"
          :data-featured="featured ? '' : undefined"
          :data-testid="`${testId}__title`"
        >
          <slot />
        </span>
        <span
          v-if="description"
          class="text-body-sm text-(--text-muted)"
          :data-testid="`${testId}__description`"
        >
          {{ description }}
        </span>
      </span>
    </a>
  </li>
</template>
