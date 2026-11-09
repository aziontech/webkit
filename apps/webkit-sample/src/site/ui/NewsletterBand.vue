<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import FieldText from '@aziontech/webkit/field-text'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Overline from '@aziontech/webkit/overline'
  import TextureMaterial from '@aziontech/webkit/texture-material'
  import { toast } from '@aziontech/webkit/toast'
  import { ref, useId } from 'vue'

  defineOptions({ name: 'NewsletterBand', inheritAttrs: false })

  export interface NewsletterBandForm {
    /** Label of the email field. */
    label: string
    /** Placeholder of the email field. */
    placeholder: string
    /** Label of the submit action. */
    submit: string
    /** Toast once the address is in. */
    success: string
    /** Message when the field is left empty. */
    required: string
    /** Message when the address is malformed. */
    invalid: string
  }

  interface Props {
    /** Overline above the title. */
    eyebrow?: string
    /** The ask, set over the form as the field label. */
    title?: string
    /** The headline, set large on the lead side. */
    description?: string
    /** Copy of the subscribe form. */
    form: NewsletterBandForm
  }

  const props = withDefaults(defineProps<Props>(), {
    eyebrow: '',
    title: '',
    description: ''
  })

  const inputId = useId()

  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const email = ref('')
  const error = ref('')
  const sending = ref(false)

  async function subscribe() {
    if (sending.value) return
    const value = email.value.trim()
    if (!value) return (error.value = props.form.required)
    if (!EMAIL.test(value)) return (error.value = props.form.invalid)
    error.value = ''
    sending.value = true
    await new Promise((resolve) => globalThis.setTimeout(resolve, 600))
    sending.value = false
    email.value = ''
    toast.success(props.form.success)
  }
</script>

<template>
  <section
    v-bind="$attrs"
    :aria-label="title"
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
          <h2 class="m-0 max-w-(--container-lg) text-balance text-heading-lg text-(--text-default)">
            {{ description }}
          </h2>
        </div>

        <div class="flex flex-col gap-(--spacing-md)">
          <label
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
                size="large"
                type="email"
                autocomplete="email"
                :placeholder="form.placeholder"
                :invalid="Boolean(error)"
                :helper-text="error"
                :disabled="sending"
                @update:model-value="error = ''"
              />
            </div>
            <div>
              <Button
                :label="form.submit"
                kind="secondary"
                size="large"
                :loading="sending"
                @click="subscribe"
              />
            </div>
          </form>
        </div>
      </div>

      <!-- The wave strip: the pixelated primary wave lit from both lower corners. -->
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
  </section>
</template>
