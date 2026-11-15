<script setup lang="ts">
  import { useEventListener } from '@vueuse/core'
  import { computed, ref, useAttrs, useId, watch } from 'vue'

  import { useFieldControl } from '../../../composables/use-field-control'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { matchesAccept } from '../../../utils/file-accept'
  import { dropEntries, filesFromEntries } from '../../../utils/file-entries'

  defineOptions({ name: 'FileDropzone', inheritAttrs: false })

  /** Placement of the drop target. */
  export type FileDropzoneVariant = 'inline' | 'overlay'

  export interface FileDropzoneProps {
    /** Placement. Inline is an always-visible dashed region; overlay stays hidden until files are dragged over the window, then covers its nearest positioned ancestor. */
    variant?: FileDropzoneVariant
    /** Instruction shown under the icon. Empty uses the locale catalog (`Drop files to upload`). */
    title?: string
    /** Secondary line under the title, typically the accepted types and limits. Not rendered when empty. */
    description?: string
    /** Comma-separated file filter using the native input accept syntax (extensions, MIME types, type wildcards). Files that do not match are rejected. Empty accepts every file. */
    accept?: string
    /** When false, only the first accepted file of a drop is accepted and the rest are rejected. */
    multiple?: boolean
    /** Accepts dropped folders: walks every dropped folder and emits the files inside, each with its `webkitRelativePath` (`assets/img/logo.svg`). The events fire after the walk. */
    directories?: boolean
    /** Ignores drags and drops: no active state, no events. */
    disabled?: boolean
    /** Paints the inline region with the danger border so a wrapping field can show a validation error. Drops still work. */
    invalid?: boolean
    /** Azion icon class for the glyph above the title. Empty draws the cloud-upload glyph. */
    icon?: string
  }
  const props = withDefaults(defineProps<FileDropzoneProps>(), {
    variant: 'inline',
    title: '',
    description: '',
    accept: '',
    multiple: true,
    directories: false,
    disabled: false,
    invalid: false,
    icon: ''
  })

  const emit = defineEmits<{
    /** Files were dropped and at least one passed accept and multiple; carries only the accepted files. */
    drop: [event: DragEvent, files: File[]]
    /** Files were dropped and at least one was filtered out; carries only the rejected files. */
    reject: [event: DragEvent, files: File[]]
  }>()

  defineSlots<{
    /** Actions or extra content under the description, typically a Browse files button. Rendered only in the inline variant. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ fileDropzone: en.fileDropzone })
  const titleId = useId()
  const descriptionId = useId()
  const {
    controlId,
    describedBy: fieldDescribedBy,
    labelledBy: fieldLabelledBy,
    invalid: isInvalid,
    disabled: isDisabled
  } = useFieldControl({
    id: () => attrs['id'] as string | undefined,
    describedBy: () => attrs['aria-describedby'] as string | undefined,
    labelledBy: () => attrs['aria-labelledby'] as string | undefined,
    invalid: () => props.invalid,
    disabled: () => props.disabled
  })

  const depth = ref(0)

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'file-dropzone'
  )
  const isInline = computed(() => props.variant === 'inline')
  const isOverlayLive = computed(() => props.variant === 'overlay' && !isDisabled.value)
  const isActive = computed(() => !isDisabled.value && depth.value > 0)
  const labelIds = computed(() => [fieldLabelledBy.value, titleId].filter(Boolean).join(' '))
  const descriptionIds = computed(
    () =>
      [props.description ? descriptionId : '', fieldDescribedBy.value].filter(Boolean).join(' ') ||
      undefined
  )

  watch(
    () => [props.variant, isDisabled.value],
    () => {
      depth.value = 0
    }
  )

  useEventListener('dragenter', onWindowDragenter)
  useEventListener('dragleave', onWindowDragleave)
  useEventListener('dragover', onWindowDragover)
  useEventListener('drop', onWindowDrop)
  useEventListener('dragend', onWindowReset)
  useEventListener('keydown', onWindowKeydown)

  function carriesFiles(event: DragEvent): boolean {
    return Array.from(event.dataTransfer?.types ?? []).includes('Files')
  }

  function deliver(event: DragEvent): void {
    const entries = props.directories ? dropEntries(event.dataTransfer) : null
    if (entries) {
      void filesFromEntries(entries).then(
        (files) => sort(event, files),
        () => sort(event, Array.from(event.dataTransfer?.files ?? []))
      )
      return
    }
    sort(event, Array.from(event.dataTransfer?.files ?? []))
  }

  function sort(event: DragEvent, files: File[]): void {
    const accepted: File[] = []
    const rejected: File[] = []
    for (const file of files) {
      const fits = matchesAccept(file, props.accept) && (props.multiple || accepted.length === 0)
      if (fits) accepted.push(file)
      else rejected.push(file)
    }
    if (accepted.length > 0) emit('drop', event, accepted)
    if (rejected.length > 0) emit('reject', event, rejected)
  }

  function onRootDragenter(event: DragEvent): void {
    if (!isInline.value || isDisabled.value || !carriesFiles(event)) return
    depth.value += 1
  }

  function onRootDragleave(event: DragEvent): void {
    if (!isInline.value || !carriesFiles(event)) return
    depth.value = Math.max(0, depth.value - 1)
  }

  function onRootDragover(event: DragEvent): void {
    if (!carriesFiles(event)) return
    if (!isInline.value && !isActive.value) return
    event.preventDefault()
    if (event.dataTransfer) event.dataTransfer.dropEffect = isDisabled.value ? 'none' : 'copy'
  }

  function onRootDrop(event: DragEvent): void {
    if (!carriesFiles(event)) return
    if (!isInline.value && !isActive.value) return
    event.preventDefault()
    depth.value = 0
    if (isDisabled.value) return
    deliver(event)
  }

  function onWindowDragenter(event: DragEvent): void {
    if (!isOverlayLive.value || !carriesFiles(event)) return
    depth.value += 1
  }

  function onWindowDragleave(event: DragEvent): void {
    if (!isOverlayLive.value || !carriesFiles(event)) return
    depth.value = Math.max(0, depth.value - 1)
  }

  function onWindowDragover(event: DragEvent): void {
    if (!isOverlayLive.value || !isActive.value || event.defaultPrevented) return
    event.preventDefault()
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'none'
  }

  function onWindowDrop(event: DragEvent): void {
    if (!isOverlayLive.value) return
    if (isActive.value && !event.defaultPrevented) event.preventDefault()
    depth.value = 0
  }

  function onWindowReset(): void {
    if (!isOverlayLive.value) return
    depth.value = 0
  }

  function onWindowKeydown(event: KeyboardEvent): void {
    if (!isOverlayLive.value || event.key !== 'Escape') return
    depth.value = 0
  }
</script>

<template>
  <Transition
    enter-active-class="animate-fade-in motion-reduce:animate-none"
    leave-active-class="animate-fade-out motion-reduce:animate-none"
  >
    <div
      v-show="isInline || isActive"
      v-bind="$attrs"
      :data-testid="testId"
      :data-variant="variant"
      :data-state="isActive ? 'active' : 'idle'"
      :id="isInline ? controlId : undefined"
      :data-disabled="isDisabled || null"
      :data-invalid="isInvalid || null"
      :role="isInline ? 'group' : undefined"
      :aria-disabled="isInline && isDisabled ? 'true' : undefined"
      :aria-invalid="isInline && isInvalid ? 'true' : undefined"
      :aria-labelledby="isInline ? labelIds : undefined"
      :aria-describedby="isInline ? descriptionIds : undefined"
      :aria-hidden="isInline ? undefined : 'true'"
      class="group flex flex-col rounded-(--shape-card) data-[variant=inline]:w-full data-[variant=inline]:border data-[variant=inline]:border-dashed data-[variant=inline]:border-(--border-strong) data-[variant=inline]:bg-(--bg-surface) data-[variant=inline]:p-(--spacing-lg) data-[variant=inline]:transition-[background-color,border-color] data-[variant=inline]:duration-fast-02 data-[variant=inline]:ease-productive-entrance motion-reduce:transition-none data-[variant=inline]:data-[state=active]:border-(--border-selected) data-[variant=inline]:data-[state=active]:bg-(--bg-selected) data-[variant=inline]:data-[state=idle]:data-[invalid]:not-data-[disabled]:border-(--danger-border) data-[variant=inline]:data-[disabled]:border-(--border-default) data-[variant=inline]:data-[disabled]:bg-(--bg-disabled) data-[disabled]:cursor-not-allowed data-[variant=overlay]:absolute data-[variant=overlay]:inset-0 data-[variant=overlay]:border-2 data-[variant=overlay]:border-dashed data-[variant=overlay]:border-(--border-selected) data-[variant=overlay]:bg-(--bg-canvas) data-[variant=overlay]:data-[state=idle]:pointer-events-none"
      @dragenter="onRootDragenter"
      @dragleave="onRootDragleave"
      @dragover="onRootDragover"
      @drop="onRootDrop"
    >
      <div
        class="flex w-full flex-col items-center justify-center gap-(--spacing-md) text-center group-data-[variant=overlay]:sticky group-data-[variant=overlay]:top-0 group-data-[variant=overlay]:h-dvh group-data-[variant=overlay]:max-h-full group-data-[variant=overlay]:p-(--spacing-lg)"
      >
        <span
          class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface-raised)"
          aria-hidden="true"
        >
          <i
            :class="icon || 'ai ai-cloud-upload'"
            class="text-body-lg text-(--text-default) group-data-[disabled]:text-(--text-disabled)"
            aria-hidden="true"
          />
        </span>

        <div class="flex max-w-(--container-md) flex-col items-center gap-(--spacing-2xs)">
          <p
            :id="titleId"
            class="m-0 text-heading-xs text-(--text-default) group-data-[disabled]:text-(--text-disabled)"
          >
            {{ title || t('fileDropzone.title') }}
          </p>
          <p
            v-if="description"
            :id="descriptionId"
            class="m-0 text-body-sm text-(--text-muted) group-data-[disabled]:text-(--text-disabled)"
          >
            {{ description }}
          </p>
        </div>

        <slot v-if="isInline" />
      </div>
    </div>
  </Transition>
</template>
