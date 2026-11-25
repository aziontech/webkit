# AiChat (`ai/ai-chat`)

> The full-page generative AI assistant in the chat-app look: a thread history grouped by date (search, a project filter, New thread; each row shows its project, the Azion product it started on with how many it touches or the version it edits, a `HoverCard` of details, and Snooze and Settle) in a side panel on desktop and a start `Drawer` behind a floating menu button on a phone; no header bar, only floating controls over the thread: on a phone the menu button and one grouped New chat and More control, on desktop the title of the open conversation with Share and More (Rename, Archive, Delete) at the end; before the first message a welcome page with "What can I help with?", the composer in the middle on desktop and at the foot on a phone, and the support prompts as `SuggestionGroup` chips; then a `Conversation` in a centered reading column where the reader's prompts sit in bubbles at the inline end and each response is plain text in a `ChatMessage` that goes pending (loading text), thinking (`Reasoning`), streaming (`StreamingResponse` with site-name citation chips) and complete (Copy, Feedback with Good and Bad response, Read aloud, Share, Try again and More, with the `Sources` pill on the same line; a `FeedbackReasonDialog` after Bad response and a `ResponseBranches` pager over regenerated answers and edited prompts, which carry Copy and Edit), followed by follow-up questions; a `PromptInput` pinned at the foot of the column while the thread scrolls behind it, with the "+" menu at the start (Camera, Photos, Files, then tools such as Web search that ride in the composer as chips, `v-model:toolKeys`), the model picker (`v-model:modelKey`, the only one on the page) and Dictate before the button at the end (Start voice conversation while empty, Send once there is text, Stop while a response is generated), a 4,000-character limit whose counter appears near it, and the disclaimer under it on desktop. The primary state is the empty assistant; sending a support prompt runs the whole response cycle. Built from `ChatMessage`, `Conversation`, `HoverCard`, `Drawer`, `DropdownMenu`, `PromptInput`, `StreamingResponse`, `Reasoning`, `Sources`, `SuggestionGroup`, `Button`, `IconButton`, `ResponseBranches` and `FeedbackReasonDialog`. Takes the messages of TanStack AI's `useChat` as they are and reports share, edit, branch, version changes and feedback for the app to run with `setMessages`, `sendMessage` and `reload`. A page body for ConsoleLayout that fills its content region (`data-layout-fill`).

- Surface: app
- Source: `blocks/ai/ai-chat/ai-chat.vue` in `@aziontech/webkit`
- MCP: `get_block("ai/ai-chat")`
- Components: [AgentActivity](../../components/agent-activity.md), [AgentQuestion](../../components/agent-question.md), [Alert](../../components/alert.md), [ArtifactCanvas](../../components/artifact-canvas.md), [ArtifactPreview](../../components/artifact-preview.md), `branches`, `placeholderClip`, `usageChart`, [AudioPlayer](../../components/audio-player.md), [Button](../../components/button.md), [ChatMessage](../../components/chat-message.md), [ChatMessage](../../components/chat-message.md), [CodeBlock](../../components/code-block.md), [ConfirmDialog](../../components/confirm-dialog.md), [Conversation](../../components/conversation.md), [ConversationHistory](../../components/conversation-history.md), `DrawerBody`, `DrawerContent`, `DrawerHeader`, [Drawer](../../components/drawer.md), `DrawerTitle`, `DropdownMenuGroup`, `DropdownMenuItem`, [DropdownMenu](../../components/dropdown-menu.md), `DropdownMenuTrigger`, [FeedbackReasonDialog](../../components/feedback-reason-dialog.md), [FilePreview](../../components/file-preview.md), `HoverCardContent`, [HoverCard](../../components/hover-card.md), `HoverCardTrigger`, [IconButton](../../components/icon-button.md), [ImageGallery](../../components/image-gallery.md), [Input](../../components/input.md), [McpAppFrame](../../components/mcp-app-frame.md), `PopoverContent`, [Popover](../../components/popover.md), `PopoverTrigger`, `PromptInputAttachButton`, `PromptInputContextPicker`, `PromptInputDictateButton`, `PromptInputModelPicker`, [PromptInput](../../components/prompt-input.md), [PromptQueue](../../components/prompt-queue.md), [Reasoning](../../components/reasoning.md), `ResizableHandle`, `ResizablePane`, [Resizable](../../components/resizable.md), [ResponseBranches](../../components/response-branches.md), [Skeleton](../../components/skeleton.md), [Sources](../../components/sources.md), [StatusIndicator](../../components/status-indicator.md), [StreamingResponse](../../components/streaming-response.md), [SubagentCard](../../components/subagent-card.md), [SuggestionGroup](../../components/suggestion-group.md), [Toast](../../components/toast.md), [ToolApproval](../../components/tool-approval.md), [ToolCall](../../components/tool-call.md), [Tooltip](../../components/tooltip.md), `use-ai-chat-tools`, `use-ai-chat-versions`, `use-locale`, `utils/ai-chat`, [VideoPlayer](../../components/video-player.md)
- Skills: `webkit-ai-surfaces`, `webkit-ui-states`, `webkit-microcopy`

## Asked as

ai chat; ai assistant; chatbot; copilot; chat with ai; generative ai chat; assistant page; ask ai; llm chat; conversational ui; prompt and response; streaming response; chat de ia; assistente de ia; assistente virtual; conversa com ia; chat con ia; asistente de ia; artifact; artifact canvas; generated file; code canvas; canvas de artefato; artefato gerado; full page chat; tanstack ai; usechat; agent activity; subagent; agent question

A full page where a person talks with the generative AI assistant about their account: they ask in their own words, watch the response arrive, check where it came from, and keep going with a follow-up or a new question. The page is the conversation: one reading column the thread scrolls in, with the header controls and the composer floating over it. Beside it, the conversation history. Use it as the assistant's home; on a resource page, open the same conversation in a drawer with `ai/ai-chat-drawer`. It is a page body for `ConsoleLayout`: its root carries `data-layout-fill`, so it fills the layout's content region (`grow basis-0 min-h-0`, never `h-dvh`), only the log scrolls, and the layout owns the rail, the header and the `main`.

## When to use

- Use ai-chat when the conversation is the page (an assistant page).
- A dedicated assistant page (Console → AI assistant) where the conversation is the main task.
- Open-ended questions across the whole account: how-to, troubleshooting, explaining settings or metrics.
- A conversation the reader expects to scroll back through and continue.

## When not to use

- Help about the page the reader is on, next to their work: use `ai/ai-chat-drawer`.
- The assistant proposes an action that changes the account: add `ai/ai-action-approval` to the conversation, never run it from a response.
- One generated paragraph in a page (a summary of a chart): render `StreamingResponse` in place, no chat.
- Searching documentation by keyword: a search field and results list are faster than a conversation.

## Building blocks

### A. Header — `IconButton`, `Button`, `DropdownMenu`

No bar and no border: the thread scrolls under it. On a phone it is round-cornered floating controls over the thread, blurred over a translucent raised surface: Open conversation history at the inline start, and at the inline end one grouped control holding New chat and More conversation actions; the page heading stays for assistive tech only. From the md breakpoint it is a quiet row over a fade of the canvas: a Show or Hide conversation history toggle (`aria-expanded`), the title of the open conversation (`AI assistant` before there is one; the model is chosen in the composer only, so the page never shows two pickers), New chat while the history panel is folded away, and at the inline end Share and More conversation actions. The More menu holds Share (on a phone), Rename, Archive and Delete for the open conversation; each emits `share-chat`, `rename-chat`, `archive-chat` or `remove-chat` with `activeKey`, and the app does the work. Delete first opens a danger `ConfirmDialog` that names the conversation; `remove-chat` fires only on its Delete. New chat, Share and More are disabled while the thread is empty; New chat clears it without confirmation, and the previous thread stays in the history.

### A2. History — `Input`, `Popover`, `HoverCard`, `Drawer`

The reader's threads, grouped by date (Today, Yesterday, Previous 7 days, Previous 30 days, Older), under a search field, a project filter, Add project and New thread. Each thread is one menu row (hover fill `--bg-hover`, the open thread `--bg-selected`, the inset fill of the menu rows): its project, its age, the title cut with an ellipsis on one line, and a meta line with the icon of the Azion product the thread started on, then how many products it touches or, when it edits one version, that version's id, then the model's provider. Resting on the meta line opens a `HoverCard` with every product, the environment, the model and the changes. Discard draft, Snooze and Settle sit outside the row button, fade in over the age on hover or focus and never move the row; snoozed and settled threads move to their own lists. Discard draft removes the thread at once and shows a `Draft discarded` toast with Undo, which puts it back where it was. A single-line view keeps only the title, the product icon and the age. From the md breakpoint a side panel at the inline start, open by default and folded away by the header toggle; on a phone a start-side `Drawer` the round menu button opens, with the same search field and project filter and New chat at its top, closed by picking a thread or New chat. The open thread is `v-model:activeKey`; the list comes from `sample.ts` until the app gives its own.

### B. Empty state — `SuggestionGroup`, `PromptInput`

Before the first message there is no log: a welcome page with one question as its heading ("What can I help with?"). On desktop the heading and the composer sit together in the middle of the page with the support prompts as chips under them; on a phone the heading sits in the middle and the prompts are one row of chips that scrolls sideways just above the composer at the foot of the screen. Selecting a prompt sends it as the first message. Once a message exists the composer moves to the foot of the log; when the reader sent from the composer, focus follows it there.

### C. Message log — `Conversation`

Fills the page and is the only part that scrolls, in a centered reading column 752px wide (`--container-2xl`), the composer as wide, with 36px between messages (28px on a phone); the header controls and the composer float over it. It follows the newest message while the reader is at the end, stops when they scroll up, and offers Scroll to the latest message. It announces each finished response once; streaming text is never read token by token.

### D. Prompt — `ChatMessage`, `ImageGallery`, `FilePreview`

The reader's prompt at the inline end in a filled bubble with the stacked composer's radius, no avatar, no visible name or time (both stay in its accessible name; the time is its tooltip). Under it, Copy and Edit show on hover or focus (always on a touch screen). Edit turns the bubble into a field with Cancel and Send; Send emits `edit`, and once the app has sent the new prompt the bubble carries a `ResponseBranches` pager (`‹ 2/2 ›`) to page back to the earlier prompt and its answers. The files they attached draw under the text the way media draws in a response (section L): images in an `ImageGallery`, a document in a `FilePreview`, audio and video in their players.

### E. Response — `ChatMessage`, `Reasoning`, `StreamingResponse`

The assistant's response as plain text across the reading column, at the prose reading size (16px on 26px lines), with no avatar, bubble or visible name. It shows the loading text while pending, a collapsed `Reasoning` that reads Thinking and then Thought for N seconds, and the Markdown answer in `StreamingResponse` with a caret while it streams. Each citation is a small chip with the source's site name that links to it. On failure the partial text stays with the error line and Try again.

### F. Sources — `Sources`

At the end of the action row of a complete response that used documents: a pill with up to three overlapping site marks, named by the count, that opens the list under the row; a citation opens it too. Item n is citation [n].

### G. Response actions — `ChatMessage`, `ResponseBranches`, `FeedbackReasonDialog`

`ChatMessage.Actions` under a complete response, always visible and always one line, with its built-in actions in ChatGPT's order: Copy, Feedback (one button whose menu holds Good response and Bad response), Read aloud (hidden where the browser has no speech synthesis), Share, Try again (disabled while another response is generating), More (Branch in new chat), then the Sources pill in `#trailing`. When the row is narrower than 480px (a phone, the drawer) it keeps Copy, Read aloud, Share and More, and More also holds Good response, Bad response and Try again. A rating shows its filled thumb on the Feedback button and checks its item in the menu; choosing it again clears it. Good response raises the toast Thanks for your feedback; Bad response opens `FeedbackReasonDialog`, and sending it emits `feedback` again with the reason, then the toast. After Try again the row starts with a `ResponseBranches` pager (`‹ 2/2 ›`) over the versions of that response. Icons draw at 18px in the muted grey inside 32px buttons, with a 44px target on a touch screen.

### H. Follow-up questions — `SuggestionGroup`

After the last complete response, two or three questions that narrow it, as wrapping pills aligned with the response text. They disappear as soon as the reader sends anything else.

### I. Composer — `PromptInput`, `PromptInputAttachButton`, `PromptInputModelPicker`, `PromptInputDictateButton`, `PromptInputContextPicker`

The `#composer` of `Conversation`: one floating box at the foot of the reading column, pinned there while the thread scrolls behind it (the log keeps room for it, and it keeps the phone's bottom safe area under it), over a fade of the canvas the thread scrolls under, with the connection status, an alert and the queue above it. It ships with the full `PromptInput` feature set by default so apps start complete and only turn off controls they do not offer: `PromptInputAttachButton` with `tools` in `#actions`, `PromptInputModelPicker` (model + effort) and `PromptInputDictateButton` in `#end`, `voice` on by default, `PromptInputContextPicker` in `#footer`, and the disclaimer in `#hint`. The tools live in the "+" menu only, so `PromptInputTools` is not added to `#footer` (both would list the enabled tools as chips). It stacks into a rounded rectangle when the text runs to more lines or files are attached. Enter submits, Shift+Enter adds a line, a 4,000-character limit shows its counter once the prompt passes 3,200 characters, and Submit becomes Stop while a response is pending or streaming. While the composer is empty the button at the end is Start voice conversation (`voice`, on by default), which emits `voice-start` for the app to open its audio session. The disclaimer is its hint, shown from the md breakpoint and kept for assistive tech on a phone. The "+" at the start (`attachable`, on by default: a `PromptInputAttachButton` with `tools`, and drop and paste) opens a menu with Camera (touch screens), Photos and Files, then the tools of `toolOptions` (Web search, Deep research, Create image); a turned-on tool rides in the composer as a removable chip and is `v-model:toolKeys`. It attaches up to `maxFiles` files of `accept` (images and PDF by default) under `maxFileSize` (10 MB); `send` then hands over TanStack AI's multimodal content, the text and one `image`, `audio`, `video` or `document` part per file with its base64 bytes, ready for `sendMessage`. Dictate (a `PromptInputDictateButton`, the microphone before Send) writes speech into the prompt with the browser's speech recognition and hides itself where the browser has none; an app that runs its own transcriber swaps in `PromptInputDictateButton` with `transcriber="app"` and writes the text itself. The composer is disabled while the conversation is restored.

### J. Artifact canvas — `ChatMessage`, `PromptInput` (Artifact)

Variant Artifact only; it fills the `turn-end` and `canvas` slots of the chat with `ArtifactPreview`, `ArtifactCanvas`, `Resizable`, `CodeBlock` and a `Drawer` for narrow screens.

When an answer produces something longer than a message (a query, a configuration, a table), the message carries an `ArtifactPreview` with Open and the whole artifact opens in an `ArtifactCanvas` beside the conversation: a `Resizable.Pane` (`min` 320, `max` 880) after a `Resizable.Handle` named `Resize the artifact`, so the reader widens or narrows it with the pointer or the arrow keys. Under the md breakpoint the pane and handle are hidden and Open shows the same canvas in a full-height `Drawer`. Every follow-up that changes the artifact adds a version: the canvas moves to it, `streaming` locks the pager and marks the body busy while it is written, and each message's preview names its version (`Version 3`) and opens that one. Open moves focus to the canvas title; Close (or Escape inside the canvas) hides it and returns focus to the Open that showed it, and any preview's Open brings it back. The Artifact state is the same chat as every other state (history panel, header, composer, disclaimer): the preview goes in its `turn-end` slot and the handle and pane in its `canvas` slot, so an app keeps one chat shell.

### K. Tool calls — `ToolCall`, `ToolApproval`, `CodeBlock`

A `tool-call` part draws in its place in the response as a `ToolCall` with the tool name in code, the `title` the `tools` prop gives it, and its input and output in a `CodeBlock` when opened; it reads streaming (its arguments arriving), running, completed, failed, canceled (a `cancelled` result) or denied from the call's `state` and its `tool-result`. A call that needs approval draws a `ToolApproval` card first, with the question, verb and danger variant from `tools` and the call's input in a `CodeBlock`; a tool with `editable` shows its arguments as JSON the reader can edit, Approve staying off while they do not parse. Deny and the approve button resolve the matching `useChat` interrupt (an edit as `{ editedArgs }`), and an approved call runs as a `ToolCall` under the card. The card stays busy until the run that asked for it ends. See `ai/ai-action-approval` for the whole approval flow. A `tool-result` whose `content` is a list of text and image parts draws as text and an `ImageGallery` in the output, not as JSON. A tool marked `answerable` in `tools` is one the reader answers (a client tool with no `execute`): until it has an output it draws as an `AgentQuestion` with its `question` and `options` (else a text field), and Submit emits `answer-tool` with the payload `addToolResult` takes.

### L. Media — `ImageGallery`, `AudioPlayer`, `VideoPlayer`, `FilePreview`

Media parts draw in their place in the response. Consecutive `image` parts are one `ImageGallery` (a URL becomes `src`, base64 data becomes `data` with its `mimeType`, `metadata.alt` its alternative text); an `audio` part is an `AudioPlayer` and a `video` part a `VideoPlayer`, each from its URL or a `data:` URL; a `document` part is a `FilePreview` from its URL or base64, named by `metadata.name` (else `Document`). A `file` source (a provider file handle) has no bytes to draw and is skipped.

### M. Agent work — `AgentActivity`, `SubagentCard`, `AgentQuestion`

The `activity` parts of a response, and the `activity` messages between the reader's prompt and it, are one `AgentActivity` at the top of the response. A `subagent` part is a `SubagentCard` named by the helper, with its input in a `CodeBlock` and its own answer in `StreamingResponse` when opened: running is running, finished is completed, suspended waits, and an error reads canceled when its message is `Stopped`; Stop shows when the part carries `stop()` and calls it. A pending generic interrupt is an `AgentQuestion` in an assistant message after the turn it arrived in: its `message` is the question, `metadata.options` (or `payload.options`) the choices, else a text field; Submit calls `resolveInterrupt(answer)` and Skip calls `cancel()`. The card stays with the answer, or Skipped, after the interrupt leaves `interrupts`. An `unbound` interrupt (one the chat cannot resolve, such as a workflow engine's approval) is asked the same way without Skip; Submit emits `answer-interrupt` so the app routes the answer to whatever owns the pause, and the card shows it as sending until the interrupt leaves.

### N. Queue and connection — `PromptQueue`, `StatusIndicator`, `Alert`

With `queue` the composer keeps Submit beside Stop while a response runs (`queueable`), and the waiting messages show in a `PromptQueue` above it, each removable. Above the composer a warning `StatusIndicator` reads Reconnecting while `connection` is `connecting` or `resuming` is set, a danger `Alert` says the connection was lost while it is `disconnected` or `error`, and an info `StatusIndicator` reads Responding in another tab while `sessionGenerating` is set and this tab is not loading. When `interruptErrors` holds a failed answer, a danger `Alert` says Your answer was not sent with its reason, and Retry (shown when one is retryable) emits `retry-interrupts`.

### O. Tool widgets — `McpAppFrame`

A `ui-resource` part (an MCP app a tool returned) draws as a `McpAppFrame` under its call: a sandboxed frame with no network and no reach into the page, titled from `tools` or the tool name. Inline HTML shows as it is; a widget given only by address shows when `resolveAppUrl` returns a trusted `https` address for it. Every message the widget sends reaches the app through `app-message` with a `reply` that answers the widget; the block never acts on one, so the app decides which tool a widget may call and sends sensitive ones through approval.

### P. Structured answers — `CodeBlock`, `Alert`

A `structured-output` part (an answer against a schema) draws as a JSON `CodeBlock`: the progressive `partial` (else `raw`) while it streams, `data` once complete. Its `reasoning` joins the response's `Reasoning`. On `error` a danger `Alert` says The structured answer failed with its `errorMessage`.

### Q. Restoring — `Skeleton`

While `hydrating` (`isHydrating` of `useChat`) and no message is in place yet, three `Skeleton` rows stand in for the conversation in a status named Loading the conversation, instead of the empty state.

## Data

The block draws a conversation in the message shape of TanStack AI: each message has an `id`, a `role` and its `parts` in order (`text`, `thinking`, `tool-call`, `tool-result`, `image`, `audio`, `video`, `document`, `activity`, `subagent`, `structured-output`, `ui-resource`), so the values `useChat` from `@tanstack/ai-vue` returns go straight into its props, with no conversion. The block calls no model and runs no AI library; `@aziontech/webkit/utils/ai-chat` names TanStack AI's own message types, imported from `@tanstack/ai` as types only (an optional peer, `^1.5.0`), with the helpers that read them (`AiChatMessage`, `AiChatPart`, `AiChatTool`, `AiChatInterrupt`, `AiChatSendContent`; import the types from there), so the shape follows TanStack when you update it, and any source that produces it works. A part of another type is skipped. `sample.ts` holds the sample threads the variants pass. The draft in the composer stays local.

An activity step reads, by convention, `content.title` (else its `activityType`), `content.status` (`pending`, `running`, `success` or `complete`, `error`, `canceled` or `cancelled`, `skipped`; left out, running) and `content.detail` as the line under it.

What TanStack AI does not carry, the app adds in `metadata`: `sources` (the documents the response cites, numbered in order), `reasoningSeconds` (left out, the block measures the thinking time) and `stopped` (the block also marks the response that Stop ended). A message's time is its `createdAt`, formatted in the reader's locale.

| Prop                | Type                                      | What it does                                                                                                                                                                                                                  |
| ------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `messages`          | `AiChatMessage[]`                         | The conversation, oldest first, as `useChat` returns it. Empty, the empty state renders.                                                                                                                                      |
| `suggestions`       | `SuggestionGroupItem[]`                   | The starter prompts under the empty state.                                                                                                                                                                                    |
| `followUps`         | `SuggestionGroupItem[]`                   | Follow-up questions under the last finished response.                                                                                                                                                                         |
| `loading`           | `boolean`                                 | `isLoading` from `useChat`: the last response thinks, then streams, and the composer shows Stop.                                                                                                                              |
| `error`             | `string \| Error`                         | `error` from `useChat` shows the standard sentence on the last response with Try again; a string shows that sentence instead.                                                                                                 |
| `tools`             | `Record<string, AiChatTool>`              | How each tool reads, by name: `title` for the call, `question`, `description`, `approveLabel`, `variant` `confirmationPhrase` and `editable` for its approval card; `answerable` and `options` for a tool the reader answers. |
| `interrupts`        | `interrupts` of `useChat`                 | The pending approvals and questions; the approve button and Deny resolve the one whose `toolCallId` matches the call, a generic one asks its question, and an unbound one asks it for the app to route.                       |
| `interruptErrors`   | `interruptErrors` of `useChat`            | Answers that were not sent: an alert with the reason, and Retry when one is retryable.                                                                                                                                        |
| `queue`             | `queue` of `useChat`                      | The messages waiting to be sent, shown above the composer; given, the composer sends while a response runs.                                                                                                                   |
| `moreMessages`      | `boolean`                                 | `hasOlderMessages` of `useChat`: the log offers Load earlier messages.                                                                                                                                                        |
| `loadingMore`       | `boolean`                                 | The older messages are loading.                                                                                                                                                                                               |
| `connection`        | `connectionStatus` of `useChat`           | `connecting` shows Reconnecting, `disconnected` or `error` shows Connection lost; default `connected`.                                                                                                                        |
| `resuming`          | `boolean`                                 | `resuming` of `useChat`: Reconnecting while a run is rejoined.                                                                                                                                                                |
| `hydrating`         | `boolean`                                 | `isHydrating` of `useChat`: placeholders stand in for the conversation and the composer waits.                                                                                                                                |
| `sessionGenerating` | `boolean`                                 | `sessionGenerating` of `useChat`: Responding in another tab while this tab is not loading.                                                                                                                                    |
| `attachable`        | `boolean`                                 | The Attach "+" at the start of the composer; `send` then hands over multimodal content. Default `true`.                                                                                                                       |
| `voice`             | `boolean`                                 | An empty composer shows Start voice conversation in place of Send; it emits `voice-start`. Default `true`.                                                                                                                    |
| `accept`            | `string`                                  | The files the reader may attach; default `image/*,application/pdf`.                                                                                                                                                           |
| `maxFiles`          | `number`                                  | Most files on one message; default 4.                                                                                                                                                                                         |
| `maxFileSize`       | `number`                                  | Largest file in bytes; default 10 MB.                                                                                                                                                                                         |
| `resolveAppUrl`     | `(resource) => string \| Promise<string>` | Gives a widget that has no inline HTML a trusted `https` address; left out, only inline widgets show.                                                                                                                         |
| `models`            | `PromptInputMenuOption[]`                 | The models the composer's model picker offers; left out, the sample models. The choice is `v-model:modelKey`.                                                                                                                 |
| `toolOptions`       | `PromptInputMenuOption[]`                 | The tools the composer's "+" menu turns on; left out, the sample tools. The turned-on ones are `v-model:toolKeys`.                                                                                                            |

The open conversation of the history is `v-model:activeKey` (`string | null`): picking a row sets it, New chat clears it; load that conversation's messages when it changes. The model of the composer is `v-model:modelKey` and the tools turned on in the "+" menu are `v-model:toolKeys`: pass both with each message, `sendMessage(content, { body: { model: modelKey, tools: toolKeys } })`, and read them from `forwardedProps` on the server.

Two slots let a state add to the shell without a second copy of it: `turn-end` (`{ turn }`) puts content after an assistant response, such as the `ArtifactPreview` of a file it wrote, and `canvas` puts a `Resizable.Handle` and `Resizable.Pane` beside the conversation (variant Artifact).

| Event              | Payload                     | When                                                                                                                                                                           |
| ------------------ | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `send`             | `(event, content)`          | The composer, a starter prompt or a follow-up: call `sendMessage(content)`. `content` is the text, or with attachments `{ content: parts }`.                                   |
| `stop`             | `(event)`                   | Stop while the response streams: call `stop()`. The block marks the stopped response.                                                                                          |
| `voice-start`      | `(event)`                   | Start voice conversation on an empty composer: open the app's audio session (set `voice` to `false` when there is none).                                                       |
| `retry`            | `(event, message)`          | Try again: call `reload()`. The block keeps the earlier answer as a version.                                                                                                   |
| `new-chat`         | `(event)`                   | New chat: call `clear()`.                                                                                                                                                      |
| `feedback`         | `(value, message, reason?)` | The reader rated a response (`up`, `down`, or `null` when cleared); after Bad response a second `feedback` carries `reason` (`{ reason, details }`) from the dialog: store it. |
| `share`            | `(event, message)`          | Share on a response: make a link to it.                                                                                                                                        |
| `edit`             | `(event, message, text)`    | Send on an edited prompt: `setMessages` with the messages before it, then `sendMessage(text)`. The block keeps the earlier prompt as a version.                                |
| `version-change`   | `(messages)`                | The reader paged to another version of a prompt or an answer: call `setMessages(messages)`.                                                                                    |
| `branch`           | `(event, message)`          | Branch in new chat on a response: start a new thread from the messages up to it.                                                                                               |
| `share-chat`       | `(event, key)`              | Share in the header: make a link to the conversation `key` (`activeKey`).                                                                                                      |
| `rename-chat`      | `(event, key)`              | Rename in the More menu: rename the conversation `key`.                                                                                                                        |
| `archive-chat`     | `(event, key)`              | Archive in the More menu: archive the conversation `key`.                                                                                                                      |
| `remove-chat`      | `(event, key)`              | Delete in the More menu, after the reader confirms in the block's danger `ConfirmDialog`: delete the conversation `key`.                                                       |
| `approve`          | `(event, call, input?)`     | The approve button on an approval card; `input` is the edited arguments of an `editable` tool. The block already resolved the matching interrupt.                              |
| `remove-queued`    | `(event, item)`             | Remove on a queued message: call `cancelQueued(item.id)`.                                                                                                                      |
| `app-message`      | `(message, part, reply)`    | A widget sent a message: check it against the tools the widget may call, then answer with `reply(message)`.                                                                    |
| `load-more`        | `(event)`                   | Load earlier messages, or the top of the log reached: call `loadOlderMessages()`.                                                                                              |
| `deny`             | `(event, call)`             | Deny on an approval card; the block already resolved the matching interrupt.                                                                                                   |
| `answer-tool`      | `(event, answer)`           | The reader answered an `answerable` tool: call `addToolResult(answer)` (`{ toolCallId, tool, output }`).                                                                       |
| `answer-interrupt` | `(event, interrupt, value)` | The reader answered an unbound interrupt: send `value` to whatever owns it.                                                                                                    |
| `retry-interrupts` | `(event)`                   | Retry on the alert of `interruptErrors`: call `retryInterrupts()`.                                                                                                             |

To go live, install `@tanstack/ai`, `@tanstack/ai-vue` and the adapter of your model (`@tanstack/ai-anthropic`, `@tanstack/ai-openai`…), add a server route that streams the model, and bind `useChat` to the block:

```ts
// server: POST /api/chat
import { chat, chatParamsFromRequest, toServerSentEventsResponse } from '@tanstack/ai'

export async function POST(request: Request) {
  const params = await chatParamsFromRequest(request)
  return toServerSentEventsResponse(chat({ adapter: yourModelAdapter, ...params, tools: [] }))
}
```

```vue
<script setup lang="ts">
  import { fetchServerSentEvents, useChat } from '@tanstack/ai-vue'

  import AiChat from './ai-chat.vue'

  const {
    messages,
    isLoading,
    error,
    interrupts,
    interruptErrors,
    queue,
    hasOlderMessages,
    connectionStatus,
    resuming,
    isHydrating,
    sessionGenerating,
    sendMessage,
    addToolResult,
    retryInterrupts,
    stop,
    reload,
    setMessages,
    clear,
    cancelQueued,
    loadOlderMessages
  } = useChat({
    connection: fetchServerSentEvents('/api/chat'),
    threadId: 'assistant'
  })

  function edit(message, text) {
    setMessages(messages.value.slice(0, messages.value.findIndex((entry) => entry.id === message.id)))
    sendMessage(text)
  }
</script>

<template>
  <AiChat
    :messages="messages"
    :loading="isLoading"
    :error="error"
    :interrupts="interrupts"
    :interrupt-errors="interruptErrors"
    :queue="queue"
    :more-messages="hasOlderMessages"
    :connection="connectionStatus"
    :resuming="resuming"
    :hydrating="isHydrating"
    :session-generating="sessionGenerating"
    attachable
    @send="(_event, content) => sendMessage(content)"
    @answer-tool="(_event, answer) => addToolResult(answer)"
    @retry-interrupts="retryInterrupts()"
    @remove-queued="(_e, item) => cancelQueued(item.id)"
    @load-more="loadOlderMessages()"
    @stop="stop()"
    @retry="reload()"
    @edit="(_event, message, text) => edit(message, text)"
    @version-change="(next) => setMessages(next)"
    @new-chat="clear()"
  />
</template>
```

A tool that needs approval is declared once with `toolDefinition({ name, inputSchema, needsApproval: true })`, run on the server with `.server(...)` and passed to `useChat({ tools: [definition] })` too, so the client can match the approval request to the call. Then delete `sample.ts` and its import. `apps/demos` runs this block on `useChat` with TanStack AI's `fakeText` model (`src/lib/assistant-model.ts`), no server and no key.

## Do

- Show the loading text only after a second; a response that arrives faster streams directly.
- Keep actions visible on every complete response, not on hover.
- Cite sources inline with site-name chips and open the list from the Sources pill.
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

- **Title of the page:** `AI assistant`, with the chosen model after it on desktop.
- **Empty state:** "What can I help with?".
- **Support prompts and follow-ups:** written as the reader would ask, under 72 characters, e.g. "How do I purge the cache of one URL?".
- **Placeholder:** `Ask a question`, no end punctuation.
- **Disclaimer (hint):** "The AI assistant can make mistakes. Check important information before you act on it." The three AI blocks share this sentence; `ai/ai-action-approval` appends "It runs nothing in your account without your approval."
- **Loading:** `Generating a response` (built in); `Loading <what>` when fetching data.
- **Error:** what happened, in one sentence, e.g. "The connection was interrupted before the response finished.", with Try again.
- **Stopped:** "You stopped this response."
- **Feedback:** the Feedback menu with Good response and Bad response (built in); the toast says Thanks for your feedback.
- Follow `skills/webkit-microcopy`: sentence case, "select" not "click", "response" not "answer", no "please".
- **Connection:** `Reconnecting`; `Connection lost` with "Your messages send when the connection returns."
- **Elsewhere and failed answers:** `Responding in another tab`; `Your answer was not sent` with the reason and Retry; `The structured answer failed`.

## Accessibility

- The log is a named `role="log"` whose own live behavior is off; a polite live region reads each finished response once, with its author.
- Each message is an `article` named by author and time; the author and time are visually hidden, never removed.
- Responses are `aria-busy` while loading or streaming; the caret is hidden.
- The composer is named Prompt, described by its counter and disclaimer; Enter submits and an IME composition never does.
- Feedback is a menu button (`aria-haspopup="menu"`) whose chosen item is `aria-checked`, and the rating is confirmed by a visually hidden status message and the toast; the row shows no text.
- A prompt's Copy and Edit are transparent until hover or focus, never removed from the tab order; the editor's field is named Edit your message, `Escape` cancels and `Ctrl`/`Cmd` + `Enter` sends.
- Keyboard order: history panel, header, log (focusable to scroll), each message's links and actions, follow-ups, composer. On the welcome page: header, heading, support prompts, composer.
- The More and "+" menus are `DropdownMenu`s: arrows, typeahead, Escape and focus return come from it; the composer's model picker is a `Popover` whose trigger's name is its visible text.
- The phone history is a `Drawer` named Conversation history that returns focus to the menu button; the desktop toggle names what it does and carries `aria-expanded`.
- Alignment never carries meaning alone: every message's accessible name says who wrote it.
- Reconnecting is a polite status and Connection lost an alert; the queued messages are a list named Queued messages, each with Remove from queue; a question card is a group named by its question; the placeholders while restoring are a status named Loading the conversation.

## States

- Empty: `messages` left out or `[]`, with the welcome heading, the composer and four support prompts; selecting one emits `send`.
- Streaming: `loading` with the last assistant message part-way written: its caret, the busy region and Stop in the composer.
- Error: `error` set: the last response keeps its partial text, with the error line and Try again; with no response yet, a pending response shows the error.
- Tools: a `tool-call` part draws as a `ToolCall` titled from `tools`, its input and output in code; one with `approval` draws the `ToolApproval` card first (see `ai/ai-action-approval`).
- Artifact: two turns that wrote top-orders.sql in two versions, the canvas open beside them on version 2, in the same chat shell as the other states.
- LongThread: six earlier turns as `messages` that overflow the log, opened on the newest response with its Sources pill, with `followUps`.
- Media: an answer with two charts in an `ImageGallery`, a CSV report in a `FilePreview` and an audio summary.
- Agent: activity steps, a finished `SubagentCard` and a pending `AgentQuestion`; answering it resolves the interrupt and the card keeps the answer.
- Restoring: `hydrating` with no messages yet shows `Skeleton` bubbles and lines and a disabled composer.
- History: the side panel on desktop, the start drawer on a phone, with New chat and search.
- Attachments, structured answers and rich tool results: a prompt with an image and a PDF, a `structured-output` part as JSON and a tool result with text and an image (variant Media).
- Queue, older messages and connection: `queue` shows a `PromptQueue` over the composer, `moreMessages` a Load earlier messages button, and `connection` a Reconnecting status or a Connection lost alert.

## Related

- `artifact-canvas` — the side panel of the Artifact variant; `artifact-preview` — its card in the message.
- `ai/ai-chat-drawer` — the same conversation in a drawer over a resource page.
- `ai/ai-action-approval` — when a response proposes a change the reader must authorize.
- `state/state-async-submit` — long-running work outside a conversation.
- `skills/webkit-ai-surfaces` — the rules this block follows: loading stages, streaming, citations, feedback, authorization.

## Variants

- `Empty` — primary (the code below)
- `Streaming` — A response arriving: the reader asked why storefront returns 502 errors and the answer streams in with its caret, a table on the way, the region busy and Stop in the composer; when it ends the sources, actions and follow-up questions appear.
- `Error` — A response that failed mid-stream: the partial text stays, the error line says the connection was interrupted and Try again regenerates the response in place.
- `LongThread` — Six earlier turns about one workload that overflow the log: it opens on the newest response and its Sources pill, stops following when the reader scrolls up, and the round Scroll to the latest message button above the composer brings them back; follow-up questions close the thread.
- `Artifact` — An answer that produced a file: the message carries an `ArtifactPreview` of top-orders.sql and the `ArtifactCanvas` sits beside the conversation in a `Resizable` pane of the same chat shell (the `turn-end` and `canvas` slots of the chat) (a `Drawer` under the md breakpoint) with its versions, Copy, Download and Close; a follow-up question is sent like in every other state. While a new version is written the canvas takes `streaming`, which locks its pager.
- `Media` — A prompt with an attached image, then an answer with a chart tool result, two charts in an `ImageGallery`, a structured answer, a CSV in a `FilePreview` and an audio summary; the composer attaches files.
- `Agent` — `AgentActivity` steps, a finished `SubagentCard` and a pending `AgentQuestion` that keeps its answer.

Each variant is the same screen in another state: `get_block("ai/ai-chat", { variant })`, or the file under `blocks/ai/ai-chat/variants/`.

## Code (`Empty`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import type { ChatMessageFeedbackValue, ChatMessageStatus } from '@aziontech/webkit/chat-message'
  import ChatMessage from '@aziontech/webkit/chat-message-root'
  import Conversation from '@aziontech/webkit/conversation'
  import type { FeedbackReasonDialogPayload } from '@aziontech/webkit/feedback-reason-dialog'
  import {
    type McpAppFrameMessage,
    type McpAppFrameResource
  } from '@aziontech/webkit/mcp-app-frame'
  import type {
    PromptInputFile,
    PromptInputMenuOption,
    PromptInputStatus
  } from '@aziontech/webkit/prompt-input'
  import PromptQueue from '@aziontech/webkit/prompt-queue'
  import SuggestionGroup, { type SuggestionGroupItem } from '@aziontech/webkit/suggestion-group'
  import { useAiChatTools } from '@aziontech/webkit/use-ai-chat-tools'
  import { useAiChatVersions } from '@aziontech/webkit/use-ai-chat-versions'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import {
    type AiChatConnection,
    type AiChatInterrupt,
    type AiChatInterruptError,
    type AiChatMessage,
    type AiChatQueuedMessage,
    type AiChatSendContent,
    type AiChatTool,
    type AiChatToolAnswer,
    type AiChatToolCallPart,
    type AiChatUiResourcePart,
    contentOf,
    hasAnswer,
    interruptErrorText,
    queueItemOf
  } from '@aziontech/webkit/utils/ai-chat'
  import { computed, ref, useSlots } from 'vue'

  import { useComposerFocus } from './composables/use-composer-focus'
  import { failureText, turnTime } from './lib/ai-chat-failure'
  import AiChatComposer from './parts/ai-chat-composer.vue'
  import AiChatConnectionStatus from './parts/ai-chat-connection-status.vue'
  import AiChatHeader, { type AiChatHeaderAction } from './parts/ai-chat-header.vue'
  import AiChatHistory from './parts/ai-chat-history.vue'
  import AiChatSkeleton from './parts/ai-chat-skeleton.vue'
  import AiChatSplit from './parts/ai-chat-split.vue'
  import AiChatStart from './parts/ai-chat-start.vue'
  import AiChatTurn from './parts/ai-chat-turn.vue'
  import { sampleModels, sampleSuggestions, sampleTools } from './sample'

  export interface AiChatProps {
    /** The conversation, oldest first, as TanStack AI's `useChat` returns `messages`. Empty, the empty state renders. */
    messages?: ReadonlyArray<AiChatMessage>
    /** Starter prompts under the empty state. Left out, the sample prompts render. */
    suggestions?: SuggestionGroupItem[]
    /** Follow-up questions shown under the last finished response. */
    followUps?: SuggestionGroupItem[]
    /** The assistant is responding, as `useChat` returns `isLoading`. */
    loading?: boolean
    /** Why the last response failed: a sentence, or the `error` of `useChat`, which shows the standard sentence. */
    error?: string | { message: string } | null
    /** How each tool reads, by tool name; a tool left out shows its name. */
    tools?: Record<string, AiChatTool>
    /** Pending requests, as `useChat` returns `interrupts`; Approve and Deny resolve the matching approval, a generic one asks its question, and an unbound one asks it for the app to route. */
    interrupts?: ReadonlyArray<AiChatInterrupt>
    /** Why the answers to pending requests were not sent, as `useChat` returns `interruptErrors`; a retryable one offers Retry. */
    interruptErrors?: ReadonlyArray<AiChatInterruptError>
    /** Messages waiting to be sent, as `useChat` returns `queue`; given, the composer sends while a response runs. */
    queue?: ReadonlyArray<AiChatQueuedMessage>
    /** Older messages exist, as `useChat` returns `hasOlderMessages`. */
    moreMessages?: boolean
    /** The older messages are loading. */
    loadingMore?: boolean
    /** The connection to the chat, as `useChat` returns `connectionStatus`. */
    connection?: AiChatConnection
    /** The chat is rejoining a run after a reload, as `useChat` returns `resuming`. */
    resuming?: boolean
    /** The conversation is being restored, as `useChat` returns `isHydrating`; placeholders show in place of the empty state. */
    hydrating?: boolean
    /** A response is being generated for this chat elsewhere, as `useChat` returns `sessionGenerating`. */
    sessionGenerating?: boolean
    /** The reader may attach files from the Attach control at the start of the composer; `send` then hands over the multimodal content `sendMessage` takes. */
    attachable?: boolean
    /** An empty composer shows the round Start voice conversation control in place of Send; it emits `voice-start` and the app owns the audio session. */
    voice?: boolean
    /** The files the reader may attach, in the native accept syntax. */
    accept?: string
    /** Most files attached to one message. */
    maxFiles?: number
    /** Largest file in bytes. */
    maxFileSize?: number
    /** Turns a widget's resource into a trusted https address when it has no inline HTML; left out, only inline widgets show. */
    resolveAppUrl?: (resource: McpAppFrameResource) => string | Promise<string>
    /** The models the composer picks from; left out, the sample models show. Read the chosen one from `v-model:modelKey`. */
    models?: PromptInputMenuOption[]
    /** The tools the composer turns on (web search, deep research); left out, the sample tools show. Read the turned-on ones from `v-model:toolKeys`. */
    toolOptions?: PromptInputMenuOption[]
  }

  const props = withDefaults(defineProps<AiChatProps>(), {
    messages: () => [],
    suggestions: undefined,
    followUps: undefined,
    loading: false,
    error: '',
    tools: () => ({}),
    interrupts: () => [],
    interruptErrors: () => [],
    queue: undefined,
    moreMessages: false,
    loadingMore: false,
    connection: 'connected',
    resuming: false,
    hydrating: false,
    sessionGenerating: false,
    attachable: true,
    voice: true,
    accept: 'image/*,application/pdf',
    maxFiles: 4,
    maxFileSize: 10485760,
    resolveAppUrl: undefined,
    models: undefined,
    toolOptions: undefined
  })

  const emit = defineEmits<{
    send: [event: MouseEvent | KeyboardEvent, content: AiChatSendContent]
    stop: [event: MouseEvent]
    'voice-start': [event: MouseEvent]
    retry: [event: MouseEvent | KeyboardEvent, message: AiChatMessage]
    share: [event: MouseEvent | KeyboardEvent, message: AiChatMessage]
    branch: [event: MouseEvent | KeyboardEvent, message: AiChatMessage]
    edit: [event: MouseEvent | KeyboardEvent, message: AiChatMessage, text: string]
    'version-change': [messages: AiChatMessage[]]
    'new-chat': [event: MouseEvent]
    feedback: [
      value: ChatMessageFeedbackValue | null,
      message: AiChatMessage,
      reason?: FeedbackReasonDialogPayload
    ]
    'share-chat': [event: MouseEvent | KeyboardEvent, key: string | null]
    'rename-chat': [event: MouseEvent | KeyboardEvent, key: string | null]
    'archive-chat': [event: MouseEvent | KeyboardEvent, key: string | null]
    'remove-chat': [event: MouseEvent | KeyboardEvent, key: string | null]
    approve: [event: MouseEvent, call: AiChatToolCallPart, input?: unknown]
    deny: [event: MouseEvent, call: AiChatToolCallPart]
    'remove-queued': [event: MouseEvent, item: AiChatQueuedMessage]
    'app-message': [
      message: McpAppFrameMessage,
      part: AiChatUiResourcePart,
      reply: (message: McpAppFrameMessage) => void
    ]
    'load-more': [event: Event]
    'answer-interrupt': [event: Event, interrupt: AiChatInterrupt, value: string]
    'answer-tool': [event: Event, answer: AiChatToolAnswer]
    'retry-interrupts': [event: MouseEvent]
  }>()

  defineSlots<{
    /** Content after an assistant response, such as the card of a file it produced. */
    'turn-end'(props: { turn: AiChatMessage }): unknown
    /** A resizable side pane beside the conversation, given as a Resizable handle and pane, such as an artifact canvas. */
    canvas(): unknown
  }>()

  const activeKey = defineModel<string | null>('activeKey', { default: null })
  /** The model chosen in the composer, one of `models`; pass it to `sendMessage` as `{ body: { model } }`. */
  const modelKey = defineModel<string>('modelKey', { default: 'gemini-4-neon' })
  /** The tools turned on in the composer, in `toolOptions` order; pass them to `sendMessage` as `{ body: { tools } }`. */
  const toolKeys = defineModel<string[]>('toolKeys', { default: () => [] })

  const slots = useSlots()
  const { formatDate } = useLocale()
  const versions = useAiChatVersions(() => props.messages)

  const prompt = ref('')
  const files = ref<PromptInputFile[]>([])
  const composerEl = ref<InstanceType<typeof AiChatComposer> | null>(null)
  const stoppedIds = ref<Set<string>>(new Set())
  const answers = ref<Record<string, string>>({})
  const historyPanel = ref(true)
  const historyDrawer = ref(false)

  const turns = computed(() =>
    props.messages.filter((message) => message.role === 'user' || message.role === 'assistant')
  )
  const chatTools = useAiChatTools({
    turns: () => turns.value,
    interrupts: () => props.interrupts,
    tools: () => props.tools,
    onAnswerInterrupt: (event, interrupt, value) =>
      emit('answer-interrupt', event, interrupt, value),
    onAnswerTool: (event, answer) => emit('answer-tool', event, answer),
    onApprove: (event, call, input) => emit('approve', event, call, input),
    onDeny: (event, call) => emit('deny', event, call)
  })
  const starters = computed(() => props.suggestions ?? sampleSuggestions)
  const modelOptions = computed(() => props.models ?? sampleModels)
  const composerBindings = computed(() => ({
    state: state.value,
    queueable: queueable.value,
    hydrating: props.hydrating,
    accept: props.accept,
    maxFiles: props.maxFiles,
    maxFileSize: props.maxFileSize,
    attachable: props.attachable,
    voice: props.voice,
    models: modelOptions.value,
    tools: props.toolOptions ?? sampleTools
  }))
  const statusBindings = computed(() => ({
    connection: props.connection,
    resuming: props.resuming,
    sessionGenerating: props.sessionGenerating,
    loading: props.loading
  }))
  const welcome = computed(() => !turns.value.length && !props.hydrating)
  const last = computed(() => turns.value[turns.value.length - 1])
  const failure = computed(() => failureText(props.error))
  const waiting = computed(
    () => (props.loading || Boolean(failure.value)) && last.value?.role === 'user'
  )

  function statusOf(turn: AiChatMessage): ChatMessageStatus {
    if (turn.role === 'user' || turn !== last.value) return 'success'
    if (failure.value) return 'error'
    if (props.loading) return hasAnswer(turn) ? 'streaming' : 'pending'
    return 'success'
  }

  const queueable = computed(() => props.queue !== undefined)
  const queued = computed(() => (props.queue ?? []).map(queueItemOf))
  const retryable = computed(() => props.interruptErrors.some((error) => error.retryable !== false))

  const state = computed<PromptInputStatus>(() => {
    if (!props.loading) return 'ready'
    return last.value?.role === 'assistant' && hasAnswer(last.value) ? 'streaming' : 'pending'
  })

  function stopped(turn: AiChatMessage): boolean {
    return Boolean(turn.metadata?.stopped) || stoppedIds.value.has(turn.id)
  }

  const lastAnswer = computed(() => {
    const turn = last.value
    return turn?.role === 'assistant' && statusOf(turn) === 'success' && !stopped(turn)
      ? turn
      : null
  })

  const timeOf = (turn: AiChatMessage) => turnTime(turn, formatDate)
  const { refocusAfterWelcome } = useComposerFocus(composerEl, () => props.loading, welcome)

  async function send(event: MouseEvent | KeyboardEvent, text: string, typed = false) {
    const attached = files.value
    const picked = attached.flatMap((item) => (item.file instanceof File ? [item.file] : []))
    if ((!text.trim() && !picked.length) || (state.value !== 'ready' && !queueable.value)) return
    prompt.value = ''
    files.value = []
    let content: AiChatSendContent
    try {
      content = await contentOf(text, picked)
    } catch {
      prompt.value = text
      files.value = attached
      return
    }
    refocusAfterWelcome(typed)
    emit('send', event, content)
  }

  function stop(event: MouseEvent) {
    if (props.loading && last.value?.role === 'assistant') stoppedIds.value.add(last.value.id)
    emit('stop', event)
  }

  function newChat(event: MouseEvent) {
    prompt.value = ''
    files.value = []
    stoppedIds.value.clear()
    answers.value = {}
    chatTools.reset()
    versions.clear()
    activeKey.value = null
    emit('new-chat', event)
  }

  function onChatAction(event: MouseEvent | KeyboardEvent, action: AiChatHeaderAction) {
    if (action === 'share') emit('share-chat', event, activeKey.value)
    else if (action === 'rename') emit('rename-chat', event, activeKey.value)
    else if (action === 'archive') emit('archive-chat', event, activeKey.value)
    else emit('remove-chat', event, activeKey.value)
  }

  function removeQueued(event: MouseEvent, id: string) {
    const item = props.queue?.find((entry) => entry.id === id)
    if (item) emit('remove-queued', event, item)
  }
</script>

<template>
  <section
    aria-labelledby="ai-chat-title"
    data-layout-fill
    class="flex min-h-0 w-full grow basis-0"
  >
    <AiChatHistory
      v-model="activeKey"
      v-model:drawer-open="historyDrawer"
      :panel-open="historyPanel"
      @create="newChat"
    />
    <AiChatSplit :split="Boolean(slots.canvas)">
      <AiChatHeader
        :empty="!turns.length"
        :history-open="historyPanel"
        :conversation-key="activeKey"
        @new-chat="newChat"
        @open-history="historyDrawer = true"
        @toggle-history="historyPanel = !historyPanel"
        @action="onChatAction"
      />
      <AiChatStart
        v-if="welcome"
        :starters="starters"
        @select="(event, item) => send(event, item.label)"
      >
        <AiChatConnectionStatus v-bind="statusBindings" />
        <AiChatComposer
          ref="composerEl"
          v-model="prompt"
          v-model:files="files"
          v-model:model-key="modelKey"
          v-model:tool-keys="toolKeys"
          v-bind="composerBindings"
          @submit="(event, text) => send(event, text, true)"
          @stop="stop"
          @voice-start="emit('voice-start', $event)"
        />
      </AiChatStart>
      <Conversation
        v-else
        aria-label="Conversation with the AI assistant"
        :more-messages="moreMessages"
        :loading-more="loadingMore"
        @load-more="emit('load-more', $event)"
      >
        <div
          aria-hidden="true"
          class="h-(--spacing-lg) shrink-0"
        />
        <AiChatSkeleton v-if="!turns.length" />
        <AiChatTurn
          v-for="turn in turns"
          :key="turn.id"
          v-model:answers="answers"
          :turn="turn"
          :messages="messages"
          :status="statusOf(turn)"
          :time="timeOf(turn)"
          :failure="failure"
          :tools="tools"
          :busy="loading && turn === last"
          :ready="state === 'ready'"
          :stopped="stopped(turn)"
          :questions="chatTools.questions.value[turn.id]"
          :ask-of="chatTools.askOf"
          :edit-of="chatTools.editOf"
          :resolve-app-url="resolveAppUrl"
          :versions="versions"
          @retry="emit('retry', $event, turn)"
          @rate="(value, reason) => emit('feedback', value, turn, reason)"
          @share="(event) => emit('share', event, turn)"
          @branch="(event) => emit('branch', event, turn)"
          @edit-prompt="(event, text) => emit('edit', event, turn, text)"
          @version-change="(next) => emit('version-change', next)"
          @answer-tool="chatTools.answerTool"
          @edit="chatTools.setEdit"
          @approve="chatTools.approve"
          @deny="chatTools.deny"
          @answer="chatTools.answer"
          @skip="chatTools.skip"
          @app-message="(message, part, reply) => emit('app-message', message, part, reply)"
        >
          <template
            v-if="slots['turn-end']"
            #end
          >
            <slot
              name="turn-end"
              :turn="turn"
            />
          </template>
        </AiChatTurn>
        <ChatMessage
          v-if="waiting && last"
          :status="failure ? 'error' : 'pending'"
          :error-message="failure || undefined"
          @retry="emit('retry', $event, last)"
        />
        <SuggestionGroup
          v-if="lastAnswer && followUps?.length"
          :items="followUps"
          aria-label="Follow-up questions"
          @select="(event, item) => send(event, item.label)"
        />
        <template #composer>
          <AiChatConnectionStatus v-bind="statusBindings" />
          <Alert
            key="alert-2"
            v-if="interruptErrors.length"
            severity="danger"
            size="small"
            title="Your answer was not sent"
            :action-label="retryable ? 'Retry' : ''"
            @action="emit('retry-interrupts', $event)"
          >
            {{ interruptErrorText(interruptErrors) }}
          </Alert>
          <PromptQueue
            v-if="queued.length"
            :items="queued"
            @remove="(event, item) => removeQueued(event, item.id)"
          />
          <AiChatComposer
            ref="composerEl"
            v-model="prompt"
            v-model:files="files"
            v-model:model-key="modelKey"
            v-model:tool-keys="toolKeys"
            v-bind="composerBindings"
            @submit="(event, text) => send(event, text, true)"
            @stop="stop"
            @voice-start="emit('voice-start', $event)"
          />
        </template>
      </Conversation>
      <template
        v-if="slots.canvas"
        #canvas
      >
        <slot name="canvas" />
      </template>
    </AiChatSplit>
  </section>
</template>
```

## `sample.ts`

````ts
import type { PromptInputMenuOption } from '@aziontech/webkit/prompt-input'
import type { SourcesItem } from '@aziontech/webkit/sources'
import type { SuggestionGroupItem } from '@aziontech/webkit/suggestion-group'
import type { AiChatInterrupt, AiChatMessage } from '@aziontech/webkit/utils/ai-chat'

const at = (time: string): Date => new Date(`2026-11-19T${time}:00`)

const user = (id: string, text: string, time: string): AiChatMessage => ({
  id,
  role: 'user',
  parts: [{ type: 'text', content: text }],
  createdAt: at(time)
})

const assistant = (
  id: string,
  text: string,
  time: string,
  extra: { reasoning?: string; reasoningSeconds?: number; sources?: SourcesItem[] } = {}
): AiChatMessage => ({
  id,
  role: 'assistant',
  parts: [
    ...(extra.reasoning ? [{ type: 'thinking' as const, content: extra.reasoning }] : []),
    { type: 'text', content: text }
  ],
  createdAt: at(time),
  metadata: { reasoningSeconds: extra.reasoningSeconds, sources: extra.sources }
})

const cacheAnswer = [
  'Use **Real-Time Purge** with the *URL* type. It removes one object from every data center in a few seconds [1].',
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

export const sampleStreamingMessages: AiChatMessage[] = [
  user('m1', 'Why is storefront answering with 502 errors?', '14:12'),
  assistant('m2', errorsAnswer.slice(0, 120), '14:12', {
    reasoning:
      'The reader asks about errors on storefront. The error rate rose at 14:05; the certificate of the origin expired at the same minute.',
    reasoningSeconds: 2,
    sources: [
      {
        title: 'Troubleshooting 502 responses',
        href: 'https://www.azion.com/en/documentation/',
        description: 'A 502 means the edge reached the origin but got no valid answer back.',
        site: 'Azion',
        icon: 'az az-azion',
        publisher: 'Azion Technologies',
        publishedAt: '2026-09-14'
      }
    ]
  })
]

export const sampleInterruptedMessages: AiChatMessage[] = [
  user('m1', 'How do I purge the cache of one URL?', '10:41'),
  assistant('m2', cacheAnswer.slice(0, 104), '10:41', {
    reasoning:
      'The question is about one URL, so a full purge would be too broad. Real-Time Purge by URL is the narrowest option, and the CLI does the same from a terminal.',
    reasoningSeconds: 2,
    sources: [
      {
        title: 'Real-Time Purge',
        href: 'https://www.azion.com/en/documentation/',
        description: 'Removes a cached object from every data center in a few seconds.',
        site: 'Azion',
        icon: 'az az-azion',
        publisher: 'Azion Technologies',
        publishedAt: '2026-03-02'
      },
      {
        title: 'aziontech/azion: purge',
        href: 'https://github.com/aziontech/azion',
        description: 'Purge URLs, wildcards and cache keys from a terminal.',
        site: 'GitHub',
        icon: 'az az-github'
      }
    ]
  })
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
  [
    'How do I check the certificate from a terminal?',
    [
      '### 1. Read the dates with OpenSSL',
      '',
      'Connect to the domain and print the validity window of `shop.example.com`:',
      '',
      '```bash',
      'openssl s_client -connect shop.example.com:443 -servername shop.example.com </dev/null \\',
      '  | openssl x509 -noout -dates',
      '```',
      '',
      'The output has two lines:',
      '',
      '- `notBefore`: when the certificate became valid.',
      '- `notAfter`: when it expires.',
      '  - Renewal starts 30 days before this date.',
      '',
      '### 2. Check it with curl',
      '',
      '```bash',
      'curl -vI https://shop.example.com 2>&1 | grep -i "expire date"',
      '```',
      '',
      '**Important:** run both from outside your network, so you read the certificate the edge serves.'
    ].join('\n')
  ],
  ['What is the cache hit ratio today?', '**91%** over the last 24 hours, up from 87% last week.'],
  [
    'Which paths miss the cache most?',
    'The search pages under `/search`, because every query string is a new cache key.'
  ],
  [
    'How do I fix that?',
    'Set *Cache by query string* to **Allowlist** and keep only `q` and `page` [1]. Campaign parameters such as `utm_source` then stop creating new cache keys [2][3].'
  ]
]

const cacheKeySources: SourcesItem[] = [
  {
    title: 'Cache settings',
    href: 'https://www.azion.com/en/documentation/',
    description: 'Choose which query string parameters build the cache key of each path.',
    site: 'Azion',
    icon: 'az az-azion',
    publisher: 'Azion Technologies',
    publishedAt: '2026-08-21'
  },
  {
    title: 'aziontech/azion',
    href: 'https://github.com/aziontech/azion',
    description: 'Change the cache settings of an application from a terminal.',
    site: 'GitHub',
    publisher: 'aziontech',
    icon: 'az az-github'
  },
  {
    title: 'HTTP Caching (RFC 9111)',
    href: 'https://www.w3.org/Protocols/',
    description: 'Every distinct URL, query string included, is a separate entry in a cache.',
    site: 'W3C',
    publisher: 'World Wide Web Consortium',
    publishedAt: '2022-06-01'
  },
  {
    title: 'cache-control',
    href: 'https://www.npmjs.com/package/cache-control',
    description: 'Writes Cache-Control headers from a route table.',
    cited: false
  }
]

export const sampleLongThread: AiChatMessage[] = history.flatMap(
  ([question, answer], index): AiChatMessage[] => [
    user(`q${index}`, question, `09:${10 + index * 4}`),
    assistant(`a${index}`, answer, `09:${11 + index * 4}`, {
      reasoning: 'Reading the workload settings of storefront.',
      reasoningSeconds: 2,
      sources: index === history.length - 1 ? cacheKeySources : []
    })
  ]
)

export const sampleLongThreadFollowUps: SuggestionGroupItem[] = [
  { id: 'apply', label: 'Apply the allowlist to storefront', icon: 'az az-bolt' },
  { id: 'ratio', label: 'How much would the hit ratio improve?', icon: 'az az-chart-line' }
]

export const sampleSuggestions: SuggestionGroupItem[] = [
  { id: 'purge', label: 'How do I purge the cache of one URL?', icon: 'az az-bolt' },
  {
    id: 'errors',
    label: 'Why is storefront answering with 502 errors?',
    icon: 'az az-triangle-alert'
  },
  { id: 'deploy', label: 'Deploy a Next.js app from GitHub', icon: 'az az-github' }
]

export const sampleArtifactVersions: string[] = [
  'SELECT id, customer_id, total\nFROM orders\nORDER BY total DESC\nLIMIT 10;',
  "SELECT id, customer_id, total\nFROM orders\nWHERE created_at > now() - interval '7 days'\nORDER BY total DESC\nLIMIT 10;"
]

export const sampleArtifactThread: (AiChatMessage & { version?: number })[] = [
  user('q1', 'Write a query for the ten biggest orders', '10:00'),
  {
    ...assistant('a1', 'Here is a query for the ten biggest orders, newest total first.', '10:01'),
    version: 0
  },
  user('q2', 'Only this week', '10:02'),
  {
    ...assistant('a2', 'Done. Version 2 keeps the orders of the last seven days.', '10:03'),
    version: 1
  }
]

export const sampleArtifactFollowUps: SuggestionGroupItem[] = [
  { id: 'email', label: 'Show the customer email too', icon: 'az az-mail' },
  { id: 'items', label: 'Count the items of each order', icon: 'az az-list' }
]

export const sampleReportCsv =
  'ZGF0ZSxyZXF1ZXN0cyxjYWNoZSBoaXQgcmF0aW8KMjAyNi0xMS0xNiwxMjA0MzMxLDkwJQoyMDI2LTExLTE3LDExODcyMDIsOTElCjIwMjYtMTEtMTgsMTI1MTk0MCw5MiUK'

export const sampleAgentMessages: AiChatMessage[] = [
  user('q1', 'Find why checkout got slower this week', '15:20'),
  {
    id: 'act1',
    role: 'activity',
    parts: [
      {
        type: 'activity',
        activityType: 'search',
        content: { title: 'Reading the metrics of acme-store', status: 'success' }
      },
      {
        type: 'activity',
        activityType: 'compare',
        content: {
          title: 'Comparing the last two deployments',
          status: 'success',
          detail: 'Builds 1041 and 1042'
        }
      }
    ]
  },
  {
    id: 'a1',
    role: 'assistant',
    parts: [
      {
        type: 'activity',
        activityType: 'wait',
        content: { title: 'Waiting for your answer', status: 'pending' }
      },
      {
        type: 'subagent',
        subagent: {
          id: 'researcher-1',
          name: 'researcher',
          description: 'Comparing the two deployments',
          status: 'finished',
          input: { application: 'acme-store', builds: [1041, 1042] },
          messages: [
            {
              id: 'r1',
              role: 'assistant',
              parts: [
                {
                  type: 'text',
                  content:
                    'Build **1042** added a function on `/checkout` that calls `api.example.com` on every request.'
                }
              ]
            }
          ]
        }
      },
      {
        type: 'text',
        content:
          'Checkout slowed down when build 1042 went live: its new function waits on the origin for every request. I can cache the origin response or roll back to build 1041.'
      }
    ],
    createdAt: at('15:21')
  }
]

export const sampleAgentInterrupts: AiChatInterrupt[] = [
  {
    kind: 'generic',
    id: 'question-fix',
    message: 'How should I fix checkout?',
    metadata: {
      options: [
        { value: 'cache', label: 'Cache the origin response for 60 seconds' },
        { value: 'rollback', label: 'Roll back to build 1041' }
      ]
    },
    status: 'pending',
    errors: []
  }
]

export interface AiChatProject {
  id: string
  code: string
  title: string
  kind: 'workload' | 'dns' | 'firewall' | 'function' | 'storage'
  icon: string
  pinned?: boolean
  inCloud?: boolean
}

export interface AiChatProduct {
  label: string
  icon: string
}

export interface AiChatThreadChange {
  ref: string
  title: string
}

export interface AiChatThread {
  id: string
  title: string
  projectId: string
  updatedAt: string
  age: string
  environment: string
  modelLabel: string
  providerIcon: string
  products: string[]
  version?: string
  draft?: boolean
  snoozed?: boolean
  settled?: boolean
  changes?: AiChatThreadChange[]
}

export const sampleHistoryNow = '2026-11-19T12:00:00Z'

export const sampleProducts: Record<string, AiChatProduct> = {
  applications: { label: 'Applications', icon: 'az az-applications' },
  firewall: { label: 'Firewall', icon: 'az az-firewall' },
  functions: { label: 'Functions', icon: 'az az-functions' },
  waf: { label: 'WAF', icon: 'az az-waf' },
  'real-time-purge': { label: 'Real-Time Purge', icon: 'az az-real-time-purge' },
  'sql-database': { label: 'SQL Database', icon: 'az az-sql-database' },
  'edge-dns': { label: 'Edge DNS', icon: 'az az-edge-dns' },
  'object-storage': { label: 'Object Storage', icon: 'az az-object-storage' },
  'image-processor': { label: 'Image Processor', icon: 'az az-image-processor' }
}

export const sampleProjects: AiChatProject[] = [
  {
    id: 'workloads',
    code: 'WL',
    title: 'Workloads',
    kind: 'workload',
    icon: 'az az-workloads',
    pinned: true
  },
  { id: 'edge-dns', code: 'DN', title: 'Edge DNS', kind: 'dns', icon: 'az az-edge-dns' },
  { id: 'firewall', code: 'FW', title: 'Firewall', kind: 'firewall', icon: 'az az-firewall' },
  {
    id: 'functions',
    code: 'FN',
    title: 'Functions',
    kind: 'function',
    icon: 'az az-functions',
    inCloud: true
  },
  {
    id: 'storage',
    code: 'OS',
    title: 'Object Storage',
    kind: 'storage',
    icon: 'az az-object-storage',
    inCloud: true
  }
]

export const sampleThreads: AiChatThread[] = [
  {
    id: 'h1',
    title: 'Why does storefront return 502 errors?',
    projectId: 'workloads',
    updatedAt: '2026-11-19T11:48:00Z',
    age: '12m',
    environment: 'prod-us-east',
    modelLabel: 'Claude Opus 4.5',
    providerIcon: 'az az-claude',
    products: ['applications', 'firewall', 'functions'],
    draft: true,
    changes: [
      { ref: '#1170', title: 'feat(workload): renew origin TLS cert for api.example.com' },
      { ref: '#1200', title: 'fix(cache): allowlist q and page query params on /search' },
      { ref: '#1203', title: 'chore(edge): enable stale-while-revalidate fallback' }
    ]
  },
  {
    id: 'h7',
    title:
      'Checkout on acme-store times out for customers in the EU region after the latest deploy',
    projectId: 'workloads',
    updatedAt: '2026-11-19T11:05:00Z',
    age: '55m',
    environment: 'prod-eu-west',
    modelLabel: 'Azion Auto',
    providerIcon: 'az az-azion',
    products: ['applications', 'functions']
  },
  {
    id: 'h2',
    title: 'Purge the cache after a deploy',
    projectId: 'workloads',
    updatedAt: '2026-11-19T09:40:00Z',
    age: '2h',
    environment: 'prod-us-east',
    modelLabel: 'Gemini 4 Neon',
    providerIcon: 'az az-gemini',
    products: ['real-time-purge'],
    changes: [{ ref: '#1170', title: 'ci(purge): trigger Real-Time Purge on release tag' }]
  },
  {
    id: 'h3',
    title: 'A WAF rule for login attempts',
    projectId: 'firewall',
    updatedAt: '2026-11-18T17:15:00Z',
    age: '1d',
    environment: 'edge-global',
    modelLabel: 'Claude Sonnet 4',
    providerIcon: 'az az-claude',
    products: ['waf'],
    version: 'v42',
    changes: [{ ref: '#1142', title: 'sec(waf): rate-limit /auth/login to 20 req/min' }]
  },
  {
    id: 'h4',
    title: 'Top orders query for acme-store',
    projectId: 'functions',
    updatedAt: '2026-11-16T10:20:00Z',
    age: '3d',
    environment: 'edge-sql-eu',
    modelLabel: 'GPT-5.2',
    providerIcon: 'az az-openai',
    products: ['sql-database'],
    version: 'v7'
  },
  {
    id: 'h5',
    title: 'Move DNS records to Azion',
    projectId: 'edge-dns',
    updatedAt: '2026-11-04T14:05:00Z',
    age: '2w',
    environment: 'dns-anycast',
    modelLabel: 'Gemini 4 Carbon',
    providerIcon: 'az az-gemini',
    products: ['edge-dns']
  },
  {
    id: 'h6',
    title: 'Image optimization for docs-site',
    projectId: 'storage',
    updatedAt: '2026-09-28T08:30:00Z',
    age: '1mo',
    environment: 'media-bucket',
    modelLabel: 'Azion Auto',
    providerIcon: 'az az-azion',
    products: ['image-processor', 'object-storage'],
    settled: true
  }
]

export const sampleProviders: PromptInputMenuOption[] = [
  { value: 'azion', label: 'Azion AI', icon: 'az az-azion' },
  { value: 'google', label: 'Google', icon: 'az az-gemini' },
  { value: 'anthropic', label: 'Anthropic', icon: 'az az-claude' },
  { value: 'openai', label: 'OpenAI', icon: 'az az-openai' },
  { value: 'meta', label: 'Meta', icon: 'az az-meta' }
]

export const sampleModels: PromptInputMenuOption[] = [
  {
    value: 'gemini-4-neon',
    label: 'Gemini 4 Neon',
    provider: 'google',
    icon: 'az az-gemini',
    shortcut: '⌘1'
  },
  {
    value: 'gemini-4-carbon',
    label: 'Gemini 4 Carbon',
    provider: 'google',
    icon: 'az az-gemini',
    shortcut: '⌘2'
  },
  {
    value: 'gemini-3-8-flash',
    label: 'Gemini 3.8 Flash',
    provider: 'google',
    icon: 'az az-gemini',
    shortcut: '⌘3'
  },
  {
    value: 'claude-opus-4-5',
    label: 'Claude Opus 4.5',
    provider: 'anthropic',
    icon: 'az az-claude',
    shortcut: '⌘4'
  },
  {
    value: 'claude-sonnet-4',
    label: 'Claude Sonnet 4',
    provider: 'anthropic',
    icon: 'az az-claude',
    shortcut: '⌘5'
  },
  { value: 'gpt-5-2', label: 'GPT-5.2', provider: 'openai', icon: 'az az-openai', shortcut: '⌘6' },
  {
    value: 'gpt-5-mini',
    label: 'GPT-5 Mini',
    provider: 'openai',
    icon: 'az az-openai',
    shortcut: '⌘7'
  },
  {
    value: 'llama-4-maverick',
    label: 'Llama 4 Maverick',
    provider: 'meta',
    icon: 'az az-meta',
    shortcut: '⌘8'
  },
  {
    value: 'auto',
    label: 'Azion Auto',
    provider: 'azion',
    icon: 'az az-azion',
    description: 'AI Gateway router'
  }
]

export const sampleModes: PromptInputMenuOption[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'extra', label: 'Extra' }
]

export const sampleContexts: PromptInputMenuOption[] = [
  { value: 'acme-store', label: 'acme-store', description: 'Storefront and checkout' },
  { value: 'docs-site', label: 'docs-site', description: 'Product documentation' }
]

export const sampleTools: PromptInputMenuOption[] = [
  { value: 'web-search', label: 'Web search', icon: 'az az-globe' },
  { value: 'deep-research', label: 'Deep research', icon: 'az az-lightbulb' },
  { value: 'create-image', label: 'Create image', icon: 'az az-image' }
]
````

## `lib/ai-chat-failure.ts`

```ts
import type { AiChatMessage } from '@aziontech/webkit/utils/ai-chat'

export const failureText = (error: unknown): string => {
  if (!error) return ''
  if (typeof error === 'string') return error
  return 'The connection was interrupted before the response finished.'
}

export const turnTime = (
  turn: Pick<AiChatMessage, 'createdAt'>,
  formatDate: (value: Date | string | number, options?: Intl.DateTimeFormatOptions) => string
): string =>
  turn.createdAt ? formatDate(turn.createdAt, { hour: '2-digit', minute: '2-digit' }) : ''
```

## `composables/use-composer-focus.ts`

```ts
import { type MaybeRefOrGetter, nextTick, onMounted, type Ref, toValue, watch } from 'vue'

export interface UseComposerFocusTarget {
  focus: () => void
  $el?: unknown
}

export interface UseComposerFocusReturn {
  /** Focuses the composer again once the welcome page gives way to the thread. */
  refocusAfterWelcome: (typed: boolean) => void
}

export function useComposerFocus(
  composerEl: Ref<UseComposerFocusTarget | null>,
  loading: MaybeRefOrGetter<boolean>,
  welcome: MaybeRefOrGetter<boolean>
): UseComposerFocusReturn {
  let refocus = false

  onMounted(() => nextTick(() => composerEl.value?.focus()))

  watch(
    () => toValue(loading),
    (now, before) => {
      if (!before || now) return
      const active = globalThis.document?.activeElement
      const idle = !active || active === globalThis.document.body || !active.isConnected
      const box = composerEl.value?.$el as globalThis.Element | undefined
      if (idle || (box && box.contains(active))) composerEl.value?.focus()
    }
  )

  watch(
    () => toValue(welcome),
    (now) => {
      if (now || !refocus) return
      refocus = false
      void nextTick(() => composerEl.value?.focus())
    }
  )

  return {
    refocusAfterWelcome: (typed) => {
      refocus = typed
    }
  }
}
```

## `composables/use-wide-screen.ts`

```ts
import { onMounted, onScopeDispose, readonly, type Ref, ref } from 'vue'

export function useWideScreen(query = '(min-width: 48rem)'): Readonly<Ref<boolean>> {
  const wide = ref(false)
  let media: MediaQueryList | null = null
  const onChange = () => {
    wide.value = Boolean(media?.matches)
  }
  onMounted(() => {
    media = globalThis.matchMedia?.(query) ?? null
    onChange()
    media?.addEventListener('change', onChange)
  })
  onScopeDispose(() => media?.removeEventListener('change', onChange))
  return readonly(wide)
}
```

## `parts/ai-chat-artifact.vue`

```ts
<script setup lang="ts">
  import ArtifactCanvas from '@aziontech/webkit/artifact-canvas'
  import CodeBlock from '@aziontech/webkit/code-block'
  import { computed, ref } from 'vue'

  const props = defineProps<{ title: string; versions: string[]; downloadable: boolean }>()

  const emit = defineEmits<{ close: [] }>()

  const version = defineModel<number>('version', { required: true })

  const canvasEl = ref<InstanceType<typeof ArtifactCanvas> | null>(null)
  const code = computed(() => props.versions[version.value] ?? '')
  const lines = computed(() => code.value.split('\n').length)

  defineExpose({ focus: () => canvasEl.value?.focus() })
</script>

<template>
  <ArtifactCanvas
    ref="canvasEl"
    v-model:version="version"
    :title="title"
    :meta="`SQL · ${lines} lines`"
    type="code"
    :versions="versions.length"
    :copy-value="code"
    :download-href="
      downloadable ? `data:application/sql;charset=utf-8,${encodeURIComponent(code)}` : ''
    "
    @close="emit('close')"
  >
    <CodeBlock
      :tabs="[{ label: 'SQL', value: 'sql', code, language: 'sql' }]"
      :copyable="false"
      :bordered="false"
    />
  </ArtifactCanvas>
</template>
```

## `parts/ai-chat-composer.vue`

```ts
<script setup lang="ts">
  import type {
    PromptInputFile,
    PromptInputMenuOption,
    PromptInputStatus
  } from '@aziontech/webkit/prompt-input'
  import PromptInputAttachButton from '@aziontech/webkit/prompt-input-attach-button'
  import PromptInputContextPicker from '@aziontech/webkit/prompt-input-context-picker'
  import PromptInputDictateButton from '@aziontech/webkit/prompt-input-dictate-button'
  import PromptInputModelPicker from '@aziontech/webkit/prompt-input-model-picker'
  import PromptInput from '@aziontech/webkit/prompt-input-root'
  import { nextTick, ref } from 'vue'

  import { sampleContexts, sampleModes, sampleProviders } from '../sample'
  import AiChatVoice from './ai-chat-voice.vue'

  defineProps<{
    state: PromptInputStatus
    queueable: boolean
    hydrating: boolean
    accept: string
    maxFiles: number
    maxFileSize: number
    attachable: boolean
    voice: boolean
    models: PromptInputMenuOption[]
    tools: PromptInputMenuOption[]
  }>()

  const emit = defineEmits<{
    submit: [event: MouseEvent | KeyboardEvent, value: string]
    stop: [event: MouseEvent]
    'voice-start': [event: MouseEvent]
  }>()

  const prompt = defineModel<string>({ required: true })
  const files = defineModel<PromptInputFile[]>('files', { required: true })
  const modelKey = defineModel<string>('modelKey', { required: true })
  const toolKeys = defineModel<string[]>('toolKeys', { required: true })

  const modeKey = ref('medium')
  const contextKey = ref('')
  const modes = sampleModes
  const contexts = sampleContexts

  const inputEl = ref<InstanceType<typeof PromptInput> | null>(null)
  const voiceActive = ref(false)

  function startVoice(event: MouseEvent) {
    voiceActive.value = true
    emit('voice-start', event)
  }

  function endVoice() {
    voiceActive.value = false
    void nextTick(() => inputEl.value?.focus())
  }

  defineExpose({ focus: () => inputEl.value?.focus() })
</script>

<template>
  <AiChatVoice
    v-if="voiceActive"
    @send="(event, text) => emit('submit', event, text)"
  />
  <PromptInput
    ref="inputEl"
    v-model="prompt"
    v-model:files="files"
    :status="state"
    :queueable="queueable"
    :disabled="hydrating"
    :accept="accept"
    :max-files="maxFiles"
    :max-file-size="maxFileSize"
    :max-length="4000"
    :voice="voice"
    :voice-active="voiceActive"
    @submit="(event, { value }) => emit('submit', event, value)"
    @stop="emit('stop', $event)"
    @voice-start="startVoice"
    @voice-end="endVoice"
  >
    <template
      v-if="attachable"
      #actions
    >
      <PromptInputAttachButton
        v-model="toolKeys"
        :tools="tools"
      />
    </template>
    <template #end>
      <PromptInputModelPicker
        v-if="models.length"
        v-model="modelKey"
        v-model:mode="modeKey"
        :providers="sampleProviders"
        :models="models"
        :modes="modes"
        mode-label="Thinking Level"
      />
      <PromptInputDictateButton />
    </template>
    <template
      v-if="contexts.length"
      #footer
    >
      <PromptInputContextPicker
        v-if="contexts.length"
        v-model="contextKey"
        :options="contexts"
        placeholder="Choose project"
      />
    </template>
    <template #hint>
      <span class="max-md:sr-only">
        The AI assistant can make mistakes. Check important information before you act on it.
      </span>
    </template>
  </PromptInput>
</template>
```

## `parts/ai-chat-connection-status.vue`

```ts
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import type { AiChatConnection } from '@aziontech/webkit/utils/ai-chat'
  import { computed, ref, watch } from 'vue'

  const props = defineProps<{
    connection: AiChatConnection
    resuming: boolean
    sessionGenerating: boolean
    loading: boolean
  }>()

  const wasConnected = ref(props.connection === 'connected')
  watch(
    () => props.connection,
    (value) => {
      if (value === 'connected') wasConnected.value = true
    }
  )
  const reconnecting = computed(
    () => (wasConnected.value && props.connection === 'connecting') || props.resuming
  )
  const offline = computed(
    () =>
      !reconnecting.value &&
      (props.connection === 'error' || (wasConnected.value && props.connection === 'disconnected'))
  )
</script>

<template>
  <StatusIndicator
    v-if="reconnecting"
    key="reconnecting"
    severity="warning"
    label="Reconnecting"
    loading
  />
  <Alert
    v-else-if="offline"
    key="offline"
    severity="danger"
    size="small"
    title="Connection lost"
  >
    Your messages send when the connection returns.
  </Alert>
  <StatusIndicator
    v-else-if="sessionGenerating && !loading"
    key="elsewhere"
    severity="info"
    label="Responding in another tab"
    loading
  />
</template>
```

## `parts/ai-chat-header.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import IconButton from '@aziontech/webkit/icon-button'
  import { computed, ref } from 'vue'

  import { sampleThreads } from '../sample'
  import AiChatRemoveDialog from './ai-chat-remove-dialog.vue'

  export type AiChatHeaderAction = 'share' | 'rename' | 'archive' | 'remove'

  const props = defineProps<{
    empty: boolean
    historyOpen: boolean
    conversationKey: string | null
  }>()

  const emit = defineEmits<{
    'new-chat': [event: MouseEvent]
    'open-history': [event: MouseEvent]
    'toggle-history': [event: MouseEvent]
    action: [event: MouseEvent | KeyboardEvent, action: AiChatHeaderAction]
  }>()

  const title = computed(
    () =>
      sampleThreads.find((thread) => thread.id === props.conversationKey)?.title ?? 'AI assistant'
  )

  const actions: { value: AiChatHeaderAction; label: string; severity?: 'danger' }[] = [
    { value: 'share', label: 'Share' },
    { value: 'rename', label: 'Rename' },
    { value: 'archive', label: 'Archive' },
    { value: 'remove', label: 'Delete', severity: 'danger' }
  ]

  const removeOpen = ref(false)

  function onAction(event: MouseEvent | KeyboardEvent, value: string | number) {
    if (value === 'remove') removeOpen.value = true
    else emit('action', event, value as AiChatHeaderAction)
  }

  const HEADER_CLASS =
    'pointer-events-none absolute inset-x-0 top-0 z-2 flex items-center justify-between gap-(--spacing-sm) p-(--spacing-sm) ' +
    'md:bg-[linear-gradient(to_bottom,var(--bg-canvas)_55%,transparent)] md:px-(--spacing-md)'

  const FLOATING_CLASS =
    'pointer-events-auto inline-flex items-center overflow-hidden rounded-(--shape-button) border border-(--border-default) ' +
    'bg-[color-mix(in_srgb,var(--bg-surface-raised)_80%,transparent)] shadow-(--shadow-md) backdrop-blur-md md:hidden'
</script>

<template>
  <header :class="HEADER_CLASS">
    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
      <span :class="FLOATING_CLASS">
        <IconButton
          icon="az az-menu"
          aria-label="Open conversation history"
          variant="ghost"
          @click="emit('open-history', $event)"
        />
      </span>
      <span class="pointer-events-auto inline-flex max-md:hidden">
        <IconButton
          icon="az az-history"
          :aria-label="historyOpen ? 'Hide conversation history' : 'Show conversation history'"
          :aria-expanded="historyOpen"
          aria-controls="ai-chat-history"
          variant="ghost"
          size="medium"
          @click="emit('toggle-history', $event)"
        />
      </span>
      <h1
        id="ai-chat-title"
        class="pointer-events-auto min-w-0 truncate px-(--spacing-xs) text-label-lg text-(--text-default) max-md:sr-only"
      >
        {{ title }}
      </h1>
    </div>
    <div class="flex items-center gap-(--spacing-2xs)">
      <span class="pointer-events-auto inline-flex max-md:hidden">
        <Button
          label="Share"
          variant="ghost"
          size="small"
          icon="az az-share"
          :disabled="empty"
          @click="emit('action', $event, 'share')"
        />
      </span>
      <span :class="FLOATING_CLASS">
        <IconButton
          icon="az az-square-pen"
          aria-label="New chat"
          variant="ghost"
          :disabled="empty"
          @click="emit('new-chat', $event)"
        />
        <DropdownMenu
          side="bottom"
          align="end"
          :disabled="empty"
          @select="onAction"
        >
          <DropdownMenuTrigger>
            <IconButton
              icon="az az-ellipsis"
              aria-label="More conversation actions"
              variant="ghost"
              :disabled="empty"
            />
          </DropdownMenuTrigger>
          <DropdownMenuGroup>
            <DropdownMenuItem
              v-for="action in actions"
              :key="action.value"
              :value="action.value"
              :label="action.label"
              :severity="action.severity"
            />
          </DropdownMenuGroup>
        </DropdownMenu>
      </span>
      <span
        v-if="!historyOpen"
        class="pointer-events-auto inline-flex max-md:hidden"
      >
        <IconButton
          icon="az az-square-pen"
          aria-label="New chat"
          variant="ghost"
          size="medium"
          :disabled="empty"
          @click="emit('new-chat', $event)"
        />
      </span>
      <span class="pointer-events-auto inline-flex max-md:hidden">
        <DropdownMenu
          side="bottom"
          align="end"
          :disabled="empty"
          @select="onAction"
        >
          <DropdownMenuTrigger>
            <IconButton
              icon="az az-ellipsis"
              aria-label="More conversation actions"
              variant="ghost"
              size="medium"
              :disabled="empty"
            />
          </DropdownMenuTrigger>
          <DropdownMenuGroup>
            <DropdownMenuItem
              v-for="action in actions.slice(1)"
              :key="action.value"
              :value="action.value"
              :label="action.label"
              :severity="action.severity"
            />
          </DropdownMenuGroup>
        </DropdownMenu>
      </span>
    </div>
    <AiChatRemoveDialog
      v-model:open="removeOpen"
      :conversation-key="conversationKey"
      @confirm="(event: MouseEvent) => emit('action', event, 'remove')"
    />
  </header>
</template>
```

## `parts/ai-chat-history.vue`

```ts
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
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref, watch } from 'vue'

  import { useWideScreen } from '../composables/use-wide-screen'
  import {
    type AiChatProject,
    type AiChatThread,
    sampleHistoryNow,
    sampleProjects,
    sampleThreads
  } from '../sample'
  import AiChatHistoryActions from './ai-chat-history-actions.vue'
  import AiChatHistoryRow from './ai-chat-history-row.vue'
  import AiChatProjectFilter from './ai-chat-project-filter.vue'

  defineProps<{ panelOpen: boolean }>()

  const emit = defineEmits<{ create: [event: MouseEvent] }>()

  const active = defineModel<string | null>({ required: true })
  const drawerOpen = defineModel<boolean>('drawerOpen', { required: true })

  const wide = useWideScreen()

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
    { code: 'FW', title: 'New Firewall', kind: 'firewall', icon: 'az az-firewall' },
    {
      code: 'FN',
      title: 'New Function',
      kind: 'function',
      icon: 'az az-functions',
      inCloud: true
    },
    {
      code: 'OS',
      title: 'New Object Storage',
      kind: 'storage',
      icon: 'az az-object-storage',
      inCloud: true
    }
  ]

  const projectMap = computed(() => new Map(projects.value.map((item) => [item.id, item])))
  const threadMap = computed(() => new Map(threads.value.map((item) => [item.id, item])))

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
    updatedAt: thread.updatedAt,
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

  function toggleSnooze(_event: MouseEvent, id: string) {
    threads.value = threads.value.map((item) =>
      item.id === id ? { ...item, snoozed: !item.snoozed } : item
    )
  }

  function toggleSettle(_event: MouseEvent, id: string) {
    threads.value = threads.value.map((item) =>
      item.id === id ? { ...item, settled: !item.settled, snoozed: false } : item
    )
  }

  function discardDraft(_event: MouseEvent, id: string) {
    const index = threads.value.findIndex((item) => item.id === id)
    const thread = threads.value[index]
    if (!thread) return
    const wasActive = active.value === id
    threads.value = threads.value.filter((item) => item.id !== id)
    if (wasActive) active.value = null
    toast('Draft discarded', {
      action: {
        label: 'Undo',
        onClick: () => {
          const next = [...threads.value]
          next.splice(index, 0, thread)
          threads.value = next
          if (wasActive) active.value = id
        }
      }
    })
  }

  const PANEL_CLASS =
    'flex w-(--container-2xs) shrink-0 flex-col gap-(--spacing-sm) overflow-y-auto ' +
    'border-e border-(--border-default) bg-(--bg-surface) p-(--spacing-xs) max-md:hidden [--ai-chat-history-actions-width:--spacing(24)]'
</script>

<template>
  <aside
    v-if="panelOpen && wide"
    id="ai-chat-history"
    aria-label="Conversation history"
    :class="PANEL_CLASS"
  >
    <div
      class="flex items-center gap-(--spacing-2xs) border-b border-(--border-default) pb-(--spacing-xs)"
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
        />
      </template>
      <template #item-actions="{ item }">
        <AiChatHistoryActions
          v-if="threadMap.get(item.id)"
          :thread="threadMap.get(item.id)!"
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
          />
        </template>
        <template #item-actions="{ item }">
          <AiChatHistoryActions
            v-if="threadMap.get(item.id)"
            :thread="threadMap.get(item.id)!"
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
          />
        </template>
        <template #item-actions="{ item }">
          <AiChatHistoryActions
            v-if="threadMap.get(item.id)"
            :thread="threadMap.get(item.id)!"
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
      <div class="flex flex-col gap-(--spacing-xs) px-(--spacing-md) pb-(--spacing-xs)">
        <div class="flex items-center gap-(--spacing-2xs)">
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
        </div>
        <Button
          label="New chat"
          icon="az az-square-pen"
          variant="ghost"
          size="small"
          class="w-full"
          @click="create"
        />
      </div>
      <DrawerBody>
        <div class="[--ai-chat-history-actions-width:--spacing(24)]">
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
              />
            </template>
            <template #item-actions="{ item }">
              <AiChatHistoryActions
                v-if="threadMap.get(item.id)"
                :thread="threadMap.get(item.id)!"
                @snooze="toggleSnooze"
                @settle="toggleSettle"
                @discard="discardDraft"
              />
            </template>
          </ConversationHistory>
        </div>
      </DrawerBody>
    </DrawerContent>
  </Drawer>
</template>
```

## `parts/ai-chat-remove-dialog.vue`

```ts
<script setup lang="ts">
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import { computed } from 'vue'

  import { sampleThreads } from '../sample'

  const props = defineProps<{ conversationKey: string | null }>()

  const emit = defineEmits<{
    confirm: [event: MouseEvent]
  }>()

  const open = defineModel<boolean>('open', { default: false })

  const title = computed(() => {
    const name = sampleThreads.find((thread) => thread.id === props.conversationKey)?.title
    return name ? `Delete “${name}”?` : 'Delete this conversation?'
  })
</script>

<template>
  <ConfirmDialog
    v-model:open="open"
    :title="title"
    description="The conversation and its messages are removed from your history. This cannot be undone."
    confirm-label="Delete"
    @confirm="(event: MouseEvent) => emit('confirm', event)"
  />
</template>
```

## `parts/ai-chat-media-segment.vue`

```ts
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import AudioPlayer from '@aziontech/webkit/audio-player'
  import CodeBlock from '@aziontech/webkit/code-block'
  import FilePreview from '@aziontech/webkit/file-preview'
  import ImageGallery from '@aziontech/webkit/image-gallery'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import SubagentCard from '@aziontech/webkit/subagent-card'
  import {
    type AiChatSegment,
    documentNameOf,
    json,
    stopSubagent,
    structuredOf,
    subagentStatusOf,
    subagentTextOf
  } from '@aziontech/webkit/utils/ai-chat'
  import VideoPlayer from '@aziontech/webkit/video-player'

  defineProps<{ segment: AiChatSegment }>()
</script>

<template>
  <ImageGallery
    v-if="segment.type === 'gallery'"
    :items="segment.images"
  />
  <AudioPlayer
    v-else-if="segment.type === 'audio'"
    :src="segment.src"
  />
  <VideoPlayer
    v-else-if="segment.type === 'video'"
    :src="segment.src"
    :mime-type="segment.mimeType"
  />
  <FilePreview
    v-else-if="segment.type === 'document'"
    :file-name="documentNameOf(segment.part)"
    :mime-type="segment.part.source.mimeType"
    :src="segment.part.source.type === 'url' ? segment.part.source.value : ''"
    :base64="segment.part.source.type === 'data' ? segment.part.source.value : ''"
  />
  <SubagentCard
    v-else-if="segment.type === 'subagent'"
    :name="segment.part.subagent.name"
    :title="segment.part.subagent.description"
    :description="segment.part.subagent.error?.message"
    :status="subagentStatusOf(segment.part)"
    :stoppable="typeof segment.part.subagent.stop === 'function'"
    @stop="stopSubagent(segment.part)"
  >
    <StreamingResponse
      v-if="subagentTextOf(segment.part)"
      :content="subagentTextOf(segment.part)"
    />
    <template
      v-if="json(segment.part.subagent.input)"
      #input
    >
      <CodeBlock
        :code="json(segment.part.subagent.input)"
        language="json"
        :show-line-numbers="false"
      />
    </template>
  </SubagentCard>
  <template v-else-if="segment.type === 'structured'">
    <Alert
      v-if="segment.part.status === 'error'"
      severity="danger"
      size="small"
      title="The structured answer failed"
    >
      {{ segment.part.errorMessage || 'The answer did not match the expected format.' }}
    </Alert>
    <CodeBlock
      v-else-if="structuredOf(segment.part)"
      :code="structuredOf(segment.part)"
      language="json"
      :show-line-numbers="false"
      :aria-busy="segment.part.status === 'streaming' || undefined"
    />
  </template>
</template>
```

## `parts/ai-chat-skeleton.vue`

```ts
<script setup lang="ts">
  import Skeleton from '@aziontech/webkit/skeleton'
</script>

<template>
  <div
    role="status"
    aria-label="Loading the conversation"
    class="flex flex-col gap-(--spacing-xl)"
  >
    <template
      v-for="row in 2"
      :key="row"
    >
      <Skeleton
        width="45%"
        height="2.75rem"
        class="self-end"
      />
      <div class="flex flex-col gap-(--spacing-xs)">
        <Skeleton width="90%" />
        <Skeleton width="80%" />
        <Skeleton :width="row === 2 ? '40%' : '60%'" />
      </div>
    </template>
  </div>
</template>
```

## `parts/ai-chat-split.vue`

```ts
<script setup lang="ts">
  import ResizablePane from '@aziontech/webkit/resizable-pane'
  import Resizable from '@aziontech/webkit/resizable-root'

  defineProps<{ split: boolean }>()
</script>

<template>
  <component
    :is="split ? Resizable : 'div'"
    :aria-label="split ? 'Conversation and artifact' : undefined"
    class="flex min-h-0 min-w-0 flex-1"
  >
    <component
      :is="split ? ResizablePane : 'div'"
      class="relative flex min-h-0 min-w-0 flex-1 flex-col"
    >
      <slot />
    </component>
    <slot name="canvas" />
  </component>
</template>
```

## `parts/ai-chat-start.vue`

```ts
<script setup lang="ts">
  import SuggestionGroup, { type SuggestionGroupItem } from '@aziontech/webkit/suggestion-group'

  defineProps<{ starters: SuggestionGroupItem[] }>()

  const emit = defineEmits<{
    select: [event: MouseEvent | KeyboardEvent, item: SuggestionGroupItem]
  }>()

  defineSlots<{ default(): unknown }>()

  const START_CLASS =
    'flex min-h-0 flex-1 flex-col overflow-y-auto px-(--spacing-md) pt-(--spacing-2xl) ' +
    'pb-[max(var(--spacing-md),env(safe-area-inset-bottom))] md:justify-center md:pb-(--spacing-2xl)'
</script>

<template>
  <div :class="START_CLASS">
    <div
      class="mx-auto flex w-full max-w-(--container-2xl) flex-col gap-(--spacing-md) max-md:flex-1"
    >
      <div class="flex items-center justify-center max-md:flex-1 md:pb-(--spacing-sm)">
        <h2 class="text-center text-heading-lg text-(--text-default)">What can I help with?</h2>
      </div>
      <div class="flex md:order-last md:justify-center">
        <SuggestionGroup
          :items="starters"
          @select="(event, item) => emit('select', event, item)"
        />
      </div>
      <div class="flex flex-col gap-(--spacing-xs)">
        <slot />
      </div>
    </div>
  </div>
</template>
```

## `parts/ai-chat-tool-segment.vue`

```ts
<script setup lang="ts">
  import AgentQuestion from '@aziontech/webkit/agent-question'
  import CodeBlock from '@aziontech/webkit/code-block'
  import ImageGallery from '@aziontech/webkit/image-gallery'
  import ToolApproval from '@aziontech/webkit/tool-approval'
  import ToolCall from '@aziontech/webkit/tool-call'
  import {
    type AiChatQuestion,
    type AiChatTool,
    type AiChatToolCallPart,
    type AiChatToolResultPart,
    answerable,
    approvalOf,
    json,
    needsApproval,
    parsesAsJson,
    toolContentOf,
    toolStatusOf
  } from '@aziontech/webkit/utils/ai-chat'

  defineProps<{
    call: AiChatToolCallPart
    result?: AiChatToolResultPart
    tool: AiChatTool
    ask: AiChatQuestion
    edit: string
    busy: boolean
  }>()

  const emit = defineEmits<{
    answer: [event: Event, value: string]
    edit: [text: string]
    approve: [event: MouseEvent, text: string]
    deny: [event: MouseEvent]
  }>()

  const answer = defineModel<string>('answer')
</script>

<template>
  <AgentQuestion
    v-if="answerable(tool, call, result)"
    v-model="answer"
    :title="ask.title"
    :type="ask.options.length ? 'choice' : 'text'"
    :options="ask.options"
    :status="ask.status"
    @submit="(event, value) => emit('answer', event, value)"
  />
  <template v-else>
    <ToolApproval
      v-if="needsApproval(call)"
      :title="tool.question || tool.title || `Run ${call.name}?`"
      :description="tool.description"
      :approve-label="tool.approveLabel"
      :variant="tool.variant"
      :confirmation-phrase="tool.confirmationPhrase"
      :status="approvalOf(call)"
      :loading="busy"
      :editable="tool.editable"
      :invalid="tool.editable && !parsesAsJson(edit)"
      :model-value="edit"
      @update:model-value="(text) => emit('edit', text)"
      @approve="(event, text) => emit('approve', event, text)"
      @deny="emit('deny', $event)"
    >
      <CodeBlock
        v-if="!tool.editable && json(call.input ?? call.arguments)"
        :code="json(call.input ?? call.arguments)"
        language="json"
        :show-line-numbers="false"
      />
    </ToolApproval>
    <ToolCall
      v-if="!needsApproval(call) || approvalOf(call) === 'approved'"
      :name="call.name"
      :title="tool.title"
      :status="toolStatusOf(call, result)"
    >
      <template
        v-if="json(call.input ?? call.arguments)"
        #input
      >
        <CodeBlock
          :code="json(call.input ?? call.arguments)"
          language="json"
          :show-line-numbers="false"
        />
      </template>
      <template
        v-if="!result?.error && call.output === undefined && toolContentOf(result?.content)"
        #output
      >
        <p
          v-if="toolContentOf(result?.content)?.text"
          class="whitespace-pre-line text-body-sm text-(--text-default)"
        >
          {{ toolContentOf(result?.content)?.text }}
        </p>
        <ImageGallery
          v-if="toolContentOf(result?.content)?.images.length"
          :items="toolContentOf(result?.content)?.images ?? []"
        />
      </template>
      <template
        v-else-if="json(result?.error || call.output || result?.content)"
        #output
      >
        <CodeBlock
          :code="json(result?.error || call.output || result?.content)"
          language="json"
          :show-line-numbers="false"
        />
      </template>
    </ToolCall>
  </template>
</template>
```

## `parts/ai-chat-turn.vue`

```ts
<script setup lang="ts">
  import AgentActivity from '@aziontech/webkit/agent-activity'
  import AgentQuestion from '@aziontech/webkit/agent-question'
  import ChatMessage, {
    type ChatMessageFeedbackValue,
    type ChatMessageStatus
  } from '@aziontech/webkit/chat-message'
  import FeedbackReasonDialog, {
    type FeedbackReasonDialogPayload
  } from '@aziontech/webkit/feedback-reason-dialog'
  import McpAppFrame, {
    type McpAppFrameMessage,
    type McpAppFrameResource
  } from '@aziontech/webkit/mcp-app-frame'
  import Reasoning from '@aziontech/webkit/reasoning'
  import ResponseBranches from '@aziontech/webkit/response-branches'
  import Sources from '@aziontech/webkit/sources'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import { toast } from '@aziontech/webkit/toast'
  import type { UseAiChatVersionsReturn } from '@aziontech/webkit/use-ai-chat-versions'
  import {
    activitiesBefore,
    type AiChatMessage,
    type AiChatQuestion,
    type AiChatSegment,
    type AiChatTool,
    type AiChatToolCallPart,
    type AiChatUiResourcePart,
    segmentsOf,
    textOf
  } from '@aziontech/webkit/utils/ai-chat'
  import { computed, ref } from 'vue'

  import AiChatMediaSegment from './ai-chat-media-segment.vue'
  import AiChatToolSegment from './ai-chat-tool-segment.vue'

  const props = defineProps<{
    turn: AiChatMessage
    messages: ReadonlyArray<AiChatMessage>
    status: ChatMessageStatus
    time: string
    failure: string
    tools: Record<string, AiChatTool>
    busy: boolean
    ready: boolean
    stopped: boolean
    versions: UseAiChatVersionsReturn
    questions?: AiChatQuestion[]
    askOf: (call: AiChatToolCallPart) => AiChatQuestion
    editOf: (call: AiChatToolCallPart) => string
    resolveAppUrl?: (resource: McpAppFrameResource) => string | Promise<string>
  }>()

  const emit = defineEmits<{
    retry: [event: MouseEvent | KeyboardEvent]
    rate: [value: ChatMessageFeedbackValue | null, reason?: FeedbackReasonDialogPayload]
    share: [event: MouseEvent]
    branch: [event: MouseEvent | KeyboardEvent]
    'edit-prompt': [event: MouseEvent | KeyboardEvent, text: string]
    'version-change': [messages: AiChatMessage[]]
    'answer-tool': [event: Event, call: AiChatToolCallPart, value: string]
    edit: [call: AiChatToolCallPart, text: string]
    approve: [event: MouseEvent, call: AiChatToolCallPart, text: string]
    deny: [event: MouseEvent, call: AiChatToolCallPart]
    answer: [event: Event, question: AiChatQuestion, value: string]
    skip: [question: AiChatQuestion]
    'app-message': [
      message: McpAppFrameMessage,
      part: AiChatUiResourcePart,
      reply: (message: McpAppFrameMessage) => void
    ]
  }>()

  const answers = defineModel<Record<string, string>>('answers', { required: true })

  const reasonOpen = ref(false)
  const rating = ref<ChatMessageFeedbackValue | null>(null)
  const versionsOfTurn = computed(() => props.versions.versionsOf(props.turn))

  function regenerate(event: MouseEvent | KeyboardEvent) {
    props.versions.fork(props.turn)
    emit('retry', event)
  }

  function editPrompt(event: MouseEvent | KeyboardEvent, text: string) {
    props.versions.fork(props.turn)
    emit('edit-prompt', event, text)
  }

  function page(index: number) {
    const next = props.versions.select(props.turn, index)
    if (next) emit('version-change', next)
  }

  function rate(value: ChatMessageFeedbackValue | null) {
    rating.value = value
    emit('rate', value)
    if (value === 'up') toast('Thanks for your feedback')
    if (value === 'down') reasonOpen.value = true
  }

  function sendReason(reason: FeedbackReasonDialogPayload) {
    reasonOpen.value = false
    emit('rate', 'down', reason)
    toast('Thanks for your feedback')
  }

  const MEDIA_TYPES = new Set(['gallery', 'audio', 'video', 'document', 'subagent', 'structured'])
  const isMedia = (segment: AiChatSegment) => MEDIA_TYPES.has(segment.type)

  function toolOf(call: AiChatToolCallPart): AiChatTool {
    return props.tools[call.name] ?? { title: '' }
  }

  const appFrames = new Map<string, InstanceType<typeof McpAppFrame>>()

  function setAppFrame(key: string, el: unknown) {
    if (el) appFrames.set(key, el as InstanceType<typeof McpAppFrame>)
    else appFrames.delete(key)
  }

  function forwardAppMessage(key: string, part: AiChatUiResourcePart, message: McpAppFrameMessage) {
    emit('app-message', message, part, (reply) => appFrames.get(key)?.post(reply))
  }
</script>

<template>
  <ChatMessage
    :from="turn.role === 'user' ? 'user' : 'assistant'"
    :status="status"
    :timestamp="time"
    :error-message="status === 'error' ? failure : undefined"
    @retry="emit('retry', $event)"
    @edit="editPrompt"
  >
    <template v-if="turn.role === 'user'">{{ textOf(turn, '\n') }}</template>
    <template
      v-for="segment in segmentsOf(
        turn,
        turn.role === 'assistant' ? activitiesBefore(messages, turn) : []
      )"
      :key="segment.key"
    >
      <template v-if="turn.role === 'user' && segment.type === 'text'" />
      <AgentActivity
        v-else-if="segment.type === 'activity'"
        :steps="segment.steps"
      />
      <Reasoning
        v-else-if="segment.type === 'reasoning'"
        :streaming="status === 'pending'"
        :duration="status === 'pending' ? undefined : turn.metadata?.reasoningSeconds"
      >
        <p class="whitespace-pre-line">{{ segment.content }}</p>
      </Reasoning>
      <StreamingResponse
        v-else-if="segment.type === 'text'"
        :content="segment.content"
        :streaming="status === 'streaming'"
        :sources="turn.metadata?.sources ?? []"
      />
      <AiChatToolSegment
        v-else-if="segment.type === 'tool'"
        v-model:answer="answers[segment.call.id]"
        :call="segment.call"
        :result="segment.result"
        :tool="toolOf(segment.call)"
        :ask="askOf(segment.call)"
        :edit="editOf(segment.call)"
        :busy="busy"
        @answer="(event, value) => emit('answer-tool', event, segment.call, value)"
        @edit="(text) => emit('edit', segment.call, text)"
        @approve="(event, text) => emit('approve', event, segment.call, text)"
        @deny="(event) => emit('deny', event, segment.call)"
      />
      <AiChatMediaSegment
        v-else-if="isMedia(segment)"
        :segment="segment"
      />
      <McpAppFrame
        v-else-if="segment.type === 'app'"
        :ref="(el) => setAppFrame(segment.key, el)"
        :resource="segment.part.resource"
        :title="(tools[segment.part.toolName] ?? { title: '' }).title || segment.part.toolName"
        :resolve-url="resolveAppUrl"
        @message="(message) => forwardAppMessage(segment.key, segment.part, message)"
      />
    </template>
    <template v-if="turn.role === 'assistant'">
      <p
        v-if="stopped"
        class="text-body-sm text-(--text-muted)"
      >
        You stopped this response.
      </p>
      <slot name="end" />
    </template>
    <template
      v-if="turn.role === 'user'"
      #actions
    >
      <ChatMessage.Actions
        copyable
        editable
        :copy-text="textOf(turn, '\n')"
        :disabled="!ready"
      >
        <template
          v-if="versionsOfTurn"
          #leading
        >
          <ResponseBranches
            :model-value="versionsOfTurn.index"
            :count="versionsOfTurn.count"
            aria-label="Prompt versions"
            :disabled="!ready"
            @update:model-value="page"
          />
        </template>
      </ChatMessage.Actions>
    </template>
    <template
      v-else
      #actions
    >
      <ChatMessage.Actions
        copyable
        show-feedback
        show-read-aloud
        shareable
        retryable
        branchable
        :copy-text="textOf(turn)"
        :read-aloud-text="textOf(turn)"
        :feedback="rating"
        :disabled="!ready"
        @update:feedback="rate"
        @share="emit('share', $event)"
        @retry="regenerate"
        @branch="emit('branch', $event)"
      >
        <template
          v-if="versionsOfTurn"
          #leading
        >
          <ResponseBranches
            :model-value="versionsOfTurn.index"
            :count="versionsOfTurn.count"
            :disabled="!ready"
            @update:model-value="page"
          />
        </template>
        <template
          v-if="!stopped && turn.metadata?.sources?.length"
          #trailing
        >
          <Sources :items="turn.metadata.sources" />
        </template>
      </ChatMessage.Actions>
    </template>
  </ChatMessage>
  <ChatMessage
    v-if="questions?.length"
    from="assistant"
  >
    <AgentQuestion
      v-for="question in questions"
      :key="question.id"
      v-model="answers[question.id]"
      :title="question.title"
      :type="question.options.length ? 'choice' : 'text'"
      :options="question.options"
      :status="question.status"
      :error="question.error"
      :skippable="question.bound"
      @submit="(event, value) => emit('answer', event, question, value)"
      @skip="emit('skip', question)"
    />
  </ChatMessage>
  <FeedbackReasonDialog
    v-if="turn.role === 'assistant'"
    v-model:open="reasonOpen"
    @submit="(_event, reason) => sendReason(reason)"
  />
</template>
```

## `parts/ai-chat-voice.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import { ref } from 'vue'

  const emit = defineEmits<{
    send: [event: MouseEvent, text: string]
  }>()

  const spoken = ref('')

  function simulateSpeak(event: MouseEvent) {
    spoken.value = 'Why is storefront answering with 502 errors?'
    emit('send', event, spoken.value)
  }

  const VOICE_CLASS =
    'flex flex-wrap items-center justify-between gap-(--spacing-sm) rounded-(--shape-card) ' +
    'border border-(--border-default) bg-(--bg-surface) px-(--spacing-md) py-(--spacing-xs)'
</script>

<template>
  <div
    role="region"
    aria-label="Live voice conversation"
    data-testid="ai-chat-voice"
    :class="VOICE_CLASS"
  >
    <div class="flex min-w-0 items-center gap-(--spacing-sm)">
      <i
        class="az az-audio-lines shrink-0 text-(--text-default)"
        aria-hidden="true"
      />
      <StatusIndicator
        severity="info"
        label="Listening…"
        loading
      />
      <span
        v-if="spoken"
        class="truncate text-body-xs text-(--text-muted)"
        >{{ spoken }}</span
      >
    </div>
    <Button
      label="Try sample question"
      icon="az az-sparkles"
      variant="outline"
      size="small"
      @click="simulateSpeak"
    />
  </div>
</template>
```
