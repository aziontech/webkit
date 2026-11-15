<script setup lang="ts">
  import { computed, nextTick, ref, useAttrs, useId, watch } from 'vue'

  import Button from '../../actions/button/button.vue'
  import Overline from '../../content/overline/overline.vue'
  import Alert from '../../feedback/alert/alert.vue'
  import Field from '../../inputs/field/field.vue'
  import FieldDescription from '../../inputs/field/field-description/field-description.vue'
  import FieldLabel from '../../inputs/field/field-label/field-label.vue'
  import FileDropzone from '../../inputs/file-dropzone/file-dropzone.vue'
  import type { FileTokenGroupItem } from '../../inputs/file-token-group/file-token-group.vue'
  import FileTokenGroup from '../../inputs/file-token-group/file-token-group.vue'
  import Input from '../../inputs/input/input.vue'
  import { defaultCountries } from '../../inputs/phone-input/countries'
  import PhoneInput from '../../inputs/phone-input/phone-input.vue'
  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import SectionTitle from '../../marketing/section-title/section-title.vue'
  import Dialog from '../../overlay/dialog/dialog.vue'
  import DialogContent from '../../overlay/dialog/dialog-content.vue'
  import DialogDescription from '../../overlay/dialog/dialog-description.vue'
  import DialogTitle from '../../overlay/dialog/dialog-title.vue'
  import PanelContent from '../../overlay/panel/panel-content.vue'
  import PanelFooter from '../../overlay/panel/panel-footer.vue'
  import PanelHeader from '../../overlay/panel/panel-header.vue'

  defineOptions({
    name: 'JobPosting',
    inheritAttrs: false
  })

  /** One fact about the posting, listed in the rail. */
  export type JobPostingFacet = {
    /** The fact, such as a department, a location or a contract. */
    label: string
    /** Icon class of the glyph leading the fact. */
    icon?: string
  }

  /** A paragraph of a description section. */
  export type JobPostingTextBlock = {
    /** Marks the block as a paragraph. */
    kind: 'text'
    /** The paragraph. */
    text: string
  }

  /** A bullet list of a description section. */
  export type JobPostingListBlock = {
    /** Marks the block as a bullet list. */
    kind: 'list'
    /** The bullets, in order. */
    items: string[]
  }

  /** One block of a description section: a paragraph or a bullet list. */
  export type JobPostingBlock = JobPostingTextBlock | JobPostingListBlock

  /** One section of the description, rendered as a row. */
  export type JobPostingSection = {
    /** Heading of the section. */
    title: string
    /** The paragraphs and lists of the section, in order. */
    blocks: JobPostingBlock[]
  }

  /** Control a form field renders as. */
  export type JobPostingFieldKind = 'text' | 'email' | 'phone' | 'url' | 'file'

  /** One field of the application form. */
  export type JobPostingField = {
    /** Key of the value in the submitted values, and the HTML name of the control. */
    name: string
    /** Control the field renders as. */
    kind: JobPostingFieldKind
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
  export type JobPostingForm = {
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
    fields: JobPostingField[]
  }

  /** Copy of the form and its outcomes. */
  export type JobPostingMessages = {
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

  /** A link: a label and where it goes. */
  export type JobPostingAction = {
    /** Visible label of the link. */
    label: string
    /** Destination of the link. */
    href: string
  }

  interface Props {
    /** The application form: `{ title, description?, submitLabel, anchor?, ariaLabel?, fields }`, where `anchor` is the id of the apply section the rail button links to and a field is `{ name, kind, label, required?, helper?, placeholder?, accept?, autocomplete?, country? }`. */
    form: JobPostingForm
    /** Copy of the form and its outcomes: `{ missing, invalidEmail, invalidUrl, error, successTitle, successDescription, done, browse }`. */
    messages: JobPostingMessages
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
    /** Area the posting is filed under, the overline of the rail. */
    area?: string
    /** Title of the posting, restated at the top of the rail; the band renders nothing when empty. */
    title?: string
    /** Facts about the posting listed in the rail, in order; each is `{ label, icon? }`. */
    facets?: JobPostingFacet[]
    /** Label of the rail button that links to the application form; the button is left out when empty. */
    applyLabel?: string
    /** The description, one row per section in order; each is `{ title, blocks }` where a block is `{ kind: 'text', text }` or `{ kind: 'list', items }`. */
    sections?: JobPostingSection[]
    /** Link in the confirmation dialog back to the open positions; `{ label, href }`. Omitted when absent. */
    secondaryAction?: JobPostingAction
    /** The site is sending the application: the submit button shows its loading state, every control is disabled and a submit is ignored. */
    loading?: boolean
    /** The site sent the application: the confirmation dialog opens. */
    submitted?: boolean
    /** The site could not send the application: `messages.error` shows under the submit button. */
    error?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    anchor: '',
    area: '',
    title: '',
    facets: () => [],
    applyLabel: '',
    sections: () => [],
    secondaryAction: undefined,
    loading: false,
    submitted: false,
    error: false
  })

  const emit = defineEmits<{
    submit: [event: SubmitEvent, values: Record<string, string>]
  }>()

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const URL_PATTERN = /^https?:\/\/\S+$/

  const attrs = useAttrs()
  const baseId = useId()

  const values = ref<Record<string, string>>({})
  const countries = ref<Record<string, string>>({})
  const files = ref<Record<string, File>>({})
  const errors = ref<Record<string, string>>({})
  const confirming = ref(props.submitted)
  const fileInputs = ref<Record<string, HTMLInputElement | null>>({})

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-job-posting'
  )

  const applyId = computed(() => props.form.anchor || `${baseId}-apply`)

  const legend = computed(() => props.form.ariaLabel || props.form.title)

  const fieldId = (field: JobPostingField) => `${baseId}-${field.name}`

  const countryOf = (field: JobPostingField) => countries.value[field.name] ?? field.country ?? 'US'

  const clearError = (field: JobPostingField) => {
    if (errors.value[field.name]) errors.value = { ...errors.value, [field.name]: '' }
  }

  const setValue = (field: JobPostingField, next: string) => {
    values.value = { ...values.value, [field.name]: next }
    clearError(field)
  }

  const setCountry = (field: JobPostingField, next: string) => {
    countries.value = { ...countries.value, [field.name]: next }
  }

  const syncInput = (field: JobPostingField, file: File | null) => {
    const input = fileInputs.value[field.name]
    if (!input || typeof DataTransfer === 'undefined') return
    const transfer = new DataTransfer()
    if (file) transfer.items.add(file)
    input.files = transfer.files
  }

  const setFile = (field: JobPostingField, file: File | null, fromInput = false) => {
    const next = { ...files.value }
    if (file) next[field.name] = file
    else delete next[field.name]
    files.value = next
    if (!fromInput) syncInput(field, file)
    setValue(field, file?.name ?? '')
  }

  const bindFileInput = (field: JobPostingField, element: unknown) => {
    fileInputs.value[field.name] = element instanceof HTMLInputElement ? element : null
  }

  const browse = (field: JobPostingField) => fileInputs.value[field.name]?.click()

  const onFilePick = (field: JobPostingField, event: Event) => {
    const input = event.target as HTMLInputElement
    setFile(field, input.files?.[0] ?? null, true)
  }

  const fileTokens = (field: JobPostingField): FileTokenGroupItem[] => {
    const file = files.value[field.name]
    return file ? [{ file }] : []
  }

  const valueOf = (field: JobPostingField) => {
    const raw = (values.value[field.name] ?? '').trim()
    if (field.kind !== 'phone' || !raw) return raw
    const dialCode = defaultCountries.find((item) => item.code === countryOf(field))?.dialCode
    return dialCode ? `${dialCode}${raw}` : raw
  }

  const filled = (field: JobPostingField) => Boolean((values.value[field.name] ?? '').trim())

  const emptyRequired = (field: JobPostingField) =>
    Boolean(errors.value[field.name]) && !filled(field)

  const malformed = (field: JobPostingField) => Boolean(errors.value[field.name]) && filled(field)

  const messageOf = (field: JobPostingField, value: string) => {
    if (field.required && !value) return props.messages.missing
    if (field.kind === 'email' && value && !EMAIL_PATTERN.test(value))
      return props.messages.invalidEmail
    if (field.kind === 'url' && value && !URL_PATTERN.test(value)) return props.messages.invalidUrl
    return ''
  }

  const focusTarget = (field: JobPostingField) =>
    field.kind === 'file' ? `${fieldId(field)}-browse` : fieldId(field)

  const reset = () => {
    values.value = {}
    errors.value = {}
    for (const field of props.form.fields) {
      if (field.kind === 'file') syncInput(field, null)
    }
    files.value = {}
  }

  watch(
    () => props.submitted,
    (submitted) => {
      if (submitted) confirming.value = true
    }
  )

  watch(confirming, (open, wasOpen) => {
    if (!open && wasOpen) reset()
  })

  const send = (event: Event) => {
    if (props.loading) return
    const collected: Record<string, string> = {}
    const found: Record<string, string> = {}
    for (const field of props.form.fields) {
      const value = valueOf(field)
      collected[field.name] = value
      const message = messageOf(field, value)
      if (message) found[field.name] = message
    }
    errors.value = found
    const first = props.form.fields.find((field) => found[field.name])
    if (first) {
      nextTick(() => document.getElementById(focusTarget(first))?.focus())
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
    :data-error="error || null"
    class="scroll-mt-(--spacing-2xl)"
  >
    <template v-if="title">
      <SectionModule
        :divided="false"
        :padded="false"
      >
        <FrameBox
          flush
          borders="y"
          marks="bottom"
        >
          <div class="grid lg:grid-cols-[minmax(0,1fr)_var(--container-xs)]">
            <div
              :data-testid="`${testId}__rail`"
              class="hidden border-(--border-default) lg:col-start-2 lg:row-start-1 lg:block lg:border-s"
            >
              <div class="sticky top-14 flex flex-col gap-(--spacing-lg) p-(--spacing-xl)">
                <div class="flex flex-col gap-(--spacing-xs)">
                  <Overline v-if="area">{{ area }}</Overline>
                  <p class="m-0 text-pretty text-heading-sm text-(--text-default)">
                    {{ title }}
                  </p>
                </div>

                <ul
                  v-if="facets.length > 0"
                  class="m-0 flex list-none flex-col gap-(--spacing-sm) p-0"
                >
                  <li
                    v-for="facet in facets"
                    :key="facet.label"
                    class="flex items-start gap-(--spacing-xs) text-body-sm text-(--text-muted)"
                  >
                    <i
                      v-if="facet.icon"
                      :class="facet.icon"
                      class="mt-(--spacing-2xs) shrink-0 text-body-sm text-(--text-muted)"
                      aria-hidden="true"
                    />
                    {{ facet.label }}
                  </li>
                </ul>

                <Button
                  v-if="applyLabel"
                  :label="applyLabel"
                  kind="secondary"
                  size="large"
                  :href="`#${applyId}`"
                  icon="ai ai-chevron-right"
                  icon-position="trailing"
                  animated
                  class="w-full"
                />
              </div>
            </div>

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
                  <SectionTitle
                    :framed="false"
                    kind="left"
                    size="small"
                    :title="section.title"
                  />

                  <template
                    v-for="(block, blockIndex) in section.blocks"
                    :key="blockIndex"
                  >
                    <p
                      v-if="block.kind === 'text'"
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
        </FrameBox>
      </SectionModule>

      <SectionModule
        :id="applyId"
        :divided="false"
        :padded="false"
        :data-testid="`${testId}__apply`"
        class="scroll-mt-(--spacing-2xl)"
      >
        <template #header>
          <FrameBox
            flush
            borders="y"
            marks="bottom"
          >
            <div class="max-w-(--layout-measure-content) px-(--spacing-xl) py-(--spacing-2xl)">
              <SectionTitle
                :framed="false"
                kind="left"
                :title="form.title"
                :description="form.description ?? ''"
              />
            </div>
          </FrameBox>
        </template>

        <FrameBox
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
                  :required="emptyRequired(field)"
                  :invalid="malformed(field)"
                  :disabled="loading"
                  :data-wide="field.kind === 'file' || null"
                  class="min-w-0 sm:data-[wide]:col-span-2"
                >
                  <FieldLabel
                    :for="focusTarget(field)"
                    :required="field.required"
                    >{{ field.label }}</FieldLabel
                  >
                  <template v-if="field.kind === 'file'">
                    <FileDropzone
                      v-if="!files[field.name]"
                      :accept="field.accept ?? ''"
                      :multiple="false"
                      :disabled="loading"
                      @drop="(_event, dropped) => setFile(field, dropped[0] ?? null)"
                    >
                      <Button
                        :id="`${fieldId(field)}-browse`"
                        type="button"
                        :label="messages.browse"
                        :aria-label="`${messages.browse}, ${field.label}`"
                        kind="secondary"
                        size="medium"
                        :disabled="loading"
                        @click="browse(field)"
                      />
                    </FileDropzone>
                    <FileTokenGroup
                      v-else
                      :items="fileTokens(field)"
                      :readonly="loading"
                      @remove="setFile(field, null)"
                    />
                    <input
                      :ref="(element) => bindFileInput(field, element)"
                      type="file"
                      :name="field.name"
                      :accept="field.accept || undefined"
                      class="hidden"
                      aria-hidden="true"
                      tabindex="-1"
                      @change="onFilePick(field, $event)"
                    />
                  </template>
                  <PhoneInput
                    v-else-if="field.kind === 'phone'"
                    :id="fieldId(field)"
                    size="large"
                    :model-value="values[field.name] ?? ''"
                    :country="countryOf(field)"
                    :name="field.name"
                    :placeholder="field.placeholder"
                    @update:model-value="setValue(field, $event)"
                    @update:country="setCountry(field, $event)"
                  />
                  <Input
                    v-else
                    :id="fieldId(field)"
                    :model-value="values[field.name] ?? ''"
                    :name="field.name"
                    :placeholder="field.placeholder"
                    :type="field.kind === 'email' ? 'email' : 'text'"
                    :inputmode="field.kind === 'url' ? 'url' : undefined"
                    :autocomplete="field.kind === 'email' ? 'email' : field.autocomplete"
                    :spellcheck="field.kind === 'email' || field.kind === 'url' ? false : undefined"
                    size="large"
                    @update:model-value="setValue(field, $event)"
                  />
                  <FieldDescription v-if="errors[field.name] || field.helper">
                    {{ errors[field.name] || field.helper }}
                  </FieldDescription>
                </Field>
              </fieldset>

              <div class="flex">
                <Button
                  type="submit"
                  :label="form.submitLabel"
                  kind="primary"
                  size="large"
                  :loading="loading"
                />
              </div>

              <Alert
                v-if="error"
                severity="danger"
                :label="messages.error"
              />
            </form>
          </div>
        </FrameBox>
      </SectionModule>

      <Dialog
        v-model:open="confirming"
        size="small"
        :data-testid="`${testId}__dialog`"
      >
        <DialogContent>
          <PanelHeader class="w-full">
            <DialogTitle>{{ messages.successTitle }}</DialogTitle>
          </PanelHeader>
          <PanelContent>
            <DialogDescription class="m-0 text-body-sm text-(--text-muted)">
              {{ messages.successDescription }}
            </DialogDescription>
          </PanelContent>
          <PanelFooter class="flex-col md:flex-row md:justify-end">
            <Button
              v-if="secondaryAction"
              class="w-full md:w-auto"
              :label="secondaryAction.label"
              :href="secondaryAction.href"
              kind="outlined"
              size="medium"
            />
            <Button
              class="w-full md:w-auto"
              type="button"
              :label="messages.done"
              kind="primary"
              size="medium"
              @click="confirming = false"
            />
          </PanelFooter>
        </DialogContent>
      </Dialog>
    </template>
  </div>
</template>
