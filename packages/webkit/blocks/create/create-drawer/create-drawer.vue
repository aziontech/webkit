<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import Field from '@aziontech/webkit/field'
  import FieldDescription from '@aziontech/webkit/field-description'
  import InputGroup from '@aziontech/webkit/input-group'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import RadioGroup from '@aziontech/webkit/radio-group'
  import Select from '@aziontech/webkit/select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import { computed, reactive, ref, watch } from 'vue'

  import { sampleCertificates, sampleConnectedEnvironments, sampleEnvironments } from './sample'

  /** How an environment publishes its deployments. */
  export type CreateDrawerDeploymentPolicy = 'single_version' | 'versioned_urls'

  /** Where the domain comes from: a free platform subdomain or the account's own. */
  export type CreateDrawerDomainKind = 'free' | 'own'

  /** One environment the domain can answer in. */
  export interface CreateDrawerEnvironment {
    /** Stable value, sent in the submitted values. */
    value: string
    /** Display name. */
    label: string
    /** How the environment publishes, named in the helper text. */
    deploymentPolicy: CreateDrawerDeploymentPolicy
  }

  /** One certificate that can serve an own domain. */
  export interface CreateDrawerCertificate {
    /** Certificate id; an empty string is the free platform certificate. */
    value: string
    /** Display name. */
    label: string
    /** The host or wildcard it covers, used to preselect it for the typed address. */
    subject: string
  }

  /** The values of the form. */
  export interface CreateDrawerValues {
    /** Where the domain comes from. */
    kind: CreateDrawerDomainKind
    /** The name as typed, without the free platform suffix. */
    domain: string
    /** The chosen environment value. */
    environment: string
    /** The chosen certificate value, empty for the free platform certificate. */
    certificate: string
  }

  /** What a valid submit sends. */
  export interface CreateDrawerSubmission extends CreateDrawerValues {
    /** The full address, with the free platform suffix when it applies. */
    host: string
  }

  export interface CreateDrawerProps {
    /** Drawer title, trigger label and form name. */
    title?: string
    /** Muted line under the title. */
    description?: string
    /** Footer button label; empty uses the title. */
    submitLabel?: string
    /** Values the form opens on, such as the edited domain. */
    defaultValues?: Partial<CreateDrawerValues>
    /** Opens the drawer on mount. */
    defaultOpen?: boolean
    /** Every environment of the account. Left out, the sample renders. */
    environments?: CreateDrawerEnvironment[]
    /** Environments the resource already publishes to. Left out, the sample renders. */
    connectedEnvironments?: string[]
    /** Certificates that can serve an own domain. Left out, the sample renders. */
    certificates?: CreateDrawerCertificate[]
    /** The save is in flight: the fieldset locks and the button spins. */
    loading?: boolean
    /** Why the save failed, shown in a danger alert with Retry above the footer. */
    error?: string
  }

  const props = withDefaults(defineProps<CreateDrawerProps>(), {
    title: 'Add Domain',
    description:
      'A domain is what puts an environment on this resource. Say where it answers, and name the address.',
    submitLabel: '',
    defaultValues: () => ({}),
    defaultOpen: false,
    environments: undefined,
    connectedEnvironments: undefined,
    certificates: undefined,
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    submit: [event: Event, values: CreateDrawerSubmission]
  }>()

  const open = defineModel<boolean>('open', { default: false })

  defineSlots<{
    /** Replaces the Add button; call open to show the drawer. */
    trigger(props: { open: () => void }): unknown
  }>()

  if (props.defaultOpen) open.value = true

  const environmentSelectOpen = ref(false)

  const CREATE_ENVIRONMENT = '__create-environment__'
  const environmentOptions = computed(() => props.environments ?? sampleEnvironments)
  const resourceEnvironments = computed(
    () => props.connectedEnvironments ?? sampleConnectedEnvironments
  )
  const certificateOptions = computed(() => props.certificates ?? sampleCertificates)
  const policyLabels: Record<CreateDrawerDeploymentPolicy, string> = {
    single_version: 'Single',
    versioned_urls: 'Versioned'
  }
  const kindOptions = [
    {
      value: 'free',
      label: 'Use a free platform domain',
      description: 'You can use a free azion.app subdomain.'
    },
    {
      value: 'own',
      label: 'Bring my own domain',
      description: 'Use your own DNS and point it to this resource.'
    }
  ]

  const initialForm = (): CreateDrawerValues => ({
    kind: 'free',
    domain: '',
    environment: '',
    certificate: '',
    ...props.defaultValues
  })
  const form = reactive(initialForm())
  const errors = reactive({ domain: '', environment: '' })
  const certificateTouched = ref(Boolean(form.certificate))

  const openDrawer = () => {
    open.value = true
  }

  const environmentLabel = (value: string) =>
    environmentOptions.value.find((option) => option.value === value)?.label ?? ''
  const certificateLabel = (value: string) =>
    certificateOptions.value.find((option) => option.value === value)?.label ?? ''

  const subjectCovers = (subject: string, host: string) => {
    const pattern = subject.toLowerCase()
    if (!pattern) return false
    if (pattern === host) return true
    if (!pattern.startsWith('*.')) return false
    const parent = pattern.slice(2)
    return (
      host.endsWith(`.${parent}`) && host.slice(0, -(parent.length + 1)).split('.').length === 1
    )
  }

  const certificateForDomain = (host: string) => {
    const name = host.trim().toLowerCase()
    if (!name) return ''
    const candidates = certificateOptions.value.filter((option) =>
      subjectCovers(option.subject, name)
    )
    const exact = candidates.find((option) => option.subject.toLowerCase() === name)
    return (exact ?? candidates[0])?.value ?? ''
  }

  watch(open, (isOpen) => {
    if (!isOpen) return
    Object.assign(errors, { domain: '', environment: '' })
    Object.assign(form, initialForm())
    certificateTouched.value = Boolean(form.certificate)
  })

  const fullDomain = computed(() => {
    const name = form.domain.trim()
    if (!name) return ''
    return form.kind === 'free' ? `${name}.azion.app` : name
  })

  watch(
    () => [fullDomain.value, form.kind],
    ([host, kind]) => {
      if (kind === 'free') {
        form.certificate = ''
        return
      }
      if (certificateTouched.value) return
      form.certificate = certificateForDomain(host)
    },
    { immediate: true }
  )

  const onCertificate = (value: string) => {
    certificateTouched.value = true
    form.certificate = value
  }

  const certificateHint = computed(() => {
    if (!form.certificate) {
      return 'Served by the free platform certificate, issued and renewed automatically.'
    }
    const name = certificateLabel(form.certificate)
    return certificateTouched.value
      ? `Served with ${name}.`
      : `${name} already covers this address, so it is selected. Change it if another one should serve it.`
  })

  const chosen = computed(() =>
    environmentOptions.value.find((option) => option.value === form.environment)
  )

  const joinsResource = computed(
    () => Boolean(form.environment) && !resourceEnvironments.value.includes(form.environment)
  )

  const environmentHint = computed(() => {
    if (!chosen.value) return 'Where this domain answers. Pick one, or create it from here.'
    const policy = policyLabels[chosen.value.deploymentPolicy]
    return joinsResource.value
      ? `This resource doesn't publish into ${chosen.value.label} yet. Adding this domain connects it, served by the Deployment Settings set to ${policy}.`
      : `${chosen.value.label} publishes with the Deployment Settings set to ${policy}.`
  })

  const onEnvironmentModel = (value: string) => {
    if (value === CREATE_ENVIRONMENT) {
      environmentSelectOpen.value = false
      return
    }
    form.environment = value
    errors.environment = ''
  }

  const validate = () => {
    errors.domain = form.domain.trim() ? '' : 'This field is required.'
    errors.environment = form.environment ? '' : 'This field is required.'
    return !errors.domain && !errors.environment
  }

  const submit = (event: Event) => {
    if (props.loading) return
    if (!validate()) return
    emit('submit', event, { ...form, host: fullDomain.value })
  }
</script>

<template>
  <slot
    name="trigger"
    :open="openDrawer"
  >
    <Button
      type="button"
      :label="title"
      variant="outline"
      size="medium"
      icon="az az-plus"
      @click="openDrawer"
    />
  </slot>

  <Drawer
    v-model:open="open"
    size="large"
    side="end"
  >
    <DrawerContent>
      <form
        class="flex min-h-0 flex-1 flex-col"
        :aria-label="title"
        novalidate
        @submit.prevent="submit"
      >
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
            <DrawerTitle>{{ title }}</DrawerTitle>
            <p class="text-body-sm text-(--text-muted)">{{ description }}</p>
          </div>
        </PanelHeader>

        <PanelBody>
          <fieldset
            class="m-0 flex min-w-0 flex-col border-0 p-0"
            :disabled="loading"
          >
            <legend class="sr-only">{{ title }}</legend>
            <SettingsGroup
              label="Environment"
              hint="Where the domain answers."
            >
              <Field
                required
                :invalid="!!errors.environment"
              >
                <div class="flex min-w-0 items-center justify-between gap-(--spacing-xs)">
                  <Field.Label for="domain-environment">Environment</Field.Label>
                </div>
                <Select
                  v-model:open="environmentSelectOpen"
                  :model-value="form.environment"
                  size="large"
                  class="w-full"
                  placeholder="Select an environment"
                  :disabled="loading"
                  :invalid="!!errors.environment"
                  :display-value="environmentLabel"
                  @update:model-value="onEnvironmentModel"
                >
                  <Select.Trigger id="domain-environment" />
                  <Select.Content>
                    <Select.Item
                      v-for="option in environmentOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Item>
                    <template #footer>
                      <Select.Item
                        :value="CREATE_ENVIRONMENT"
                        class="w-full"
                      >
                        Create Environment
                      </Select.Item>
                    </template>
                  </Select.Content>
                </Select>
                <Field.Error v-if="errors.environment">{{ errors.environment }}</Field.Error>
                <Field.Description v-else>{{ environmentHint }}</Field.Description>
              </Field>
            </SettingsGroup>

            <SettingsGroup
              label="Domain"
              hint="The address this resource answers on, where it comes from, and the certificate it is served with."
            >
              <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
                <fieldset class="m-0 flex w-full min-w-0 flex-col gap-(--spacing-xs) border-0 p-0">
                  <Field.Legend type="label">Domain source</Field.Legend>
                  <RadioGroup
                    v-model="form.kind"
                    variant="card"
                    name="domain-kind"
                    aria-label="Domain source"
                    :disabled="loading"
                  >
                    <RadioGroup.Item
                      v-for="option in kindOptions"
                      :key="option.value"
                      :value="option.value"
                      :description="option.description"
                      >{{ option.label }}</RadioGroup.Item
                    >
                  </RadioGroup>
                </fieldset>

                <Field
                  :disabled="loading"
                  required
                  :invalid="!!errors.domain"
                >
                  <Field.Label>Domain</Field.Label>
                  <InputGroup>
                    <InputGroup.Input
                      v-model="form.domain"
                      placeholder="my-resource"
                      @update:model-value="errors.domain = ''"
                    />
                    <InputGroup.Addon v-if="form.kind === 'free'">.azion.app</InputGroup.Addon>
                  </InputGroup>
                  <Field.Error v-if="errors.domain">{{ errors.domain }}</Field.Error>
                </Field>

                <template v-if="form.kind === 'own'">
                  <Field>
                    <div class="flex min-w-0 items-center justify-between gap-(--spacing-xs)">
                      <Field.Label for="domain-certificate">Certificate</Field.Label>
                    </div>
                    <Select
                      :model-value="form.certificate"
                      size="large"
                      class="w-full"
                      :disabled="loading"
                      :display-value="certificateLabel"
                      @update:model-value="onCertificate"
                    >
                      <Select.Trigger
                        id="domain-certificate"
                        aria-describedby="domain-certificate-helper"
                      />
                      <Select.Content>
                        <Select.Item
                          v-for="option in certificateOptions"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </Select.Item>
                      </Select.Content>
                    </Select>
                    <FieldDescription id="domain-certificate-helper">{{
                      certificateHint
                    }}</FieldDescription>
                  </Field>
                </template>

                <Alert
                  severity="info"
                  label="Your resource is always accessible at an azion.app subdomain based on its name. Custom domains allow visitors to reach it at your own domain."
                />
              </div>
            </SettingsGroup>
          </fieldset>
        </PanelBody>

        <div
          v-if="error"
          class="px-(--spacing-md) pb-(--spacing-sm)"
        >
          <Alert
            severity="danger"
            :label="error"
            action-label="Retry"
            @action="submit"
          />
        </div>

        <PanelFooter>
          <div class="flex w-full flex-wrap items-center justify-end gap-(--spacing-sm)">
            <Button
              :label="submitLabel || title"
              variant="primary"
              size="medium"
              :loading="loading"
              type="submit"
            />
          </div>
        </PanelFooter>
      </form>
    </DrawerContent>
  </Drawer>
</template>
