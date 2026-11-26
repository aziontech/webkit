<script setup lang="ts">
  import Card from '@aziontech/ui/card'
  import FieldError from '@aziontech/ui/field-error'
  import Item from '@aziontech/ui/item'
  import MultiSelect from '@aziontech/ui/multi-select'
  import RadioGroup from '@aziontech/ui/radio-group'
  import SettingsRow from '@aziontech/ui/settings-row'
  import Subheader from '@aziontech/ui/subheader'

  import type { FormValidationService } from '../types'

  export interface ProtocolSectionProps {
    /** The save is in flight: the fields are disabled. */
    submitting?: boolean
  }

  withDefaults(defineProps<ProtocolSectionProps>(), { submitting: false })

  /** The messages of the fields a save flagged; typing clears them. */
  const errors = defineModel<{ httpPorts: string }>('errors', { required: true })

  /** The entries of the form. */
  const form = defineModel<FormValidationService>('form', { required: true })

  const protocolUsageOptions = [
    {
      value: 'http',
      label: 'HTTP support',
      description: 'Use only the HTTP protocol. Select from the available HTTP ports.'
    },
    {
      value: 'https',
      label: 'HTTP and HTTPS support',
      description:
        'Use both HTTP and HTTPS protocols. Select from the available HTTP and HTTPS ports.'
    },
    {
      value: 'http3',
      label: 'HTTP/3 support',
      description:
        'Use both HTTP and HTTPS protocols and enable HTTP/3 support. Only available for HTTP port 80 and HTTPS port 443.'
    }
  ]
  const httpPortOptions = [
    { label: '80 (default)', value: '80' },
    { label: '8080', value: '8080' },
    { label: '8008', value: '8008' }
  ]

  const portsLabel = (values: unknown[]) =>
    (values ?? [])
      .map((value) => httpPortOptions.find((option) => option.value === value)?.label ?? value)
      .join(', ')
</script>

<template>
  <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
    <Subheader title="Delivery settings" />
    <Card :padded="false">
      <template #default>
        <Item.List>
          <SettingsRow title="Protocol usage">
            <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
              <RadioGroup
                v-model="form.protocolUsage"
                variant="card"
                name="protocolUsage"
                aria-label="Protocol usage"
                :disabled="submitting"
              >
                <RadioGroup.Item
                  v-for="option in protocolUsageOptions"
                  :key="option.value"
                  :value="option.value"
                  :description="option.description"
                  >{{ option.label }}</RadioGroup.Item
                >
              </RadioGroup>
            </div>
          </SettingsRow>
          <SettingsRow
            title="HTTP ports"
            description="The ports the service listens on for HTTP traffic."
          >
            <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
              <div class="flex w-full flex-col gap-(--spacing-xs)">
                <MultiSelect
                  v-model="form.httpPorts"
                  size="large"
                  class="w-full"
                  placeholder="Select ports"
                  required
                  :invalid="!!errors.httpPorts"
                  :display-value="portsLabel"
                  :disabled="submitting"
                  @update:model-value="errors.httpPorts = ''"
                >
                  <MultiSelect.Trigger
                    id="ev-httpPorts"
                    aria-label="HTTP ports"
                    :aria-describedby="errors.httpPorts ? 'ev-httpPorts-error' : undefined"
                  />
                  <MultiSelect.Content>
                    <MultiSelect.Item
                      v-for="option in httpPortOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </MultiSelect.Item>
                  </MultiSelect.Content>
                </MultiSelect>
                <FieldError
                  v-if="errors.httpPorts"
                  id="ev-httpPorts-error"
                  >{{ errors.httpPorts }}</FieldError
                >
              </div>
            </div>
          </SettingsRow>
        </Item.List>
      </template>
    </Card>
  </section>
</template>
