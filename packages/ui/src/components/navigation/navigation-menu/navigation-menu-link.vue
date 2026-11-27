<script setup lang="ts">
  import { safeHref } from '../../../utils/safe-href'
  import NavigationMenuTrigger from './navigation-menu-trigger.vue'

  defineOptions({ name: 'NavigationMenuLink', inheritAttrs: false })

  export interface NavigationMenuLinkProps {
    /** Destination URL of the link. */
    href?: string
    /** Marks the link as the current page. */
    active?: boolean
    /** Closes the menu when the link is clicked. */
    closeOnClick?: boolean
  }

  withDefaults(defineProps<NavigationMenuLinkProps>(), {
    href: '',
    active: false,
    closeOnClick: false
  })

  defineSlots<{ default(): unknown }>()
</script>

<template>
  <NavigationMenuTrigger
    v-bind="$attrs"
    :href="safeHref(href) ?? undefined"
    :active="active"
    :close-on-click="closeOnClick"
  >
    <slot />
  </NavigationMenuTrigger>
</template>
