<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import Item from '@aziontech/webkit/item'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select, { type SelectOptionItem } from '@aziontech/webkit/select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import { ref } from 'vue'

  import {
    sampleCipherSuites as cipherSuites,
    sampleHttp3Ports as http3Ports,
    sampleHttpPorts as httpPorts,
    sampleHttpsPorts as httpsPorts,
    sampleTlsVersions as tlsVersions
  } from '../sample'
  import { provideProtocolsSettings } from '../use-protocols-settings'
  import ProtocolsMtlsGroup from './protocols-mtls-group.vue'
  import ProtocolsUploadDrawer from './protocols-upload-drawer.vue'
  import SettingsSaveBar from './settings-save-bar.vue'

  type LabeledOption = SelectOptionItem<string | number>

  const labelOf = (options: LabeledOption[]) => (value: string | number) =>
    options.find((option) => option.value === value)?.label ?? String(value)
  const portsLabel = (values: unknown[] | undefined) => (values ?? []).join(', ')

  const { form, saving, dirty, errors, clear, save, discard, setHttps, setHttp3, addCa, leave } =
    provideProtocolsSettings()

  const uploadOpen = ref(false)
</script>

<template>
  <div class="flex min-h-0 min-w-0 flex-1 flex-col">
    <form
      class="flex min-h-0 min-w-0 flex-1 flex-col"
      aria-label="Protocol settings"
      novalidate
      @submit.prevent="save"
    >
      <div class="layout-column-form layout-boundary flex min-w-0 flex-1 flex-col">
        <PageHeader
          title="Protocols"
          description="How clients connect to storefront: ports, TLS, and whether they must present a certificate."
          size="small"
        />

        <fieldset class="layout-section-start mx-0 flex min-w-0 flex-col border-0 p-0">
          <legend class="sr-only">Protocol settings</legend>

          <SettingsGroup
            label="Protocols"
            hint="The ports and TLS settings clients connect to this workload with."
            anchor="protocols"
          >
            <Card :padded="false">
              <template #default>
                <Item.List>
                  <TransitionGroup
                    enter-active-class="animate-content-enter motion-reduce:animate-none"
                  >
                    <SettingsRow
                      key="httpPorts"
                      title="HTTP ports"
                      description="The ports this workload answers plain HTTP on."
                    >
                      <MultiSelect
                        v-model="form.httpPorts"
                        size="large"
                        class="w-full"
                        placeholder="Select an HTTP port"
                        :display-value="portsLabel"
                        :readonly="saving"
                        required
                        :invalid="!!errors.httpPorts"
                        :aria-describedby="
                          errors.httpPorts ? 'protocols-httpPorts-message' : undefined
                        "
                        @update:model-value="clear('httpPorts')"
                      >
                        <MultiSelect.Trigger
                          id="protocols-httpPorts"
                          aria-label="HTTP ports"
                        />
                        <MultiSelect.Content>
                          <MultiSelect.Item
                            v-for="option in httpPorts"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </MultiSelect.Item>
                        </MultiSelect.Content>
                      </MultiSelect>
                      <FieldError
                        v-if="errors.httpPorts"
                        id="protocols-httpPorts-message"
                        >{{ errors.httpPorts.message }}</FieldError
                      >
                    </SettingsRow>
                    <SettingsRow
                      key="useHttps"
                      title="HTTPS support"
                      description="Answer on HTTPS as well as HTTP. HTTP/3 and mutual authentication need it."
                      variant="compact"
                    >
                      <Switch
                        :model-value="form.useHttps"
                        aria-label="HTTPS support"
                        :readonly="saving"
                        @update:model-value="setHttps"
                      />
                    </SettingsRow>
                    <SettingsRow
                      v-if="form.useHttps"
                      key="httpsPorts"
                      title="HTTPS ports"
                      description="The ports this workload answers TLS traffic on."
                      :depth="1"
                    >
                      <MultiSelect
                        v-model="form.httpsPorts"
                        size="large"
                        class="w-full"
                        placeholder="Select an HTTPS port"
                        :display-value="portsLabel"
                        :readonly="saving"
                        required
                        :invalid="!!errors.httpsPorts"
                        :aria-describedby="
                          errors.httpsPorts ? 'protocols-httpsPorts-message' : undefined
                        "
                        @update:model-value="clear('httpsPorts')"
                      >
                        <MultiSelect.Trigger
                          id="protocols-httpsPorts"
                          aria-label="HTTPS ports"
                        />
                        <MultiSelect.Content>
                          <MultiSelect.Item
                            v-for="option in httpsPorts"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </MultiSelect.Item>
                        </MultiSelect.Content>
                      </MultiSelect>
                      <FieldError
                        v-if="errors.httpsPorts"
                        id="protocols-httpsPorts-message"
                        >{{ errors.httpsPorts.message }}</FieldError
                      >
                    </SettingsRow>
                    <SettingsRow
                      key="useHttp3"
                      title="HTTP/3 support"
                      description="Serve over HTTP/3 where the client supports it. Turns HTTPS support on with it."
                      variant="compact"
                    >
                      <Switch
                        :model-value="form.useHttp3"
                        aria-label="HTTP/3 support"
                        :readonly="saving"
                        @update:model-value="setHttp3"
                      />
                    </SettingsRow>
                    <SettingsRow
                      v-if="form.useHttp3"
                      key="http3Ports"
                      title="HTTP/3 ports"
                      description="The ports QUIC is answered on."
                      :depth="1"
                    >
                      <MultiSelect
                        v-model="form.http3Ports"
                        size="large"
                        class="w-full"
                        placeholder="Select an HTTP/3 port"
                        :display-value="portsLabel"
                        :readonly="saving"
                        required
                        :invalid="!!errors.http3Ports"
                        :aria-describedby="
                          errors.http3Ports ? 'protocols-http3Ports-message' : undefined
                        "
                        @update:model-value="clear('http3Ports')"
                      >
                        <MultiSelect.Trigger
                          id="protocols-http3Ports"
                          aria-label="HTTP/3 ports"
                        />
                        <MultiSelect.Content>
                          <MultiSelect.Item
                            v-for="option in http3Ports"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </MultiSelect.Item>
                        </MultiSelect.Content>
                      </MultiSelect>
                      <FieldError
                        v-if="errors.http3Ports"
                        id="protocols-http3Ports-message"
                        >{{ errors.http3Ports.message }}</FieldError
                      >
                    </SettingsRow>
                    <SettingsRow
                      v-if="form.useHttps"
                      key="minimumTls"
                      title="Minimum TLS version"
                      description="The oldest TLS version a client may negotiate."
                    >
                      <Select
                        v-model="form.minimumTls"
                        size="large"
                        class="w-full"
                        :display-value="labelOf(tlsVersions)"
                        :readonly="saving"
                      >
                        <Select.Trigger aria-label="Minimum TLS version" />
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
                    </SettingsRow>
                    <SettingsRow
                      v-if="form.useHttps"
                      key="cipherSuite"
                      title="Cipher suite"
                      description="The ciphers offered during the handshake."
                    >
                      <Select
                        v-model="form.cipherSuite"
                        size="large"
                        class="w-full"
                        :display-value="labelOf(cipherSuites)"
                        :readonly="saving"
                      >
                        <Select.Trigger aria-label="Cipher suite" />
                        <Select.Content>
                          <Select.Item
                            v-for="option in cipherSuites"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </Select.Item>
                        </Select.Content>
                      </Select>
                    </SettingsRow>
                  </TransitionGroup>
                </Item.List>
              </template>
            </Card>
          </SettingsGroup>
          <ProtocolsMtlsGroup @upload="uploadOpen = true" />
        </fieldset>
      </div>

      <SettingsSaveBar
        :visible="dirty || saving"
        :guard="leave"
        :saving="saving"
        @save="save"
        @discard="discard"
      >
        Protocol settings changed.
        <span class="text-(--text-muted)">Saving deploys storefront to Production.</span>
      </SettingsSaveBar>
    </form>

    <ProtocolsUploadDrawer
      v-model:open="uploadOpen"
      @added="addCa"
    />
  </div>
</template>
