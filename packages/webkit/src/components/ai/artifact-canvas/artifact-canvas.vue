<script setup lang="ts">
  import { computed, ref, useAttrs, useId } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import CopyButton from '../../actions/copy-button/copy-button.vue'
  import IconButton from '../../actions/icon-button/icon-button.vue'
  import ResponseBranches from '../response-branches/response-branches.vue'

  export type ArtifactCanvasKind = 'code' | 'table' | 'document'

  defineOptions({
    name: 'ArtifactCanvas',
    inheritAttrs: false
  })

  interface Props {
    /** File name or title of the artifact (`top-orders.sql`); names the panel. */
    title: string
    /** Facts that help recognize it, after the title: language, size, rows (`SQL · 12 lines`). */
    meta?: string
    /** What the artifact is; picks the icon and `data-kind`. The body is always the owner's slot. */
    kind?: ArtifactCanvasKind
    /** How many versions exist. With more than one, the toolbar shows the `ResponseBranches` pager. */
    versions?: number
    /** Text the Copy control puts on the clipboard, of the version shown. Empty hides Copy. */
    copyValue?: string
    /** URL of the version shown, for Download (`download` takes the title). Empty hides Download. */
    downloadHref?: string
    /** A new version is being generated: the pager locks, the body is `aria-busy` and a polite status says so. */
    streaming?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    meta: '',
    kind: 'document',
    versions: 1,
    copyValue: '',
    downloadHref: '',
    streaming: false
  })

  const version = defineModel<number>('version', { default: 0 })

  const emit = defineEmits<{
    /** Close was pressed, or Escape inside the panel that no inner control handled. */
    close: []
    /** Copy put the text on the clipboard; the payload is the copied text. */
    copy: [value: string]
  }>()

  const slots = defineSlots<{
    /** The artifact of the version shown: a `CodeBlock`, a `TableRoot`, prose. Scrolls inside. */
    default?(props: { version: number }): unknown
    /** Extra icon actions in the toolbar, before Copy and Download (Insert into editor, Run). */
    actions?(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ artifactCanvas: en.artifactCanvas })
  const titleId = `${useId()}-title`
  const heading = ref<HTMLElement | null>(null)

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'ai-artifact-canvas'
  )
  const icon = computed<string>(
    () =>
      ({ code: 'pi pi-code', table: 'pi pi-table', document: 'pi pi-file' })[props.kind] ??
      'pi pi-file'
  )
  const hasToolbar = computed<boolean>(
    () => props.versions > 1 || !!props.copyValue || !!props.downloadHref || !!slots.actions
  )

  function onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape' || event.defaultPrevented) return
    event.preventDefault()
    emit('close')
  }

  function focus(): void {
    heading.value?.focus()
  }

  defineExpose({ focus })
</script>

<template>
  <section
    v-bind="$attrs"
    :aria-labelledby="titleId"
    :data-testid="testId"
    :data-kind="kind"
    :data-streaming="streaming || null"
    class="flex h-full w-full min-w-0 flex-col overflow-hidden border-s border-(--border-default) bg-(--bg-surface)"
    @keydown="onKeydown"
  >
    <header
      class="flex items-center gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
    >
      <span
        aria-hidden="true"
        class="inline-flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) bg-(--bg-surface-raised) text-(--text-muted)"
      >
        <i :class="icon" />
      </span>
      <div class="flex min-w-0 flex-1 flex-col">
        <h2
          :id="titleId"
          ref="heading"
          tabindex="-1"
          dir="auto"
          :data-testid="`${testId}__title`"
          class="m-0 truncate rounded-(--shape-elements) text-label-md text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
        >
          {{ title }}
        </h2>
        <p
          v-if="meta"
          class="m-0 truncate text-body-xs text-(--text-muted)"
        >
          {{ meta }}
        </p>
      </div>
      <IconButton
        icon="pi pi-times"
        kind="transparent"
        size="small"
        :ariaLabel="t('artifactCanvas.close', { title })"
        :data-testid="`${testId}__close`"
        @click="emit('close')"
      />
    </header>
    <div
      v-if="hasToolbar"
      :data-testid="`${testId}__toolbar`"
      class="flex flex-wrap items-center justify-between gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-xxs)"
    >
      <ResponseBranches
        v-model="version"
        :count="versions"
        :label="t('artifactCanvas.versions')"
        :disabled="streaming"
        :data-testid="`${testId}__versions`"
      />
      <div class="ms-auto flex shrink-0 items-center gap-(--spacing-xxs)">
        <slot name="actions" />
        <CopyButton
          v-if="copyValue"
          :value="copyValue"
          :aria-label="t('artifactCanvas.copy', { title })"
          :data-testid="`${testId}__copy`"
          @copy="emit('copy', $event)"
        />
        <IconButton
          v-if="downloadHref"
          icon="pi pi-download"
          kind="transparent"
          size="small"
          :href="downloadHref"
          :ariaLabel="t('artifactCanvas.download', { title })"
          :download="title"
          :data-testid="`${testId}__download`"
        />
      </div>
    </div>
    <div
      role="region"
      tabindex="0"
      :aria-label="t('artifactCanvas.content', { title })"
      :aria-busy="streaming || undefined"
      :data-testid="`${testId}__content`"
      class="min-h-0 flex-1 overflow-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset"
    >
      <slot :version="version" />
    </div>
    <div
      aria-live="polite"
      class="sr-only"
      :data-testid="`${testId}__status`"
    >
      {{ streaming ? t('artifactCanvas.streaming') : '' }}
    </div>
  </section>
</template>
