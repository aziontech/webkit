<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import Item from '@aziontech/webkit/item'
  import Select from '@aziontech/webkit/select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'

  import { labelFor, type ServiceWizardForm, type ServiceWizardNames } from '../lib/service-wizard'
  import { errorPages, platformDomainSuffix, tlsVersions } from '../sample'

  export interface ServiceAdvancedProps {
    /** The names the service, deployment and domain get. */
    names: ServiceWizardNames
  }

  defineProps<ServiceAdvancedProps>()

  /** The domain and deployment answers. */
  const form = defineModel<ServiceWizardForm>('form', { required: true })

  /** Whether the Advanced settings are open. */
  const advancedOpen = defineModel<boolean>('advancedOpen', { required: true })
</script>

<template>
  <SettingsGroup
    label="Advanced"
    hint="Every field here already carries the endpoint's own default, and all of them can be changed once the service exists."
    v-model:open="advancedOpen"
    icon="az az-settings"
    collapsible
  >
    <Card :padded="false">
      <template #default>
        <div class="p-(--spacing-md)">
          <Field>
            <div class="flex min-w-0 items-center justify-between gap-(--spacing-xs)">
              <Field.Label
                for="minimum-tls-version"
                hint="Connections negotiating below this version are refused."
                >Minimum TLS version</Field.Label
              >
            </div>
            <Select
              v-model="form.minimumTlsVersion"
              size="large"
              class="w-full"
              :display-value="labelFor(tlsVersions)"
            >
              <Select.Trigger
                id="minimum-tls-version"
                aria-label="Minimum TLS version"
              />
              <Select.Content>
                <Select.Item
                  v-for="option in tlsVersions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </Select.Item>
              </Select.Content>
            </Select>
          </Field>
        </div>

        <div class="border-t border-(--border-default) p-(--spacing-md)">
          <Field>
            <Field.Label>Error page</Field.Label>
            <Select
              v-model="form.errorPage"
              size="large"
              placeholder="Not bound"
            >
              <Select.Trigger />
              <Select.Content>
                <Select.Item
                  v-for="option in errorPages"
                  :key="String(option.value)"
                  :value="option.value"
                  :disabled="option.disabled"
                >
                  {{ option.label }}
                </Select.Item>
              </Select.Content>
            </Select>
            <Field.Description
              >Optional. Without one, the service falls back to the default
              pages.</Field.Description
            >
          </Field>
        </div>

        <h3
          class="border-t border-(--border-default) px-(--spacing-md) pb-(--spacing-xs) pt-(--spacing-md) text-label-sm text-(--text-muted)"
        >
          Behavior
        </h3>
        <Item.List>
          <SettingsRow
            title="Allow the platform domain"
            variant="compact"
          >
            <template #description>
              Serve traffic on the provisioned
              {{ names.service ? names.service + platformDomainSuffix : 'platform domain' }}
              alongside your own. Turn it off once your own domain answers instead.
            </template>
            <Switch
              v-model="form.allowPlatformDomain"
              aria-label="Allow the platform domain"
            />
          </SettingsRow>
          <SettingsRow
            title="Active"
            description="When disabled, the service is created but does not serve traffic."
            variant="compact"
          >
            <Switch
              v-model="form.active"
              aria-label="Active"
            />
          </SettingsRow>
        </Item.List>
      </template>
    </Card>
  </SettingsGroup>
</template>
