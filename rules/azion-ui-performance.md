# Rule: import Azion UI for the smallest bundle

Every component is importable in a way that ships only what you render. Choose the narrow path.

## Prefer the tree-shakeable path

Composition components (Table, DropdownMenu, Dialog, and similar) expose two roots:

- The compound path — `@aziontech/ui/table` — attaches every sub-component for dot-notation (`Table.Row`, `Table.Cell`). Convenient, but a bundler keeps all the sub-components even if you only render the root.
- The `-root` path — `@aziontech/ui/table-root` — is the standalone root with nothing attached.

Rules:

- When you render the parts with dot-notation (`<Table.Row>`), import the compound path. It is the form the examples and blocks use.
- When you render only the root, import the `-root` path and bind it as `TableRoot`: it has no dot-notation parts, so `<TableRoot.Row>` is a type error.
- On a bundle-sensitive screen that uses a few parts, import the `-root` path plus each part on its own subpath (`@aziontech/ui/table-row` as `TableRow`) instead of the whole compound.
- Bind every import to the PascalCase of its path (`table-root` is `TableRoot`, `table-row` is `TableRow`).

```ts
// The compound: every part attached for dot-notation
import Table from '@aziontech/ui/table'

// Only the root, nothing attached: smallest
import TableRoot from '@aziontech/ui/table-root'

// One part on its own, still tree-shakeable
import TableRow from '@aziontech/ui/table-row'
```

## Icons: import the font once, use CSS classes

- `@aziontech/icons` is an icon font. Import it once for its side effects (`import '@aziontech/icons'`, near the app entry) and reference icons by their CSS class.
- Do not import a default/namespace binding (`import Icons from '@aziontech/icons'`) — the entry is CSS; a binding is meaningless and usually a mistake.
- The colour logos (`az-color az-<name>`) are not in that entry: each is an inlined SVG, about 85 KB gzip for the whole set. Azion UI's stylesheet (`./azion-ui.css`) compiles only the logos your sources name, so write the full class (`az-color az-react`) in the code. A logo named only in fetched data goes in `@source inline("az-react");` in `azion-ui.css`. Import the whole set (`import '@aziontech/icons/azionicons-color'`) only on a page that shows every logo, and load that page lazily.

## Lazy-load heavy overlays

Dialogs, drawers, and tables are often off-screen at first paint. Load them on demand:

```js
import { defineAsyncComponent } from 'vue'

const Dialog = defineAsyncComponent(() => import('@aziontech/ui/dialog'))
```

This keeps the overlay out of the initial bundle until it is actually opened.
