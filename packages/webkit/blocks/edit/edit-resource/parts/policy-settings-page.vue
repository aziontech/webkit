<script setup lang="ts">
  import { nextTick, ref, watch } from 'vue'

  import { samplePolicy, samplePolicyModules, samplePolicyTabs } from '../sample'
  import { useSettingsDraft } from '../use-settings-draft'
  import PolicyGroups, { type PolicySettingsRecord } from './policy-groups.vue'
  import SettingsTabPage from './settings-tab-page.vue'

  export interface PolicySettingsPageProps {
    /** Unsaved edits the form opens with, so the save bar is up. */
    defaultDraft?: Partial<PolicySettingsRecord>
    /** Opens with the save in flight: the fieldset and Discard lock and Save spins. */
    defaultSaving?: boolean
  }

  const props = withDefaults(defineProps<PolicySettingsPageProps>(), {
    defaultDraft: () => ({}),
    defaultSaving: false
  })

  const activeTab = ref('main-settings')
  const nameError = ref(false)

  const validate = () => {
    if (form.name.trim()) return true
    nameError.value = true
    nextTick(() => document.getElementById('resource-name')?.focus())
    return false
  }

  const { form, saving, dirty, save, discard } = useSettingsDraft(samplePolicy, {
    draft: props.defaultDraft,
    saving: props.defaultSaving,
    validate
  })

  watch(
    () => form.name,
    () => {
      nameError.value = false
    }
  )
</script>

<template>
  <SettingsTabPage
    v-model:tab="activeTab"
    :tabs="samplePolicyTabs"
    title="Settings"
    description="Core configuration for this policy."
    docs-href="https://example.com/docs/security-policies"
    :dirty="dirty"
    :saving="saving"
    @save="save"
    @discard="discard"
  >
    <fieldset
      v-if="defaultSaving"
      class="m-0 flex min-w-0 flex-col border-0 p-0"
      :disabled="saving"
    >
      <legend class="sr-only">Settings</legend>
      <PolicyGroups
        v-model:name="form.name"
        v-model:active="form.active"
        v-model:debug-rules="form.debugRules"
        v-model:selected-keys="form.modules"
        :modules="samplePolicyModules"
        :name-invalid="nameError"
        :disabled="saving"
      />
    </fieldset>
    <PolicyGroups
      v-else
      v-model:name="form.name"
      v-model:active="form.active"
      v-model:debug-rules="form.debugRules"
      v-model:selected-keys="form.modules"
      :modules="samplePolicyModules"
      :name-invalid="nameError"
    />
    <template #message> You have unsaved changes. </template>
  </SettingsTabPage>
</template>
