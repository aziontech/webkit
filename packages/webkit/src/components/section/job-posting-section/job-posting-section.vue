<script setup lang="ts">
  import { computed, nextTick, proxyRefs, ref, useAttrs, useId, watch } from 'vue'

  import Button from '../../action/button/button.vue'
  import Alert from '../../feedback/alert/alert.vue'
  import Field from '../../input/field/field.vue'
  import FieldDescription from '../../input/field/field-description/field-description.vue'
  import FieldLabel from '../../input/field/field-label/field-label.vue'
  import FileDropzone from '../../input/file-dropzone/file-dropzone.vue'
  import FileTokenGroup from '../../input/file-token-group/file-token-group.vue'
  import Input from '../../input/input/input.vue'
  import PhoneInput from '../../input/phone-input/phone-input.vue'
  import Module from '../../layout/module/module.vue'
  import type { ModuleHeaderAction } from '../../layout/module-header/module-header.vue'
  import ModuleHeader from '../../layout/module-header/module-header.vue'
  import RegistrationFrame from '../../layout/registration-frame/registration-frame.vue'
  import Dialog from '../../overlay/dialog/dialog.vue'
  import DialogContent from '../../overlay/dialog/dialog-content.vue'
  import DialogDescription from '../../overlay/dialog/dialog-description.vue'
  import DialogTitle from '../../overlay/dialog/dialog-title.vue'
  import PanelBody from '../../overlay/panel/panel-body.vue'
  import PanelFooter from '../../overlay/panel/panel-footer.vue'
  import PanelHeader from '../../overlay/panel/panel-header.vue'
  import { useJobPostingForm } from './composables/use-job-posting-form'
  import JobPostingSectionRail from './parts/job-posting-section-rail.vue'

  defineOptions({
    name: 'JobPostingSection',
    inheritAttrs: false
  })

  export type { ModuleHeaderAction }

  /** One fact about the posting, listed in the rail. */
  export type JobPostingSectionFacet = {
    /** The fact, such as a department, a location or a contract. */
    label: string
    /** Icon class of the glyph leading the fact. */
    icon?: string
  }

  /** A paragraph of a description section. */
  export type JobPostingSectionTextBlock = {
    /** Marks the block as a paragraph. */
    type: 'text'
    /** The paragraph. */
    text: string
  }

  /** A bullet list of a description section. */
  export type JobPostingSectionListBlock = {
    /** Marks the block as a bullet list. */
    type: 'list'
    /** The bullets, in order. */
    items: string[]
  }

  /** One block of a description section: a paragraph or a bullet list. */
  export type JobPostingSectionBlock = JobPostingSectionTextBlock | JobPostingSectionListBlock

  /** One section of the description, rendered as a row. */
  export type JobPostingSectionSection = {
    /** Heading of the section. */
    title: string
    /** The paragraphs and lists of the section, in order. */
    blocks: JobPostingSectionBlock[]
  }

  /** Control a form field renders as. */
  export type JobPostingSectionFieldType = 'text' | 'email' | 'phone' | 'url' | 'file'

  /** One field of the application form. */
  export type JobPostingSectionField = {
    /** Key of the value in the submitted values, and the HTML name of the control. */
    name: string
    /** Control the field renders as. */
    type: JobPostingSectionFieldType
    /** Visible label of the field. */
    label: string
    /** The field must be filled before the form is submitted. */
    required?: boolean
    /** Guidance under the field, such as the accepted formats of a file. */
    helper?: string
    /** Placeholder of a text, email, phone or URL control. */
    placeholder?: string
    /** Accepted types of a file field, in the native accept syntax. */
    accept?: string
    /** Autocomplete hint of a text control. */
    autocomplete?: string
    /** Starting country code of a phone field. */
    country?: string
  }

  /** The application form. */
  export type JobPostingSectionForm = {
    /** Headline over the form. */
    title: string
    /** One sentence under the headline. */
    description?: string
    /** Label of the submit button. */
    submitLabel: string
    /** In-page id of the apply section, the target of the apply links. */
    anchor?: string
    /** Accessible name of the field group, read as its legend; empty uses the title. */
    ariaLabel?: string
    /** The fields, in order. */
    fields: JobPostingSectionField[]
  }

  /** Copy of the form and its outcomes. */
  export type JobPostingSectionMessages = {
    /** Message under a required field submitted empty. */
    missing: string
    /** Message under an email field holding a malformed address. */
    invalidEmail: string
    /** Message under a URL field that does not start with http or https. */
    invalidUrl: string
    /** Alert under the form when the site reports the application could not be sent. */
    error: string
    /** Title of the confirmation dialog. */
    successTitle: string
    /** Description of the confirmation dialog. */
    successDescription: string
    /** Label of the button that closes the confirmation dialog. */
    done: string
    /** Label of the button that opens the file picker of a file field. */
    browse: string
  }

  export interface JobPostingSectionProps {
    /**
     * The application form: `{ title, description?, submitLabel, anchor?, ariaLabel?, fields }`,
     * where `anchor` is the id of the apply section the rail button links to and a field is `{
     * name, type, label, required?, helper?, placeholder?, accept?, autocomplete?, country? }`.
     */
    form: JobPostingSectionForm
    /** Copy of the form and its outcomes: `{ missing, invalidEmail, invalidUrl, error, successTitle, successDescription, done, browse }`. */
    messages: JobPostingSectionMessages
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
    /** Area the posting is filed under, the overline of the rail. */
    area?: string
    /** Title of the posting, restated at the top of the rail; the band renders nothing when empty. */
    title?: string
    /** Facts about the posting listed in the rail, in order; each is `{ label, icon? }`. */
    facets?: JobPostingSectionFacet[]
    /** Label of the rail button that links to the application form; the button is left out when empty. */
    applyLabel?: string
    /** The description, one row per section in order; each is `{ title, blocks }` where a block is `{ type: 'text', text }` or `{ type: 'list', items }`. */
    sections?: JobPostingSectionSection[]
    /** Link in the confirmation dialog back to the open positions; `{ label, href }`. Omitted when absent. */
    secondaryAction?: ModuleHeaderAction
    /** The site is sending the application: the submit button shows its loading state, every control is disabled and a submit is ignored. */
    loading?: boolean
    /** The site sent the application: the confirmation dialog opens. */
    submitted?: boolean
    /** The site could not send the application: `messages.error` shows under the submit button. */
    failed?: boolean
  }

  const props = withDefaults(defineProps<JobPostingSectionProps>(), {
    anchor: '',
    area: '',
    title: '',
    facets: () => [],
    applyLabel: '',
    sections: () => [],
    secondaryAction: undefined,
    loading: false,
    submitted: false,
    failed: false
  })

  const emit = defineEmits<{
    submit: [event: SubmitEvent, values: Record<string, string>]
  }>()

  const attrs = useAttrs()
  const baseId = useId()

  const confirming = ref(props.submitted)

  const application = proxyRefs(
    useJobPostingForm(
      baseId,
      () => props.form.fields,
      () => props.messages
    )
  )

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'job-posting-section'
  )

  const applyId = computed(() => props.form.anchor || `${baseId}-apply`)

  const legend = computed(() => props.form.ariaLabel || props.form.title)

  watch(
    () => props.submitted,
    (submitted) => {
      if (submitted) confirming.value = true
    }
  )

  watch(confirming, (open, wasOpen) => {
    if (!open && wasOpen) application.reset()
  })

  const send = (event: Event) => {
    if (props.loading) return
    const { values: collected, first } = application.validate()
    if (first) {
      nextTick(() => document.getElementById(application.focusTarget(first))?.focus())
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
    <template v-if="title">
      <Module
        :divided="false"
        :padded="false"
      >
        <RegistrationFrame
          flush
          borders="y"
          marks="bottom"
        >
          <div class="grid lg:grid-cols-[minmax(0,1fr)_var(--container-xs)]">
            <JobPostingSectionRail
              :test-id="testId"
              :area="area"
              :title="title"
              :facets="facets"
              :apply-label="applyLabel"
              :apply-href="`#${applyId}`"
            />

            <div class="min-w-0 lg:col-start-1 lg:row-start-1">
              <div
                v-for="(section, index) in sections"
                :key="`${section.title}-${index}`"
                :data-ruled="index > 0 || null"
                :data-testid="`${testId}__section`"
                class="border-(--border-default) data-[ruled]:border-t"
              >
                <div
                  class="flex max-w-(--layout-measure-content) flex-col gap-(--spacing-lg) px-(--spacing-xl) py-(--spacing-2xl)"
                >
                  <ModuleHeader
                    :framed="false"
                    align="start"
                    size="small"
                    :title="section.title"
                  />

                  <template
                    v-for="(block, blockIndex) in section.blocks"
                    :key="blockIndex"
                  >
                    <p
                      v-if="block.type === 'text'"
                      class="m-0 text-pretty text-body-md text-(--text-muted)"
                    >
                      {{ block.text }}
                    </p>
                    <ul
                      v-else
                      class="m-0 flex list-disc flex-col gap-(--spacing-sm) ps-(--spacing-lg)"
                    >
                      <li
                        v-for="(item, itemIndex) in block.items"
                        :key="itemIndex"
                        class="text-pretty text-body-md text-(--text-muted)"
                      >
                        {{ item }}
                      </li>
                    </ul>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </RegistrationFrame>
      </Module>

      <Module
        :id="applyId"
        :divided="false"
        :padded="false"
        :data-testid="`${testId}__apply`"
        class="scroll-mt-(--spacing-2xl)"
      >
        <template #header>
          <RegistrationFrame
            flush
            borders="y"
            marks="bottom"
          >
            <div class="max-w-(--layout-measure-content) px-(--spacing-xl) py-(--spacing-2xl)">
              <ModuleHeader
                :framed="false"
                align="start"
                :title="form.title"
                :description="form.description ?? ''"
              />
            </div>
          </RegistrationFrame>
        </template>

        <RegistrationFrame
          flush
          borders="y"
          marks="bottom"
        >
          <div class="max-w-(--layout-measure-form) px-(--spacing-xl) py-(--spacing-2xl)">
            <form
              novalidate
              class="flex flex-col gap-(--spacing-xl)"
              :data-testid="`${testId}__form`"
              @submit.prevent="send"
            >
              <fieldset
                :disabled="loading"
                class="m-0 grid min-w-0 grid-cols-1 gap-(--spacing-lg) border-0 p-0 sm:grid-cols-2"
              >
                <legend
                  v-if="legend"
                  class="sr-only"
                >
                  {{ legend }}
                </legend>

                <Field
                  v-for="field in form.fields"
                  :key="field.name"
                  :required="field.required"
                  :invalid="application.emptyRequired(field) || application.malformed(field)"
                  :disabled="loading"
                  :data-wide="field.type === 'file' || null"
                  class="min-w-0 sm:data-[wide]:col-span-2"
                >
                  <FieldLabel
                    :for="application.focusTarget(field)"
                    :required="field.required"
                    >{{ field.label }}</FieldLabel
                  >
                  <template v-if="field.type === 'file'">
                    <FileDropzone
                      v-if="!application.files[field.name]"
                      :accept="field.accept ?? ''"
                      :multiple="false"
                      :disabled="loading"
                      @drop="(_event, dropped) => application.setFile(field, dropped[0] ?? null)"
                    >
                      <Button
                        :id="`${application.fieldId(field)}-browse`"
                        type="button"
                        :label="messages.browse"
                        :aria-label="`${messages.browse}, ${field.label}`"
                        variant="secondary"
                        size="medium"
                        :disabled="loading"
                        @click="application.browse(field)"
                      />
                    </FileDropzone>
                    <FileTokenGroup
                      v-else
                      :items="application.fileTokens(field)"
                      :readonly="loading"
                      @remove="application.setFile(field, null)"
                    />
                    <input
                      :ref="(element) => application.bindFileInput(field, element)"
                      type="file"
                      :name="field.name"
                      :accept="field.accept || undefined"
                      class="hidden"
                      aria-hidden="true"
                      tabindex="-1"
                      @change="application.onFilePick(field, $event)"
                    />
                  </template>
                  <PhoneInput
                    v-else-if="field.type === 'phone'"
                    :id="application.fieldId(field)"
                    size="large"
                    :model-value="application.values[field.name] ?? ''"
                    :country="application.countryOf(field)"
                    :name="field.name"
                    :placeholder="field.placeholder"
                    @update:model-value="application.setValue(field, $event)"
                    @update:country="application.setCountry(field, $event)"
                  />
                  <Input
                    v-else
                    :id="application.fieldId(field)"
                    :model-value="application.values[field.name] ?? ''"
                    :name="field.name"
                    :placeholder="field.placeholder"
                    :type="field.type === 'email' ? 'email' : 'text'"
                    :inputmode="field.type === 'url' ? 'url' : undefined"
                    :autocomplete="field.type === 'email' ? 'email' : field.autocomplete"
                    :spellcheck="field.type === 'email' || field.type === 'url' ? false : undefined"
                    size="large"
                    @update:model-value="application.setValue(field, $event)"
                  />
                  <FieldDescription v-if="application.errors[field.name] || field.helper">
                    {{ application.errors[field.name] || field.helper }}
                  </FieldDescription>
                </Field>
              </fieldset>

              <div class="flex">
                <Button
                  type="submit"
                  :label="form.submitLabel"
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
        </RegistrationFrame>
      </Module>

      <Dialog
        v-model:open="confirming"
        size="small"
        :data-testid="`${testId}__dialog`"
      >
        <DialogContent :data-testid="`${testId}__dialog__panel`">
          <PanelHeader class="w-full">
            <DialogTitle :data-testid="`${testId}__dialog__title`">{{
              messages.successTitle
            }}</DialogTitle>
          </PanelHeader>
          <PanelBody>
            <DialogDescription
              :data-testid="`${testId}__dialog__description`"
              class="m-0 text-body-sm text-(--text-muted)"
            >
              {{ messages.successDescription }}
            </DialogDescription>
          </PanelBody>
          <PanelFooter class="flex-col items-stretch md:flex-row md:items-center md:justify-end">
            <Button
              v-if="secondaryAction"
              class="w-full md:w-auto"
              :label="secondaryAction.label"
              :href="secondaryAction.href"
              variant="outline"
              size="medium"
            />
            <Button
              class="w-full md:w-auto"
              type="button"
              :label="messages.done"
              variant="primary"
              size="medium"
              @click="confirming = false"
            />
          </PanelFooter>
        </DialogContent>
      </Dialog>
    </template>
  </div>
</template>
