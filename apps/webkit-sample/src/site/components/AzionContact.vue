<script setup>
  import Button from '@aziontech/webkit/button'
  import CallToAction from '@aziontech/webkit/call-to-action'
  import FieldPhoneNumber from '@aziontech/webkit/field-phone-number'
  import FieldSelect from '@aziontech/webkit/field-select'
  import FieldText from '@aziontech/webkit/field-text'
  import FieldTextarea from '@aziontech/webkit/field-textarea'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Hero from '@aziontech/webkit/hero'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionModule from '@aziontech/webkit/section-module'
  import TextureMaterial from '@aziontech/webkit/texture-material'
  import { toast } from '@aziontech/webkit/toast'
  import { reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'

  import { CLIENT_STRIP } from '../../shared/ui/brand/strips.js'
  import { CONTACT_ROLES } from '../data/contact.js'

  const form = reactive({
    firstname: '',
    lastname: '',
    email: '',
    role: '',
    company: '',
    mobilephone: '',
    message: ''
  })

  const phoneCountry = ref('US')

  const errors = reactive({
    firstname: '',
    lastname: '',
    email: '',
    role: '',
    company: '',
    message: ''
  })

  const submitting = ref(false)

  const LINK_CLASS =
    'underline underline-offset-2 transition-colors hover:text-(--text-default) focus-visible:rounded-(--shape-flat) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color) motion-reduce:transition-none'

  const REQUIRED = 'This field is required.'
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const validate = () => {
    errors.firstname = form.firstname.trim() ? '' : REQUIRED
    errors.lastname = form.lastname.trim() ? '' : REQUIRED
    errors.email = !form.email.trim()
      ? REQUIRED
      : EMAIL.test(form.email.trim())
        ? ''
        : 'Enter a valid e-mail address.'
    errors.role = form.role ? '' : REQUIRED
    errors.company = form.company.trim() ? '' : REQUIRED
    errors.message = form.message.trim() ? '' : REQUIRED
    return Object.values(errors).every((message) => !message)
  }

  const submit = async () => {
    if (submitting.value) return
    if (!validate()) return

    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 900))
      toast.success('Message sent.')
      Object.assign(form, {
        firstname: '',
        lastname: '',
        email: '',
        role: '',
        company: '',
        mobilephone: '',
        message: ''
      })
    } catch (error) {
      toast.error('Could not send the message.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => submit() }
      })
    } finally {
      submitting.value = false
    }
  }

  const router = useRouter()
  const goSignup = () => router.push('/signup')
</script>

<template>
  <Hero
    kind="screen"
    max-width="5xl"
    align="center"
    :padded="false"
    carousel
    carousel-label="The teams our specialists work with"
    :carousel-marks="CLIENT_STRIP"
    offset="3.5rem"
    bottom-height="clamp(7rem,16dvh,14rem)"
  >
    <div class="grid grid-cols-1 gap-(--spacing-xxl) py-(--spacing-lg) lg:grid-cols-2">
      <Hero.Title
        title="Talk to our Specialists"
        max-width="lg"
        class="min-w-0"
        sticky
      >
        We are here to help and provide guidance on performance, security, and AI-native workloads.
        Feel free to give us a call at
        <a
          href="tel:+18333329466"
          :class="LINK_CLASS"
          >+1 833-332-9466</a
        >, use our live chat or submit your inquiry on the form.

        <template #actions>
          <Button
            label="Talk to Support"
            kind="secondary"
            size="large"
          />
          <Button
            label="Under CyberAttack?"
            kind="outlined"
            size="large"
            href="https://www.azion.com/en/lp/under-attack-mitigation/"
            target="_blank"
            icon="pi pi-chevron-right"
            icon-position="trailing"
            animated
          />
        </template>
      </Hero.Title>

      <div class="min-w-0">
        <form
          novalidate
          class="flex flex-col gap-(--spacing-md)"
          @submit.prevent="submit"
        >
          <fieldset
            :disabled="submitting"
            class="m-0 flex min-w-0 flex-col gap-(--spacing-md) border-0 p-0"
          >
            <legend class="sr-only">Talk to our Specialists</legend>

            <div class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2">
              <FieldText
                v-model="form.firstname"
                label="First name"
                input-id="contact-first-name"
                name="firstname"
                size="large"
                autocomplete="given-name"
                :disabled="submitting"
                :required="!!errors.firstname"
                :helper-text="errors.firstname"
                @update:model-value="errors.firstname = ''"
              />
              <FieldText
                v-model="form.lastname"
                label="Last name"
                input-id="contact-last-name"
                name="lastname"
                size="large"
                autocomplete="family-name"
                :disabled="submitting"
                :required="!!errors.lastname"
                :helper-text="errors.lastname"
                @update:model-value="errors.lastname = ''"
              />
            </div>

            <FieldText
              v-model="form.email"
              label="E-mail"
              input-id="contact-email"
              name="email"
              type="email"
              size="large"
              autocomplete="email"
              :disabled="submitting"
              :required="!!errors.email && !form.email.trim()"
              :invalid="!!errors.email && !!form.email.trim()"
              :helper-text="errors.email"
              @update:model-value="errors.email = ''"
            />

            <div class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2">
              <FieldSelect
                v-model="form.role"
                label="Role"
                input-id="contact-role"
                placeholder="Select your Role"
                size="large"
                :options="CONTACT_ROLES"
                :disabled="submitting"
                :required="!!errors.role"
                :helper-text="errors.role"
                @update:model-value="errors.role = ''"
              />
              <FieldText
                v-model="form.company"
                label="Company"
                input-id="contact-company"
                name="company"
                size="large"
                autocomplete="organization"
                :disabled="submitting"
                :required="!!errors.company"
                :helper-text="errors.company"
                @update:model-value="errors.company = ''"
              />
            </div>

            <FieldPhoneNumber
              v-model="form.mobilephone"
              v-model:country="phoneCountry"
              label="Phone"
              input-id="contact-phone"
              name="mobilephone"
              :disabled="submitting"
            />

            <FieldTextarea
              v-model="form.message"
              label="Message"
              input-id="contact-message"
              name="message"
              :disabled="submitting"
              :required="!!errors.message"
              :helper-text="errors.message"
              @update:model-value="errors.message = ''"
            />
          </fieldset>

          <div class="flex justify-start">
            <button
              type="submit"
              class="sr-only"
              tabindex="-1"
              aria-hidden="true"
            >
              Send
            </button>
            <Button
              label="Send"
              kind="secondary"
              size="large"
              :loading="submitting"
              @click="submit"
            />
          </div>
        </form>
      </div>
    </div>
  </Hero>

  <SectionContainer max-width="site">
    <SectionGap hatch />

    <SectionModule
      id="contact"
      :divided="false"
      :padded="false"
      class="scroll-mt-(--spacing-xxl)"
    >
      <CallToAction
        framed
        kind="split"
        eyebrow="Build"
        title="Build once."
        title-muted="Run everywhere."
        description="Get a faster path to launch, lower latency, and less infrastructure overhead."
      >
        <template #actions>
          <Button
            label="Start Free"
            kind="secondary"
            size="large"
            @click="goSignup"
          />
        </template>
        <template #aside>
          <Button
            label="Talk to our team"
            kind="outlined"
            size="large"
            href="#"
            icon="pi pi-chevron-right"
            icon-position="trailing"
            animated
          />
        </template>
      </CallToAction>
    </SectionModule>

    <FrameBox
      borders="none"
      marks="all"
      data-hatch="true"
      class="h-[calc(var(--spacing-xxl)*2)]"
    >
      <TextureMaterial kind="lines" />
    </FrameBox>
  </SectionContainer>
</template>
