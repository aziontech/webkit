<script setup lang="ts">
  import { computed, ref, useAttrs, useId } from 'vue'

  import Button from '../../actions/button/button.vue'
  import Message from '../../feedback/message/message.vue'
  import FieldText from '../../inputs/field-text/field-text.vue'
  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import TextureMaterial from '../../marketing/texture-material/texture-material.vue'
  import Overline from '../../overline/overline.vue'

  defineOptions({
    name: 'ClosingCallToActionNewsletter',
    inheritAttrs: false
  })

  /** Copy of the subscribe form. */
  export type ClosingCallToActionNewsletterForm = {
    /** Placeholder of the email field. */
    placeholder: string
    /** Label of the submit button. */
    submitLabel: string
    /** Message shown in place of the form once the site reports the address was sent. */
    successMessage: string
    /** Message shown under the form when the site reports the address could not be sent. */
    errorMessage?: string
    /** Message shown under the field when it is submitted empty. */
    requiredMessage: string
    /** Message shown under the field when the address is malformed. */
    invalidMessage: string
  }

  interface Props {
    /** Copy of the subscribe form: `{ placeholder, submitLabel, successMessage, errorMessage, requiredMessage, invalidMessage }`. */
    form: ClosingCallToActionNewsletterForm
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
    /** Overline on the lead side, closed by the blinking cursor. */
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
    error?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    anchor: '',
    eyebrow: '',
    title: '',
    description: '',
    loading: false,
    submitted: false,
    error: false
  })

  const emit = defineEmits<{
    submit: [event: SubmitEvent, values: Record<string, string>]
  }>()

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const attrs = useAttrs()
  const inputId = useId()

  const email = ref('')
  const invalidMessage = ref('')

  const testId = computed(
    () =>
      (attrs['data-testid'] as string | undefined) ?? 'sections-closing-call-to-action-newsletter'
  )

  const subscribe = (event: Event) => {
    if (props.loading) return
    const value = email.value.trim()
    if (!value) {
      invalidMessage.value = props.form.requiredMessage
      return
    }
    if (!EMAIL_PATTERN.test(value)) {
      invalidMessage.value = props.form.invalidMessage
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
    :data-error="error || null"
    :aria-label="title || undefined"
    class="scroll-mt-(--spacing-xxl)"
  >
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="all"
      >
        <div
          class="grid gap-(--spacing-xxl) bg-(--bg-surface) p-(--spacing-xl) lg:grid-cols-[minmax(0,1fr)_minmax(0,var(--container-md))] lg:items-start"
        >
          <div class="flex flex-col gap-(--spacing-lg)">
            <Overline
              v-if="eyebrow"
              prefix="//"
              show-cursor
              >{{ eyebrow }}</Overline
            >
            <h2
              v-if="description"
              class="m-0 max-w-(--container-lg) text-balance text-heading-lg text-(--text-default)"
            >
              {{ description }}
            </h2>
          </div>

          <div class="flex flex-col gap-(--spacing-md)">
            <template v-if="submitted">
              <p
                v-if="title"
                class="m-0 text-pretty text-heading-sm text-(--text-default)"
              >
                {{ title }}
              </p>
              <Message
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
              <form
                novalidate
                class="flex w-full flex-col gap-(--spacing-sm) sm:flex-row sm:items-start"
                @submit.prevent="subscribe"
              >
                <div class="min-w-0 flex-1">
                  <FieldText
                    v-model="email"
                    :input-id="inputId"
                    name="email"
                    size="large"
                    type="email"
                    autocomplete="email"
                    :placeholder="form.placeholder"
                    :invalid="Boolean(invalidMessage)"
                    :helper-text="invalidMessage"
                    :disabled="loading"
                    @update:model-value="clearError"
                  />
                </div>
                <div>
                  <Button
                    type="submit"
                    :label="form.submitLabel"
                    kind="secondary"
                    size="large"
                    :loading="loading"
                  />
                </div>
              </form>
              <Message
                v-if="error && form.errorMessage"
                severity="danger"
                :label="form.errorMessage"
              />
            </template>
          </div>
        </div>

        <div
          aria-hidden="true"
          class="relative isolate h-[calc(var(--spacing-xxl)*2.5)] overflow-clip border-t border-(--border-default) bg-(--bg-canvas) [--texture-pool-a:20%_110%] [--texture-pool-b:80%_110%] [--texture-wave-gain:3] [--texture-wave-pace:5]"
        >
          <TextureMaterial
            kind="pixelate"
            size="small"
          />
        </div>
      </FrameBox>
    </SectionModule>
    <FrameBox
      borders="none"
      marks="all"
      data-hatch="true"
      class="h-[calc(var(--spacing-xxl)*2)]"
    >
      <TextureMaterial kind="lines" />
    </FrameBox>
  </section>
</template>
