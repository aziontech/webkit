<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import Card from '@aziontech/ui/card'
  import FieldError from '@aziontech/ui/field-error'
  import Input from '@aziontech/ui/input'
  import Item from '@aziontech/ui/item'
  import LanguageSelect from '@aziontech/ui/language-select'
  import SettingsRow from '@aziontech/ui/settings-row'
  import Subheader from '@aziontech/ui/subheader'
  import { computed, nextTick, reactive, ref } from 'vue'

  import { useCardSave } from '../composables/use-card-save'

  /** The saved General group, and the values its Save sends. */
  export interface GeneralGroupValues {
    /** The name shown across the account. */
    fullName: string
    /** Interface language option value. */
    language: string
  }

  export interface GeneralGroupCardProps {
    /** The saved values; Save stays disabled until the group differs from them. */
    values?: GeneralGroupValues
    /** Unsaved edits the group opens with, so it starts dirty. */
    defaultDraft?: Partial<GeneralGroupValues>
    /** The save of this group is in flight: its rows lock and its Save spins. */
    loading?: boolean
    /** Why the save failed, shown in the error toast with Retry; the edits are kept. */
    error?: string
  }

  const props = withDefaults(defineProps<GeneralGroupCardProps>(), {
    values: () => ({ fullName: 'Alex Morgan', language: 'en' }),
    defaultDraft: () => ({}),
    loading: false,
    error: ''
  })

  const emit = defineEmits<{ submit: [event: Event, values: GeneralGroupValues] }>()

  const general = reactive<GeneralGroupValues>({ ...props.values, ...props.defaultDraft })
  const generalSubmitted = ref(false)
  const nameEmpty = computed(() => !general.fullName.trim())

  const { dirty, submitting, submit } = useCardSave({
    id: 'general-group',
    values: general,
    saved: () => props.values,
    loading: () => props.loading,
    error: () => props.error,
    savedMessage: 'General settings saved.',
    failedMessage: "The general settings weren't saved.",
    valid: () => {
      generalSubmitted.value = true
      return !nameEmpty.value
    },
    onInvalid: () => nextTick(() => document.getElementById('group-full-name')?.focus()),
    onSubmit: (event, values) => {
      generalSubmitted.value = false
      emit('submit', event, values)
    }
  })
</script>

<template>
  <form
    class="layout-section-start flex flex-col gap-(--layout-group-gap)"
    aria-label="General"
    novalidate
    @submit.prevent="submit"
  >
    <Subheader
      title="General"
      size="small"
    />
    <Card :padded="false">
      <template #default>
        <fieldset
          class="m-0 flex min-w-0 flex-col border-0 p-0"
          :disabled="submitting"
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
                    :disabled="submitting"
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
                  :disabled="submitting"
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
            type="submit"
            :loading="submitting"
            :disabled="!dirty"
          />
        </div>
      </template>
    </Card>
  </form>
</template>
