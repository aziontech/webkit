# AI chat

A full page where a person talks with the generative AI assistant about their account: they ask in their own words, watch the response arrive, check where it came from, and keep going with a follow-up or a new question. The page is the conversation; everything else (header, composer) stays still while only the log scrolls. Use it as the assistant's home; on a resource page, open the same conversation in a drawer with `platform/ai/ai-chat-drawer`. It is a page body for `ConsoleLayout`: it fills the layout's content region (`grow basis-0 min-h-0`, never `h-dvh`), so only the log scrolls, and the layout owns the rail, the header and the `main`.

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

### J. Artifact canvas — `ChatMessage`, `PromptInput` (Artifact)

Variant Artifact only; it adds `ArtifactPreview`, `ArtifactCanvas`, `Resizable`, `CodeBlock` and a `Drawer` for narrow screens.

When an answer produces something longer than a message (a query, a configuration, a table), the message carries an `ArtifactPreview` with Open and the whole artifact opens in an `ArtifactCanvas` beside the conversation: a `Resizable.Pane` (`min` 320, `max` 880) after a `Resizable.Handle` named `Resize the artifact`, so the reader widens or narrows it with the pointer or the arrow keys. Under the md breakpoint the pane and handle are hidden and Open shows the same canvas in a full-height `Drawer`. Every follow-up that changes the artifact adds a version: the canvas moves to it, `streaming` locks the pager and marks the body busy while it is written, and each message's preview names its version (`Version 3`) and opens that one. Open moves focus to the canvas title; Close (or Escape inside the canvas) hides it and returns focus to the Open that showed it; `Show artifact` in the header brings a closed canvas back.

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
- Artifact: two turns that wrote top-orders.sql in two versions, the canvas open beside them on version 2; a follow-up streams version 3 into it.
- LongThread: six earlier turns that overflow the log, opened on the newest response.

## Related

- `artifact-canvas` — the side panel of the Artifact variant; `artifact-preview` — its card in the message.
- `platform/ai/ai-chat-drawer` — the same conversation in a drawer over a resource page.
- `platform/ai/ai-action-approval` — when a response proposes a change the reader must authorize.
- `platform/states/async-submit` — long-running work outside a conversation.
- `skills/webkit-genai` — the rules this block follows: loading stages, streaming, citations, feedback, authorization.
