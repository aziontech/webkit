# AiChat (`platform/ai/ai-chat`)

> The full-page generative AI assistant: a header with the assistant's name, a Preview `Tag` and New chat; before the first message an `EmptyState` that says what the assistant knows, over vertical support prompts from `SuggestionGroup`; then a `Conversation` where the reader's prompts sit at the inline end and each response is a `ChatMessage` that goes pending (loading text), thinking (`Reasoning`), streaming (`StreamingResponse` with numbered citations) and complete (collapsed `Sources`, Copy, Regenerate and the feedback thumbs), followed by follow-up questions; a `PromptInput` pinned under the log with a 4,000-character limit, Stop while a response is generated, and the disclaimer under it. The primary state is the empty assistant; sending a support prompt runs the whole response cycle. Built from `ChatMessage`, `Conversation`, `PromptInput`, `StreamingResponse`, `Reasoning`, `Sources`, `SuggestionGroup`, `EmptyState`, `Tag`, `Button`, `IconButton` and `CopyButton`.

- Surface: product
- Source: `blocks/platform/ai/ai-chat/ai-chat.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/ai/ai-chat")`
- Components: [Button](../../../components/button.md), [ChatMessage](../../../components/chat-message.md), [Conversation](../../../components/conversation.md), [CopyButton](../../../components/copy-button.md), [EmptyState](../../../components/empty-state.md), [IconButton](../../../components/icon-button.md), [PromptInput](../../../components/prompt-input.md), [Reasoning](../../../components/reasoning.md), [Sources](../../../components/sources.md), [StreamingResponse](../../../components/streaming-response.md), [SuggestionGroup](../../../components/suggestion-group.md), [Tag](../../../components/tag.md)
- Skills: `webkit-genai`, `webkit-ui-states`, `webkit-microcopy`

## Asked as

ai chat; ai assistant; chatbot; copilot; chat with ai; generative ai chat; assistant page; ask ai; llm chat; conversational ui; prompt and response; streaming response; chat de ia; assistente de ia; assistente virtual; conversa com ia; chat con ia; asistente de ia

A full page where a person talks with the generative AI assistant about their account: they ask in their own words, watch the response arrive, check where it came from, and keep going with a follow-up or a new question. The page is the conversation; everything else (header, composer) stays still while only the log scrolls. Use it as the assistant's home; on a resource page, open the same conversation in a drawer with `platform/ai/ai-chat-drawer`.

## When to use

- A dedicated assistant page (Console → AI assistant) where the conversation is the main task.
- Open-ended questions across the whole account: how-to, troubleshooting, explaining settings or metrics.
- A conversation the reader expects to scroll back through and continue.

## When not to use

- Help about the page the reader is on, next to their work: use `platform/ai/ai-chat-drawer`.
- The assistant proposes an action that changes the account: add `platform/ai/ai-action-approval` to the conversation, never run it from a response.
- One generated paragraph in a page (a summary of a chart): render `StreamingResponse` in place, no chat.
- Searching documentation by keyword: a search field and results list are faster than a conversation.

## Building blocks

### A. Header — `Tag`, `Button`

The assistant's name as the page heading, a Preview `Tag` while the feature is in preview, and a transparent New chat `Button` at the inline end, disabled while the thread is empty. New chat clears the thread without confirmation; the previous thread belongs in a history list, not in a dialog.

### B. Empty state — `EmptyState`, `SuggestionGroup`

Before the first message: an `EmptyState` with the assistant mark, one question as the title and one sentence on what the assistant can read, over a vertical `SuggestionGroup` of up to five support prompts with icons. Selecting a prompt sends it as the first message.

### C. Message log — `Conversation`

Fills the space between header and composer and is the only part that scrolls. It follows the newest message while the reader is at the end, stops when they scroll up, and offers Scroll to the latest message. It announces each finished response once; streaming text is never read token by token.

### D. Prompt — `ChatMessage`

The reader's prompt at the inline end in a filled bubble with their name and time.

### E. Response — `ChatMessage`, `Reasoning`, `StreamingResponse`

The assistant's response at the inline start beside its mark. It shows the loading text while pending, a collapsed `Reasoning` that reads Thinking and then Thought for N seconds, and the Markdown answer in `StreamingResponse` with a caret while it streams. Numbered citations link to the sources. On failure the partial text stays with the error line and Try again.

### F. Sources — `Sources`

Under a complete response that used documents: collapsed under the count, opened by a citation. Item n is citation [n].

### G. Response actions — `ChatMessage`, `CopyButton`, `IconButton`

`ChatMessage.Actions` under a complete response, always visible: Copy (`CopyButton`), Regenerate (`IconButton`, disabled while another response is generating) and `ChatMessage.Feedback` with Helpful and Not helpful.

### H. Follow-up questions — `SuggestionGroup`

After the last complete response, two or three questions that narrow it, as wrapping chips aligned with the response text. They disappear as soon as the reader sends anything else.

### I. Composer — `PromptInput`

Pinned under the log, centered on the reading width. Enter submits, Shift+Enter adds a line, a 4,000-character limit shows its counter, and Submit becomes Stop while a response is pending or streaming. The disclaimer is its hint.

## Do

- Show the loading text only after a second; a response that arrives faster streams directly.
- Keep actions visible on every complete response, not on hover.
- Cite sources inline with numbers and list them under the response.
- Let the reader stop a response and keep what streamed, marked as stopped.
- Keep the composer usable while a response streams so the reader can draft the next prompt.
- Return focus to the composer when a response finishes.

## Don't

- Don't auto-scroll while the reader is reading an older message.
- Don't render model output as HTML; `StreamingResponse` renders Markdown as elements only.
- Don't show actions or feedback on a response that is still loading or streaming.
- Don't use the feedback thumbs for anything but the AI response.
- Don't put more than five support prompts or three follow-ups on screen.
- Don't call the assistant by a person's name or make it apologize; state what happened.

## Copy

- **Title of the page:** `AI assistant`; the Preview tag while in preview.
- **Empty state:** a question the reader would ask themselves, e.g. "How can I help with your Azion account?", and one sentence on what the assistant can read.
- **Support prompts and follow-ups:** written as the reader would ask, under 72 characters, e.g. "How do I purge the cache of one URL?".
- **Placeholder:** `Ask a question`, no end punctuation.
- **Disclaimer (hint):** "The AI assistant can make mistakes. Check important information before you act on it."
- **Loading:** `Generating a response` (built in); `Loading <what>` when fetching data.
- **Error:** what happened, in one sentence, e.g. "The connection was interrupted before the response finished.", with Try again.
- **Stopped:** "You stopped this response."
- **Feedback:** Helpful, Not helpful, Feedback submitted (built in).
- Follow `skills/webkit-microcopy`: sentence case, "select" not "click", "response" not "answer", no "please".

## Accessibility

- The log is a named `role="log"` whose own live behavior is off; a polite live region reads each finished response once, with its author.
- Each message is an `article` named by author and time; avatars are hidden from assistive tech because the author line names the author.
- Responses are `aria-busy` while loading or streaming; the caret is hidden.
- The composer is named Prompt, described by its counter and disclaimer; Enter submits and an IME composition never does.
- Feedback thumbs are toggle buttons with `aria-pressed`, and the submitted state is a status message.
- Keyboard order: header, log (focusable to scroll), each message's links and actions, follow-ups, composer.
- Alignment never carries meaning alone: every message has its author line.

## States

- Empty: the assistant before the first message, with the empty state and four support prompts; selecting one runs a full response.
- Streaming: a response arriving with its caret and Stop in the composer, then sources, actions and follow-ups.
- Error: a failed response with its partial text, the error line and Try again.
- LongThread: six earlier turns that overflow the log, opened on the newest response.

## Related

- `platform/ai/ai-chat-drawer` — the same conversation in a drawer over a resource page.
- `platform/ai/ai-action-approval` — when a response proposes a change the reader must authorize.
- `platform/states/async-submit` — long-running work outside a conversation.
- `skills/webkit-genai` — the rules this block follows: loading stages, streaming, citations, feedback, authorization.

## Variants

- `Empty` — primary (the code below)
- `Streaming` — A response arriving: the reader asked why storefront returns 502 errors and the answer streams in with its caret, a table on the way, the region busy and Stop in the composer; when it ends the sources, actions and follow-up questions appear.
- `Error` — A response that failed mid-stream: the partial text stays, the error line says the connection was interrupted and Try again regenerates the response in place.
- `LongThread` — Six earlier turns about one workload that overflow the log: it opens on the newest response, stops following when the reader scrolls up, and Scroll to the latest message brings them back; follow-up questions close the thread.

Each variant is the same screen in another state: `get_pattern("platform/ai/ai-chat", { variant })`, or the file under `blocks/platform/ai/ai-chat/variants/`.

## Code (`Empty`)

````vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import ChatMessage from '@aziontech/webkit/chat-message'
  import Conversation from '@aziontech/webkit/conversation'
  import CopyButton from '@aziontech/webkit/copy-button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import PromptInput from '@aziontech/webkit/prompt-input'
  import Reasoning from '@aziontech/webkit/reasoning'
  import Sources from '@aziontech/webkit/sources'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import SuggestionGroup from '@aziontech/webkit/suggestion-group'
  import Tag from '@aziontech/webkit/tag'
  import { computed, onBeforeUnmount, reactive, ref } from 'vue'

  const supportPrompts = [
    { id: 'purge', label: 'How do I purge the cache of one URL?', icon: 'pi pi-bolt' },
    {
      id: 'errors',
      label: 'Why is storefront answering with 502 errors?',
      icon: 'pi pi-exclamation-triangle'
    },
    { id: 'deploy', label: 'Deploy a Next.js app from GitHub', icon: 'pi pi-github' },
    { id: 'waf', label: 'Protect my site with a WAF', icon: 'pi pi-shield' }
  ]

  const turns = ref([])
  const state = ref('ready')
  const prompt = ref('')
  const composer = ref(null)

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
  <section
    aria-labelledby="ai-chat-title"
    class="flex h-dvh w-full flex-col bg-(--bg-canvas)"
  >
    <header
      class="flex items-center justify-between gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
    >
      <div class="flex items-center gap-(--spacing-xs)">
        <h1
          id="ai-chat-title"
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
        label="New chat"
        kind="transparent"
        size="small"
        icon="pi pi-plus"
        :disabled="!turns.length"
        @click="newChat"
      />
    </header>
    <div class="flex min-h-0 flex-1 flex-col">
      <div
        v-if="!turns.length"
        class="layout-column-content layout-boundary-inline flex flex-1 flex-col justify-center gap-(--spacing-lg) py-(--spacing-md)"
      >
        <EmptyState
          title="How can I help with your Azion account?"
          description="Ask about your workloads, cache, security rules and deployments. Answers cite the documentation they come from."
          icon="ai ai-ask-azion"
        />
        <SuggestionGroup
          :items="supportPrompts"
          orientation="vertical"
          @select="(item) => send(item.label)"
        />
      </div>
      <Conversation
        v-else
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
    <footer class="layout-column-content layout-boundary-inline pb-(--spacing-md)">
      <PromptInput
        ref="composer"
        v-model="prompt"
        :state="state"
        :max-length="4000"
        @submit="send"
        @stop="stop"
      >
        <template #hint>
          The AI assistant can make mistakes. Check important information before you act on it.
        </template>
      </PromptInput>
    </footer>
  </section>
</template>
````
