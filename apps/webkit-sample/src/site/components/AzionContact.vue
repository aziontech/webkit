<script setup>
  import Button from '@aziontech/webkit/button'
  import CallToAction from '@aziontech/webkit/call-to-action'
  import CardGrid from '@aziontech/webkit/card-grid'
  import FieldPhoneNumber from '@aziontech/webkit/field-phone-number'
  import FieldSelect from '@aziontech/webkit/field-select'
  import FieldText from '@aziontech/webkit/field-text'
  import FieldTextarea from '@aziontech/webkit/field-textarea'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Hero from '@aziontech/webkit/hero'
  import Label from '@aziontech/webkit/label'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import { toast } from '@aziontech/webkit/toast'
  import { reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'

  import { CLIENT_STRIP } from '../../shared/ui/brand/strips.js'
  import { CONTACT_OFFICES, CONTACT_ROLES } from '../data/contact.js'

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
    max-width="site"
    floor-texture="pixelate"
    carousel
    carousel-label="The teams our specialists work with"
    :carousel-marks="CLIENT_STRIP"
    class="[--banner-offset:3.5rem] [--banner-bottom-height:clamp(7rem,16dvh,14rem)] [--banner-floor-bg:var(--bg-surface)] [--texture-pool-a:95%_64%] [--texture-pool-b:-2%_38%]"
  >
    <div class="grid flex-1 grid-cols-1 items-center gap-(--spacing-xxl) lg:grid-cols-2">
      <Hero.Title
        title="Talk to our Specialists"
        class="min-w-0"
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
            kind="text"
            size="large"
            href="https://www.azion.com/en/lp/under-attack-mitigation/"
            target="_blank"
            icon="pi pi-chevron-right"
            icon-position="trailing"
            animated
          />
        </template>
      </Hero.Title>

      <FrameBox class="bg-(--bg-surface) p-(--spacing-xl)">
        <form
          novalidate
          class="flex flex-col gap-(--spacing-lg)"
          @submit.prevent="submit"
        >
          <fieldset
            :disabled="submitting"
            class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"
          >
            <legend class="sr-only">Talk to our Specialists</legend>

            <div class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2">
              <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                <Label
                  for="contact-first-name"
                  required
                  >First Name:</Label
                >
                <FieldText
                  v-model="form.firstname"
                  input-id="contact-first-name"
                  name="firstname"
                  size="large"
                  autocomplete="given-name"
                  :disabled="submitting"
                  :required="!!errors.firstname"
                  :helper-text="errors.firstname"
                  @update:model-value="errors.firstname = ''"
                />
              </div>
              <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                <Label
                  for="contact-last-name"
                  required
                  >Last Name:</Label
                >
                <FieldText
                  v-model="form.lastname"
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
            </div>

            <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
              <Label
                for="contact-email"
                required
                >E-mail:</Label
              >
              <FieldText
                v-model="form.email"
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
            </div>

            <div class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2">
              <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                <Label
                  for="contact-role"
                  required
                  >Role:</Label
                >
                <FieldSelect
                  v-model="form.role"
                  input-id="contact-role"
                  placeholder="Select your Role"
                  :options="CONTACT_ROLES"
                  size="large"
                  :disabled="submitting"
                  :required="!!errors.role"
                  :helper-text="errors.role"
                  @update:model-value="errors.role = ''"
                />
              </div>
              <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                <Label
                  for="contact-company"
                  required
                  >Company:</Label
                >
                <FieldText
                  v-model="form.company"
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
            </div>

            <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
              <Label for="contact-phone">Phone</Label>
              <FieldPhoneNumber
                v-model="form.mobilephone"
                v-model:country="phoneCountry"
                input-id="contact-phone"
                name="mobilephone"
                :disabled="submitting"
              />
            </div>

            <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
              <Label
                for="contact-message"
                required
                >Message</Label
              >
              <FieldTextarea
                v-model="form.message"
                input-id="contact-message"
                name="message"
                :disabled="submitting"
                :required="!!errors.message"
                :helper-text="errors.message"
                @update:model-value="errors.message = ''"
              />
            </div>
          </fieldset>

          <div class="flex justify-end">
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
      </FrameBox>
    </div>
  </Hero>

  <SectionContainer max-width="site">
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle title="Our offices" />
      </template>

      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <CardGrid
          variant="divider"
          :columns="4"
          :mobile-columns="1"
        >
          <div
            v-for="office in CONTACT_OFFICES"
            :key="`${office.country}-${office.lines[1]}`"
            class="flex flex-col gap-(--spacing-md) bg-(--bg-canvas) p-(--spacing-lg)"
          >
            <i
              class="pi pi-map-marker text-(length:--text-body-lg) text-(--primary)"
              aria-hidden="true"
            />

            <div class="flex flex-col gap-(--spacing-xs)">
              <h3 class="m-0 text-heading-sm text-(--text-default)">{{ office.country }}</h3>
              <p
                v-for="line in office.lines"
                :key="line"
                class="m-0 text-body-md text-(--text-muted)"
              >
                {{ line }}
              </p>
              <p class="m-0 text-body-md text-(--text-muted)">
                Phone:
                <a
                  :href="office.phoneHref"
                  :class="LINK_CLASS"
                  >{{ office.phone }}</a
                >
              </p>
            </div>

            <div class="mt-auto pt-(--spacing-sm)">
              <Button
                label="Map"
                kind="outlined"
                size="medium"
                :href="office.map"
                target="_blank"
                icon="pi pi-chevron-right"
                icon-position="trailing"
                animated
              />
            </div>
          </div>
        </CardGrid>
      </FrameBox>
    </SectionModule>

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
      marks="none"
      hatch
      class="h-[calc(var(--spacing-xxl)*2)]"
    />
  </SectionContainer>
</template>
