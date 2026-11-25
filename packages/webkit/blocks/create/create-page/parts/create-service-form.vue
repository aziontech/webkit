<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import PageHeader from '@aziontech/webkit/page-header'
  import RadioGroup from '@aziontech/webkit/radio-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, onMounted, reactive, ref } from 'vue'

  import {
    httpPortOptions,
    httpsPortOptions,
    protocolPolicyOptions,
    protocolUsageOptions
  } from '../lib/service-options'
  import { useCreateForm } from '../use-create-form'
  import CreationHeader from './creation-header.vue'
  import DiscardDialog from './discard-dialog.vue'
  import ServiceCacheSection from './service-cache-section.vue'
  import ServiceSaveBar from './service-save-bar.vue'

  export interface CreateServiceProps {
    /** Starts as the form looks after Save was pressed: each empty required field is flagged. */
    validated?: boolean
  }

  interface PortOption {
    label: string
    value: string
  }

  const props = withDefaults(defineProps<CreateServiceProps>(), { validated: false })

  const breadcrumb = [{ label: 'Services', href: '/services' }, { label: 'Create Service' }]

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
  const nameEl = ref<InstanceType<typeof Input> | null>(null)

  const validate = () => {
    errors.name = form.name.trim() ? '' : 'This field is required.'
    errors.httpPorts = form.httpPorts.length ? '' : 'Select at least one HTTP port.'
    errors.address = form.address.trim() ? '' : 'This field is required.'
    errors.hostHeader = form.hostHeader.trim() ? '' : 'This field is required.'
    return !errors.name && !errors.httpPorts && !errors.address && !errors.hostHeader
  }

  if (props.validated) validate()

  const formEl = ref<HTMLFormElement | null>(null)

  const { guard, failure, submitting, submitButton, leave, submit } = useCreateForm({
    source: () => form,
    formEl,
    shortcutLabel: 'Create service',
    validate,
    onCreated: () => toast.success(`${form.name.trim()} created.`)
  })

  onMounted(() => nameEl.value?.focus())
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <CreationHeader
      back-label="Back to Services"
      :breadcrumb="breadcrumb"
      @back="leave"
    />
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

          <Alert
            v-if="failure"
            class="mt-(--layout-section-gap)"
            severity="danger"
            title="Could not create the service."
            :label="failure"
            action-label="Retry"
            @action="submit"
          />
          <fieldset
            class="mx-0 flex min-w-0 flex-col border-0 p-0"
            :disabled="submitting"
          >
            <legend class="sr-only">Create Service</legend>

            <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
              <h2 class="text-heading-2xs text-(--text-default)">General</h2>
              <Card :padded="false">
                <template #default>
                  <Item.List>
                    <SettingsRow
                      required
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
              <h2 class="text-heading-2xs text-(--text-default)">Delivery settings</h2>
              <Card :padded="false">
                <template #default>
                  <Item.List>
                    <SettingsRow
                      variant="stacked"
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
                      required
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
              <h2 class="text-heading-2xs text-(--text-default)">Origins</h2>
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
                      variant="stacked"
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
                      required
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
                      required
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

            <ServiceCacheSection
              v-model:browser-cache="form.browserCache"
              v-model:browser-max-ttl="form.browserMaxTtl"
              v-model:cache="form.cache"
              v-model:cache-max-ttl="form.cacheMaxTtl"
            />

            <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
              <h2 class="text-heading-2xs text-(--text-default)">Debug rules</h2>
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

        <ServiceSaveBar
          :submitting="submitting"
          :submit-button="submitButton"
          @leave="leave"
          @submit="submit"
        />
      </form>
    </main>
    <DiscardDialog :guard="guard" />
  </div>
</template>
