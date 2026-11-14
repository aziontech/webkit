<script setup lang="ts">
  import { computed, inject, onMounted, provide, ref, useAttrs, watch } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import Button from '../../actions/button/button.vue'
  import Avatar from '../../content/avatar/avatar.vue'
  import AiLoading from '../ai-loading/ai-loading.vue'
  import { ConversationInjectionKey } from '../conversation/injection-key'
  import type { ChatMessageFrom, ChatMessageState } from './injection-key'
  import { ChatMessageInjectionKey } from './injection-key'

  export type { ChatMessageFrom, ChatMessageState }

  defineOptions({
    name: 'ChatMessage',
    inheritAttrs: false
  })

  interface Props {
    /** Who wrote the message: the person (`user`), the generative AI assistant, or the product (`system`). */
    from?: ChatMessageFrom
    /** Author name shown over the message and read in its accessible name. Empty uses the locale catalog (`You`, `AI assistant`, `System`). */
    author?: string
    /** Time the message was sent, already formatted for display (`10:42`). Added to the accessible name. */
    timestamp?: string
    /** Lifecycle: `pending` shows the loading text, `streaming` marks the content busy, `complete` shows the actions, `error` shows the error line with Try again. */
    state?: ChatMessageState
    /** Follows a message by the same author: drops the avatar and the author line so stacked messages read as one turn. */
    grouped?: boolean
    /** Error text shown while `state` is `error`. Empty uses the locale catalog. */
    errorMessage?: string
    /** Loading text shown while `state` is `pending`. Empty uses `AiLoading`'s own (`Generating a response`). */
    loadingLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    from: 'assistant',
    author: '',
    timestamp: '',
    state: 'complete',
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
    /** Inline actions under the content, usually a `ChatMessage.Actions`; shown only when the message is complete. */
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
  const busy = computed<boolean>(() => props.state === 'pending' || props.state === 'streaming')
  const showActions = () => props.state === 'complete' && Boolean(slots.actions)

  const body = ref<HTMLElement | null>(null)

  function announce(): void {
    if (!conversation || props.from === 'user') return
    const text =
      props.state === 'error'
        ? props.errorMessage || t('chatMessage.error')
        : (body.value?.textContent ?? '')
    conversation.announce(name.value, text.slice(0, 600))
  }

  watch(
    () => props.state,
    (next, previous) => {
      if (previous !== next && (next === 'complete' || next === 'error')) announce()
    },
    { flush: 'post' }
  )

  onMounted(() => {
    if (conversation?.ready.value && (props.state === 'complete' || props.state === 'error'))
      announce()
  })

  provide(ChatMessageInjectionKey, {
    from: computed(() => props.from),
    state: computed(() => props.state)
  })
</script>

<template>
  <article
    v-bind="$attrs"
    :aria-label="accessibleName"
    :aria-busy="busy || undefined"
    :data-testid="testId"
    :data-from="from"
    :data-status="state"
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
            :icon="from === 'user' ? 'pi pi-user' : 'ai ai-ask-azion'"
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
        v-if="state === 'pending'"
        :label="loadingLabel"
        :delay="0"
        :data-testid="`${testId}__loading`"
      />
      <div
        v-else
        ref="body"
        :data-from="from"
        :data-testid="`${testId}__content`"
        class="flex min-w-0 flex-col gap-(--spacing-sm) text-body-md text-(--text-default) break-words data-[from=user]:rounded-(--shape-card) data-[from=user]:bg-(--bg-surface-raised) data-[from=user]:px-(--spacing-md) data-[from=user]:py-(--spacing-sm) data-[from=system]:text-body-sm data-[from=system]:text-(--text-muted) data-[from=system]:text-center"
      >
        <slot />
      </div>
      <div
        v-if="state === 'error'"
        :data-testid="`${testId}__error`"
        class="flex flex-wrap items-center gap-(--spacing-sm) text-body-sm text-(--danger-contrast)"
      >
        <span class="inline-flex items-center gap-(--spacing-xs)">
          <i
            class="pi pi-exclamation-circle"
            aria-hidden="true"
          />
          {{ errorMessage || t('chatMessage.error') }}
        </span>
        <Button
          :label="t('chatMessage.retry')"
          kind="outlined"
          size="small"
          icon="pi pi-refresh"
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
