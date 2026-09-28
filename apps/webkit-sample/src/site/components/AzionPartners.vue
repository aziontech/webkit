<script setup>
  import BigNumbers from '@aziontech/webkit/big-numbers'
  import Button from '@aziontech/webkit/button'
  import ContentColumns from '@aziontech/webkit/content-columns'
  import FieldPhoneNumber from '@aziontech/webkit/field-phone-number'
  import FieldSelect from '@aziontech/webkit/field-select'
  import FieldText from '@aziontech/webkit/field-text'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Hero from '@aziontech/webkit/hero'
  import Label from '@aziontech/webkit/label'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import { toast } from '@aziontech/webkit/toast'
  import { reactive, ref } from 'vue'

  import {
    PARTNER_COUNTRIES,
    PARTNER_FIGURES,
    PARTNER_REASONS,
    PARTNER_ROLES
  } from '../data/partners.js'

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
    texture="dots"
    texture-fade="bottom"
    max-width="site"
    class="[--banner-offset:3.5rem]"
  >
    <Hero.Title
      title="Grow as an Azion Partner"
      description="Join Azion's global partner ecosystem and unlock new business opportunities with a platform built to accelerate, protect, and scale modern applications."
    />

    <template #media>
      <FrameBox class="w-full bg-(--bg-surface) p-(--spacing-xl)">
        <form
          novalidate
          aria-labelledby="partners-form-title"
          class="flex flex-col gap-(--spacing-lg)"
          @submit.prevent="submit"
        >
          <h2
            id="partners-form-title"
            class="m-0 text-heading-lg text-(--text-default)"
          >
            Become a Partner
          </h2>

          <fieldset
            :disabled="submitting"
            class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"
          >
            <div class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2">
              <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                <Label
                  for="partners-first-name"
                  required
                  >First name</Label
                >
                <FieldText
                  v-model="form.firstname"
                  input-id="partners-first-name"
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
                  for="partners-last-name"
                  required
                  >Last name</Label
                >
                <FieldText
                  v-model="form.lastname"
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
            </div>

            <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
              <Label
                for="partners-email"
                required
                >E-mail:</Label
              >
              <FieldText
                v-model="form.email"
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
            </div>

            <div class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2">
              <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                <Label
                  for="partners-company"
                  required
                  >Company name</Label
                >
                <FieldText
                  v-model="form.company"
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
              <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                <Label for="partners-phone">Phone number:</Label>
                <FieldPhoneNumber
                  v-model="form.phone"
                  v-model:country="phoneCountry"
                  input-id="partners-phone"
                  name="phone"
                  :disabled="submitting"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2">
              <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                <Label
                  for="partners-role"
                  required
                  >Role</Label
                >
                <FieldSelect
                  v-model="form.role"
                  input-id="partners-role"
                  placeholder="Please Select"
                  :options="PARTNER_ROLES"
                  size="large"
                  :disabled="submitting"
                  :required="!!errors.role"
                  :helper-text="errors.role"
                  @update:model-value="errors.role = ''"
                />
              </div>
              <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                <Label
                  for="partners-address"
                  required
                  >Street address</Label
                >
                <FieldText
                  v-model="form.address"
                  input-id="partners-address"
                  name="address"
                  size="large"
                  autocomplete="street-address"
                  :disabled="submitting"
                  :required="!!errors.address"
                  :helper-text="errors.address"
                  @update:model-value="errors.address = ''"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2">
              <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                <Label
                  for="partners-city"
                  required
                  >City</Label
                >
                <FieldText
                  v-model="form.city"
                  input-id="partners-city"
                  name="city"
                  size="large"
                  autocomplete="address-level2"
                  :disabled="submitting"
                  :required="!!errors.city"
                  :helper-text="errors.city"
                  @update:model-value="errors.city = ''"
                />
              </div>
              <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                <Label
                  for="partners-country"
                  required
                  >Country</Label
                >
                <FieldSelect
                  v-model="form.country_contato"
                  input-id="partners-country"
                  placeholder="Please Select"
                  :options="PARTNER_COUNTRIES"
                  size="large"
                  :disabled="submitting"
                  :required="!!errors.country_contato"
                  :helper-text="errors.country_contato"
                  @update:model-value="errors.country_contato = ''"
                />
              </div>
            </div>
          </fieldset>

          <p class="m-0 text-body-sm text-(--text-muted)">
            <a
              href="https://www.azion.com/en/documentation/agreements/privacy-policy/"
              target="_blank"
              rel="noopener"
              :class="LINK_CLASS"
              >Privacy Policy</a
            >
          </p>

          <div class="flex justify-end">
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
      </FrameBox>
    </template>
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

    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          kind="centered"
          title="Why you should be a partner of the Azion Marketplace?"
          description="With the Azion Marketplace, we enable you to expand your revenue channels by offering edge-enabled solutions integrated into the Azion Edge Computing Platform. Azion is rapidly expanding the number of use cases covered by the Marketplace, which already include fraud detection, authentication and authorization, bot mitigation, and facial recognition, utilizing technologies such as visual computing and artificial intelligence executed at the edge."
        />
      </template>

      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <ContentColumns
          :items="PARTNER_REASONS"
          :columns="3"
        />
      </FrameBox>
    </SectionModule>

    <FrameBox
      borders="none"
      marks="none"
      hatch
      class="h-(--spacing-xxl)"
    />
  </SectionContainer>
</template>
