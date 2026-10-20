<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import CallToAction from '@aziontech/webkit/call-to-action'
  import FieldText from '@aziontech/webkit/field-text'
  import FrameBox from '@aziontech/webkit/frame-box'
  import SectionModule from '@aziontech/webkit/section-module'
  import TextureMaterial from '@aziontech/webkit/texture-material'
  import { toast } from '@aziontech/webkit/toast'
  import { ref } from 'vue'

  import SectionAction from './SectionAction.vue'
  import type { SiteAction } from './types'

  defineOptions({ name: 'ClosingCallToAction' })

  /** split: the lead and aside actions side by side; panel: one centred ask; newsletter: the split band with a subscribe form; frame: the closing frame alone. */
  export type ClosingCallToActionKind = 'split' | 'panel' | 'newsletter' | 'frame'

  export interface ClosingCallToActionForm {
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
    /** Layout of the closing band. */
    kind?: ClosingCallToActionKind
    /** Overline above the title. */
    eyebrow?: string
    /** The closing ask. */
    title?: string
    /** Second line of the title, in the muted ink. */
    titleMuted?: string
    /** One sentence under the title. */
    description?: string
    /** Actions in the lead cell. */
    actions?: SiteAction[]
    /** Action in the aside cell of the split layout. */
    aside?: SiteAction | null
    /** Copy of the subscribe form, for the newsletter layout. */
    form?: ClosingCallToActionForm | null
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'split',
    eyebrow: '',
    title: '',
    titleMuted: '',
    description: '',
    actions: () => [],
    aside: null,
    form: null
  })

  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const email = ref('')
  const error = ref('')
  const sending = ref(false)

  async function subscribe() {
    if (sending.value || !props.form) return
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
  <SectionModule
    v-if="kind !== 'frame'"
    id="contact"
    :divided="false"
    :padded="false"
    class="scroll-mt-(--spacing-xxl)"
  >
    <CallToAction
      framed
      :kind="kind === 'panel' ? 'panel' : 'split'"
      :eyebrow="eyebrow"
      :title="title"
      :title-muted="titleMuted"
      :description="description"
    >
      <template #actions>
        <div v-if="kind === 'newsletter' && form">
          <form
            novalidate
            class="flex w-full flex-col gap-(--spacing-sm) sm:w-(--container-md) sm:max-w-full sm:flex-row sm:items-start"
            @submit.prevent="subscribe"
          >
            <FieldText
              v-model="email"
              :label="form.label"
              size="large"
              type="email"
              autocomplete="email"
              :placeholder="form.placeholder"
              :invalid="Boolean(error)"
              :helper-text="error"
              :disabled="sending"
              class="min-w-0 flex-1"
              @update:model-value="error = ''"
            />
            <Button
              :label="form.submit"
              kind="secondary"
              size="large"
              :loading="sending"
              class="sm:mt-(--spacing-lg)"
              @click="subscribe"
            />
          </form>
        </div>
        <template v-else>
          <SectionAction
            v-for="action in actions"
            :key="action.label"
            :action="action"
          />
        </template>
      </template>
      <template
        v-if="kind === 'split' && aside"
        #aside
      >
        <SectionAction :action="{ kind: 'outlined', trailing: true, ...aside }" />
      </template>
    </CallToAction>
  </SectionModule>
  <FrameBox
    borders="none"
    marks="all"
    data-hatch="true"
    :data-size="kind === 'panel' ? 'small' : 'large'"
    class="h-[calc(var(--spacing-xxl)*2)] data-[size=small]:h-(--spacing-xxl)"
  >
    <TextureMaterial kind="lines" />
  </FrameBox>
</template>
