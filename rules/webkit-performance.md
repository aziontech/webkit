# Rule: import webkit for the smallest bundle

Every component is importable in a way that ships only what you render. Choose the narrow path.

## Prefer the tree-shakeable path

Composition components (Table, DropdownMenu, Dialog, and similar) expose two roots:

- The compound path — `@aziontech/webkit/table` — attaches every sub-component for dot-notation (`Table.Row`, `Table.Cell`). Convenient, but a bundler keeps all the sub-components even if you only render the root.
- The `-root` path — `@aziontech/webkit/table-root` — is the standalone root with nothing attached.

Rules:

- When you render the parts with dot-notation (`<Table.Row>`), import the compound path. It is the form the examples and blocks use.
- When you render only the root, import the `-root` path and bind it as `TableRoot`: it has no dot-notation parts, so `<TableRoot.Row>` is a type error.
- On a bundle-sensitive screen that uses a few parts, import the `-root` path plus each part on its own subpath (`@aziontech/webkit/table-row` as `TableRow`) instead of the whole compound.
- Bind every import to the PascalCase of its path (`table-root` is `TableRoot`, `table-row` is `TableRow`).

```ts
// The compound: every part attached for dot-notation
import Table from '@aziontech/webkit/table'

// Only the root, nothing attached: smallest
import TableRoot from '@aziontech/webkit/table-root'

// One part on its own, still tree-shakeable
import TableRow from '@aziontech/webkit/table-row'
```

## Icons: import the font once, use CSS classes

- `@aziontech/icons` is an icon font. Import it once for its side effects (`import '@aziontech/icons'`, near the app entry) and reference icons by their CSS class.
- Do not import a default/namespace binding (`import Icons from '@aziontech/icons'`) — the entry is CSS; a binding is meaningless and usually a mistake.

## Lazy-load heavy overlays

Dialogs, drawers, and tables are often off-screen at first paint. Load them on demand:

```js
import { defineAsyncComponent } from 'vue'

const Dialog = defineAsyncComponent(() => import('@aziontech/webkit/dialog'))
```

This keeps the overlay out of the initial bundle until it is actually opened.
