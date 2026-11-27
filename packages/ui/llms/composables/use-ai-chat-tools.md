# useAiChatTools

Composable `@aziontech/ui/use-ai-chat-tools`. The signatures and option tables below are read from its typed source, [`src/composables/use-ai-chat-tools/index.ts`](https://github.com/aziontech/webkit/blob/main/packages/ui/src/composables/use-ai-chat-tools/index.ts).

```ts
import { useAiChatTools } from '@aziontech/ui/use-ai-chat-tools'
import type { UseAiChatToolsOptions, UseAiChatToolsReturn } from '@aziontech/ui/use-ai-chat-tools'
```

## `useAiChatTools`

```ts
function useAiChatTools(options: UseAiChatToolsOptions): UseAiChatToolsReturn
```

## `UseAiChatToolsOptions`

What `useAiChatTools` reads and whom it tells.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `turns` | `MaybeRefOrGetter<ReadonlyArray<AiChatMessage>>` | yes | The reader's and the assistant's turns, oldest first. |
| `interrupts` | `MaybeRefOrGetter<ReadonlyArray<AiChatInterrupt>>` | yes | Pending requests, as `useChat` returns `interrupts`. |
| `tools` | `MaybeRefOrGetter<Record<string, AiChatTool>>` | yes | How each tool reads, by tool name. |
| `onAnswerInterrupt` | `(event: Event, interrupt: AiChatInterrupt, value: string) => void` | yes | An unbound question was answered: the app routes the answer. |
| `onAnswerTool` | `(event: Event, answer: AiChatToolAnswer) => void` | yes | An answerable tool was answered: the app calls `addToolResult`. |
| `onApprove` | `(event: MouseEvent, call: AiChatToolCallPart, input?: unknown) => void` | yes | A call was approved, with the edited arguments of an editable tool. |
| `onDeny` | `(event: MouseEvent, call: AiChatToolCallPart) => void` | yes | A call was denied. |

## `UseAiChatToolsReturn`

What `useAiChatTools` returns.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `questions` | `ComputedRef<Record<string, AiChatQuestion[]>>` | yes | The questions to ask, grouped by the id of the turn they follow. |
| `answer` | `(event: Event, question: AiChatQuestion, value: string) => void` | yes | Answers a question: a bound one resolves its interrupt, an unbound one goes to the app. |
| `skip` | `(question: AiChatQuestion) => void` | yes | Skips a question. |
| `askOf` | `(call: AiChatToolCallPart) => AiChatQuestion` | yes | The question an answerable tool call asks, with its status. |
| `answerTool` | `(event: Event, call: AiChatToolCallPart, value: string) => void` | yes | Answers an answerable tool call. |
| `editOf` | `(call: AiChatToolCallPart) => string` | yes | The arguments of a call as the reader edited them, as JSON. |
| `setEdit` | `(call: AiChatToolCallPart, text: string) => void` | yes | Keeps the reader's edit of a call's arguments. |
| `approve` | `(event: MouseEvent, call: AiChatToolCallPart, text: string) => void` | yes | Approves a call and resolves its interrupt. |
| `deny` | `(event: MouseEvent, call: AiChatToolCallPart) => void` | yes | Denies a call and resolves its interrupt. |
| `reset` | `() => void` | yes | Forgets every answer and edit, for a new chat. |
