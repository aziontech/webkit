<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import LanguageSelect from '@aziontech/webkit/language-select'
  import PageHeader from '@aziontech/webkit/page-header'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Subheader from '@aziontech/webkit/subheader'
  import Switch from '@aziontech/webkit/switch'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, nextTick, reactive, type Ref, ref } from 'vue'

  export interface SavePerGroupProps {
    /** General opens with its save in flight: its rows are disabled and its Save spins. */
    defaultSavingGeneral?: boolean
  }

  const props = withDefaults(defineProps<SavePerGroupProps>(), { defaultSavingGeneral: false })

  const general = reactive({ fullName: 'Alex Morgan', language: 'en-US' })
  const savingGeneral = ref(props.defaultSavingGeneral)

  const notifications = reactive({ productUpdates: true, securityAlerts: true })
  const savingNotifications = ref(false)

  const saveGroup = (flag: Ref<boolean>, label: string) => {
    if (flag.value) return
    flag.value = true
    setTimeout(() => {
      flag.value = false
      toast.success(`${label} saved.`)
    }, 900)
  }

  const generalSubmitted = ref(false)
  const nameEmpty = computed(() => !general.fullName.trim())
  const saveGeneral = () => {
    generalSubmitted.value = true
    if (nameEmpty.value) {
      nextTick(() => document.getElementById('group-full-name')?.focus())
      return
    }
    generalSubmitted.value = false
    saveGroup(savingGeneral, 'General settings')
  }
  const saveNotifications = () => saveGroup(savingNotifications, 'Notification settings')
</script>

<template>
  <div class="layout-boundary flex w-full flex-col">
    <PageHeader
      title="Preferences"
      description="Define the language and notifications of your account."
      size="small"
    />

    <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
      <Subheader
        title="General"
        size="small"
      />
      <Card :padded="false">
        <template #default>
          <fieldset
            class="m-0 flex min-w-0 flex-col border-0 p-0"
            :disabled="savingGeneral"
          >
            <legend class="sr-only">General</legend>
            <Item.List>
              <SettingsRow
                title="Full name"
                description="The name shown across your account."
              >
                <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                  <div class="flex w-full flex-col gap-(--spacing-xs)">
                    <Input
                      id="group-full-name"
                      v-model="general.fullName"
                      size="large"
                      :disabled="savingGeneral"
                      class="w-full"
                      aria-label="Full name"
                      required
                      :invalid="generalSubmitted && nameEmpty"
                      :aria-describedby="
                        generalSubmitted && nameEmpty ? 'group-full-name-error' : undefined
                      "
                    />
                    <FieldError
                      v-if="generalSubmitted && nameEmpty"
                      id="group-full-name-error"
                      >This field is required.</FieldError
                    >
                  </div>
                </div>
              </SettingsRow>

              <SettingsRow
                title="Language"
                description="The interface language."
              >
                <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                  <LanguageSelect
                    id="preferences-language"
                    v-model="general.language"
                    size="large"
                    :disabled="savingGeneral"
                    aria-label="Language"
                    class="w-full"
                  />
                </div>
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
              :loading="savingGeneral"
              @click="saveGeneral"
            />
          </div>
        </template>
      </Card>
    </section>

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
  </div>
</template>
