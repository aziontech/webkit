<script setup lang="ts">
  import { useResizeObserver } from '@vueuse/core'
  import { computed, nextTick, ref, useAttrs, useId, watch } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Button from '../../action/button/button.vue'
  import IconButton from '../../action/icon-button/icon-button.vue'

  defineOptions({
    name: 'PromptQueue',
    inheritAttrs: false
  })

  export interface PromptQueueItem {
    /** The queued message id, returned in `remove`. */
    id: string
    /** The message text; the text parts joined when the message is multimodal. */
    text: string
    /** Number of non-text parts (images, audio, video, documents), shown when above zero; missing means 0. */
    attachmentCount?: number
  }

  export interface PromptQueueProps {
    /** The waiting messages, in the order they will be sent. */
    items?: PromptQueueItem[]
    /** Accessible name of the list. Empty uses the locale catalog (`Queued messages`). */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<PromptQueueProps>(), {
    items: () => [],
    ariaLabel: ''
  })

  const emit = defineEmits<{
    /** The reader removed a waiting message by pointer or keyboard; cancel it by id. */
    remove: [event: MouseEvent, item: PromptQueueItem]
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ promptQueue: en.promptQueue })
  const baseId = useId()

  const listEl = ref<HTMLOListElement | null>(null)
  const announcement = ref('')
  const textEls = new Map<string, HTMLElement>()
  const clamped = ref<string[]>([])
  const expanded = ref<string[]>([])

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'prompt-queue'
  )

  watch(
    () => props.items.map((item) => item.id),
    async (next, previous) => {
      if (next.length !== previous.length) {
        announcement.value =
          next.length > 0 ? t('promptQueue.title', { count: next.length }) : t('promptQueue.empty')
      }

      const list = listEl.value
      const removeSelector = `[data-testid="${testId.value}__remove"]`
      const buttons = list ? Array.from(list.querySelectorAll<HTMLElement>(removeSelector)) : []
      const active = document.activeElement
      const focusedIndex = buttons.findIndex((button) => button === active)
      if (focusedIndex < 0) return

      const focused = buttons[focusedIndex]
      await nextTick()
      if (focused.isConnected || next.length === 0 || !listEl.value) return

      const remaining = listEl.value.querySelectorAll<HTMLElement>(removeSelector)
      remaining[Math.min(focusedIndex, remaining.length - 1)]?.focus()
    },
    { flush: 'pre' }
  )

  function textId(index: number): string {
    return `${baseId}-text-${index}`
  }

  function setTextEl(id: string, element: unknown): void {
    if (element instanceof HTMLElement) textEls.set(id, element)
    else textEls.delete(id)
  }

  function measure(): void {
    clamped.value = props.items
      .filter((item) => {
        const element = textEls.get(item.id)
        return element !== undefined && element.scrollHeight > element.clientHeight + 1
      })
      .map((item) => item.id)
  }

  function isOpen(id: string): boolean {
    return expanded.value.includes(id)
  }

  function onToggle(id: string): void {
    expanded.value = isOpen(id)
      ? expanded.value.filter((entry) => entry !== id)
      : [...expanded.value, id]
  }

  useResizeObserver(listEl, measure)
  watch(
    () => props.items.map((item) => `${item.id}:${item.text}`),
    () => {
      expanded.value = expanded.value.filter((id) => props.items.some((item) => item.id === id))
      measure()
    },
    { flush: 'post' }
  )

  function onRemove(event: MouseEvent, item: PromptQueueItem): void {
    emit('remove', event, item)
  }

  const BOX_CLASS =
    'flex flex-col gap-(--spacing-2xs) rounded-(--shape-card) border border-(--border-default) px-(--spacing-sm) py-(--spacing-xs) ' +
    'bg-[color-mix(in_srgb,var(--bg-surface-raised)_88%,transparent)] backdrop-blur-md'
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-empty="items.length === 0 || null"
    class="flex flex-col"
  >
    <p
      role="status"
      class="sr-only"
      :data-testid="`${testId}__status`"
    >
      {{ announcement }}
    </p>
    <div
      v-if="items.length"
      :class="BOX_CLASS"
    >
      <p
        class="flex items-center gap-(--spacing-2xs) text-label-sm text-(--text-muted)"
        :data-testid="`${testId}__title`"
      >
        <i
          class="az az-clock"
          aria-hidden="true"
        />
        {{ t('promptQueue.title', { count: items.length }) }}
      </p>
      <ol
        ref="listEl"
        :aria-label="ariaLabel || t('promptQueue.label')"
        class="m-0 flex list-none flex-col gap-(--spacing-2xs) p-0"
        :data-testid="`${testId}__list`"
      >
        <li
          v-for="(item, index) in items"
          :key="item.id"
          :data-testid="`${testId}__item`"
          class="flex items-center gap-(--spacing-xs)"
        >
          <div class="flex min-w-0 flex-1 flex-col">
            <span
              :id="textId(index)"
              :ref="(element) => setTextEl(item.id, element)"
              dir="auto"
              :data-state="isOpen(item.id) ? 'open' : 'closed'"
              :data-testid="`${testId}__text`"
              class="wrap-anywhere text-start text-body-md text-(--text-default) data-[state=closed]:line-clamp-2"
            >
              {{ item.text }}
            </span>
            <Button
              v-if="isOpen(item.id) || clamped.includes(item.id)"
              variant="link"
              size="small"
              class="self-start"
              :label="isOpen(item.id) ? t('promptQueue.showLess') : t('promptQueue.showMore')"
              :aria-expanded="isOpen(item.id) ? 'true' : 'false'"
              :aria-controls="textId(index)"
              :data-testid="`${testId}__toggle`"
              @click="onToggle(item.id)"
            />
            <span
              v-if="(item.attachmentCount ?? 0) > 0"
              class="inline-flex items-center gap-(--spacing-2xs) text-label-sm text-(--text-muted)"
              :data-testid="`${testId}__attachments`"
            >
              <i
                class="az az-paperclip"
                aria-hidden="true"
              />
              {{ t('promptQueue.attachments', { count: item.attachmentCount ?? 0 }) }}
            </span>
          </div>
          <IconButton
            icon="az az-x"
            variant="ghost"
            size="small"
            class="shrink-0"
            :aria-label="t('promptQueue.remove')"
            :aria-describedby="textId(index)"
            :data-testid="`${testId}__remove`"
            @click="(event: MouseEvent) => onRemove(event, item)"
          />
        </li>
      </ol>
    </div>
  </div>
</template>
