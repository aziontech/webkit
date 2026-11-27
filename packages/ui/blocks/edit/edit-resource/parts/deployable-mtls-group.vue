<script setup lang="ts">
  import Card from '@aziontech/ui/card'
  import FieldError from '@aziontech/ui/field-error'
  import Item from '@aziontech/ui/item'
  import MultiSelect from '@aziontech/ui/multi-select'
  import RadioGroup from '@aziontech/ui/radio-group'
  import Select from '@aziontech/ui/select'
  import SettingsGroup from '@aziontech/ui/settings-group'
  import SettingsRow from '@aziontech/ui/settings-row'
  import Switch from '@aziontech/ui/switch'

  import { optionLabel } from '../lib/option-label'
  import {
    sampleDeployableMtlsModes as mtlsModeOptions,
    sampleDeployableRevocationLists as revocationListOptions,
    sampleDeployableTrustedCas as trustedCaOptions
  } from '../sample'
  import { useDeployableSettingsContext } from '../use-deployable-settings'

  const { form, saving, armed } = useDeployableSettingsContext()

  const certificateName = (value: string) => (value ? optionLabel(trustedCaOptions)(value) : '')
  const crlLabel = (values: string[]) => values.map(optionLabel(revocationListOptions)).join(', ')
</script>

<template>
  <SettingsGroup
    label="Mutual authentication"
    hint="Require the client to present a certificate the resource can verify, as well as presenting its own."
    anchor="mutual-authentication"
  >
    <Card :padded="false">
      <template #default>
        <Item.List>
          <SettingsRow
            title="Mutual authentication"
            description="Require the client to present a certificate the resource can verify, as well as presenting its own."
            variant="compact"
          >
            <Switch
              v-model="form.mtls.enabled"
              aria-label="Mutual authentication"
              :readonly="saving"
              :disabled="!form.protocols.useHttps"
            />
          </SettingsRow>
          <SettingsRow
            v-if="armed"
            key="mtls-mode"
            title="Mode"
            description="What happens when the client certificate cannot be validated against the Trusted CA."
            variant="stacked"
          >
            <RadioGroup
              v-model="form.mtls.mode"
              variant="card"
              name="mtls-mode"
              aria-label="Mutual authentication mode"
              :readonly="saving"
            >
              <RadioGroup.Item
                v-for="option in mtlsModeOptions"
                :key="option.value"
                :value="option.value"
                :description="option.description"
                >{{ option.label }}</RadioGroup.Item
              >
            </RadioGroup>
          </SettingsRow>
          <SettingsRow
            v-if="armed"
            key="mtls-certificate"
            title="Trusted CA certificate"
            description="The authority a client certificate is verified against."
          >
            <Select
              v-model="form.mtls.certificate"
              size="large"
              class="w-full"
              placeholder="Select a Trusted CA certificate"
              :readonly="saving"
              :display-value="certificateName"
            >
              <Select.Trigger
                class="w-full"
                aria-label="Trusted CA certificate"
              />
              <Select.Content>
                <Select.Item
                  v-for="option in trustedCaOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </Select.Item>
              </Select.Content>
            </Select>
            <FieldError
              v-if="!form.mtls.certificate"
              id="mtls-certificate-message"
              >{{ 'Mutual authentication requires a Trusted CA certificate.' }}</FieldError
            >
          </SettingsRow>
          <SettingsRow
            v-if="armed"
            key="mtls-crl"
            title="Certificate revocation list"
            description="Revoked certificates are rejected during the handshake."
          >
            <MultiSelect
              v-model="form.mtls.crl"
              size="large"
              class="w-full"
              placeholder="Select a revocation list"
              :readonly="saving"
              :display-value="crlLabel"
            >
              <MultiSelect.Trigger aria-label="Certificate revocation list" />
              <MultiSelect.Content>
                <MultiSelect.Item
                  v-for="option in revocationListOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </MultiSelect.Item>
              </MultiSelect.Content>
            </MultiSelect>
          </SettingsRow>
        </Item.List>
      </template>
    </Card>
  </SettingsGroup>
</template>
