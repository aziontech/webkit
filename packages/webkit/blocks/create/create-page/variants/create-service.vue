<script setup lang="ts">
  import AppHeader from '@aziontech/webkit/app-header'
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import FieldError from '@aziontech/webkit/field-error'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Kbd from '@aziontech/webkit/kbd'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import NumberInput from '@aziontech/webkit/number-input'
  import PageHeader from '@aziontech/webkit/page-header'
  import RadioGroup from '@aziontech/webkit/radio-group'
  import SaveBar from '@aziontech/webkit/save-bar'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import { toast } from '@aziontech/webkit/toast'
  import { useEscapeToCancel } from '@aziontech/webkit/use-escape-to-cancel'
  import { toAriaKeyshortcuts, useShortcuts } from '@aziontech/webkit/use-shortcuts'
  import { useUnsavedChanges } from '@aziontech/webkit/use-unsaved-changes'
  import { computed, onMounted, reactive, ref } from 'vue'

  interface PortOption {
    label: string
    value: string
  }

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

  const portsLabel = (list: PortOption[]) => (values: unknown[]) =>
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

  const guard = useUnsavedChanges(() => form, {
    enabled: () => !submitting.value
  })
  const discardDialog = guard.dialogProps
  const discardLabels = guard.labels

  const onLeave = () => guard.confirmLeave()

  useEscapeToCancel(onLeave)

  const formEl = ref<HTMLFormElement | null>(null)
  const nameEl = ref<InstanceType<typeof Input> | null>(null)

  useShortcuts({
    keys: 'meta+enter',
    label: 'Create service',
    group: 'Page',
    element: formEl,
    when: () => !submitting.value,
    handler: () => formEl.value?.requestSubmit()
  })

  onMounted(() => nameEl.value?.focus())

  const validate = () => {
    errors.name = form.name.trim() ? '' : 'This field is required.'
    errors.httpPorts = form.httpPorts.length ? '' : 'Select at least one HTTP port.'
    errors.address = form.address.trim() ? '' : 'This field is required.'
    errors.hostHeader = form.hostHeader.trim() ? '' : 'This field is required.'
    return !errors.name && !errors.httpPorts && !errors.address && !errors.hostHeader
  }

  const SAVE_FAILURES = 0
  let failuresLeft = SAVE_FAILURES

  const sendRequest = () =>
    new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (failuresLeft > 0) {
          failuresLeft -= 1
          reject(new Error('The service did not answer. Check your connection and try again.'))
          return
        }
        resolve()
      }, 900)
    })

  const submit = async () => {
    if (submitting.value || !validate()) return
    submitting.value = true
    try {
      await sendRequest()
      toast.success(`${form.name.trim()} created.`)
    } catch (error) {
      toast.error('Could not create the service.', {
        description: error instanceof Error ? error.message : 'Try again.',
        action: { label: 'Retry', onClick: () => submit() }
      })
    } finally {
      submitting.value = false
    }
  }
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <AppHeader aria-label="Console">
      <AppHeader.Start>
        <IconButton
          icon="az az-chevron-left"
          aria-label="Back to Services"
          variant="outline"
          size="small"
          @click="onLeave"
        />
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
        <button
          type="button"
          aria-label="Account settings"
          class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Avatar
            label="name@example.com"
            size="medium"
            variant="square"
          />
        </button>
      </AppHeader.End>
    </AppHeader>
    <main class="animate-page-enter motion-reduce:animate-none min-h-0 flex-1 overflow-auto">
      <form
        ref="formEl"
        class="flex min-h-full flex-col"
        aria-label="Create Service"
        novalidate
        @submit.prevent="submit"
      >
        <div class="layout-column-form layout-boundary flex flex-1 flex-col">
          <PageHeader
            title="Create Service"
            size="small"
            description="A service answers requests on its domains and forwards them to its origins."
          />
          <fieldset
            class="mx-0 flex min-w-0 flex-col border-0 p-0"
            :disabled="submitting"
          >
            <legend class="sr-only">Create Service</legend>

            <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
              <h2 class="px-(--spacing-xs) text-heading-2xs text-(--text-default)">General</h2>
              <Card :padded="false">
                <template #default>
                  <Item.List>
                    <SettingsRow
                      stackable
                      title="Name"
                      description="Give a unique and descriptive name to identify the service."
                    >
                      <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                        <div class="flex w-full flex-col gap-(--spacing-xs)">
                          <Input
                            ref="nameEl"
                            v-model="form.name"
                            size="large"
                            class="w-full"
                            aria-label="Name"
                            placeholder="My Service"
                            required
                            :invalid="!!errors.name"
                            :aria-describedby="errors.name ? 'app-name-error' : undefined"
                            @update:model-value="errors.name = ''"
                          />
                          <FieldError
                            v-if="errors.name"
                            id="app-name-error"
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
              <h2 class="px-(--spacing-xs) text-heading-2xs text-(--text-default)">
                Delivery settings
              </h2>
              <Card :padded="false">
                <template #default>
                  <Item.List>
                    <SettingsRow
                      stackable
                      title="Protocol usage"
                    >
                      <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                        <RadioGroup
                          v-model="form.protocolUsage"
                          variant="card"
                          class="w-full"
                          name="protocolUsage"
                          aria-label="Protocol usage"
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
                      stackable
                      title="HTTP ports"
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
                            id="app-httpPorts-error"
                            >{{ errors.httpPorts }}</FieldError
                          >
                        </div>
                      </div>
                    </SettingsRow>
                    <SettingsRow
                      stackable
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
                            <MultiSelect.Item
                              v-for="option in httpsPortOptions"
                              :key="option.value"
                              :value="option.value"
                            >
                              {{ option.label }}
                            </MultiSelect.Item>
                          </MultiSelect.Content>
                        </MultiSelect>
                      </div>
                    </SettingsRow>
                  </Item.List>
                </template>
              </Card>
            </section>

            <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
              <h2 class="px-(--spacing-xs) text-heading-2xs text-(--text-default)">Origins</h2>
              <Card :padded="false">
                <template #default>
                  <Item.List>
                    <SettingsRow
                      stackable
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
                    </SettingsRow>
                    <SettingsRow
                      stackable
                      title="Protocol policy"
                      description="Select the protocol used between the cache servers and the origin."
                    >
                      <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                        <RadioGroup
                          v-model="form.protocolPolicy"
                          variant="card"
                          class="w-full"
                          name="protocolPolicy"
                          aria-label="Protocol policy"
                        >
                          <RadioGroup.Item
                            v-for="option in protocolPolicyOptions"
                            :key="option.value"
                            :value="option.value"
                            >{{ option.label }}</RadioGroup.Item
                          >
                        </RadioGroup>
                      </div>
                    </SettingsRow>
                    <SettingsRow
                      stackable
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
                            required
                            :invalid="!!errors.address"
                            :aria-describedby="errors.address ? 'app-address-error' : undefined"
                            @update:model-value="errors.address = ''"
                          />
                          <FieldError
                            v-if="errors.address"
                            id="app-address-error"
                            >{{ errors.address }}</FieldError
                          >
                        </div>
                      </div>
                    </SettingsRow>
                    <SettingsRow
                      stackable
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
                              errors.hostHeader ? 'app-hostHeader-error' : undefined
                            "
                            @update:model-value="errors.hostHeader = ''"
                          />
                          <FieldError
                            v-if="errors.hostHeader"
                            id="app-hostHeader-error"
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
              <h2 class="px-(--spacing-xs) text-heading-2xs text-(--text-default)">
                Cache expiration policies
              </h2>
              <Card :padded="false">
                <template #default>
                  <Item.List>
                    <SettingsRow
                      stackable
                      title="Browser cache settings"
                    >
                      <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                        <RadioGroup
                          v-model="form.browserCache"
                          variant="card"
                          class="w-full"
                          name="browserCache"
                          aria-label="Browser cache settings"
                        >
                          <RadioGroup.Item
                            v-for="option in browserCacheOptions"
                            :key="option.value"
                            :value="option.value"
                            :description="option.description"
                            >{{ option.label }}</RadioGroup.Item
                          >
                        </RadioGroup>
                      </div>
                    </SettingsRow>
                    <SettingsRow
                      stackable
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
                    </SettingsRow>
                    <SettingsRow
                      stackable
                      title="Cache Settings"
                    >
                      <div class="flex w-full items-center justify-end gap-(--spacing-xs)">
                        <RadioGroup
                          v-model="form.cache"
                          variant="card"
                          class="w-full"
                          name="cache"
                          aria-label="Cache Settings"
                        >
                          <RadioGroup.Item
                            v-for="option in cacheOptions"
                            :key="option.value"
                            :value="option.value"
                            :description="option.description"
                            >{{ option.label }}</RadioGroup.Item
                          >
                        </RadioGroup>
                      </div>
                    </SettingsRow>
                    <SettingsRow
                      stackable
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
                    </SettingsRow>
                  </Item.List>
                </template>
              </Card>
            </section>

            <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
              <h2 class="px-(--spacing-xs) text-heading-2xs text-(--text-default)">Debug rules</h2>
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
                      />
                    </SettingsRow>
                  </Item.List>
                </template>
              </Card>
            </section>
          </fieldset>
        </div>

        <SaveBar variant="centered">
          <template #actions>
            <Button
              type="button"
              label="Cancel"
              variant="outline"
              size="medium"
              :disabled="submitting"
              @click="onLeave"
            />
            <Button
              variant="primary"
              size="medium"
              :loading="submitting"
              @click="submit"
              :aria-keyshortcuts="toAriaKeyshortcuts('meta+enter')"
            >
              Save
              <Kbd
                meta
                key-name="enter"
                size="small"
                aria-hidden="true"
              />
            </Button>
          </template>
        </SaveBar>
      </form>
    </main>
    <ConfirmDialog
      v-bind="discardDialog"
      data-testid="unsaved-changes-dialog"
    >
      <template #actions>
        <Button
          :label="discardLabels.keepEditing"
          variant="ghost"
          size="medium"
          data-autofocus
          @click="guard.keepEditing"
        />
        <Button
          :label="discardLabels.discard"
          variant="danger"
          size="medium"
          @click="guard.discardAndLeave"
        />
      </template>
    </ConfirmDialog>
  </div>
</template>
