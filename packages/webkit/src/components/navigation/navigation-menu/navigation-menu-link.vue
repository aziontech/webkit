<script setup lang="ts">
  import NavigationMenuTrigger from './navigation-menu-trigger.vue'

  defineOptions({ name: 'NavigationMenuLink', inheritAttrs: false })

  defineSlots<{ default(): unknown }>()
</script>

<template>
  <NavigationMenuTrigger v-bind="$attrs">
    <slot />
  </NavigationMenuTrigger>
</template>
