# Rule: one prop name, one type, one value set per concept

The same concept ships under the **same prop name, type, value set and default** on every
component — in webkit and in the components you author in this project. When one component
calls it `variant` and another `kind`, or one says `state` and another `status`, everyone
relearns the API per component and AI-generated code guesses wrong. On WebKit tags the
ESLint rule **`webkit/no-deprecated-name`** flags a prop or value renamed in 6.0 and names
its replacement; in your own components the vocabulary is held in review. The adjacent
authoring shape _is_ enforced: `webkit/require-authoring-standards` blocks a manual `modelValue` prop

- `update:modelValue` emit — use `defineModel` / `v-model` instead.

## The dictionary

| Concept                              | Canonical prop                                                              | Type                                                            | Banned aliases                                                                                                                                                                     |
| ------------------------------------ | --------------------------------------------------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The look                             | `variant`                                                                   | component string union                                          | `kind`, `appearance`, `intent`, `look`                                                                                                                                             |
| The sort of part (cell, page button) | `type`                                                                      | component string union                                          | `kind`                                                                                                                                                                             |
| Colour meaning                       | `severity`                                                                  | `neutral · info · success · warning · danger`                   | `tone`                                                                                                                                                                             |
| How a job or step is going           | `status`                                                                    | `pending · running · success · error · canceled · skipped`      | `state`, `phase`, `outcome`                                                                                                                                                        |
| Size                                 | `size`                                                                      | `'small' \| 'medium' \| 'large'` (this order; a subset is fine) | `xs`/`sm`/`md`/`lg`/`xl`, reordered unions                                                                                                                                         |
| Light-dismiss (outside-click / Esc)  | `dismissible`                                                               | `boolean`                                                       | `dismissable`, `closeable`                                                                                                                                                         |
| Explicit close affordance (X button) | `closable`                                                                  | `boolean`, `true` on `Dialog` and `Drawer`                      | — (a different concept from `dismissible`)                                                                                                                                         |
| Primary heading text                 | `title`                                                                     | `string`                                                        | `heading`, `header`, `headline` (as a prop)                                                                                                                                        |
| Header text of a group part          | `label`                                                                     | `string`                                                        | `title`, `heading`, `header` on a `*Group`                                                                                                                                         |
| Primary two-way value                | `modelValue` (default `v-model`)                                            | per component                                                   | `isToggled`; `v-model:value`                                                                                                                                                       |
| Anything that opens                  | `open` (`v-model:open`), seed `defaultOpen`                                 | `boolean`                                                       | `expanded`, `visible`, `show`, `opened`                                                                                                                                            |
| Ids of the parts that are open       | `openKeys` (`v-model:openKeys`)                                             | `string[]`                                                      | `expandedKeys`, `expandedIds`                                                                                                                                                      |
| The page or item you are on          | `active` (renders `aria-current`)                                           | `boolean`                                                       | `current`, `activated`                                                                                                                                                             |
| Picked items                         | `selectedKey` (one id) / `selectedKeys` (ids); `selected` is a boolean flag | `string` / `string[]`                                           | `selectedIds`, `selectedValues`, `checkedKeys`, `rowSelection`                                                                                                                     |
| The item you are on, by id           | `activeKey`                                                                 | `string \| null`                                                | `activeId`                                                                                                                                                                         |
| Current page                         | `page` (1-based, `v-model:page`) + `pageSize`                               | `number`                                                        | `pagination`, `pageIndex`, `currentPage`                                                                                                                                           |
| Disabled                             | `disabled`                                                                  | `boolean`                                                       | `isDisabled`, `enabled`                                                                                                                                                            |
| Loading                              | `loading`                                                                   | `boolean`                                                       | `isLoading`                                                                                                                                                                        |
| Leading/trailing glyph               | `icon` (+ `iconPosition: 'leading' \| 'trailing'`)                          | `string` (icon name)                                            | `iconName`, `leadingIcon`, `trailingIcon`                                                                                                                                          |
| Validation state                     | `invalid`                                                                   | `boolean`                                                       | `hasError` / `error` as a flag (an `error` message string is fine)                                                                                                                 |
| Read-only                            | `readonly`                                                                  | `boolean`                                                       | `readOnly`, `isReadonly`                                                                                                                                                           |
| Outline around the box               | `bordered`                                                                  | `boolean`                                                       | `border`, `hasBorder`                                                                                                                                                              |
| Copy affordance                      | `copyable`                                                                  | `boolean`                                                       | `showCopy`                                                                                                                                                                         |
| Self-advancing media                 | `autoplay` (+ `autoplayInterval`, ms)                                       | `boolean`                                                       | `autoPlay`, `autoPlayInterval`, `interval`                                                                                                                                         |
| Motion on / off                      | `animated`                                                                  | `boolean`                                                       | `still`                                                                                                                                                                            |
| Short label above a heading          | `eyebrow`                                                                   | `string`                                                        | `overline`, `kicker`, `tagline`                                                                                                                                                    |
| Text of a link or call-to-action     | `linkLabel` (`actionLabel` for a button)                                    | `string`                                                        | `link` / `cta` as the text                                                                                                                                                         |
| Grid columns                         | `columns` (+ `mobileColumns` below `md`)                                    | number union                                                    | `cols`, `mobileCols`                                                                                                                                                               |
| Choices the user picks from          | `options` (`items` for displayed lists, `data` + `columns` for tables)      | array                                                           | `model`, `choices`                                                                                                                                                                 |
| Identity key                         | `itemKey` (lists), `rowKey` (tables)                                        | `string`                                                        | `trackBy`, `dataKey`, `keyField`                                                                                                                                                   |
| Empty-state text                     | `emptyTitle`, `emptyDescription`, `emptyActionLabel`                        | `string`                                                        | `emptyText`, `emptyMessage`, `noResultsText`, `empty`                                                                                                                              |
| Calls to action                      | `primaryAction`, `secondaryAction`                                          | one shared action type                                          | `primaryCta`, `mainAction`, `primaryButton`                                                                                                                                        |
| Heading level of a rendered title    | `headingLevel`                                                              | `1 … 6`                                                         | `titleLevel`, `headingTag`                                                                                                                                                         |
| Where a link opens                   | `target`                                                                    | `string`                                                        | `external`, `newTab`, `openInNewTab`                                                                                                                                               |
| More than one may be picked          | `multiple`                                                                  | `boolean`                                                       | `multi`                                                                                                                                                                            |
| In-page anchor id                    | `anchor`                                                                    | `string`                                                        | `anchorId`, `sectionId`, `hash`                                                                                                                                                    |
| Accessible name                      | `ariaLabel` (+ prefixed `xAriaLabel`)                                       | `string`                                                        | `aria-label` as a prop                                                                                                                                                             |
| Boolean (any)                        | no `is`/`has` prefix; **positive polarity**                                 | `boolean`                                                       | `isX`, `hasX`, `hideX` (→ `showX`), `enableX` (→ the `-able` adjective); negatives `hidden`, `collapsed`, `closed`, `inactive` (`disabled`/`readonly` are the accepted exceptions) |
| Value change signal                  | `v-model` / `update:<x>` only                                               | —                                                               | a `<x>-change` event that echoes `update:<x>`; a distinct commit (commit-on-blur) is a bare `change`                                                                               |

## Shared values

| Idea                                  | Values                                                                     | Banned values                                                                       |
| ------------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| The look (`variant`)                  | `primary · secondary · outline · ghost · danger · link`                    | `outlined`, `transparent`, `text`, `destructive`, `error`                           |
| Colour meaning (`severity`)           | `neutral · info · success · warning · danger`                              | `error`, `destructive`, `default`, `secondary`                                      |
| Job status (`status`)                 | `pending · running · success · error · canceled · skipped` (+ `streaming`) | `done`, `ok`, `complete`, `completed`, `succeeded`, `failed`, `cancelled`, `queued` |
| Position in a control (`*Position`)   | `leading · trailing`                                                       | `left`, `right`, `start`, `end`, `prefix`, `suffix`                                 |
| Sides and alignment (`side`, `align`) | `start · center · end`                                                     | `left`, `right`; `top`/`bottom` for alignment; `centered`                           |
| Selection mode                        | `none · single · multiple`                                                 | `multi`                                                                             |
| Size                                  | `small · medium · large` (`tiny` / `xlarge` only for a 4th step)           | `xs`, `sm`, `md`, `lg`, `xl`                                                        |

The look, colour meaning, job status, orientation (`horizontal · vertical`) and size are
**closed sets**: a union holds only these values plus the few extras a component documents
(an avatar's `circle · square`, a field's `responsive` orientation). A `variant` made only of
`start · center · split` is `align`. A severity type derives from WebKit's `Severity`.

Code ported from shadcn maps `destructive` → `danger`; from Material, `outlined` → `outline`
and `text` → `ghost`.

## Slots, events and data attributes

- Adornment slots are `leading` / `trailing`, side slots `start` / `end` — never `prefix`,
  `suffix`, `left`, `right`. Plural content gets a plural slot (`actions`, `breadcrumbs`).
- Event words: `complete` (not `finished` / `done`), `error` (not `failed`), `close` (not
  `dismiss`), `remove` (not `delete`), `double-click` (not `dblclick`).
- Data attributes mirror the prop: `data-variant`, `data-type`, `data-status`,
  `data-bordered`, `data-state="open|closed"` (not `data-open` / `data-expanded`),
  `data-slot="<part>"`.

## Renamed in 6.0

Every prop that drifted from this table was renamed in 6.0. The full old → new map, with value
renames, is `src/cli/migrations/v6-props.json` in the package; `npx @aziontech/webkit migrate`
applies it to your code and `webkit/no-deprecated-name` flags what is left.

**Not banned — legitimate uses:** `type` for native pass-throughs (`<input type>`) and for
the sort of part; `value` for identity, the `v-model` payload or display text; `error` as a
message string; `level` on a heading component; `label` on a group part.

## Do

- Reuse the canonical name whenever a concept already has one — `variant`, `size`,
  `severity`, `status`, `disabled`, `readonly`, `invalid`, `loading`, `icon`, `title`, `open`,
  `active`, `bordered`, `eyebrow`.
- Declare `size` with the shared tokens in canonical order; a subset (`'small' | 'medium'`)
  is fine, a reorder is not. Default `size` to `large` on actions/links, `medium` elsewhere.
- Name booleans positively and unprefixed: `showHeader`, `active`, `open` — not `hideHeader`,
  `isActive`, `collapsed` (`disabled`/`readonly` are the accepted exceptions).
- Use `defineModel` for two-way values; the ESLint rule `webkit/require-authoring-standards` blocks
  the manual `modelValue` + `update:modelValue` pair.
- When migrating code from another design system, rewrite its names to this vocabulary
  (`kind` → `variant`, `sm/md/lg` → `small/medium/large`, `prefix` → `leading`) — never carry
  them over.
- Pass the accessible name as the kebab attribute in templates — `aria-label="Close"`, bound
  `:aria-label="label"` — even though the prop is `ariaLabel`. Declare your own `ariaLabel` prop
  optional with a `''` default: vue-tsc leaves `aria-*` attributes uncamelized, so a required
  `ariaLabel` fails `aria-label="…"` in a create-vue app.

## Do not

- Never introduce a prop whose concept already has a canonical name under a different name.
- Never use `xs`/`sm`/`md`/`lg`/`xl` tokens for `size`, and never reorder the union.
- Never prefix a boolean with `is`/`has`, and never name one negatively.
- Never write `left` / `right` for a position, side or alignment value.
- Never emit a `<x>-change` event alongside `update:<x>` — it is a redundant echo.
- Never name "it opens" `visible`/`show`/`expanded` — it is `open` (`v-model:open`).
- Never confuse `dismissible` (light-dismiss behavior) with `closable` (renders an X button);
  they are two concepts, not two spellings. `closable` defaults to `true` on `Dialog` and
  `Drawer` (the X renders by itself; never add `DialogClose` / `DrawerClose` by hand) and to
  `false` everywhere else.

## Correct

<!-- prettier-ignore -->
```ts
// banner.vue — canonical vocabulary throughout
interface Props {
  variant?: 'outline' | 'ghost'             // the look
  severity?: 'info' | 'warning' | 'danger'  // colour meaning
  status?: 'running' | 'success' | 'error'  // how the job is going
  size?: 'small' | 'medium'                 // subset, canonical order
  iconPosition?: 'leading' | 'trailing'     // flips in right-to-left
  dismissible?: boolean                     // closes on outside-click / Esc
  closable?: boolean                        // shows an explicit X button
  title?: string
  loading?: boolean                         // positive, unprefixed
}
const open = defineModel<boolean>('open')   // anything that opens: open
```

## Wrong

<!-- prettier-ignore -->
```ts
interface Props {
  kind?: 'outlined' | 'transparent'  // ❌ the look is `variant`: outline | ghost
  state?: 'done' | 'failed'          // ❌ a job is `status`: success | error
  size?: 'sm' | 'md' | 'lg'          // ❌ tokens are small / medium / large
  iconPosition?: 'left' | 'right'    // ❌ leading / trailing
  isLoading?: boolean                // ❌ no is/has prefix — `loading`
  hideHeader?: boolean               // ❌ positive — `showHeader`
  closeable?: boolean                // ❌ `dismissible` or `closable`, by concept
  expanded?: boolean                 // ❌ it opens: `open` + v-model:open
}
const emit = defineEmits<{ 'update:value': [string]; 'value-change': [string] }>()
emit('value-change', next)           // ❌ redundant echo of update:value
```
