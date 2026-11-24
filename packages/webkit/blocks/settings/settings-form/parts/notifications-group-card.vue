<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Item from '@aziontech/webkit/item'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Subheader from '@aziontech/webkit/subheader'
  import Switch from '@aziontech/webkit/switch'
  import { reactive } from 'vue'

  import { useCardSave } from '../composables/use-card-save'

  /** The saved Notifications group, and the values its Save sends. */
  export interface NotificationsGroupValues {
    /** Occasional product emails. */
    productUpdates: boolean
    /** Emails on a new sign-in or key change. */
    securityAlerts: boolean
  }

  export interface NotificationsGroupCardProps {
    /** The saved values; Save stays disabled until the group differs from them. */
    values?: NotificationsGroupValues
    /** Unsaved edits the group opens with, so it starts dirty. */
    defaultDraft?: Partial<NotificationsGroupValues>
    /** The save of this group is in flight: its rows lock and its Save spins. */
    loading?: boolean
    /** Why the save failed, shown in the error toast with Retry; the edits are kept. */
    error?: string
  }

  const props = withDefaults(defineProps<NotificationsGroupCardProps>(), {
    values: () => ({ productUpdates: true, securityAlerts: true }),
    defaultDraft: () => ({}),
    loading: false,
    error: ''
  })

  const emit = defineEmits<{ submit: [event: Event, values: NotificationsGroupValues] }>()

  const notifications = reactive<NotificationsGroupValues>({
    ...props.values,
    ...props.defaultDraft
  })

  const { dirty, submitting, submit } = useCardSave({
    id: 'notifications-group',
    values: notifications,
    saved: () => props.values,
    loading: () => props.loading,
    error: () => props.error,
    savedMessage: 'Notification settings saved.',
    failedMessage: "The notification settings weren't saved.",
    onSubmit: (event, values) => emit('submit', event, values)
  })
</script>

<template>
  <form
    class="layout-section-start flex flex-col gap-(--layout-group-gap)"
    aria-label="Notifications"
    novalidate
    @submit.prevent="submit"
  >
    <Subheader
      title="Notifications"
      size="small"
    />
    <Card :padded="false">
      <template #default>
        <fieldset
          class="m-0 flex min-w-0 flex-col border-0 p-0"
          :disabled="submitting"
        >
          <legend class="sr-only">Notifications</legend>
          <Item.List>
            <SettingsRow
              title="Product updates"
              description="Occasional emails about new features and changes."
              variant="compact"
            >
              <Switch
                v-model="notifications.productUpdates"
                aria-label="Product updates"
                :disabled="submitting"
              />
            </SettingsRow>

            <SettingsRow
              title="Security alerts"
              description="Emails when a sign-in or key change is detected."
              variant="compact"
            >
              <Switch
                v-model="notifications.securityAlerts"
                aria-label="Security alerts"
                :disabled="submitting"
              />
            </SettingsRow>
          </Item.List>
        </fieldset>
      </template>
      <template #footer>
        <div class="flex w-full items-center justify-end gap-(--spacing-sm)">
          <Button
            label="Save"
            variant="secondary"
            size="medium"
            type="submit"
            :loading="submitting"
            :disabled="!dirty"
          />
        </div>
      </template>
    </Card>
  </form>
</template>
