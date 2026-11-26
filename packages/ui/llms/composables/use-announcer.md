# useAnnouncer

Composable `@aziontech/webkit/use-announcer`. The signatures and option tables below are read from its typed source, [`src/composables/use-announcer/index.ts`](https://github.com/aziontech/webkit/blob/main/packages/webkit/src/composables/use-announcer/index.ts).

```ts
import { useAnnouncer } from '@aziontech/webkit/use-announcer'
import type { UseAnnouncerReturn } from '@aziontech/webkit/use-announcer'
```

## `useAnnouncer`

```ts
function useAnnouncer(): UseAnnouncerReturn
```

## `UseAnnouncerReturn`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `announce` | `(message: string) => void` | yes | Speaks the message through the page's one polite live region. |
