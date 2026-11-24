<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  import type { LazyChunk } from '../../../../composables/use-lazy-chunks'
  import { useConversationHistoryContext } from '../composables/use-conversation-history-context'
  import type { ConversationHistoryItem } from '../lib/types'
  import ConversationHistoryRow from './conversation-history-row.vue'

  defineOptions({
    name: 'ConversationHistoryGroupList',
    inheritAttrs: false
  })

  export interface ConversationHistoryGroupListProps {
    /** Rows of the group, in chunks that mount as they scroll near. */
    chunks: LazyChunk<ConversationHistoryItem>[]
    /** Visible label above the list; empty leaves the naming to labelledBy. */
    label?: string
    /** Id of an element outside that names the list. */
    labelledBy?: string
  }

  const props = withDefaults(defineProps<ConversationHistoryGroupListProps>(), {
    label: '',
    labelledBy: ''
  })

  const emit = defineEmits<{
    observe: [el: unknown, index: number]
  }>()

  const attrs = useAttrs()
  const uid = useId()
  const ctx = useConversationHistoryContext()

  const testId = computed<string>(() => {
    const id = attrs['data-testid']
    return typeof id === 'string' ? id : 'conversation-history-group-list'
  })

  const labelId = computed<string>(() => (props.label ? `${uid}-label` : props.labelledBy))
</script>

<template>
  <div
    v-bind="$attrs"
    class="flex flex-col"
    :data-testid="testId"
  >
    <p
      v-if="label"
      :id="`${uid}-label`"
      class="m-0 flex min-h-8 w-full shrink-0 items-center px-(--spacing-sm) text-label-sm text-(--text-muted)"
    >
      {{ label }}
    </p>
    <ul
      :aria-labelledby="labelId || undefined"
      class="m-0 flex list-none flex-col p-0"
    >
      <template
        v-for="chunk in chunks"
        :key="chunk.index"
      >
        <li
          v-if="!chunk.mounted"
          :ref="(el) => emit('observe', el, chunk.index)"
          :data-chunk="chunk.index"
          aria-hidden="true"
          class="shrink-0"
          :style="{ height: `${chunk.estimatedHeight}px` }"
        />
        <template v-else>
          <ConversationHistoryRow
            v-for="item in chunk.items"
            :key="item.id"
            :item="item"
            :data-testid="`${ctx.testId.value}__item`"
          />
        </template>
      </template>
    </ul>
  </div>
</template>
