<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import HelperText from '@aziontech/webkit/helper-text'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import SaveBar from '@aziontech/webkit/save-bar'
  import SectionHeader from '@aziontech/webkit/section-header'
  import Select, { type SelectOptionItem } from '@aziontech/webkit/select'
  import SettingRow from '@aziontech/webkit/setting-row'
  import Switch from '@aziontech/webkit/switch'
  import { toast } from '@aziontech/webkit/toast'
  import { useUnsavedChanges } from '@aziontech/webkit/use-unsaved-changes'
  import { computed, nextTick, onScopeDispose, reactive, ref } from 'vue'

  const timezones = [
    { label: '(UTC+00:00) UTC', value: 'utc' },
    { label: '(UTC-08:00) Los Angeles', value: 'america-los_angeles' },
    { label: '(UTC-05:00) New York', value: 'america-new_york' },
    { label: '(UTC-03:00) São Paulo', value: 'america-sao_paulo' },
    { label: '(UTC+00:00) London', value: 'europe-london' }
  ]
  const languages = [
    { label: 'English', value: 'en' },
    { label: 'Português', value: 'pt' },
    { label: 'Español', value: 'es' }
  ]
  const labelOf = (list: SelectOptionItem[]) => (value: string) =>
    list.find((option) => option.value === value)?.label ?? ''

  const form = reactive({
    fullName: 'Alex Morgan',
    email: '',
    timezone: 'utc',
    language: 'en',
    productUpdates: true
  })
  const failing = false
  const SAVE_TOAST = 'profile-save'
  const submitted = ref(false)
  const submitting = ref(true)
  let saveTimer: ReturnType<typeof setTimeout> | undefined

  const {
    isDirty: dirty,
    commit,
    discard: restore
  } = useUnsavedChanges(() => form, {
    onDiscard: (baseline) => Object.assign(form, baseline)
  })
  form.email = 'alex.morgan@example.com'

  onScopeDispose(() => clearTimeout(saveTimer))

  const nameEmpty = computed(() => !form.fullName.trim())
  const emailEmpty = computed(() => !form.email.trim())
  const emailInvalid = computed(() => !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim()))
  const isValid = computed(() => !nameEmpty.value && !emailInvalid.value)

  const submit = () => {
    if (submitting.value) return
    submitted.value = true
    if (!isValid.value) {
      nextTick(() => document.getElementById(nameEmpty.value ? 'full-name' : 'email')?.focus())
      return
    }
    submitting.value = true
    toast.dismiss(SAVE_TOAST)
    clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
      submitting.value = false
      if (failing) {
        toast.error("The profile wasn't saved.", {
          id: SAVE_TOAST,
          description: "The request didn't reach the server. Your changes are kept.",
          action: { label: 'Retry', onClick: () => submit() }
        })
        return
      }
      commit()
      submitted.value = false
      toast.success('Profile saved.', { id: SAVE_TOAST })
    }, 900)
  }

  const discard = () => {
    restore()
    submitted.value = false
  }
</script>

<template>
  <form
    class="flex flex-1 flex-col"
    aria-labelledby="profile-title"
    novalidate
    @submit.prevent="submit"
  >
    <div class="layout-column-form layout-boundary flex flex-1 flex-col">
      <PageHeader
        title="Profile"
        description="Define and manage personal account preferences."
        size="small"
        title-id="profile-title"
      />

      <fieldset
        class="layout-section-start mx-0 flex min-w-0 flex-col border-0 p-0"
        :disabled="submitting"
      >
        <legend class="sr-only">Profile settings</legend>

        <section class="flex flex-col gap-(--layout-group-gap)">
          <SectionHeader
            title="General"
            size="small"
          />
          <Card :padded="false">
            <template #default>
              <Item.List>
                <SettingRow
                  title="Full name"
                  description="The name shown across your account."
                >
                  <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                    <div class="flex w-full flex-col gap-(--spacing-xs)">
                      <Input
                        id="full-name"
                        v-model="form.fullName"
                        size="large"
                        :disabled="submitting"
                        class="w-full"
                        aria-label="Full name"
                        :required="submitted && nameEmpty"
                        :aria-describedby="submitted && nameEmpty ? 'full-name-error' : undefined"
                      />
                      <HelperText
                        v-if="submitted && nameEmpty"
                        id="full-name-error"
                        type="required"
                        label="This field is required."
                      />
                    </div>
                  </div>
                </SettingRow>
                <SettingRow
                  title="Email"
                  description="Used for sign-in and notifications."
                >
                  <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                    <div class="flex w-full flex-col gap-(--spacing-xs)">
                      <Input
                        id="email"
                        v-model="form.email"
                        type="email"
                        size="large"
                        :disabled="submitting"
                        class="w-full"
                        aria-label="Email"
                        :required="submitted && emailEmpty"
                        :invalid="submitted && !emailEmpty && emailInvalid"
                        :aria-describedby="submitted && emailInvalid ? 'email-error' : undefined"
                      />
                      <HelperText
                        v-if="submitted && emailInvalid"
                        id="email-error"
                        :type="emailEmpty ? 'required' : 'invalid'"
                        :label="
                          emailEmpty ? 'This field is required.' : 'Enter a valid email address.'
                        "
                      />
                    </div>
                  </div>
                </SettingRow>
              </Item.List>
            </template>
          </Card>
        </section>

        <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
          <SectionHeader
            title="Preferences"
            size="small"
          />
          <Card :padded="false">
            <template #default>
              <Item.List>
                <SettingRow
                  title="Timezone"
                  description="Times across the app are shown in this zone."
                >
                  <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                    <Select
                      v-model="form.timezone"
                      size="large"
                      :disabled="submitting"
                      class="w-full"
                      :display-value="labelOf(timezones)"
                    >
                      <Select.Trigger
                        id="profile-timezone"
                        aria-label="Timezone"
                      />
                      <Select.Content>
                        <Select.Item
                          v-for="option in timezones"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </Select.Item>
                      </Select.Content>
                    </Select>
                  </div>
                </SettingRow>
                <SettingRow
                  title="Language"
                  description="The interface language."
                >
                  <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                    <Select
                      v-model="form.language"
                      size="large"
                      :disabled="submitting"
                      class="w-full"
                      :display-value="labelOf(languages)"
                    >
                      <Select.Trigger
                        id="profile-language"
                        aria-label="Language"
                      />
                      <Select.Content>
                        <Select.Item
                          v-for="option in languages"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </Select.Item>
                      </Select.Content>
                    </Select>
                  </div>
                </SettingRow>
              </Item.List>
            </template>
          </Card>
        </section>

        <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
          <SectionHeader
            title="Notifications"
            size="small"
          />
          <Card :padded="false">
            <template #default>
              <Item.List>
                <SettingRow
                  title="Product updates"
                  description="Occasional emails about new features and changes."
                  variant="compact"
                >
                  <Switch
                    v-model="form.productUpdates"
                    aria-label="Product updates"
                    :disabled="submitting"
                  />
                </SettingRow>
              </Item.List>
            </template>
          </Card>
        </section>
      </fieldset>
    </div>

    <SaveBar variant="plain">
      <template #actions>
        <Button
          type="button"
          label="Discard"
          variant="outline"
          size="medium"
          :disabled="submitting || !dirty"
          @click="discard"
        />
        <Button
          label="Save"
          variant="primary"
          size="medium"
          :loading="submitting"
          :disabled="!dirty"
          @click="submit"
        />
      </template>
    </SaveBar>
  </form>
</template>
