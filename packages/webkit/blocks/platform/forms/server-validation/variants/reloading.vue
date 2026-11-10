<script setup>
  import Alert from '@aziontech/webkit/alert'
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
  import Select from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Switch from '@aziontech/webkit/switch'
  import Tag from '@aziontech/webkit/tag'
  import { reactive, ref } from 'vue'

  const breadcrumb = [{ label: 'Forms', href: '/forms' }, { label: 'Error validation' }]

  const catalog = [
    { value: 'origin-web-prod', label: 'web-origin-prod', kind: 'HTTP' },
    { value: 'origin-api-prod', label: 'api-origin-prod', kind: 'HTTP' },
    { value: 'origin-assets', label: 'assets-storage', kind: 'Storage' }
  ]
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

  const serverOrigins = ref(['origin-api-prod', 'origin-assets'])
  const origins = ref([
    { value: 'origin-web-prod', label: 'web-origin-prod', kind: 'HTTP' },
    { value: 'origin-api-prod', label: 'api-origin-prod', kind: 'HTTP' },
    { value: 'origin-assets', label: 'assets-storage', kind: 'Storage' }
  ])
  const form = reactive({
    name: 'checkout-web',
    protocolUsage: 'https',
    httpPorts: ['80'],
    compression: true,
    rateLimiting: false,
    imageOptimization: false,
    secondaryCache: false,
    originId: 'origin-web-prod',
    hostHeader: '${host}',
    browserMaxTtl: 0,
    cacheMaxTtl: 60,
    debugRules: false
  })
  const errors = reactive({
    name: '',
    httpPorts: '',
    originId: 'This origin no longer exists.',
    hostHeader: ''
  })
  const originError = ref(
    'Origin "web-origin-prod" no longer exists — another user deleted it while you were filling in this form, so the service wasn\'t created. Nothing else was lost: reload the origin list and select another one.'
  )
  const submitting = ref(false)
  const reloadingOrigins = ref(true)
  const deletedByOtherUser = ref('web-origin-prod')

  const originLabel = (value) => origins.value.find((origin) => origin.value === value)?.label ?? ''

  const portsLabel = (values) =>
    (values ?? [])
      .map((value) => httpPortOptions.find((option) => option.value === value)?.label ?? value)
      .join(', ')

  const simulateDelete = () => {
    const target =
      origins.value.find((origin) => origin.value === form.originId) ?? origins.value[0]
    if (!target) return
    serverOrigins.value = serverOrigins.value.filter((value) => value !== target.value)
    deletedByOtherUser.value = target.label
  }

  const resetScenario = () => {
    serverOrigins.value = catalog.map((origin) => origin.value)
    origins.value = [...catalog]
    deletedByOtherUser.value = ''
    form.name = 'checkout-web'
    form.originId = 'origin-web-prod'
    form.hostHeader = '${host}'
    originError.value = ''
    errors.name = ''
    errors.httpPorts = ''
    errors.originId = ''
    errors.hostHeader = ''
  }

  const reloadOrigins = () => {
    if (reloadingOrigins.value) return
    reloadingOrigins.value = true
    setTimeout(() => {
      origins.value = catalog.filter((origin) => serverOrigins.value.includes(origin.value))
      if (!serverOrigins.value.includes(form.originId)) {
        form.originId = ''
        errors.originId = 'Select an origin to continue.'
      }
      originError.value = ''
      reloadingOrigins.value = false
    }, 800)
  }

  const onOriginChange = () => {
    errors.originId = ''
    originError.value = ''
  }

  const validate = () => {
    errors.name = form.name.trim() ? '' : 'This field is required.'
    errors.httpPorts = form.httpPorts.length ? '' : 'Select at least one HTTP port.'
    errors.originId = form.originId ? '' : 'This field is required.'
    errors.hostHeader = form.hostHeader.trim() ? '' : 'This field is required.'
    return !errors.name && !errors.httpPorts && !errors.originId && !errors.hostHeader
  }

  const submit = () => {
    if (submitting.value || reloadingOrigins.value) return
    originError.value = ''
    if (!validate()) return
    if (!serverOrigins.value.includes(form.originId)) {
      originError.value = `Origin "${originLabel(form.originId)}" no longer exists — another user deleted it while you were filling in this form, so the service wasn't created. Nothing else was lost: reload the origin list and select another one.`
      errors.originId = 'This origin no longer exists.'
    }
  }
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
          <aside
            aria-label="Scenario simulation"
            class="flex flex-col gap-(--spacing-md) rounded-(--shape-card) border border-dashed border-(--border-default) bg-(--bg-surface-raised) p-(--spacing-lg)"
          >
            <div class="flex flex-wrap items-center justify-between gap-(--spacing-sm)">
              <p class="m-0 text-overline-sm text-(--text-muted)">Simulation — the other user</p>
              <Tag
                :label="
                  deletedByOtherUser
                    ? `Deleted server-side: ${deletedByOtherUser}`
                    : 'Server in sync'
                "
                :severity="deletedByOtherUser ? 'danger' : 'success'"
                size="medium"
              />
            </div>
            <p class="m-0 text-body-sm text-(--text-muted)">
              You are User 1: the service below is filled in and already linked to an origin, four
              sections down. Have User 2 delete that origin through the API — nothing will tell you,
              your copy of the list just goes stale. Then press Save, and watch the form take you to
              the one section that needs you.
            </p>
            <div class="flex flex-wrap items-center gap-(--spacing-sm)">
              <Button
                label="User 2 deletes the linked origin"
                kind="outlined"
                size="medium"
                icon="pi pi-trash"
                :disabled="!!deletedByOtherUser || submitting"
                @click="simulateDelete"
              />
              <Button
                label="Reset scenario"
                kind="transparent"
                size="medium"
                :disabled="submitting"
                @click="resetScenario"
              />
            </div>
          </aside>

          <fieldset
            class="layout-section-start mx-0 flex min-w-0 flex-col border-0 p-0"
            :disabled="submitting"
          >
            <legend class="sr-only">Create service</legend>

            <section class="flex flex-col gap-(--layout-group-gap)">
              <header class="group/heading flex flex-col">
                <div
                  class="flex flex-wrap items-start justify-between gap-(--spacing-md) px-(--spacing-xs)"
                >
                  <div class="flex min-w-0 grow flex-col gap-(--spacing-xxs)">
                    <div class="flex min-w-0 items-center gap-(--spacing-xxs)">
                      <h2
                        class="scroll-mt-(--spacing-xl) text-balance text-heading-xs text-(--text-default)"
                      >
                        General
                      </h2>
                    </div>
                  </div>
                </div>
              </header>
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
                                :aria-describedby="errors.name ? 'ev-name-error' : undefined"
                                :disabled="submitting"
                                @update:model-value="errors.name = ''"
                              />
                              <HelperText
                                v-if="errors.name"
                                id="ev-name-error"
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
              <header class="group/heading flex flex-col">
                <div
                  class="flex flex-wrap items-start justify-between gap-(--spacing-md) px-(--spacing-xs)"
                >
                  <div class="flex min-w-0 grow flex-col gap-(--spacing-xxs)">
                    <div class="flex min-w-0 items-center gap-(--spacing-xxs)">
                      <h2
                        class="scroll-mt-(--spacing-xl) text-balance text-heading-xs text-(--text-default)"
                      >
                        Delivery Settings
                      </h2>
                    </div>
                  </div>
                </div>
              </header>
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
                              <Field.Label
                                v-for="option in protocolUsageOptions"
                                :key="option.value"
                              >
                                <Field
                                  orientation="horizontal"
                                  :disabled="submitting"
                                >
                                  <RadioButton
                                    v-model="form.protocolUsage"
                                    :value="option.value"
                                    name="protocolUsage"
                                    :input-id="`ev-protocolUsage-${option.value}`"
                                  />
                                  <Field.Content>
                                    <Field.Title>{{ option.label }}</Field.Title>
                                    <Field.Description>{{ option.description }}</Field.Description>
                                  </Field.Content>
                                </Field>
                              </Field.Label>
                            </fieldset>
                          </div>
                        </Item.Actions>
                      </div>
                    </Item>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>HTTP ports</Item.Title>
                        <Item.Description
                          >The ports the service listens on for HTTP traffic.</Item.Description
                        >
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
                                :display-value="portsLabel"
                                :disabled="submitting"
                                @update:model-value="errors.httpPorts = ''"
                              >
                                <MultiSelect.Trigger
                                  id="ev-httpPorts"
                                  aria-label="HTTP ports"
                                  :aria-describedby="
                                    errors.httpPorts ? 'ev-httpPorts-error' : undefined
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
                                id="ev-httpPorts-error"
                                kind="required"
                                :label="errors.httpPorts"
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
              <header class="group/heading flex flex-col">
                <div
                  class="flex flex-wrap items-start justify-between gap-(--spacing-md) px-(--spacing-xs)"
                >
                  <div class="flex min-w-0 grow flex-col gap-(--spacing-xxs)">
                    <div class="flex min-w-0 items-center gap-(--spacing-xxs)">
                      <h2
                        class="scroll-mt-(--spacing-xl) text-balance text-heading-xs text-(--text-default)"
                      >
                        Features
                      </h2>
                    </div>
                  </div>
                </div>
              </header>
              <Card :padded="false">
                <template #content>
                  <Item.List>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Compression</Item.Title>
                        <Item.Description
                          >Compress responses with gzip or Brotli before they are
                          sent.</Item.Description
                        >
                      </Item.Content>
                      <Item.Actions>
                        <Switch
                          v-model="form.compression"
                          aria-label="Compression"
                          :disabled="submitting"
                        />
                      </Item.Actions>
                    </Item>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Rate limiting</Item.Title>
                        <Item.Description
                          >Limit how many requests a single client can send per
                          minute.</Item.Description
                        >
                      </Item.Content>
                      <Item.Actions>
                        <Switch
                          v-model="form.rateLimiting"
                          aria-label="Rate limiting"
                          :disabled="submitting"
                        />
                      </Item.Actions>
                    </Item>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Image optimization</Item.Title>
                        <Item.Description
                          >Resize, crop, and convert images on the fly through URL
                          parameters.</Item.Description
                        >
                      </Item.Content>
                      <Item.Actions>
                        <Switch
                          v-model="form.imageOptimization"
                          aria-label="Image optimization"
                          :disabled="submitting"
                        />
                      </Item.Actions>
                    </Item>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Secondary cache</Item.Title>
                        <Item.Description
                          >Add a second caching layer to reduce requests to the
                          origin.</Item.Description
                        >
                      </Item.Content>
                      <Item.Actions>
                        <Switch
                          v-model="form.secondaryCache"
                          aria-label="Secondary cache"
                          :disabled="submitting"
                        />
                      </Item.Actions>
                    </Item>
                  </Item.List>
                </template>
              </Card>
            </section>

            <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
              <header class="group/heading flex flex-col">
                <div
                  class="flex flex-wrap items-start justify-between gap-(--spacing-md) px-(--spacing-xs)"
                >
                  <div class="flex min-w-0 grow flex-col gap-(--spacing-xxs)">
                    <div class="flex min-w-0 items-center gap-(--spacing-xxs)">
                      <h2
                        class="scroll-mt-(--spacing-xl) text-balance text-heading-xs text-(--text-default)"
                      >
                        Origin
                      </h2>
                    </div>
                  </div>
                </div>
                <div
                  class="grid grid-rows-[0fr] transition-[grid-template-rows] duration-150 ease-out has-[>div>div>*]:grid-rows-[1fr] motion-reduce:transition-none"
                >
                  <div class="min-w-0 overflow-hidden">
                    <div class="pt-(--spacing-sm)">
                      <Transition
                        enter-active-class="transition duration-150 ease-out motion-reduce:transition-none"
                        enter-from-class="translate-y-2 opacity-0"
                        enter-to-class="translate-y-0 opacity-100"
                        leave-active-class="transition duration-100 ease-in motion-reduce:transition-none"
                        leave-from-class="translate-y-0 opacity-100"
                        leave-to-class="-translate-y-2 opacity-0"
                      >
                        <div v-if="originError">
                          <Alert
                            severity="danger"
                            :label="originError"
                          >
                            <template #action>
                              <Button
                                label="Reload origins"
                                kind="secondary"
                                size="medium"
                                :loading="reloadingOrigins"
                                @click="reloadOrigins"
                              />
                            </template>
                          </Alert>
                        </div>
                      </Transition>
                    </div>
                  </div>
                </div>
              </header>
              <Card :padded="false">
                <template #content>
                  <Item.List>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Origin</Item.Title>
                        <Item.Description
                          >The origin that serves this service’s content. Origins are shared across
                          the account, so anyone on it can change one.</Item.Description
                        >
                      </Item.Content>
                      <div class="flex max-w-(--container-3xs) flex-1 justify-end">
                        <Item.Actions class="w-full">
                          <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                            <div class="flex w-full flex-col gap-(--spacing-xs)">
                              <Skeleton
                                v-if="reloadingOrigins"
                                kind="shape"
                                width="100%"
                                height="40px"
                                aria-label="Loading origins"
                              />
                              <template v-else>
                                <Select
                                  v-model="form.originId"
                                  size="large"
                                  class="w-full"
                                  placeholder="Select an origin"
                                  :display-value="originLabel"
                                  :required="!!errors.originId && !form.originId"
                                  :invalid="!!errors.originId && !!form.originId"
                                  :disabled="submitting"
                                  @update:model-value="onOriginChange"
                                >
                                  <Select.Trigger
                                    id="ev-origin"
                                    aria-label="Origin"
                                    :aria-describedby="
                                      errors.originId ? 'ev-origin-error' : undefined
                                    "
                                  />
                                  <Select.Content>
                                    <Select.Option
                                      v-for="origin in origins"
                                      :key="origin.value"
                                      :value="origin.value"
                                    >
                                      {{ origin.label }}
                                    </Select.Option>
                                  </Select.Content>
                                </Select>
                                <HelperText
                                  v-if="errors.originId"
                                  id="ev-origin-error"
                                  :kind="form.originId ? 'invalid' : 'required'"
                                  :label="errors.originId"
                                />
                              </template>
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
                                  errors.hostHeader ? 'ev-hostHeader-error' : undefined
                                "
                                :disabled="submitting"
                                @update:model-value="errors.hostHeader = ''"
                              />
                              <HelperText
                                v-if="errors.hostHeader"
                                id="ev-hostHeader-error"
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
              <header class="group/heading flex flex-col">
                <div
                  class="flex flex-wrap items-start justify-between gap-(--spacing-md) px-(--spacing-xs)"
                >
                  <div class="flex min-w-0 grow flex-col gap-(--spacing-xxs)">
                    <div class="flex min-w-0 items-center gap-(--spacing-xxs)">
                      <h2
                        class="scroll-mt-(--spacing-xl) text-balance text-heading-xs text-(--text-default)"
                      >
                        Cache expiration policies
                      </h2>
                    </div>
                  </div>
                </div>
              </header>
              <Card :padded="false">
                <template #content>
                  <Item.List>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Browser Maximum TTL (seconds)</Item.Title>
                        <Item.Description
                          >How long browsers may keep a cached response.</Item.Description
                        >
                      </Item.Content>
                      <div class="flex max-w-(--container-3xs) flex-1 justify-end">
                        <Item.Actions class="w-full">
                          <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                            <NumberInput
                              v-model="form.browserMaxTtl"
                              size="large"
                              class="w-full"
                              :min="0"
                              :disabled="submitting"
                              aria-label="Browser maximum TTL in seconds"
                            />
                          </div>
                        </Item.Actions>
                      </div>
                    </Item>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Cache Maximum TTL (seconds)</Item.Title>
                        <Item.Description
                          >How long the cache may keep a response. A secondary cache requires a TTL
                          of at least 3 seconds.</Item.Description
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
                              :disabled="submitting"
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
              <header class="group/heading flex flex-col">
                <div
                  class="flex flex-wrap items-start justify-between gap-(--spacing-md) px-(--spacing-xs)"
                >
                  <div class="flex min-w-0 grow flex-col gap-(--spacing-xxs)">
                    <div class="flex min-w-0 items-center gap-(--spacing-xxs)">
                      <h2
                        class="scroll-mt-(--spacing-xl) text-balance text-heading-xs text-(--text-default)"
                      >
                        Debug Rules
                      </h2>
                    </div>
                  </div>
                </div>
              </header>
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
                          :disabled="submitting"
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
          class="sticky bottom-0 z-10 border-t-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface)"
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
              :disabled="reloadingOrigins"
              type="submit"
            />
          </div>
        </footer>
      </form>
    </main>
  </div>
</template>
