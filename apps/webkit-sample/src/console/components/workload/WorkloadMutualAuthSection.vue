<script setup>
  import CardBox from '@aziontech/webkit/card-box'
  import FieldRadioBlock from '@aziontech/webkit/field-radio-block'
  import Item from '@aziontech/webkit/item'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import Select from '@aziontech/webkit/select'
  import Switch from '@aziontech/webkit/switch'
  import { computed, useId } from 'vue'

  import { certificateName, certificateOptionsOfType } from '../../lib/data/certificates'
  import { MTLS_MODE_OPTIONS } from '../../lib/data/workload-protocols'
  import FieldRow from '../form/FieldRow.vue'

  const props = defineProps({
    /** Whether the workload answers TLS at all. mTLS cannot be armed without it. */
    useHttps: { type: Boolean, default: false },
    /** Locks every control while the page's commit is in flight. */
    disabled: { type: Boolean, default: false }
  })

  /** The mTLS slice of the workload's settings — `{ enabled, mode, certificate, crl }`. */
  const model = defineModel({ type: Object, required: true })

  const groupName = `mtls-mode-${useId()}`

  const trustedCaOptions = computed(() => certificateOptionsOfType('trusted-ca'))
  const revocationListOptions = computed(() => certificateOptionsOfType('revocation-list'))

  const armed = computed(() => props.useHttps && model.value.enabled)

  const crlLabel = (values) => values.map((id) => certificateName(id)).join(', ')
</script>

<template>
  <CardBox :padded="false">
    <template #content>
      <Item.List>
        <FieldRow
          kind="compact"
          title="Mutual Authentication"
          description="Require the client to present a certificate the workload can verify, as well as presenting its own."
          :message="props.useHttps ? '' : 'Turn HTTPS support on above to arm mutual authentication.'"
          :message-kind="props.useHttps ? 'helper' : 'helper'"
        >
          <Switch
            v-model="model.enabled"
            aria-label="Mutual Authentication"
            :disabled="props.disabled || !props.useHttps"
          />
        </FieldRow>

        <FieldRow
          v-if="armed"
          key="mtls-mode"
          kind="wide"
          title="Mode"
          description="What happens when the client certificate cannot be validated against the Trusted CA."
        >
          <div
            role="radiogroup"
            aria-label="Mutual Authentication mode"
            class="flex w-full flex-col gap-(--spacing-sm)"
          >
            <FieldRadioBlock
              v-for="option in MTLS_MODE_OPTIONS"
              :key="option.value"
              v-model="model.mode"
              :value="option.value"
              :name="groupName"
              :input-id="`${groupName}-${option.value}`"
              :label="option.label"
              :description="option.description"
              :disabled="props.disabled"
            />
          </div>
        </FieldRow>

        <FieldRow
          v-if="armed"
          key="mtls-certificate"
          title="Trusted CA Certificate"
          description="The authority a client certificate is verified against."
          :message="model.certificate ? '' : 'Mutual Authentication requires a Trusted CA certificate.'"
          :message-kind="model.certificate ? 'helper' : 'required'"
        >
          <Select
            v-model="model.certificate"
            size="large"
            class="w-full"
            placeholder="Select a Trusted CA certificate"
            :disabled="props.disabled"
            :display-value="certificateName"
          >
            <Select.Trigger
              class="w-full"
              aria-label="Trusted CA Certificate"
            />
            <Select.Content>
              <Select.Option
                v-for="option in trustedCaOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </Select.Option>
            </Select.Content>
          </Select>
        </FieldRow>

        <FieldRow
          v-if="armed"
          key="mtls-crl"
          title="Certificate Revocation List"
          description="Revoked certificates are rejected during the handshake."
        >
          <MultiSelect
            v-model="model.crl"
            size="large"
            class="w-full"
            placeholder="Select a revocation list"
            :disabled="props.disabled"
            :display-value="crlLabel"
          >
            <MultiSelect.Trigger aria-label="Certificate Revocation List" />
            <MultiSelect.Content>
              <MultiSelect.Option
                v-for="option in revocationListOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </MultiSelect.Option>
            </MultiSelect.Content>
          </MultiSelect>
        </FieldRow>
      </Item.List>
    </template>
  </CardBox>
</template>
