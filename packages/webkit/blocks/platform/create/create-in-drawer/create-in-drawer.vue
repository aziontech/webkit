<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import Field from '@aziontech/webkit/field'
  import HelperText from '@aziontech/webkit/helper-text'
  import InputGroup from '@aziontech/webkit/input-group'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import RadioButton from '@aziontech/webkit/radio-button'
  import Select, { type SelectOptionItem } from '@aziontech/webkit/select'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import { computed, reactive, ref, watch } from 'vue'

  const open = ref(false)
  const submitting = ref(false)
  const environmentSelectOpen = ref(false)
  const certificateTouched = ref(false)

  type DeploymentPolicy = 'single_version' | 'versioned_urls'

  interface EnvironmentOption extends SelectOptionItem {
    deploymentPolicy: DeploymentPolicy
  }

  const CREATE_ENVIRONMENT = '__create-environment__'
  const environmentOptions: EnvironmentOption[] = [
    { value: 'Production', label: 'Production', deploymentPolicy: 'single_version' },
    { value: 'Preview', label: 'Preview', deploymentPolicy: 'versioned_urls' },
    { value: 'Stage', label: 'Stage', deploymentPolicy: 'versioned_urls' }
  ]
  const policyLabels: Record<DeploymentPolicy, string> = {
    single_version: 'Single',
    versioned_urls: 'Versioned'
  }
  const resourceEnvironments = ['Production', 'Preview']
  const certificateOptions = [
    { value: '', label: 'Free platform certificate', subject: '' },
    { value: 'cert-8801', label: 'example.com wildcard', subject: '*.example.com' },
    { value: 'cert-8803', label: 'api.example.com', subject: 'api.example.com' },
    { value: 'cert-8805', label: 'staging wildcard', subject: '*.staging.example.com' },
    { value: 'cert-8802', label: 'example.org', subject: 'example.org' }
  ]
  const kindOptions = [
    {
      value: 'free',
      label: 'Use a free platform domain',
      description: 'You can use a free example.app subdomain.'
    },
    {
      value: 'own',
      label: 'Bring my own domain',
      description: 'Use your own DNS and point it to this resource.'
    }
  ]

  const blankForm = () => ({ kind: 'free', domain: '', environment: '', certificate: '' })
  const form = reactive(blankForm())
  const errors = reactive({ domain: '', environment: '' })

  const environmentLabel = (value: string) =>
    environmentOptions.find((option) => option.value === value)?.label ?? ''
  const certificateLabel = (value: string) =>
    certificateOptions.find((option) => option.value === value)?.label ?? ''

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
    const candidates = certificateOptions.filter((option) => subjectCovers(option.subject, name))
    const exact = candidates.find((option) => option.subject.toLowerCase() === name)
    return (exact ?? candidates[0])?.value ?? ''
  }

  watch(open, (isOpen) => {
    if (!isOpen) return
    Object.assign(errors, { domain: '', environment: '' })
    submitting.value = false
    Object.assign(form, blankForm())
    certificateTouched.value = false
  })

  const fullDomain = computed(() => {
    const name = form.domain.trim()
    if (!name) return ''
    return form.kind === 'free' ? `${name}.example.app` : name
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
    environmentOptions.find((option) => option.value === form.environment)
  )

  const joinsResource = computed(
    () => Boolean(form.environment) && !resourceEnvironments.includes(form.environment)
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

  const submit = () => {
    if (submitting.value) return
    if (!validate()) return
    submitting.value = true
    setTimeout(() => {
      submitting.value = false
      open.value = false
    }, 600)
  }
</script>

<template>
  <Button
    type="button"
    label="Add Domain"
    kind="outlined"
    size="medium"
    icon="pi pi-plus"
    @click="open = true"
  />

  <Drawer
    v-model:open="open"
    size="medium"
    side="right"
  >
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent>
        <form
          class="flex min-h-0 flex-1 flex-col"
          aria-label="Add Domain"
          novalidate
          @submit.prevent="submit"
        >
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
              <DrawerTitle>Add Domain</DrawerTitle>
              <p class="text-body-sm text-(--text-muted)">
                A domain is what puts an environment on this resource. Say where it answers, and
                name the address.
              </p>
            </div>
            <DrawerClose />
          </PanelHeader>

          <PanelContent>
            <fieldset
              class="m-0 flex min-w-0 flex-col border-0 p-0"
              :disabled="submitting"
            >
              <legend class="sr-only">Add Domain</legend>
              <SettingsSection
                title="Environment"
                hint="Where the domain answers."
              >
                <Field
                  :data-field-invalid="errors.environment ? true : null"
                  :required="!!errors.environment"
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
                    :disabled="submitting"
                    :invalid="!!errors.environment"
                    :display-value="environmentLabel"
                    @update:model-value="onEnvironmentModel"
                  >
                    <Select.Trigger
                      id="domain-environment"
                      aria-describedby="domain-environment-helper"
                    />
                    <Select.Content>
                      <Select.Option
                        v-for="option in environmentOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </Select.Option>
                      <template #footer>
                        <Select.Option
                          :value="CREATE_ENVIRONMENT"
                          class="w-full"
                        >
                          Create Environment
                        </Select.Option>
                      </template>
                    </Select.Content>
                  </Select>
                  <HelperText
                    id="domain-environment-helper"
                    :kind="errors.environment ? 'required' : 'helper'"
                  >
                    <template v-if="errors.environment">{{ errors.environment }}</template>
                    <template v-else>{{ environmentHint }}</template>
                  </HelperText>
                </Field>
              </SettingsSection>

              <SettingsSection
                title="Domain"
                hint="The address this resource answers on, where it comes from, and the certificate it is served with."
              >
                <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
                  <fieldset
                    class="m-0 flex w-full min-w-0 flex-col gap-(--spacing-xs) border-0 p-0"
                  >
                    <Field.Legend kind="label">Domain source</Field.Legend>
                    <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
                      <Field.Label
                        v-for="option in kindOptions"
                        :key="option.value"
                      >
                        <Field
                          orientation="horizontal"
                          :disabled="submitting"
                        >
                          <RadioButton
                            v-model="form.kind"
                            :value="option.value"
                            name="domain-kind"
                            :input-id="'domain-kind-' + option.value"
                          />
                          <Field.Content>
                            <Field.Title>{{ option.label }}</Field.Title>
                            <Field.Description v-if="option.description">{{
                              option.description
                            }}</Field.Description>
                          </Field.Content>
                        </Field>
                      </Field.Label>
                    </div>
                  </fieldset>

                  <Field
                    :disabled="submitting"
                    :required="!!errors.domain"
                  >
                    <Field.Label>Domain</Field.Label>
                    <InputGroup>
                      <InputGroup.Input
                        v-model="form.domain"
                        placeholder="my-resource"
                        @update:model-value="errors.domain = ''"
                      />
                      <InputGroup.Addon v-if="form.kind === 'free'">.example.app</InputGroup.Addon>
                    </InputGroup>
                    <Field.Description v-if="errors.domain">{{ errors.domain }}</Field.Description>
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
                        :disabled="submitting"
                        :display-value="certificateLabel"
                        @update:model-value="onCertificate"
                      >
                        <Select.Trigger
                          id="domain-certificate"
                          aria-describedby="domain-certificate-helper"
                        />
                        <Select.Content>
                          <Select.Option
                            v-for="option in certificateOptions"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </Select.Option>
                        </Select.Content>
                      </Select>
                      <HelperText
                        id="domain-certificate-helper"
                        kind="helper"
                        >{{ certificateHint }}</HelperText
                      >
                    </Field>
                  </template>

                  <Alert
                    severity="info"
                    label="Your resource is always accessible at an example.app subdomain based on its name. Custom domains allow visitors to reach it at your own domain."
                  />
                </div>
              </SettingsSection>
            </fieldset>
          </PanelContent>

          <PanelFooter>
            <div class="flex w-full flex-wrap items-center justify-between gap-(--spacing-sm)">
              <div class="flex min-w-0 items-center gap-(--spacing-sm)"></div>
              <Button
                label="Add Domain"
                kind="primary"
                size="medium"
                :loading="submitting"
                type="submit"
              />
            </div>
          </PanelFooter>
        </form>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
</template>
