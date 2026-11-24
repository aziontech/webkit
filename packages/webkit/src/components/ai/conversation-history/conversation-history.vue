<script setup lang="ts">
  import { computed, defineAsyncComponent, h, ref, useAttrs, useId } from 'vue'

  import { useLocaleContext, useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import IconButton from '../../action/icon-button/icon-button.vue'
  import Skeleton from '../../feedback/skeleton/skeleton.vue'
  import Input from '../../input/input/input.vue'
  import { useConversationHistoryGroups } from './composables/use-conversation-history-groups'
  import { useConversationHistoryProjects } from './composables/use-conversation-history-projects'
  import { useConversationHistoryRemovalFocus } from './composables/use-conversation-history-removal-focus'
  import ConversationHistoryRow from './parts/conversation-history-row.vue'

  defineOptions({
    name: 'ConversationHistory',
    inheritAttrs: false
  })

  export interface ConversationHistoryItem {
    /** Id of the conversation, the value of v-model while it is open. */
    id: string
    /** Title of the conversation. */
    title: string
    /** Time of the last message; it sets the date group and the order. */
    updatedAt: string | number | Date
    /** Id of the project the conversation belongs to; it then shows under that project instead of in Recents. */
    projectId?: string
  }

  export interface ConversationHistoryProject {
    /** Id of the project, the key in v-model:openKeys. */
    id: string
    /** Name of the project. */
    title: string
  }

  /** Order of the projects: by their newest conversation, or by name. */
  export type ConversationHistoryProjectSort = 'recent' | 'name'

  export interface ConversationHistoryProps {
    /** Conversations, any order; they are sorted newest first inside their group or project. */
    items?: ConversationHistoryItem[]
    /** Projects shown in a Projects section above Recents; empty keeps the plain date groups. */
    projects?: ConversationHistoryProject[]
    /** Reference time for the groups. Empty uses the nearest ConfigProvider now, then the current time; set either when the list is rendered on the server. */
    now?: string | number | Date
    /** Shows a Delete button on each row that emits `remove`. */
    removable?: boolean
    /** Shows a New chat row at the top that emits `create`. */
    creatable?: boolean
    /** Shows a New project button in the Projects header that emits `project-create`. */
    projectCreatable?: boolean
    /** Shows a search field at the top that hides conversations whose title does not contain the typed text. */
    searchable?: boolean
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
    loading: false,
    ariaLabel: ''
  })

  const emit = defineEmits<{
    remove: [event: MouseEvent, id: string]
    create: [event: MouseEvent]
    'project-create': [event: MouseEvent]
  }>()

  const model = defineModel<string | null>({ default: null })
  const openKeys = defineModel<string[]>('openKeys', { default: () => [] })
  const projectsOpen = defineModel<boolean>('projectsOpen', { default: true })
  const projectSort = defineModel<ConversationHistoryProjectSort>('projectSort', {
    default: 'recent'
  })

  const attrs = useAttrs()
  const uid = useId()
  const { t, locale } = useTranslate({ conversationHistory: en.conversationHistory })
  const { context: localeContext } = useLocaleContext()
  const query = ref('')

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

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'conversation-history'
  )

  const needle = computed<string>(() => (props.searchable ? query.value.trim() : ''))

  const {
    rows: projectRows,
    outside,
    hasMatch
  } = useConversationHistoryProjects({
    items: () => props.items,
    projects: () => props.projects,
    query: needle,
    locale,
    sort: projectSort
  })

  const showProjects = computed<boolean>(
    () =>
      (props.projects.length > 0 || props.projectCreatable) &&
      !(needle.value && !projectRows.value.length)
  )
  const sectionOpen = computed<boolean>(() => Boolean(needle.value) || projectsOpen.value)
  const isProjectOpen = (id: string): boolean =>
    Boolean(needle.value) || openKeys.value.includes(id)

  const toggleProject = (id: string) => {
    openKeys.value = openKeys.value.includes(id)
      ? openKeys.value.filter((key) => key !== id)
      : [...openKeys.value, id]
  }

  const { groups, observe } = useConversationHistoryGroups(
    outside,
    () => props.now ?? localeContext?.now?.value ?? Date.now()
  )

  const navEl = ref<HTMLElement | null>(null)
  const { track } = useConversationHistoryRemovalFocus(navEl, () =>
    props.items.map((item) => item.id)
  )

  const onRemove = (event: MouseEvent, id: string) => {
    track(event, id)
    emit('remove', event, id)
  }

  const ROW_ACTION_CLASS =
    'flex h-11 min-w-0 flex-1 items-center gap-(--spacing-xs) rounded-(--shape-control) px-(--spacing-sm) text-start text-label-lg text-(--text-default) outline-none ' +
    'pointer-fine:h-9 pointer-fine:text-label-md transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) motion-reduce:transition-none ' +
    'focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset'

  const SECTION_BUTTON_CLASS =
    'flex h-11 min-w-0 flex-1 items-center gap-(--spacing-2xs) rounded-(--shape-control) px-(--spacing-sm) text-start text-label-sm text-(--text-muted) outline-none ' +
    'pointer-fine:h-8 transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-default) motion-reduce:transition-none ' +
    'focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset'

  const LIST_CLASS = 'm-0 flex list-none flex-col gap-(--spacing-2xs) p-0'

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
    <div
      v-if="creatable || searchable"
      class="flex flex-col gap-(--spacing-xs)"
    >
      <button
        v-if="creatable"
        type="button"
        :class="ROW_ACTION_CLASS"
        :data-testid="`${testId}__create`"
        @click="(event: MouseEvent) => emit('create', event)"
      >
        <i
          class="az az-square-pen shrink-0 text-(--text-muted)"
          aria-hidden="true"
        />
        <span class="truncate">{{ t('conversationHistory.newChat') }}</span>
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
          <i class="az az-search" />
        </template>
      </Input>
    </div>
    <ul
      v-if="loading"
      class="m-0 flex list-none flex-col gap-(--spacing-xs) p-0"
      :data-testid="`${testId}__loading`"
    >
      <li
        v-for="n in 5"
        :key="n"
        class="px-(--spacing-sm)"
      >
        <Skeleton
          variant="rectangle"
          :width="`${90 - n * 8}%`"
          height="var(--size-5)"
        />
      </li>
    </ul>
    <p
      v-else-if="needle && !hasMatch"
      :class="NOTE_CLASS"
      :data-testid="`${testId}__no-match`"
    >
      {{ t('conversationHistory.noMatch', { query: query.trim() }) }}
    </p>
    <template v-else>
      <div
        v-if="showProjects"
        class="flex flex-col gap-(--spacing-2xs)"
        :data-state="sectionOpen ? 'open' : 'closed'"
      >
        <div class="flex min-w-0 items-center gap-(--spacing-2xs)">
          <button
            :id="`${uid}-projects`"
            type="button"
            :aria-expanded="sectionOpen"
            :aria-controls="`${uid}-projects-list`"
            :class="SECTION_BUTTON_CLASS"
            :data-testid="`${testId}__projects`"
            @click="projectsOpen = !projectsOpen"
          >
            <span class="truncate">{{ t('conversationHistory.projects') }}</span>
            <i
              :class="sectionOpen ? 'az az-chevron-down' : 'az az-chevron-right'"
              aria-hidden="true"
            />
          </button>
          <ProjectSortMenu
            v-if="projects.length > 1"
            v-model="projectSort"
            :data-testid="`${testId}__sort`"
          />
          <IconButton
            v-if="projectCreatable"
            icon="az az-plus"
            :ariaLabel="t('conversationHistory.newProject')"
            variant="ghost"
            size="small"
            :data-testid="`${testId}__project-create`"
            @click="(event: MouseEvent) => emit('project-create', event)"
          />
        </div>
        <ul
          v-show="sectionOpen"
          :id="`${uid}-projects-list`"
          :aria-labelledby="`${uid}-projects`"
          :class="LIST_CLASS"
        >
          <li
            v-for="row in projectRows"
            :key="row.project.id"
            class="flex flex-col gap-(--spacing-2xs)"
            :data-state="isProjectOpen(row.project.id) ? 'open' : 'closed'"
          >
            <button
              :id="`${uid}-project-${row.index}`"
              type="button"
              :aria-expanded="isProjectOpen(row.project.id)"
              :aria-controls="`${uid}-project-${row.index}-list`"
              :title="row.project.title"
              :class="ROW_ACTION_CLASS"
              :data-testid="`${testId}__project`"
              @click="toggleProject(row.project.id)"
            >
              <i
                :class="isProjectOpen(row.project.id) ? 'az az-folder-open' : 'az az-folder'"
                class="shrink-0 text-(--text-muted)"
                aria-hidden="true"
              />
              <bdi
                dir="auto"
                class="truncate"
                >{{ row.project.title }}</bdi
              >
            </button>
            <ul
              v-if="isProjectOpen(row.project.id)"
              :id="`${uid}-project-${row.index}-list`"
              :aria-labelledby="`${uid}-project-${row.index}`"
              :class="LIST_CLASS"
              class="ps-(--spacing-md)"
            >
              <li
                v-if="!row.items.length"
                :class="NOTE_CLASS"
                class="py-(--spacing-2xs)"
                :data-testid="`${testId}__project-empty`"
              >
                {{ t('conversationHistory.projectEmptyTitle') }}
              </li>
              <ConversationHistoryRow
                v-for="item in row.items"
                :key="item.id"
                :item="item"
                :active="item.id === model"
                :removable="removable"
                :data-testid="`${testId}__item`"
                @select="model = item.id"
                @remove="(event: MouseEvent) => onRemove(event, item.id)"
              />
            </ul>
          </li>
        </ul>
      </div>
      <p
        v-if="!items.length"
        :class="NOTE_CLASS"
        :data-testid="`${testId}__empty`"
      >
        {{ t('conversationHistory.emptyTitle') }}
      </p>
      <div
        v-if="groups.length"
        class="flex flex-col gap-(--spacing-md)"
      >
        <p
          v-if="showProjects"
          class="m-0 flex h-11 items-center px-(--spacing-sm) text-label-sm text-(--text-muted) pointer-fine:h-8"
          :data-testid="`${testId}__recents`"
        >
          {{ t('conversationHistory.recents') }}
        </p>
        <div
          v-for="group in groups"
          :key="group.key"
          class="flex flex-col gap-(--spacing-2xs)"
          :data-group="group.key"
        >
          <p
            :id="`${uid}-${group.key}`"
            class="m-0 px-(--spacing-sm) pb-(--spacing-2xs) text-label-sm text-(--text-muted)"
          >
            {{ t(`conversationHistory.${group.key}`) }}
          </p>
          <ul
            :aria-labelledby="`${uid}-${group.key}`"
            :class="LIST_CLASS"
          >
            <template
              v-for="chunk in group.chunks"
              :key="chunk.index"
            >
              <li
                v-if="!chunk.mounted"
                :ref="(el) => observe(group.key, el, chunk.index)"
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
                  :active="item.id === model"
                  :removable="removable"
                  :data-testid="`${testId}__item`"
                  @select="model = item.id"
                  @remove="(event: MouseEvent) => onRemove(event, item.id)"
                />
              </template>
            </template>
          </ul>
        </div>
      </div>
    </template>
  </nav>
</template>
