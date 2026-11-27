# useAnnouncer

Composable `@aziontech/ui/use-announcer`. The signatures and option tables below are read from its typed source, [`src/composables/use-announcer/index.ts`](https://github.com/aziontech/webkit/blob/main/packages/ui/src/composables/use-announcer/index.ts).

```ts
import { useAnnouncer } from '@aziontech/ui/use-announcer'
import type { UseAnnouncerReturn } from '@aziontech/ui/use-announcer'
```

## `useAnnouncer`

```ts
function useAnnouncer(): UseAnnouncerReturn
```

## `UseAnnouncerReturn`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `announce` | `(message: string) => void` | yes | Speaks the message through the page's one polite live region. |
