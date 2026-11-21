<script setup lang="ts">
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Tabs from '@aziontech/webkit/tabs'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, onScopeDispose, ref } from 'vue'

  import { sampleEvents } from '../sample'
  import ViewEventsExplorer, { type EventsExplorerFilters } from '../view-events-explorer.vue'

  interface InvestigationSession {
    id: string
    name: string
    filters: EventsExplorerFilters
    search: string
  }

  const sessionLimit = 5

  const sessions = ref<InvestigationSession[]>([
    { id: 's1', name: 'All traffic', filters: { period: ['24h'] }, search: '' },
    {
      id: 's2',
      name: 'API errors',
      filters: { period: ['6h'], level: ['Error'], host: ['api.example.com'] },
      search: ''
    },
    {
      id: 's3',
      name: 'Security blocks',
      filters: { period: ['1h'], source: ['security'] },
      search: 'blocked'
    }
  ])
  const activeSession = ref('s2')
  let sessionSeed = 3

  const currentSession = computed(
    () => sessions.value.find((session) => session.id === activeSession.value) ?? sessions.value[0]
  )

  const updateSession = (id: string, patch: Partial<InvestigationSession>) => {
    sessions.value = sessions.value.map((session) =>
      session.id === id ? { ...session, ...patch } : session
    )
  }

  const filters = computed({
    get: () => currentSession.value.filters,
    set: (next) => updateSession(currentSession.value.id, { filters: next })
  })

  const search = computed({
    get: () => currentSession.value.search,
    set: (next) => updateSession(currentSession.value.id, { search: next })
  })

  const sessionNotice = ref('')
  const sessionStripEl = ref<HTMLElement | null>(null)

  const focusSessionTab = async (id: string) => {
    await nextTick()
    sessionStripEl.value?.querySelector<HTMLElement>(`[data-testid="session-tab-${id}"]`)?.focus()
  }

  const newSession = () => {
    if (sessions.value.length >= sessionLimit) {
      sessionNotice.value = `Up to ${sessionLimit} investigations stay open. Close one to start another.`
      return
    }
    sessionSeed += 1
    const id = `s${sessionSeed}`
    sessions.value = [
      ...sessions.value,
      { id, name: `Investigation ${sessionSeed}`, filters: { period: ['24h'] }, search: '' }
    ]
    activeSession.value = id
    sessionNotice.value = ''
    focusSessionTab(id)
  }

  const duplicateSession = (id: string) => {
    const source = sessions.value.find((session) => session.id === id)
    if (!source) return
    if (sessions.value.length >= sessionLimit) {
      sessionNotice.value = `Up to ${sessionLimit} investigations stay open. Close one to start another.`
      return
    }
    sessionSeed += 1
    const copy = { ...source, id: `s${sessionSeed}`, name: `${source.name} copy` }
    const index = sessions.value.findIndex((session) => session.id === id)
    sessions.value = [
      ...sessions.value.slice(0, index + 1),
      copy,
      ...sessions.value.slice(index + 1)
    ]
    activeSession.value = copy.id
    sessionNotice.value = ''
    focusSessionTab(copy.id)
  }

  const closeSession = (id: string) => {
    if (sessions.value.length === 1) return
    const index = sessions.value.findIndex((session) => session.id === id)
    const remaining = sessions.value.filter((session) => session.id !== id)
    sessions.value = remaining
    if (activeSession.value === id) {
      activeSession.value = remaining[Math.max(0, index - 1)].id
    }
    sessionNotice.value = ''
    focusSessionTab(activeSession.value)
  }

  const renamingId = ref('')
  const renameDraft = ref('')
  const renameBox = ref({ left: 0, width: 0 })
  const renameInputEl = ref<{ $el: HTMLElement } | null>(null)

  const startRename = (id: string) => {
    const session = sessions.value.find((entry) => entry.id === id)
    const strip = sessionStripEl.value
    const tab = strip?.querySelector(`[data-testid="session-tab-${id}"]`)
    if (!session || !strip || !tab) return
    const stripBox = strip.getBoundingClientRect()
    const tabBox = tab.getBoundingClientRect()
    renameBox.value = { left: tabBox.left - stripBox.left, width: tabBox.width }
    renameDraft.value = session.name
    renamingId.value = id
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const input = renameInputEl.value?.$el?.querySelector('input') ?? null
        input?.focus()
        input?.select()
      })
    )
  }

  const finishRename = (commit: boolean) => {
    const id = renamingId.value
    if (!id) return
    const name = renameDraft.value.trim()
    if (commit && name) updateSession(id, { name })
    renamingId.value = ''
    focusSessionTab(id)
  }

  const sessionOf = (event: Event) =>
    (event.target as HTMLElement | null)
      ?.closest?.<HTMLElement>('[role="tab"]')
      ?.dataset.testid?.replace('session-tab-', '') ?? ''

  const onSessionDblclick = (event: MouseEvent) => {
    const id = sessionOf(event)
    if (id) startRename(id)
  }

  const onSessionKeydown = (event: KeyboardEvent) => {
    const id = sessionOf(event)
    if (!id) return
    if (event.key === 'F2') {
      event.preventDefault()
      startRename(id)
    }
  }

  const onSessionAction = (_event: MouseEvent | KeyboardEvent, value: DropdownMenuItemValue) => {
    const id = activeSession.value
    if (value === 'rename') startRename(id)
    if (value === 'duplicate') duplicateSession(id)
    if (value === 'close') closeSession(id)
  }

  const loading = ref(false)
  let refreshTimer: ReturnType<typeof setTimeout> | undefined
  const onRefresh = () => {
    if (loading.value) return
    loading.value = true
    clearTimeout(refreshTimer)
    refreshTimer = setTimeout(() => {
      loading.value = false
    }, 700)
  }
  onScopeDispose(() => clearTimeout(refreshTimer))
</script>

<template>
  <div
    data-layout-fill
    class="flex h-dvh min-h-0 flex-col"
  >
    <section
      ref="sessionStripEl"
      aria-label="Investigations"
      class="relative flex shrink-0 flex-col gap-(--spacing-2xs) border-b border-(--border-default) px-(--spacing-lg) pt-(--spacing-xs)"
      data-testid="session-strip"
    >
      <div class="flex min-w-0 items-center gap-(--spacing-xs)">
        <div
          role="presentation"
          class="min-w-0 flex-1"
          @keydown="onSessionKeydown"
          @dblclick="onSessionDblclick"
        >
          <Tabs v-model="activeSession">
            <Tabs.List>
              <Tabs.Trigger
                v-for="session in sessions"
                :key="session.id"
                :value="session.id"
                :label="session.name"
                :closable="sessions.length > 1"
                :data-testid="`session-tab-${session.id}`"
                @close="closeSession(session.id)"
              />
            </Tabs.List>
          </Tabs>
        </div>
        <Tooltip content="New investigation">
          <IconButton
            icon="az az-plus"
            variant="ghost"
            size="small"
            aria-label="New investigation"
            data-testid="session-new"
            @click="newSession"
          />
        </Tooltip>
        <DropdownMenu
          side="bottom"
          align="end"
          @select="onSessionAction"
        >
          <DropdownMenu.Trigger>
            <Tooltip content="Investigation actions">
              <IconButton
                icon="az az-ellipsis"
                variant="ghost"
                size="small"
                :aria-label="`Actions for ${currentSession.name}`"
                data-testid="session-actions"
              />
            </Tooltip>
          </DropdownMenu.Trigger>
          <DropdownMenu.Group>
            <DropdownMenu.Item
              value="rename"
              label="Rename"
              command="F2"
            />
            <DropdownMenu.Item
              value="duplicate"
              label="Duplicate"
            />
            <DropdownMenu.Item
              value="close"
              label="Close investigation"
              :disabled="sessions.length === 1"
            />
          </DropdownMenu.Group>
        </DropdownMenu>
      </div>
      <div
        v-if="renamingId"
        class="absolute top-(--spacing-xs) z-10"
        :style="{ left: `${renameBox.left}px`, width: `${Math.max(renameBox.width, 160)}px` }"
      >
        <Input
          ref="renameInputEl"
          v-model="renameDraft"
          size="small"
          aria-label="Investigation name"
          class="w-full"
          data-testid="session-rename"
          @keydown.enter.prevent="finishRename(true)"
          @keydown.esc.prevent="finishRename(false)"
          @blur="finishRename(true)"
        />
      </div>
      <p
        role="status"
        class="text-body-sm text-(--text-muted)"
        data-testid="session-notice"
      >
        {{ sessionNotice }}
      </p>
    </section>
    <ViewEventsExplorer
      :key="activeSession"
      v-model:filters="filters"
      v-model:search="search"
      :events="sampleEvents"
      :loading="loading"
      class="min-h-0 flex-1"
      @refresh="onRefresh"
    />
  </div>
</template>
