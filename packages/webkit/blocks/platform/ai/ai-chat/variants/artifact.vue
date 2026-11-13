<script setup lang="ts">
  import ArtifactCanvas from '@aziontech/webkit/artifact-canvas'
  import ArtifactPreview from '@aziontech/webkit/artifact-preview'
  import Button from '@aziontech/webkit/button'
  import ChatMessage, {
    type ChatMessageFeedbackValue,
    type ChatMessageState
  } from '@aziontech/webkit/chat-message'
  import CodeBlock from '@aziontech/webkit/code-block'
  import Conversation from '@aziontech/webkit/conversation'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import PromptInput, { type PromptInputState } from '@aziontech/webkit/prompt-input'
  import Resizable from '@aziontech/webkit/resizable'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import SuggestionGroup, { type SuggestionItem } from '@aziontech/webkit/suggestion-group'
  import Tag from '@aziontech/webkit/tag'
  import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'

  interface Draft {
    ask?: string
    reply: string
    sql: string
  }

  interface UserTurn {
    id: number
    from: 'user'
    text: string
    time: string
  }

  interface AssistantTurn {
    id: number
    from: 'assistant'
    state: ChatMessageState
    content: string
    version: number
    feedback: ChatMessageFeedbackValue | null
    time: string
    stopped?: boolean
  }

  type Turn = UserTurn | AssistantTurn

  const ARTIFACT = 'top-orders.sql'
  const drafts: Draft[] = [
    {
      ask: 'Write a query for the ten biggest orders',
      reply: 'Here is a query for the ten biggest orders, newest total first.',
      sql: 'SELECT id, customer_id, total\nFROM orders\nORDER BY total DESC\nLIMIT 10;'
    },
    {
      ask: 'Only this week',
      reply: 'Done. Version 2 keeps the orders of the last seven days.',
      sql: "SELECT id, customer_id, total\nFROM orders\nWHERE created_at > now() - interval '7 days'\nORDER BY total DESC\nLIMIT 10;"
    },
    {
      reply: 'Version 3 joins customers to show the email beside each order.',
      sql: "SELECT o.id, c.email, o.total\nFROM orders AS o\nJOIN customers AS c ON c.id = o.customer_id\nWHERE o.created_at > now() - interval '7 days'\nORDER BY o.total DESC\nLIMIT 10;"
    },
    {
      reply: 'Version 4 adds the number of items in each order.',
      sql: "SELECT o.id, c.email, o.total, count(i.id) AS items\nFROM orders AS o\nJOIN customers AS c ON c.id = o.customer_id\nJOIN order_items AS i ON i.order_id = o.id\nWHERE o.created_at > now() - interval '7 days'\nGROUP BY o.id, c.email, o.total\nORDER BY o.total DESC\nLIMIT 10;"
    }
  ]

  const versions = ref(drafts.slice(0, 2).map((draft) => draft.sql))
  const version = ref(1)
  const generating = ref(false)
  const canvasOpen = ref(true)
  const drawerOpen = ref(false)
  const width = ref(440)
  const paneCanvas = ref<InstanceType<typeof ArtifactCanvas> | null>(null)
  const drawerCanvas = ref<InstanceType<typeof ArtifactCanvas> | null>(null)
  const prompt = ref('')
  const state = ref<PromptInputState>('ready')
  const composer = ref<InstanceType<typeof PromptInput> | null>(null)

  const turns = ref<Turn[]>(
    drafts.slice(0, 2).flatMap((draft, index): Turn[] => [
      { id: index * 2 + 1, from: 'user', text: draft.ask ?? '', time: `10:0${index * 2}` },
      reactive<AssistantTurn>({
        id: index * 2 + 2,
        from: 'assistant',
        state: 'complete',
        content: draft.reply,
        version: index,
        feedback: null,
        time: `10:0${index * 2 + 1}`
      })
    ])
  )
  const followUps = computed<SuggestionItem[]>(() =>
    versions.value.length < drafts.length && state.value === 'ready'
      ? [
          { id: 'email', label: 'Show the customer email too' },
          { id: 'items', label: 'Count the items of each order' }
        ]
      : []
  )
  const lines = computed(() => versions.value[version.value].split('\n').length)

  const narrow = ref(false)
  let narrowQuery: MediaQueryList | null = null
  const onNarrowChange = () => {
    narrow.value = !!narrowQuery?.matches
    if (!narrow.value) drawerOpen.value = false
  }
  onMounted(() => {
    narrowQuery = window.matchMedia?.('(max-width: 767px)') ?? null
    narrowQuery?.addEventListener('change', onNarrowChange)
    onNarrowChange()
  })
  onBeforeUnmount(() => narrowQuery?.removeEventListener('change', onNarrowChange))

  let lastOpener: HTMLElement | null = null
  const openCanvas = async (event?: Event) => {
    lastOpener = (event?.currentTarget ??
      globalThis.document?.activeElement ??
      null) as HTMLElement | null
    if (narrow.value) {
      drawerOpen.value = true
      await nextTick()
      drawerCanvas.value?.focus()
      return
    }
    canvasOpen.value = true
    await nextTick()
    paneCanvas.value?.focus()
  }
  const closeCanvas = async () => {
    canvasOpen.value = false
    drawerOpen.value = false
    await nextTick()
    const opener =
      lastOpener?.isConnected && lastOpener.tagName === 'BUTTON'
        ? lastOpener
        : globalThis.document?.querySelector<HTMLElement>('[data-artifact-open] button')
    opener?.focus()
  }

  let nextId = turns.value.length + 1
  let timer: ReturnType<typeof setTimeout> | undefined
  const stopTimers = () => {
    clearTimeout(timer)
    clearInterval(timer)
  }

  function send(text: string) {
    if (!text.trim() || state.value !== 'ready' || versions.value.length >= drafts.length) return
    prompt.value = ''
    const draft = drafts[versions.value.length]
    turns.value.push({ id: nextId++, from: 'user', text, time: '10:12' })
    const turn = reactive<AssistantTurn>({
      id: nextId++,
      from: 'assistant',
      state: 'pending',
      content: '',
      version: versions.value.length,
      feedback: null,
      time: '10:13'
    })
    turns.value.push(turn)
    state.value = 'submitted'
    generating.value = true
    versions.value = [...versions.value, '']
    version.value = turn.version
    if (!narrow.value) canvasOpen.value = true
    timer = setTimeout(() => {
      turn.state = 'streaming'
      state.value = 'streaming'
      let index = 0
      timer = setInterval(() => {
        index = Math.min(draft.sql.length, index + 8)
        versions.value[turn.version] = draft.sql.slice(0, index)
        turn.content = draft.reply.slice(
          0,
          Math.ceil((index / draft.sql.length) * draft.reply.length)
        )
        if (index >= draft.sql.length) {
          stopTimers()
          turn.state = 'complete'
          state.value = 'ready'
          generating.value = false
          composer.value?.focus()
        }
      }, 40)
    }, 900)
  }

  function stop() {
    stopTimers()
    const turn = turns.value[turns.value.length - 1]
    if (turn?.from === 'assistant') {
      turn.state = 'complete'
      turn.stopped = true
    }
    state.value = 'ready'
    generating.value = false
  }

  onBeforeUnmount(stopTimers)
</script>

<template>
  <section
    aria-labelledby="ai-chat-artifact-title"
    class="flex min-h-0 w-full grow basis-0 flex-col"
  >
    <header
      class="flex items-center justify-between gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
    >
      <div class="flex items-center gap-(--spacing-xs)">
        <h1
          id="ai-chat-artifact-title"
          class="text-heading-xs text-(--text-default)"
        >
          AI assistant
        </h1>
        <Tag
          label="Preview"
          severity="info"
          size="small"
        />
      </div>
      <Button
        v-if="!canvasOpen && !narrow"
        label="Show artifact"
        kind="transparent"
        size="small"
        icon="pi pi-window-maximize"
        @click="openCanvas"
      />
    </header>
    <div class="flex min-h-0 flex-1">
      <Resizable
        class="w-full"
        aria-label="Conversation and artifact"
      >
        <Resizable.Pane>
          <div class="flex min-h-0 flex-1 flex-col">
            <Conversation aria-label="Conversation with the AI assistant">
              <ChatMessage
                v-for="turn in turns"
                :key="turn.id"
                :from="turn.from"
                :state="turn.from === 'user' ? 'complete' : turn.state"
                :timestamp="turn.time"
              >
                <template v-if="turn.from === 'user'">{{ turn.text }}</template>
                <template v-else>
                  <StreamingResponse
                    :content="turn.content"
                    :streaming="turn.state === 'streaming'"
                  />
                  <p
                    v-if="turn.stopped"
                    class="text-body-sm text-(--text-muted)"
                  >
                    You stopped this response. The version keeps what was written.
                  </p>
                  <div data-artifact-open>
                    <ArtifactPreview
                      :title="ARTIFACT"
                      :description="`Version ${turn.version + 1}`"
                      meta="SQL"
                      icon="pi pi-code"
                      openable
                      @open="((version = turn.version), openCanvas($event))"
                    />
                  </div>
                </template>
                <template
                  v-if="turn.from === 'assistant'"
                  #actions
                >
                  <ChatMessage.Actions>
                    <CopyButton :value="turn.content" />
                    <ChatMessage.Feedback v-model="turn.feedback" />
                  </ChatMessage.Actions>
                </template>
              </ChatMessage>
              <div
                v-if="followUps.length"
                class="ps-[calc(2rem+var(--spacing-sm))]"
              >
                <SuggestionGroup
                  :items="followUps"
                  aria-label="Follow-up questions"
                  @select="(_event, item) => send(item.label)"
                />
              </div>
            </Conversation>
          </div>
          <footer class="layout-boundary-inline pb-(--spacing-md)">
            <PromptInput
              ref="composer"
              v-model="prompt"
              :state="state"
              :max-length="4000"
              placeholder="Ask for a change to the query"
              @submit="(_event, { value }) => send(value)"
              @stop="stop"
            >
              <template #hint>
                The AI assistant can make mistakes. Check a query before you run it.
              </template>
            </PromptInput>
          </footer>
        </Resizable.Pane>
        <Resizable.Handle
          v-if="canvasOpen && !narrow"
          aria-label="Resize the artifact"
        />
        <Resizable.Pane
          v-if="canvasOpen && !narrow"
          v-model:basis="width"
          :min="320"
          :max="880"
          aria-label="Artifact"
        >
          <ArtifactCanvas
            ref="paneCanvas"
            v-model:version="version"
            :title="ARTIFACT"
            :meta="`SQL · ${lines} lines`"
            kind="code"
            :versions="versions.length"
            :streaming="generating"
            :copy-value="versions[version]"
            :download-href="`data:application/sql;charset=utf-8,${encodeURIComponent(versions[version])}`"
            @close="closeCanvas"
          >
            <CodeBlock
              :tabs="[{ label: 'SQL', value: 'sql', code: versions[version], language: 'sql' }]"
              :copyable="false"
              :bordered="false"
            />
          </ArtifactCanvas>
        </Resizable.Pane>
      </Resizable>
    </div>

    <Drawer
      v-if="narrow"
      v-model:open="drawerOpen"
      side="right"
      size="large"
    >
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
          <div class="sr-only">
            <DrawerTitle>Artifact</DrawerTitle>
          </div>
          <ArtifactCanvas
            ref="drawerCanvas"
            v-model:version="version"
            :title="ARTIFACT"
            :meta="`SQL · ${lines} lines`"
            kind="code"
            :versions="versions.length"
            :streaming="generating"
            :copy-value="versions[version]"
            @close="closeCanvas"
          >
            <CodeBlock
              :tabs="[{ label: 'SQL', value: 'sql', code: versions[version], language: 'sql' }]"
              :copyable="false"
              :bordered="false"
            />
          </ArtifactCanvas>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  </section>
</template>
