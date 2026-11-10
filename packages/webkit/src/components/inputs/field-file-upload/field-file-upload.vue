<script setup lang="ts">
  import {
    type ComponentPublicInstance,
    computed,
    nextTick,
    onMounted,
    ref,
    useAttrs,
    useId,
    watch
  } from 'vue'

  import { matchesAccept } from '../../../utils/file-accept'
  import Button from '../../actions/button/button.vue'
  import IconButton from '../../actions/icon-button/icon-button.vue'
  import FileDropzone from '../file-dropzone/file-dropzone.vue'
  import HelperText, { type HelperTextKind } from '../helper-text/helper-text.vue'
  import Label from '../label/label.vue'
  import { formatFileSize } from './format-file-size'

  defineOptions({
    name: 'FieldFileUpload',
    inheritAttrs: false
  })

  /** Size token forwarded to the Choose file Button and the remove IconButtons. */
  export type FieldFileUploadSize = 'small' | 'medium' | 'large'

  interface Props {
    /** Text rendered inside the Label. When empty, the label row is omitted. */
    label?: string
    /** Auxiliary text rendered inside HelperText, usually the accepted types and size limit; replace it with the error message when invalid. When empty, the helper row is omitted, including while disabled. */
    helperText?: string
    /** Comma-separated list of accepted types using the native accept syntax: extensions, exact MIME types or MIME wildcards. Forwarded to the native input and checked on every picked or dropped file. Empty accepts any type. */
    accept?: string
    /** Lets the user pick or drop several files; new files are appended to the value. When off, a new file replaces the current one and the trigger reads Choose file. */
    multiple?: boolean
    /** Largest accepted file size in bytes. Files above it are rejected through the reject event. 0 means no limit. */
    maxSize?: number
    /** Size forwarded to the Choose file Button and the remove IconButtons. */
    size?: FieldFileUploadSize
    /** Disables the picker, the drop region and every remove button, and switches a supplied helper to kind=disabled (lock icon). */
    disabled?: boolean
    /** Shows the selected files without the drop region or the remove buttons. The value can be read but not changed. */
    readonly?: boolean
    /** Adds the Required tag to the Label and switches a supplied helper to kind=required. */
    required?: boolean
    /** Switches the helper to kind=invalid and applies invalid tokens to the drop region. */
    invalid?: boolean
    /** id for the native file input; consumed by Label via for and by the aria-describedby wiring. When empty, an id is generated. */
    inputId?: string
    /** HTML name for the native file input, so native form submission and FormData carry the selected files. */
    name?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    label: '',
    helperText: '',
    accept: '',
    multiple: false,
    maxSize: 0,
    size: 'medium',
    disabled: false,
    readonly: false,
    required: false,
    invalid: false,
    inputId: '',
    name: ''
  })

  const emit = defineEmits<{
    /** Picked or dropped files failed the accept or maxSize check, or arrived beyond the first while multiple is off; carries every rejected file of the batch. */
    reject: [event: Event, files: File[]]
  }>()

  /** Two-way bound list of selected files. */
  const model = defineModel<File[]>({ default: () => [] })

  const attrs = useAttrs()
  const generatedId = useId()

  const inputRef = ref<HTMLInputElement | null>(null)
  const buttonRef = ref<ComponentPublicInstance | null>(null)
  const listRef = ref<HTMLUListElement | null>(null)
  const announcement = ref('')
  let pendingDropReject: { event: DragEvent; files: File[] } | null = null

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'input-field-file-upload'
  )

  const resolvedInputId = computed(() => props.inputId || generatedId)
  const labelId = computed(() => `${resolvedInputId.value}-label`)
  const buttonId = computed(() => `${resolvedInputId.value}-button`)
  const helperId = computed(() => `${resolvedInputId.value}-helper`)

  const helperKind = computed<HelperTextKind>(() => {
    if (props.disabled) return 'disabled'
    if (props.invalid) return 'invalid'
    if (props.required) return 'required'
    return 'helper'
  })

  const describedBy = computed(() => (props.helperText ? helperId.value : undefined))
  const buttonLabelledBy = computed(() =>
    props.label ? `${labelId.value} ${buttonId.value}` : undefined
  )
  const buttonLabel = computed(() => (props.multiple ? 'Choose files' : 'Choose file'))
  const isEmpty = computed(() => model.value.length === 0)

  watch(model, syncInput, { flush: 'post' })

  onMounted(syncInput)

  function fileKey(file: File): string {
    return `${file.name}:${file.size}:${file.lastModified}`
  }

  function fitsSize(file: File): boolean {
    return props.maxSize <= 0 || file.size <= props.maxSize
  }

  function syncInput(): void {
    const input = inputRef.value
    if (!input) return
    input.value = ''
    const transfer = new DataTransfer()
    for (const file of model.value) transfer.items.add(file)
    input.files = transfer.files
  }

  function announceAdded(files: File[]): void {
    announcement.value =
      files.length === 1 ? `${files[0].name} added` : `${files.length} files added`
  }

  function commit(accepted: File[]): void {
    if (accepted.length === 0) return
    if (!props.multiple) {
      model.value = [accepted[0]]
      announceAdded([accepted[0]])
      return
    }
    const known = new Set(model.value.map(fileKey))
    const fresh: File[] = []
    for (const file of accepted) {
      const key = fileKey(file)
      if (known.has(key)) continue
      known.add(key)
      fresh.push(file)
    }
    if (fresh.length === 0) return
    model.value = [...model.value, ...fresh]
    announceAdded(fresh)
  }

  function onInputChange(event: Event): void {
    const picked = Array.from((event.target as HTMLInputElement).files ?? [])
    const accepted: File[] = []
    const rejected: File[] = []
    for (const file of picked) {
      const fits =
        matchesAccept(file, props.accept) &&
        fitsSize(file) &&
        (props.multiple || accepted.length === 0)
      if (fits) accepted.push(file)
      else rejected.push(file)
    }
    commit(accepted)
    if (rejected.length > 0) emit('reject', event, rejected)
    void nextTick(syncInput)
  }

  function flushDropReject(): void {
    if (!pendingDropReject) return
    const { event, files } = pendingDropReject
    pendingDropReject = null
    emit('reject', event, files)
  }

  function onDrop(event: DragEvent, files: File[]): void {
    const accepted = files.filter(fitsSize)
    const oversized = files.filter((file) => !fitsSize(file))
    commit(accepted)
    if (oversized.length === 0) return
    pendingDropReject = { event, files: oversized }
    queueMicrotask(flushDropReject)
  }

  function onDropReject(event: DragEvent, files: File[]): void {
    if (pendingDropReject && pendingDropReject.event === event) {
      const merged = [...files, ...pendingDropReject.files]
      pendingDropReject = null
      emit('reject', event, merged)
      return
    }
    emit('reject', event, files)
  }

  function openPicker(): void {
    inputRef.value?.click()
  }

  async function remove(index: number): Promise<void> {
    const removed = model.value[index]
    if (!removed) return
    model.value = model.value.filter((_, position) => position !== index)
    announcement.value = `${removed.name} removed`
    await nextTick()
    const buttons = Array.from(
      listRef.value?.querySelectorAll<HTMLButtonElement>(':scope > li > button') ?? []
    )
    const target = buttons[index] ?? buttons[index - 1]
    if (target) {
      target.focus()
      return
    }
    ;(buttonRef.value?.$el as HTMLElement | undefined)?.focus()
  }
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-size="size"
    :data-multiple="multiple || null"
    :data-required="required || null"
    :data-invalid="invalid || null"
    :data-disabled="disabled || null"
    :data-readonly="readonly || null"
    :data-empty="isEmpty || null"
    class="flex w-full flex-col gap-(--spacing-xs)"
  >
    <Label
      v-if="label"
      :id="labelId"
      :label="label"
      :required="required"
      :for="readonly ? undefined : resolvedInputId"
      :data-testid="`${testId}__label`"
    />
    <FileDropzone
      v-if="!readonly"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled"
      :invalid="invalid"
      :data-testid="`${testId}__dropzone`"
      @drop="onDrop"
      @reject="onDropReject"
    >
      <Button
        :id="buttonId"
        ref="buttonRef"
        kind="secondary"
        icon="pi pi-upload"
        :label="buttonLabel"
        :size="size"
        :disabled="disabled"
        :aria-labelledby="buttonLabelledBy"
        :aria-describedby="describedBy"
        :data-testid="`${testId}__button`"
        @click="openPicker"
      />
      <input
        :id="resolvedInputId"
        ref="inputRef"
        type="file"
        tabindex="-1"
        class="sr-only"
        :accept="accept || undefined"
        :multiple="multiple"
        :name="name || undefined"
        :disabled="disabled"
        :aria-describedby="describedBy"
        :aria-invalid="invalid || undefined"
        :data-testid="`${testId}__input`"
        @change="onInputChange"
      />
    </FileDropzone>
    <HelperText
      v-if="helperText"
      :id="helperId"
      :label="helperText"
      :kind="helperKind"
      :data-testid="`${testId}__helper`"
    />
    <ul
      v-if="!isEmpty"
      ref="listRef"
      :aria-labelledby="label ? labelId : undefined"
      :aria-label="label ? undefined : 'Selected files'"
      :data-testid="`${testId}__list`"
      class="m-0 flex list-none flex-col gap-(--spacing-xxs) p-0"
    >
      <li
        v-for="(file, index) in model"
        :key="fileKey(file)"
        :data-testid="`${testId}__file`"
        class="flex items-center gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) p-(--spacing-xs)"
      >
        <i
          class="pi pi-file shrink-0 text-(--text-muted)"
          aria-hidden="true"
        />
        <span
          :title="file.name"
          class="min-w-0 flex-1 truncate text-label-md text-(--text-default)"
          >{{ file.name }}</span
        >
        <span class="shrink-0 text-body-sm text-(--text-muted)">{{
          formatFileSize(file.size)
        }}</span>
        <IconButton
          v-if="!readonly"
          icon="pi pi-times"
          kind="transparent"
          :ariaLabel="`Remove ${file.name}`"
          :size="size"
          :disabled="disabled"
          :data-testid="`${testId}__remove`"
          @click="remove(index)"
        />
      </li>
    </ul>
    <div
      role="status"
      aria-live="polite"
      class="sr-only"
      :data-testid="`${testId}__status`"
    >
      {{ announcement }}
    </div>
  </div>
</template>
