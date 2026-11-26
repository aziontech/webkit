<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Card from '@aziontech/webkit/card'
  import Item from '@aziontech/webkit/item'
  import Select from '@aziontech/webkit/select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Tag from '@aziontech/webkit/tag'
  import { ref } from 'vue'

  import { optionLabel } from '../lib/option-label'
  import { sampleLinkedEnvironments as linkedEnvironments } from '../sample'
  import { useDeployableSettingsContext } from '../use-deployable-settings'
  import DeployableMtlsGroup from './deployable-mtls-group.vue'
  import DeployableProtocolGroup from './deployable-protocol-group.vue'

  const { form, saving } = useDeployableSettingsContext()

  const advancedOpen = ref(false)
  const settingName = (value: string) =>
    optionLabel(linkedEnvironments.flatMap((environment) => environment.options))(value)
</script>

<template>
  <SettingsGroup
    label="Advanced settings"
    hint="Deployment Settings, protocols and mutual authentication, which most resources never change."
    anchor="advanced-settings"
    v-model:open="advancedOpen"
    collapsible
  >
    <div class="flex min-w-0 flex-col">
      <SettingsGroup
        label="Deployment Settings"
        hint="Which shared configuration each of this resource’s environments publishes with, linked automatically by deployment policy."
        anchor="deployment-settings"
      >
        <div class="flex min-w-0 flex-col gap-(--spacing-md)">
          <Alert
            severity="info"
            size="small"
            action-label="Manage Deployment Settings"
          >
            Deployment Settings centralize the services, policies and error pages that environments
            share. Every environment a domain answers in is linked to one automatically, matching
            that environment’s deployment policy.
          </Alert>

          <Card :padded="false">
            <template #default>
              <Item.List>
                <SettingsRow
                  v-for="environment in linkedEnvironments"
                  :key="environment.name"
                  :title="environment.name"
                >
                  <template #description>
                    <span class="flex flex-wrap items-center gap-(--spacing-xs)">
                      <Tag
                        severity="info"
                        size="small"
                        :label="environment.policy"
                      />
                      <Tag
                        v-if="environment.auto && !form.deploymentSettings[environment.name]"
                        severity="neutral"
                        size="small"
                        label="Linked automatically"
                      />
                      <span class="text-body-xs text-(--text-muted)"
                        >Only {{ environment.policy }} Deployment Settings can be linked to this
                        environment.</span
                      >
                    </span>
                  </template>
                  <Select
                    :model-value="
                      form.deploymentSettings[environment.name] ?? environment.settingsId
                    "
                    size="large"
                    class="w-full"
                    placeholder="Select a deployment setting"
                    :readonly="saving"
                    :display-value="settingName"
                    @update:model-value="form.deploymentSettings[environment.name] = $event"
                  >
                    <Select.Trigger
                      class="w-full"
                      :aria-label="`Deployment Settings for ${environment.name}`"
                    />
                    <Select.Content>
                      <Select.Item
                        v-for="option in environment.options"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </Select.Item>
                    </Select.Content>
                  </Select>
                </SettingsRow>
              </Item.List>
            </template>
          </Card>
        </div>
      </SettingsGroup>

      <DeployableProtocolGroup />

      <DeployableMtlsGroup />
    </div>
  </SettingsGroup>
</template>
