<script setup lang="ts">
  import { computed, nextTick, ref, useAttrs } from 'vue'

  import { useLocale } from '../../../../composables/use-locale/use-locale'
  import * as en from '../../../../locales/en'
  import Button from '../../../action/button/button.vue'
  import { useMessageThreadContext } from '../composables/use-message-thread-context'

  defineOptions({ name: 'MessageThreadGroup', inheritAttrs: false })

  export interface MessageThreadGroupProps {
    /** How many items the group holds, read in the button. 0 reads "Show earlier messages". */
    count?: number
  }

  const props = withDefaults(defineProps<MessageThreadGroupProps>(), {
    count: 0
  })

  const open = defineModel<boolean>('open', { default: false })

  defineSlots<{
    /** The hidden MessageThread.Item children. */
    default(): unknown
  }>()

  useMessageThreadContext()
  const attrs = useAttrs()
  const { t } = useLocale({ messageThread: en.messageThread })

  const testId = computed<string>(() => {
    const own = attrs['data-testid']
    return typeof own === 'string' ? own : 'message-thread-group'
  })
  const label = computed<string>(() =>
    props.count > 0
      ? t('messageThread.showEarlier', { count: props.count })
      : t('messageThread.showEarlierAll')
  )

  const listEl = ref<HTMLOListElement | null>(null)

  const onClick = async (): Promise<void> => {
    open.value = true
    await nextTick()
    const first = listEl.value?.querySelector<HTMLElement>('[data-slot="message-thread-item"]')
    const target = first?.querySelector<HTMLElement>('article') ?? first
    target?.focus()
  }
</script>

<template>
  <li
    v-bind="$attrs"
    data-slot="message-thread-group"
    :data-testid="testId"
    :data-state="open ? 'open' : 'closed'"
    class="min-w-0"
  >
    <ol
      v-if="open"
      ref="listEl"
      role="list"
      :aria-label="t('messageThread.earlier')"
      :data-testid="`${testId}__list`"
      class="m-0 flex list-none flex-col gap-(--spacing-md) p-0"
    >
      <slot />
    </ol>
    <div
      v-else
      class="flex items-center gap-(--spacing-sm) before:h-0 before:flex-1 before:border-t before:border-(--border-default) after:h-0 after:flex-1 after:border-t after:border-(--border-default)"
    >
      <Button
        variant="outline"
        size="small"
        :label="label"
        :data-testid="`${testId}__toggle`"
        @click="onClick"
      />
    </div>
  </li>
</template>
