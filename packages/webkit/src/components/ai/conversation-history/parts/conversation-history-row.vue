<script setup lang="ts">
  import {
    computed,
    defineAsyncComponent,
    type FunctionalComponent,
    h,
    nextTick,
    ref,
    useAttrs,
    useId
  } from 'vue'

  import IconButton from '../../../action/icon-button/icon-button.vue'
  import Tag from '../../../content/tag/tag.vue'
  import Spinner from '../../../feedback/spinner/spinner.vue'
  import { useConversationHistoryContext } from '../composables/use-conversation-history-context'
  import { timeOf } from '../composables/use-conversation-history-projects'
  import { compactAge } from '../lib/compact-age'
  import { titleWhenTruncated } from '../lib/truncated-title'
  import type { ConversationHistoryItem } from '../lib/types'
  import ConversationHistoryRename from './conversation-history-rename.vue'

  defineOptions({
    name: 'ConversationHistoryRow',
    inheritAttrs: false
  })

  export interface ConversationHistoryRowProps {
    /** The conversation the row shows. */
    item: ConversationHistoryItem
  }

  const props = defineProps<ConversationHistoryRowProps>()

  const attrs = useAttrs()
  const uid = useId()
  const ctx = useConversationHistoryContext()

  const RowMenu = defineAsyncComponent({
    loader: () => import('./conversation-history-row-menu.vue'),
    loadingComponent: {
      inheritAttrs: false,
      render: () =>
        h(IconButton, {
          icon: 'az az-ellipsis',
          ariaLabel: ctx.t('conversationHistory.moreActions', { title: props.item.title }),
          variant: 'ghost',
          size: 'small',
          disabled: true
        })
    },
    delay: 0
  })

  const testId = computed<string>(() => {
    const id = attrs['data-testid']
    return typeof id === 'string' ? id : 'conversation-history-row'
  })

  const buttonEl = ref<HTMLButtonElement | null>(null)
  const active = computed<boolean>(() => ctx.active.value === props.item.id)
  const renaming = computed<boolean>(() => ctx.renamingId.value === props.item.id)
  const hasMenu = computed<boolean>(() => ctx.itemActions.value.length > 0)
  const pinnable = computed<boolean>(() => ctx.itemActions.value.includes('pin'))
  const deletable = computed<boolean>(() => ctx.removable.value && !hasMenu.value)
  const actionCount = computed<number>(
    () => Number(pinnable.value) + Number(hasMenu.value || deletable.value)
  )
  const age = computed<string>(() => {
    if (!ctx.showTime.value) return ''
    const text = compactAge(timeOf(props.item), ctx.now.value, ctx.locale.value)
    return text ?? ctx.t('conversationHistory.justNow')
  })
  const datetime = computed<string>(() => new Date(timeOf(props.item)).toISOString())
  const hasMeta = (): boolean =>
    Boolean(ctx.slots['item-meta']) ||
    Boolean(age.value || props.item.locked) ||
    props.item.status === 'running' ||
    props.item.status === 'error'
  const describedBy = (): string | undefined => {
    const own = !ctx.slots['item']
    const meta = ctx.slots['item-meta']
      ? ['meta']
      : [
          props.item.locked ? 'locked' : '',
          props.item.status === 'running' || props.item.status === 'error' ? 'status' : '',
          age.value ? 'age' : ''
        ]
    const ids = [
      own && props.item.tag ? 'tag' : '',
      own && props.item.description ? 'description' : '',
      ...meta
    ]
      .filter(Boolean)
      .map((part) => `${uid}-${part}`)
    return ids.length ? ids.join(' ') : undefined
  }

  const Outlet: FunctionalComponent<{ name: 'item' | 'item-meta' }> = (outlet) =>
    ctx.slots[outlet.name]?.({ item: props.item })

  const onRenameComplete = (refocus: boolean) => {
    ctx.startRename(null)
    if (refocus) nextTick(() => buttonEl.value?.focus())
  }

  const BUTTON_CLASS =
    'relative flex h-8 pointer-coarse:min-h-11 w-full min-w-0 shrink-0 items-center gap-(--spacing-xs) rounded-(--shape-control) border-y border-transparent bg-clip-padding ' +
    'forced-colors:border-y-0 pe-(--spacing-xs) py-(--spacing-2xs) ps-(--spacing-sm) text-start text-label-md ' +
    'text-(--text-default) transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 ' +
    'focus-visible:ring-offset-(--bg-canvas) ' +
    'not-data-[active]:group-hover/item:bg-(--bg-hover) not-data-[active]:group-has-[:focus-visible]/item:bg-(--bg-hover) data-[active]:bg-(--bg-selected) ' +
    'data-[description]:h-auto data-[description]:min-h-14 data-[description]:pointer-coarse:min-h-14 data-[description]:py-(--spacing-xs) ' +
    'pointer-coarse:group-data-[actions]/item:pe-(--conversation-history-actions-width) ' +
    'pointer-fine:group-data-[actions]/item:group-hover/item:pe-(--conversation-history-actions-width) ' +
    'pointer-fine:group-data-[actions]/item:group-focus-within/item:pe-(--conversation-history-actions-width) ' +
    'pointer-fine:group-data-[actions]/item:group-data-[active]/item:pe-(--conversation-history-actions-width) ' +
    'pointer-fine:group-has-[[data-state=open]]/item:pe-(--conversation-history-actions-width)'

  const ACTIONS_CLASS =
    'absolute end-(--spacing-2xs) top-1/2 flex -translate-y-1/2 items-center transition-opacity duration-fast-02 ease-productive-entrance motion-reduce:transition-none ' +
    'pointer-fine:opacity-0 pointer-fine:group-hover/item:opacity-100 pointer-fine:group-focus-within/item:opacity-100 pointer-fine:group-data-[active]/item:opacity-100 ' +
    'pointer-fine:group-has-[[data-state=open]]/item:opacity-100'
</script>

<template>
  <ConversationHistoryRename
    v-if="renaming"
    v-bind="$attrs"
    :item="item"
    :data-testid="`${testId}__rename`"
    @complete="onRenameComplete"
  />
  <li
    v-else
    v-bind="$attrs"
    :data-active="active || null"
    :data-actions="actionCount || null"
    :data-testid="testId"
    class="group/item relative w-full min-w-0 shrink-0 data-[actions=1]:[--conversation-history-actions-width:--spacing(10)] data-[actions=2]:[--conversation-history-actions-width:--spacing(16)]"
  >
    <button
      ref="buttonEl"
      type="button"
      data-slot="conversation-history-item"
      :data-key="item.id"
      :data-active="active || null"
      :data-description="(item.description && !ctx.slots['item']) || null"
      :aria-current="active ? 'page' : undefined"
      :aria-labelledby="ctx.slots['item'] ? `${uid}-content` : `${uid}-title`"
      :aria-describedby="describedBy()"
      :class="BUTTON_CLASS"
      @pointerenter="titleWhenTruncated"
      @click="ctx.select(item.id)"
    >
      <span
        :id="`${uid}-content`"
        class="flex min-w-0 flex-1 flex-col"
      >
        <Outlet
          v-if="ctx.slots['item']"
          name="item"
        />
        <template v-else>
          <span class="flex min-w-0 items-center gap-(--spacing-xs)">
            <Tag
              v-if="item.tag"
              :id="`${uid}-tag`"
              :label="item.tag"
              severity="neutral"
              size="small"
              class="shrink-0"
              :data-testid="`${testId}__tag`"
            />
            <bdi
              :id="`${uid}-title`"
              dir="auto"
              class="min-w-0 flex-1 truncate"
              >{{ item.title }}</bdi
            >
          </span>
          <bdi
            v-if="item.description"
            :id="`${uid}-description`"
            dir="auto"
            class="truncate text-body-xs text-(--text-muted)"
            :data-testid="`${testId}__description`"
            >{{ item.description }}</bdi
          >
        </template>
      </span>
      <span
        v-if="hasMeta()"
        :id="`${uid}-meta`"
        class="flex shrink-0 items-center gap-(--spacing-xs) text-label-sm text-(--text-muted)"
        :data-testid="`${testId}__meta`"
      >
        <Outlet
          v-if="ctx.slots['item-meta']"
          name="item-meta"
        />
        <template v-else>
          <template v-if="item.locked">
            <i
              class="az az-lock leading-none"
              aria-hidden="true"
            />
            <span
              :id="`${uid}-locked`"
              class="sr-only"
              >{{ ctx.t('conversationHistory.locked') }}</span
            >
          </template>
          <template v-if="item.status === 'running'">
            <Spinner
              class="size-3"
              :data-testid="`${testId}__running`"
            />
            <span
              :id="`${uid}-status`"
              class="sr-only"
              >{{ ctx.t('conversationHistory.working') }}</span
            >
          </template>
          <template v-else-if="item.status === 'error'">
            <i
              class="az az-circle-alert leading-none text-(--text-danger)"
              aria-hidden="true"
              :data-testid="`${testId}__error`"
            />
            <span
              :id="`${uid}-status`"
              class="sr-only"
              >{{ ctx.t('conversationHistory.failed') }}</span
            >
          </template>
          <time
            v-if="age"
            :id="`${uid}-age`"
            :datetime="datetime"
            class="tabular-nums"
            >{{ age }}</time
          >
        </template>
      </span>
    </button>
    <div
      v-if="actionCount"
      :class="ACTIONS_CLASS"
    >
      <IconButton
        v-if="pinnable"
        icon="az az-pin"
        :ariaLabel="
          ctx.t(item.pinned ? 'conversationHistory.unpinTitle' : 'conversationHistory.pinTitle', {
            title: item.title
          })
        "
        variant="ghost"
        size="small"
        :data-testid="`${testId}__pin`"
        @click="(event: MouseEvent) => ctx.act(event, 'pin', item)"
      />
      <RowMenu
        v-if="hasMenu"
        :item="item"
        :data-testid="`${testId}__more`"
      />
      <IconButton
        key="remove"
        v-else-if="deletable"
        icon="az az-trash"
        :ariaLabel="ctx.t('conversationHistory.delete', { title: item.title })"
        variant="ghost"
        size="small"
        :data-testid="`${testId}__remove`"
        @click="(event: MouseEvent) => ctx.remove(event, item.id, null)"
      />
    </div>
  </li>
</template>
