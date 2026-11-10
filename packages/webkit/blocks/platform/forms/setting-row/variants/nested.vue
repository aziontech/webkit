<script setup>
  import CardBox from '@aziontech/webkit/card-box'
  import Item from '@aziontech/webkit/item'
  import Select from '@aziontech/webkit/select'
  import Switch from '@aziontech/webkit/switch'
  import Textarea from '@aziontech/webkit/textarea'
  import { reactive } from 'vue'

  const tlsVersions = [
    { value: 'tls_1_3', label: 'TLS 1.3' },
    { value: 'tls_1_2', label: 'TLS 1.2' },
    { value: 'tls_1_1', label: 'TLS 1.1, deprecated' },
    { value: 'tls_1_0', label: 'TLS 1.0, deprecated' }
  ]

  const cipherSuites = [
    { value: '7', label: 'Modern v2025Q1' },
    { value: '6', label: 'Compatible v2025Q1' },
    { value: '5', label: 'Legacy v2025Q1' },
    { value: '4', label: 'Modern v2022Q1, migration to TLS 1.3' },
    { value: '3', label: 'Modern v2022Q1, TLS 1.2' },
    { value: '2', label: 'Compatible v2018Q1, TLS 1.2' },
    { value: '1', label: 'Legacy v2018Q1, TLS 1.2' },
    { value: '8', label: 'Legacy v2017Q1, all ciphers' }
  ]

  const form = reactive({
    httpPorts: '80',
    useHttps: true,
    httpsPorts: '443',
    minimumTlsVersion: 'tls_1_3',
    cipherSuite: '7',
    useHttp3: true,
    quicPorts: '443'
  })

  const labelFor = (options) => (value) =>
    options.find((option) => option.value === value)?.label ?? ''
</script>

<template>
  <CardBox :padded="false">
    <template #content>
      <Item.List>
        <Item size="small">
          <div class="flex w-full flex-col items-stretch gap-(--spacing-sm)">
            <Item.Content>
              <Item.Title>HTTP ports</Item.Title>
              <Item.Description>One port per line. 80 is the default.</Item.Description>
            </Item.Content>
            <Item.Actions class="w-full">
              <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                <Textarea
                  v-model="form.httpPorts"
                  class="w-full"
                  :rows="5"
                  aria-label="HTTP ports"
                />
              </div>
            </Item.Actions>
          </div>
        </Item>
        <Item size="small">
          <Item.Content>
            <Item.Title>HTTPS support</Item.Title>
            <Item.Description
              >Serve HTTPS as well as HTTP, on the HTTPS ports you choose.</Item.Description
            >
          </Item.Content>
          <Item.Actions>
            <Switch
              v-model="form.useHttps"
              aria-label="HTTPS support"
            />
          </Item.Actions>
        </Item>
        <Item
          v-if="form.useHttps"
          size="small"
        >
          <div class="flex w-full flex-col items-stretch gap-(--spacing-sm)">
            <Item.Content>
              <div class="flex flex-col border-l border-(--border-default) pl-(--spacing-md)">
                <Item.Title>HTTPS ports</Item.Title>
                <Item.Description>One port per line. 443 is the default.</Item.Description>
              </div>
            </Item.Content>
            <Item.Actions class="w-full">
              <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                <Textarea
                  v-model="form.httpsPorts"
                  class="w-full"
                  :rows="5"
                  aria-label="HTTPS ports"
                />
              </div>
            </Item.Actions>
          </div>
        </Item>
        <Item
          v-if="form.useHttps"
          size="small"
        >
          <Item.Content>
            <div class="flex flex-col border-l border-(--border-default) pl-(--spacing-md)">
              <Item.Title>Minimum TLS version</Item.Title>
              <Item.Description
                >Clients negotiating below this version are refused.</Item.Description
              >
            </div>
          </Item.Content>
          <div class="flex max-w-(--container-3xs) flex-1 justify-end">
            <Item.Actions class="w-full">
              <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
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
                    <Select.Option
                      v-for="option in tlsVersions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Option>
                  </Select.Content>
                </Select>
              </div>
            </Item.Actions>
          </div>
        </Item>
        <Item
          v-if="form.useHttps"
          size="small"
        >
          <Item.Content>
            <div class="flex flex-col border-l border-(--border-default) pl-(--spacing-md)">
              <Item.Title>Cipher suite</Item.Title>
              <Item.Description
                >The cipher suite the domain supports. The documentation lists the ciphers in each
                suite.</Item.Description
              >
            </div>
          </Item.Content>
          <div class="flex max-w-(--container-3xs) flex-1 justify-end">
            <Item.Actions class="w-full">
              <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                <Select
                  v-model="form.cipherSuite"
                  size="large"
                  placeholder="Select an option"
                  :display-value="labelFor(cipherSuites)"
                >
                  <Select.Trigger
                    class="w-full"
                    aria-label="Cipher suite"
                  />
                  <Select.Content>
                    <Select.Option
                      v-for="option in cipherSuites"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Option>
                  </Select.Content>
                </Select>
              </div>
            </Item.Actions>
          </div>
        </Item>
        <Item
          v-if="form.useHttps"
          size="small"
        >
          <Item.Content>
            <div class="flex flex-col border-l border-(--border-default) pl-(--spacing-md)">
              <Item.Title>HTTP/3 support</Item.Title>
              <Item.Description>Serve HTTP/3 over QUIC. It runs on top of HTTPS.</Item.Description>
            </div>
          </Item.Content>
          <Item.Actions>
            <Switch
              v-model="form.useHttp3"
              aria-label="HTTP/3 support"
            />
          </Item.Actions>
        </Item>
        <Item
          v-if="form.useHttps && form.useHttp3"
          size="small"
        >
          <div class="flex w-full flex-col items-stretch gap-(--spacing-sm)">
            <Item.Content>
              <div
                class="ml-(--spacing-md) flex flex-col border-l border-(--border-default) pl-(--spacing-md)"
              >
                <Item.Title>HTTP/3 ports</Item.Title>
                <Item.Description>One port per line. 443 is the default.</Item.Description>
              </div>
            </Item.Content>
            <Item.Actions class="w-full">
              <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                <Textarea
                  v-model="form.quicPorts"
                  class="w-full"
                  :rows="5"
                  aria-label="HTTP/3 ports"
                />
              </div>
            </Item.Actions>
          </div>
        </Item>
      </Item.List>
    </template>
  </CardBox>
</template>
