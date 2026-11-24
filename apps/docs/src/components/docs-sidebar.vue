<script setup lang="ts">
  import Sidebar from '@aziontech/webkit/sidebar'

  import SideNav from './side-nav.vue'

  defineProps<{ label: string }>()
</script>

<template>
  <Sidebar
    :aria-label="label"
    class="w-full"
  >
    <SideNav />
  </Sidebar>
</template>
