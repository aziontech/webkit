# Rule: one name per thing — the WebKit naming standard in your app

WebKit names every component, prop, value, slot, event, icon, test id and block with one
standard. Code that uses WebKit reads the same everywhere when you use those words exactly,
and components, composables and handlers you author in this project follow the same shapes,
so a person or an agent never has to guess which of three spellings is the right one.

Old names from before 6.0 do not work: the ESLint rule `webkit/no-deprecated-name` flags
them, and `npx @aziontech/webkit migrate` rewrites them for you.

## Imports and bindings

- The import path is the flat kebab name; the binding and the tag are its PascalCase form.
- A part is used with dot notation on the compound (`Dialog.Header`) or imported on its own
  under its `<root>-<part>` name.

| ✅                                                       | ❌                                                                           |
| -------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `import EmptyState from '@aziontech/webkit/empty-state'` | `import Empty from '@aziontech/webkit/empty-state'` (binding does not match) |
| `<Dialog.Header>`                                        | `<DialogPanelContent>` (not a part name)                                     |

## Props and values

| Idea                              | Write                                                          | Not                                                      |
| --------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------- |
| The look                          | `variant="primary\|secondary\|outline\|ghost\|danger\|link"`   | `kind`, `outlined`, `transparent`, `text`, `destructive` |
| The sort of part                  | `type` (`<Pagination.Button type="next">`)                     | `kind`                                                   |
| Size                              | `size="small\|medium\|large"`                                  | `sm`, `md`, `lg`                                         |
| Colour meaning                    | `severity="neutral\|info\|success\|warning\|danger"`           | `error`, `default`, `secondary`                          |
| How a job or step ended           | `status="pending\|running\|success\|error\|canceled\|skipped"` | `state`, `done`, `failed`, `completed`                   |
| The page you are on               | `active` (renders `aria-current`)                              | `current`                                                |
| Picked items                      | `v-model:selectedKey`, `v-model:selectedKeys` (`string[]`)     | `selectedIds`, `rowSelection`, a string `selected`       |
| Ids of open parts                 | `v-model:openKeys` (`string[]`)                                | `expanded`, `expandedKeys`                               |
| The primary value                 | `v-model`                                                      | `v-model:value`                                          |
| The current page                  | `v-model:page` (from 1) + `v-model:page-size`                  | `v-model:pagination`, `pageIndex`                        |
| Anything that opens               | `open`, `v-model:open`                                         | `expanded`, `visible`, `show`                            |
| Where an icon sits in the control | `icon-position="leading\|trailing"`                            | `left`, `right`                                          |
| Sides and alignment               | `align="start\|center\|end"`, `side="start\|end"`              | `left`, `right`, `top`, `bottom` for alignment           |
| Optional part on or off           | `show-header`, `show-line-numbers`                             | `hide-header`                                            |
| A capability                      | `sortable`, `copyable`, `closable`                             | `sortable`                                               |

The full dictionary is [`webkit-prop-vocabulary.md`](./webkit-prop-vocabulary.md).

## Slots and events

- Adornment slots are `#leading` / `#trailing`; side slots are `#start` / `#end`. Never
  `#prefix`, `#suffix`, `#left`, `#right`.
- Events are kebab-case and use the shared words: `complete`, `error`, `close`, `remove`,
  `item-double-click`. Activation handlers take `(event, item)`.

```vue
<Input v-model="query">
  <template #leading><i class="ai ai-search" aria-hidden="true" /></template>
</Input>
<DataTable :data="rows" @row-click="(event, row) => openRow(row)" />
```

## Icons

Use `ai ai-<name>` with the Lucide-style names the icons package ships (colour icons:
`ai-color ai-<name>`). Brands are spelled out.

| ✅                   | ❌                           |
| -------------------- | ---------------------------- |
| `ai ai-x`            | `ai ai-times`, `pi pi-times` |
| `ai ai-menu`         | `ai ai-bars`                 |
| `ai ai-settings`     | `ai ai-cog`                  |
| `ai ai-chevron-down` | `ai ai-angle-down`           |
| `ai-color ai-openai` | `ai-cor ai-open`             |

## Test ids

A WebKit component's `data-testid` is its own kebab name, with no category: `button`,
`dialog`, `dialog-header`. Inner elements are `<testid>__<part>`. Pass your own
`data-testid` on the tag to override it.

| ✅                             | ❌                                                   |
| ------------------------------ | ---------------------------------------------------- |
| `getByTestId('button')`        | `getByTestId('actions-button')`                      |
| `getByTestId('dialog__close')` | `getByTestId('dialog-close-icon')` (structure guess) |

## Blocks

A block id is `<group>/<block>` with a singular job group (`account`, `ai`, `auth`, `create`,
`dashboard`, `detail`, `edit`, `settings`, `state`, `view`, `shell`, `top-bar`), and a variant
is named after its state: `loading`, `empty`, `error`, `success`, `<subject>-<state>`
(`deploy-error`), or `no-<thing>`.

```bash
npx @aziontech/webkit add create/create-hub#repositories-loading
```

## Naming your own code the same way

- **Components:** kebab file and folder (`invoice-card.vue`), PascalCase name, modifier first
  (`invoice-card`, never `card-invoice`), whole English words (`navigation`, never `nav`).
- **Props, slots, events:** the words above; do not invent a synonym for a concept WebKit
  already names.
- **Composables:** file `use-x.ts` exporting `useX`.
- **Handlers:** `onX` in Vue's DOM casing — `onClick`, `onKeydown`, `onPointerdown` — never
  `handleX`, never `onKeyDown`.
- **Template refs:** `xEl` for one element, `xEls` for a list (`triggerEl`, `rowEls`).
- **Injection keys:** `InvoiceCardInjectionKey = Symbol('InvoiceCard')`.
- **CSS variables:** `--<component>-<part>-<property>` (`--invoice-card-header-gap`).
- **Tokens:** `--primary` with `--primary-foreground`, scale steps `2xs` / `2xl`.
- **Scripts:** `<verb>:<target>` (`build:docs`, `check:types`).

## Do not

- Never use a pre-6.0 name; run `npx @aziontech/webkit migrate` instead of fixing call sites
  by hand.
- Never write `left` / `right` for a position, side or alignment — it breaks in right-to-left.
  The one exception is an edge of a picture that does not mirror (`NetworkMap` `fade` and
  `position`, `Texture` and `ConsoleMockupShell` fades, the `RegistrationFrame` sides and
  corners): those keep `left` / `right` because they name the picture's own edges, not the
  reading direction.
- Never prefix a boolean with `is` / `has`, and never name one negatively.
- Never pass a `pi pi-*` icon class or `ai-cor`.

## Enforcement

- **`webkit/no-deprecated-name`** (ESLint, in the presets `webkit init` installs) flags a
  retired component import, a renamed prop on a WebKit tag and a retired icon class, each with
  its replacement, read from the migration maps WebKit ships.
- **`npx @aziontech/webkit migrate`** rewrites the same names from the same maps.
- Names in the components you author are held in review.
