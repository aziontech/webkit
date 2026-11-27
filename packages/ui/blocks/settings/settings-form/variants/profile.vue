<script setup lang="ts">
  import ProfilePage, { type ProfileProps } from '../parts/profile-page.vue'

  const props = defineProps<ProfileProps>()
</script>

<template>
  <ProfilePage v-bind="props" />
</template>
