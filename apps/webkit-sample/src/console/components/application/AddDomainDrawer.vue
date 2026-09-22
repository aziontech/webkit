<script setup>
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
  import FieldStack from '../form/FieldStack.vue'
  import ResourceDrawer from '../form/ResourceDrawer.vue'
  import Section from '../page/Section.vue'

  const open = defineModel('open', { type: Boolean, default: false })

  const props = defineProps({
    /** The generated Azion hostname, which keeps answering after a domain is bound. */
    generatedDomain: { type: String, default: '' },
    /** The addresses already bound, so the form can refuse a duplicate — `string[]`. */
    boundDomains: { type: Array, default: () => [] }
  })

  const emit = defineEmits([
    /** The commit — `{ id, domain, certificate }`, `certificate: ''` being the free one. */
    'save'
  ])

  const blankForm = () => ({ domain: '', certificate: '' })

  const form = reactive(blankForm())
  const errors = reactive({ domain: '' })
  const submitting = ref(false)
  const certificateTouched = ref(false)

  watch(open, (isOpen) => {
    errors.domain = ''
    submitting.value = false
    if (isOpen) return
    Object.assign(form, blankForm())
    certificateTouched.value = false
  })

  const address = computed(() => form.domain.trim().toLowerCase())

  const certificateOptions = computed(() => domainCertificateOptions())

  watch(address, (host) => {
    if (certificateTouched.value) return
    form.certificate = certificateForDomain(host)
  })

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

  const generatedNote = computed(() =>
    props.generatedDomain
      ? `This application keeps answering at ${props.generatedDomain}. A custom domain is a second address in front of it, so visitors reach it at a name you own.`
      : 'A custom domain is an address you own, pointed at this application. The generated Azion hostname keeps answering alongside it.'
  )

  const validate = () => {
    if (!address.value) {
      errors.domain = 'This field is required.'
      return false
    }
    errors.domain = props.boundDomains.includes(address.value)
      ? 'This domain is already bound to this application.'
      : ''
    return !errors.domain
  }

  const submit = async () => {
    if (submitting.value) return
    if (!validate()) return

    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 600))
      emit('save', {
        id: `domain-${Date.now()}`,
        domain: address.value,
        certificate: form.certificate
      })
      open.value = false
    } catch (error) {
      toast.error("Couldn't add the domain.", {
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
    title="Add Domain"
    description="Serve this application on an address you own, with the certificate that covers it."
    save-label="Add Domain"
    :submitting="submitting"
    @submit="submit"
  >
    <Section
      stacked
      :divided="false"
      title="Domain"
      hint="The address visitors reach this application at, and the certificate it is served with."
    >
      <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
        <FieldStack
          label="Domain"
          required
          :message="errors.domain"
          message-kind="required"
        >
          <template #default="{ controlId, describedBy }">
            <InputText
              :id="controlId"
              v-model="form.domain"
              size="large"
              class="w-full"
              placeholder="www.example.com"
              :disabled="submitting"
              :required="!!errors.domain"
              :aria-describedby="describedBy"
              @update:model-value="errors.domain = ''"
            />
          </template>
        </FieldStack>

        <FieldStack
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
          :label="generatedNote"
        />
      </div>
    </Section>
  </ResourceDrawer>
</template>
