<script setup lang="ts">
  import FieldRadioBlock from '@aziontech/webkit/field-radio-block'
  import InputGroupAddon from '@aziontech/webkit/input-group-addon'
  import InputGroupRoot from '@aziontech/webkit/input-group-root'
  import InputText from '@aziontech/webkit/input-text'
  import Message from '@aziontech/webkit/message'
  import Select from '@aziontech/webkit/select'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, reactive, ref, watch } from 'vue'

  import {
    certificateForDomain,
    domainCertificateLabel,
    domainCertificateOptions
  } from '../../lib/data/certificates'
  import { deploymentPolicyLabel, environmentNameOptions } from '../../lib/data/environments'
  import { AZION_DOMAIN_SUFFIX } from '../../lib/data/workload-provisioning'
  import CreateEnvironmentDrawer from '../environment/CreateEnvironmentDrawer.vue'
  import FieldStack from '../form/FieldStack.vue'
  import ResourceDrawer from '../form/ResourceDrawer.vue'
  import Section from '../page/Section.vue'

  const open = defineModel('open', { type: Boolean, default: false })

  interface Props {
    resource?: 'workload' | 'application'
    intent?: 'environment' | 'domain'
    environments?: unknown[]
    domain?: Record<string, unknown>
  }

  const props = withDefaults(defineProps<Props>(), {
    resource: 'workload',
    intent: 'environment',
    environments: () => [],
    domain: null
  })

  const emit = defineEmits<{
    save: [value: unknown]
  }>()

  const editing = computed(() => Boolean(props.domain))

  const copy = computed(() => {
    if (editing.value) return { title: 'Edit Domain', save: 'Save Domain' }
    return props.intent === 'domain'
      ? { title: 'Add Domain', save: 'Add Domain' }
      : { title: 'Add Environment', save: 'Add Environment' }
  })

  const description = computed(() =>
    editing.value
      ? 'Change where it answers, the address, or the certificate it is served with.'
      : `A domain is what puts an environment on this ${props.resource}. Say where it answers, and name the address.`
  )

  const kindOptions = computed(() => [
    {
      value: 'free',
      label: 'Get a free Azion Domain',
      description: `You can use a free ${AZION_DOMAIN_SUFFIX.replace(/^\./, '')} domain.`
    },
    {
      value: 'own',
      label: 'Bring my own Domain',
      description: `Use your own DNS and point it to your Azion ${props.resource}.`
    }
  ])

  const environmentOptions = environmentNameOptions
  const environmentLabel = (value) =>
    environmentOptions.value.find((option) => option.value === value)?.label ?? ''

  const blankForm = () => ({ kind: 'free', domain: '', environment: '', certificate: '' })

  const formForDomain = (entry) => {
    const address = String(entry.domain ?? '')
    const free = address.endsWith(AZION_DOMAIN_SUFFIX)
    return {
      kind: free ? 'free' : 'own',
      domain: free ? address.slice(0, -AZION_DOMAIN_SUFFIX.length) : address,
      environment: entry.environment ?? '',
      certificate: entry.certificate ?? ''
    }
  }

  const form = reactive(blankForm())
  const errors = reactive({ domain: '', environment: '' })
  const submitting = ref(false)
  const createEnvironmentOpen = ref(false)

  const certificateTouched = ref(false)

  watch(open, (isOpen) => {
    Object.assign(errors, { domain: '', environment: '' })
    submitting.value = false
    if (!isOpen) {
      Object.assign(form, blankForm())
      certificateTouched.value = false
      return
    }
    Object.assign(form, props.domain ? formForDomain(props.domain) : blankForm())
    certificateTouched.value = editing.value
  })

  const fullDomain = computed(() => {
    const name = form.domain.trim()
    if (!name) return ''
    return form.kind === 'free' ? `${name}${AZION_DOMAIN_SUFFIX}` : name
  })

  const certificateOptions = computed(() => domainCertificateOptions())

  const freeDomainNote = computed(
    () =>
      `Your ${props.resource} is always accessible at an ${AZION_DOMAIN_SUFFIX.replace(/^\./, '')} subdomain based on its name. Custom domains allow visitors to reach your project at your own domain.`
  )

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

  const onCertificate = (value) => {
    certificateTouched.value = true
    form.certificate = value
  }

  const certificateHint = computed(() => {
    if (!form.certificate) {
      return 'Served by the free Azion certificate, issued and renewed by the platform.'
    }
    const name = domainCertificateLabel(form.certificate)
    return certificateTouched.value
      ? `Served with ${name}.`
      : `${name} already covers this address, so it is selected. Change it if another one should serve it.`
  })

  const chosen = computed(() =>
    environmentOptions.value.find((option) => option.value === form.environment)
  )

  const joinsWorkload = computed(
    () =>
      Boolean(form.environment) &&
      !props.environments.some((environment) => environment.name === form.environment)
  )

  const environmentHint = computed(() => {
    if (!chosen.value) return 'Where this domain answers. Pick one, or create it from here.'
    const policy = deploymentPolicyLabel(chosen.value.deploymentPolicy)
    return joinsWorkload.value
      ? `This ${props.resource} doesn't publish into ${chosen.value.label} yet. Adding this domain connects it, served by the Deployment Settings set to ${policy}.`
      : `${chosen.value.label} publishes with the Deployment Settings set to ${policy}.`
  })

  const CREATE_ENVIRONMENT = '__create-environment__'

  const environmentSelectOpen = ref(false)

  const onEnvironmentModel = (value) => {
    if (value === CREATE_ENVIRONMENT) {
      environmentSelectOpen.value = false
      createEnvironmentOpen.value = true
      return
    }
    form.environment = value
    errors.environment = ''
  }

  const onEnvironmentCreated = (environment) => {
    form.environment = environment.name
    errors.environment = ''
  }

  const validate = () => {
    errors.domain = form.domain.trim() ? '' : 'This field is required.'
    errors.environment = form.environment ? '' : 'This field is required.'
    return !errors.domain && !errors.environment
  }

  const submit = async () => {
    if (submitting.value) return
    if (!validate()) return

    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 600))
      emit('save', {
        id: props.domain?.id ?? `domain-${Date.now()}`,
        domain: fullDomain.value,
        environment: form.environment,
        certificate: form.certificate
      })
      open.value = false
    } catch (error) {
      const noun = editing.value || props.intent === 'domain' ? 'domain' : 'environment'
      toast.error(`Couldn't ${editing.value ? 'save' : 'add'} the ${noun}.`, {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => submit() }
      })
    } finally {
      submitting.value = false
    }
  }
</script>

<template>
  <ResourceDrawer
    v-model:open="open"
    :title="copy.title"
    :description="description"
    :save-label="copy.save"
    :submitting="submitting"
    :dismissible="!createEnvironmentOpen"
    @submit="submit"
  >
    <Section
      stacked
      :divided="false"
      title="Environment"
      hint="Where the domain answers."
    >
      <FieldStack
        label="Environment"
        required
        :description="environmentHint"
        :message="errors.environment"
        message-kind="required"
      >
        <template #default="{ controlId, describedBy }">
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
              :id="controlId"
              :aria-describedby="describedBy"
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
        </template>
      </FieldStack>
    </Section>

    <Section
      stacked
      :divided="false"
      title="Domain"
      hint="The address this workload answers on, where it comes from, and the certificate it is served with."
    >
      <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
        <FieldStack
          group
          label="Domain source"
        >
          <template #default="{ labelId }">
            <div
              role="radiogroup"
              :aria-labelledby="labelId"
              class="flex min-w-0 flex-col gap-(--spacing-sm)"
            >
              <FieldRadioBlock
                v-for="option in kindOptions"
                :key="option.value"
                v-model="form.kind"
                :value="option.value"
                name="domain-kind"
                :input-id="`domain-kind-${option.value}`"
                :label="option.label"
                :description="option.description"
                :disabled="submitting"
              />
            </div>
          </template>
        </FieldStack>

        <FieldStack
          label="Domain"
          required
          :message="errors.domain"
          message-kind="required"
        >
          <template #default="{ controlId, describedBy }">
            <InputGroupRoot :disabled="submitting">
              <InputText
                :id="controlId"
                v-model="form.domain"
                size="large"
                class="flex-1"
                placeholder="my-workload"
                :disabled="submitting"
                :required="!!errors.domain"
                :aria-describedby="describedBy"
                @update:model-value="errors.domain = ''"
              />
              <InputGroupAddon v-if="form.kind === 'free'">
                {{ AZION_DOMAIN_SUFFIX }}
              </InputGroupAddon>
            </InputGroupRoot>
          </template>
        </FieldStack>

        <FieldStack
          v-if="form.kind === 'own'"
          label="Certificate"
          :description="certificateHint"
        >
          <template #default="{ controlId, describedBy }">
            <Select
              :model-value="form.certificate"
              size="large"
              class="w-full"
              :disabled="submitting"
              :display-value="domainCertificateLabel"
              @update:model-value="onCertificate"
            >
              <Select.Trigger
                :id="controlId"
                :aria-describedby="describedBy"
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
          </template>
        </FieldStack>

        <Message
          severity="info"
          :label="freeDomainNote"
        />
      </div>
    </Section>
  </ResourceDrawer>

  <CreateEnvironmentDrawer
    v-model:open="createEnvironmentOpen"
    stacked
    @create="onEnvironmentCreated"
  />
</template>
