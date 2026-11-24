<script setup lang="ts">
  import { computed, defineAsyncComponent, h, onMounted, ref, useAttrs, useSlots } from 'vue'

  import { useLocaleContext, useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import IconButton from '../../action/icon-button/icon-button.vue'
  import Skeleton from '../../feedback/skeleton/skeleton.vue'
  import Input from '../../input/input/input.vue'
  import { provideConversationHistoryContext } from './composables/use-conversation-history-context'
  import { useConversationHistoryGroups } from './composables/use-conversation-history-groups'
  import { useConversationHistoryProjects } from './composables/use-conversation-history-projects'
  import { useConversationHistoryRemovalFocus } from './composables/use-conversation-history-removal-focus'
  import { toggleIn } from './lib/toggle-key'
  import type {
    ConversationHistoryGroupBy,
    ConversationHistoryItem,
    ConversationHistoryItemAction,
    ConversationHistoryMovePayload,
    ConversationHistoryProject,
    ConversationHistoryProjectAction,
    ConversationHistoryProjectSort,
    ConversationHistoryRenamePayload
  } from './lib/types'
  import ConversationHistoryGroupList from './parts/conversation-history-group-list.vue'
  import ConversationHistoryProjectRow from './parts/conversation-history-project-row.vue'
  import ConversationHistorySection from './parts/conversation-history-section.vue'

  export type {
    ConversationHistoryGroupBy,
    ConversationHistoryItem,
    ConversationHistoryItemAction,
    ConversationHistoryMovePayload,
    ConversationHistoryProject,
    ConversationHistoryProjectAction,
    ConversationHistoryProjectSort,
    ConversationHistoryRenamePayload,
    ConversationHistorySection,
    ConversationHistoryStatus
  } from './lib/types'

  defineOptions({
    name: 'ConversationHistory',
    inheritAttrs: false
  })

  export interface ConversationHistoryProps {
    /** Conversations, any order; sorted newest first in their group or project. */
    items?: ConversationHistoryItem[]
    /** Projects shown in a Projects section above Recents; empty keeps the plain groups. */
    projects?: ConversationHistoryProject[]
    /** Reference time for groups and ages. Empty uses the nearest ConfigProvider now, then the current time. */
    now?: string | number | Date
    /** Lets each row be deleted (emits `remove`): a Delete button, or Delete in the row menu when `itemActions` is set. */
    removable?: boolean
    /** Shows New chat (a row, or a toolbar button with `showToolbar`) that emits `create`. */
    creatable?: boolean
    /** Shows New project (in the Projects header, or the toolbar) that emits `project-create`. */
    projectCreatable?: boolean
    /** Shows a search field that hides conversations whose title does not contain the typed text. */
    searchable?: boolean
    /** Shows a top toolbar: a Search button that emits `search-open`, then New project and New chat as icon buttons. */
    showToolbar?: boolean
    /** Row actions: a Pin button and a More menu on each row; `move` needs `projects`. */
    itemActions?: ConversationHistoryItemAction[]
    /** Project row actions: a More menu (pin, settings, remove) and a New chat button (`chat-create`). */
    projectActions?: ConversationHistoryProjectAction[]
    /** Groups chats outside projects by last activity, or into Working (`status: 'running'`) and Settled (the rest and archived chats). */
    groupBy?: ConversationHistoryGroupBy
    /** Shows each chat's age (`10m`, `15h`, `3d`) at the end of its row. */
    showTime?: boolean
    /** Shows placeholder rows while the history loads. */
    loading?: boolean
    /** Accessible name of the list. Empty uses the locale catalog (`Conversation history`). */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<ConversationHistoryProps>(), {
    items: () => [],
    projects: () => [],
    now: undefined,
    removable: false,
    creatable: false,
    projectCreatable: false,
    searchable: false,
    showToolbar: false,
    itemActions: () => [],
    projectActions: () => [],
    groupBy: 'date',
    showTime: false,
    loading: false,
    ariaLabel: ''
  })

  const emit = defineEmits<{
    remove: [event: MouseEvent | KeyboardEvent, id: string]
    create: [event: MouseEvent]
    'project-create': [event: MouseEvent]
    'search-open': [event: MouseEvent | KeyboardEvent]
    'item-pin': [event: MouseEvent | KeyboardEvent, item: ConversationHistoryItem]
    'item-rename': [event: KeyboardEvent | FocusEvent, payload: ConversationHistoryRenamePayload]
    'item-share': [event: MouseEvent | KeyboardEvent, item: ConversationHistoryItem]
    'item-lock': [event: MouseEvent | KeyboardEvent, item: ConversationHistoryItem]
    'item-move': [event: MouseEvent | KeyboardEvent, payload: ConversationHistoryMovePayload]
    'item-archive': [event: MouseEvent | KeyboardEvent, item: ConversationHistoryItem]
    'project-pin': [event: MouseEvent | KeyboardEvent, project: ConversationHistoryProject]
    'project-settings-open': [
      event: MouseEvent | KeyboardEvent,
      project: ConversationHistoryProject
    ]
    'project-remove': [event: MouseEvent | KeyboardEvent, project: ConversationHistoryProject]
    'project-chat-create': [event: MouseEvent, project: ConversationHistoryProject]
  }>()

  const model = defineModel<string | null>({ default: null })
  const openKeys = defineModel<string[]>('openKeys', { default: () => [] })
  const projectsOpen = defineModel<boolean>('projectsOpen', { default: true })
  const projectSort = defineModel<ConversationHistoryProjectSort>('projectSort', {
    default: 'recent'
  })
  const openSectionKeys = defineModel<string[]>('openSectionKeys', {
    default: () => ['recents', 'working']
  })

  defineSlots<{
    /** Replaces a chat row's tag, title and description; the row keeps its button and actions. */
    item(props: { item: ConversationHistoryItem }): unknown
    /** Replaces the end of a chat row (age, lock, status). */
    'item-meta'(props: { item: ConversationHistoryItem }): unknown
  }>()

  const attrs = useAttrs()
  const slots = useSlots()
  const { t, locale } = useTranslate({ conversationHistory: en.conversationHistory })
  const { context: localeContext } = useLocaleContext()
  const query = ref('')
  const renamingId = ref<string | null>(null)

  const ProjectSortMenu = defineAsyncComponent({
    loader: () => import('./parts/conversation-history-project-sort.vue'),
    loadingComponent: {
      inheritAttrs: false,
      render: () =>
        h(IconButton, {
          icon: 'az az-sliders-horizontal',
          ariaLabel: t('conversationHistory.organizeProjects'),
          variant: 'ghost',
          size: 'small',
          disabled: true
        })
    },
    delay: 0
  })

  const ConversationHistoryToolbar = defineAsyncComponent({
    loader: () => import('./parts/conversation-history-toolbar.vue'),
    loadingComponent: {
      inheritAttrs: false,
      render: () => h('div', { class: 'h-8', 'aria-hidden': 'true' })
    },
    delay: 0
  })

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'conversation-history'
  )
  const needle = computed<string>(() => (props.searchable ? query.value.trim() : ''))
  const nowTime = computed<number>(() =>
    new Date(props.now ?? localeContext?.now?.value ?? Date.now()).getTime()
  )
  const mounted = ref<boolean>(false)
  const dayZone = computed<string | undefined>(
    () => localeContext?.timeZone?.value || (mounted.value ? undefined : 'UTC')
  )
  const byStatus = computed<boolean>(() => props.groupBy === 'status')

  const { rows, outside, pinned, archived, hasMatch } = useConversationHistoryProjects({
    items: () => props.items,
    projects: () => props.projects,
    query: needle,
    locale,
    sort: projectSort
  })
  const { groups, observe } = useConversationHistoryGroups(
    outside,
    nowTime,
    () => props.groupBy,
    archived,
    dayZone
  )

  const showProjects = computed<boolean>(
    () =>
      (props.projects.length > 0 || props.projectCreatable) && !(needle.value && !rows.value.length)
  )
  const anyMatch = computed<boolean>(
    () => hasMatch.value || (byStatus.value && archived.value.length > 0)
  )
  const pinnedChunks = computed(() => [
    { index: 0, start: 0, items: pinned.value, mounted: true, estimatedHeight: 0 }
  ])
  const sectionOpen = computed<boolean>(() => Boolean(needle.value) || projectsOpen.value)
  const isProjectOpen = (id: string): boolean =>
    Boolean(needle.value) || openKeys.value.includes(id)
  const isSectionOpen = (key: string): boolean =>
    Boolean(needle.value) || openSectionKeys.value.includes(key)

  const navEl = ref<HTMLElement | null>(null)
  const { track, follow } = useConversationHistoryRemovalFocus(navEl, () =>
    props.items.map((item) => item.id)
  )

  provideConversationHistoryContext({
    testId,
    active: model,
    itemActions: computed(() => props.itemActions),
    projectActions: computed(() => props.projectActions),
    removable: computed(() => props.removable),
    showTime: computed(() => props.showTime),
    projects: computed(() => props.projects),
    now: nowTime,
    locale,
    renamingId,
    slots,
    t,
    select: (id) => (model.value = id),
    startRename: (id) => (renamingId.value = id),
    emit,
    track,
    follow
  })

  onMounted(() => {
    mounted.value = true
  })

  const NEW_CHAT_CLASS =
    'group relative flex h-8 pointer-coarse:min-h-11 w-full min-w-0 shrink-0 items-center gap-(--spacing-xs) rounded-(--shape-control) border-y border-transparent bg-clip-padding ' +
    'forced-colors:border-y-0 pe-(--spacing-xs) py-(--spacing-2xs) ps-(--spacing-2xs) text-start text-label-md text-(--text-default) transition-colors motion-reduce:transition-none ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) ' +
    'hover:bg-(--bg-hover) focus-visible:bg-(--bg-hover)'

  const NOTE_CLASS = 'm-0 px-(--spacing-sm) text-body-sm text-(--text-muted)'
</script>

<template>
  <nav
    ref="navEl"
    v-bind="$attrs"
    tabindex="-1"
    :aria-label="ariaLabel || t('conversationHistory.label')"
    :aria-busy="loading || undefined"
    :data-testid="testId"
    class="flex min-w-0 flex-col gap-(--spacing-md) outline-none"
  >
    <ConversationHistoryToolbar
      v-if="showToolbar"
      :creatable="creatable"
      :project-creatable="projectCreatable"
      :data-testid="`${testId}__toolbar`"
      @search-open="(event: MouseEvent | KeyboardEvent) => emit('search-open', event)"
      @create="(event: MouseEvent) => emit('create', event)"
      @project-create="(event: MouseEvent) => emit('project-create', event)"
    />
    <div
      v-if="(creatable && !showToolbar) || searchable"
      class="flex flex-col gap-(--spacing-xs)"
    >
      <button
        v-if="creatable && !showToolbar"
        type="button"
        :class="NEW_CHAT_CLASS"
        :data-testid="`${testId}__create`"
        @click="(event: MouseEvent) => emit('create', event)"
      >
        <span
          class="flex size-8 shrink-0 items-center justify-center overflow-hidden"
          aria-hidden="true"
        >
          <i
            aria-hidden="true"
            class="az az-square-pen size-4 shrink-0 text-[length:inherit] leading-none text-(--text-muted) group-hover:text-(--text-default) group-focus-visible:text-(--text-default)"
          />
        </span>
        <span class="min-w-0 flex-1 truncate">{{ t('conversationHistory.newChat') }}</span>
      </button>
      <Input
        v-if="searchable"
        v-model="query"
        :aria-label="t('conversationHistory.search')"
        :placeholder="t('conversationHistory.search')"
        role="searchbox"
        enterkeyhint="search"
        autocomplete="off"
        :spellcheck="false"
        :data-testid="`${testId}__search`"
      >
        <template #leading>
          <i
            aria-hidden="true"
            class="az az-search"
          />
        </template>
      </Input>
    </div>
    <ul
      v-if="loading"
      class="m-0 flex list-none flex-col p-0"
      :data-testid="`${testId}__loading`"
    >
      <li
        v-for="n in 5"
        :key="n"
        class="flex h-8 pointer-coarse:min-h-11 items-center px-(--spacing-sm)"
      >
        <Skeleton
          variant="rectangle"
          :width="`${90 - n * 8}%`"
          height="var(--size-5)"
        />
      </li>
    </ul>
    <p
      v-else-if="needle && !anyMatch"
      :class="NOTE_CLASS"
      :data-testid="`${testId}__no-match`"
    >
      {{ t('conversationHistory.noMatch', { query: query.trim() }) }}
    </p>
    <template v-else>
      <ConversationHistoryGroupList
        v-if="pinned.length"
        :chunks="pinnedChunks"
        :label="t('conversationHistory.pinned')"
        :data-testid="`${testId}__pinned`"
      />
      <ConversationHistorySection
        v-if="showProjects"
        :label="t('conversationHistory.projects')"
        :open="sectionOpen"
        eager
        :data-testid="`${testId}__projects`"
        @toggle="projectsOpen = !projectsOpen"
      >
        <template #actions>
          <ProjectSortMenu
            v-if="projects.length > 1"
            v-model="projectSort"
            :data-testid="`${testId}__sort`"
          />
          <IconButton
            v-if="projectCreatable && !showToolbar"
            icon="az az-plus"
            :ariaLabel="t('conversationHistory.newProject')"
            variant="ghost"
            size="small"
            :data-testid="`${testId}__project-create`"
            @click="(event: MouseEvent) => emit('project-create', event)"
          />
        </template>
        <template #default="{ labelId }">
          <ul
            :aria-labelledby="labelId"
            class="m-0 flex list-none flex-col p-0"
          >
            <ConversationHistoryProjectRow
              v-for="row in rows"
              :key="row.project.id"
              :row="row"
              :open="isProjectOpen(row.project.id)"
              :data-testid="`${testId}__project`"
              @toggle="openKeys = toggleIn(openKeys, row.project.id)"
            />
          </ul>
        </template>
      </ConversationHistorySection>
      <div
        v-if="!items.length"
        :class="NOTE_CLASS"
        :data-testid="`${testId}__empty`"
      >
        <p class="m-0">{{ t('conversationHistory.emptyTitle') }}</p>
        <p class="m-0 text-(--text-muted)">{{ t('conversationHistory.emptyDescription') }}</p>
      </div>
      <template v-if="groups.length && byStatus">
        <ConversationHistorySection
          v-for="group in groups"
          :key="group.key"
          :label="t(`conversationHistory.${group.key}`)"
          :count="group.count"
          :open="isSectionOpen(group.key)"
          :data-testid="`${testId}__${group.key}`"
          @toggle="openSectionKeys = toggleIn(openSectionKeys, group.key)"
        >
          <template #default="{ labelId }">
            <ConversationHistoryGroupList
              :chunks="group.chunks"
              :labelled-by="labelId"
              :data-group="group.key"
              @observe="(el: unknown, index: number) => observe(group.key, el, index)"
            />
          </template>
        </ConversationHistorySection>
      </template>
      <component
        :is="showProjects ? ConversationHistorySection : 'div'"
        v-else-if="groups.length"
        v-bind="
          showProjects
            ? {
                label: t('conversationHistory.recents'),
                open: isSectionOpen('recents'),
                'data-testid': `${testId}__recents`
              }
            : {}
        "
        @toggle="openSectionKeys = toggleIn(openSectionKeys, 'recents')"
      >
        <div class="flex flex-col gap-(--spacing-sm)">
          <ConversationHistoryGroupList
            v-for="group in groups"
            :key="group.key"
            :chunks="group.chunks"
            :label="t(`conversationHistory.${group.key}`)"
            :data-group="group.key"
            @observe="(el: unknown, index: number) => observe(group.key, el, index)"
          />
        </div>
      </component>
    </template>
  </nav>
</template>
