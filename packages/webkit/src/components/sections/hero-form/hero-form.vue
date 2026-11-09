<script setup lang="ts">
  import { computed, ref, useAttrs, useId } from 'vue'

  import Button from '../../actions/button/button.vue'
  import Message from '../../feedback/message/message.vue'
  import { defaultCountries } from '../../inputs/field-phone-number/countries'
  import FieldPhoneNumber from '../../inputs/field-phone-number/field-phone-number.vue'
  import FieldSelect, { type FieldSelectValue } from '../../inputs/field-select/field-select.vue'
  import FieldText from '../../inputs/field-text/field-text.vue'
  import FieldTextarea from '../../inputs/field-textarea/field-textarea.vue'
  import Label from '../../inputs/label/label.vue'
  import Hero from '../../marketing/hero/hero.vue'
  import HeroTitle from '../../marketing/hero/hero-title/hero-title.vue'
  import Topic from '../../marketing/topic/topic.vue'

  defineOptions({
    name: 'HeroForm',
    inheritAttrs: false
  })

  /** Control a form field renders as. */
  export type HeroFormFieldKind = 'text' | 'email' | 'select' | 'phone' | 'textarea'

  /** One field of the form. */
  export type HeroFormField = {
    /** Key of the value in the submitted values, and the HTML name of the control. */
    name: string
    /** Control the field renders as. */
    kind: HeroFormFieldKind
    /** Visible label of the field. */
    label: string
    /** Placeholder of the control. */
    placeholder?: string
    /** The field must be filled before the form is submitted. */
    required?: boolean
    /** The field takes half the row from the small breakpoint up, beside the next half field. */
    half?: boolean
    /** Choices of a select field, in order. */
    options?: string[]
    /** Starting country code of a phone field. */
    country?: string
  }

  /** One highlight under the description. */
  export type HeroFormItem = {
    /** Icon class drawn before the heading. */
    icon: string
    /** Short heading of the highlight. */
    title: string
    /** One sentence supporting the heading. */
    description: string
  }

  /** Copy of the form outcomes. */
  export type HeroFormMessages = {
    /** Message under a required field submitted empty. */
    missing: string
    /** Message under an email field holding a malformed address. */
    invalidEmail: string
    /** Message shown in place of the form once the site reports the values were sent. */
    success: string
    /** Message shown under the form when the site reports the values could not be sent. */
    error: string
  }

  interface Props {
    /** Copy of the form outcomes: `{ missing, invalidEmail, success, error }`. */
    messages: HeroFormMessages
    /** Short overline above the headline. */
    eyebrow?: string
    /** Opening words of the headline, painted in the brand accent. */
    highlight?: string
    /** Page headline, rendered as the page `h1`; the band renders nothing when empty. */
    title?: string
    /** Sentence under the headline. */
    description?: string
    /** The highlights under the description, in order; each is `{ icon, title, description }`. The list renders only when there are items. */
    items?: HeroFormItem[]
    /** Accessible name of the field group, read as its legend. */
    formAriaLabel?: string
    /** The form fields in order; each is `{ name, kind, label, placeholder?, required?, half?, options?, country? }`. */
    fields?: HeroFormField[]
    /** Label of the submit button. */
    submitLabel?: string
    /** Overline above the client strip. */
    carouselLabel?: string
    /** Registry names of the client marks, in order; the strip renders only when there are marks. */
    carouselMarks?: string[]
    /** The site is sending the values: the button shows its loading state and a submit is ignored. */
    loading?: boolean
    /** The site sent the values: the form gives way to `messages.success`. */
    submitted?: boolean
    /** The site could not send the values: `messages.error` shows under the form. */
    error?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    eyebrow: '',
    highlight: '',
    title: '',
    description: '',
    items: () => [],
    formAriaLabel: '',
    fields: () => [],
    submitLabel: '',
    carouselLabel: '',
    carouselMarks: () => [],
    loading: false,
    submitted: false,
    error: false
  })

  const emit = defineEmits<{
    submit: [event: SubmitEvent, values: Record<string, string>]
  }>()

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const attrs = useAttrs()
  const baseId = useId()

  const values = ref<Record<string, string>>({})
  const countries = ref<Record<string, string>>({})
  const errors = ref<Record<string, string>>({})

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-hero-form'
  )

  const fieldId = (field: HeroFormField) => `${baseId}-${field.name}`

  const optionsOf = (field: HeroFormField) =>
    (field.options ?? []).map((label) => ({ value: label, label }))

  const countryOf = (field: HeroFormField) => countries.value[field.name] ?? field.country ?? 'US'

  const setValue = (field: HeroFormField, next: FieldSelectValue) => {
    values.value = { ...values.value, [field.name]: next === undefined ? '' : String(next) }
    if (errors.value[field.name]) errors.value = { ...errors.value, [field.name]: '' }
  }

  const setCountry = (field: HeroFormField, next: string) => {
    countries.value = { ...countries.value, [field.name]: next }
  }

  const valueOf = (field: HeroFormField) => {
    const raw = (values.value[field.name] ?? '').trim()
    if (field.kind !== 'phone' || !raw) return raw
    const dialCode = defaultCountries.find((item) => item.code === countryOf(field))?.dialCode
    return dialCode ? `${dialCode}${raw}` : raw
  }

  const filled = (field: HeroFormField) => Boolean((values.value[field.name] ?? '').trim())

  const emptyRequired = (field: HeroFormField) =>
    Boolean(errors.value[field.name]) && !filled(field)

  const malformed = (field: HeroFormField) => Boolean(errors.value[field.name]) && filled(field)

  const messageOf = (field: HeroFormField, value: string) => {
    if (field.required && !value) return props.messages.missing
    if (field.kind === 'email' && value && !EMAIL_PATTERN.test(value))
      return props.messages.invalidEmail
    return ''
  }

  const send = (event: Event) => {
    if (props.loading) return
    const collected: Record<string, string> = {}
    const found: Record<string, string> = {}
    for (const field of props.fields) {
      const value = valueOf(field)
      collected[field.name] = value
      const message = messageOf(field, value)
      if (message) found[field.name] = message
    }
    errors.value = found
    if (Object.keys(found).length > 0) return
    emit('submit', event as SubmitEvent, collected)
  }
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-loading="loading || null"
    :data-submitted="submitted || null"
    :data-error="error || null"
  >
    <Hero
      v-if="title"
      kind="screen"
      max-width="5xl"
      align="center"
      :padded="false"
      :aria-label="title"
      :carousel="carouselMarks.length > 0"
      :carousel-label="carouselLabel"
      :carousel-marks="carouselMarks"
      bottom-height="clamp(7rem,16dvh,14rem)"
    >
      <div
        class="grid grid-cols-1 gap-(--spacing-xxl) py-(--spacing-lg) gap-y-(--spacing-xl) lg:grid-cols-2 lg:grid-rows-[auto_1fr]"
      >
        <HeroTitle
          :eyebrow="eyebrow"
          eyebrow-prefix="//"
          :highlight="highlight"
          :title="title"
          :description="description"
          max-width="lg"
          class="min-w-0"
        />

        <ul
          v-if="items.length > 0"
          class="m-0 flex min-w-0 list-none flex-col gap-(--spacing-lg) self-start p-0 lg:col-start-1 lg:row-start-2"
        >
          <li
            v-for="item in items"
            :key="item.title"
          >
            <Topic
              :heading-level="2"
              :icon="item.icon"
              :title="item.title"
              :description="item.description"
            />
          </li>
        </ul>

        <div class="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <Message
            v-if="submitted"
            severity="success"
            :label="messages.success"
          />
          <form
            v-else
            novalidate
            class="flex flex-col gap-(--spacing-md)"
            @submit.prevent="send"
          >
            <fieldset
              class="m-0 grid min-w-0 grid-cols-1 gap-(--spacing-md) border-0 p-0 sm:grid-cols-2"
            >
              <legend
                v-if="formAriaLabel"
                class="sr-only"
              >
                {{ formAriaLabel }}
              </legend>

              <div
                v-for="field in fields"
                :key="field.name"
                :data-half="field.half || null"
                class="flex min-w-0 flex-col gap-(--spacing-xs) sm:col-span-2 sm:data-[half]:col-span-1"
              >
                <Label
                  :for="fieldId(field)"
                  :label="field.label"
                  :required="field.required"
                />
                <FieldSelect
                  v-if="field.kind === 'select'"
                  :model-value="values[field.name] || undefined"
                  :input-id="fieldId(field)"
                  :placeholder="field.placeholder"
                  :options="optionsOf(field)"
                  :required="emptyRequired(field)"
                  :invalid="malformed(field)"
                  :helper-text="errors[field.name]"
                  size="large"
                  searchable
                  @update:model-value="setValue(field, $event)"
                />
                <FieldPhoneNumber
                  v-else-if="field.kind === 'phone'"
                  size="large"
                  :model-value="values[field.name] ?? ''"
                  :country="countryOf(field)"
                  :input-id="fieldId(field)"
                  :name="field.name"
                  :placeholder="field.placeholder"
                  :required="emptyRequired(field)"
                  :invalid="malformed(field)"
                  :helper-text="errors[field.name]"
                  @update:model-value="setValue(field, $event)"
                  @update:country="setCountry(field, $event)"
                />
                <FieldTextarea
                  v-else-if="field.kind === 'textarea'"
                  :model-value="values[field.name] ?? ''"
                  :input-id="fieldId(field)"
                  :name="field.name"
                  :placeholder="field.placeholder"
                  :required="emptyRequired(field)"
                  :invalid="malformed(field)"
                  :helper-text="errors[field.name]"
                  @update:model-value="setValue(field, $event)"
                />
                <FieldText
                  v-else
                  :model-value="values[field.name] ?? ''"
                  :input-id="fieldId(field)"
                  :name="field.name"
                  :placeholder="field.placeholder"
                  :required="emptyRequired(field)"
                  :invalid="malformed(field)"
                  :helper-text="errors[field.name]"
                  size="large"
                  @update:model-value="setValue(field, $event)"
                />
              </div>
            </fieldset>

            <div class="flex flex-col">
              <Button
                type="submit"
                :label="submitLabel"
                kind="primary"
                size="large"
                :loading="loading"
              />
            </div>

            <Message
              v-if="error"
              severity="danger"
              :label="messages.error"
            />
          </form>
        </div>
      </div>
    </Hero>
  </div>
</template>
