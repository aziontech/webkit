<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import ConversationHistory, {
    type ConversationHistoryItem
  } from '@aziontech/webkit/conversation-history'
  import DrawerBody from '@aziontech/webkit/drawer-body'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerHeader from '@aziontech/webkit/drawer-header'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PopoverContent from '@aziontech/webkit/popover-content'
  import Popover from '@aziontech/webkit/popover-root'
  import PopoverTrigger from '@aziontech/webkit/popover-trigger'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref, watch } from 'vue'

  import {
    type AiChatProject,
    type AiChatThread,
    sampleHistory,
    sampleHistoryNow,
    sampleProjects,
    sampleThreads
  } from '../sample'
  import AiChatHistoryRow from './ai-chat-history-row.vue'
  import AiChatProjectFilter from './ai-chat-project-filter.vue'

  defineProps<{ panelOpen: boolean }>()

  const emit = defineEmits<{ create: [event: MouseEvent] }>()

  const active = defineModel<string | null>({ required: true })
  const drawerOpen = defineModel<boolean>('drawerOpen', { required: true })

  const projects = ref<AiChatProject[]>(sampleProjects.map((item) => ({ ...item })))
  const threads = ref<AiChatThread[]>(sampleThreads.map((item) => ({ ...item })))
  const search = ref('')
  const selectedProject = ref('')
  const viewMode = ref<'detailed' | 'compact'>('detailed')
  const addProjectOpen = ref(false)
  const settledOpen = ref(false)

  const projectTemplates: Omit<AiChatProject, 'id'>[] = [
    { code: 'WL', title: 'New Workload', kind: 'workload', icon: 'az az-workloads' },
    { code: 'DN', title: 'New Edge DNS', kind: 'dns', icon: 'az az-edge-dns' },
    { code: 'FW', title: 'New Edge Firewall', kind: 'firewall', icon: 'az az-firewall' },
    {
      code: 'FN',
      title: 'New Edge Function',
      kind: 'function',
      icon: 'az az-functions',
      cloud: true
    },
    {
      code: 'OS',
      title: 'New Object Storage',
      kind: 'storage',
      icon: 'az az-object-storage',
      cloud: true
    }
  ]

  const projectMap = computed(() => new Map(projects.value.map((item) => [item.id, item])))
  const threadMap = computed(() => new Map(threads.value.map((item) => [item.id, item])))
  const updatedMap = new Map(sampleHistory.map((item) => [item.id, item.updatedAt]))

  const matchingThreads = computed(() => {
    const needle = search.value.trim().toLowerCase()
    return threads.value.filter((item) => {
      if (selectedProject.value && item.projectId !== selectedProject.value) return false
      if (!needle) return true
      const projectTitle = projectMap.value.get(item.projectId)?.title ?? ''
      return (
        item.title.toLowerCase().includes(needle) || projectTitle.toLowerCase().includes(needle)
      )
    })
  })

  const toHistoryItem = (thread: AiChatThread): ConversationHistoryItem => ({
    id: thread.id,
    title: thread.title,
    updatedAt: updatedMap.get(thread.id) ?? sampleHistoryNow,
    description: viewMode.value === 'detailed' ? thread.environment : undefined
  })

  const activeItems = computed(() =>
    matchingThreads.value.filter((item) => !item.settled && !item.snoozed).map(toHistoryItem)
  )
  const snoozedItems = computed(() =>
    matchingThreads.value.filter((item) => item.snoozed && !item.settled).map(toHistoryItem)
  )
  const settledItems = computed(() =>
    matchingThreads.value.filter((item) => item.settled).map(toHistoryItem)
  )

  watch(active, () => {
    drawerOpen.value = false
  })

  function create(event: MouseEvent) {
    drawerOpen.value = false
    emit('create', event)
  }

  function addProject(template: Omit<AiChatProject, 'id'>) {
    const id = `${template.kind}-${projects.value.length + 1}`
    projects.value = [...projects.value, { ...template, id }]
    selectedProject.value = id
    addProjectOpen.value = false
  }

  function togglePinProject(id: string) {
    projects.value = projects.value.map((item) =>
      item.id === id ? { ...item, pinned: !item.pinned } : item
    )
  }

  function toggleSnooze(id: string) {
    threads.value = threads.value.map((item) =>
      item.id === id ? { ...item, snoozed: !item.snoozed } : item
    )
  }

  function toggleSettle(id: string) {
    threads.value = threads.value.map((item) =>
      item.id === id ? { ...item, settled: !item.settled, snoozed: false } : item
    )
  }

  function discardDraft(id: string) {
    threads.value = threads.value.filter((item) => item.id !== id)
    if (active.value === id) active.value = null
  }
</script>

<template>
  <aside
    v-if="panelOpen"
    id="ai-chat-history"
    aria-label="Conversation history"
    class="flex w-(--container-2xs) shrink-0 flex-col gap-(--spacing-sm) overflow-y-auto border-e border-(--border-subtle) bg-(--bg-surface) p-(--spacing-xs) max-md:hidden"
  >
    <div
      class="flex items-center gap-(--spacing-2xs) border-b border-(--border-subtle) pb-(--spacing-xs)"
    >
      <Input
        v-model="search"
        size="small"
        placeholder="Search"
        aria-label="Search conversations"
        role="searchbox"
        autocomplete="off"
        class="min-w-0 flex-1"
      >
        <template #leading>
          <i
            class="az az-search"
            aria-hidden="true"
          />
        </template>
      </Input>
      <AiChatProjectFilter
        v-model="selectedProject"
        :projects="projects"
        @toggle-pin="togglePinProject"
      />
      <Popover
        v-model:open="addProjectOpen"
        side="bottom"
        align="end"
        size="small"
      >
        <PopoverTrigger>
          <IconButton
            icon="az az-folder-plus"
            aria-label="Add project"
            variant="ghost"
            size="small"
          />
        </PopoverTrigger>
        <PopoverContent>
          <div class="flex flex-col gap-0.5 p-(--spacing-xs)">
            <span class="px-(--spacing-sm) py-1 text-label-xs text-(--text-muted)">
              Add Azion resource
            </span>
            <Button
              v-for="template in projectTemplates"
              :key="template.title"
              :label="template.title"
              :icon="template.icon"
              variant="ghost"
              size="small"
              class="w-full"
              @click="addProject(template)"
            />
          </div>
        </PopoverContent>
      </Popover>
      <Tooltip content="New thread">
        <IconButton
          icon="az az-square-pen"
          aria-label="New thread"
          variant="ghost"
          size="small"
          @click="create"
        />
      </Tooltip>
    </div>

    <div class="flex items-center justify-between px-(--spacing-xs)">
      <span class="text-label-xs text-(--text-muted)">
        {{ selectedProject ? projectMap.get(selectedProject)?.title : 'Threads' }}
      </span>
      <Tooltip
        :content="
          viewMode === 'detailed' ? 'Switch to single-line view' : 'Switch to detailed view'
        "
      >
        <IconButton
          :icon="viewMode === 'detailed' ? 'az az-list' : 'az az-layout-grid'"
          :aria-label="
            viewMode === 'detailed' ? 'Switch to single-line view' : 'Switch to detailed view'
          "
          variant="ghost"
          size="small"
          @click="viewMode = viewMode === 'detailed' ? 'compact' : 'detailed'"
        />
      </Tooltip>
    </div>

    <ConversationHistory
      v-model="active"
      :items="activeItems"
      :now="sampleHistoryNow"
    >
      <template #item="{ item }">
        <AiChatHistoryRow
          v-if="threadMap.get(item.id)"
          :thread="threadMap.get(item.id)!"
          :project="projectMap.get(threadMap.get(item.id)!.projectId)"
          :view-mode="viewMode"
          @snooze="toggleSnooze"
          @settle="toggleSettle"
          @discard="discardDraft"
        />
      </template>
    </ConversationHistory>

    <div
      v-if="snoozedItems.length"
      class="flex flex-col gap-(--spacing-2xs) pt-(--spacing-xs)"
    >
      <span class="px-(--spacing-xs) text-label-xs text-(--text-muted)">
        Snoozed ({{ snoozedItems.length }})
      </span>
      <ConversationHistory
        v-model="active"
        :items="snoozedItems"
        :now="sampleHistoryNow"
        aria-label="Snoozed conversations"
      >
        <template #item="{ item }">
          <AiChatHistoryRow
            v-if="threadMap.get(item.id)"
            :thread="threadMap.get(item.id)!"
            :project="projectMap.get(threadMap.get(item.id)!.projectId)"
            :view-mode="viewMode"
            @snooze="toggleSnooze"
            @settle="toggleSettle"
            @discard="discardDraft"
          />
        </template>
      </ConversationHistory>
    </div>

    <div
      v-if="settledItems.length"
      class="flex flex-col gap-(--spacing-2xs) pt-(--spacing-xs)"
    >
      <Button
        :label="`Settled (${settledItems.length})`"
        :icon="settledOpen ? 'az az-chevron-down' : 'az az-chevron-right'"
        icon-position="trailing"
        variant="ghost"
        size="small"
        class="w-full"
        @click="settledOpen = !settledOpen"
      />
      <ConversationHistory
        v-if="settledOpen"
        v-model="active"
        :items="settledItems"
        :now="sampleHistoryNow"
        aria-label="Settled conversations"
      >
        <template #item="{ item }">
          <AiChatHistoryRow
            v-if="threadMap.get(item.id)"
            :thread="threadMap.get(item.id)!"
            :project="projectMap.get(threadMap.get(item.id)!.projectId)"
            :view-mode="viewMode"
            @snooze="toggleSnooze"
            @settle="toggleSettle"
            @discard="discardDraft"
          />
        </template>
      </ConversationHistory>
    </div>
  </aside>

  <Drawer
    v-model:open="drawerOpen"
    side="start"
    size="small"
  >
    <DrawerContent>
      <DrawerHeader class="w-full">
        <DrawerTitle>Conversation history</DrawerTitle>
      </DrawerHeader>
      <DrawerBody>
        <ConversationHistory
          v-model="active"
          :items="activeItems"
          :now="sampleHistoryNow"
        >
          <template #item="{ item }">
            <AiChatHistoryRow
              v-if="threadMap.get(item.id)"
              :thread="threadMap.get(item.id)!"
              :project="projectMap.get(threadMap.get(item.id)!.projectId)"
              :view-mode="viewMode"
              @snooze="toggleSnooze"
              @settle="toggleSettle"
              @discard="discardDraft"
            />
          </template>
        </ConversationHistory>
      </DrawerBody>
    </DrawerContent>
  </Drawer>
</template>
