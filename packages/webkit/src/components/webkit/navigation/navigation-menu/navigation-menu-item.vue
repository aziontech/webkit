<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  import { cn } from '../../../../utils/cn'
  import {
    provideNavigationMenuItem,
    useNavigationMenuRoot
  } from './composables/use-navigation-menu-context.js'
  import { createChangeEventDetails } from './composables/use-navigation-menu-root.js'
  import {
    navigationMenuEntryAnchorClasses,
    navigationMenuEntryDescriptionClasses,
    navigationMenuEntryIconClasses,
    navigationMenuEntryTextClasses,
    navigationMenuEntryTitleClasses
  } from './presets/styles'

  export type NavigationMenuItemLayout = 'root' | 'entry'

  defineOptions({ name: 'NavigationMenuItem', inheritAttrs: false })

  interface Props {
    /** `root` for top-level rows; `entry` for panel links (Figma HeaderNavigationMenuItem). */
    layout?: NavigationMenuItemLayout
    /** Destination URL when `layout="entry"`. */
    href?: string
    /** Muted secondary line for entry rows. */
    description?: string
    /** Accent title styling (e.g. “Ver todas”). */
    featured?: boolean
    /** Closes the menu when the entry anchor is activated. */
    closeOnClick?: boolean
    /** Marks the entry as the current page. */
    active?: boolean
    /** Item value for controlled open state (auto-generated when omitted). */
    value?: string | number
    /** Polymorphic wrapper for root layout (`li` by default). */
    as?: string | object
  }

  const props = withDefaults(defineProps<Props>(), {
    layout: 'root',
    href: undefined,
    description: undefined,
    featured: false,
    closeOnClick: false,
    active: false,
    value: undefined,
    as: 'li'
  })

  defineSlots<{
    default(): unknown
    icon(): unknown
  }>()

  const attrs = useAttrs()
  const root = useNavigationMenuRoot()
  const autoId = useId()
  const itemValue = computed(() => props.value ?? autoId)
  const open = computed(() => root.isItemOpen(itemValue.value))
  const isEntry = computed(() => props.layout === 'entry')

  const testId = computed(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (isEntry.value ? 'navigation-menu__entry' : 'navigation-menu__item')
  )

  provideNavigationMenuItem({
    itemValue,
    open
  })

  const itemClass = computed(() =>
    isEntry.value ? undefined : cn(attrs.class as string | undefined)
  )

  const entryClass = computed(() =>
    cn(navigationMenuEntryAnchorClasses, attrs.class as string | undefined)
  )

  const onEntryClick = (event: MouseEvent) => {
    if (!props.closeOnClick) {
      return
    }

    root.setValue(null, createChangeEventDetails('link-press', event, event.currentTarget))
  }
</script>

<template>
  <component
    v-if="!isEntry"
    :is="as"
    :class="itemClass"
    role="none"
    :data-testid="testId"
  >
    <slot />
  </component>
  <li
    v-else
    role="none"
    :class="itemClass"
    :data-testid="testId"
  >
    <a
      :href="href"
      :class="entryClass"
      :data-active="active ? '' : undefined"
      :data-featured="featured ? '' : undefined"
      :aria-current="active ? 'page' : undefined"
      :data-testid="`${testId}__link`"
      @click="onEntryClick"
    >
      <span
        v-if="$slots.icon"
        :class="navigationMenuEntryIconClasses"
        aria-hidden="true"
        :data-testid="`${testId}__icon`"
      >
        <slot name="icon" />
      </span>
      <span :class="navigationMenuEntryTextClasses">
        <span
          :class="navigationMenuEntryTitleClasses"
          :data-featured="featured ? '' : undefined"
        >
          <slot />
        </span>
        <span
          v-if="description"
          :class="navigationMenuEntryDescriptionClasses"
          >{{ description }}</span
        >
      </span>
    </a>
  </li>
</template>
