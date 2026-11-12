<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import HelperText from '@aziontech/webkit/helper-text'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import SettingRow from '@aziontech/webkit/setting-row'
  import Switch from '@aziontech/webkit/switch'
  import { computed, nextTick, reactive, type Ref, ref } from 'vue'

  const languages = [
    { label: 'English', value: 'en' },
    { label: 'Português', value: 'pt' },
    { label: 'Español', value: 'es' }
  ]
  const languageLabel = (value: string) =>
    languages.find((option) => option.value === value)?.label ?? ''

  const general = reactive({ fullName: 'Alex Morgan', language: 'en' })
  const savingGeneral = ref(true)

  const notifications = reactive({ productUpdates: true, securityAlerts: true })
  const savingNotifications = ref(false)

  const saveGroup = (flag: Ref<boolean>) => {
    if (flag.value) return
    flag.value = true
    setTimeout(() => {
      flag.value = false
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
    saveGroup(savingGeneral)
  }
  const saveNotifications = () => saveGroup(savingNotifications)
</script>

<template>
  <div class="layout-boundary flex w-full flex-col">
    <PageHeader
      title="Preferences"
      description="Define the language and notifications of your account."
      size="small"
    />

    <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
      <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">General</p>
      <Card :padded="false">
        <template #content>
          <fieldset
            class="m-0 flex min-w-0 flex-col border-0 p-0"
            :disabled="savingGeneral"
          >
            <legend class="sr-only">General</legend>
            <Item.List>
              <SettingRow
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
                      :required="generalSubmitted && nameEmpty"
                      :aria-describedby="
                        generalSubmitted && nameEmpty ? 'group-full-name-error' : undefined
                      "
                    />
                    <HelperText
                      v-if="generalSubmitted && nameEmpty"
                      id="group-full-name-error"
                      kind="required"
                      label="This field is required."
                    />
                  </div>
                </div>
              </SettingRow>

              <SettingRow
                title="Language"
                description="The interface language."
              >
                <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
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
                </div>
              </SettingRow>
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
      </Card>
    </section>

    <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
      <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">Notifications</p>
      <Card :padded="false">
        <template #content>
          <fieldset
            class="m-0 flex min-w-0 flex-col border-0 p-0"
            :disabled="savingNotifications"
          >
            <legend class="sr-only">Notifications</legend>
            <Item.List>
              <SettingRow
                title="Product updates"
                description="Occasional emails about new features and changes."
                kind="compact"
              >
                <Switch
                  v-model="notifications.productUpdates"
                  aria-label="Product updates"
                  :disabled="savingNotifications"
                />
              </SettingRow>

              <SettingRow
                title="Security alerts"
                description="Emails when a sign-in or key change is detected."
                kind="compact"
              >
                <Switch
                  v-model="notifications.securityAlerts"
                  aria-label="Security alerts"
                  :disabled="savingNotifications"
                />
              </SettingRow>
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
      </Card>
    </section>
  </div>
</template>
