<script setup>
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import FieldRadioBlock from '@aziontech/webkit/field-radio-block'
  import HelperText from '@aziontech/webkit/helper-text'
  import InputNumber from '@aziontech/webkit/input-number'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Message from '@aziontech/webkit/message'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import Select from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Switch from '@aziontech/webkit/switch'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, nextTick, reactive, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import UnsavedChangesGuard from '../../components/form/UnsavedChangesGuard.vue'
  import CreationHeader from '../../components/page/CreationHeader.vue'
  import SectionHeading from '../../components/page/SectionHeading.vue'
  import { useBaseline } from '../../lib/behavior/forms'

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const CATALOG = [
    { value: 'conn-web-prod', label: 'web-origin-prod', kind: 'HTTP' },
    { value: 'conn-api-prod', label: 'api-origin-prod', kind: 'HTTP' },
    { value: 'conn-assets', label: 'assets-bucket', kind: 'Object Storage' }
  ]

  const serverConnectors = ref(CATALOG.map((connector) => connector.value))
  const connectors = ref([...CATALOG])

  const connectorLabel = (value) =>
    connectors.value.find((connector) => connector.value === value)?.label ?? ''

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

  const portsLabel = (values) =>
    (values ?? [])
      .map((value) => httpPortOptions.find((option) => option.value === value)?.label ?? value)
      .join(', ')

  const form = reactive({
    name: 'checkout-web',
    protocolUsage: 'https',
    httpPorts: ['80'],
    applicationAccelerator: true,
    edgeFunctions: false,
    imageProcessor: false,
    tieredCache: false,
    connectorId: 'conn-web-prod',
    hostHeader: '${host}',
    browserMaxTtl: 0,
    edgeMaxTtl: 60,
    debugRules: false
  })

  const errors = reactive({ name: '', httpPorts: '', connectorId: '', hostHeader: '' })

  const originError = ref('')

  const submitting = ref(false)

  const { dirty, commit } = useBaseline(form)

  const reloadingConnectors = ref(false)

  const formScroll = ref(null)
  const originSection = ref(null)

  const createApplication = async (payload) => {
    await new Promise((resolve) => setTimeout(resolve, 700))

    if (!serverConnectors.value.includes(payload.connectorId)) {
      throw Object.assign(new Error('The referenced object no longer exists.'), {
        code: 'object_not_found',
        field: 'connectorId',
        resource: `Connector "${connectorLabel(payload.connectorId)}"`
      })
    }

    return { id: 'app-01' }
  }

  const deletedByOtherUser = ref('')

  const simulateDelete = () => {
    const target =
      connectors.value.find((connector) => connector.value === form.connectorId) ??
      connectors.value[0]
    if (!target) return

    serverConnectors.value = serverConnectors.value.filter((value) => value !== target.value)
    deletedByOtherUser.value = target.label
  }

  const resetScenario = () => {
    serverConnectors.value = CATALOG.map((connector) => connector.value)
    connectors.value = [...CATALOG]
    deletedByOtherUser.value = ''
    form.name = 'checkout-web'
    form.connectorId = 'conn-web-prod'
    form.hostHeader = '${host}'
    originError.value = ''
    errors.name = ''
    errors.httpPorts = ''
    errors.connectorId = ''
    errors.hostHeader = ''
  }

  const ANCHOR_OFFSET = 24
  const MESSAGE_EXPAND_MS = 150

  const prefersReducedMotion = () =>
    globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  const scrollToOriginAnchor = () => {
    const container = formScroll.value
    const section = originSection.value
    if (!container || !section) return

    const top =
      container.scrollTop +
      section.getBoundingClientRect().top -
      container.getBoundingClientRect().top -
      ANCHOR_OFFSET

    container.scrollTo({
      top: Math.max(0, top),
      behavior: prefersReducedMotion() ? 'auto' : 'smooth'
    })
  }

  const focusConnector = () =>
    globalThis.document.getElementById('ev-connector')?.focus({ preventScroll: true })

  const reloadConnectors = async () => {
    if (reloadingConnectors.value) return

    reloadingConnectors.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))

      connectors.value = CATALOG.filter((connector) =>
        serverConnectors.value.includes(connector.value)
      )

      if (!serverConnectors.value.includes(form.connectorId)) {
        form.connectorId = ''
        errors.connectorId = 'Select a connector to continue.'
      }

      originError.value = ''
    } finally {
      reloadingConnectors.value = false
    }

    await nextTick()
    focusConnector()
  }

  const onConnectorChange = () => {
    errors.connectorId = ''
    originError.value = ''
  }

  const validate = () => {
    errors.name = form.name.trim() ? '' : 'This field is required.'
    errors.httpPorts = form.httpPorts.length ? '' : 'Select at least one HTTP port.'
    errors.connectorId = form.connectorId ? '' : 'This field is required.'
    errors.hostHeader = form.hostHeader.trim() ? '' : 'This field is required.'
    return !errors.name && !errors.httpPorts && !errors.connectorId && !errors.hostHeader
  }

  const cancel = () => router.push({ path: '/forms', query: { email: userEmail.value } })

  const submit = async () => {
    if (submitting.value || reloadingConnectors.value) return

    originError.value = ''
    if (!validate()) return

    submitting.value = true
    try {
      await createApplication({ ...form })
      toast.success(`Application "${form.name}" created.`)
      commit()
      router.push({ path: '/forms', query: { email: userEmail.value } })
    } catch (error) {
      if (error?.code === 'object_not_found' && error?.field === 'connectorId') {
        originError.value = `${error.resource} no longer exists — another user deleted it while you were filling in this form, so the Application wasn't created. Nothing else was lost: reload the connector list and select another one.`
        errors.connectorId = 'This connector no longer exists.'
      } else {
        toast.error('Could not create the application.', {
          description: error?.message ?? 'Check your connection and try again.',
          action: { label: 'Retry', onClick: () => submit() }
        })
      }
    } finally {
      submitting.value = false
    }

    if (originError.value) {
      await nextTick()
      scrollToOriginAnchor()
      focusConnector()

      globalThis.setTimeout(scrollToOriginAnchor, MESSAGE_EXPAND_MS + 50)
    }
  }
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <UnsavedChangesGuard :dirty="dirty" />

    <CreationHeader
      :breadcrumb="[{ label: 'Forms', href: '/forms' }, { label: 'Error validation' }]"
      back-label="Back to Forms"
      @back="cancel"
      @navigate="cancel"
    />
    <main
      ref="formScroll"
      class="animate-page-enter motion-reduce:animate-none min-h-0 flex-1 overflow-auto"
    >
      <form
        class="flex min-h-full flex-col"
        aria-label="Create Application"
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
              You are User 1: the Application below is filled in and already linked to a Connector,
              four sections down. Have User 2 delete that Connector through the API — nothing will
              tell you, your copy of the list just goes stale. Then press Save, and watch the form
              take you to the one section that needs you.
            </p>
            <div class="flex flex-wrap items-center gap-(--spacing-sm)">
              <Button
                label="User 2 deletes the linked Connector"
                kind="outlined"
                size="medium"
                icon="pi pi-trash"
                :disabled="!!deletedByOtherUser || submitting"
                @click="simulateDelete"
              />
              <Button
                label="Reset scenario"
                kind="text"
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
            <legend class="sr-only">Create application</legend>

            <section class="flex flex-col gap-(--layout-group-gap)">
              <SectionHeading title="General" />
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
                      </Item.Actions>
                    </Item>
                  </Item.List>
                </template>
              </CardBox>
            </section>

            <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
              <SectionHeading title="Delivery Settings" />
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
                            :input-id="`ev-protocolUsage-${option.value}`"
                            :label="option.label"
                            :description="option.description"
                            :disabled="submitting"
                          />
                        </fieldset>
                      </Item.Actions>
                    </Item>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>HTTP ports</Item.Title>
                        <Item.Description>
                          The ports the Application listens on for HTTP traffic.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
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
                      </Item.Actions>
                    </Item>
                  </Item.List>
                </template>
              </CardBox>
            </section>

            <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
              <SectionHeading title="Modules" />
              <CardBox :padded="false">
                <template #content>
                  <Item.List>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Application Accelerator</Item.Title>
                        <Item.Description>
                          Optimize the delivery of dynamic content and enable advanced caching
                          rules.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="justify-end">
                        <Switch
                          v-model="form.applicationAccelerator"
                          aria-label="Application Accelerator"
                          :disabled="submitting"
                        />
                      </Item.Actions>
                    </Item>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Edge Functions</Item.Title>
                        <Item.Description>
                          Run serverless functions at the edge, closer to your users.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="justify-end">
                        <Switch
                          v-model="form.edgeFunctions"
                          aria-label="Edge Functions"
                          :disabled="submitting"
                        />
                      </Item.Actions>
                    </Item>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Image Processor</Item.Title>
                        <Item.Description>
                          Resize, crop, and convert images on the fly through URL parameters.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="justify-end">
                        <Switch
                          v-model="form.imageProcessor"
                          aria-label="Image Processor"
                          :disabled="submitting"
                        />
                      </Item.Actions>
                    </Item>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Tiered Cache</Item.Title>
                        <Item.Description>
                          Add a second caching layer to reduce requests to the origin.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="justify-end">
                        <Switch
                          v-model="form.tieredCache"
                          aria-label="Tiered Cache"
                          :disabled="submitting"
                        />
                      </Item.Actions>
                    </Item>
                  </Item.List>
                </template>
              </CardBox>
            </section>

            <section
              ref="originSection"
              class="layout-section-start flex flex-col gap-(--layout-group-gap)"
            >
              <SectionHeading title="Origin">
                <template #bottom>
                  <Transition
                    enter-active-class="transition duration-150 ease-out motion-reduce:transition-none"
                    enter-from-class="translate-y-2 opacity-0"
                    enter-to-class="translate-y-0 opacity-100"
                    leave-active-class="transition duration-100 ease-in motion-reduce:transition-none"
                    leave-from-class="translate-y-0 opacity-100"
                    leave-to-class="-translate-y-2 opacity-0"
                  >
                    <div v-if="originError">
                      <Message
                        severity="danger"
                        :label="originError"
                      >
                        <template #action>
                          <Button
                            label="Reload connectors"
                            kind="secondary"
                            size="medium"
                            :loading="reloadingConnectors"
                            @click="reloadConnectors"
                          />
                        </template>
                      </Message>
                    </div>
                  </Transition>
                </template>
              </SectionHeading>

              <CardBox :padded="false">
                <template #content>
                  <Item.List>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Connector</Item.Title>
                        <Item.Description>
                          The Edge Connector that serves this Application's content. Lives in the
                          Connectors module, so anyone on the account can change it.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
                        <div class="flex w-full flex-col gap-(--spacing-xs)">
                          <Skeleton
                            v-if="reloadingConnectors"
                            kind="shape"
                            width="100%"
                            height="40px"
                            aria-label="Loading connectors"
                          />
                          <template v-else>
                            <Select
                              v-model="form.connectorId"
                              size="large"
                              class="w-full"
                              placeholder="Select a connector"
                              :display-value="connectorLabel"
                              :required="!!errors.connectorId && !form.connectorId"
                              :invalid="!!errors.connectorId && !!form.connectorId"
                              :disabled="submitting"
                              @update:model-value="onConnectorChange"
                            >
                              <Select.Trigger
                                id="ev-connector"
                                aria-label="Connector"
                                :aria-describedby="
                                  errors.connectorId ? 'ev-connector-error' : undefined
                                "
                              />
                              <Select.Content>
                                <Select.Option
                                  v-for="connector in connectors"
                                  :key="connector.value"
                                  :value="connector.value"
                                >
                                  {{ connector.label }}
                                </Select.Option>
                              </Select.Content>
                            </Select>
                            <HelperText
                              v-if="errors.connectorId"
                              id="ev-connector-error"
                              :kind="form.connectorId ? 'invalid' : 'required'"
                              :label="errors.connectorId"
                            />
                          </template>
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
                      </Item.Actions>
                    </Item>
                  </Item.List>
                </template>
              </CardBox>
            </section>

            <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
              <SectionHeading title="Cache expiration policies" />
              <CardBox :padded="false">
                <template #content>
                  <Item.List>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Browser Maximum TTL (seconds)</Item.Title>
                        <Item.Description>
                          How long browsers may keep a cached response.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
                        <InputNumber
                          v-model="form.browserMaxTtl"
                          size="large"
                          class="w-full"
                          :min="0"
                          :disabled="submitting"
                          aria-label="Browser maximum TTL in seconds"
                        />
                      </Item.Actions>
                    </Item>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Edge Maximum TTL (seconds)</Item.Title>
                        <Item.Description>
                          How long the edge may keep a cached response. Tiered Cache requires a TTL
                          of at least 3 seconds.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
                        <InputNumber
                          v-model="form.edgeMaxTtl"
                          size="large"
                          class="w-full"
                          :min="0"
                          :disabled="submitting"
                          aria-label="Edge maximum TTL in seconds"
                        />
                      </Item.Actions>
                    </Item>
                  </Item.List>
                </template>
              </CardBox>
            </section>

            <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
              <SectionHeading title="Debug Rules" />
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
                          :disabled="submitting"
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
              @click="cancel"
            />
            <Button
              label="Save"
              kind="primary"
              size="medium"
              :loading="submitting"
              :disabled="reloadingConnectors"
              @click="submit"
            />
          </div>
        </footer>
        <button
          type="submit"
          class="sr-only"
          tabindex="-1"
          aria-hidden="true"
        >
          Save
        </button>
      </form>
    </main>
  </div>
</template>
