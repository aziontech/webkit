<script setup>
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import FieldRadioBlock from '@aziontech/webkit/field-radio-block'
  import HelperText from '@aziontech/webkit/helper-text'
  import InputNumber from '@aziontech/webkit/input-number'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import Switch from '@aziontech/webkit/switch'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, reactive, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import UnsavedChangesGuard from '../../components/form/UnsavedChangesGuard.vue'
  import CreationHeader from '../../components/page/CreationHeader.vue'
  import { useBaseline } from '../../lib/behavior/forms'

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

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
  const edgeCacheOptions = [
    { value: 'override', label: 'Override cache settings' },
    {
      value: 'honor',
      label: 'Honor cache policies',
      description:
        "Honor cache policies from the origin or define a new maximum cache TTL for the edge. If a TTL isn't received from the origin, cache will be maintained at a default TTL."
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
    edgeCache: 'override',
    edgeMaxTtl: 60,
    debugRules: false
  })

  const httpsEnabled = computed(() => form.protocolUsage !== 'http')

  const errors = reactive({
    name: '',
    httpPorts: '',
    address: '',
    hostHeader: ''
  })

  const submitting = ref(false)

  const { dirty, commit } = useBaseline(form)

  const validate = () => {
    errors.name = form.name.trim() ? '' : 'This field is required.'
    errors.httpPorts = form.httpPorts.length ? '' : 'Select at least one HTTP port.'
    errors.address = form.address.trim() ? '' : 'This field is required.'
    errors.hostHeader = form.hostHeader.trim() ? '' : 'This field is required.'
    return !errors.name && !errors.httpPorts && !errors.address && !errors.hostHeader
  }

  const cancel = () => router.push({ path: '/forms', query: { email: userEmail.value } })

  const submit = async () => {
    if (submitting.value) return

    if (!validate()) return

    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 900))
      toast.success(`Application "${form.name}" created.`)
      commit()
      router.push({ path: '/forms', query: { email: userEmail.value } })
    } catch (error) {
      toast.error('Could not create the application.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => submit() }
      })
    } finally {
      submitting.value = false
    }
  }
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <UnsavedChangesGuard :dirty="dirty" />

    <CreationHeader
      :breadcrumb="[{ label: 'Forms', href: '/forms' }, { label: 'In Page create' }]"
      back-label="Back to Forms"
      @back="cancel"
      @navigate="cancel"
    />
    <main class="animate-page-enter motion-reduce:animate-none min-h-0 flex-1 overflow-auto">
      <form
        class="flex min-h-full flex-col"
        aria-label="Create Application"
        novalidate
        @submit.prevent="submit"
      >
        <div class="layout-column-form layout-boundary flex flex-1 flex-col">
          <fieldset
            class="mx-0 flex min-w-0 flex-col border-0 p-0"
            :disabled="submitting"
          >
            <legend class="sr-only">Create application</legend>

            <section class="flex flex-col gap-(--layout-group-gap)">
              <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">General</p>
              <CardBox :padded="false">
                <template #content>
                  <Item.List>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Name</Item.Title>
                        <Item.Description>
                          Give a unique and descriptive name to identify the Application.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
                        <div class="flex w-full flex-col gap-(--spacing-xs)">
                          <InputText
                            v-model="form.name"
                            size="large"
                            class="w-full"
                            aria-label="Name"
                            placeholder="My Application"
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
                      </Item.Actions>
                    </Item>
                  </Item.List>
                </template>
              </CardBox>
            </section>

            <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
              <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">
                Delivery Settings
              </p>
              <CardBox :padded="false">
                <template #content>
                  <Item.List>
                    <Item
                      size="small"
                      class="items-start"
                    >
                      <Item.Content>
                        <Item.Title>Protocol Usage</Item.Title>
                      </Item.Content>
                      <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
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
                      </Item.Actions>
                    </Item>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>HTTP ports</Item.Title>
                      </Item.Content>
                      <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
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
                      </Item.Actions>
                    </Item>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>HTTPS ports</Item.Title>
                        <Item.Description>
                          Applies when the Application serves HTTPS traffic.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
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
                      </Item.Actions>
                    </Item>
                  </Item.List>
                </template>
              </CardBox>
            </section>

            <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
              <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">Origins</p>
              <CardBox :padded="false">
                <template #content>
                  <Item.List>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Origin Type</Item.Title>
                        <Item.Description>
                          The origin type is pre-defined and can't be customized.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
                        <InputText
                          model-value="Single Origin"
                          size="large"
                          class="w-full"
                          aria-label="Origin Type"
                          readonly
                        />
                      </Item.Actions>
                    </Item>
                    <Item
                      size="small"
                      class="items-start"
                    >
                      <Item.Content>
                        <Item.Title>Protocol Policy</Item.Title>
                        <Item.Description>
                          Select the protocol usage between the edge nodes and the origin.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
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
                      </Item.Actions>
                    </Item>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Address</Item.Title>
                        <Item.Description>
                          Define an origin for the content in FQDN format or an IPv4/IPv6 address.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
                        <div class="flex w-full flex-col gap-(--spacing-xs)">
                          <InputText
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
                      </Item.Actions>
                    </Item>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Host header</Item.Title>
                        <Item.Description>
                          Identify a virtualhost sent in the Host header to the origin.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
                        <div class="flex w-full flex-col gap-(--spacing-xs)">
                          <InputText
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
                      </Item.Actions>
                    </Item>
                  </Item.List>
                </template>
              </CardBox>
            </section>

            <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
              <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">
                Cache Expiration Policies
              </p>
              <CardBox :padded="false">
                <template #content>
                  <Item.List>
                    <Item
                      size="small"
                      class="items-start"
                    >
                      <Item.Content>
                        <Item.Title>Browser Cache Settings</Item.Title>
                      </Item.Content>
                      <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
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
                      </Item.Actions>
                    </Item>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Maximum TTL (seconds)</Item.Title>
                      </Item.Content>
                      <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
                        <InputNumber
                          v-model="form.browserMaxTtl"
                          size="large"
                          class="w-full"
                          :min="0"
                          aria-label="Browser maximum TTL in seconds"
                        />
                      </Item.Actions>
                    </Item>
                    <Item
                      size="small"
                      class="items-start"
                    >
                      <Item.Content>
                        <Item.Title>Cache Settings</Item.Title>
                      </Item.Content>
                      <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
                        <fieldset class="flex w-full flex-col gap-(--spacing-sm)">
                          <legend class="sr-only">Cache Settings</legend>
                          <FieldRadioBlock
                            v-for="option in edgeCacheOptions"
                            :key="option.value"
                            v-model="form.edgeCache"
                            :value="option.value"
                            name="edgeCache"
                            :input-id="`app-edgeCache-${option.value}`"
                            :label="option.label"
                            :description="option.description"
                          />
                        </fieldset>
                      </Item.Actions>
                    </Item>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Maximum TTL (seconds)</Item.Title>
                        <Item.Description>
                          Enable Application Accelerator in the Main Settings tab to use values
                          lower than 60 seconds. Tiered Cache requires cache TTL to be equal to or
                          greater than 3 seconds.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
                        <InputNumber
                          v-model="form.edgeMaxTtl"
                          size="large"
                          class="w-full"
                          :min="0"
                          aria-label="Edge maximum TTL in seconds"
                        />
                      </Item.Actions>
                    </Item>
                  </Item.List>
                </template>
              </CardBox>
            </section>

            <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
              <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">Debug Rules</p>
              <CardBox :padded="false">
                <template #content>
                  <Item.List>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Active</Item.Title>
                        <Item.Description>
                          Rules that were successfully executed will be shown under the $traceback
                          field in Data Streaming and Real-Time Events or the $stacktrace variable
                          in GraphQL.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="justify-end">
                        <Switch
                          v-model="form.debugRules"
                          aria-label="Active"
                        />
                      </Item.Actions>
                    </Item>
                  </Item.List>
                </template>
              </CardBox>
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
              @click="cancel"
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
