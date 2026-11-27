<script setup>
  import Card from '@aziontech/ui/card'
  import Item from '@aziontech/ui/item'
  import Select from '@aziontech/ui/select'
  import SettingsRow from '@aziontech/ui/settings-row'
  import Switch from '@aziontech/ui/switch'
  import Textarea from '@aziontech/ui/textarea'
  import { reactive } from 'vue'

  const tlsVersions = [
    { value: 'tls_1_3', label: 'TLS 1.3' },
    { value: 'tls_1_2', label: 'TLS 1.2' },
    { value: 'tls_1_1', label: 'TLS 1.1, deprecated' },
    { value: 'tls_1_0', label: 'TLS 1.0, deprecated' }
  ]

  const form = reactive({
    httpPorts: '80',
    useHttps: true,
    httpsPorts: '443',
    minimumTlsVersion: 'tls_1_3',
    useHttp3: true,
    quicPorts: '443'
  })

  const labelFor = (options) => (value) =>
    options.find((option) => option.value === value)?.label ?? ''
</script>

<template>
  <Card :padded="false">
    <template #default>
      <Item.List>
        <SettingsRow
          title="HTTP ports"
          description="One port per line. 80 is the default."
          variant="stacked"
        >
          <Textarea
            v-model="form.httpPorts"
            class="w-full"
            :rows="5"
            aria-label="HTTP ports"
          />
        </SettingsRow>
        <SettingsRow
          title="HTTPS support"
          description="Serve HTTPS as well as HTTP, on the HTTPS ports you choose."
          variant="compact"
        >
          <Switch
            v-model="form.useHttps"
            aria-label="HTTPS support"
          />
        </SettingsRow>
        <SettingsRow
          v-if="form.useHttps"
          title="HTTPS ports"
          description="One port per line. 443 is the default."
          variant="stacked"
          :depth="1"
        >
          <Textarea
            v-model="form.httpsPorts"
            class="w-full"
            :rows="5"
            aria-label="HTTPS ports"
          />
        </SettingsRow>
        <SettingsRow
          key="settings-row-2"
          v-if="form.useHttps"
          title="Minimum TLS version"
          description="Clients negotiating below this version are refused."
          :depth="1"
        >
          <Select
            v-model="form.minimumTlsVersion"
            size="large"
            placeholder="Select an option"
            :display-value="labelFor(tlsVersions)"
          >
            <Select.Trigger
              class="w-full"
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
        </SettingsRow>
        <SettingsRow
          key="settings-row-3"
          v-if="form.useHttps"
          title="HTTP/3 support"
          description="Serve HTTP/3 over QUIC. It runs on top of HTTPS."
          variant="compact"
          :depth="1"
        >
          <Switch
            v-model="form.useHttp3"
            aria-label="HTTP/3 support"
          />
        </SettingsRow>
        <SettingsRow
          key="settings-row-4"
          v-if="form.useHttps && form.useHttp3"
          title="HTTP/3 ports"
          description="One port per line. 443 is the default."
          variant="stacked"
          :depth="2"
        >
          <Textarea
            v-model="form.quicPorts"
            class="w-full"
            :rows="5"
            aria-label="HTTP/3 ports"
          />
        </SettingsRow>
      </Item.List>
    </template>
  </Card>
</template>
