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
    /** Polymorphic wrapper element for root items. */
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

  const itemClasses = computed(() =>
    isEntry.value ? undefined : cn(attrs.class as string | undefined)
  )

  const entryClasses = computed(() =>
    cn(navigationMenuEntryAnchorClasses, attrs.class as string | undefined)
  )

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
  <component
    v-if="!isEntry"
    :is="props.as"
    :class="itemClasses"
    role="none"
    :data-testid="testId"
  >
    <slot />
  </component>
  <li
    v-else
    role="none"
    :data-testid="testId"
  >
    <a
      :href="href"
      :class="entryClasses"
      :data-testid="`${testId}__link`"
      :data-active="active ? '' : undefined"
      :data-featured="featured ? '' : undefined"
      :aria-current="active ? 'page' : undefined"
      @click="onEntryClick"
    >
      <span
        v-if="$slots['icon']"
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
          :data-testid="`${testId}__title`"
        >
          <slot />
        </span>
        <span
          v-if="description"
          :class="navigationMenuEntryDescriptionClasses"
          :data-testid="`${testId}__description`"
        >
          {{ description }}
        </span>
      </span>
    </a>
  </li>
</template>
