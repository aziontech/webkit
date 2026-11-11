# AttachedResources (`platform/detail/attached-resources`)

> An attached-resources card in a resource settings tab, here its domains: a borderless data-driven table of the addresses the resource answers on, each with its environment as the row's one medium rounded tag, its deployment policy as text, its certificate as a verified glyph and text, and a row actions menu, over a footer that counts them and adds one. Rendered in the Domains section of a resource’s Settings tab, where an environment-less domain leaves its Environment and Policy cells empty and the count reads domain or domains. Built from `Card`, `TableRoot`, `Tag`, `DropdownMenuRoot`, `IconButton`, `Tooltip` and `Button`.

- Surface: product
- Source: `blocks/platform/detail/attached-resources/attached-resources.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/detail/attached-resources")`
- Components: [Button](../../../components/button.md), [Card](../../../components/card.md), `DropdownMenuGroup`, `DropdownMenuOption`, `DropdownMenuRoot`, `DropdownMenuTrigger`, [IconButton](../../../components/icon-button.md), `TableRoot`, [Tag](../../../components/tag.md), [Tooltip](../../../components/tooltip.md)
- Skills: `webkit-tables`

## Asked as

domains section; domains card; domains table; resource domains; domain list in settings; hostnames; seção de domínios; domínios do recurso; lista de domínios; attached resources; related resources table; recursos vinculados

A short list of the things one resource is attached to, shown in place inside its Settings tab. Here they are its domains: the user sees every address the resource answers on, which environment, deployment policy and certificate each one uses, and can edit, delete or add one without leaving the settings page.

## When to use

- A section of a resource's Settings tab lists related records owned by that resource (domains, attached origins, bound certificates) and the list is short enough to read without search or paging.
- Each related record has two to four attributes worth scanning side by side, and one or two row actions.
- The user adds a related record from inside the resource, so the action reads `Add <Module>`.

## When not to use

- The related records are many and need search, filters or columns: use the records table in `platform/detail/record-table`.
- A first-level list of one resource type reached from the sidebar: use `platform/view/table-view`.
- Pairs of keys and values the user types in place: use `platform/edit/attribute-editor`.
- Choosing one existing resource inside a form: use `platform/create/resource-picker`.

## Building blocks

### A. Container — `Card` (required)

`Card :padded="false"` holds the table and the footer as one surface, so the table runs edge to edge and the footer rule meets the card border. It sits as the body of a `SettingsSection` band of the Settings tab, under that section's heading.

### B. Attached table — `TableRoot` (required)

A data-driven `TableRoot :bordered="false"` given `:data`, `:columns` and `row-key`, one row per attached record, each cell rendered through a `#cell-<accessorKey>` slot. The first column is `principal` and carries the record's name (the domain). The last column is `kind: 'action'` with no header text. No sorting, search or paging: if the list needs them, it is a record table instead.

### C. Environment chip — `Tag` (optional)

One chip per row, following `skills/webkit-tables`: Environment is a `Tag` with `severity="secondary"`, `size="medium"`, `rounded` and the layers glyph. Policy is plain text and Certificate is the verified glyph beside plain text, so the row keeps one chip. A record without an environment leaves its Environment and Policy cells empty instead of printing a placeholder.

### D. Row actions — `DropdownMenuRoot`, `DropdownMenuTrigger`, `Tooltip`, `IconButton`, `DropdownMenuGroup`, `DropdownMenuOption` (required)

An outlined small ellipsis `IconButton`, named by a `Tooltip` and an `aria-label` that includes the record, opens a menu placed `bottom-end`: Edit in the first group, Delete alone in the last. A record the platform generated (the default domain) has no menu, because it cannot be edited or deleted.

### E. Footer — `Button` (required)

Below a top rule, a muted count on the left ("3 domains") and an outlined medium `Add <Module>` `Button` with a plus icon on the right. The row wraps on narrow cards.

## Do

- Keep the card unpadded and the table borderless, so there is one border around the whole list.
- Keep one chip per row: the Environment `Tag` (secondary, medium, rounded); every other attribute is plain text, with a glyph where it helps.
- Leave a cell empty when the attribute does not apply to that record.
- Hide the row menu on records the user cannot change, rather than showing disabled options.
- Count the records in the footer with the right singular or plural noun.
- Follow `skills/webkit-tables` for column kinds and the action column.

## Don't

- Don't add search, filters or pagination; switch to `platform/detail/record-table` when the list needs them.
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

- Default: three domains, one generated by the platform with no row menu, two the user added with Edit and Delete, and the footer counting them beside Add Domain.

## Related

- `platform/edit/edit-resource` — the Settings tab whose Domains section renders this card.
- `platform/detail/record-table` — the full records table for longer related lists.
- `platform/delete/delete-with-confirmation` — the dialog behind the row menu's Delete.
- `TableRoot` — the table this card wraps; see `skills/webkit-tables`.

## Variants

- `Default` — primary (the code below)

Each variant is the same screen in another state: `get_pattern("platform/detail/attached-resources", { variant })`, or the file under `blocks/platform/detail/attached-resources/variants/`.

## Code (`Default`)

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuOption from '@aziontech/webkit/dropdown-menu-option'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import IconButton from '@aziontech/webkit/icon-button'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed } from 'vue'

  const domains = [
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

  const columns = [
    { accessorKey: 'domain', header: 'Domain', principal: true, grow: 2 },
    { accessorKey: 'environment', header: 'Environment' },
    { accessorKey: 'policy', header: 'Policy' },
    { accessorKey: 'certificate', header: 'Certificate' },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  const countLabel = computed(
    () => `${domains.length} ${domains.length === 1 ? 'domain' : 'domains'}`
  )
</script>

<template>
  <Card :padded="false">
    <template #content>
      <div class="flex min-w-0 flex-col">
        <TableRoot
          :data="domains"
          :columns="columns"
          row-key="id"
          :bordered="false"
        >
          <template #cell-environment="{ value }">
            <Tag
              v-if="value"
              severity="secondary"
              size="medium"
              rounded
              icon="ai ai-layers"
              :label="value"
            />
          </template>
          <template #cell-policy="{ row, value }">
            <template v-if="row.environment">{{ value }}</template>
          </template>
          <template #cell-certificate="{ value }">
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <i
                class="pi pi-verified shrink-0 text-(--text-muted)"
                aria-hidden="true"
              />
              <span class="min-w-0 truncate">{{ value }}</span>
            </span>
          </template>
          <template #cell-actions="{ row }">
            <DropdownMenuRoot
              v-if="!row.generated"
              placement="bottom-end"
            >
              <DropdownMenuTrigger>
                <Tooltip text="Row actions">
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="outlined"
                    size="small"
                    :aria-label="`Actions for ${row.domain}`"
                  />
                </Tooltip>
              </DropdownMenuTrigger>
              <DropdownMenuGroup>
                <DropdownMenuOption
                  value="edit"
                  label="Edit"
                >
                  <template #left
                    ><i
                      class="pi pi-pencil"
                      aria-hidden="true"
                  /></template>
                </DropdownMenuOption>
              </DropdownMenuGroup>
              <DropdownMenuGroup>
                <DropdownMenuOption
                  value="delete"
                  label="Delete"
                >
                  <template #left
                    ><i
                      class="pi pi-trash"
                      aria-hidden="true"
                  /></template>
                </DropdownMenuOption>
              </DropdownMenuGroup>
            </DropdownMenuRoot>
          </template>
        </TableRoot>

        <div
          class="flex flex-wrap items-center justify-between gap-(--spacing-xs) border-t border-(--border-muted) px-(--spacing-md) py-(--spacing-sm)"
        >
          <span class="text-body-xs text-(--text-muted)">{{ countLabel }}</span>
          <Button
            type="button"
            label="Add Domain"
            kind="outlined"
            size="medium"
            icon="pi pi-plus"
          />
        </div>
      </div>
    </template>
  </Card>
</template>
```
