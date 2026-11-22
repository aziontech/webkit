<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Item from '@aziontech/webkit/item'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Subheader from '@aziontech/webkit/subheader'
  import Switch from '@aziontech/webkit/switch'
  import { reactive, ref } from 'vue'

  import { saveWithToast } from '../settings-form-save'

  const notifications = reactive({ productUpdates: true, securityAlerts: true })
  const savingNotifications = ref(false)
  const saveNotifications = () => saveWithToast(savingNotifications, 'Notification settings')
</script>

<template>
  <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
    <Subheader
      title="Notifications"
      size="small"
    />
    <Card :padded="false">
      <template #default>
        <fieldset
          class="m-0 flex min-w-0 flex-col border-0 p-0"
          :disabled="savingNotifications"
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
                :disabled="savingNotifications"
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
                :disabled="savingNotifications"
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
            :loading="savingNotifications"
            @click="saveNotifications"
          />
        </div>
      </template>
    </Card>
  </section>
</template>
