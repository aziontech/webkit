<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import Item from '@aziontech/webkit/item'
  import Select from '@aziontech/webkit/select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Switch from '@aziontech/webkit/switch'

  import type { DeploymentSettingsDefaultsValues } from '../account-deployment-settings.vue'
  import {
    BINDING_POLICIES,
    bindingLabel,
    DEPLOYMENT_POLICIES,
    deploymentLabel
  } from '../deployment-policies'

  export interface DeploymentDefaultsGroupProps {
    /** The first load is in flight: skeletons replace the controls. */
    firstLoad: boolean
    /** The defaults save is in flight. */
    saving: boolean
  }

  defineProps<DeploymentDefaultsGroupProps>()

  const form = defineModel<DeploymentSettingsDefaultsValues>('form', { required: true })
</script>

<template>
  <SettingsGroup
    label="New service defaults"
    anchor="new-service-defaults"
    hint="What the Deployment Setting created with the next service starts with."
  >
    <Card :padded="false">
      <template #default>
        <Item.List>
          <SettingsRow
            title="Binding policy"
            description="Whether a version locks the resource IDs it shipped with. Changing it does not touch the settings that already exist."
          >
            <Skeleton
              v-if="firstLoad"
              height="2.5rem"
            />
            <Select
              v-else
              v-model="form.bindingPolicy"
              size="large"
              class="w-full"
              :disabled="saving"
              :display-value="bindingLabel"
            >
              <Select.Trigger aria-label="Binding policy" />
              <Select.Content>
                <Select.Item
                  v-for="policy in BINDING_POLICIES"
                  :key="policy.value"
                  :value="policy.value"
                >
                  {{ policy.label }}
                </Select.Item>
              </Select.Content>
            </Select>
          </SettingsRow>
          <SettingsRow
            title="Deployment policy"
            description="Single serves one version and a deploy replaces it; Versioned gives each version its own URL. An environment can only use a setting that matches its own."
          >
            <Skeleton
              v-if="firstLoad"
              height="2.5rem"
            />
            <Select
              v-else
              v-model="form.deploymentPolicy"
              size="large"
              class="w-full"
              :disabled="saving"
              :display-value="deploymentLabel"
            >
              <Select.Trigger aria-label="Deployment policy" />
              <Select.Content>
                <Select.Item
                  v-for="policy in DEPLOYMENT_POLICIES"
                  :key="policy.value"
                  :value="policy.value"
                >
                  {{ policy.label }}
                </Select.Item>
              </Select.Content>
            </Select>
          </SettingsRow>
          <SettingsRow
            title="Apply to existing Deployment Settings"
            description="Give every setting this account already holds the binding policy above when you save. Default is never changed."
            variant="compact"
          >
            <Switch
              v-model="form.applyToExisting"
              :disabled="saving || firstLoad"
              aria-label="Apply to existing Deployment Settings"
            />
          </SettingsRow>
        </Item.List>
      </template>
    </Card>
  </SettingsGroup>
</template>
