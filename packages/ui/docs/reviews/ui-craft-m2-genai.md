# ui-craft review — M2.4 generative-AI components and blocks

ROADMAP M2.4. The mandatory `ui-craft` progression (`.claude/skills/ui-craft/SKILL.md`) ran on the
twelve components in `src/components/ai/`, their examples in `examples/<name>/`, and the three blocks
in `blocks/platform/ai/`. Benchmarks: Cloudscape's generative-AI section (chat bubble, prompt input,
avatar, loading bar, support prompt group; the chat, loading states, thinking, follow-up questions,
artifact previews and user-authorized actions patterns) and shadcn's AI Elements (Conversation,
Message, PromptInput, Response, Reasoning, Sources, InlineCitation, Suggestion, Tool, Confirmation,
CodeBlock, Actions, Loader, Artifact). The design sample (`origin/design/sample`) has no chat or
assistant design, so no design overrides the benchmarks; the Console Kit `azion-ai-chat` module was
read for the console's current flow (welcome, persona prompts, Markdown via `marked` + `v-html`,
Stop, disclaimer).

Each entry lists the findings, what was fixed, and what is not a defect and why. What could not be
fixed here is a row in ROADMAP M2.10 (rows 2–4).

## Decisions taken

- **A new `ai` category** (`src/components/ai/`, `COMPONENT_CATEGORIES`, `.specs/_schema.json`): the
  family shares internals (`_lib/parse-markdown.ts`, `_lib/markdown-inline.ts`) and reads as one group
  in the catalog and the docs.
- **No HTML path for model output.** The Console Kit renders `marked(...)` through `v-html`; WebKit
  parses Markdown into its own tree and renders elements only. There is no sanitizer to configure and
  nothing to forget. Images render as their alt text; links keep `http(s)`, `mailto`, relative and
  `#` only.
- **Announce finished messages, not tokens.** `Conversation` is `role="log"` with `aria-live="off"`;
  `ChatMessage` hands its text to one polite region when it turns complete or fails. The reader's own
  messages and the history the log mounts with are not announced.
- **Lifecycle as one prop, `state`** (`pending | streaming | complete | error` on `ChatMessage`,
  `ready | submitted | streaming` on `PromptInput`), mirrored to `data-status`. `status` is a banned
  alias of `severity` in the prop vocabulary, and `data-state` stays reserved for open / closed.
- **PromptInput keeps typing allowed while a response streams**; only submitting is blocked and the
  control becomes Stop (Cloudscape keeps the input usable; AI Elements disables submit). The brief's
  "disabled while streaming" is read as "cannot submit".
- **AiLoading waits one second by default** (Cloudscape: no loading state under one second).
  `ChatMessage` passes `delay: 0`, because the owner already decides when a pending message exists.
- **ActionConfirmation is a card, not a dialog** (Cloudscape's one-time decision card): no focus trap,
  no initial focus, Approve never pre-selected; `focus()` moves focus to its heading on request.
- **Sources and SuggestionGroup are data-driven** (`items`), like Cloudscape's support prompt group:
  the response already holds the records, and item order is the citation order.
- **No Storybook stories** for the new components: Storybook is removed in M2.5 and the docs site
  renders `examples/`; the blocks get their generated stories like every block.

## Components

### Conversation

- Finding: the thread's reading width used `--container-3xl` directly. Fixed: `--layout-measure-content`
  (the same value, named by `webkit-layout`).
- Finding: a long thread that the reader scrolled up kept jumping to the end as tokens arrived (the
  Console Kit watches `messages` deeply and always scrolls). Fixed by construction: it follows only
  while pinned (within 32 px of the end) and shows Scroll to the latest message otherwise; a
  `ResizeObserver` on the thread and the viewport keeps it pinned when content or the host resizes.
- Finding: the scrollable log was not reachable by keyboard. Fixed: `tabindex="0"` with an inset ring.
- Smooth scrolling honors `prefers-reduced-motion`.

### ChatMessage, ChatMessage.Actions, ChatMessage.Feedback

- Finding: the avatar announced "AI assistant" a second time next to the author line. Fixed: the
  avatar column is `aria-hidden`.
- Finding: actions could render under a message still streaming (Cloudscape: never). Fixed:
  `ChatMessage.Actions` renders only when the message is complete, and the root only renders the
  `actions` slot then.
- Finding: after a thumb, nothing confirmed it. Fixed: the other thumb disables and a status line
  reads Submitting feedback, then Feedback submitted (Cloudscape strings).
- Not a defect: user bubbles cap at 85 % of the thread width with an arbitrary value; it is a ratio of
  the container, not a size token.

### PromptInput

- Finding: Enter submitted mid-composition for Japanese and Chinese input methods. Fixed: composition
  events and `isComposing` block submit.
- Finding: the counter changed silently. Fixed: going over the limit is announced once in a polite
  region; the counter is described by the text area.
- Finding: a hand-rolled `modelValue` + `update:modelValue` (authoring ratchet). Fixed: `defineModel`.
- Placeholder `Ask a question` and the disclaimer as hint text follow Cloudscape's chat copy.

### StreamingResponse, Citation, Sources

- Finding: an unclosed code fence re-highlighted on every token. Fixed: it stays a plain `<pre>` until
  the fence closes or the stream ends, then becomes a `CodeBlock`.
- Finding: a half-written `**bold` flashed literal asterisks. Fixed: an unclosed strong or code span
  renders to the end of the text; a lone `*` (arithmetic) stays literal.
- Finding: `[1]` alone told a screen reader nothing. Fixed: `Citation` is named `Source 1: <title>`.
- Finding: following a citation into a collapsed `Sources` landed on a hidden element. Fixed: `Sources`
  opens on a matching `hashchange` and scrolls the item into view.
- Headings start at `h3` so a response never outranks the page; code is `dir="ltr"`.

### Reasoning

- Finding: the label switched silently from Thinking to the duration. Fixed: a polite status announces
  the completed label once.
- Collapsed by default (Cloudscape: in chat the response is the main content); Skip thinking only when
  `skippable` and streaming.

### SuggestionGroup

- Not a defect: every prompt is a tab stop instead of a roving group. Five at most keeps the tab order
  short, and plain buttons need no extra keyboard model.

### ToolCall

- Status is text in a `StatusIndicator` (`role="status"`), never colour alone; details collapse and
  the tool name is code.

### ActionConfirmation

- Finding: the outcome appeared without an announcement. Fixed: a polite region reads Approved,
  Denied or Request expired.
- Finding: the title is a string, but tool names should be code. Fixed: backticks in `title` and
  `description` render as code through the shared inline renderer (no HTML).

### ArtifactPreview

- Finding: three Copy controls in one thread all read "Copy". Fixed: Copy, Download and Open are named
  with the artifact title; the visible Open text is contained in its name.
- Finding: a long preview body could not be scrolled by keyboard. Fixed: the body is focusable.

### AiLoading

- Loading is always visible text in a `role="status"` region; dots and bar are decoration
  (`aria-hidden`) with `motion-reduce` escapes.

## Blocks

### platform/ai/ai-chat

- Finding (consumer lint): a padding class on `SuggestionGroup`. Fixed: the follow-ups sit in a
  wrapper that aligns them with the response text.
- Finding (`webkit-layout`): the composer and the empty state used `mx-auto max-w-*`. Fixed:
  `layout-column-content layout-boundary-inline`.
- Structure: empty (support prompts), pending, thinking, streaming, complete, stopped and error
  states all exist; actions only on complete responses; focus returns to the composer when a
  response finishes.

### platform/ai/ai-chat-drawer

- Finding (consumer lint): padding on `Card`. Fixed: a padded wrapper inside the card.
- Finding: the drawer content carried its own `aria-labelledby` to an id that `DrawerTitle` replaces.
  Fixed: `DrawerTitle` names the dialog alone.
- The page behind uses `layout-column layout-boundary` with one `layout-section-start`.
- Ask AI exposes `aria-expanded`; the conversation uses `alignment="start"`.

### platform/ai/ai-action-approval

- Nothing runs before Approve; denial and expiry are acknowledged by the assistant; the irreversible
  variant needs the domain typed. The composer shows Stop while the approved deployment runs.

## Verification

- Browser suite (`src/components/ai`, Vitest + Playwright Chromium): 12 files, 108 tests.
- Every example and block compiles (`compile-all`: 0 errors) and mounts (`src/test/copyable-sfcs.test.ts`).
- `check-patterns`: 64 patterns, the three new ones with zero consumer-lint findings.
- Not yet verified: the blocks rendered with the theme in light, dark, 320 px and RTL (M2.10 row 4).
