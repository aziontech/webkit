# DetailDomainsCard (`detail/detail-domains-card`)

> The domains card of a resource settings tab: a borderless data-driven table of the addresses the resource answers on, each with its environment as the row's one medium rounded tag, its deployment policy as text, its certificate as a verified glyph and text, and a row actions menu, over a footer that counts them and adds one. Rendered in the Domains section of a resource’s Settings tab, where an environment-less domain leaves its Environment and Policy cells empty and the count reads domain or domains. Built from `Card`, `DataTable`, `Tag`, `TableCellActions` and `Button`.

- Surface: app
- Source: `blocks/detail/detail-domains-card/detail-domains-card.vue` in `@aziontech/webkit`
- MCP: `get_block("detail/detail-domains-card")`
- Components: [Alert](../../components/alert.md), [Button](../../components/button.md), [Card](../../components/card.md), [DataTable](../../components/data-table.md), `DropdownMenuGroup`, `DropdownMenuItem`, `TableCellActions`, [Tag](../../components/tag.md)
- Skills: `webkit-tables`

## Asked as

domains section; domains card; domains table; resource domains; domain list in settings; hostnames; seção de domínios; domínios do recurso; lista de domínios; attached resources; related resources table; recursos vinculados

A short list of the things one resource is attached to, shown in place inside its Settings tab. Here they are its domains: the user sees every address the resource answers on, which environment, deployment policy and certificate each one uses, and can edit, delete or add one without leaving the settings page.

## When to use

- Use detail-domains-card inside a section of a resource's Settings tab for a short list of the records it owns; it is a section, not a page.
- A section of a resource's Settings tab lists related records owned by that resource (domains, attached origins, bound certificates) and the list is short enough to read without search or paging.
- Each related record has two to four attributes worth scanning side by side, and one or two row actions.
- The user adds a related record from inside the resource, so the action reads `Add <Module>`.

## When not to use

- The related records are many and need search, filters or columns: use the list of `view/view-table`, scoped to the resource.
- A first-level list of one resource type reached from the sidebar: use `view/view-table`.
- Pairs of keys and values the user types in place: use `edit/edit-variables`.
- Choosing one existing resource inside a form: use `create/create-resource-picker`.

## Building blocks

### A. Container — `Card` (required)

`Card :padded="false"` holds the table and the footer as one surface, so the table runs edge to edge and the footer rule meets the card border. It sits as the body of a `SettingsSection` band of the Settings tab, under that section's heading.

### B. Attached table — `DataTable` (required)

A data-driven `DataTable :bordered="false"` given `:data`, `:columns` and `row-key`, one row per attached record, each cell rendered through a `#cell-<accessorKey>` slot. The first column is `principal` and carries the record's name (the domain). The last column is `type: 'action'` with no header text. No sorting, search or paging: if the list needs them, it is a record table instead.

### C. Environment chip — `Tag` (optional)

One chip per row, following `skills/webkit-tables`: Environment is a `Tag` with `severity="neutral"`, `size="medium"`, `rounded` and the layers glyph. Policy is plain text and Certificate is the verified glyph beside plain text, so the row keeps one chip. A record without an environment leaves its Environment and Policy cells empty instead of printing a placeholder.

### D. Row actions — `TableCellActions`, `DropdownMenuGroup`, `DropdownMenuItem` (required)

`TableCellActions`, named after the record ("Actions for shop.example.com"), opens a menu placed `bottom-end`: Edit in the first group, Delete alone in the last. A record the platform generated (the default domain) has no menu, because it cannot be edited or deleted.

### E. Footer — `Button` (required)

Below a top rule, a muted count on the left ("3 domains") and an outlined medium `Add <Module>` `Button` with a plus icon on the right. The row wraps on narrow cards.

### F. Load failure — `Alert` (optional)

When `error` is set, a danger `Alert` with Retry takes the table's place inside the card; the footer stays.

## Data

The card takes its domains and the request's state through props and emits every action; it fetches nothing. `DomainsCardDomain` and `DomainsCardProps` are exported from `detail-domains-card.vue`, and `sample.ts` holds the sample domains the card renders when `domains` is left out (and never while `loading` or `error` is set).

| Prop      | Type                  | What it does                                                                         |
| --------- | --------------------- | ------------------------------------------------------------------------------------ |
| `domains` | `DomainsCardDomain[]` | The rows and the footer count. Pass `[]` for a resource with none.                   |
| `loading` | `boolean`             | The request is in flight: the table shows its loading state.                         |
| `error`   | `string`              | Why the domains failed to load, shown in a danger `Alert` with Retry over the table. |

| Event        | Payload                      | When                          |
| ------------ | ---------------------------- | ----------------------------- |
| `create`     | `(event)`                    | Add Domain.                   |
| `retry`      | `(event)`                    | Retry in the error alert.     |
| `row-action` | `(event, { value, domain })` | Edit or Delete in a row menu. |

To go live, render the card from the settings section that owns the request:

```vue
<script setup lang="ts">
  import DetailDomainsCard from './detail-domains-card.vue'

  const { data, pending, error, refresh } = useResourceDomains()
  const loadError = "Couldn't load the domains. Check your connection and retry."
</script>

<template>
  <DetailDomainsCard
    :domains="data ?? []"
    :loading="pending"
    :error="error ? loadError : ''"
    @retry="refresh"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Keep the card unpadded and the table borderless, so there is one border around the whole list.
- Keep one chip per row: the Environment `Tag` (secondary, medium, rounded); every other attribute is plain text, with a glyph where it helps.
- Leave a cell empty when the attribute does not apply to that record.
- Hide the row menu on records the user cannot change, rather than showing disabled options.
- Count the records in the footer with the right singular or plural noun.
- Follow `skills/webkit-tables` for column kinds and the action column.

## Don't

- Don't add search, filters or pagination; switch to the `view/view-table` list when the list needs them.
- Don't use a primary or large button for Add; the page's Save belongs to the settings form.
- Don't put Delete in the same group as Edit, or use a destructive color in the menu trigger.
- Don't write a dash or "None" in cells that do not apply.
- Don't wrap the table in a second card or give it its own border.

## Copy

- **Column headers:** short nouns without punctuation, e.g. "Domain", "Environment", "Policy", "Certificate".
- **Add action:** `Add <Module>` with the entity's capitalization, e.g. "Add Domain"; never "Create" inside a resource.
- **Count:** a number and the noun, singular or plural, e.g. "1 domain", "3 domains".
- **Row menu:** single verbs, e.g. "Edit", "Delete"; the trigger tooltip reads "Row actions".
- **Attribute values:** the value as the product names it, e.g. "Production", "Managed".
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- The row menu trigger's `aria-label` names the record, e.g. "Actions for shop.example.com", so a screen reader user knows which row it acts on.
- Menu option icons carry `aria-hidden="true"`; the option label is the accessible name.
- The action column has no visible header; its cells hold only the labeled trigger.
- The menu is reachable by keyboard, opens on Enter or Space and returns focus to its trigger on close.
- The count is plain text, read after the table, before the Add button.

## States

- Default: three domains from `domains`, one generated by the platform with no row menu, two the user added with Edit and Delete, and the footer counting them beside Add Domain; `loading` shows the table's loading state and `error` the danger `Alert` with Retry.

## Related

- `edit/edit-resource` — the Settings tab whose Domains section renders this card.
- `view/view-table` — the full list, with filters and pages, for longer related lists.
- `edit/edit-delete-dialog` — the dialog behind the row menu's Delete.
- `DataTable` — the table this card wraps; see `skills/webkit-tables`.

## Variants

- `Default` — primary (the code below)

Each variant is the same screen in another state: `get_block("detail/detail-domains-card", { variant })`, or the file under `blocks/detail/detail-domains-card/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import type { DropdownMenuItemValue, TableColumn } from '@aziontech/webkit/data-table'
  import DataTable from '@aziontech/webkit/data-table'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import TableCellActions from '@aziontech/webkit/table-cell-actions'
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'

  import { sampleDomains } from './sample'

  /** A domain the resource answers on. */
  export interface DomainsCardDomain {
    /** The row key. */
    id: string
    /** The address, without the scheme. */
    domain: string
    /** The environment it serves, empty when it serves none. */
    environment: string
    /** The deployment policy label. */
    policy: string
    /** The certificate label. */
    certificate: string
    /** Generated by the platform, so it has no row menu. */
    generated: boolean
  }

  export interface DomainsCardProps {
    /** The domains. Pass an empty array for a resource with none. Left out, the sample renders. */
    domains?: DomainsCardDomain[]
    /** The domains request is in flight: the table shows its loading state. */
    loading?: boolean
    /** Why the domains failed to load, shown in a danger alert with Retry in place of the table. */
    error?: string
  }

  const props = withDefaults(defineProps<DomainsCardProps>(), {
    domains: undefined,
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    create: [event: MouseEvent]
    retry: [event: MouseEvent]
    'row-action': [
      event: Event,
      payload: { value: DropdownMenuItemValue; domain: DomainsCardDomain }
    ]
  }>()

  const domains = computed<DomainsCardDomain[]>(
    () => props.domains ?? (props.loading || props.error ? [] : sampleDomains)
  )

  const columns: TableColumn[] = [
    { accessorKey: 'domain', header: 'Domain', principal: true, grow: 2 },
    { accessorKey: 'environment', header: 'Environment' },
    { accessorKey: 'policy', header: 'Policy' },
    { accessorKey: 'certificate', header: 'Certificate' },
    { id: 'actions', type: 'action', hideable: false }
  ]

  const countLabel = computed(
    () => `${domains.value.length} ${domains.value.length === 1 ? 'domain' : 'domains'}`
  )
</script>

<template>
  <Card :padded="false">
    <template #default>
      <div class="flex min-w-0 flex-col">
        <Alert
          v-if="error"
          severity="danger"
          :label="error"
          action-label="Retry"
          @action="(event: MouseEvent) => emit('retry', event)"
        />
        <DataTable
          v-else
          :data="domains"
          :columns="columns"
          row-key="id"
          :bordered="false"
          :loading="loading"
        >
          <template #cell-environment="{ value }">
            <Tag
              v-if="value"
              severity="neutral"
              size="medium"
              rounded
              icon="az az-layers"
              :label="value"
            />
          </template>
          <template #cell-policy="{ row, value }">
            <template v-if="row.environment">{{ value }}</template>
          </template>
          <template #cell-certificate="{ value }">
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <i
                class="az az-verified shrink-0 text-(--text-muted)"
                aria-hidden="true"
              />
              <span class="min-w-0 truncate">{{ value }}</span>
            </span>
          </template>
          <template #cell-actions="{ row }">
            <TableCellActions
              v-if="!row.generated"
              :name="row.domain"
              @select="(event, value) => emit('row-action', event, { value, domain: row })"
            >
              <DropdownMenuGroup>
                <DropdownMenuItem
                  value="edit"
                  label="Edit"
                >
                  <template #leading
                    ><i
                      class="az az-pencil"
                      aria-hidden="true"
                  /></template>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  value="delete"
                  label="Delete"
                >
                  <template #leading
                    ><i
                      class="az az-trash"
                      aria-hidden="true"
                  /></template>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </TableCellActions>
          </template>
        </DataTable>

        <div
          class="flex flex-wrap items-center justify-between gap-(--spacing-xs) border-t border-(--border-muted) px-(--spacing-md) py-(--spacing-sm)"
        >
          <span class="text-body-xs text-(--text-muted)">{{ countLabel }}</span>
          <Button
            type="button"
            label="Add Domain"
            variant="outline"
            size="medium"
            icon="az az-plus"
            @click="(event: MouseEvent) => emit('create', event)"
          />
        </div>
      </div>
    </template>
  </Card>
</template>
```

## `sample.ts`

```ts
import type { DomainsCardDomain } from './detail-domains-card.vue'

export const sampleDomains: DomainsCardDomain[] = [
  {
    id: 'generated',
    domain: 'web-app-7f3a.example.net',
    environment: 'Production',
    policy: 'Single',
    certificate: 'Managed',
    generated: true
  },
  {
    id: 'shop',
    domain: 'shop.example.com',
    environment: 'Production',
    policy: 'Single',
    certificate: 'Managed',
    generated: false
  },
  {
    id: 'preview',
    domain: 'preview.example.com',
    environment: 'Stage',
    policy: 'Versioned',
    certificate: '*.example.com',
    generated: false
  }
]
```
