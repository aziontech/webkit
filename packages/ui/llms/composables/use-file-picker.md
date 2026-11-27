# useFilePicker

Composable `@aziontech/ui/use-file-picker`. The signatures and option tables below are read from its typed source, [`src/composables/use-file-picker/index.ts`](https://github.com/aziontech/webkit/blob/main/packages/ui/src/composables/use-file-picker/index.ts).

```ts
import { useFilePicker } from '@aziontech/ui/use-file-picker'
import type { UseFilePickerOptions, UseFilePickerReturn } from '@aziontech/ui/use-file-picker'
```

## `useFilePicker`

```ts
function useFilePicker(options: UseFilePickerOptions = {}): UseFilePickerReturn
```

## `UseFilePickerOptions`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `accept` | `MaybeRefOrGetter<string>` | no | Comma-separated file filter in the native accept syntax (extensions, MIME types, type wildcards). Empty accepts every file. |
| `multiple` | `MaybeRefOrGetter<boolean>` | no | Lets the person pick more than one file. |
| `directory` | `MaybeRefOrGetter<boolean>` | no | Picks a folder: every file inside it is returned, each with its `webkitRelativePath`. |

## `UseFilePickerReturn`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `open` | `() => Promise<File[]>` | yes | Opens the system file picker; resolves with the chosen files, or an empty list when the person cancels. Call it from a click handler. |
