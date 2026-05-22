<script setup>
  import NavigationMenuTrigger from './navigation-menu-trigger.vue'

  defineOptions({ name: 'NavigationMenuLink', inheritAttrs: false })
</script>

<template>
  <NavigationMenuTrigger v-bind="$attrs">
    <slot />
  </NavigationMenuTrigger>
</template>
