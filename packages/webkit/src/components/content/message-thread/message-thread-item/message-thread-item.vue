<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  import { useLocale } from '../../../../composables/use-locale/use-locale'
  import * as en from '../../../../locales/en'
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import Avatar from '../../avatar/avatar.vue'
  import Timestamp from '../../timestamp/timestamp.vue'
  import { toDate } from '../../timestamp/timestamp-format'
  import { useMessageThreadContext } from '../composables/use-message-thread-context'

  defineOptions({ name: 'MessageThreadItem', inheritAttrs: false })

  /** What the item is: a public reply, an internal note only agents read, or a system event line. */
  export type MessageThreadItemType = 'reply' | 'note' | 'event'
  /** Whether the author is the customer or an agent. */
  export type MessageThreadFrom = 'customer' | 'agent'
  /** How a reply came in or went out. */
  export type MessageThreadChannel = 'email' | 'chat' | 'phone' | 'web' | 'api'

  export interface MessageThreadItemProps {
    /** What the item is: a public reply, an internal note only agents read, or a system event line. */
    type?: MessageThreadItemType
    /** Name of who wrote the message, shown in the header and read in the item's accessible name. */
    author?: string
    /** Image URL of the author's avatar. Empty shows the initials of the author. */
    avatarSrc?: string
    /** Whether the author is the customer or an agent; shown as the role beside the name. */
    from?: MessageThreadFrom
    /** How a reply came in or went out, shown as "via Email" with its glyph. Unset shows no channel. */
    channel?: MessageThreadChannel
    /** When the item was sent: an ISO string, an epoch in milliseconds or a Date, rendered by Timestamp. */
    timestamp?: string | number | Date
    /** Email addresses the reply was sent to, shown on the recipients line. */
    to?: string[]
    /** Email addresses copied on the reply, shown on the recipients line. */
    cc?: string[]
  }

  const props = withDefaults(defineProps<MessageThreadItemProps>(), {
    type: 'reply',
    author: '',
    avatarSrc: '',
    from: 'customer',
    channel: undefined,
    timestamp: undefined,
    to: () => [],
    cc: () => []
  })

  const quotedOpen = defineModel<boolean>('quotedOpen', { default: false })

  const slots = defineSlots<{
    /** The body: plain text keeps its line breaks, or composed content. */
    default(): unknown
    /** Reply and More actions at the end of the header. */
    actions(): unknown
    /** Attachments under the body, such as a read-only FileTokenGroup. */
    attachments(): unknown
    /** The earlier messages an email quotes, hidden until the toggle opens it. */
    quoted(): unknown
  }>()

  const context = useMessageThreadContext()
  const attrs = useAttrs()
  const { t, formatList } = useLocale({ messageThread: en.messageThread })
  const baseId = useId()

  const CHANNEL_ICONS: Record<MessageThreadChannel, string> = {
    email: 'az az-mail',
    chat: 'az az-comments',
    phone: 'az az-phone',
    web: 'az az-globe',
    api: 'az az-code'
  }

  const testId = computed<string>(() => {
    const own = attrs['data-testid']
    return typeof own === 'string' ? own : 'message-thread-item'
  })
  const isEvent = computed<boolean>(() => props.type === 'event')
  const isReply = computed<boolean>(() => props.type === 'reply')
  const hasTime = computed<boolean>(() => toDate(props.timestamp ?? null) !== null)
  const showChannel = computed<boolean>(() => isReply.value && props.channel !== undefined)
  const showRecipients = computed<boolean>(
    () => isReply.value && (props.to.length > 0 || props.cc.length > 0)
  )
  const ids = {
    note: `${baseId}-note`,
    author: `${baseId}-author`,
    time: `${baseId}-time`,
    quoted: `${baseId}-quoted`
  }
  const labelledBy = computed<string>(() =>
    [props.type === 'note' && ids.note, props.author && ids.author, hasTime.value && ids.time]
      .filter(Boolean)
      .join(' ')
  )
  const addresses = (list: string[]): string => `⁨${formatList(list, { type: 'unit' })}⁩`

  const CARD_CLASS =
    'flex min-w-0 flex-col rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) outline-none ' +
    'focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)'
  const META_CLASS = 'text-body-sm text-(--text-muted)'
  const QUOTED_CLASS =
    'whitespace-pre-line break-words border-s-2 border-(--border-default) ps-(--spacing-sm) text-body-sm text-(--text-muted)'
</script>

<template>
  <li
    v-bind="$attrs"
    data-slot="message-thread-item"
    :data-testid="testId"
    :data-type="type"
    :data-from="isEvent ? undefined : from"
    :data-channel="showChannel ? channel : undefined"
    :tabindex="isEvent ? -1 : undefined"
    class="min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
  >
    <p
      v-if="isEvent"
      :data-testid="`${testId}__event`"
      class="m-0 flex flex-wrap items-center justify-center gap-x-(--spacing-xs) gap-y-(--spacing-2xs) text-center text-body-sm text-(--text-muted)"
    >
      <i
        class="az az-history"
        aria-hidden="true"
      />
      <span class="break-words"><slot /></span>
      <Timestamp
        v-if="hasTime"
        :value="timestamp"
        :format="context.timestampFormat.value"
      />
    </p>
    <article
      v-else
      tabindex="-1"
      :aria-labelledby="labelledBy || undefined"
      :class="CARD_CLASS"
    >
      <p
        v-if="type === 'note'"
        :id="ids.note"
        :data-testid="`${testId}__note`"
        class="m-0 flex items-center gap-(--spacing-2xs) rounded-t-(--shape-card) bg-(--warning) px-(--spacing-md) py-(--spacing-2xs) text-label-sm text-(--warning-foreground)"
      >
        <i
          class="az az-lock"
          aria-hidden="true"
        />
        {{ t('messageThread.internalNote') }}
      </p>
      <div class="flex min-w-0 flex-col gap-(--spacing-sm) p-(--spacing-md)">
        <header
          class="flex min-w-0 flex-wrap items-center gap-x-(--spacing-sm) gap-y-(--spacing-2xs)"
        >
          <Avatar
            :src="avatarSrc"
            :label="author"
            size="medium"
            aria-hidden="true"
          />
          <span class="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-(--spacing-xs)">
            <bdi
              v-if="author"
              :id="ids.author"
              :data-testid="`${testId}__author`"
              class="min-w-0 break-words text-label-md text-(--text-default)"
              >{{ author }}</bdi
            >
            <span
              :data-testid="`${testId}__role`"
              :class="META_CLASS"
              >{{ t(from === 'agent' ? 'messageThread.agent' : 'messageThread.customer') }}</span
            >
            <span
              v-if="showChannel && channel"
              :data-testid="`${testId}__channel`"
              :class="META_CLASS"
            >
              <i
                :class="CHANNEL_ICONS[channel]"
                class="me-(--spacing-2xs)"
                aria-hidden="true"
              />
              {{ t('messageThread.via', { channel: t(`messageThread.${channel}`) }) }}
            </span>
          </span>
          <span class="ms-auto flex items-center gap-(--spacing-xs)">
            <span
              v-if="hasTime"
              :id="ids.time"
              :data-testid="`${testId}__time`"
              class="text-body-sm text-(--text-muted)"
            >
              <Timestamp
                :value="timestamp"
                :format="context.timestampFormat.value"
              />
            </span>
            <span
              v-if="slots.actions"
              :data-testid="`${testId}__actions`"
              class="flex items-center gap-(--spacing-2xs)"
            >
              <slot name="actions" />
            </span>
          </span>
        </header>
        <div
          v-if="showRecipients"
          :data-testid="`${testId}__recipients`"
          class="flex min-w-0 flex-col break-words text-body-sm text-(--text-muted)"
        >
          <span v-if="to.length">{{ t('messageThread.to', { addresses: addresses(to) }) }}</span>
          <span v-if="cc.length">{{ t('messageThread.cc', { addresses: addresses(cc) }) }}</span>
        </div>
        <div
          :data-testid="`${testId}__content`"
          dir="auto"
          class="min-w-0 whitespace-pre-line break-words text-body-md text-(--text-default)"
        >
          <slot />
        </div>
        <template v-if="slots.quoted">
          <IconButton
            icon="az az-ellipsis"
            variant="ghost"
            size="small"
            class="self-start"
            :data-testid="`${testId}__quoted-toggle`"
            :aria-label="t(quotedOpen ? 'messageThread.hideQuoted' : 'messageThread.showQuoted')"
            :aria-expanded="quotedOpen ? 'true' : 'false'"
            :aria-controls="ids.quoted"
            @click="quotedOpen = !quotedOpen"
          />
          <div
            :id="ids.quoted"
            :data-testid="`${testId}__quoted`"
            :data-state="quotedOpen ? 'open' : 'closed'"
            :hidden="!quotedOpen"
            dir="auto"
            :class="QUOTED_CLASS"
          >
            <slot name="quoted" />
          </div>
        </template>
        <div
          v-if="slots.attachments"
          :data-testid="`${testId}__attachments`"
          class="min-w-0"
        >
          <slot name="attachments" />
        </div>
      </div>
    </article>
  </li>
</template>
