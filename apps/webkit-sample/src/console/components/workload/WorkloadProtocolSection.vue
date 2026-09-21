<script setup>
  import CardBox from '@aziontech/webkit/card-box'
  import Item from '@aziontech/webkit/item'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import Select from '@aziontech/webkit/select'
  import Switch from '@aziontech/webkit/switch'
  import { computed } from 'vue'

  import {
    CIPHER_SUITE_OPTIONS,
    cipherSuiteLabel,
    HTTP_PORT_OPTIONS,
    HTTP3_PORT_OPTIONS,
    HTTPS_PORT_OPTIONS,
    labelForPort,
    TLS_VERSION_OPTIONS,
    tlsVersionLabel
  } from '../../lib/data/workload-protocols'
  import FieldRow from '../form/FieldRow.vue'

  const props = defineProps({
    /** Locks every control while the page's commit is in flight. */
    disabled: { type: Boolean, default: false }
  })

  /**
   * The protocol slice of the workload's settings — `{ httpPorts, useHttps, httpsPorts,
   * useHttp3, http3Ports, minimumTlsVersion, cipherSuite }`. Bound with `v-model`, so
   * the page holds one object and the save bar commits it whole.
   */
  const model = defineModel({ type: Object, required: true })

  const secure = computed(() => model.value.useHttps || model.value.useHttp3)

  const portsLabel = (values) =>
    values.length ? values.map((value) => labelForPort(value)).join(', ') : ''

  const setHttps = (value) => {
    model.value.useHttps = value
    if (!value) model.value.useHttp3 = false
  }

  const setHttp3 = (value) => {
    model.value.useHttp3 = value
    if (value) model.value.useHttps = true
  }
</script>

<template>
  <CardBox :padded="false">
    <template #content>
      <Item.List>
        <FieldRow
          title="HTTP Ports"
          description="The ports this workload answers plain HTTP on."
          :message="model.httpPorts.length ? '' : 'Select at least one HTTP port.'"
          :message-kind="model.httpPorts.length ? 'helper' : 'required'"
        >
          <MultiSelect
            v-model="model.httpPorts"
            size="large"
            class="w-full"
            placeholder="Select an HTTP port"
            :disabled="props.disabled"
            :display-value="portsLabel"
          >
            <MultiSelect.Trigger aria-label="HTTP Ports" />
            <MultiSelect.Content>
              <MultiSelect.Option
                v-for="option in HTTP_PORT_OPTIONS"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </MultiSelect.Option>
            </MultiSelect.Content>
          </MultiSelect>
        </FieldRow>

        <FieldRow
          kind="compact"
          title="HTTPS support"
          description="Answer on both HTTP and HTTPS. Required by HTTP/3 and by mutual authentication."
        >
          <Switch
            :model-value="model.useHttps"
            aria-label="HTTPS support"
            :disabled="props.disabled"
            @update:model-value="setHttps"
          />
        </FieldRow>

        <FieldRow
          v-if="model.useHttps"
          key="https-ports"
          title="HTTPS Ports"
          description="The ports this workload answers TLS traffic on."
          :message="model.httpsPorts.length ? '' : 'Select at least one HTTPS port.'"
          :message-kind="model.httpsPorts.length ? 'helper' : 'required'"
        >
          <MultiSelect
            v-model="model.httpsPorts"
            size="large"
            class="w-full"
            placeholder="Select an HTTPS port"
            :disabled="props.disabled"
            :display-value="portsLabel"
          >
            <MultiSelect.Trigger aria-label="HTTPS Ports" />
            <MultiSelect.Content>
              <MultiSelect.Option
                v-for="option in HTTPS_PORT_OPTIONS"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </MultiSelect.Option>
            </MultiSelect.Content>
          </MultiSelect>
        </FieldRow>

        <FieldRow
          kind="compact"
          title="HTTP/3 support"
          description="Serve over HTTP/3 (QUIC) where the client supports it. Turns HTTPS support on with it."
        >
          <Switch
            :model-value="model.useHttp3"
            aria-label="HTTP/3 support"
            :disabled="props.disabled"
            @update:model-value="setHttp3"
          />
        </FieldRow>

        <FieldRow
          v-if="model.useHttp3"
          key="http3-ports"
          title="HTTP/3 Ports"
          description="The ports QUIC is answered on."
          :message="model.http3Ports.length ? '' : 'Select at least one HTTP/3 port.'"
          :message-kind="model.http3Ports.length ? 'helper' : 'required'"
        >
          <MultiSelect
            v-model="model.http3Ports"
            size="large"
            class="w-full"
            placeholder="Select an HTTP/3 port"
            :disabled="props.disabled"
            :display-value="portsLabel"
          >
            <MultiSelect.Trigger aria-label="HTTP/3 Ports" />
            <MultiSelect.Content>
              <MultiSelect.Option
                v-for="option in HTTP3_PORT_OPTIONS"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </MultiSelect.Option>
            </MultiSelect.Content>
          </MultiSelect>
        </FieldRow>

        <FieldRow
          v-if="secure"
          key="tls-version"
          title="Minimum TLS version"
          description="The oldest TLS version a client may negotiate with."
        >
          <Select
            v-model="model.minimumTlsVersion"
            size="large"
            class="w-full"
            :disabled="props.disabled"
            :display-value="tlsVersionLabel"
          >
            <Select.Trigger
              class="w-full"
              aria-label="Minimum TLS version"
            />
            <Select.Content>
              <Select.Option
                v-for="option in TLS_VERSION_OPTIONS"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </Select.Option>
            </Select.Content>
          </Select>
        </FieldRow>

        <FieldRow
          v-if="secure"
          key="cipher-suite"
          title="Cipher suite"
          description="The set of ciphers offered during the handshake."
        >
          <Select
            v-model="model.cipherSuite"
            size="large"
            class="w-full"
            :disabled="props.disabled"
            :display-value="cipherSuiteLabel"
          >
            <Select.Trigger
              class="w-full"
              aria-label="Cipher suite"
            />
            <Select.Content>
              <Select.Option
                v-for="option in CIPHER_SUITE_OPTIONS"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </Select.Option>
            </Select.Content>
          </Select>
        </FieldRow>
      </Item.List>
    </template>
  </CardBox>
</template>
