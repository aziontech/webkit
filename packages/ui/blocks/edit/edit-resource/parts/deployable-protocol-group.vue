<script setup lang="ts">
  import Card from '@aziontech/ui/card'
  import FieldError from '@aziontech/ui/field-error'
  import Item from '@aziontech/ui/item'
  import MultiSelect from '@aziontech/ui/multi-select'
  import Select from '@aziontech/ui/select'
  import SettingsGroup from '@aziontech/ui/settings-group'
  import SettingsRow from '@aziontech/ui/settings-row'
  import Switch from '@aziontech/ui/switch'

  import { optionLabel } from '../lib/option-label'
  import {
    sampleDeployableCipherSuites as cipherSuiteOptions,
    sampleDeployableHttp3Ports as http3PortOptions,
    sampleDeployableHttpPorts as httpPortOptions,
    sampleDeployableHttpsPorts as httpsPortOptions,
    sampleDeployableTlsVersions as tlsVersionOptions
  } from '../sample'
  import { useDeployableSettingsContext } from '../use-deployable-settings'

  const { form, saving, secure, setHttps, setHttp3 } = useDeployableSettingsContext()

  const portsLabel = (values: number[]) =>
    values.map((value) => optionLabel([...httpPortOptions, ...httpsPortOptions])(value)).join(', ')
  const tlsVersionLabel = optionLabel(tlsVersionOptions)
  const cipherSuiteLabel = optionLabel(cipherSuiteOptions)
</script>

<template>
  <SettingsGroup
    label="Protocol settings"
    hint="Which protocols and ports this resource answers on, and the TLS floor it accepts."
    anchor="protocol-settings"
  >
    <Card :padded="false">
      <template #default>
        <Item.List>
          <SettingsRow
            title="HTTP ports"
            description="The ports this resource answers plain HTTP on."
          >
            <MultiSelect
              v-model="form.protocols.httpPorts"
              size="large"
              class="w-full"
              placeholder="Select an HTTP port"
              :readonly="saving"
              :display-value="portsLabel"
            >
              <MultiSelect.Trigger aria-label="HTTP ports" />
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
              v-if="!form.protocols.httpPorts.length"
              id="http-ports-message"
              >{{ 'Select at least one HTTP port.' }}</FieldError
            >
          </SettingsRow>
          <SettingsRow
            title="HTTPS support"
            description="Answer on both HTTP and HTTPS. Required by HTTP/3 and by mutual authentication."
            variant="compact"
          >
            <Switch
              :model-value="form.protocols.useHttps"
              aria-label="HTTPS support"
              :readonly="saving"
              @update:model-value="setHttps"
            />
          </SettingsRow>
          <SettingsRow
            v-if="form.protocols.useHttps"
            key="https-ports"
            title="HTTPS ports"
            description="The ports this resource answers TLS traffic on."
          >
            <MultiSelect
              v-model="form.protocols.httpsPorts"
              size="large"
              class="w-full"
              placeholder="Select an HTTPS port"
              :readonly="saving"
              :display-value="portsLabel"
            >
              <MultiSelect.Trigger aria-label="HTTPS ports" />
              <MultiSelect.Content>
                <MultiSelect.Item
                  v-for="option in httpsPortOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </MultiSelect.Item>
              </MultiSelect.Content>
            </MultiSelect>
            <FieldError
              v-if="!form.protocols.httpsPorts.length"
              id="https-ports-message"
              >{{ 'Select at least one HTTPS port.' }}</FieldError
            >
          </SettingsRow>
          <SettingsRow
            title="HTTP/3 support"
            description="Serve over HTTP/3 (QUIC) where the client supports it. Turns HTTPS support on with it."
            variant="compact"
          >
            <Switch
              :model-value="form.protocols.useHttp3"
              aria-label="HTTP/3 support"
              :readonly="saving"
              @update:model-value="setHttp3"
            />
          </SettingsRow>
          <SettingsRow
            v-if="form.protocols.useHttp3"
            key="http3-ports"
            title="HTTP/3 ports"
            description="The ports QUIC is answered on."
          >
            <MultiSelect
              v-model="form.protocols.http3Ports"
              size="large"
              class="w-full"
              placeholder="Select an HTTP/3 port"
              :readonly="saving"
              :display-value="portsLabel"
            >
              <MultiSelect.Trigger aria-label="HTTP/3 ports" />
              <MultiSelect.Content>
                <MultiSelect.Item
                  v-for="option in http3PortOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </MultiSelect.Item>
              </MultiSelect.Content>
            </MultiSelect>
            <FieldError
              v-if="!form.protocols.http3Ports.length"
              id="http3-ports-message"
              >{{ 'Select at least one HTTP/3 port.' }}</FieldError
            >
          </SettingsRow>
          <SettingsRow
            v-if="secure"
            key="tls-version"
            title="Minimum TLS version"
            description="The oldest TLS version a client may negotiate with."
          >
            <Select
              v-model="form.protocols.minimumTlsVersion"
              size="large"
              class="w-full"
              :readonly="saving"
              :display-value="tlsVersionLabel"
            >
              <Select.Trigger
                class="w-full"
                aria-label="Minimum TLS version"
              />
              <Select.Content>
                <Select.Item
                  v-for="option in tlsVersionOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </Select.Item>
              </Select.Content>
            </Select>
          </SettingsRow>
          <SettingsRow
            v-if="secure"
            key="cipher-suite"
            title="Cipher suite"
            description="The set of ciphers offered during the handshake."
          >
            <Select
              v-model="form.protocols.cipherSuite"
              size="large"
              class="w-full"
              :readonly="saving"
              :display-value="cipherSuiteLabel"
            >
              <Select.Trigger
                class="w-full"
                aria-label="Cipher suite"
              />
              <Select.Content>
                <Select.Item
                  v-for="option in cipherSuiteOptions"
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
  </SettingsGroup>
</template>
