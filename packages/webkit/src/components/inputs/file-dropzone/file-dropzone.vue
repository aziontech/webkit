<script setup lang="ts">
  import { useEventListener } from '@vueuse/core'
  import { computed, ref, useAttrs, useId, watch } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import { matchesAccept } from '../../../utils/file-accept'
  import { dropEntries, filesFromEntries } from '../../../utils/file-entries'

  defineOptions({ name: 'FileDropzone', inheritAttrs: false })

  /** Placement of the drop target. */
  export type FileDropzoneKind = 'inline' | 'overlay'

  interface Props {
    /** Placement. Inline is an always-visible dashed region; overlay stays hidden until files are dragged over the window, then covers its nearest positioned ancestor. */
    kind?: FileDropzoneKind
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
    /** PrimeIcons class for the glyph above the title. */
    icon?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'inline',
    title: '',
    description: '',
    accept: '',
    multiple: true,
    directories: false,
    disabled: false,
    invalid: false,
    icon: 'pi pi-cloud-upload'
  })

  const emit = defineEmits<{
    /** Files were dropped and at least one passed accept and multiple; carries only the accepted files. */
    drop: [event: DragEvent, files: File[]]
    /** Files were dropped and at least one was filtered out; carries only the rejected files. */
    reject: [event: DragEvent, files: File[]]
  }>()

  defineSlots<{
    /** Actions or extra content under the description, typically a Browse files button. Rendered only in the inline kind. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ fileDropzone: en.fileDropzone })
  const titleId = useId()
  const descriptionId = useId()

  const depth = ref(0)

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'input-file-dropzone'
  )
  const isInline = computed(() => props.kind === 'inline')
  const isOverlayLive = computed(() => props.kind === 'overlay' && !props.disabled)
  const isActive = computed(() => !props.disabled && depth.value > 0)

  watch(
    () => [props.kind, props.disabled],
    () => {
      depth.value = 0
    }
  )

  useEventListener('dragenter', onWindowDragEnter)
  useEventListener('dragleave', onWindowDragLeave)
  useEventListener('dragover', onWindowDragOver)
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

  function onRootDragEnter(event: DragEvent): void {
    if (!isInline.value || props.disabled || !carriesFiles(event)) return
    depth.value += 1
  }

  function onRootDragLeave(event: DragEvent): void {
    if (!isInline.value || !carriesFiles(event)) return
    depth.value = Math.max(0, depth.value - 1)
  }

  function onRootDragOver(event: DragEvent): void {
    if (!carriesFiles(event)) return
    if (!isInline.value && !isActive.value) return
    event.preventDefault()
    if (event.dataTransfer) event.dataTransfer.dropEffect = props.disabled ? 'none' : 'copy'
  }

  function onRootDrop(event: DragEvent): void {
    if (!carriesFiles(event)) return
    if (!isInline.value && !isActive.value) return
    event.preventDefault()
    depth.value = 0
    if (props.disabled) return
    deliver(event)
  }

  function onWindowDragEnter(event: DragEvent): void {
    if (!isOverlayLive.value || !carriesFiles(event)) return
    depth.value += 1
  }

  function onWindowDragLeave(event: DragEvent): void {
    if (!isOverlayLive.value || !carriesFiles(event)) return
    depth.value = Math.max(0, depth.value - 1)
  }

  function onWindowDragOver(event: DragEvent): void {
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
      :data-kind="kind"
      :data-state="isActive ? 'active' : 'idle'"
      :data-disabled="disabled || null"
      :data-invalid="invalid || null"
      :role="isInline ? 'group' : undefined"
      :aria-disabled="isInline && disabled ? 'true' : undefined"
      :aria-labelledby="isInline ? titleId : undefined"
      :aria-describedby="isInline && description ? descriptionId : undefined"
      :aria-hidden="isInline ? undefined : 'true'"
      class="group flex flex-col rounded-(--shape-card) data-[kind=inline]:w-full data-[kind=inline]:border data-[kind=inline]:border-dashed data-[kind=inline]:border-(--border-strong) data-[kind=inline]:bg-(--bg-surface) data-[kind=inline]:p-(--spacing-lg) data-[kind=inline]:transition-[background-color,border-color] data-[kind=inline]:duration-fast-02 data-[kind=inline]:ease-productive-entrance motion-reduce:transition-none data-[kind=inline]:data-[state=active]:border-(--border-selected) data-[kind=inline]:data-[state=active]:bg-(--bg-selected) data-[kind=inline]:data-[state=idle]:data-[invalid]:not-data-[disabled]:border-(--danger-border) data-[kind=inline]:data-[disabled]:border-(--border-default) data-[kind=inline]:data-[disabled]:bg-(--bg-disabled) data-[disabled]:cursor-not-allowed data-[kind=overlay]:absolute data-[kind=overlay]:inset-0 data-[kind=overlay]:border-2 data-[kind=overlay]:border-dashed data-[kind=overlay]:border-(--border-selected) data-[kind=overlay]:bg-(--bg-canvas) data-[kind=overlay]:data-[state=idle]:pointer-events-none"
      @dragenter="onRootDragEnter"
      @dragleave="onRootDragLeave"
      @dragover="onRootDragOver"
      @drop="onRootDrop"
    >
      <div
        class="flex w-full flex-col items-center justify-center gap-(--spacing-md) text-center group-data-[kind=overlay]:sticky group-data-[kind=overlay]:top-0 group-data-[kind=overlay]:h-dvh group-data-[kind=overlay]:max-h-full group-data-[kind=overlay]:p-(--spacing-lg)"
      >
        <span
          class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised)"
          aria-hidden="true"
        >
          <i
            :class="icon"
            class="text-body-lg text-(--text-default) group-data-[disabled]:text-(--text-disabled)"
            aria-hidden="true"
          />
        </span>

        <div class="flex max-w-(--container-md) flex-col items-center gap-(--spacing-xxs)">
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
