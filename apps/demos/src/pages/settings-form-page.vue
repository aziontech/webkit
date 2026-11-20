<script setup lang="ts">
  import { ref } from 'vue'

  import { sampleProfile } from '../blocks/settings-form.sample'
  import SettingsForm, { type SettingsFormProfile } from '../blocks/settings-form.vue'

  const profile = ref<SettingsFormProfile>({ ...sampleProfile })
  const saving = ref(false)

  const onSubmit = (_event: Event, values: SettingsFormProfile) => {
    saving.value = true
    setTimeout(() => {
      profile.value = values
      saving.value = false
    }, 900)
  }
</script>

<template>
  <SettingsForm
    :profile="profile"
    :loading="saving"
    @submit="onSubmit"
  />
</template>
