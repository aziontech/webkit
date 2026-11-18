<script setup lang="ts">
  import { computed, nextTick, ref, useAttrs, useId, watch } from 'vue'

  import Button from '../../action/button/button.vue'
  import Alert from '../../feedback/alert/alert.vue'
  import Field from '../../input/field/field.vue'
  import FieldDescription from '../../input/field/field-description/field-description.vue'
  import FieldLabel from '../../input/field/field-label/field-label.vue'
  import Input from '../../input/input/input.vue'
  import { defaultCountries } from '../../input/phone-input/countries'
  import PhoneInput from '../../input/phone-input/phone-input.vue'
  import Textarea from '../../input/textarea/textarea.vue'
  import type { ModuleHeaderAction } from '../../layout/module-header/module-header.vue'
  import FeatureItem from '../../marketing/feature-item/feature-item.vue'
  import Hero from '../../marketing/hero/hero.vue'
  import HeroTitle from '../../marketing/hero/hero-title/hero-title.vue'
  import HeroFormSectionSelect from './parts/hero-form-section-select.vue'

  defineOptions({
    name: 'HeroFormSection',
    inheritAttrs: false
  })

  export type { ModuleHeaderAction }

  /** Control a form field renders as. */
  export type HeroFormSectionFieldType = 'text' | 'email' | 'select' | 'phone' | 'textarea'

  /** One field of the form. */
  export type HeroFormSectionField = {
    /** Key of the value in the submitted values, and the HTML name of the control. */
    name: string
    /** Control the field renders as. */
    type: HeroFormSectionFieldType
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
    /** Keeps the label as the control's accessible name without drawing it, for a field the page labels by its placeholder. */
    visuallyHiddenLabel?: boolean
  }

  /** One highlight under the description. */
  export type HeroFormSectionItem = {
    /** Icon class drawn before the heading. */
    icon: string
    /** Short heading of the highlight. */
    title: string
    /** One sentence supporting the heading. */
    description: string
  }

  /** Copy of the form outcomes. */
  export type HeroFormSectionMessages = {
    /** Message under a required field submitted empty. */
    missing: string
    /** Message under an email field holding a malformed address. */
    invalidEmail: string
    /** Alert shown in place of the form once the site reports the values were sent. */
    success: string
    /** Alert shown under the form when the site reports the values could not be sent. */
    error: string
  }

  /** A link continuing the description inline. */
  export type HeroFormSectionLink = {
    /** Visible text of the link. */
    label: string
    /** Destination the link points to. */
    href: string
  }

  export interface HeroFormSectionProps {
    /** Copy of the form outcomes: `{ missing, invalidEmail, success, error }`. */
    messages: HeroFormSectionMessages
    /** Short overline above the headline. */
    eyebrow?: string
    /** Opening words of the headline, painted in the brand accent. */
    titleHighlight?: string
    /** Page headline, rendered as the page `h1`; the band renders nothing when empty. */
    title?: string
    /** Sentence under the headline. */
    description?: string
    /** A link continuing the description inline, such as a phone line; `{ label, href }`. Omitted when absent. */
    descriptionLink?: HeroFormSectionLink
    /** Copy after the inline link, closing the description's sentence. */
    descriptionAfter?: string
    /** First button under the copy; `{ label, href, trailing?, target? }`. Shown only with a label and a link. */
    primaryAction?: ModuleHeaderAction
    /** Second, outlined button beside the first; `{ label, href, trailing?, target? }`. Shown only with a label and a link. */
    secondaryAction?: ModuleHeaderAction
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
    /** The highlights under the description, in order; each is `{ icon, title, description }`. The list renders only when there are items. */
    items?: HeroFormSectionItem[]
    /** Accessible name of the field group, read as its legend. */
    formAriaLabel?: string
    /** The form fields in order; each is `{ name, type, label, placeholder?, required?, half?, options?, country?, visuallyHiddenLabel? }`; `visuallyHiddenLabel` keeps the label as the accessible name but does not draw it. */
    fields?: HeroFormSectionField[]
    /** Label of the submit button. */
    submitLabel?: string
    /** Eyebrow above the client marquee. */
    marqueeLabel?: string
    /** Registry names of the client marks, in order; the marquee renders only when there are marks. */
    marqueeMarks?: string[]
    /** The site is sending the values: the button shows its loading state and a submit is ignored. */
    loading?: boolean
    /** The site sent the values: the form gives way to `messages.success`. */
    submitted?: boolean
    /** The site could not send the values: `messages.error` shows under the form. */
    failed?: boolean
  }

  const props = withDefaults(defineProps<HeroFormSectionProps>(), {
    eyebrow: '',
    titleHighlight: '',
    title: '',
    description: '',
    descriptionLink: undefined,
    descriptionAfter: '',
    primaryAction: undefined,
    secondaryAction: undefined,
    anchor: '',
    items: () => [],
    formAriaLabel: '',
    fields: () => [],
    submitLabel: '',
    marqueeLabel: '',
    marqueeMarks: () => [],
    loading: false,
    submitted: false,
    failed: false
  })

  const emit = defineEmits<{
    submit: [event: SubmitEvent, values: Record<string, string>]
  }>()

  const EYEBROW_PREFIX = '//' as const

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const attrs = useAttrs()
  const baseId = useId()

  const values = ref<Record<string, string>>({})
  const countries = ref<Record<string, string>>({})
  const errors = ref<Record<string, string>>({})

  const usable = (action?: ModuleHeaderAction) => Boolean(action?.label && action.href)

  const primary = computed(() => usable(props.primaryAction))

  const actions = computed(() =>
    [props.primaryAction, props.secondaryAction].filter((action): action is ModuleHeaderAction =>
      usable(action)
    )
  )

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'hero-form-section')

  const fieldId = (field: HeroFormSectionField) => `${baseId}-${field.name}`

  const countryOf = (field: HeroFormSectionField) =>
    countries.value[field.name] ?? field.country ?? 'US'

  const setValue = (field: HeroFormSectionField, next: string) => {
    values.value = { ...values.value, [field.name]: next }
    if (errors.value[field.name]) errors.value = { ...errors.value, [field.name]: '' }
  }

  const setCountry = (field: HeroFormSectionField, next: string) => {
    countries.value = { ...countries.value, [field.name]: next }
  }

  const valueOf = (field: HeroFormSectionField) => {
    const raw = (values.value[field.name] ?? '').trim()
    if (field.type !== 'phone' || !raw) return raw
    const dialCode = defaultCountries.find((item) => item.code === countryOf(field))?.dialCode
    return dialCode ? `${dialCode}${raw}` : raw
  }

  const filled = (field: HeroFormSectionField) => Boolean((values.value[field.name] ?? '').trim())

  const emptyRequired = (field: HeroFormSectionField) =>
    Boolean(errors.value[field.name]) && !filled(field)

  const malformed = (field: HeroFormSectionField) =>
    Boolean(errors.value[field.name]) && filled(field)

  const messageOf = (field: HeroFormSectionField, value: string) => {
    if (field.required && !value) return props.messages.missing
    if (field.type === 'email' && value && !EMAIL_PATTERN.test(value))
      return props.messages.invalidEmail
    return ''
  }

  const outcomeEl = ref<HTMLElement | null>(null)

  watch(
    () => props.submitted,
    (submitted) => {
      if (!submitted || !outcomeEl.value?.contains(document.activeElement)) return
      nextTick(() => document.getElementById(`${baseId}-success`)?.focus())
    }
  )

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
    const first = props.fields.find((field) => found[field.name])
    if (first) {
      nextTick(() => document.getElementById(fieldId(first))?.focus())
      return
    }
    emit('submit', event as SubmitEvent, collected)
  }
</script>

<template>
  <div
    v-bind="$attrs"
    :id="anchor || undefined"
    :data-testid="testId"
    :data-loading="loading || null"
    :data-submitted="submitted || null"
    :data-failed="failed || null"
    class="scroll-mt-(--spacing-2xl)"
  >
    <Hero
      v-if="title"
      variant="screen"
      max-width="5xl"
      align="center"
      :padded="false"
      :aria-label="title"
      :marquee="marqueeMarks.length > 0"
      :marquee-label="marqueeLabel"
      :marquee-marks="marqueeMarks"
      bottom-height="clamp(7rem,16dvh,14rem)"
    >
      <div
        class="grid grid-cols-1 gap-(--spacing-2xl) py-(--spacing-lg) gap-y-(--spacing-xl) lg:grid-cols-2 lg:grid-rows-[auto_1fr]"
      >
        <HeroTitle
          :eyebrow="eyebrow"
          :eyebrow-prefix="EYEBROW_PREFIX"
          :title-highlight="titleHighlight"
          :title="title"
          max-width="lg"
          :sticky="items.length === 0"
          class="min-w-0 [&_h1]:max-w-(--container-md)"
          size="large"
        >
          <template v-if="description || descriptionLink || descriptionAfter">
            {{ description }}
            <a
              v-if="descriptionLink"
              :href="descriptionLink.href"
              class="underline underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-default) focus-visible:rounded-(--shape-flat) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color) motion-reduce:transition-none"
              >{{ descriptionLink.label }}</a
            >{{ descriptionAfter }}
          </template>
          <template
            v-if="actions.length > 0"
            #actions
          >
            <Button
              v-for="(action, index) in actions"
              :key="action.label"
              :label="action.label"
              :href="action.href"
              :target="action.target"
              :variant="index === 0 && primary ? 'secondary' : 'outline'"
              size="large"
              :icon="action.trailing ? 'az az-chevron-right' : ''"
              :icon-position="action.trailing ? 'trailing' : 'leading'"
              :animated="Boolean(action.trailing)"
            />
          </template>
        </HeroTitle>

        <ul
          v-if="items.length > 0"
          class="m-0 flex min-w-0 list-none flex-col gap-(--spacing-lg) self-start p-0 lg:col-start-1 lg:row-start-2"
        >
          <li
            v-for="item in items"
            :key="item.title"
          >
            <FeatureItem
              :heading-level="2"
              :icon="item.icon"
              :title="item.title"
              :description="item.description"
            />
          </li>
        </ul>

        <div
          ref="outcomeEl"
          class="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1"
        >
          <Alert
            v-if="submitted"
            :id="`${baseId}-success`"
            tabindex="-1"
            class="outline-none"
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
              :disabled="loading"
              class="m-0 grid min-w-0 grid-cols-1 gap-(--spacing-md) border-0 p-0 sm:grid-cols-2"
            >
              <legend
                v-if="formAriaLabel"
                class="sr-only"
              >
                {{ formAriaLabel }}
              </legend>

              <Field
                v-for="field in fields"
                :key="field.name"
                :required="field.required"
                :invalid="emptyRequired(field) || malformed(field)"
                :disabled="loading"
                :data-half="field.half || null"
                class="min-w-0 sm:col-span-2 sm:data-[half]:col-span-1"
              >
                <FieldLabel
                  :for="fieldId(field)"
                  :required="field.required"
                  :data-visually-hidden="field.visuallyHiddenLabel || null"
                  class="data-[visually-hidden]:sr-only"
                  >{{ field.label }}</FieldLabel
                >
                <HeroFormSectionSelect
                  v-if="field.type === 'select'"
                  :model-value="values[field.name] ?? ''"
                  :trigger-id="fieldId(field)"
                  :placeholder="field.placeholder"
                  :options="field.options"
                  @update:model-value="setValue(field, $event)"
                />
                <PhoneInput
                  v-else-if="field.type === 'phone'"
                  :id="fieldId(field)"
                  size="large"
                  :model-value="values[field.name] ?? ''"
                  :country="countryOf(field)"
                  :name="field.name"
                  :placeholder="field.placeholder"
                  @update:model-value="setValue(field, $event)"
                  @update:country="setCountry(field, $event)"
                />
                <Textarea
                  v-else-if="field.type === 'textarea'"
                  :id="fieldId(field)"
                  :model-value="values[field.name] ?? ''"
                  :name="field.name"
                  :placeholder="field.placeholder"
                  @update:model-value="setValue(field, $event)"
                />
                <Input
                  v-else
                  :id="fieldId(field)"
                  :model-value="values[field.name] ?? ''"
                  :name="field.name"
                  :placeholder="field.placeholder"
                  :type="field.type === 'email' ? 'email' : 'text'"
                  :autocomplete="field.type === 'email' ? 'email' : undefined"
                  :spellcheck="field.type === 'email' ? false : undefined"
                  size="large"
                  @update:model-value="setValue(field, $event)"
                />
                <FieldDescription v-if="errors[field.name]">
                  {{ errors[field.name] }}
                </FieldDescription>
              </Field>
            </fieldset>

            <div class="flex flex-col">
              <Button
                type="submit"
                :label="submitLabel"
                variant="primary"
                size="large"
                :loading="loading"
              />
            </div>

            <Alert
              v-if="failed"
              severity="danger"
              :label="messages.error"
            />
          </form>
        </div>
      </div>
    </Hero>
  </div>
</template>
