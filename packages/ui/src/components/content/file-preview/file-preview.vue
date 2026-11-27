<script setup lang="ts">
  import { computed, onMounted, onScopeDispose, ref, useAttrs, useId, watch } from 'vue'

  import { useLocale } from '../../../composables/use-locale/use-locale'
  import * as en from '../../../locales/en'
  import { safeHref } from '../../../utils/safe-href'
  import Button from '../../action/button/button.vue'
  import EmptyState from '../../feedback/empty-state/empty-state.vue'
  import Skeleton from '../../feedback/skeleton/skeleton.vue'
  import {
    decodeBase64,
    decodeBase64Text,
    extensionOf,
    filePreviewType,
    formatJson
  } from './lib/file-type'

  export type { FilePreviewType } from './lib/file-type'

  defineOptions({
    name: 'FilePreview',
    inheritAttrs: false
  })

  export interface FilePreviewProps {
    /** Name of the file, shown in the header and used as the image's alternative text. */
    fileName: string
    /** Media type of the file (`image/png`, `application/json`). Empty reads the type from the file extension. */
    mimeType?: string
    /** Size of the whole file in bytes, shown beside the type. Unset hides the size. */
    bytes?: number
    /** URL of an image or PDF file to draw: https, http, blob, data or a relative path; any other scheme draws nothing. Set, it wins over `base64`. */
    src?: string
    /**
     * Base64 bytes of the file, for an app that holds the file rather than a URL. Text and JSON
     * are decoded into the body when `content` is empty; an image or PDF with no `src` is drawn
     * from them.
     */
    base64?: string
    /** Text of a text or JSON file. JSON that parses is pretty-printed; JSON that does not shows as text. Set, it wins over `base64`. */
    content?: string
    /** Characters of text shown before the rest is cut, with a note that says how much is shown. */
    maxLength?: number
    /** Shows a placeholder in the body while the app fetches the file; the header stays. */
    loading?: boolean
    /** Why the preview could not load. Set, the body shows the error state with this text. */
    error?: string
  }

  const props = withDefaults(defineProps<FilePreviewProps>(), {
    mimeType: '',
    bytes: undefined,
    src: '',
    base64: '',
    content: '',
    maxLength: 20000,
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    /** The Download button was pressed; the app starts the download. */
    download: [event: MouseEvent]
  }>()

  defineSlots<{
    /** More actions in the header, before Download (copy link, delete). */
    actions(): unknown
  }>()

  const attrs = useAttrs()
  const { t, formatFileSize, formatNumber } = useLocale({ filePreview: en.filePreview })
  const nameId = useId()

  const imageFailed = ref(false)
  const mounted = ref(false)
  const pdfViewer = ref(false)
  const objectUrl = ref('')

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'file-preview'
  )

  const declaredType = computed(() => filePreviewType(props.mimeType, props.fileName))

  const safeSrc = computed(() => safeHref(props.src, true) ?? '')
  const drawnSrc = computed(() => safeSrc.value || objectUrl.value)

  const shownType = computed(() =>
    declaredType.value === 'image' && (!drawnSrc.value || imageFailed.value)
      ? 'unknown'
      : declaredType.value
  )

  const pdfShown = computed(
    () => shownType.value === 'pdf' && mounted.value && pdfViewer.value && !!drawnSrc.value
  )

  const sourceText = computed(() =>
    props.content || !props.base64 ? props.content : decodeBase64Text(props.base64)
  )

  const text = computed(() =>
    shownType.value === 'json' ? formatJson(sourceText.value) : sourceText.value
  )

  const truncated = computed(() => text.value.length > props.maxLength)

  const visibleText = computed(() =>
    truncated.value ? text.value.slice(0, Math.max(0, props.maxLength)) : text.value
  )

  const icon = computed(() =>
    shownType.value === 'image'
      ? 'az az-image'
      : shownType.value === 'pdf'
        ? 'az az-file-pdf'
        : shownType.value === 'audio'
          ? 'az az-headphones'
          : shownType.value === 'video'
            ? 'az az-video'
            : shownType.value === 'json'
              ? 'az az-json'
              : 'az az-file'
  )

  const kind = computed(() => props.mimeType || extensionOf(props.fileName).toUpperCase())

  const size = computed(() => (typeof props.bytes === 'number' ? formatFileSize(props.bytes) : ''))

  const truncationNote = computed(() =>
    t('filePreview.truncated', { shown: formatNumber(visibleText.value.length) })
  )

  function releaseObjectUrl() {
    if (objectUrl.value) URL.revokeObjectURL(objectUrl.value)
    objectUrl.value = ''
  }

  function makeObjectUrl() {
    releaseObjectUrl()
    if (!mounted.value || safeSrc.value || !props.base64) return
    if (declaredType.value !== 'image' && declaredType.value !== 'pdf') return
    const bytes = decodeBase64(props.base64)
    if (!bytes) return
    const type = props.mimeType || (declaredType.value === 'pdf' ? 'application/pdf' : '')
    objectUrl.value = URL.createObjectURL(new Blob([bytes], { type }))
  }

  watch(
    () => [props.src, props.base64],
    () => {
      imageFailed.value = false
    }
  )

  watch(
    () => [mounted.value, props.src, props.base64, props.mimeType, declaredType.value],
    makeObjectUrl
  )

  onMounted(() => {
    pdfViewer.value = navigator.pdfViewerEnabled !== false
    mounted.value = true
  })

  onScopeDispose(releaseObjectUrl)

  const TEXT_CLASS =
    'm-0 min-h-0 flex-1 overflow-auto whitespace-pre-wrap break-words p-(--spacing-md) text-start text-body-code-sm text-(--text-default) ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color)'
</script>

<template>
  <section
    v-bind="$attrs"
    :data-testid="testId"
    :data-type="shownType"
    :data-loading="loading || null"
    :data-truncated="(!loading && !error && truncated) || null"
    :aria-labelledby="nameId"
    :aria-busy="loading || undefined"
    class="flex min-w-0 flex-col overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface)"
  >
    <header
      class="flex min-w-0 items-center gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
    >
      <i
        :class="icon"
        aria-hidden="true"
        class="shrink-0 text-(--text-muted)"
      />
      <div class="flex min-w-0 flex-1 flex-col">
        <p
          :id="nameId"
          :data-testid="`${testId}__name`"
          class="truncate text-label-md text-(--text-default)"
        >
          <bdi>{{ fileName }}</bdi>
        </p>
        <p
          v-if="kind || size"
          :data-testid="`${testId}__meta`"
          class="flex min-w-0 text-body-xs text-(--text-muted)"
        >
          <bdi class="flex min-w-0">
            <span
              v-if="kind"
              class="truncate"
              >{{ kind }}</span
            ><span
              v-if="kind && size"
              class="shrink-0 whitespace-pre"
              >{{ ' · ' }}</span
            ><span
              v-if="size"
              class="shrink-0 whitespace-nowrap"
              >{{ size }}</span
            >
          </bdi>
        </p>
      </div>
      <div class="flex shrink-0 items-center gap-(--spacing-xs)">
        <slot name="actions" />
        <Button
          :data-testid="`${testId}__download`"
          :label="t('filePreview.download')"
          variant="outline"
          size="small"
          icon="az az-download"
          @click="emit('download', $event)"
        />
      </div>
    </header>

    <div
      class="flex min-h-0 flex-1 flex-col bg-(--bg-canvas)"
      :data-testid="`${testId}__body`"
    >
      <div
        v-if="loading"
        role="status"
        :aria-label="t('filePreview.loading')"
        class="flex flex-col gap-(--spacing-xs) p-(--spacing-md)"
      >
        <Skeleton
          width="60%"
          height="0.875rem"
        />
        <Skeleton
          width="90%"
          height="0.875rem"
        />
        <Skeleton
          width="75%"
          height="0.875rem"
        />
      </div>
      <EmptyState
        key="empty-state-1"
        v-else-if="error"
        :data-testid="`${testId}__error`"
        :title="t('filePreview.error')"
        :description="error"
        icon="az az-triangle-alert"
        size="small"
      />
      <div
        v-else-if="shownType === 'image'"
        class="flex items-center justify-center p-(--spacing-md)"
      >
        <img
          :data-testid="`${testId}__image`"
          :src="drawnSrc"
          :alt="fileName"
          class="max-h-(--container-xs) max-w-full object-contain"
          @error="imageFailed = true"
        />
      </div>
      <object
        v-else-if="pdfShown"
        :data-testid="`${testId}__document`"
        :data="drawnSrc"
        type="application/pdf"
        :title="t('filePreview.document', { name: fileName })"
        :aria-label="t('filePreview.document', { name: fileName })"
        class="block h-(--container-lg) w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color)"
      >
        <EmptyState
          :data-testid="`${testId}__unsupported`"
          :title="t('filePreview.noPreview')"
          :description="t('filePreview.noPreviewDetail')"
          icon="az az-file-pdf"
          size="small"
        />
      </object>
      <EmptyState
        key="empty-state-2"
        v-else-if="['unknown', 'pdf', 'audio', 'video'].includes(shownType)"
        :data-testid="`${testId}__unsupported`"
        :title="t('filePreview.noPreview')"
        :description="t('filePreview.noPreviewDetail')"
        :icon="icon"
        size="small"
      />
      <p
        v-else-if="!text"
        :data-testid="`${testId}__empty`"
        class="p-(--spacing-md) text-body-sm text-(--text-muted)"
      >
        {{ t('filePreview.empty') }}
      </p>
      <template v-else>
        <pre
          :data-testid="`${testId}__text`"
          role="region"
          tabindex="0"
          dir="auto"
          :aria-label="t('filePreview.contents', { name: fileName })"
          :class="TEXT_CLASS"
          >{{ visibleText }}</pre>
        <p
          v-if="truncated"
          :data-testid="`${testId}__truncated`"
          class="border-t border-(--border-default) px-(--spacing-md) py-(--spacing-xs) text-body-xs text-(--text-muted)"
        >
          {{ truncationNote }}
        </p>
      </template>
    </div>
  </section>
</template>
