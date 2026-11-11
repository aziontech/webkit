<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import Button from '../../actions/button/button.vue'
  import CopyButton from '../../actions/copy-button/copy-button.vue'
  import IconButton from '../../actions/icon-button/icon-button.vue'

  defineOptions({
    name: 'ArtifactPreview',
    inheritAttrs: false
  })

  interface Props {
    /** File name or title of what was generated (`cache-rules.json`). */
    title: string
    /** One line on what it is or does. */
    description?: string
    /** Facts that help recognize it: size, rows, language (`2.4 KB · JSON`). */
    meta?: string
    /** Icon class for the file type. */
    icon?: string
    /** Text the Copy control puts on the clipboard. Empty hides Copy. */
    copyValue?: string
    /** URL of the file for the Download control. Empty hides Download. */
    downloadHref?: string
    /** Shows Open, which emits `open` so the owner shows the full artifact in a side panel or page (a canvas preview). */
    openable?: boolean
  }

  withDefaults(defineProps<Props>(), {
    description: '',
    meta: '',
    icon: 'pi pi-file',
    copyValue: '',
    downloadHref: '',
    openable: false
  })

  const emit = defineEmits<{
    /** The reader asked to see the whole artifact. */
    open: []
    /** The content was copied; the payload is the copied text. */
    copy: [value: string]
  }>()

  const slots = defineSlots<{
    /** The inline preview: a `CodeBlock`, the first rows of a table, an image. Keep it short; long content opens instead. */
    default?(): unknown
    /** Extra icon actions, placed before Copy and Download. */
    actions?(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ artifactPreview: en.artifactPreview })
  const titleId = `${useId()}-title`

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'ai-artifact-preview'
  )
</script>

<template>
  <article
    v-bind="$attrs"
    :aria-labelledby="titleId"
    :data-testid="testId"
    :data-openable="openable || null"
    class="flex w-full min-w-0 flex-col overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface)"
  >
    <header class="flex items-center gap-(--spacing-sm) px-(--spacing-sm) py-(--spacing-xs)">
      <span
        aria-hidden="true"
        class="inline-flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) bg-(--bg-surface-raised) text-(--text-muted)"
      >
        <i :class="icon" />
      </span>
      <div class="flex min-w-0 flex-1 flex-col">
        <h3
          :id="titleId"
          dir="auto"
          class="m-0 truncate text-label-md text-(--text-default)"
        >
          {{ title }}
        </h3>
        <p
          v-if="description || meta"
          class="m-0 truncate text-body-xs text-(--text-muted)"
        >
          <span v-if="description">{{ description }}</span>
          <span
            v-if="description && meta"
            aria-hidden="true"
          >
            ·
          </span>
          <span v-if="meta">{{ meta }}</span>
        </p>
      </div>
      <div class="flex shrink-0 items-center gap-(--spacing-xxs)">
        <slot name="actions" />
        <CopyButton
          v-if="copyValue"
          :value="copyValue"
          :aria-label="t('artifactPreview.copy', { title })"
          :data-testid="`${testId}__copy`"
          @copy="emit('copy', $event)"
        />
        <IconButton
          v-if="downloadHref"
          icon="pi pi-download"
          kind="transparent"
          size="small"
          :href="downloadHref"
          :ariaLabel="t('artifactPreview.download', { title })"
          :download="title"
          :data-testid="`${testId}__download`"
        />
        <Button
          v-if="openable"
          :label="t('artifactPreview.open')"
          :aria-label="t('artifactPreview.openLabel', { title })"
          kind="outlined"
          size="small"
          icon="pi pi-external-link"
          icon-position="trailing"
          :data-testid="`${testId}__open`"
          @click="emit('open')"
        />
      </div>
    </header>
    <div
      v-if="slots.default"
      tabindex="0"
      :data-testid="`${testId}__content`"
      class="max-h-80 min-w-0 overflow-auto border-t border-(--border-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset"
    >
      <slot />
    </div>
  </article>
</template>
