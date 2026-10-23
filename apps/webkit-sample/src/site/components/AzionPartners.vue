<script setup>
  import BigNumbers from '@aziontech/webkit/big-numbers'
  import Button from '@aziontech/webkit/button'
  import FieldPhoneNumber from '@aziontech/webkit/field-phone-number'
  import FieldSelect from '@aziontech/webkit/field-select'
  import FieldText from '@aziontech/webkit/field-text'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Hero from '@aziontech/webkit/hero'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionModule from '@aziontech/webkit/section-module'
  import { toast } from '@aziontech/webkit/toast'
  import { reactive, ref } from 'vue'

  import { CLIENT_STRIP } from '../../shared/ui/brand/strips.js'
  import {
    PARTNER_COUNTRIES,
    PARTNER_FIGURES,
    PARTNER_REASONS,
    PARTNER_ROLES
  } from '../data/partners.js'
  import { COMPANY_CLOSING } from '../data/product-pages.js'
  import CapabilityGrid from '../ui/sections/CapabilityGrid.vue'
  import ClosingCallToAction from '../ui/sections/ClosingCallToAction.vue'

  const { section: _section, ...CLOSING } = COMPANY_CLOSING

  const form = reactive({
    firstname: '',
    lastname: '',
    email: '',
    company: '',
    phone: '',
    role: '',
    address: '',
    city: '',
    country_contato: ''
  })

  const phoneCountry = ref('US')

  const errors = reactive({
    firstname: '',
    lastname: '',
    email: '',
    company: '',
    role: '',
    address: '',
    city: '',
    country_contato: ''
  })

  const submitting = ref(false)

  const REQUIRED = 'This field is required.'
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const LINK_CLASS =
    'underline underline-offset-2 transition-colors hover:text-(--text-default) focus-visible:rounded-(--shape-flat) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color) motion-reduce:transition-none'

  const validate = () => {
    errors.firstname = form.firstname.trim() ? '' : REQUIRED
    errors.lastname = form.lastname.trim() ? '' : REQUIRED
    errors.email = !form.email.trim()
      ? REQUIRED
      : EMAIL.test(form.email.trim())
        ? ''
        : 'Enter a valid e-mail address.'
    errors.company = form.company.trim() ? '' : REQUIRED
    errors.role = form.role ? '' : REQUIRED
    errors.address = form.address.trim() ? '' : REQUIRED
    errors.city = form.city.trim() ? '' : REQUIRED
    errors.country_contato = form.country_contato ? '' : REQUIRED
    return Object.values(errors).every((message) => !message)
  }

  const submit = async () => {
    if (submitting.value) return
    if (!validate()) return

    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 900))
      toast.success('Request sent.')
      Object.assign(form, {
        firstname: '',
        lastname: '',
        email: '',
        company: '',
        phone: '',
        role: '',
        address: '',
        city: '',
        country_contato: ''
      })
    } catch (error) {
      toast.error('Could not send the request.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => submit() }
      })
    } finally {
      submitting.value = false
    }
  }
</script>

<template>
  <Hero
    kind="screen"
    max-width="5xl"
    align="center"
    :padded="false"
    carousel
    carousel-label="The teams our partners build for"
    :carousel-marks="CLIENT_STRIP"
    offset="3.5rem"
    bottom-height="clamp(7rem,16dvh,14rem)"
  >
    <div class="grid grid-cols-1 gap-(--spacing-xxl) py-(--spacing-lg) lg:grid-cols-2">
      <Hero.Title
        title="Grow as an Azion Partner"
        max-width="lg"
        class="min-w-0"
        sticky
      >
        Join Azion's global partner ecosystem and unlock new business opportunities with a platform
        built to accelerate, protect, and scale modern applications.
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
            <legend class="sr-only">Become a Partner</legend>

            <div class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2">
              <FieldText
                v-model="form.firstname"
                label="First name"
                input-id="partners-first-name"
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
                input-id="partners-last-name"
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
              input-id="partners-email"
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
                input-id="partners-role"
                placeholder="Select your Role"
                size="large"
                :options="PARTNER_ROLES"
                :disabled="submitting"
                :required="!!errors.role"
                :helper-text="errors.role"
                @update:model-value="errors.role = ''"
              />
              <FieldText
                v-model="form.company"
                label="Company"
                input-id="partners-company"
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
              v-model="form.phone"
              v-model:country="phoneCountry"
              label="Phone"
              input-id="partners-phone"
              name="phone"
              :disabled="submitting"
            />

            <FieldText
              v-model="form.address"
              label="Street address"
              input-id="partners-address"
              name="address"
              size="large"
              autocomplete="street-address"
              :disabled="submitting"
              :required="!!errors.address"
              :helper-text="errors.address"
              @update:model-value="errors.address = ''"
            />

            <div class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2">
              <FieldText
                v-model="form.city"
                label="City"
                input-id="partners-city"
                name="city"
                size="large"
                autocomplete="address-level2"
                :disabled="submitting"
                :required="!!errors.city"
                :helper-text="errors.city"
                @update:model-value="errors.city = ''"
              />
              <FieldSelect
                v-model="form.country_contato"
                label="Country"
                input-id="partners-country"
                placeholder="Select your Country"
                size="large"
                :options="PARTNER_COUNTRIES"
                :disabled="submitting"
                :required="!!errors.country_contato"
                :helper-text="errors.country_contato"
                @update:model-value="errors.country_contato = ''"
              />
            </div>
          </fieldset>

          <p class="m-0 text-body-sm text-(--text-muted)">
            By submitting, you agree to our
            <a
              href="https://www.azion.com/en/documentation/agreements/privacy-policy/"
              target="_blank"
              rel="noopener"
              :class="LINK_CLASS"
              >Privacy Policy</a
            >.
          </p>

          <div class="flex justify-start">
            <button
              type="submit"
              class="sr-only"
              tabindex="-1"
              aria-hidden="true"
            >
              Let's talk
            </button>
            <Button
              label="Let's talk"
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
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <BigNumbers :items="PARTNER_FIGURES" />
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <CapabilityGrid
      title="Why you should be a partner of the Azion Marketplace?"
      description="With the Azion Marketplace, we enable you to expand your revenue channels by offering edge-enabled solutions integrated into the Azion Edge Computing Platform. Azion is rapidly expanding the number of use cases covered by the Marketplace, which already include fraud detection, authentication and authorization, bot mitigation, and facial recognition, utilizing technologies such as visual computing and artificial intelligence executed at the edge."
      :items="PARTNER_REASONS"
    />

    <SectionGap hatch />

    <ClosingCallToAction v-bind="CLOSING" />
  </SectionContainer>
</template>
