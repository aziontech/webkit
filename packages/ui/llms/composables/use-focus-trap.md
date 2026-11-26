# useFocusTrap

Composable `@aziontech/ui/use-focus-trap`. The signatures and option tables below are read from its typed source, [`src/composables/use-focus-trap/index.ts`](https://github.com/aziontech/webkit/blob/main/packages/ui/src/composables/use-focus-trap/index.ts).

```ts
import { useFocusTrap } from '@aziontech/ui/use-focus-trap'
import type { UseFocusTrapOptions } from '@aziontech/ui/use-focus-trap'
```

## `useFocusTrap`

```ts
function useFocusTrap(containerEl: MaybeRefOrGetter<HTMLElement | null | undefined>, active: MaybeRefOrGetter<boolean>, isTop: MaybeRefOrGetter<boolean> = true, options: UseFocusTrapOptions = {}): void
```

## `UseFocusTrapOptions`

Options of `useFocusTrap`.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `initialFocus` | `'first' \| 'field'` | no | What takes focus when the trap turns on, after an element marked `data-autofocus`: the first tabbable element, or the first form field (falling back to the first tabbable element when there is none). |
