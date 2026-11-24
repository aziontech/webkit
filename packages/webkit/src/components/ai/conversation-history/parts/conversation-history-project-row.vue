<script setup lang="ts">
  import { computed, defineAsyncComponent, h, useAttrs, useId } from 'vue'

  import IconButton from '../../../action/icon-button/icon-button.vue'
  import { useConversationHistoryContext } from '../composables/use-conversation-history-context'
  import type { ConversationHistoryProjectRow as ProjectRow } from '../composables/use-conversation-history-projects'
  import { titleWhenTruncated } from '../lib/truncated-title'
  import ConversationHistoryRow from './conversation-history-row.vue'

  defineOptions({
    name: 'ConversationHistoryProjectRow',
    inheritAttrs: false
  })

  export interface ConversationHistoryProjectRowProps {
    /** The project and its chats. */
    row: ProjectRow
    /** Whether the project is expanded. */
    open?: boolean
  }

  const props = withDefaults(defineProps<ConversationHistoryProjectRowProps>(), {
    open: false
  })

  const emit = defineEmits<{
    toggle: [event: MouseEvent]
  }>()

  const attrs = useAttrs()
  const uid = useId()
  const ctx = useConversationHistoryContext()

  const ProjectMenu = defineAsyncComponent({
    loader: () => import('./conversation-history-project-menu.vue'),
    loadingComponent: {
      inheritAttrs: false,
      render: () =>
        h(IconButton, {
          icon: 'az az-ellipsis',
          ariaLabel: ctx.t('conversationHistory.moreActions', { title: props.row.project.title }),
          variant: 'ghost',
          size: 'small',
          disabled: true
        })
    },
    delay: 0
  })

  const testId = computed<string>(() => {
    const id = attrs['data-testid']
    return typeof id === 'string' ? id : 'conversation-history-project-row'
  })

  const hasMenu = computed<boolean>(() =>
    ctx.projectActions.value.some((action) => action !== 'chat-create')
  )
  const chatCreatable = computed<boolean>(() => ctx.projectActions.value.includes('chat-create'))
  const actionCount = computed<number>(() => Number(hasMenu.value) + Number(chatCreatable.value))

  const FOLDER_CLASS =
    'relative flex h-8 pointer-coarse:min-h-11 w-full min-w-0 shrink-0 items-center gap-(--spacing-xs) rounded-(--shape-control) border-y border-transparent bg-clip-padding ' +
    'forced-colors:border-y-0 pe-(--spacing-xs) py-(--spacing-2xs) ps-(--spacing-2xs) text-start text-label-md text-(--text-default) transition-colors motion-reduce:transition-none ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) ' +
    'group-hover/project:bg-(--bg-hover) group-has-[:focus-visible]/project:bg-(--bg-hover) ' +
    'pointer-coarse:group-data-[actions]/project:pe-(--conversation-history-actions-width) ' +
    'pointer-fine:group-data-[actions]/project:group-hover/project:pe-(--conversation-history-actions-width) ' +
    'pointer-fine:group-data-[actions]/project:group-focus-within/project:pe-(--conversation-history-actions-width) ' +
    'pointer-fine:group-has-[[data-state=open]]/project:pe-(--conversation-history-actions-width)'

  const ACTIONS_CLASS =
    'absolute end-(--spacing-2xs) top-1/2 flex -translate-y-1/2 items-center transition-opacity duration-fast-02 ease-productive-entrance motion-reduce:transition-none ' +
    'pointer-fine:opacity-0 pointer-fine:group-hover/project:opacity-100 pointer-fine:group-focus-within/project:opacity-100 ' +
    'pointer-fine:group-has-[[data-state=open]]/project:opacity-100'
</script>

<template>
  <li
    v-bind="$attrs"
    class="flex flex-col"
    :data-state="open ? 'open' : 'closed'"
    :data-testid="`${testId}__group`"
  >
    <div
      class="group/project relative data-[actions=1]:[--conversation-history-actions-width:--spacing(10)] data-[actions=2]:[--conversation-history-actions-width:--spacing(16)]"
      :data-actions="actionCount || null"
    >
      <button
        :id="`${uid}-project`"
        type="button"
        :aria-expanded="open"
        :aria-controls="`${uid}-chats`"
        :class="FOLDER_CLASS"
        :data-testid="testId"
        @pointerenter="titleWhenTruncated"
        @click="(event: MouseEvent) => emit('toggle', event)"
      >
        <span
          class="flex size-8 shrink-0 items-center justify-center overflow-hidden"
          aria-hidden="true"
        >
          <i
            aria-hidden="true"
            :class="open ? 'az az-folder-open' : 'az az-folder'"
            class="size-4 shrink-0 text-[length:inherit] leading-none text-(--text-muted) group-hover/project:text-(--text-default)"
          />
        </span>
        <bdi
          dir="auto"
          class="min-w-0 flex-1 truncate"
          >{{ row.project.title }}</bdi
        >
        <i
          v-if="row.project.pinned"
          class="az az-pin shrink-0 text-label-sm leading-none text-(--text-muted)"
          aria-hidden="true"
        />
      </button>
      <div
        v-if="actionCount"
        :class="ACTIONS_CLASS"
      >
        <IconButton
          v-if="chatCreatable"
          icon="az az-square-pen"
          :ariaLabel="ctx.t('conversationHistory.newChatIn', { title: row.project.title })"
          variant="ghost"
          size="small"
          :data-testid="`${testId}__chat-create`"
          @click="(event: MouseEvent) => ctx.actProject(event, 'chat-create', row.project)"
        />
        <ProjectMenu
          v-if="hasMenu"
          :project="row.project"
          :data-testid="`${testId}__more`"
        />
      </div>
    </div>
    <ul
      v-if="open"
      :id="`${uid}-chats`"
      :aria-labelledby="`${uid}-project`"
      class="m-0 flex list-none flex-col p-0 ps-(--spacing-md)"
    >
      <li
        v-if="!row.items.length"
        class="m-0 flex min-h-8 items-center px-(--spacing-sm) text-body-sm text-(--text-muted)"
        :data-testid="`${testId}__empty`"
      >
        {{ ctx.t('conversationHistory.projectEmptyTitle') }}
      </li>
      <ConversationHistoryRow
        v-for="item in row.items"
        :key="item.id"
        :item="item"
        :data-testid="`${ctx.testId.value}__item`"
      />
    </ul>
  </li>
</template>
