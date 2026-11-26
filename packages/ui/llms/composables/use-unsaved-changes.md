# useUnsavedChanges

Composable `@aziontech/webkit/use-unsaved-changes`. The signatures and option tables below are read from its typed source, [`src/composables/use-unsaved-changes/index.ts`](https://github.com/aziontech/webkit/blob/main/packages/webkit/src/composables/use-unsaved-changes/index.ts).

```ts
import { useUnsavedChanges } from '@aziontech/webkit/use-unsaved-changes'
import type { UseUnsavedChangesOptions, UseUnsavedChangesReturn, UnsavedChangesDialogProps } from '@aziontech/webkit/use-unsaved-changes'
```

## `useUnsavedChanges`

```ts
function useUnsavedChanges<T>(source: MaybeRefOrGetter<T>, options: UseUnsavedChangesOptions<T> = {}): UseUnsavedChangesReturn<T>
```

## `UseUnsavedChangesOptions<T>`

Options of `useUnsavedChanges`.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `savable` | `MaybeRefOrGetter<boolean>` | no | Offers Save changes in the leave dialog; needs `onSave`. Defaults to true when `onSave` is set. |
| `onSave` | `() => unknown` | no | Saves the form from the leave dialog. The page leaves when it resolves and the form is clean. |
| `onDiscard` | `(baseline: T) => void` | no | Called by `discard()` with a copy of the baseline when the source is a getter, not a ref. |
| `enabled` | `MaybeRefOrGetter<boolean>` | no | Turns the guards off (for example while a successful save navigates away). |
| `beforeUnload` | `boolean` | no | Asks the browser to confirm a reload or a tab close while dirty. |

## `UseUnsavedChangesReturn<T>`

What `useUnsavedChanges` returns.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `isDirty` | `ComputedRef<boolean>` | yes | True while the source differs from the baseline. |
| `baseline` | `Readonly<Ref<T>>` | yes | The last committed value. |
| `saving` | `Readonly<Ref<boolean>>` | yes | True while `onSave` runs from the leave dialog. |
| `commit` | `(next?: T) => void` | yes | Makes the current value (or `next`) the new baseline, after a save. |
| `discard` | `() => T` | yes | Puts the baseline back into the source and returns a copy of it. |
| `confirmLeave` | `() => Promise<boolean>` | yes | Resolves true when the page may leave: at once when clean, after the dialog when dirty. |
| `savable` | `ComputedRef<boolean>` | yes | Whether Save changes is offered in the dialog. |
| `dialogProps` | `ComputedRef<UnsavedChangesDialogProps>` | yes | `ConfirmDialog` props: open state, built-in title and description. |
| `labels` | `ComputedRef<{ keepEditing: string; discard: string; save: string }>` | yes | Built-in labels for the dialog actions. |
| `keepEditing` | `() => void` | yes | Closes the dialog and stays on the page. |
| `discardAndLeave` | `() => void` | yes | Discards the changes and leaves. |
| `saveAndLeave` | `() => Promise<void>` | yes | Runs `onSave`, then leaves when the form is clean. |

## `UnsavedChangesDialogProps`

Props for `ConfirmDialog`, bound with `v-bind`.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | yes |  |
| `title` | `string` | yes |  |
| `description` | `string` | yes |  |
| `variant` | `'danger' \| 'primary'` | yes |  |
| `loading` | `boolean` | yes |  |
| `onUpdate:open` | `(open: boolean) => void` | yes |  |
