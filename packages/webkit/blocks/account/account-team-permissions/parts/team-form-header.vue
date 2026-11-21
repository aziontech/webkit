<script setup lang="ts">
  import AppHeader from '@aziontech/webkit/app-header'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import IconButton from '@aziontech/webkit/icon-button'
  import { computed } from 'vue'

  export interface TeamFormHeaderProps {
    /** The page after the Teams and permissions crumb. */
    page: string
  }

  const props = defineProps<TeamFormHeaderProps>()

  const breadcrumb = computed(() => [
    { label: 'Teams and permissions', href: '/account/teams' },
    { label: props.page }
  ])
</script>

<template>
  <AppHeader aria-label="Console">
    <AppHeader.Start>
      <IconButton
        icon="az az-chevron-left"
        aria-label="Back to Teams and permissions"
        variant="outline"
        size="small"
        href="/account/teams"
      />
      <AppHeader.Brand
        href="/home"
        aria-label="Azion home"
      >
        <Brand
          variant="default"
          size="small"
        />
      </AppHeader.Brand>
      <Breadcrumb :items="breadcrumb" />
    </AppHeader.Start>
    <AppHeader.Center />
  </AppHeader>
</template>
