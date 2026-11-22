<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import LanguageSelect from '@aziontech/webkit/language-select'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Subheader from '@aziontech/webkit/subheader'
  import { computed, nextTick, reactive, ref } from 'vue'

  import { saveWithToast } from '../settings-form-save'

  const props = withDefaults(defineProps<{ defaultSaving?: boolean }>(), { defaultSaving: false })

  const general = reactive({ fullName: 'Alex Morgan', language: 'en' })
  const savingGeneral = ref(props.defaultSaving)

  const generalSubmitted = ref(false)
  const nameEmpty = computed(() => !general.fullName.trim())
  const saveGeneral = () => {
    generalSubmitted.value = true
    if (nameEmpty.value) {
      nextTick(() => document.getElementById('group-full-name')?.focus())
      return
    }
    generalSubmitted.value = false
    saveWithToast(savingGeneral, 'General settings')
  }
</script>

<template>
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
</template>
