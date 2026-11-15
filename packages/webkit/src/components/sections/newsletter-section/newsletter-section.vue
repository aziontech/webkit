<script setup lang="ts">
  import { computed, nextTick, ref, useAttrs, useId, watch } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Button from '../../actions/button/button.vue'
  import Eyebrow from '../../content/eyebrow/eyebrow.vue'
  import Alert from '../../feedback/alert/alert.vue'
  import Field from '../../inputs/field/field.vue'
  import FieldDescription from '../../inputs/field/field-description/field-description.vue'
  import Input from '../../inputs/input/input.vue'
  import RegistrationFrame from '../../layout/registration-frame/registration-frame.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import Texture from '../../marketing/texture/texture.vue'

  defineOptions({
    name: 'NewsletterSection',
    inheritAttrs: false
  })

  /** Copy of the subscribe form. */
  export type NewsletterSectionForm = {
    /** Placeholder of the email field. */
    placeholder: string
    /** Label of the submit button. */
    submitLabel: string
    /** Alert shown in place of the form once the site reports the address was sent. */
    successMessage: string
    /** Alert shown under the form when the site reports the address could not be sent. */
    errorMessage?: string
    /** Message shown under the field when it is submitted empty. */
    requiredMessage: string
    /** Message shown under the field when the address is malformed. */
    invalidMessage: string
  }

  export interface NewsletterSectionProps {
    /** Copy of the subscribe form: `{ placeholder, submitLabel, successMessage, errorMessage, requiredMessage, invalidMessage }`. */
    form: NewsletterSectionForm
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
    /** Eyebrow on the lead side, closed by the blinking cursor. */
    eyebrow?: string
    /** The ask, rendered as the label of the email field; it also names the band. */
    title?: string
    /** The pitch, rendered as the band's large `h2` on the lead side. */
    description?: string
    /** The site is sending the address: the field is disabled, the button shows its loading state and a submit is ignored. */
    loading?: boolean
    /** The site sent the address: the form gives way to `form.successMessage`. */
    submitted?: boolean
    /** The site could not send the address: `form.errorMessage` shows under the form. */
    failed?: boolean
    /** Draws the hatched closing frame under the band; turn it off when another closing band stacks directly below and draws the shared frame. */
    hatch?: boolean
  }

  const props = withDefaults(defineProps<NewsletterSectionProps>(), {
    anchor: '',
    eyebrow: '',
    title: '',
    description: '',
    loading: false,
    submitted: false,
    failed: false,
    hatch: true
  })

  const emit = defineEmits<{
    submit: [event: SubmitEvent, values: Record<string, string>]
  }>()

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const attrs = useAttrs()
  const { t } = useTranslate({ newsletterSection: en.newsletterSection })
  const inputId = useId()

  const email = ref('')
  const invalidMessage = ref('')

  const EYEBROW_PREFIX = '//' as const

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-newsletter-section'
  )

  const outcomeEl = ref<HTMLElement | null>(null)

  watch(
    () => props.submitted,
    (submitted) => {
      if (!submitted || !outcomeEl.value?.contains(document.activeElement)) return
      nextTick(() => document.getElementById(`${inputId}-success`)?.focus())
    }
  )

  const subscribe = (event: Event) => {
    if (props.loading) return
    const value = email.value.trim()
    if (!value || !EMAIL_PATTERN.test(value)) {
      invalidMessage.value = value ? props.form.invalidMessage : props.form.requiredMessage
      nextTick(() => document.getElementById(inputId)?.focus())
      return
    }
    invalidMessage.value = ''
    emit('submit', event as SubmitEvent, { email: value })
  }

  const clearError = () => {
    invalidMessage.value = ''
  }
</script>

<template>
  <section
    v-bind="$attrs"
    :id="anchor || undefined"
    :data-testid="testId"
    :data-loading="loading || null"
    :data-submitted="submitted || null"
    :data-failed="failed || null"
    :aria-label="title || undefined"
    class="scroll-mt-(--spacing-2xl)"
  >
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <RegistrationFrame
        flush
        borders="y"
        marks="all"
      >
        <div
          class="grid gap-(--spacing-2xl) bg-(--bg-surface) p-(--spacing-xl) lg:grid-cols-[minmax(0,1fr)_minmax(0,var(--container-md))] lg:items-start"
        >
          <div class="flex flex-col gap-(--spacing-lg)">
            <Eyebrow
              v-if="eyebrow"
              :prefix="EYEBROW_PREFIX"
              cursor
              >{{ eyebrow }}</Eyebrow
            >
            <h2
              v-if="description"
              class="m-0 max-w-(--container-lg) text-balance text-heading-lg text-(--text-default)"
            >
              {{ description }}
            </h2>
          </div>

          <div
            ref="outcomeEl"
            class="flex flex-col gap-(--spacing-md)"
          >
            <template v-if="submitted">
              <p
                v-if="title"
                class="m-0 text-pretty text-heading-sm text-(--text-default)"
              >
                {{ title }}
              </p>
              <Alert
                :id="`${inputId}-success`"
                tabindex="-1"
                class="outline-none"
                severity="success"
                :label="form.successMessage"
              />
            </template>
            <template v-else>
              <label
                v-if="title"
                :for="inputId"
                class="text-pretty text-heading-sm text-(--text-default)"
              >
                {{ title }}
              </label>
              <label
                v-else
                :for="inputId"
                class="sr-only"
              >
                {{ t('newsletterSection.email') }}
              </label>
              <form
                novalidate
                class="flex w-full flex-col gap-(--spacing-sm) sm:flex-row sm:items-start"
                @submit.prevent="subscribe"
              >
                <div class="min-w-0 flex-1">
                  <Field
                    :required="Boolean(invalidMessage) && !email.trim()"
                    :invalid="Boolean(invalidMessage) && Boolean(email.trim())"
                    :disabled="loading"
                  >
                    <Input
                      v-model="email"
                      name="email"
                      size="large"
                      type="email"
                      autocomplete="email"
                      :spellcheck="false"
                      :id="inputId"
                      :placeholder="form.placeholder"
                      @update:model-value="clearError"
                    />
                    <FieldDescription v-if="invalidMessage">
                      {{ invalidMessage }}
                    </FieldDescription>
                  </Field>
                </div>
                <div>
                  <Button
                    type="submit"
                    :label="form.submitLabel"
                    variant="secondary"
                    size="large"
                    :loading="loading"
                  />
                </div>
              </form>
              <Alert
                v-if="failed && form.errorMessage"
                severity="danger"
                :label="form.errorMessage"
              />
            </template>
          </div>
        </div>

        <div
          aria-hidden="true"
          class="relative isolate h-[calc(var(--spacing-2xl)*2.5)] overflow-clip border-t border-(--border-default) bg-(--bg-canvas) [--texture-pool-a:20%_110%] [--texture-pool-b:80%_110%] [--texture-wave-gain:3] [--texture-wave-pace:5]"
        >
          <Texture
            variant="pixelate"
            size="small"
          />
        </div>
      </RegistrationFrame>
    </SectionModule>
    <RegistrationFrame
      v-if="hatch"
      borders="none"
      marks="all"
      data-hatch="true"
      class="h-[calc(var(--spacing-2xl)*2)]"
    >
      <Texture variant="lines" />
    </RegistrationFrame>
  </section>
</template>
