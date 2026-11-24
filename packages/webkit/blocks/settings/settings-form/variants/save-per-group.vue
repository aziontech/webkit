<script setup lang="ts">
  import PageHeader from '@aziontech/webkit/page-header'

  import GeneralGroupCard, {
    type GeneralGroupCardProps,
    type GeneralGroupValues
  } from '../parts/general-group-card.vue'
  import NotificationsGroupCard, {
    type NotificationsGroupCardProps,
    type NotificationsGroupValues
  } from '../parts/notifications-group-card.vue'

  /** Which group a Save sent, and its values. */
  export type SavePerGroupSubmit =
    | { group: 'general'; values: GeneralGroupValues }
    | { group: 'notifications'; values: NotificationsGroupValues }

  export interface SavePerGroupProps {
    /** The General group: saved values, opening draft, and its own save loading and error. */
    general?: GeneralGroupCardProps
    /** The Notifications group: saved values, opening draft, and its own save loading and error. */
    notifications?: NotificationsGroupCardProps
  }

  const props = withDefaults(defineProps<SavePerGroupProps>(), {
    general: () => ({}),
    notifications: () => ({})
  })

  const emit = defineEmits<{ submit: [event: Event, payload: SavePerGroupSubmit] }>()
</script>

<template>
  <div class="layout-boundary flex w-full flex-col">
    <PageHeader
      title="Preferences"
      description="Define the language and notifications of your account."
      size="small"
    />

    <GeneralGroupCard
      v-bind="props.general"
      @submit="(event, values) => emit('submit', event, { group: 'general', values })"
    />

    <NotificationsGroupCard
      v-bind="props.notifications"
      @submit="(event, values) => emit('submit', event, { group: 'notifications', values })"
    />
  </div>
</template>
