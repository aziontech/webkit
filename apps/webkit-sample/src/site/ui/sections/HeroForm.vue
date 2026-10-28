<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import FieldPhoneNumber from '@aziontech/webkit/field-phone-number'
  import FieldSelect from '@aziontech/webkit/field-select'
  import FieldText from '@aziontech/webkit/field-text'
  import FieldTextarea from '@aziontech/webkit/field-textarea'
  import Hero from '@aziontech/webkit/hero-root'
  import HeroTitle from '@aziontech/webkit/hero-title'
  import { toast } from '@aziontech/webkit/toast'
  import { CLIENT_STRIP } from '@shared/ui/brand/strips.js'
  import { computed, reactive, ref, useId } from 'vue'

  import { CONTACT_ROLES } from '../../data/contact.js'
  import SectionAction from './SectionAction.vue'
  import type { SiteAction, SiteLink } from './types'

  defineOptions({ name: 'HeroForm' })

  /** An optional field of the form; name, e-mail and company always render. */
  export type HeroFormField = 'role' | 'website' | 'phone' | 'message'

  /** A field the form renders but does not require. */
  export type HeroFormOptionalField = 'company' | 'role' | 'message'

  /** A paragraph beside the form, plain or opening on a bold lead. */
  export type HeroFormParagraph = string | { lead: string; text: string }

  export interface HeroFormOption {
    /** Submitted value. */
    value: string
    /** Visible label. */
    label: string
  }

  export interface HeroFormLabels {
    /** First name field label. */
    firstName: string
    /** Last name field label. */
    lastName: string
    /** E-mail field label. */
    email: string
    /** Role field label. */
    role: string
    /** Role select placeholder. */
    rolePlaceholder: string
    /** Company field label. */
    company: string
    /** Website field label. */
    website: string
    /** Website field placeholder. */
    websitePlaceholder: string
    /** Phone field label. */
    phone: string
    /** Message field label. */
    message: string
    /** Submit button label. */
    submit: string
  }

  export interface HeroFormMessages {
    /** Helper text on an empty required field. */
    required: string
    /** Helper text on a malformed e-mail. */
    invalidEmail: string
    /** Toast title once the form is sent. */
    success: string
    /** Toast title when sending fails. */
    error: string
    /** Toast description when the failure carries no message. */
    errorDescription: string
    /** Label of the toast's retry action. */
    retry: string
  }

  interface Props {
    /** In-page anchor for the band. */
    anchor?: string
    /** Overline above the headline. */
    eyebrow?: string
    /** The page's h1. */
    title: string
    /** Copy beside the form, or the part of it before the link. */
    description?: string
    /** A link continuing the copy, such as the phone line. */
    link?: SiteLink | null
    /** Copy after the link. */
    descriptionAfter?: string
    /** Paragraphs after the description, each on its own line. */
    paragraphs?: HeroFormParagraph[]
    /** Actions under the copy. */
    actions?: SiteAction[]
    /** Optional fields the form renders, in addition to name, e-mail and company. */
    fields?: HeroFormField[]
    /** Rendered fields submitted without a value; the rest are required. */
    optional?: HeroFormOptionalField[]
    /** Client marks the floor strip runs; without marks the band has no strip. */
    carouselMarks?: string[]
    /** Overline above the client strip. */
    carouselLabel?: string
    /** Accessible name of the form; falls back to the title. */
    formLabel?: string
    /** Visible heading over the form; empty leaves the form unheaded. */
    formTitle?: string
    /** Renders only the name and e-mail fields, for gated content. */
    contactOnly?: boolean
    /** Options of the role select. */
    roles?: HeroFormOption[]
    /** Country the phone field opens on. */
    country?: string
    /** Field and submit labels, merged over the defaults. */
    labels?: Partial<HeroFormLabels> | null
    /** Validation and toast copy, merged over the defaults. */
    messages?: Partial<HeroFormMessages> | null
  }

  const props = withDefaults(defineProps<Props>(), {
    anchor: '',
    eyebrow: '',
    description: '',
    link: null,
    descriptionAfter: '',
    paragraphs: () => [],
    actions: () => [],
    fields: () => ['role', 'phone', 'message'],
    optional: () => [],
    carouselMarks: () => CLIENT_STRIP,
    carouselLabel: 'The teams our experts work with',
    formLabel: '',
    formTitle: '',
    contactOnly: false,
    roles: () => CONTACT_ROLES,
    country: 'US',
    labels: null,
    messages: null
  })

  const DEFAULT_LABELS: HeroFormLabels = {
    firstName: 'First name',
    lastName: 'Last name',
    email: 'E-mail',
    role: 'Role',
    rolePlaceholder: 'Select your role',
    company: 'Company',
    website: 'Website',
    websitePlaceholder: 'https://',
    phone: 'Phone',
    message: 'Message',
    submit: 'Send'
  }

  const DEFAULT_MESSAGES: HeroFormMessages = {
    required: 'This field is required.',
    invalidEmail: 'Enter a valid e-mail address.',
    success: 'Message sent.',
    error: 'Could not send the message.',
    errorDescription: 'Check your connection and try again.',
    retry: 'Retry'
  }

  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const uid = useId()

  const form = reactive({
    firstname: '',
    lastname: '',
    email: '',
    role: '',
    company: '',
    website: '',
    mobilephone: '',
    message: ''
  })

  const phoneCountry = ref(props.country)

  const errors = reactive({
    firstname: '',
    lastname: '',
    email: '',
    role: '',
    company: '',
    message: ''
  })

  const submitting = ref(false)

  const copy = computed(() => ({ ...DEFAULT_LABELS, ...(props.labels ?? {}) }))
  const notice = computed(() => ({ ...DEFAULT_MESSAGES, ...(props.messages ?? {}) }))
  const legend = computed(() => props.formLabel || props.title)
  const hasCarousel = computed(() => props.carouselMarks.length > 0)
  const shows = (field: HeroFormField) => !props.contactOnly && props.fields.includes(field)
  const requires = (field: HeroFormOptionalField) => !props.optional.includes(field)

  const validate = () => {
    const required = notice.value.required
    errors.firstname = form.firstname.trim() ? '' : required
    errors.lastname = form.lastname.trim() ? '' : required
    errors.email = !form.email.trim()
      ? required
      : EMAIL.test(form.email.trim())
        ? ''
        : notice.value.invalidEmail
    errors.role = form.role || !shows('role') || !requires('role') ? '' : required
    errors.company =
      form.company.trim() || props.contactOnly || !requires('company') ? '' : required
    errors.message =
      form.message.trim() || !shows('message') || !requires('message') ? '' : required
    return Object.values(errors).every((message) => !message)
  }

  const submit = async () => {
    if (submitting.value) return
    if (!validate()) return

    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 900))
      toast.success(notice.value.success)
      Object.assign(form, {
        firstname: '',
        lastname: '',
        email: '',
        role: '',
        company: '',
        website: '',
        mobilephone: '',
        message: ''
      })
    } catch (error) {
      toast.error(notice.value.error, {
        description: error instanceof Error ? error.message : notice.value.errorDescription,
        action: { label: notice.value.retry, onClick: () => submit() }
      })
    } finally {
      submitting.value = false
    }
  }
</script>

<template>
  <Hero
    :id="anchor || undefined"
    kind="screen"
    max-width="5xl"
    align="center"
    :padded="false"
    :carousel="hasCarousel"
    :carousel-label="carouselLabel"
    :carousel-marks="carouselMarks"
    bottom-height="clamp(7rem,16dvh,14rem)"
  >
    <div class="grid grid-cols-1 gap-(--spacing-xxl) py-(--spacing-lg) lg:grid-cols-2">
      <div class="min-w-0">
        <HeroTitle
          :eyebrow="eyebrow"
          :title="title"
          max-width="lg"
          sticky
        >
          {{ description }}
          <a
            v-if="link"
            :href="link.href"
            class="underline underline-offset-2 transition-colors hover:text-(--text-default) focus-visible:rounded-(--shape-flat) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color) motion-reduce:transition-none"
            >{{ link.label }}</a
          >{{ descriptionAfter }}
          <span
            v-for="(paragraph, index) in paragraphs"
            :key="index"
            class="mt-(--spacing-sm) block first:mt-0"
          >
            <template v-if="typeof paragraph === 'string'">{{ paragraph }}</template>
            <template v-else
              ><strong class="font-medium text-(--text-default)">{{ paragraph.lead }}</strong>
              {{ paragraph.text }}</template
            >
          </span>

          <template
            v-if="actions.length"
            #actions
          >
            <SectionAction
              v-for="action in actions"
              :key="action.label"
              :action="action"
            />
          </template>
        </HeroTitle>
      </div>

      <div class="min-w-0">
        <h2
          v-if="formTitle"
          class="m-0 mb-(--spacing-lg) text-balance text-heading-lg text-(--text-default)"
        >
          {{ formTitle }}
        </h2>
        <form
          novalidate
          class="flex flex-col gap-(--spacing-md)"
          @submit.prevent="submit"
        >
          <fieldset
            :disabled="submitting"
            class="m-0 flex min-w-0 flex-col gap-(--spacing-md) border-0 p-0"
          >
            <legend class="sr-only">{{ legend }}</legend>

            <div class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2">
              <FieldText
                v-model="form.firstname"
                :label="copy.firstName"
                :input-id="`${uid}-first-name`"
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
                :label="copy.lastName"
                :input-id="`${uid}-last-name`"
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
              :label="copy.email"
              :input-id="`${uid}-email`"
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

            <div
              v-if="!contactOnly"
              :data-paired="shows('role') || shows('website') || null"
              class="grid grid-cols-1 gap-(--spacing-md) sm:data-[paired]:grid-cols-2"
            >
              <FieldSelect
                v-if="shows('role')"
                v-model="form.role"
                :label="copy.role"
                :input-id="`${uid}-role`"
                :placeholder="copy.rolePlaceholder"
                size="large"
                :options="roles"
                :disabled="submitting"
                :required="!!errors.role"
                :helper-text="errors.role"
                @update:model-value="errors.role = ''"
              />
              <FieldText
                v-model="form.company"
                :label="copy.company"
                :input-id="`${uid}-company`"
                name="company"
                size="large"
                autocomplete="organization"
                :disabled="submitting"
                :required="!!errors.company"
                :helper-text="errors.company"
                @update:model-value="errors.company = ''"
              />
              <FieldText
                v-if="shows('website')"
                v-model="form.website"
                :label="copy.website"
                :placeholder="copy.websitePlaceholder"
                :input-id="`${uid}-website`"
                name="website"
                type="url"
                size="large"
                autocomplete="url"
                :disabled="submitting"
              />
            </div>

            <FieldPhoneNumber
              v-if="shows('phone')"
              v-model="form.mobilephone"
              v-model:country="phoneCountry"
              :label="copy.phone"
              :input-id="`${uid}-phone`"
              name="mobilephone"
              :disabled="submitting"
            />

            <FieldTextarea
              v-if="shows('message')"
              v-model="form.message"
              :label="copy.message"
              :input-id="`${uid}-message`"
              name="message"
              :disabled="submitting"
              :required="!!errors.message"
              :helper-text="errors.message"
              @update:model-value="errors.message = ''"
            />
          </fieldset>

          <div class="flex justify-start">
            <Button
              :label="copy.submit"
              kind="secondary"
              size="large"
              :loading="submitting"
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  </Hero>
</template>
