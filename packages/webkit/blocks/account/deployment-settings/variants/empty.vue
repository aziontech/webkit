<script setup lang="ts">
  import DeploymentSettings, { type DeploymentSettingsSetting } from '../deployment-settings.vue'

  const settings: DeploymentSettingsSetting[] = [
    {
      id: 'ds-default',
      name: 'Default',
      description: 'Used by every environment that has no setting of its own.',
      system: true,
      bindingPolicy: 'STRICT',
      deploymentPolicy: 'single_version',
      status: 'Active',
      updatedAt: new Date('2026-05-14T12:00:00Z'),
      updatedBy: 'system'
    }
  ]
</script>

<template>
  <DeploymentSettings
    :settings="settings"
    :services="[]"
  />
</template>
