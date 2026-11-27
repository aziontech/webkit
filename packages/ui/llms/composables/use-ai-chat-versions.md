# useAiChatVersions

Composable `@aziontech/ui/use-ai-chat-versions`. The signatures and option tables below are read from its typed source, [`src/composables/use-ai-chat-versions/index.ts`](https://github.com/aziontech/webkit/blob/main/packages/ui/src/composables/use-ai-chat-versions/index.ts).

```ts
import { useAiChatVersions } from '@aziontech/ui/use-ai-chat-versions'
import type { UseAiChatVersionsReturn, AiChatVersions } from '@aziontech/ui/use-ai-chat-versions'
```

## `useAiChatVersions`

```ts
function useAiChatVersions(messages: MaybeRefOrGetter<ReadonlyArray<AiChatMessage>>): UseAiChatVersionsReturn
```

## `UseAiChatVersionsReturn`

What `useAiChatVersions` returns.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `versionsOf` | `(message: AiChatMessage) => AiChatVersions \| null` | yes | The versions of a message, or `null` while it has only one. |
| `fork` | `(message: AiChatMessage) => void` | yes | Keeps the conversation from `message` on as a version before an edit or Try again replaces it. |
| `select` | `(message: AiChatMessage, index: number) => AiChatMessage[] \| null` | yes | Shows another version of `message`; returns the whole conversation to hand to `setMessages`, or `null` when nothing changes. |
| `clear` | `() => void` | yes | Forgets every version, for a new chat. |

## `AiChatVersions`

Where a message stands among its versions.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `count` | `number` | yes | How many versions the message has. |
| `index` | `number` | yes | Zero-based index of the version shown. |
