---
name: azion-ui-ai-surfaces
description: Generative AI surfaces on @aziontech/ui — a chat page or drawer, a streamed response, thinking and loading states, citations, feedback, follow-up questions, generated artifacts and actions the assistant may only run after the reader approves. Picks the right AI component for each moment (Conversation, ChatMessage, PromptInput, StreamingResponse, Reasoning, Sources, Citation, SuggestionGroup, ToolCall, ToolApproval, ArtifactPreview, ResponseLoading), wires the message lifecycle (pending → streaming → success or error) and holds the safety line — model output is never rendered as HTML and nothing with side effects runs without an explicit approval. Use when building or reviewing anything where a person talks with an AI assistant or reads its output.
status: active
last_updated: 2026-11-25
scope: general
enforced_by: [azion-ui-accessibility, azion-ui-component-states, ui-verify]
---

# Skill: azion-ui-ai-surfaces

## Purpose

A generative AI surface fails in ways an ordinary form does not: a response that streams into a
screen reader one token at a time, a log that yanks the reader to the bottom while they copy an older
answer, a loading state that flickers for 200 ms, Markdown from the model injected as HTML, a "Deploy"
the assistant ran because the reader typed "sure". This pattern builds the conversation, the response
and the authorization step from `@aziontech/ui` so each of those is handled once, by the
component, the same way everywhere. It follows Cloudscape's generative AI patterns (chat, loading
states, thinking, follow-up questions, artifact previews, user-authorized actions) and the anatomy of
shadcn's AI Elements.

## How to use

- [AI chat and actions](../azion-ui-ai-surfaces/SKILL.md) — apply these rules to the AI surface you are building in this conversation.
- `/azion-ui-ai-surfaces <file>` — review the file and report, per gap: the quoted line, the rule it breaks
  (from **Hard rules**), and the concrete fix with the component that solves it.

## How to find the components

Never guess an import path. Ask the **Azion UI MCP** — `get_block ai/ai-chat` (or
`ai-chat-drawer`, `ai-action-approval`) returns the full screen to copy; `suggest_component` with the
moment in plain words ("streamed answer", "ask before running a command") returns the component. Or
read the `imports` keys in **`node_modules/@aziontech/ui/catalog.json`**: a subpath that is not a
key there does not exist.

## Start from a block

| The surface                                                   | Copy                    |
| ------------------------------------------------------------- | ----------------------- |
| The assistant as a page of its own                            | `ai/ai-chat`            |
| The assistant beside a resource page, about what is on screen | `ai/ai-chat-drawer`     |
| The assistant proposes a change the reader must allow         | `ai/ai-action-approval` |

Each block has the empty, streaming, error and long-thread states (or pending, approved, denied,
expired and irreversible for approval) as variants. Adapt the words and the data; keep the structure.

## One component per moment

| Moment                                                                  | Component                                                                       |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| The scrolling thread                                                    | `Conversation` (`layout="start"` in a drawer or side panel)                     |
| One prompt or response, its author, lifecycle and actions               | `ChatMessage` + `ChatMessage.Actions`                                           |
| Good / bad response rating (one Feedback menu) on a response            | `ChatMessage.Feedback`                                                          |
| The composer                                                            | `PromptInput`                                                                   |
| Waiting for the first token                                             | `ChatMessage status="pending"` (renders `ResponseLoading`)                      |
| A table or code block about to appear while text streams                | `ResponseLoading variant="bar"`                                                 |
| The model's Markdown, streamed or finished                              | `StreamingResponse`                                                             |
| The model reasoning before it answers                                   | `Reasoning`                                                                     |
| Where a statement comes from                                            | `[n]` in the Markdown → `Citation`; the list → `Sources` with the same `anchor` |
| What to ask next, or what the assistant can do before the first message | `SuggestionGroup` (horizontal after a response, vertical in the empty state)    |
| A tool or command the agent called                                      | `ToolCall`                                                                      |
| Permission before something with side effects                           | `ToolApproval`                                                                  |
| A file, snippet or table the assistant generated                        | `ArtifactPreview` (stacked under the message, not inside the text)              |
| Before the first message                                                | `EmptyState` + vertical `SuggestionGroup`                                       |
| The agent pauses to ask the reader something it cannot infer            | `AgentQuestion`                                                                 |
| The steps an agent works through before or while it answers             | `AgentActivity`                                                                 |
| A step handed to a helper agent with its own status                     | `SubagentCard`                                                                  |
| Messages typed while a response is still streaming                      | `PromptQueue`                                                                   |
| Several versions of one response (after Regenerate)                     | `ResponseBranches`                                                              |
| A long generated document shown beside the thread                       | `ArtifactCanvas`                                                                |
| A tool result that is a small app (an MCP app)                          | `McpAppFrame`                                                                   |
| The reason after a thumbs down                                          | `FeedbackReasonDialog`                                                          |
| Images, audio or video in a message                                     | `ImageGallery`, `AudioPlayer`, `VideoPlayer`                                    |
| Past conversations                                                      | `ConversationHistory`                                                           |
| The one AI entry point on a product screen                              | `HighlightButton`                                                               |

## The message lifecycle

Drive `ChatMessage` from your request, never from timers in the view:

1. Submit → push the user's message and an assistant message with `status="pending"`; set the
   composer's `status="pending"`. `ResponseLoading` shows only after one second, so fast responses never
   flicker.
2. Reasoning tokens → `Reasoning :streaming="true"` inside the message (collapsed). Thinking ends →
   `streaming=false` and, if the server reports it, `duration`.
3. First answer token → `status="streaming"` on the message and the composer; pass the accumulated
   text to `StreamingResponse :streaming="true"`.
4. Done → `status="success"`: the actions render and the `Conversation` reads the finished text once
   to screen readers. Show `Sources` and the follow-up `SuggestionGroup` now, not before.
5. Failure → `status="error"` with an `error-message` saying what happened; keep the partial text;
   `@retry` regenerates in place.
6. Stop → `PromptInput @stop` aborts the request; mark the message complete and say it was stopped.

## Safety

- **No HTML from the model.** Render model text with `StreamingResponse` only. It parses Markdown into
  elements; raw tags show as text, and only `http(s)`, `mailto`, relative and `#` links survive. Never
  `v-html` model output, not even "sanitized".
- **Nothing with side effects without `ToolApproval`.** Read-only calls are recorded with
  `ToolCall` and continue. Writes, deploys, purges and deletes wait for Approve. Irreversible actions
  use `variant="danger"` and `confirmation-phrase`. The card is not a dialog: no focus trap, no initial
  focus, Approve never pre-selected.
- **Undecided requests expire** (`status="expired"`) and the assistant says nothing ran.
- **No secrets** in reasoning, tool inputs or outputs, or commands shown for approval.

## Hard rules

- `Conversation` around every thread; never a plain `div` with `overflow-y-auto` and a manual
  scroll-to-bottom (it auto-scrolls while the reader reads, and announces nothing or everything).
- One `PromptInput`, pinned under the log; only the log scrolls. Compose the full `PromptInput` by default (`PromptInput.AttachButton` in `#actions`, `PromptInput.ModelPicker` and `PromptInput.DictateButton` in `#end`, `voice`, `PromptInput.ContextPicker` and `PromptInput.Tools` in `#footer`); omit a control only when the product explicitly does not offer that capability.
- Actions only on complete responses, always visible, five at most: Copy, Regenerate, feedback.
- Feedback thumbs only on AI output.
- Loading text names what is coming: `Generating a response`, `Loading list of workloads`.
- Ideally up to three support prompts or follow-ups, most likely first, under 72 characters each, always with an icon on every item.
- Every message keeps its author line (or is `grouped` after one that has it); alignment never carries
  meaning alone.
- In a drawer or side panel, `layout="start"`.
- Artifacts stack under the message as `ArtifactPreview`, each with its own Copy, Download or Open.

## Words

- The assistant is "AI assistant"; its output is a "response". The reader "submits" a prompt.
- Placeholder `Ask a question`, or "Ask about <resource>" in context; no end punctuation.
- Disclaimer: "The AI assistant can make mistakes. Check important information." Show it only before
  the first message, at the foot of the page (the composer's hint in a drawer), while the composer
  sits in the middle of the page; once the conversation starts the composer moves to the foot and
  the disclaimer is gone.
- Errors say what happened and offer Try again: "The connection was interrupted before the response
  finished."
- Approval titles are questions naming the action, commands in backticks:
  ``Allow `azion deploy --env production`?``; the approve button is the verb (Deploy, Delete).
- Built-in strings (Thinking, Thought for N seconds, Sources, Helpful, Not helpful, Feedback
  submitted, Approved, Denied, Request expired) come in English, Portuguese and Spanish from the
  `ConfigProvider` locale.
- Follow [Interface text](../azion-ui-microcopy/SKILL.md) for everything else.

## Enforcement (honest)

The components enforce the live regions, busy states, safe Markdown, actions-only-when-complete,
the one-second loading delay and the approval gating. Nothing enforces that your code waits for
`approve` before calling the API, that you pass the real lifecycle `status`, or that you redact secrets:
those are review items.

## Review output

For each gap, in this order:

1. The quoted line.
2. The rule (from **Hard rules** or **Safety**).
3. The fix, naming the component and prop, e.g. "replace `<div v-html="answer">` with
   `<StreamingResponse :content="answer" :streaming="isStreaming" />`".

End with the count of Safety findings first; any Safety finding blocks the change.

## How to check it works

- The screen started from a `ai/*` block.
- Every thread is a `Conversation`; every turn a `ChatMessage` with the real lifecycle `status`.
- Model text renders through `StreamingResponse`; no `v-html` anywhere near model output.
- Citations share an `anchor` with their `Sources`.
- Every side-effecting call waits for `ToolApproval`; denials and expiry are acknowledged.
- Empty, streaming, error and long-thread states exist and were checked with a screen reader and
  with reduced motion.
