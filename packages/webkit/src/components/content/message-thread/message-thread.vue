<script setup lang="ts">
  import { computed, provide, useAttrs, watch } from 'vue'

  import { useAnnouncer } from '../../../composables/use-announcer/use-announcer'
  import { useLocale } from '../../../composables/use-locale/use-locale'
  import * as en from '../../../locales/en'
  import Skeleton from '../../feedback/skeleton/skeleton.vue'
  import type { TimestampFormat } from '../timestamp/timestamp.vue'
  import { MessageThreadInjectionKey } from './injection-key'

  defineOptions({ name: 'MessageThread', inheritAttrs: false })

  export interface MessageThreadProps {
    /** How every item's sent time reads: `relative` (2 hours ago), `local` date and time, or `utc`. */
    timestampFormat?: TimestampFormat
    /** Shows three placeholder messages in place of the items while the thread loads, and marks it busy. */
    loading?: boolean
    /** Accessible name of the list. Empty uses the locale catalog (Conversation). */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<MessageThreadProps>(), {
    timestampFormat: 'local',
    loading: false,
    ariaLabel: ''
  })

  defineSlots<{
    /** The MessageThread.Item and MessageThread.Group children, oldest first. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useLocale({ messageThread: en.messageThread })
  const { announce } = useAnnouncer()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'message-thread'
  )

  provide(MessageThreadInjectionKey, {
    timestampFormat: computed(() => props.timestampFormat)
  })

  watch(
    () => props.loading,
    (loading) => announce(t(loading ? 'messageThread.loading' : 'messageThread.loaded'))
  )

  const PLACEHOLDERS = [1, 2, 3]
</script>

<template>
  <ol
    v-bind="$attrs"
    role="list"
    data-slot="message-thread"
    :data-testid="testId"
    :data-loading="loading || null"
    :data-timestamp-format="timestampFormat"
    :aria-busy="loading ? 'true' : undefined"
    :aria-label="ariaLabel || t('messageThread.label')"
    class="m-0 flex w-full min-w-0 list-none flex-col gap-(--spacing-md) p-0"
  >
    <template v-if="loading">
      <li
        v-for="placeholder in PLACEHOLDERS"
        :key="placeholder"
        aria-hidden="true"
        :data-testid="`${testId}__placeholder`"
        class="flex gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md)"
      >
        <Skeleton
          variant="circle"
          width="2rem"
          height="2rem"
        />
        <span class="flex min-w-0 flex-1 flex-col gap-(--spacing-xs)">
          <Skeleton
            width="40%"
            height="0.875rem"
          />
          <Skeleton
            width="90%"
            height="0.875rem"
          />
        </span>
      </li>
    </template>
    <slot v-else />
  </ol>
</template>
