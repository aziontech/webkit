# AiChatDrawer (`ai/ai-chat-drawer`)

> The generative AI assistant in a right-side drawer over a resource page, so the reader asks about what they are looking at without leaving it: a workload page (`PageHeader` with an Agent `Button`, the name the console header gives the assistant, a `Card` of `KeyValueList` with a `StatusIndicator`) beside a medium `Drawer` with `:modal="false"` (no overlay), so the page stays undimmed and readable whose `PanelHeader` holds `DrawerTitle`, a Preview `Tag`, New chat and the drawer's own close button. Inside, an `EmptyState` with support prompts about this workload (`SuggestionGroup`), then a `Conversation` with every message at the inline start, responses that think (`Reasoning`), stream (`StreamingResponse`), cite (`Sources`) and carry Copy, Regenerate and feedback, and a `PromptInput` pinned at the foot with the disclaimer. Built from `Drawer`, `DrawerContent`, `DrawerTitle`, `PanelHeader`, `ChatMessage`, `Conversation`, `PromptInput`, `IconButton` and `CopyButton`. A page body for ConsoleLayout, rendered in its default slot; inside ConsoleLayout on a wide screen the same conversation can go in the layout's tools region (`v-model:tools-open`) instead.

- Surface: app
- Source: `blocks/ai/ai-chat-drawer/ai-chat-drawer.vue` in `@aziontech/webkit`
- MCP: `get_block("ai/ai-chat-drawer")`
- Components: [Button](../../components/button.md), [Card](../../components/card.md), [ChatMessage](../../components/chat-message.md), [Conversation](../../components/conversation.md), [CopyButton](../../components/copy-button.md), `DrawerContent`, [Drawer](../../components/drawer.md), `DrawerTitle`, [EmptyState](../../components/empty-state.md), [IconButton](../../components/icon-button.md), [KeyValueList](../../components/key-value-list.md), [PageHeader](../../components/page-header.md), `PanelHeader`, [PromptInput](../../components/prompt-input.md), [Reasoning](../../components/reasoning.md), [Sources](../../components/sources.md), [StatusIndicator](../../components/status-indicator.md), [StreamingResponse](../../components/streaming-response.md), [SuggestionGroup](../../components/suggestion-group.md), [Tag](../../components/tag.md)
- Skills: `webkit-ai-surfaces`, `webkit-ui-states`, `webkit-microcopy`

## Asked as

ai assistant drawer; ask ai about this page; contextual ai help; copilot panel; ai side panel; chat drawer; assistant over console page; ai help drawer; assistente de ia na gaveta; perguntar à ia; painel lateral de ia; asistente de ia en panel lateral; ask about this page; assistant side panel

The generative AI assistant beside the work: the reader is on a resource page — here a workload whose error rate is up — and opens the assistant in a drawer to ask about what they see, without losing the page. The drawer carries the same conversation as the full assistant page, laid out for a narrow column: every message at the inline start, a shorter composer, and support prompts written about this resource. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header and the `main`.

## When to use

- Use ai-chat-drawer when the questions are about the page the user is on and they should keep it in view.
- A resource or list page where questions are about what is on screen: why a metric moved, what a setting does, how to fix a status.
- A global Agent entry point in the console header, when the reader should keep their place.
- A short exchange that ends back on the page (the reader acts on the answer there).

## When not to use

- Long, open-ended work with the assistant as the main task: use `ai/ai-chat`.
- Static help about the page that does not need a conversation: use `HelpPanel` in a drawer.
- An action the assistant proposes: show `ai/ai-action-approval` inside this conversation; never let the drawer change the page on its own.
- A create or edit form: use `create/create-drawer`.

## Building blocks

### A. Page behind — `PageHeader`, `Card`, `KeyValueList`, `StatusIndicator`

The resource page the reader is on. The assistant's support prompts and answers refer to it, so keep it visible and undimmed: the drawer has no overlay.

### B. Entry point — `Button`

An outlined Agent `Button` with the assistant mark in the page header actions, `aria-expanded` while the drawer is open. A console-wide entry point lives in the global header instead.

### C. Drawer frame — `Drawer`, `DrawerContent`

A medium right-side `Drawer` with no so the resource page beside it stays undimmed and readable while the reader asks about it. Escape and the close button dismiss it. Inside `ConsoleLayout` on a wide screen, put the same conversation in the layout's tools region (`v-model:tools-open`, as the console Notifications do) and keep the drawer for narrow screens; the conversation survives closing and reopening during the visit.

### D. Header — `PanelHeader`, `DrawerTitle`, `Tag`, `IconButton`

`DrawerTitle` with the assistant's name, a Preview `Tag`, New chat as an `IconButton`, then the drawer's own close button.

### E. Empty state — `EmptyState`, `SuggestionGroup`

A small `EmptyState` titled with the resource ("Ask about storefront") and three support prompts about it, stacked.

### F. Message log — `Conversation`

`layout="start"`: every message at the inline start, distinguished by avatar and author line, as Cloudscape asks for dense side panels. It is the only part of the drawer that scrolls.

### G. Messages — `ChatMessage`, `Reasoning`, `StreamingResponse`, `Sources`, `CopyButton`

The same prompt and response anatomy as the full page: loading, thinking, streaming with citations, sources, and `ChatMessage.Actions` with `CopyButton`, Regenerate and feedback.

### H. Follow-up questions — `SuggestionGroup`

After the last complete response, aligned with its text.

### I. Composer — `PromptInput`

At the foot of the drawer above a divider: four rows at most, a placeholder that names the resource, Stop while generating, and the short disclaimer as its hint.

## Data

The block takes the conversation through props and emits every action; it calls no model. `AiChatDrawerMessage`, `AiChatDrawerProps` and `AiChatDrawerFeedback` are exported from `ai-chat-drawer.vue`, and `sample.ts` holds the starter prompts the empty state renders when `suggestions` is left out, plus the sample threads the variants pass. The draft in the composer stays local.

| Prop           | Type                    | What it does                                                                                                                                |
| -------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `messages`     | `AiChatDrawerMessage[]` | The conversation, oldest first: the reader's text, the assistant's Markdown with its reasoning and sources. Empty, the empty state renders. |
| `suggestions`  | `SuggestionGroupItem[]` | The starter prompts under the empty state.                                                                                                  |
| `followUps`    | `SuggestionGroupItem[]` | Follow-up questions under the last finished answer.                                                                                         |
| `loading`      | `boolean`               | The assistant is answering: the last assistant message thinks while its `content` is empty, then streams; the composer shows Stop.          |
| `error`        | `string`                | Why the last answer failed, shown on it with Try again; its partial text stays.                                                             |
| `v-model:open` | `boolean`               | Whether the drawer is open (open by default); Agent opens it and its close button closes it.                                                |

| Event      | Payload                | When                                                                                      |
| ---------- | ---------------------- | ----------------------------------------------------------------------------------------- |
| `send`     | `(event, text)`        | The composer, a starter prompt or a follow-up; append the reader's message and the reply. |
| `stop`     | `(event)`              | Stop while the answer streams; keep the text and set `stopped` on it.                     |
| `retry`    | `(event, message)`     | Try again on a failed answer or Regenerate response.                                      |
| `new-chat` | `(event)`              | New chat; clear `messages`.                                                               |
| `feedback` | `({ message, value })` | The reader rated an answer.                                                               |

To go live, render the block from a page that owns the conversation and the model call:

```vue
<script setup lang="ts">
  import AiChatDrawer from './ai-chat-drawer.vue'

  const { messages, streaming, error, send, stop, retry, reset } = useAssistant()
  const failed = 'The connection was interrupted before the response finished.'
</script>

<template>
  <AiChatDrawer
    :messages="messages"
    :loading="streaming"
    :error="error ? failed : ''"
    @send="(_event, text) => send(text)"
    @stop="stop"
    @retry="(_event, message) => retry(message)"
    @new-chat="reset"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Write support prompts and the placeholder about the resource on screen.
- Keep the page visible and unchanged while the drawer is open.
- Keep the conversation when the drawer closes and reopens during the visit.
- Use `layout="start"` for every message in the drawer.

## Don't

- Don't change the page from a response; propose the change and ask for approval.
- Don't stack a second drawer from the assistant; link to the page that does the job.
- Don't open the drawer on its own; the reader opens it.
- Don't repeat the page title in every response; the context is implied.

## Copy

- **Entry point:** `Agent`, the name the console header's `HighlightButton` gives the same assistant; the panel title says what it is, `AI assistant`.
- **Drawer title:** `AI assistant`, with the Preview tag while in preview.
- **Empty state:** "Ask about <resource>" and one sentence saying the assistant reads this resource's settings and metrics.
- **Placeholder:** "Ask about <resource>".
- **Disclaimer:** "The AI assistant can make mistakes. Check important information."
- Errors, loading and feedback strings follow `ai/ai-chat` and `skills/webkit-microcopy`.

## Accessibility

- The drawer traps focus while open and returns it to Agent when it closes; `DrawerTitle` names the dialog.
- Agent exposes `aria-expanded`.
- The log is a named `role="log"` with live behavior off; finished responses are announced once through the conversation's polite region.
- New chat is an icon button with an accessible name; it is disabled while the thread is empty.
- Keyboard order inside the drawer: header controls, log, message actions, follow-ups, composer.

## States

- Empty: the drawer open with `messages` left out, on the empty state with three support prompts about storefront.
- Streaming: `loading` with a response part-way written about the errors of the workload behind the drawer.
- Error: `error` set: a failed response with its partial text and Try again.
- LongThread: six earlier turns as `messages` that overflow the drawer's log.

## Related

- `ai/ai-chat` — the full-page assistant.
- `ai/ai-action-approval` — authorization of an action the assistant proposes.
- `create/create-drawer` — the drawer for forms, not conversations.
- `skills/webkit-ai-surfaces` — the rules for generative AI surfaces.

## Variants

- `Empty` — primary (the code below)
- `Streaming` — The drawer open on a response streaming in about the 502 errors of the workload behind it, with the caret, Stop in the composer and the busy region.
- `Error` — A response that failed mid-stream inside the drawer: the partial text, the error line and Try again.
- `LongThread` — Six earlier turns about the workload in the narrow drawer: the log opens on the newest response and Scroll to the latest message returns after scrolling up.

Each variant is the same screen in another state: `get_block("ai/ai-chat-drawer", { variant })`, or the file under `blocks/ai/ai-chat-drawer/variants/`.

## Code (`Empty`)

```vue
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ChatMessage, {
    type ChatMessageFeedbackValue,
    type ChatMessageStatus
  } from '@aziontech/webkit/chat-message'
  import Conversation from '@aziontech/webkit/conversation'
  import CopyButton from '@aziontech/webkit/copy-button'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import KeyValueList from '@aziontech/webkit/key-value-list'
  import PageHeader from '@aziontech/webkit/page-header'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import type { PromptInputStatus } from '@aziontech/webkit/prompt-input'
  import PromptInput from '@aziontech/webkit/prompt-input-root'
  import Reasoning from '@aziontech/webkit/reasoning'
  import Sources, { type SourcesItem } from '@aziontech/webkit/sources'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import SuggestionGroup, { type SuggestionGroupItem } from '@aziontech/webkit/suggestion-group'
  import Tag from '@aziontech/webkit/tag'
  import { computed, ref, watch } from 'vue'

  import { sampleSuggestions } from './sample'

  /** Who wrote a message. */
  export type AiChatDrawerAuthor = 'user' | 'assistant'

  /** One message of the conversation. */
  export interface AiChatDrawerMessage {
    /** Stable key. */
    id: string
    /** The reader or the assistant. */
    from: AiChatDrawerAuthor
    /** Plain text for the reader; Markdown for the assistant, as much as has arrived. */
    content: string
    /** When it was written, already formatted. */
    time: string
    /** How the assistant reached the answer, in the collapsible Reasoning. */
    reasoning?: string
    /** How long the assistant thought, in seconds, shown once it answers. */
    reasoningSeconds?: number
    /** The documents the answer cites, numbered in order. */
    sources?: SourcesItem[]
    /** The reader stopped this response; what was written stays. */
    stopped?: boolean
  }

  /** A rating the reader gave an answer. */
  export interface AiChatDrawerFeedback {
    /** The rated answer. */
    message: AiChatDrawerMessage
    /** Helpful, not helpful, or cleared. */
    value: ChatMessageFeedbackValue | null
  }

  export interface AiChatDrawerProps {
    /** The conversation, oldest first. Left out or empty, the empty state with the suggestions renders. */
    messages?: AiChatDrawerMessage[]
    /** Starter prompts under the empty state. Left out, the sample prompts render. */
    suggestions?: SuggestionGroupItem[]
    /** Follow-up questions shown under the last finished answer. */
    followUps?: SuggestionGroupItem[]
    /** The assistant is answering: the last assistant message thinks while empty, then streams. */
    loading?: boolean
    /** Why the last answer failed, shown on it with Try again. */
    error?: string
  }

  const props = withDefaults(defineProps<AiChatDrawerProps>(), {
    messages: undefined,
    suggestions: undefined,
    followUps: undefined,
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    send: [event: MouseEvent | KeyboardEvent, text: string]
    stop: [event: MouseEvent]
    retry: [event: MouseEvent, message: AiChatDrawerMessage]
    'new-chat': [event: MouseEvent]
    feedback: [feedback: AiChatDrawerFeedback]
  }>()

  /** Whether the assistant drawer is open; Agent opens it and its close button closes it. */
  const open = defineModel<boolean>('open', { default: true })

  const prompt = ref('')
  const composerEl = ref<InstanceType<typeof PromptInput> | null>(null)
  const ratings = ref<Record<string, ChatMessageFeedbackValue | null>>({})

  const turns = computed(() => props.messages ?? [])
  const starters = computed(() => props.suggestions ?? sampleSuggestions)
  const last = computed(() => turns.value[turns.value.length - 1])

  function statusOf(turn: AiChatDrawerMessage): ChatMessageStatus {
    if (turn.from === 'user' || turn !== last.value) return 'success'
    if (props.error) return 'error'
    if (props.loading) return turn.content ? 'streaming' : 'pending'
    return 'success'
  }

  const state = computed<PromptInputStatus>(() => {
    if (!props.loading) return 'ready'
    return last.value?.from === 'assistant' && !last.value.content ? 'pending' : 'streaming'
  })

  const lastAnswer = computed(() => {
    const turn = last.value
    return turn?.from === 'assistant' && statusOf(turn) === 'success' && !turn.stopped ? turn : null
  })

  watch(
    () => props.loading,
    (now, before) => {
      if (before && !now) composerEl.value?.focus()
    }
  )

  function send(event: MouseEvent | KeyboardEvent, text: string) {
    if (!text.trim() || state.value !== 'ready') return
    prompt.value = ''
    emit('send', event, text)
  }

  function newChat(event: MouseEvent) {
    prompt.value = ''
    emit('new-chat', event)
  }

  function rate(message: AiChatDrawerMessage, value: ChatMessageFeedbackValue | null) {
    ratings.value[message.id] = value
    emit('feedback', { message, value })
  }
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
              label="Agent"
              variant="outline"
              size="medium"
              icon="az az-ask-azion"
              :aria-expanded="open ? 'true' : 'false'"
              @click="open = true"
            />
          </template>
        </PageHeader>
        <Card>
          <template #default>
            <div class="p-(--spacing-md)">
              <KeyValueList
                :columns="3"
                aria-label="Workload details"
              >
                <KeyValueList.Item label="Status">
                  <StatusIndicator
                    severity="danger"
                    label="Errors above 30%"
                  />
                </KeyValueList.Item>
                <KeyValueList.Item label="Domains"
                  >www.example.com, shop.example.com</KeyValueList.Item
                >
                <KeyValueList.Item label="Origin">api.example.com</KeyValueList.Item>
                <KeyValueList.Item label="Cache hit ratio">91%</KeyValueList.Item>
                <KeyValueList.Item label="Last deployment">Today, 13:58</KeyValueList.Item>
                <KeyValueList.Item label="Region">US East (Washington)</KeyValueList.Item>
              </KeyValueList>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <Drawer
      v-model:open="open"
      side="end"
      size="medium"
      :modal="false"
    >
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
            <div class="flex items-center gap-(--spacing-2xs)">
              <IconButton
                icon="az az-plus"
                aria-label="New chat"
                variant="ghost"
                size="small"
                :disabled="!turns.length"
                @click="newChat"
              />
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
                icon="az az-ask-azion"
                size="small"
              />
              <SuggestionGroup
                :items="starters"
                orientation="vertical"
                @select="(event, item) => send(event, item.label)"
              />
            </div>
            <Conversation
              v-else
              layout="start"
              aria-label="Conversation with the AI assistant"
            >
              <ChatMessage
                v-for="turn in turns"
                :key="turn.id"
                :from="turn.from"
                :status="statusOf(turn)"
                :timestamp="turn.time"
                :error-message="statusOf(turn) === 'error' ? error : undefined"
                @retry="emit('retry', $event, turn)"
              >
                <template v-if="turn.from === 'user'">{{ turn.content }}</template>
                <template v-else>
                  <Reasoning
                    v-if="turn.reasoning"
                    :streaming="statusOf(turn) === 'pending'"
                    :duration="statusOf(turn) === 'pending' ? undefined : turn.reasoningSeconds"
                  >
                    <p>{{ turn.reasoning }}</p>
                  </Reasoning>
                  <StreamingResponse
                    :content="turn.content"
                    :streaming="statusOf(turn) === 'streaming'"
                    :sources="turn.sources ?? []"
                    :anchor="`answer-${turn.id}`"
                  />
                  <p
                    v-if="turn.stopped"
                    class="text-body-sm text-(--text-muted)"
                  >
                    You stopped this response.
                  </p>
                  <Sources
                    v-if="statusOf(turn) === 'success' && !turn.stopped"
                    :items="turn.sources ?? []"
                    :anchor="`answer-${turn.id}`"
                  />
                </template>
                <template
                  v-if="turn.from === 'assistant'"
                  #actions
                >
                  <ChatMessage.Actions>
                    <CopyButton
                      size="small"
                      :value="turn.content"
                    />
                    <IconButton
                      icon="az az-refresh"
                      aria-label="Regenerate response"
                      variant="ghost"
                      size="small"
                      :disabled="state !== 'ready'"
                      @click="emit('retry', $event, turn)"
                    />
                    <ChatMessage.Feedback
                      :model-value="ratings[turn.id] ?? null"
                      @update:model-value="(value) => rate(turn, value)"
                    />
                  </ChatMessage.Actions>
                </template>
              </ChatMessage>
              <div
                v-if="lastAnswer && followUps?.length"
                class="ps-[calc(2rem+var(--spacing-sm))]"
              >
                <SuggestionGroup
                  :items="followUps"
                  aria-label="Follow-up questions"
                  @select="(event, item) => send(event, item.label)"
                />
              </div>
            </Conversation>
          </div>
          <div class="border-t border-(--border-default) p-(--spacing-sm)">
            <PromptInput
              ref="composerEl"
              v-model="prompt"
              :status="state"
              :max-rows="4"
              placeholder="Ask about storefront"
              @submit="(event, { value }) => send(event, value)"
              @stop="emit('stop', $event)"
            >
              <template #hint
                >The AI assistant can make mistakes. Check important information.</template
              >
            </PromptInput>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  </div>
</template>
```

## `sample.ts`

````ts
import type { SuggestionGroupItem } from '@aziontech/webkit/suggestion-group'

import type { AiChatDrawerMessage } from './ai-chat-drawer.vue'

const cacheAnswer = [
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
].join('\n')

const errorsAnswer = [
  'The **502** responses on storefront started at 14:05, when the TLS certificate of the origin `api.example.com` expired [1].',
  '',
  '| Time | 5xx rate | Cause |',
  '| --- | --- | --- |',
  '| 14:00 | 0.1% | — |',
  '| 14:05 | 38% | Origin certificate expired |',
  '',
  'Renew the certificate at the origin, or let the origin accept plain HTTP from the edge while you renew it.'
].join('\n')

export const sampleStreamingMessages: AiChatDrawerMessage[] = [
  {
    id: 'm1',
    from: 'user',
    content: 'Why is storefront answering with 502 errors?',
    time: '14:12'
  },
  {
    id: 'm2',
    from: 'assistant',
    content: errorsAnswer.slice(0, 120),
    time: '14:12',
    reasoning:
      'The reader asks about errors on storefront. The error rate rose at 14:05; the certificate of the origin expired at the same minute.',
    reasoningSeconds: 2,
    sources: [
      {
        title: 'Troubleshooting 502 responses',
        href: 'https://www.azion.com/en/documentation/',
        description: 'Azion documentation · Observe'
      }
    ]
  }
]

export const sampleInterruptedMessages: AiChatDrawerMessage[] = [
  {
    id: 'm1',
    from: 'user',
    content: 'How do I purge the cache of one URL?',
    time: '10:41'
  },
  {
    id: 'm2',
    from: 'assistant',
    content: cacheAnswer.slice(0, 104),
    time: '10:41',
    reasoning:
      'The question is about one URL, so a full purge would be too broad. Real-Time Purge by URL is the narrowest option, and the CLI does the same from a terminal.',
    reasoningSeconds: 2,
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
    ]
  }
]

export const sampleInterruptedError = 'The connection was interrupted before the response finished.'

const history: [string, string][] = [
  [
    'Which domains does storefront answer on?',
    'storefront answers on **www.example.com** and **shop.example.com**.'
  ],
  [
    'Is the certificate of shop.example.com valid?',
    'Yes. It is a Let’s Encrypt certificate, valid until **14 January**.'
  ],
  [
    'Can it renew on its own?',
    'Yes. Automatic renewal is on for both domains, 30 days before expiry.'
  ],
  ['What is the cache hit ratio today?', '**91%** over the last 24 hours, up from 87% last week.'],
  [
    'Which paths miss the cache most?',
    'The search pages under `/search`, because every query string is a new cache key.'
  ],
  [
    'How do I fix that?',
    'Set *Cache by query string* to **Allowlist** and keep only `q` and `page`.'
  ]
]

export const sampleLongThread: AiChatDrawerMessage[] = history.flatMap(
  ([question, answer], index): AiChatDrawerMessage[] => [
    { id: `q${index}`, from: 'user', content: question, time: `09:${10 + index * 4}` },
    {
      id: `a${index}`,
      from: 'assistant',
      content: answer,
      time: `09:${11 + index * 4}`,
      reasoning: 'Reading the workload settings of storefront.',
      reasoningSeconds: 2,
      sources: []
    }
  ]
)

export const sampleLongThreadFollowUps: SuggestionGroupItem[] = [
  { id: 'apply', label: 'Apply the allowlist to storefront' },
  { id: 'ratio', label: 'How much would the hit ratio improve?' }
]

export const sampleSuggestions: SuggestionGroupItem[] = [
  {
    id: 'errors',
    label: 'Why is storefront answering with 502 errors?',
    icon: 'az az-triangle-alert'
  },
  { id: 'purge', label: 'How do I purge the cache of one URL?', icon: 'az az-bolt' },
  { id: 'domains', label: 'Which domains does storefront answer on?', icon: 'az az-globe' }
]
````
