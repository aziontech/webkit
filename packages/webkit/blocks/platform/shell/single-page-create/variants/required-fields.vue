<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import FieldRadioBlock from '@aziontech/webkit/field-radio-block'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import HelperText from '@aziontech/webkit/helper-text'
  import IconButton from '@aziontech/webkit/icon-button'
  import NumberInput from '@aziontech/webkit/number-input'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import Switch from '@aziontech/webkit/switch'
  import { computed, reactive, ref } from 'vue'

  const breadcrumb = [{ label: 'Forms', href: '/forms' }, { label: 'In Page create' }]

  const protocolUsageOptions = [
    {
      value: 'http',
      label: 'HTTP support',
      description: 'Use only the HTTP protocol. Choose from the available HTTP ports.'
    },
    {
      value: 'https',
      label: 'HTTP and HTTPS support',
      description:
        'Use both HTTP and HTTPS protocols. Choose from the available HTTP and HTTPS ports.'
    },
    {
      value: 'http3',
      label: 'HTTP/3 support',
      description:
        'Use both HTTP and HTTPS protocols and enable HTTP/3 support. Only available for HTTP port 80 and HTTPS port 443.'
    }
  ]
  const httpPortOptions = [
    { label: '80 (Default)', value: '80' },
    { label: '8080', value: '8080' },
    { label: '8008', value: '8008' }
  ]
  const httpsPortOptions = [
    { label: '443 (Default)', value: '443' },
    { label: '8443', value: '8443' }
  ]
  const protocolPolicyOptions = [
    { value: 'preserve', label: 'Preserve HTTP/HTTPS' },
    { value: 'http', label: 'Enforce HTTP' },
    { value: 'https', label: 'Enforce HTTPS' }
  ]
  const browserCacheOptions = [
    { value: 'override', label: 'Override cache settings' },
    {
      value: 'honor',
      label: 'Honor cache policies',
      description:
        'Honor cache policies from the origin or define a new maximum cache TTL for browsers.'
    }
  ]
  const cacheOptions = [
    { value: 'override', label: 'Override cache settings' },
    {
      value: 'honor',
      label: 'Honor cache policies',
      description:
        "Honor cache policies from the origin or define a new maximum TTL for the cache. If a TTL isn't received from the origin, cache will be maintained at a default TTL."
    }
  ]

  const portsLabel = (list) => (values) =>
    (values ?? [])
      .map((value) => list.find((option) => option.value === value)?.label ?? value)
      .join(', ')

  const form = reactive({
    name: '',
    protocolUsage: 'http',
    httpPorts: ['80'],
    httpsPorts: ['443'],
    protocolPolicy: 'preserve',
    address: '',
    hostHeader: '${host}',
    browserCache: 'override',
    browserMaxTtl: 0,
    cache: 'override',
    cacheMaxTtl: 60,
    debugRules: false
  })
  const httpsEnabled = computed(() => form.protocolUsage !== 'http')
  const errors = reactive({
    name: 'This field is required.',
    httpPorts: '',
    address: 'This field is required.',
    hostHeader: ''
  })
  const submitting = ref(false)

  const validate = () => {
    errors.name = form.name.trim() ? '' : 'This field is required.'
    errors.httpPorts = form.httpPorts.length ? '' : 'Select at least one HTTP port.'
    errors.address = form.address.trim() ? '' : 'This field is required.'
    errors.hostHeader = form.hostHeader.trim() ? '' : 'This field is required.'
    return !errors.name && !errors.httpPorts && !errors.address && !errors.hostHeader
  }

  const submit = () => validate()
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <GlobalHeader aria-label="Console">
      <GlobalHeader.Left>
        <IconButton
          icon="pi pi-chevron-left"
          aria-label="Back to Forms"
          kind="outlined"
          size="small"
        />
        <GlobalHeader.Brand>
          <a
            href="/home"
            aria-label="Azion home"
            class="inline-flex shrink-0 items-center self-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
          >
            <Brand
              kind="default"
              size="small"
            />
          </a>
        </GlobalHeader.Brand>
        <Breadcrumb :items="breadcrumb" />
      </GlobalHeader.Left>
      <GlobalHeader.Middle />
      <GlobalHeader.Right>
        <button
          type="button"
          aria-label="Account settings"
          class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Avatar
            label="name@example.com"
            size="medium"
            kind="square"
          />
        </button>
      </GlobalHeader.Right>
    </GlobalHeader>
    <main class="animate-page-enter motion-reduce:animate-none min-h-0 flex-1 overflow-auto">
      <form
        class="flex min-h-full flex-col"
        aria-label="Create Service"
        novalidate
        @submit.prevent="submit"
      >
        <div class="layout-column-form layout-boundary flex flex-1 flex-col">
          <fieldset
            class="mx-0 flex min-w-0 flex-col border-0 p-0"
            :disabled="submitting"
          >
            <legend class="sr-only">Create service</legend>

            <section class="flex flex-col gap-(--layout-group-gap)">
              <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">General</p>
              <Card :padded="false">
                <template #content>
                  <Item.List>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Name</Item.Title>
                        <Item.Description
                          >Give a unique and descriptive name to identify the
                          service.</Item.Description
                        >
                      </Item.Content>
                      <div class="flex max-w-(--container-3xs) flex-1 justify-end">
                        <Item.Actions class="w-full">
                          <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                            <div class="flex w-full flex-col gap-(--spacing-xs)">
                              <Input
                                v-model="form.name"
                                size="large"
                                class="w-full"
                                aria-label="Name"
                                placeholder="My Service"
                                :required="!!errors.name"
                                :aria-describedby="errors.name ? 'app-name-error' : undefined"
                                @update:model-value="errors.name = ''"
                              />
                              <HelperText
                                v-if="errors.name"
                                id="app-name-error"
                                kind="required"
                                :label="errors.name"
                              />
                            </div>
                          </div>
                        </Item.Actions>
                      </div>
                    </Item>
                  </Item.List>
                </template>
              </Card>
            </section>

            <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
              <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">
                Delivery Settings
              </p>
              <Card :padded="false">
                <template #content>
                  <Item.List>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Protocol Usage</Item.Title>
                      </Item.Content>
                      <div class="flex max-w-(--container-3xs) flex-1 justify-end">
                        <Item.Actions class="w-full">
                          <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                            <fieldset class="flex w-full flex-col gap-(--spacing-sm)">
                              <legend class="sr-only">Protocol Usage</legend>
                              <FieldRadioBlock
                                v-for="option in protocolUsageOptions"
                                :key="option.value"
                                v-model="form.protocolUsage"
                                :value="option.value"
                                name="protocolUsage"
                                :input-id="`app-protocolUsage-${option.value}`"
                                :label="option.label"
                                :description="option.description"
                              />
                            </fieldset>
                          </div>
                        </Item.Actions>
                      </div>
                    </Item>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>HTTP ports</Item.Title>
                      </Item.Content>
                      <div class="flex max-w-(--container-3xs) flex-1 justify-end">
                        <Item.Actions class="w-full">
                          <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                            <div class="flex w-full flex-col gap-(--spacing-xs)">
                              <MultiSelect
                                v-model="form.httpPorts"
                                size="large"
                                class="w-full"
                                placeholder="Select ports"
                                :required="!!errors.httpPorts"
                                :display-value="portsLabel(httpPortOptions)"
                                @update:model-value="errors.httpPorts = ''"
                              >
                                <MultiSelect.Trigger
                                  id="app-httpPorts"
                                  aria-label="HTTP ports"
                                  :aria-describedby="
                                    errors.httpPorts ? 'app-httpPorts-error' : undefined
                                  "
                                />
                                <MultiSelect.Content>
                                  <MultiSelect.Option
                                    v-for="option in httpPortOptions"
                                    :key="option.value"
                                    :value="option.value"
                                  >
                                    {{ option.label }}
                                  </MultiSelect.Option>
                                </MultiSelect.Content>
                              </MultiSelect>
                              <HelperText
                                v-if="errors.httpPorts"
                                id="app-httpPorts-error"
                                kind="required"
                                :label="errors.httpPorts"
                              />
                            </div>
                          </div>
                        </Item.Actions>
                      </div>
                    </Item>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>HTTPS ports</Item.Title>
                        <Item.Description
                          >Applies when the service serves HTTPS traffic.</Item.Description
                        >
                      </Item.Content>
                      <div class="flex max-w-(--container-3xs) flex-1 justify-end">
                        <Item.Actions class="w-full">
                          <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                            <MultiSelect
                              v-model="form.httpsPorts"
                              size="large"
                              class="w-full"
                              placeholder="443 (Default)"
                              :disabled="!httpsEnabled"
                              :display-value="portsLabel(httpsPortOptions)"
                            >
                              <MultiSelect.Trigger aria-label="HTTPS ports" />
                              <MultiSelect.Content>
                                <MultiSelect.Option
                                  v-for="option in httpsPortOptions"
                                  :key="option.value"
                                  :value="option.value"
                                >
                                  {{ option.label }}
                                </MultiSelect.Option>
                              </MultiSelect.Content>
                            </MultiSelect>
                          </div>
                        </Item.Actions>
                      </div>
                    </Item>
                  </Item.List>
                </template>
              </Card>
            </section>

            <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
              <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">Origins</p>
              <Card :padded="false">
                <template #content>
                  <Item.List>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Origin Type</Item.Title>
                        <Item.Description
                          >The origin type is pre-defined and can't be customized.</Item.Description
                        >
                      </Item.Content>
                      <div class="flex max-w-(--container-3xs) flex-1 justify-end">
                        <Item.Actions class="w-full">
                          <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                            <Input
                              model-value="Single Origin"
                              size="large"
                              class="w-full"
                              aria-label="Origin Type"
                              readonly
                            />
                          </div>
                        </Item.Actions>
                      </div>
                    </Item>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Protocol Policy</Item.Title>
                        <Item.Description
                          >Select the protocol used between the cache servers and the
                          origin.</Item.Description
                        >
                      </Item.Content>
                      <div class="flex max-w-(--container-3xs) flex-1 justify-end">
                        <Item.Actions class="w-full">
                          <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                            <fieldset class="flex w-full flex-col gap-(--spacing-sm)">
                              <legend class="sr-only">Protocol Policy</legend>
                              <FieldRadioBlock
                                v-for="option in protocolPolicyOptions"
                                :key="option.value"
                                v-model="form.protocolPolicy"
                                :value="option.value"
                                name="protocolPolicy"
                                :input-id="`app-protocolPolicy-${option.value}`"
                                :label="option.label"
                              />
                            </fieldset>
                          </div>
                        </Item.Actions>
                      </div>
                    </Item>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Address</Item.Title>
                        <Item.Description
                          >Define an origin for the content in FQDN format or an IPv4/IPv6
                          address.</Item.Description
                        >
                      </Item.Content>
                      <div class="flex max-w-(--container-3xs) flex-1 justify-end">
                        <Item.Actions class="w-full">
                          <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                            <div class="flex w-full flex-col gap-(--spacing-xs)">
                              <Input
                                v-model="form.address"
                                size="large"
                                class="w-full"
                                aria-label="Address"
                                placeholder="example.com"
                                :required="!!errors.address"
                                :aria-describedby="errors.address ? 'app-address-error' : undefined"
                                @update:model-value="errors.address = ''"
                              />
                              <HelperText
                                v-if="errors.address"
                                id="app-address-error"
                                kind="required"
                                :label="errors.address"
                              />
                            </div>
                          </div>
                        </Item.Actions>
                      </div>
                    </Item>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Host header</Item.Title>
                        <Item.Description
                          >Identify a virtualhost sent in the Host header to the
                          origin.</Item.Description
                        >
                      </Item.Content>
                      <div class="flex max-w-(--container-3xs) flex-1 justify-end">
                        <Item.Actions class="w-full">
                          <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                            <div class="flex w-full flex-col gap-(--spacing-xs)">
                              <Input
                                v-model="form.hostHeader"
                                size="large"
                                class="w-full"
                                aria-label="Host header"
                                :required="!!errors.hostHeader"
                                :aria-describedby="
                                  errors.hostHeader ? 'app-hostHeader-error' : undefined
                                "
                                @update:model-value="errors.hostHeader = ''"
                              />
                              <HelperText
                                v-if="errors.hostHeader"
                                id="app-hostHeader-error"
                                kind="required"
                                :label="errors.hostHeader"
                              />
                            </div>
                          </div>
                        </Item.Actions>
                      </div>
                    </Item>
                  </Item.List>
                </template>
              </Card>
            </section>

            <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
              <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">
                Cache Expiration Policies
              </p>
              <Card :padded="false">
                <template #content>
                  <Item.List>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Browser Cache Settings</Item.Title>
                      </Item.Content>
                      <div class="flex max-w-(--container-3xs) flex-1 justify-end">
                        <Item.Actions class="w-full">
                          <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                            <fieldset class="flex w-full flex-col gap-(--spacing-sm)">
                              <legend class="sr-only">Browser Cache Settings</legend>
                              <FieldRadioBlock
                                v-for="option in browserCacheOptions"
                                :key="option.value"
                                v-model="form.browserCache"
                                :value="option.value"
                                name="browserCache"
                                :input-id="`app-browserCache-${option.value}`"
                                :label="option.label"
                                :description="option.description"
                              />
                            </fieldset>
                          </div>
                        </Item.Actions>
                      </div>
                    </Item>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Maximum TTL (seconds)</Item.Title>
                      </Item.Content>
                      <div class="flex max-w-(--container-3xs) flex-1 justify-end">
                        <Item.Actions class="w-full">
                          <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                            <NumberInput
                              v-model="form.browserMaxTtl"
                              size="large"
                              class="w-full"
                              :min="0"
                              aria-label="Browser maximum TTL in seconds"
                            />
                          </div>
                        </Item.Actions>
                      </div>
                    </Item>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Cache Settings</Item.Title>
                      </Item.Content>
                      <div class="flex max-w-(--container-3xs) flex-1 justify-end">
                        <Item.Actions class="w-full">
                          <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                            <fieldset class="flex w-full flex-col gap-(--spacing-sm)">
                              <legend class="sr-only">Cache Settings</legend>
                              <FieldRadioBlock
                                v-for="option in cacheOptions"
                                :key="option.value"
                                v-model="form.cache"
                                :value="option.value"
                                name="cache"
                                :input-id="`app-cache-${option.value}`"
                                :label="option.label"
                                :description="option.description"
                              />
                            </fieldset>
                          </div>
                        </Item.Actions>
                      </div>
                    </Item>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Maximum TTL (seconds)</Item.Title>
                        <Item.Description
                          >Enable dynamic acceleration in the Main Settings tab to use values lower
                          than 60 seconds. A secondary cache requires a cache TTL equal to or
                          greater than 3 seconds.</Item.Description
                        >
                      </Item.Content>
                      <div class="flex max-w-(--container-3xs) flex-1 justify-end">
                        <Item.Actions class="w-full">
                          <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                            <NumberInput
                              v-model="form.cacheMaxTtl"
                              size="large"
                              class="w-full"
                              :min="0"
                              aria-label="Cache maximum TTL in seconds"
                            />
                          </div>
                        </Item.Actions>
                      </div>
                    </Item>
                  </Item.List>
                </template>
              </Card>
            </section>

            <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
              <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">Debug Rules</p>
              <Card :padded="false">
                <template #content>
                  <Item.List>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Active</Item.Title>
                        <Item.Description
                          >Rules that were successfully executed will be listed in the request logs
                          and in the trace of each event.</Item.Description
                        >
                      </Item.Content>
                      <Item.Actions>
                        <Switch
                          v-model="form.debugRules"
                          aria-label="Active"
                        />
                      </Item.Actions>
                    </Item>
                  </Item.List>
                </template>
              </Card>
            </section>
          </fieldset>
        </div>

        <footer
          class="sticky bottom-0 border-t-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface)"
        >
          <div
            class="layout-column-form layout-boundary-inline flex items-center justify-end gap-(--spacing-sm) py-(--spacing-md)"
          >
            <Button
              type="button"
              label="Cancel"
              kind="outlined"
              size="medium"
              :disabled="submitting"
            />
            <Button
              label="Save"
              kind="primary"
              size="medium"
              :loading="submitting"
              @click="submit"
            />
          </div>
        </footer>
      </form>
    </main>
  </div>
</template>
