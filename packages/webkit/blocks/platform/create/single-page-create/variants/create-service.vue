<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import HelperText from '@aziontech/webkit/helper-text'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import NumberInput from '@aziontech/webkit/number-input'
  import RadioButton from '@aziontech/webkit/radio-button'
  import SaveBar from '@aziontech/webkit/save-bar'
  import SettingRow from '@aziontech/webkit/setting-row'
  import Switch from '@aziontech/webkit/switch'
  import { computed, reactive, ref } from 'vue'

  const breadcrumb = [{ label: 'Forms', href: '/forms' }, { label: 'In-page create' }]

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
    { label: '80, default', value: '80' },
    { label: '8080', value: '8080' },
    { label: '8008', value: '8008' }
  ]
  const httpsPortOptions = [
    { label: '443, default', value: '443' },
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
  const errors = reactive({ name: '', httpPorts: '', address: '', hostHeader: '' })
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
            <legend class="sr-only">Create Service</legend>

            <section class="flex flex-col gap-(--layout-group-gap)">
              <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">General</p>
              <Card :padded="false">
                <template #content>
                  <Item.List>
                    <SettingRow
                      title="Name"
                      description="Give a unique and descriptive name to identify the service."
                    >
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
                    </SettingRow>
                  </Item.List>
                </template>
              </Card>
            </section>

            <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
              <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">
                Delivery settings
              </p>
              <Card :padded="false">
                <template #content>
                  <Item.List>
                    <SettingRow title="Protocol usage">
                      <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                        <fieldset class="flex w-full flex-col gap-(--spacing-sm)">
                          <legend class="sr-only">Protocol usage</legend>
                          <Field.Label
                            v-for="option in protocolUsageOptions"
                            :key="option.value"
                          >
                            <Field orientation="horizontal">
                              <RadioButton
                                v-model="form.protocolUsage"
                                :value="option.value"
                                name="protocolUsage"
                                :input-id="`app-protocolUsage-${option.value}`"
                              />
                              <Field.Content>
                                <Field.Title>
                                  {{ option.label }}
                                </Field.Title>
                                <Field.Description v-if="option.description">
                                  {{ option.description }}
                                </Field.Description>
                              </Field.Content>
                            </Field>
                          </Field.Label>
                        </fieldset>
                      </div>
                    </SettingRow>
                    <SettingRow title="HTTP ports">
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
                    </SettingRow>
                    <SettingRow
                      title="HTTPS ports"
                      description="Applies when the service serves HTTPS traffic."
                    >
                      <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                        <MultiSelect
                          v-model="form.httpsPorts"
                          size="large"
                          class="w-full"
                          placeholder="443"
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
                    </SettingRow>
                  </Item.List>
                </template>
              </Card>
            </section>

            <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
              <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">Origins</p>
              <Card :padded="false">
                <template #content>
                  <Item.List>
                    <SettingRow
                      title="Origin type"
                      description="The origin type is pre-defined and can't be customized."
                    >
                      <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                        <Input
                          model-value="Single Origin"
                          size="large"
                          class="w-full"
                          aria-label="Origin type"
                          readonly
                        />
                      </div>
                    </SettingRow>
                    <SettingRow
                      title="Protocol policy"
                      description="Select the protocol used between the cache servers and the origin."
                    >
                      <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                        <fieldset class="flex w-full flex-col gap-(--spacing-sm)">
                          <legend class="sr-only">Protocol policy</legend>
                          <Field.Label
                            v-for="option in protocolPolicyOptions"
                            :key="option.value"
                          >
                            <Field orientation="horizontal">
                              <RadioButton
                                v-model="form.protocolPolicy"
                                :value="option.value"
                                name="protocolPolicy"
                                :input-id="`app-protocolPolicy-${option.value}`"
                              />
                              <Field.Content>
                                <Field.Title>
                                  {{ option.label }}
                                </Field.Title>
                              </Field.Content>
                            </Field>
                          </Field.Label>
                        </fieldset>
                      </div>
                    </SettingRow>
                    <SettingRow
                      title="Address"
                      description="Define an origin for the content in FQDN format or an IPv4/IPv6 address."
                    >
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
                    </SettingRow>
                    <SettingRow
                      title="Host header"
                      description="Identify a virtualhost sent in the Host header to the origin."
                    >
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
                    </SettingRow>
                  </Item.List>
                </template>
              </Card>
            </section>

            <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
              <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">
                Cache expiration policies
              </p>
              <Card :padded="false">
                <template #content>
                  <Item.List>
                    <SettingRow title="Browser cache settings">
                      <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                        <fieldset class="flex w-full flex-col gap-(--spacing-sm)">
                          <legend class="sr-only">Browser cache settings</legend>
                          <Field.Label
                            v-for="option in browserCacheOptions"
                            :key="option.value"
                          >
                            <Field orientation="horizontal">
                              <RadioButton
                                v-model="form.browserCache"
                                :value="option.value"
                                name="browserCache"
                                :input-id="`app-browserCache-${option.value}`"
                              />
                              <Field.Content>
                                <Field.Title>
                                  {{ option.label }}
                                </Field.Title>
                                <Field.Description v-if="option.description">
                                  {{ option.description }}
                                </Field.Description>
                              </Field.Content>
                            </Field>
                          </Field.Label>
                        </fieldset>
                      </div>
                    </SettingRow>
                    <SettingRow
                      title="Maximum TTL"
                      description="In seconds."
                    >
                      <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                        <NumberInput
                          v-model="form.browserMaxTtl"
                          size="large"
                          class="w-full"
                          :min="0"
                          aria-label="Browser maximum TTL in seconds"
                        />
                      </div>
                    </SettingRow>
                    <SettingRow title="Cache Settings">
                      <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                        <fieldset class="flex w-full flex-col gap-(--spacing-sm)">
                          <legend class="sr-only">Cache Settings</legend>
                          <Field.Label
                            v-for="option in cacheOptions"
                            :key="option.value"
                          >
                            <Field orientation="horizontal">
                              <RadioButton
                                v-model="form.cache"
                                :value="option.value"
                                name="cache"
                                :input-id="`app-cache-${option.value}`"
                              />
                              <Field.Content>
                                <Field.Title>
                                  {{ option.label }}
                                </Field.Title>
                                <Field.Description v-if="option.description">
                                  {{ option.description }}
                                </Field.Description>
                              </Field.Content>
                            </Field>
                          </Field.Label>
                        </fieldset>
                      </div>
                    </SettingRow>
                    <SettingRow
                      title="Maximum TTL"
                      description="In seconds. Enable dynamic acceleration in the Main Settings tab to use values lower than 60 seconds. A secondary cache requires a cache TTL equal to or greater than 3 seconds."
                    >
                      <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                        <NumberInput
                          v-model="form.cacheMaxTtl"
                          size="large"
                          class="w-full"
                          :min="0"
                          aria-label="Cache maximum TTL in seconds"
                        />
                      </div>
                    </SettingRow>
                  </Item.List>
                </template>
              </Card>
            </section>

            <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
              <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">Debug rules</p>
              <Card :padded="false">
                <template #content>
                  <Item.List>
                    <SettingRow
                      title="Active"
                      description="Rules that were successfully executed will be listed in the request logs and in the trace of each event."
                      kind="compact"
                    >
                      <Switch
                        v-model="form.debugRules"
                        aria-label="Active"
                      />
                    </SettingRow>
                  </Item.List>
                </template>
              </Card>
            </section>
          </fieldset>
        </div>

        <SaveBar kind="centered">
          <template #actions>
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
          </template>
        </SaveBar>
      </form>
    </main>
  </div>
</template>
