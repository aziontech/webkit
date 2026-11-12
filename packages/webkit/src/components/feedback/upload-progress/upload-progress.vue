<script setup lang="ts">
  import { computed, useAttrs, useId, useSlots } from 'vue'

  import { useLocale } from '../../../composables/use-locale/use-locale'
  import * as en from '../../../i18n/messages/en'
  import Button from '../../actions/button/button.vue'
  import IconButton from '../../actions/icon-button/icon-button.vue'
  import OutcomeMark from '../outcome-mark/outcome-mark.vue'
  import Progress from '../progress/progress.vue'

  export type UploadProgressOperation = 'upload' | 'move' | 'delete'

  export type UploadProgressStatus = 'queued' | 'running' | 'done' | 'error' | 'canceled'

  export interface UploadProgressItem {
    id: string
    name: string
    size?: number
    progress?: number
    status: UploadProgressStatus
    error?: string
  }

  defineOptions({ name: 'UploadProgress', inheritAttrs: false })

  interface Props {
    /** The files in the transfer, in order, with their state and progress. */
    items?: UploadProgressItem[]
    /** What the transfer does; picks the header wording and the glyph. */
    operation?: UploadProgressOperation
    /** Overrides the header text. Empty builds it from the operation and the counts. */
    title?: string
    /** Fixes the card to the inline-end bottom corner of the viewport; false renders it in the flow. */
    floating?: boolean
    /** Shows Cancel on running and waiting files and Cancel all in the header. */
    cancelable?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    operation: 'upload',
    title: '',
    floating: true,
    cancelable: true
  })

  const collapsed = defineModel<boolean>('collapsed', { default: false })

  const emit = defineEmits<{
    /** Cancel on one file (its `id`) or Cancel all (no `id`). The parent stops the transfer. */
    cancel: [id?: string]
    /** Retry on one failed file (its `id`) or Retry failed (no `id`). */
    retry: [id?: string]
    /** Close was pressed; offered only once every file has finished. */
    close: []
  }>()

  defineSlots<{
    /** Buttons for the finished transfer beside Close (for example `Open folder`). Shown when done. */
    actions(): unknown
  }>()

  const attrs = useAttrs()
  const slots = useSlots()
  const { t, formatFileSize, formatNumber } = useLocale({ uploadProgress: en.uploadProgress })
  const listId = useId()
  const titleId = useId()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'feedback-upload-progress'
  )
  const rootAttrs = computed(() =>
    Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'data-testid'))
  )

  const isFinished = (item: UploadProgressItem): boolean =>
    item.status === 'done' || item.status === 'error' || item.status === 'canceled'

  const total = computed<number>(() => props.items.length)
  const finished = computed<number>(() => props.items.filter(isFinished).length)
  const succeeded = computed<number>(
    () => props.items.filter((item) => item.status === 'done').length
  )
  const failed = computed<number>(
    () => props.items.filter((item) => item.status === 'error').length
  )

  const state = computed<'running' | 'done' | 'failed'>(() =>
    finished.value < total.value ? 'running' : failed.value > 0 ? 'failed' : 'done'
  )

  const percent = computed<number>(() => {
    if (!total.value) return 0
    const sum = props.items.reduce(
      (acc, item) =>
        acc + (isFinished(item) ? 100 : Math.min(100, Math.max(0, item.progress ?? 0))),
      0
    )
    return Math.round(sum / total.value)
  })

  const RUNNING_KEY = { upload: 'uploading', move: 'moving', delete: 'deleting' } as const
  const DONE_KEY = { upload: 'uploaded', move: 'moved', delete: 'deleted' } as const
  const GLYPH = {
    upload: 'pi pi-upload',
    move: 'pi pi-arrow-right-arrow-left',
    delete: 'pi pi-trash'
  } as const

  const heading = computed<string>(() => {
    if (props.title) return props.title
    if (state.value === 'running') {
      return t(`uploadProgress.${RUNNING_KEY[props.operation]}`, {
        done: finished.value,
        count: total.value
      })
    }
    const outcome = t(`uploadProgress.${DONE_KEY[props.operation]}`, { count: succeeded.value })
    return failed.value
      ? `${outcome}, ${t('uploadProgress.failed', { count: failed.value })}`
      : outcome
  })

  const percentText = computed<string>(() =>
    formatNumber(percent.value / 100, { style: 'percent' })
  )

  const rowStatusText = (item: UploadProgressItem): string => {
    if (item.status === 'queued') return t('uploadProgress.queued')
    if (item.status === 'done') return t('uploadProgress.done')
    if (item.status === 'canceled') return t('uploadProgress.canceled')
    if (item.status === 'running' && typeof item.progress === 'number') {
      return formatNumber(item.progress / 100, { style: 'percent' })
    }
    return ''
  }

  const showActions = () => state.value !== 'running' && Boolean(slots['actions'])
</script>

<template>
  <section
    v-bind="rootAttrs"
    :aria-label="t('uploadProgress.label')"
    :data-testid="testId"
    :data-state="state"
    :data-floating="floating || null"
    :data-collapsed="collapsed || null"
    class="group/up z-40 flex w-full flex-col gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised) p-(--spacing-md) shadow-(--shadow-sm) animate-popup-scale-in motion-reduce:animate-none data-[floating]:fixed data-[floating]:inset-x-(--spacing-md) data-[floating]:bottom-(--spacing-md) sm:data-[floating]:inset-x-auto sm:data-[floating]:end-(--spacing-md) sm:data-[floating]:w-(--container-xs)"
  >
    <span
      role="status"
      class="sr-only"
      >{{ heading }}</span
    >
    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
      <OutcomeMark
        v-if="state !== 'running'"
        :severity="state === 'done' ? 'success' : 'danger'"
        size="medium"
        animated
      />
      <i
        v-else
        :class="GLYPH[operation]"
        class="shrink-0 text-body-md text-(--text-muted)"
        aria-hidden="true"
      />
      <p
        :id="titleId"
        :data-testid="`${testId}__title`"
        class="m-0 min-w-0 flex-1 truncate text-label-md text-(--text-default)"
      >
        {{ heading }}
      </p>
      <span
        v-if="state === 'running'"
        class="shrink-0 text-label-sm text-(--text-muted)"
        >{{ percentText }}</span
      >
      <IconButton
        :icon="collapsed ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
        kind="transparent"
        size="small"
        :ariaLabel="collapsed ? t('uploadProgress.expand') : t('uploadProgress.collapse')"
        :aria-expanded="collapsed ? 'false' : 'true'"
        :aria-controls="listId"
        :data-testid="`${testId}__toggle`"
        @click="collapsed = !collapsed"
      />
      <IconButton
        v-if="state !== 'running'"
        icon="pi pi-times"
        kind="transparent"
        size="small"
        :ariaLabel="t('uploadProgress.close')"
        :data-testid="`${testId}__close`"
        @click="emit('close')"
      />
    </div>

    <Progress
      v-if="state === 'running'"
      :value="percent"
      size="small"
      shape="rounded"
      :aria-labelledby="titleId"
    />

    <ul
      v-show="!collapsed"
      :id="listId"
      role="list"
      :data-testid="`${testId}__list`"
      class="m-0 flex max-h-(--container-3xs) list-none flex-col gap-(--spacing-sm) overflow-y-auto p-0"
    >
      <li
        v-for="item in items"
        :key="item.id"
        :data-status="item.status"
        :data-testid="`${testId}__row`"
        class="flex min-w-0 flex-col gap-(--spacing-xxs)"
      >
        <div class="flex min-w-0 items-center gap-(--spacing-xs)">
          <div class="flex min-w-0 flex-1 flex-col">
            <span
              class="truncate text-label-sm text-(--text-default)"
              :title="item.name"
              ><bdi>{{ item.name }}</bdi></span
            >
            <span
              v-if="item.error"
              class="flex items-center gap-(--spacing-xxs) text-label-sm text-(--danger-contrast)"
            >
              <i
                class="pi pi-times-circle shrink-0"
                aria-hidden="true"
              />
              <span class="min-w-0">{{ item.error }}</span>
            </span>
            <span
              v-else
              class="truncate text-body-xs text-(--text-muted)"
              >{{
                [
                  typeof item.size === 'number' ? formatFileSize(item.size) : '',
                  rowStatusText(item)
                ]
                  .filter(Boolean)
                  .join(' · ')
              }}</span
            >
          </div>
          <IconButton
            key="icon-button-2"
            v-if="cancelable && (item.status === 'queued' || item.status === 'running')"
            icon="pi pi-times"
            kind="transparent"
            size="small"
            :ariaLabel="t('uploadProgress.cancelItem', { name: item.name })"
            :data-testid="`${testId}__cancel`"
            @click="emit('cancel', item.id)"
          />
          <IconButton
            key="icon-button-3"
            v-else-if="item.status === 'error'"
            icon="pi pi-refresh"
            kind="transparent"
            size="small"
            :ariaLabel="t('uploadProgress.retryItem', { name: item.name })"
            :data-testid="`${testId}__retry`"
            @click="emit('retry', item.id)"
          />
          <i
            v-else-if="item.status === 'done'"
            class="pi pi-check shrink-0 px-(--spacing-xs) text-(--text-muted)"
            aria-hidden="true"
          />
        </div>
        <Progress
          v-if="item.status === 'running'"
          :value="item.progress ?? 0"
          :indeterminate="typeof item.progress !== 'number'"
          size="small"
          shape="rounded"
          :aria-label="t('uploadProgress.itemProgress', { name: item.name })"
        />
      </li>
    </ul>

    <div
      v-if="(state === 'running' && cancelable) || state === 'failed' || showActions()"
      class="flex flex-wrap items-center justify-end gap-(--spacing-xs)"
    >
      <Button
        v-if="state === 'running' && cancelable"
        :label="t('uploadProgress.cancelAll')"
        kind="outlined"
        size="small"
        :data-testid="`${testId}__cancel-all`"
        @click="emit('cancel')"
      />
      <Button
        key="button-2"
        v-if="state === 'failed'"
        :label="t('uploadProgress.retryFailed')"
        icon="pi pi-refresh"
        kind="outlined"
        size="small"
        :data-testid="`${testId}__retry-failed`"
        @click="emit('retry')"
      />
      <slot
        v-if="state !== 'running'"
        name="actions"
      />
    </div>
  </section>
</template>
