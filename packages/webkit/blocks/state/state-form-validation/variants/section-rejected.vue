<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import AppHeader from '@aziontech/webkit/app-header'
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import FieldError from '@aziontech/webkit/field-error'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import NumberInput from '@aziontech/webkit/number-input'
  import RadioGroup from '@aziontech/webkit/radio-group'
  import SaveBar from '@aziontech/webkit/save-bar'
  import SectionHeader from '@aziontech/webkit/section-header'
  import Select from '@aziontech/webkit/select'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Switch from '@aziontech/webkit/switch'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'

  import { sampleOriginError, sampleOrigins } from '../sample'

  /** One origin the Origin select offers. */
  export interface FormValidationOrigin {
    /** Option value, the origin id. */
    value: string
    /** Display name. */
    label: string
    /** Origin type, such as HTTP or Storage. */
    kind: string
  }

  /** The entries of the Create Service form, and the values a save sends. */
  export interface FormValidationService {
    /** Service name. */
    name: string
    /** Protocol usage option value. */
    protocolUsage: string
    /** HTTP port option values. */
    httpPorts: string[]
    /** Compress responses. */
    compression: boolean
    /** Limit requests per client. */
    rateLimiting: boolean
    /** Optimize images on the fly. */
    imageOptimization: boolean
    /** Add a second caching layer. */
    secondaryCache: boolean
    /** The linked origin id. */
    originId: string
    /** Host header sent to the origin. */
    hostHeader: string
    /** Browser maximum TTL, in seconds. */
    browserMaxTtl: number
    /** Cache maximum TTL, in seconds. */
    cacheMaxTtl: number
    /** List executed rules in the logs. */
    debugRules: boolean
  }

  export interface FormValidationSectionProps {
    /** The origins the select offers; a chosen origin missing from the list is cleared and the select turns invalid. Left out, the sample renders. */
    origins?: FormValidationOrigin[]
    /** Why the server refused the save; the danger Alert under the Origin heading says it and the select turns invalid. Left out, the sample message renders; pass an empty string for none. */
    originError?: string
    /** Reload origins is in flight: its button spins, a Skeleton replaces the select and Save is disabled. */
    reloading?: boolean
    /** The save request is in flight: Save spins and the fields are disabled. */
    submitting?: boolean
  }

  const props = withDefaults(defineProps<FormValidationSectionProps>(), {
    origins: undefined,
    originError: undefined,
    reloading: false,
    submitting: false
  })

  const emit = defineEmits<{
    submit: [event: Event, values: FormValidationService]
    cancel: [event: MouseEvent]
    'reload-origins': [event: MouseEvent]
  }>()

  const breadcrumb = [{ label: 'Services', href: '/services' }, { label: 'Create Service' }]

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

  const origins = computed<FormValidationOrigin[]>(() => props.origins ?? sampleOrigins)
  const rejection = computed(() => props.originError ?? sampleOriginError)
  const form = reactive<FormValidationService>({
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
    originId: '',
    hostHeader: ''
  })
  const alertMessage = ref('')

  const originLabel = (value: string) =>
    origins.value.find((origin) => origin.value === value)?.label ?? ''

  const portsLabel = (values: unknown[]) =>
    (values ?? [])
      .map((value) => httpPortOptions.find((option) => option.value === value)?.label ?? value)
      .join(', ')

  const focusOrigin = async () => {
    await nextTick()
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document
      .getElementById('ev-origin-heading')
      ?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    document.getElementById('ev-origin')?.focus({ preventScroll: true })
  }

  watch(
    rejection,
    (next) => {
      alertMessage.value = next
      if (next) errors.originId = 'This origin no longer exists.'
    },
    { immediate: true }
  )

  watch(
    origins,
    (next) => {
      if (form.originId && !next.some((origin) => origin.value === form.originId)) {
        form.originId = ''
        errors.originId = 'Select an origin to continue.'
      }
    },
    { immediate: true }
  )

  watch(rejection, (next) => {
    if (next && !props.reloading) focusOrigin()
  })

  onMounted(() => {
    if (alertMessage.value && !props.reloading) focusOrigin()
  })

  const reloadOrigins = (event: MouseEvent) => {
    if (props.reloading) return
    emit('reload-origins', event)
  }

  const onOriginChange = () => {
    errors.originId = ''
    alertMessage.value = ''
  }

  const validate = () => {
    errors.name = form.name.trim() ? '' : 'Name is required.'
    errors.httpPorts = form.httpPorts.length ? '' : 'Select at least one HTTP port.'
    errors.originId = form.originId ? '' : 'Select an origin.'
    errors.hostHeader = form.hostHeader.trim() ? '' : 'Host header is required.'
    return !errors.name && !errors.httpPorts && !errors.originId && !errors.hostHeader
  }

  const submit = (event: Event) => {
    if (props.submitting || props.reloading) return
    alertMessage.value = ''
    if (!validate()) return
    emit('submit', event, { ...form, httpPorts: [...form.httpPorts] })
  }

  const account = { name: 'Amy Chen', email: 'amy.chen@example.com' }
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <AppHeader aria-label="Console">
      <AppHeader.Start>
        <Tooltip
          content="Back to Services"
          side="bottom"
        >
          <IconButton
            icon="az az-chevron-left"
            aria-label="Back to Services"
            variant="outline"
            size="small"
            href="/services"
          />
        </Tooltip>
        <AppHeader.Brand
          href="/home"
          aria-label="Azion home"
        >
          <Brand
            variant="default"
            size="small"
          />
        </AppHeader.Brand>
        <Breadcrumb :items="breadcrumb" />
      </AppHeader.Start>
      <AppHeader.Center />
      <AppHeader.End>
        <DropdownMenu
          side="bottom"
          align="end"
        >
          <DropdownMenu.Trigger>
            <button
              type="button"
              aria-label="Account menu"
              class="rounded-(--shape-button) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
            >
              <Avatar
                :label="account.name"
                size="medium"
                variant="square"
              />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Group>
            <template #header>
              <div class="flex min-w-0 flex-col">
                <span class="truncate text-label-md text-(--text-default)">{{ account.name }}</span>
                <span class="truncate text-body-xs text-(--text-muted)">{{ account.email }}</span>
              </div>
            </template>
            <DropdownMenu.Item
              value="settings"
              label="Account settings"
            >
              <template #trailing>
                <i
                  class="az az-settings"
                  aria-hidden="true"
                />
              </template>
            </DropdownMenu.Item>
          </DropdownMenu.Group>
          <DropdownMenu.Group>
            <DropdownMenu.Item
              value="docs"
              label="Docs"
            >
              <template #trailing>
                <i
                  class="az az-book"
                  aria-hidden="true"
                />
              </template>
            </DropdownMenu.Item>
            <DropdownMenu.Item
              value="logout"
              label="Log out"
            >
              <template #trailing>
                <i
                  class="az az-log-out"
                  aria-hidden="true"
                />
              </template>
            </DropdownMenu.Item>
          </DropdownMenu.Group>
        </DropdownMenu>
      </AppHeader.End>
    </AppHeader>
    <main class="animate-page-enter motion-reduce:animate-none min-h-0 flex-1 overflow-auto">
      <form
        class="flex min-h-full flex-col"
        aria-label="Create Service"
        novalidate
        @submit.prevent="submit"
      >
        <div class="layout-column-form layout-boundary flex flex-1 flex-col">
          <fieldset
            class="layout-section-start mx-0 flex min-w-0 flex-col border-0 p-0"
            :disabled="submitting"
          >
            <legend class="sr-only">Create service</legend>

            <section class="flex flex-col gap-(--layout-group-gap)">
              <SectionHeader title="General" />
              <Card :padded="false">
                <template #default>
                  <Item.List>
                    <SettingsRow
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
                            required
                            :invalid="!!errors.name"
                            :aria-describedby="errors.name ? 'ev-name-error' : undefined"
                            :disabled="submitting"
                            @update:model-value="errors.name = ''"
                          />
                          <FieldError
                            v-if="errors.name"
                            id="ev-name-error"
                            >{{ errors.name }}</FieldError
                          >
                        </div>
                      </div>
                    </SettingsRow>
                  </Item.List>
                </template>
              </Card>
            </section>

            <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
              <SectionHeader title="Delivery settings" />
              <Card :padded="false">
                <template #default>
                  <Item.List>
                    <SettingsRow title="Protocol usage">
                      <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                        <RadioGroup
                          v-model="form.protocolUsage"
                          variant="card"
                          name="protocolUsage"
                          aria-label="Protocol Usage"
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
                              :aria-describedby="
                                errors.httpPorts ? 'ev-httpPorts-error' : undefined
                              "
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

            <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
              <SectionHeader title="Features" />
              <Card :padded="false">
                <template #default>
                  <Item.List>
                    <SettingsRow
                      title="Compression"
                      description="Compress responses with gzip or Brotli before they are sent."
                      variant="compact"
                    >
                      <Switch
                        v-model="form.compression"
                        aria-label="Compression"
                        :disabled="submitting"
                      />
                    </SettingsRow>
                    <SettingsRow
                      title="Rate limiting"
                      description="Limit how many requests a single client can send per minute."
                      variant="compact"
                    >
                      <Switch
                        v-model="form.rateLimiting"
                        aria-label="Rate limiting"
                        :disabled="submitting"
                      />
                    </SettingsRow>
                    <SettingsRow
                      title="Image optimization"
                      description="Resize, crop, and convert images on the fly through URL parameters."
                      variant="compact"
                    >
                      <Switch
                        v-model="form.imageOptimization"
                        aria-label="Image optimization"
                        :disabled="submitting"
                      />
                    </SettingsRow>
                    <SettingsRow
                      title="Secondary cache"
                      description="Add a second caching layer to reduce requests to the origin."
                      variant="compact"
                    >
                      <Switch
                        v-model="form.secondaryCache"
                        aria-label="Secondary cache"
                        :disabled="submitting"
                      />
                    </SettingsRow>
                  </Item.List>
                </template>
              </Card>
            </section>

            <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
              <header class="group/heading flex flex-col">
                <div
                  class="flex flex-wrap items-start justify-between gap-(--spacing-md) px-(--spacing-xs)"
                >
                  <div class="flex min-w-0 grow flex-col gap-(--spacing-2xs)">
                    <div class="flex min-w-0 items-center gap-(--spacing-2xs)">
                      <h2
                        id="ev-origin-heading"
                        class="scroll-mt-(--spacing-xl) text-balance text-heading-xs text-(--text-default)"
                      >
                        Origin
                      </h2>
                    </div>
                  </div>
                </div>
                <div
                  class="grid grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-01 ease-productive-entrance has-[>div>div>*]:grid-rows-[1fr] motion-reduce:transition-none"
                >
                  <div class="min-w-0 overflow-hidden">
                    <div class="pt-(--spacing-sm)">
                      <Transition
                        enter-active-class="transition duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
                        enter-from-class="translate-y-2 opacity-0"
                        enter-to-class="translate-y-0 opacity-100"
                        leave-active-class="transition duration-fast-02 ease-productive-exit motion-reduce:transition-none"
                        leave-from-class="translate-y-0 opacity-100"
                        leave-to-class="-translate-y-2 opacity-0"
                      >
                        <div v-if="alertMessage">
                          <Alert
                            severity="danger"
                            :label="alertMessage"
                          >
                            <template #actions>
                              <Button
                                label="Reload origins"
                                variant="secondary"
                                size="medium"
                                :loading="reloading"
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
                <template #default>
                  <Item.List>
                    <SettingsRow
                      title="Origin"
                      description="The origin that serves this service’s content. Origins are shared across the account, so anyone on it can change one."
                    >
                      <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                        <div class="flex w-full flex-col gap-(--spacing-xs)">
                          <Skeleton
                            v-if="reloading"
                            variant="rectangle"
                            width="100%"
                            height="var(--size-10)"
                            aria-label="Loading origins"
                          />
                          <template v-else>
                            <Select
                              v-model="form.originId"
                              size="large"
                              class="w-full"
                              placeholder="Select an origin"
                              :display-value="originLabel"
                              required
                              :invalid="!!errors.originId"
                              :disabled="submitting"
                              @update:model-value="onOriginChange"
                            >
                              <Select.Trigger
                                id="ev-origin"
                                aria-label="Origin"
                                :aria-describedby="errors.originId ? 'ev-origin-error' : undefined"
                              />
                              <Select.Content>
                                <Select.Item
                                  v-for="origin in origins"
                                  :key="origin.value"
                                  :value="origin.value"
                                >
                                  {{ origin.label }}
                                </Select.Item>
                              </Select.Content>
                            </Select>
                            <FieldError
                              v-if="errors.originId"
                              id="ev-origin-error"
                              >{{ errors.originId }}</FieldError
                            >
                          </template>
                        </div>
                      </div>
                    </SettingsRow>
                    <SettingsRow
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
                            required
                            :invalid="!!errors.hostHeader"
                            :aria-describedby="
                              errors.hostHeader ? 'ev-hostHeader-error' : undefined
                            "
                            :disabled="submitting"
                            @update:model-value="errors.hostHeader = ''"
                          />
                          <FieldError
                            v-if="errors.hostHeader"
                            id="ev-hostHeader-error"
                            >{{ errors.hostHeader }}</FieldError
                          >
                        </div>
                      </div>
                    </SettingsRow>
                  </Item.List>
                </template>
              </Card>
            </section>

            <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
              <SectionHeader title="Cache expiration policies" />
              <Card :padded="false">
                <template #default>
                  <Item.List>
                    <SettingsRow
                      title="Browser maximum TTL"
                      description="How long browsers may keep a cached response, in seconds."
                    >
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
                    </SettingsRow>
                    <SettingsRow
                      title="Cache maximum TTL"
                      description="How long the cache may keep a response, in seconds. A secondary cache requires a TTL of at least 3 seconds."
                    >
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
                    </SettingsRow>
                  </Item.List>
                </template>
              </Card>
            </section>

            <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
              <SectionHeader title="Debug rules" />
              <Card :padded="false">
                <template #default>
                  <Item.List>
                    <SettingsRow
                      title="Active"
                      description="Rules that were successfully executed will be listed in the request logs and in the trace of each event."
                      variant="compact"
                    >
                      <Switch
                        v-model="form.debugRules"
                        aria-label="Active"
                        :disabled="submitting"
                      />
                    </SettingsRow>
                  </Item.List>
                </template>
              </Card>
            </section>
          </fieldset>
        </div>

        <SaveBar variant="plain">
          <template #actions>
            <Button
              type="button"
              label="Cancel"
              variant="outline"
              size="medium"
              :disabled="submitting"
              @click="emit('cancel', $event)"
            />
            <Button
              label="Save"
              variant="primary"
              size="medium"
              :loading="submitting"
              :disabled="reloading"
              type="submit"
            />
          </template>
        </SaveBar>
      </form>
    </main>
  </div>
</template>
