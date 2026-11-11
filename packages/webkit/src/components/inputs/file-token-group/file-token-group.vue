<script setup lang="ts">
  import { computed, nextTick, ref, useAttrs, useId } from 'vue'

  import { useLocale } from '../../../composables/use-locale/use-locale'
  import * as en from '../../../i18n/messages/en'
  import Button from '../../actions/button/button.vue'
  import IconButton from '../../actions/icon-button/icon-button.vue'
  import Progress from '../../feedback/progress/progress.vue'

  export type FileTokenGroupAlignment = 'vertical' | 'horizontal'

  export interface FileTokenGroupFile {
    name: string
    size?: number
    type?: string
    lastModified?: number
  }

  export interface FileTokenGroupItem {
    file: File | FileTokenGroupFile
    loading?: boolean
    progress?: number
    error?: string
    warning?: string
  }

  defineOptions({ name: 'FileTokenGroup', inheritAttrs: false })

  interface Props {
    /** The files, in order; each with its optional upload state, error and warning. */
    items?: FileTokenGroupItem[]
    /** Vertical stacks full-width tokens; horizontal wraps compact tokens in rows. */
    alignment?: FileTokenGroupAlignment
    /** Shows this many tokens and a Show more toggle for the rest. 0 shows them all. */
    limit?: number
    /** Shows the size beside the name, formatted for the locale. */
    showFileSize?: boolean
    /** Shows the last-modified date, formatted for the locale. */
    showFileLastModified?: boolean
    /** Hides the remove buttons; the list is for reading only. */
    readonly?: boolean
    /** Accessible name of the list. Empty uses the locale catalog (`Files`). */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    alignment: 'vertical',
    limit: 0,
    showFileSize: true,
    showFileLastModified: false,
    readonly: false,
    ariaLabel: ''
  })

  const emit = defineEmits<{
    /** The remove button of the token at `index` was pressed. The parent removes it from `items`. */
    dismiss: [index: number, item: FileTokenGroupItem]
  }>()

  const attrs = useAttrs()
  const { t, formatFileSize, formatDate } = useLocale({ fileTokenGroup: en.fileTokenGroup })
  const baseId = useId()

  const root = ref<HTMLUListElement | null>(null)
  const expanded = ref(false)

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'input-file-token-group'
  )
  const rootAttrs = computed(() =>
    Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'data-testid'))
  )

  const hidden = computed<number>(() =>
    props.limit > 0 ? Math.max(0, props.items.length - props.limit) : 0
  )
  const visible = computed<FileTokenGroupItem[]>(() =>
    hidden.value > 0 && !expanded.value ? props.items.slice(0, props.limit) : props.items
  )

  const statusOf = (item: FileTokenGroupItem): string =>
    item.error ? 'error' : item.warning ? 'warning' : item.loading ? 'loading' : 'idle'

  const GLYPHS: Array<[RegExp, string]> = [
    [/^image\/|\.(png|jpe?g|gif|svg|webp|avif|ico)$/i, 'pi pi-image'],
    [/pdf$/i, 'pi pi-file-pdf'],
    [/^video\/|\.(mp4|webm|mov)$/i, 'pi pi-video'],
    [/(zip|tar|gzip|x-7z|rar)$|\.(zip|tar|gz|tgz|7z|rar)$/i, 'pi pi-box'],
    [
      /(json|javascript|typescript|html|css|xml|sql)$|\.(json|m?js|ts|vue|html|css|xml|sql|ya?ml)$/i,
      'pi pi-code'
    ],
    [/(csv|spreadsheet|excel)|\.(csv|xlsx?)$/i, 'pi pi-file-excel']
  ]
  const glyphOf = (file: FileTokenGroupFile): string => {
    for (const [pattern, glyph] of GLYPHS) {
      if (pattern.test(file.type ?? '') || pattern.test(file.name)) return glyph
    }
    return 'pi pi-file'
  }

  const metaOf = (file: FileTokenGroupFile): string => {
    const parts: string[] = []
    if (props.showFileSize && typeof file.size === 'number') parts.push(formatFileSize(file.size))
    if (props.showFileLastModified && typeof file.lastModified === 'number') {
      parts.push(
        t('fileTokenGroup.modified', {
          date: formatDate(file.lastModified, { dateStyle: 'medium' })
        })
      )
    }
    return parts.join(' · ')
  }

  const messageId = (index: number): string => `${baseId}-message-${index}`

  const focusAfterRemoval = async (index: number): Promise<void> => {
    await nextTick()
    const buttons = Array.from(
      root.value?.querySelectorAll<HTMLElement>(
        '[data-file-token-remove] button, [data-file-token-remove] a'
      ) ?? []
    )
    const target = buttons[index] ?? buttons[index - 1]
    if (target) target.focus()
    else root.value?.focus()
  }

  const onDismiss = (index: number): void => {
    const item = props.items[index]
    if (!item) return
    emit('dismiss', index, item)
    void focusAfterRemoval(index)
  }
</script>

<template>
  <div
    v-bind="rootAttrs"
    :data-testid="testId"
    :data-alignment="alignment"
    :data-readonly="readonly || null"
    class="group/ftg flex w-full flex-col gap-(--spacing-xs)"
  >
    <ul
      ref="root"
      role="list"
      tabindex="-1"
      :aria-label="ariaLabel || t('fileTokenGroup.label')"
      :data-testid="`${testId}__list`"
      class="m-0 flex list-none gap-(--spacing-xs) p-0 outline-none group-data-[alignment=vertical]/ftg:flex-col group-data-[alignment=horizontal]/ftg:flex-row group-data-[alignment=horizontal]/ftg:flex-wrap"
    >
      <li
        v-for="(item, index) in visible"
        :key="`${index}-${item.file.name}`"
        :data-testid="`${testId}__token`"
        :data-status="statusOf(item)"
        class="flex min-w-0 flex-col gap-(--spacing-xxs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-xs) transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none data-[status=warning]:border-(--warning-border) data-[status=error]:border-(--danger-border) group-data-[alignment=horizontal]/ftg:w-(--container-3xs) group-data-[alignment=horizontal]/ftg:max-w-full"
      >
        <div class="flex min-w-0 items-center gap-(--spacing-xs)">
          <i
            :class="glyphOf(item.file)"
            class="shrink-0 text-body-md text-(--text-muted)"
            aria-hidden="true"
          />
          <div class="flex min-w-0 flex-1 flex-col">
            <span
              class="truncate text-label-sm text-(--text-default)"
              :title="item.file.name"
              ><bdi>{{ item.file.name }}</bdi></span
            >
            <span
              v-if="metaOf(item.file)"
              :data-testid="`${testId}__meta`"
              class="truncate text-body-xs text-(--text-muted)"
              >{{ metaOf(item.file) }}</span
            >
          </div>
          <span
            v-if="!readonly"
            data-file-token-remove
            class="ms-auto flex shrink-0"
          >
            <IconButton
              icon="pi pi-times"
              kind="transparent"
              size="small"
              :ariaLabel="t('fileTokenGroup.remove', { name: item.file.name })"
              :aria-describedby="item.error || item.warning ? messageId(index) : undefined"
              :data-testid="`${testId}__remove`"
              @click="onDismiss(index)"
            />
          </span>
        </div>
        <Progress
          v-if="item.loading && !item.error"
          :value="item.progress ?? 0"
          :indeterminate="typeof item.progress !== 'number'"
          size="small"
          shape="rounded"
          :aria-label="t('fileTokenGroup.uploading', { name: item.file.name })"
        />
        <p
          v-if="item.error || item.warning"
          :id="messageId(index)"
          :data-testid="`${testId}__message`"
          :data-status="item.error ? 'error' : 'warning'"
          class="m-0 flex items-center gap-(--spacing-xxs) text-label-sm text-(--warning-contrast) data-[status=error]:text-(--danger-contrast)"
        >
          <i
            :class="item.error ? 'pi pi-times-circle' : 'pi pi-exclamation-triangle'"
            class="shrink-0"
            aria-hidden="true"
          />
          <span class="min-w-0">{{ item.error || item.warning }}</span>
        </p>
      </li>
    </ul>
    <div
      v-if="hidden > 0"
      class="flex"
    >
      <Button
        kind="transparent"
        size="small"
        :label="
          expanded ? t('fileTokenGroup.showFewer') : t('fileTokenGroup.showMore', { count: hidden })
        "
        :icon="expanded ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
        :aria-expanded="expanded ? 'true' : 'false'"
        :data-testid="`${testId}__toggle`"
        @click="expanded = !expanded"
      />
    </div>
  </div>
</template>
