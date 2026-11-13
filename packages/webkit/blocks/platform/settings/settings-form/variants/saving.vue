<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import HelperText from '@aziontech/webkit/helper-text'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import SaveBar from '@aziontech/webkit/save-bar'
  import Select, { type SelectOptionItem } from '@aziontech/webkit/select'
  import SettingRow from '@aziontech/webkit/setting-row'
  import Switch from '@aziontech/webkit/switch'
  import { computed, nextTick, reactive, ref } from 'vue'

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

  const saved = ref({
    fullName: 'Alex Morgan',
    email: '',
    timezone: 'utc',
    language: 'en',
    productUpdates: true
  })
  const form = reactive({ ...saved.value })
  const submitted = ref(false)
  const submitting = ref(true)

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
    setTimeout(() => {
      saved.value = { ...form }
      submitted.value = false
      submitting.value = false
    }, 900)
  }

  const discard = () => {
    Object.assign(form, saved.value)
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
          <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">General</p>
          <Card :padded="false">
            <template #content>
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
                        kind="required"
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
                        :kind="emailEmpty ? 'required' : 'invalid'"
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
          <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">Preferences</p>
          <Card :padded="false">
            <template #content>
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
                        <Select.Option
                          v-for="option in timezones"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </Select.Option>
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
            </template>
          </Card>
        </section>

        <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
          <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">Notifications</p>
          <Card :padded="false">
            <template #content>
              <Item.List>
                <SettingRow
                  title="Product updates"
                  description="Occasional emails about new features and changes."
                  kind="compact"
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

    <SaveBar kind="plain">
      <template #actions>
        <Button
          type="button"
          label="Discard"
          kind="outlined"
          size="medium"
          :disabled="submitting"
          @click="discard"
        />
        <Button
          label="Save"
          kind="primary"
          size="medium"
          :loading="submitting"
          @click="submit"
        />
      </template>
    </SaveBar>
  </form>
</template>
