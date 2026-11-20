<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Kbd from '@aziontech/webkit/kbd'
  import PageHeader from '@aziontech/webkit/page-header'
  import SaveBar from '@aziontech/webkit/save-bar'
  import Select, { type SelectOptionItem } from '@aziontech/webkit/select'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Subheader from '@aziontech/webkit/subheader'
  import Switch from '@aziontech/webkit/switch'
  import { toast } from '@aziontech/webkit/toast'
  import { useUnsavedChanges } from '@aziontech/webkit/use-unsaved-changes'
  import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'

  import { sampleProfile } from './settings-form.sample'

  /** The saved profile, and the values a save sends. */
  export interface SettingsFormProfile {
    /** The name shown across the account. */
    fullName: string
    /** Sign-in and notification address. */
    email: string
    /** Timezone option value. */
    timezone: string
    /** Interface language option value. */
    language: string
    /** Occasional product emails. */
    productUpdates: boolean
  }

  export interface SettingsFormProps {
    /** The saved profile; the form opens on it and Discard returns to it. Left out, the sample renders. */
    profile?: SettingsFormProfile
    /** Unsaved edits the form opens with on top of the profile, so it starts dirty. */
    defaultDraft?: Partial<SettingsFormProfile>
    /** The save is in flight: the fieldset and Discard lock and Save spins. */
    loading?: boolean
    /** Why the save failed, shown in the error toast with Retry; the edits are kept. */
    error?: string
  }

  const props = withDefaults(defineProps<SettingsFormProps>(), {
    profile: undefined,
    defaultDraft: () => ({}),
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    submit: [event: Event, values: SettingsFormProfile]
    discard: [event: MouseEvent]
  }>()

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

  const saved = computed<SettingsFormProfile>(() => props.profile ?? sampleProfile)
  const form = reactive<SettingsFormProfile>({ ...saved.value })
  const SAVE_TOAST = 'profile-save'
  const submitted = ref(false)
  const submitting = computed(() => props.loading)

  const {
    isDirty: dirty,
    commit,
    discard: restore
  } = useUnsavedChanges(() => form, {
    onDiscard: (baseline) => Object.assign(form, baseline)
  })

  Object.assign(form, props.defaultDraft)

  watch(
    () => JSON.stringify(saved.value),
    () => {
      Object.assign(form, saved.value)
      commit()
    }
  )

  const nameEmpty = computed(() => !form.fullName.trim())
  const emailEmpty = computed(() => !form.email.trim())
  const emailInvalid = computed(() => !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim()))
  const isValid = computed(() => !nameEmpty.value && !emailInvalid.value)

  const submit = (event: Event) => {
    if (submitting.value) return
    submitted.value = true
    if (!isValid.value) {
      nextTick(() => document.getElementById(nameEmpty.value ? 'full-name' : 'email')?.focus())
      return
    }
    toast.dismiss(SAVE_TOAST)
    emit('submit', event, { ...form })
  }

  const onSaveShortcut = (event: KeyboardEvent) => {
    if (!dirty.value || submitting.value) return
    submit(event)
  }

  const showFailure = () => {
    toast.error("The profile wasn't saved.", {
      id: SAVE_TOAST,
      description: props.error,
      action: { label: 'Retry', onClick: (event: MouseEvent) => submit(event) }
    })
  }

  onMounted(() => {
    if (props.error) showFailure()
  })

  watch(
    () => props.error,
    (next) => {
      if (next && !props.loading) showFailure()
    }
  )

  watch(
    () => props.loading,
    (now, before) => {
      if (!before || now) return
      if (props.error) {
        showFailure()
        return
      }
      commit()
      submitted.value = false
      toast.success('Profile saved.', { id: SAVE_TOAST })
    }
  )

  const discard = (event: MouseEvent) => {
    restore()
    submitted.value = false
    emit('discard', event)
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
          <Subheader
            title="General"
            size="small"
          />
          <Card :padded="false">
            <template #default>
              <Item.List>
                <SettingsRow
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
                        required
                        :invalid="submitted && nameEmpty"
                        :aria-describedby="submitted && nameEmpty ? 'full-name-error' : undefined"
                      />
                      <FieldError
                        v-if="submitted && nameEmpty"
                        id="full-name-error"
                        >This field is required.</FieldError
                      >
                    </div>
                  </div>
                </SettingsRow>
                <SettingsRow
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
                        required
                        :invalid="submitted && (emailEmpty || emailInvalid)"
                        :aria-describedby="submitted && emailInvalid ? 'email-error' : undefined"
                      />
                      <FieldError
                        v-if="submitted && emailInvalid"
                        id="email-error"
                        >{{
                          emailEmpty ? 'This field is required.' : 'Enter a valid email address.'
                        }}</FieldError
                      >
                    </div>
                  </div>
                </SettingsRow>
              </Item.List>
            </template>
          </Card>
        </section>

        <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
          <Subheader
            title="Preferences"
            size="small"
          />
          <Card :padded="false">
            <template #default>
              <Item.List>
                <SettingsRow
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
                </SettingsRow>
                <SettingsRow
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
                </SettingsRow>
              </Item.List>
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
              <Item.List>
                <SettingsRow
                  title="Product updates"
                  description="Occasional emails about new features and changes."
                  variant="compact"
                >
                  <Switch
                    v-model="form.productUpdates"
                    aria-label="Product updates"
                    :disabled="submitting"
                  />
                </SettingsRow>
              </Item.List>
            </template>
          </Card>
        </section>
      </fieldset>
    </div>

    <SaveBar
      variant="plain"
      @save="onSaveShortcut"
    >
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
          variant="primary"
          size="medium"
          :loading="submitting"
          :disabled="!dirty"
          @click="submit"
          aria-keyshortcuts="Meta+S Control+S"
        >
          Save
          <Kbd
            meta
            size="small"
            aria-hidden="true"
            >S</Kbd
          >
        </Button>
      </template>
    </SaveBar>
  </form>
</template>
