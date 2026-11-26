<script setup lang="ts">
  import NavigationMenu from '@aziontech/ui/navigation-menu'

  defineProps<{ label: string; sections: { to: string; label: string }[]; active: string }>()
</script>

<template>
  <NavigationMenu
    :aria-label="label"
    class="ms-(--spacing-sm) hidden lg:flex"
  >
    <NavigationMenu.List>
      <NavigationMenu.Item
        v-for="section in sections"
        :key="section.to"
      >
        <NavigationMenu.Link
          :href="section.to"
          :active="active === section.to"
          >{{ section.label }}</NavigationMenu.Link
        >
      </NavigationMenu.Item>
    </NavigationMenu.List>
  </NavigationMenu>
</template>
