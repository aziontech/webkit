<script setup lang="ts">
  import NavigationMenuTrigger from './navigation-menu-trigger.vue'

  defineOptions({ name: 'NavigationMenuLink', inheritAttrs: false })

  interface Props {
    /** Destination URL of the link. */
    href?: string
    /** Marks the link as the current page. */
    active?: boolean
    /** Closes the menu when the link is clicked. */
    closeOnClick?: boolean
  }

  withDefaults(defineProps<Props>(), {
    href: '',
    active: false,
    closeOnClick: false
  })

  defineSlots<{ default(): unknown }>()
</script>

<template>
  <NavigationMenuTrigger
    v-bind="$attrs"
    :href="href"
    :active="active"
    :close-on-click="closeOnClick"
  >
    <slot />
  </NavigationMenuTrigger>
</template>
