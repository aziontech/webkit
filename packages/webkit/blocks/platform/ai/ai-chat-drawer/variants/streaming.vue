<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ChatMessage, {
    type ChatMessageFeedbackValue,
    type ChatMessageState
  } from '@aziontech/webkit/chat-message'
  import Conversation from '@aziontech/webkit/conversation'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import KeyValuePairs from '@aziontech/webkit/key-value-pairs'
  import PageHeader from '@aziontech/webkit/page-header'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import PromptInput, { type PromptInputState } from '@aziontech/webkit/prompt-input'
  import Reasoning from '@aziontech/webkit/reasoning'
  import Sources, { type AiSource } from '@aziontech/webkit/sources'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import SuggestionGroup, { type SuggestionItem } from '@aziontech/webkit/suggestion-group'
  import Tag from '@aziontech/webkit/tag'
  import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'

  interface Answer {
    reasoning: string
    content: string
    sources: AiSource[]
    followUps: SuggestionItem[]
  }

  interface UserTurn {
    id: number
    from: 'user'
    text: string
    time: string
    error?: string
  }

  interface AssistantTurn {
    id: number
    from: 'assistant'
    state: ChatMessageState
    content: string
    thinking: boolean
    answer: Answer
    feedback: ChatMessageFeedbackValue | null
    time: string
    error?: string
    stopped?: boolean
  }

  type Turn = UserTurn | AssistantTurn

  const supportPrompts: SuggestionItem[] = [
    {
      id: 'errors',
      label: 'Why is storefront answering with 502 errors?',
      icon: 'pi pi-exclamation-triangle'
    },
    { id: 'purge', label: 'How do I purge the cache of one URL?', icon: 'pi pi-bolt' },
    { id: 'domains', label: 'Which domains does storefront answer on?', icon: 'pi pi-globe' }
  ]

  const turns = ref<Turn[]>([
    { id: 1, from: 'user', text: 'Why is storefront answering with 502 errors?', time: '14:12' }
  ])
  const state = ref<PromptInputState>('streaming')
  const prompt = ref('')
  const composer = ref<InstanceType<typeof PromptInput> | null>(null)
  const assistantOpen = ref(true)

  const knowledge: Record<'cache' | 'errors', Answer> = {
    cache: {
      reasoning:
        'The question is about one URL, so a full purge would be too broad. Real-Time Purge by URL is the narrowest option, and the CLI does the same from a terminal.',
      content: [
        'Use **Real-Time Purge** with the *URL* type. It removes one object from every edge location in a few seconds [1].',
        '',
        '1. Open Real-Time Purge from the products menu.',
        '2. Choose **URL** and paste the address.',
        '3. Select Purge.',
        '',
        'The same purge from the Azion CLI [2]:',
        '',
        '```bash',
        'azion purge urls --urls https://www.example.com/styles.css',
        '```'
      ].join('\n'),
      sources: [
        {
          title: 'Real-Time Purge',
          href: 'https://www.azion.com/en/documentation/',
          description: 'Azion documentation · Cache'
        },
        {
          title: 'Azion CLI: purge',
          href: 'https://www.azion.com/en/documentation/',
          description: 'Azion documentation · CLI'
        }
      ],
      followUps: [
        { id: 'wildcard', label: 'How do I purge a whole folder?' },
        { id: 'ttl', label: 'What TTL should my images use?' },
        { id: 'origin', label: 'Why does my origin still get requests?' }
      ]
    },
    errors: {
      reasoning:
        'The reader asks about errors on storefront. The error rate rose at 14:05; the certificate of the origin expired at the same minute.',
      content: [
        'The **502** responses on storefront started at 14:05, when the TLS certificate of the origin `api.example.com` expired [1].',
        '',
        '| Time | 5xx rate | Cause |',
        '| --- | --- | --- |',
        '| 14:00 | 0.1% | — |',
        '| 14:05 | 38% | Origin certificate expired |',
        '',
        'Renew the certificate at the origin, or let the origin accept plain HTTP from the edge while you renew it.'
      ].join('\n'),
      sources: [
        {
          title: 'Troubleshooting 502 responses',
          href: 'https://www.azion.com/en/documentation/',
          description: 'Azion documentation · Observe'
        }
      ],
      followUps: [
        { id: 'renew', label: 'How do I renew the origin certificate?' },
        { id: 'alert', label: 'Alert me when the error rate goes over 5%' }
      ]
    }
  }

  function answerFor(text: string): Answer {
    return /error|502|5xx|fail/i.test(text) ? knowledge.errors : knowledge.cache
  }

  function clock(): string {
    return new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(
      new Date()
    )
  }

  let nextId = turns.value.length + 1
  let timer: ReturnType<typeof setTimeout> | undefined

  function stopTimers() {
    clearTimeout(timer)
    clearInterval(timer)
  }

  function stream(turn: AssistantTurn) {
    const full = turn.answer.content
    turn.state = 'streaming'
    state.value = 'streaming'
    let index = turn.content.length
    timer = setInterval(() => {
      index = Math.min(full.length, index + 6)
      turn.content = full.slice(0, index)
      if (index >= full.length) finish(turn)
    }, 30)
  }

  function finish(turn: AssistantTurn) {
    stopTimers()
    turn.state = 'complete'
    turn.thinking = false
    state.value = 'ready'
    composer.value?.focus()
  }

  function respond(turn: AssistantTurn) {
    turn.state = 'pending'
    turn.thinking = true
    turn.content = ''
    state.value = 'submitted'
    timer = setTimeout(() => {
      turn.thinking = false
      stream(turn)
    }, 1400)
  }

  function send(text: string) {
    if (!text.trim() || state.value !== 'ready') return
    prompt.value = ''
    turns.value.push({ id: nextId++, from: 'user', text, time: clock() })
    const turn = reactive<AssistantTurn>({
      id: nextId++,
      from: 'assistant',
      state: 'pending',
      content: '',
      thinking: true,
      answer: answerFor(text),
      feedback: null,
      time: clock()
    })
    turns.value.push(turn)
    respond(turn)
  }

  function stop() {
    stopTimers()
    const turn = turns.value[turns.value.length - 1]
    if (turn?.from === 'assistant') {
      turn.state = 'complete'
      turn.thinking = false
      turn.stopped = true
    }
    state.value = 'ready'
  }

  function retry(turn: Turn) {
    if (turn.from !== 'assistant') return
    turn.stopped = false
    respond(turn)
  }

  function newChat() {
    stopTimers()
    turns.value = []
    state.value = 'ready'
    prompt.value = ''
  }

  const lastAnswer = computed(() => {
    const turn = turns.value[turns.value.length - 1]
    return turn?.from === 'assistant' && turn.state === 'complete' && !turn.stopped ? turn : null
  })

  onBeforeUnmount(stopTimers)

  const live = reactive<AssistantTurn>({
    id: 2,
    from: 'assistant',
    state: 'streaming',
    content: knowledge.errors.content.slice(0, 120),
    thinking: false,
    answer: knowledge.errors,
    feedback: null,
    time: '14:12'
  })
  turns.value.push(live)
  nextId = 3
  onMounted(() => stream(live))
</script>

<template>
  <div class="w-full">
    <div class="layout-column layout-boundary flex min-w-0 flex-col">
      <div class="layout-section-start flex flex-col gap-(--layout-section-gap)">
        <PageHeader
          title="storefront"
          description="Workload · Production"
        >
          <template #actions>
            <Button
              label="Ask AI"
              kind="outlined"
              size="medium"
              icon="ai ai-ask-azion"
              :aria-expanded="assistantOpen ? 'true' : 'false'"
              @click="assistantOpen = true"
            />
          </template>
        </PageHeader>
        <Card>
          <template #content>
            <div class="p-(--spacing-md)">
              <KeyValuePairs
                :columns="3"
                aria-label="Workload details"
              >
                <KeyValuePairs.Item label="Status">
                  <StatusIndicator
                    severity="danger"
                    label="Errors above 30%"
                  />
                </KeyValuePairs.Item>
                <KeyValuePairs.Item label="Domains"
                  >www.example.com, shop.example.com</KeyValuePairs.Item
                >
                <KeyValuePairs.Item label="Origin">api.example.com</KeyValuePairs.Item>
                <KeyValuePairs.Item label="Cache hit ratio">91%</KeyValuePairs.Item>
                <KeyValuePairs.Item label="Last deployment">Today, 13:58</KeyValuePairs.Item>
                <KeyValuePairs.Item label="Region">South America (São Paulo)</KeyValuePairs.Item>
              </KeyValuePairs>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <Drawer
      v-model:open="assistantOpen"
      side="right"
      size="medium"
    >
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
          <div class="flex min-h-0 flex-1 flex-col">
            <PanelHeader class="w-full">
              <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                <DrawerTitle>AI assistant</DrawerTitle>
                <Tag
                  label="Preview"
                  severity="info"
                  size="small"
                />
              </div>
              <div class="flex items-center gap-(--spacing-xxs)">
                <IconButton
                  icon="pi pi-plus"
                  aria-label="New chat"
                  kind="transparent"
                  size="small"
                  :disabled="!turns.length"
                  @click="newChat"
                />
                <DrawerClose />
              </div>
            </PanelHeader>
            <div class="flex min-h-0 flex-1 flex-col">
              <div
                v-if="!turns.length"
                class="flex flex-1 flex-col justify-center gap-(--spacing-lg) p-(--spacing-md)"
              >
                <EmptyState
                  title="Ask about storefront"
                  description="The assistant reads this workload’s settings and metrics to answer. It cites the documentation it uses."
                  icon="ai ai-ask-azion"
                  size="small"
                />
                <SuggestionGroup
                  :items="supportPrompts"
                  orientation="vertical"
                  @select="(item) => send(item.label)"
                />
              </div>
              <Conversation
                v-else
                alignment="start"
                aria-label="Conversation with the AI assistant"
              >
                <ChatMessage
                  v-for="turn in turns"
                  :key="turn.id"
                  :from="turn.from"
                  :state="turn.from === 'user' ? 'complete' : turn.state"
                  :timestamp="turn.time"
                  :error-message="turn.error"
                  @retry="retry(turn)"
                >
                  <template v-if="turn.from === 'user'">{{ turn.text }}</template>
                  <template v-else>
                    <Reasoning
                      :streaming="turn.thinking"
                      :duration="turn.thinking ? undefined : 2"
                    >
                      <p>{{ turn.answer.reasoning }}</p>
                    </Reasoning>
                    <StreamingResponse
                      :content="turn.content"
                      :streaming="turn.state === 'streaming'"
                      :sources="turn.answer.sources"
                      :anchor="`answer-${turn.id}`"
                    />
                    <p
                      v-if="turn.stopped"
                      class="text-body-sm text-(--text-muted)"
                    >
                      You stopped this response.
                    </p>
                    <Sources
                      v-if="turn.state === 'complete' && !turn.stopped"
                      :items="turn.answer.sources"
                      :anchor="`answer-${turn.id}`"
                    />
                  </template>
                  <template
                    v-if="turn.from === 'assistant'"
                    #actions
                  >
                    <ChatMessage.Actions>
                      <CopyButton :value="turn.content" />
                      <IconButton
                        icon="pi pi-refresh"
                        aria-label="Regenerate response"
                        kind="transparent"
                        size="small"
                        :disabled="state !== 'ready'"
                        @click="retry(turn)"
                      />
                      <ChatMessage.Feedback v-model="turn.feedback" />
                    </ChatMessage.Actions>
                  </template>
                </ChatMessage>
                <div
                  v-if="lastAnswer"
                  class="ps-[calc(2rem+var(--spacing-sm))]"
                >
                  <SuggestionGroup
                    :items="lastAnswer.answer.followUps"
                    aria-label="Follow-up questions"
                    @select="(item) => send(item.label)"
                  />
                </div>
              </Conversation>
            </div>
            <div class="border-t border-(--border-default) p-(--spacing-sm)">
              <PromptInput
                ref="composer"
                v-model="prompt"
                :state="state"
                :max-rows="4"
                placeholder="Ask about storefront"
                @submit="send"
                @stop="stop"
              >
                <template #hint
                  >The AI assistant can make mistakes. Check important information.</template
                >
              </PromptInput>
            </div>
          </div>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  </div>
</template>
