<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import ConfirmDialog from '@aziontech/ui/confirm-dialog'
  import { useUnsavedChanges } from '@aziontech/ui/use-unsaved-changes'
  import { computed, nextTick, reactive, ref, watch } from 'vue'

  import PolicyGroups from '../parts/policy-groups.vue'
  import SettingsTabPage from '../parts/settings-tab-page.vue'
  import { samplePolicy, samplePolicyModules, samplePolicyTabs } from '../sample'

  const currentTab = ref('main-settings')

  const form = reactive({ ...structuredClone(samplePolicy), debugRules: true })
  const saving = ref(false)

  const commitSave = () =>
    new Promise<void>((resolve) => {
      saving.value = true
      setTimeout(() => {
        guard.commit()
        saving.value = false
        resolve()
      }, 900)
    })

  const guard = useUnsavedChanges(() => form, {
    onDiscard: (baseline) => Object.assign(form, baseline),
    onSave: commitSave
  })
  guard.commit(samplePolicy)
  const dirty = guard.isDirty
  const leaveDialog = guard.dialogProps
  const leaveLabels = guard.labels

  const activeTab = computed({
    get: () => currentTab.value,
    set: async (value) => {
      if (!value || value === currentTab.value) return
      if (currentTab.value === 'main-settings' && !(await guard.confirmLeave())) return
      currentTab.value = value
    }
  })

  const nameError = ref(false)
  watch(
    () => form.name,
    () => {
      nameError.value = false
    }
  )

  const save = () => {
    if (!form.name.trim()) {
      nameError.value = true
      nextTick(() => document.getElementById('resource-name')?.focus())
      return
    }
    commitSave()
  }

  const discard = () => guard.discard()
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
    dirty-tab="main-settings"
    @save="save"
    @discard="discard"
  >
    <PolicyGroups
      v-model:name="form.name"
      v-model:active="form.active"
      v-model:debug-rules="form.debugRules"
      v-model:selected-keys="form.modules"
      :modules="samplePolicyModules"
      :name-invalid="nameError"
    />
    <template #message> You have unsaved changes. </template>
    <template #dialogs>
      <ConfirmDialog
        v-bind="leaveDialog"
        data-testid="unsaved-changes-dialog"
      >
        <template #actions>
          <Button
            :label="leaveLabels.keepEditing"
            variant="ghost"
            size="medium"
            :disabled="leaveDialog.loading"
            @click="guard.keepEditing"
          />
          <Button
            :label="leaveLabels.discard"
            variant="outline"
            size="medium"
            :disabled="leaveDialog.loading"
            @click="guard.discardAndLeave"
          />
          <Button
            :label="leaveLabels.save"
            variant="primary"
            size="medium"
            :loading="leaveDialog.loading"
            @click="guard.saveAndLeave"
          />
        </template>
      </ConfirmDialog>
    </template>
  </SettingsTabPage>
</template>
