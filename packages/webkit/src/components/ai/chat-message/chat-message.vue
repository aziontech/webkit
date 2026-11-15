<script setup lang="ts">
  import { computed, inject, onMounted, provide, ref, useAttrs, watch } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Button from '../../actions/button/button.vue'
  import Avatar from '../../content/avatar/avatar.vue'
  import AiLoading from '../ai-loading/ai-loading.vue'
  import { ConversationInjectionKey } from '../conversation/injection-key'
  import type { ChatMessageFrom, ChatMessageStatus } from './injection-key'
  import { ChatMessageInjectionKey } from './injection-key'

  export type { ChatMessageFrom, ChatMessageStatus }

  defineOptions({
    name: 'ChatMessage',
    inheritAttrs: false
  })

  export interface ChatMessageProps {
    /** Who wrote the message: the person (`user`), the generative AI assistant, or the product (`system`). */
    from?: ChatMessageFrom
    /** Author name shown over the message and read in its accessible name. Empty uses the locale catalog (`You`, `AI assistant`, `System`). */
    author?: string
    /** Time the message was sent, already formatted for display (`10:42`). Added to the accessible name. */
    timestamp?: string
    /** Lifecycle: `pending` shows the loading text, `streaming` marks the content busy, `success` shows the actions, `error` shows the error line with Try again. */
    status?: ChatMessageStatus
    /** Follows a message by the same author: drops the avatar and the author line so stacked messages read as one turn. */
    grouped?: boolean
    /** Error text shown while `status` is `error`. Empty uses the locale catalog. */
    errorMessage?: string
    /** Loading text shown while `status` is `pending`. Empty uses `AiLoading`'s own (`Generating a response`). */
    loadingLabel?: string
  }

  const props = withDefaults(defineProps<ChatMessageProps>(), {
    from: 'assistant',
    author: '',
    timestamp: '',
    status: 'success',
    grouped: false,
    errorMessage: '',
    loadingLabel: ''
  })

  const emit = defineEmits<{
    /** The reader asked to generate the failed response again (Try again). */
    retry: [event: MouseEvent]
  }>()

  const slots = defineSlots<{
    /** The message content: text, a `StreamingResponse`, `Reasoning`, `Sources`, artifacts. Not rendered while `pending`. */
    default?(): unknown
    /** Replaces the default avatar (a person glyph for the user, the assistant mark for the AI). */
    avatar?(): unknown
    /** Inline actions under the content, usually a `ChatMessage.Actions`; shown only when the message status is `success`. */
    actions?(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ chatMessage: en.chatMessage })
  const conversation = inject(ConversationInjectionKey, null)

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'ai-chat-message'
  )
  const name = computed<string>(() => props.author || t(`chatMessage.${props.from}`))
  const accessibleName = computed<string>(() =>
    props.timestamp
      ? t('chatMessage.labelWithTime', { author: name.value, time: props.timestamp })
      : name.value
  )
  const alignment = computed(() => conversation?.alignment.value ?? 'split')
  const busy = computed<boolean>(() => props.status === 'pending' || props.status === 'streaming')
  const showActions = () => props.status === 'success' && Boolean(slots.actions)

  const bodyEl = ref<HTMLElement | null>(null)

  function announce(): void {
    if (!conversation || props.from === 'user') return
    const text =
      props.status === 'error'
        ? props.errorMessage || t('chatMessage.error')
        : (bodyEl.value?.textContent ?? '')
    conversation.announce(name.value, text.slice(0, 600))
  }

  watch(
    () => props.status,
    (next, previous) => {
      if (previous !== next && (next === 'success' || next === 'error')) announce()
    },
    { flush: 'post' }
  )

  onMounted(() => {
    if (conversation?.ready.value && (props.status === 'success' || props.status === 'error'))
      announce()
  })

  provide(ChatMessageInjectionKey, {
    from: computed(() => props.from),
    status: computed(() => props.status)
  })
</script>

<template>
  <article
    v-bind="$attrs"
    :aria-label="accessibleName"
    :aria-busy="busy || undefined"
    :data-testid="testId"
    :data-from="from"
    :data-status="status"
    :data-alignment="alignment"
    :data-grouped="grouped || null"
    class="group/message flex w-full min-w-0 gap-(--spacing-sm) data-[from=user]:data-[alignment=split]:flex-row-reverse data-[from=system]:justify-center data-[grouped]:-mt-(--spacing-sm)"
  >
    <div
      v-if="from !== 'system'"
      aria-hidden="true"
      :data-testid="`${testId}__avatar`"
      class="flex size-8 shrink-0 items-start"
    >
      <template v-if="!grouped">
        <slot name="avatar">
          <Avatar
            :icon="from === 'user' ? 'ai ai-user' : 'ai ai-ask-azion'"
            :alt="name"
            size="medium"
          />
        </slot>
      </template>
    </div>
    <div
      :data-from="from"
      :data-alignment="alignment"
      class="flex min-w-0 flex-col gap-(--spacing-xs) data-[from=assistant]:flex-1 data-[from=user]:max-w-[85%] data-[from=user]:data-[alignment=split]:items-end data-[from=system]:max-w-full data-[from=system]:items-center"
    >
      <p
        v-if="!grouped && from !== 'system'"
        :data-testid="`${testId}__author`"
        class="flex items-baseline gap-(--spacing-xs) text-label-sm text-(--text-default)"
      >
        <span>{{ name }}</span>
        <span
          v-if="timestamp"
          class="text-body-xs text-(--text-muted)"
        >
          {{ timestamp }}
        </span>
      </p>
      <AiLoading
        v-if="status === 'pending'"
        :label="loadingLabel"
        :delay="0"
        :data-testid="`${testId}__loading`"
      />
      <div
        v-else
        ref="bodyEl"
        :data-from="from"
        :data-testid="`${testId}__content`"
        class="flex min-w-0 flex-col gap-(--spacing-sm) text-body-md text-(--text-default) break-words data-[from=user]:rounded-(--shape-card) data-[from=user]:bg-(--bg-surface-raised) data-[from=user]:px-(--spacing-md) data-[from=user]:py-(--spacing-sm) data-[from=system]:text-body-sm data-[from=system]:text-(--text-muted) data-[from=system]:text-center"
      >
        <slot />
      </div>
      <div
        v-if="status === 'error'"
        :data-testid="`${testId}__error`"
        class="flex flex-wrap items-center gap-(--spacing-sm) text-body-sm text-(--danger-foreground)"
      >
        <span class="inline-flex items-center gap-(--spacing-xs)">
          <i
            class="ai ai-circle-alert"
            aria-hidden="true"
          />
          {{ errorMessage || t('chatMessage.error') }}
        </span>
        <Button
          :label="t('chatMessage.retry')"
          kind="outlined"
          size="small"
          icon="ai ai-refresh"
          :data-testid="`${testId}__retry`"
          @click="(event: MouseEvent) => emit('retry', event)"
        />
      </div>
      <div
        v-if="showActions()"
        :data-testid="`${testId}__actions`"
        class="flex items-center"
      >
        <slot name="actions" />
      </div>
    </div>
  </article>
</template>
