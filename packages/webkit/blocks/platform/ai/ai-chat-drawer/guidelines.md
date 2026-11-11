# AI chat drawer

The generative AI assistant beside the work: the reader is on a resource page — here a workload whose error rate is up — and opens the assistant in a drawer to ask about what they see, without losing the page. The drawer carries the same conversation as the full assistant page, laid out for a narrow column: every message at the inline start, a shorter composer, and support prompts written about this resource.

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
