<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import Field from '@aziontech/webkit/field'
  import HelperText from '@aziontech/webkit/helper-text'
  import InputGroup from '@aziontech/webkit/input-group'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import RadioGroup from '@aziontech/webkit/radio-group'
  import Select, { type SelectOptionItem } from '@aziontech/webkit/select'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, reactive, ref, watch } from 'vue'

  const open = ref(false)
  const submitting = ref(false)
  const saveFailed = ref(false)
  const failNextSave = ref(false)
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
      description: 'You can use a free azion.app subdomain.'
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
    saveFailed.value = false
    Object.assign(form, blankForm())
    certificateTouched.value = false
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
    saveFailed.value = false
    setTimeout(() => {
      submitting.value = false
      if (failNextSave.value) {
        failNextSave.value = false
        saveFailed.value = true
        return
      }
      open.value = false
      toast.success(`${fullDomain.value} added.`)
    }, 600)
  }
</script>

<template>
  <Button
    type="button"
    label="Add Domain"
    variant="outline"
    size="medium"
    icon="ai ai-plus"
    @click="open = true"
  />

  <Drawer
    v-model:open="open"
    size="large"
    side="end"
  >
    <DrawerContent>
      <form
        class="flex min-h-0 flex-1 flex-col"
        aria-label="Add Domain"
        novalidate
        @submit.prevent="submit"
      >
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
            <DrawerTitle>Add Domain</DrawerTitle>
            <p class="text-body-sm text-(--text-muted)">
              A domain is what puts an environment on this resource. Say where it answers, and name
              the address.
            </p>
          </div>
        </PanelHeader>

        <PanelBody>
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
                  :disabled="submitting"
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
            </SettingsSection>

            <SettingsSection
              title="Domain"
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
                    :disabled="submitting"
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
                  :disabled="submitting"
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
                      :disabled="submitting"
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
                    <HelperText
                      id="domain-certificate-helper"
                      type="helper"
                      >{{ certificateHint }}</HelperText
                    >
                  </Field>
                </template>

                <Alert
                  severity="info"
                  label="Your resource is always accessible at an azion.app subdomain based on its name. Custom domains allow visitors to reach it at your own domain."
                />
              </div>
            </SettingsSection>
          </fieldset>
        </PanelBody>

        <div
          v-if="saveFailed"
          class="px-(--spacing-md) pb-(--spacing-sm)"
        >
          <Alert
            severity="danger"
            :label="`${fullDomain || 'The domain'} wasn't added. The request timed out; your values are kept.`"
            action-label="Retry"
            @action="submit"
          />
        </div>

        <PanelFooter>
          <div class="flex w-full flex-wrap items-center justify-end gap-(--spacing-sm)">
            <Button
              label="Add Domain"
              variant="primary"
              size="medium"
              :loading="submitting"
              type="submit"
            />
          </div>
        </PanelFooter>
      </form>
    </DrawerContent>
  </Drawer>
</template>
