<script setup lang="ts">
  import PageHeader from '@aziontech/webkit/page-header'

  import GeneralGroupCard from '../parts/general-group-card.vue'
  import NotificationsGroupCard from '../parts/notifications-group-card.vue'

  export interface SavePerGroupProps {
    /** General opens with its save in flight: its rows are disabled and its Save spins. */
    defaultSavingGeneral?: boolean
  }

  const props = withDefaults(defineProps<SavePerGroupProps>(), { defaultSavingGeneral: false })
</script>

<template>
  <div class="layout-boundary flex w-full flex-col">
    <PageHeader
      title="Preferences"
      description="Define the language and notifications of your account."
      size="small"
    />

    <GeneralGroupCard :default-saving="props.defaultSavingGeneral" />

    <NotificationsGroupCard />
  </div>
</template>
