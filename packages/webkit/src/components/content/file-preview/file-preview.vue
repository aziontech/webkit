<script setup lang="ts">
  import { computed, ref, useAttrs, useId, watch } from 'vue'

  import { useLocale } from '../../../composables/use-locale/use-locale'
  import * as en from '../../../locales/en'
  import Button from '../../action/button/button.vue'
  import EmptyState from '../../feedback/empty-state/empty-state.vue'
  import Skeleton from '../../feedback/skeleton/skeleton.vue'
  import { extensionOf, filePreviewType, formatJson } from './lib/file-type'

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
    /** URL of an image file to draw. An image with no `src` shows the no-preview state. */
    src?: string
    /** Text of a text or JSON file. JSON that parses is pretty-printed; JSON that does not shows as text. */
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

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'file-preview'
  )

  const declaredType = computed(() => filePreviewType(props.mimeType, props.fileName))

  const shownType = computed(() =>
    declaredType.value === 'image' && (!props.src || imageFailed.value)
      ? 'unknown'
      : declaredType.value
  )

  const text = computed(() =>
    shownType.value === 'json' ? formatJson(props.content) : props.content
  )

  const truncated = computed(() => text.value.length > props.maxLength)

  const visibleText = computed(() =>
    truncated.value ? text.value.slice(0, Math.max(0, props.maxLength)) : text.value
  )

  const icon = computed(() =>
    shownType.value === 'image'
      ? 'ai ai-image'
      : shownType.value === 'json'
        ? 'ai ai-json'
        : 'ai ai-file'
  )

  const meta = computed(() =>
    [
      props.mimeType || extensionOf(props.fileName).toUpperCase(),
      typeof props.bytes === 'number' ? formatFileSize(props.bytes) : ''
    ]
      .filter(Boolean)
      .join(' · ')
  )

  const truncationNote = computed(() =>
    t('filePreview.truncated', { shown: formatNumber(visibleText.value.length) })
  )

  watch(
    () => props.src,
    () => {
      imageFailed.value = false
    }
  )
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
          v-if="meta"
          :data-testid="`${testId}__meta`"
          class="truncate text-body-xs text-(--text-muted)"
        >
          {{ meta }}
        </p>
      </div>
      <div class="flex shrink-0 items-center gap-(--spacing-xs)">
        <slot name="actions" />
        <Button
          :data-testid="`${testId}__download`"
          :label="t('filePreview.download')"
          variant="outline"
          size="small"
          icon="ai ai-download"
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
        icon="ai ai-triangle-alert"
        size="small"
      />
      <div
        v-else-if="shownType === 'image'"
        class="flex items-center justify-center p-(--spacing-md)"
      >
        <img
          :data-testid="`${testId}__image`"
          :src="src"
          :alt="fileName"
          class="max-h-(--container-xs) max-w-full object-contain"
          @error="imageFailed = true"
        />
      </div>
      <EmptyState
        key="empty-state-2"
        v-else-if="shownType === 'unknown'"
        :data-testid="`${testId}__unsupported`"
        :title="t('filePreview.noPreview')"
        :description="t('filePreview.noPreviewDetail')"
        icon="ai ai-file"
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
          class="m-0 min-h-0 flex-1 overflow-auto whitespace-pre-wrap break-words p-(--spacing-md) text-start text-body-code-sm text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color)"
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
