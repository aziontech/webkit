<script setup>
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Select from '@aziontech/webkit/select'
  import Switch from '@aziontech/webkit/switch'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, reactive, ref } from 'vue'

  import UnsavedChangesGuard from '../../components/form/UnsavedChangesGuard.vue'
  import PageHeading from '../../components/page/PageHeading.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import { useBaseline } from '../../lib/behavior/forms'

  const languages = [
    { label: 'English', value: 'en' },
    { label: 'Português', value: 'pt' },
    { label: 'Español', value: 'es' }
  ]
  const languageLabel = (value) => languages.find((option) => option.value === value)?.label ?? ''

  const general = reactive({ fullName: 'Gabriel Lisboa', language: 'en' })
  const savingGeneral = ref(false)
  const generalBaseline = useBaseline(general)

  const notifications = reactive({ productUpdates: true, securityAlerts: true })
  const savingNotifications = ref(false)
  const notificationsBaseline = useBaseline(notifications)

  const saveGroup = async (flag, message, commit) => {
    if (flag.value) return
    flag.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 900))
      commit()
      toast.success(message)
    } catch (error) {
      toast.error('Could not save.', {
        description: error?.message ?? 'Check your connection and try again.'
      })
    } finally {
      flag.value = false
    }
  }

  const dirty = computed(() => generalBaseline.dirty.value || notificationsBaseline.dirty.value)

  const saveGeneral = () =>
    saveGroup(savingGeneral, 'General settings saved.', generalBaseline.commit)
  const saveNotifications = () =>
    saveGroup(savingNotifications, 'Notification settings saved.', notificationsBaseline.commit)
</script>

<template>
  <AppLayout
    active="forms"
    :breadcrumb="[
      { label: 'Forms', href: '/forms' },
      { label: 'ItemGroup with independent saves' }
    ]"
  >
    <UnsavedChangesGuard :dirty="dirty" />

    <main class="flex w-full flex-col">
      <PageHeading
        title="Preferences"
        description="The same partitioned-save idea as CardBox, on the ItemGroup surface: Item rows in a flush card, each topic group owning its own save, so changes commit in parts."
      />

      <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
        <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">General</p>
        <CardBox :padded="false">
          <template #content>
            <fieldset
              class="m-0 flex min-w-0 flex-col border-0 p-0"
              :disabled="savingGeneral"
            >
              <legend class="sr-only">General</legend>
              <Item.List>
                <Item size="small">
                  <Item.Content>
                    <Item.Title>Full Name</Item.Title>
                    <Item.Description>The name shown across the console.</Item.Description>
                  </Item.Content>
                  <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
                    <InputText
                      v-model="general.fullName"
                      size="large"
                      :disabled="savingGeneral"
                      class="w-full"
                      aria-label="Full Name"
                    />
                  </Item.Actions>
                </Item>

                <Item size="small">
                  <Item.Content>
                    <Item.Title>Language</Item.Title>
                    <Item.Description>The console interface language.</Item.Description>
                  </Item.Content>
                  <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
                    <Select
                      v-model="general.language"
                      size="large"
                      :disabled="savingGeneral"
                      class="w-full"
                      :display-value="languageLabel"
                    >
                      <Select.Trigger
                        id="preferences-language"
                        aria-label="Language"
                      />
                      <Select.Content>
                        <Select.Option
                          v-for="option in languages"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </Select.Option>
                      </Select.Content>
                    </Select>
                  </Item.Actions>
                </Item>
              </Item.List>
            </fieldset>
          </template>
          <template #footer>
            <div class="flex w-full items-center justify-end gap-(--spacing-sm)">
              <Button
                label="Save"
                kind="secondary"
                size="medium"
                :loading="savingGeneral"
                @click="saveGeneral"
              />
            </div>
          </template>
        </CardBox>
      </section>

      <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
        <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">
          Notifications
        </p>
        <CardBox :padded="false">
          <template #content>
            <fieldset
              class="m-0 flex min-w-0 flex-col border-0 p-0"
              :disabled="savingNotifications"
            >
              <legend class="sr-only">Notifications</legend>
              <Item.List>
                <Item size="small">
                  <Item.Content>
                    <Item.Title>Product updates</Item.Title>
                    <Item.Description
                      >Occasional emails about new features and changes.</Item.Description
                    >
                  </Item.Content>
                  <Item.Actions class="justify-end">
                    <Switch
                      v-model="notifications.productUpdates"
                      aria-label="Product updates"
                      :disabled="savingNotifications"
                    />
                  </Item.Actions>
                </Item>

                <Item size="small">
                  <Item.Content>
                    <Item.Title>Security alerts</Item.Title>
                    <Item.Description
                      >Emails when a sign-in or key change is detected.</Item.Description
                    >
                  </Item.Content>
                  <Item.Actions class="justify-end">
                    <Switch
                      v-model="notifications.securityAlerts"
                      aria-label="Security alerts"
                      :disabled="savingNotifications"
                    />
                  </Item.Actions>
                </Item>
              </Item.List>
            </fieldset>
          </template>
          <template #footer>
            <div class="flex w-full items-center justify-end gap-(--spacing-sm)">
              <Button
                label="Save"
                kind="secondary"
                size="medium"
                :loading="savingNotifications"
                @click="saveNotifications"
              />
            </div>
          </template>
        </CardBox>
      </section>
    </main>
  </AppLayout>
</template>
