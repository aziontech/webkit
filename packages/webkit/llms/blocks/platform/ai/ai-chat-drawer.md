# AiChatDrawer (`platform/ai/ai-chat-drawer`)

> The generative AI assistant in a right-side drawer over a resource page, so the reader asks about what they are looking at without leaving it: a workload page (`PageHeader` with an Ask AI `Button`, a `Card` of `KeyValuePairs` with a `StatusIndicator`) behind a medium `Drawer` whose `PanelHeader` holds `DrawerTitle`, a Preview `Tag`, New chat and `DrawerClose`. Inside, an `EmptyState` with support prompts about this workload (`SuggestionGroup`), then a `Conversation` with every message at the inline start, responses that think (`Reasoning`), stream (`StreamingResponse`), cite (`Sources`) and carry Copy, Regenerate and feedback, and a `PromptInput` pinned at the foot with the disclaimer. Built from `Drawer`, `DrawerPortal`, `DrawerOverlay`, `DrawerContent`, `DrawerTitle`, `DrawerClose`, `PanelHeader`, `ChatMessage`, `Conversation`, `PromptInput`, `IconButton` and `CopyButton`. A page body for ConsoleLayout, rendered in its default slot.

- Surface: product
- Source: `blocks/platform/ai/ai-chat-drawer/ai-chat-drawer.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/ai/ai-chat-drawer")`
- Components: [Button](../../../components/button.md), [Card](../../../components/card.md), [ChatMessage](../../../components/chat-message.md), [Conversation](../../../components/conversation.md), [CopyButton](../../../components/copy-button.md), [Drawer](../../../components/drawer.md), `DrawerClose`, `DrawerContent`, `DrawerOverlay`, `DrawerPortal`, `DrawerTitle`, [EmptyState](../../../components/empty-state.md), [IconButton](../../../components/icon-button.md), [KeyValuePairs](../../../components/key-value-pairs.md), [PageHeader](../../../components/page-header.md), `PanelHeader`, [PromptInput](../../../components/prompt-input.md), [Reasoning](../../../components/reasoning.md), [Sources](../../../components/sources.md), [StatusIndicator](../../../components/status-indicator.md), [StreamingResponse](../../../components/streaming-response.md), [SuggestionGroup](../../../components/suggestion-group.md), [Tag](../../../components/tag.md)
- Skills: `webkit-genai`, `webkit-ui-states`, `webkit-microcopy`

## Asked as

ai assistant drawer; ask ai about this page; contextual ai help; copilot panel; ai side panel; chat drawer; assistant over console page; ai help drawer; assistente de ia na gaveta; perguntar à ia; painel lateral de ia; asistente de ia en panel lateral

The generative AI assistant beside the work: the reader is on a resource page — here a workload whose error rate is up — and opens the assistant in a drawer to ask about what they see, without losing the page. The drawer carries the same conversation as the full assistant page, laid out for a narrow column: every message at the inline start, a shorter composer, and support prompts written about this resource. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header and the `main`.

## When to use

- A resource or list page where questions are about what is on screen: why a metric moved, what a setting does, how to fix a status.
- A global Ask AI entry point in the console header, when the reader should keep their place.
- A short exchange that ends back on the page (the reader acts on the answer there).

## When not to use

- Long, open-ended work with the assistant as the main task: use `platform/ai/ai-chat`.
- Static help about the page that does not need a conversation: use `HelpPanel` in a drawer.
- An action the assistant proposes: show `platform/ai/ai-action-approval` inside this conversation; never let the drawer change the page on its own.
- A create or edit form: use `platform/create/create-in-drawer`.

## Building blocks

### A. Page behind — `PageHeader`, `Card`, `KeyValuePairs`, `StatusIndicator`

The resource page the reader is on. The assistant's support prompts and answers refer to it, so keep it visible behind the overlay.

### B. Entry point — `Button`

An outlined Ask AI `Button` with the assistant mark in the page header actions, `aria-expanded` while the drawer is open. A console-wide entry point lives in the global header instead.

### C. Drawer frame — `Drawer`, `DrawerPortal`, `DrawerOverlay`, `DrawerContent`

A medium right-side `Drawer`. Escape, the overlay and the close button dismiss it; the conversation survives closing and reopening during the visit.

### D. Header — `PanelHeader`, `DrawerTitle`, `Tag`, `IconButton`, `DrawerClose`

`DrawerTitle` with the assistant's name, a Preview `Tag`, New chat as an `IconButton` and `DrawerClose`.

### E. Empty state — `EmptyState`, `SuggestionGroup`

A small `EmptyState` titled with the resource ("Ask about storefront") and three support prompts about it, stacked.

### F. Message log — `Conversation`

`alignment="start"`: every message at the inline start, distinguished by avatar and author line, as Cloudscape asks for dense side panels. It is the only part of the drawer that scrolls.

### G. Messages — `ChatMessage`, `Reasoning`, `StreamingResponse`, `Sources`, `CopyButton`

The same prompt and response anatomy as the full page: loading, thinking, streaming with citations, sources, and `ChatMessage.Actions` with `CopyButton`, Regenerate and feedback.

### H. Follow-up questions — `SuggestionGroup`

After the last complete response, aligned with its text.

### I. Composer — `PromptInput`

At the foot of the drawer above a divider: four rows at most, a placeholder that names the resource, Stop while generating, and the short disclaimer as its hint.

## Do

- Write support prompts and the placeholder about the resource on screen.
- Keep the page visible and unchanged while the drawer is open.
- Keep the conversation when the drawer closes and reopens during the visit.
- Use `alignment="start"` for every message in the drawer.

## Don't

- Don't change the page from a response; propose the change and ask for approval.
- Don't stack a second drawer from the assistant; link to the page that does the job.
- Don't open the drawer on its own; the reader opens it.
- Don't repeat the page title in every response; the context is implied.

## Copy

- **Entry point:** `Ask AI`.
- **Drawer title:** `AI assistant`, with the Preview tag while in preview.
- **Empty state:** "Ask about <resource>" and one sentence saying the assistant reads this resource's settings and metrics.
- **Placeholder:** "Ask about <resource>".
- **Disclaimer:** "The AI assistant can make mistakes. Check important information."
- Errors, loading and feedback strings follow `platform/ai/ai-chat` and `skills/webkit-microcopy`.

## Accessibility

- The drawer traps focus while open and returns it to Ask AI when it closes; `DrawerTitle` names the dialog.
- Ask AI exposes `aria-expanded`.
- The log is a named `role="log"` with live behavior off; finished responses are announced once through the conversation's polite region.
- New chat is an icon button with an accessible name; it is disabled while the thread is empty.
- Keyboard order inside the drawer: header controls, log, message actions, follow-ups, composer.

## States

- Empty: the drawer open on the empty state with three support prompts about storefront.
- Streaming: a response streaming in about the errors of the workload behind the drawer.
- Error: a failed response with its partial text and Try again.
- LongThread: six earlier turns that overflow the drawer's log.

## Related

- `platform/ai/ai-chat` — the full-page assistant.
- `platform/ai/ai-action-approval` — authorization of an action the assistant proposes.
- `platform/create/create-in-drawer` — the drawer for forms, not conversations.
- `skills/webkit-genai` — the rules for generative AI surfaces.

## Variants

- `Empty` — primary (the code below)
- `Streaming` — The drawer open on a response streaming in about the 502 errors of the workload behind it, with the caret, Stop in the composer and the busy region.
- `Error` — A response that failed mid-stream inside the drawer: the partial text, the error line and Try again.
- `LongThread` — Six earlier turns about the workload in the narrow drawer: the log opens on the newest response and Scroll to the latest message returns after scrolling up.

Each variant is the same screen in another state: `get_pattern("platform/ai/ai-chat-drawer", { variant })`, or the file under `blocks/platform/ai/ai-chat-drawer/variants/`.

## Code (`Empty`)

````vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ChatMessage from '@aziontech/webkit/chat-message'
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
  import PromptInput from '@aziontech/webkit/prompt-input'
  import Reasoning from '@aziontech/webkit/reasoning'
  import Sources from '@aziontech/webkit/sources'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import SuggestionGroup from '@aziontech/webkit/suggestion-group'
  import Tag from '@aziontech/webkit/tag'
  import { computed, onBeforeUnmount, reactive, ref } from 'vue'

  const supportPrompts = [
    {
      id: 'errors',
      label: 'Why is storefront answering with 502 errors?',
      icon: 'pi pi-exclamation-triangle'
    },
    { id: 'purge', label: 'How do I purge the cache of one URL?', icon: 'pi pi-bolt' },
    { id: 'domains', label: 'Which domains does storefront answer on?', icon: 'pi pi-globe' }
  ]

  const turns = ref([])
  const state = ref('ready')
  const prompt = ref('')
  const composer = ref(null)
  const assistantOpen = ref(true)

  const knowledge = {
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

  function answerFor(text) {
    return /error|502|5xx|fail/i.test(text) ? knowledge.errors : knowledge.cache
  }

  function clock() {
    return new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(
      new Date()
    )
  }

  let nextId = turns.value.length + 1
  let timer

  function stopTimers() {
    clearTimeout(timer)
    clearInterval(timer)
  }

  function stream(turn) {
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

  function finish(turn) {
    stopTimers()
    turn.state = 'complete'
    turn.thinking = false
    state.value = 'ready'
    composer.value?.focus()
  }

  function respond(turn) {
    turn.state = 'pending'
    turn.thinking = true
    turn.content = ''
    state.value = 'submitted'
    timer = setTimeout(() => {
      turn.thinking = false
      stream(turn)
    }, 1400)
  }

  function send(text) {
    if (!text.trim() || state.value !== 'ready') return
    prompt.value = ''
    turns.value.push({ id: nextId++, from: 'user', text, time: clock() })
    const turn = reactive({
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

  function retry(turn) {
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
````
