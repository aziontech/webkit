<script setup lang="ts">
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/ui/dropdown-menu'
  import IconButton from '@aziontech/ui/icon-button'
  import Input from '@aziontech/ui/input'
  import Tabs from '@aziontech/ui/tabs'
  import Tooltip from '@aziontech/ui/tooltip'
  import { nextTick, ref } from 'vue'

  import type { InvestigationSession } from '../composables/use-investigation-sessions'

  export interface InvestigationTabsProps {
    /** The open investigations, in order. */
    sessions: InvestigationSession[]
    /** Name of the active investigation. */
    currentName: string
    /** Why the last action did nothing. */
    notice: string
  }

  const props = defineProps<InvestigationTabsProps>()

  const emit = defineEmits<{
    create: []
    duplicate: [id: string]
    close: [id: string]
    rename: [id: string, name: string]
  }>()

  const activeSession = defineModel<string>('active', { required: true })

  const sessionStripEl = ref<HTMLElement | null>(null)

  const focusSessionTab = async (id: string) => {
    await nextTick()
    sessionStripEl.value?.querySelector<HTMLElement>(`[data-testid="session-tab-${id}"]`)?.focus()
  }

  const act = async (run: () => void) => {
    const count = props.sessions.length
    run()
    await nextTick()
    if (props.sessions.length !== count) focusSessionTab(activeSession.value)
  }

  const renamingId = ref('')
  const renameDraft = ref('')
  const renameBox = ref({ left: 0, width: 0 })
  const renameInputEl = ref<{ $el: HTMLElement } | null>(null)

  const startRename = (id: string) => {
    const session = props.sessions.find((entry) => entry.id === id)
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
    if (commit && name) emit('rename', id, name)
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
    if (value === 'duplicate') act(() => emit('duplicate', id))
    if (value === 'close') act(() => emit('close', id))
  }
</script>

<template>
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
              @close="act(() => emit('close', session.id))"
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
          @click="act(() => emit('create'))"
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
              :aria-label="`Actions for ${currentName}`"
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
      {{ notice }}
    </p>
  </section>
</template>
