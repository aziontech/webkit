<script setup lang="ts">
  import { ref } from 'vue'

  import { sampleProfile } from '../blocks/settings-form.sample'
  import SettingsForm, { type SettingsFormProfile } from '../blocks/settings-form.vue'
  import { account } from '../lib/navigation'

  const profile = ref<SettingsFormProfile>({
    ...sampleProfile,
    fullName: account.name,
    email: account.email
  })
  const saving = ref(false)

  const onSubmit = (_event: Event, values: SettingsFormProfile) => {
    saving.value = true
    setTimeout(() => {
      profile.value = values
      account.name = values.fullName.trim()
      account.email = values.email.trim()
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
